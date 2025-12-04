import Connected from "../models/connection.model.js"
import User from "../models/user.model.js"
import { io, userSocketMap } from "../index.js"
import Notification from "../models/notification.model.js"
export const sendConnection = async (req, res) => {
    try {
        let { id } = req.params
        let sender = req.userId
        let user = await User.findById(sender)

        if (sender == id) {
            return res.status(400).json({ message: "You can not send request Yourself" })
        }
        if (user.connection.includes(id)) {
            return res.status(400).json({ message: "you are already connected" })
        }

        let existingConnection = await Connected.findOne({
            sender,
            receiver: id,
            status: "pending"
        })

        if (existingConnection) {
            return res.status(400).json({ message: "request already exist" })
        }

        let newRequest = await Connected.create({
            sender,
            receiver: id
        })


        let reciverSocketId = userSocketMap.get(id)
        let senderSocketId = userSocketMap.get(sender)

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("statusUpdate", { updatedUserId: sender, newStatus: "received" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: id, newStatus: "pending" })
        }

        return res.status(200).json(newRequest)


    } catch (error) {
        return res.status(500).json({ message: "connection error" })
    }
}

export const acceptConnection = async (req, res) => {
    try {
        let { connectionId } = req.params
        let userId = req.userId
        let connection = await Connected.findById(connectionId)
        if (!connection) {
            return res.status(400).json({ message: "connection doesnot exist" })
        }

        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }

        connection.status = "accepted"
        let notification = await Notification.create({
            receiver: connection.sender,
            type: "connectionAccepted",
            relatedUser: userId


        })
        await connection.save()
        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connection: connection.sender }
        })
        await User.findByIdAndUpdate(connection.sender, {
            $addToSet: { connection: req.userId }
        });

        let reciverSocketId = userSocketMap.get(connection.receiver._id.toString())
        let senderSocketId = userSocketMap.get(connection.sender._id.toString())

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("statusUpdate", { updatedUserId: connection.sender._id, newStatus: "disconnect" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: req.userId, newStatus: "disconnect" })
        }

        return res.status(200).json({ message: "Connection accepted" })
    } catch (error) {
        return res.status(500).json({ message: "connection accepted error" })
    }
}

export const rejectConnection = async (req, res) => {
    try {
        let { connectionId } = req.params

        let connection = await Connected.findById(connectionId)
            .populate("sender", "firstName lastName profileImage")

        if (!connection) {
            return res.status(400).json({ message: "connection doesnot exist" })
        }

        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }

        connection.status = "rejected"
        await connection.save()


        return res.status(200).json({ message: "Connection rejected" })
    } catch (error) {
        return res.status(500).json({ message: "connection rejected error" })
    }
}

export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;

        // 1. Check if already connected
        const currentUser = await User.findById(currentUserId);

        if (currentUser.connection.includes(targetUserId)) {
            return res.json({ status: "disconnect" });
        }

        // 2. Check pending request
        const pendingRequest = await Connected.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId }
            ]
        });

        if (pendingRequest) {
            if (pendingRequest.status === "pending") {
                if (pendingRequest.sender.toString() === currentUserId.toString()) {
                    return res.json({ status: "pending" });
                } else {
                    return res.json({ status: "received", requestId: pendingRequest._id });
                }
            }


            if (pendingRequest.status === "rejected") {
                return res.json({ status: "connect" });
            }

            if (pendingRequest.status === "accepted") {
                return res.json({ status: "disconnect" });
            }
        }


        // No relation
        return res.json({ status: "connect" });

    } catch (error) {
        return res.status(500).json({ message: "getConnectionStatus error" });
    }
};



export const removeConnection = async (req, res) => {
    try {
        const myId = req.userId;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myId, { $pull: { connection: otherUserId } });
        await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });

        // ❗ MISSING part (main mistake)
        await Connected.findOneAndDelete({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        });
          await Notification.create({
            receiver: otherUserId,
            type: "connectionRemoved",
            relatedUser: myId
        });

        let reciverSocketId = userSocketMap.get(otherUserId)
        let senderSocketId = userSocketMap.get(myId)

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("statusUpdate", { updatedUserId: myId, newStatus: "connect" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: otherUserId, newStatus: "connect" })
        }

        return res.json({ message: "Connection removed successfully" });

    } catch (error) {
        return res.status(500).json({ message: "removeConnection error" })
    }
}


export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const requests = await Connected.find({ receiver: userId, status: "pending" }).populate("sender", "firstName lastName email userName profileImage headline")


        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Server error" })

    }
};

export const getUserConnection = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate(
            "connection",
            "firstName lastName userName profileImage headline connections"
        );

        return res.status(200).json(user.connection);
    } catch (error) {

        return res.status(500).json({ message: "Server error" })

    }
}


