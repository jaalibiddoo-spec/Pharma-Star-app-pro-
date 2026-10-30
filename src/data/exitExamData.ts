import { ExitExamQuestion } from '../types';

export const sampleExitExamQuestions: ExitExamQuestion[] = [
  {
    id: 'exit-q1',
    domain: 'Clinical Pharmacy',
    questionText: 'A 64-year-old male with Type 2 Diabetes and Stage 4 Chronic Kidney Disease (eGFR 24 mL/min/1.73m²) presents for routine follow-up. Which of the following antidiabetic agents is ABSOLUTELY CONTRAINDICATED according to Ethiopian Standard Treatment Guidelines?',
    options: [
      { id: 'A', text: 'Linagliptin 5 mg PO once daily' },
      { id: 'B', text: 'Metformin HCl 1000 mg PO twice daily' },
      { id: 'C', text: 'Glargine Insulin 14 units SubQ at bedtime' },
      { id: 'D', text: 'Repaglinide 0.5 mg PO before main meals' }
    ],
    correctOption: 'B',
    explanation: 'Metformin is renally cleared and is strictly contraindicated when eGFR < 30 mL/min due to the high mortality risk of biguanide-associated lactic acidosis (mortality > 40%). Linagliptin undergoes fecal/biliary elimination and requires no dose adjustment in severe renal impairment.',
    stgReference: 'Ethiopian MoH National Standard Treatment Guidelines 2026 (Endocrine & Renal Chapter).',
    difficulty: 'High-Yield Board Level'
  },
  {
    id: 'exit-q2',
    domain: 'Pharmacology & Toxicology',
    questionText: 'A patient receiving maintenance Warfarin for deep vein thrombosis is prescribed Clarithromycin for an acute respiratory infection. What is the anticipated pharmacodynamic/pharmacokinetic outcome and appropriate clinical management?',
    options: [
      { id: 'A', text: 'Clarithromycin induces CYP2C9, decreasing INR; double the Warfarin dose' },
      { id: 'B', text: 'Clarithromycin potently inhibits CYP3A4 and P-gp, multiplying active S-warfarin levels and triggering dangerous bleeding; preemptively reduce Warfarin dose by 30-50% and monitor INR closely' },
      { id: 'C', text: 'Zero interaction exists because Warfarin is solely eliminated through glomerular filtration' },
      { id: 'D', text: 'Clarithromycin chelates Warfarin in the stomach lumen, rendering it non-absorbable' }
    ],
    correctOption: 'B',
    explanation: 'Macrolides like Clarithromycin inhibit hepatic cytochrome P450 enzymes (CYP3A4) and alter gut flora synthesizing vitamin K, causing profound prolongation of the INR and severe hemorrhage risk.',
    stgReference: 'EFDA Drug Safety Alert on Anticoagulation Interactions.',
    difficulty: 'High-Yield Board Level'
  },
  {
    id: 'exit-q3',
    domain: 'Pharmaceutics & Formulation',
    questionText: 'In the formulation of extended-release hydrophilic matrix tablets using Hydroxypropyl Methylcellulose (HPMC), what is the primary rate-controlling mechanism of drug release upon oral ingestion?',
    options: [
      { id: 'A', text: 'Rapid osmotic tablet core rupture via sodium chloride pressure' },
      { id: 'B', text: 'Hydration and swelling of the polymer forming a viscous gel barrier through which the drug slowly diffuses and erodes' },
      { id: 'C', text: 'Direct sublimation of the active pharmaceutical ingredient into the stomach lumen' },
      { id: 'D', text: 'Enteric pH-dependent dissolution occurring exclusively in the distal ileum at pH > 8.0' }
    ],
    correctOption: 'B',
    explanation: 'Upon contact with gastrointestinal fluid, HPMC hydrates to form a dynamic viscous gelatinous boundary layer. Drug molecules diffuse through this gel layer while the outer matrix undergoes gradual surface erosion.',
    stgReference: 'Aulton’s Pharmaceutics: The Design and Manufacture of Medicines.',
    difficulty: 'Standard Exit Exam'
  },
  {
    id: 'exit-q4',
    domain: 'Medicinal Chemistry',
    questionText: 'Which structural component of Penicillin antibiotics is primarily responsible for its bactericidal inhibition of bacterial cell wall transpeptidase (PBP), yet simultaneously renders it susceptible to beta-lactamase enzymatic hydrolysis?',
    options: [
      { id: 'A', text: 'The strained four-membered beta-lactam ring fused to a thiazolidine ring' },
      { id: 'B', text: 'The acyl side-chain at position 6' },
      { id: 'C', text: 'The terminal carboxyl group at position 3' },
      { id: 'D', text: 'The gem-dimethyl groups on the thiazolidine ring' }
    ],
    correctOption: 'A',
    explanation: 'The four-membered beta-lactam ring possesses high ring strain (approx. 90-degree bond angles instead of standard tetrahedral 109.5). It mimics the D-Ala-D-Ala terminus of bacterial peptidoglycan, acylation of the serine active site of penicillin-binding proteins (PBPs), while the strained carbonyl is readily attacked by bacterial beta-lactamases.',
    stgReference: 'Foye’s Principles of Medicinal Chemistry.',
    difficulty: 'High-Yield Board Level'
  },
  {
    id: 'exit-q5',
    domain: 'Social & Administrative Pharmacy',
    questionText: 'According to Ethiopian Food and Drug Authority (EFDA) and EPSS supply chain regulations, what is the maximum permissible physical discrepancy allowable between a physical stock count and the balance recorded on an official Bin Card for essential medicines?',
    options: [
      { id: 'A', text: 'Up to 10% variance is acceptable during monthly audit reconciliation' },
      { id: 'B', text: 'Zero (0%) discrepancy: Physical balance must match Bin Card ledger count exactly, with any unexplained loss formally investigated' },
      { id: 'C', text: '5% variance for injectables and 15% for oral solids' },
      { id: 'D', text: 'Discrepancies are only reconciled annually during fiscal closing' }
    ],
    correctOption: 'B',
    explanation: 'Ethiopian Good Pharmacy Practice (GPP) and EPSS Inventory Management Guidelines mandate 100% stock card and bin card reconciliation. Every physical issue, receipt, and loss/adjustment must be documented immediately with a zero unexplained variance threshold.',
    stgReference: 'EFDA Health Facility Good Dispensing Practice Manual 2026.',
    difficulty: 'Standard Exit Exam'
  },
  {
    id: 'exit-q6',
    domain: 'NGAT Core Aptitude',
    questionText: 'A hospital ICU orders Dopamine at an infusion rate of 5 mcg/kg/min for a 70 kg patient with septic shock. The infusion bag contains 400 mg of Dopamine in 250 mL of 5% Dextrose in Water. What is the required electronic infusion pump rate in mL/hour?',
    options: [
      { id: 'A', text: '6.56 mL/hour' },
      { id: 'B', text: '13.125 mL/hour' },
      { id: 'C', text: '26.25 mL/hour' },
      { id: 'D', text: '52.5 mL/hour' }
    ],
    correctOption: 'B',
    explanation: 'Step 1: Patient dose = 5 mcg/kg/min * 70 kg = 350 mcg/min. Step 2: Per hour dose = 350 * 60 = 21,000 mcg/hr = 21 mg/hr. Step 3: Bag concentration = 400 mg / 250 mL = 1.6 mg/mL. Step 4: Flow rate = 21 mg/hr / 1.6 mg/mL = 13.125 mL/hour.',
    stgReference: 'Ethiopian National Graduate Admission Test (NGAT) Quantitative Health Reasoning.',
    difficulty: 'High-Yield Board Level'
  }
];
