export type DrugStatus = 'active' | 'suspended' | 'pipeline';

export interface DrugMonograph {
  id: string;
  name: string;
  brandNames: string[];
  drugClass: string;
  therapeuticCategory: 
    | 'Cardiovascular & Hematology'
    | 'Infectious Diseases & Antimicrobials'
    | 'Endocrinology & Metabolism'
    | 'Oncology & Immunotherapy'
    | 'Neurology & Psychiatry'
    | 'Gastroenterology & Hepatology'
    | 'Respiratory & Allergy'
    | 'Analgesics & Rheumatology'
    | 'Rare Diseases & Gene Therapy';
  status: DrugStatus;
  statusBadge: string;
  atcCode: string;
  molecularTarget: string;
  chemicalFormula?: string;
  mechanismOfAction: string;
  indications: string[];
  dosingAndAdministration: {
    adult: string;
    pediatric?: string;
    geriatric?: string;
    route: string;
  };
  organDoseAdjustments: {
    renal: string;
    hepatic: string;
    dialysis?: string;
  };
  pharmacokinetics: {
    bioavailability: string;
    tmax: string;
    proteinBinding: string;
    metabolism: string;
    halfLife: string;
    elimination: string;
  };
  adverseReactions: {
    common: string[];
    severeOrLifeThreatening: string[];
  };
  blackBoxWarnings: string[];
  contraindications: string[];
  drugInteractions: {
    cypPathways: string;
    majorInteractions: string[];
  };
  pregnancyAndLactation: {
    fdaCategory: string;
    briggsRisk: string;
    summary: string;
  };
  marketLifecycleDetails: {
    yearIntroduced?: number;
    yearWithdrawnOrSuspended?: number;
    primaryRegulators: string[];
    // For Suspended / Expelled:
    toxicologicalRootCause?: string;
    pivotalSafetyTrials?: string;
    saferAlternatives?: string[];
    // For Pipeline:
    clinicalTrialPhase?: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Pre-Registration (NDA / BLA)';
    leadSponsor?: string;
    expectedApprovalYear?: string;
    pivotalTrialEndpoints?: string;
    clinicalAdvantageOverStandard?: string;
  };
  clinicalPharmacistPearls: string[];
}

