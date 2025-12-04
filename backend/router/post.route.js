import express from "express";
import { comment, createPost, getPost, like } from "../controller/post.controller.js";
import isAuth from "../middlewares/isAuth.middlewares.js";
import upload from "../middlewares/multer.js";

const postRouter = express.Router();


postRouter.post("/create", isAuth, upload.single("image"), createPost)
postRouter.get("/getpost", isAuth,getPost)
postRouter.get("/like/:id", isAuth,like)
postRouter.post("/comment/:id", isAuth,comment)




export default postRouter