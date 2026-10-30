import { PrescriptionReviewItem, SiteHealthcareProviderMessage, InstitutionalCircular, DrugShortageExchange, InstitutionSubscription } from '../types';

export const samplePrescriptionsData: PrescriptionReviewItem[] = [
  {
    id: "rx-et-2026-001",
    prescriptionNumber: "TASH-RX-84920",
    facilityName: "Tikur Anbessa Specialized Hospital (TASH)",
    department: "Renal Medicine & Cardiology Combined Ward",
    patientName: "Abebech Tadesse",
    mrn: "MRN-AA-449102",
    age: 64,
    gender: "Female",
    weightKg: 58,
    serumCreatinine: 2.3, // mg/dL
    eGFR: 24, // mL/min/1.73m2 (Severe Renal Impairment - Stage 4 CKD)
    allergies: ["Penicillin (Anaphylaxis)", "Sulfonamides (Rash)"],
    diagnoses: ["Type 2 Diabetes Mellitus with Nephropathy", "Hypertension", "Heart Failure (NYHA Class III)", "Scheduled for Contrast CT Angiography"],
    prescriber: {
      name: "Dr. Henok Bekele, MD",
      title: "Senior Resident Physician",
      facility: "Tikur Anbessa Specialized Hospital",
      department: "Internal Medicine",
      contact: "+251 911 234 567"
    },
    medications: [
      {
        drugName: "Metformin HCl",
        dose: "1000 mg",
        route: "Oral",
        frequency: "Twice Daily (BID)",
        duration: "30 Days",
        indication: "Type 2 Diabetes Glycemic Control",
        renalAdjustmentNeeded: true,
        statusNote: "CONTRAINDICATED in eGFR < 30 mL/min. High risk of fatal Lactic Acidosis, especially with planned IV contrast."
      },
      {
        drugName: "Lisinopril",
        dose: "20 mg",
        route: "Oral",
        frequency: "Once Daily (QD)",
        duration: "30 Days",
        indication: "Hypertension & Nephroprotection",
        renalAdjustmentNeeded: true,
        statusNote: "Dose too high for eGFR 24. Start 2.5-5 mg; monitor Serum Potassium closely."
      },
      {
        drugName: "Spironolactone",
        dose: "50 mg",
        route: "Oral",
        frequency: "Once Daily (QD)",
        duration: "30 Days",
        indication: "Heart Failure Aldosterone Antagonist",
        renalAdjustmentNeeded: true,
        statusNote: "Dual RAAS blockade with Lisinopril in Stage 4 CKD creates severe hyperkalemia danger (K > 6.0 mEq/L)."
      },
      {
        drugName: "Furosemide",
        dose: "40 mg",
        route: "Oral",
        frequency: "Twice Daily (BID)",
        duration: "30 Days",
        indication: "Fluid Overload / Peripheral Edema",
        renalAdjustmentNeeded: false,
        statusNote: "Appropriate loop diuretic for reduced GFR."
      }
    ],
    auditChecklist: [
      { id: "c1", label: "Patient Demographics & Organ Function Verified", passed: true, note: "eGFR calculated via CKD-EPI formula = 24 mL/min/1.73m2" },
      { id: "c2", label: "Known Allergies Screened", passed: true, note: "Zero beta-lactams or sulfa agents prescribed" },
      { id: "c3", label: "Renal / Hepatic Dosing Appropriate", passed: false, note: "Metformin contraindicated; Lisinopril requires reduction" },
      { id: "c4", label: "No Severe Drug-Drug Interactions", passed: false, note: "Lisinopril + Spironolactone dual K+-sparing toxicity" },
      { id: "c5", label: "Contrast Media Safety Protocol Cleared", passed: false, note: "Metformin must be withheld 48h prior to contrast scan" }
    ],
    identifiedIssues: [
      {
        id: "issue-1",
        type: "contraindication",
        severity: "contraindicated",
        title: "Metformin in Stage 4 CKD & Contrast Administration",
        detail: "Metformin accumulates in renal clearance impairment (eGFR 24 mL/min) and triggers dangerous lactic acidosis (mortality > 40%). Combined with planned iodinated contrast CT, renal shutdown risk is extreme.",
        recommendation: "Discontinue Metformin immediately. Withhold prior to CT procedure. Substitute with Linagliptin 5 mg PO daily (eliminated via biliary/fecal pathway, requires no dose adjustment in renal impairment)."
      },
      {
        id: "issue-2",
        type: "interaction",
        severity: "major",
        title: "Lisinopril + High-Dose Spironolactone Severe Hyperkalemia",
        detail: "Combining Lisinopril 20 mg with Spironolactone 50 mg in a patient with eGFR < 30 mL/min severely impairs potassium excretion, precipitating life-threatening cardiac dysrhythmias.",
        recommendation: "Reduce Lisinopril to 5 mg daily. Reduce Spironolactone to 12.5 mg every other day or temporarily hold until baseline K+ is confirmed < 5.0 mEq/L."
      }
    ],
    pharmacistDecision: "alternative_proposed",
    pharmacistRecommendationNote: "CLINICAL PHARMACIST INTERVENTION: 1) Discontinue Metformin 1000mg BID; initiate Linagliptin 5mg PO daily. 2) Reduce Lisinopril from 20mg to 5mg daily. 3) Reduce Spironolactone to 12.5mg QD with baseline Serum K+ and Creatinine re-check within 72 hours. 4) Ensure normal saline hydration pre- and post-contrast study.",
    reviewedBy: "Pharmacist Dawid Aliyi, BCPS",
    reviewedAt: "2026-10-28T09:15:00Z",
    reviewStatus: "completed",
    digitalSignatureRef: "DA-PHARM-2026-TASH-84920"
  },
  {
    id: "rx-et-2026-002",
    prescriptionNumber: "AHMC-RX-19284",
    facilityName: "Adama Hospital Medical College (AHMC)",
    department: "Emergency & Critical Care Unit",
    patientName: "Chala Gemechu",
    mrn: "MRN-OR-882310",
    age: 48,
    gender: "Male",
    weightKg: 72,
    serumCreatinine: 1.0,
    eGFR: 88,
    allergies: ["No Known Drug Allergies (NKDA)"],
    diagnoses: ["Severe Community-Acquired Pneumonia", "Underlying Chronic Bronchial Asthma", "Acute Tremor & Anxiety"],
    prescriber: {
      name: "Dr. Tolossa Diba, MD",
      title: "Emergency Room Medical Officer",
      facility: "Adama Hospital Medical College",
      department: "Emergency Medicine",
      contact: "+251 922 789 012"
    },
    medications: [
      {
        drugName: "Ciprofloxacin",
        dose: "750 mg",
        route: "Oral / IV",
        frequency: "Twice Daily (BID)",
        duration: "7 Days",
        indication: "Severe Respiratory Infection",
        renalAdjustmentNeeded: false,
        statusNote: "Strong CYP1A2 inhibitor; severe interaction with Theophylline."
      },
      {
        drugName: "Theophylline",
        dose: "300 mg",
        route: "Oral",
        frequency: "Twice Daily (BID)",
        duration: "14 Days",
        indication: "Bronchodilator for Asthma Flare",
        renalAdjustmentNeeded: false,
        statusNote: "Narrow therapeutic index (10-20 mcg/mL). Serum level doubles when co-administered with Ciprofloxacin."
      },
      {
        drugName: "Propranolol",
        dose: "40 mg",
        route: "Oral",
        frequency: "Twice Daily (BID)",
        duration: "5 Days",
        indication: "Symptomatic Tremor & Palpitations",
        renalAdjustmentNeeded: false,
        statusNote: "NON-SELECTIVE BETA-BLOCKER: ABSOLUTELY CONTRAINDICATED IN ASTHMA."
      }
    ],
    auditChecklist: [
      { id: "c1", label: "Patient Demographics & Renal Clearance", passed: true, note: "eGFR = 88 mL/min (Normal)" },
      { id: "c2", label: "Known Allergies Screened", passed: true, note: "NKDA" },
      { id: "c3", label: "Contraindication Screening", passed: false, note: "Propranolol prescribed in patient with active asthma" },
      { id: "c4", label: "Cytochrome P450 Drug Interaction Screening", passed: false, note: "Ciprofloxacin CYP1A2 inhibition elevates Theophylline toxicity" },
      { id: "c5", label: "Therapeutic Alternatives Proposed", passed: true, note: "Azithromycin + Ceftriaxone & Cardioselective beta-blocker if vital" }
    ],
    identifiedIssues: [
      {
        id: "issue-1",
        type: "contraindication",
        severity: "contraindicated",
        title: "Propranolol (Non-Selective Beta-Blocker) in Asthma",
        detail: "Propranolol blocks beta-2 adrenergic receptors in bronchial smooth muscle, precipitating acute, severe, life-threatening bronchospasm that can be refractory to beta-2 agonists.",
        recommendation: "Cancel Propranolol immediately. If tachycardia requires rate control, consult cardiology for a cardioselective agent (e.g. Bisoprolol/Metoprolol) or manage anxiety with a short course of Lorazepam 0.5 mg."
      },
      {
        id: "issue-2",
        type: "interaction",
        severity: "major",
        title: "Ciprofloxacin + Theophylline CYP1A2 Toxicity",
        detail: "Ciprofloxacin reduces hepatic theophylline clearance by up to 50-70%, rapidly leading to arrhythmias, seizures, and neurotoxicity.",
        recommendation: "Replace Ciprofloxacin with Ceftriaxone 1g IV QD + Azithromycin 500mg PO QD per Ethiopian MoH National Pneumonia STG. If Ciprofloxacin is retained, reduce Theophylline dose by 50% and draw peak/trough levels."
      }
    ],
    pharmacistDecision: "rejected_safety",
    pharmacistRecommendationNote: "STAT SAFETY INTERVENTION: 1) Propranolol cancelled due to fatal bronchospasm risk in asthma. 2) Ciprofloxacin replaced with Ceftriaxone + Azithromycin to eliminate CYP1A2 Theophylline toxicity. Communicated directly with ER Officer Dr. Tolossa.",
    reviewedBy: "Pharmacist Dawid Aliyi, BCPS",
    reviewedAt: "2026-10-28T14:30:00Z",
    reviewStatus: "completed",
    digitalSignatureRef: "DA-PHARM-2026-AHMC-19284"
  },
  {
    id: "rx-et-2026-003",
    prescriptionNumber: "HUCSH-RX-73104",
    facilityName: "Hawassa University Comprehensive Specialized Hospital",
    department: "Pediatrics & Neonatal Intensive Care Unit",
    patientName: "Bethlehem Haile",
    mrn: "MRN-HW-310921",
    age: 6,
    gender: "Female",
    weightKg: 18,
    serumCreatinine: 0.5,
    eGFR: 110,
    allergies: ["No Known Drug Allergies (NKDA)"],
    diagnoses: ["Severe Malaria (P. falciparum)", "Secondary Bacterial Sepsis", "Hypocalcemia"],
    prescriber: {
      name: "Dr. Aster Tesfaye, MD",
      title: "Pediatric Resident",
      facility: "Hawassa University Hospital",
      department: "Pediatrics",
      contact: "+251 933 456 789"
    },
    medications: [
      {
        drugName: "Artesunate IV",
        dose: "45 mg (2.4 mg/kg)",
        route: "Intravenous (IV slow bolus)",
        frequency: "At 0, 12, 24 hours then daily",
        duration: "3 Days",
        indication: "Severe Falciparum Malaria",
        renalAdjustmentNeeded: false,
        statusNote: "Accurate pediatric dosing according to Ethiopian National Malaria Guidelines."
      },
      {
        drugName: "Ceftriaxone IV",
        dose: "1 g (approx 55 mg/kg)",
        route: "Intravenous (IV)",
        frequency: "Once Daily (QD)",
        duration: "5 Days",
        indication: "Suspected Bacterial Sepsis",
        renalAdjustmentNeeded: false,
        statusNote: "Fatal precipitation when mixed with intravenous Calcium solutions!"
      },
      {
        drugName: "Calcium Gluconate 10%",
        dose: "18 mL (approx 100 mg/kg)",
        route: "Intravenous (IV)",
        frequency: "Infused over 30 minutes",
        duration: "Single Dose",
        indication: "Symptomatic Hypocalcemia Correction",
        renalAdjustmentNeeded: false,
        statusNote: "Co-administration with Ceftriaxone forms insoluble Ceftriaxone-Calcium salts in lungs/kidneys."
      }
    ],
    auditChecklist: [
      { id: "c1", label: "Pediatric Weight-Based Dose Calculation", passed: true, note: "Weight: 18 kg. Artesunate 2.4 mg/kg = 43.2 mg (rounded to 45 mg), Ceftriaxone 55 mg/kg = 1g" },
      { id: "c2", label: "Physical & Chemical Incompatibility Screening", passed: false, note: "Ceftriaxone + IV Calcium forms microcrystalline pulmonary/renal emboli" },
      { id: "c3", label: "National Malaria Guideline Adherence", passed: true, note: "Artesunate regimen strictly follows MoH 2026 STG" },
      { id: "c4", label: "Administration Line Separation Protocol", passed: false, note: "Must NOT be given via same IV line or Y-site" }
    ],
    identifiedIssues: [
      {
        id: "issue-1",
        type: "contraindication",
        severity: "contraindicated",
        title: "Ceftriaxone + Intravenous Calcium Incompatibility",
        detail: "Co-administration of Ceftriaxone and Calcium products causes crystalline precipitation in pulmonary and renal vascular beds, causing organ failure and death in pediatric patients.",
        recommendation: "Never infuse Ceftriaxone and Calcium solutions simultaneously, even via different infusion lines in neonates/young children. Substitute Ceftriaxone with Cefotaxime 1g IV q8h, or thoroughly flush lines with 0.9% NS and separate doses by at least 48 hours."
      }
    ],
    pharmacistDecision: "clarification_needed",
    pharmacistRecommendationNote: "PEDIATRIC PHARMACY AUDIT: 1) Hold Ceftriaxone IV during Calcium Gluconate infusion. 2) Switch Ceftriaxone to Cefotaxime 1g IV q8h (which has no calcium precipitation risk) or guarantee distinct IV lines with 10mL Normal Saline flush between administrations. 3) Artesunate dosing verified exact for 18kg.",
    reviewedBy: "Pharmacist Dawid Aliyi, BCPS",
    reviewedAt: "2026-10-28T16:00:00Z",
    reviewStatus: "completed",
    digitalSignatureRef: "DA-PHARM-2026-HUCSH-73104"
  },
  {
    id: "rx-et-2026-004",
    prescriptionNumber: "SPHMMC-RX-55102",
    facilityName: "St. Paul's Hospital Millennium Medical College",
    department: "Outpatient Internal Medicine & Anticoagulation Clinic",
    patientName: "Desta Mengistu",
    mrn: "MRN-AA-990142",
    age: 59,
    gender: "Male",
    weightKg: 78,
    serumCreatinine: 1.1,
    eGFR: 75,
    allergies: ["No Known Drug Allergies (NKDA)"],
    diagnoses: ["Non-Valvular Atrial Fibrillation", "Deep Vein Thrombosis (DVT)", "Acute Uncomplicated Urinary Tract Infection (UTI)"],
    prescriber: {
      name: "Dr. Selamawit Kebede, MD",
      title: "Attending Physician",
      facility: "St. Paul's Hospital Millennium Medical College",
      department: "Internal Medicine",
      contact: "+251 944 567 890"
    },
    medications: [
      {
        drugName: "Warfarin Sodium",
        dose: "5 mg",
        route: "Oral",
        frequency: "Once Daily (Evening, 6:00 PM)",
        duration: "Chronic / 90 Days",
        indication: "Thromboembolism Prophylaxis (Target INR 2.0 - 3.0)",
        renalAdjustmentNeeded: false,
        statusNote: "Stable baseline INR 2.4."
      },
      {
        drugName: "Co-trimoxazole (Bactrim DS)",
        dose: "800/160 mg",
        route: "Oral",
        frequency: "Twice Daily (BID)",
        duration: "7 Days",
        indication: "Urinary Tract Infection",
        renalAdjustmentNeeded: false,
        statusNote: "Potent CYP2C9 inhibitor & protein-displacement interaction with S-Warfarin."
      }
    ],
    auditChecklist: [
      { id: "c1", label: "Anticoagulation Target INR Verification", passed: true, note: "Target INR 2.0 - 3.0" },
      { id: "c2", label: "CYP2C9 & Protein Binding Interaction Check", passed: false, note: "Co-trimoxazole dramatically increases free Warfarin and INR > 8.0" },
      { id: "c3", label: "Bleeding Risk Assessment (HAS-BLED)", passed: false, note: "High risk of intracranial / GI hemorrhage" }
    ],
    identifiedIssues: [
      {
        id: "issue-1",
        type: "interaction",
        severity: "major",
        title: "Warfarin + Co-trimoxazole Severe Bleeding Danger",
        detail: "Sulfamethoxazole potently inhibits CYP2C9 (metabolizing active S-warfarin) and displaces it from albumin. INR commonly surges from therapeutic (2.4) to life-threatening (> 7-10) within 3-5 days, triggering severe hemorrhagic complications.",
        recommendation: "Avoid Co-trimoxazole. Substitute with Nitrofurantoin 100 mg PO BID x 5 days or Cefixime 400 mg PO daily. If Co-trimoxazole is obligatory, reduce Warfarin dose by 50% empirically and check INR on Day 3 and Day 5."
      }
    ],
    pharmacistDecision: "alternative_proposed",
    pharmacistRecommendationNote: "ANTICOAGULATION CLINICAL INTERVENTION: Switch Bactrim to Nitrofurantoin 100mg PO BID x 5 days for UTI. This preserves stable INR (2.4) without dangerous CYP2C9 inhibition.",
    reviewedBy: "Pharmacist Dawid Aliyi, BCPS",
    reviewedAt: "2026-10-29T08:00:00Z",
    reviewStatus: "completed",
    digitalSignatureRef: "DA-PHARM-2026-SPHMMC-55102"
  }
];

