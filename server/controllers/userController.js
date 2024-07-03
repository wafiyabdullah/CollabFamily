import User from '../models/user.js';
import Family from "../models/family.js";
import Task from "../models/task.js";
import Bill from "../models/bill.js";
import Notification from '../models/notification.js';
import { createJWT, generateFamilyId } from "../utils/index.js";

export const registerUser = async (req, res) => {
    try {
        // code to register user
        let { username, email, password, role} = req.body; 

        const userExist = await User.findOne ({ email }); // check if user already exists

        const RoleLimited = ["father", "mother", "son", "daughter"]; // define roles 

        // Check if the role is valid
        role = role.toLowerCase(); // convert role to lowercase

        if (!RoleLimited.includes(role)) {
            return res
                .status(400)
                .json({ status: false, message: "Invalid role" });
        }

        if (userExist) {
            return res
                .status(400)
                .json({ status: false, message: "User already exists" });
        }

        const user = await User.create({
            username, 
            email, 
            password, 
            role,
        })

        if(user){
            createJWT(res, user._id);  // create JWT token
            user.password = undefined; // remove password from response

            res.status(201).json(user); // send response
        }else{
            return res
                .status(400) 
                .json({ status: false, message: "Invalid user data" });
        }


    } catch (error) {
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // get email and password from request

        const user = await User.findOne({ email }); // check if user exists
        
        if(!user){
            return res
                .status(400)
                .json({ status: false, message: "User didn't Exist" });
        }

        // Check if the user's role is daughter or son
        if (user.role === 'daughter' || user.role === 'son') {
            // Check if the user belongs to a family
            if (!user.familyId) {
                return res
                    .status(403)
                    .json({ status: false, message: "Your parent needs to add you to a family before you can log in" });
            }
        }
        
        const isMatch = await user.matchPassword(password); // check if password is correct

        if(user && isMatch){
            createJWT(res, user._id); // create JWT token
            user.password = undefined; // remove password from response

            res.status(200).json(user); // send response
        } else {
            return res
                .status(401)
                .json({ status: false, message: "Invalid email or password" });
        }

    } catch (error) {
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
} 

export const logoutUser = async (req, res) => {
    try {
        // code to register user
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
        }); // clear cookie

        res.status(200).json({message: "User logged out successfully"}); // send response

    }
    catch (error) {
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
}

