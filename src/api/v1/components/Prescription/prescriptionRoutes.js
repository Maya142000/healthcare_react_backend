import express from "express";
const router = express.Router();

import { addPrescription, updatePrescription, sendPrescriptionToPatient } from "./prescriptionController.js";

router.post("/addPrescription", addPrescription)
router.post("/updatePrescription", updatePrescription)
router.post("/sendPrescriptionToPatient", sendPrescriptionToPatient)

export default router;