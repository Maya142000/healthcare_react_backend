import express from "express";
const router = express.Router()
import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';

import { doctorsignUp, uploaddoctorImage, doctorlogin, getAllDoctors, getDoctorById } from "./doctorController.js";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, path.join(process.cwd(), 'public', 'doctorImage'));
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



router.post('/uploaddoctorImage', upload.single('doctorImage'), (req, res, next ) => {
    // console.log(".......uploadofferImage......",req.file)
    uploaddoctorImage( req, res, next );
});

router.post("/doctorsignUp", doctorsignUp);
router.post("/doctorlogin", doctorlogin);
router.get("/getAllDoctors", getAllDoctors);
router.get("/getDoctorById/:id", getDoctorById);

export default router;