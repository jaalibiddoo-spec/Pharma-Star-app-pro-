export interface AwareMedication {
  id: string;
  name: string;
  category: 'Access' | 'Watch' | 'Reserve';
  class: string;
  indications: string[];
  oralAvailable: boolean;
  ivAvailable: boolean;
  doseAdult: string;
  dosePediatric: string;
  renalAdjustment: string;
  toxicityAlerts: string[];
  mohEssentialStatus: string;
}

export interface SyndromicEmpiricGuideline {
  id: string;
  syndrome: string;
  bodySystem: string;
  severity: 'Mild/Outpatient' | 'Moderate/Inpatient' | 'Severe/ICU';
  primaryRegimen: {
    drug: string;
    route: string;
    dosage: string;
    duration: string;
    awareGroup: 'Access' | 'Watch' | 'Reserve';
  }[];
  alternativeRegimen: {
    drug: string;
    route: string;
    dosage: string;
    duration: string;
    awareGroup: 'Access' | 'Watch' | 'Reserve';
  }[];
  keyPathogens: string[];
  clinicalPearls: string;
  stgRef: string;
}

export interface AntibiogramOrganism {
  id: string;
  organismName: string;
  gramType: 'Gram-Negative' | 'Gram-Positive' | 'Atypical';
  isolatesTested: number;
  susceptibilities: Record<string, number>; // drugId -> % Susceptible (0-100)
  resistancePhenotype?: string; // e.g. ESBL, MRSA, VRE, CRE
}

