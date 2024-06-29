import Task from '../models/task.js';
import User from '../models/user.js';
import Bill from '../models/bill.js';
import Family from "../models/family.js";

// Function to get the month name
const getMonthName = (index) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[index];
}

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.user; // get user id from request

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

    // Total complete task count
    const totalTaskCount = await Task.countDocuments({
      familyId: family._id,
      status: "Complete",
    });

    // Total due task count
    const totalDueTaskCount = await Task.countDocuments({
      familyId: family._id,
      status: "Incomplete",
    });

    // Total of outstanding bill amount
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

    // Total due bill count
    const totalDueBillCount = await Bill.countDocuments({
      familyId: family._id,
      status: "Unpaid",
    });

    // Total priority task count
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
    // Total priority bill count
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

    const totalPriority = [
      {
        name: "High",
        task: totalHighPriorityTaskCount,
        bill: totalHighPriorityBillCount,
      },
      {
        name: "Medium",
        task: totalMediumPriorityTaskCount,
        bill: totalMediumPriorityBillCount,
      },
      {
        name: "Low",
        task: totalLowPriorityTaskCount,
        bill: totalLowPriorityBillCount,
      }
    ];

    // Total bills for each month of the current year based on due datelines
    const currentYear = new Date().getFullYear();
    const billsPerMonth = await Bill.aggregate([
      {
        $match: {
          familyId: family._id,
          datelines: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$datelines" }, year: { $year: "$datelines" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);

    // Map month numbers to month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Format billsPerMonth to ensure all 12 months are present
    const billsPerMonthFormatted = Array.from({ length: 12 }, (_, i) => {
      const monthData = billsPerMonth.find(item => item._id.month === i + 1);
      return {
        month: monthNames[i],
        amount: monthData ? monthData.totalAmount : 0,
        count: monthData ? monthData.count : 0
      };
    });

    // Recent activity for task and bill in one group limit 5
    const recentActivity = await Promise.all([
      Task.find({ familyId: family._id })
        .limit(5)
        .sort({ createdAt: -1 })
        .populate({
          path: 'created_by',
          select: 'username',
          model: 'User'
        }),

      Bill.find({ familyId: family._id })
        .limit(5)
        .sort({ createdAt: -1 })
        .populate({
          path: 'created_by',
          select: 'username',
          model: 'User'
        }),
    ]);

    // Combine tasks and bills into one array
    let combinedRecentActivity = recentActivity.flat();

    // Sort combined recent activity by createdAt field in descending order
    combinedRecentActivity.sort((a, b) => b.createdAt - a.createdAt);

    // Response
    const response = {
      totalTaskCount,
      totalBillCount: totalBillCount.length > 0 ? totalBillCount[0].totalAmount : 0,
      totalDueTaskCount,
      totalDueBillCount,
      totalPriority,
      totalBillsByMonth: billsPerMonthFormatted,
      recentActivity: combinedRecentActivity,
    };

    // Send response
    res.status(200).json({ status: true, response });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
}
