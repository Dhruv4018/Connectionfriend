import express from "express"
import isAuth from "../middlewares/isAuth.middlewares.js"
import { getCurrentUser, getProfile, getSuggestedUser, search, UpdateProfile } from "../controller/user.controller.js"
import upload from "../middlewares/multer.js"

const UserRouter = express.Router()

UserRouter.get("/currentuser", isAuth, getCurrentUser)
UserRouter.get("/getprofile/:userName", isAuth, getProfile)
UserRouter.put("/updateprofile", isAuth,upload.fields([
    {name:"profileImage" , maxCount:1},
    {name:"coverImage" , maxCount:1}
]), UpdateProfile)
UserRouter.get("/search", isAuth, search)
UserRouter.get("/suggestedUsers", isAuth, getSuggestedUser)


export default UserRouter