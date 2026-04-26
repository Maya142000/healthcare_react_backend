import Joi from "joi";
import { consultationModel } from "./consultationModel.js";
import { prescriptionModel } from "../Prescription/prescriptionModel.js";

export const saveConsultation = async (req, res) => {
    try {
        // console.log("...req.body....",req.body)
        const Schema = Joi.object({
            patientId: Joi.string().required().messages({"any.required": "Patient ID is required", "string.empty": "Patient ID is required" }),
            doctorId: Joi.string().required().messages({"any.required": "Doctor ID is required", "string.empty": "Doctor ID is required"}),
            current_illness: Joi.string().required().messages({"any.required": "Current illness is required", "string.empty": "Current illness is required" }),
            recent_surgery: Joi.string().allow("").messages({"string.base": "Recent surgery must be text"}),
            diabetes: Joi.string().valid("Diabetic", "Non-Diabetic").required().messages({"any.only": "Select Diabetic or Non-Diabetic", "any.required": "Diabetes field is required" }),
            allergies: Joi.string().allow("").messages({"string.base": "Allergies must be text"}),
            others: Joi.string().allow("").messages({"string.base": "Others must be text"}),
            transactionId: Joi.string().required().messages({"any.required": "Transaction ID is required", "string.empty": "Transaction ID is required" }),
            paymentStatus: Joi.string().valid("PENDING", "SUCCESS", "FAILED").required().messages({"any.required": "Payment status is required", "string.empty": "Payment status is required" }),
        })
        
        const { error, value } = Schema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: false, message: error.message, error: "validation Error...!" });
        }

        const consultaion = await consultationModel.create({
            patientId: value.patientId,
            doctorId : value.doctorId, 
            current_illness : value.current_illness,
            recent_surgery : value.recent_surgery,
            diabetes : value.diabetes,
            allergies : value.allergies,
            others : value.others,
            transactionId : value.transactionId,
            paymentStatus : value.paymentStatus || "PENDING",
        })

        if (!consultaion || consultaion.length === 0) {
            return res.status(404).send({ status: false, message: "consultation not saved...!" });
        } else {
            return res.status(200).send({ 
                status: true, 
                message: "Consultation saved successfully", 
                Data: consultaion 
            })
        }
        
    } catch (error) {
        console.log("...error...",error);
        return res.status(500).send({ status: false, message: "Internal server error...!", error: error.message });
    }
}


export const getConsultationById = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).send({ status: false, message: "Please provide consultationId...!" });
        }
        
        const getConsultation = await consultationModel.find({ doctorId : id, isActive : true })
            .populate("patientId", "name age email mobileNo")
            .lean();

        if (!getConsultation || getConsultation.length === 0) {
            return res.status(404).send({
                status: false,
                message: "No consultations found"
            });
        }

        const updatedData = await Promise.all(
            getConsultation.map(async (c) => {
                const prescription = await prescriptionModel.findOne({
                    consultationId: c._id
                }).lean();

                return {
                    ...c,
                    prescription: prescription || null
                };
            })
        );
        if (!updatedData || updatedData.length === 0) {
            return res.status(404).send({ status: false, message: "consultation not fetched...!" });
        } else {
            return res.status(200).send({ 
                status: true, 
                message: "consultation fetched successfully..", 
                Data: updatedData                
            });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal server error...!", error: error.message });
    }
}