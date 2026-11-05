export interface NaranjoQuestion {
  id: number;
  question: string;
  yesScore: number;
  noScore: number;
  doNotKnowScore: number;
  clinicalRationale: string;
}

export interface ADRReportRecord {
  id: string;
  reportDate: string;
  patientInitials: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientWeightKg: number;
  suspectedDrug: {
    brandName: string;
    genericName: string;
    batchNumber: string;
    manufacturer: string;
    expiryDate: string;
    dosageGiven: string;
    route: string;
    frequency: string;
    startDate: string;
    stopDate?: string;
    indication: string;
  };
  reactionDescription: string;
  reactionOnsetDate: string;
  reactionOutcome: 'Recovered' | 'Recovering' | 'Not Recovered' | 'Fatal' | 'Unknown';
  severityCriteria: {
    death: boolean;
    lifeThreatening: boolean;
    hospitalizationOrProlonged: boolean;
    disabilityOrIncapacity: boolean;
    congenitalAnomaly: boolean;
    medicallySignificant: boolean;
  };
  dechallengeOutcome: 'Positive (improved upon withdrawal)' | 'Negative (no change)' | 'Not Done';
  rechallengeOutcome: 'Positive (recurred)' | 'Negative (no recurrence)' | 'Not Done';
  naranjoScore: number;
  naranjoProbability: 'Definite' | 'Probable' | 'Possible' | 'Doubtful';
  whoCausalityGrade: 'Certain' | 'Probable/Likely' | 'Possible' | 'Unlikely' | 'Conditional/Unclassified' | 'Unassessable';
  reporter: {
    fullName: string;
    qualification: string;
    facilityName: string;
    facilityRegion: string;
    phone: string;
    email: string;
  };
}

export const naranjoQuestions: NaranjoQuestion[] = [
  {
    id: 1,
    question: 'Are there previous conclusive reports on this adverse reaction in the literature or package insert?',
    yesScore: 1,
    noScore: 0,
    doNotKnowScore: 0,
    clinicalRationale: 'Known pharmacological adverse effects of the drug class carry established prior probability.'
  },
  {
    id: 2,
    question: 'Did the adverse event appear after the suspected drug was administered?',
    yesScore: 2,
    noScore: -1,
    doNotKnowScore: 0,
    clinicalRationale: 'Temporal sequence is a mandatory prerequisite for biological causality.'
  },
  {
    id: 3,
    question: 'Did the adverse reaction improve when the drug was discontinued or a specific antagonist was administered (Dechallenge)?',
    yesScore: 1,
    noScore: 0,
    doNotKnowScore: 0,
    clinicalRationale: 'Dechallenge resolution provides strong clinical evidence implicating the agent.'
  },
  {
    id: 4,
    question: 'Did the adverse reaction reappear when the drug was readministered (Rechallenge)?',
    yesScore: 2,
    noScore: -1,
    doNotKnowScore: 0,
    clinicalRationale: 'Positive rechallenge is the gold standard of causality assessment.'
  },
  {
    id: 5,
    question: 'Are there alternative causes (other than the drug) that on their own could have caused the reaction?',
    yesScore: -1,
    noScore: 2,
    doNotKnowScore: 0,
    clinicalRationale: 'Underlying disease progression, infection, or concurrent drugs can confound the reaction.'
  },
  {
    id: 6,
    question: 'Did the reaction reappear when a placebo was given?',
    yesScore: -1,
    noScore: 1,
    doNotKnowScore: 0,
    clinicalRationale: 'Placebo-induced recurrence suggests non-pharmacological etiology or psychosomatic reaction.'
  },
  {
    id: 7,
    question: 'Was the drug detected in the blood (or other body fluids) in concentrations known to be toxic?',
    yesScore: 1,
    noScore: 0,
    doNotKnowScore: 0,
    clinicalRationale: 'Therapeutic Drug Monitoring (TDM) showing supratherapeutic levels directly corroborates toxicity.'
  },
  {
    id: 8,
    question: 'Was the reaction more severe when the dose was increased, or less severe when the dose was decreased (Dose-Response)?',
    yesScore: 1,
    noScore: 0,
    doNotKnowScore: 0,
    clinicalRationale: 'A clear dose-response relationship confirms Type A pharmacodynamic toxicity.'
  },
  {
    id: 9,
    question: 'Did the patient have a similar reaction to the same or similar drugs in any previous exposure?',
    yesScore: 1,
    noScore: 0,
    doNotKnowScore: 0,
    clinicalRationale: 'Patient-specific immunological or metabolic susceptibility recurrence.'
  },
  {
    id: 10,
    question: 'Was the adverse event confirmed by any objective clinical, laboratory, or diagnostic evidence?',
    yesScore: 1,
    noScore: 0,
    doNotKnowScore: 0,
    clinicalRationale: 'Objective biomarkers (e.g. elevated LFTs, eosinophilia, serum creatinine, ECG QTc) corroborate subjective symptoms.'
  }
];

