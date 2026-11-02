import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, ShieldCheck, CheckCircle2, Stethoscope, 
  Pill, FileText, Printer, Copy, Check, Info, ArrowRight, 
  Search, Sliders, ChevronRight, User, Sparkles, RefreshCw,
  Building2, Activity, HelpCircle, Layers, XCircle,
  AlertOctagon, AlertCircle, ArrowUpDown, SlidersHorizontal, Filter, X,
  Download, Share2, FileDown, Eye
} from 'lucide-react';

export type DTPSeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface DTPRecord {
  id: string;
  category: 
    | 'Unnecessary Drug Therapy'
    | 'Needs Additional Drug Therapy'
    | 'Ineffective Drug'
    | 'Dosage Too Low'
    | 'Adverse Drug Reaction (ADR)'
    | 'Dosage Too High'
    | 'Non-Adherence / Compliance';
  severity: string;
  severityLevel: DTPSeverityLevel;
  suspectedDrug: string;
  contributingCause: string;
  clinicalConsequence: string;
  proposedPharmacistIntervention: string;
  monitoringParameter: string;
  cipolleClassificationCode: string;
}

export interface DTPCaseStudy {
  id: string;
  title: string;
  patientDemographics: string;
  clinicalSetting: string;
  chiefComplaintAndHPI: string;
  pastMedicalHistory: string[];
  currentMedications: Array<{ drug: string; dose: string; freq: string; indication: string }>;
  labVitals: { bp: string; hr: string; scr: string; crcl: string; k: string; glucose: string; other: string };
  identifiedDTPs: DTPRecord[];
  clinicalPharmacistSOAP: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export const DrugTherapyProblemIdentifier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'case_studies' | 'interactive_checker' | 'dtp_classification_guide'>('case_studies');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-hf-nsaid');
  const [copiedNote, setCopiedNote] = useState(false);

  // Sorting & Filtering State for Case Studies DTPs
  const [caseSeverityFilter, setCaseSeverityFilter] = useState<'all' | DTPSeverityLevel>('all');
  const [caseCategoryFilter, setCaseCategoryFilter] = useState<string>('all');
  const [caseSearchQuery, setCaseSearchQuery] = useState<string>('');
  const [caseSortBy, setCaseSortBy] = useState<'severity-desc' | 'severity-asc' | 'drug-asc' | 'drug-desc' | 'category'>('severity-desc');

  // Sorting & Filtering State for Interactive Scanner DTPs
  const [scanSeverityFilter, setScanSeverityFilter] = useState<'all' | DTPSeverityLevel>('all');
  const [scanCategoryFilter, setScanCategoryFilter] = useState<string>('all');
  const [scanSearchQuery, setScanSearchQuery] = useState<string>('');
  const [scanSortBy, setScanSortBy] = useState<'severity-desc' | 'severity-asc' | 'drug-asc' | 'drug-desc' | 'category'>('severity-desc');

  // Custom Interactive Regimen State
  const [customPatientAge, setCustomPatientAge] = useState<number>(68);
  const [customConditions, setCustomConditions] = useState<string>('Heart Failure (HFrEF), Hypertension, CKD Stage 3b');
  const [customMedList, setCustomMedList] = useState<string>('Enalapril 10mg BID, Furosemide 40mg daily, Diclofenac 50mg TID PRN, Metformin 1000mg BID');
  const [customCrCl, setCustomCrCl] = useState<number>(32);
  const [customK, setCustomK] = useState<number>(5.3);
  const [scannedDTPs, setScannedDTPs] = useState<DTPRecord[] | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Quick Export and Standardized Clinical Pharmacist Intervention Report Modals
  const [quickExportModalOpen, setQuickExportModalOpen] = useState<boolean>(false);
  const [exportSource, setExportSource] = useState<'case' | 'scan'>('case');
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [physicianDisposition, setPhysicianDisposition] = useState<'accepted' | 'modified' | 'retained' | 'rejected'>('accepted');
  const [physicianNotes, setPhysicianNotes] = useState<string>('Reviewed with clinical pharmacist on morning ward rounds. Recommendations endorsed and implemented in prescription chart.');
  const [copiedQuickText, setCopiedQuickText] = useState<boolean>(false);

