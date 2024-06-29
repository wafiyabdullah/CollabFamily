import express from 'express';
import protectRoute from '../middlewares/authMiddleware.js';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getFamilyList, 
    updateUserProfile, 
    changeUserPassword,
    registerFamily,
    removeFamilyMember,
} from '../controllers/userController.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.put("/register-family", protectRoute, registerFamily);

router.get("/get-family", protectRoute, getFamilyList);

router.put("/profile", protectRoute, updateUserProfile);

router.put("/change-password", protectRoute, changeUserPassword);

router.delete("/remove-family-member", protectRoute, removeFamilyMember);


export default router;