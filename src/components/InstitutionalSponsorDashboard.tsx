import React, { useState } from 'react';
import { 
  Building2, Users, Award, FileSpreadsheet, Download, 
  Printer, CheckCircle2, ShieldCheck, Search, Filter, 
  Plus, ExternalLink, QrCode, FileText, ChevronRight, 
  Clock, Zap, Wifi, WifiOff, Landmark, CreditCard, 
  Copy, Check, AlertCircle, Sparkles, Send, Eye
} from 'lucide-react';
import { User } from '../types';

interface InstitutionalCohort {
  id: string;
  name: string;
  institution: string;
  department: string;
  seatCount: number;
  activeEnrolled: number;
  avgCompletionRate: number;
  leadCoordinator: string;
  createdAt: string;
}

interface InstitutionalLearner {
  id: string;
  cohortId: string;
  fullName: string;
  licenseOrEmployeeId: string;
  officialEmail: string;
  role: 'Pharmacist' | 'Resident' | 'Intern' | 'Student' | 'Officer';
  modulesCompleted: number;
  totalModules: number;
  hoursActive: number;
  lastActive: string;
  certificateId?: string;
  status: 'Completed' | 'On-Track' | 'Behind' | 'Needs Attention';
}

interface VoucherBatch {
  id: string;
  tierName: string;
  quantity: number;
  unitPriceETB: number;
  totalPriceETB: number;
  cohortName: string;
  generatedCodes: string[];
  issuedAt: string;
  status: 'Active' | 'Redeemed' | 'Pending Bank Transfer';
}

interface InstitutionalSponsorDashboardProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
}

