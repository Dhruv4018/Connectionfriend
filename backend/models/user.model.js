import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
       
    },
    lastName: {
        type: String,
        
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        
    },

    profileImage: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },

    headline: {
        type: String,
        default: ""
    },
    skills: [{ type: String }],
    education: [
        {
            college: { type: String },
            degree: { type: String },
            fieldOfStudy: { type: String }
        }
    ],

    location: {
        type: String,
        default:"India"
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    experience: [
        {
            title: { type: String },
            company: { type: String },
            description: { type: String }
        }
    ],

    connection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    resetOtp:{
        type:String
    },

    isOtpVerified:{
        type:Boolean,
        default:false
    },

    otpExpires:{
        type:Date
    }




}, { timestamps: true })



const User = mongoose.model("User", userSchema)

export default User