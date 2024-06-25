import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {Types} from "mongoose";

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected")

    } catch (error) {
        console.log("DB connection error" + error);
        process.exit(1);
    }
}

export default dbConnection;

export const createJWT = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", 
        sameSite: "strict", // prevent csrf use => strict
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day for cookie to expire
    })
}

export const generateFamilyId = () => {
    return new Types.ObjectId().toHexString(); // Generate a new MongoDB ObjectID
}
