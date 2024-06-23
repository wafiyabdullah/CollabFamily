import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        
        




        const response = {
            notifications,
        };
        res.status(200).json({status:true, response});

    } catch (error) {
        res.status(400).json({ message: error.message });
    }



}