export const sampleSiteProviderMessages: SiteHealthcareProviderMessage[] = [
  {
    id: "msg-site-001",
    siteId: "tash_icu",
    siteName: "Tikur Anbessa Specialized Hospital (TASH)",
    department: "Medical Intensive Care Unit (MICU)",
    senderName: "Pharmacist Dawid Aliyi",
    senderRole: "Clinical Pharmacist",
    urgency: "STAT",
    patientRef: "Bed 04 / MRN-AA-449102",
    patientInitials: "A.T.",
    topic: "STAT Hold on Metformin before Contrast Angio & K+ Watch",
    message: "Attending Dr. Henok: Patient A.T. (eGFR 24) is scheduled for contrast CT at 11:30 AM today. Metformin 1000mg BID was on chart. We have flagged this as STAT HOLD to avoid contrast-induced nephropathy & lactic acidosis. Suggest Linagliptin 5mg PO daily. Also noted Spironolactone 50mg + Lisinopril 20mg: K+ is 5.2 mEq/L. Please approve dose reduction.",
    recommendation: "Hold Metformin 48h. Discontinue Lisinopril 20mg; initiate Lisinopril 5mg daily. Spironolactone reduced to 12.5mg QD.",
    status: "in_discussion",
    timestamp: "2026-10-29T08:20:00Z",
    replies: [
      {
        id: "rep-001",
        senderName: "Dr. Henok Bekele, MD",
        senderRole: "Attending Physician",
        message: "Thank you Dawid. Completely agree. Order updated in EMR: Metformin on hold, Linagliptin 5mg added. Spironolactone reduced to 12.5mg QD. Please verify renal fluids protocol with Ward Nurse Sister Genet.",
        timestamp: "2026-10-29T08:26:00Z"
      },
      {
        id: "rep-002",
        senderName: "Sr. Genet Wolde, BSc Nurse",
        senderRole: "Ward Nurse",
        message: "Noted with thanks. Normal Saline pre-hydration running at 75 mL/hr as ordered. Metformin tablets removed from bedside medication cassette.",
        timestamp: "2026-10-29T08:31:00Z"
      }
    ]
  },
  {
    id: "msg-site-002",
    siteId: "adama_er",
    siteName: "Adama Hospital Medical College (AHMC)",
    department: "Emergency & Trauma Surgery Ward",
    senderName: "Pharmacist Dawid Aliyi",
    senderRole: "Clinical Pharmacist",
    urgency: "STAT",
    patientRef: "ER Bay 3 / MRN-OR-882310",
    patientInitials: "C.G.",
    topic: "CRITICAL: Propranolol in Active Asthmatic + Theophylline Interaction",
    message: "Dr. Tolossa: Patient C.G. has active asthma flare with wheezing. The chart contains Propranolol 40mg BID for tremor and Ciprofloxacin 750mg BID + Theophylline 300mg BID. Propranolol will trigger catastrophic bronchospasm; Ciprofloxacin inhibits CYP1A2 causing theophylline toxicity. Recommending immediate substitution with Ceftriaxone 2g IV + Azithromycin 500mg PO.",
    recommendation: "Cancel Propranolol immediately. Switch Cipro to Ceftriaxone + Azithromycin.",
    status: "resolved",
    timestamp: "2026-10-29T09:05:00Z",
    replies: [
      {
        id: "rep-003",
        senderName: "Dr. Tolossa Diba, MD",
        senderRole: "Attending Physician",
        message: "Excellent catch Pharm Dawid! The asthma history was missed on initial triage. Propranolol cancelled. Switched to Ceftriaxone 2g IV and Azithromycin 500mg. Thank you for averting severe bronchospasm.",
        timestamp: "2026-10-29T09:12:00Z"
      }
    ]
  },
  {
    id: "msg-site-003",
    siteId: "sphmmc_nephro",
    siteName: "St. Paul's Hospital Millennium Medical College (SPHMMC)",
    department: "Renal Transplant & Nephrology Ward",
    senderName: "Dr. Selamawit Kebede, MD",
    senderRole: "Attending Physician",
    urgency: "Urgent",
    patientRef: "Transplant Bed 12 / MRN-AA-712894",
    patientInitials: "M.K.",
    topic: "Tacrolimus Trough Level (TDM) & Voriconazole Co-prescription",
    message: "Clinical Pharmacist Dawid: Post-transplant patient M.K. developed invasive fungal pulmonary lesion. We need to start Voriconazole 200mg IV BID. Baseline Tacrolimus trough is 7.8 ng/mL. How should we preemptively adjust Tacrolimus to prevent calcineurin nephrotoxicity?",
    recommendation: "Voriconazole is a potent CYP3A4 inhibitor. Preemptively reduce Tacrolimus daily dose by 60-75%. Re-check Tacrolimus 12-hour trough level in 48 hours.",
    status: "resolved",
    timestamp: "2026-10-29T10:15:00Z",
    replies: [
      {
        id: "rep-004",
        senderName: "Pharmacist Dawid Aliyi",
        senderRole: "Clinical Pharmacist",
        message: "Dr. Selamawit: Voriconazole inhibits CYP3A4 strongly. Cut Tacrolimus by 66% (e.g., from 3mg BID to 1mg BID). Check 12-hr trough on Day 3. Maintain Target trough 6-8 ng/mL. Monitor serum creatinine daily.",
        timestamp: "2026-10-29T10:22:00Z"
      }
    ]
  },
  {
    id: "msg-site-004",
    siteId: "hawassa_ped",
    siteName: "Hawassa University Comprehensive Specialized Hospital",
    department: "Pediatrics & Neonatal ICU",
    senderName: "Pharmacist Dawid Aliyi",
    senderRole: "Clinical Pharmacist",
    urgency: "STAT",
    patientRef: "Peds Bed 08 / MRN-HW-310921",
    patientInitials: "B.H.",
    topic: "Fatal Ceftriaxone + Calcium Precipitation Warning",
    message: "Pediatric Resident Dr. Aster: Co-administration of IV Ceftriaxone and IV Calcium Gluconate is documented on B.H. (6 yo). This forms crystalline deposits in lungs and kidneys. We must not infuse via same line. Suggesting Cefotaxime 1g IV q8h which has zero calcium precipitation risk.",
    recommendation: "Switch Ceftriaxone to Cefotaxime 1g IV q8h immediately.",
    status: "resolved",
    timestamp: "2026-10-29T11:00:00Z",
    replies: [
      {
        id: "rep-005",
        senderName: "Dr. Aster Tesfaye, MD",
        senderRole: "Chief Resident",
        message: "Understood! Prescription converted to Cefotaxime 1g q8h. Calcium Gluconate infusion is running separately. Great intervention.",
        timestamp: "2026-10-29T11:08:00Z"
      }
    ]
  },
  {
    id: "msg-site-005",
    siteId: "bole17_hc",
    siteName: "Bole 17 Health Center",
    department: "Outpatient Chronic Disease & MTM Unit",
    senderName: "Pharmacist Dawid Aliyi",
    senderRole: "Clinical Pharmacist",
    urgency: "Routine",
    patientRef: "OPD 14 / MRN-HC-19203",
    patientInitials: "K.B.",
    topic: "Statin-Induced Myopathy Audit: Atorvastatin 80mg + Clarithromycin",
    message: "Health Officer Sister Rahel: Patient K.B. with stable coronary disease presented with severe bilateral thigh pain and dark urine after 5 days of Clarithromycin 500mg BID for bronchitis while taking Atorvastatin 80mg daily. Suspected Rhabdomyolysis due to CYP3A4 inhibition.",
    recommendation: "STAT Discontinue Atorvastatin and Clarithromycin. Order Serum Creatine Kinase (CK), Serum Creatinine, and Urinalysis. Hydrate aggressively.",
    status: "in_discussion",
    timestamp: "2026-10-29T12:30:00Z",
    replies: [
      {
        id: "rep-006",
        senderName: "Sister Rahel Abera, HO",
        senderRole: "Attending Physician",
        message: "Urgent lab sent: CK is 4,800 U/L! Both drugs stopped immediately and referred to TASH Emergency for IV hydration. Excellent catch.",
        timestamp: "2026-10-29T12:45:00Z"
      }
    ]
  }
];

