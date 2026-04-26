import express from "express";
const router = express.Router()
import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';

import { patientsignUp, uploadpatientImage, patientlogin, getPatientById } from "./patientController.js";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, path.join(process.cwd(), 'public', 'patientImage'));
        } else {
            cb(new Error("Unsupported file type"), false);
        }
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, name);
    }
});

const upload = multer({ storage });



router.post('/uploadpatientImage', upload.single('patientImage'), (req, res, next ) => {
    // console.log(".......uploadpatientImage......",req.file)
    uploadpatientImage( req, res, next );
});

router.post("/patientsignUp", patientsignUp);
router.post("/patientlogin", patientlogin);
router.get("/getPatientById/:id", getPatientById);

export default router;