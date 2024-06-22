import express from 'express';
import protectRoute from '../middlewares/authMiddleware.js';
import {
    createTask,
    getTask,
    deleteTask,
    updateTask,
    taskComplete,
    getTaskID
} from '../controllers/taskController.js';

const router = express.Router();

router.post("/create", protectRoute, createTask);

router.get("/", protectRoute, getTask);

router.delete("/delete/:id", protectRoute, deleteTask);

router.put("/update/:id", protectRoute, updateTask);

router.put("/task-done/:id", protectRoute, taskComplete);

router.get("/getTaskID/:id", protectRoute, getTaskID)

export default router;