export const sampleInstitutionalCirculars: InstitutionalCircular[] = [
  {
    id: "circ-efda-2026-08",
    circularNo: "EFDA/ALERT/2026/08",
    issuingAuthority: "EFDA (Ethiopian Food & Drug Authority)",
    title: "Batch Recall Alert: Paracetamol 1000 mg/100 mL Infusion (Subpotent API)",
    category: "Drug Recall / Safety Alert",
    dateIssued: "2026-10-25",
    priority: "Critical",
    content: "The Ethiopian Food and Drug Authority (EFDA) post-marketing surveillance laboratory has detected substandard active pharmaceutical ingredient (API) assay (< 82% of declared content) in Paracetamol Infusion 1000mg/100mL (Batch No: PAR-ET-2025-419, Mfg Date: 03/2025, Exp Date: 02/2028). All public and private hospitals, health centers, and wholesalers must quarantine and recall this batch immediately.",
    actionRequired: "1) Immediately inspect physical dispensary and central store shelves. 2) Quarantine all bottles of Batch PAR-ET-2025-419. 3) Return to EPSS or designated supplier with Quarantine Certificate within 7 days.",
    targetFacilities: ["All Specialized Teaching Hospitals", "General Hospitals", "Health Centers", "Wholesale Distributors"],
    officialDocNumber: "EFDA-MED-POSTMARKET-2026-881"
  },
  {
    id: "circ-moh-2026-14",
    circularNo: "MOH/CLIN/STG/2026/14",
    issuingAuthority: "Federal Ministry of Health (MoH)",
    title: "National Standard Treatment Guideline Update: First-Line Antimicrobial Stewardship (ASP)",
    category: "National Treatment Guideline Update",
    dateIssued: "2026-10-20",
    priority: "High",
    content: "Ministry of Health Ethiopia releases the updated 2026 National Antimicrobial Stewardship Circular. Unrestricted use of Carbapenems (Meropenem), Colistin, and 3rd Generation Cephalosporins is strictly restricted to Prior-Authorization by Hospital Clinical Pharmacist or Infectious Disease Specialist across all tertiary health facilities.",
    actionRequired: "Establish or strengthen Institutional Antimicrobial Stewardship Committees (AMSC). Hospital Chief Pharmacists must enforce restricted antibiotic prescription review forms prior to dispensing.",
    targetFacilities: ["Tikur Anbessa Hospital", "St. Paul's Hospital", "Jimma University Hospital", "Hawassa University Hospital", "All Regional Referral Hospitals"],
    officialDocNumber: "MOH-ETH-ASP-DIR-2026"
  },
  {
    id: "circ-epss-2026-03",
    circularNo: "EPSS/LOG/SUPPLY/2026/03",
    issuingAuthority: "EPSS (Supply Service)",
    title: "Emergency Allocation Protocol: IV Insulin Regular & Human Albumin 20%",
    category: "Emergency Shortage Protocol",
    dateIssued: "2026-10-18",
    priority: "High",
    content: "Ethiopian Pharmaceutical Supply Service (EPSS) has received a prioritized shipment of 80,000 vials of Human Regular Insulin 100 IU/mL and 12,000 vials of Human Albumin 20%. Dispatch will occur via computerized IFRR allocations based on Average Monthly Consumption (AMC).",
    actionRequired: "Submit verified Dispensary IFRR forms signed by Lead Pharmacist and Storekeeper via Pharma Star App Pro by 30th of the current reporting month.",
    targetFacilities: ["All Regional Health Bureaus (RHB)", "Public Hospital Central Stores", "Dispensary Units"],
    officialDocNumber: "EPSS-REQUISITION-2026-90"
  }
];

