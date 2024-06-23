import express from 'express';
import protectRoute from '../middlewares/authMiddleware.js';
import { 
    getNotifications 
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/adminNotifications', protectRoute, getNotifications);

export default router;