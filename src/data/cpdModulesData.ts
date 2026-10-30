import { CPDModule } from '../types';

export const cpdModulesData: CPDModule[] = [
  {
    id: "cpd-pharmacotherapy",
    courseCode: "PHARM-401",
    courseTitle: "Clinical Pharmacotherapy & GDMT Practice",
    category: "Clinical Pharmacy",
    ceuCredits: 15,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 450,
    internationalFeeUSD: 9.00,
    durationHours: "15 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Accredited CPD module covering Guideline-Directed Medical Therapy (GDMT) for Heart Failure (HFrEF 4 Pillars), Ethiopian MoH Diabetic Protocols, Sepsis bundle resuscitation, and antimicrobial stewardship.",
    competencyObjectives: [
      "Implement the 4 pillars of HFrEF mortality-reducing therapy in ambulatory and hospital practice.",
      "Manage glycemic targets and cardiorenal protection using SGLT2 inhibitors and GLP-1 RAs according to ADA/Ethiopian STG.",
      "Audit vancomycin dosing and target AUC/MIC therapeutic drug monitoring in severe sepsis.",
      "Execute evidence-based de-escalation for hospital-acquired infections (HAI)."
    ],
    questions: [
      {
        id: "q-pt-1",
        question: "Which four drug classes constitute the guideline-directed quadruple therapy (4 pillars) for Heart Failure with Reduced Ejection Fraction (HFrEF) that reduce all-cause mortality?",
        scenario: "A 58-year-old male with NYHA Class III HFrEF (LVEF 28%) presents to the clinical pharmacy outpatient clinic for GDMT optimization.",
        options: [
          "Loop diuretic, Digoxin, Nitrate, and Hydralazine",
          "ARNI (Sacubitril/Valsartan) or ACEi/ARB, Evidence-based Beta-blocker, MRA (Spironolactone), and SGLT2 inhibitor",
          "Diltiazem, Amlodipine, Enalapril, and Furosemide",
          "Amiodarone, Carvedilol, Aspirin, and Atorvastatin"
        ],
        correctAnswerIndex: 1,
        explanation: "ACC/AHA and ESC Heart Failure guidelines establish quadruple therapy (ARNI/ACEi, bisoprolol/carvedilol/metoprolol succinate, spironolactone/eplerenone, and dapagliflozin/empagliflozin) as the cornerstone that produces a ~73% cumulative relative reduction in 2-year mortality.",
        guidelineReference: "AHA/ACC/HFSA Heart Failure Guidelines 2024 & Ethiopian MoH STG"
      },
      {
        id: "q-pt-2",
        question: "When transitioning a patient from an ACE inhibitor (e.g., Enalapril) to an ARNI (Sacubitril/Valsartan), what is the mandatory washout period required to prevent life-threatening angioedema?",
        scenario: "The cardiology medical team orders immediate switch from Enalapril 10 mg PO BID to Sacubitril/Valsartan 49/51 mg PO BID.",
        options: [
          "No washout needed; start immediately with the next scheduled dose",
          "12 hours washout",
          "At least 36 hours washout",
          "7 days washout"
        ],
        correctAnswerIndex: 2,
        explanation: "Both ACE inhibitors and neprilysin degrade bradykinin. Dual inhibition simultaneously results in massive bradykinin accumulation and severe or fatal angioedema. A strict 36-hour washout period is required before starting ARNI.",
        guidelineReference: "FDA Drug Safety Communication & Ethiopian EFDA Pharmacovigilance Bulletin"
      },
      {
        id: "q-pt-3",
        question: "According to current ADA and Ethiopian diabetes standards, which oral anti-diabetic class has proven reduction in heart failure hospitalization and progression of Chronic Kidney Disease (CKD) independent of baseline HbA1c?",
        options: [
          "Sulfonylureas (e.g., Glibenclamide)",
          "Thiazolidinediones (e.g., Pioglitazone)",
          "SGLT2 Inhibitors (e.g., Empagliflozin, Dapagliflozin)",
          "DPP-4 Inhibitors (e.g., Sitagliptin)"
        ],
        correctAnswerIndex: 2,
        explanation: "SGLT2 inhibitors provide robust cardiorenal protection by decreasing intraglomerular pressure, reducing albuminuria, and lowering preload/afterload, slowing eGFR decline in diabetic and non-diabetic CKD.",
        guidelineReference: "ADA Standards of Care 2026 & KDIGO Diabetes Management in CKD"
      },
      {
        id: "q-pt-4",
        question: "What is the targeted 24-hour Area Under the Curve to Minimum Inhibitory Concentration (AUC24/MIC) ratio recommended for therapeutic monitoring of intravenous Vancomycin in serious MRSA bacteremia?",
        options: [
          "100 to 200 mg·h/L",
          "400 to 600 mg·h/L (assuming MIC of 1 mg/L)",
          "800 to 1200 mg·h/L",
          "Trough levels must strictly exceed 35 mg/L regardless of AUC"
        ],
        correctAnswerIndex: 1,
        explanation: "IDSA/ASHP consensus guidelines recommend an AUC24/MIC ratio of 400 to 600 mg·h/L to maximize bacterial eradication while minimizing acute kidney injury (nephrotoxicity). Traditional trough-only targets (>15-20) are associated with higher rates of AKI.",
        guidelineReference: "IDSA/ASHP/PIDS Vancomycin TDM Consensus Guidelines"
      },
      {
        id: "q-pt-5",
        question: "In the management of Community-Acquired Pneumonia (CAP) in an inpatient non-ICU adult ward, which empirical regimen complies with the WHO AWaRe Access/Watch classification and Ethiopian MoH STG?",
        options: [
          "Oral Ciprofloxacin alone",
          "Intravenous Ceftriaxone (or Ampicillin) plus Azithromycin (or Doxycycline)",
          "Vancomycin plus Meropenem plus Amikacin",
          "Chloramphenicol plus Metronidazole"
        ],
        correctAnswerIndex: 1,
        explanation: "Inpatient non-ICU CAP requires coverage against typical pathogens (Streptococcus pneumoniae, Haemophilus) and atypical organisms (Mycoplasma, Legionella). Beta-lactam (Ceftriaxone) plus macrolide (Azithromycin) is standard first-line GDMT.",
        guidelineReference: "Ethiopian Standard Treatment Guidelines (STG) 5th Edition & ATS/IDSA CAP Guidelines"
      }
    ]
  },
  {
    id: "cpd-toxicology",
    courseCode: "TOX-402",
    courseTitle: "Clinical Toxicology & Emergency Poisoning Protocols",
    category: "Emergency & Critical Care",
    ceuCredits: 12,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 350,
    internationalFeeUSD: 7.00,
    durationHours: "12 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Acute poisoning triage, pesticide toxidromes (organophosphates & carbamates), paracetamol hepatotoxicity, snake envenomation, and specific antidote dosing protocols.",
    competencyObjectives: [
      "Identify cholinergic toxidrome (SLUDGE / DUMBELS) and calculate doubling atropinization endpoints.",
      "Use Pralidoxime (2-PAM) prior to acetylcholinesterase aging.",
      "Interpret the Rumack-Matthew nomogram for IV/PO N-acetylcysteine (NAC) administration.",
      "Manage acute beta-blocker and calcium channel blocker overdoses with High-Dose Insulin Euglycemia (HIET)."
    ],
    questions: [
      {
        id: "q-tox-1",
        question: "In acute organophosphate poisoning, what is the primary clinical endpoint used to determine adequate therapeutic atropinization?",
        scenario: "A 24-year-old agricultural worker arrives with pinpoint pupils, diaphoresis, bronchorrhea, and wheezing after pesticide exposure.",
        options: [
          "Tachycardia with heart rate > 140 bpm",
          "Mydriasis (complete pupil dilation)",
          "Clear chest auscultation (drying of bronchial secretions) and systolic blood pressure > 80 mmHg",
          "Complete cessation of bowel sounds"
        ],
        correctAnswerIndex: 2,
        explanation: "Drying of tracheobronchial secretions and reversal of bronchospasm (pulmonary clearance) is the life-saving endpoint of atropine titration. Mydriasis and tachycardia alone do not indicate resolution of fatal pulmonary flooding.",
        guidelineReference: "WHO Poisoning Management Manual & Ethiopian MoH Emergency STG"
      },
      {
        id: "q-tox-2",
        question: "Why must Pralidoxime (2-PAM) be administered early following organophosphate poisoning?",
        options: [
          "To neutralize gastric acid and prevent mucosal ulceration",
          "To regenerate phosphorylated acetylcholinesterase before irreversible covalent chemical 'aging' occurs",
          "To competitively block nicotinic neuromuscular receptors",
          "To induce cytochrome P450 enzymes in the liver"
        ],
        correctAnswerIndex: 1,
        explanation: "Pralidoxime is an oxime nucleophile that displaces the organophosphate group from acetylcholinesterase. If the enzyme undergoes chemical 'aging' (loss of an alkyl group over 24-48 hours), reactivation is no longer biochemically possible.",
        guidelineReference: "Goldfrank's Toxicologic Emergencies & EFDA Poison Information Center"
      },
      {
        id: "q-tox-3",
        question: "According to the Rumack-Matthew nomogram, at what minimum time interval post-acute paracetamol ingestion should a diagnostic serum acetaminophen level be drawn to assess hepatotoxicity risk?",
        options: [
          "Immediately within 30 minutes of arrival",
          "At exactly 4 hours post-ingestion (or immediately if presenting later than 4 hours)",
          "Only after 24 hours of clinical observation",
          "When ALT/AST enzymes exceed 1000 IU/L"
        ],
        correctAnswerIndex: 1,
        explanation: "Serum paracetamol concentrations drawn prior to 4 hours cannot be interpreted on the Rumack-Matthew nomogram because gastric absorption and hepatic distribution are incomplete. Levels drawn between 4 and 24 hours guide N-acetylcysteine therapy.",
        guidelineReference: "Rumack-Matthew Nomogram Guidelines & Clinical Toxicology Standards"
      },
      {
        id: "q-tox-4",
        question: "What is the specific rescue agent for severe high-dose Methotrexate toxicity to replenish intracellular folates without requiring dihydrofolate reductase?",
        options: [
          "Folic acid (Vitamin B9)",
          "Leucovorin (Folinic Acid / Calcium Folinate)",
          "Cyanocobalamin (Vitamin B12)",
          "Pyridoxine (Vitamin B6)"
        ],
        correctAnswerIndex: 1,
        explanation: "Methotrexate inhibits dihydrofolate reductase (DHFR). Leucovorin bypasses DHFR by providing an active reduced folate form (tetrahydrofolate), rescuing non-malignant bone marrow and gastrointestinal stem cells.",
        guidelineReference: "ASCO Clinical Oncology Guidelines & EFDA Oncology Protocols"
      },
      {
        id: "q-tox-5",
        question: "Which antidote is indicated for life-threatening refractory shock induced by severe Calcium Channel Blocker or Beta-Blocker toxicity?",
        options: [
          "Flumazenil IV",
          "High-Dose Insulin Euglycemia Therapy (HIET) with 10-20% Dextrose infusion",
          "Activated Charcoal hemoperfusion",
          "Methylene Blue bolus"
        ],
        correctAnswerIndex: 1,
        explanation: "High-Dose Insulin Euglycemia (HIET) exerts a positive inotropic effect by switching myocardial metabolism from free fatty acids to glucose, restoring intracellular calcium handling and cardiac output in CCB/beta-blocker shock.",
        guidelineReference: "American College of Medical Toxicology (ACMT) Consensus"
      }
    ]
  },
  {
    id: "cpd-pharmacology",
    courseCode: "PHARM-301",
    courseTitle: "Receptor Kinetics, Autonomic & Molecular Pharmacology",
    category: "Basic & Clinical Sciences",
    ceuCredits: 10,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 300,
    internationalFeeUSD: 6.00,
    durationHours: "10 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Receptor-ligand binding kinetics, GPCR sub-types (Gs, Gi, Gq), dose-response mathematics, autonomic pharmacology, and cardiovascular electrophysiology.",
    competencyObjectives: [
      "Distinguish competitive, non-competitive, allosteric, and partial agonist curve shifts.",
      "Classify sympathetic and parasympathetic receptors and their intracellular secondary messengers.",
      "Predict therapeutic indices and therapeutic drug monitoring requirements.",
      "Calculate steady-state concentration and elimination constants."
    ],
    questions: [
      {
        id: "q-ph-1",
        question: "How does a reversible competitive antagonist affect the log concentration-response curve of a full agonist?",
        options: [
          "Decreases Emax with no shift in EC50",
          "Shifts the curve to the right in a parallel fashion (increases EC50) without decreasing Emax",
          "Shifts the curve to the left (decreases EC50)",
          "Decreases both Emax and EC50 simultaneously"
        ],
        correctAnswerIndex: 1,
        explanation: "A reversible competitive antagonist competes for the same binding cleft. By adding higher concentrations of agonist, receptor occupancy can still reach 100%, maintaining Emax while increasing the required EC50 (parallel rightward shift).",
        guidelineReference: "Goodman & Gilman's Pharmacological Basis of Therapeutics"
      },
      {
        id: "q-ph-2",
        question: "Stimulation of which G-protein subtype activates Phospholipase C (PLC), generating Inositol 1,4,5-trisphosphate (IP3) and Diacylglycerol (DAG) to mobilize intracellular Calcium?",
        options: [
          "Gs protein (stimulatory)",
          "Gi protein (inhibitory)",
          "Gq protein",
          "Gt protein (transducin)"
        ],
        correctAnswerIndex: 2,
        explanation: "Gq proteins (coupled to Alpha-1 adrenergic, Muscarinic M1/M3, and Vasopressin V1 receptors) activate Phospholipase C beta, which cleaves PIP2 into IP3 (mobilizes Ca2+ from sarcoplasmic reticulum) and DAG (activates Protein Kinase C).",
        guidelineReference: "Katzung Basic & Clinical Pharmacology 16th Edition"
      },
      {
        id: "q-ph-3",
        question: "Why can the partial mu-opioid agonist Buprenorphine precipitate severe withdrawal symptoms if administered to an opioid-dependent patient currently taking Methadone?",
        options: [
          "It accelerates methadone metabolism via hepatic CYP3A4 induction",
          "It has high receptor affinity but lower intrinsic activity, displacing the full agonist from mu receptors",
          "It directly blocks NMDA receptors in the locus coeruleus",
          "It causes rapid renal excretion of free opioids"
        ],
        correctAnswerIndex: 1,
        explanation: "Buprenorphine possesses a very high binding affinity for the mu-opioid receptor, knocking off full agonists like methadone or morphine, but possesses lower intrinsic efficacy (partial agonist), leading to an immediate drop in net receptor stimulation.",
        guidelineReference: "WHO Guidelines for the Psychosocially Assisted Pharmacotherapy of Opioid Dependence"
      },
      {
        id: "q-ph-4",
        question: "What is the primary elimination mechanism responsible for the ultra-short half-life (~9 minutes) of the cardioselective beta-1 blocker Esmolol?",
        options: [
          "Rapid CYP2D6 hepatic hydroxylation",
          "Hydrolysis by red blood cell cytosol esterases",
          "Immediate glomerular filtration with no tubular reabsorption",
          "Pulmonary endothelial uptake"
        ],
        correctAnswerIndex: 1,
        explanation: "Esmolol contains an ester linkage that is rapidly cleaved by ubiquitous red blood cell esterases into an inactive metabolite, making it uniquely controllable in cardiac emergencies.",
        guidelineReference: "AHA Advanced Cardiovascular Life Support (ACLS) Pharmacology"
      },
      {
        id: "q-ph-5",
        question: "If a drug exhibits first-order elimination kinetics, what percentage of the steady-state concentration is attained after exactly 4 to 5 elimination half-lives (t1/2)?",
        options: [
          "50%",
          "75%",
          "93.75% to 96.88%",
          "100% exactly"
        ],
        correctAnswerIndex: 2,
        explanation: "First-order kinetics dictates that each half-life approaches steady-state asymptotically: 1 t1/2 = 50%, 2 t1/2 = 75%, 3 t1/2 = 87.5%, 4 t1/2 = 93.75%, and 5 t1/2 = 96.88% (clinically considered steady-state).",
        guidelineReference: "Applied Biopharmaceutics & Pharmacokinetics"
      }
    ]
  },
  {
    id: "cpd-biopharmaceutics",
    courseCode: "BIOPH-403",
    courseTitle: "Biopharmaceutics, Pharmacokinetics & Bioequivalence",
    category: "Pharmaceutical Sciences",
    ceuCredits: 12,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 400,
    internationalFeeUSD: 8.00,
    durationHours: "12 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Biopharmaceutical Classification System (BCS Classes I-IV), bioequivalence 80-125% 90% confidence intervals, monoclonal antibody neonatal Fc receptor (FcRn) recycling, and multi-compartment modeling.",
    competencyObjectives: [
      "Categorize drug molecules into BCS Classes I, II, III, and IV.",
      "Evaluate bioequivalence study submissions and regulatory biowaiver criteria under EFDA guidelines.",
      "Calculate Area Under the Curve (AUC) using trapezoidal rule for bioequivalence ratios.",
      "Understand nonlinear pharmacokinetics and clearance saturation (Michaelis-Menten)."
    ],
    questions: [
      {
        id: "q-bio-1",
        question: "Under the Biopharmaceutics Classification System (BCS), what define Class II active pharmaceutical ingredients?",
        options: [
          "High Solubility and High Permeability",
          "Low Solubility and High Permeability",
          "High Solubility and Low Permeability",
          "Low Solubility and Low Permeability"
        ],
        correctAnswerIndex: 1,
        explanation: "BCS Class II drugs (e.g., Carbamazepine, Ketoconazole, Ibuprofen) have low aqueous solubility but high intestinal membrane permeability. For these drugs, the rate-limiting step in systemic absorption is in vivo dissolution.",
        guidelineReference: "EFDA Guideline for In Vivo Bioequivalence & WHO Technical Report Series"
      },
      {
        id: "q-bio-2",
        question: "To establish regulatory bioequivalence between a generic drug product and the reference originator product, what standard 90% confidence interval must the geometric mean ratios of Cmax and AUC fall within?",
        options: [
          "70.00% to 130.00%",
          "80.00% to 125.00%",
          "90.00% to 110.00%",
          "95.00% to 105.00%"
        ],
        correctAnswerIndex: 1,
        explanation: "International regulatory bodies (EFDA, WHO, US FDA, EMA) require the 90% confidence interval of the generic-to-reference geometric mean ratio for both Cmax and AUC to fall within the accepted 80.00% to 125.00% window.",
        guidelineReference: "EFDA Medicines Regulatory Framework & WHO Bioequivalence Standards"
      },
      {
        id: "q-bio-3",
        question: "Which physiological mechanism is responsible for protecting IgG monoclonal antibodies from lysosomal catabolism, extending their terminal elimination half-life to approximately 21 days?",
        options: [
          "Hepatic P-glycoprotein efflux pump",
          "Binding to the neonatal Fc receptor (FcRn) inside acidic endosomes",
          "Glomerular size-exclusion filtration barrier",
          "Biliary glucuronidation conjugation"
        ],
        correctAnswerIndex: 1,
        explanation: "Endocytosed IgG binds to FcRn in acidic endosomes (pH ~6.0), preventing trafficking to lysosomes. The complex is recycled back to the cell surface where physiological pH (~7.4) triggers dissociation back into plasma.",
        guidelineReference: "Pharmacokinetics and Pharmacodynamics of Biotech Drugs"
      },
      {
        id: "q-bio-4",
        question: "Which of the following anti-epileptic drugs displays Michaelis-Menten (saturable / capacity-limited) pharmacokinetics within its therapeutic dosage range?",
        options: [
          "Phenytoin",
          "Valproic acid",
          "Levetiracetam",
          "Lamotrigine"
        ],
        correctAnswerIndex: 0,
        explanation: "Phenytoin metabolism saturates at therapeutic levels (Km ~4-6 mcg/mL). Once hepatic CYP2C9 enzymes are saturated, elimination changes from first-order to zero-order, causing disproportionate non-linear rises in serum concentrations.",
        guidelineReference: "Applied Clinical Pharmacokinetics & EFDA Neurology Standards"
      },
      {
        id: "q-bio-5",
        question: "When is an in vitro dissolution test considered sufficient to grant a regulatory 'biowaiver' without requiring human in vivo bioequivalence testing?",
        options: [
          "Only for BCS Class IV narrow therapeutic index drugs",
          "For rapidly dissolving BCS Class I (and select Class III) immediate-release oral solid dosage forms with wide safety margins",
          "For all modified-release injectables",
          "Biowaivers are never permitted by EFDA"
        ],
        correctAnswerIndex: 1,
        explanation: "BCS Class I drugs (high solubility, high permeability) that dissolve >85% in 15 minutes across pH 1.2, 4.5, and 6.8 qualify for biowaivers under EFDA and WHO guidelines, avoiding redundant clinical human trials.",
        guidelineReference: "EFDA Biowaiver Guidelines for Generic Formulations"
      }
    ]
  },
  {
    id: "cpd-industrial-pharmacy",
    courseCode: "IND-302",
    courseTitle: "Industrial Pharmacy, cGMP & Tablet Manufacturing Defect Control",
    category: "Manufacturing & QA",
    ceuCredits: 10,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 300,
    internationalFeeUSD: 6.00,
    durationHours: "10 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Good Manufacturing Practice (cGMP), rotary tablet compression tooling, capping/lamination root cause analysis, cleanroom air handling (HVAC), and validation protocols.",
    competencyObjectives: [
      "Enforce cGMP compliance in secondary pharmaceutical manufacturing facilities.",
      "Troubleshoot tablet compression failures (capping, lamination, sticking, picking).",
      "Interpret HVAC cleanroom differential pressures and HEPA filtration velocity.",
      "Review Batch Manufacturing Records (BMR) and deviation reports."
    ],
    questions: [
      {
        id: "q-ind-1",
        question: "During rotary tablet compression, what is the most common cause of 'capping' (partial or complete separation of the top or bottom crown of a tablet)?",
        options: [
          "Excessive lubricant concentration leading to poor bonding",
          "Air entrapment in the granulation during high-speed compression and rapid decompression",
          "Overly moist granules (>5% moisture content)",
          "Low punch pressure"
        ],
        correctAnswerIndex: 1,
        explanation: "Capping is primarily caused by air entrapment in the die cavity during compression. When punch decompression occurs rapidly, the trapped air expands and fractures the tablet crown. Solutions include pre-compression, tapered dies, and slowing turret speed.",
        guidelineReference: "Lachman & Lieberman's Theory and Practice of Industrial Pharmacy"
      },
      {
        id: "q-ind-2",
        question: "According to WHO and EFDA Good Manufacturing Practice (cGMP), what positive differential pressure must be maintained between adjacent cleanroom corridors to prevent cross-contamination?",
        options: [
          "1 to 2 Pascals",
          "10 to 15 Pascals",
          "50 to 100 Pascals",
          "Rooms must be held in negative pressure at all times"
        ],
        correctAnswerIndex: 1,
        explanation: "A pressure cascade of 10 to 15 Pascals (Pa) between cleanroom zones of different classifications ensures unidirectional airflow and prevents air from lower-grade areas from infiltrating higher-grade manufacturing rooms.",
        guidelineReference: "WHO Good Manufacturing Practices for Pharmaceutical Products (Annex 2)"
      },
      {
        id: "q-ind-3",
        question: "What formulation adjustment resolves 'sticking and picking' where granules adhere to the upper punch logo face during tableting?",
        options: [
          "Increasing tableting speed to maximum RPM",
          "Increasing punch polish, decreasing granule moisture, and increasing Magnesium Stearate lubricant blending time",
          "Adding more liquid binder to the granulator",
          "Removing all glidants from the formula"
        ],
        correctAnswerIndex: 1,
        explanation: "Sticking/picking occurs when wet granules or unlubricated powder adhere to tooling. Electro-polishing punches, optimizing drying (LOD), and adequate hydrophobic lubricant (Magnesium stearate) prevent metal-granule adhesion.",
        guidelineReference: "Tableting Specification Manual (TSM) & EFDA Inspectorate Guidelines"
      },
      {
        id: "q-ind-4",
        question: "What is the critical testing parameter that measures the resistance of tablets to chipping and surface abrasion during blister packaging and transport?",
        options: [
          "Disintegration test",
          "Friability test (using Roche Friabilator, maximum acceptable loss < 1.0%)",
          "Dissolution paddle rotation speed",
          "Karl Fischer titration"
        ],
        correctAnswerIndex: 1,
        explanation: "Friability testing evaluates the physical durability of uncoated tablets subjected to 100 tumbling drops in a Roche Friabilator. An allowable weight loss of less than 1.0% without breaking is required by pharmacopoeias.",
        guidelineReference: "United States Pharmacopeia (USP <1216>) & Ph. Eur."
      },
      {
        id: "q-ind-5",
        question: "What is the main requirement of the Process Validation guideline in pharmaceutical manufacturing?",
        options: [
          "Testing only the very final blister pack of a batch",
          "Documented evidence providing a high degree of assurance that a process consistently produces a product meeting predetermined quality attributes (typically 3 consecutive successful commercial batches)",
          "Relying solely on retrospective customer complaints",
          "Inspecting tablets by eye under normal lighting"
        ],
        correctAnswerIndex: 1,
        explanation: "Process Validation requires establishing documented evidence across prospective commercial batches (traditionally 3 consecutive batches) proving that the manufacturing process is in a state of statistical control.",
        guidelineReference: "EFDA Guidelines on Process Validation & ICH Q8 Pharmaceutical Development"
      }
    ]
  },
  {
    id: "cpd-pharmacy-practice",
    courseCode: "PRAC-303",
    courseTitle: "Hospital & Community Pharmacy Practice & Patient Counseling",
    category: "Professional Practice",
    ceuCredits: 10,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 250,
    internationalFeeUSD: 5.00,
    durationHours: "10 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Prescription auditing, Indian Health Service (IHS) 3 Prime Questions, Medication Therapy Management (MTM), Naranjo Adverse Drug Reaction (ADR) scoring, and EFDA pharmacovigilance reporting.",
    competencyObjectives: [
      "Execute patient-centered counseling using the IHS 3 Prime Questions model.",
      "Conduct systematic prescription auditing to intercept medication errors.",
      "Calculate Naranjo probability scores for suspected Adverse Drug Reactions.",
      "Submit Yellow Card ADR reports to the EFDA Pharmacovigilance Directorate."
    ],
    questions: [
      {
        id: "q-prac-1",
        question: "What are the Indian Health Service (IHS) 3 Prime Questions utilized worldwide for interactive prescription counseling?",
        options: [
          "What is your name? How will you pay? Do you have allergies?",
          "What did your doctor tell you the medication is for? How did your doctor tell you to take it? What did your doctor tell you to expect?",
          "Can you read the label? How many pills are inside? Did you eat breakfast?",
          "Who prescribed this? When is your next appointment? Do you want a generic substitute?"
        ],
        correctAnswerIndex: 1,
        explanation: "The IHS 3 Prime Questions assess the patient's baseline understanding (Purpose, Directions, Expectations) in an open-ended dialogue, allowing the pharmacist to fill information gaps and verify patient comprehension.",
        guidelineReference: "ASHP Guidelines on Pharmacist-Conducted Patient Education and Counseling"
      },
      {
        id: "q-prac-2",
        question: "When applying the Naranjo Adverse Drug Reaction (ADR) Probability Scale, what total score indicates that an adverse event is 'Definite'?",
        options: [
          "Score of 1 to 4",
          "Score of 5 to 8",
          "Score of 9 or higher (>= 9)",
          "Score of 0 or negative"
        ],
        correctAnswerIndex: 2,
        explanation: "The Naranjo algorithm scores: >= 9 = Definite, 5-8 = Probable, 1-4 = Possible, and <= 0 = Doubtful. It assesses rechallenge, dechallenge, alternate causes, and objective confirmation.",
        guidelineReference: "WHO Collaborating Centre for International Drug Monitoring & EFDA Pharmacovigilance"
      },
      {
        id: "q-prac-3",
        question: "Which high-alert medication category requires independent double-checking by two licensed pharmacists prior to outpatient or inpatient dispensing?",
        options: [
          "Topical hydrocortisone 1% cream",
          "Intravenous concentrated electrolytes (e.g., Potassium Chloride 2 mEq/mL), chemotherapeutic agents, and concentrated Insulin",
          "Oral multivitamins and minerals",
          "Normal saline 0.9% 500 mL flush"
        ],
        correctAnswerIndex: 1,
        explanation: "The Institute for Safe Medication Practices (ISMP) high-alert list designates IV concentrated electrolytes, antineoplastics, IV anticoagulants, and insulin as medications bearing the highest risk of catastrophic patient harm when used in error.",
        guidelineReference: "ISMP High-Alert Medications List & Ethiopian Hospital Transformation Guidelines"
      },
      {
        id: "q-prac-4",
        question: "What information is mandatory on an EFDA Adverse Drug Reaction (ADR) Yellow Card report form?",
        options: [
          "Patient bank account number",
          "Identifiable patient information, suspected drug(s) with batch number, description of the adverse reaction, and reporter details",
          "Only the brand name of the drug without description of reaction",
          "Signature of the hospital CEO"
        ],
        correctAnswerIndex: 1,
        explanation: "The four minimum reporting criteria for regulatory pharmacovigilance are: an identifiable patient, an identifiable reporter, at least one suspected drug, and at least one adverse reaction/outcome.",
        guidelineReference: "EFDA Guideline for Reporting Adverse Drug Events and Medical Device Incidents"
      },
      {
        id: "q-prac-5",
        question: "What is the recommended storage temperature range for cold chain pharmaceutical products (such as Insulin vials and biological vaccines)?",
        options: [
          "-20°C to -10°C",
          "+2°C to +8°C (never frozen)",
          "+15°C to +25°C",
          "Room temperature up to 30°C"
        ],
        correctAnswerIndex: 1,
        explanation: "Pharmaceutical cold chain standard is +2°C to +8°C. Freezing (below 0°C) denatures proteins and breaks vaccine adjuvant emulsions, causing immediate loss of immunogenicity and therapeutic potency.",
        guidelineReference: "WHO Guidelines on the International Packaging and Storage of Vaccines & EFDA GMP"
      }
    ]
  },
  {
    id: "cpd-medicinal-chemistry",
    courseCode: "MEDCHEM-304",
    courseTitle: "Medicinal Chemistry, SAR & Antibacterial Mechanism Design",
    category: "Medicinal Chemistry",
    ceuCredits: 10,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 300,
    internationalFeeUSD: 6.00,
    durationHours: "10 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Structure-Activity Relationships (SAR) of beta-lactams, bioisosteric replacement, suicide beta-lactamase inhibitors (Clavulanic acid, Tazobactam), and CYP450 binding motifs.",
    competencyObjectives: [
      "Identify the 4-membered strained beta-lactam ring and mechanisms of PBP acylation.",
      "Explain the chemical mechanism of clavulanic acid suicide inactivation of beta-lactamases.",
      "Apply classical and non-classical bioisosterism in drug optimization.",
      "Analyze metabolic soft-spots and prodrug functional groups."
    ],
    questions: [
      {
        id: "q-mc-1",
        question: "Why is the beta-lactam ring in Penicillin highly reactive toward nucleophilic attack by the active-site Serine of bacterial Penicillin-Binding Proteins (PBPs)?",
        options: [
          "Due to aromatic stabilization of the thiazolidine ring",
          "Due to extreme high ring strain in the 4-membered cyclic amide and lack of resonance stabilization between nitrogen and carbonyl",
          "Because of hydrophobic bonding with lipid bilayers",
          "Because penicillin is an alkaline quaternary amine"
        ],
        correctAnswerIndex: 1,
        explanation: "The 4-membered beta-lactam ring has ~60-90° bond angles (far from normal sp2 120°), creating enormous thermodynamic ring strain. The nitrogen cannot delocalize its lone pair into the carbonyl, making the carbonyl carbon electrophilic.",
        guidelineReference: "Foye's Principles of Medicinal Chemistry 8th Edition"
      },
      {
        id: "q-mc-2",
        question: "How does Clavulanic Acid function biochemically as a 'suicide' beta-lactamase inhibitor?",
        options: [
          "It chelates the bacterial ribosome 30S subunit",
          "It acts as a mechanism-based irreversible inhibitor: after nucleophilic attack, it rearranges into a reactive species that doubly crosslinks and permanently inactivates the enzyme",
          "It binds allosterically to bacterial DNA gyrase",
          "It prevents bacterial folate synthesis via competitive DHPS block"
        ],
        correctAnswerIndex: 1,
        explanation: "Clavulanic acid is recognized as a substrate by Class A serine beta-lactamases. After attack by Ser-70, the oxopenam ring opens and rearranges to form an acyl-enzyme complex that crosslinks an active-site amino group, destroying the enzyme.",
        guidelineReference: "Silverman's Organic Chemistry of Drug Design and Drug Action"
      },
      {
        id: "q-mc-3",
        question: "What is the primary rationale for incorporating a Tetrazole ring as a bioisosteric replacement for a Carboxylic Acid group in Sartan antihypertensives (e.g., Losartan, Valsartan)?",
        options: [
          "Tetrazole increases renal toxic accumulation",
          "Tetrazole maintains planar acidic characteristics (pKa ~5-6) while enhancing lipophilicity and oral bioavailability",
          "Tetrazole completely halts metabolism by all CYP enzymes",
          "Tetrazole prevents binding to angiotensin receptors"
        ],
        correctAnswerIndex: 1,
        explanation: "The tetrazole ring is a non-classical bioisostere of carboxylic acid. It has comparable acidity (deprotonated at physiologic pH) and planar charge distribution, but is 10 times more lipophilic, greatly improving cellular penetration.",
        guidelineReference: "Patrick's Introduction to Medicinal Chemistry"
      },
      {
        id: "q-mc-4",
        question: "Which functional group on Ceftriaxone provides its unique prolonged elimination half-life (~8 hours) allowing convenient once-daily clinical dosing?",
        options: [
          "The amino-thiazole group at position 7",
          "The acidic dioxotriazine ring at position 3, which enhances high plasma protein binding (~95%)",
          "The beta-lactam carbonyl",
          "The methoxyimino substituent"
        ],
        correctAnswerIndex: 1,
        explanation: "Ceftriaxone has an acidic dioxotriazine heterocyclic group at the C3 position that confers high reversible binding to human serum albumin (85-95%), slowing renal clearance and enabling once-daily administration.",
        guidelineReference: "Goodman & Gilman & Antimicrobial Agents and Chemotherapy"
      },
      {
        id: "q-mc-5",
        question: "What chemical mechanism explains why Angiotensin-Converting Enzyme (ACE) inhibitors like Captopril, Enalaprilat, and Lisinopril coordinate with extraordinary affinity to the ACE catalytic site?",
        options: [
          "Chelation to the catalytic Zinc ion (Zn2+) via sulfhydryl, carboxylate, or phosphinate motifs",
          "Covalent alkylation of DNA guanine bases",
          "Irreversible phosphorylation of tyrosine residues",
          "Intercalation between RNA codons"
        ],
        correctAnswerIndex: 0,
        explanation: "ACE is a zinc metallopeptidase. Potent ACE inhibitors contain a zinc-binding group (ZBG) such as thiol in captopril or carboxylate in enalaprilat that directly coordinates with the active-site Zn2+ ion, mimicking the tetrahedral transition state of peptide cleavage.",
        guidelineReference: "Structure-Based Drug Design in Medicinal Chemistry"
      }
    ]
  },
  {
    id: "cpd-physical-pharmaceutics",
    courseCode: "PHYS-201",
    courseTitle: "Integrated Physical Pharmaceutics & Colloid Science",
    category: "Pharmaceutics",
    ceuCredits: 10,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 250,
    internationalFeeUSD: 5.00,
    durationHours: "10 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Noyes-Whitney dissolution kinetics, zeta potential in suspension stability, rheology and thixotropy, micellar solubilization, and liposomal delivery systems.",
    competencyObjectives: [
      "Calculate dissolution rates using the Noyes-Whitney equation.",
      "Measure Zeta Potential to evaluate electrical double layer repulsion and flocculation.",
      "Formulate non-Newtonian pharmaceutical suspensions and thixotropic gels.",
      "Calculate Critical Micelle Concentration (CMC) for surfactant systems."
    ],
    questions: [
      {
        id: "q-pp-1",
        question: "According to the Noyes-Whitney equation (dC/dt = D * A * (Cs - C) / h), which pharmaceutical formulation strategy increases the dissolution rate of a poorly water-soluble drug?",
        options: [
          "Increasing the stagnant diffusion layer thickness (h)",
          "Micronization of drug particles to drastically increase the effective surface area (A)",
          "Decreasing the saturation solubility (Cs)",
          "Formulating as an intact compressed pellet with minimal surface exposure"
        ],
        correctAnswerIndex: 1,
        explanation: "The dissolution rate is directly proportional to surface area (A). Micronization or nanosizing increases specific surface area exponentially, accelerating dissolution rate dC/dt.",
        guidelineReference: "Martin's Physical Pharmacy and Pharmaceutical Sciences 8th Edition"
      },
      {
        id: "q-pp-2",
        question: "In pharmaceutical suspension formulation, what is the critical threshold value for Zeta Potential where strong electrostatic repulsion prevents particle caking?",
        options: [
          "Between 0 and +5 mV",
          "Greater than +30 mV or more negative than -30 mV",
          "Exactly 0 mV (isoelectric point)",
          "Between -2 and -5 mV"
        ],
        correctAnswerIndex: 1,
        explanation: "When Zeta Potential exceeds +/- 30 mV, electrostatic repulsion between dispersed particles overcomes attractive van der Waals forces, preventing irreversible aggregation and tight caking.",
        guidelineReference: "Remington: The Science and Practice of Pharmacy 23rd Edition"
      },
      {
        id: "q-pp-3",
        question: "Which rheological flow behavior is considered ideal for liquid pharmaceutical suspensions and ophthalmic drops (thick at rest, but becomes fluid when shaken)?",
        options: [
          "Dilatant flow (shear-thickening)",
          "Newtonian constant viscosity flow",
          "Thixotropic plastic or pseudoplastic flow (shear-thinning with time-dependent recovery)",
          "Turbulent gas-phase flow"
        ],
        correctAnswerIndex: 2,
        explanation: "Thixotropic shear-thinning allows a suspension to maintain high viscosity at rest to prevent settling, but transforms into an easy-flowing liquid upon gentle shaking for accurate pouring or injection.",
        guidelineReference: "Martin's Physical Pharmacy Rheology Module"
      },
      {
        id: "q-pp-4",
        question: "What occurs in a surfactant solution once the Critical Micelle Concentration (CMC) is reached?",
        options: [
          "Surface tension continues to drop precipitously to zero",
          "Surfactant monomers spontaneously self-assemble into spherical micelles with hydrophobic cores, and surface tension remains nearly constant",
          "The solution completely precipitates into solid crystals",
          "The pH drops to 1.0"
        ],
        correctAnswerIndex: 1,
        explanation: "At the CMC, the air-water interface is saturated with surfactant monomers. Excess surfactant molecules aggregate into micelles with hydrophobic cores, enabling entrapment of lipophilic drug molecules.",
        guidelineReference: "Surfactants and Polymers in Aqueous Solution"
      },
      {
        id: "q-pp-5",
        question: "Why are stealth liposomes (e.g., Doxorubicin liposomal) coated with Polyethylene Glycol (PEGylation)?",
        options: [
          "To impart high fluorescent color for visual inspection",
          "To create a steric hydration barrier that prevents opsonization by plasma proteins and evades uptake by the Reticuloendothelial System (RES)",
          "To cause immediate drug release inside the stomach",
          "To act as an osmotic laxative"
        ],
        correctAnswerIndex: 1,
        explanation: "PEG chains create a flexible hydrophilic brush layer on the liposomal surface, preventing opsonin binding and macrophage clearance in the liver and spleen, extending systemic circulation time from minutes to 48-72 hours.",
        guidelineReference: "Nature Reviews Drug Discovery: Nanocarrier Technologies"
      }
    ]
  },
  {
    id: "cpd-pharmacognosy",
    courseCode: "PCOG-202",
    courseTitle: "Pharmacognosy, Phytochemistry & Traditional Ethiopian Medicine",
    category: "Natural Products",
    ceuCredits: 10,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 250,
    internationalFeeUSD: 5.00,
    durationHours: "10 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Bioactive secondary metabolites, Artemisinin from Artemisia annua, Cathinone/Cathine alkaloids from Catha edulis (Khat), cardiac glycosides, and EFDA herbal product standardization.",
    competencyObjectives: [
      "Detail the endoperoxide sesquiterpene lactone pharmacophore of Artemisinin.",
      "Explain the amphetamine-like sympathomimetic mechanism of Cathinone in Catha edulis.",
      "Standardize herbal medicine extracts according to EFDA quality monographs.",
      "Screen for toxic herbal contaminants (aflatoxins, pyrrolizidine alkaloids, heavy metals)."
    ],
    questions: [
      {
        id: "q-pc-1",
        question: "What unique chemical functional group in the antimalarial Artemisinin (extracted from Artemisia annua) is responsible for generating toxic carbon-centered free radicals in the presence of intraerythrocytic heme iron?",
        options: [
          "A phenolic hydroxyl group",
          "A 1,2,4-trioxane endoperoxide bridge",
          "A quaternary ammonium group",
          "A beta-lactam ring"
        ],
        correctAnswerIndex: 1,
        explanation: "The pharmacophore of artemisinin is an endoperoxide bridge (C-O-O-C). In malaria-infected red blood cells, iron (Fe2+) from digested hemoglobin cleaves this endoperoxide bond, forming lethal alkylating free radicals that destroy Plasmodium proteins.",
        guidelineReference: "Trease and Evans Pharmacognosy 16th Edition & WHO Malaria Treatment Guidelines"
      },
      {
        id: "q-pc-2",
        question: "What is the primary psychoactive alkaloid found in fresh leaves of Catha edulis (Khat) that acts as an indirect-acting sympathomimetic releasing dopamine and norepinephrine?",
        options: [
          "Quinine",
          "S-(-)-Cathinone",
          "Reserpine",
          "Strychnine"
        ],
        correctAnswerIndex: 1,
        explanation: "Fresh khat contains S-(-)-cathinone, an amphetamine-like phenylalkylamine alkaloid. As leaves dry, cathinone decomposes into the much weaker psychostimulant cathine (+-norpseudoephedrine).",
        guidelineReference: "United Nations Office on Drugs and Crime (UNODC) Bulletin on Narcotics"
      },
      {
        id: "q-pc-3",
        question: "Cardiac glycosides (such as Digoxin from Digitalis purpurea) exert positive inotropy by primarily inhibiting which myocardial membrane transport protein?",
        options: [
          "L-type Calcium channel",
          "Sarcolemmal Na+/K+ ATPase pump",
          "Sarcoplasmic reticulum SERCA pump",
          "Sodium-Glucose co-transporter 2"
        ],
        correctAnswerIndex: 1,
        explanation: "Digoxin reversibly inhibits the myocardial Na+/K+ ATPase pump, increasing intracellular Na+. This slows the Na+/Ca2+ exchanger (NCX), leading to accumulated intracellular Ca2+ stored in the sarcoplasmic reticulum for enhanced systolic contraction.",
        guidelineReference: "Brunton & Hilal-Dandan Goodman & Gilman's Manual of Pharmacology"
      },
      {
        id: "q-pc-4",
        question: "Under EFDA quality standards for botanical medicines, what is the maximum permissible limit for carcinogenic Aflatoxin B1 in commercial herbal raw materials?",
        options: [
          "5 micrograms per kilogram (5 ppb)",
          "500 micrograms per kilogram",
          "1 milligram per gram",
          "No limit is established"
        ],
        correctAnswerIndex: 0,
        explanation: "EFDA and international pharmacopoeias enforce strict mycotoxin limits: Aflatoxin B1 must not exceed 5 ppb (mcg/kg), and total aflatoxins (B1 + B2 + G1 + G2) must not exceed 10 ppb due to high risk of hepatocellular carcinoma.",
        guidelineReference: "EFDA Quality Standards for Herbal Medicinal Products & WHO Guidelines"
      },
      {
        id: "q-pc-5",
        question: "From which medicinal plant was the potent antineoplastic Vincristine and Vinblastine originally isolated?",
        options: [
          "Taxus baccata (Pacific Yew)",
          "Catharanthus roseus (Madagascar Periwinkle)",
          "Podophyllum peltatum",
          "Cinchona succirubra"
        ],
        correctAnswerIndex: 1,
        explanation: "Vincristine and vinblastine are bisindole alkaloids isolated from Catharanthus roseus (formerly Vinca rosea). They bind to tubulin dimers, inhibiting microtubule assembly and arresting tumor cells in metaphase.",
        guidelineReference: "Natural Products as Sources of New Drugs over the Nearly Four Decades"
      }
    ]
  },
  {
    id: "cpd-internship-practice",
    courseCode: "INTERN-501",
    courseTitle: "Clinical Pharmacy Clerkship, Ward Rounds & SOAP Documentation",
    category: "Clinical Clerkship",
    ceuCredits: 15,
    accreditationAuthority: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
    standardFeeETB: 500,
    internationalFeeUSD: 10.00,
    durationHours: "15 Accredited Credit Hours",
    passingScorePercent: 70,
    description: "Multidisciplinary ICU ward rounds, the FAST-HUGS BID critical care bundle, Cockcroft-Gault CrCl calculations, antimicrobial stewardship, and SOAP note writing.",
    competencyObjectives: [
      "Conduct systematic ICU and internal medicine ward rounds with the FAST-HUGS BID checklist.",
      "Calculate CrCl with Cockcroft-Gault using adjusted body weight (AdjBW) in obesity.",
      "Construct defendable SOAP notes for patient charts.",
      "Execute therapeutic antibiotic de-escalation based on microbiological culture and sensitivity."
    ],
    questions: [
      {
        id: "q-int-1",
        question: "In the critical care FAST-HUGS BID daily ICU bundle, what does the 'FAST' portion stand for?",
        options: [
          "Fever, Antibiotics, Sepsis, Tracheostomy",
          "Feeding, Analgesia, Sedation, Thromboembolism prophylaxis",
          "Fluid balance, Arterial line, Suctioning, Temperature",
          "Fast heart rate, Airway, Shock, Trauma"
        ],
        correctAnswerIndex: 1,
        explanation: "Vincent's FAST-HUGS BID bundle: Feeding (enteral nutrition), Analgesia (pain control), Sedation (light sedation), Thromboembolism prophylaxis, Head-of-bed elevation, Ulcer prophylaxis, Glucose control, Spontaneous breathing trial, Bowel care, Indwelling catheters, De-escalation.",
        guidelineReference: "Critical Care Medicine Guidelines & Vincent JL Critical Care Bundle"
      },
      {
        id: "q-int-2",
        question: "When calculating estimated Creatinine Clearance (CrCl) with Cockcroft-Gault for an obese patient whose actual weight exceeds 120% of Ideal Body Weight (IBW), which weight must be utilized to avoid drug overdosing?",
        options: [
          "Actual total body weight (TBW)",
          "Adjusted Body Weight (AdjBW = IBW + 0.4 * [TBW - IBW])",
          "Body Mass Index (BMI)",
          "A fixed constant weight of 70 kg"
        ],
        correctAnswerIndex: 1,
        explanation: "In obese patients, excess weight is adipose tissue that does not produce creatinine in proportion to muscle mass. Using TBW overestimates GFR, while IBW underestimates it. Adjusted Body Weight with a 0.4 factor is standard GDMT practice.",
        guidelineReference: "KDIGO Clinical Practice Guideline for Evaluation and Management of CKD"
      },
      {
        id: "q-int-3",
        question: "In writing a Clinical Pharmacy SOAP Note, under which section must subjective complaints, patient self-reported pain score, and history of present illness be documented?",
        options: [
          "Plan (P)",
          "Objective (O)",
          "Subjective (S)",
          "Assessment (A)"
        ],
        correctAnswerIndex: 2,
        explanation: "The 'S' (Subjective) section contains information provided by the patient or caregiver that cannot be directly measured by clinical instruments (e.g., patient complaints, symptom descriptions, reported compliance).",
        guidelineReference: "American College of Clinical Pharmacy (ACCP) Clinical Documentation Standards"
      },
      {
        id: "q-int-4",
        question: "A hospitalized patient with sepsis has blood cultures growing Klebsiella pneumoniae sensitive to Ceftriaxone, Ciprofloxacin, and Meropenem. The patient was initially started on empirical Meropenem. What is the Clinical Pharmacist's primary role under Antimicrobial Stewardship?",
        options: [
          "Recommend adding Vancomycin and Colistin simultaneously",
          "Recommend de-escalating Meropenem to targeted narrow-spectrum Ceftriaxone IV to preserve carbapenems and prevent resistance",
          "Stop all antibiotics immediately",
          "Continue Meropenem for 6 weeks regardless of cultures"
        ],
        correctAnswerIndex: 1,
        explanation: "Antimicrobial stewardship mandates de-escalation: switching from broad-spectrum carbapenems (WHO Watch/Reserve) to narrow-spectrum targeted agents (Ceftriaxone) once microbiological susceptibilities are confirmed.",
        guidelineReference: "WHO AWaRe Classification Guidelines & Ethiopian MoH National AMR Strategy"
      },
      {
        id: "q-int-5",
        question: "Which clinical parameter is the most sensitive early indicator of aminoglycoside (e.g., Gentamicin, Amikacin) induced acute tubular necrosis?",
        options: [
          "Elevated serum bilirubin",
          "Non-oliguric rise in serum creatinine (typically occurring after 5 to 7 days of therapy) and elevated trough concentrations",
          "Sudden drop in platelet count",
          "Hypoglycemia"
        ],
        correctAnswerIndex: 1,
        explanation: "Aminoglycoside nephrotoxicity typically manifests after 5-7 days of accumulation in proximal renal tubular cells as a non-oliguric decline in GFR. Elevated trough levels (>2 mcg/mL for gentamicin) are the strongest predictor.",
        guidelineReference: "IDSA Guidelines on Antimicrobial Therapeutic Drug Monitoring & Nephrotoxicity"
      }
    ]
  }
];