export const calculateNaranjoScore = (answers: Record<number, 'yes' | 'no' | 'unknown'>): {
  score: number;
  probability: 'Definite' | 'Probable' | 'Possible' | 'Doubtful';
  badgeColor: string;
} => {
  let score = 0;
  naranjoQuestions.forEach(q => {
    const ans = answers[q.id] || 'unknown';
    if (ans === 'yes') score += q.yesScore;
    else if (ans === 'no') score += q.noScore;
    else score += q.doNotKnowScore;
  });

  if (score >= 9) {
    return { score, probability: 'Definite', badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30' };
  } else if (score >= 5) {
    return { score, probability: 'Probable', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  } else if (score >= 1) {
    return { score, probability: 'Possible', badgeColor: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30' };
  } else {
    return { score, probability: 'Doubtful', badgeColor: 'text-slate-400 bg-slate-800 border-slate-700' };
  }
};

export const sampleAdrHistory: ADRReportRecord[] = [
  {
    id: 'EFDA-ADR-2026-0041',
    reportDate: '2026-10-24',
    patientInitials: 'T.G.',
    patientAge: 48,
    patientGender: 'Male',
    patientWeightKg: 68,
    suspectedDrug: {
      brandName: 'Ciprofloxacin USP 500mg',
      genericName: 'Ciprofloxacin HCl',
      batchNumber: 'CIP-2025-081',
      manufacturer: 'Cadila Pharmaceuticals Ethiopia',
      expiryDate: '2027-06-30',
      dosageGiven: '500 mg PO',
      route: 'Oral',
      frequency: 'Every 12 hours',
      startDate: '2026-10-18',
      stopDate: '2026-10-22',
      indication: 'Complicated Urinary Tract Infection'
    },
    reactionDescription: 'Severe bilateral Achilles tendinopathy with partial thickness tear confirmed on ultrasound. Patient was unable to bear weight 4 days after initiation.',
    reactionOnsetDate: '2026-10-22',
    reactionOutcome: 'Recovering',
    severityCriteria: {
      death: false,
      lifeThreatening: false,
      hospitalizationOrProlonged: true,
      disabilityOrIncapacity: true,
      congenitalAnomaly: false,
      medicallySignificant: true
    },
    dechallengeOutcome: 'Positive (improved upon withdrawal)',
    rechallengeOutcome: 'Not Done',
    naranjoScore: 7,
    naranjoProbability: 'Probable',
    whoCausalityGrade: 'Probable/Likely',
    reporter: {
      fullName: 'Pharmacist Dawid Aliyi, BCPS',
      qualification: 'Clinical Pharmacist Specialist',
      facilityName: 'Tikur Anbessa Specialized Hospital (TASH)',
      facilityRegion: 'Addis Ababa',
      phone: '0982852778',
      email: 'jaalibiddoo@gmail.com'
    }
  },
  {
    id: 'EFDA-ADR-2026-0038',
    reportDate: '2026-10-15',
    patientInitials: 'A.M.',
    patientAge: 62,
    patientGender: 'Female',
    patientWeightKg: 55,
    suspectedDrug: {
      brandName: 'Co-Amoxiclav 625mg',
      genericName: 'Amoxicillin + Clavulanic Acid',
      batchNumber: 'CAM-8841-A',
      manufacturer: 'Ethiopian Pharmaceuticals Manufacturing Sh.Co. (EPHARM)',
      expiryDate: '2027-02-28',
      dosageGiven: '625 mg PO',
      route: 'Oral',
      frequency: 'Every 8 hours',
      startDate: '2026-09-28',
      stopDate: '2026-10-08',
      indication: 'Acute exacerbation of chronic bronchitis'
    },
    reactionDescription: 'Drug-Induced Cholestatic Liver Injury. Jaundice, pruritus, dark urine, and markedly elevated alkaline phosphatase (480 IU/L) and ALT (320 IU/L) 2 weeks post-therapy.',
    reactionOnsetDate: '2026-10-12',
    reactionOutcome: 'Recovering',
    severityCriteria: {
      death: false,
      lifeThreatening: false,
      hospitalizationOrProlonged: true,
      disabilityOrIncapacity: false,
      congenitalAnomaly: false,
      medicallySignificant: true
    },
    dechallengeOutcome: 'Positive (improved upon withdrawal)',
    rechallengeOutcome: 'Not Done',
    naranjoScore: 6,
    naranjoProbability: 'Probable',
    whoCausalityGrade: 'Probable/Likely',
    reporter: {
      fullName: 'Pharmacist Dawid Aliyi, BCPS',
      qualification: 'Clinical Pharmacist Specialist',
      facilityName: 'St. Paul’s Hospital Millennium Medical College',
      facilityRegion: 'Addis Ababa',
      phone: '0982852778',
      email: 'jaalibiddoo@gmail.com'
    }
  }
];
