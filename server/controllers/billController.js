import Bill from '../models/bill.js';
import User from '../models/user.js';
import Family from "../models/family.js";
import Notification from '../models/notification.js';

export const createBill = async (req, res) => { 
    try{
        const { title, amount, datelines, priority} = req.body;
        const { userId } = req.user;

        // Retrieve the current user's family members
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Retrieve the family document using the familyId
        const family = await Family.findOne({familyId: currentUser.familyId});
        if (!family) {
            return res.status(404).json({ status: false, message: "Family not found" });
        }
 
        // Collect IDs of all family members
        const familyMemberIds = family.familyMembers.map(member => member.toString());

        const familyMembers = await User.find({ familyId: currentUser.familyId });
        const familyMemberEmails = familyMembers.map(member => member.email);

        //Create a single task for all family members
        const bill = await Bill.create({
                title,
                amount,
                datelines: new Date(datelines).toDateString(),
                priority,
                status: "Unpaid",
                familyId: family._id, // Assign the task to all family members including the current user
                created_by: userId, // Assign the bill to the current user
        });

        // Update all family members to include the created bill
        await User.updateMany(
            { _id: { $in: familyMemberIds } },
            { $push: { bills: bill._id } }
        );

        // Create a notification for all family members if the bill is high priority and unpaid
        if (bill !== null && bill.priority === "High" && bill.status === "Unpaid"){
            
            const NotiBill = await Notification.create({
                type: "Bill",
                typeId: bill._id,
                typeTitle: title,
                typeDatelines: new Date(datelines).toDateString(),
                FamilyId: family._id,
                FamilyMembers: familyMemberIds,
                FamilyEmails: familyMemberEmails,
                status: "Waiting",
                sentAt: '',
                successfulAt: '',
            })
        }

        res.status(200).json({status:true, message: "Bill created", bill})

    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

export const getBill = async (req, res) => {
    try{
        const {userId} = req.user; // get user id from request
        
        // find user by id and their family members
        const currentUser = await User.findById(userId);

        // Ensure the user belongs to a family
        if (!currentUser.familyId) {
            return res.status(400).json({ status: false, message: "User does not belong to a family" });
        }
        
       //Retrieve the family document to get the family ID
       const family = await Family.findOne({familyId: currentUser.familyId});

        // Check if the family document exists
        if (!family) {
            return res.status(400).json({ status: false, message: "Family not found" });
        }
                
       //retrieve all bills that belong to the user and their family members
       const bills = await Bill.find({
            familyId: family._id
        })
            .select("title amount datelines priority status")
            .populate({
                path: "created_by",
                select: "username",
                model: User
            })
            .sort({
                updatedAt: -1
            });

        // Check if there are no bills found
        if (!bills || bills.length === 0) {
            return res.status(404).json({ status: false, message: "No bills found" });
        }

        res.status(200).json({status:true, bills}); // send response
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }

}

export const deleteBill = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;

        // find the bill by id
        const bill = await Bill.findById(id).populate('created_by');

        // check if the bill exist
        if (!bill){
            return res.status(404).json({status:false, message: "Bill not found"})
        }

        const currentUser = await User.findById(userId);

         // Check if the current user is either a parent (father or mother) or the creator of the bill
         const isParentOrCreator = (['father', 'mother'].includes(currentUser.role)) || (bill.created_by._id.toString() === userId);

        // check if the bill was created by the current user
        if (!isParentOrCreator){
            return res.status(401).json({status:false, message: "Parent or creator only can delete bill"})
        }

        // delete the bill
        await Bill.findByIdAndDelete(id);

        // Update related documents (users and family) to remove the bill ID from their arrays
        // Remove bill ID from users
        await User.updateMany(
            { bills: id },
            { $pull: { bills: id } }
        );

        // Remove bill ID from family
        await Family.updateMany(
            { bills: id },
            { $pull: { bills: id } }
        );

        // Update the notification status to 'canceled' if the bill is deleted
        const result = await Notification.findOneAndUpdate(
            { typeId: bill._id, type: 'Bill' },
            { status: 'Canceled' },
            { new: true }
        );

        res.status(200).json({status:true, message: "Bill deleted"})
    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

export const updateBill = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;
        const { title, amount, datelines, priority, status} = req.body;

        // find the bill by id
        const bill = await Bill.findById(id);

        // check if the bill exist
        if (!bill){
            return res.status(404).json({status:false, message: "Bill not found"})
        }

        // check if the bill was created by the user
        if (bill.created_by.toString() !== userId){
            return res.status(401).json({status:false, message: "You are not authorized to update this bill"})
        }

        // update the bill
        await Bill.findByIdAndUpdate(id, {
            title,
            amount,
            status,
            datelines: new Date(datelines).toDateString(),
            priority,
        });

        res.status(200).json({status:true, message: "Bill updated successfully"})
    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

export const billPaid = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;
        const { status } = req.body;

        // Retrieve the current user's family members
        const currentUser = await User.findById(userId).populate('familyId');

        // find the bill by id
        const bill = await Bill.findById(id);
        if (!bill){
            return res.status(404).json({status:false, message: "Bill not found"})
        }

        // check if the bill exist or not created by the user and his family members
        if (bill.created_by.toString() !== userId && (currentUser.familyId)){
            return res.status(403).json({status:false, message: "Unauthorized to complete this task"});
        }

        // update the bill status
        await Bill.findByIdAndUpdate(id, {
            status
        });

        // Update the notification status to 'canceled' if the bill is paid
        const result = await Notification.findOneAndUpdate(
            { typeId: id, type: "Bill" },
            { status: "Canceled" },
            { new: true }
        );

        res.status(200).json({status:true, message: "Bill paid"})

    }
    catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

export const getBillID = async (req, res) => {
    try{
        const { id } = req.params;
        
        const bill = await Bill.findById(id)
            .populate({
                path: "created_by",
                select: "username",
            })
            .populate({
                path: "familyId",
                populate: {
                    path: "familyMembers",
                    select: "username email role",
                }
            })

        if (!bill){
            return res.status(404).json({status:false, message: "Bill not found"})
        }

        res.status(200).json({status:true, bill})

    } catch (error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}