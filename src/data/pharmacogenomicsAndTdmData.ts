export interface PGxGeneDrugPair {
  id: string;
  gene: string;
  drug: string;
  therapeuticArea: string;
  cpicLevel: 'A' | 'B' | 'C';
  phenotypes: {
    phenotype: string; // e.g. "Poor Metabolizer (*2/*2 or *2/*3)"
    activityScore?: string;
    clinicalImplication: string;
    prescribingRecommendation: string;
    alternativeTherapy: string;
    warningSeverity: 'CONTRAINDICATED' | 'MAJOR_DOSE_REDUCTION' | 'USE_ALTERNATIVE' | 'STANDARD_DOSE';
  }[];
  fdaLabeling: string;
  testTurnaroundTime: string;
  evidenceSummary: string;
}

export interface TDMClinicalProtocol {
  id: string;
  drug: string;
  therapeuticClass: string;
  targetRange: {
    trough?: string;
    peak?: string;
    auc24Mic?: string;
    steadyStateUnits: string;
  };
  samplingTime: string;
  pharmacokineticEquations: {
    name: string;
    formula: string;
    clinicalUse: string;
  }[];
  toxicityManifestations: string[];
  interventionsForHighLevel: string;
  interventionsForLowLevel: string;
  specialPopulations: string;
}

