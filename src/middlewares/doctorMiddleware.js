import jwt from "jsonwebtoken";
import { doctorModel } from "../api/v1/components/Doctor/doctorModel.js";

export const doctorAuth = (requiredRole = "DOCTOR") => {
    return async (req, res, next) => {
        try {
            console.log("..req.headers.authorization..",req.headers.authorization)
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: false,
                    message: "Access denied. No token provided"
                });
            }

            const token = authHeader.split(" ")[1];
        
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const doctor = await doctorModel.findById(decoded._id).select("-password");
        
            if (!user) {
                return res.send({ status: false, message: "Invalid token or doctor not found." });
            }
        
            if (requiredRole && doctor.role !== requiredRole) {
                return res.send({ status: false, message: "Only Access to Doctor" });
            }
        
            req.doctor = doctor;
            next();
        } catch (error) {
            res.status(401).json({ status: false, message: "Unauthorized", error: error.message });
        }
    };
};