export const sampleAwareMedications: AwareMedication[] = [
  {
    id: 'amox',
    name: 'Amoxicillin',
    category: 'Access',
    class: 'Aminopenicillin',
    indications: ['Community-Acquired Pneumonia', 'Acute Otitis Media', 'Streptococcal Pharyngitis', 'Uncomplicated Dental Infection'],
    oralAvailable: true,
    ivAvailable: false,
    doseAdult: '500 mg - 1000 mg PO every 8 hours',
    dosePediatric: '40-50 mg/kg/day (mild) or 80-90 mg/kg/day (severe) divided q8-12h',
    renalAdjustment: 'eGFR 10-30: 250-500 mg q12h; eGFR < 10: 250-500 mg q24h',
    toxicityAlerts: ['Hypersensitivity/Anaphylaxis', 'Maculopapular rash with EBV/Mono'],
    mohEssentialStatus: 'Core National List (Model Form 1)'
  },
  {
    id: 'amox_clav',
    name: 'Amoxicillin-Clavulanic Acid (Augmentin)',
    category: 'Access',
    class: 'Beta-lactam + Beta-lactamase Inhibitor',
    indications: ['Bite wounds', 'Complicated Sinusitis', 'Aspiration Pneumonia', 'Mild Pyelonephritis'],
    oralAvailable: true,
    ivAvailable: true,
    doseAdult: '625 mg - 1000 mg PO q8h or 1.2 g IV q8h',
    dosePediatric: '40-45 mg/kg/day of amox component divided q8-12h',
    renalAdjustment: 'eGFR 10-30: 625 mg q12h; eGFR < 10: 625 mg q24h',
    toxicityAlerts: ['Cholestatic jaundice/hepatotoxicity with repeated cycles', 'Severe diarrhea (Clavulanate-induced)'],
    mohEssentialStatus: 'Core National List'
  },
  {
    id: 'ampicillin',
    name: 'Ampicillin',
    category: 'Access',
    class: 'Aminopenicillin',
    indications: ['Neonatal Sepsis (with Gentamicin)', 'Listeria monocytogenes Meningitis', 'Enterococcal Endocarditis'],
    oralAvailable: false,
    ivAvailable: true,
    doseAdult: '2 g IV every 4-6 hours',
    dosePediatric: '150-200 mg/kg/day IV divided q6h',
    renalAdjustment: 'eGFR 10-50: q6-8h; eGFR < 10: q12h',
    toxicityAlerts: ['Electrolyte shift (high sodium load)', 'Seizures with high doses in renal failure'],
    mohEssentialStatus: 'Vital Hospital Emergency List'
  },
  {
    id: 'gentamicin',
    name: 'Gentamicin',
    category: 'Access',
    class: 'Aminoglycoside',
    indications: ['Gram-negative sepsis', 'Neonatal Sepsis', 'Complicated Pyelonephritis', 'Synergistic Endocarditis'],
    oralAvailable: false,
    ivAvailable: true,
    doseAdult: '5 - 7 mg/kg IV once daily (extended-interval) or 1.5 mg/kg q8h',
    dosePediatric: '7.5 mg/kg/day IV once daily or 2.5 mg/kg q8h; Neonates: 4-5 mg/kg q24-36h',
    renalAdjustment: 'Dose interval prolongation based on Hartford nomogram and trough monitoring (< 1 mcg/mL)',
    toxicityAlerts: ['Irreversible ototoxicity (cochlear & vestibular)', 'Nephrotoxicity (acute tubular necrosis)'],
    mohEssentialStatus: 'Core National List'
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    category: 'Access',
    class: 'Tetracycline',
    indications: ['Atypical Pneumonia', 'Lyme disease', 'Scrub Typhus', 'Malaria Prophylaxis', 'Pelvic Inflammatory Disease'],
    oralAvailable: true,
    ivAvailable: true,
    doseAdult: '100 mg PO/IV every 12 hours',
    dosePediatric: '4.4 mg/kg/day divided q12h for children < 45 kg',
    renalAdjustment: 'No dose adjustment required in renal failure (hepatic/biliary excretion)',
    toxicityAlerts: ['Severe pill-induced esophagitis (take with full glass of water & remain upright for 30 min)', 'Photosensitivity'],
    mohEssentialStatus: 'Core National List'
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    category: 'Watch',
    class: '3rd Generation Cephalosporin',
    indications: ['Bacterial Meningitis', 'Inpatient CAP', 'Pyelonephritis', 'Gonorrhea', 'Typhoid Fever', 'Severe Sepsis'],
    oralAvailable: false,
    ivAvailable: true,
    doseAdult: '1 g - 2 g IV once daily (2 g IV q12h in Meningitis)',
    dosePediatric: '50-100 mg/kg/day IV once daily (or divided q12h for meningitis; max 4 g/day)',
    renalAdjustment: 'No adjustment needed unless combined hepatic and renal failure (max 2 g/day)',
    toxicityAlerts: ['Biliary pseudolithiasis/sludge', 'NEVER co-infuse with IV calcium in neonates (fatal precipitates)'],
    mohEssentialStatus: 'Priority Antimicrobial Stewardship Focus'
  },
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin',
    category: 'Watch',
    class: 'Fluoroquinolone',
    indications: ['Complicated UTI', 'Invasive Salmonella/Typhoid', 'Infectious Diarrhea', 'Pseudomonas Aeruginosa infections'],
    oralAvailable: true,
    ivAvailable: true,
    doseAdult: '500-750 mg PO q12h or 400 mg IV q8-12h',
    dosePediatric: '20-30 mg/kg/day divided q12h (restrict to specific indications due to arthropathy risk)',
    renalAdjustment: 'eGFR 30-50: 250-500 mg q12h; eGFR < 30: 250-500 mg q18-24h',
    toxicityAlerts: ['Tendinitis and tendon rupture (Achilles)', 'QTc prolongation', 'CNS neurotoxicity & delirium in elderly', 'Aortic aneurysm risk'],
    mohEssentialStatus: 'High Stewardship Alert'
  },
  {
    id: 'meropenem',
    name: 'Meropenem',
    category: 'Watch',
    class: 'Carbapenem',
    indications: ['Severe Nosocomial Sepsis', 'Complicated Intra-abdominal infection', 'Febrile Neutropenia', 'MDR Gram-negative infections'],
    oralAvailable: false,
    ivAvailable: true,
    doseAdult: '1 g IV every 8 hours (extended 3-hour infusion) or 2 g q8h in Meningitis',
    dosePediatric: '20-40 mg/kg IV q8h (max 1 g q8h; 2 g q8h in meningitis)',
    renalAdjustment: 'eGFR 26-50: 1 g q12h; eGFR 10-25: 500 mg q12h; eGFR < 10: 500 mg q24h',
    toxicityAlerts: ['Seizure risk (lower than imipenem)', 'Selects for Carbapenem-Resistant Enterobacteriaceae (CRE)'],
    mohEssentialStatus: 'Restricted Hospital Formula'
  },
  {
    id: 'vancomycin',
    name: 'Vancomycin',
    category: 'Watch',
    class: 'Glycopeptide',
    indications: ['MRSA Infections', 'Enterococcal Sepsis', 'Severe C. difficile colitis (PO only)', 'Coagulase-Negative Staph Line Infections'],
    oralAvailable: true, // Only for C. diff
    ivAvailable: true,
    doseAdult: '15-20 mg/kg IV every 8-12 hours (target AUC/MIC 400-600 or trough 15-20 mcg/mL for severe MRSA)',
    dosePediatric: '15 mg/kg IV q6-8h; C. diff: 10 mg/kg PO q6h',
    renalAdjustment: 'Therapeutic Drug Monitoring (TDM) mandatory; interval extended to q24-48h or by level in dialysis',
    toxicityAlerts: ['Red Man Syndrome (infusion-rate dependent histaminic release; infuse <= 1000 mg/hr)', 'Nephrotoxicity (potentiated with Piperacillin-Tazobactam)'],
    mohEssentialStatus: 'TDM Required'
  },
  {
    id: 'colistin',
    name: 'Colistin (Colistimethate Sodium)',
    category: 'Reserve',
    class: 'Polymyxin',
    indications: ['Last-resort therapy for Carbapenem-Resistant Gram-negatives (CR-Acinetobacter, CR-Klebsiella, CR-Pseudomonas)'],
    oralAvailable: false,
    ivAvailable: true,
    doseAdult: 'Loading dose: 9 million IU (approx. 300 mg CBA) IV, then 4.5 million IU q12h maintenance',
    dosePediatric: '75,000 - 150,000 IU/kg/day divided q8h',
    renalAdjustment: 'Strict dose titration required; eGFR 30-50: 5.5-7.5 million IU/day; eGFR < 10: 2-3 million IU/day',
    toxicityAlerts: ['Severe acute kidney injury in >30% patients', 'Neuromuscular blockade and respiratory apnea'],
    mohEssentialStatus: 'National Reserve - DTC Approval Mandatory'
  },
  {
    id: 'linezolid',
    name: 'Linezolid',
    category: 'Reserve',
    class: 'Oxazolidinone',
    indications: ['Vancomycin-Resistant Enterococcus (VRE)', 'MRSA Pneumonia', 'MDR-TB second-line regimens'],
    oralAvailable: true,
    ivAvailable: true,
    doseAdult: '600 mg PO/IV every 12 hours (100% oral bioavailability)',
    dosePediatric: '10 mg/kg PO/IV q8h (< 12 years) or q12h (>= 12 years)',
    renalAdjustment: 'No dose adjustment required (metabolites accumulate in severe renal failure but no dose reduction recommended)',
    toxicityAlerts: ['Myelosuppression (thrombocytopenia & anemia after > 14 days; monitor weekly CBC)', 'Optic and peripheral neuropathy with prolonged therapy', 'Serotonin syndrome with SSRIs/SNRIs'],
    mohEssentialStatus: 'Reserve Category - Restricted'
  }
];