export const universalDrugCompendiumData: DrugMonograph[] = [
  // ==========================================
  // 1. ACTIVELY USED MEDICATIONS (APPROVED)
  // ==========================================
  {
    id: 'drug-metformin',
    name: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza', 'Diaformin'],
    drugClass: 'Biguanide Antidiabetic Agent',
    therapeuticCategory: 'Endocrinology & Metabolism',
    status: 'active',
    statusBadge: 'Approved • Global & EFDA First-Line',
    atcCode: 'A10BA02',
    molecularTarget: 'Mitochondrial Complex I & AMP-activated protein kinase (AMPK)',
    chemicalFormula: 'C4H11N5',
    mechanismOfAction: 'Inhibits hepatic mitochondrial respiratory chain Complex I, activating AMPK to suppress hepatic gluconeogenesis and lipogenesis. Increases peripheral insulin sensitivity and glucose uptake via GLUT4 translocation. Does not stimulate pancreatic insulin secretion and does not cause hypoglycemia as monotherapy.',
    indications: [
      'Type 2 Diabetes Mellitus (First-line pharmacotherapy per ADA/EASD and Ethiopian STG)',
      'Polycystic Ovary Syndrome (PCOS) - Anovulatory subfertility & metabolic syndrome (Off-label)',
      'Prevention of Type 2 Diabetes in pre-diabetic patients with BMI ≥ 35 kg/m²'
    ],
    dosingAndAdministration: {
      adult: 'Immediate-release: 500mg PO BID or 850mg PO daily with meals; titrate by 500mg weekly up to maximum 2000-2550 mg/day in divided doses. Extended-release (XR): 500-1000mg PO once daily with evening meal (max 2000 mg/day).',
      pediatric: 'Children ≥ 10 years: Initial 500mg PO BID; max 2000 mg/day.',
      geriatric: 'Cautious titration; monitor renal clearance annually or semi-annually.',
      route: 'Oral with meals (to reduce gastrointestinal discomfort)'
    },
    organDoseAdjustments: {
      renal: 'eGFR ≥ 60 mL/min/1.73m²: No dose adjustment. eGFR 45-59: Maximum 2000 mg/day. eGFR 30-44: Maximum 1000 mg/day (500mg BID); do not initiate in new patients. eGFR < 30 mL/min/1.73m²: STRICTLY CONTRAINDICATED due to fatal lactic acidosis risk.',
      hepatic: 'Avoid in severe hepatic impairment / liver cirrhosis due to impaired lactate clearance capacity.',
      dialysis: 'Contraindicated in hemodialysis and peritoneal dialysis.'
    },
    pharmacokinetics: {
      bioavailability: '50% to 60% under fasting conditions; food slightly delays absorption',
      tmax: '2.5 hours (IR), 7 hours (XR)',
      proteinBinding: 'Negligible (freely soluble)',
      metabolism: 'Not metabolized by liver CYP450 enzymes; excreted completely unchanged',
      halfLife: 'Plasma elimination half-life approximately 6.2 hours; biological half-life 17.6 hours in RBCs',
      elimination: '90% eliminated unchanged via renal tubular secretion through OCT2 and MATE1 transporters'
    },
    adverseReactions: {
      common: ['Diarrhea (up to 53%)', 'Nausea and vomiting (25%)', 'Abdominal distension/flatulence', 'Metallic taste in mouth', 'Vitamin B12 deficiency (with long-term use)'],
      severeOrLifeThreatening: ['Metformin-Associated Lactic Acidosis (MALA) - Rare (3-10 per 100,000 patient-years) but carries 30-50% in-hospital mortality.']
    },
    blackBoxWarnings: [
      'Black Box Warning: Lactic Acidosis. Risk increases with conditions resulting in tissue hypoperfusion, sepsis, acute kidney injury, advanced hepatic disease, and acute heart failure. Hold drug prior to iodinated radiocontrast procedures in eGFR < 60 mL/min.'
    ],
    contraindications: [
      'Severe renal impairment (eGFR < 30 mL/min/1.73m²)',
      'Acute or chronic metabolic acidosis (including diabetic ketoacidosis)',
      'Severe congestive heart failure requiring acute inotropic or diuretic support',
      'Hypersensitivity to metformin'
    ],
    drugInteractions: {
      cypPathways: 'Not a substrate, inducer, or inhibitor of CYP enzymes. Interacts with OCT2/MATE transporters.',
      majorInteractions: [
        'Iodinated Contrast Media: Acute contrast-induced nephropathy leads to toxic metformin accumulation; hold for 48h.',
        'Cimetidine & Dolutegravir: Inhibit OCT2/MATE1 secretion, increasing metformin plasma AUC by 40-50%.',
        'Alcohol (Ethanol): Potentiates metformin effect on lactate metabolism; acute intoxication increases lactic acidosis risk.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category B',
      briggsRisk: 'Compatible / Minimal Risk',
      summary: 'Crosses placenta. Considered safe and frequently used for gestational diabetes when insulin is unavailable or declined, although insulin remains first-line international recommendation.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 1957,
      primaryRegulators: ['French Regulatory Agency (1957)', 'UK MHRA (1958)', 'US FDA (1995)', 'Ethiopian EFDA (Registered List I)'],
      clinicalAdvantageOverStandard: 'Weight-neutral or weight-reducing, reduces microvascular and macrovascular complications (UKPDS trial), zero inherent hypoglycemia risk, highly cost-effective generic.'
    },
    clinicalPharmacistPearls: [
      'Always start low and go slow: 500mg with the largest meal for 7 days to overcome transient osmotic diarrhea.',
      'Screen annual serum Vitamin B12 levels or Mean Corpuscular Volume (MCV); metformin impairs ileal calcium-dependent B12 absorption.',
      'Temporarily hold metformin on the morning of major surgery or when receiving IV radiopaque contrast until stable eGFR is verified 48h post-procedure.'
    ]
  },
  {
    id: 'drug-pembrolizumab',
    name: 'Pembrolizumab',
    brandNames: ['Keytruda'],
    drugClass: 'Immune Checkpoint Inhibitor (anti-PD-1 Monoclonal Antibody)',
    therapeuticCategory: 'Oncology & Immunotherapy',
    status: 'active',
    statusBadge: 'Approved • Blockbuster Solid Tumor Immunotherapy',
    atcCode: 'L01FF02',
    molecularTarget: 'Programmed Cell Death Protein 1 (PD-1 receptor on T cells)',
    chemicalFormula: 'Humanized IgG4-kappa monoclonal antibody (MW ~149 kDa)',
    mechanismOfAction: 'Selective humanized IgG4 monoclonal antibody that binds to the PD-1 receptor and blocks its interaction with PD-L1 and PD-L2 ligands expressed on tumor cells. Reverses tumor-mediated T-cell exhaustion and reactivates cytotoxic CD8+ T-lymphocyte antitumor immune responses.',
    indications: [
      'Metastatic Non-Small Cell Lung Cancer (NSCLC) with PD-L1 expression TPS ≥ 1%',
      'Advanced or Unresectable Malignant Melanoma',
      'Microsatellite Instability-High (MSI-H) or Mismatch Repair Deficient (dMMR) Solid Tumors',
      'Head and Neck Squamous Cell Carcinoma (HNSCC)',
      'Classical Hodgkin Lymphoma (cHL)',
      'Triple-Negative Breast Cancer (TNBC) in combination with chemotherapy'
    ],
    dosingAndAdministration: {
      adult: '200 mg IV infusion every 3 weeks (over 30 minutes) OR 400 mg IV infusion every 6 weeks until disease progression or unacceptable toxicity (up to 24 months).',
      pediatric: 'MSI-H/dMMR solid tumors or cHL: 2 mg/kg IV (up to 200 mg max) Q3W.',
      geriatric: 'No overall differences in safety or efficacy in elderly patients; no dose reduction required.',
      route: 'Intravenous infusion using a sterile, non-pyrogenic, low-protein-binding 0.2 to 5 micron in-line filter'
    },
    organDoseAdjustments: {
      renal: 'Mild to severe renal impairment: No dose adjustment needed (monoclonal antibodies undergo nonspecific proteolytic catabolism).',
      hepatic: 'Mild to moderate hepatic impairment: No dose adjustment needed. Severe hepatic impairment: Clinical data limited.',
      dialysis: 'Not cleared by hemodialysis due to large molecular weight (~149,000 Da).'
    },
    pharmacokinetics: {
      bioavailability: '100% (IV administration)',
      tmax: 'End of 30-minute IV infusion',
      proteinBinding: 'Not applicable (circulates freely as intact immunoglobulin)',
      metabolism: 'Degraded into small peptides and amino acids by nonspecific catabolic pathways throughout the reticuloendothelial system',
      halfLife: 'Terminal elimination half-life approximately 22 to 26 days',
      elimination: 'Clearance ~0.2 L/day; steady-state achieved after ~16 weeks'
    },
    adverseReactions: {
      common: ['Fatigue (up to 40%)', 'Pruritus and maculopapular rash', 'Musculoskeletal arthralgia', 'Mild nausea and decreased appetite', 'Hypothyroidism or hyperthyroidism (10-15%)'],
      severeOrLifeThreatening: [
        'Immune-Mediated Pneumonitis (potentially fatal interstitial lung infiltrates)',
        'Immune-Mediated Colitis & Intestinal Perforation',
        'Immune-Mediated Hepatitis (AST/ALT > 5x ULN)',
        'Immune-Mediated Endocrinopathies (Adrenal crisis, Hypophysitis, Type 1 Diabetes with DKA)',
        'Immune-Mediated Nephritis & Acute Tubular Interstitial Renal Failure'
      ]
    },
    blackBoxWarnings: [
      'Severe Immune-Mediated Adverse Reactions (imARs): Can occur in any organ system at any time during therapy or months after cessation. Treat immediately with high-dose systemic corticosteroids (Prednisone 1-2 mg/kg/day) and withhold or permanently discontinue Pembrolizumab based on Grade severity.'
    ],
    contraindications: [
      'Severe life-threatening hypersensitivity to pembrolizumab or excipients',
      'Active severe autoimmune disease requiring high-dose systemic immunosuppression (relative)'
    ],
    drugInteractions: {
      cypPathways: 'No direct CYP450 metabolism interactions.',
      majorInteractions: [
        'Baseline Systemic Corticosteroids (>10mg/day prednisone equivalent): Diminishes pharmacodynamic efficacy and anti-tumor T-cell activation; avoid before starting.',
        'Live Vaccines: Avoid during immune checkpoint inhibition due to risk of vaccine-strain infection or exaggerated immune response.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category D',
      briggsRisk: 'High Human Teratogenic & Embryofetal Risk',
      summary: 'Causes fetal harm, abortion, and immune-mediated fetal death. Women of reproductive potential must use effective contraception during treatment and for at least 4 months after final dose.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 2014,
      primaryRegulators: ['US FDA (Accelerated 2014, Full 2015)', 'EMA (2015)', 'Ethiopian EFDA Oncology Formulary'],
      clinicalAdvantageOverStandard: 'Transformed survival in metastatic melanoma and lung cancer from months to multi-year durable remissions (KEYNOTE-001, KEYNOTE-024, KEYNOTE-189 trials).'
    },
    clinicalPharmacistPearls: [
      'Rule of thumb: Any new clinical symptom in a patient on Keytruda (e.g. cough, persistent diarrhea, fatigue, headache, elevated creatinine) is an immune-mediated adverse reaction until proven otherwise.',
      'Check baseline and regular pre-cycle TSH, free T4, liver transaminases, and serum creatinine before every infusion.',
      'Never restart Pembrolizumab in patients who developed Grade 4 immune-mediated toxicities or Grade 3 pneumonitis/myocarditis.'
    ]
  },
  {
    id: 'drug-apixaban',
    name: 'Apixaban',
    brandNames: ['Eliquis'],
    drugClass: 'Direct Oral Anticoagulant (DOAC) / Direct Factor Xa Inhibitor',
    therapeuticCategory: 'Cardiovascular & Hematology',
    status: 'active',
    statusBadge: 'Approved • First-Line Anticoagulant for NVAF & VTE',
    atcCode: 'B01AF02',
    molecularTarget: 'Free and clot-bound Coagulation Factor Xa',
    chemicalFormula: 'C25H25N5O4',
    mechanismOfAction: 'Potent, direct, highly selective, reversible, and competitive inhibitor of both free and clot-bound Factor Xa as well as prothrombinase activity. Does not require antithrombin III for activity. Inhibits conversion of prothrombin (Factor II) to thrombin (Factor IIa), thereby suppressing fibrin clot formation.',
    indications: [
      'Non-valvular Atrial Fibrillation (NVAF) - Prevention of stroke and systemic embolism',
      'Deep Vein Thrombosis (DVT) and Pulmonary Embolism (PE) Treatment',
      'Reduction in the risk of recurrent DVT and PE following initial 6-month therapy',
      'Prophylaxis of DVT/PE in elective total hip or knee replacement surgery'
    ],
    dosingAndAdministration: {
      adult: 'NVAF: 5 mg PO twice daily. Dose-reduce to 2.5 mg PO BID if patient has at least 2 of 3 criteria: Age ≥ 80 yrs, Body weight ≤ 60 kg, or Serum Creatinine ≥ 1.5 mg/dL (133 μmol/L). DVT/PE Acute Treatment: 10 mg PO BID for 7 days, then 5 mg PO BID maintenance. DVT/PE Secondary Extended Prevention: 2.5 mg PO BID.',
      pediatric: 'Safety and efficacy not established in pediatric patients.',
      geriatric: 'Evaluate the 3 dose-reduction criteria (Age ≥ 80, Weight ≤ 60 kg, SCr ≥ 1.5).',
      route: 'Oral with or without food (can be crushed in water, D5W, or apple juice/sauce)'
    },
    organDoseAdjustments: {
      renal: 'NVAF with SCr ≥ 1.5: Apply 2-of-3 dose reduction rule to 2.5mg BID. In ESRD on hemodialysis: 5 mg PO BID (or 2.5mg BID if age ≥ 80 or weight ≤ 60kg per FDA label; caution warranted, nephrology co-management required). Avoid in CrCl < 15 mL/min per European/EFDA guidelines.',
      hepatic: 'Child-Pugh A (Mild): No dose adjustment. Child-Pugh B (Moderate): Use with caution. Child-Pugh C (Severe): Contraindicated due to coagulopathy of liver disease.',
      dialysis: 'Approved in US for hemodialysis patients with NVAF; non-dialyzed clearance is 73% non-renal.'
    },
    pharmacokinetics: {
      bioavailability: 'Approximately 50% for oral doses up to 10 mg',
      tmax: '3 to 4 hours post-dose',
      proteinBinding: '87% bound to human plasma proteins',
      metabolism: 'Primarily metabolized via CYP3A4/5, with minor contributions from CYP1A2, 2C8, 2C9, 2C19, and 2J2. Substrate for P-gp and BCRP.',
      halfLife: 'Approximately 12 hours (range 8 to 15 hours)',
      elimination: '27% renal clearance; 73% eliminated via biliary/fecal excretion and metabolic routes'
    },
    adverseReactions: {
      common: ['Epistaxis (nosebleeds)', 'Gingival bleeding', 'Hematuria', 'Bruising / ecchymosis', 'Anemia'],
      severeOrLifeThreatening: [
        'Major Intracranial Hemorrhage (subdural/epidural/intracerebral)',
        'Gastrointestinal Hemorrhage (significantly lower than Dabigatran and Rivaroxaban)',
        'Epidural or Spinal Hematoma with neuraxial anesthesia'
      ]
    },
    blackBoxWarnings: [
      '1. Premature discontinuation increases the risk of thrombotic events (stroke). If stopped without initiating an alternative anticoagulant, consider coverage with another agent.',
      '2. Spinal/Epidural Hematoma: Patients receiving neuraxial anesthesia or spinal puncture are at risk of developing epidural hematomas that can result in long-term or permanent paralysis.'
    ],
    contraindications: [
      'Active pathological major bleeding (e.g. active peptic ulcer, intracranial bleed)',
      'Severe hypersensitivity to apixaban',
      'Mechanical prosthetic heart valves (contraindicated in all DOACs; RE-ALIGN trial)',
      'Moderate to severe mitral stenosis'
    ],
    drugInteractions: {
      cypPathways: 'Major substrate of CYP3A4 and P-glycoprotein (P-gp).',
      majorInteractions: [
        'Strong Dual CYP3A4 & P-gp Inhibitors (Ketoconazole, Itraconazole, Ritonavir): Increase apixaban exposure by 100%. Reduce dose by 50% (5mg BID -> 2.5mg BID; if already on 2.5mg BID, avoid co-administration).',
        'Strong Dual CYP3A4 & P-gp Inducers (Rifampicin, Carbamazepine, Phenytoin, St. John\'s Wort): Decrease apixaban exposure by 50%; avoid co-administration due to stroke risk.',
        'Antiplatelet Agents (Aspirin, Clopidogrel, Ticagrelor) & NSAIDs: Markedly increase major bleeding risk without additional stroke protection.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category B',
      briggsRisk: 'Contraindicated in Pregnancy / High Bleeding Risk',
      summary: 'May increase maternal bleeding during delivery and crosses the placenta. LMWH (Enoxaparin) remains standard anticoagulant of choice throughout pregnancy.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 2011,
      primaryRegulators: ['EMA (2011)', 'US FDA (2012)', 'Ethiopian EFDA Formulary'],
      clinicalAdvantageOverStandard: 'Superior to Warfarin in reducing stroke and systemic embolism, with a 31% relative risk reduction in major bleeding and a 58% reduction in intracranial hemorrhage (ARISTOTLE trial). Does not require routine INR monitoring.'
    },
    clinicalPharmacistPearls: [
      'Memorize the ABC 2-of-3 criteria for dose reduction: Age ≥ 80 yrs, Body weight ≤ 60 kg, Creatinine ≥ 1.5 mg/dL. If only 1 criteria is met, DO NOT reduce dose (keep 5mg BID).',
      'Specific reversal agent: Andexanet alfa (recombinant modified decoy Factor Xa protein). If unavailable, use 4-Factor Prothrombin Complex Concentrate (4F-PCC) at 50 units/kg.',
      'Hold 48 hours prior to high-bleeding-risk surgery, 24 hours prior to low-risk elective procedures.'
    ]
  },
  {
    id: 'drug-bedaquiline',
    name: 'Bedaquiline Fumarate',
    brandNames: ['Sirturo'],
    drugClass: 'Diarylquinoline Antimycobacterial Agent',
    therapeuticCategory: 'Infectious Diseases & Antimicrobials',
    status: 'active',
    statusBadge: 'Approved • WHO & Ethiopian MoH Core MDR-TB Backbone',
    atcCode: 'J04AK05',
    molecularTarget: 'Mycobacterium tuberculosis ATP synthase subunit c',
    chemicalFormula: 'C32H31BrN2O2',
    mechanismOfAction: 'First-in-class diarylquinoline that specifically targets and inhibits the proton-pumping function of Mycobacterial ATP synthase subunit c (encoded by the atpE gene). Depletes intracellular ATP pools, disrupting cellular energy production and causing selective bactericidal death in both replicating and dormant M. tuberculosis bacilli without inhibiting human mitochondrial ATP synthase.',
    indications: [
      'Multidrug-Resistant Tuberculosis (MDR-TB) and Rifampicin-Resistant Tuberculosis (RR-TB)',
      'Pre-Extensively Drug-Resistant (Pre-XDR-TB) and XDR-TB as part of the 6-month all-oral BPaL / BPaLM regimen (Bedaquiline + Pretomanid + Linezolid ± Moxifloxacin)'
    ],
    dosingAndAdministration: {
      adult: 'Standard 24-week regimen: 400 mg PO once daily for 2 weeks (Weeks 1-2), followed by 200 mg PO three times weekly (Weeks 3-24; at least 48 hours between doses, total weekly dose 600mg). Under modern WHO/Ethiopian 6-month BPaLM regimen: administered daily or thrice-weekly as protocolized.',
      pediatric: 'Approved down to children ≥ 5 years of age (dose adjusted by weight bands).',
      geriatric: 'No dedicated elderly dosage adjustment; baseline and periodic ECG monitoring mandatory.',
      route: 'Oral with water and meals (food increases bioavailability by 2-fold)'
    },
    organDoseAdjustments: {
      renal: 'Mild to moderate renal impairment: No dose adjustment. Severe renal impairment or ESRD: Use with caution; monitor QTc intervals.',
      hepatic: 'Mild to moderate hepatic impairment: No dose adjustment needed. Severe hepatic impairment (Child-Pugh C): Avoid use due to limited safety data and high lipophilic accumulation.',
      dialysis: 'Not significantly removed by hemodialysis due to extreme lipophilicity and 99.9% protein binding.'
    },
    pharmacokinetics: {
      bioavailability: 'Doubled when taken with standard or high-fat meals',
      tmax: 'Approximately 5 hours',
      proteinBinding: '> 99.9% bound to plasma proteins',
      metabolism: 'Hepatic via CYP3A4 to the N-monodesmethyl metabolite (M2), which has 4 to 6 times lower antimycobacterial activity and contributes to QTc prolongation',
      halfLife: 'Terminal elimination half-life approximately 5.5 months (due to slow release from deep peripheral tissue compartments)',
      elimination: 'Predominantly fecal and biliary excretion; renal excretion is < 0.001%'
    },
    adverseReactions: {
      common: ['Nausea and headache', 'Arthralgia and myalgia', 'Elevated hepatic transaminases (AST/ALT)', 'Dizziness and rash'],
      severeOrLifeThreatening: [
        'QTc Interval Prolongation (can exceed 500 ms, leading to Torsades de Pointes)',
        'Unexplained increased mortality risk observed in initial registrational trial C208',
        'Severe drug-induced liver injury (DILI)'
      ]
    },
    blackBoxWarnings: [
      '1. Increased Mortality Risk: A statistically significant increase in all-cause mortality was observed in bedaquiline-treated patients compared to placebo in trial C208 (11.4% vs 2.5%). Use only when an effective treatment regimen cannot otherwise be provided.',
      '2. QTc Prolongation: Can cause life-threatening cardiac electrophysiological prolongation. Baseline and serial ECG monitoring at Weeks 2, 4, 8, 12, and 24 is required.'
    ],
    contraindications: [
      'Hypersensitivity to bedaquiline',
      'Baseline QTc interval > 450 ms in males or > 470 ms in females (relative; weigh risk-benefit in MDR-TB)',
      'Severe cardiac arrhythmias or history of congenital long QT syndrome'
    ],
    drugInteractions: {
      cypPathways: 'Major substrate of CYP3A4.',
      majorInteractions: [
        'Strong CYP3A4 Inducers (Rifampicin, Rifapentine, Efavirenz, Carbamazepine): Reduce bedaquiline AUC by up to 80%; strictly avoid co-administration.',
        'Other QTc-Prolonging Drugs (Clofazimine, Moxifloxacin, Delamanid, Methadone, Haloperidol): Additive synergistic QTc prolongation; weekly ECGs mandatory when combining.',
        'Strong CYP3A4 Inhibitors (Ketoconazole, Lopinavir/ritonavir): Increase bedaquiline exposure and cardiotoxicity.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category B',
      briggsRisk: 'Limited Human Data / Favorable Animal Safety',
      summary: 'WHO recommends continued use in pregnant MDR-TB patients because the benefit of curing maternal drug-resistant tuberculosis substantially outweighs potential fetal risks.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 2012,
      primaryRegulators: ['US FDA (Accelerated 2012)', 'EMA (2014)', 'WHO Prequalification (2014)', 'Ethiopian EFDA Priority Antimycobacterial List'],
      clinicalAdvantageOverStandard: 'First new class of tuberculosis antibiotic approved in over 40 years. Replaced painful 18-month daily injectable aminoglycosides (Kanamycin/Capreomycin) that caused permanent hearing loss in thousands of Ethiopian TB patients.'
    },
    clinicalPharmacistPearls: [
      'Always take with food: Taking on an empty stomach cuts drug absorption in half, risking subtherapeutic levels and acquired drug resistance.',
      'Mandatory electrolyte checks: Maintain potassium > 4.0 mEq/L and magnesium > 2.0 mg/dL to prevent fatal ventricular arrhythmias during QTc prolongation.',
      'Because the elimination half-life is 5.5 months, bedaquiline lingers in tissues for months after completion; never introduce a weak companion drug later that could suffer single-agent resistance.'
    ]
  },

  // ==========================================
  // 2. SUSPENDED, EXPELLED OR BANNED MEDICATIONS
  // ==========================================
  {
    id: 'drug-rofecoxib',
    name: 'Rofecoxib',
    brandNames: ['Vioxx', 'Ceoxx', 'Ceevexx'],
    drugClass: 'Selective Cyclooxygenase-2 (COX-2) Inhibitor NSAID',
    therapeuticCategory: 'Analgesics & Rheumatology',
    status: 'suspended',
    statusBadge: 'EXPELLED / WITHDRAWN GLOBALLY • Fatal CV Thrombosis',
    atcCode: 'M01AH02',
    molecularTarget: 'Cyclooxygenase-2 (COX-2) enzyme active catalytic site',
    chemicalFormula: 'C17H14O4S',
    mechanismOfAction: 'Selective diaryl-substituted furanone inhibitor of COX-2 with >80-fold selectivity over COX-1. Blocks synthesis of prostaglandins responsible for pain, fever, and inflammation while sparing gastric cytoprotective COX-1 prostaglandins.',
    indications: [
      'HISTORICAL: Osteoarthritis, Rheumatoid Arthritis, Acute Pain, Primary Dysmenorrhea (Withdrawn from market)'
    ],
    dosingAndAdministration: {
      adult: 'Historical: 12.5 mg to 25 mg PO once daily (up to 50 mg for acute pain).',
      route: 'Oral (NOW BANNED & WITHDRAWN GLOBALLY)'
    },
    organDoseAdjustments: {
      renal: 'Contraindicated in advanced renal disease.',
      hepatic: 'Moderate impairment: 12.5mg daily max.',
      dialysis: 'Not dialyzable.'
    },
    pharmacokinetics: {
      bioavailability: '93%',
      tmax: '2 to 3 hours',
      proteinBinding: '87%',
      metabolism: 'Hepatic cytosolic reduction to cis- and trans-dihydro rofecoxib; minor CYP oxidative metabolism',
      halfLife: '17 hours (permitted once-daily dosing)',
      elimination: '72% renal as metabolites, 14% feces'
    },
    adverseReactions: {
      common: ['Peripheral edema', 'Hypertension exacerbation', 'Upper GI dyspepsia', 'Dizziness'],
      severeOrLifeThreatening: [
        'Acute Myocardial Infarction (Fatal coronary thrombosis)',
        'Ischemic Stroke / Cerebrovascular Accident',
        'Sudden Cardiac Death',
        'Congestive Heart Failure Exacerbation',
        'Severe Renovascular Hypertension'
      ]
    },
    blackBoxWarnings: [
      'GLOBAL MARKET WITHDRAWAL: September 30, 2004. Voluntary worldwide recall initiated by Merck following interim data from the APPROVe trial confirming double the risk of confirmed cardiovascular events (myocardial infarction and stroke) after 18 months of continuous use.'
    ],
    contraindications: [
      'WITHDRAWN FROM HUMAN USE WORLDWIDE',
      'Established ischemic heart disease, peripheral arterial disease, or cerebrovascular disease'
    ],
    drugInteractions: {
      cypPathways: 'Weak inhibitor of CYP1A2; increases theophylline concentrations.',
      majorInteractions: [
        'Aspirin: Co-administration negates GI safety benefits while failing to eliminate the cardiovascular thrombotic hazard.',
        'ACE Inhibitors / ARBs: Antagonizes antihypertensive action and precipitates acute renal failure.',
        'Warfarin: Increases INR by 10-15% through competitive albumin binding and clearance.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category D',
      briggsRisk: 'Contraindicated in 3rd Trimester (Premature closure of ductus arteriosus)',
      summary: 'Withdrawn from market.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 1999,
      yearWithdrawnOrSuspended: 2004,
      primaryRegulators: ['US FDA (Approved 1999, Withdrawn 2004)', 'EMA (Withdrawn 2004)', 'Global Recall & Ethiopian EFDA Ban'],
      toxicologicalRootCause: 'Prostanoid Imbalance Hypothesis (FitzGerald Hypothesis): Rofecoxib selectively suppressed endothelial COX-2-derived Prostacyclin (PGI2), a potent vasodilator and inhibitor of platelet aggregation, while failing to inhibit platelet COX-1-derived Thromboxane A2 (TXA2), a potent platelet aggregator and vasoconstrictor. This unopposed TXA2 production induced high vascular shear stress, platelet hyper-reactivity, and acute arterial thrombotic occlusions.',
      pivotalSafetyTrials: 'APPROVe Trial (Adenomatous Polyp Prevention on VIOXX): 2,586 patients randomized to rofecoxib 25mg vs placebo. Relative risk of adjudicated serious thrombotic event was 1.92 (p=0.008) starting after 18 months of treatment. FDA epidemiological model estimated 88,000 to 140,000 excess cases of serious coronary heart disease in the United States alone during its 5 years on market.',
      saferAlternatives: ['Celecoxib (lower COX-2 selectivity, lowest effective dose)', 'Naproxen 500mg BID + Proton Pump Inhibitor (Naproxen has near-complete platelet COX-1 inhibition mimicking aspirin)', 'Paracetamol', 'Topical NSAIDs (Diclofenac gel)']
    },
    clinicalPharmacistPearls: [
      'The Vioxx recall reshaped modern clinical pharmacy and medicine: it proved that surrogate endpoints (e.g. fewer endoscopic ulcers) do not guarantee true clinical safety if cardiovascular hard endpoints are ignored.',
      'Clinical lesson: All systemic NSAIDs carry cardiovascular risk to varying degrees, but COX-2 selectivity without platelet inhibition creates the highest thrombotic risk profile.',
      'Always co-prescribe a PPI with traditional non-selective NSAIDs (like Naproxen) in patients with elevated GI risk rather than using high-dose selective COX-2 inhibitors in cardiac patients.'
    ]
  },
  {
    id: 'drug-thalidomide',
    name: 'Thalidomide',
    brandNames: ['Contergan (Historical)', 'Thalomid (Modern Oncology)'],
    drugClass: 'Immunomodulatory Imide Drug (IMiD) / Historical Sedative',
    therapeuticCategory: 'Oncology & Immunotherapy',
    status: 'suspended',
    statusBadge: 'HISTORIC BAN & RESTRICTED REMS • Catastrophic Teratogen',
    atcCode: 'L04AX02',
    molecularTarget: 'Cereblon (CRBN) E3 ubiquitin ligase complex substrate receptor',
    chemicalFormula: 'C13H10N2O4',
    mechanismOfAction: 'Binds directly to Cereblon (CRBN), the primary substrate recognition component of the cullin-RING E3 ubiquitin ligase complex. This alters CRBN binding specificity, inducing the rapid ubiquitination and proteasomal degradation of transcription factors Ikaros (IKZF1) and Aiolos (IKZF3). In multiple myeloma, this suppresses IRF4 and MYC, arresting tumor proliferation. In embryos, it degrades neo-substrates (such as p63 isoforms and SALL4), causing extensive disruption of limb bud angiogenesis, apoptosis of sensory ganglia, and catastrophic limb truncation.',
    indications: [
      'HISTORICAL (1957-1961): Sedative, Hypnotic, Morning Sickness in pregnancy (EXPELLED & BANNED)',
      'MODERN STRICT RESTRICTION (REMS): Multiple Myeloma (in combination with dexamethasone)',
      'MODERN STRICT RESTRICTION: Erythema Nodosum Leprosum (ENL) in Leprosy (ALERT Hospital Ethiopia protocol)'
    ],
    dosingAndAdministration: {
      adult: 'Multiple Myeloma: 200 mg PO once daily at bedtime. Erythema Nodosum Leprosum: 100 to 300 mg PO daily until symptom resolution, then tapered.',
      route: 'Oral with water at bedtime (causes sedation). STRICTLY CONTROLLED UNDER STEPS / REMS REGISTRY.'
    },
    organDoseAdjustments: {
      renal: 'No dose adjustment required for renal impairment or hemodialysis (undergoes non-enzymatic spontaneous hydrolysis).',
      hepatic: 'No dedicated hepatic adjustment.',
      dialysis: 'Not significantly dialyzable.'
    },
    pharmacokinetics: {
      bioavailability: 'Slowly and erratically absorbed (approx 90%)',
      tmax: '2.5 to 6 hours',
      proteinBinding: '55% to 66% (both R- and S-enantiomers; undergoes spontaneous in vivo interconversion/racemization)',
      metabolism: 'Does not undergo significant hepatic CYP metabolism; spontaneously hydrolyzes in plasma to multiple ring-opened cleavage products',
      halfLife: '5 to 7 hours',
      elimination: 'Less than 1% excreted unchanged in urine; excreted mainly as hydrolytic cleavage fragments'
    },
    adverseReactions: {
      common: ['Severe somnolence and sedation', 'Constipation', 'Peripheral neuropathy (bilateral symmetrical sensory axonal neuropathy)', 'Dizziness and tremor', 'Neutropenia'],
      severeOrLifeThreatening: [
        'Phocomelia & Severe Embryofetal Malformations (Seal-like flipper limbs, amelia, microtia, anoftalmia, congenital heart septal defects)',
        'Venous Thromboembolism (Deep Vein Thrombosis & Fatal Pulmonary Embolism - high risk with Dexamethasone)',
        'Irreversible Symmetrical Peripheral Sensory Neuropathy'
      ]
    },
    blackBoxWarnings: [
      '1. SEVERE LIFE-THREATENING HUMAN BIRTH DEFECTS: Even a single 50 mg capsule taken by a pregnant woman during the critical embryonic window (Days 20 to 36 post-conception) causes devastating birth defects or intrauterine fetal demise.',
      '2. VENOUS THROMBOEMBOLISM: Significantly increased risk of DVT and PE when combined with dexamethasone; mandatory thromboprophylaxis (Aspirin or LMWH) required.',
      '3. STRICT REMS PROGRAM: Dispensing prohibited except through certified prescribers and pharmacies under the S.T.E.P.S. (System for Thalidomide Education and Prescribing Safety) program.'
    ],
    contraindications: [
      'Pregnancy or women of childbearing potential not using dual contraception',
      'Known hypersensitivity to thalidomide',
      'Severe peripheral neuropathy'
    ],
    drugInteractions: {
      cypPathways: 'No significant CYP450 interactions.',
      majorInteractions: [
        'CNS Depressants & Alcohol: Profound additive sedation and cognitive impairment.',
        'Dexamethasone / Chemotherapy: Multiplies venous thromboembolic risk 4-fold; prophylaxis mandatory.',
        'Neurotoxic Drugs (Vincristine, Bortezomib): Additive irreversible peripheral nerve damage.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category X',
      briggsRisk: 'Absolute Human Teratogen - Strictly Prohibited',
      summary: 'Catastrophic teratogen. Two independent negative pregnancy tests required before therapy; weekly pregnancy testing during the first month, then monthly thereafter.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 1957,
      yearWithdrawnOrSuspended: 1961,
      primaryRegulators: ['Chemie Grünenthal (Germany, 1957)', 'Banned Globally (1961-1962)', 'US FDA Reviewer Dr. Frances Kelsey famously refused US approval in 1960 citing lack of peripheral neuropathy and fetal safety data', 'Re-approved under REMS for Myeloma (1998)'],
      toxicologicalRootCause: 'Identification of Cereblon (CRBN) as the direct receptor: Binding of the glutarimide ring of thalidomide to the tri-tryptophan hydrophobic pocket of cereblon recruits the developmental zinc-finger transcription factor SALL4 for aberrant polyubiquitination and proteasomal degradation. SALL4 is essential for embryonic limb patterning and otic vesicle development; its degradation between Days 20-36 post-fertilization halts limb bud outgrowth, causing phocomelia and multi-organ agenesis.',
      pivotalSafetyTrials: 'Historic epidemiological investigations by Dr. Widukind Lenz (Germany) and Dr. William McBride (Australia) in 1961 linked maternal ingestion between gestation days 35-50 to over 10,000 infants born with phocomelia and amelia. Led directly to the Kefauver-Harris Drug Amendments of 1962 requiring proof of efficacy and stringent preclinical teratogenicity screening prior to human marketing.',
      saferAlternatives: ['For Myeloma: Lenalidomide (Revlimid), Pomalidomide (Pomalyst) - more potent, less neurotoxic, but still teratogenic', 'For Leprosy ENL: Corticosteroids, Clofazimine, Methotrexate']
    },
    clinicalPharmacistPearls: [
      'The single most impactful disaster in pharmacological history: it transformed drug safety from a reactive recall system to proactive, rigorous clinical trial mandates and pharmacovigilance.',
      'S-enantiomer vs R-enantiomer myth: Although the S-enantiomer was initially thought to be the teratogen and R the sedative, racemization occurs rapidly in human blood (half-life of chiral inversion ~4 hours); purified enantiomers CANNOT prevent teratogenicity.',
      'Mandatory thromboprophylaxis: In all multiple myeloma patients on thalidomide + dexamethasone, prescribe aspirin 81-325mg (low risk) or Enoxaparin 40mg SC daily (high risk).'
    ]
  },
  {
    id: 'drug-ranitidine',
    name: 'Ranitidine Hydrochloride',
    brandNames: ['Zantac', 'Zantac 75', 'Zantac 150', 'Ranitin'],
    drugClass: 'Histamine H2-Receptor Antagonist',
    therapeuticCategory: 'Gastroenterology & Hepatology',
    status: 'suspended',
    statusBadge: 'SUSPENDED / EXPELLED GLOBALLY • NDMA Carcinogen Impurity',
    atcCode: 'A02BA02',
    molecularTarget: 'Histamine H2 receptors on gastric parietal cells',
    chemicalFormula: 'C13H22N4O3S',
    mechanismOfAction: 'Competitive, reversible inhibitor of histamine at H2 receptors on the basolateral membrane of gastric parietal cells. Inhibits both basal and nocturnal gastric acid secretion, as well as acid stimulated by food, betazole, and pentagastrin. Decreases total gastric juice volume and hydrogen ion concentration.',
    indications: [
      'HISTORICAL: Duodenal and Gastric Ulcers, GERD, Erosive Esophagitis, Zollinger-Ellison Syndrome (SUSPENDED FROM HUMAN SALE)'
    ],
    dosingAndAdministration: {
      adult: 'Historical: 150 mg PO BID or 300 mg at bedtime. (NOW BANNED & WITHDRAWN GLOBALLY).',
      route: 'Oral / IV (REMOVED FROM COMMERCE)'
    },
    organDoseAdjustments: {
      renal: 'Historical: CrCl < 50 mL/min required 50% dose reduction.',
      hepatic: 'No historical adjustment.',
      dialysis: 'Removed by hemodialysis.'
    },
    pharmacokinetics: {
      bioavailability: '50% (significant first-pass metabolism)',
      tmax: '1 to 3 hours',
      proteinBinding: '15%',
      metabolism: 'Hepatic metabolism to ranitidine N-oxide, S-oxide, and N-desmethylranitidine',
      halfLife: '2.5 to 3 hours',
      elimination: '70% excreted in urine (35% as unchanged drug)'
    },
    adverseReactions: {
      common: ['Headache', 'Constipation or diarrhea', 'Dizziness', 'Transient transaminitis'],
      severeOrLifeThreatening: [
        'Long-term Carcinogenicity Risk due to accumulated N-Nitrosodimethylamine (NDMA) ingestion',
        'Thrombocytopenia and leukopenia (rare)',
        'Bradycardia and AV block with rapid IV push'
      ]
    },
    blackBoxWarnings: [
      'GLOBAL MARKET WITHDRAWAL (April 1, 2020): US FDA, European Medicines Agency (EMA), and Ethiopian EFDA requested the immediate market withdrawal of all prescription and over-the-counter (OTC) ranitidine products due to laboratory testing confirming that NDMA levels increase over time and at room temperature to unacceptable carcinogenic levels.'
    ],
    contraindications: [
      'WITHDRAWN FROM HUMAN USE',
      'Known hypersensitivity to ranitidine'
    ],
    drugInteractions: {
      cypPathways: 'Weak binding to CYP450 (far less than Cimetidine; does not significantly inhibit CYP1A2 or 2C9).',
      majorInteractions: [
        'Gastric pH Dependent Drugs (Ketoconazole, Itraconazole, Atazanavir): Decreased dissolution and oral bioavailability due to elevated gastric pH.',
        'Procainamide: Competes for renal tubular secretion, increasing procainamide serum concentrations.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category B',
      briggsRisk: 'Withdrawn from commerce',
      summary: 'Withdrawn globally due to NDMA genotoxicity and carcinogenicity.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 1981,
      yearWithdrawnOrSuspended: 2020,
      primaryRegulators: ['UK MHRA (1981)', 'US FDA (1983)', 'Global Voluntary Suspension (2019)', 'Mandatory US FDA & EMA Removal (April 2020)', 'Ethiopian EFDA Circular Alert Ban (2020)'],
      toxicologicalRootCause: 'Molecular Degradation Impurity: Ranitidine contains both a dimethylamine (DMA) moiety and a nitro moiety in its chemical structure. Under storage conditions—accelerated by humidity, room temperature, and passage of time—the molecule undergoes intrinsic self-cleavage and nitrosation, generating N-nitrosodimethylamine (NDMA). NDMA is classified by the WHO International Agency for Research on Cancer (IARC) as a Group 2A probable human carcinogen (hepatocellular carcinoma, gastric and colorectal cancers).',
      pivotalSafetyTrials: 'FDA Public Health Testing (2019-2020): Independent testing by Valisure laboratory and subsequent FDA mass spectrometry demonstrated NDMA levels exceeding the acceptable daily intake limit of 96 nanograms (0.32 ppm) by dozens of times, continuing to rise steadily during standard pharmacy shelf storage.',
      saferAlternatives: [
        'Famotidine (Pepcid) 20-40mg PO daily/BID (does not contain the DMA moiety and does not form NDMA)',
        'Omeprazole 20mg PO daily',
        'Pantoprazole 40mg PO daily',
        'Esomeprazole 20-40mg PO daily'
      ]
    },
    clinicalPharmacistPearls: [
      'Crucial distinction: Ranitidine was not banned because of an inherent toxic adverse effect of H2-blockade, but because of chemical instability generating an environmental carcinogen (NDMA) during shelf storage.',
      'Famotidine is completely safe and free from NDMA formation because its molecular backbone lacks the vulnerable tertiary dimethylamine group.',
      'When patients ask about Zantac on modern shelves: in many countries, manufacturers reformulated "Zantac 360" to contain Famotidine instead of Ranitidine.'
    ]
  },
  {
    id: 'drug-cisapride',
    name: 'Cisapride',
    brandNames: ['Propulsid', 'Prepulsid', 'Alimix'],
    drugClass: '5-HT4 Receptor Agonist Gastrointestinal Prokinetic',
    therapeuticCategory: 'Gastroenterology & Hepatology',
    status: 'suspended',
    statusBadge: 'EXPELLED / WITHDRAWN • Fatal Torsades de Pointes',
    atcCode: 'A03FA02',
    molecularTarget: 'Serotonin 5-HT4 receptor and hERG cardiac potassium channel',
    chemicalFormula: 'C23H29ClFN3O4',
    mechanismOfAction: 'Selective 5-HT4 receptor agonist that stimulates intrinsic postganglionic cholinergic acetylcholine release in the myenteric plexus of the gut wall. Increases lower esophageal sphincter (LES) tone, accelerates gastric emptying, and coordinates antroduodenal motility. Off-target mechanism: potently blocks the human Ether-a-go-go-Related Gene (hERG) / IKr cardiac potassium channel, prolonging ventricular repolarization.',
    indications: [
      'HISTORICAL: Severe Gastroesophageal Reflux Disease (GERD) refractory to other therapies, Gastroparesis (EXPELLED)'
    ],
    dosingAndAdministration: {
      adult: 'Historical: 10 mg to 20 mg PO TID or QID 15 minutes before meals and at bedtime.',
      route: 'Oral (NOW EXPELLED FROM MARKET)'
    },
    organDoseAdjustments: {
      renal: 'Historical: 50% dose reduction.',
      hepatic: 'Historical: 50% dose reduction.',
      dialysis: 'Not dialyzable.'
    },
    pharmacokinetics: {
      bioavailability: '35% to 40% (extensive first-pass metabolism)',
      tmax: '1 to 1.5 hours',
      proteinBinding: '97.5% bound to plasma proteins (mainly albumin)',
      metabolism: 'Extensively metabolized by cytochrome P450 CYP3A4 to norcisapride',
      halfLife: '7 to 10 hours',
      elimination: 'Excreted equally in urine (as metabolites) and feces'
    },
    adverseReactions: {
      common: ['Diarrhea and abdominal cramping', 'Headache', 'Borborygmi'],
      severeOrLifeThreatening: [
        'Severe QTc Prolongation (> 500 ms)',
        'Torsades de Pointes (Polymorphic Ventricular Tachycardia)',
        'Ventricular Fibrillation and Sudden Cardiac Arrest'
      ]
    },
    blackBoxWarnings: [
      'EXPELLED FROM MARKET (July 2000): Following over 341 reported cases of cardiac arrhythmias and over 80 confirmed patient deaths from Torsades de Pointes and ventricular fibrillation, Cisapride was withdrawn from retail pharmacy distribution worldwide.'
    ],
    contraindications: [
      'BANNED FROM GENERAL USE',
      'Concomitant use of CYP3A4 inhibitors (Clarithromycin, Erythromycin, Ketoconazole, Itraconazole, Fluconazole, Ritonavir)',
      'History of prolonged QT interval, ventricular arrhythmias, or hypokalemia/hypomagnesemia'
    ],
    drugInteractions: {
      cypPathways: 'Exclusive substrate of CYP3A4.',
      majorInteractions: [
        'Macrolides & Azole Antifungals: Inhibit cisapride metabolism, causing plasma concentrations to skyrocket 8-fold and directly triggering lethal Torsades de Pointes.',
        'Diuretics: Induce hypokalemia/hypomagnesemia, predisposing myocytes to early afterdepolarizations.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category C',
      briggsRisk: 'Withdrawn from market',
      summary: 'Withdrawn from commercial distribution.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 1993,
      yearWithdrawnOrSuspended: 2000,
      primaryRegulators: ['Janssen Pharmaceutica', 'US FDA (Withdrawn 2000)', 'EMA (Withdrawn 2000)', 'Global Suspension'],
      toxicologicalRootCause: 'Off-Target hERG Channel Toxicity: Cisapride binds with nanomolar affinity to the pore-forming subunit of the hERG (KCNH2) voltage-gated potassium channel, blocking the rapid delayed rectifier potassium current (IKr). This delays cardiac ventricular repolarization, producing prominent prolongation of the QT interval on surface ECG. When combined with commonly prescribed CYP3A4 inhibitors (such as Erythromycin or Ketoconazole), cisapride accumulates to toxic levels, triggering early afterdepolarizations, Torsades de Pointes, and sudden death.',
      pivotalSafetyTrials: 'Post-Marketing Pharmacovigilance (MedWatch 1993-2000): 341 documented cases of serious cardiac arrhythmias including 80 fatalities, leading the FDA to mandate preclinical hERG screening (ICH S7B guidelines) for all subsequent new drug development.',
      saferAlternatives: ['Metoclopramide 5-10mg PO TID (carries tardive dyskinesia risk, but less cardiac arrhythmia risk)', 'Domperidone (does not cross blood-brain barrier; still requires QTc checks)', 'Erythromycin oral (motilin agonist in short pulses)']
    },
    clinicalPharmacistPearls: [
      'The Cisapride tragedy led directly to modern ICH S7B international guidelines: today, EVERY new small-molecule drug candidate must be screened for hERG potassium channel affinity before entering human clinical trials.',
      'Classic drug interaction death: taking cisapride with an antibiotic like erythromycin or an antifungal like fluconazole was fatal because of metabolic inhibition multiplying an already dangerous hERG blocker.',
      'Clinical vigilance rule: Always check for QTc prolongation whenever combining prokinetics, antiemetics, or psychotropics.'
    ]
  },

  // ==========================================
  // 3. UNDER DEVELOPMENT & PIPELINE DRUGS
  // ==========================================
  {
    id: 'drug-retatrutide',
    name: 'Retatrutide',
    brandNames: ['LY3437943 (Investigational Phase 3)', 'Eli Lilly Tri-Agonist'],
    drugClass: 'GIP / GLP-1 / Glucagon Receptor Triple Agonist',
    therapeuticCategory: 'Endocrinology & Metabolism',
    status: 'pipeline',
    statusBadge: 'PIPELINE • Phase 3 TRIUMPH Program',
    atcCode: 'A10BX (Assigned class: other blood glucose lowering drugs)',
    molecularTarget: 'Human GIP, GLP-1, and Glucagon (GCG) receptors',
    chemicalFormula: '39-amino-acid peptide with C20 fatty diacid moiety (MW ~4,731 Da)',
    mechanismOfAction: 'Single peptide engineered with balanced triple agonist activity against Glucose-dependent Insulinotropic Polypeptide (GIP), Glucagon-Like Peptide-1 (GLP-1), and Glucagon receptors. Glucagon agonism stimulates hepatic fatty acid oxidation, enhances thermogenesis, and increases whole-body resting energy expenditure. GIP and GLP-1 agonism potently suppress hunger, delay gastric emptying, and stimulate glucose-dependent insulin secretion while preventing glucagon-induced hyperglycemia.',
    indications: [
      'INVESTIGATIONAL: Chronic Weight Management in Obese & Overweight Adults (Phase 3)',
      'INVESTIGATIONAL: Type 2 Diabetes Mellitus with Obesity',
      'INVESTIGATIONAL: Metabolic Dysfunction-Associated Steatohepatitis (MASH / NASH) & Hepatic Fibrosis',
      'INVESTIGATIONAL: Obstructive Sleep Apnea and Knee Osteoarthritis in Obesity'
    ],
    dosingAndAdministration: {
      adult: 'Investigational Phase 3 Trial Protocol: Subcutaneous injection once weekly. Initiated at 2 mg or 4 mg weekly with gradual dose titration every 4 weeks through 4 mg, 8 mg, up to target maximum 12 mg SC once weekly.',
      route: 'Subcutaneous injection once weekly in abdomen, thigh, or upper arm'
    },
    organDoseAdjustments: {
      renal: 'Phase 3 trials currently evaluating eGFR down to 30 mL/min; preliminary data suggest no major dose adjustment.',
      hepatic: 'Remarkable preliminary Phase 2 data showing up to 86% relative reduction in hepatic liver fat content in MASH patients.',
      dialysis: 'Under clinical evaluation.'
    },
    pharmacokinetics: {
      bioavailability: 'High subcutaneous bioavailability; extended release facilitated by C20 fatty diacid albumin binding',
      tmax: '24 to 48 hours post-subcutaneous injection',
      proteinBinding: '> 99% bound to plasma albumin via lipid moiety',
      metabolism: 'Proteolytic degradation into smaller peptide fragments by ubiquitous endopeptidases',
      halfLife: 'Approximately 6 days (permits convenient once-weekly dosing)',
      elimination: 'Catabolized and excreted via renal and non-renal peptide clearance pathways'
    },
    adverseReactions: {
      common: ['Nausea (dose-dependent, transient during titration)', 'Diarrhea and vomiting', 'Constipation', 'Decreased appetite', 'Mild transient resting heart rate increase (2-4 bpm due to glucagon receptor activation)'],
      severeOrLifeThreatening: [
        'Potential risk of pancreatitis (class effect monitoring)',
        'Cardiac arrhythmia / sustained resting tachycardia monitoring in ongoing Phase 3'
      ]
    },
    blackBoxWarnings: [
      'Investigational Agent. Projected class black box warning: Risk of Thyroid C-cell Tumors (observed in rodent models for all long-acting incretin receptor agonists; contraindicated in patients with Personal or Family History of Medullary Thyroid Carcinoma or MEN 2).'
    ],
    contraindications: [
      'Personal or family history of Medullary Thyroid Carcinoma (MTC)',
      'Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)',
      'Known hypersensitivity to retatrutide'
    ],
    drugInteractions: {
      cypPathways: 'No direct CYP450 metabolism. Delays gastric emptying.',
      majorInteractions: [
        'Oral Medications with Narrow Therapeutic Index (Warfarin, Digoxin, Levothyroxine): Delayed gastric emptying may alter rate of absorption; clinical monitoring advised during upward dose titration.',
        'Insulin & Sulfonylureas: May require dose reduction of concomitant secretagogues to prevent hypoglycemia.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Investigational / Not Approved',
      briggsRisk: 'Unsafe in Pregnancy (Weight loss contraindicated)',
      summary: 'Weight loss offers no potential benefit to pregnant women and may cause fetal harm. Must be discontinued at least 2 months prior to a planned pregnancy.'
    },
    marketLifecycleDetails: {
      clinicalTrialPhase: 'Phase 3',
      leadSponsor: 'Eli Lilly and Company',
      expectedApprovalYear: '2026 - 2027',
      primaryRegulators: ['US FDA (Fast Track Designation for Obesity)', 'EMA', 'Ongoing Global Multi-Center Trials (TRIUMPH-1, TRIUMPH-2, TRIUMPH-3)'],
      pivotalTrialEndpoints: 'Phase 2 NEJM Publication (Jastreboff et al., 2023): At 48 weeks, retatrutide 12 mg weekly produced a mean weight reduction of 24.2% (approx 26.2 kg / 58 lbs), with 100% of patients on 12mg losing ≥5% body weight, and over 26% of patients losing ≥30% of their total body weight—surpassing all existing single- and dual-agonist pharmacotherapies (Semaglutide 15%, Tirzepatide 21%).',
      clinicalAdvantageOverStandard: 'First triple receptor agonist. By incorporating the Glucagon receptor alongside GIP and GLP-1, it boosts resting caloric expenditure and clears hepatic steatosis while preserving lean muscle mass far more effectively than GLP-1 monotherapy.'
    },
    clinicalPharmacistPearls: [
      'Nicknamed the "Triple G" drug (GIP / GLP-1 / Glucagon). Expected to be the most potent medical weight-loss therapy ever developed, approaching surgical bariatric results.',
      'Glucagon activation causes a slight increase in resting heart rate (~2-4 bpm); watch for cardiac rhythm safety in the TRIUMPH Phase 3 cardiovascular outcome trial.',
      'Phase 2 hepatology data showed that >85% of patients with non-alcoholic fatty liver disease (NAFLD/MASH) experienced complete normalization of liver fat (<5% hepatic fat fraction on MRI-PDFF).'
    ]
  },
  {
    id: 'drug-lenacapavir',
    name: 'Lenacapavir',
    brandNames: ['Sunlenca', 'GS-6207'],
    drugClass: 'First-in-Class HIV-1 Capsid Inhibitor',
    therapeuticCategory: 'Infectious Diseases & Antimicrobials',
    status: 'pipeline',
    statusBadge: 'PIPELINE BREAKTHROUGH • 6-Month Subcutaneous PrEP',
    atcCode: 'J05AX31',
    molecularTarget: 'HIV-1 Capsid Protein (p24 hexamer interface)',
    chemicalFormula: 'C39H32ClF7N8O5S2',
    mechanismOfAction: 'First-in-class, multi-stage, picomolar-potency capsid inhibitor. Directly binds to the hydrophobic interface between adjacent capsid protein (CA) subunits in the hexameric lattice. Multistage mechanism: 1) Inhibits capsid-dependent nuclear import of HIV-1 pre-integration proviral DNA; 2) Disrupts proper viral capsid core disassembly; 3) Prevents correct CA lattice assembly during virion maturation, producing morphologically deformed non-infectious viral progeny.',
    indications: [
      'APPROVED: Heavily Treatment-Experienced (HTE) Adults with Multidrug-Resistant HIV-1 (in combination with other antiretrovirals)',
      'INVESTIGATIONAL BREAKTHROUGH (Phase 3): Pre-Exposure Prophylaxis (PrEP) via Twice-Yearly Subcutaneous Injection (PURPOSE 1 & PURPOSE 2 Trials)'
    ],
    dosingAndAdministration: {
      adult: 'Approved HTE Regimen: Day 1: 927 mg SC injection + 600 mg PO; Day 2: 600 mg PO; then Maintenance: 927 mg SC (two 1.5 mL injections) administered once every 6 months (26 weeks). Investigational PrEP: 927 mg SC once every 6 months without daily pills.',
      route: 'Subcutaneous injection into the abdomen (administered by a healthcare professional)'
    },
    organDoseAdjustments: {
      renal: 'Mild to severe renal impairment (CrCl ≥ 15 mL/min): No dose adjustment. ESRD (CrCl < 15 mL/min): Use with caution; not studied in dialysis.',
      hepatic: 'Mild to moderate hepatic impairment (Child-Pugh A or B): No dose adjustment. Severe hepatic impairment (Child-Pugh C): Not studied.',
      dialysis: 'Not significantly cleared by hemodialysis due to >98.5% protein binding.'
    },
    pharmacokinetics: {
      bioavailability: 'Slow, sustained release from subcutaneous depot over 6 months',
      tmax: 'Subcutaneous depot release peaks slowly over 75 to 84 days',
      proteinBinding: '> 98.5% bound to plasma proteins',
      metabolism: 'Hepatic metabolism via CYP3A4 oxidation and UGT1A1 glucuronidation',
      halfLife: 'Terminal subcutaneous elimination half-life is 8 to 12 WEEKS (permitting semi-annual 6-month dosing)',
      elimination: '76% excreted in feces (primarily unchanged parent drug), < 1% in urine'
    },
    adverseReactions: {
      common: ['Injection site reactions (nodules, induration, erythema, pain - 65%)', 'Nausea', 'Headache'],
      severeOrLifeThreatening: [
        'Persistent Subcutaneous Injection Site Nodules (can persist for several months due to microcrystalline depot)',
        'Immune Reconstitution Inflammatory Syndrome (IRIS) when initiating in advanced HIV'
      ]
    },
    blackBoxWarnings: [
      'Injection Site Reactions & Resistance in PrEP: Prior to initiating Lenacapavir for PrEP, individuals must be confirmed HIV-negative. Administering single-agent PrEP to an individual with undiagnosed acute HIV infection can rapidly select for capsid inhibitor resistance mutations (e.g. M66I, Q67H).'
    ],
    contraindications: [
      'Concomitant administration with strong CYP3A inducers (Rifampicin, Carbamazepine, Phenytoin, St. John\'s Wort) which severely reduces lenacapavir exposure.',
      'Known hypersensitivity to lenacapavir'
    ],
    drugInteractions: {
      cypPathways: 'Moderate inhibitor of CYP3A4; substrate of CYP3A4, P-gp, and UGT1A1.',
      majorInteractions: [
        'Strong CYP3A Inducers (Rifampicin): Decreases lenacapavir concentrations by >85%; co-administration is strictly contraindicated.',
        'Oral Contraceptives & Statins: Lenacapavir is a moderate CYP3A4 inhibitor; monitor Midazolam, Simvastatin, or direct oral anticoagulants.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Investigational in PrEP / Limited Human Data',
      briggsRisk: 'Antiretroviral Registry Monitoring',
      summary: 'Ongoing Antiretroviral Pregnancy Registry surveillance. Animal reproduction studies showed no drug-related embryofetal harm.'
    },
    marketLifecycleDetails: {
      clinicalTrialPhase: 'Pre-Registration (NDA / BLA)',
      leadSponsor: 'Gilead Sciences',
      expectedApprovalYear: '2025 (Global PrEP Rollout & Subsidized Access Plans)',
      primaryRegulators: ['US FDA (Approved for HTE Dec 2022; Breakthrough Therapy Designation for PrEP 2024)', 'EMA (2022)', 'WHO HIV Guidelines Panel'],
      pivotalTrialEndpoints: 'PURPOSE 1 Trial (NEJM, Bekker et al., 2024): Evaluated 5,300 adolescent girls and young women in South Africa and Uganda. Lenacapavir twice-yearly injection showed 100% EFFICACY (ZERO HIV infections observed, incidence 0.00 per 100 person-years), demonstrating statistically superior efficacy over daily oral Truvada (F/TDF). PURPOSE 2 confirmed 96% reduction in cisgender men, transgender women, and gender non-binary individuals.',
      clinicalAdvantageOverStandard: 'Overcomes the catastrophic failure point of daily oral PrEP (patient non-adherence and pill fatigue). A single clinic visit every 6 months provides near-total protection against HIV acquisition.'
    },
    clinicalPharmacistPearls: [
      'The biggest breakthrough in HIV prevention since the discovery of combination antiretroviral therapy: twice-yearly subcutaneous injection completely removes daily adherence stigma.',
      'Advise patients that small painless subcutaneous nodules at the injection site are completely expected; they represent the microcrystalline slow-release depot dissolving gradually over 6 months.',
      'Gilead signed royalty-free voluntary licensing agreements in late 2024 with generic manufacturers to provide lenacapavir at low cost in 120 high-incidence resource-limited countries including Ethiopia.'
    ]
  },
  {
    id: 'drug-gepotidacin',
    name: 'Gepotidacin',
    brandNames: ['GSK2140944 (Phase 3)', 'Proposed: Blenrep-Class Novel Triazaacenaphthylene'],
    drugClass: 'First-in-Class Triazaacenaphthylene Bacterial Topoisomerase Inhibitor',
    therapeuticCategory: 'Infectious Diseases & Antimicrobials',
    status: 'pipeline',
    statusBadge: 'PIPELINE • Novel Antibiotic for Resistant UTI & Gonorrhea',
    atcCode: 'J01XX (Other antibacterials)',
    molecularTarget: 'Bacterial DNA Gyrase (GyrA) & Topoisomerase IV (ParC)',
    chemicalFormula: 'C24H23FN6O3',
    mechanismOfAction: 'First new oral antibiotic class for uncomplicated urinary tract infections in over two decades. Binds to a unique pocket on bacterial DNA gyrase (subunit GyrA) and topoisomerase IV (subunit ParC) that is distinct from the binding site of fluoroquinolones. Inhibits DNA replication and creates single-stranded DNA cleavage breaks. Due to this unique dual-targeting mechanism, it retains full bactericidal potency against multidrug-resistant uropathogens and quinolone-resistant Neisseria gonorrhoeae without cross-resistance.',
    indications: [
      'INVESTIGATIONAL: Uncomplicated Urinary Tract Infections (uUTI / Acute Cystitis) caused by E. coli, Klebsiella pneumoniae, Proteus mirabilis, or S. saprophyticus (Phase 3 Completed)',
      'INVESTIGATIONAL: Urogenital Gonorrhea caused by drug-resistant Neisseria gonorrhoeae (Phase 3 EAGLE-1 Trial)'
    ],
    dosingAndAdministration: {
      adult: 'Investigational Phase 3 Regimen for uUTI: 1500 mg PO twice daily for 5 days with water. For Urogenital Gonorrhea: Two 3000 mg oral doses administered 10 to 12 hours apart.',
      route: 'Oral with or without food'
    },
    organDoseAdjustments: {
      renal: 'Phase 3 trials evaluated eGFR down to 30 mL/min. Undergoing formal pharmacokinetic clearance modeling for ESRD.',
      hepatic: 'Under clinical evaluation.',
      dialysis: 'Not established.'
    },
    pharmacokinetics: {
      bioavailability: 'Approximately 55% to 65% oral absorption',
      tmax: '1.5 to 2.5 hours',
      proteinBinding: 'Moderate (~60%)',
      metabolism: 'Hepatic metabolism via CYP3A4 to minor hydroxylated metabolites',
      halfLife: 'Approximately 9 to 12 hours',
      elimination: 'Excreted both renally as unchanged active drug (achieving high bactericidal concentrations in urine) and via fecal/biliary routes'
    },
    adverseReactions: {
      common: ['Diarrhea (mild to moderate, self-limiting - 14%)', 'Nausea (7%)', 'Abdominal discomfort', 'Headache'],
      severeOrLifeThreatening: [
        'Clostridioides difficile-associated diarrhea (class risk monitoring)',
        'Transient QTc prolongation (under close evaluation in Phase 3)'
      ]
    },
    blackBoxWarnings: [
      'Investigational Agent. No current black box warning.'
    ],
    contraindications: [
      'Hypersensitivity to gepotidacin or triazaacenaphthylene derivatives'
    ],
    drugInteractions: {
      cypPathways: 'Substrate of CYP3A4.',
      majorInteractions: [
        'Strong CYP3A4 Inhibitors: May increase gepotidacin plasma concentrations.',
        'QTc Prolonging Medications: Use with caution until definitive cardiac safety data finalized.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Investigational / Not Rated',
      briggsRisk: 'Preclinical Animal Safety Under Review',
      summary: 'Reproductive toxicity evaluation underway.'
    },
    marketLifecycleDetails: {
      clinicalTrialPhase: 'Pre-Registration (NDA / BLA)',
      leadSponsor: 'GlaxoSmithKline (GSK) in partnership with BARDA',
      expectedApprovalYear: '2025 - 2026',
      primaryRegulators: ['US FDA (QIDP & Fast Track Designation)', 'EMA (Accelerated Assessment)'],
      pivotalTrialEndpoints: 'EAGLE-2 and EAGLE-3 Phase 3 Trials (Lancet, 2024): Evaluated over 3,000 female patients with uncomplicated UTI. Gepotidacin 1500 mg BID for 5 days was non-inferior and in EAGLE-3 statistically superior in therapeutic success (combined clinical cure and microbiological eradication) compared to Nitrofurantoin 100 mg BID for 5 days, showing robust efficacy against fluoroquinolone-resistant and ESBL-producing uropathogens.',
      clinicalAdvantageOverStandard: 'First oral antibiotic class for UTIs in over 20 years. Directly solves the global clinical crisis of ESBL and ciprofloxacin resistance in community-acquired cystitis without requiring IV carbapenems or hospital admission.'
    },
    clinicalPharmacistPearls: [
      'Solves a critical global point-of-care dilemma: with ciprofloxacin resistance exceeding 60% in many Ethiopian hospital outpatient clinics, gepotidacin provides an effective oral alternative to avoid IV ceftriaxone.',
      'Does NOT share cross-resistance with fluoroquinolones (Ciprofloxacin/Levofloxacin) because it binds to a completely different structural region of DNA gyrase.',
      'Completing a simple 5-day oral course cures uncomplicated cystitis with low rates of GI adverse events.'
    ]
  },
  {
    id: 'drug-empagliflozin',
    name: 'Empagliflozin',
    brandNames: ['Jardiance'],
    drugClass: 'Sodium-Glucose Cotransporter 2 (SGLT2) Inhibitor',
    therapeuticCategory: 'Cardiovascular & Hematology',
    status: 'active',
    statusBadge: 'Approved • GDMT for HFrEF, HFpEF, CKD & T2DM',
    atcCode: 'A10BK03',
    molecularTarget: 'SGLT2 transporter in renal proximal convoluted tubule',
    chemicalFormula: 'C23H27ClO7',
    mechanismOfAction: 'Potent and selective inhibitor of SGLT2, which reabsorbs ~90% of filtered glucose in the kidney. Induces glucosuria and natriuresis, lowering blood glucose without stimulating insulin. Lowers intraglomerular pressure by restoring tubuloglomerular feedback, reducing preload/afterload, and shifting myocardial metabolism toward energy-efficient ketone bodies.',
    indications: [
      'Type 2 Diabetes Mellitus glycemic control',
      'Heart Failure with Reduced Ejection Fraction (HFrEF) - EMPEROR-Reduced',
      'Heart Failure with Preserved Ejection Fraction (HFpEF) - EMPEROR-Preserved',
      'Chronic Kidney Disease (CKD) to reduce progression - EMPA-KIDNEY'
    ],
    dosingAndAdministration: {
      adult: '10 mg PO once daily in the morning; can increase to 25 mg daily for additional glycemic control in T2DM. For Heart Failure and CKD, standard dose is 10 mg PO once daily.',
      geriatric: 'Check baseline volume status and renal function before initiation.',
      route: 'Oral with or without food'
    },
    organDoseAdjustments: {
      renal: 'eGFR ≥ 20 mL/min/1.73m²: 10 mg daily (indicated for kidney and heart failure protection down to eGFR 20). Glycemic efficacy diminishes when eGFR < 45. eGFR < 20: Initiation not recommended, but may continue if already tolerated until dialysis.',
      hepatic: 'No dose adjustment needed for mild/moderate hepatic impairment.',
      dialysis: 'Contraindicated in patients on maintenance dialysis.'
    },
    pharmacokinetics: {
      bioavailability: '78% oral bioavailability',
      tmax: '1.5 hours',
      proteinBinding: '86%',
      metabolism: 'Glucuronidation via UGT2B7, UGT1A3, UGT1A8, and UGT1A9; no significant CYP450 metabolism',
      halfLife: '12.4 hours (ideal once-daily pharmacokinetics)',
      elimination: '54% excreted via feces and 41% via urine'
    },
    adverseReactions: {
      common: ['Mycotic genital infections (vulvovaginal candidiasis, balanitis - 6-8%)', 'Urinary tract infections', 'Osmotic diuresis / increased urination', 'Volume depletion / orthostatic hypotension'],
      severeOrLifeThreatening: [
        'Euglycemic Diabetic Ketoacidosis (euDKA) - can occur with normal blood sugars < 200 mg/dL',
        'Necrotizing Fasciitis of the Perineum (Fournier Gangrene - rare urological emergency)',
        'Acute kidney injury from volume depletion when combined with aggressive loop diuretics'
      ]
    },
    blackBoxWarnings: [
      'Warning: Euglycemic Diabetic Ketoacidosis (euDKA) & Lower Limb Amputation class monitoring. Hold medication at least 3-4 days prior to elective major surgery or prolonged fasting.'
    ],
    contraindications: [
      'Known severe hypersensitivity to empagliflozin',
      'Patients on dialysis'
    ],
    drugInteractions: {
      cypPathways: 'Not a significant CYP inhibitor, inducer, or major substrate.',
      majorInteractions: [
        'Loop Diuretics (Furosemide): Additive volume depletion and hypotension; reduce diuretic dose if volume depleted.',
        'Insulin & Sulfonylureas: Increased risk of hypoglycemia; lower secretagogue dose upon initiating SGLT2i.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category D',
      briggsRisk: 'Unsafe in 2nd and 3rd Trimesters',
      summary: 'May affect human fetal renal development based on animal juvenile toxicity data.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 2014,
      primaryRegulators: ['US FDA (2014)', 'EMA (2014)', 'Ethiopian EFDA Formulary'],
      clinicalAdvantageOverStandard: 'Landmark trial EMPA-REG OUTCOME (2015) was the first diabetes trial to show a 38% relative risk reduction in cardiovascular death. Established SGLT2 inhibitors as core pillar of Heart Failure and CKD care regardless of diabetes status.'
    },
    clinicalPharmacistPearls: [
      'The "SICK DAY" Rule: Instruct patients to immediately withhold SGLT2 inhibitors during acute illness, vomiting, dehydration, or 3 days prior to planned surgery to prevent fatal euglycemic DKA.',
      'Check urine ketones if a patient on empagliflozin presents with nausea, vomiting, or dyspnea, even if blood glucose is completely normal (< 180 mg/dL).',
      'Counsel on meticulous perineal hygiene to prevent candidal infections.'
    ]
  },
  {
    id: 'drug-troglitazone',
    name: 'Troglitazone',
    brandNames: ['Rezulin', 'Romozin', 'Prelay'],
    drugClass: 'Thiazolidinedione (PPAR-gamma Agonist)',
    therapeuticCategory: 'Endocrinology & Metabolism',
    status: 'suspended',
    statusBadge: 'EXPELLED / BANNED GLOBALLY • Fatal Idiosyncratic Hepatotoxicity',
    atcCode: 'A10BG01',
    molecularTarget: 'Peroxisome Proliferator-Activated Receptor gamma (PPAR-γ)',
    chemicalFormula: 'C24H27NO5S',
    mechanismOfAction: 'First-in-class thiazolidinedione insulin sensitizer. Agonist of nuclear receptor PPAR-γ, regulating genes involved in glucose and lipid metabolism in adipose tissue, skeletal muscle, and liver.',
    indications: [
      'HISTORICAL: Type 2 Diabetes Mellitus insulin resistance (BANNED GLOBALLY)'
    ],
    dosingAndAdministration: {
      adult: 'Historical: 200 mg to 600 mg PO once daily with meals. (BANNED & EXPELLED FROM MARKET).',
      route: 'Oral (REMOVED FROM COMMERCE)'
    },
    organDoseAdjustments: {
      renal: 'No historical adjustment.',
      hepatic: 'Contraindicated; caused fatal hepatic necrosis.',
      dialysis: 'Not dialyzable.'
    },
    pharmacokinetics: {
      bioavailability: 'Food increased absorption by 30-85%',
      tmax: '2 to 3 hours',
      proteinBinding: '> 99%',
      metabolism: 'Hepatic sulfation and glucuronidation, and oxidation by CYP3A4 and CYP2C8 into reactive quinone metabolites',
      halfLife: '16 to 34 hours',
      elimination: '85% excreted in feces, 3% in urine'
    },
    adverseReactions: {
      common: ['Edema', 'Weight gain', 'Mild anemia'],
      severeOrLifeThreatening: [
        'Acute Idiosyncratic Fulminant Hepatic Failure',
        'Massive Hepatic Centrilobular Necrosis',
        'Death or Need for Emergency Liver Transplantation'
      ]
    },
    blackBoxWarnings: [
      'EXPELLED FROM MARKET (March 2000): Withdrawn by Warner-Lambert/Parke-Davis after accumulating over 90 cases of liver failure, 63 patient deaths, and 10 emergency liver transplants due to idiosyncratic hepatic destruction.'
    ],
    contraindications: [
      'BANNED FROM USE GLOBALLY',
      'Active liver disease'
    ],
    drugInteractions: {
      cypPathways: 'Inducer of CYP3A4; substrate of CYP2C8 and CYP3A4.',
      majorInteractions: [
        'Oral Contraceptives (Ethinyl Estradiol): Induces CYP3A4, causing contraceptive failure.',
        'Atorvastatin & Cyclosporine: Altered clearance via CYP3A4.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Category B',
      briggsRisk: 'Withdrawn from market',
      summary: 'Withdrawn due to fatal maternal hepatotoxicity.'
    },
    marketLifecycleDetails: {
      yearIntroduced: 1997,
      yearWithdrawnOrSuspended: 2000,
      primaryRegulators: ['UK MCA (Withdrawn Dec 1997)', 'US FDA (Withdrawn March 2000)', 'Global Health Authorities'],
      toxicologicalRootCause: 'Reactive Metabolite & Mitochondrial Toxicity: Troglitazone features an alpha-tocopherol (chroman) ring that undergoes metabolic bioactivation via CYP2C8 and CYP3A4 to a reactive quinone intermediate (troglitazone quinone) and epoxide metabolites. These reactive species bind covalently to hepatic canalicular bile salt export pump (BSEP / ABCB11) and mitochondrial membrane proteins, dissipating mitochondrial membrane potential and triggering massive necrotic hepatocyte death.',
      pivotalSafetyTrials: 'Post-Marketing MedWatch Surveillance: After approval in 1997, mandatory monthly ALT monitoring was imposed, but liver failure occurred rapidly and unpredictably even in patients with previously normal liver enzymes.',
      saferAlternatives: ['Pioglitazone 15-30mg PO daily (does not contain the chroman ring; minimal hepatotoxic risk, though fluid retention must be monitored)', 'Metformin', 'SGLT2 inhibitors', 'GLP-1 receptor agonists']
    },
    clinicalPharmacistPearls: [
      'The Troglitazone disaster demonstrated that routine laboratory monitoring cannot compensate for an intrinsically toxic bioactivating chemical scaffold.',
      'Replacement molecules Pioglitazone and Rosiglitazone modified the chroman head group to eliminate reactive quinone formation, completely avoiding fulminant liver destruction.',
      'Pharmacovigilance pearl: Liver enzymes (ALT/AST) must always be monitored when starting new drug classes that undergo complex hepatic bioactivation.'
    ]
  },
  {
    id: 'drug-casgevy',
    name: 'Exagamglogene autotemcel (Casgevy / Exa-cel)',
    brandNames: ['Casgevy'],
    drugClass: 'Autologous CRISPR-Cas9 Gene-Edited Cell Therapy',
    therapeuticCategory: 'Rare Diseases & Gene Therapy',
    status: 'pipeline',
    statusBadge: 'PIPELINE BREAKTHROUGH • First Approved CRISPR Therapy',
    atcCode: 'V08 (Other therapeutic products)',
    molecularTarget: 'BCL11A erythroid-specific enhancer (GATA1 binding site)',
    chemicalFormula: 'Patient-derived CD34+ hematopoietic stem and progenitor cells edited ex vivo using CRISPR-Cas9 ribonucleoprotein',
    mechanismOfAction: 'First-in-class ex vivo CRISPR-Cas9 genome-editing therapy. Patient CD34+ hematopoietic stem cells are mobilized, harvested, and electroporated with Cas9 endonuclease complexed with guide RNA targeting the erythroid-specific enhancer of the BCL11A gene. Disrupting this GATA1 binding motif silences BCL11A expression in erythroid lineage cells, releasing suppression of the gamma-globin (HBG1/HBG2) genes. This leads to high, durable production of Fetal Hemoglobin (HbF > 40%), preventing HbS polymerization, erythrocyte sickling, and vaso-occlusion.',
    indications: [
      'Sickle Cell Disease (SCD) in patients ≥ 12 years with recurrent vaso-occlusive crises (VOCs)',
      'Transfusion-Dependent Beta-Thalassemia (TDT) in patients ≥ 12 years'
    ],
    dosingAndAdministration: {
      adult: 'Single-dose, one-time personalized autologous intravenous infusion of at least 3.0 × 10^6 CD34+ cells/kg following myeloablative busulfan conditioning in a certified specialized transplant center.',
      pediatric: 'Approved down to adolescents ≥ 12 years of age.',
      route: 'Intravenous infusion after myeloablative chemotherapy'
    },
    organDoseAdjustments: {
      renal: 'Requires adequate baseline organ function for busulfan conditioning.',
      hepatic: 'Screen for severe liver cirrhosis or hemochromatosis prior to conditioning.',
      dialysis: 'Not evaluated.'
    },
    pharmacokinetics: {
      bioavailability: '100% autologous cell engraftment',
      tmax: 'Median neutrophil engraftment: 27 days; platelet engraftment: 34 days',
      proteinBinding: 'Not applicable (living cellular product)',
      metabolism: 'Self-renewing, long-lived hematopoietic stem cell pool',
      halfLife: 'Durable multi-year / lifetime persistence in bone marrow',
      elimination: 'Engrafted stem cells repopulate bone marrow permanently'
    },
    adverseReactions: {
      common: ['Mucositis and stomatitis (due to busulfan conditioning)', 'Febrile neutropenia', 'Thrombocytopenia', 'Nausea and vomiting', 'Alopecia'],
      severeOrLifeThreatening: [
        'Prolonged Cytopenias & Delayed Platelet Engraftment',
        'Severe Opportunistic Sepsis during neutropenic window',
        'Theoretical risk of off-target genomic cleavage and insertional mutagenesis (not observed in clinical trials)'
      ]
    },
    blackBoxWarnings: [
      'Specialized Conditioning Warning: Requires high-dose myeloablative busulfan conditioning, which carries substantial risks of pancytopenia, infection, secondary malignancy, and permanent infertility. Fertility preservation (sperm/oocyte cryopreservation) must be offered prior to conditioning.'
    ],
    contraindications: [
      'Hypersensitivity to dimethyl sulfoxide (DMSO) or dextran 40',
      'Inability to tolerate myeloablative busulfan conditioning'
    ],
    drugInteractions: {
      cypPathways: 'No direct CYP metabolism of cells. Busulfan is cleared via glutathione conjugation and CYP3A4.',
      majorInteractions: [
        'Iron Chelators: Hold iron chelation therapy for at least 7 days prior to conditioning due to additive bone marrow toxicity.'
      ]
    },
    pregnancyAndLactation: {
      fdaCategory: 'Investigational / Not Rated',
      briggsRisk: 'Strictly Contraindicated (Busulfan Teratogen)',
      summary: 'Negative pregnancy test mandatory before conditioning. Must use effective contraception for at least 6 months post-infusion.'
    },
    marketLifecycleDetails: {
      clinicalTrialPhase: 'Pre-Registration (NDA / BLA)',
      leadSponsor: 'Vertex Pharmaceuticals & CRISPR Therapeutics',
      expectedApprovalYear: '2024 - 2026 (Global Specialized Rollout)',
      primaryRegulators: ['UK MHRA (First Global Approval Nov 2023)', 'US FDA (Approved Dec 2023)', 'EMA (2024)'],
      pivotalTrialEndpoints: 'CLIMB-SCD-121 Trial (NEJM, Frangoul et al., 2024): 96.7% of sickle cell patients (29 of 30 evaluable) were completely free of severe vaso-occlusive crises for at least 12 consecutive months. In beta-thalassemia, 93% achieved complete transfusion independence.',
      clinicalAdvantageOverStandard: 'A true curative biological paradigm. Replaces lifelong recurrent hospitalizations, blood transfusions, organ damage, and chronic opioid dependence with a one-time genetic cure.'
    },
    clinicalPharmacistPearls: [
      'Historical milestone: The very first CRISPR-Cas9 gene editing medicine approved for human therapy in world history.',
      'Mechanism insight: Rather than cutting and repairing the mutated adult beta-globin gene, it cleverly cuts the "off-switch" (BCL11A), turning back on fetal hemoglobin (HbF) which everyone has in their genome.',
      'Health equity challenge: Costing ~$2.2 million USD per treatment, international global health coalitions are currently working on point-of-care in vivo delivery technologies to bring this cure to sub-Saharan Africa.'
    ]
  }
];

// ==========================================
// 4. MEDICAL ADVANCEMENT SCENARIOS
// ==========================================
export interface MedicalAdvancementScenario {
  id: string;
  title: string;
  clinicalDomain: string;
  patientVignette: string;
  historicalOrToxicParadigm: {
    approachName: string;
    description: string;
    clinicalDrawbacksAndFatalRisks: string[];
    patientOutcome: string;
    biomarkers: Record<string, string>;
  };
  advancementParadigm: {
    breakthroughAgent: string;
    innovativeMechanism: string;
    clinicalAdvantages: string[];
    patientOutcome: string;
    biomarkers: Record<string, string>;
    clinicalTrialEvidence: string;
  };
  interactiveComparisonMetrics: Array<{
    parameter: string;
    historicalValue: string;
    advancedValue: string;
    impactSummary: string;
  }>;
  pharmacistTeachingPoints: string[];
}

export const medicalAdvancementScenarios: MedicalAdvancementScenario[] = [
  {
    id: 'scen-hiv-prep',
    title: 'HIV-1 Prevention: Daily Oral Truvada vs. Twice-Yearly Lenacapavir Breakthrough',
    clinicalDomain: 'Infectious Diseases & Global Health',
    patientVignette: 'A 21-year-old female university student in a high HIV-prevalence region seeks pre-exposure prophylaxis. She experiences severe nausea on daily oral pills and fears community stigma from pill bottles in her dormitory room, leading to frequent missed doses (< 50% adherence).',
    historicalOrToxicParadigm: {
      approachName: 'Daily Oral Emtricitabine / Tenofovir Disoproxil Fumarate (FTC/TDF)',
      description: 'Requires daily strict adherence to maintain protective mucosal tenofovir diphosphate levels. Missed doses rapidly drop tissue drug levels below the EC90 threshold, creating high vulnerability to viral transmission.',
      clinicalDrawbacksAndFatalRisks: [
        'High pill burden, fatigue, and societal stigma in communal living quarters',
        'Drop in adherence < 4 doses/week reduces female genital tract protection to < 50%',
        'Long-term renal tubular dysfunction (Fanconi syndrome) and bone mineral density loss',
        'Risk of breakthrough HIV infection with M184V / K65R resistance mutations'
      ],
      patientOutcome: 'Intermittent adherence (35-45%), breakthrough HIV seroconversion risk, chronic gastrointestinal intolerance.',
      biomarkers: {
        'Adherence Level': '42% (Subtherapeutic)',
        'Dosing Frequency': '365 pills/year',
        'Seroconversion Protection': '44% estimated',
        'Renal Function (eGFR)': 'Decline of 4-6 mL/min over 2 yrs'
      }
    },
    advancementParadigm: {
      breakthroughAgent: 'Lenacapavir (Sunlenca) 927 mg Subcutaneous Injection',
      innovativeMechanism: 'Long-acting multi-stage HIV-1 capsid inhibitor administered subcutaneously only ONCE EVERY 6 MONTHS. Forms an ultra-slow release microcrystalline depot maintaining picomolar concentrations that block nuclear import, capsid disassembly, and virion maturation continuously for 26 weeks.',
      clinicalAdvantages: [
        'Zero daily pills: Only 2 healthcare visits per year for subcutaneous injection',
        'Complete removal of daily adherence anxiety, forgetfulness, and pill-bottle stigma',
        'Near-zero systemic organ toxicity (no tenofovir nephrotoxicity or bone demineralization)',
        'Superior protection demonstrated across international landmark randomized trials'
      ],
      patientOutcome: '100% protection against HIV infection with total elimination of daily pill anxiety and perfect semi-annual compliance.',
      biomarkers: {
        'Adherence Level': '100% (Provider-administered depot)',
        'Dosing Frequency': '2 clinic visits/year',
        'Seroconversion Protection': '100.0% (0 infections in PURPOSE 1)',
        'Renal Function (eGFR)': 'Stable, zero nephrotoxicity'
      },
      clinicalTrialEvidence: 'PURPOSE 1 Trial (NEJM, 2024): 5,300 adolescent girls and young women in South Africa and Uganda. Lenacapavir demonstrated 100% efficacy (0 HIV infections observed), outperforming daily Truvada (1.5% incidence).'
    },
    interactiveComparisonMetrics: [
      {
        parameter: 'Annual Dosing Requirement',
        historicalValue: '365 oral tablets / year',
        advancedValue: '2 subcutaneous injections / year',
        impactSummary: '99.5% reduction in dosing events; adherence barrier eliminated'
      },
      {
        parameter: 'HIV Infection Incidence',
        historicalValue: '1.69 per 100 person-years',
        advancedValue: '0.00 per 100 person-years (100% efficacy)',
        impactSummary: 'Absolute prevention achieved across multi-thousand trial'
      },
      {
        parameter: 'Renal & Bone Safety Risk',
        historicalValue: 'Tenofovir-induced proximal tubulopathy & osteopenia',
        advancedValue: 'Zero renal tubular or bone mineral density effects',
        impactSummary: 'Safe for long-term multi-decade prevention'
      }
    ],
    pharmacistTeachingPoints: [
      'The paradigm of chronic infectious disease prophylaxis is shifting from daily behavioral adherence to long-acting biological depots.',
      'Pre-injection HIV screening with fourth-generation antibody/antigen testing is mandatory to prevent initiating single-agent capsid therapy in unrecognized acute infection.',
      'Mild painless subcutaneous injection-site nodules are normal depot manifestations that resolve gradually over months.'
    ]
  },
  {
    id: 'scen-tb-bpalm',
    title: 'Multidrug-Resistant TB: 18-Month Toxic Injectables vs. 6-Month All-Oral BPaLM Regimen',
    clinicalDomain: 'Antimicrobial Resistance & Pulmonology',
    patientVignette: 'A 29-year-old high school teacher in Oromia, Ethiopia, is diagnosed with Rifampicin- and Isoniazid-resistant pulmonary tuberculosis (MDR-TB). He is terrified of losing his hearing from daily injections and cannot afford to miss 2 years of work.',
    historicalOrToxicParadigm: {
      approachName: 'Standard 18 to 24-Month Long Regimen with Daily Aminoglycoside Injections',
      description: 'Historically mandated 8 months of daily painful deep intramuscular injections of Kanamycin or Amikacin, combined with 4-5 oral second-line toxic drugs for up to 24 continuous months.',
      clinicalDrawbacksAndFatalRisks: [
        'Permanent bilateral sensorineural hearing loss in 30-50% of patients from cochlear hair cell destruction',
        'Acute kidney injury and nephrotoxicity from aminoglycoside proximal tubule accumulation',
        'High psychological distress, painful muscle indurations, and treatment fatigue',
        'Treatment failure and default rates exceeding 45% globally'
      ],
      patientOutcome: 'Severe bilateral tinnitus and irreversible hearing loss by Month 5; 18 months of severe disability with 55% cure rate.',
      biomarkers: {
        'Treatment Duration': '18 to 24 Months',
        'Painful Injections': '160 to 240 Daily IM Injections',
        'Ototoxicity / Deafness': '38% permanent sensorineural loss',
        'Treatment Success Rate': '54% - 60% cure rate'
      }
    },
    advancementParadigm: {
      breakthroughAgent: '6-Month All-Oral BPaLM Regimen (Bedaquiline + Pretomanid + Linezolid + Moxifloxacin)',
      innovativeMechanism: 'Revolutionary synergy targeting Mycobacterial energy and cell wall metabolism: Bedaquiline halts ATP synthase; Pretomanid generates nitric oxide poisoning respiratory chains and blocks mycolic acid; Linezolid inhibits ribosomal protein synthesis; Moxifloxacin inhibits DNA gyrase.',
      clinicalAdvantages: [
        'ZERO INJECTIONS: 100% all-oral regimen delivered in outpatient setting',
        'Treatment duration slashed by 75% (from 24 months down to only 6 months)',
        'Zero aminoglycoside ototoxicity; complete preservation of hearing',
        'Cure rates exceeding 89-92% in real-world clinical trials'
      ],
      patientOutcome: 'Sputum culture conversion at Week 8; complete cure at Month 6 with intact hearing and full return to teaching.',
      biomarkers: {
        'Treatment Duration': '6 Months (26 weeks)',
        'Painful Injections': '0 Injections (All-Oral)',
        'Ototoxicity / Deafness': '0% (Aminoglycosides eliminated)',
        'Treatment Success Rate': '89% - 92% cure rate'
      },
      clinicalTrialEvidence: 'TB-PRACTECAL Trial (NEJM, Nyang\'wa et al., 2022): 6-month all-oral BPaLM regimen was statistically superior to standard 18-month care, with 89% cure versus 52%, and 4-fold fewer adverse events.'
    },
    interactiveComparisonMetrics: [
      {
        parameter: 'Duration of Therapy',
        historicalValue: '18 - 24 Months',
        advancedValue: '6 Months',
        impactSummary: '75% reduction in duration; patients recover their livelihoods rapidly'
      },
      {
        parameter: 'Route of Administration',
        historicalValue: 'Painful Daily IM Injections + 14-20 daily pills',
        advancedValue: '100% All-Oral Regimen',
        impactSummary: 'Eliminated painful injections and injection-site abscesses entirely'
      },
      {
        parameter: 'Risk of Permanent Hearing Loss',
        historicalValue: '35% - 50% Irreversible Deafness',
        advancedValue: '0% (Otally non-toxic)',
        impactSummary: 'Saved tens of thousands of young patients from life-long deafness'
      }
    ],
    pharmacistTeachingPoints: [
      'Monitor ECG intervals (QTc) at Weeks 2, 4, 8, 12, and 24 due to potential additive cardiotoxicity between Bedaquiline and Moxifloxacin.',
      'Manage Linezolid myelosuppression and peripheral neuropathy by initiating at 600mg daily and dose-reducing to 300mg daily if platelets or hemoglobin drift downward.',
      'Ensure Bedaquiline is taken with meals to ensure reliable 2-fold oral absorption.'
    ]
  },
  {
    id: 'scen-sickle-cell',
    title: 'Sickle Cell Disease: Lifelong Transfusions & Opioid Crises vs. One-Time CRISPR Casgevy Cure',
    clinicalDomain: 'Hematology & Genetic Medicine',
    patientVignette: 'A 19-year-old with severe homozygous HbSS Sickle Cell Disease experiences 6 to 8 excruciating vaso-occlusive bone pain crises per year, requiring repeated hospitalizations, high-dose IV morphine, and frequent red cell exchange transfusions resulting in hepatic iron overload.',
    historicalOrToxicParadigm: {
      approachName: 'Chronic Palliative Care: Hydroxyurea, Blood Transfusions & IV Opioid Analgesia',
      description: 'Oral Hydroxyurea induces modest HbF production, accompanied by regular packed red blood cell transfusions and aggressive IV opioid management during acute crises.',
      clinicalDrawbacksAndFatalRisks: [
        'Persistent unpredictable vaso-occlusive crises causing ischemic bone marrow necrosis and stroke',
        'Transfusional iron overload requiring toxic iron chelation therapy (Deferasirox/Deferoxamine)',
        'Progressive end-organ damage (splenic infarction, sickle nephropathy, pulmonary hypertension)',
        'Chronic opioid tolerance, dependence, and reduced life expectancy (median 42-45 years)'
      ],
      patientOutcome: 'Chronic daily bone pain, 6 hospital admissions per year, hepatic hemosiderosis, reduced quality of life.',
      biomarkers: {
        'Fetal Hemoglobin (HbF)': '8% - 12% on Hydroxyurea',
        'Vaso-occlusive Crises': '6 to 8 severe crises / year',
        'Blood Transfusions': '8 to 12 units / year',
        'Serum Ferritin': '> 3,500 ng/mL (Iron Overload)'
      }
    },
    advancementParadigm: {
      breakthroughAgent: 'Exagamglogene autotemcel (Casgevy / Exa-cel) CRISPR-Cas9 Therapy',
      innovativeMechanism: 'One-time ex vivo autologous hematopoietic stem cell gene editing. CRISPR-Cas9 precisely edits the erythroid-specific enhancer of the BCL11A gene in patient CD34+ stem cells, permanently switching off BCL11A repression and reactivating massive continuous synthesis of protective Fetal Hemoglobin (HbF > 45%).',
      clinicalAdvantages: [
        'Curative biological approach: One-time treatment eliminates sickling at the cellular source',
        'Near-total abolition of vaso-occlusive pain crises (97% crisis-free rate)',
        'Eliminates chronic dependence on blood transfusions and opioid analgesics',
        'Prevents progressive irreversible ischemic organ damage (kidney, brain, lung)'
      ],
      patientOutcome: '100% free of vaso-occlusive crises for over 2 years post-infusion; complete independence from pain medications and transfusions.',
      biomarkers: {
        'Fetal Hemoglobin (HbF)': '> 45% of total hemoglobin',
        'Vaso-occlusive Crises': '0 crises / year (100% resolution)',
        'Blood Transfusions': '0 units required',
        'Total Hemoglobin': 'Normalized to 12.5 g/dL'
      },
      clinicalTrialEvidence: 'CLIMB-SCD-121 Trial (NEJM, 2024): 29 of 30 patients (96.7%) achieved complete freedom from severe vaso-occlusive crises for at least 12 consecutive months; average crisis-free duration > 22 months.'
    },
    interactiveComparisonMetrics: [
      {
        parameter: 'Annual Pain Crisis Frequency',
        historicalValue: '6 - 8 Acute Hospitalized Crises / Year',
        advancedValue: '0 Crises (97% Complete Resolution)',
        impactSummary: 'Eliminated excruciating sickle pain episodes permanently'
      },
      {
        parameter: 'Fetal Hemoglobin (HbF) Levels',
        historicalValue: '8% - 12% (Insufficient to prevent polymerization)',
        advancedValue: '> 40% - 48% (Potently inhibits sickle polymer)',
        impactSummary: 'Transforms red cell biology so sickling cannot occur'
      },
      {
        parameter: 'Treatment Duration',
        historicalValue: 'Lifelong daily pills, infusions & transfusions',
        advancedValue: 'Single one-time autologous cell infusion',
        impactSummary: 'Permanent autologous marrow engraftment'
      }
    ],
    pharmacistTeachingPoints: [
      'Casgevy avoids the risk of graft-versus-host disease (GvHD) because it uses the patient’s own genetically edited cells rather than an allogeneic donor.',
      'Fertility counseling is critical: Myeloablative busulfan conditioning causes permanent ovarian and testicular failure; sperm or oocyte banking must precede conditioning.',
      'Post-infusion monitoring: Monitor daily ANC and platelets until engraftment is verified (~Day 27).'
    ]
  }
];

// ==========================================
// 5. DRUG INFORMATION SERVICE (DIS) CONSULTS
// ==========================================
export interface DrugInformationConsult {
  id: string;
  inquiryCode: string;
  requesterRole: 'Ward Clinical Pharmacist' | 'Attending Physician' | 'Resident Physician' | 'Pharmacy Student' | 'Critical Care Nurse';
  clinicalSetting: string;
  inquiryCategory: 
    | 'Drug-Drug Interaction & CYP Metabolism'
    | 'IV Y-Site Compatibility & Precipitation'
    | 'Renal & Hepatic Dose Adjustments'
    | 'Pregnancy & Teratogenicity'
    | 'Adverse Drug Reaction & Toxicity'
    | 'Dosing & Therapeutic Drug Monitoring (TDM)';
  inquiryQuestion: string;
  patientBackground: string;
  systematicSearchStrategy: string[];
  evidenceSynthesisAndClinicalRecommendation: {
    directAnswer: string;
    pharmacologicalRationale: string;
    actionableStepByStepPlan: string[];
    monitoringParameters: string[];
    primaryLiteratureReferences: string[];
  };
}

export const drugInformationConsultsData: DrugInformationConsult[] = [
  {
    id: 'dis-001',
    inquiryCode: 'DIS-2026-NEO-081',
    requesterRole: 'Ward Clinical Pharmacist',
    clinicalSetting: 'Neonatal Intensive Care Unit (NICU) • Tikur Anbessa Hospital',
    inquiryCategory: 'IV Y-Site Compatibility & Precipitation',
    inquiryQuestion: 'Can IV Ceftriaxone be administered through the same IV line as Calcium Gluconate or Total Parenteral Nutrition (TPN) in a 14-day-old neonate?',
    patientBackground: 'A 14-day-old term neonate with suspected late-onset neonatal sepsis is receiving parenteral nutrition containing Calcium Gluconate. The medical resident ordered Ceftriaxone 50 mg/kg IV once daily.',
    systematicSearchStrategy: [
      'Checked King Guide to Parenteral Admixtures & Handbook on Injectable Drugs (Trissel\'s)',
      'Reviewed US FDA Safety Circular & EFDA Pharmacovigilance Alert on Ceftriaxone-Calcium precipitation',
      'Queried PubMed: "Ceftriaxone" AND "Calcium" AND "neonate" AND "precipitate"'
    ],
    evidenceSynthesisAndClinicalRecommendation: {
      directAnswer: 'STRICTLY CONTRAINDICATED. Ceftriaxone must NEVER be mixed or co-administered with any calcium-containing IV solutions (including Ringer\'s Lactate, Calcium Gluconate, or TPN) in neonates (≤ 28 days of age), even if separate infusion lines or different administration times are used.',
      pharmacologicalRationale: 'Ceftriaxone is a divalent anion that binds tightly to divalent calcium cations (Ca2+) to form an insoluble crystalline precipitate (ceftriaxone-calcium salt). In neonates, slower renal clearance, lower serum albumin, and immature hepatic conjugation prolong plasma residence time. Autopsy reports have documented fatal microvascular crystalline precipitates obstructing the pulmonary vasculature and renal microcirculation, causing acute fatal cardiopulmonary arrest and anuric renal failure.',
      actionableStepByStepPlan: [
        '1. Immediately cancel the order for Ceftriaxone in this neonate.',
        '2. Substitute with Cefotaxime 50 mg/kg IV every 8-12 hours (Cefotaxime does not form insoluble calcium precipitates and is the third-generation cephalosporin of choice in neonates).',
        '3. If Cefotaxime is unavailable, switch to Ampicillin + Gentamicin as per Ethiopian National Neonatal Sepsis STG.',
        '4. In patients > 28 days old (infants/children/adults), ceftriaxone and calcium may be administered sequentially only if the infusion lines are thoroughly flushed between infusions with compatible fluid (e.g. Normal Saline).'
      ],
      monitoringParameters: [
        'Urine output (normal > 1 mL/kg/h)',
        'Respiratory status and oxygen saturation',
        'Serum creatinine and bilirubin (Ceftriaxone also displaces bilirubin from albumin, risking kernicterus)'
      ],
      primaryLiteratureReferences: [
        'US FDA Drug Safety Communication (2009): FDA Warning on Ceftriaxone-Calcium Precipitation in Neonates.',
        'Steadman et al. (2010): "Ceftriaxone-calcium precipitation in neonates: Mechanisms and clinical implications." Annals of Pharmacotherapy.',
        'Ethiopian Standard Treatment Guidelines for General Hospitals (5th Edition, 2024): Pediatric Antimicrobial Dosing.'
      ]
    }
  },
  {
    id: 'dis-002',
    inquiryCode: 'DIS-2026-TDM-104',
    requesterRole: 'Resident Physician',
    clinicalSetting: 'Inpatient Internal Medicine Ward • Jimma Medical Center',
    inquiryCategory: 'Dosing & Therapeutic Drug Monitoring (TDM)',
    inquiryQuestion: 'Should we still target Vancomycin trough levels of 15-20 mcg/mL for severe MRSA bacteremia, or transition to AUC/MIC guided monitoring? How do we calculate AUC/MIC at bedside?',
    patientBackground: '58-year-old male with severe MRSA hospital-acquired bacteremia and vertebral osteomyelitis. Current serum creatinine 1.4 mg/dL (baseline 0.9). Currently prescribed Vancomycin 1g IV Q12H.',
    systematicSearchStrategy: [
      'Reviewed ASHP / IDSA / PIDS / SIDP Consensus Guidelines on Vancomycin Therapeutic Monitoring (2020 revision)',
      'Examined Ethiopian AMS Guidelines and Stanford Antimicrobial Dosing Guidelines',
      'Assessed clinical nephrotoxicity data comparing trough-only vs Bayesian AUC monitoring'
    ],
    evidenceSynthesisAndClinicalRecommendation: {
      directAnswer: 'TRANSITION TO AUC/MIC MONITORING (TARGET 400-600 mg·h/L). The 2020 revised international consensus guidelines explicitly recommend AGAINST targeting trough levels of 15-20 mcg/mL because high troughs significantly increase acute kidney injury (AKI) by 3- to 4-fold without improving clinical efficacy or bacterial clearance.',
      pharmacologicalRationale: 'Vancomycin exhibits concentration-independent, time-dependent bactericidal killing best predicted by the ratio of the 24-hour Area Under the Curve to the Minimum Inhibitory Concentration (AUC24/MIC). A target AUC24/MIC of 400 to 600 (assuming MIC = 1 mcg/mL by broth microdilution) maximizes bactericidal efficacy while keeping nephrotoxicity low. Troughs of 15-20 mcg/mL frequently correlate with excessive AUCs > 650-800, leading to proximal tubular cell oxidative necrosis.',
      actionableStepByStepPlan: [
        '1. Transition patient to AUC-guided dosing targeting AUC 400-600 mg·h/L.',
        '2. Obtain two post-distribution concentrations: a post-infusion peak (1-2 hours after end of infusion) and a trough (within 30 minutes before next dose) at steady-state (prior to 4th dose).',
        '3. Use bedside first-order pharmacokinetic equations or Bayesian software to compute patient elimination rate constant (kel = ln[Cpeak/Ctrough] / Δt) and calculate AUC24.',
        '4. If pharmacokinetic software is unavailable, maintain a conservative trough of 10 to 15 mcg/mL; avoid troughs > 15 mcg/mL.',
        '5. Ensure infusion rate does not exceed 1000 mg/hour (minimum 60-90 minutes) to prevent Red Man Syndrome.'
      ],
      monitoringParameters: [
        'Serum creatinine every 48 hours (AKI defined as increase in SCr ≥ 0.3 mg/dL in 48h or 50% increase from baseline)',
        'Vancomycin AUC/MIC or trough weekly in hemodynamically stable patients, twice weekly in fluctuating renal function',
        'Resolution of leukocytosis and repeat blood cultures until negative'
      ],
      primaryLiteratureReferences: [
        'Rybak MJ, et al. (2020): "Therapeutic monitoring of vancomycin for serious methicillin-resistant Staphylococcus aureus infections: A revised consensus guideline." AJHP.',
        'Filippone EJ, et al. (2017): "Vancomycin-induced acute kidney injury: Pathology and prevention." American Journal of Kidney Diseases.'
      ]
    }
  },
  {
    id: 'dis-003',
    inquiryCode: 'DIS-2026-PERIOP-042',
    requesterRole: 'Attending Physician',
    clinicalSetting: 'Surgical Ward & OR • Hawassa Comprehensive Specialized Hospital',
    inquiryCategory: 'Adverse Drug Reaction & Toxicity',
    inquiryQuestion: 'Why must SGLT2 inhibitors (Empagliflozin/Dapagliflozin) be stopped 3-4 days before scheduled major surgery, and how do we recognize and manage Euglycemic DKA if it occurs?',
    patientBackground: '64-year-old male with Type 2 Diabetes and Heart Failure scheduled for elective open cholecystectomy. Currently taking Empagliflozin 10mg daily and Metformin 1000mg BID.',
    systematicSearchStrategy: [
      'Reviewed US FDA Drug Safety Alert (2020): Stopping SGLT2 inhibitors before scheduled surgery',
      'Searched British Journal of Anaesthesia (BJA) Perioperative Diabetes Guidelines',
      'Consulted American Association of Clinical Endocrinology (AACE) Euglycemic DKA Protocols'
    ],
    evidenceSynthesisAndClinicalRecommendation: {
      directAnswer: 'STOP EMPAGLIFLOZIN 3 TO 4 DAYS BEFORE SURGERY (Dapagliflozin/Empagliflozin stop at least 3 days; Canagliflozin 3-4 days). This prevents life-threatening Euglycemic Diabetic Ketoacidosis (euDKA), a deceptive surgical complication where profound metabolic acidosis and ketosis occur despite normal blood glucose levels (< 200 mg/dL).',
      pharmacologicalRationale: 'SGLT2 inhibitors continue to promote renal glycosuria for several days after discontinuation. Perioperative surgical stress, catecholamines, cortisol, and fasting trigger lipolysis and hepatic ketogenesis. However, because the kidneys continuously dump glucose, blood sugar remains deceptively normal or mildly elevated (140-200 mg/dL). This masks the diagnosis from standard glucose checks while severe high anion gap metabolic acidosis, dehydration, and hypovolemic shock develop.',
      actionableStepByStepPlan: [
        '1. Instruct patient to take last dose of Empagliflozin 3 full days prior to elective surgery date.',
        '2. Also withhold Metformin 24 hours pre-operatively to prevent lactic acidosis.',
        '3. Provide bridging subcutaneous or IV insulin if needed to maintain blood glucose between 140-180 mg/dL.',
        '4. If patient presents post-operatively with nausea, tachypnea (Kussmaul breathing), abdominal pain, or confusion: IMMEDIATELY ORDER AN ARTERIAL BLOOD GAS (ABG), SERUM ELECTROLYTES FOR ANION GAP, AND BLOOD BETA-HYDROXYBUTYRATE.',
        '5. Treatment of euDKA: Start continuous IV Insulin infusion PLUS IV Dextrose 5% or 10% (Dextrose is mandatory to allow insulin to suppress lipolysis without driving blood glucose into hypoglycemia), along with aggressive IV fluids and potassium replacement.',
        '6. Do NOT restart SGLT2i until patient is fully recovered, eating normally, and discharged home.'
      ],
      monitoringParameters: [
        'Blood beta-hydroxybutyrate or urine acetoacetate ketones',
        'Serum anion gap = [Na+] - ([Cl-] + [HCO3-]); normal < 12 mEq/L',
        'Arterial/Venous pH and serum bicarbonate',
        'Hydration status and hourly urine output'
      ],
      primaryLiteratureReferences: [
        'FDA Drug Safety Communication (March 2020): FDA revises labels of SGLT2 inhibitors to recommend withholding before planned surgery.',
        'Handelsman Y, et al. (2016): "American Association of Clinical Endocrinologists and American College of Endocrinology Position Statement on the Association of SGLT-2 Inhibitors and Diabetic Ketoacidosis." Endocrine Practice.',
        'Marenzi G, et al. (2021): "Euglycemic diabetic ketoacidosis in surgical and critical care patients." Critical Care.'
      ]
    }
  }
];