export const updateUserProfile = async (req, res) => { 
    try{
        // code to update user profile
        const {userId} = req.user; // get user id from request
        const {username} = req.body;

        const user = await User.findById(userId); // find user by id

        if(user){
            // Update username, email, and role if provided in the request body
            user.username = username || user.username; // update username

            const updatedUser = await user.save(); // save user

            // Remove password from the response
            updatedUser.password = undefined;

            res.status(201).json({
                status: true,
                message: "Profile update, they may not reflect immediately",
                user: updatedUser,
            })
        }else{
            return res
                .status(404)
                .json({ status: false, message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
        
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
}

export const changeUserPassword = async (req, res) => {
    try{
        // code to change user password
        const {userId} = req.user; // get user id from request
        const { currentPassword, password } = req.body; // get current password and new password from request
        
        const user = await User.findById(userId); // find user by id

        if(user){ 
            const isMatch = await user.matchPassword(currentPassword); // check if current password is correct
            
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ status: false, message: "Invalid current password" });
            }

            if (currentPassword === password) {
                return res
                    .status(400)
                    .json({ status: false, message: "New password cannot be the same as the old password" });
            }

            user.password = password; // update password
            await user.save(); // save user

            user.password = undefined; // remove password from response

            return res.status(201).json({
                status: true,
                message: "Password updated successfully",
            });
        } else {
            return res.status(404).json({ status: false, message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
}

export const registerFamily = async (req, res) => { 
    try{
        const { email, username } = req.body; // get family details from request
        const {userId} = req.user; // get user id from request

        // Find the current user who is adding the family member
        const currentUser = await User.findById(userId);

        // Check if the current user has the role of 'mother' or 'father'
        if (!['mother', 'father'].includes(currentUser.role)) {
            return res
                .status(403)
                .json({ status: false, message: "Only parent can add family members" });
        }

        // check if user already exists
        let userToAdd = await User.findOne ({ email, username }); 

        // If user not found, return error
        if (!userToAdd) {
            return res
                .status(400)
                .json({ status: false, message: "User not exists" });
        }

        // If user is already part of a family, return error
        if (userToAdd.familyId) {
            return res
                .status(400)
                .json({ status: false, message: "User is already part of a family" });
        }

        // Ensure both users are associated with the same familyId
        let family = await Family.findOne({ familyId: currentUser.familyId });

        // If no family exists, create a new family with a unique familyId
        if (!family) {
            const newFamilyId = generateFamilyId(); // Generate unique familyId
            family = await Family.create({ familyId: newFamilyId, familyMembers: [currentUser._id] }); // Create new family
            currentUser.familyId = newFamilyId; // Associate current user with the new familyId
        }

        //Add userToAdd to the family
        family.familyMembers.push(userToAdd._id); // Add userToAdd to the familyMembers array
        userToAdd.familyId = family.familyId; // Associate userToAdd with the familyId

        // Save the updated family and user documents
        await Promise.all([
            currentUser.save(),
            userToAdd.save(),
            family.save()
        ]);

        return res.status(200).json({ status: true, message: "Family member added successfully", familyId: family.familyId });

    } catch (error) {
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
}

export const removeFamilyMember = async (req, res) => {
    try{
        const { userId } = req.user; // get user id from request
        const { id } = req.body; // get the id of the family member to remove

        // Find the current user
        const currentUser = await User.findById(userId);

        // Check if the current user has the role of 'mother' or 'father'
        if (!['mother', 'father'].includes(currentUser.role)) {
            return res.status(403).json({ status: false, message: "Only parent can remove family members" });
        }

        // Ensure the user belongs to a family
        if (!currentUser.familyId) {
            return res.status(400).json({ status: false, message: "User does not belong to a family" });
        }

        // Retrieve the family document
        const family = await Family.findOne({ familyId: currentUser.familyId });

        // Check if the specified member exists in the family
        if (!family.familyMembers.includes(id)) {
            return res.status(400).json({ status: false, message: "Family member not found in your family list" });
        }

       // Remove the specified member from the family's member list
       family.familyMembers = family.familyMembers.filter(memberId => memberId.toString() !== id);

        // Save the updated family document
        await family.save();

        // Find the specified family member
        const familyMember = await User.findById(id);

        // Check if the family member exists
        if (!familyMember) {
            return res.status(404).json({ status: false, message: "Family member not found" });
        }

        // Remove the family ID from the specified family member
        familyMember.familyId = null;


        // Save the specified family member's updated familyId
        await familyMember.save();

        // Delete all tasks created by the family member
        await Task.deleteMany({ created_by: id, familyId: currentUser.familyId });

        // Delete all bills created by the family member
        await Bill.deleteMany({ created_by: id, familyId: currentUser.familyId });
        

        res.status(200).json({ status: true, message: "Family member removed successfully" });

    } catch (error) {
        return res
            .status(400)
            .json({ status: false, message: error.message });
    }
}

export const getFamilyList = async (req, res) => { 
    try {
        const { userId } = req.user; // get user id from request
        const currentUser = await User.findById(userId); // find user by id
        
        // Retrieve the family associated with the current user
        const family = await Family.findOne({ familyId: currentUser.familyId })
                                   .populate('familyMembers', '_id username role email');
        
        // Check if the family exists
        if (!family) {
            return res.status(404).json({ status: false, message: "Family not found" });
        }

        // Extract the family members from the family object
        const familyMembers = family.familyMembers.filter(member => member._id.toString() !== userId);

        // Fetch tasks and bills for the family
        const tasks = await Task.find({familyId: family._id});
        const bills = await Bill.find({familyId: family._id});

        //console.log("Tasks fetched:", tasks);
        //console.log("Bills fetched:", bills);

        // Format the response with necessary fields and additional counts
        const response = familyMembers.map(user => {
            const userIdStr = user._id.toString();
            const userTasks = tasks.filter(task => task.mentioned_user.some(u => u.toString() === userIdStr));
            const userBills = bills.filter(bill => bill.mentioned_user.some(u => u.toString() === userIdStr));

            //console.log(`User: ${user.username}, User Tasks:`, userTasks);
            //console.log(`User: ${user.username}, User Bills:`, userBills);

            const incompleteTasks = userTasks.filter(task => task.status === 'Incomplete').length;
            const completedTasks = userTasks.filter(task => task.status === 'Complete').length;

            const unpaidBills = userBills.filter(bill => bill.status === 'Unpaid').length;
            const paidBills = userBills.filter(bill => bill.status === 'Paid').length;

            //console.log(`User: ${user.username}, Incomplete Tasks: ${incompleteTasks}, Completed Tasks: ${completedTasks}`);
            //console.log(`User: ${user.username}, Unpaid Bills: ${unpaidBills}, Paid Bills: ${paidBills}`);

            return {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                taskCount: userTasks.length,
                billCount: userBills.length,
                incompleteTaskCount: incompleteTasks,
                completeTaskCount: completedTasks,
                unpaidBillCount: unpaidBills,
                paidBillCount: paidBills
            };
        });

        res.status(200).json({ status: true, response }); // send response
    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({ status: false, message: error.message });
    }
}