export const cpicGeneDrugGuidelines: PGxGeneDrugPair[] = [
  {
    id: 'cyp2c19-clopidogrel',
    gene: 'CYP2C19',
    drug: 'Clopidogrel (Plavix)',
    therapeuticArea: 'Cardiology (ACS / PCI)',
    cpicLevel: 'A',
    phenotypes: [
      {
        phenotype: 'Poor Metabolizer (*2/*2, *2/*3, *3/*3)',
        clinicalImplication: 'Significantly decreased formation of active thiol metabolite, reduced platelet inhibition, and higher risk of major adverse cardiovascular events (MACE) and stent thrombosis.',
        prescribingRecommendation: 'Avoid clopidogrel. Use alternative P2Y12 platelet inhibitor not dependent on CYP2C19 bioactivation at standard dose.',
        alternativeTherapy: 'Prasugrel 10 mg daily (or 5 mg if <60 kg / >=75 yo) or Ticagrelor 90 mg BID.',
        warningSeverity: 'USE_ALTERNATIVE'
      },
      {
        phenotype: 'Intermediate Metabolizer (*1/*2, *1/*3)',
        clinicalImplication: 'Moderately reduced active metabolite generation and residual high on-treatment platelet reactivity.',
        prescribingRecommendation: 'High risk of ischemic recurrence in acute coronary syndrome. Alternative antiplatelet strongly recommended.',
        alternativeTherapy: 'Ticagrelor 90 mg BID or Prasugrel 10 mg daily.',
        warningSeverity: 'USE_ALTERNATIVE'
      },
      {
        phenotype: 'Normal Metabolizer (*1/*1)',
        clinicalImplication: 'Normal active metabolite formation and expected platelet inhibition.',
        prescribingRecommendation: 'Initiate clopidogrel with standard 300-600 mg loading dose followed by 75 mg once daily.',
        alternativeTherapy: 'Standard dual antiplatelet therapy (DAPT) with Aspirin.',
        warningSeverity: 'STANDARD_DOSE'
      },
      {
        phenotype: 'Ultrarapid Metabolizer (*17/*17 or *1/*17)',
        clinicalImplication: 'Increased active metabolite exposure with normal to enhanced platelet inhibition; potential slight increase in non-fatal bleeding.',
        prescribingRecommendation: 'Use standard clopidogrel dose (75 mg daily) or standard antiplatelet therapy.',
        alternativeTherapy: 'Standard Clopidogrel 75 mg daily.',
        warningSeverity: 'STANDARD_DOSE'
      }
    ],
    fdaLabeling: 'Boxed Warning: Diminished antiplatelet effect in CYP2C19 poor metabolizers with tests available to identify genotype.',
    testTurnaroundTime: 'Rapid point-of-care PCR (Spartan RX: 60 mins) or reference central lab (24-48 hrs).',
    evidenceSummary: 'CPIC Guideline for CYP2C19 and Clopidogrel Therapy: Strong recommendation to use Ticagrelor or Prasugrel in ACS/PCI patients with loss-of-function alleles.'
  },
  {
    id: 'cyp2d6-codeine',
    gene: 'CYP2D6',
    drug: 'Codeine / Tramadol',
    therapeuticArea: 'Analgesia / Pain Management',
    cpicLevel: 'A',
    phenotypes: [
      {
        phenotype: 'Ultrarapid Metabolizer (UM, >=3 gene copies)',
        clinicalImplication: 'Extremely high conversion of codeine to morphine; risk of life-threatening respiratory depression and death even at normal pediatric or adult doses.',
        prescribingRecommendation: 'Contraindicated. Completely avoid codeine and tramadol due to extreme risk of fatal opioid overdose.',
        alternativeTherapy: 'Morphine, Hydromorphone, or non-opioid analgesics (Acetaminophen, NSAIDs) guided by clinical pain scores.',
        warningSeverity: 'CONTRAINDICATED'
      },
      {
        phenotype: 'Poor Metabolizer (PM, non-functional *3, *4, *5, *6)',
        clinicalImplication: 'Virtually no bioactivation into active morphine; absent or severely diminished analgesia.',
        prescribingRecommendation: 'Avoid codeine and tramadol due to therapeutic failure.',
        alternativeTherapy: 'Non-CYP2D6 metabolized analgesics (Acetaminophen, Ibuprofen) or direct-acting opioids like Morphine or Hydromorphone.',
        warningSeverity: 'USE_ALTERNATIVE'
      },
      {
        phenotype: 'Normal Metabolizer (NM, Activity Score 1.25 - 2.0)',
        clinicalImplication: 'Standard conversion to morphine with expected analgesic relief.',
        prescribingRecommendation: 'Prescribe codeine at standard label age- and weight-adjusted doses.',
        alternativeTherapy: 'Standard multimodal analgesia.',
        warningSeverity: 'STANDARD_DOSE'
      }
    ],
    fdaLabeling: 'Contraindicated in all children younger than 12 years and in adolescents 12-18 after tonsillectomy/adenoidectomy due to CYP2D6 UM fatalities.',
    testTurnaroundTime: '24-48 hours.',
    evidenceSummary: 'CPIC Guideline for CYP2D6 and Codeine: Strong recommendation to avoid codeine in both Ultrarapid and Poor Metabolizers.'
  },
  {
    id: 'hla-b-5701-abacavir',
    gene: 'HLA-B*57:01',
    drug: 'Abacavir (Ziagen, Epzicom, Triumeq)',
    therapeuticArea: 'Infectious Diseases / HIV-1 Antiretroviral',
    cpicLevel: 'A',
    phenotypes: [
      {
        phenotype: 'HLA-B*57:01 Positive',
        clinicalImplication: '50-60% absolute risk of severe, multisystem Abacavir Hypersensitivity Reaction (AHR) characterized by fever, rash, gastrointestinal distress, dyspnea, and fatal anaphylactoid shock upon rechallenge.',
        prescribingRecommendation: 'ABSOLUTELY CONTRAINDICATED. Never initiate or rechallenge abacavir in HLA-B*57:01 positive patients. Document lifelong allergy.',
        alternativeTherapy: 'Tenofovir disoproxil fumarate (TDF), Tenofovir alafenamide (TAF), or Zidovudine (AZT) based backbone.',
        warningSeverity: 'CONTRAINDICATED'
      },
      {
        phenotype: 'HLA-B*57:01 Negative',
        clinicalImplication: 'Extremely low risk (<0.1%) of immunologically confirmed hypersensitivity reaction.',
        prescribingRecommendation: 'Safe to initiate Abacavir at standard adult or pediatric dosing with routine counseling on rare idiosyncratic rash.',
        alternativeTherapy: 'Abacavir 600 mg daily (or 300 mg BID).',
        warningSeverity: 'STANDARD_DOSE'
      }
    ],
    fdaLabeling: 'Black Box Warning: Serious and sometimes fatal hypersensitivity reactions. Screen for HLA-B*57:01 prior to initiating therapy.',
    testTurnaroundTime: '24-72 hours (mandatory pre-treatment clearance).',
    evidenceSummary: 'PREDICT-1 Randomized Controlled Trial proved pre-treatment HLA-B*57:01 screening completely eliminates immunologically confirmed abacavir hypersensitivity.'
  },
  {
    id: 'tpmt-nudt15-azathioprine',
    gene: 'TPMT & NUDT15',
    drug: 'Azathioprine / 6-Mercaptopurine',
    therapeuticArea: 'Immunology / Rheumatology / IBD / Oncology',
    cpicLevel: 'A',
    phenotypes: [
      {
        phenotype: 'TPMT or NUDT15 Poor Metabolizer (Homozygous deficient)',
        clinicalImplication: 'Massive accumulation of thioguanine nucleotides (TGNs) causing profound, life-threatening pancytopenia, bone marrow failure, and sepsis.',
        prescribingRecommendation: 'For non-malignant conditions, consider alternative therapy. If essential (e.g. ALL leukemia), reduce standard dose by 90% (e.g. 10% of standard dose administered thrice weekly) and monitor CBC weekly.',
        alternativeTherapy: 'Methotrexate, Biologics (Infliximab, Adalimumab), or Mycophenolate Mofetil.',
        warningSeverity: 'MAJOR_DOSE_REDUCTION'
      },
      {
        phenotype: 'Intermediate Metabolizer (Heterozygous)',
        clinicalImplication: 'Moderate accumulation of cytotoxic TGNs with elevated leukopenia risk.',
        prescribingRecommendation: 'Reduce starting dose by 30-50% and titrate based on clinical tolerance and CBC monitoring.',
        alternativeTherapy: 'Azathioprine at 50% starting dose.',
        warningSeverity: 'MAJOR_DOSE_REDUCTION'
      }
    ],
    fdaLabeling: 'Recommend testing for TPMT and NUDT15 deficiency prior to initiating thiopurine therapy.',
    testTurnaroundTime: '48 hours.',
    evidenceSummary: 'CPIC Guideline for Thiopurine Dosing based on TPMT and NUDT15 Genotypes: Prevents fatal early myelosuppression.'
  },
  {
    id: 'slco1b1-simvastatin',
    gene: 'SLCO1B1',
    drug: 'Simvastatin / Atorvastatin',
    therapeuticArea: 'Cardiovascular / Dyslipidemia',
    cpicLevel: 'A',
    phenotypes: [
      {
        phenotype: 'SLCO1B1 Poor Function (*5/*5, *5/*15, *15/*15)',
        clinicalImplication: 'Severely impaired hepatic uptake via OATP1B1 transporter, causing 2- to 4-fold elevated systemic statin plasma concentrations and high risk of myopathy and fatal rhabdomyolysis.',
        prescribingRecommendation: 'Avoid Simvastatin >20 mg/day (or avoid completely). Prescribe lower-risk alternative statin.',
        alternativeTherapy: 'Rosuvastatin or Pravastatin at moderate intensity, or Pitavastatin.',
        warningSeverity: 'USE_ALTERNATIVE'
      }
    ],
    fdaLabeling: 'Contraindicated to exceed 20 mg simvastatin daily in patients with specific interacting drugs or genetic transporter deficiencies.',
    testTurnaroundTime: '24-48 hours.',
    evidenceSummary: 'SEARCH Collaborative Study: 60% of statin-induced rhabdomyolysis attributed to SLCO1B1 *5 variant allele.'
  }
];

