import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./router/auth.router.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import UserRouter from "./router/user.route.js"
import postRouter from "./router/post.route.js"
import ConnectRouter from "./router/connection.routes.js"
dotenv.config()
import http from "http"
import { Server } from "socket.io"
import notificationRouter from "./router/notification.routes.js"

const app = express()
let server = http.createServer(app)

export const io = new Server(server, {
    cors: ({
        origin: "http://localhost:5173",
        credentials: true
    })
})
const port = process.env.PORT

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))



app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", UserRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", ConnectRouter)
app.use("/api/notification", notificationRouter)

export const userSocketMap = new Map()
io.on("connection", (socket) => {
   
       socket.on("register", (userId)=>{
          userSocketMap.set(userId, socket.id)
          console.log(userSocketMap);
       })

    socket.on("disconnect", () => {
        
    });
});


server.listen(port, () => {
    connectDb()
    console.log("server", port);
})
