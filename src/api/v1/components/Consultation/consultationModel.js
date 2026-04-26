import mongoose, { Schema } from "mongoose";

const consultationSchema = new mongoose.Schema({
    patientId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "patients"
    },
    doctorId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "doctors"
    },
    current_illness : {
        type : String,
    },
    recent_surgery : {
        type : String,
    },
    diabetes : {
        type : String,
        enum: ["Diabetic", "Non-Diabetic"]
    },
    allergies : {
        type : String,
    },
    others : {
        type : String,
    },
    transactionId : {
        type : String,
    },
    paymentStatus : {
        type : String,
        enum : ["PENDING", "SUCCESS", "FAILED"] 
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, { timestamps : true })

export const consultationModel = mongoose.model("consultations", consultationSchema) 