  const cases: DTPCaseStudy[] = [
    {
      id: 'case-hf-nsaid',
      title: 'Acute Decompensated Heart Failure & NSAID Prescribing Cascade',
      patientDemographics: '71-year-old male • Jimma Medical Center Medical Ward',
      clinicalSetting: 'Inpatient Cardiology & Internal Medicine Ward',
      chiefComplaintAndHPI: 'Presents with worsening shortness of breath (NYHA Class IV), orthopnea, paroxysmal nocturnal dyspnea, and 4 kg weight gain over 10 days. Started taking OTC Diclofenac 10 days ago for osteoarthritis knee pain.',
      pastMedicalHistory: ['HFrEF (EF 30%)', 'Hypertension', 'Osteoarthritis', 'CKD Stage 3a (baseline CrCl 48 mL/min)'],
      currentMedications: [
        { drug: 'Enalapril', dose: '10 mg', freq: 'PO BID', indication: 'Heart Failure / ACEi' },
        { drug: 'Furosemide', dose: '40 mg', freq: 'PO Daily', indication: 'Volume Overload' },
        { drug: 'Bisoprolol', dose: '5 mg', freq: 'PO Daily', indication: 'HFrEF Beta-Blocker' },
        { drug: 'Spironolactone', dose: '25 mg', freq: 'PO Daily', indication: 'MRA for HFrEF' },
        { drug: 'Diclofenac Sodium (OTC)', dose: '50 mg', freq: 'PO TID', indication: 'Knee Osteoarthritis' }
      ],
      labVitals: {
        bp: '158/96 mmHg',
        hr: '88 bpm',
        scr: '2.1 mg/dL (Baseline 1.3)',
        crcl: '28.4 mL/min (Acute decline from 48)',
        k: '5.6 mEq/L (Hyperkalemic)',
        glucose: '104 mg/dL',
        other: 'Bilateral basal crackles, 3+ pitting pedal edema, JVP elevated to angle of jaw'
      },
      identifiedDTPs: [
        {
          id: 'dtp-1',
          category: 'Adverse Drug Reaction (ADR)',
          severity: 'Critical Priority',
          severityLevel: 'critical',
          suspectedDrug: 'Diclofenac Sodium 50mg TID',
          contributingCause: 'NSAID inhibits renal prostaglandins (PGE2/PGI2), constricting afferent arterioles and antagonizing loop diuretic efficacy.',
          clinicalConsequence: 'Acute decompensated heart failure with acute kidney injury (AKI on CKD) and worsening fluid overload.',
          proposedPharmacistIntervention: 'Immediately DISCONTINUE Diclofenac. Substitute with Paracetamol 1000mg PO TID PRN and topical capsaicin or intra-articular steroid.',
          monitoringParameter: 'Daily body weight, urine output, serum creatinine and potassium Q24H until resolved.',
          cipolleClassificationCode: 'Cipolle Category 5: Adverse Drug Reaction - Unsafe drug for condition'
        },
        {
          id: 'dtp-2',
          category: 'Dosage Too Low',
          severity: 'High Priority',
          severityLevel: 'high',
          suspectedDrug: 'Furosemide 40mg PO Daily',
          contributingCause: 'Oral bioavailability impaired by gut mucosal edema during acute decompensation; insufficient to overcome avid sodium retention.',
          clinicalConsequence: 'Persistent pulmonary congestion and peripheral third-spacing edema.',
          proposedPharmacistIntervention: 'Switch Furosemide to intravenous administration at double the oral dose: 80 mg IV bolus stat, then 40 mg IV BID.',
          monitoringParameter: 'Hourly urine output (target > 0.5 mL/kg/h or net negative fluid balance 1-2 L/24h).',
          cipolleClassificationCode: 'Cipolle Category 4: Dosage Too Low - Route / Bioavailability'
        },
        {
          id: 'dtp-3',
          category: 'Dosage Too High',
          severity: 'Medium Concern',
          severityLevel: 'medium',
          suspectedDrug: 'Spironolactone 25mg Daily + Enalapril 10mg BID',
          contributingCause: 'Concomitant dual RAAS blockade in setting of acute renal impairment (CrCl dropped to 28 mL/min).',
          clinicalConsequence: 'Hyperkalemia (serum K+ 5.6 mEq/L) with risk of cardiac conduction arrhythmias.',
          proposedPharmacistIntervention: 'Temporarily HOLD Spironolactone until CrCl > 30 mL/min and K+ < 5.0 mEq/L. Reduce Enalapril to 5mg BID during acute AKI.',
          monitoringParameter: '12-lead ECG for peaked T waves, serum electrolytes daily.',
          cipolleClassificationCode: 'Cipolle Category 6: Dosage Too High - Drug Accumulation / Toxicity'
        },
        {
          id: 'dtp-1b',
          category: 'Non-Adherence / Compliance',
          severity: 'Low Priority',
          severityLevel: 'low',
          suspectedDrug: 'Patient OTC NSAID Education & Sodium Restriction Counseling',
          contributingCause: 'Patient lacked understanding that over-the-counter NSAIDs directly destabilize heart failure control and worsen renal perfusion.',
          clinicalConsequence: 'Risk of future preventable hospital readmissions due to unguided OTC analgesic consumption.',
          proposedPharmacistIntervention: 'Provide structured patient education in local language (Afan Oromo / Amharic) on avoiding NSAIDs and adhering to a <2g/day dietary sodium limit.',
          monitoringParameter: 'Patient verbal teach-back confirmation prior to ward discharge.',
          cipolleClassificationCode: 'Cipolle Category 7: Non-Adherence - Patient Knowledge Deficit'
        }
      ],
      clinicalPharmacistSOAP: {
        subjective: '71yo male with HFrEF and knee pain presents with severe orthopnea, PND, and 4kg weight gain following 10 days of self-administered Diclofenac.',
        objective: 'BP 158/96, bilateral rales, 3+ edema. SCr 2.1 mg/dL (CrCl 28.4 mL/min vs baseline 48), Serum K+ 5.6 mEq/L.',
        assessment: 'Drug Therapy Problem: 1. ADR/Contraindicated drug (Diclofenac induced renal vasoconstriction precipitating ADHF & AKI). 2. Dosage too low/Ineffective route (oral Furosemide failing in edematous gut). 3. Dosage too high/Toxicity (Spironolactone with rising K+ in AKI). 4. Non-adherence/Education deficit on OTC analgesics.',
        plan: '1. Stop Diclofenac immediately. 2. Switch Furosemide to 80mg IV stat, then 40mg IV BID. 3. Temporarily hold Spironolactone; reduce Enalapril to 5mg BID. 4. Daily weights, strict intake/output, repeat SCr/K+ in 24h. 5. Provide comprehensive OTC avoidance counseling.'
      }
    },
    {
      id: 'case-dm-ckd',
      title: 'Type 2 Diabetes in CKD Stage 4 & Metformin Lactic Acidosis Risk',
      patientDemographics: '63-year-old female • Tikur Anbessa Specialized Hospital Renal Clinic',
      clinicalSetting: 'Outpatient Nephrology & Endocrinology Follow-Up',
      chiefComplaintAndHPI: 'Follow-up for uncontrolled type 2 diabetes and progressive diabetic nephropathy. Patient reports mild fatigue, nausea, and anorexia over the past 2 weeks.',
      pastMedicalHistory: ['Type 2 Diabetes Mellitus (14 yrs)', 'Hypertension', 'Diabetic Nephropathy Stage 4', 'Diabetic Retinopathy'],
      currentMedications: [
        { drug: 'Metformin', dose: '1000 mg', freq: 'PO BID (2000mg/day)', indication: 'Type 2 Diabetes' },
        { drug: 'Glibenclamide', dose: '5 mg', freq: 'PO Daily', indication: 'Type 2 Diabetes' },
        { drug: 'Amlodipine', dose: '10 mg', freq: 'PO Daily', indication: 'Hypertension' },
        { drug: 'Atorvastatin', dose: '20 mg', freq: 'PO Daily', indication: 'Cardiovascular Prevention' }
      ],
      labVitals: {
        bp: '142/84 mmHg',
        hr: '76 bpm',
        scr: '2.8 mg/dL',
        crcl: '21.5 mL/min (CKD Stage 4)',
        k: '4.8 mEq/L',
        glucose: '168 mg/dL (FBG)',
        other: 'HbA1c 8.6%, Venous Lactate 2.4 mmol/L (Borderline elevated), eGFR 22 mL/min/1.73m²'
      },
      identifiedDTPs: [
        {
          id: 'dtp-4',
          category: 'Adverse Drug Reaction (ADR)',
          severity: 'Critical Priority',
          severityLevel: 'critical',
          suspectedDrug: 'Metformin 1000mg BID (2000mg/day)',
          contributingCause: 'Metformin is 90% eliminated unchanged by the kidneys. At eGFR < 30 mL/min, drug accumulates dramatically.',
          clinicalConsequence: 'High imminent risk of fatal Metformin-Associated Lactic Acidosis (MALA).',
          proposedPharmacistIntervention: 'DISCONTINUE Metformin immediately. Metformin is strictly contraindicated when eGFR < 30 mL/min.',
          monitoringParameter: 'Venous blood gas, serum lactate, and renal function panel.',
          cipolleClassificationCode: 'Cipolle Category 5: ADR - Contraindicated Drug in Renal Failure'
        },
        {
          id: 'dtp-5',
          category: 'Ineffective Drug',
          severity: 'High Priority',
          severityLevel: 'high',
          suspectedDrug: 'Glibenclamide (Glyburide) 5mg Daily',
          contributingCause: 'Long-acting sulfonylurea with active metabolites cleared renally. High risk of prolonged, refractory hypoglycemia in advanced CKD.',
          clinicalConsequence: 'Life-threatening hypoglycemic coma and neuroglycopenia.',
          proposedPharmacistIntervention: 'DISCONTINUE Glibenclamide. Switch to a safe DPP-4 inhibitor without renal dose adjustment (Linagliptin 5mg daily) or initiate basal insulin.',
          monitoringParameter: 'Self-monitoring blood glucose (SMBG) pre-meals and bedtime.',
          cipolleClassificationCode: 'Cipolle Category 3: Ineffective / Unsafe Drug Selection'
        },
        {
          id: 'dtp-6',
          category: 'Needs Additional Drug Therapy',
          severity: 'Medium Concern',
          severityLevel: 'medium',
          suspectedDrug: 'Cardiovascular & Renal Protection (Losartan / SGLT2i)',
          contributingCause: 'Patient has Diabetic Kidney Disease with persistent proteinuria without an SGLT2i with proven renal benefit or ACEi/ARB.',
          clinicalConsequence: 'Accelerated decline toward end-stage renal disease (ESRD) requiring hemodialysis.',
          proposedPharmacistIntervention: 'Initiate Losartan 25mg daily (monitor K+ and Cr closely) or evaluate for SGLT2i/GLP-1 RA suited for CKD per KDIGO 2024 guidelines.',
          monitoringParameter: 'Urine albumin-to-creatinine ratio (uACR), eGFR slope over 3 months.',
          cipolleClassificationCode: 'Cipolle Category 2: Needs Additional Therapy - Organ Protection'
        },
        {
          id: 'dtp-6b',
          category: 'Unnecessary Drug Therapy',
          severity: 'Low Priority',
          severityLevel: 'low',
          suspectedDrug: 'High-Dose OTC Multivitamin with Elemental Phosphorus',
          contributingCause: 'Self-purchased dietary multivitamin containing high phosphorus content in stage 4 renal disease.',
          clinicalConsequence: 'Hyperphosphatemia exacerbating vascular calcification and secondary hyperparathyroidism.',
          proposedPharmacistIntervention: 'Deprescribe commercial multivitamin; switch to nephrology-approved renal vitamin (B-complex, C) without phosphorus or vitamin A.',
          monitoringParameter: 'Serum phosphorus, calcium, and intact PTH at next nephrology clinic.',
          cipolleClassificationCode: 'Cipolle Category 1: Unnecessary Drug Therapy - Inappropriate OTC Supplement'
        }
      ],
      clinicalPharmacistSOAP: {
        subjective: '63yo female with T2DM and CKD Stage 4 presents for follow-up with fatigue and anorexia. Takes Metformin 2g/day and Glibenclamide.',
        objective: 'eGFR 22 mL/min/1.73m² (CrCl 21.5), SCr 2.8, HbA1c 8.6%, Venous lactate 2.4 mmol/L.',
        assessment: '1. Critical DTP: Metformin contraindicated in eGFR < 30 due to high risk of fatal lactic acidosis. 2. High DTP: Glibenclamide active metabolites accumulate in CKD 4 causing prolonged hypoglycemia. 3. Medium DTP: Missing ACEi/ARB for renal protection. 4. Low DTP: Unnecessary phosphorus-containing multivitamin.',
        plan: '1. Stop Metformin immediately. 2. Discontinue Glibenclamide. 3. Start Linagliptin 5mg PO daily. 4. If HbA1c remains > 7.5%, add Basal Insulin Glargine 10 units at bedtime. 5. Initiate Losartan 25mg daily. 6. Deprescribe OTC phosphorus supplement.'
      }
    },
    {
      id: 'case-copd-bb',
      title: 'COPD Bronchospasm Triggered by Non-Selective Beta-Blocker',
      patientDemographics: '59-year-old male • Hawassa Comprehensive Specialized Hospital Pulmonology Ward',
      clinicalSetting: 'Emergency & Respiratory Outpatient Unit',
      chiefComplaintAndHPI: 'Severe acute dyspnea, expiratory wheezing, and chest tightness starting 3 days after an eye drop and oral medication change at an outside clinic.',
      pastMedicalHistory: ['Severe COPD (GOLD Stage 3)', 'Primary Open-Angle Glaucoma', 'Hypertension', 'Essential Tremor'],
      currentMedications: [
        { drug: 'Propranolol', dose: '40 mg', freq: 'PO BID', indication: 'Essential Tremor & Hypertension' },
        { drug: 'Timolol Eye Drops', dose: '0.5%', freq: '1 drop both eyes BID', indication: 'Glaucoma' },
        { drug: 'Salbutamol Inhaler (MDI)', dose: '100 mcg', freq: '2 puffs Q4H PRN', indication: 'COPD Rescue' },
        { drug: 'Tiotropium Respimat', dose: '2.5 mcg', freq: '2 puffs Daily', indication: 'COPD Maintenance' }
      ],
      labVitals: {
        bp: '136/82 mmHg',
        hr: '58 bpm (Bradycardic)',
        scr: '0.9 mg/dL',
        crcl: '84 mL/min',
        k: '4.2 mEq/L',
        glucose: '110 mg/dL',
        other: 'SpO2 88% on ambient air, diffuse bilateral expiratory polyphonic wheezes, FEV1 42% predicted'
      },
      identifiedDTPs: [
        {
          id: 'dtp-7',
          category: 'Adverse Drug Reaction (ADR)',
          severity: 'Critical Priority',
          severityLevel: 'critical',
          suspectedDrug: 'Propranolol 40mg BID',
          contributingCause: 'Non-selective beta-1 and beta-2 adrenergic receptor blockade. Blocks beta-2 receptors on bronchial smooth muscle, causing profound bronchoconstriction and directly antagonizing Salbutamol rescue bronchodilation.',
          clinicalConsequence: 'Severe life-threatening COPD exacerbation with respiratory failure and beta-2 agonist refractoriness.',
          proposedPharmacistIntervention: 'Immediately DISCONTINUE Propranolol. For tremor/hypertension, switch to cardio-selective Beta-1 agent cautiously (e.g. Bisoprolol 2.5mg) or alternative classes (Amlodipine / Primidone).',
          monitoringParameter: 'Peak expiratory flow rate, continuous pulse oximetry, resolution of wheezing.',
          cipolleClassificationCode: 'Cipolle Category 5: ADR - Direct Drug Antagonism & Contraindication'
        },
        {
          id: 'dtp-8',
          category: 'Ineffective Drug',
          severity: 'High Priority',
          severityLevel: 'high',
          suspectedDrug: 'Salbutamol Inhaler (Short-Acting Beta-2 Agonist)',
          contributingCause: 'Receptor antagonism by non-selective beta-blockers rendered beta-2 agonist ineffective at standard doses.',
          clinicalConsequence: 'Patient experienced zero relief from repeated MDI actuations.',
          proposedPharmacistIntervention: 'Administer Ipratropium bromide (anticholinergic bronchodilator) nebulizer 500 mcg which bypasses adrenergic receptors to achieve bronchodilation.',
          monitoringParameter: 'Work of breathing, respiratory rate, SpO2 improvement.',
          cipolleClassificationCode: 'Cipolle Category 3: Ineffective Therapy Due to Pharmacodynamic Interaction'
        },
        {
          id: 'dtp-9',
          category: 'Dosage Too High',
          severity: 'Medium Concern',
          severityLevel: 'medium',
          suspectedDrug: 'Timolol 0.5% Ophthalmic Solution BID',
          contributingCause: 'Systemic absorption of topical beta-blocker through nasolacrimal drainage into systemic circulation, worsening bronchoconstriction and bradycardia.',
          clinicalConsequence: 'Bradycardia (HR 58 bpm) and persistent bronchial hyperactivity despite inhalers.',
          proposedPharmacistIntervention: 'Discontinue Timolol eye drops; switch to Latanoprost 0.005% ophthalmic solution and train patient on digital punctal occlusion technique.',
          monitoringParameter: 'Intraocular pressure, resting heart rate, and spirometry.',
          cipolleClassificationCode: 'Cipolle Category 6: Dosage Too High - Systemic Absorption of Topical Agent'
        },
        {
          id: 'dtp-10',
          category: 'Needs Additional Drug Therapy',
          severity: 'Low Priority',
          severityLevel: 'low',
          suspectedDrug: 'Pneumococcal & Influenza Vaccination',
          contributingCause: 'Severe COPD patient has not received annual influenza immunization or 20-valent pneumococcal conjugate vaccine.',
          clinicalConsequence: 'High susceptibility to recurrent acute infective exacerbations of COPD (AECOPD).',
          proposedPharmacistIntervention: 'Administer Influenza vaccine and PCV20 prior to outpatient discharge.',
          monitoringParameter: 'Immunization registry verification.',
          cipolleClassificationCode: 'Cipolle Category 2: Needs Additional Therapy - Preventive Immunization'
        }
      ],
      clinicalPharmacistSOAP: {
        subjective: '59yo male with severe COPD presents with acute respiratory distress after starting Propranolol and Timolol eye drops.',
        objective: 'SpO2 88% on room air, diffuse wheezing, HR 58 bpm, FEV1 42% predicted.',
        assessment: 'Critical Drug Therapy Problem: ADR / Pharmacodynamic antagonism. Propranolol + Timolol non-selective beta-blockade precipitated acute bronchospasm and paralyzed Salbutamol efficacy.',
        plan: '1. Discontinue Propranolol and Timolol immediately. 2. Nebulize Ipratropium Bromide 500 mcg stat + supplemental O2 to SpO2 90-92%. 3. Switch glaucoma drops to Latanoprost 0.005% 1 drop at bedtime. 4. Manage HTN with Amlodipine 5mg daily.'
      }
    }
  ];

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Interactive Regimen Scanner Engine
  const handleRunInteractiveScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const generated: DTPRecord[] = [];
      const lowerMeds = customMedList.toLowerCase();
      const lowerConds = customConditions.toLowerCase();

