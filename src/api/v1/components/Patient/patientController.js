import bcrypt from "bcrypt";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config({ quiet : true })
import { patientModel } from "./patientModel.js";
import { signaccessToken, signrefreshToken, passwordMatch } from "../../../../utils/tokens.js";


export const patientsignUp = async (req, res) => {
    try {
        // console.log("...req.body....",req.body)
        const Schema = Joi.object({
            name: Joi.string().required().messages({"any.required": "Name is required", "string.empty": "Name is required" }),
            age: Joi.number().required().messages({"any.required": "Age is required", "string.empty": "Age is required" }),
            email: Joi.string().email().required().messages({"any.required": "Email is required", "string.empty": "Email is required"}),
            password: Joi.string().required().messages({"any.required": "Password is required", "string.empty": "Password is required" }),
            history_of_surgery: Joi.string().required().messages({"any.required": "history of surgery is required", "string.empty": "history of surgery is required" }),
            mobileNo: Joi.number().required().messages({"any.required": "mobileNo is required", "string.empty": "mobileNo is required" }),
            history_of_illness: Joi.array().required().messages({"any.required": "history of illness of surgery is required", "string.empty": "history of illness is required" }),
            patient_image: Joi.string().required().messages({"any.required": "photo is required", "string.empty": "photo is required" }),
        })

        const { error, value } = Schema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: false, message: error.message, error: "validation Error...!" });
        }

        const existingpatient = await patientModel.findOne({ email: value.email });
        if (existingpatient) {
            return res.status(200).send({ status: false, message: "This email is already registered.Please log in to continue."})
        }

        const hashedPasword = await bcrypt.hash(value.password, 10)

        const patient = await patientModel.create({
            name: value.name,
            age : value.age, 
            email : value.email, 
            password : hashedPasword,
            history_of_surgery : value.history_of_surgery,
            mobileNo : value.mobileNo,
            history_of_illness : value.history_of_illness,
            patient_image : value.patient_image,
        })
        
        if (!patient && patient.length === 0) {
            return res.status(400).send({ status: false, message: "patient Not Created...!" })
        } else {
            return res.status(200).send({ status: true, message: "patient Created successfully..." })
        }

    } catch (error) {
        console.log("...error...",error)
        return res.status(500).send({ status: false, message: "Internal Server error...!", error: error.message})
    }
}


export const uploadpatientImage = async ( req, res ) => {
    try {
        // console.log(".......uploadpatientImage......",req.file)

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' })
        }

        const serverBaseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
        const imageUrl = `${serverBaseUrl}/public/patientImage/${req.file.filename}`
        if (!imageUrl) {
            return res.send({ status : false, message : "Image Not Saved" });
        } else {
            return res.send({ status : true, message : "Image saved Successfully", fileName: req.file.filename, filePath: imageUrl });
        }
        
    } catch (error) {
        console.log(".......error......",error)
        return res.send({ status : false, message : "Internal Server Error...!", error : error.message });
    }
}


export const patientlogin = async (req, res) => {
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

        const findpatient = await patientModel.findOne({ email: value.email, Role: "PATIENT" }).exec();
        // console.log("...findpatient....",findpatient)
        if (!findpatient) {
            return res.status(404).send({ status: false, message: "Oops! We couldn't find your account, Please register first."})
        }

        const matchPassword = await passwordMatch(value.password, findpatient.password);
        if (!matchPassword) {
            return res.status(401).send({ status: false, message: "Oops..!, Wrong Password."})
        }
        
        const accessToken = await signaccessToken({
            id: findpatient._id,
            email: findpatient.email,
        })
        
        const refreshToken = await signrefreshToken({
            id: findpatient._id,
            email: findpatient.email,
        })

        return res.status(200).send({ 
            status: true, 
            message: "Welcome, You have Logged'In Successfuly...",
            id: findpatient._id,
            token: accessToken,
            refreshToken: refreshToken,
        })

    } catch (error) {
        console.log("...error...",error)
        return res.status(500).send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const getPatientById = async ( req, res ) => {
    try {

        const id = req.params.id
        if (!id) {
            return res.status(400).send({ status: false, message: "Please provide doctorId...!" });
        }

        const getPatient = await patientModel.findById({ _id : id })
        if (!getPatient || getPatient.length === 0) {
            return res.status(404).send({ status: false, message: "Patient not fetched...!" });
        } else {
            return res.status(200).send({ 
                status: true, 
                message: "Patient fetched successfully..", 
                Data: {
                    _id: getPatient._id,
                    name: getPatient.name,
                    mobileNo: getPatient.mobileNo,
                    email: getPatient.email,
                    age: getPatient.age,
                    patient_image: getPatient.patient_image,
                } 
            });
        }

    } catch (error) {
        console.log("...error...",error)
        return res.status(500).send({ status: false, message: "Internal server error...!", error: error.message });
    }
}
