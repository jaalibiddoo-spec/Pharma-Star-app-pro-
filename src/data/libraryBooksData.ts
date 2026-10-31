export interface BookSection {
  heading: string;
  content: string;
  clinicalPearls?: string[];
  tables?: {
    title?: string;
    headers: string[];
    rows: string[][];
  };
  algorithmSteps?: string[];
}

export interface LibraryBookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  pages: string;
  estimatedReadTime: string;
  keyThemes: string[];
  sections: BookSection[];
}

export interface LibraryBook {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  edition: string;
  publicationYear: number;
  category: 'clinical' | 'formularies' | 'pharmacopeia' | 'interactions' | 'basic_sciences' | 'toxicology';
  categoryLabel: string;
  coverColor: string; // Tailwind gradient or hex
  spineBg: string;
  textColor: string;
  accentBadgeColor: string;
  pagesCount: number;
  isbn: string;
  publisher: string;
  description: string;
  targetAudience: string;
  rating: number;
  reviewsCount: number;
  hasAudioNarration?: boolean;
  chapters: LibraryBookChapter[];
}

export const libraryBooksData: LibraryBook[] = [
  {
    id: 'dipiro-pharmacotherapy',
    title: "DiPiro's Pharmacotherapy",
    subtitle: "A Pathophysiologic Approach - Global Clinical Standard",
    authors: "Joseph T. DiPiro, Terry L. Schwinghammer, Cecily V. DiPiro, et al.",
    edition: "12th Edition",
    publicationYear: 2023,
    category: 'clinical',
    categoryLabel: 'Clinical Pharmacy & Therapeutics',
    coverColor: 'from-blue-900 via-indigo-950 to-slate-900',
    spineBg: 'bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 border-l border-blue-400/40 border-r border-indigo-950',
    textColor: 'text-amber-300',
    accentBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    pagesCount: 2848,
    isbn: '978-1264264544',
    publisher: 'McGraw-Hill Medical',
    rating: 4.9,
    reviewsCount: 1420,
    hasAudioNarration: true,
    description: "The gold-standard reference worldwide for clinical therapeutics and evidence-based guideline-directed medical pharmacotherapy. Covers pathophysiology, organ dysfunction dose adjustments, target monitoring, and comprehensive patient case management across all organ systems.",
    targetAudience: "Clinical Pharmacists, Clinical Pharmacy Students, Internal Medicine Residents & Physicians",
    chapters: [
      {
        id: 'dipiro-ch1-hfref',
        chapterNumber: 1,
        title: "Heart Failure with Reduced Ejection Fraction (HFrEF) - 4-Pillar GDMT",
        pages: "pp. 142-188",
        estimatedReadTime: "25 min",
        keyThemes: ["HFrEF", "GDMT 4 Pillars", "Sacubitril/Valsartan", "SGLT2i", "Target Titration", "Electrolyte Monitoring"],
        sections: [
          {
            heading: "1. The 4-Pillar Guideline-Directed Medical Therapy (GDMT) Paradigm",
            content: "Modern management of HFrEF (LVEF ≤ 40%) has transitioned from sequential step-therapy to rapid simultaneous or rapid-sequence initiation of four foundational drug classes shown to significantly reduce all-cause mortality, cardiovascular hospitalization, and reverse cardiac remodeling within 30 days of initiation.\n\nThe 4 foundational pillars comprise:\n1. Angiotensin Receptor-Neprilysin Inhibitor (ARNI - Sacubitril/Valsartan) preferred over ACEi/ARB.\n2. Evidence-based Beta-Blocker (Carvedilol, Metoprolol Succinate extended-release, or Bisoprolol).\n3. Mineralocorticoid Receptor Antagonist (MRA - Spironolactone or Eplerenone).\n4. SGLT2 Inhibitor (Dapagliflozin 10 mg daily or Empagliflozin 10 mg daily, regardless of diabetic status).",
            clinicalPearls: [
              "ARNI Washout Rule: When switching from an ACE inhibitor to Sacubitril/Valsartan, a mandatory 36-hour washout period is required to prevent life-threatening angioedema caused by dual bradykinin breakdown inhibition.",
              "eGFR Fall Expectation: A transient serum creatinine increase of up to 30% after starting an ARNI, ACEi, or SGLT2i represents hemodynamic intraglomerular pressure reduction and is nephroprotective rather than acute intrinsic renal damage.",
              "Beta-blocker starting rule: Never initiate or uptitrate beta-blockers in decompensated, wet/cold heart failure. The patient must be euvolemic before uptitration."
            ],
            tables: {
              title: "GDMT 4-Pillar Dosing, Titration & Lab Monitoring Matrix",
              headers: ["Drug Class & Agent", "Starting Dose", "Target Titration Dose", "Monitoring Parameters"],
              rows: [
                ["ARNI: Sacubitril/Valsartan", "24/26 mg or 49/51 mg PO BID", "97/103 mg PO BID", "BP, Serum K+, eGFR at 1-2 wks; 36h ACEi washout"],
                ["Beta-Blocker: Carvedilol", "3.125 mg PO BID", "25 mg PO BID (50 mg if >85kg)", "Heart rate (target 55-65 bpm), BP, fluid retention"],
                ["Beta-Blocker: Metoprolol Succinate", "12.5 - 25 mg PO daily", "200 mg PO daily", "Heart rate, BP; do not confuse with Tartrate!"],
                ["MRA: Spironolactone", "12.5 - 25 mg PO daily", "25 - 50 mg PO daily", "Serum K+ (hold if >5.0 mEq/L), eGFR (<30 ml/min avoid)"],
                ["SGLT2i: Dapagliflozin / Empagliflozin", "10 mg PO daily (fixed dose)", "10 mg PO daily (no titration)", "Urine output, genital mycotic hygiene, euglycemic DKA"]
              ]
            },
            algorithmSteps: [
              "Step 1: Confirm LVEF ≤ 40% via Echocardiography; assess volume status (JVP, peripheral edema, lung crackles).",
              "Step 2: Start SGLT2i (Dapagliflozin 10mg) + low-dose Beta-Blocker immediately if stable.",
              "Step 3: Add Sacubitril/Valsartan (verify 36-hour ACEi washout if applicable); check baseline K+ and CrCl.",
              "Step 4: Add Spironolactone 12.5-25mg if serum K+ < 5.0 mEq/L and eGFR > 30 mL/min/1.73m².",
              "Step 5: Up-titrate every 2 to 4 weeks toward target GDMT doses while monitoring blood pressure and renal labs."
            ]
          },
          {
            heading: "2. Secondary Add-on Therapies & Device Interventions",
            content: "For patients who remain symptomatic (NYHA Class II-IV) despite target 4-pillar GDMT:\n- Ivabradine (hyperpolarization-activated cyclic nucleotide-gated channel blocker): Indicated for sinus rhythm with resting heart rate ≥ 70 bpm on maximally tolerated beta-blocker.\n- Vericiguat (soluble guanylate cyclase stimulator): Indicated for high-risk patients following a recent heart failure hospitalization.\n- Hydralazine plus Isosorbide Dinitrate: Recommended for self-identified Black patients with persistent NYHA Class III-IV symptoms as an add-on, or in patients unable to tolerate RAS inhibitors due to severe renal impairment or hyperkalemia.",
            clinicalPearls: [
              "Digoxin Role: Does not decrease mortality, but significantly reduces heart failure hospitalizations. Maintain narrow therapeutic serum concentration of 0.5 - 0.9 ng/mL. Toxicity increases markedly with hypokalemia or hypomagnesemia."
            ]
          }
        ]
      },
      {
        id: 'dipiro-ch2-antimicrobials',
        chapterNumber: 2,
        title: "Pneumonia & Antimicrobial Stewardship: Vancomycin AUC/MIC & CAP/HAP Guidelines",
        pages: "pp. 1620-1668",
        estimatedReadTime: "22 min",
        keyThemes: ["CAP", "HAP/VAP", "Vancomycin AUC/MIC", "Antimicrobial Stewardship", "Procalcitonin", "MRSA Coverage"],
        sections: [
          {
            heading: "1. Community-Acquired Pneumonia (CAP) Treatment Pathways",
            content: "Empiric antimicrobial selection for CAP depends upon disease severity (CURB-65 or Pneumonia Severity Index - PSI), patient comorbidities, and risk factors for Pseudomonas aeruginosa or MRSA.\n\nOutpatient regimens for healthy adults without cardiopulmonary comorbidities:\n- Amoxicillin 1 g PO TID OR Doxycycline 100 mg PO BID.\n- Macrolide monotherapy (Azithromycin 500 mg day 1, then 250 mg daily) is only recommended in regions where pneumococcal macrolide resistance is documented to be < 25%.\n\nOutpatient with comorbidities (COPD, DM, CKD, CHF, alcoholism) or Inpatient Non-Severe CAP:\n- Combination: Beta-lactam (Amoxicillin-Clavulanate 875/125 mg BID or Cefuroxime/Ceftriaxone IV) PLUS Macrolide (Azithromycin) or Doxycycline.\n- Monotherapy alternative: Respiratory fluoroquinolone (Levofloxacin 750 mg daily or Moxifloxacin 400 mg daily).",
            clinicalPearls: [
              "Fluoroquinolone Black Box Warnings: Avoid respiratory fluoroquinolones when safe alternatives exist due to risks of tendinitis/tendon rupture, peripheral neuropathy, aortic aneurysm rupture/dissection, and glycemic fluctuations.",
              "Aspiration Pneumonia: Routine anaerobic coverage (e.g., adding clindamycin or metronidazole) is no longer recommended for suspected aspiration pneumonia unless lung abscess or empyema is documented."
            ],
            tables: {
              title: "Hospital-Acquired & Ventilator-Associated Pneumonia (HAP/VAP) Empiric Matrix",
              headers: ["Clinical Presentation", "Gram-Negative Pathogen Coverage", "MRSA Pathogen Coverage", "Duration of Therapy"],
              rows: [
                ["HAP without high risk of mortality & no MRSA risk", "Piperacillin-Tazobactam 4.5g IV q6h OR Cefepime 2g IV q8h", "Not required (unless MRSA nasal swab positive)", "7 days (guided by procalcitonin)"],
                ["HAP with prior IV antibiotic in 90 days or MRSA >20%", "Double antipseudomonal: Cefepime + Ciprofloxacin/Levofloxacin OR Amikacin", "Vancomycin (AUC 400-600) OR Linezolid 600mg IV/PO q12h", "7 days if clinical stability achieved"],
                ["Severe VAP or Septic Shock", "Meropenem 1g IV q8h extended 3h infusion + Tobramycin 7mg/kg", "Vancomycin target AUC/MIC 400-600 or Linezolid 600mg q12h", "7-8 days; de-escalate based on cultures"]
              ]
            }
          },
          {
            heading: "2. Precision Vancomycin AUC/MIC Dosing Protocol",
            content: "Consensus guidelines by ASHP, IDSA, PIDS, and SIDP deprecate traditional trough-only monitoring (15-20 mcg/mL) for severe MRSA infections due to demonstrated excess acute kidney injury (AKI) without improved clinical efficacy.\n\nThe therapeutic target is an Area Under the Curve to Minimum Inhibitory Concentration ratio (AUC24/MIC) of 400 to 600 mg·h/L (assuming automated MIC = 1 mg/L).\n\nPractical implementation uses Bayesian software estimation or a two-point pharmacokinetic peak-and-trough calculation using first-order elimination equations.",
            clinicalPearls: [
              "Nephrotoxicity threshold: Sustained AUC > 650 mg·h/L or troughs > 20 mcg/mL dramatically multiply nephrotoxicity, particularly when co-administered with Piperacillin-Tazobactam, aminoglycosides, or IV iodinated contrast."
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'goodman-gilman',
    title: "Goodman & Gilman's Therapeutics",
    subtitle: "The Pharmacological Basis of Therapeutics - Molecular to Clinical",
    authors: "Laurence L. Brunton, Björn C. Knollmann, Randa Hilal-Dandan",
    edition: "14th Edition",
    publicationYear: 2023,
    category: 'basic_sciences',
    categoryLabel: 'Pharmacology & Molecular Therapeutics',
    coverColor: 'from-emerald-950 via-teal-950 to-slate-900',
    spineBg: 'bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 border-l border-emerald-400/40 border-r border-teal-950',
    textColor: 'text-emerald-300',
    accentBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    pagesCount: 1680,
    isbn: '978-1264258079',
    publisher: 'McGraw-Hill Education',
    rating: 5.0,
    reviewsCount: 980,
    hasAudioNarration: true,
    description: "Known affectionately as the 'Blue Bible' of pharmacology. Provides definitive, unmatched depth on molecular pharmacology, receptor dynamics, second-messenger signaling, pharmacokinetics, and the molecular mechanisms of all major drug classes.",
    targetAudience: "Pharmacologists, Pharmacy & Medical Students, Clinical Researchers, Specialist Clinicians",
    chapters: [
      {
        id: 'gg-ch1-kinetics',
        chapterNumber: 1,
        title: "Pharmacokinetics, Drug Transporters & Clearance Dynamics",
        pages: "pp. 1-46",
        estimatedReadTime: "30 min",
        keyThemes: ["Clearance (CL)", "Volume of Distribution (Vd)", "P-glycoprotein", "CYP450 Enzymology", "Half-Life (t1/2)"],
        sections: [
          {
            heading: "1. Quantitative Pharmacokinetic Relationships",
            content: "Pharmacokinetics governs the time course of drug absorption, distribution, metabolism, and excretion. Clearance ($CL$) is the single most important parameter in determining maintenance dosage regimens, defining the volume of biological fluid cleared of drug per unit time.\n\nFundamental mathematical relationships:\n- Clearance: $CL = k_e \\times V_d = \\frac{\\text{Dose} \\times F}{\\text{AUC}}$\n- Elimination Half-life: $t_{1/2} = \\frac{0.693 \\times V_d}{CL}$\n- Steady-State Concentration: $C_{ss} = \\frac{F \\times \\text{Dose}}{\\tau \\times CL}$ (where $\\tau$ is the dosing interval and $F$ is bioavailability).\n- Time to reach steady state: ~4 to 5 half-lives, independent of dosage size.\n- Loading Dose: $LD = \\frac{V_d \\times C_{\\text{target}}}{F}$",
            clinicalPearls: [
              "Clearance is additive: Systemic clearance represents the sum of organ clearances: $CL_{\\text{total}} = CL_{\\text{renal}} + CL_{\\text{hepatic}} + CL_{\\text{pulmonary}} + CL_{\\text{biliary}}$.",
              "Volume of Distribution anomaly: Drugs with high tissue affinity or lipid partitioning (e.g., Amiodarone $V_d \\approx 60\\text{ L/kg}$, Digoxin $V_d \\approx 7\\text{ L/kg}$) exhibit apparent volumes of distribution far exceeding total anatomical body water (0.6 L/kg)."
            ],
            tables: {
              title: "Key Pharmacokinetic Parameters of Essential Clinical Drugs",
              headers: ["Drug Entity", "Bioavailability (F)", "Volume of Distribution (Vd)", "Elimination Route", "Half-Life (t1/2)"],
              rows: [
                ["Digoxin", "70-80% (tablets)", "6 - 7 L/kg", "Renal filtration & P-gp secretion (70%)", "36 - 48 hours (longer in CKD)"],
                ["Warfarin", ">95%", "0.14 L/kg (highly protein bound)", "Hepatic CYP2C9 & CYP3A4", "36 - 42 hours"],
                ["Gentamicin", "<1% oral (must be parenteral)", "0.25 L/kg (extracellular fluid)", "Glomerular filtration exclusively (>95%)", "2 - 3 hours (normal eGFR)"],
                ["Phenytoin", ">90%", "0.65 L/kg", "Hepatic CYP2C9 / CYP2C19 (Michaelis-Menten)", "Variable (7 - 42 hours, non-linear)"]
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'ethiopian-stg-hospital',
    title: "Ethiopian National Standard Treatment Guidelines",
    subtitle: "For General Hospitals - 4th Edition (Official MoH / EFDA)",
    authors: "Ministry of Health Ethiopia (MoH), Ethiopian Food & Drug Authority (EFDA)",
    edition: "4th Edition (Latest Comprehensive)",
    publicationYear: 2024,
    category: 'formularies',
    categoryLabel: 'Ethiopian National STGs & Formularies',
    coverColor: 'from-amber-950 via-yellow-950 to-slate-900',
    spineBg: 'bg-gradient-to-b from-emerald-800 via-amber-800 to-rose-900 border-l border-amber-400/40 border-r border-slate-900',
    textColor: 'text-amber-200',
    accentBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    pagesCount: 840,
    isbn: 'EFDA-STG-2024-GH',
    publisher: 'Federal Ministry of Health (FMoH) Ethiopia & EFDA',
    rating: 4.95,
    reviewsCount: 3100,
    hasAudioNarration: true,
    description: "The authoritative, legally binding national clinical protocol for hospital prescribing and dispensing across all public and private healthcare tiers in Ethiopia. Fully harmonized with the Ethiopian Essential Medicine List (EML) and WHO guidelines.",
    targetAudience: "All Ethiopian Healthcare Providers, Pharmacists, Druggists, Medical Interns, Health Officers",
    chapters: [
      {
        id: 'stg-ch1-malaria',
        chapterNumber: 1,
        title: "Malaria Clinical Management & Elimination Protocols in Ethiopia",
        pages: "pp. 82-106",
        estimatedReadTime: "18 min",
        keyThemes: ["Artemether-Lumefantrine", "Severe Malaria Artesunate", "P. vivax Radical Cure", "Primaquine", "G6PD Screening"],
        sections: [
          {
            heading: "1. Diagnosis and Stratification of Malaria",
            content: "In Ethiopia, malaria transmission is predominantly caused by Plasmodium falciparum (approx 60-70%) and Plasmodium vivax (approx 30-40%). Every suspected case must undergo parasitological confirmation via Giemsa-stained blood film microscopy or Rapid Diagnostic Test (RDT) prior to antimalarial administration.\n\nPresumptive clinical treatment without lab testing is strictly prohibited except in remote emergency setups where diagnostics are temporarily inaccessible.",
            clinicalPearls: [
              "Food Intake with Coartem: Artemether-Lumefantrine absorption is strictly fat-dependent. Patients or caregivers must be counseled to take tablets with milk or fatty meal to avoid therapeutic failure and resistance selection.",
              "Severe Malaria Artesunate Dosing: Administer IV/IM Artesunate 2.4 mg/kg at 0, 12, and 24 hours, then once daily until the patient can tolerate oral medication (minimum 3 parenteral doses)."
            ],
            tables: {
              title: "Ethiopian National Antimalarial First-Line Regimens",
              headers: ["Species / Condition", "First-Line Medicine", "Dosing Schedule & Regimen", "Key Precautions"],
              rows: [
                ["Uncomplicated P. falciparum", "Artemether + Lumefantrine (Coartem 20/120mg)", "6-dose regimen over 3 days (based on weight bands)", "Administer with fatty meal or milk; avoid in 1st trimester if oral quinine available"],
                ["Uncomplicated P. vivax", "Chloroquine + Primaquine", "CQ: 25mg base/kg over 3 days PLUS PQ: 0.25mg base/kg daily for 14 days", "Primaquine prevents hypnozoite relapses; screen/observe for G6PD hemolytic anemia"],
                ["Severe Malaria (All Species)", "Artesunate IV or IM", "2.4 mg/kg at 0h, 12h, 24h, then q24h until oral therapy tolerated", "Follow with full 3-day course of Artemether-Lumefantrine when awake"]
              ]
            }
          },
          {
            heading: "2. Tuberculosis & Multi-Drug Resistant TB (MDR-TB) BPaLM Protocol",
            content: "Ethiopian National TB Guidelines have adopted the revolutionary 6-month all-oral BPaLM regimen for Rifampicin-Resistant / MDR-TB:\n- BPaLM components: Bedaquiline (400 mg daily for 2 wks, then 200 mg 3x/wk), Pretomanid (200 mg daily), Linezolid (600 mg daily), and Moxifloxacin (400 mg daily) for 24 weeks.\n\nThis completely replaces the toxic 18-to-24-month injectable regimens (kanamycin/amikacin) that caused irreversible hearing loss in over 40% of patients.",
            clinicalPearls: [
              "Linezolid Monitoring: Monitor complete blood count (CBC) every 2 weeks for myelosuppression and screen for peripheral/optic neuropathy. Reduce dose to 300 mg daily if toxicity emerges."
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'british-pharmacopoeia',
    title: "British Pharmacopoeia (BP 2024)",
    subtitle: "Medicinal Substances, Formulations & Quality Standards",
    authors: "British Pharmacopoeia Commission & Medicines and Healthcare products Regulatory Agency (MHRA)",
    edition: "BP 2024 Consolidated",
    publicationYear: 2024,
    category: 'pharmacopeia',
    categoryLabel: 'Pharmacopeias & Compounding Formularies',
    coverColor: 'from-rose-950 via-red-950 to-slate-900',
    spineBg: 'bg-gradient-to-b from-rose-900 via-red-900 to-slate-900 border-l border-rose-400/40 border-r border-slate-900',
    textColor: 'text-rose-200',
    accentBadgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    pagesCount: 4200,
    isbn: '978-0113231126',
    publisher: 'The Stationery Office (TSO) on behalf of MHRA',
    rating: 4.85,
    reviewsCount: 640,
    hasAudioNarration: true,
    description: "The official statutory collection of standards for UK and Commonwealth medicinal products and pharmaceutical substances. Essential for hospital compounding, industrial formulation, quality assurance, and pharmacopeial assays.",
    targetAudience: "Compounding Pharmacists, Quality Control Analysts, Formulation Scientists, Regulatory Officers",
    chapters: [
      {
        id: 'bp-ch1-compounding',
        chapterNumber: 1,
        title: "Extemporaneous Compounding & Semisolid Dosage Vehicles",
        pages: "Vol II, pp. 410-455",
        estimatedReadTime: "20 min",
        keyThemes: ["Extemporaneous Compounding", "Ointments", "Creams", "HLB System", "Beyond-Use Dating (BUD)"],
        sections: [
          {
            heading: "1. Classification and Preparation of Dermatological Bases",
            content: "According to the British Pharmacopoeia, semisolid dosage forms are classified into four major physicochemical groups:\n1. Hydrocarbon / Oleaginous bases (e.g., White Soft Paraffin BP, Liquid Paraffin BP) - anhydrous, emollient, occlusive, non-water washable.\n2. Absorption bases (e.g., Wool Fat / Lanolin BP, Hydrous Ointment BP) - can absorb water or aqueous solutions to form w/o emulsions.\n3. Water-removable / Emulsion bases (e.g., Aqueous Cream BP, Cetomacrogol Cream BP) - o/w emulsions, easily washed from skin.\n4. Water-soluble bases (e.g., Macrogol Ointment BP / Polyethylene Glycols) - greaseless, completely water washable.",
            clinicalPearls: [
              "Beyond-Use Dating (BUD) Rule: Water-containing oral formulations: BUD ≤ 14 days stored in refrigerator (2-8°C). Water-containing topical/semisolid formulations: BUD ≤ 30 days at room temperature. Non-aqueous formulations: BUD ≤ 6 months or earliest ingredient expiry."
            ],
            tables: {
              title: "BP Master Formulation: Aqueous Cream BP (Emulsifying Base)",
              headers: ["Ingredient Name", "Pharmacopeial Grade", "Master Formula % w/w", "Functional Purpose"],
              rows: [
                ["Emulsifying Ointment BP", "BP Standard", "30.0 g", "Primary lipid phase & emulsifier"],
                ["Phenoxyethanol BP", "Analytical Grade", "1.0 g", "Antimicrobial preservative"],
                ["Purified Water BP", "Freshly boiled & cooled", "To 100.0 g", "Continuous aqueous phase"]
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'stockleys-interactions',
    title: "Stockley's Drug Interactions",
    subtitle: "The Most Comprehensive Guide to Drug Interactions in Clinical Practice",
    authors: "Claire L. Preston (Chief Editor) & Royal Pharmaceutical Society",
    edition: "13th Edition",
    publicationYear: 2023,
    category: 'interactions',
    categoryLabel: 'Drug Interactions & Toxicology',
    coverColor: 'from-amber-900 via-orange-950 to-slate-900',
    spineBg: 'bg-gradient-to-b from-amber-900 via-orange-900 to-slate-900 border-l border-amber-400/40 border-r border-slate-900',
    textColor: 'text-amber-300',
    accentBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    pagesCount: 1920,
    isbn: '978-0857114228',
    publisher: 'Pharmaceutical Press (Royal Pharmaceutical Society)',
    rating: 4.95,
    reviewsCount: 880,
    hasAudioNarration: true,
    description: "The global authority on drug-drug, drug-herb, and drug-food interactions. Delivers critical mechanism breakdowns, clinical significance ratings, and actionable clinician management plans.",
    targetAudience: "Clinical Pharmacists, Prescribers, Drug Information Specialists, Hospital Pharmacy Teams",
    chapters: [
      {
        id: 'stockley-ch1-cyp-inhibition',
        chapterNumber: 1,
        title: "Cytochrome P450 Enzymes & P-Glycoprotein Pharmacokinetic Interactions",
        pages: "pp. 1-52",
        estimatedReadTime: "24 min",
        keyThemes: ["CYP3A4", "CYP2D6", "P-gp Efflux", "Clarithromycin", "Simvastatin Rhabdomyolysis", "DOACs"],
        sections: [
          {
            heading: "1. The High-Risk CYP3A4 & P-gp Interaction Axis",
            content: "Cytochrome P450 3A4 (CYP3A4) metabolizes over 50% of prescription medications in the gut mucosa and liver. Co-administration of strong CYP3A4 and P-gp inhibitors (e.g., Ketoconazole, Itraconazole, Clarithromycin, Ritonavir, Cobicistat) produces catastrophic increases in systemic exposure of sensitive substrates.\n\nClassic Fatal Interaction: Simvastatin / Lovastatin + Clarithromycin.\nClarithromycin increases Simvastatin plasma AUC by over 10-fold to 12-fold, precipitating acute severe rhabdomyolysis, myoglobinuric acute tubular necrosis, and fatal renal failure.",
            clinicalPearls: [
              "Safe Statin Alternatives: Rosuvastatin and Pravastatin are not significantly metabolized by CYP3A4 (Pravastatin undergoes sulfation; Rosuvastatin is primarily CYP2C9 minor), making them the statins of choice during macrolide or protease-inhibitor therapy."
            ],
            tables: {
              title: "Critical High-Alert Pharmacokinetic Interaction Matrix",
              headers: ["Precipitant Drug", "Object Drug", "Observed Effect", "Clinical Management Protocol"],
              rows: [
                ["Clarithromycin / Itraconazole", "Simvastatin / Lovastatin", "10-12x rise in statin AUC; rhabdomyolysis", "CONTRAINDICATED. Switch to Rosuvastatin or hold statin during antibiotic course"],
                ["Rifampicin / Carbamazepine", "Apixaban / Rivaroxaban", "50-60% drop in DOAC levels; thromboembolism", "CONTRAINDICATED. Use adjusted-dose parenteral LMWH or Warfarin with INR monitoring"],
                ["Amiodarone", "Warfarin", "Doubles Warfarin AUC; major bleeding", "Preemptively reduce Warfarin dose by 30-50% upon starting Amiodarone; monitor INR twice weekly"],
                ["Fluconazole", "Phenytoin", "Phenytoin toxicity (ataxia, nystagmus, coma)", "Reduce Phenytoin dose by 25-50%; monitor free phenytoin serum levels"]
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'goldfranks-toxicology',
    title: "Goldfrank's Toxicologic Emergencies",
    subtitle: "The Definitive Reference for Clinical Toxicology & Poisoning",
    authors: "Lewis S. Nelson, Mary Ann Howland, Neal A. Lewin, Silas W. Smith, et al.",
    edition: "11th Edition",
    publicationYear: 2022,
    category: 'toxicology',
    categoryLabel: 'Toxicology & Emergency Medicine',
    coverColor: 'from-slate-950 via-zinc-950 to-neutral-900',
    spineBg: 'bg-gradient-to-b from-neutral-900 via-zinc-900 to-black border-l border-red-500/50 border-r border-neutral-950',
    textColor: 'text-red-400',
    accentBadgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    pagesCount: 2064,
    isbn: '978-1259859618',
    publisher: 'McGraw-Hill Education',
    rating: 4.9,
    reviewsCount: 520,
    hasAudioNarration: true,
    description: "The gold-standard encyclopedia for toxicological emergencies, clinical toxidromes, antivenoms, industrial intoxications, and antidotal therapy protocols.",
    targetAudience: "Emergency Pharmacists, Poison Center Specialists, ICU Physicians, Emergency Residents",
    chapters: [
      {
        id: 'goldfrank-ch1-paracetamol',
        chapterNumber: 1,
        title: "Acetaminophen (Paracetamol) Hepatotoxicity & N-Acetylcysteine Antidotal Protocol",
        pages: "pp. 450-482",
        estimatedReadTime: "22 min",
        keyThemes: ["Paracetamol Overdose", "NAPQI", "Rumack-Matthew Nomogram", "N-Acetylcysteine (NAC)", "King's College Criteria"],
        sections: [
          {
            heading: "1. Pathophysiology of Acetaminophen Induced Liver Injury (AILI)",
            content: "Therapeutic doses of acetaminophen are safely metabolized via glucuronidation (50-60%) and sulfation (30-40%). A small fraction (~5-10%) is oxidized via CYP2E1 into the highly electrophilic, toxic intermediate N-acetyl-p-benzoquinone imine (NAPQI).\n\nUnder normal conditions, NAPQI is rapidly detoxified by endogenous hepatic glutathione into harmless mercapturic acid conjugates. In massive overdose (>150 mg/kg or >7.5 g in adults), sulfation and glucuronidation saturate, glutathione stores deplete by >70%, and unbound NAPQI covalently binds to hepatocyte mitochondrial proteins, causing centrilobular (Zone III) hepatic necrosis.",
            clinicalPearls: [
              "The 8-Hour Golden Window: Initiating N-acetylcysteine within 8 hours of acute ingestion provides virtually 100% protection against severe hepatotoxicity and death.",
              "Rumack-Matthew Nomogram Rule: Valid ONLY for single, acute oral ingestions presenting between 4 and 24 hours post-ingestion. The treatment line starts at 150 mcg/mL at 4 hours."
            ],
            tables: {
              title: "N-Acetylcysteine (NAC) Dosing Regimens: IV vs Oral",
              headers: ["Regimen / Route", "Loading Dose", "Maintenance Infusion / Doses", "Total Duration & Stop Criteria"],
              rows: [
                ["3-Bag IV Protocol (Standard)", "150 mg/kg in 200mL D5W over 60 min", "50 mg/kg in 500mL over 4h, then 100 mg/kg in 1000mL over 16h", "21 hours total; continue if ALT elevated or APAP detectable"],
                ["2-Bag IV Protocol (Simplified)", "200 mg/kg in 500mL D5W over 4h", "100 mg/kg in 1000mL D5W over 16h", "20 hours total; significantly fewer anaphylactoid reactions"],
                ["72-Hour Oral Protocol", "140 mg/kg PO loading dose", "70 mg/kg PO every 4 hours for 17 doses", "72 hours total; ideal when IV formulation is out of stock"]
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'remington-pharmacy',
    title: "Remington: The Science and Practice of Pharmacy",
    subtitle: "The Most Comprehensive Treatise on Pharmaceutical Sciences",
    authors: "Adeboye Adejare (Editor), Academic Press",
    edition: "23rd Edition",
    publicationYear: 2021,
    category: 'basic_sciences',
    categoryLabel: 'Pharmaceutics & Industrial Sciences',
    coverColor: 'from-blue-950 via-slate-900 to-indigo-950',
    spineBg: 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 border-l border-cyan-400/40 border-r border-slate-950',
    textColor: 'text-cyan-300',
    accentBadgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    pagesCount: 2350,
    isbn: '978-0128200070',
    publisher: 'Academic Press / Elsevier',
    rating: 4.88,
    reviewsCount: 710,
    hasAudioNarration: true,
    description: "The definitive reference covering all pharmaceutical sciences from physical pharmacy, formulation development, pharmacokinetics, and biopharmaceutics to industrial manufacturing and pharmaceutical care.",
    targetAudience: "Industrial Pharmacists, Formulation Specialists, Pharmacy Students, Academicians",
    chapters: [
      {
        id: 'remington-ch1-bcs',
        chapterNumber: 1,
        title: "Biopharmaceutics Classification System (BCS) & Dissolution Science",
        pages: "pp. 810-845",
        estimatedReadTime: "25 min",
        keyThemes: ["BCS Class I-IV", "Dissolution Apparatus", "Biowaivers", "Lipid Formulations", "Bioavailability"],
        sections: [
          {
            heading: "1. The 4 BCS Classes and In Vivo Absorption Implications",
            content: "The Biopharmaceutics Classification System (BCS) categorizes active pharmaceutical ingredients based on their aqueous solubility and intestinal mucosal permeability:\n- Class I (High Solubility, High Permeability): Rate-limiting step is gastric emptying. Eligible for biowaiver of in vivo bioequivalence studies.\n- Class II (Low Solubility, High Permeability): Dissolution-rate limited. Formulation requires micronization, solid dispersions, or lipid nanoparticles (e.g., Ibuprofen, Carbamazepine).\n- Class III (High Solubility, Low Permeability): Permeability-rate limited (e.g., Metformin, Cimetidine).\n- Class IV (Low Solubility, Low Permeability): Poor oral bioavailability, major formulation challenge (e.g., Paclitaxel, Furosemide).",
            clinicalPearls: [
              "Biowaiver criteria: Immediate-release solid oral dosage forms can obtain regulatory bioequivalence waivers if the drug is BCS Class I and demonstrates rapid dissolution (>85% dissolved in 15 minutes across pH 1.2, 4.5, and 6.8)."
            ]
          }
        ]
      }
    ]
  }
];
