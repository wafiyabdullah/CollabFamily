import express from 'express';
import protectRoute from '../middlewares/authMiddleware.js';
import {
    getDashboard,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get("/", protectRoute, getDashboard);

export default router;