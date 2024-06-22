import jwt from 'jsonwebtoken';
import User from "../models/User.js"

const protectRoute = async (req, res, next) => {
    try{
        let token = req.cookies?.token; //get token from cookie
        
        if(token){
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //verify token

            const resp = await User.findById(decodedToken.userId).select("email"); //get user email from token

            //check if user exists
            req.user = {
                email: resp.email, //get email from token
                userId: decodedToken.userId, //get user id from token
            };

            next();
        }else {
            return res
                .status(401)
                .json({ status: false, message: "Not authorized, try login again." });
        
        }


    } catch (error) {
        console.error(error);

        return res
            .status(401)
            .json({ status:false, message: "Not authorized, try login again." });
    }
}

export default protectRoute;