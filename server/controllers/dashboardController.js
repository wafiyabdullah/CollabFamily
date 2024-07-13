import Task from '../models/task.js';
import User from '../models/user.js';
import Bill from '../models/bill.js';
import Family from "../models/family.js";

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.user; // get user id from request
    const currentUser = await User.findById(userId);

    if (currentUser.role === 'admin') {
      return res.status(403).json({ status: false, message: "Admins do not have access to the dashboard." });
    }

    if (!currentUser.familyId) {
      return res.status(400).json({ status: false, message: "User does not belong to a family" });
    }

    const family = await Family.findOne({ familyId: currentUser.familyId });

    if (!family) {
      return res.status(400).json({ status: false, message: "Family not found" });
    }

    const userAndFamilyIds = [userId, ...family.familyMembers];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Total complete task count for current month
    const totalTaskCount = await Task.countDocuments({
      familyId: family._id,
      status: "Complete",
      datelines: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Total incomplete task count for current month
    const totalDueTaskCount = await Task.countDocuments({
      familyId: family._id,
      status: "Incomplete",
      datelines: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Total outstanding bill amount for current month
    const unpaidBills = await Bill.find({
      familyId: family._id,
      status: "Unpaid",
      datelines: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalDueBillCount = unpaidBills.length;
    const totalBillCount = unpaidBills.reduce((total, bill) => total + bill.amount, 0);

    // Total priority task count for current month
    const highPriorityTasks = await Task.countDocuments({
      familyId: family._id,
      priority: "High",
      datelines: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const mediumPriorityTasks = await Task.countDocuments({
      familyId: family._id,
      priority: "Medium",
      datelines: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const lowPriorityTasks = await Task.countDocuments({
      familyId: family._id,
      priority: "Low",
      datelines: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Total priority bill count for current month
    const highPriorityBills = unpaidBills.filter(bill => bill.priority === "High").length;
    const mediumPriorityBills = unpaidBills.filter(bill => bill.priority === "Medium").length;
    const lowPriorityBills = unpaidBills.filter(bill => bill.priority === "Low").length;

    const totalPriority = [
      {
        name: "High",
        task: highPriorityTasks,
        bill: highPriorityBills,
      },
      {
        name: "Medium",
        task: mediumPriorityTasks,
        bill: mediumPriorityBills,
      },
      {
        name: "Low",
        task: lowPriorityTasks,
        bill: lowPriorityBills,
      }
    ];

    // Recent activity for task and bill in one group limit 5
    const recentActivity = await Promise.all([
      Task.find({ familyId: family._id})
        .sort({ createdAt: -1 })
        .populate({
          path: 'created_by',
          select: 'username',
          model: 'User'
        }),

      Bill.find({ familyId: family._id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'created_by',
          select: 'username',
          model: 'User'
        }),
    ]);

    // Combine tasks and bills into one array
    let combinedRecentActivity = recentActivity.flat();

    // Sort combined recent activity by datelines field in descending order
    combinedRecentActivity.sort((a, b) => b.createdAt - a.createdAt);

    // Get all low, medium, and high priority tasks that deadlines are one day before
    const dueTasks = await Task.find({
      familyId: family._id,
      status: "Incomplete",
      datelines: { $lte: new Date(new Date().setDate(new Date().getDate() + 1)) }
    })
      .populate({
        path: 'mentioned_user',
        select: 'username',
        model: 'User',
      })
      .exec();

    // Get all low, medium, and high priority bills that deadlines are one day before
    const dueBills = await Bill.find({
      familyId: family._id,
      status: "Unpaid",
      datelines: { $lte: new Date(new Date().setDate(new Date().getDate() + 1)) }
    })
      .populate({
        path: 'mentioned_user',
        select: 'username',
        model: 'User',
      })
      .exec();

    // Combine the due tasks and bills and sort by priority
    const combinedDueTasksAndBills = [...dueTasks, ...dueBills].sort((a, b) => a.priority.localeCompare(b.priority));

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

    // Response
    const response = {
      totalTaskCount,
      totalBillCount,
      totalDueTaskCount,
      totalDueBillCount,
      totalPriority,
      totalBillsByMonth: billsPerMonthFormatted,
      recentActivity: combinedRecentActivity,
      NotiTasksAndBills: combinedDueTasksAndBills,
    };

    // Send response
    res.status(200).json({ status: true, response });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
}
