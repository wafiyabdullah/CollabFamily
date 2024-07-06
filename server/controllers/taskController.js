import Task from '../models/task.js';
import User from '../models/user.js';
import Family from "../models/family.js";
import Notification from '../models/notification.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const createTask = async (req, res) => {
    try{
        const { title, datelines, priority, description, mentioned_user} = req.body;
        const { userId } = req.user;

        // Retrieve the current user's family members
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Retrieve the family document using the familyId
        const family = await Family.findOne({familyId: currentUser.familyId} );
        //console.log(family)
        if (!family) {
            return res.status(404).json({ status: false, message: "Family not found" });
        }

        // Collect IDs of all family members    
        const familyMemberIds = family.familyMembers.map(member => member.toString());

        // Validate mentioned users
        const mentionedUserIds = mentioned_user && Array.isArray(mentioned_user) 
            ? mentioned_user.filter(id => familyMemberIds.includes(id))
            : [];

        //retrieve mentioned users email
        const mentionedUser = await User.find({ _id: { $in: mentionedUserIds } });
        const mentionedUserEmails = mentionedUser.map(member => member.email);

        // Create a single task for all family members
        const task = await Task.create({
            title,
            datelines: new Date(datelines).toDateString(),
            priority,
            description,
            status: "Incomplete",
            familyId: family._id, // Assign the task to all family members including the current user
            created_by: userId, // Assign the task to the current user
            mentioned_user: mentionedUserIds,
        });

        // Update all family members to include the created task
        await User.updateMany(
            { _id: { $in: [...new Set([...familyMemberIds, ...mentionedUserIds])] } },
            { $push: { tasks: task._id } }
        );

         // Create a notification for all family members if the task is high priority and incomplete
         if (task !== null && task.priority === "High" && task.status === "Incomplete"){

            const NotiTask = await Notification.create({
                type: "Task",
                typeId: task._id,
                typeTitle: title,
                typeDatelines: new Date(datelines).toDateString(),
                FamilyId: family._id,
                FamilyMembers: mentionedUserIds,
                FamilyEmails: mentionedUserEmails,
                status: "Waiting",
                sentAt: '',
                successfulAt: '',
            })
        }

        if (task !== null && task.status === "Incomplete"){
            const emailList = mentionedUserEmails.join(',');

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: emailList,
                subject: `You have a new ${priority} priority task`,
                text: `You have a new ${priority} priority task: ${title}\n\nDue Date: ${moment(new Date(datelines)).format('MMMM Do YYYY')}`
            }

            transporter.sendMail(mailOptions, async function(error, info){
                if (error){
                    console.log('Error Sending Email', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            })
        }

        res.status(200).json({status:true, message: "Task created", task})
    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }

}

export const getTask = async (req, res) => {
    try{
        const {userId} = req.user; // get user id from request
        
        // find user by id and their family members
        const currentUser = await User.findById(userId);

        // Ensure the user belongs to a family
        if (!currentUser.familyId) {
            return res.status(400).json({ status: false, message: "User does not belong to a family" });
        }

        // Retrieve the family document to get the family ID
        const family = await Family.findOne({familyId: currentUser.familyId});

        // Check if the family document exists
        if (!family) {
            return res.status(400).json({ status: false, message: "Family not found" });
        }

        //return family members username and id
        const familyMembers = await User.find({ familyId: currentUser.familyId }).select("username");

        //retrieve all tasks assigned to the user and their family members
        const tasks = await Task.find({
            familyId: family._id
        })
        .select("title datelines priority status description created_by mentioned_user familyId")
        .populate({
            path: "created_by",
            select: "username",
            model: User
        })
        .populate({
            path: "mentioned_user",
            select: "username",
            model: User
        })
        .sort({
            updatedAt: -1
        })
        
        //check if there are no tasks
        if (!tasks || tasks.length === 0){
            return res.status(200).json({
                status:true, 
                message: "No task found",
                response: {
                    familyMembers,
                }
            });
        }

        res.status(200).json({
            status: true,
            response: {
                familyMembers,
                tasks
            }
        });

    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }

}

