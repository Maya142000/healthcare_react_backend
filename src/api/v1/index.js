import express from "express";
const apiRouter = express.Router()

import doctorRouter from "./components/Doctor/doctorRoutes.js"
apiRouter.use("/doctor", doctorRouter)

import patientRouter from "./components/Patient/patientRoutes.js"
apiRouter.use("/patient", patientRouter)

import consultaionRouter from "./components/Consultation/consultationRoutes.js"
apiRouter.use("/consultation", consultaionRouter)

import prescriptionRouter from "./components/Prescription/prescriptionRoutes.js"
apiRouter.use("/prescription", prescriptionRouter)

export default apiRouter;