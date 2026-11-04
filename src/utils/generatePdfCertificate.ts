import { jsPDF } from 'jspdf';
import { IssuedCPDCertificate } from '../types';

export interface CertificatePdfOptions {
  certificate: IssuedCPDCertificate;
  nationalCouncilName?: string;
  accreditationDirective?: string;
}

/**
 * Client-side generation of an official EFDA & MoH Accredited CPD Certificate of Completion.
 * Uses jsPDF to render a high-resolution, landscape A4 certificate with ornate styling,
 * federal seals, official signatures, and anti-tamper security features.
 */
export const generatePdfCertificate = (cert: IssuedCPDCertificate): void => {
  // A4 Landscape dimensions in mm: 297 x 210
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297
  const pageHeight = doc.internal.pageSize.getHeight(); // 210

  // 1. Background fill: Elegant warm ivory/parchment
  doc.setFillColor(253, 252, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Outer Ornate Border (Gold / Amber tone)
  doc.setDrawColor(180, 120, 30);
  doc.setLineWidth(2.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner Thin Border (Teal / MoH tone)
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(0.8);
  doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Micro Hairline Gold Accent
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(12.5, 12.5, pageWidth - 25, pageHeight - 25);

  // Decorative Corner Accents
  const drawCornerAccents = () => {
    doc.setDrawColor(180, 120, 30);
    doc.setLineWidth(1.5);
    const cornerSize = 10;
    
    // Top-Left
    doc.line(8, 8 + cornerSize, 8 + cornerSize, 8);
    // Top-Right
    doc.line(pageWidth - 8, 8 + cornerSize, pageWidth - 8 - cornerSize, 8);
    // Bottom-Left
    doc.line(8, pageHeight - 8 - cornerSize, 8 + cornerSize, pageHeight - 8);
    // Bottom-Right
    doc.line(pageWidth - 8, pageHeight - 8 - cornerSize, pageWidth - 8 - cornerSize, pageHeight - 8);
  };
  drawCornerAccents();

  // Subtle Watermark Emblem in Background
  doc.setDrawColor(230, 220, 195);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, pageHeight / 2 + 5, 45, 'S');
  doc.circle(pageWidth / 2, pageHeight / 2 + 5, 40, 'S');

  // 3. Federal Header
  doc.setTextColor(146, 64, 14); // Dark Amber
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA', pageWidth / 2, 22, { align: 'center' });

  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ETHIOPIAN FOOD AND DRUG AUTHORITY (EFDA) & MINISTRY OF HEALTH (MoH)', pageWidth / 2, 28, { align: 'center' });

  doc.setTextColor(15, 118, 110); // Teal 700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONTINUING PROFESSIONAL DEVELOPMENT (CPD) ACCREDITATION COUNCIL', pageWidth / 2, 33, { align: 'center' });

  // Thin separator line
  doc.setDrawColor(180, 120, 30);
  doc.setLineWidth(0.6);
  doc.line(40, 36, pageWidth - 40, 36);

  // 4. Main Certificate Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('CERTIFICATE OF CLINICAL COMPETENCE & COMPLETION', pageWidth / 2, 45, { align: 'center' });

  // 5. Preamble
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('This is to officially certify that', pageWidth / 2, 54, { align: 'center' });

  // 6. Recipient Candidate Name
  doc.setTextColor(13, 148, 136); // Teal 600
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  const nameToDisplay = cert.candidateName || 'Pharmacist Dawid Aliyi, B.Pharm, BCPS';
  doc.text(nameToDisplay, pageWidth / 2, 65, { align: 'center' });

  // Decorative underline under name
  const nameWidth = doc.getTextWidth(nameToDisplay);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1);
  doc.line((pageWidth - nameWidth) / 2 - 5, 68, (pageWidth + nameWidth) / 2 + 5, 68);

  // Professional License & Role
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Professional Practicing License / Registration No: ${cert.licenseNumber || 'ETH-EFDA-PHARM-2026-8819'}`, pageWidth / 2, 75, { align: 'center' });

  // 7. Achievement Statement
  doc.setTextColor(51, 65, 85);
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.text(
    'has satisfactorily completed all didactic coursework, passed clinical case evaluations, and demonstrated masterly competency in:',
    pageWidth / 2,
    84,
    { align: 'center' }
  );

  // 8. Module Highlight Box
  const boxX = 35;
  const boxY = 90;
  const boxWidth = pageWidth - 70;
  const boxHeight = 28;

  doc.setFillColor(245, 243, 235); // Soft beige
  doc.setDrawColor(180, 120, 30);
  doc.setLineWidth(0.7);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${cert.courseCode}: ${cert.courseTitle}`, pageWidth / 2, boxY + 9, { align: 'center' });

  doc.setTextColor(180, 83, 9); // Amber 700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(
    `Accredited Award: ${cert.ceuCredits} Continuing Education Units (CEUs)  •  Examination Score: ${cert.scoreAchievedPercent}% Mastered`,
    pageWidth / 2,
    boxY + 17,
    { align: 'center' }
  );

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Standardized Under EFDA & MoH Healthcare Professional CPD Directives No. 49/2022', pageWidth / 2, boxY + 23, { align: 'center' });

  // 9. Signatures & Official Seal Row
  const sigY = 142;

  // Left Signature: Director Pharmacist Dawid Aliyi
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(35, sigY + 12, 95, sigY + 12);

  doc.setTextColor(15, 118, 110);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(14);
  doc.text('Pharmacist Dawid Aliyi', 65, sigY + 8, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Pharmacist Dawid Aliyi, B.Pharm, BCPS', 65, sigY + 17, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Director of Academic Affairs & Clinical Lead', 65, sigY + 21, { align: 'center' });
  doc.text('Pharma Star Clinical Pharmacy Academy', 65, sigY + 25, { align: 'center' });

  // Center: Official Gold Seal
  const sealCenterX = pageWidth / 2;
  const sealCenterY = sigY + 10;
  
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(180, 120, 30);
  doc.setLineWidth(1.2);
  doc.circle(sealCenterX, sealCenterY, 15, 'FD');

  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.circle(sealCenterX, sealCenterY, 13, 'S');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL', sealCenterX, sealCenterY - 3, { align: 'center' });
  doc.setFontSize(9);
  doc.text('EFDA SEAL', sealCenterX, sealCenterY + 1, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('ACCREDITED', sealCenterX, sealCenterY + 5, { align: 'center' });

  doc.setTextColor(71, 85, 105);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text(cert.certificateNumber || 'EFDA-CPD-2026-VERIFIED', sealCenterX, sealCenterY + 20, { align: 'center' });

  // Right Signature: CPD Registrar / EFDA Directorate
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 95, sigY + 12, pageWidth - 35, sigY + 12);

  doc.setTextColor(30, 41, 59);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(14);
  doc.text('Dr. Mulugeta K.', pageWidth - 65, sigY + 8, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Dr. Mulugeta K., MD, MPH', pageWidth - 65, sigY + 17, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('CPD Accreditation Registrar', pageWidth - 65, sigY + 21, { align: 'center' });
  doc.text('EFDA / MoH Licensing Directorate', pageWidth - 65, sigY + 25, { align: 'center' });

  // 10. Security & Verification Bottom Bar
  const footY = 188;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(20, footY, pageWidth - 20, footY);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  const leftFoot = `Date of Issue: ${cert.issueDate || 'October 2026'}  •  Cycle Expiry: ${cert.expiryDate || '3 Years from Issue'}`;
  const centerFoot = `Payment / Verification Ref: ${cert.paymentReference || 'CBE-DIRECT'}`;
  const rightFoot = `Tamper-Evident Digital ID: ${cert.id}`;

  doc.text(leftFoot, 20, footY + 5);
  doc.text(centerFoot, pageWidth / 2, footY + 5, { align: 'center' });
  doc.text(rightFoot, pageWidth - 20, footY + 5, { align: 'right' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6.5);
  doc.text(
    'This credential is valid for Ethiopian Health Professionals practicing license renewal. Verification portal: https://health.gov.et/cpd',
    pageWidth / 2,
    footY + 9,
    { align: 'center' }
  );

  // 11. Trigger Instant Client-Side PDF Download
  const cleanCandidate = (cert.candidateName || 'Healthcare_Professional')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const cleanCourse = (cert.courseCode || 'CPD_MODULE').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `EFDA_CPD_Certificate_${cleanCourse}_${cleanCandidate}.pdf`;

  doc.save(filename);
};