export const sampleSyndromicGuidelines: SyndromicEmpiricGuideline[] = [
  {
    id: 'cap_adult',
    syndrome: 'Community-Acquired Pneumonia (CAP)',
    bodySystem: 'Respiratory',
    severity: 'Moderate/Inpatient',
    primaryRegimen: [
      { drug: 'Ceftriaxone', route: 'IV', dosage: '1 g - 2 g once daily', duration: '5 - 7 days', awareGroup: 'Watch' },
      { drug: 'Azithromycin', route: 'PO/IV', dosage: '500 mg daily', duration: '3 - 5 days', awareGroup: 'Watch' }
    ],
    alternativeRegimen: [
      { drug: 'Amoxicillin-Clavulanic Acid', route: 'IV', dosage: '1.2 g q8h', duration: '5 - 7 days', awareGroup: 'Access' },
      { drug: 'Doxycycline', route: 'PO', dosage: '100 mg q12h', duration: '5 - 7 days', awareGroup: 'Access' }
    ],
    keyPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae', 'Mycoplasma pneumoniae', 'Chlamydia pneumoniae'],
    clinicalPearls: 'De-escalate from IV Ceftriaxone to PO Amoxicillin once the patient is afebrile for 48 hours and hemodynamically stable. Total duration 5 days is sufficient for non-complicated CAP.',
    stgRef: 'Ethiopian MoH National Standard Treatment Guidelines & WHO AWaRe 2026'
  },
  {
    id: 'meningitis_acute',
    syndrome: 'Acute Bacterial Meningitis (Adult & Child > 2 mo)',
    bodySystem: 'Central Nervous System',
    severity: 'Severe/ICU',
    primaryRegimen: [
      { drug: 'Ceftriaxone', route: 'IV', dosage: '2 g IV every 12 hours (Child: 100 mg/kg/day q12h)', duration: '10 - 14 days', awareGroup: 'Watch' },
      { drug: 'Vancomycin', route: 'IV', dosage: '15-20 mg/kg IV q8-12h (target trough 15-20)', duration: '10 - 14 days', awareGroup: 'Watch' }
    ],
    alternativeRegimen: [
      { drug: 'Meropenem', route: 'IV', dosage: '2 g IV q8h', duration: '14 days', awareGroup: 'Watch' },
      { drug: 'Chloramphenicol', route: 'IV', dosage: '1 g IV q6h (Resource-limited alternative)', duration: '10 days', awareGroup: 'Access' }
    ],
    keyPathogens: ['Streptococcus pneumoniae', 'Neisseria meningitidis', 'Listeria monocytogenes (if age > 50 or immunocompromised; add Ampicillin 2g q4h)'],
    clinicalPearls: 'Administer Dexamethasone 10 mg IV 15-20 minutes before or with the first dose of antibiotics to decrease hearing loss and mortality in pneumococcal meningitis.',
    stgRef: 'EFDA Hospital Therapeutics Guideline & IDSA Guidelines'
  },
  {
    id: 'sepsis_shock',
    syndrome: 'Severe Sepsis & Septic Shock (Unknown Origin)',
    bodySystem: 'Systemic / Hemodynamic',
    severity: 'Severe/ICU',
    primaryRegimen: [
      { drug: 'Piperacillin-Tazobactam', route: 'IV', dosage: '4.5 g IV every 6 hours (extended 4h infusion)', duration: '7 - 10 days', awareGroup: 'Watch' },
      { drug: 'Vancomycin', route: 'IV', dosage: '25-30 mg/kg loading dose, then 15-20 mg/kg q8-12h', duration: 'Individualized', awareGroup: 'Watch' }
    ],
    alternativeRegimen: [
      { drug: 'Meropenem', route: 'IV', dosage: '1 g - 2 g IV q8h', duration: '7 - 10 days', awareGroup: 'Watch' },
      { drug: 'Gentamicin', route: 'IV', dosage: '5-7 mg/kg single dose synergy', duration: '24-48 hours', awareGroup: 'Access' }
    ],
    keyPathogens: ['Escherichia coli', 'Klebsiella pneumoniae', 'Staphylococcus aureus', 'Pseudomonas aeruginosa'],
    clinicalPearls: 'Initiate broad-spectrum IV antimicrobials within the first hour of recognition (Hour-1 Sepsis Bundle) after drawing blood cultures. Re-assess daily for de-escalation based on culture results.',
    stgRef: 'Surviving Sepsis Campaign & MoH Critical Care Guidelines'
  },
  {
    id: 'uti_pyelo',
    syndrome: 'Acute Complicated Pyelonephritis',
    bodySystem: 'Genitourinary',
    severity: 'Moderate/Inpatient',
    primaryRegimen: [
      { drug: 'Ceftriaxone', route: 'IV', dosage: '1 g - 2 g IV once daily', duration: '7 days', awareGroup: 'Watch' }
    ],
    alternativeRegimen: [
      { drug: 'Gentamicin', route: 'IV', dosage: '5 mg/kg IV once daily', duration: '5 - 7 days', awareGroup: 'Access' },
      { drug: 'Ciprofloxacin', route: 'PO/IV', dosage: '500 mg PO q12h (only if local resistance < 10%)', duration: '7 days', awareGroup: 'Watch' }
    ],
    keyPathogens: ['Escherichia coli (uropathogenic)', 'Klebsiella pneumoniae', 'Proteus mirabilis', 'Enterococcus faecalis'],
    clinicalPearls: 'Avoid Nitrofurantoin and Fosfomycin in Pyelonephritis because they do not achieve adequate renal parenchymal concentrations (they are only for uncomplicated cystitis).',
    stgRef: 'Ethiopian MoH Nephrology & Urology STG'
  }
];

