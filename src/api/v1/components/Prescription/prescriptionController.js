import Joi from "joi";
import { prescriptionModel } from "./prescriptionModel.js";
import { consultationModel } from "../Consultation/consultationModel.js";
import { patientModel } from "../Patient/patientModel.js";
import { sendPrescriptionEmailToPatient } from "../../../../utils/patientEmail.js";
import { generatePrescriptionPDF } from "../../../../utils/generatePrescriptionPDF.js";
import { doctorModel } from "../Doctor/doctorModel.js";


export const addPrescription = async (req, res) => {
    try {
        // console.log("...req.body....",req.body)
        const Schema = Joi.object({
            consultationId: Joi.string().required().messages({"any.required": "Consultation ID is required", "string.empty": "Consultation ID is required" }),
            patientId: Joi.string().required().messages({"any.required": "Patient ID is required", "string.empty": "Patient ID is required"}),
            care: Joi.string().required().messages({"any.required": " Care is required", "string.empty": " Care is required" }),
            medicines: Joi.array().optional().messages({"any.required": " Medicine is required", "string.empty": " Medicine is required" }),
        })
        
        const { error, value } = Schema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: false, message: error.message, error: "validation Error...!" });
        }

        const consultation  = await consultationModel.findOne({ _id : value.consultationId });
        if (!consultation ) {
            return res.status(400).send({ status: false, message: "Consultation not found"});
        }

        const doctor = await doctorModel.findById({ _id : consultation.doctorId})
        const patient = await patientModel.findById({ _id : value.patientId})
        console.log("...doctor...",doctor)
        console.log("...consultation...",consultation)

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const pdfUrl = await generatePrescriptionPDF({
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            patientName: patient.name,
            patientAge: patient.age,
            patientPhone: patient.mobileNo,
            patientEmail: patient.email,
            illnessHistory: consultation.current_illness,
            diabetes: consultation.diabetes,
            allergies: consultation.allergies,
            others: consultation.others,
            care : value.care,
            medicines : value.care,
            baseUrl: baseUrl,
        });

        const prescription = await prescriptionModel.create({
            consultationId: value.consultationId,
            patientId : value.patientId, 
            care : value.care,
            medicines : value.medicines,
            pdfUrl
        })


        if (!prescription || prescription.length === 0) {
            return res.status(404).send({ status: false, message: "prescription not saved...!" });
        } else {
            return res.status(200).send({ 
                status: true, 
                message: "prescription saved successfully", 
                Data: prescription 
            })
        }
    } catch (error) {
        console.log("...error...",error);
        return res.status(500).send({ status: false, message: "Internal server error...", error: error.message });
    }
}


export const updatePrescription = async (req, res) => {
    try {

        // const { consultationId, patientId, care, medicines } = req.body;
        const Schema = Joi.object({
            consultationId: Joi.string().required().messages({"any.required": "Consultation ID is required", "string.empty": "Consultation ID is required" }),
            patientId: Joi.string().required().messages({"any.required": "Patient ID is required", "string.empty": "Patient ID is required"}),
            care: Joi.string().required().messages({"any.required": " Care is required", "string.empty": " Care is required" }),
            medicines: Joi.array().optional().messages({"any.required": " Medicine is required", "string.empty": " Medicine is required" }),
        })
        
        const { error, value } = Schema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: false, message: error.message, error: "validation Error...!" });
        }

        const consultation = await consultationModel.findById({ _id : value.consultationId})
        const doctor = await doctorModel.findById({ _id : consultation.doctorId})
        const patient = await patientModel.findById({ _id : value.patientId})
        console.log("...doctor...",doctor)
        console.log("...consultation...",consultation)

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const pdfUrl = await generatePrescriptionPDF({
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            patientName: patient.name,
            patientAge: patient.age,
            patientPhone: patient.mobileNo,
            patientEmail: patient.email,
            illnessHistory: consultation.current_illness,
            diabetes: consultation.diabetes,
            allergies: consultation.allergies,
            others: consultation.others,
            care : value.care,
            medicines : value.care,
            baseUrl: baseUrl,
        });
        console.log("..pdfUrl..",pdfUrl)

        const updatedPrescription = await prescriptionModel.findOneAndUpdate(
            { consultationId : value.consultationId },
            { $set : {
                patientId : value.patientId,
                care : value.care,
                medicines : value.medicines,
                pdfUrl : pdfUrl
            }},
            { new : true }
        )

        if (!updatedPrescription || updatedPrescription.length === 0) {
            return res.status(404).send({ status: false, message: "prescription not updated...!" });
        } else {
            return res.status(200).send({ 
                status: true, 
                message: "prescription updated successfully", 
                Data: updatedPrescription 
            })
        }

    } catch (error) {
        console.log("...error...",error);
        return res.status(500).send({ status: false, message: "Internal server error...", error: error.message });
    }
}


export const sendPrescriptionToPatient = async (req, res) => {
    try {

        const { consultationId, patientId } = req.body;
        if (!patientId._id) {
            return res.status(400).send({ status: false, message: "Please provide patientId"})
        }
        
        const findPatient  = await patientModel.findOne({ _id : patientId._id });
        if (!findPatient ) {
            return res.status(400).send({ status: false, message: "Patient not found"});
        }

        const findPrescription  = await prescriptionModel.findOne({ consultationId : consultationId });
        if (!findPrescription ) {
            return res.status(400).send({ status: false, message: "Consultation not found"});
        }

        const payload = {
            to: findPatient.email,
            patientName: findPatient.name,
            care: findPrescription.care,
            medicines: findPrescription.medicines,
            pdfUrl: findPrescription.pdfUrl
        }

        const sendMail = await sendPrescriptionEmailToPatient(payload)
        
        return res.status(200).send({ status: true, message: "Prescription sent to patient successfully" });
        
    } catch (error) {
        console.log("...error...",error);
        return res.status(500).send({ status: false, message: "Internal server error...", error: error.message });
    }
}