export const tdmProtocols: TDMClinicalProtocol[] = [
  {
    id: 'vancomycin-auc',
    drug: 'Vancomycin Hydrochloride',
    therapeuticClass: 'Glycopeptide Antibacterial',
    targetRange: {
      trough: '10-15 mg/L (uncomplicated) or 15-20 mg/L (historically)',
      auc24Mic: '400 - 600 mg·h/L (assuming broth microdilution MIC = 1 mg/L)',
      steadyStateUnits: 'mg/L or mg·h/L'
    },
    samplingTime: 'Draw 2 post-distribution concentrations (e.g. peak 1-2h post-infusion and trough 30 mins prior to next dose) at steady-state (prior to 4th dose) or use Bayesian estimation software.',
    pharmacokineticEquations: [
      {
        name: 'Elimination Rate Constant (k_e)',
        formula: 'k_e = ln(C_peak / C_trough) / Δt',
        clinicalUse: 'Calculates the patient specific elimination rate from two serum levels.'
      },
      {
        name: 'Estimated Half-Life (t_1/2)',
        formula: 't_1/2 = 0.693 / k_e',
        clinicalUse: 'Determines drug clearance speed and dosing interval.'
      },
      {
        name: '24-Hour Area Under Curve (AUC24)',
        formula: 'AUC24 = (Daily Dose in mg) / Clearance_Vanco = Dose / (k_e × V_d)',
        clinicalUse: 'Primary efficacy and nephrotoxicity safety metric (target 400-600 mg·h/L).'
      }
    ],
    toxicityManifestations: [
      'Acute Kidney Injury (AKI: serum creatinine rise >=0.3 mg/dL or >=50% baseline)',
      'Ototoxicity (tinnitus, high-frequency sensorineural hearing loss, often irreversible)',
      'Red Man / Infusion Reaction (rate-related histamine release; not an IgE allergy)'
    ],
    interventionsForHighLevel: 'If AUC24 > 600 mg·h/L or trough > 20 mg/L: Hold 1 dose, recheck serum creatinine, re-calculate k_e, and extend the dosing interval (e.g. from q12h to q18h or q24h).',
    interventionsForLowLevel: 'If AUC24 < 400 mg·h/L: Increase total daily dose by 25-50% or shorten interval (e.g. from q12h to q8h). Verify actual infusion timing.',
    specialPopulations: 'In obesity: dose on actual body weight for loading (20-35 mg/kg, max 3000 mg) and cap maintenance. In hemodialysis: dose per post-dialysis levels (10-15 mg/kg after HD).'
  },
  {
    id: 'hartford-gentamicin',
    drug: 'Gentamicin / Tobramycin (Once-Daily Extended Interval)',
    therapeuticClass: 'Aminoglycoside Antibiotic',
    targetRange: {
      trough: '< 1.0 mg/L (ideally < 0.5 mg/L to prevent accumulation in proximal renal tubules)',
      peak: '16 - 24 mg/L (Concentration-dependent killing: Peak:MIC >= 10:1)',
      steadyStateUnits: 'mg/L'
    },
    samplingTime: 'Draw a single random serum concentration between 6 and 14 hours after the start of the first infusion, and plot on the Hartford Nomogram.',
    pharmacokineticEquations: [
      {
        name: 'Hartford Extended-Interval Dosing',
        formula: 'Dose = 7 mg/kg based on Adjusted Body Weight (ABW = IBW + 0.4 × [TBW - IBW])',
        clinicalUse: 'Maximizes concentration-dependent bactericidal effect and post-antibiotic effect (PAE).'
      },
      {
        name: 'Creatinine Clearance (Cockcroft-Gault)',
        formula: 'CrCl = [(140 - Age) × Weight_kg] / (72 × SCr_mg_dL) [× 0.85 if female]',
        clinicalUse: 'Determines whether extended-interval dosing is safe (requires CrCl >= 60 mL/min).'
      }
    ],
    toxicityManifestations: [
      'Nephrotoxicity: Acute tubular necrosis (ATN) via lysosomal phospholipidosis',
      'Ototoxicity: Vestibular (vertigo, ataxia) and cochlear (permanent hearing loss)',
      'Neuromuscular blockade: Potentiation with neuromuscular blockers in myasthenia gravis'
    ],
    interventionsForHighLevel: 'If 6-14h level plots above the 48-hour nomogram zone: Discontinue once-daily regimen, allow drug to wash out until level <1 mg/L, and transition to conventional multiple-daily dosing with intensive peak/trough TDM.',
    interventionsForLowLevel: 'If level plots in the 24-hour zone: Continue 7 mg/kg IV every 24 hours.',
    specialPopulations: 'Contraindicated for Hartford nomogram: Ascites, severe burns (>20% BSA), pregnancy, CrCl < 20 mL/min, enterococcal endocarditis (requires synergy dosing 1 mg/kg q8h).'
  },
  {
    id: 'phenytoin-winter-tozer',
    drug: 'Phenytoin (Dilantin)',
    therapeuticClass: 'Anticonvulsant / Hydantoin',
    targetRange: {
      trough: '10 - 20 mg/L (Total Phenytoin) or 1.0 - 2.0 mg/L (Free Unbound Phenytoin)',
      steadyStateUnits: 'mg/L'
    },
    samplingTime: 'Trough level drawn immediately prior to the next scheduled dose (at steady state, 7-10 days due to non-linear Michaelis-Menten saturation kinetics).',
    pharmacokineticEquations: [
      {
        name: 'Winter-Tozer Corrected Phenytoin (Hypoalbuminemia)',
        formula: 'C_corrected = C_measured / [(0.2 × Serum_Albumin_g_dL) + 0.1]',
        clinicalUse: 'Normalizes total phenytoin when albumin < 3.5 g/dL with normal renal function.'
      },
      {
        name: 'Winter-Tozer in End-Stage Renal Disease (CrCl < 10 mL/min)',
        formula: 'C_corrected = C_measured / [(0.1 × Serum_Albumin_g_dL) + 0.1]',
        clinicalUse: 'Accounts for both hypoalbuminemia and decreased binding affinity caused by uremic toxins.'
      }
    ],
    toxicityManifestations: [
      'Nystagmus (levels > 20 mg/L)',
      'Ataxia, slurred speech, confusion (levels > 30 mg/L)',
      'Lethargy, coma, paradoxical seizures (levels > 40 mg/L)',
      'Chronic: Gingival hyperplasia, hirsutism, peripheral neuropathy, folate deficiency'
    ],
    interventionsForHighLevel: 'Remember Michaelis-Menten kinetics: Small dose increases produce disproportionately large increases in serum level. If toxic, hold doses, monitor free levels, and restart at small increments (e.g. 25-50 mg/day adjustment).',
    interventionsForLowLevel: 'If corrected level < 10 mg/L: Increase total daily dose cautiously by 25-50 mg/day.',
    specialPopulations: 'In intensive care / critically ill patients: Always order Free Phenytoin directly instead of relying solely on mathematical corrections.'
  }
];
