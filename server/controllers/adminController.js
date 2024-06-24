import Notification from "../models/notification.js";
import Task from "../models/task.js";
import Bill from "../models/bill.js";
import User from "../models/user.js";
import Family from "../models/family.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        
         // Counting total records for each model
         const usersCount = await User.countDocuments();
         const familiesCount = await Family.countDocuments();
         const tasksCount = await Task.countDocuments();
         const billsCount = await Bill.countDocuments();
 
         const response = {
             notifications,
             statistics: {
                 usersCount,
                 familiesCount,
                 tasksCount,
                 billsCount,
                 notificationsCount: notifications.length,
             },
         };

        res.status(200).json({status:true, response});

    } catch (error) {
        res.status(400).json({ message: error.message });
    }



}