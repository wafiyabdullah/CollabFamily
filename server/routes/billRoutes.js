import express from 'express';
import protectRoute from '../middlewares/authMiddleware.js';
import{
    createBill,
    getBill,
    deleteBill,
    updateBill,
    billPaid,
    getBillID
} from '../controllers/billController.js';

const router = express.Router();

router.post("/create", protectRoute, createBill);

router.get("/", protectRoute, getBill);

router.delete("/delete/:id", protectRoute, deleteBill);

router.put("/update/:id", protectRoute, updateBill);

router.put("/bill-paid/:id", protectRoute, billPaid);

router.get("/getBillID/:id", protectRoute, getBillID)

export default router;