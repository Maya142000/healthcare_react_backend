import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0fdf8";
const NAVY = "#1e293b";
const SLATE = "#334155";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const WHITE = "#ffffff";
const LIGHT_BG = "#f8fafc";
const RED_LIGHT = "#fef2f2";

export const generatePrescriptionPDF = async (data) => {
    console.log("..data..",data)
    return new Promise((resolve, reject) => {
        try {
            const fileName = `prescription_${Date.now()}.pdf`;
            const folderPath = path.join("uploads", "prescriptions");

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const filePath = path.join(folderPath, fileName);
            const doc = new PDFDocument({ margin: 0, size: "A4" });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            const W = doc.page.width;
            const margin = 40;
            const inner = W - margin * 2;

            const hr = (y, color = BORDER, thickness = 0.5) => {
                doc.save()
                    .strokeColor(color)
                    .lineWidth(thickness)
                    .moveTo(margin, y)
                    .lineTo(W - margin, y)
                    .stroke()
                    .restore();
                return y + 12;
            };

            const sectionLabel = (label, y) => {
                doc.save()
                    .roundedRect(margin, y, inner, 18, 3)
                    .fill(TEAL_LIGHT);
                doc.restore()
                    .font("Helvetica-Bold")
                    .fontSize(7.5)
                    .fillColor(TEAL)
                    .text(label.toUpperCase(), margin + 8, y + 5, {
                        characterSpacing: 1,
                    });
                return y + 26;
            };

            const kvRow = (key, value, y, colW = inner / 2) => {
                doc.font("Helvetica-Bold")
                    .fontSize(8)
                    .fillColor(MUTED)
                    .text(key, margin, y);
                doc.font("Helvetica")
                    .fontSize(10)
                    .fillColor(NAVY)
                    .text(value || "—", margin, y + 11, { width: colW - 10 });
                return y + 32;
            };

            let y = 0;

            doc.rect(0, 0, W, 80).fill(TEAL);

            doc.font("Helvetica-Bold")
                .fontSize(22)
                .fillColor(WHITE)
                .text("MediConsult", margin, 20);

            doc.font("Helvetica")
                .fontSize(9.5)
                .fillColor("rgba(255,255,255,0.75)")
                .text("Online Prescription Platform", margin, 47);

            const rxId = `RX-${Date.now().toString().slice(-8)}`;
            const today = new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            doc.font("Helvetica")
                .fontSize(8.5)
                .fillColor("rgba(255,255,255,0.8)")
                .text(`Date : ${today}`, W - margin - 110, 24, {
                    width: 110,
                    align: "right",
                })
                .text(`ID      : ${rxId}`, W - margin - 110, 38, {
                    width: 110,
                    align: "right",
                });

            doc.rect(0, 72, W, 12).fill(WHITE);
            y = 84;

            doc.rect(margin, y, 4, 36).fill(TEAL);
            console.log("doctorName:", data.doctorName)
            console.log("doctorSpecialty:", data.doctorSpecialty)
            console.log("medicines:", data.medicines)
            doc.fillColor("black");   
            doc.font("Helvetica-Bold")
                .fontSize(13)
                // .fillColor(NAVY)
                .text(data.doctorName || "Doctor", margin + 12, y + 2);

            doc.font("Helvetica")
                .fontSize(9.5)
                .fillColor(MUTED)
                .text(
                    `${data.doctorSpecialty || "Specialist"}  ·  MediConsult Certified`,
                    margin + 12,
                    y + 20
                );

            y += 52;
            y = hr(y, BORDER);

            doc.save().roundedRect(margin, y, inner, 62, 6).fill(LIGHT_BG);
            doc.restore();

            doc.save().roundedRect(margin, y, inner, 62, 6).stroke(BORDER);
            doc.restore();

            const cx = margin + 34,
                cy = y + 31;
            doc.circle(cx, cy, 22).fill(TEAL_LIGHT);
            doc.font("Helvetica-Bold")
                .fontSize(16)
                .fillColor(TEAL)
                .text(
                    (data.patientName || "P").charAt(0).toUpperCase(),
                    cx - 6,
                    cy - 9
                );

            doc.font("Helvetica-Bold")
                .fontSize(13)
                .fillColor(NAVY)
                .text(data.patientName || "Patient", margin + 66, y + 10);

            const metaParts = [];
            if (data.patientAge) metaParts.push(`Age: ${data.patientAge}`);
            if (data.patientPhone)
                metaParts.push(`Phone: ${data.patientPhone}`);
            if (data.patientEmail) metaParts.push(data.patientEmail);

            doc.font("Helvetica")
                .fontSize(9)
                .fillColor(MUTED)
                .text(metaParts.join("   ·   "), margin + 66, y + 28, {
                    width: inner - 80,
                });

            doc.font("Helvetica-Bold")
                .fontSize(7)
                .fillColor(TEAL)
                .text("PATIENT", W - margin - 55, y + 10, {
                    width: 50,
                    align: "right",
                });

            y += 74;

            y = sectionLabel("Current Illness", y);

            doc.font("Helvetica")
                .fontSize(10.5)
                .fillColor(SLATE)
                .text(data.illnessHistory || "Not specified", margin, y, {
                    width: inner,
                    lineGap: 4,
                });

            y +=
                doc.heightOfString(data.illnessHistory || "Not specified", {
                    width: inner,
                    lineGap: 4,
                }) + 18;

            y = hr(y - 6, BORDER);

            y = sectionLabel("Care to be Taken", y);

            const careText = data.care || "";
            const careHeight = doc.heightOfString(careText, {
                width: inner - 24,
                lineGap: 4,
            });

            doc.save()
                .roundedRect(margin, y - 4, inner, careHeight + 20, 4)
                .fill("#f0fdf8");
            doc.restore();

            doc.font("Helvetica")
                .fontSize(10.5)
                .fillColor(NAVY)
                .text(careText, margin + 12, y + 6, {
                    width: inner - 24,
                    lineGap: 4,
                });

            y += careHeight + 30;
            y = hr(y - 6, BORDER);

            const meds = Array.isArray(data.medicines) ? data.medicines.filter(Boolean) : data.medicines ? [data.medicines] : [];

            if (meds.length > 0) {
                y = sectionLabel("Prescribed Medicines", y);

                meds.forEach((med, i) => {
                    const rowBg = i % 2 === 0 ? LIGHT_BG : WHITE;
                    doc.save()
                        .roundedRect(margin, y - 3, inner, 22, 3)
                        .fill(rowBg);
                    doc.restore();

                    doc.circle(margin + 14, y + 8, 10).fill(TEAL);
                    doc.font("Helvetica-Bold")
                        .fontSize(8)
                        .fillColor(WHITE)
                        .text(String(i + 1), margin + 10, y + 4);

                    doc.font("Helvetica")
                        .fontSize(10.5)
                        .fillColor(NAVY)
                        .text(med, margin + 32, y + 3, { width: inner - 36 });

                    y += 26;
                });

                y += 10;
                y = hr(y, BORDER);
            }

            const hasFamilyHistory =
                data.diabetes || data.allergies || data.others;

            if (hasFamilyHistory) {
                y = sectionLabel("Family & Medical History", y);

                const colW = inner / 3;

                if (data.diabetes) {
                    kvRow("DIABETES STATUS", data.diabetes, y, colW);
                }
                if (data.allergies) {
                    doc.font("Helvetica-Bold")
                        .fontSize(8)
                        .fillColor(MUTED)
                        .text("ALLERGIES", margin + colW, y);
                    doc.font("Helvetica")
                        .fontSize(10)
                        .fillColor(NAVY)
                        .text(data.allergies, margin + colW, y + 11, {
                            width: colW - 10,
                        });
                }
                if (data.others) {
                    doc.font("Helvetica-Bold")
                        .fontSize(8)
                        .fillColor(MUTED)
                        .text("OTHERS", margin + colW * 2, y);
                    doc.font("Helvetica")
                        .fontSize(10)
                        .fillColor(NAVY)
                        .text(data.others, margin + colW * 2, y + 11, {
                            width: colW - 10,
                        });
                }

                y += 46;
                y = hr(y, BORDER);
            }

            const signatureY = Math.max(y + 20, 690);

            doc.save()
                .strokeColor(TEAL)
                .lineWidth(1)
                .moveTo(W - margin - 130, signatureY)
                .lineTo(W - margin, signatureY)
                .stroke()
                .restore();

            doc.font("Helvetica")
                .fontSize(8)
                .fillColor(MUTED)
                .text("Doctor's Signature", W - margin - 130, signatureY + 5, {
                    width: 130,
                    align: "center",
                });

            const pageH = doc.page.height;
            const footerH = 48;
            const footerY = pageH - footerH;

            doc.rect(0, footerY, W, footerH).fill(LIGHT_BG);
            doc.save()
                .strokeColor(BORDER)
                .lineWidth(0.5)
                .moveTo(0, footerY)
                .lineTo(W, footerY)
                .stroke()
                .restore();

            doc.font("Helvetica-Oblique")
                .fontSize(8)
                .fillColor(MUTED)
                .text(
                    "Digitally generated by MediConsult. Follow doctor's advice carefully.",
                    margin,
                    footerY + 12,
                    { width: inner * 0.65 }
                );

            doc.font("Helvetica")
                .fontSize(8)
                .fillColor(MUTED)
                .text(
                    `Generated: ${new Date().toLocaleString("en-IN")}`,
                    W - margin - 160,
                    footerY + 12,
                    { width: 160, align: "right" }
                );

            doc.end();

            stream.on("finish", () => {
                resolve(`${data.baseUrl}/uploads/prescriptions/${fileName}`);
            });

            stream.on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
};
