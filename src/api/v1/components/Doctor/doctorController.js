import bcrypt from "bcrypt";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config({ quiet : true })
import { doctorModel } from "./doctorModel.js";
import { signaccessToken, signrefreshToken, passwordMatch } from "../../../../utils/tokens.js";


export const doctorsignUp = async (req, res) => {
    try {
        // console.log("...req.body....",req.body)
        const Schema = Joi.object({
            name: Joi.string().required().messages({"any.required": "Name is required", "string.empty": "Name is required" }),
            email: Joi.string().email().required().messages({"any.required": "Email is required", "string.empty": "Email is required"}),
            password: Joi.string().required().messages({"any.required": "Password is required", "string.empty": "Password is required" }),
            specialty: Joi.string().required().messages({"any.required": "specialty is required", "string.empty": "specialty is required" }),
            mobileNo: Joi.number().required().messages({"any.required": "mobileNo is required", "string.empty": "mobileNo is required" }),
            experience: Joi.number().required().messages({"any.required": "experience is required", "string.empty": "experience is required" }),
            doctor_image: Joi.string().required().messages({"any.required": "photo is required", "string.empty": "photo is required" }),
        })

        const { error, value } = Schema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: false, message: error.message, error: "validation Error...!" });
        }

        const existingdoctor = await doctorModel.findOne({ email: value.email });
        if (existingdoctor) {
            return res.status(200).send({ status: false, message: "This email is already registered.Please log in to continue."})
        }

        const hashedPasword = await bcrypt.hash(value.password, 10)

        const doctor = await doctorModel.create({
            name: value.name,
            email : value.email, 
            password : hashedPasword,
            specialty : value.specialty,
            mobileNo : value.mobileNo,
            experience : value.experience,
            doctor_image : value.doctor_image,
        })
        
        if (!doctor && doctor.length === 0) {
            return res.status(400).send({ status: false, message: "Doctor Not Created...!" })
        } else {
            return res.status(200).send({ status: true, message: "Doctor Created successfully..." })
        }

    } catch (error) {
        console.log("...error...",error)
        return res.status(500).send({ status: false, message: "Internal Server error...!", error: error.message})
    }
}


export const uploaddoctorImage = async ( req, res ) => {
    try {
        // console.log(".......uploaddoctorImage......",req.file)

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' })
        }

        const serverBaseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
        const imageUrl = `${serverBaseUrl}/public/doctorImage/${req.file.filename}`
        if (!imageUrl) {
            return res.status(404).send({ status : false, message : "Image Not Saved" });
        } else {
            return res.status(200).send({ status : true, message : "Image saved Successfully", fileName: req.file.filename, filePath: imageUrl });
        }
        
    } catch (error) {
        console.log(".......error......",error)
        return res.status(500).send({ status : false, message : "Internal Server Error...!", error : error.message });
    }
}


export const doctorlogin = async (req, res) => {
    // console.log("...req.body....",req.body)
    try {

        const Schema = Joi.object({
            email: Joi.string().email().required().messages({ "any.required": "email is required", "string.empty": "email is required" }),
            password: Joi.string().required().messages({ "any.required": "Password is required", "string.empty": "Password is required" }),
        })

        const { error, value } = Schema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: false, message: error.message, error: "validation Error...!" });
        }

        // console.log("...value....",value)
        // console.log("...value.email....",value.email)
        const finddoctor = await doctorModel.findOne({ email: value.email, Role: "DOCTOR" }).exec();
        // console.log("...finddoctor....",finddoctor)
        if (!finddoctor) {
            return res.status(404).send({ status: false, message: "Oops! We couldn't find your account, Please register first."})
        }

        const matchPassword = await passwordMatch(value.password, finddoctor.password);
        if (!matchPassword) {
            return res.status(401).send({ status: false, message: "Oops..!, Wrong Password."})
        }
        
        const accessToken = await signaccessToken({
            id: finddoctor._id,
            email: finddoctor.email,
        })
        
        const refreshToken = await signrefreshToken({
            id: finddoctor._id,
            email: finddoctor.email,
        })

        return res.status(200).send({ 
            status: true, 
            message: "Welcome, You have Logged'In Successfuly...",
            id: finddoctor._id,
            token: accessToken,
            refreshToken: refreshToken,
        })

    } catch (error) {
        console.log("...error...",error)
        return res.status(500).send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const getAllDoctors = async ( req, res ) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = ( page - 1 ) * limit;

        const totalCount = await doctorModel.countDocuments();
        const getAllDoctors = await doctorModel.find({ isActive : true })
            .sort({ createdAt : - 1})
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(200).send({
            status: true, 
            message: "Doctors fetched Successfully.", 
            Data: getAllDoctors,
            totalCount: totalCount, 
            currentPage : page, 
            totalPages: Math.ceil( totalCount / limit ) 
        })
        
    } catch (error) {
        console.log(".......error......",error)
        return res.send({ status : false, message : "Internal Server Error...!", error : error.message });
    }
}


export const getDoctorById = async ( req, res ) => {
    try {

        const id = req.params.id
        if (!id) {
            return res.status(400).send({ status: false, message: "Please provide doctorId...!" });
        }

        const getdoctor = await doctorModel.findById({ _id : id })
        if (!getdoctor || getdoctor.length === 0) {
            return res.status(404).send({ status: false, message: "Doctor not fetched...!" });
        } else {
            return res.status(200).send({ 
                status: true, 
                message: "Doctor fetched successfully..", 
                Data: {
                    _id: getdoctor._id,
                    name: getdoctor.name,
                    specialty: getdoctor.specialty,
                    mobileNo: getdoctor.mobileNo,
                    email: getdoctor.email,
                    experience: getdoctor.experience,
                    doctor_image: getdoctor.doctor_image,
                } 
            });
        }

    } catch (error) {
        console.log("...error...",error)
        return res.status(500).send({ status: false, message: "Internal server error...!", error: error.message });
    }
}