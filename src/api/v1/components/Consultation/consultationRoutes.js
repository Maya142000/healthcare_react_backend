import express from "express";
const router = express.Router();

import { saveConsultation, getConsultationById,  } from "./consultationController.js";

router.post("/saveConsultation", saveConsultation)
router.get("/getConsultationById/:id", getConsultationById)

export default router;