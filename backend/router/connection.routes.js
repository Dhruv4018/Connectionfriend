import express from "express"
import { acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnection, rejectConnection, removeConnection, sendConnection } from "../controller/connection.controller.js"
import isAuth from "../middlewares/isAuth.middlewares.js"

const ConnectRouter = express.Router()
ConnectRouter.post("/send/:id", isAuth,sendConnection)
ConnectRouter.put("/accept/:connectionId",isAuth,acceptConnection)
ConnectRouter.put("/reject/:connectionId",isAuth , rejectConnection)
ConnectRouter.get("/getstatus/:userId",isAuth , getConnectionStatus)
ConnectRouter.delete("/remove/:userId",isAuth , removeConnection)
ConnectRouter.get("/",isAuth , getUserConnection)
ConnectRouter.get("/requests",isAuth , getConnectionRequests)
export default ConnectRouter