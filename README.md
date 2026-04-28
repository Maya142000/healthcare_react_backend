# Healthcare React Backend

A RESTful backend API for a healthcare management system built with Node.js, Express.js, and MongoDB. It supports doctor and patient management, consultation booking, prescription generation (PDF), and email delivery.

-------------------------------------------------------------------------------------

# Table of Contents

- Tech Stack
- Project Structure
- Environment Variables
- API Routes
- Cron Jobs
- CORS Configuration
- Deployment

-------------------------------------------------------------------------------------

# Tech Stack

- Runtime :- Node.js (ESM modules)          
- Framework :- Express.js v5                  
- Database :- MongoDB via Mongoose v9        
- Auth :- JSON Web Tokens (jsonwebtoken) 
- Password Hash :- bcrypt                         
- File Uploads :- Multer                         
- PDF Generation :- PDFKit                         
- Email :- Nodemailer                     
- Validation :- Joi                            
- Logging :- Winston + Morgan               
- Security :- Helmet, CORS                   
- Compression :- compression                    
- Scheduling :- node-cron                      

----------------------------------------------------------------------------------------

# Project Structure

react_backend/
├── src/
│   ├── server.js                          # Main file
│   ├── app.js                             # Express app setup
│   ├── config/
│   │   └── dbconfig.js                    # MongoDB connection
│   ├── api/
│   │   └── v1/
│   │       ├── index.js                   # API v1 router aggregator
│   │       └── components/
│   │           ├── Doctor/
│   │           │   ├── doctorRoutes.js
│   │           │   ├── doctorController.js
│   │           │   └── doctorModel.js
│   │           ├── Patient/
│   │           │   ├── patientRoutes.js
│   │           │   ├── patientController.js
│   │           │   └── patientModel.js
│   │           ├── Consultation/
│   │           │   ├── consultationRoutes.js
│   │           │   ├── consultationController.js
│   │           │   └── consultationModel.js
│   │           └── Prescription/
│   │               ├── prescriptionRoutes.js
│   │               ├── prescriptionController.js
│   │               └── prescriptionModel.js
│   ├── middlewares/
│   │   └── doctorMiddleware.js            # JWT-based doctor auth guard
│   ├── utils/
│   │   ├── tokens.js                      # JWT sign + bcrypt helpers
│   │   ├── logger.js                      # Winston logger
│   │   ├── patientEmail.js                # Nodemailer email sender
│   │   └── generatePrescriptionPDF.js     # PDFKit PDF generator
│   └── cron/
│       └── cronJobs.js                    # Scheduled jobs (node-cron)
├── public/
│   ├── doctorImage/                       # Uploaded doctor profile images
│   └── patientImage/                      # Uploaded patient profile images
├── uploads/
│   └── prescriptions/                     # Generated prescription PDFs
├── .env                                   # Environment config
├── package.json
└── README.md

-------------------------------------------------------------------------------------

## Installation

# Clone the repository
git clone https://github.com/Maya142000/healthcare_react_backend.git

# Install dependencies
npm install

# Configure environment variables
.env
# Edit .env with your values

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

The server runs on `http://localhost:5000`by default.

-------------------------------------------------------------------------------------

# Environment Variables
Create a .env file in the root directory:

# Add credentials
# MongoDB Connection URI
DevUrl=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority

# Server Port
PORT=5000

# Public base URL (used for PDF/image URLs in emails)
BASE_URL=https://your-backend-domain.onrender.com

# JWT Secret Key
SECRET_KEY=your_secret_key_here


-------------------------------------------------------------------------------------

## API Routes
All routes are prefixed with /api/v1.


# Doctor Routes

POST | /api/v1/doctor/uploaddoctorImage  --- doctorImage
POST | /api/v1/doctor/doctorsignUp
POST | /api/v1/doctor/doctorlogin
GET  | /api/v1/doctor/getAllDoctors
GET  | /api/v1/doctor/getDoctorById/:id 


# Patient Routes

POST | /api/v1/patient/uploadpatientImage  --- patientImage
POST | /api/v1/patient/patientsignUp
POST | /api/v1/patient/patientlogin
GET  | /api/v1/patient/getPatientById/:id


# Consultation Routes — `/api/v1/consultation`

POST | /api/v1/consultation/saveConsultation
GET  | /api/v1/consultation/getConsultationById/:id


# Prescription Routes — `/api/v1/prescription`

POST | /api/v1/prescription/addPrescription
POST | /api/v1/prescription/updatePrescription
POST | /api/v1/prescription/sendPrescriptionToPatient


# Static File Routes

GET /public/doctorImage/ ---> Serve uploaded doctor profile images
GET /public/patientImage/ ---> Serve uploaded patient profile images
GET /uploads/prescriptions/ ---> Serve generated prescription PDFs


-------------------------------------------------------------------------------------

# tokens.js
- signaccessToken(payload)  --->  Signs a JWT access token (expires in 30 minutes)
- signrefreshToken(payload)  --->  Signs a JWT refresh token (expires in 7 days)
- passwordMatch(plain, hashed)  --->  Compares a plain password against a bcrypt hash

# logger.js
Winston-based structured logger. Used throughout the app for info/error logging.

-------------------------------------------------------------------------------------

# patientEmail.js
Nodemailer-based email utility. Sends prescription PDF attachments to patients after a consultation.

-------------------------------------------------------------------------------------

# generatePrescriptionPDF.js
PDFKit-based PDF generator. Creates a formatted prescription document saved to `uploads/prescriptions/` and returns the file path for attachment/linking.

-------------------------------------------------------------------------------------

## Cron Jobs

Defined in `src/cron/cronJobs.js` using `node-cron`. A scheduled job runs every 5 minutes (currently a placeholder for future background tasks such as appointment reminders or cleanup).

-------------------------------------------------------------------------------------

## CORS Configuration

The server allows cross-origin requests from the following origins:

- `http://localhost:5173` (local Vite dev server)
- `https://your-netlify-app.netlify.app`
- `https://darling-gaufre-29d494.netlify.app`

Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`  
Allowed headers: `Content-Type, Authorization`  
Credentials: Enabled

To add a new allowed origin, update the `corsOptions.origin` array in `src/app.js`.

-------------------------------------------------------------------------------------

## Deployment

The backend is configured for deployment on [Render] (`BASE_URL=https://healthcare-react-backend.onrender.com`). The frontend is deployed on **Netlify**.

For production:
npm start
