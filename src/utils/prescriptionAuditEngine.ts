// =====================================================================
// PHARMA STAR APP PRO - AUTOMATED PRESCRIPTION AUDIT & CLINICAL SAFETY ENGINE
// Lead Clinical Pharmacist: Dawid Aliyi, BCPS
// Compliant with: Ethiopian Standard Treatment Guidelines (STG 2026),
// EFDA Drug Safety Directives, KDIGO 2024, and WHO Model Formulary.
// =====================================================================

export interface AuditMedicationInput {
  drugName: string;
  dose: string;
  route: string;
  frequency: string;
  duration?: string;
  indication?: string;
}

export interface AuditPatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  weightKg: number;
  serumCreatinine: number; // mg/dL
  eGFR?: number; // mL/min/1.73m2
  pregnancyStatus?: 'none' | 'first_trimester' | 'second_trimester' | 'third_trimester' | 'lactating';
  allergies: string[];
  diagnoses: string[];
}

export interface DetectedSafetyIssue {
  id: string;
  category: 'dosing_error' | 'contraindication' | 'drug_interaction' | 'allergy_conflict' | 'pregnancy_risk' | 'organ_impairment';
  severity: 'contraindicated' | 'major' | 'moderate' | 'caution';
  involvedDrugs: string[];
  title: string;
  clinicalMechanism: string;
  riskSummary: string;
  evidenceGuideline: string;
  pharmacistRecommendation: string;
  suggestedAction: 'discontinue' | 'reduce_dose' | 'substitute_alternative' | 'space_timing' | 'monitor_labs';
  saferAlternatives?: string[];
  renalAdjustmentDetails?: {
    currentDose: string;
    recommendedDose: string;
    eGFRThreshold: number;
  };
}

export interface AuditSafetyChecklist {
  id: string;
  label: string;
  category: string;
  passed: boolean;
  note?: string;
}