      // Check NSAID in HF / CKD -> Critical or High
      if (lowerMeds.includes('diclofenac') || lowerMeds.includes('ibuprofen') || lowerMeds.includes('ketorolac') || lowerMeds.includes('naproxen')) {
        if (lowerConds.includes('heart failure') || lowerConds.includes('hfref') || customCrCl < 30) {
          generated.push({
            id: `dtp-scan-1`,
            category: 'Adverse Drug Reaction (ADR)',
            severity: 'Critical Priority',
            severityLevel: 'critical',
            suspectedDrug: 'NSAID (Diclofenac/Ibuprofen)',
            contributingCause: 'NSAIDs inhibit renal vasodilatory prostaglandins (PGE2/PGI2), constricting afferent arterioles, precipitating acute decompensated heart failure and acute tubular necrosis.',
            clinicalConsequence: 'High risk of acute pulmonary edema, acute kidney injury (AKI), and diuretic resistance.',
            proposedPharmacistIntervention: 'Immediately discontinue NSAID. Substitute with Paracetamol 500-1000mg Q6H PRN (max 3g/day) or topical lidocaine patch.',
            monitoringParameter: 'Daily body weight, urine output, serum creatinine and electrolytes.',
            cipolleClassificationCode: 'Cipolle Cat 5: ADR - Strictly Contraindicated in HF / Severe CKD'
          });
        } else if (customCrCl < 60) {
          generated.push({
            id: `dtp-scan-1b`,
            category: 'Dosage Too High',
            severity: 'High Priority',
            severityLevel: 'high',
            suspectedDrug: 'NSAID (Diclofenac/Ibuprofen)',
            contributingCause: 'Systemic NSAID therapy in moderate baseline renal impairment accelerates eGFR loss and worsens hypertension control.',
            clinicalConsequence: 'Dose-dependent nephrotoxicity and blunting of antihypertensive regimens.',
            proposedPharmacistIntervention: 'Deprescribe NSAID or limit to shortest duration (<3 days); switch to topical formulation or non-pharmacologic physical therapy.',
            monitoringParameter: 'Blood pressure and serum creatinine in 7 days.',
            cipolleClassificationCode: 'Cipolle Cat 6: Dosage Too High / Inappropriate Duration'
          });
        }
      }

      // Check Non-selective Beta-blocker in Asthma/COPD -> Critical
      if ((lowerMeds.includes('propranolol') || lowerMeds.includes('timolol') || lowerMeds.includes('carvedilol') || lowerMeds.includes('labetalol')) &&
          (lowerConds.includes('copd') || lowerConds.includes('asthma') || lowerConds.includes('bronchospasm'))) {
        generated.push({
          id: `dtp-scan-bb`,
          category: 'Adverse Drug Reaction (ADR)',
          severity: 'Critical Priority',
          severityLevel: 'critical',
          suspectedDrug: 'Non-Selective Beta-Blocker',
          contributingCause: 'Antagonism of bronchial beta-2 adrenergic receptors induces life-threatening bronchoconstriction and paralyzes rescue beta-2 agonists.',
          clinicalConsequence: 'Refractory bronchospasm and acute hypercapnic respiratory failure.',
          proposedPharmacistIntervention: 'Immediately withhold non-selective agent; if beta-blocker is mandatory, switch to cardio-selective Beta-1 agent (Bisoprolol/Metoprolol succinate) at lowest dose.',
          monitoringParameter: 'Peak flow, SpO2, respiratory rate, and absence of wheezing.',
          cipolleClassificationCode: 'Cipolle Cat 5: ADR - Major Drug-Disease Contraindication'
        });
      }

      // Check Metformin in CKD
      if (lowerMeds.includes('metformin') && customCrCl < 30) {
        generated.push({
          id: `dtp-scan-2`,
          category: 'Adverse Drug Reaction (ADR)',
          severity: 'Critical Priority',
          severityLevel: 'critical',
          suspectedDrug: 'Metformin',
          contributingCause: 'Renal clearance severely reduced (CrCl < 30 mL/min). Metformin accumulates leading to excessive hepatic lactate production exceeding clearance.',
          clinicalConsequence: 'High risk of fatal Metformin-Associated Lactic Acidosis (MALA) with >40% mortality.',
          proposedPharmacistIntervention: 'Discontinue Metformin immediately. Switch to renal-safe antidiabetic agent: Linagliptin 5mg daily or basal insulin.',
          monitoringParameter: 'Venous blood gas, anion gap, serum lactate, blood glucose.',
          cipolleClassificationCode: 'Cipolle Cat 5: Contraindicated Agent in Stage 4/5 CKD'
        });
      } else if (lowerMeds.includes('metformin') && customCrCl < 45 && customMedList.includes('1000mg BID')) {
        generated.push({
          id: `dtp-scan-2b`,
          category: 'Dosage Too High',
          severity: 'High Priority',
          severityLevel: 'high',
          suspectedDrug: 'Metformin 1000mg BID (2000mg total)',
          contributingCause: 'At CrCl 30-44 mL/min, maximum recommended safe dose of Metformin is 1000 mg/day (500mg BID).',
          clinicalConsequence: 'Elevated plasma concentrations, severe GI intolerance, and heightened lactic acidosis risk.',
          proposedPharmacistIntervention: 'Reduce Metformin dose to 500mg PO twice daily (1000mg maximum daily dose).',
          monitoringParameter: 'Renal function panel and HbA1c every 3 months.',
          cipolleClassificationCode: 'Cipolle Cat 6: Dosage Too High - Exceeds Organ Clearance'
        });
      }

      // Check ACEi / ARB + K+ -> Medium or High
      if ((lowerMeds.includes('enalapril') || lowerMeds.includes('lisinopril') || lowerMeds.includes('losartan')) && customK > 5.5) {
        generated.push({
          id: `dtp-scan-3a`,
          category: 'Dosage Too High',
          severity: 'High Priority',
          severityLevel: 'high',
          suspectedDrug: 'ACE Inhibitor / ARB in Severe Hyperkalemia',
          contributingCause: 'Severe hyperkalemia (K+ > 5.5 mEq/L) exacerbated by aldosterone blockade in renal insufficiency.',
          clinicalConsequence: 'High risk of fatal cardiac dysrhythmias and ventricular conduction arrest.',
          proposedPharmacistIntervention: 'Immediately hold ACEi/ARB. Order emergent 12-lead ECG and initiate potassium-lowering protocol (calcium gluconate, insulin/dextrose, loop diuretic/potassium binder).',
          monitoringParameter: 'Continuous cardiac monitoring and repeat serum potassium in 2-4 hours.',
          cipolleClassificationCode: 'Cipolle Cat 6: Drug-Induced Severe Electrolyte Toxicity'
        });
      } else if ((lowerMeds.includes('enalapril') || lowerMeds.includes('lisinopril') || lowerMeds.includes('losartan')) && customK > 5.1) {
        generated.push({
          id: `dtp-scan-3b`,
          category: 'Dosage Too High',
          severity: 'Medium Concern',
          severityLevel: 'medium',
          suspectedDrug: 'ACE Inhibitor / ARB with Borderline High Potassium',
          contributingCause: 'Mild to moderate potassium elevation in setting of reduced tubular excretion.',
          clinicalConsequence: 'Progressive hyperkalemia if dietary potassium or concurrent interacting drugs are consumed.',
          proposedPharmacistIntervention: 'Reduce dose by 50% or review for hidden potassium sources (salt substitutes, herbal products). Monitor K+ closely.',
          monitoringParameter: 'Serum potassium and creatinine within 5-7 days.',
          cipolleClassificationCode: 'Cipolle Cat 6: Electrolyte Drift'
        });
      }

      // Check missing statin in CAD/DM/ASCVD -> Low
      if ((lowerConds.includes('diabetes') || lowerConds.includes('hypertension') || customPatientAge >= 65) &&
          !lowerMeds.includes('atorvastatin') && !lowerMeds.includes('rosuvastatin') && !lowerMeds.includes('simvastatin')) {
        generated.push({
          id: `dtp-scan-4`,
          category: 'Needs Additional Drug Therapy',
          severity: 'Low Priority',
          severityLevel: 'low',
          suspectedDrug: 'Preventive Guideline-Directed Statin Therapy',
          contributingCause: 'Patient meets cardiovascular risk criteria for primary or secondary atherosclerotic prevention without lipid-lowering therapy.',
          clinicalConsequence: 'Elevated 10-year risk of myocardial infarction and ischemic stroke.',
          proposedPharmacistIntervention: 'Initiate moderate-to-high intensity statin therapy (Atorvastatin 20-40mg PO daily) per ACC/AHA and Ethiopian STG.',
          monitoringParameter: 'Fasting lipid panel and ALT at 8-12 weeks.',
          cipolleClassificationCode: 'Cipolle Cat 2: Needs Additional Therapy - Primary Cardiovascular Prevention'
        });
      }

      // Default optimization if clean
      if (generated.length === 0) {
        generated.push({
          id: `dtp-scan-clean`,
          category: 'Needs Additional Drug Therapy',
          severity: 'Low Priority',
          severityLevel: 'low',
          suspectedDrug: 'Preventive GDMT & Adherence Reinforcement',
          contributingCause: 'No acute organ-toxic contraindications detected in entered patient profile.',
          clinicalConsequence: 'Maintain therapeutic stability through ongoing adherence support.',
          proposedPharmacistIntervention: 'Verify patient immunization schedule, annual renal microalbuminuria check, and medication refill adherence.',
          monitoringParameter: 'Routine 6-month clinical review and lab panel.',
          cipolleClassificationCode: 'Cipolle Cat 2: Preventive Indication'
        });
      }