export const deleteTask = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;

        // find the task by id
        const task = await Task.findById(id).populate('created_by');

        //console.log(task)

        // check if the task exist
        if (!task){
            return res.status(404).json({status:false, message: "Task not found"})
        }

        const currentUser = await User.findById(userId);
        //console.log(currentUser)

        // Check if the current user is either a parent (father or mother) or the creator of the task
        const isParentOrCreator = (['father', 'mother'].includes(currentUser.role)) || (task.created_by._id.toString() === userId);

        // check if the task was created by the current user
        if (!isParentOrCreator){
            return res.status(401).json({status:false, message: "Parent or creator only can delete task"})
        }


        // delete the task
        await Task.findByIdAndDelete(id);

        // Update related documents (users and family) to remove the task ID from their arrays
        // Remove task ID from users
        await User.updateMany(
            { tasks: id },
            { $pull: { tasks: id } }
        );

        // Remove task ID from family documents
        await Family.updateMany(
            { tasks: id },
            { $pull: { tasks: id } }
        );

        //update status in Notification model to 'Canceled' if the task is deleted
        const result = await Notification.findOneAndUpdate(
            { typeId: task._id, type: 'Task' },
            { status: 'Canceled' },
            { new: true } // This option returns the updated document
        );

        res.status(200).json({status:true, message: "Task deleted"})
    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }

}

export const updateTask = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;
        const { title, datelines, priority, description} = req.body;

        // find the task by id
        const task = await Task.findById(id);
        //console.log(task)

        // check if the task exist
        if (!task){
            return res.status(404).json({status:false, message: "Task not found"})
        }

        // check if the task was created by the current user
        if (task.created_by.toString() !== userId){
            return res.status(401).json({status:false, message: "You are not authorized to update this task"})
        }

        if(task.status == "Complete"){
            return res.status(400).json({status:false, message: "Task already completed"})
        }

        // update the task
        await Task.findByIdAndUpdate(id, {
            title,
            datelines: new Date(datelines).toDateString(),
            priority,
            description,
        });

        //update notification with all update created by the user
        await Notification.findOneAndUpdate( 
            { typeId: task._id, type: 'Task' },
            { typeTitle: title, typeDatelines: new Date(datelines).toDateString(), status: 'Waiting'},
            { new: true } // This option returns the updated document
        )

        //if user update the task from low or medium to high priority and task is incomplete, create a notification email
        if (task.priority !== "High" && priority === "High" && task.status === "Incomplete"){

            const mentionedUser = await User.find({ _id: { $in: task.mentioned_user } });
            const mentionedUserEmails = mentionedUser.map(member => member.email);

            const NotiTask = await Notification.create({
                type: "Task",
                typeId: task._id,
                typeTitle: title,
                typeDatelines: new Date(datelines).toDateString(),
                FamilyId: task.familyId,
                FamilyMembers: task.mentioned_user,
                FamilyEmails: mentionedUserEmails,
                status: "Waiting",
                sentAt: '',
                successfulAt: '',
            })
        }

        //if user update the task from high to low or medium priority and task is incomplete, update the notification status to 'Canceled'
        if (task.priority === "High" && (priority !== "High" && task.status === "Incomplete")){
            await Notification.findOneAndUpdate(
                { typeId: task._id, type: 'Task' },
                { status: 'Canceled' },
                { new: true } // This option returns the updated document
            );
        }

        res.status(200).json({status:true, message: "Task updated successfully"})
    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

export const taskComplete = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;
        const { status } = req.body;

        
        // find the task by id
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        // Check if the current user is in the mentioned users list
        const isMentionedUser = task.mentioned_user.some(user => user.toString() === userId);
        if (!isMentionedUser) {
            return res.status(403).json({ status: false, message: 'Only assigned member can complete this task' });
        }

        // task complete
        await Task.findByIdAndUpdate(id, {
            status
        });

        //update status in Notification model to 'Canceled' if the task is updated
        const result = await Notification.findOneAndUpdate(
            { typeId: task._id, type: 'Task' },
            { status: 'Complete' },
            { new: true } // This option returns the updated document
        );

        res.status(200).json({status:true, message: "Task completed"})

    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

export const getTaskID = async (req, res) => {
    try {
    
    const { id } = req.params;
    //console.log(`Fetching task with ID: ${id}`);

    const task = await Task.findById(id)
            .populate({
                path: 'created_by',
                select: 'username',
            })
            .populate({
                path: "mentioned_user",
                select: "username",
                model: User
            })
            .populate({
                path: 'familyId',
                populate: {
                    path: 'familyMembers',
                    select: 'username email role' // Select fields to be populated
                }
            });

    if (!task) {
        //console.log(`Task not found for ID: ${id}`);
        return res.status(404).json({ status: false, message: "Task not found" });
    }

    //console.log('Task found:', task);
    res.status(200).json({ status: true, task });

    }catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message });
    }
}