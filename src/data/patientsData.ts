import { Patient } from '../types';

export const initialPatientsData: Patient[] = [
  {
    id: "pat-101",
    mrn: "ETH-AA-94021",
    fullName: "Abebe Kebede",
    age: 62,
    gender: "Male",
    weightKg: 78,
    heightCm: 174,
    serumCreatinine: 1.6,
    allergies: ["Penicillin (Anaphylaxis)", "Sulfonamides (Maculopapular rash)"],
    chronicConditions: [
      "Type 2 Diabetes Mellitus (12 years)",
      "Essential Hypertension",
      "Heart Failure with Reduced Ejection Fraction (EF 35%)",
      "Chronic Kidney Disease Stage 3a"
    ],
    currentMedications: [
      {
        drugName: "Lisinopril",
        dose: "20 mg",
        frequency: "Once daily morning",
        indication: "HFrEF & Hypertension",
        startDate: "2024-01-15"
      },
      {
        drugName: "Spironolactone",
        dose: "25 mg",
        frequency: "Once daily morning",
        indication: "HFrEF GDMT",
        startDate: "2024-03-10"
      },
      {
        drugName: "Empagliflozin",
        dose: "10 mg",
        frequency: "Once daily morning",
        indication: "Cardiorenal protection & T2D",
        startDate: "2024-06-01"
      },
      {
        drugName: "Carvedilol",
        dose: "12.5 mg",
        frequency: "Twice daily with meals",
        indication: "HFrEF GDMT",
        startDate: "2024-02-20"
      },
      {
        drugName: "Metformin",
        dose: "500 mg",
        frequency: "Twice daily with meals",
        indication: "Type 2 Diabetes",
        startDate: "2022-04-12"
      }
    ],
    soapNotes: [
      {
        id: "soap-1",
        date: "2026-10-20",
        author: "Pharm. Dawid Aliyi, BCPS",
        subjective: "Patient presents for routine cardiology and diabetes clinic follow-up. Reports mild bilateral ankle edema in the evenings, but denies orthopnea or PND. States compliance with medications is good.",
        objective: "BP 132/82 mmHg, HR 64 bpm regular. Labs from yesterday: Serum Creatinine 1.6 mg/dL (Baseline 1.4 mg/dL), BUN 28 mg/dL, eGFR 46 mL/min/1.73m2, Serum K+ 5.2 mEq/L (borderline high), HbA1c 7.4%.",
        assessment: "1. HFrEF GDMT is well-optimized on 4 pillars. 2. Mild hyperkalemia (K+ 5.2 mEq/L) likely secondary to synergistic Lisinopril + Spironolactone in setting of CKD 3a. 3. Metformin dose is safe at 1000 mg/day given eGFR 46 mL/min, but requires close renal monitoring.",
        plan: "1. Recheck BMP (Potassium and Creatinine) in 10-14 days. 2. Dietary counseling provided regarding low-potassium intake (avoid salt substitutes containing KCl, limit excess bananas/oranges). 3. If K+ exceeds 5.5 mEq/L, consider adding Patiromer (Veltassa) 8.4g daily or down-titrating Spironolactone to 12.5 mg every other day. 4. Continue Empagliflozin 10 mg daily for renal protection."
      }
    ]
  },
  {
    id: "pat-102",
    mrn: "ETH-OR-88412",
    fullName: "Chaltu Tolosa",
    age: 48,
    gender: "Female",
    weightKg: 64,
    heightCm: 162,
    serumCreatinine: 0.85,
    allergies: ["Aspirin (Bronchospasm / Aspirin-Exacerbated Respiratory Disease)"],
    chronicConditions: [
      "Persistent Moderate Asthma",
      "Persistent Atrial Fibrillation (CHA2DS2-VASc = 2)",
      "Dyslipidemia"
    ],
    currentMedications: [
      {
        drugName: "Warfarin",
        dose: "5 mg",
        frequency: "Once daily at 6:00 PM",
        indication: "Stroke prevention in AFib",
        startDate: "2025-02-14"
      },
      {
        drugName: "Budesonide/Formoterol (Symbicort)",
        dose: "160/4.5 mcg",
        frequency: "2 puffs twice daily + PRN reliever",
        indication: "GINA Track 1 Asthma",
        startDate: "2025-05-10"
      },
      {
        drugName: "Atorvastatin",
        dose: "20 mg",
        frequency: "Once daily bedtime",
        indication: "Primary ASCVD prevention",
        startDate: "2025-01-08"
      }
    ],
    soapNotes: [
      {
        id: "soap-2",
        date: "2026-10-24",
        author: "Pharm. Elena Rostova, PharmD",
        subjective: "Patient presented for INR anticoagulation clinic visit. Mentioned she had severe right knee pain this week and was thinking about taking Ibuprofen from a neighborhood shop.",
        objective: "BP 124/76 mmHg, HR 72 bpm irregularly irregular. Today's point-of-care INR is 2.4 (Goal 2.0 - 3.0, Therapeutic). LFTs normal.",
        assessment: "1. INR is well-controlled at 2.4. 2. Critical drug interaction and allergy warning: Patient inquired about taking Ibuprofen, which is strictly contraindicated due to: (a) Documented Aspirin/NSAID bronchospasm allergy (AERD), and (b) Severe synergism with Warfarin causing upper GI hemorrhage.",
        plan: "1. Counseled patient emphatically to strictly avoid Ibuprofen, Diclofenac, Naproxen, and all OTC NSAIDs. 2. Recommended Acetaminophen 500 mg 1-2 tablets TID PRN for knee discomfort (max 2000 mg/day during warfarin therapy). 3. Maintained Warfarin at 5 mg daily (35 mg/week). 4. Next INR check scheduled in 4 weeks."
      }
    ]
  }
];
