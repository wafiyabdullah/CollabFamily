import Task from '../models/task.js';
import User from '../models/user.js';
import Bill from '../models/bill.js';
import Family from "../models/family.js";

export const getDashboard = async (req, res) => {
    try{
        const {userId} = req.user; // get user id from request
        
       // find user by id and their family members
       const currentUser = await User.findById(userId); 

       // Check if user is admin
       if (currentUser.role === 'admin') {
        return res.status(403).json({ status: false, message: "Admins do not have access to the dashboard." });
        }
    
       // Ensure the user belongs to a family
       if (!currentUser.familyId) {
            return res.status(400).json({ status: false, message: "User does not belong to a family" });
       }

       // Retrieve the family document to get the family ID
       const family = await Family.findOne({ familyId: currentUser.familyId });

       // Check if the family document exists
       if (!family) {
            return res.status(400).json({ status: false, message: "Family not found" });
       }
        
       // Collect family member IDs including the current user
       const userAndFamilyIds = [userId, ...family.familyMembers];

       //total complete task count
       const totalTaskCount = await Task.countDocuments({ 
            familyId: family._id, 
            status: "Complete",
        });

       //total due task count
       const totalDueTaskCount = await Task.countDocuments({
            familyId: family._id,
            status: "Incomplete",
       })

       //total of outstanding bill amount
       const totalBillCount = await Bill.aggregate([
            { 
                $match: {
                    familyId: family._id,
                    status: "Unpaid"
                }
            },
            { 
                $group: { 
                    _id: null,
                    totalAmount: { $sum: "$amount" } 
                } 
            }
        ]);

       //total due bill count
       const totalDueBillCount = await Bill.countDocuments({
            familyId: family._id,
            status: "Unpaid",
        })

        //total priority task count
        const totalHighPriorityTaskCount = await Task.countDocuments({
            familyId: family._id,
            priority: "High",
        });
        const totalMediumPriorityTaskCount = await Task.countDocuments({
            familyId: family._id,
            priority: "Medium"
        });
        const totalLowPriorityTaskCount = await Task.countDocuments({
            familyId: family._id,
            priority: "Low"
        });
        
        const totalPriorityTask = [
            {
                name: "High",
                total: totalHighPriorityTaskCount,
            },
            {
                name: "Medium",
                total: totalMediumPriorityTaskCount,
            },
            {
                name: "Low",
                total: totalLowPriorityTaskCount,
            }
        ]

        //total priority bill count
        const totalHighPriorityBillCount = await Bill.countDocuments({
            familyId: family._id,
            priority: "High",
        });
        const totalMediumPriorityBillCount = await Bill.countDocuments({
            familyId: family._id,
            priority: "Medium"
        });
        const totalLowPriorityBillCount = await Bill.countDocuments({
            familyId: family._id,
            priority: "Low"
        });

        const totalPriorityBill = [
            {
                name: "High",
                total: totalHighPriorityBillCount,
            },
            {
                name: "Medium",
                total: totalMediumPriorityBillCount,
            },
            {
                name: "Low",
                total: totalLowPriorityBillCount,
            }
        ]

        //recent activity for task and bill in one group limit 5
        const recentActivity = await Promise.all([
            Task.find({ familyId: family._id })
            .limit(5)
            .sort({createdAt: -1})
            .populate({
                path: 'created_by',
                select: 'username',
                model: 'User'
            }),
            
            Bill.find({ familyId: family._id })
            .limit(5)
            .sort({createdAt: -1})
            .populate({
                path: 'created_by',
                select: 'username',
                model: 'User'
            }),
        ]);

        // Combine tasks and bills into one array
        let combinedRecentActivity = recentActivity.flat();

        //Sort combined recent activity by createdAt field in descending order
        combinedRecentActivity.sort((a, b) => b.createdAt - a.createdAt);

        //response 
        const response = {
            totalTaskCount,
            totalBillCount: totalBillCount.length > 0 ? totalBillCount[0].totalAmount : 0,
            totalDueTaskCount,
            totalDueBillCount,
            totalPriorityTask,
            totalPriorityBill,
            recentActivity: combinedRecentActivity,
        };

        //sent response
        res.status(200).json({status:true, response})
    }
    catch(error){
        console.log(error)
        return res.status(400).json({status:false, message: error.message})
    }
}

