import express from "express"
import { googleAuth, Login, LogOut, resetPassword, sendOtp, signup, verifyOtp } from "../controller/auth.controller.js"

let authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",Login)
authRouter.get("/logout",LogOut)
authRouter.post("/send-otp",sendOtp)
authRouter.post("/verify-otp",verifyOtp)
authRouter.post("/reset-password",resetPassword)
authRouter.post("/google-auth",googleAuth)



export default authRouter