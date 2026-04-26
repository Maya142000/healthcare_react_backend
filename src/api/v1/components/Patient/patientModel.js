import mongoose, { Schema } from "mongoose";

const patientSchema = new mongoose.Schema({
    name     : {
        type : String,
    },
    age : {
        type : Number,
        default : 0,
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
    },
    history_of_surgery : {
        type : String,
    },
    mobileNo : {
        type : Number,
        default : 0,
        unique : true
    },
    history_of_illness : [],
    patient_image : {
        type : String,
        default : ""
    },
    Role : {
        type : String,
        default : "PATIENT"
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, { timestamps : true })

export const patientModel = mongoose.model("patients", patientSchema) 