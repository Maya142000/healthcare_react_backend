import nodemailer from "nodemailer";
import path from "path";

export const sendPrescriptionEmailToPatient = async (payload) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mohitemahesh210@gmail.com",
            pass: "zoge lvya zcml khfm"
        }
    });

    const relativePath = payload.pdfUrl.split("/uploads")[1];
    const filePath = path.join(process.cwd(), "uploads", relativePath);


    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #ffffff; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #777; }
            .button { display: inline-block; padding: 12px 25px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
            .info-box { background-color: #f0f7ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Medical Prescription</h1>
            </div>
            <div class="content">
                <p>Dear <strong>${payload.patientName || 'Patient'}</strong>,</p>
                <p>We hope you are doing well. Your digital prescription has been generated and is ready for your review.</p>
                
                <div class="info-box">
                    <p style="margin: 0;"><strong>Note:</strong> Please find the attached PDF document for your official prescription records. You can present this at any pharmacy.</p>
                </div>

                <p>If you have any questions regarding your medication or dosage, please do not hesitate to contact our clinic directly.</p>
                
                <p>Best Regards,<br>
                <strong>The Medical Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply directly to this email.</p>
                <p>&copy; ${new Date().getFullYear()} Your Health Clinic</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: '"Health Clinic" <mohitemahesh210@gmail.com>',
        to: payload.to,
        subject: "Your Digital Prescription - Action Required",
        html: htmlContent,
        attachments: [
            {
                filename: "prescription.pdf",
                path: filePath
            }
        ]
    });
};