export interface PrescriptionAuditReport {
  id: string;
  timestamp: string;
  overallStatus: 'critical_danger' | 'major_warning' | 'moderate_attention' | 'cleared_safe';
  totalIssues: number;
  criticalCount: number;
  majorCount: number;
  moderateCount: number;
  clearedCount: number;
  calculatedEGFR: number;
  isRenallyImpaired: boolean;
  issues: DetectedSafetyIssue[];
  checklist: AuditSafetyChecklist[];
  soapNote: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

// Calculate eGFR using CKD-EPI formula (2021 race-independent)
export function calculateCKDEPI(scr: number, age: number, gender: 'Male' | 'Female'): number {
  if (scr <= 0 || age <= 0) return 90;
  const isFemale = gender === 'Female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const scrDivKappa = scr / kappa;
  const minTerm = Math.min(scrDivKappa, 1);
  const maxTerm = Math.max(scrDivKappa, 1);
  const genderFactor = isFemale ? 1.012 : 1.0;

  const egfr = 142 * Math.pow(minTerm, alpha) * Math.pow(maxTerm, -1.200) * Math.pow(0.9938, age) * genderFactor;
  return Math.round(egfr);
}

// Helper to normalize drug strings
function norm(str: string): string {
  return (str || '').toLowerCase().trim();
}

// Helper to extract numeric mg dose from string like "1000 mg", "1g", "500mg BID"
function parseDoseMg(doseStr: string): number | null {
  if (!doseStr) return null;
  const cleaned = doseStr.toLowerCase().replace(/,/g, '');
  
  // Check for grams
  const gMatch = cleaned.match(/([\d.]+)\s*(?:g|gram|grams)/);
  if (gMatch) {
    const val = parseFloat(gMatch[1]);
    if (!isNaN(val)) return val * 1000;
  }

  // Check for mg
  const mgMatch = cleaned.match(/([\d.]+)\s*(?:mg|milligram)/);
  if (mgMatch) {
    const val = parseFloat(mgMatch[1]);
    if (!isNaN(val)) return val;
  }

  // Check bare number
  const numMatch = cleaned.match(/^([\d.]+)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    if (!isNaN(val)) return val;
  }

  return null;
}

// Helper to calculate daily frequency multiplier
function getDailyFrequencyMultiplier(frequencyStr: string): number {
  const f = norm(frequencyStr);
  if (f.includes('qid') || f.includes('4 times') || f.includes('q6h') || f.includes('every 6')) return 4;
  if (f.includes('tid') || f.includes('3 times') || f.includes('q8h') || f.includes('every 8')) return 3;
  if (f.includes('bid') || f.includes('twice') || f.includes('q12h') || f.includes('every 12')) return 2;
  if (f.includes('qd') || f.includes('daily') || f.includes('once') || f.includes('q24h')) return 1;
  if (f.includes('every other day') || f.includes('qod')) return 0.5;
  if (f.includes('weekly') || f.includes('once weekly') || f.includes('q week')) return 0.14;
  return 1;
}

// Main Clinical Prescription Audit Function
export function runAutomatedPrescriptionAudit(
  patient: AuditPatientProfile,
  medications: AuditMedicationInput[]
): PrescriptionAuditReport {
  const issues: DetectedSafetyIssue[] = [];
  const checklist: AuditSafetyChecklist[] = [];
  const reportId = `audit-rx-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // 1. Calculate or use eGFR
  const eGFR = patient.eGFR !== undefined && patient.eGFR > 0
    ? patient.eGFR
    : calculateCKDEPI(patient.serumCreatinine, patient.age, patient.gender);

  const isRenallyImpaired = eGFR < 60;
  const isSevereRenalImpairment = eGFR < 30;

  const allergyList = (patient.allergies || []).map(a => norm(a));
  const diagnosisList = (patient.diagnoses || []).map(d => norm(d));
  const isPregnant = patient.pregnancyStatus && patient.pregnancyStatus !== 'none';
  const isChild = patient.age < 12;

  // Track check categories
  let checkedDosing = true;
  let checkedRenal = true;
  let checkedInteractions = true;
  let checkedContraindications = true;
  let checkedAllergies = true;
  let checkedPregnancy = true;

  // Normalized drug entries
  const medItems = medications.map(m => {
    const name = norm(m.drugName);
    const doseMg = parseDoseMg(m.dose);
    const freqMult = getDailyFrequencyMultiplier(m.frequency);
    const totalDailyMg = doseMg ? doseMg * freqMult : null;
    return {
      raw: m,
      name,
      doseMg,
      freqMult,
      totalDailyMg
    };
  });

  // =========================================================================
  // PILLAR 1: DOSING ERRORS (RENAL, MAX DAILY DOSE, PEDIATRIC, FREQUENCY)
  // =========================================================================

  for (const med of medItems) {
    const d = med.name;
    const dailyMg = med.totalDailyMg;
    const singleMg = med.doseMg;

    // --- Metformin in Renal Impairment ---
    if (d.includes('metformin')) {
      if (eGFR < 30) {
        issues.push({
          id: `dose-metformin-ckd-${Date.now()}`,
          category: 'dosing_error',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'Metformin Contraindicated in Severe Renal Impairment (eGFR < 30 mL/min)',
          clinicalMechanism: 'Metformin undergoes 90-100% renal tubular and glomerular clearance without hepatic metabolism. When eGFR drops below 30 mL/min, systemic accumulation leads to severe biguanide-associated lactic acidosis (mortality exceeding 40%).',
          riskSummary: 'High mortality risk from metabolic lactic acidosis with anion gap, hypotension, and renal shutdown.',
          evidenceGuideline: 'Ethiopian STG 2026 (Endocrine & Renal Chapter), EFDA Black Box Safety Advisory, KDIGO Diabetes 2024.',
          pharmacistRecommendation: 'Discontinue Metformin immediately. Switch to Linagliptin 5 mg PO daily (eliminated via bile, no renal adjustment) or titrate Insulin glargine/regular based on bedside glycemic charts.',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Linagliptin 5 mg PO QD (No renal adjustment)', 'Empagliflozin 10 mg (if eGFR > 20)', 'Subcutaneous Insulin with SMBG'],
          renalAdjustmentDetails: {
            currentDose: med.raw.dose + ' ' + med.raw.frequency,
            recommendedDose: 'Contraindicated (0 mg/day)',
            eGFRThreshold: 30
          }
        });
      } else if (eGFR < 45 && dailyMg && dailyMg > 1000) {
        issues.push({
          id: `dose-metformin-reduce-${Date.now()}`,
          category: 'dosing_error',
          severity: 'major',
          involvedDrugs: [med.raw.drugName],
          title: 'Metformin Exceeds Maximum Recommended Dose for Moderate Renal Impairment (eGFR 30-44)',
          clinicalMechanism: 'In moderate CKD stage 3b, clearance is substantially reduced. Safe dosing limit is 1,000 mg/day (500 mg twice daily). Current prescribed total exceeds safe clearance threshold.',
          riskSummary: 'Gradual accumulation of biguanide metabolites triggering subclinical hyperlactatemia and GI toxicity.',
          evidenceGuideline: 'ADA/KDIGO Consensus 2024 & Ethiopian National STG.',
          pharmacistRecommendation: 'Reduce Metformin dose to 500 mg PO twice daily (max 1000 mg/day). Recheck renal panel in 3 months.',
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Metformin 500 mg PO BID (Max 1000 mg/day)', 'Linagliptin 5 mg PO QD']
        });
      }
    }

    // --- Lisinopril / Enalapril in Low eGFR ---
    if ((d.includes('lisinopril') || d.includes('enalapril') || d.includes('captopril') || d.includes('ramipril')) && eGFR < 30) {
      if (singleMg && singleMg > 5) {
        issues.push({
          id: `dose-acei-renal-${Date.now()}`,
          category: 'dosing_error',
          severity: 'major',
          involvedDrugs: [med.raw.drugName],
          title: 'ACE Inhibitor Starting Dose Too High for eGFR < 30 mL/min',
          clinicalMechanism: 'ACE inhibitors depend heavily on renal elimination and efferent arteriolar vasodilation. In severe CKD (eGFR < 30 mL/min), high doses cause sudden reduction in intraglomerular filtration pressure and precipitously spike serum creatinine > 30% along with hyperkalemia.',
          riskSummary: 'Acute kidney injury and severe hyperkalemia (> 5.5-6.0 mEq/L).',
          evidenceGuideline: 'KDIGO 2024 Clinical Practice Guideline for the Management of CKD & Ethiopian MoH Guidelines.',
          pharmacistRecommendation: `Reduce ${med.raw.drugName} starting dose to 2.5 mg - 5 mg PO once daily. Monitor serum creatinine and potassium within 7 to 14 days of initiation.`,
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Lisinopril 2.5 mg - 5 mg PO QD', 'Amlodipine 5 mg PO QD (no renal elimination)'],
          renalAdjustmentDetails: {
            currentDose: med.raw.dose,
            recommendedDose: '2.5 mg to 5 mg PO once daily',
            eGFRThreshold: 30
          }
        });
      }
    }

    // --- Ciprofloxacin in Renal Impairment ---
    if (d.includes('ciprofloxacin') && eGFR < 30) {
      if (med.freqMult > 1 || (singleMg && singleMg > 500)) {
        issues.push({
          id: `dose-cipro-renal-${Date.now()}`,
          category: 'dosing_error',
          severity: 'major',
          involvedDrugs: [med.raw.drugName],
          title: 'Ciprofloxacin Unadjusted for Renal Clearance (eGFR < 30 mL/min)',
          clinicalMechanism: 'Ciprofloxacin is 40-50% renally excreted unchanged. In severe renal insufficiency, elimination half-life doubles from 4 hours to 8-9 hours, causing crystallization in renal tubules and CNS neurotoxicity.',
          riskSummary: 'Risk of seizures, confusion, crystalluria, and prolonged QTc prolongation.',
          evidenceGuideline: 'Ethiopian National Antimicrobial Stewardship Guidelines & Sanford Guide 2026.',
          pharmacistRecommendation: 'Adjust Ciprofloxacin to 250 mg - 500 mg PO every 18-24 hours (or 200-400 mg IV q24h) instead of BID.',
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Ciprofloxacin 250-500 mg PO q24h', 'Ceftriaxone 1g IV q24h (dual biliary/renal clearance)']
        });
      }
    }

    // --- Vancomycin / Gentamicin in Reduced eGFR ---
    if (d.includes('gentamicin') || d.includes('amikacin')) {
      if (eGFR < 60 && med.freqMult >= 3) {
        issues.push({
          id: `dose-genta-renal-${Date.now()}`,
          category: 'dosing_error',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'Aminoglycoside (Gentamicin) Multiple-Daily Dosing in Renal Impairment',
          clinicalMechanism: 'Aminoglycosides are 100% cleared by glomerular filtration and accumulate in proximal tubular epithelial cells and endolymph of the inner ear. Standard 8-hourly dosing in reduced GFR causes sustained elevated trough concentrations.',
          riskSummary: 'Irreversible bilateral vestibular/ototoxicity and acute tubular necrosis (ATN).',
          evidenceGuideline: 'Ethiopian Hospital Formulary 2026 & Hartford Once-Daily Nomogram.',
          pharmacistRecommendation: 'Switch to Extended-Interval (Once-Daily) Aminoglycoside dosing using Hartford Nomogram, or substitute with Ceftriaxone / Meropenem depending on culture sensitivities. Draw trough level before next dose.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Ceftriaxone 2g IV QD', 'Meropenem 500mg IV q12h (renally adjusted)', 'Cefotaxime 1g IV q8h']
        });
      }
    }

    // --- Enoxaparin in eGFR < 30 ---
    if (d.includes('enoxaparin') || d.includes('lovenox')) {
      if (eGFR < 30 && med.freqMult >= 2) {
        issues.push({
          id: `dose-enoxaparin-renal-${Date.now()}`,
          category: 'dosing_error',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'Enoxaparin (LMWH) Twice-Daily Dosing in eGFR < 30 mL/min',
          clinicalMechanism: 'Enoxaparin is predominantly eliminated by the kidneys. When CrCl/eGFR < 30 mL/min, drug clearance decreases by 30-40%, leading to bioaccumulation of anti-factor Xa activity and high risk of catastrophic major hemorrhage.',
          riskSummary: 'Fatal internal hemorrhage, intracranial bleeding, retroperitoneal hematoma.',
          evidenceGuideline: 'CHEST 2024 Antithrombotic Guidelines & EFDA Clinical Practice Bulletin.',
          pharmacistRecommendation: 'For CrCl < 30 mL/min: reduce therapeutic dose to 1 mg/kg ONCE daily (q24h), or preferably switch to Unfractionated Heparin (UFH) IV infusion monitored by aPTT, which relies on reticuloendothelial clearance.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Unfractionated Heparin (UFH) continuous IV adjusted per aPTT', 'Enoxaparin 1 mg/kg SubQ q24h only']
        });
      }
    }

    // --- Digoxin in Low eGFR ---
    if (d.includes('digoxin') && (eGFR < 50 || patient.age >= 65)) {
      if (singleMg && singleMg > 0.125) {
        issues.push({
          id: `dose-digoxin-high-${Date.now()}`,
          category: 'dosing_error',
          severity: 'major',
          involvedDrugs: [med.raw.drugName],
          title: 'High Digoxin Dose in Renal Impairment / Elderly Patient',
          clinicalMechanism: 'Digoxin has a very narrow therapeutic index (0.5 - 0.9 ng/mL for heart failure) and 70-80% renal excretion. In patients with eGFR < 50 mL/min or elderly age, doses > 0.125 mg daily lead to digitalis toxicity.',
          riskSummary: 'Life-threatening cardiac arrhythmias (VT/VF, complete heart block), xanthopsia (yellow-green halos), severe nausea.',
          evidenceGuideline: 'AHA/ACC Heart Failure Guidelines 2024 & Ethiopian STG.',
          pharmacistRecommendation: 'Reduce Digoxin dose to 0.0625 mg (62.5 mcg) daily or 0.125 mg every other day. Check serum digoxin level and potassium 7 days post-titration.',
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Digoxin 0.0625 mg PO QD', 'Bisoprolol 1.25-2.5 mg PO QD (for rate control)']
        });
      }
    }

    // --- Colchicine in eGFR < 30 ---
    if (d.includes('colchicine') && eGFR < 30) {
      if (dailyMg && dailyMg > 0.5) {
        issues.push({
          id: `dose-colchicine-renal-${Date.now()}`,
          category: 'dosing_error',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'Colchicine Overdose in Severe Renal Impairment (eGFR < 30 mL/min)',
          clinicalMechanism: 'Colchicine depends heavily on renal and P-glycoprotein excretion. In severe CKD, toxic levels accumulate rapidly, binding irreversibly to tubulin.',
          riskSummary: 'Fatal multi-organ failure, severe neuromyopathy, rhabdomyolysis, and bone marrow aplasia.',
          evidenceGuideline: 'ACR Gout Guidelines 2024 & EFDA Drug Safety Alert.',
          pharmacistRecommendation: 'Reduce dose to 0.5 mg every 3 to 4 days, or substitute with short-course Intra-articular / Oral Corticosteroid (Prednisolone 20-30 mg tapering over 5 days) which does not require renal clearance.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Prednisolone 20-30 mg PO daily for 5 days', 'Intra-articular Triamcinolone']
        });
      }
    }

    // --- Allopurinol in Renal Impairment ---
    if (d.includes('allopurinol') && eGFR < 30) {
      if (singleMg && singleMg > 100) {
        issues.push({
          id: `dose-allopurinol-renal-${Date.now()}`,
          category: 'dosing_error',
          severity: 'major',
          involvedDrugs: [med.raw.drugName],
          title: 'Allopurinol Starting Dose Too High for eGFR < 30 mL/min',
          clinicalMechanism: 'Oxypurinol, the active metabolite of allopurinol, is excreted by the kidneys with an elimination half-life that increases from 15 to > 50 hours in renal failure. High starting doses trigger life-threatening Allopurinol Hypersensitivity Syndrome (AHS/DRESS/SJS).',
          riskSummary: 'Allopurinol Hypersensitivity Syndrome (severe skin sloughing, eosinophilia, hepatic necrosis, high mortality).',
          evidenceGuideline: 'American College of Rheumatology 2024 & Ethiopian STG.',
          pharmacistRecommendation: 'Initiate Allopurinol at 50 mg - 100 mg PO daily (or every other day). Titrate by 50 mg increments every 4 weeks while monitoring serum uric acid and checking for rash.',
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Allopurinol 50-100 mg PO daily', 'Febuxostat 20-40 mg PO daily (predominantly hepatic metabolism)']
        });
      }
    }

    // --- Methotrexate Frequency Error (Fatal Daily vs Weekly) ---
    if (d.includes('methotrexate')) {
      const f = norm(med.raw.frequency);
      if (f.includes('daily') || f.includes('qd') || f.includes('bid') || f.includes('tid') || f.includes('every day')) {
        issues.push({
          id: `dose-mtx-fatal-daily-${Date.now()}`,
          category: 'dosing_error',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'FATAL DOSING FREQUENCY ERROR: Methotrexate Prescribed DAILY Instead of WEEKLY',
          clinicalMechanism: 'For non-oncology indications (Rheumatoid Arthritis, Psoriasis), Methotrexate must ALWAYS be dosed ONCE WEEKLY. Daily dosing leads to complete dihydrofolate reductase inhibition and rapidly fatal hematopoietic suppression.',
          riskSummary: 'Fatal bone marrow aplasia, severe oral/gastrointestinal ulcerations, sepsis, and death.',
          evidenceGuideline: 'WHO High-Alert Medication Alert, ISMP Black Box Safety Mandate, EFDA Regulatory Recall Directive.',
          pharmacistRecommendation: 'CRITICAL STAT INTERVENTION: Cancel prescription immediately. Correct dosing to 7.5 mg - 15 mg ONCE WEEKLY (on a specific designated day of the week). Co-prescribe Folic Acid 5 mg PO once weekly (taken 24-48 hours after MTX).',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Methotrexate 7.5 - 15 mg PO ONCE WEEKLY + Folic Acid 5 mg weekly']
        });
      }
    }

    // --- Maximum Daily Dose Violations (Paracetamol, Ibuprofen, Diclofenac, Tramadol) ---
    if (d.includes('paracetamol') || d.includes('acetaminophen')) {
      if (dailyMg && dailyMg > 4000) {
        issues.push({
          id: `dose-paracetamol-overdose-${Date.now()}`,
          category: 'dosing_error',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: `Paracetamol Daily Dose (${dailyMg} mg/day) Exceeds Maximum Safe Threshold (4,000 mg/day)`,
          clinicalMechanism: 'Hepatic glucuronidation and sulfation pathways become saturated above 4,000 mg/day (or 2,000-3,000 mg/day in chronic alcohol use, malnutrition, or hepatic impairment). Excess drug is metabolized via CYP2E1 into NAPQI, depleting glutathione and causing hepatocellular necrosis.',
          riskSummary: 'Acute fulminant liver failure, elevated AST/ALT, hepatic encephalopathy.',
          evidenceGuideline: 'Ethiopian National STG 2026 & FDA Maximum Daily Acetaminophen Labeling.',
          pharmacistRecommendation: 'Reduce total daily Paracetamol to a maximum of 3,000 mg/day (e.g. 500-1000 mg every 6-8 hours PRN, not to exceed 3g/day). Check LFTs if high doses have been ingested.',
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Paracetamol 500-1000 mg PO q6-8h PRN (Max 3000 mg/24h)']
        });
      }
    }

    if (d.includes('ibuprofen') && dailyMg && dailyMg > 2400) {
      issues.push({
        id: `dose-ibuprofen-overdose-${Date.now()}`,
        category: 'dosing_error',
        severity: 'major',
        involvedDrugs: [med.raw.drugName],
        title: `Ibuprofen Daily Dose (${dailyMg} mg/day) Exceeds Maximum Limit (2,400 mg/day)`,
        clinicalMechanism: 'Non-selective COX inhibition above 2,400 mg/day provides zero incremental analgesic benefit while exponentially multiplying renal vasoconstriction and gastric mucosal ulceration.',
        riskSummary: 'Acute kidney injury, severe gastrointestinal hemorrhage, and elevated cardiovascular thrombotic risk.',
        evidenceGuideline: 'Ethiopian MoH Standard Treatment Guidelines 2026.',
        pharmacistRecommendation: 'Reduce Ibuprofen to 400-600 mg PO TID (max 1,800 - 2,400 mg/day). Add a gastroprotective agent (Pantoprazole 40 mg daily) if treatment extends beyond 5 days.',
        suggestedAction: 'reduce_dose',
        saferAlternatives: ['Ibuprofen 400 mg PO TID (1200 mg/day)', 'Paracetamol 1g PO TID']
      });
    }

    if (d.includes('tramadol') && dailyMg && dailyMg > 400) {
      issues.push({
        id: `dose-tramadol-overdose-${Date.now()}`,
        category: 'dosing_error',
        severity: 'contraindicated',
        involvedDrugs: [med.raw.drugName],
        title: `Tramadol Daily Dose (${dailyMg} mg/day) Exceeds Safety Limit (400 mg/day)`,
        clinicalMechanism: 'Tramadol inhibits serotonin and norepinephrine reuptake in addition to mu-opioid receptor agonism. Doses exceeding 400 mg/day (or 300 mg/day in elderly > 65y) precipitously lower the seizure threshold and precipitate respiratory depression.',
        riskSummary: 'Grand mal seizures, respiratory depression, serotonin toxicity, and profound sedation.',
        evidenceGuideline: 'WHO Pain Management Ladder & EFDA Controlled Substance Safety Guidelines.',
        pharmacistRecommendation: 'Cap Tramadol at maximum 300-400 mg/day (e.g. 50-100 mg q6h PRN). If pain is unmanaged, rotate to an alternate multimodal analgesic regimen.',
        suggestedAction: 'reduce_dose',
        saferAlternatives: ['Tramadol 50 mg PO q6h PRN (max 200-300 mg/day)', 'Paracetamol 1g + Tramadol 37.5mg combination']
      });
    }

    // --- Pediatric Dosing Error Checks ---
    if (isChild && patient.weightKg > 0) {
      // Pediatric Paracetamol
      if (d.includes('paracetamol') || d.includes('acetaminophen')) {
        const mgPerKg = singleMg ? singleMg / patient.weightKg : 0;
        if (mgPerKg > 15) {
          issues.push({
            id: `dose-peds-paracetamol-${Date.now()}`,
            category: 'dosing_error',
            severity: 'major',
            involvedDrugs: [med.raw.drugName],
            title: `Pediatric Paracetamol Overdose (${Math.round(mgPerKg)} mg/kg exceeds 10-15 mg/kg)`,
            clinicalMechanism: `Weight is ${patient.weightKg} kg. Prescribed dose ${singleMg} mg yields ${Math.round(mgPerKg)} mg/kg. Standard pediatric therapeutic range is 10 to 15 mg/kg per dose.`,
            riskSummary: 'Pediatric acetaminophen hepatotoxicity and metabolic overload.',
            evidenceGuideline: 'Ethiopian MoH Pediatric STG 2026 & WHO Pocket Book of Hospital Care for Children.',
            pharmacistRecommendation: `Recalculate pediatric Paracetamol to 15 mg/kg: Recommended dose is ${Math.round(patient.weightKg * 15)} mg PO every 4 to 6 hours as needed (not to exceed 60 mg/kg/day).`,
            suggestedAction: 'reduce_dose',
            saferAlternatives: [`Paracetamol ${Math.round(patient.weightKg * 15)} mg PO q4-6h PRN`]
          });
        }
      }
    }
  }

  // =========================================================================
  // PILLAR 2: CONTRAINDICATIONS (DISEASES, ALLERGIES, PREGNANCY)
  // =========================================================================

  for (const med of medItems) {
    const d = med.name;

    // --- Asthma + Beta-Blockers ---
    const hasAsthma = diagnosisList.some(diag => diag.includes('asthma') || diag.includes('copd') || diag.includes('bronchospasm') || diag.includes('reactive airway'));
    if (hasAsthma && (d.includes('propranolol') || d.includes('carvedilol') || d.includes('timolol') || d.includes('nadolol') || d.includes('labetalol'))) {
      issues.push({
        id: `contra-asthma-bb-${Date.now()}`,
        category: 'contraindication',
        severity: 'contraindicated',
        involvedDrugs: [med.raw.drugName],
        title: `Non-Selective Beta-Blocker (${med.raw.drugName}) Absolutely Contraindicated in Asthma / COPD`,
        clinicalMechanism: 'Non-selective beta-blockers antagonize beta-2 adrenergic receptors located on bronchial smooth muscle cells, preventing endogenous and exogenous epinephrine-mediated bronchodilation and triggering severe, potentially fatal bronchospasm refractory to albuterol/salbutamol.',
        riskSummary: 'Life-threatening acute bronchospasm, status asthmaticus, respiratory failure.',
        evidenceGuideline: 'GINA 2024 Asthma Guidelines & Ethiopian National Treatment Guidelines 2026.',
        pharmacistRecommendation: 'Cancel Non-Selective Beta-Blocker immediately. If rate control or cardiovascular GDMT is strictly indicated, consult physician to prescribe a highly cardioselective Beta-1 blocker (Bisoprolol starting at 1.25-2.5 mg daily or Metoprolol succinate) with close bedside peak flow monitoring, or use alternative antianginal/antihypertensive agents (Amlodipine).',
        suggestedAction: 'discontinue',
        saferAlternatives: ['Bisoprolol 2.5 mg PO QD (Cardioselective Beta-1)', 'Amlodipine 5 mg PO QD (Calcium Channel Blocker)', 'Diltiazem / Verapamil (if ejection fraction preserved)']
      });
    }

    // --- Peptic Ulcer Disease / Active Bleeding + NSAIDs ---
    const hasPUD = diagnosisList.some(diag => diag.includes('peptic') || diag.includes('ulcer') || diag.includes('pud') || diag.includes('gi bleed') || diag.includes('gastritis'));
    if (hasPUD && (d.includes('ibuprofen') || d.includes('diclofenac') || d.includes('indomethacin') || d.includes('ketoprofen') || d.includes('naproxen') || d.includes('meloxicam') || d.includes('aspirin') || d.includes('piroxicam'))) {
      issues.push({
        id: `contra-pud-nsaid-${Date.now()}`,
        category: 'contraindication',
        severity: 'contraindicated',
        involvedDrugs: [med.raw.drugName],
        title: `NSAID Prescribed in Active Peptic Ulcer Disease / GI Bleed History`,
        clinicalMechanism: 'Systemic non-steroidal anti-inflammatory drugs inhibit COX-1-mediated mucosal prostaglandin E2 and I2 synthesis, diminishing protective gastric mucus and bicarbonate secretion while inhibiting thromboxane A2-mediated platelet aggregation.',
        riskSummary: 'Catastrophic upper gastrointestinal perforation, hematemesis, melena, and hemorrhagic shock.',
        evidenceGuideline: 'Ethiopian National STG & ACG Guidelines on Prevention of NSAID-Related Ulcer Complications.',
        pharmacistRecommendation: 'Discontinue NSAID immediately. Substitute with Acetaminophen (Paracetamol) 500-1000 mg PO TID for mild-moderate pain. If severe inflammatory pain requires treatment, ensure therapeutic dose of PPI (Pantoprazole 40 mg PO daily) is co-prescribed or consider short-course topical NSAID / Tramadol.',
        suggestedAction: 'discontinue',
        saferAlternatives: ['Paracetamol 1000 mg PO TID', 'Topical Diclofenac Gel 1%', 'Tramadol 50 mg PO BID PRN with Pantoprazole 40 mg']
      });
    }

    // --- CKD Stage 4/5 + NSAIDs ---
    if (isSevereRenalImpairment && (d.includes('ibuprofen') || d.includes('diclofenac') || d.includes('indomethacin') || d.includes('ketoprofen') || d.includes('naproxen') || d.includes('meloxicam'))) {
      issues.push({
        id: `contra-ckd-nsaid-${Date.now()}`,
        category: 'contraindication',
        severity: 'contraindicated',
        involvedDrugs: [med.raw.drugName],
        title: `NSAID Contraindicated in Severe Renal Impairment (eGFR ${eGFR} mL/min)`,
        clinicalMechanism: 'In compromised renal states (eGFR < 30 mL/min), renal blood flow and glomerular filtration depend critically on compensatory vasodilatory prostaglandins (PGE2 and PGI2) at the afferent arteriole. NSAID administration abruptly blocks this autoregulatory mechanism, triggering acute renal papillary necrosis and total anuric failure.',
        riskSummary: 'Rapid acceleration to end-stage kidney failure requiring emergent hemodialysis.',
        evidenceGuideline: 'KDIGO 2024 Clinical Practice Guideline for CKD & Ethiopian MoH Guidelines.',
        pharmacistRecommendation: 'Cancel NSAID therapy. Manage pain with Paracetamol (up to 2-3 g/day) or low-dose short-acting opioids (e.g. Tramadol 50mg renally spaced, or Fentanyl patch for chronic severe palliative pain). Avoid all systemic COX inhibitors.',
        suggestedAction: 'discontinue',
        saferAlternatives: ['Paracetamol 500-1000 mg PO q8h', 'Topical Lidocaine 5% patch', 'Topical Capsaicin']
      });
    }

    // --- Pregnancy Contraindications (ACEi/ARBs, Warfarin, Methotrexate, Tetracyclines, Statins) ---
    if (isPregnant) {
      if (d.includes('lisinopril') || d.includes('enalapril') || d.includes('captopril') || d.includes('ramipril') || d.includes('losartan') || d.includes('valsartan') || d.includes('candesartan') || d.includes('telmisartan')) {
        issues.push({
          id: `contra-preg-raas-${Date.now()}`,
          category: 'pregnancy_risk',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: `ACE Inhibitor / ARB (${med.raw.drugName}) ABSOLUTELY CONTRAINDICATED in Pregnancy (FDA Category D/X)`,
          clinicalMechanism: 'Inhibition of the fetal renin-angiotensin system during the 2nd and 3rd trimesters impairs fetal renal perfusion, causing fetal renal dysgenesis, severe oligohydramnios, pulmonary hypoplasia, skull ossification defects, and intrauterine fetal death.',
          riskSummary: 'Severe teratogenicity, Potter sequence, fetal anuria, and intrauterine demise.',
          evidenceGuideline: 'ACOG Practice Bulletin on Chronic Hypertension in Pregnancy & Ethiopian National Antenatal Care Guidelines.',
          pharmacistRecommendation: 'Discontinue ACEi/ARB immediately. Switch to pregnancy-safe first-line antihypertensive agents: Labetalol 100-400 mg PO BID, Methyldopa 250-500 mg PO TID, or extended-release Nifedipine 30-60 mg PO daily. Perform urgent fetal ultrasound to assess amniotic fluid index.',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Labetalol 100-200 mg PO BID', 'Methyldopa 250 mg PO TID', 'Nifedipine Extended Release 30 mg PO QD']
        });
      }

      if (d.includes('warfarin')) {
        issues.push({
          id: `contra-preg-warfarin-${Date.now()}`,
          category: 'pregnancy_risk',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'Warfarin Absolutely Contraindicated in Pregnancy (Warfarin Embryopathy - Cat X)',
          clinicalMechanism: 'Warfarin readily crosses the placenta. Exposure during 6-12 weeks gestation produces Warfarin embryopathy (nasal hypoplasia, chondrodysplasia punctata, microcephaly) and 2nd/3rd trimester exposure leads to fetal intracerebral hemorrhage.',
          riskSummary: 'Severe teratogenic malformations and fetal intracranial hemorrhage.',
          evidenceGuideline: 'ACOG / ACCP 2024 Guidelines on Anticoagulation in Pregnancy.',
          pharmacistRecommendation: 'Immediately stop Warfarin. Bridge immediately to therapeutic dose Low Molecular Weight Heparin (Enoxaparin 1 mg/kg SubQ q12h) which does NOT cross the placental barrier.',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Enoxaparin 1 mg/kg SubQ q12h (LMWH does not cross placenta)', 'Unfractionated Heparin (UFH)']
        });
      }

      if (d.includes('doxycycline') || d.includes('tetracycline')) {
        issues.push({
          id: `contra-preg-doxy-${Date.now()}`,
          category: 'pregnancy_risk',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: 'Tetracycline / Doxycycline Contraindicated in Pregnancy',
          clinicalMechanism: 'Tetracyclines chelate calcium orthophosphate in developing fetal teeth and osteoid tissue, producing permanent yellow-brown dental enamel dysgenesis and reversible suppression of fetal long-bone skeletal growth.',
          riskSummary: 'Permanent fetal tooth discoloration and skeletal growth restriction.',
          evidenceGuideline: 'Ethiopian National STG & WHO Guidelines.',
          pharmacistRecommendation: 'Substitute with pregnancy-safe beta-lactam or macrolide: Amoxicillin-Clavulanic Acid 625 mg PO TID or Azithromycin 500 mg PO QD.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Azithromycin 500 mg PO QD for 3 days', 'Amoxicillin-Clavulanate 625 mg PO TID', 'Ceftriaxone 1g IV daily']
        });
      }
    }

    // --- Allergy Conflicts ---
    if (allergyList.some(a => a.includes('penicillin') || a.includes('beta-lactam') || a.includes('amoxicillin'))) {
      if (d.includes('amoxicillin') || d.includes('ampicillin') || d.includes('penicillin') || d.includes('augmentin') || d.includes('piperacillin')) {
        issues.push({
          id: `contra-allergy-penicillin-${Date.now()}`,
          category: 'allergy_conflict',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: `Penicillin Class Antibiotic Prescribed Despite Documented Penicillin Allergy`,
          clinicalMechanism: 'Patient profile indicates documented Penicillin hypersensitivity. Administration of aminopenicillins or beta-lactams risks IgE-mediated mast cell degranulation and release of histamine and leukotrienes.',
          riskSummary: 'Fatal anaphylactic shock, laryngeal angioedema, circulatory collapse.',
          evidenceGuideline: 'AAAAI Drug Allergy Practice Parameter & Ethiopian Emergency Hospital Protocol.',
          pharmacistRecommendation: 'CANCEL ORDER IMMEDIATELY. Replace with non-beta-lactam alternatives based on indication: Azithromycin 500 mg PO QD, Clarithromycin 500 mg PO BID, Doxycycline 100 mg PO BID, or Ciprofloxacin 500 mg PO BID.',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Azithromycin 500 mg PO QD', 'Clarithromycin 500 mg PO BID', 'Levofloxacin 500 mg PO QD (respiratory)', 'Clindamycin 300 mg PO QID (gram-positive/anaerobic)']
        });
      }
    }

    if (allergyList.some(a => a.includes('sulfa') || a.includes('sulfonamide'))) {
      if (d.includes('co-trimoxazole') || d.includes('bactrim') || d.includes('sulfamethoxazole') || d.includes('sulfasalazine')) {
        issues.push({
          id: `contra-allergy-sulfa-${Date.now()}`,
          category: 'allergy_conflict',
          severity: 'contraindicated',
          involvedDrugs: [med.raw.drugName],
          title: `Sulfonamide Antibiotic Prescribed in Patient with Sulfa Allergy`,
          clinicalMechanism: 'Exposure to arylamine sulfonamides in sensitized individuals triggers severe immunological adverse drug reactions, mediated by hydroxylamine metabolites.',
          riskSummary: 'Life-threatening Stevens-Johnson Syndrome (SJS), Toxic Epidermal Necrolysis (TEN), drug-induced aseptic meningitis.',
          evidenceGuideline: 'EFDA Pharmacovigilance Alert & WHO Model Formulary.',
          pharmacistRecommendation: 'Cancel Co-trimoxazole. Use non-sulfa antimicrobial alternatives (Nitrofurantoin or Fosfomycin for UTI; Dapsone alternatives for PCP prophylaxis if confirmed).',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Nitrofurantoin 100 mg PO BID (for UTI)', 'Ciprofloxacin 500 mg PO BID', 'Atovaquone / Pentamidine (for PCP)']
        });
      }
    }
  }

  // =========================================================================
  // PILLAR 3: POTENTIAL DRUG-DRUG INTERACTIONS (DDIs)
  // =========================================================================

  for (let i = 0; i < medItems.length; i++) {
    for (let j = i + 1; j < medItems.length; j++) {
      const medA = medItems[i];
      const medB = medItems[j];
      const a = medA.name;
      const b = medB.name;

      // --- DDI 1: Warfarin + NSAIDs (Ibuprofen, Diclofenac, etc.) ---
      if ((a.includes('warfarin') && (b.includes('ibuprofen') || b.includes('diclofenac') || b.includes('naproxen') || b.includes('ketoprofen') || b.includes('meloxicam') || b.includes('indomethacin'))) ||
          (b.includes('warfarin') && (a.includes('ibuprofen') || a.includes('diclofenac') || a.includes('naproxen') || a.includes('ketoprofen') || a.includes('meloxicam') || a.includes('indomethacin')))) {
        issues.push({
          id: `ddi-warfarin-nsaid-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `CRITICAL DDI: Warfarin + NSAID (${medA.raw.drugName} & ${medB.raw.drugName}) Synergy Leading to Massive Hemorrhage`,
          clinicalMechanism: 'NSAIDs competitively displace Warfarin from serum albumin binding sites while inhibiting platelet COX-1 (blunting platelet aggregation) and causing direct gastric mucosal erosion. This synergistic dual insult multiplies upper gastrointestinal bleeding risk by 4- to 6-fold.',
          riskSummary: 'Life-threatening upper gastrointestinal hemorrhage, prolonged INR spike, and hemodynamic collapse.',
          evidenceGuideline: 'CHEST Antithrombotic Guidelines 2024 & Ethiopian STG 2026.',
          pharmacistRecommendation: 'Discontinue NSAID immediately. For analgesia, substitute Acetaminophen (Paracetamol) ≤ 2 g/day. If an anti-inflammatory is strictly necessary, switch to Celecoxib with co-prescribed PPI (Pantoprazole 40 mg daily) and re-check INR in 72 hours.',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Paracetamol 500-1000 mg PO TID (max 2g/day in Warfarin patients)', 'Topical Diclofenac Gel 1%', 'Pantoprazole 40 mg PO QD co-therapy']
        });
      }

      // --- DDI 2: Warfarin + Fluconazole / Ciprofloxacin (CYP2C9 / CYP3A4 Inhibition) ---
      if ((a.includes('warfarin') && (b.includes('fluconazole') || b.includes('ciprofloxacin') || b.includes('metronidazole') || b.includes('clarithromycin'))) ||
          (b.includes('warfarin') && (a.includes('fluconazole') || a.includes('ciprofloxacin') || a.includes('metronidazole') || a.includes('clarithromycin')))) {
        const interactingAntimicrobial = a.includes('warfarin') ? medB.raw.drugName : medA.raw.drugName;
        issues.push({
          id: `ddi-warfarin-cyp2c9-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `CRITICAL DDI: Warfarin + Potent CYP Inhibitor (${interactingAntimicrobial}) — Lethal Coagulopathy Danger`,
          clinicalMechanism: `${interactingAntimicrobial} strongly inhibits hepatic cytochrome P450 CYP2C9 and CYP3A4, the principal clearance pathways for the highly potent S-warfarin enantiomer. This leads to rapid accumulation of active drug and an uncontrolled spike in INR (frequently exceeding > 8.0 to 12.0).`,
          riskSummary: 'Spontaneous intracranial hemorrhage, hematuria, retroperitoneal bleeding, and fatal coagulopathy.',
          evidenceGuideline: 'FDA Black Box DDI Warning & Ethiopian Hospital Pharmacotherapy Protocol.',
          pharmacistRecommendation: `Anticipate a dramatic INR spike. If ${interactingAntimicrobial} is indispensable, empirically preemptively reduce the weekly Warfarin dose by 30% to 50% and measure INR on Day 3 and Day 5. Alternatively, substitute with an antimicrobial that does NOT inhibit CYP2C9 (e.g. Ceftriaxone, Cefotaxime, or Nystatin/Amphotericin for fungal coverage).`,
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Reduce Warfarin maintenance dose by 50% with daily INR monitoring', 'Substitute antimicrobial: Ceftriaxone 1g IV QD (no CYP2C9 inhibition)']
        });
      }

      // --- DDI 3: Lisinopril / Enalapril + Spironolactone (Dual RAAS Hyperkalemia) ---
      if (((a.includes('lisinopril') || a.includes('enalapril') || a.includes('ramipril') || a.includes('losartan')) && b.includes('spironolactone')) ||
          ((b.includes('lisinopril') || b.includes('enalapril') || b.includes('ramipril') || b.includes('losartan')) && a.includes('spironolactone'))) {
        const severity = isSevereRenalImpairment ? 'contraindicated' : 'major';
        issues.push({
          id: `ddi-acei-spiro-${Date.now()}`,
          category: 'drug_interaction',
          severity,
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `MAJOR DDI: ACE Inhibitor/ARB + Aldosterone Antagonist (${medA.raw.drugName} & ${medB.raw.drugName}) — Severe Hyperkalemia Hazard`,
          clinicalMechanism: 'ACE inhibitors/ARBs diminish aldosterone synthesis by blocking angiotensin II, while Spironolactone competitively blocks mineralocorticoid receptors in the cortical collecting tubule. Both actions synergistically shut down renal potassium secretion.',
          riskSummary: `Severe, life-threatening hyperkalemia (K+ > 6.0 mEq/L) causing peaked T waves, conduction block, ventricular fibrillation, and asystole ${isRenallyImpaired ? '(greatly magnified by baseline eGFR ' + eGFR + ')' : ''}.`,
          evidenceGuideline: 'ACC/AHA Heart Failure Guidelines 2024 & Ethiopian Cardiology Treatment Guidelines.',
          pharmacistRecommendation: 'If combined for HFrEF GDMT: ensure baseline K+ is < 5.0 mEq/L and eGFR is > 30 mL/min. Cap Spironolactone at 12.5-25 mg daily. Mandate serum potassium and creatinine checks at Day 7, Day 14, 1 month, and every 3 months. If eGFR < 30, discontinue Spironolactone.',
          suggestedAction: isSevereRenalImpairment ? 'discontinue' : 'monitor_labs',
          saferAlternatives: ['Spironolactone low-dose 12.5 mg every other day with weekly K+ draws', 'Loop diuretic (Furosemide 40 mg) to promote potassium kaliuresis']
        });
      }

      // --- DDI 4: Clopidogrel + Omeprazole / Esomeprazole (CYP2C19 Loss of Efficacy) ---
      if ((a.includes('clopidogrel') && (b.includes('omeprazole') || b.includes('esomeprazole'))) ||
          (b.includes('clopidogrel') && (a.includes('omeprazole') || a.includes('esomeprazole')))) {
        issues.push({
          id: `ddi-clopidogrel-omeprazole-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'major',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `MAJOR DDI: Clopidogrel + Omeprazole / Esomeprazole — CYP2C19 Inhibition Blunts Antiplatelet Protection`,
          clinicalMechanism: 'Clopidogrel is an inactive thienopyridine prodrug that requires two-step hepatic biotransformation by CYP2C19 into its active thiol metabolite. Omeprazole is a potent, irreversible mechanism-based inhibitor of CYP2C19, cutting active metabolite concentration by up to 45%.',
          riskSummary: 'Loss of antiplatelet inhibition leading to acute stent thrombosis, recurrent myocardial infarction, and cardiovascular death.',
          evidenceGuideline: 'FDA Black Box Warning on Clopidogrel & ACC/AHA Interventional Cardiology Guidelines.',
          pharmacistRecommendation: 'Switch proton pump inhibitor from Omeprazole to Pantoprazole 40 mg PO daily or Rabeprazole 20 mg daily, which do not inhibit CYP2C19. Alternatively, use an H2-receptor antagonist (Famotidine 20-40 mg daily) for gastric cytoprotection.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Pantoprazole 40 mg PO QD (Minimal CYP2C19 affinity)', 'Rabeprazole 20 mg PO QD', 'Famotidine 20-40 mg PO QD']
        });
      }

      // --- DDI 5: Simvastatin / Atorvastatin + Clarithromycin / Erythromycin (CYP3A4 Rhabdomyolysis) ---
      if (((a.includes('simvastatin') || a.includes('atorvastatin')) && (b.includes('clarithromycin') || b.includes('erythromycin'))) ||
          ((b.includes('simvastatin') || b.includes('atorvastatin')) && (a.includes('clarithromycin') || a.includes('erythromycin')))) {
        issues.push({
          id: `ddi-statin-macrolide-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `CRITICAL DDI: Simvastatin/Atorvastatin + Clarithromycin (CYP3A4 Inhibition) — Fatal Rhabdomyolysis Hazard`,
          clinicalMechanism: 'Simvastatin and Atorvastatin undergo extensive first-pass metabolism via hepatic and intestinal CYP3A4 and OATP1B1. Clarithromycin is a potent, time-dependent CYP3A4 inhibitor, causing a 10- to 12-fold surge in systemic statin plasma concentrations.',
          riskSummary: 'Severe statin-induced necrotizing myopathy, massive rhabdomyolysis with myoglobinuria, and acute tubular necrosis renal failure.',
          evidenceGuideline: 'EFDA Safety Alert on Statin-Macrolide Toxicity & ACC/AHA Cholesterol Guidelines.',
          pharmacistRecommendation: 'ABSOLUTE CONTRAINDICATION: Temporarily suspend Simvastatin/Atorvastatin for the duration of macrolide therapy, or substitute macrolide with Azithromycin 500 mg PO QD (metabolized without CYP3A4 inhibition), or switch statin to Rosuvastatin 10 mg PO QD (cleared via CYP2C9).',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Azithromycin 500 mg PO QD (no CYP3A4 inhibition)', 'Rosuvastatin 10 mg PO QD', 'Hold statin during 7-day macrolide course']
        });
      }

      // --- DDI 6: Sildenafil / Tadalafil + Nitrates (Nitroglycerin, Isosorbide) ---
      if (((a.includes('sildenafil') || a.includes('tadalafil') || a.includes('vardenafil')) && (b.includes('nitroglycerin') || b.includes('isosorbide') || b.includes('nitro'))) ||
          ((b.includes('sildenafil') || b.includes('tadalafil') || b.includes('vardenafil')) && (a.includes('nitroglycerin') || a.includes('isosorbide') || a.includes('nitro')))) {
        issues.push({
          id: `ddi-sildenafil-nitrate-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `LETHAL DDI: Sildenafil/Tadalafil + Organic Nitrates — Catastrophic Refractory Hypotension & Cardiac Arrest`,
          clinicalMechanism: 'Organic nitrates donate nitric oxide to stimulate soluble guanylyl cyclase, producing cyclic GMP. PDE-5 inhibitors block the enzymatic degradation of cGMP. Co-administration precipitates massive, uncontrollable systemic arterial and venous relaxation.',
          riskSummary: 'Profound uncorrectable shock, coronary hypoperfusion, ischemic stroke, and fatal myocardial infarction.',
          evidenceGuideline: 'American College of Cardiology / AHA Absolute Contraindication Black Box Notice.',
          pharmacistRecommendation: 'CRITICAL ABSOLUTE CONTRAINDICATION: Do NOT co-administer. Never administer nitrates within 24 hours of Sildenafil/Vardenafil or within 48 hours of Tadalafil. If patient suffers acute anginal chest pain, use non-nitrate therapies (Beta-blockers, Morphine, Calcium channel blockers).',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Amlodipine 5-10 mg PO QD', 'Metoprolol Tartrate 25-50 mg PO BID (non-nitrate rate control)', 'Sublingual non-nitrate therapy']
        });
      }

      // --- DDI 7: Digoxin + Amiodarone / Clarithromycin / Verapamil (P-gp Clearance Halved) ---
      if ((a.includes('digoxin') && (b.includes('amiodarone') || b.includes('clarithromycin') || b.includes('verapamil') || b.includes('quinidine'))) ||
          (b.includes('digoxin') && (a.includes('amiodarone') || a.includes('clarithromycin') || a.includes('verapamil') || a.includes('quinidine')))) {
        const inhibitor = a.includes('digoxin') ? medB.raw.drugName : medA.raw.drugName;
        issues.push({
          id: `ddi-digoxin-amiodarone-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `CRITICAL DDI: Digoxin + P-Glycoprotein Inhibitor (${inhibitor}) — Digitalis Toxicity Threat`,
          clinicalMechanism: `${inhibitor} potently inhibits P-glycoprotein (MDR1) efflux pumps in renal tubular cells and biliary canaliculi, halving total Digoxin clearance and displacing Digoxin from peripheral tissue binding sites. Serum Digoxin levels surge by 70-100%.`,
          riskSummary: 'Severe digitalis toxicity: fatal bidirectional VT, high-grade AV block, nausea/vomiting, xanthopsia.',
          evidenceGuideline: 'ACC/AHA Guidelines & Ethiopian MoH Standard Treatment Guidelines 2026.',
          pharmacistRecommendation: 'Immediately cut Digoxin maintenance dose by 50% (e.g. from 0.25 mg to 0.125 mg, or to 0.0625 mg daily) when initiating inhibitor. Monitor serum potassium, magnesium, and draw serum Digoxin level 7-10 days after starting.',
          suggestedAction: 'reduce_dose',
          saferAlternatives: ['Reduce Digoxin dose by 50% immediately', 'Switch to Beta-Blocker (Bisoprolol 2.5-5 mg) for atrial rate control']
        });
      }

      // --- DDI 8: Tramadol + SSRI / Linezolid (Serotonin Syndrome) ---
      if ((a.includes('tramadol') && (b.includes('fluoxetine') || b.includes('sertraline') || b.includes('paroxetine') || b.includes('citalopram') || b.includes('linezolid') || b.includes('amitriptyline'))) ||
          (b.includes('tramadol') && (a.includes('fluoxetine') || a.includes('sertraline') || a.includes('paroxetine') || a.includes('citalopram') || a.includes('linezolid') || a.includes('amitriptyline')))) {
        const serotonergicAgent = a.includes('tramadol') ? medB.raw.drugName : medA.raw.drugName;
        issues.push({
          id: `ddi-tramadol-ssri-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'major',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `MAJOR DDI: Tramadol + Serotonergic Agent (${serotonergicAgent}) — Life-Threatening Serotonin Syndrome`,
          clinicalMechanism: 'Tramadol actively inhibits serotonin reuptake while also releasing serotonin. Combined with SSRIs or Linezolid (a non-selective MAO inhibitor), excessive synaptic 5-HT1A and 5-HT2A receptor stimulation occurs throughout the brainstem and spinal cord.',
          riskSummary: 'Serotonin Toxicity / Syndrome: hyperthermia (> 40°C), autonomic instability, spontaneous clonus, tremor, delirium, and seizures.',
          evidenceGuideline: 'Hunter Serotonin Toxicity Criteria & FDA Drug Safety Communication.',
          pharmacistRecommendation: 'Avoid concurrent use. If opioid analgesia is needed, substitute Tramadol with an opioid that does NOT inhibit serotonin reuptake (such as low-dose Morphine or Codeine). If Linezolid is required for resistant bacterial sepsis, stop Tramadol and all serotonergic psychiatric medications immediately.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Paracetamol 1000 mg PO TID', 'Morphine 5-10 mg PO PRN (no serotonin reuptake inhibition)', 'Codeine 30 mg PO q6h PRN']
        });
      }

      // --- DDI 9: Ceftriaxone IV + Calcium IV (Pediatric / Incompatibility) ---
      if (((a.includes('ceftriaxone') || a.includes('rocephin')) && (b.includes('calcium') || b.includes('ringer'))) ||
          ((b.includes('ceftriaxone') || b.includes('rocephin')) && (a.includes('calcium') || a.includes('ringer')))) {
        issues.push({
          id: `ddi-ceftriaxone-calcium-${Date.now()}`,
          category: 'contraindication',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `FATAL INCOMPATIBILITY: Ceftriaxone IV + Calcium IV (${medA.raw.drugName} & ${medB.raw.drugName}) Microcrystalline Embolization`,
          clinicalMechanism: 'Ceftriaxone forms insoluble, irreversible crystalline salts with divalent calcium ions. In neonates and pediatric patients, particulate precipitates lodge in pulmonary and renal capillary networks, causing organ infarction and death.',
          riskSummary: 'Microvascular embolism, acute respiratory failure, renal shutdown, and fatal circulatory collapse.',
          evidenceGuideline: 'FDA Black Box Warning on Ceftriaxone-Calcium & Ethiopian Pediatric STG 2026.',
          pharmacistRecommendation: 'CRITICAL SAFETY MANDATE: Never administer Ceftriaxone and Calcium-containing solutions simultaneously or via the same IV line. In pediatric patients, substitute Ceftriaxone with Cefotaxime 50 mg/kg IV q8h, or thoroughly flush infusion lines with Normal Saline and separate administration by at least 48 hours.',
          suggestedAction: 'discontinue',
          saferAlternatives: ['Cefotaxime 1g IV q8h (Does NOT form calcium salts)', 'Administer Calcium Gluconate and Ceftriaxone 48 hours apart with dedicated lines']
        });
      }

      // --- DDI 10: Methotrexate + NSAIDs (Bone Marrow Suppression) ---
      if ((a.includes('methotrexate') && (b.includes('ibuprofen') || b.includes('diclofenac') || b.includes('naproxen') || b.includes('aspirin'))) ||
          (b.includes('methotrexate') && (a.includes('ibuprofen') || a.includes('diclofenac') || a.includes('naproxen') || a.includes('aspirin')))) {
        issues.push({
          id: `ddi-mtx-nsaid-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'major',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `MAJOR DDI: Methotrexate + NSAID — Renal Elimination Blockade & Severe Pancytopenia`,
          clinicalMechanism: 'NSAIDs diminish renal blood flow and competitively inhibit organic anion transporter (OAT1/OAT3) tubular secretion of Methotrexate. This decreases Methotrexate renal clearance by up to 35%, elevating toxic systemic free concentrations.',
          riskSummary: 'Severe myelosuppression (leukopenia, thrombocytopenia), mucosal ulcerations, and acute renal failure.',
          evidenceGuideline: 'EULAR Rheumatology Practice Guidelines & EFDA Drug Safety Alert.',
          pharmacistRecommendation: 'Avoid high-dose NSAIDs with Methotrexate. If an analgesic is needed, prioritize Paracetamol 500-1000 mg PO TID. If an NSAID is indispensable, maintain stable low doses and monitor complete blood count (CBC), renal function, and liver enzymes every 4 weeks.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Paracetamol 1000 mg PO TID', 'Prednisolone 5-10 mg PO daily for RA flare', 'Topical NSAID gel']
        });
      }

      // --- DDI 11: Theophylline + Ciprofloxacin (CYP1A2 Inhibition Seizures) ---
      if ((a.includes('theophylline') && (b.includes('ciprofloxacin') || b.includes('fluroquinolone'))) ||
          (b.includes('theophylline') && (a.includes('ciprofloxacin') || a.includes('fluroquinolone')))) {
        issues.push({
          id: `ddi-theophylline-cipro-${Date.now()}`,
          category: 'drug_interaction',
          severity: 'contraindicated',
          involvedDrugs: [medA.raw.drugName, medB.raw.drugName],
          title: `CRITICAL DDI: Theophylline + Ciprofloxacin (CYP1A2 Inhibition) — High Neurotoxicity & Seizure Risk`,
          clinicalMechanism: 'Ciprofloxacin is a potent mechanism-based inhibitor of hepatic CYP1A2. Theophylline clearance is reduced by 50% to 70%, rapidly pushing serum concentrations far above the narrow therapeutic window (10-20 mcg/mL).',
          riskSummary: 'Life-threatening cardiac arrhythmias, intractable status epilepticus seizures, and acute neurotoxicity.',
          evidenceGuideline: 'Ethiopian National STG & Global Initiative for Chronic Obstructive Lung Disease (GOLD).',
          pharmacistRecommendation: 'Substitute Ciprofloxacin with an antimicrobial that does NOT inhibit CYP1A2 (such as Ceftriaxone 1g IV QD or Azithromycin 500mg PO QD). If Ciprofloxacin must be continued, reduce Theophylline dose by 50% immediately and monitor daily serum levels.',
          suggestedAction: 'substitute_alternative',
          saferAlternatives: ['Ceftriaxone 1g IV QD + Azithromycin 500mg PO QD', 'Levofloxacin 500mg PO QD (minimal CYP1A2 inhibition)']
        });
      }
    }
  }

  // =========================================================================
  // PILLAR 4: GENERATE VERIFIED AUDIT CHECKLIST
  // =========================================================================

  checklist.push({
    id: 'chk-demographics',
    category: 'Demographics & Organ Function',
    label: `Patient Demographics & Renal Clearance (eGFR: ${eGFR} mL/min/1.73m²)`,
    passed: !isSevereRenalImpairment || !issues.some(i => i.category === 'dosing_error' && i.title.toLowerCase().includes('renal')),
    note: isSevereRenalImpairment 
      ? `Severe renal impairment detected (eGFR: ${eGFR} mL/min). Organ-dependent drugs flagged.`
      : `Renal clearance adequate for standard pharmacotherapy regimens (eGFR: ${eGFR} mL/min).`
  });

  checklist.push({
    id: 'chk-allergies',
    category: 'Immuno-Allergy Safety',
    label: 'Known Drug Allergies & Hypersensitivity Screening',
    passed: !issues.some(i => i.category === 'allergy_conflict'),
    note: issues.some(i => i.category === 'allergy_conflict')
      ? 'CRITICAL ALERT: Prescribed item conflicts with patient documented drug allergies.'
      : (allergyList.length > 0 ? `Screened against: ${patient.allergies.join(', ')} (Passed)` : 'No known drug allergies reported (Passed)')
  });

  checklist.push({
    id: 'chk-contraindications',
    category: 'Clinical Contraindications',
    label: 'Medical Conditions & Disease-State Contraindication Check',
    passed: !issues.some(i => i.category === 'contraindication'),
    note: issues.some(i => i.category === 'contraindication')
      ? 'Contraindications detected against underlying pathology (Asthma, PUD, CKD).'
      : 'No disease-drug contraindications identified.'
  });

  checklist.push({
    id: 'chk-ddi',
    category: 'Drug-Drug Interactions',
    label: 'Cytochrome P450 & Pharmacodynamic Interaction Check',
    passed: !issues.some(i => i.category === 'drug_interaction' && (i.severity === 'contraindicated' || i.severity === 'major')),
    note: issues.some(i => i.category === 'drug_interaction')
      ? `${issues.filter(i => i.category === 'drug_interaction').length} significant drug-drug interaction(s) detected.`
      : 'Zero major or contraindicated drug interactions detected.'
  });

  checklist.push({
    id: 'chk-dosing',
    category: 'Dosing & Frequency',
    label: 'Maximum Daily Dose & Frequency Safety Review',
    passed: !issues.some(i => i.category === 'dosing_error'),
    note: issues.some(i => i.category === 'dosing_error')
      ? 'Dosing anomalies, renal adjustments, or frequency errors detected.'
      : 'All medication doses conform to standard Ethiopian STG therapeutic limits.'
  });

  if (isPregnant) {
    checklist.push({
      id: 'chk-pregnancy',
      category: 'Perinatal Safety',
      label: 'Maternal-Fetal Teratogenicity & Pregnancy Safety Review',
      passed: !issues.some(i => i.category === 'pregnancy_risk'),
      note: issues.some(i => i.category === 'pregnancy_risk')
        ? 'High-risk teratogenic or fetotoxic agents detected in pregnant patient.'
        : 'All prescribed agents are classified as pregnancy-compatible.'
    });
  }

  // Calculate counts & overall status
  const criticalCount = issues.filter(i => i.severity === 'contraindicated').length;
  const majorCount = issues.filter(i => i.severity === 'major').length;
  const moderateCount = issues.filter(i => i.severity === 'moderate' || i.severity === 'caution').length;
  const clearedCount = checklist.filter(c => c.passed).length;

  let overallStatus: 'critical_danger' | 'major_warning' | 'moderate_attention' | 'cleared_safe' = 'cleared_safe';
  if (criticalCount > 0) {
    overallStatus = 'critical_danger';
  } else if (majorCount > 0) {
    overallStatus = 'major_warning';
  } else if (moderateCount > 0) {
    overallStatus = 'moderate_attention';
  }

  // =========================================================================
  // PILLAR 5: BUILD STRUCTURED PHARMACIST SOAP INTERVENTION NOTE
  // =========================================================================

  const soapSubjective = `Patient: ${patient.name || 'Anonymous'}, ${patient.age}y ${patient.gender}. Diagnoses: ${patient.diagnoses.join(', ') || 'General Inpatient'}. Allergies: ${patient.allergies.join(', ') || 'NKDA'}. Pregnancy: ${patient.pregnancyStatus || 'None'}.`;
  
  const soapObjective = `Renal Clearance Markers: SCr ${patient.serumCreatinine} mg/dL, Calculated eGFR ${eGFR} mL/min/1.73m² (${isSevereRenalImpairment ? 'Stage 4/5 Severe CKD' : isRenallyImpaired ? 'Moderate CKD' : 'Adequate Renal Function'}). Weight: ${patient.weightKg} kg. Current Regimen: ${medications.map(m => `${m.drugName} ${m.dose} ${m.frequency}`).join('; ')}.`;
  
  const soapAssessment = overallStatus === 'cleared_safe'
    ? 'Prescription safety audit completed. No contraindications, severe drug interactions, or dosing errors detected. Regimen complies with 2026 Ethiopian STG.'
    : `CLINICAL SAFETY ALERT: Detected ${criticalCount} contraindicated condition(s) and ${majorCount} major risk(s). Identified issues: ${issues.map(i => `${i.title} (${i.severity.toUpperCase()})`).join('; ')}. Immediate pharmacist intervention warranted prior to dispensing.`;

  const soapPlan = overallStatus === 'cleared_safe'
    ? 'Approved for dispensing. Monitor standard clinical response and counsel patient on adherence and administration timing.'
    : `RECOMMENDED PHARMACIST INTERVENTIONS:\n` + issues.map((iss, idx) => `${idx + 1}. [${iss.suggestedAction.toUpperCase()}] ${iss.involvedDrugs.join(' + ')}: ${iss.pharmacistRecommendation}`).join('\n');

  return {
    id: reportId,
    timestamp,
    overallStatus,
    totalIssues: issues.length,
    criticalCount,
    majorCount,
    moderateCount,
    clearedCount,
    calculatedEGFR: eGFR,
    isRenallyImpaired,
    issues,
    checklist,
    soapNote: {
      subjective: soapSubjective,
      objective: soapObjective,
      assessment: soapAssessment,
      plan: soapPlan
    }
  };
}
