import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        //get token
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({error: "You need to login first!"})
        }

        //decode token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({error: "Unauthorized: Invalid Token"})
        }

        //get user
        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}