export const InstitutionalSponsorDashboard: React.FC<InstitutionalSponsorDashboardProps> = ({
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cohorts' | 'learners' | 'proforma' | 'verification' | 'low_bandwidth'>('overview');
  const [selectedCohortId, setSelectedCohortId] = useState<string>('all');
  const [learnerSearch, setLearnerSearch] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [verifiedCertificate, setVerifiedCertificate] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Low Bandwidth Mode Toggle for rural clinics / campuses
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pharmastar_low_bandwidth_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Seed Cohorts
  const [cohorts, setCohorts] = useState<InstitutionalCohort[]>([
    {
      id: 'cohort-1',
      name: 'Hawassa University Faculty - Batch 1',
      institution: 'Hawassa University College of Medicine & Health Sciences',
      department: 'Department of Pharmacy',
      seatCount: 65,
      activeEnrolled: 62,
      avgCompletionRate: 78,
      leadCoordinator: 'Dr. Tadesse Bekele (Dean of Pharmacy)',
      createdAt: '2026-09-15'
    },
    {
      id: 'cohort-2',
      name: 'Oromia Health Bureau - Arsi Zone Staff',
      institution: 'Oromia Regional Health Bureau',
      department: 'Pharmaceutical Supply Chain & Hospital Pharmacy Unit',
      seatCount: 120,
      activeEnrolled: 115,
      avgCompletionRate: 84,
      leadCoordinator: 'Sr. Pharmacist Gemechu Desta',
      createdAt: '2026-10-01'
    },
    {
      id: 'cohort-3',
      name: 'Tikur Anbessa Hospital - Clinical Pharmacy Residents',
      institution: 'Addis Ababa University / Tikur Anbessa Specialized Hospital',
      department: 'Clinical Pharmacy & Inpatient Care Division',
      seatCount: 40,
      activeEnrolled: 40,
      avgCompletionRate: 92,
      leadCoordinator: 'Dr. Helen Mengistu',
      createdAt: '2026-08-20'
    }
  ]);

  // Seed Learners
  const [learners, setLearners] = useState<InstitutionalLearner[]>([
    {
      id: 'lrn-101',
      cohortId: 'cohort-1',
      fullName: 'Abebe Kebede Tura',
      licenseOrEmployeeId: 'EFDA/PHA/2021/8942',
      officialEmail: 'abebe.k@hu.edu.et',
      role: 'Pharmacist',
      modulesCompleted: 12,
      totalModules: 12,
      hoursActive: 34.5,
      lastActive: '2026-10-29',
      certificateId: 'PS-CERT-ET-849201',
      status: 'Completed'
    },
    {
      id: 'lrn-102',
      cohortId: 'cohort-1',
      fullName: 'Chaltu Mohammed Idris',
      licenseOrEmployeeId: 'EFDA/PHA/2022/1042',
      officialEmail: 'chaltu.m@hu.edu.et',
      role: 'Pharmacist',
      modulesCompleted: 10,
      totalModules: 12,
      hoursActive: 28.0,
      lastActive: '2026-10-30',
      certificateId: 'PS-CERT-ET-849202',
      status: 'On-Track'
    },
    {
      id: 'lrn-103',
      cohortId: 'cohort-1',
      fullName: 'Biniyam Fikadu Haile',
      licenseOrEmployeeId: 'HU/STU/PH/9821',
      officialEmail: 'biniyam.f@hu.edu.et',
      role: 'Student',
      modulesCompleted: 4,
      totalModules: 12,
      hoursActive: 11.2,
      lastActive: '2026-10-24',
      status: 'Needs Attention'
    },
    {
      id: 'lrn-201',
      cohortId: 'cohort-2',
      fullName: 'Kenenisa Bedada Olana',
      licenseOrEmployeeId: 'ORHB/EMP/ARS/3391',
      officialEmail: 'kenenisa.b@orhb.gov.et',
      role: 'Officer',
      modulesCompleted: 12,
      totalModules: 12,
      hoursActive: 41.0,
      lastActive: '2026-10-28',
      certificateId: 'PS-CERT-ET-910442',
      status: 'Completed'
    },
    {
      id: 'lrn-202',
      cohortId: 'cohort-2',
      fullName: 'Fasika Tesfaye Alemu',
      licenseOrEmployeeId: 'ORHB/EMP/ARS/4420',
      officialEmail: 'fasika.t@orhb.gov.et',
      role: 'Pharmacist',
      modulesCompleted: 9,
      totalModules: 12,
      hoursActive: 24.5,
      lastActive: '2026-10-30',
      status: 'On-Track'
    },
    {
      id: 'lrn-301',
      cohortId: 'cohort-3',
      fullName: 'Dr. Selamawit Zeleke Worku',
      licenseOrEmployeeId: 'EFDA/CLIN/2019/3312',
      officialEmail: 'selamawit.z@aau.edu.et',
      role: 'Resident',
      modulesCompleted: 12,
      totalModules: 12,
      hoursActive: 48.2,
      lastActive: '2026-10-30',
      certificateId: 'PS-CERT-ET-771903',
      status: 'Completed'
    }
  ]);

  // Proforma State for Bureaucratic Institutional Procurement
  const [proformaInstitution, setProformaInstitution] = useState('Oromia Regional Health Bureau');
  const [proformaDeanOrDirector, setProformaDeanOrDirector] = useState('Dr. Tolessa Dibaba, Bureau Head');
  const [proformaTier, setProformaTier] = useState<'vouchers' | 'annual' | 'co_funded'>('vouchers');
  const [proformaQuantity, setProformaQuantity] = useState<number>(200);
  const [proformaGeneratedDate, setProformaGeneratedDate] = useState('2026-10-30');
  const [proformaRefNumber, setProformaRefNumber] = useState('PRF-ET-2026-0941');

  // Toggle Low Bandwidth
  const handleToggleLowBandwidth = () => {
    const nextVal = !isLowBandwidthMode;
    setIsLowBandwidthMode(nextVal);
    try {
      localStorage.setItem('pharmastar_low_bandwidth_mode', String(nextVal));
    } catch {
      // ignore
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const filteredLearners = selectedCohortId === 'all'
      ? learners
      : learners.filter(l => l.cohortId === selectedCohortId);

    const headers = ["Learner ID", "Full Name", "Employee/License ID", "Official Email", "Cohort Name", "Role", "Modules Completed", "Total Modules", "Completion %", "Active Hours", "Last Active", "Certificate ID", "Audit Status"];
    
    const rows = filteredLearners.map(l => {
      const cohort = cohorts.find(c => c.id === l.cohortId)?.name || 'Unknown Cohort';
      const pct = Math.round((l.modulesCompleted / l.totalModules) * 100);
      return [
        l.id,
        `"${l.fullName}"`,
        `"${l.licenseOrEmployeeId}"`,
        l.officialEmail,
        `"${cohort}"`,
        l.role,
        l.modulesCompleted,
        l.totalModules,
        `${pct}%`,
        l.hoursActive,
        l.lastActive,
        l.certificateId || 'N/A',
        l.status
      ].join(',');
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PharmaStar_Institutional_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Formal Institutional Audit Report
  const handlePrintAuditReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const filteredLearners = selectedCohortId === 'all'
      ? learners
      : learners.filter(l => l.cohortId === selectedCohortId);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Institutional Audit & Compliance Report - Pharma Star</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #0f172a; }
            .header { border-bottom: 3px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 24px; font-weight: bold; color: #0f766e; }
            .meta { font-size: 12px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px; }
            th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 6px; text-align: left; font-weight: bold; color: #1e293b; }
            td { border: 1px solid #cbd5e1; padding: 6px; }
            .status-badge { font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px; display: inline-block; }
            .Completed { background: #dcfce7; color: #15803d; }
            .On-Track { background: #e0f2fe; color: #0369a1; }
            .Needs-Attention { background: #fee2e2; color: #b91c1c; }
            .footer { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; }
            .seal { border: 2px solid #0d9488; border-radius: 50%; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; font-size: 10px; text-align: center; color: #0d9488; font-weight: bold; margin-left: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">PHARMA STAR APP PRO — ENTERPRISE B2B SAAS</div>
              <div style="font-size: 14px; font-weight: 600; color: #334155; margin-top: 3px;">
                Institutional Learner Audit & Ministry / University Compliance Record
              </div>
            </div>
            <div class="meta" style="text-align: right;">
              <div>Report Date: ${new Date().toLocaleDateString()}</div>
              <div>Audit Scope: ${selectedCohortId === 'all' ? 'All Institutional Cohorts' : cohorts.find(c => c.id === selectedCohortId)?.name}</div>
              <div>Author: Pharmacist Dawid Aliyi</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Learner Name</th>
                <th>Professional License / ID</th>
                <th>Official Email</th>
                <th>Track / Role</th>
                <th>Modules</th>
                <th>Progress %</th>
                <th>Active Hours</th>
                <th>Certificate ID</th>
                <th>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLearners.map(l => `
                <tr>
                  <td><strong>${l.fullName}</strong></td>
                  <td style="font-family: monospace;">${l.licenseOrEmployeeId}</td>
                  <td>${l.officialEmail}</td>
                  <td>${l.role}</td>
                  <td>${l.modulesCompleted} / ${l.totalModules}</td>
                  <td><strong>${Math.round((l.modulesCompleted / l.totalModules) * 100)}%</strong></td>
                  <td>${l.hoursActive} hrs</td>
                  <td style="font-family: monospace; color: #0f766e;">${l.certificateId || 'In Progress'}</td>
                  <td><span class="status-badge ${l.status.replace(' ', '-')}">${l.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <p><strong>Verification Standard:</strong> Aligned with Ethiopian MoH / EFDA Continuous Professional Development (CPD) Directives.</p>
              <p>Pharma Star Enterprise Support: jaalibiddoo@gmail.com | 0982852778 | Addis Ababa, Ethiopia</p>
            </div>
            <div class="seal">
              PHARMA STAR<br>AUDIT<br>VERIFIED
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Print Formal Ethiopian Proforma Invoice
  const handlePrintProformaInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let tierLabel = 'Per-Seat Bulk Voucher Access Package';
    let unitRate = 60;
    let totalETB = proformaQuantity * unitRate;

    if (proformaTier === 'annual') {
      tierLabel = 'Campus-Wide Annual Institutional License (Unlimited Access)';
      unitRate = 25000;
      totalETB = 25000;
    } else if (proformaTier === 'co_funded') {
      tierLabel = 'Foundation / Ministry Co-Funded Platform Subsidy Tier';
      unitRate = 50000;
      totalETB = 50000;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Proforma Invoice - ${proformaRefNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.4; }
            .invoice-box { max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1; padding: 35px; border-radius: 8px; }
            .header-table { width: 100%; margin-bottom: 25px; }
            .title { font-size: 26px; font-weight: bold; color: #0d9488; }
            .proforma-badge { display: inline-block; background: #0d9488; color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 12px; margin-top: 5px; }
            .grid-2 { display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 13px; }
            .box-seller, .box-buyer { width: 48%; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; background: #f8fafc; }
            .box-title { font-weight: bold; color: #0f766e; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 8px; }
            table.items { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            table.items th { background: #0f766e; color: #fff; padding: 10px; text-align: left; }
            table.items td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .totals { margin-top: 20px; text-align: right; font-size: 14px; }
            .bank-info { margin-top: 30px; border: 2px dashed #0d9488; padding: 15px; border-radius: 8px; background: #f0fdfa; font-size: 13px; }
            .signature-block { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 30px; border-top: 1px solid #cbd5e1; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table class="header-table">
              <tr>
                <td>
                  <div class="title">PHARMA STAR APP PRO</div>
                  <div style="font-size: 13px; color: #64748b;">Enterprise Clinical Pharmacy & Medical Learning SaaS</div>
                  <div class="proforma-badge">FORMAL PROFORMA INVOICE</div>
                </td>
                <td style="text-align: right; font-size: 13px;">
                  <div><strong>Proforma No:</strong> ${proformaRefNumber}</div>
                  <div><strong>Date:</strong> ${proformaGeneratedDate}</div>
                  <div><strong>Validity:</strong> 60 Calendar Days</div>
                  <div><strong>TIN:</strong> 0072918462</div>
                </td>
              </tr>
            </table>

            <div class="grid-2">
              <div class="box-seller">
                <div class="box-title">SUPPLIER / SERVICE PROVIDER:</div>
                <div><strong>Pharma Star Healthcare Solutions</strong></div>
                <div>Principal: Pharmacist Dawid Aliyi</div>
                <div>Contact: +251 982 852 778 | jaalibiddoo@gmail.com</div>
                <div>Bank: Commercial Bank of Ethiopia (CBE)</div>
                <div>Location: Addis Ababa, Ethiopia</div>
              </div>

              <div class="box-buyer">
                <div class="box-title">PROPOSED INSTITUTION / CLIENT:</div>
                <div><strong>${proformaInstitution}</strong></div>
                <div>Attn: ${proformaDeanOrDirector}</div>
                <div>Procurement Type: Institutional Subscription / Bulk Vouchers</div>
                <div>Terms: Formal Bank Transfer / Purchase Order (PO)</div>
              </div>
            </div>

            <table class="items">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Description of Service & Deliverables</th>
                  <th>Quantity / Seats</th>
                  <th>Unit Price (ETB)</th>
                  <th>Total Amount (ETB)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <strong>${tierLabel}</strong><br>
                    <span style="font-size: 11px; color: #475569;">
                      Includes Sponsor Dashboard, Cohort Management, Automated Audit Reporting,
                      Low-Bandwidth Mode Sync, and Verifiable Digital Certificates.
                    </span>
                  </td>
                  <td>${proformaTier === 'vouchers' ? proformaQuantity : '1 Campus'}</td>
                  <td>${unitRate.toLocaleString()} ETB</td>
                  <td><strong>${totalETB.toLocaleString()} ETB</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="totals">
              <div>Subtotal: <strong>${totalETB.toLocaleString()} ETB</strong></div>
              <div>Institutional Discount Applied: <strong>0.00 ETB</strong></div>
              <div style="font-size: 18px; color: #0d9488; font-weight: bold; margin-top: 6px;">
                TOTAL CONTRACT PAYABLE: ${totalETB.toLocaleString()} ETB (Birr)
              </div>
            </div>

            <div class="bank-info">
              <strong>Official Ethiopian Banking Details for Institutional Settlement:</strong><br>
              Bank Name: <strong>Commercial Bank of Ethiopia (CBE)</strong><br>
              Account Number: <strong style="font-size: 15px; color: #0f766e;">1000262900367</strong><br>
              Account Name: <strong>Dawid Aliyi</strong><br>
              Branch: Addis Ababa Central Branch • Chapa & Telebirr Institutional API Gateway Ready
            </div>

            <div class="signature-block">
              <div>
                <p>Prepared By:</p>
                <p><strong>Pharmacist Dawid Aliyi</strong><br>Founder & Lead Clinical Developer<br>Pharma Star App Pro</p>
              </div>
              <div style="text-align: right;">
                <p>Approved & Received By (Institutional Sponsor):</p>
                <p>_____________________________________<br>Stamp & Signature<br>Date: _______________</p>
              </div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Certificate Verification Lookup
  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;

    const query = verificationInput.trim().toUpperCase();
    const found = learners.find(l => l.certificateId?.toUpperCase() === query);

    if (found) {
      const cohort = cohorts.find(c => c.id === found.cohortId);
      setVerifiedCertificate({
        certificateId: found.certificateId,
        learnerName: found.fullName,
        licenseId: found.licenseOrEmployeeId,
        officialEmail: found.officialEmail,
        institution: cohort?.institution || 'Ministry of Health Accredited Partner',
        cohortName: cohort?.name || 'CPD Cohort',
        modulesCompleted: found.modulesCompleted,
        hoursActive: found.hoursActive,
        issuedDate: found.lastActive,
        accreditation: 'EFDA / Ethiopian MoH Continuous Professional Development Directive 2026',
        isValid: true
      });
    } else {
      setVerifiedCertificate({
        certificateId: query,
        isValid: false
      });
    }
  };

  const filteredLearners = learners.filter(l => {
    const matchCohort = selectedCohortId === 'all' || l.cohortId === selectedCohortId;
    const matchQuery = l.fullName.toLowerCase().includes(learnerSearch.toLowerCase()) ||
                       l.licenseOrEmployeeId.toLowerCase().includes(learnerSearch.toLowerCase()) ||
                       l.officialEmail.toLowerCase().includes(learnerSearch.toLowerCase());
    return matchCohort && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Enterprise SaaS Transformation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Enterprise B2B SaaS Sponsor Dashboard
              </span>
              <span className="text-xs text-slate-400">Institutional Governance & Automated Auditing</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Ministry, University Dean & Regional Bureau Audit Command
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Equip institutional sponsors to manage cohorts, track real-time visual progress, export automated audit compliance reports, generate formal Ethiopian proforma invoices, and verify certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Low-Bandwidth Mode Toggle Button */}
            <button
              onClick={handleToggleLowBandwidth}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer border ${
                isLowBandwidthMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
              title="Prioritizes text transcripts and audio tracks for rural spotty 3G connections"
            >
              {isLowBandwidthMode ? (
                <>
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <span>Low-Bandwidth (2G/3G) Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-teal-400" />
                  <span>Standard HD Bandwidth</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV Audit</span>
            </button>

            <button
              onClick={handlePrintAuditReport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Formal Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Strategic Pricing & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('cohorts')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'cohorts'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Cohort Hierarchy ({cohorts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('learners')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'learners'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Real-Time Learner Progress ({learners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proforma')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'proforma'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Proforma Invoice Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'verification'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Certificate Verification Portal</span>
        </button>
      </div>

      {/* VIEW 1: Strategic Pricing Models & Executive Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Sponsored Cohorts</span>
              <span className="text-2xl font-bold text-white mt-1 block">3 Organizations</span>
              <span className="text-[10px] text-teal-400 mt-0.5 block">AAU, Hawassa & Oromia Health</span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Active Seats</span>
              <span className="text-2xl font-bold text-teal-300 mt-1 block">225 Learners</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">96.8% Seat Utilization Rate</span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Average Completion</span>
              <span className="text-2xl font-bold text-emerald-300 mt-1 block">84.6%</span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Exceeds MoH 75% CPD Threshold</span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Active Study Hours Tracked</span>
              <span className="text-2xl font-bold text-amber-300 mt-1 block">187.2 Hours</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Audited for Official License CEUs</span>
            </div>
          </div>

          {/* Strategic Pricing Models Table */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Institutional Procurement Architecture
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Government & University Aligned Pricing Tiers
              </h3>
              <p className="text-xs text-slate-400">
                Designed to integrate directly into traditional Ethiopian regional bureau purchase orders, university department budgets, and foundation grant cycles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1: Bulk Voucher */}
              <div className="bg-slate-950 p-5 rounded-xl border border-teal-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                      Tier 1
                    </span>
                    <span className="text-[11px] text-slate-400">Volume Discount</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Per-Seat Bulk Voucher</h4>
                  <div className="text-xl font-bold text-teal-300">50 - 60 ETB <span className="text-xs font-normal text-slate-400">/ seat</span></div>
                  <p className="text-xs text-slate-300">
                    Sponsor purchases a block of unique single-use access codes (e.g., 50 to 500 vouchers).
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Best for Regional Health Bureaus</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Private health colleges training batches</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Instant CSV voucher code generation</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setProformaTier('vouchers');
                    setActiveTab('proforma');
                  }}
                  className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Generate Bulk Proforma
                </button>
              </div>

              {/* Tier 2: Annual License */}
              <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      Tier 2
                    </span>
                    <span className="text-[11px] text-slate-400">Campus-Wide</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Annual Institutional License</h4>
                  <div className="text-xl font-bold text-purple-300">25,000 ETB <span className="text-xs font-normal text-slate-400">/ year</span></div>
                  <p className="text-xs text-slate-300">
                    Flat annual fee for unlimited access restricted to all users authenticating with official university emails.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Auto-matches domains: @hu.edu.et, @aau.edu.et</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Unlimited faculty and undergraduate access</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Automated semester cohort tracking</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setProformaTier('annual');
                    setActiveTab('proforma');
                  }}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Generate Campus Proforma
                </button>
              </div>

              {/* Tier 3: Co-Funded Model */}
              <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      Tier 3
                    </span>
                    <span className="text-[11px] text-slate-400">Freemium Grant</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Co-Funded Foundation Subsidy</h4>
                  <div className="text-xl font-bold text-amber-300">Custom Grant <span className="text-xs font-normal text-slate-400">/ Flat Fee</span></div>
                  <p className="text-xs text-slate-300">
                    The core web platform remains 100% free for users, while an international development partner or pharmaceutical sponsor subsidizes it.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Prominent institutional co-branding</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Comprehensive national workforce analytics</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Rapid scale across all 12 regional states</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setProformaTier('co_funded');
                    setActiveTab('proforma');
                  }}
                  className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Generate Grant Proforma
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Cohorts Management */}
      {activeTab === 'cohorts' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Active Institutional Cohorts</h3>
              <p className="text-xs text-slate-400">
                Segment learners by academic batch, clinical hospital department, or zonal health office.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cohorts.map(c => (
              <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-bold">
                    {c.activeEnrolled}/{c.seatCount} Seats
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{c.institution}</p>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div>Department: <strong className="text-slate-200">{c.department}</strong></div>
                  <div>Lead: <strong className="text-slate-200">{c.leadCoordinator}</strong></div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Cohort Progress:</span>
                    <span className="font-bold text-teal-300">{c.avgCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${c.avgCompletionRate}%` }}></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCohortId(c.id);
                    setActiveTab('learners');
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs font-semibold border border-slate-800 hover:border-teal-500 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>View Enrolled Staff</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Real-Time Learner Progress & Audit Table */}
      {activeTab === 'learners' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Learner Audit & Visual Progress Tracking</h3>
              <p className="text-xs text-slate-400">
                Visual completion bars and exact logged active hours for each health professional.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCohortId}
                onChange={(e) => setSelectedCohortId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Cohorts ({cohorts.length})</option>
                {cohorts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter name, license #..."
                  value={learnerSearch}
                  onChange={(e) => setLearnerSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Learner & License ID</th>
                  <th className="p-3">Cohort</th>
                  <th className="p-3">Visual Module Progress</th>
                  <th className="p-3">Active Hours</th>
                  <th className="p-3">Certificate ID</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {filteredLearners.map(l => {
                  const pct = Math.round((l.modulesCompleted / l.totalModules) * 100);
                  const cohortName = cohorts.find(c => c.id === l.cohortId)?.name || 'General';

                  return (
                    <tr key={l.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-3 space-y-0.5">
                        <div className="font-bold text-white text-xs">{l.fullName}</div>
                        <div className="text-[10px] text-teal-400 font-mono">{l.licenseOrEmployeeId}</div>
                        <div className="text-[10px] text-slate-500">{l.officialEmail}</div>
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">
                        {cohortName}
                      </td>
                      <td className="p-3 space-y-1 min-w-[140px]">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">{l.modulesCompleted} of {l.totalModules} modules</span>
                          <span className="font-bold text-teal-300">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-teal-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 font-mono text-[11px]">
                        {l.hoursActive} hrs
                      </td>
                      <td className="p-3 font-mono text-teal-400 text-[11px]">
                        {l.certificateId || (
                          <span className="text-slate-500 text-[10px] italic">In Progress</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : l.status === 'On-Track'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: Proforma Invoice Generator */}
      {activeTab === 'proforma' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Ethiopian Institutional Proforma Invoice Generator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                  Formal Procurement Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Directly outputs official quotation documentation for government purchase orders and bank transfers.
              </p>
            </div>

            <button
              onClick={handlePrintProformaInvoice}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Proforma Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Institution Name</label>
              <input
                type="text"
                value={proformaInstitution}
                onChange={(e) => setProformaInstitution(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Attention (Dean or Bureau Head)</label>
              <input
                type="text"
                value={proformaDeanOrDirector}
                onChange={(e) => setProformaDeanOrDirector(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Pricing Model</label>
              <select
                value={proformaTier}
                onChange={(e) => setProformaTier(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="vouchers">Per-Seat Bulk Vouchers (60 ETB/seat)</option>
                <option value="annual">Annual Institutional License (25,000 ETB)</option>
                <option value="co_funded">Co-Funded Foundation Subsidy (50,000 ETB)</option>
              </select>
            </div>

            {proformaTier === 'vouchers' && (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Number of Voucher Seats</label>
                <input
                  type="number"
                  min="20"
                  step="10"
                  value={proformaQuantity}
                  onChange={(e) => setProformaQuantity(parseInt(e.target.value, 10) || 50)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Proforma Ref Number</label>
              <input
                type="text"
                value={proformaRefNumber}
                onChange={(e) => setProformaRefNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Quotation Date</label>
              <input
                type="date"
                value={proformaGeneratedDate}
                onChange={(e) => setProformaGeneratedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400">Calculated Institutional Total</span>
              <div className="text-xl font-bold text-white mt-0.5">
                {proformaTier === 'vouchers'
                  ? `${(proformaQuantity * 60).toLocaleString()} ETB`
                  : proformaTier === 'annual'
                  ? '25,000 ETB'
                  : '50,000 ETB'}
              </div>
              <p className="text-[11px] text-slate-400">
                Payment Channel: Commercial Bank of Ethiopia (CBE) 1000262900367 (Dawid Aliyi)
              </p>
            </div>

            <button
              onClick={handlePrintProformaInvoice}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Document</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 5: Public Verifiable Certificate Portal */}
      {activeTab === 'verification' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-teal-400" />
              <span>Public Certificate Verification Portal</span>
            </h3>
            <p className="text-xs text-slate-400">
              Institutional HR departments, university deans, or regulatory boards can instantly verify certificate authenticity without logging in.
            </p>
          </div>

          <form onSubmit={handleVerifyCertificate} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Enter Certificate ID (e.g. PS-CERT-ET-849201)"
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Verify
            </button>
          </form>

          {verifiedCertificate && (
            <div className={`p-5 rounded-2xl border ${
              verifiedCertificate.isValid
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-rose-950/20 border-rose-500/40'
            }`}>
              {verifiedCertificate.isValid ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Official Verified Certificate Found</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div>Recipient: <strong className="text-white">{verifiedCertificate.learnerName}</strong></div>
                    <div>License / ID: <span className="font-mono text-teal-300">{verifiedCertificate.licenseId}</span></div>
                    <div>Institutional Sponsor: <strong className="text-white">{verifiedCertificate.institution}</strong></div>
                    <div>Cohort Track: <strong className="text-white">{verifiedCertificate.cohortName}</strong></div>
                    <div>Completion Date: <span className="text-slate-400">{verifiedCertificate.issuedDate}</span></div>
                    <div>Hours Logged: <strong className="text-teal-300">{verifiedCertificate.hoursActive} hours</strong></div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200">
                    ✓ Recognized under {verifiedCertificate.accreditation}. Suitable for Ethiopian license renewal and academic credits.
                  </div>
                </div>
              ) : (
                <div className="text-rose-300 flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Certificate ID "{verifiedCertificate.certificateId}" could not be verified in the national registry.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
