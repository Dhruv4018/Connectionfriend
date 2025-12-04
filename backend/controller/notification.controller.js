import Notification from "../models/notification.model.js"

export const getNotifications = async (req, res) => {
    try {
        let notification = await Notification.find({ receiver: req.userId })
            .populate("relatedUser", "firstName  lastName profileImage")
            .populate("relatedPost", "image  description")

        return res.status(200).json(notification)

    } catch (error) {
        return res.status(500).json({ message: "getnotification error", error })
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        let { id } = req.params
        await Notification.findOneAndDelete({
            _id: id,
            receiver: req.userId
        })

        return res.status(200).json({ message: "notification deleted successfully" })

    } catch (error) {
        return res.status(500).json({ message: "getnotification delete error", error })
    }
}

export const ClearNotifications = async (req, res) => {
    try {

        await Notification.deleteMany({

            receiver: req.userId
        })

        return res.status(200).json({ message: "notification all deleted successfully" })

    } catch (error) {
        return res.status(500).json({ message: "getnotification all delete error", error })
    }
}