export const sampleAntibiogramData: AntibiogramOrganism[] = [
  {
    id: 'ecoli',
    organismName: 'Escherichia coli (Urine & Blood Isolates)',
    gramType: 'Gram-Negative',
    isolatesTested: 240,
    susceptibilities: {
      amox: 18,
      amox_clav: 54,
      gentamicin: 78,
      ceftriaxone: 42, // High ESBL rate
      ciprofloxacin: 38,
      meropenem: 98,
      colistin: 99
    },
    resistancePhenotype: 'ESBL Rate: 58% | Low Fluoroquinolone Susceptibility'
  },
  {
    id: 'klebsiella',
    organismName: 'Klebsiella pneumoniae (ICU & Surgical Isolates)',
    gramType: 'Gram-Negative',
    isolatesTested: 185,
    susceptibilities: {
      amox: 0, // Intrinsic resistance
      amox_clav: 38,
      gentamicin: 62,
      ceftriaxone: 32,
      ciprofloxacin: 44,
      meropenem: 89,
      colistin: 96
    },
    resistancePhenotype: 'High MDR Burden | 11% Carbapenem-Resistant (CRE)'
  },
  {
    id: 'pseudomonas',
    organismName: 'Pseudomonas aeruginosa (Wound & Tracheal Aspirates)',
    gramType: 'Gram-Negative',
    isolatesTested: 110,
    susceptibilities: {
      gentamicin: 68,
      ciprofloxacin: 58,
      meropenem: 74,
      colistin: 98
    },
    resistancePhenotype: 'Non-fermenter | Inherent resistance to Ceftriaxone/Ampicillin'
  },
  {
    id: 'saureus',
    organismName: 'Staphylococcus aureus (Skin, Soft Tissue, Blood)',
    gramType: 'Gram-Positive',
    isolatesTested: 195,
    susceptibilities: {
      doxycycline: 88,
      ciprofloxacin: 60,
      vancomycin: 100,
      linezolid: 100
    },
    resistancePhenotype: 'MRSA Prevalence: 41% | 100% Vancomycin & Linezolid Susceptible'
  },
  {
    id: 'spneumo',
    organismName: 'Streptococcus pneumoniae (Sputum & CSF)',
    gramType: 'Gram-Positive',
    isolatesTested: 92,
    susceptibilities: {
      amox: 82,
      ceftriaxone: 94,
      vancomycin: 100,
      linezolid: 100
    },
    resistancePhenotype: 'Penicillin-Intermediate: 18% | Ceftriaxone High Efficacy'
  }
];
