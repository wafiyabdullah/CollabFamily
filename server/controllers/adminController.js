import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}