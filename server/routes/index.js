import express from 'express';
import userRoutes from './userRoutes.js';
import taskRoutes from './taskRoutes.js';
import billRoutes from './billRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/user', userRoutes); //api/user/login
router.use('/task', taskRoutes);
router.use('/bill', billRoutes);
router.use('/dashboard', dashboardRoutes);

export default router