import mongoose, {Schema} from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "consultations",
        required: true,
        unique: true 
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patients",
        required: true
    },
    care: {
        type: String,
        required: true
    },
    medicines: [{
        type: String
    }],
    pdfUrl: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps : true });

export const prescriptionModel = mongoose.model("prescriptions", prescriptionSchema)