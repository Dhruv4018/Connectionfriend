import { sendMail } from "../config/mail.js"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
    try {
        let { firstName, lastName, userName, email, password } = req.body

        let existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({ message: "already email exits" })
        }
        let existUsername = await User.findOne({ userName })
        if (existUsername) {
            return res.status(400).json({ message: "already userName exits" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "password must be at least 8" })
        }

        let hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashPassword
        })

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(201).json(user)

    } catch (error) {

        return res.status(500).json({ message: "signup error" })

    }
}

export const Login = async (req, res) => {
    try {
        let { email, password } = req.body

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "doesnot  exits exits" })
        }




        const MatchPassword = await bcrypt.compare(password, user.password)

        if (!MatchPassword) {
            return res.status(500).json({ message: "Incorrect password" })
        }

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json(user)

    } catch (error) {

        return res.status(500).json({ message: "Login error" })

    }
}

export const LogOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "LogOut successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Logout error" })

    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User doesnot exist" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false

        await user.save()
        await sendMail(email, otp)

        return res.status(200).json({ message: "Otp send Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `send otp error ${error}` })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })

        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: `In valid/expired otp` })
        }
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined

        await user.save()

        return res.status(200).json({ message: "otp verify successfully" })
    } catch (error) {
        return res.status(500).json({ message: "verifyotp error", error })
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "otp verification required" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false

        await user.save()

        return res.status(200).json({ message: "password reset successfully" })



    } catch (error) {
        return res.status(500).json({ message: "password reset error " })
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { displayName, email, photoURL } = req.body;

        // split name
        const [firstName, ...rest] = (displayName || "").split(" ");
        const lastName = rest.join(" ");

        
        const userName = email.split("@")[0];

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstName: firstName || "",
                lastName: lastName || "",
                userName: userName,
                email: email,
                profileImage: photoURL || "",
            });
        }

        // token create
        let token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: "google error", error });
    }
};