export const sampleDrugShortageExchanges: DrugShortageExchange[] = [
  {
    id: "exch-001",
    initiatingFacility: "Adama Hospital Medical College",
    facilityType: "General Hospital",
    region: "Oromia Region",
    city: "Adama",
    drugName: "Norepinephrine Bitartrate IV Infusion",
    strength: "4 mg/4 mL",
    dosageForm: "Ampoule",
    exchangeType: "Requesting Emergency Supply",
    quantity: 60,
    unit: "Ampoules",
    urgency: "STAT Emergency",
    contactPerson: "Pharmacist Dawid Aliyi / Dr. Tolossa",
    contactPhone: "+251 982 852 778",
    status: "active",
    postedDate: "2026-10-29",
    notes: "ICU patient in septic shock. Central store stockout; will trade Ceftriaxone 1g (150 vials) or reimburse immediately."
  },
  {
    id: "exch-002",
    initiatingFacility: "Tikur Anbessa Specialized Hospital",
    facilityType: "Specialized Referral Hospital",
    region: "Addis Ababa",
    city: "Addis Ababa",
    drugName: "Ceftriaxone Sodium IV",
    strength: "1 g",
    dosageForm: "Vial",
    exchangeType: "Surplus Available for Exchange",
    quantity: 400,
    unit: "Vials",
    urgency: "Planned Sharing",
    contactPerson: "Sr. Clinical Pharmacist Dawid Aliyi",
    contactPhone: "+251 982 852 778",
    status: "active",
    postedDate: "2026-10-28",
    notes: "Surplus allocation from central donation, expiry date 2027-11. Available for inter-hospital emergency exchange for critical care vasopressors."
  },
  {
    id: "exch-003",
    initiatingFacility: "Hawassa University Comprehensive Hospital",
    facilityType: "Teaching Hospital",
    region: "Sidama Region",
    city: "Hawassa",
    drugName: "Oxytocin Injection",
    strength: "10 IU/1 mL",
    dosageForm: "Ampoule",
    exchangeType: "Requesting Emergency Supply",
    quantity: 200,
    unit: "Ampoules",
    urgency: "Urgent (< 24h)",
    contactPerson: "Maternity Pharmacy Coordinator",
    contactPhone: "+251 933 456 789",
    status: "active",
    postedDate: "2026-10-29",
    notes: "Obstetric labor ward demand surge. Cold chain 2-8°C verified transport ready."
  }
];

export const sampleInstitutionSubscription: InstitutionSubscription = {
  id: "sub-inst-2026-881",
  institutionName: "Tikur Anbessa Specialized Hospital (TASH)",
  institutionType: "Specialized Hospital",
  region: "Addis Ababa City Administration",
  city: "Addis Ababa",
  contactPerson: "Pharmacist Dawid Aliyi, Lead Director",
  contactRole: "Chief Clinical Pharmacist & Head of Drug Information",
  email: "jaalibiddoo@gmail.com",
  phone: "+251 982 852 778",
  annualFeeETB: 2000,
  annualFeeUSD: 20,
  paymentMethod: "telebirr",
  paymentReference: "TB-2026-8829104-DAWID",
  status: "active",
  startDate: "2026-01-01",
  expiryDate: "2027-01-01",
  licenseKey: "PS-INST-2026-TASH-84920",
  providerSeatsLimit: "Unlimited Healthcare Providers & Dispensaries",
  approvedBy: "Pharmacist Dawid Aliyi, Lead Director"
};