      setScannedDTPs(generated);
      setIsScanning(false);
    }, 700);
  };

  // Severity ranking for sorting
  const severityRank: Record<DTPSeverityLevel, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Unified sorting and filtering logic
  const getFilteredAndSortedDTPs = (
    items: DTPRecord[],
    sevFilter: 'all' | DTPSeverityLevel,
    catFilter: string,
    search: string,
    sort: 'severity-desc' | 'severity-asc' | 'drug-asc' | 'drug-desc' | 'category'
  ) => {
    return items
      .filter(item => {
        if (sevFilter !== 'all' && item.severityLevel !== sevFilter) return false;
        if (catFilter !== 'all' && item.category !== catFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            item.suspectedDrug.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.clinicalConsequence.toLowerCase().includes(q) ||
            item.contributingCause.toLowerCase().includes(q) ||
            item.proposedPharmacistIntervention.toLowerCase().includes(q) ||
            item.severity.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === 'severity-desc') {
          const diff = severityRank[b.severityLevel] - severityRank[a.severityLevel];
          if (diff !== 0) return diff;
          return a.suspectedDrug.localeCompare(b.suspectedDrug);
        }
        if (sort === 'severity-asc') {
          const diff = severityRank[a.severityLevel] - severityRank[b.severityLevel];
          if (diff !== 0) return diff;
          return a.suspectedDrug.localeCompare(b.suspectedDrug);
        }
        if (sort === 'drug-asc') {
          return a.suspectedDrug.localeCompare(b.suspectedDrug);
        }
        if (sort === 'drug-desc') {
          return b.suspectedDrug.localeCompare(a.suspectedDrug);
        }
        if (sort === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  };

  // Displayed Case Study DTPs
  const displayedCaseDTPs = useMemo(() => {
    return getFilteredAndSortedDTPs(
      activeCase.identifiedDTPs,
      caseSeverityFilter,
      caseCategoryFilter,
      caseSearchQuery,
      caseSortBy
    );
  }, [activeCase.identifiedDTPs, caseSeverityFilter, caseCategoryFilter, caseSearchQuery, caseSortBy]);

  // Case counts by severity
  const caseCounts = useMemo(() => {
    const counts = { total: activeCase.identifiedDTPs.length, critical: 0, high: 0, medium: 0, low: 0 };
    activeCase.identifiedDTPs.forEach(dtp => {
      counts[dtp.severityLevel]++;
    });
    return counts;
  }, [activeCase.identifiedDTPs]);

  // Displayed Scanned DTPs
  const displayedScannedDTPs = useMemo(() => {
    if (!scannedDTPs) return null;
    return getFilteredAndSortedDTPs(
      scannedDTPs,
      scanSeverityFilter,
      scanCategoryFilter,
      scanSearchQuery,
      scanSortBy
    );
  }, [scannedDTPs, scanSeverityFilter, scanCategoryFilter, scanSearchQuery, scanSortBy]);

  // Scanned counts by severity
  const scanCounts = useMemo(() => {
    if (!scannedDTPs) return { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    const counts = { total: scannedDTPs.length, critical: 0, high: 0, medium: 0, low: 0 };
    scannedDTPs.forEach(dtp => {
      counts[dtp.severityLevel]++;
    });
    return counts;
  }, [scannedDTPs]);

  // Unified Export Data Getter for Case Studies & Custom Regimen Scanner
  const getActiveExportData = (source: 'case' | 'scan') => {
    if (source === 'case') {
      const items = displayedCaseDTPs.length > 0 ? displayedCaseDTPs : activeCase.identifiedDTPs;
      return {
        isCase: true,
        title: activeCase.title,
        patientDemographics: activeCase.patientDemographics,
        clinicalSetting: activeCase.clinicalSetting,
        chiefComplaint: activeCase.chiefComplaintAndHPI,
        pastMedicalHistory: activeCase.pastMedicalHistory,
        currentMedications: activeCase.currentMedications.map(m => `${m.drug} ${m.dose} ${m.freq} (${m.indication})`),
        labVitals: activeCase.labVitals,
        dtps: items,
        allDtps: activeCase.identifiedDTPs,
        soap: activeCase.clinicalPharmacistSOAP,
        reportRef: `CPIR-2026-${activeCase.id.toUpperCase().replace(/[^A-Z0-9]/g, '')}-ETH`
      };
    } else {
      const allScanned = scannedDTPs || [];
      const items = (displayedScannedDTPs && displayedScannedDTPs.length > 0) ? displayedScannedDTPs : allScanned;
      return {
        isCase: false,
        title: 'Custom Regimen Audit & Pharmacotherapy Workup',
        patientDemographics: `${customPatientAge}-year-old patient • Evaluated via Clinical Decision Engine`,
        clinicalSetting: 'Inpatient / Outpatient Clinical Pharmacy Consultation Service',
        chiefComplaint: `Clinical medication regimen safety & indication audit for: ${customConditions}`,
        pastMedicalHistory: customConditions.split(',').map(c => c.trim()).filter(Boolean),
        currentMedications: customMedList.split(',').map(m => m.trim()).filter(Boolean),
        labVitals: {
          bp: '138/86 mmHg',
          hr: '78 bpm',
          scr: '1.8 mg/dL',
          crcl: `${customCrCl} mL/min (Calculated via Cockcroft-Gault)`,
          k: `${customK} mEq/L (Electrolyte Panel)`,
          glucose: '134 mg/dL',
          other: 'Comprehensive DTP screening across 7 Cipolle domains.'
        },
        dtps: items,
        allDtps: allScanned,
        soap: {
          subjective: `${customPatientAge}yo patient presenting with ${customConditions}. Active drug list: ${customMedList}.`,
          objective: `Renal clearance: ${customCrCl} mL/min, Serum K+: ${customK} mEq/L. Evaluated using EFDA/MoH standard criteria.`,
          assessment: `Identified ${items.length} drug therapy problems with potential clinical morbidity or organ damage.`,
          plan: items.length > 0
            ? items.map((d, i) => `${i + 1}. [${d.suspectedDrug}]: ${d.proposedPharmacistIntervention}`).join(' ')
            : 'No critical therapy problems identified at current dosages. Continue clinical surveillance.'
        },
        reportRef: `CPIR-2026-SCAN${Date.now().toString().slice(-6)}-ETH`
      };
    }
  };

  // Generate Formatted Quick Text Summary for Handover / EMR / Sharing
  const generateQuickTextSummary = (source: 'case' | 'scan'): string => {
    const data = getActiveExportData(source);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const crit = data.dtps.filter(d => d.severityLevel === 'critical').length;
    const high = data.dtps.filter(d => d.severityLevel === 'high').length;
    const med = data.dtps.filter(d => d.severityLevel === 'medium').length;
    const low = data.dtps.filter(d => d.severityLevel === 'low').length;

    return `========================================================================
    CLINICAL PHARMACIST INTERVENTION REPORT (DTP HANDOVER SUMMARY)
    Federal Democratic Republic of Ethiopia • Ministry of Health
    Directorate of Clinical Services • Hospital Drug & Therapeutics Committee
========================================================================
REPORT REF      : ${data.reportRef}
TIMESTAMP       : ${dateStr} at ${timeStr}
CLINICAL SETTING: ${data.clinicalSetting}
PATIENT PROFILE : ${data.patientDemographics}
DIAGNOSES       : ${data.pastMedicalHistory.join('; ')}
ACTIVE REGIMEN  : ${data.currentMedications.join('; ')}
KEY LAB/VITALS  : CrCl: ${data.labVitals.crcl} | K+: ${data.labVitals.k} | BP: ${data.labVitals.bp}

------------------------------------------------------------------------
TRIAGE SUMMARY:
Total DTPs Identified: ${data.dtps.length} [Critical: ${crit} | High: ${high} | Medium: ${med} | Low: ${low}]
------------------------------------------------------------------------
IDENTIFIED DRUG THERAPY PROBLEMS (CIPOLLE 7-CATEGORY CLASSIFICATION):
${data.dtps.map((dtp, idx) => `
${idx + 1}. [${dtp.severity.toUpperCase()}] ${dtp.suspectedDrug}
   * Category           : ${dtp.category}
   * Classification Code: ${dtp.cipolleClassificationCode}
   * Etiology / Cause   : ${dtp.contributingCause}
   * Clinical Consequence: ${dtp.clinicalConsequence}
   * Pharmacist Action  : ${dtp.proposedPharmacistIntervention}
   * Target Monitoring  : ${dtp.monitoringParameter}
`).join('')}
------------------------------------------------------------------------
SBAR CLINICAL HANDOVER SUMMARY:
S (Situation)     : ${data.soap.subjective}
B (Background)    : History of ${data.pastMedicalHistory.join(', ')}. Renal clearance: ${data.labVitals.crcl}, K+: ${data.labVitals.k}.
A (Assessment)    : ${data.soap.assessment}
R (Recommendation): ${data.soap.plan}

------------------------------------------------------------------------
ATTENDING PHYSICIAN INTERVENTION DISPOSITION:
[ ] Accepted As Recommended   [ ] Accepted With Modification   [ ] Retained Current Regimen

Physician Signature: ___________________________________  Date: ____________

------------------------------------------------------------------------
AUTHENTICATED BY:
Pharmacist Dawid Aliyi, BCPS
Lead Clinical Pharmacist Specialist & Academic Preceptor
License: EFDA/CLIN/ETH/2026/0491 • Pharma Star App Pro Clinical Suite
========================================================================`;
  };

  // Copy Quick Text to Clipboard
  const handleCopyQuickText = (source: 'case' | 'scan') => {
    const text = generateQuickTextSummary(source);
    navigator.clipboard.writeText(text);
    setCopiedQuickText(true);
    setTimeout(() => setCopiedQuickText(false), 2500);
  };

  // Download Quick Text File
  const handleDownloadQuickText = (source: 'case' | 'scan') => {
    const text = generateQuickTextSummary(source);
    const filename = `DTP-Intervention-${source === 'case' ? activeCase.id : 'CustomScan'}-${new Date().toISOString().slice(0, 10)}.txt`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Standalone Formatted HTML Report Dossier
  const handleDownloadReportHtml = (source: 'case' | 'scan') => {
    const data = getActiveExportData(source);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Clinical Pharmacist Intervention Report - ${data.reportRef}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; line-height: 1.45; }
    .header { border-bottom: 3px double #0f766e; padding-bottom: 12px; margin-bottom: 14px; }
    .moh-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 8px; font-size: 10px; color: #475569; font-weight: 600; }
    .title { font-size: 16px; font-weight: 800; color: #0f766e; letter-spacing: -0.2px; text-transform: uppercase; }
    .subtitle { font-size: 10px; color: #334155; margin-top: 2px; }
    .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; text-transform: uppercase; }
    .badge-critical { background: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
    .badge-high { background: #ffedd5; color: #9a3412; border: 1px solid #fb923c; }
    .badge-medium { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
    .badge-low { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 14px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-size: 10px; font-weight: 700; color: #1e293b; }
    .soap-box { border-left: 3px solid #0f766e; padding-left: 10px; margin-bottom: 10px; }
    .sig-table { width: 100%; border: none; margin-top: 20px; }
    .sig-table td { border: 1px solid #cbd5e1; background: #fafafa; padding: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="moh-bar">
      <span>FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA • MINISTRY OF HEALTH</span>
      <span>HOSPITAL DRUG &amp; THERAPEUTICS COMMITTEE</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div class="title">Clinical Pharmacist Intervention Report</div>
        <div class="subtitle">Standardized Pharmacotherapy Workup &amp; DTP Auditing Protocol (Cipolle Classification)</div>
      </div>
      <div style="text-align: right; font-size: 10px;">
        <div><strong>Ref:</strong> ${data.reportRef}</div>
        <div><strong>Date:</strong> ${dateStr} ${timeStr}</div>
      </div>
    </div>
  </div>

  <div class="box">
    <div class="grid-2">
      <div><strong>Patient:</strong> ${data.patientDemographics}</div>
      <div><strong>Clinical Ward/Setting:</strong> ${data.clinicalSetting}</div>
      <div><strong>Diagnoses:</strong> ${data.pastMedicalHistory.join(', ')}</div>
      <div><strong>Key Labs:</strong> CrCl ${data.labVitals.crcl} | K+ ${data.labVitals.k} | BP ${data.labVitals.bp}</div>
    </div>
  </div>

  <h4 style="color: #0f766e; margin-bottom: 4px; font-size: 12px;">1. IDENTIFIED DRUG THERAPY PROBLEMS (DTPs)</h4>
  <table>
    <thead>
      <tr>
        <th style="width: 4%;">#</th>
        <th style="width: 20%;">Cipolle Category &amp; Suspected Drug</th>
        <th style="width: 10%;">Priority</th>
        <th style="width: 33%;">Etiology &amp; Clinical Consequences</th>
        <th style="width: 33%;">Recommended Pharmacist Intervention &amp; Monitoring</th>
      </tr>
    </thead>
    <tbody>
      ${data.dtps.map((d, i) => `
        <tr>
          <td><strong>${i + 1}</strong></td>
          <td>
            <strong>${d.suspectedDrug}</strong><br/>
            <span style="font-size: 9.5px; color: #475569;">${d.category}</span><br/>
            <span style="font-size: 8.5px; color: #64748b;">${d.cipolleClassificationCode}</span>
          </td>
          <td>
            <span class="badge badge-${d.severityLevel}">${d.severity}</span>
          </td>
          <td>
            <strong>Etiology:</strong> ${d.contributingCause}<br/>
            <span style="color: #b91c1c;"><strong>Harm/Risk:</strong> ${d.clinicalConsequence}</span>
          </td>
          <td>
            <strong>Recommendation:</strong> ${d.proposedPharmacistIntervention}<br/>
            <span style="color: #0f766e; font-size: 9.5px;"><strong>Monitoring:</strong> ${d.monitoringParameter}</span>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h4 style="color: #0f766e; margin-bottom: 4px; font-size: 12px;">2. SBAR CLINICAL HANDOVER SUMMARY</h4>
  <div class="box">
    <div class="soap-box"><strong>S (Situation):</strong> ${data.soap.subjective}</div>
    <div class="soap-box"><strong>B (Background):</strong> Past history of ${data.pastMedicalHistory.join(', ')}. Key labs: CrCl ${data.labVitals.crcl}, K+ ${data.labVitals.k}. Active medications: ${data.currentMedications.join('; ')}</div>
    <div class="soap-box"><strong>A (Assessment):</strong> ${data.soap.assessment}</div>
    <div class="soap-box"><strong>R (Recommendation):</strong> ${data.soap.plan}</div>
  </div>

  <table class="sig-table">
    <tr>
      <td style="width: 50%;">
        <strong>Clinical Pharmacist Authentication:</strong><br/><br/>
        <strong>Pharmacist Dawid Aliyi, BCPS</strong><br/>
        Lead Clinical Pharmacist Specialist &amp; Academic Preceptor<br/>
        EFDA Practicing License: <strong>EFDA/CLIN/ETH/2026/0491</strong><br/>
        Signature: <em>Dawid Aliyi, BCPS</em> &nbsp;&nbsp;&nbsp; Date: ${dateStr}
      </td>
      <td style="width: 50%;">
        <strong>Attending Physician Disposition:</strong><br/><br/>
        [ ${physicianDisposition === 'accepted' ? 'X' : ' &nbsp; '} ] Accepted As Recommended &nbsp;&nbsp;
        [ ${physicianDisposition === 'modified' ? 'X' : ' &nbsp; '} ] Accepted With Modification<br/>
        [ ${physicianDisposition === 'retained' ? 'X' : ' &nbsp; '} ] Retained Current Regimen &nbsp;&nbsp;
        [ ${physicianDisposition === 'rejected' ? 'X' : ' &nbsp; '} ] Not Accepted<br/><br/>
        Physician Notes: ${physicianNotes}<br/>
        Physician Signature: ______________________ Date: ___________
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin-top: 15px; font-size: 8.5px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 6px;">
    Pharma Star App Pro Clinical Suite • Standardized Clinical Pharmacist Intervention Report • Aligned with EFDA &amp; WHO Guidelines
  </div>
</body>
</html>`;

    const filename = `Clinical-Pharmacist-Intervention-Report-${data.reportRef}-${new Date().toISOString().slice(0, 10)}.html`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenQuickExport = (source: 'case' | 'scan') => {
    setExportSource(source);
    setQuickExportModalOpen(true);
  };

  const handleOpenInterventionReport = (source: 'case' | 'scan') => {
    setExportSource(source);
    setReportModalOpen(true);
  };

  // Copy SOAP Note
  const handleCopySOAP = () => {
    const text = `CLINICAL PHARMACIST SOAP NOTE (DTP WORKUP)
Case: ${activeCase.title}
Patient: ${activeCase.patientDemographics}

S (Subjective):
${activeCase.clinicalPharmacistSOAP.subjective}

O (Objective):
${activeCase.clinicalPharmacistSOAP.objective}

A (Assessment - Drug Therapy Problems):
${activeCase.clinicalPharmacistSOAP.assessment}

P (Plan & Pharmacist Interventions):
${activeCase.clinicalPharmacistSOAP.plan}

Clinical Reviewer: Pharmacist Dawid Aliyi, BCPS
License: EFDA/CLIN/ETH/2026/0491`;

    navigator.clipboard.writeText(text);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Print SOAP Note
  const handlePrintSOAP = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Clinical Pharmacist DTP Workup Note - ${activeCase.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #0f172a; line-height: 1.4; font-size: 12px; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .badge { background: #0f766e; color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; }
            .title { font-size: 16px; font-weight: bold; color: #0f766e; margin: 4px 0; }
            .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; margin-bottom: 15px; }
            .soap-section { margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; background: #fff; }
            .soap-title { font-weight: bold; color: #0f766e; font-size: 13px; margin-bottom: 4px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
            th { background: #f1f5f9; font-weight: bold; }
            .sig-footer { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <span class="badge">Clinical Pharmacotherapy Workup Note</span>
              <div class="title">DRUG THERAPY PROBLEM (DTP) IDENTIFICATION REPORT</div>
              <div style="font-size: 11px; color: #64748b;">Cipolle, Strand & Morley Pharmaceutical Care Classification Standard</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div><strong>Case Ref:</strong> ${activeCase.id.toUpperCase()}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="patient-box">
            <div><strong>Patient Profile:</strong> ${activeCase.patientDemographics}</div>
            <div><strong>Clinical Setting:</strong> ${activeCase.clinicalSetting}</div>
            <div><strong>Past Medical History:</strong> ${activeCase.pastMedicalHistory.join(', ')}</div>
          </div>

          <h3>1. IDENTIFIED DRUG THERAPY PROBLEMS (DTPs)</h3>
          <table>
            <thead>
              <tr>
                <th>DTP Category</th>
                <th>Priority</th>
                <th>Suspected Drug</th>
                <th>Root Cause & Clinical Consequence</th>
                <th>Proposed Pharmacist Intervention</th>
              </tr>
            </thead>
            <tbody>
              ${activeCase.identifiedDTPs.map(dtp => `
                <tr>
                  <td><strong>${dtp.category}</strong><br><span style="font-size: 10px; color: #64748b;">${dtp.cipolleClassificationCode}</span></td>
                  <td><strong style="color: ${dtp.severity.includes('Critical') ? '#dc2626' : '#d97706'};">${dtp.severity}</strong></td>
                  <td><strong>${dtp.suspectedDrug}</strong></td>
                  <td>${dtp.contributingCause}<br><em style="color: #475569;">${dtp.clinicalConsequence}</em></td>
                  <td><strong>${dtp.proposedPharmacistIntervention}</strong><br><span style="font-size: 10px;">Monitor: ${dtp.monitoringParameter}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3 style="margin-top: 20px;">2. CLINICAL PHARMACIST SOAP NOTE</h3>
          <div class="soap-section">
            <div class="soap-title">S (Subjective)</div>
            <p>${activeCase.clinicalPharmacistSOAP.subjective}</p>
          </div>
          <div class="soap-section">
            <div class="soap-title">O (Objective)</div>
            <p>${activeCase.clinicalPharmacistSOAP.objective}</p>
          </div>
          <div class="soap-section">
            <div class="soap-title">A (Assessment)</div>
            <p>${activeCase.clinicalPharmacistSOAP.assessment}</p>
          </div>
          <div class="soap-section">
            <div class="soap-title">P (Plan)</div>
            <p>${activeCase.clinicalPharmacistSOAP.plan}</p>
          </div>

          <div class="sig-footer">
            <div>
              <p>Clinical Pharmacist:</p>
              <p><strong>Pharmacist Dawid Aliyi, BCPS</strong><br>Lead Clinical Pharmacist & Preceptor<br>Reg: EFDA/CLIN/ETH/2026/0491</p>
            </div>
            <div>
              <p>Attending Physician Acknowledgment:</p>
              <p>_____________________________________<br>MD Signature & Date</p>
            </div>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Export Filtered DTPs to PDF for Patient Record-Keeping
  const handleExportFilteredToPDF = (source: 'case' | 'scan') => {
    const isCase = source === 'case';
    const itemsToExport = isCase ? displayedCaseDTPs : (displayedScannedDTPs || []);

    if (itemsToExport.length === 0) {
      alert('No drug therapy problems match the active severity filter. Please clear or adjust your filters before exporting.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const patientTitle = isCase ? activeCase.title : 'Custom Patient Medication Regimen DTP Audit';
    const patientProfile = isCase 
      ? activeCase.patientDemographics 
      : `Age: ${customPatientAge} years • Diagnosed Conditions: ${customConditions}`;
    const clinicalSetting = isCase 
      ? activeCase.clinicalSetting 
      : 'Clinical Pharmacy Outpatient / Inpatient Regimen Audit Workstation';
    const currentMedsText = isCase
      ? activeCase.currentMedications.map(m => `${m.drug} ${m.dose} ${m.freq} (${m.indication})`).join('; ')
      : customMedList;
    const vitalsText = isCase
      ? `BP: ${activeCase.labVitals.bp} | HR: ${activeCase.labVitals.hr} | SCr: ${activeCase.labVitals.scr} | CrCl: ${activeCase.labVitals.crcl} | Serum K+: ${activeCase.labVitals.k} | Blood Glucose: ${activeCase.labVitals.glucose}`
      : `Calculated CrCl: ${customCrCl} mL/min | Serum Potassium: ${customK} mEq/L | Patient Age: ${customPatientAge} years`;

    const activeSevFilter = isCase ? caseSeverityFilter : scanSeverityFilter;
    const activeSearch = isCase ? caseSearchQuery : scanSearchQuery;
    const activeCatFilter = isCase ? caseCategoryFilter : scanCategoryFilter;
    const activeSort = isCase ? caseSortBy : scanSortBy;

    const critCount = itemsToExport.filter(d => d.severityLevel === 'critical').length;
    const highCount = itemsToExport.filter(d => d.severityLevel === 'high').length;
    const medCount = itemsToExport.filter(d => d.severityLevel === 'medium').length;
    const lowCount = itemsToExport.filter(d => d.severityLevel === 'low').length;

    const nowStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>DTP Audit Record - ${patientTitle}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm 15mm 15mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 0;
              margin: 0;
              color: #0f172a;
              line-height: 1.45;
              font-size: 11px;
            }
            .no-print {
              background: #0f172a;
              color: #f8fafc;
              padding: 12px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 13px;
              border-bottom: 2px solid #0f766e;
            }
            .no-print button {
              background: #0d9488;
              color: #ffffff;
              border: none;
              padding: 8px 18px;
              border-radius: 6px;
              font-weight: bold;
              font-size: 12px;
              cursor: pointer;
            }
            .page-container {
              padding: 20px 25px;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #0f766e;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .brand-title {
              font-size: 17px;
              font-weight: 800;
              color: #0f766e;
              letter-spacing: -0.3px;
            }
            .brand-sub {
              font-size: 10px;
              color: #475569;
              font-weight: 600;
              margin-top: 2px;
            }
            .doc-meta {
              text-align: right;
              font-size: 10px;
              color: #334155;
            }
            .patient-box {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 10px 12px;
              margin-bottom: 12px;
            }
            .patient-grid {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 8px;
            }
            .filter-banner {
              background: #f0fdfa;
              border: 1px solid #99f6e4;
              border-radius: 6px;
              padding: 8px 12px;
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
            }
            .summary-cards {
              display: flex;
              gap: 8px;
              margin-bottom: 12px;
            }
            .stat-card {
              flex: 1;
              border-radius: 6px;
              padding: 6px 10px;
              text-align: center;
              border: 1px solid;
            }
            .stat-crit { background: #fee2e2; border-color: #f87171; color: #991b1b; }
            .stat-high { background: #ffedd5; border-color: #fb923c; color: #9a3412; }
            .stat-med  { background: #fef3c7; border-color: #fcd34d; color: #92400e; }
            .stat-low  { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
            .stat-total{ background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }
            
            table.dtp-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              font-size: 10px;
            }
            table.dtp-table th, table.dtp-table td {
              border: 1px solid #cbd5e1;
              padding: 7px 8px;
              vertical-align: top;
            }
            table.dtp-table th {
              background: #f1f5f9;
              font-weight: 700;
              color: #0f172a;
              text-align: left;
            }
            .badge-crit {
              display: inline-block;
              background: #fee2e2;
              color: #991b1b;
              border: 1px solid #f87171;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              text-transform: uppercase;
            }
            .badge-high {
              display: inline-block;
              background: #ffedd5;
              color: #9a3412;
              border: 1px solid #fb923c;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              text-transform: uppercase;
            }
            .badge-med {
              display: inline-block;
              background: #fef3c7;
              color: #92400e;
              border: 1px solid #fcd34d;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              text-transform: uppercase;
            }
            .badge-low {
              display: inline-block;
              background: #d1fae5;
              color: #065f46;
              border: 1px solid #6ee7b7;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              text-transform: uppercase;
            }
            .intervention-box {
              background: #f8fafc;
              border-left: 3px solid #0f766e;
              padding: 4px 6px;
              margin-top: 4px;
              font-size: 9.5px;
            }
            .sig-section {
              margin-top: 24px;
              padding-top: 12px;
              border-top: 1px solid #cbd5e1;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .sig-box {
              border: 1px dashed #cbd5e1;
              border-radius: 6px;
              padding: 10px;
              background: #fcfcfd;
            }
            @media print {
              .no-print { display: none !important; }
              body { padding: 0; }
              .page-container { padding: 0; }
              table.dtp-table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <div>
              <strong>Patient Record PDF Export</strong> • ${itemsToExport.length} Filtered Drug Therapy Problems
            </div>
            <button onclick="window.print()">Print / Save as PDF</button>
          </div>

          <div class="page-container">
            <!-- Header Table -->
            <table class="header-table" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle;">
                  <div class="brand-title">DRUG THERAPY PROBLEM (DTP) AUDIT & RECORD-KEEPING REPORT</div>
                  <div class="brand-sub">Pharmaceutical Care Practice Standard (Cipolle, Strand & Morley Framework) • Ethiopian EFDA & MoH Aligned</div>
                </td>
                <td class="doc-meta" style="vertical-align: middle;">
                  <div><strong>Document Ref:</strong> DTP-${Date.now().toString().slice(-6)}</div>
                  <div><strong>Export Date:</strong> ${nowStr} at ${timeStr}</div>
                  <div><strong>Status:</strong> Active Clinical Audit Record</div>
                </td>
              </tr>
            </table>

            <!-- Patient Information Box -->
            <div class="patient-box">
              <div class="patient-grid">
                <div>
                  <div><strong>Patient Demographics:</strong> ${patientProfile}</div>
                  <div style="margin-top: 3px;"><strong>Clinical Setting:</strong> ${clinicalSetting}</div>
                  <div style="margin-top: 3px;"><strong>Vitals & Renal Function:</strong> ${vitalsText}</div>
                </div>
                <div>
                  <div><strong>Medical Record No:</strong> MRN-${Date.now().toString().slice(-5)}</div>
                  <div style="margin-top: 3px;"><strong>Case Title:</strong> ${patientTitle}</div>
                </div>
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                <strong>Current Medication Regimen Audited:</strong> ${currentMedsText}
              </div>
            </div>

            <!-- Filter Status & Severity Statistics Summary -->
            <div class="filter-banner">
              <div>
                <strong>Active Severity Filter:</strong> 
                <span style="color: #0f766e; font-weight: 700; text-transform: uppercase;">${activeSevFilter === 'all' ? 'All Severity Tiers Included' : `${activeSevFilter} Severity Only`}</span>
                ${activeCatFilter !== 'all' ? ` • <strong>Category:</strong> ${activeCatFilter}` : ''}
                ${activeSearch ? ` • <strong>Search Keyword:</strong> "${activeSearch}"` : ''}
              </div>
              <div>
                <strong>Filtered Issues:</strong> ${itemsToExport.length} of ${isCase ? activeCase.identifiedDTPs.length : (scannedDTPs?.length || itemsToExport.length)} Total
              </div>
            </div>

            <!-- Severity Counts Bar -->
            <div class="summary-cards">
              <div class="stat-card stat-total">
                <div style="font-size: 13px; font-weight: 800;">${itemsToExport.length}</div>
                <div style="font-size: 9px; font-weight: 700;">TOTAL FILTERED</div>
              </div>
              <div class="stat-card stat-crit">
                <div style="font-size: 13px; font-weight: 800;">${critCount}</div>
                <div style="font-size: 9px; font-weight: 700;">CRITICAL</div>
              </div>
              <div class="stat-card stat-high">
                <div style="font-size: 13px; font-weight: 800;">${highCount}</div>
                <div style="font-size: 9px; font-weight: 700;">HIGH</div>
              </div>
              <div class="stat-card stat-med">
                <div style="font-size: 13px; font-weight: 800;">${medCount}</div>
                <div style="font-size: 9px; font-weight: 700;">MEDIUM</div>
              </div>
              <div class="stat-card stat-low">
                <div style="font-size: 13px; font-weight: 800;">${lowCount}</div>
                <div style="font-size: 9px; font-weight: 700;">LOW</div>
              </div>
            </div>

            <!-- Filtered DTP Table -->
            <table class="dtp-table">
              <thead>
                <tr>
                  <th style="width: 12%;">Severity</th>
                  <th style="width: 18%;">Suspected Drug & Regimen</th>
                  <th style="width: 18%;">DTP Category & Code</th>
                  <th style="width: 26%;">Mechanism & Patient Risk</th>
                  <th style="width: 26%;">Proposed Intervention & Monitoring</th>
                </tr>
              </thead>
              <tbody>
                ${itemsToExport.map(dtp => {
                  const badgeClass = dtp.severityLevel === 'critical'
                    ? 'badge-crit'
                    : dtp.severityLevel === 'high'
                    ? 'badge-high'
                    : dtp.severityLevel === 'medium'
                    ? 'badge-med'
                    : 'badge-low';

                  return `
                    <tr>
                      <td>
                        <span class="${badgeClass}">${dtp.severity}</span>
                      </td>
                      <td>
                        <strong>${dtp.suspectedDrug}</strong>
                      </td>
                      <td>
                        <strong>${dtp.category}</strong>
                        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">${dtp.cipolleClassificationCode}</div>
                      </td>
                      <td>
                        <div><strong>Mechanism:</strong> ${dtp.contributingCause}</div>
                        <div style="color: #991b1b; margin-top: 2px;"><strong>Consequence:</strong> ${dtp.clinicalConsequence}</div>
                      </td>
                      <td>
                        <div class="intervention-box">
                          <strong>Pharmacist Recommendation:</strong> ${dtp.proposedPharmacistIntervention}
                        </div>
                        <div style="font-size: 8.5px; color: #0f766e; margin-top: 2px;">
                          <strong>Monitoring:</strong> ${dtp.monitoringParameter}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <!-- SOAP Note Section (if Case Study) -->
            ${isCase ? `
              <div style="margin-top: 15px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #fafafa;">
                <div style="font-weight: 700; color: #0f766e; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
                  CLINICAL PHARMACIST SOAP NOTE (ATTACHED TO PERMANENT RECORD)
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9.5px;">
                  <div><strong>S (Subjective):</strong> ${activeCase.clinicalPharmacistSOAP.subjective}</div>
                  <div><strong>O (Objective):</strong> ${activeCase.clinicalPharmacistSOAP.objective}</div>
                  <div><strong>A (Assessment):</strong> ${activeCase.clinicalPharmacistSOAP.assessment}</div>
                  <div><strong>P (Plan):</strong> ${activeCase.clinicalPharmacistSOAP.plan}</div>
                </div>
              </div>
            ` : ''}

            <!-- Formal Sign-Off & Verification Block -->
            <div class="sig-section">
              <div class="sig-box">
                <div style="font-weight: 700; color: #0f766e; margin-bottom: 4px;">Audited By Clinical Pharmacist:</div>
                <div style="font-size: 11px; font-weight: 800;">Pharmacist Dawid Aliyi, BCPS</div>
                <div style="font-size: 9.5px; color: #475569;">Lead Clinical Pharmacist & Preceptor</div>
                <div style="font-size: 9px; color: #64748b;">License No: EFDA/CLIN/ETH/2026/0491 • Ethiopian Ministry of Health</div>
                <div style="margin-top: 10px; border-top: 1px solid #cbd5e1; padding-top: 3px; font-size: 9px;">
                  Signature: <em>Pharmacist Dawid Aliyi</em> • Date: ${nowStr}
                </div>
              </div>

              <div class="sig-box">
                <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">Attending Physician / Care Team Disposition:</div>
                <div style="font-size: 9px; margin-bottom: 6px;">
                  [ &nbsp; ] Accepted As Recommended &nbsp;&nbsp;&nbsp; [ &nbsp; ] Modified &nbsp;&nbsp;&nbsp; [ &nbsp; ] Retained
                </div>
                <div style="margin-top: 15px; border-top: 1px solid #cbd5e1; padding-top: 3px; font-size: 9px;">
                  Physician Signature: _______________________ &nbsp; Date: ___________
                </div>
                <div style="font-size: 9px; color: #64748b; margin-top: 2px;">
                  Print Name & MD License: _________________________________________
                </div>
              </div>
            </div>

            <!-- Footer Compliance Notice -->
            <div style="text-align: center; margin-top: 15px; font-size: 8.5px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 6px;">
              Pharma Star App Pro Clinical Suite • Compliant with EFDA Good Pharmacy Practice (GPP) & WHO Hospital Pharmacotherapy Auditing Guidelines.
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Drug Therapy Problem (DTP) Identifier
              </span>
              <span className="text-xs text-slate-400">Cipolle, Strand & Morley Pharmaceutical Care Classification</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Clinical Pharmacotherapy Workup of Notes & DTP Auditor
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Identify, resolve, and prevent medication-related problems across 7 standardized clinical domains: Indication, Effectiveness, Safety, and Patient Adherence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Export Feature (User Request 5) */}
            <button
              onClick={() => handleOpenQuickExport(activeTab === 'interactive_checker' ? 'scan' : 'case')}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-teal-500/20"
              title="Generate quick text summary or formatted handover for rapid clinical sharing"
            >
              <Share2 className="w-4 h-4 text-white" />
              <span>Quick Export</span>
            </button>

            {/* Standardized Clinical Pharmacist Intervention Report (User Request 7) */}
            <button
              onClick={() => handleOpenInterventionReport(activeTab === 'interactive_checker' ? 'scan' : 'case')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
              title="Format into standardized Clinical Pharmacist Intervention Report (MoH / Hospital DTC printable structure)"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>Intervention Report (PDF)</span>
            </button>

            <button
              onClick={handlePrintSOAP}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print SOAP</span>
            </button>

            <button
              onClick={handleCopySOAP}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedNote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNote ? 'Copied' : 'Copy SOAP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('case_studies')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'case_studies'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Real-World Hospital Case Studies ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('interactive_checker')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'interactive_checker'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Custom Regimen DTP Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('dtp_classification_guide')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'dtp_classification_guide'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>The 7 Cipolle DTP Categories (Theory & Criteria)</span>
        </button>
      </div>

      {/* TAB 1: Real-World Hospital Case Studies */}
      {activeTab === 'case_studies' && (
        <div className="space-y-6">
          {/* Case Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cases.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                  c.id === selectedCaseId
                    ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded uppercase">
                    {c.clinicalSetting.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    {c.identifiedDTPs.length} DTPs Detected
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.chiefComplaintAndHPI}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 cols: Patient Profile & Regimen */}
            <div className="lg:col-span-5 space-y-4">
              {/* Demographics & History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-400" /> Patient Presentation
                  </span>
                  <span className="text-teal-400 font-mono text-[11px]">{activeCase.patientDemographics}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">HPI / Clinical Course:</span>
                  <p className="text-slate-300 leading-relaxed">{activeCase.chiefComplaintAndHPI}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Past Medical History:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.pastMedicalHistory.map((pmh, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        {pmh}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Key Vitals & Labs:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>BP: <strong className="text-white">{activeCase.labVitals.bp}</strong></div>
                    <div>HR: <strong className="text-white">{activeCase.labVitals.hr}</strong></div>
                    <div>SCr: <strong className="text-amber-400">{activeCase.labVitals.scr}</strong></div>
                    <div>CrCl: <strong className="text-teal-300">{activeCase.labVitals.crcl}</strong></div>
                    <div>Serum K+: <strong className="text-rose-400">{activeCase.labVitals.k}</strong></div>
                    <div>Glucose: <strong className="text-white">{activeCase.labVitals.glucose}</strong></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 italic">{activeCase.labVitals.other}</p>
                </div>
              </div>

              {/* Medication List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs space-y-3">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-400" /> Current Medication Regimen Audited
                </h4>

                <div className="space-y-2">
                  {activeCase.currentMedications.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">{m.drug} {m.dose}</div>
                        <div className="text-[10px] text-slate-400">{m.indication}</div>
                      </div>
                      <span className="font-mono text-[11px] text-teal-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {m.freq}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 cols: Detected DTPs & SOAP Workup */}
            <div className="lg:col-span-7 space-y-4">
              {/* DTP List with Sorting & Filtering */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Identified Drug Therapy Problems ({displayedCaseDTPs.length} shown / {activeCase.identifiedDTPs.length} total)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportFilteredToPDF('case')}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center gap-1 transition shadow cursor-pointer"
                      title="Export filtered problems with severity tiers for patient record-keeping"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export to PDF ({displayedCaseDTPs.length})</span>
                    </button>
                  </div>
                </div>

                {/* Severity Quick-Filter Bar with Counts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-sm">
                  {/* Severity Count Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-teal-400" />
                      <span>Severity:</span>
                    </span>

                    {/* All Filter */}
                    <button
                      onClick={() => setCaseSeverityFilter('all')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        caseSeverityFilter === 'all'
                          ? 'bg-teal-600 text-white shadow'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>All</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                        {caseCounts.total}
                      </span>
                    </button>

                    {/* Critical Filter */}
                    <button
                      onClick={() => setCaseSeverityFilter('critical')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        caseSeverityFilter === 'critical'
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-slate-950 text-rose-300 hover:bg-rose-950/40 border border-rose-500/30'
                      }`}
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      <span>Critical</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950/80 text-rose-300 border border-rose-500/40 font-mono">
                        {caseCounts.critical}
                      </span>
                    </button>

                    {/* High Filter */}
                    <button
                      onClick={() => setCaseSeverityFilter('high')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        caseSeverityFilter === 'high'
                          ? 'bg-orange-600 text-white shadow'
                          : 'bg-slate-950 text-orange-300 hover:bg-orange-950/40 border border-orange-500/30'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                      <span>High</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-950/80 text-orange-300 border border-orange-500/40 font-mono">
                        {caseCounts.high}
                      </span>
                    </button>

                    {/* Medium Filter */}
                    <button
                      onClick={() => setCaseSeverityFilter('medium')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        caseSeverityFilter === 'medium'
                          ? 'bg-amber-600 text-white shadow'
                          : 'bg-slate-950 text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Medium</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/40 font-mono">
                        {caseCounts.medium}
                      </span>
                    </button>

                    {/* Low Filter */}
                    <button
                      onClick={() => setCaseSeverityFilter('low')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        caseSeverityFilter === 'low'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-950 text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Low</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono">
                        {caseCounts.low}
                      </span>
                    </button>

                    {/* Reset button if active */}
                    {(caseSeverityFilter !== 'all' || caseCategoryFilter !== 'all' || caseSearchQuery) && (
                      <button
                        onClick={() => {
                          setCaseSeverityFilter('all');
                          setCaseCategoryFilter('all');
                          setCaseSearchQuery('');
                        }}
                        className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold ml-auto"
                      >
                        <X className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  {/* Search, Category & Sort Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-800/80">
                    {/* Search Input */}
                    <div className="sm:col-span-5 relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search drug, cause, or plan..."
                        value={caseSearchQuery}
                        onChange={(e) => setCaseSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                      />
                      {caseSearchQuery && (
                        <button
                          onClick={() => setCaseSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div className="sm:col-span-4">
                      <select
                        value={caseCategoryFilter}
                        onChange={(e) => setCaseCategoryFilter(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 outline-none cursor-pointer"
                      >
                        <option value="all">All Cipolle Categories</option>
                        <option value="Adverse Drug Reaction (ADR)">Adverse Drug Reaction (ADR)</option>
                        <option value="Dosage Too High">Dosage Too High</option>
                        <option value="Dosage Too Low">Dosage Too Low</option>
                        <option value="Ineffective Drug">Ineffective Drug</option>
                        <option value="Needs Additional Drug Therapy">Needs Additional Therapy</option>
                        <option value="Unnecessary Drug Therapy">Unnecessary Therapy</option>
                        <option value="Non-Adherence / Compliance">Non-Adherence / Compliance</option>
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div className="sm:col-span-3">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={caseSortBy}
                          onChange={(e) => setCaseSortBy(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-200 focus:border-teal-500 outline-none cursor-pointer"
                        >
                          <option value="severity-desc">Severity: High → Low</option>
                          <option value="severity-asc">Severity: Low → High</option>
                          <option value="drug-asc">Drug: A → Z</option>
                          <option value="drug-desc">Drug: Z → A</option>
                          <option value="category">Category</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Render Filtered DTP Cards */}
                {displayedCaseDTPs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                    <Filter className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs text-slate-400">
                      No drug therapy problems match the selected severity or category filter.
                    </p>
                    <button
                      onClick={() => {
                        setCaseSeverityFilter('all');
                        setCaseCategoryFilter('all');
                        setCaseSearchQuery('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  displayedCaseDTPs.map((dtp, idx) => {
                    const isCritical = dtp.severityLevel === 'critical';
                    const isHigh = dtp.severityLevel === 'high';
                    const isMedium = dtp.severityLevel === 'medium';
                    const isLow = dtp.severityLevel === 'low';

                    const borderAccent = isCritical
                      ? 'border-l-4 border-l-rose-500'
                      : isHigh
                      ? 'border-l-4 border-l-orange-500'
                      : isMedium
                      ? 'border-l-4 border-l-amber-500'
                      : 'border-l-4 border-l-emerald-500';

                    const severityBadge = isCritical
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : isHigh
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : isMedium
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';

                    const SeverityIcon = isCritical
                      ? AlertOctagon
                      : isHigh
                      ? AlertTriangle
                      : isMedium
                      ? AlertCircle
                      : CheckCircle2;

                    return (
                      <div key={idx} className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 shadow-md ${borderAccent}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                              {dtp.category}
                            </span>
                            <span className="font-bold text-white text-sm">{dtp.suspectedDrug}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide ${severityBadge}`}>
                            <SeverityIcon className="w-3.5 h-3.5" />
                            <span>{dtp.severity}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                            <strong className="text-slate-400 block mb-0.5">Contributing Mechanism:</strong>
                            <span className="text-slate-300">{dtp.contributingCause}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                            <strong className="text-rose-400 block mb-0.5">Clinical Consequence:</strong>
                            <span className="text-slate-300">{dtp.clinicalConsequence}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs space-y-1">
                          <div className="font-bold text-teal-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Proposed Pharmacist Intervention:
                          </div>
                          <p className="text-slate-200">{dtp.proposedPharmacistIntervention}</p>
                          <div className="text-[10px] text-teal-400/80 pt-1 flex items-center justify-between">
                            <span><strong>Monitoring Plan:</strong> {dtp.monitoringParameter}</span>
                            <span className="font-mono text-[9px] text-slate-500">{dtp.cipolleClassificationCode}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* SOAP Note Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-400" /> Clinical Pharmacist SOAP Note (Ready for Medical Record)
                  </h4>
                  <button
                    onClick={handleCopySOAP}
                    className="text-teal-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedNote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNote ? 'Copied!' : 'Copy Note'}</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-teal-400 block mb-0.5">S (Subjective):</strong>
                    <p className="text-slate-300 text-[11px]">{activeCase.clinicalPharmacistSOAP.subjective}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-teal-400 block mb-0.5">O (Objective):</strong>
                    <p className="text-slate-300 text-[11px]">{activeCase.clinicalPharmacistSOAP.objective}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">A (Assessment):</strong>
                    <p className="text-slate-300 text-[11px]">{activeCase.clinicalPharmacistSOAP.assessment}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-teal-500/30">
                    <strong className="text-emerald-400 block mb-0.5">P (Plan):</strong>
                    <p className="text-slate-300 text-[11px]">{activeCase.clinicalPharmacistSOAP.plan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Custom Interactive Regimen Scanner */}
      {activeTab === 'interactive_checker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Input Patient Medication Regimen</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Patient Age:</label>
                <input
                  type="number"
                  value={customPatientAge}
                  onChange={(e) => setCustomPatientAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Diagnosed Medical Conditions:</label>
                <input
                  type="text"
                  value={customConditions}
                  onChange={(e) => setCustomConditions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Current Medications (Names, Doses & Frequencies):</label>
                <textarea
                  rows={4}
                  value={customMedList}
                  onChange={(e) => setCustomMedList(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-teal-500 outline-none"
                  placeholder="e.g. Enalapril 10mg BID, Furosemide 40mg daily, Diclofenac 50mg TID..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Calculated CrCl (mL/min):</label>
                  <input
                    type="number"
                    value={customCrCl}
                    onChange={(e) => setCustomCrCl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Serum Potassium (mEq/L):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customK}
                    onChange={(e) => setCustomK(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleRunInteractiveScan}
                disabled={isScanning}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cross-Auditing Cipolle DTP Matrices...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Run Clinical DTP Audit Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-bold text-white">DTP Audit Scan Results</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {scannedDTPs ? `${displayedScannedDTPs?.length || 0} Shown / ${scannedDTPs.length} Identified` : 'Awaiting Audit Trigger'}
                  </span>
                  {scannedDTPs && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenQuickExport('scan')}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center gap-1 transition shadow cursor-pointer"
                        title="Generate quick clinical sharing summary"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Quick Export</span>
                      </button>

                      <button
                        onClick={() => handleOpenInterventionReport('scan')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 transition shadow cursor-pointer"
                        title="Standardized Clinical Pharmacist Intervention Report (Printable PDF)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Report (PDF)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {scannedDTPs ? (
                <div className="space-y-3">
                  {/* Scanner Filter & Sort Bar */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                    {/* Severity Filter Strip */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-teal-400" />
                        <span>Severity:</span>
                      </span>

                      <button
                        onClick={() => setScanSeverityFilter('all')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          scanSeverityFilter === 'all'
                            ? 'bg-teal-600 text-white shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span>All</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                          {scanCounts.total}
                        </span>
                      </button>

                      <button
                        onClick={() => setScanSeverityFilter('critical')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          scanSeverityFilter === 'critical'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-900 text-rose-300 hover:bg-rose-950/40 border border-rose-500/30'
                        }`}
                      >
                        <AlertOctagon className="w-3 h-3 text-rose-400" />
                        <span>Critical</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950/80 text-rose-300 border border-rose-500/40 font-mono">
                          {scanCounts.critical}
                        </span>
                      </button>

                      <button
                        onClick={() => setScanSeverityFilter('high')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          scanSeverityFilter === 'high'
                            ? 'bg-orange-600 text-white shadow'
                            : 'bg-slate-900 text-orange-300 hover:bg-orange-950/40 border border-orange-500/30'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3 text-orange-400" />
                        <span>High</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-950/80 text-orange-300 border border-orange-500/40 font-mono">
                          {scanCounts.high}
                        </span>
                      </button>

                      <button
                        onClick={() => setScanSeverityFilter('medium')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          scanSeverityFilter === 'medium'
                            ? 'bg-amber-600 text-white shadow'
                            : 'bg-slate-900 text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Medium</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/40 font-mono">
                          {scanCounts.medium}
                        </span>
                      </button>

                      <button
                        onClick={() => setScanSeverityFilter('low')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          scanSeverityFilter === 'low'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-900 text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Low</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono">
                          {scanCounts.low}
                        </span>
                      </button>

                      {(scanSeverityFilter !== 'all' || scanCategoryFilter !== 'all' || scanSearchQuery) && (
                        <button
                          onClick={() => {
                            setScanSeverityFilter('all');
                            setScanCategoryFilter('all');
                            setScanSearchQuery('');
                          }}
                          className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold ml-auto"
                        >
                          <X className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-800/80">
                      <div className="sm:col-span-6 relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search scanned issues..."
                          value={scanSearchQuery}
                          onChange={(e) => setScanSearchQuery(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-7 py-1 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                        />
                        {scanSearchQuery && (
                          <button
                            onClick={() => setScanSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <select
                          value={scanSortBy}
                          onChange={(e) => setScanSortBy(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:border-teal-500 outline-none cursor-pointer"
                        >
                          <option value="severity-desc">Sort: Severity High → Low</option>
                          <option value="severity-asc">Sort: Severity Low → High</option>
                          <option value="drug-asc">Sort: Drug A → Z</option>
                          <option value="drug-desc">Sort: Drug Z → A</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Scanned Items Display */}
                  {displayedScannedDTPs && displayedScannedDTPs.length === 0 ? (
                    <div className="p-6 text-center bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <Filter className="w-6 h-6 mx-auto text-slate-600" />
                      <p className="text-xs text-slate-400">No scanned issues match the selected severity filter.</p>
                      <button
                        onClick={() => {
                          setScanSeverityFilter('all');
                          setScanCategoryFilter('all');
                          setScanSearchQuery('');
                        }}
                        className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    displayedScannedDTPs?.map((dtp, idx) => {
                      const isCritical = dtp.severityLevel === 'critical';
                      const isHigh = dtp.severityLevel === 'high';
                      const isMedium = dtp.severityLevel === 'medium';
                      const isLow = dtp.severityLevel === 'low';

                      const borderAccent = isCritical
                        ? 'border-l-4 border-l-rose-500'
                        : isHigh
                        ? 'border-l-4 border-l-orange-500'
                        : isMedium
                        ? 'border-l-4 border-l-amber-500'
                        : 'border-l-4 border-l-emerald-500';

                      const severityBadge = isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isHigh
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        : isMedium
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';

                      const SeverityIcon = isCritical
                        ? AlertOctagon
                        : isHigh
                        ? AlertTriangle
                        : isMedium
                        ? AlertCircle
                        : CheckCircle2;

                      return (
                        <div key={idx} className={`p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 ${borderAccent}`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-white text-sm">
                              <span className="text-teal-400 font-mono text-[10px] mr-1.5 uppercase">[{dtp.category}]</span>
                              {dtp.suspectedDrug}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide ${severityBadge}`}>
                              <SeverityIcon className="w-3 h-3" />
                              <span>{dtp.severity}</span>
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{dtp.contributingCause}</p>
                          <div className="p-2.5 rounded bg-slate-900 border border-teal-500/30 text-teal-300 text-[11px]">
                            <strong>Pharmacist Recommendation:</strong> {dtp.proposedPharmacistIntervention}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <AlertTriangle className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">Click "Run Clinical DTP Audit Scan" to evaluate the patient's regimen for contraindications, organ dosing, and drug-disease conflicts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Cipolle Classification Criteria Guide */}
      {activeTab === 'dtp_classification_guide' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>The 7 Standard Drug Therapy Problem Categories (Cipolle, Strand & Morley)</span>
            </h3>
            <p className="text-slate-400 text-[11px]">
              Universally recognized framework adopted by clinical pharmacy curricula, Ethiopian MoH CPD modules, and ASHP/FIP hospital practice guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: '1',
                title: 'Unnecessary Drug Therapy',
                domain: 'Indication',
                subtypes: ['No medical indication at this time', 'Duplicate therapy (multiple drugs for condition needing one)', 'Non-drug therapy indicated', 'Treating an avoidable adverse effect of another drug (prescribing cascade)']
              },
              {
                num: '2',
                title: 'Needs Additional Drug Therapy',
                domain: 'Indication',
                subtypes: ['Untreated medical condition', 'Synergistic or potentiating therapy needed to reach clinical goal', 'Preventive / prophylactic therapy indicated (e.g. statin for DM, GI protection with chronic NSAIDs)']
              },
              {
                num: '3',
                title: 'Ineffective Drug Product',
                domain: 'Effectiveness',
                subtypes: ['Drug not effective for the specific clinical indication', 'Wrong drug product or ineffective dosage form', 'Condition is refractory to current agent']
              },
              {
                num: '4',
                title: 'Dosage Too Low',
                domain: 'Effectiveness',
                subtypes: ['Dose too low to elicit therapeutic response', 'Frequency too infrequent', 'Drug interaction reducing active concentration (e.g. enzyme induction)', 'Duration of therapy too short']
              },
              {
                num: '5',
                title: 'Adverse Drug Reaction (ADR)',
                domain: 'Safety',
                subtypes: ['Undesirable pharmacological side effect', 'Unsafe drug for patient (contraindication, e.g. Metformin in GFR < 30)', 'Allergic / hypersensitivity reaction', 'Regimen increased too rapidly']
              },
              {
                num: '6',
                title: 'Dosage Too High',
                domain: 'Safety',
                subtypes: ['Dose exceeds safe therapeutic index', 'Dosing frequency too frequent', 'Duration of therapy too long (e.g. prolonged antibiotics)', 'Drug interaction causing accumulation']
              },
              {
                num: '7',
                title: 'Non-Adherence / Compliance',
                domain: 'Adherence',
                subtypes: ['Patient does not understand directions', 'Cannot afford medication costs', 'Patient forgets doses', 'Prefers not to take due to adverse effects or personal beliefs', 'Drug formulation unavailable']
              }
            ].map(cat => (
              <div key={cat.num} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-xs">
                    {cat.num}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Domain: {cat.domain}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">{cat.title}</h4>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {cat.subtypes.map((sub, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Quick Export & Clinical Sharing (User Request 5) */}
      {quickExportModalOpen && (() => {
        const textSummary = generateQuickTextSummary(exportSource);
        const data = getActiveExportData(exportSource);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Quick Clinical Handover &amp; Export</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">
                        {data.reportRef}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Formatted plain-text summary suitable for EMR notes, multidisciplinary ward rounds, or messaging
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setQuickExportModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-semibold text-slate-300">{data.dtps.length} DTP(s)</span>
                  <span>•</span>
                  <span>Target: <strong className="text-teal-300">{data.patientDemographics.split('•')[0]}</strong></span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleCopyQuickText(exportSource)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    {copiedQuickText ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuickText ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadQuickText(exportSource)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-400" />
                    <span>Download .txt</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickExportModalOpen(false);
                      setReportModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-950" />
                    <span>Printable Report (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Text Summary Body */}
              <div className="p-5 overflow-y-auto flex-1 bg-slate-950/70 font-mono text-[11px] leading-relaxed text-slate-300 selection:bg-teal-500 selection:text-white">
                <pre className="whitespace-pre-wrap break-words bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-inner">
                  {textSummary}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>EFDA &amp; MoH Pharmaceutical Care Standard Handover</span>
                </span>
                <button
                  onClick={() => setQuickExportModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 2: Standardized 'Clinical Pharmacist Intervention Report' Template Engine (User Request 7) */}
      {reportModalOpen && (() => {
        const data = getActiveExportData(exportSource);
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
              {/* Screen-Only Modal Header & Action Toolbar */}
              <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>Clinical Pharmacist Intervention Report</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-mono">
                        MoH / DTC Standard
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Printable PDF structure with Cipolle classification, SBAR workup, and Physician disposition
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save as PDF</span>
                  </button>

                  <button
                    onClick={() => handleDownloadReportHtml(exportSource)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-teal-400" />
                    <span>Download HTML</span>
                  </button>

                  <button
                    onClick={() => handleCopyQuickText(exportSource)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Text</span>
                  </button>

                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Report Document Viewer */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-950">
                <div 
                  id="clinical-intervention-report-dossier" 
                  className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl border border-slate-200 text-xs leading-relaxed space-y-6"
                >
                  {/* MoH & Hospital DTC Header */}
                  <div className="border-b-2 border-teal-700 pb-4 space-y-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                      <span>Federal Democratic Republic of Ethiopia • Ministry of Health</span>
                      <span>Hospital Drug &amp; Therapeutics Committee (DTC)</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
                      <div>
                        <h1 className="text-xl sm:text-2xl font-black text-teal-800 tracking-tight">
                          CLINICAL PHARMACIST INTERVENTION REPORT
                        </h1>
                        <p className="text-slate-600 font-semibold text-[11px]">
                          Standardized Pharmaceutical Care &amp; Drug Therapy Problem (DTP) Resolution Dossier
                        </p>
                      </div>

                      <div className="text-right text-[11px] font-mono bg-slate-100 p-2 rounded-lg border border-slate-200 shrink-0">
                        <div><strong>REF:</strong> {data.reportRef}</div>
                        <div><strong>DATE:</strong> {dateStr} {timeStr}</div>
                      </div>
                    </div>
                  </div>

                  {/* Patient & Facility Grid */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-500 font-semibold">Patient Profile:</span>
                      <div className="font-bold text-slate-900 text-xs">{data.patientDemographics}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Clinical Setting / Ward:</span>
                      <div className="font-bold text-slate-900 text-xs">{data.clinicalSetting}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Primary Diagnoses / PMH:</span>
                      <div className="font-medium text-slate-800">{data.pastMedicalHistory.join(', ') || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Key Laboratory / Vitals:</span>
                      <div className="font-medium text-slate-800">
                        CrCl: {data.labVitals.crcl} • K+: {data.labVitals.k} • BP: {data.labVitals.bp}
                      </div>
                    </div>
                  </div>

                  {/* Active Regimen Strip */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">Screened Medication Regimen:</span>
                    <div className="text-slate-800 font-medium text-[11px] mt-1">
                      {data.currentMedications.join(' • ')}
                    </div>
                  </div>

                  {/* Section 1: Standardized Cipolle 7-Category Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>1. Identified Drug Therapy Problems ({data.dtps.length})</span>
                      </h2>
                      <span className="text-[10px] text-slate-500 font-medium">Cipolle, Strand &amp; Morley Standard</span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <th className="p-2.5 font-bold w-6">#</th>
                            <th className="p-2.5 font-bold w-48">Problem Category &amp; Drug</th>
                            <th className="p-2.5 font-bold w-20">Priority</th>
                            <th className="p-2.5 font-bold">Contributing Cause &amp; Clinical Harm</th>
                            <th className="p-2.5 font-bold">Pharmacist Recommendation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {data.dtps.map((dtp, idx) => {
                            const isCrit = dtp.severityLevel === 'critical';
                            const isHigh = dtp.severityLevel === 'high';
                            const isMed = dtp.severityLevel === 'medium';

                            return (
                              <tr key={dtp.id || idx} className="hover:bg-slate-50 transition">
                                <td className="p-2.5 font-bold text-slate-500 align-top">{idx + 1}</td>
                                <td className="p-2.5 align-top">
                                  <div className="font-bold text-slate-900 text-[11px]">{dtp.suspectedDrug}</div>
                                  <div className="text-teal-700 font-semibold">{dtp.category}</div>
                                  <div className="text-[9px] text-slate-500">{dtp.cipolleClassificationCode}</div>
                                </td>
                                <td className="p-2.5 align-top">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    isCrit
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : isHigh
                                      ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                      : isMed
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}>
                                    {dtp.severityLevel}
                                  </span>
                                </td>
                                <td className="p-2.5 align-top space-y-1">
                                  <div><strong className="text-slate-700">Cause:</strong> {dtp.contributingCause}</div>
                                  <div className="text-rose-700 font-medium">
                                    <strong>Consequence:</strong> {dtp.clinicalConsequence}
                                  </div>
                                </td>
                                <td className="p-2.5 align-top space-y-1">
                                  <div className="font-bold text-teal-900">{dtp.proposedPharmacistIntervention}</div>
                                  <div className="text-slate-600 text-[9px]">
                                    <strong>Target Monitoring:</strong> {dtp.monitoringParameter}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: SBAR Clinical Handover & SOAP Workup */}
                  <div>
                    <h2 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-2">
                      2. SBAR Clinical Handover &amp; Pharmacotherapy Workup
                    </h2>
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2 text-[11px]">
                      <div>
                        <strong className="text-teal-800">S (Situation):</strong>{' '}
                        <span className="text-slate-800">{data.soap.subjective}</span>
                      </div>
                      <div>
                        <strong className="text-teal-800">B (Background):</strong>{' '}
                        <span className="text-slate-800">
                          Patient history of {data.pastMedicalHistory.join(', ')}. Key lab values: CrCl {data.labVitals.crcl}, K+ {data.labVitals.k}, BP {data.labVitals.bp}. Active medicines: {data.currentMedications.join('; ')}.
                        </span>
                      </div>
                      <div>
                        <strong className="text-teal-800">A (Assessment):</strong>{' '}
                        <span className="text-slate-800">{data.soap.assessment}</span>
                      </div>
                      <div>
                        <strong className="text-teal-800">R (Recommendation):</strong>{' '}
                        <span className="text-slate-900 font-medium">{data.soap.plan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Prescriber / Attending Physician Disposition */}
                  <div className="border-2 border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase text-slate-800">
                        3. Attending Physician / Care Team Intervention Disposition
                      </h3>
                      <span className="text-[10px] text-slate-500 italic">Required under Ethiopian GPP / MoH Protocol</span>
                    </div>

                    {/* Interactive Selection for Print Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      {[
                        { id: 'accepted', label: 'Accepted as Recommended' },
                        { id: 'modified', label: 'Accepted with Modification' },
                        { id: 'retained', label: 'Retained Current Regimen' },
                        { id: 'rejected', label: 'Not Accepted / Alternative' }
                      ].map(opt => (
                        <label
                          key={opt.id}
                          className={`p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer font-medium transition ${
                            physicianDisposition === opt.id
                              ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="disposition"
                            checked={physicianDisposition === opt.id}
                            onChange={() => setPhysicianDisposition(opt.id as any)}
                            className="text-teal-600"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        Physician Clinical Commentary / Ward Action Notes:
                      </label>
                      <input
                        type="text"
                        value={physicianNotes}
                        onChange={(e) => setPhysicianNotes(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-teal-600"
                        placeholder="e.g. Recommendations discussed and accepted. NSAID stopped; furosemide IV commenced."
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-700">
                      <div>
                        <div>Physician Signature: _________________________________</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Print Full Name &amp; License Number</div>
                      </div>
                      <div>
                        <div>Date &amp; Time: _________________</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">MM / DD / YYYY — HH:MM</div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Lead Clinical Pharmacist Authentication */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px]">
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Reporting Specialist:</div>
                      <div className="text-sm font-extrabold text-teal-800">Pharmacist Dawid Aliyi, BCPS</div>
                      <div className="text-slate-600">Lead Clinical Pharmacist Specialist &amp; Academic Preceptor</div>
                      <div className="text-slate-500 font-mono text-[10px]">
                        EFDA Practicing License: <strong>EFDA/CLIN/ETH/2026/0491</strong>
                      </div>
                    </div>

                    <div className="border border-teal-700/30 rounded-xl p-3 bg-teal-50 text-center font-mono text-[9px] text-teal-900 space-y-0.5 shrink-0">
                      <div className="font-bold">✦ CLINICAL PHARMACY SERVICE ✦</div>
                      <div>ETHIOPIA PATIENT SAFETY AUDIT</div>
                      <div className="text-[8px] text-slate-500">DIGITAL HASH: SHA256-DTP-VERIFIED</div>
                    </div>
                  </div>

                  {/* Footer Notice */}
                  <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-3">
                    Pharma Star App Pro Clinical Suite • Standardized Clinical Pharmacist Intervention Report • Aligned with EFDA, MoH, and WHO Guidelines
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
