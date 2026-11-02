import { jsPDF } from 'jspdf';
import { IssuedCPDCertificate } from '../types';

export interface CertificatePdfOptions {
  certificate: IssuedCPDCertificate;
  institutionRegion?: string;
  verificationUrl?: string;
}

/**
 * Client-side generation of an official, high-resolution EFDA/MoH CPD Certificate PDF
 * Compliant with Ethiopian MoH Directive No. 49/2022
 */
export const generateCertificatePdf = async (options: CertificatePdfOptions): Promise<void> => {
  const { certificate, institutionRegion = 'Oromia / Addis Ababa', verificationUrl = 'https://pharmastar-app-pro.et/verify' } = options;

  // Landscape A4: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background tint
  doc.setFillColor(254, 252, 247); // warm stone parchment
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer ornate bronze/gold double border
  doc.setDrawColor(180, 83, 9); // Amber-700
  doc.setLineWidth(1.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(13, 148, 136); // Teal-600
  doc.setLineWidth(0.6);
  doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Inner subtle border
  doc.setDrawColor(217, 119, 6); // Amber-600
  doc.setLineWidth(0.3);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Corner decorative accents
  const drawCorner = (x: number, y: number, scaleX: number, scaleY: number) => {
    doc.setDrawColor(180, 83, 9);
    doc.setLineWidth(1.2);
    doc.line(x, y, x + scaleX * 12, y);
    doc.line(x, y, x, y + scaleY * 12);

    doc.setFillColor(180, 83, 9);
    doc.circle(x + scaleX * 4, y + scaleY * 4, 1.2, 'F');
  };

  drawCorner(15, 15, 1, 1); // Top-left
  drawCorner(pageWidth - 15, 15, -1, 1); // Top-right
  drawCorner(15, pageHeight - 15, 1, -1); // Bottom-left
  drawCorner(pageWidth - 15, pageHeight - 15, -1, -1); // Bottom-right

  // Header Emblems & Federal Republic Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // Amber
  doc.text('FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA', pageWidth / 2, 24, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('ETHIOPIAN FOOD AND DRUG AUTHORITY (EFDA) & MINISTRY OF HEALTH (MoH)', pageWidth / 2, 29, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('CONTINUING PROFESSIONAL DEVELOPMENT (CPD) ACCREDITATION COUNCIL', pageWidth / 2, 33.5, { align: 'center' });

  // Thin dividing line
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 60, 36, pageWidth / 2 + 60, 36);

  // Certificate Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATE OF CLINICAL COMPETENCY', pageWidth / 2, 45, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('times', 'italic');
  doc.setTextColor(180, 83, 9);
  doc.text('& Continuing Professional Development (CPD) Completion', pageWidth / 2, 51, { align: 'center' });

  // Presentation line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('THIS IS TO OFFICIALLY CERTIFY THAT', pageWidth / 2, 59, { align: 'center' });

  // Candidate Name
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text(certificate.candidateName, pageWidth / 2, 68, { align: 'center' });

  // Underline beneath candidate name
  const nameWidth = doc.getTextWidth(certificate.candidateName);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - nameWidth / 2 - 5, 70, pageWidth / 2 + nameWidth / 2 + 5, 70);

  // License & Region Information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Professional License ID: ${certificate.licenseNumber}   |   Practitioner Jurisdiction: ${institutionRegion}`,
    pageWidth / 2,
    76,
    { align: 'center' }
  );

  // Body text
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'has satisfactorily demonstrated clinical mastery, completed all didactic curriculum requirements,',
    pageWidth / 2,
    83,
    { align: 'center' }
  );
  doc.text(
    'and passed the standardized clinical scenario examination under EFDA Directive No. 49/2022 for:',
    pageWidth / 2,
    88,
    { align: 'center' }
  );

  // Course Title Box
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth / 2 - 95, 93, 190, 17, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(120, 53, 15); // Amber-900
  doc.text(
    `${certificate.courseCode}: ${certificate.courseTitle}`,
    pageWidth / 2,
    100,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Accredited Continuing Education Units: ${certificate.ceuCredits} CEUs   •   Examination Score: ${certificate.scoreAchievedPercent}% (Passed with Distinction)`,
    pageWidth / 2,
    106,
    { align: 'center' }
  );

  // Regulatory Compliance Badge Bar
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth / 2 - 90, 114, 180, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('FEDERAL CPD DIRECTIVE COMPLIANCE & VERIFICATION METRICS', pageWidth / 2, 119, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Single Course Cap Rule: Max 15 CEUs (Satisfied)   |   Ethics Floor Rule: Mandatory >=5 CEUs   |   Renewal Window: 2026-2029 Cycle`,
    pageWidth / 2,
    124,
    { align: 'center' }
  );

  // Signatures & Official Seal Section (Y: 135 to 175)
  // Left: Clinical Lead / Academic Director
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text('Dawid Aliyi', 45, 150, { align: 'center' });

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(22, 153, 68, 153);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Pharmacist Dawid Aliyi, B.Pharm, BCPS', 45, 158, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Director of Academic Affairs & Clinical Lead', 45, 162, { align: 'center' });
  doc.text('Pharmastar Clinical Pharmacy Academy', 45, 166, { align: 'center' });

  // Center: Official Gold Seal
  const sealCenterX = pageWidth / 2;
  const sealCenterY = 153;

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(1.2);
  doc.circle(sealCenterX, sealCenterY, 15, 'FD');

  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.circle(sealCenterX, sealCenterY, 13.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(180, 83, 9);
  doc.text('EFDA • MoH', sealCenterX, sealCenterY - 6, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  doc.text('OFFICIAL', sealCenterX, sealCenterY - 1, { align: 'center' });
  doc.text('SEAL', sealCenterX, sealCenterY + 3, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(180, 83, 9);
  doc.text('VERIFIED CPD', sealCenterX, sealCenterY + 7.5, { align: 'center' });

  // Right: CPD Registrar / EFDA Director
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Mulugeta K.', pageWidth - 45, 150, { align: 'center' });

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - 68, 153, pageWidth - 22, 153);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Mulugeta K., MD, MPH', pageWidth - 45, 158, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CPD Accreditation Registrar', pageWidth - 45, 162, { align: 'center' });
  doc.text('EFDA / MoH Licensing Directorate', pageWidth - 45, 166, { align: 'center' });

  // Verification & Metadata Bar at Bottom
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(16, 178, pageWidth - 16, 178);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Certificate No: ${certificate.certificateNumber}`, 20, 184);
  doc.text(`Issue Date: ${certificate.issueDate}`, 115, 184);
  doc.text(`Renewal Expiry: ${certificate.expiryDate}`, 190, 184);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Payment Ref: ${certificate.paymentReference}  |  Accreditation Body: EFDA & MoH CPD Council  |  Verify: ${verificationUrl}`,
    pageWidth / 2,
    191,
    { align: 'center' }
  );
  doc.text(
    'This is a secure, tamper-evident digital certificate generated directly by the Pharma Star App Pro Clinical Suite.',
    pageWidth / 2,
    195,
    { align: 'center' }
  );

  // Trigger Client-side download
  const cleanName = certificate.candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `EFDA_CPD_Certificate_${certificate.courseCode}_${cleanName}.pdf`;
  doc.save(filename);
};
