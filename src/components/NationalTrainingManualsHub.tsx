import React, { useState } from 'react';
import { 
  BookOpen, FileText, CheckCircle2, Download, Printer, 
  Search, Filter, ShieldCheck, Award, Building2, ChevronRight, 
  Sparkles, ExternalLink, Bookmark, Check, Copy, Info, 
  AlertCircle, Stethoscope, Truck, Baby, Layers
} from 'lucide-react';

interface TrainingManual {
  id: string;
  title: string;
  shortCode: string;
  category: 'Clinical Pharmacotherapy' | 'Regulatory & GDP' | 'Infectious Diseases' | 'Logistics & Supply Chain' | 'MCH & Pediatrics';
  issuingBody: string;
  edition: string;
  publicationYear: string;
  totalChapters: number;
  cpdAccreditationPoints: number;
  targetAudience: string;
  summary: string;
  coreCompetencies: string[];
  keyChapters: Array<{
    number: number;
    title: string;
    clinicalFocus: string;
    actionProtocol: string;
  }>;
}

export const NationalTrainingManualsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedManualId, setSelectedManualId] = useState<string>('manual-stg');
  const [completedCompetencies, setCompletedCompetencies] = useState<Record<string, boolean>>({});
  const [copiedChapter, setCopiedChapter] = useState<string | null>(null);

  const trainingManuals: TrainingManual[] = [
    {
      id: 'manual-stg',
      title: 'Ethiopian National Standard Treatment Guidelines (STG) for General Hospitals',
      shortCode: 'STG-GH-2026',
      category: 'Clinical Pharmacotherapy',
      issuingBody: 'Ethiopian Food and Drug Authority (EFDA) & Ministry of Health (MoH)',
      edition: '5th Comprehensive Edition',
      publicationYear: '2026',
      totalChapters: 22,
      cpdAccreditationPoints: 15,
      targetAudience: 'Physicians, Clinical Pharmacists, Health Officers, and Residents',
      summary: 'The statutory clinical authority for evidence-based therapeutics across Ethiopian general and specialized hospitals. Defines first-, second-, and third-line pharmacotherapy aligned with the Ethiopian National Essential Medicines List (NEML).',
      coreCompetencies: [
        'Selects evidence-based empiric antimicrobial regimens based on local microbiology antbiograms.',
        'Adjusts medication dosages in renal impairment (Cockcroft-Gault CrCl) and hepatic cirrhosis.',
        'Applies step-wise management of Cardiovascular, Respiratory, and Endocrine non-communicable diseases.',
        'Adheres to national drug-safety monitoring and spontaneous ADR reporting to EFDA.'
      ],
      keyChapters: [
        {
          number: 1,
          title: 'Infectious Diseases & Sepsis Resuscitation',
          clinicalFocus: 'Bacterial meningitis, severe pneumonia (CURB-65 ≥ 3), and septic shock.',
          actionProtocol: 'Administer empiric broad-spectrum Ceftriaxone 2g IV Q12H + Vancomycin within 1 hour of recognition. Fluid resuscitation 30 mL/kg crystalloids.'
        },
        {
          number: 2,
          title: 'Cardiovascular Emergencies & Heart Failure',
          clinicalFocus: 'Acute decompensated heart failure (ADHF) and Hypertensive crisis.',
          actionProtocol: 'IV Furosemide at 1-2.5x oral maintenance dose. Titrate IV Nitroglycerin for acute pulmonary edema with SBP > 140 mmHg. Avoid NSAIDs.'
        },
        {
          number: 3,
          title: 'Endocrine & Metabolic Disorders',
          clinicalFocus: 'Diabetic Ketoacidosis (DKA) and Hyperosmolar Hyperglycemic State (HHS).',
          actionProtocol: 'Regular Insulin IV infusion 0.1 units/kg/h after fluid rehydration. Maintain serum K+ 4.0 - 5.0 mEq/L before starting insulin.'
        },
        {
          number: 4,
          title: 'Renal Pharmacotherapy & Dialysis Dosing',
          clinicalFocus: 'Acute Kidney Injury (KDIGO criteria) and End-Stage Renal Disease (ESRD).',
          actionProtocol: 'Discontinue nephrotoxic agents (NSAIDs, Aminoglycosides). Calculate CrCl prior to prescribing renally eliminated beta-lactams and DOACs.'
        }
      ]
    },
    {
      id: 'manual-gdp',
      title: 'Good Dispensing Practice (GDP) National Training Manual & Standard Operating Procedures',
      shortCode: 'EFDA-GDP-2026',
      category: 'Regulatory & GDP',
      issuingBody: 'Ethiopian Food and Drug Authority (EFDA)',
      edition: '3rd Revised Regulatory Edition',
      publicationYear: '2026',
      totalChapters: 12,
      cpdAccreditationPoints: 10,
      targetAudience: 'Licensed Pharmacists, Druggists, and Pharmacy Technicians',
      summary: 'Mandatory standard governing the receipt, interpretation, dispensing, counseling, and packaging of pharmaceuticals in outpatient, inpatient, and community pharmacy settings in Ethiopia.',
      coreCompetencies: [
        'Performs systematic 5-step prescription review to identify dosing errors, drug interactions, and contraindications.',
        'Applies proper labeling requirements including auxiliary cautionary pictograms ("FOR EXTERNAL USE ONLY").',
        'Implements effective, language-appropriate patient medication counseling using the Three Prime Questions method.',
        'Maintains strict control and recording of Narcotic and Psychotropic substances per EFDA registers.'
      ],
      keyChapters: [
        {
          number: 1,
          title: 'Prescription Verification & Regulatory Audit',
          clinicalFocus: 'Detection of fraudulent prescriptions, illegible handwriting, and missing prescriber credentials.',
          actionProtocol: 'Confirm Prescriber License number, date, patient age, drug generic name, strength, dosage form, and total quantity in words and numbers.'
        },
        {
          number: 2,
          title: 'Extemporaneous Compounding & Packaging (BP Standards)',
          clinicalFocus: 'Topical ointments, oral suspensions, and beyond-use date assignment.',
          actionProtocol: 'Use clean calibrated balances. Label with clear beyond-use date (BUD). Affix red warning label for non-oral preparations.'
        },
        {
          number: 3,
          title: 'Effective Patient Counseling & Adherence Strategy',
          clinicalFocus: 'Communication barriers, chronic disease medication counseling, and device demonstrations (MDI, Insulin).',
          actionProtocol: 'Utilize Three Prime Questions: 1. What did your doctor tell you this is for? 2. How did they tell you to take it? 3. What were you told to expect?'
        }
      ]
    },
    {
      id: 'manual-ams',
      title: 'National Antimicrobial Stewardship (AMS) Program Implementation Manual',
      shortCode: 'AMS-ETH-2026',
      category: 'Infectious Diseases',
      issuingBody: 'Ministry of Health Ethiopia, Africa CDC & WHO Country Office',
      edition: 'National Core Guidelines Edition',
      publicationYear: '2026',
      totalChapters: 10,
      cpdAccreditationPoints: 15,
      targetAudience: 'Hospital AMS Committees, Clinical Pharmacists, Microbiologists, Infectious Disease Physicians',
      summary: 'National framework to curb antimicrobial resistance (AMR) in Ethiopia. Defines the WHO AWaRe classification (Access, Watch, Reserve) and pre-authorization protocols for critical reserve antibiotics.',
      coreCompetencies: [
        'Audits inpatient antimicrobial prescriptions using Day-3 Post-Prescription Review (PPR) nomograms.',
        'Enforces restricted access and pre-authorization for Reserve antibiotics (Meropenem, Vancomycin, Colistin).',
        'Implements IV-to-Oral switch criteria to reduce hospital length of stay and line infections.',
        'Tracks hospital Defined Daily Doses (DDD) per 100 bed-days and cumulative resistance trends.'
      ],
      keyChapters: [
        {
          number: 1,
          title: 'WHO AWaRe Classification in Ethiopian Hospitals',
          clinicalFocus: 'Stratification of antibiotics into Access, Watch, and Reserve categories.',
          actionProtocol: 'Prioritize Access antibiotics (Amoxicillin, Cloxacillin, Doxycycline) for 60%+ of total hospital consumption.'
        },
        {
          number: 2,
          title: 'Day-3 Antimicrobial Post-Prescription Review (PPR)',
          clinicalFocus: 'Evaluation of culture and susceptibility results at 48–72 hours.',
          actionProtocol: 'De-escalate broad-spectrum empiric antibiotics to narrow-spectrum targeted agent. Stop therapy if non-infectious etiology identified.'
        },
        {
          number: 3,
          title: 'Surgical Antibiotic Prophylaxis (SAP) Optimization',
          clinicalFocus: 'Single-dose preoperative antibiotic timing and redosing rules.',
          actionProtocol: 'Administer Cefazolin 2g IV within 60 minutes prior to surgical incision. Discontinue within 24 hours post-operatively.'
        }
      ]
    },
    {
      id: 'manual-ipls',
      title: 'Integrated Pharmaceuticals Logistics System (IPLS) Standard Operating Procedures Manual',
      shortCode: 'IPLS-EPSS-2026',
      category: 'Logistics & Supply Chain',
      issuingBody: 'Ethiopian Pharmaceuticals Supply Service (EPSS) & MoH',
      edition: '4th Edition (Digital SOP Integrated)',
      publicationYear: '2026',
      totalChapters: 8,
      cpdAccreditationPoints: 10,
      targetAudience: 'Hospital Pharmacy Heads, Store Managers, Health Center Logisticians',
      summary: 'Standardizes the recording, reporting, requisitioning, and storage of essential health commodities across all tiers of the Ethiopian supply chain from EPSS central hubs to health post dispensaries.',
      coreCompetencies: [
        'Maintains accurate Stock Cards and Bin Cards with 100% physical inventory reconciliation.',
        'Calculates Maximum-Minimum stock levels, Consumption Rates, and Lead Time Requisitions.',
        'Generates Internal Facility Report and Requisition (IFRR) and Report & Requisition Form (RRF).',
        'Enforces First-Expiry-First-Out (FEFO) and Good Storage Practices (cold chain maintenance).'
      ],
      keyChapters: [
        {
          number: 1,
          title: 'Stock Records & Bin Card Management',
          clinicalFocus: 'Daily recording of receipts, issues, losses, and adjustments.',
          actionProtocol: 'One bin card per product, strength, dosage form, and lot number. Record immediately upon transaction.'
        },
        {
          number: 2,
          title: 'Bimonthly RRF Requisitioning Calculation',
          clinicalFocus: 'Calculating order quantities to prevent stockouts and overstock wastage.',
          actionProtocol: 'Order Quantity = Maximum Stock Level (4 months) - Stock on Hand - Stock on Order + Losses/Adjustments.'
        },
        {
          number: 3,
          title: 'Cold Chain Management for Vaccines & Biologics',
          clinicalFocus: 'Storage at +2°C to +8°C with twice-daily temperature logging.',
          actionProtocol: 'Monitor digital data logger. Activate emergency contingency plan (dry ice / backup generator) if temp > 8°C for > 60 minutes.'
        }
      ]
    },
    {
      id: 'manual-tb-leprosy',
      title: 'National Tuberculosis and Leprosy Clinical Management & Prevention Training Manual',
      shortCode: 'NTP-ALERT-2026',
      category: 'Infectious Diseases',
      issuingBody: 'National TB & Leprosy Program (NTP), ALERT Center & MoH',
      edition: '8th Clinical Practice Edition',
      publicationYear: '2026',
      totalChapters: 14,
      cpdAccreditationPoints: 12,
      targetAudience: 'TB Focal Pharmacists, Clinicians, Nurses, and Public Health Officers',
      summary: 'Comprehensive guidelines for GeneXpert molecular diagnosis, directly observed therapy (DOTS), Multi-Drug Resistant TB (MDR-TB) Bedaquiline regimens, and WHO Leprosy multi-drug therapy in Ethiopia.',
      coreCompetencies: [
        'Interprets GeneXpert MTB/RIF assay results and initiates weight-banded Fixed-Dose Combination (FDC) therapy.',
        'Manages second-line oral regimens (Bedaquiline, Linezolid, Clofazimine) for Rifampicin-Resistant TB.',
        'Diagnoses and treats Leprosy (Paucibacillary and Multibacillary) using Rifampicin, Dapsone, and Clofazimine.',
        'Monitors adverse drug reactions (hepatotoxicity, peripheral neuropathy, optic neuritis) and manages drug-drug interactions with ART.'
      ],
      keyChapters: [
        {
          number: 1,
          title: 'First-Line TB Regimens & Fixed-Dose Combinations',
          clinicalFocus: '2RHZE / 4RH weight-banded dosing for drug-susceptible pulmonary and extrapulmonary TB.',
          actionProtocol: 'Administer 4-FDC tablets (Rifampicin, Isoniazid, Pyrazinamide, Ethambutol) on empty stomach. Add Pyridoxine (Vitamin B6) 25-50mg daily to prevent neuropathy.'
        },
        {
          number: 2,
          title: 'WHO Leprosy Multi-Drug Therapy (MDT)',
          clinicalFocus: 'Paucibacillary (1-5 lesions) vs Multibacillary (>5 lesions or nerve thickening).',
          actionProtocol: 'Multibacillary: Rifampicin 600mg monthly (supervised) + Clofazimine 300mg monthly (supervised) + Clofazimine 50mg daily + Dapsone 100mg daily for 12 months.'
        }
      ]
    },
    {
      id: 'manual-imnci',
      title: 'Integrated Management of Newborn and Childhood Illness (IMNCI) Clinical Training Manual',
      shortCode: 'IMNCI-MOH-2026',
      category: 'MCH & Pediatrics',
      issuingBody: 'Ministry of Health Ethiopia & UNICEF / WHO',
      edition: 'National Integrated Pediatric Edition',
      publicationYear: '2026',
      totalChapters: 16,
      cpdAccreditationPoints: 15,
      targetAudience: 'Pediatric Pharmacists, Health Officers, General Practitioners, and Midwives',
      summary: 'Integrated clinical algorithm for assessing, classifying, and treating sick children aged 0 to 5 years presenting with cough, diarrhea, fever, ear problems, severe acute malnutrition, and neonatal sepsis.',
      coreCompetencies: [
        'Identifies General Danger Signs in sick children requiring immediate emergency referral.',
        'Classifies respiratory infections using fast breathing thresholds and chest indrawing criteria.',
        'Calculates pediatric rehydration plans (Plan A, Plan B, and Plan C) and Zinc co-prescription for acute diarrhea.',
        'Determines exact weight-based pediatric dosing for Amoxicillin dispersible tablets, Artesunate, and Ceftriaxone.'
      ],
      keyChapters: [
        {
          number: 1,
          title: 'Assessment of General Danger Signs',
          clinicalFocus: 'Unable to drink/breastfeed, vomiting everything, convulsions, lethargy/unconsciousness.',
          actionProtocol: 'Administer first dose of IM Ampicillin (50 mg/kg) + Gentamicin (7.5 mg/kg) and urgent pre-referral stabilization.'
        },
        {
          number: 2,
          title: 'Pneumonia Classification & High-Dose Amoxicillin',
          clinicalFocus: 'Fast breathing (≥ 50 bpm in 2-11m, ≥ 40 bpm in 1-5y) without danger signs.',
          actionProtocol: 'Amoxicillin dispersible tablets 40-50 mg/kg/dose PO twice daily for 5 days. Counsel on fast breathing red flags.'
        },
        {
          number: 3,
          title: 'Diarrhea, Dehydration & Low-Osmolarity ORS',
          clinicalFocus: 'No dehydration, Some dehydration (Plan B), and Severe dehydration (Plan C).',
          actionProtocol: 'Plan B: 75 mL/kg ORS over 4 hours. Prescribe Zinc sulfate 20 mg daily (10 mg for < 6 months) for 14 days.'
        }
      ]
    }
  ];

  const filteredManuals = trainingManuals.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchQuery = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.issuingBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.shortCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const activeManual = trainingManuals.find(m => m.id === selectedManualId) || trainingManuals[0];

  const handleToggleCompetency = (key: string) => {
    setCompletedCompetencies(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyChapterProtocol = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChapter(title);
    setTimeout(() => setCopiedChapter(null), 2000);
  };

  // Print Official National Training Manual Curriculum Worksheet
  const handlePrintManualSummary = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeManual.title} - National Training Manual Summary</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #0f172a; line-height: 1.4; font-size: 12px; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .badge { background: #0f766e; color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase; }
            .title { font-size: 16px; font-weight: 800; color: #0f766e; margin: 4px 0; }
            .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 15px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .section { margin-bottom: 15px; }
            h3 { font-size: 13px; font-weight: bold; color: #0f766e; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background: #f1f5f9; font-weight: bold; }
            .footer-sig { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <span class="badge">Official Ethiopian National Training Guideline</span>
              <div class="title">${activeManual.title}</div>
              <div style="font-size: 11px; color: #64748b;">${activeManual.issuingBody} • ${activeManual.edition} (${activeManual.publicationYear})</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div><strong>Code:</strong> ${activeManual.shortCode}</div>
              <div><strong>Accredited CPD Points:</strong> ${activeManual.cpdAccreditationPoints} Points</div>
            </div>
          </div>

          <div class="meta-box">
            <div><strong>Target Cadre:</strong> ${activeManual.targetAudience}</div>
            <div><strong>Category:</strong> ${activeManual.category}</div>
            <div><strong>Total Chapters:</strong> ${activeManual.totalChapters} Modules</div>
          </div>

          <div class="section">
            <h3>EXECUTIVE CURRICULUM SUMMARY</h3>
            <p>${activeManual.summary}</p>
          </div>

          <div class="section">
            <h3>CORE CLINICAL COMPETENCIES</h3>
            <ul>
              ${activeManual.coreCompetencies.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <h3>STANDARDIZED CLINICAL ACTION PROTOCOLS</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Module / Chapter</th>
                  <th style="width: 35%;">Clinical Focus</th>
                  <th style="width: 40%;">Standard National Action Protocol</th>
                </tr>
              </thead>
              <tbody>
                ${activeManual.keyChapters.map(ch => `
                  <tr>
                    <td><strong>Chapter ${ch.number}: ${ch.title}</strong></td>
                    <td>${ch.clinicalFocus}</td>
                    <td>${ch.actionProtocol}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer-sig">
            <div>
              <p>Certified Clinical Preceptor:</p>
              <p><strong>Pharmacist Dawid Aliyi, BCPS</strong><br>Lead Clinical Developer & Curriculum Assessor<br>Pharma Star Health Informatics</p>
            </div>
            <div>
              <p>Official Ethiopian Accreditation Seal:</p>
              <div style="border: 2px dashed #0f766e; padding: 6px 12px; border-radius: 4px; text-align: center; color: #0f766e; font-weight: bold; font-size: 10px;">
                EFDA / MoH<br>TRAINING MANUAL<br>VERIFIED STANDARD
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

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Ethiopian National Training Manuals Repository
              </span>
              <span className="text-xs text-slate-400">EFDA, MoH & WHO Country Guidelines • Verified CPD Alignment</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Official National Clinical & Regulatory Training Manuals
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Comprehensive repository of official national clinical treatment guidelines, good dispensing practices, antimicrobial stewardship, supply chain logistics, and pediatric management manuals for Ethiopian health professionals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrintManualSummary}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Manual Curriculum</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Manuals' },
            { id: 'Clinical Pharmacotherapy', label: 'Clinical Guidelines' },
            { id: 'Regulatory & GDP', label: 'EFDA & GDP' },
            { id: 'Infectious Diseases', label: 'Infectious Diseases / AMS' },
            { id: 'Logistics & Supply Chain', label: 'IPLS & Supply Chain' },
            { id: 'MCH & Pediatrics', label: 'Pediatrics & IMNCI' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition border ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white border-teal-500 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search manuals (e.g. STG, AMS, GeneXpert)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:border-teal-500 outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Manual Selector + Active Manual Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: Manual Cards */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            National Manuals ({filteredManuals.length})
          </span>

          <div className="space-y-2.5">
            {filteredManuals.map(m => {
              const isSelected = m.id === selectedManualId;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedManualId(m.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-mono">
                      {m.shortCode}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {m.cpdAccreditationPoints} CPD Points
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2">{m.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{m.issuingBody}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                    <span>{m.edition}</span>
                    <span>{m.totalChapters} Modules</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Detailed Manual Reader & Competency Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 uppercase">
                    {activeManual.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">[{activeManual.shortCode}]</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5">{activeManual.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Published by <strong className="text-slate-300">{activeManual.issuingBody}</strong> • {activeManual.edition} ({activeManual.publicationYear})
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 font-mono block">
                  {activeManual.cpdAccreditationPoints}
                </span>
                <span className="text-[10px] text-slate-400">Accredited CPD Credits</span>
              </div>
            </div>

            {/* Target Cadre & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="sm:col-span-2 space-y-1">
                <strong className="text-slate-400 block font-semibold">Executive Curriculum Summary:</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">{activeManual.summary}</p>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                <strong className="text-slate-400 block font-semibold">Target Healthcare Cadre:</strong>
                <p className="text-teal-300 font-semibold text-[11px]">{activeManual.targetAudience}</p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Total Syllabus Modules: <strong>{activeManual.totalChapters}</strong>
                </div>
              </div>
            </div>

            {/* Core Competencies Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span>National Core Competencies (Self-Assessment Checklist)</span>
                </span>
                <span className="text-[10px] text-slate-400">Check competencies verified in practice</span>
              </h4>

              <div className="space-y-2 text-xs">
                {activeManual.coreCompetencies.map((comp, idx) => {
                  const key = `${activeManual.id}-comp-${idx}`;
                  const isChecked = !!completedCompetencies[key];
                  return (
                    <label
                      key={idx}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                        isChecked 
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCompetency(key)}
                        className="mt-0.5 accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-[11px] leading-relaxed flex-1">{comp}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Standard Action Protocols per Chapter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Standardized Clinical Action Protocols & Chapters</span>
              </h4>

              <div className="space-y-3">
                {activeManual.keyChapters.map((ch, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold flex items-center justify-center">
                          {ch.number}
                        </span>
                        {ch.title}
                      </span>
                      <button
                        onClick={() => copyChapterProtocol(ch.actionProtocol, ch.title)}
                        className="text-[10px] text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedChapter === ch.title ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedChapter === ch.title ? 'Copied' : 'Copy Protocol'}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Clinical Indication / Focus:</strong> {ch.clinicalFocus}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-teal-500/30 text-teal-200 font-mono text-[11px]">
                      <strong>Action Protocol:</strong> {ch.actionProtocol}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
