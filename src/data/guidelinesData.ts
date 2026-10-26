import { Guideline } from '../types';

export const guidelinesData: Guideline[] = [
  {
    id: "guide-efda-1",
    title: "EFDA Ethiopian National Essential Medicines List & Good Prescribing Guide",
    authority: "EFDA (Ethiopian Food and Drug Authority)",
    jurisdiction: "National (Ethiopia)",
    year: "2025/2026",
    status: "Latest 2026",
    category: "Formulary / STG",
    summary: "Official regulatory compendium for procurement, distribution, and hospital dispensing across federal and regional healthcare tiers in Ethiopia.",
    keyPoints: [
      "Categorization of vital, essential, and non-essential pharmaceuticals (VEN analysis) for inventory control.",
      "Strict prescription requirements for controlled narcotic and psychotropic substances (Formularies A & B).",
      "Mandatory generic prescribing in public healthcare facilities to promote access and cost control.",
      "Post-market surveillance and rapid recall procedures for substandard and falsified (SF) medical products."
    ],
    sourceUrlName: "efda.gov.et / MoH Ethiopia",
    offlineCached: true,
    downloadSize: "4.8 MB"
  },
  {
    id: "guide-moh-stg-2",
    title: "Ethiopian Ministry of Health Standard Treatment Guidelines (STG 4th/5th Ed)",
    authority: "MoH Ethiopia / EPSA",
    jurisdiction: "National (Ethiopia)",
    year: "2024-2026",
    status: "Latest 2026",
    category: "Infectious Disease",
    summary: "Clinical protocols adapted for primary, general, and tertiary specialized hospitals in Ethiopia.",
    keyPoints: [
      "Community-Acquired Pneumonia (CAP): Amoxicillin dispersible tablets first-line in outpatient pediatrics; Ceftriaxone + Azithromycin for admitted severe cases.",
      "Malaria Management: Artemether-Lumefantrine (Coartem) first-line for uncomplicated P. falciparum; Artesunate IV for severe complicated malaria.",
      "Visceral Leishmaniasis (Kala-azar): Sodium Stibogluconate (SSG) plus Paromomycin combination therapy.",
      "Neonatal Sepsis: Ampicillin plus Gentamicin protocol with strict weight-based syringe dosing."
    ],
    sourceUrlName: "moh.gov.et / Health Sector",
    offlineCached: true,
    downloadSize: "12.2 MB"
  },
  {
    id: "guide-tb-ethiopia-3",
    title: "National Tuberculosis, Leprosy & MDR-TB Clinical Manual (Ethiopia)",
    authority: "MoH Ethiopia / National TB Program",
    jurisdiction: "National (Ethiopia)",
    year: "2025",
    status: "Updated 2025",
    category: "Infectious Disease",
    summary: "Updated regimen guidelines featuring shortened all-oral regimens for multidrug-resistant tuberculosis (MDR-TB).",
    keyPoints: [
      "Adoption of the 6-month BPaLM regimen (Bedaquiline, Pretomanid, Linezolid 600mg, Moxifloxacin) for MDR/RR-TB.",
      "Tuberculosis Preventive Treatment (TPT): Rollout of 3HP (once-weekly Isoniazid + Rifapentine for 3 months) or 1HP daily.",
      "Mandatory ECG monitoring (QTc interval) for regimens containing Bedaquiline and Moxifloxacin.",
      "Pyridoxine (Vitamin B6) co-administration (25-50 mg daily) to prevent Isoniazid-induced peripheral neuropathy."
    ],
    sourceUrlName: "ethiopiantbprogram.org",
    offlineCached: true,
    downloadSize: "8.5 MB"
  },
  {
    id: "guide-who-eml-4",
    title: "WHO Model List of Essential Medicines (24th List) & AWaRe Antibiotics",
    authority: "World Health Organization (WHO)",
    jurisdiction: "International",
    year: "2025/2026",
    status: "Latest 2026",
    category: "Formulary / STG",
    summary: "Global gold standard for priority medicines, featuring the AWaRe (Access, Watch, Reserve) antimicrobial classification to combat AMR.",
    keyPoints: [
      "Access Group: First- and second-choice antibiotics that should be widely available at affordable prices (e.g. Amoxicillin, Doxycycline).",
      "Watch Group: Higher resistance potential; recommended only as specific first-line options for limited syndromes (e.g. Fluoroquinolones, 3rd gen Cephalosporins).",
      "Reserve Group: Last-resort options prioritized for multidrug-resistant pathogens (e.g. Colistin, Ceftazidime-avibactam, Linezolid).",
      "Addition of fixed-dose combinations for hypertension and heart failure."
    ],
    sourceUrlName: "who.int/medicines/publications",
    offlineCached: true,
    downloadSize: "6.1 MB"
  },
  {
    id: "guide-ada-diabetes-5",
    title: "ADA Standards of Care in Diabetes (2026 Updates)",
    authority: "American Diabetes Association (ADA)",
    jurisdiction: "International",
    year: "2026",
    status: "Latest 2026",
    category: "Endocrinology",
    summary: "The definitive evidence-based international clinical recommendations for diagnosis and management of diabetes.",
    keyPoints: [
      "Early combination therapy at diagnosis: SGLT2 inhibitor + GLP-1 RA for all individuals with established ASCVD, heart failure, or CKD regardless of HbA1c.",
      "Dual GIP/GLP-1 receptor agonists (Tirzepatide) endorsed for superior glycemic and weight loss efficacy.",
      "Time in Range (TIR > 70% in 70-180 mg/dL) using Continuous Glucose Monitoring (CGM) emphasized alongside HbA1c.",
      "Routine screening for Metabolic Dysfunction-Associated Steatohepatitis (MASH) with FIB-4 calculator."
    ],
    sourceUrlName: "diabetesjournals.org/care",
    offlineCached: true,
    downloadSize: "9.4 MB"
  },
  {
    id: "guide-aha-acc-hf-6",
    title: "AHA/ACC/HFSA Guideline for the Management of Heart Failure",
    authority: "American College of Cardiology & AHA",
    jurisdiction: "International",
    year: "2025/2026",
    status: "Latest 2026",
    category: "Cardiology",
    summary: "Class 1 recommendation for rapid simultaneous or rapid-sequence initiation of the 4 Pillars of GDMT in HFrEF.",
    keyPoints: [
      "The 4 pillars: ARNI/ACEi, Beta-Blocker (Carvedilol/Metoprolol Succinate), MRA (Spironolactone), and SGLT2i.",
      "Guideline endorsement of SGLT2 inhibitors for HFpEF (Heart Failure with Preserved Ejection Fraction) to reduce cardiovascular death and hospitalizations.",
      "Intravenous iron repletion (Ferric Carboxymaltose or Ferric Derisomaltose) for iron deficiency (ferritin < 100 ng/mL or 100-299 with TSAT < 20%).",
      "Potassium binders (Patiromer) to enable GDMT maintenance despite moderate hyperkalemia."
    ],
    sourceUrlName: "ahajournals.org/guidelines",
    offlineCached: true,
    downloadSize: "11.0 MB"
  },
  {
    id: "guide-kdigo-ckd-7",
    title: "KDIGO Clinical Practice Guideline for the Evaluation and Management of CKD",
    authority: "Kidney Disease: Improving Global Outcomes (KDIGO)",
    jurisdiction: "International",
    year: "2025/2026",
    status: "Latest 2026",
    category: "Nephrology",
    summary: "Comprehensive recommendations for slowing progression of chronic kidney disease and preventing cardiovascular morbidity.",
    keyPoints: [
      "Blood pressure target: Systolic BP < 120 mmHg when tolerated, using standardized automated office BP measurement.",
      "Non-steroidal mineralocorticoid receptor antagonist (Finerenone) recommended for T2D with CKD to slow progression and reduce cardiovascular events.",
      "SGLT2 inhibitors recommended for CKD with eGFR down to 20 mL/min/1.73m2, continued until dialysis initiation.",
      "Dietary protein intake guidance: 0.8 g/kg/day for stages G3-G5 non-dialysis CKD."
    ],
    sourceUrlName: "kdigo.org/guidelines",
    offlineCached: true,
    downloadSize: "7.7 MB"
  },
  {
    id: "guide-gina-asthma-8",
    title: "GINA Global Strategy for Asthma Management and Prevention",
    authority: "Global Initiative for Asthma (GINA)",
    jurisdiction: "International",
    year: "2025/2026",
    status: "Latest 2026",
    category: "Respiratory",
    summary: "Track 1 preferred approach: Inhaled Corticosteroid (ICS)-Formoterol as both maintenance and reliever across all steps.",
    keyPoints: [
      "SABA-only treatment is dangerous and no longer recommended: short-acting beta-agonists increase risk of severe exacerbations and asthma-related death.",
      "Track 1 (Preferred): Low-dose ICS-Formoterol used as the reliever for symptoms across all steps 1 through 5 (Anti-inflammatory reliever AIR / SMART strategy).",
      "Assessment of inhaler technique and adherence at EVERY patient encounter before escalating therapy.",
      "Phenotyping for biologic therapy (Anti-IL5, Anti-IL4R, Anti-IgE, Anti-TSLP) in Step 5 severe eosinophilic asthma."
    ],
    sourceUrlName: "ginasthma.org",
    offlineCached: true,
    downloadSize: "8.9 MB"
  }
];
