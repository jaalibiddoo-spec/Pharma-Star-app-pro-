import { jsPDF } from 'jspdf';
import { SponsorInvitationLetter } from '../types/sponsorLetter';

/**
 * Client-side generation of an official Formal Sponsor Invitation Letter PDF
 * Formatted with official letterhead, reference numbering, signature block, and corporate seal
 */
export const generateSponsorLetterPdf = async (letter: SponsorInvitationLetter): Promise<void> => {
  // Portrait A4: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header Letterhead Band
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line under Letterhead
  doc.setFillColor(13, 148, 136); // Teal-600
  doc.rect(0, 28, pageWidth, 2.5, 'F');

  // Gold pinstripe
  doc.setFillColor(217, 119, 6); // Amber-600
  doc.rect(0, 30.5, pageWidth, 1, 'F');

  // Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('PHARMA STAR APP PRO — HEALTH INFORMATICS & CLINICAL ACADEMY', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('DIRECTORATE OF CORPORATE STRATEGY & INSTITUTIONAL ALLIANCES', margin, 17);
  doc.text('Accredited Under EFDA & Federal Ministry of Health (MoH) Framework • Addis Ababa, Ethiopia', margin, 22);

  // Contact Info on right of header
  doc.setFontSize(7.5);
  doc.setTextColor(153, 246, 228); // Teal-200
  doc.text('Tel: +251 982 852 778', pageWidth - margin, 14, { align: 'right' });
  doc.text('Email: jaalibiddoo@gmail.com', pageWidth - margin, 19, { align: 'right' });
  doc.text('Web: pharmastar-app-pro.et', pageWidth - margin, 24, { align: 'right' });

  let curY = 42;

  // Reference Number & Date Row
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`REF: ${letter.referenceNo}`, margin, curY);

  doc.setFont('helvetica', 'bold');
  doc.text(`Date: ${letter.date}`, pageWidth - margin, curY, { align: 'right' });

  curY += 10;

  // Recipient Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TO:', margin, curY);

  curY += 4.5;
  doc.text(letter.recipientName, margin, curY);
  curY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(letter.recipientTitle, margin, curY);
  curY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(letter.organization, margin, curY);
  curY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${letter.city}, ${letter.country}`, margin, curY);

  curY += 9;

  // Subject Line Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, curY, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const subjectText = `SUBJECT: FORMAL INVITATION FOR STRATEGIC INSTITUTIONAL SPONSORSHIP & HEALTHCARE CAPACITY-BUILDING PARTNERSHIP (2026/2027)`;
  doc.text(subjectText, margin + 4, curY + 7.5);

  curY += 19;

  // Salutation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dear ${letter.recipientName.split(' ')[0] || 'Esteemed Leadership'},`, margin, curY);

  curY += 6;

  // Paragraph 1: Introduction & National Footprint
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const p1 = `On behalf of the Directorate of Corporate Alliances at Pharma Star App Pro, I have the distinct honor of presenting this formal invitation to ${letter.organization} to partner with our institution as an accredited Corporate & Educational Sponsor for the 2026/2027 fiscal and academic cycle.`;
  const splitP1 = doc.splitTextToSize(p1, contentWidth);
  doc.text(splitP1, margin, curY);
  curY += splitP1.length * 4.2 + 2;

  // Paragraph 2: Clinical Impact & Scope
  const p2 = `Pharma Star App Pro is Ethiopia's premier digital clinical pharmacy and molecular education platform, recognized by the Ethiopian Food and Drug Authority (EFDA) and the Ministry of Health (MoH). Our platform currently empowers over 25,000 certified healthcare practitioners—including clinical pharmacists, hospital druggists, resident physicians, and university interns—operating in tertiary teaching hospitals, regional referral hubs, and remote rural dispensaries across all 12 regional states.`;
  const splitP2 = doc.splitTextToSize(p2, contentWidth);
  doc.text(splitP2, margin, curY);
  curY += splitP2.length * 4.2 + 2;

  // Paragraph 3: Proposed Strategic Focus
  const p3 = `Through this proposed strategic partnership, ${letter.organization} will champion national capacity building in: ${letter.focusArea}. This includes underwritten access to accredited Continuing Professional Development (CPD) modules, 3D macromolecular drug mechanisms, Drug and Therapeutics Committee (DTC) ABC-VEN analyses, and rational antimicrobial stewardship (AMS) compliance.`;
  const splitP3 = doc.splitTextToSize(p3, contentWidth);
  doc.text(splitP3, margin, curY);
  curY += splitP3.length * 4.2 + 3;

  // Sponsorship Tier Table Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, curY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136);
  doc.text(`PROPOSED SPONSORSHIP TIER: ${letter.sponsorTier.toUpperCase()}`, margin + 4, curY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text(
    `Financial Commitment: ${letter.contributionETB.toLocaleString()} ETB  (or $${letter.contributionUSD.toLocaleString()} USD)`,
    margin + 4,
    curY + 11.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Key Entitlements: Facility-wide cohort access, lead educational co-branding on official CPD certificates,`,
    margin + 4,
    curY + 16.5
  );
  doc.text(
    `prominent positioning in national guideline circulars, and executive recognition at national hospital DTC conferences.`,
    margin + 4,
    curY + 20.5
  );

  curY += 28;

  // Remittance & Banking Details Strip
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(margin, curY, contentWidth, 12, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL SETTLEMENT CHANNELS (ETHIOPIAN MINISTRY OF FINANCE & EFDA REGISTERED):', margin + 3, curY + 4.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(13, 148, 136);
  doc.text(
    'CBE A/C: 1000262900367 (Dawid Aliyi)  |  Telebirr: 0982852778  |  CBE Birr: *847#  |  Chapa / Swift: PS-CHAPA-CORP',
    margin + 3,
    curY + 9
  );

  curY += 16;

  // Paragraph 4: Next Steps & Meeting Request
  const p4 = `We would be honored to arrange an executive bilateral session at your earliest convenience to formalize this collaboration and customize the implementation timeline for your corporate social responsibility and clinical outreach objectives.`;
  const splitP4 = doc.splitTextToSize(p4, contentWidth);
  doc.text(splitP4, margin, curY);
  curY += splitP4.length * 4.2 + 3;

  doc.text('Thank you for your visionary dedication to advancing the health and pharmaceutical sovereignty of Ethiopia.', margin, curY);

  curY += 9;

  // Signoff Block & Digital Seal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Respectfully submitted with highest clinical regards,', margin, curY);

  curY += 8;

  // Signature script
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text('Pharmacist Dawid Aliyi', margin + 5, curY);

  curY += 3;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(margin, curY, margin + 65, curY);

  curY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(letter.signatoryName, margin, curY);

  curY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(letter.signatoryTitle, margin, curY);
  doc.text('Directorate of Academic Affairs & Clinical Innovations', margin, curY + 3.8);
  doc.text('Pharma Star App Pro / Jaalibiddoo Health Informatics', margin, curY + 7.6);

  // Center/Right Stamp Seal
  const stampX = pageWidth - margin - 35;
  const stampY = curY - 2;

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.8);
  doc.circle(stampX, stampY, 14, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(180, 83, 9);
  doc.text('OFFICIAL SPONSORSHIP', stampX, stampY - 5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text('DIRECTORATE', stampX, stampY - 1, { align: 'center' });
  doc.text('VERIFIED SEAL', stampX, stampY + 3, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(180, 83, 9);
  doc.text('FDRE MoH / EFDA 2026', stampX, stampY + 7, { align: 'center' });

  // Bottom Footer Bar
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Official Dispatch Ref: ${letter.referenceNo}  •  Status: ${letter.status.toUpperCase()}  •  Generated: ${new Date().toISOString()}`,
    margin,
    pageHeight - 11
  );
  doc.text(
    'Pharmastar App Pro Enterprise Directorate  •  Addis Ababa, Ethiopia  •  Confidential & Privileged',
    pageWidth - margin,
    pageHeight - 11,
    { align: 'right' }
  );

  // Trigger Client-side download
  const cleanOrg = letter.organization.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const cleanRef = letter.referenceNo.replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`Formal_Sponsorship_Invitation_${cleanRef}_${cleanOrg}.pdf`);
};
