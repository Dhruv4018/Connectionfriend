import express from "express"
import isAuth from "../middlewares/isAuth.middlewares.js"
import { ClearNotifications, deleteNotifications, getNotifications } from "../controller/notification.controller.js"

let notificationRouter = express.Router()

notificationRouter.get("/get", isAuth, getNotifications)
notificationRouter.delete("/deleteone/:id", isAuth, deleteNotifications)
notificationRouter.delete("/", isAuth, ClearNotifications)

export default notificationRouter