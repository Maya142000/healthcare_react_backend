import mongoose, { Schema } from "mongoose";

const doctorSchema = new mongoose.Schema({
    name     : {
        type : String,
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
    },
    specialty : {
        type : String,
    },
    mobileNo : {
        type : Number,
        default : 0,
        unique : true
    },
    experience : {
        type : Number,
        default : 0
    },
    doctor_image : {
        type : String,
        default : ""
    },
    Role : {
        type : String,
        default : "DOCTOR"
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, { timestamps : true })

export const doctorModel = mongoose.model("doctors", doctorSchema) 