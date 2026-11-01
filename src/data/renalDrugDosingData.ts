export interface RenalDrugAdjustmentRule {
  id: string;
  drugName: string;
  brandNames: string[];
  category: 'Antimicrobials' | 'Cardiovascular & Anticoagulants' | 'Diabetes & Endocrine' | 'Analgesics & Gout';
  standardDose: string;
  calculateAdjustedDose: (crcl: number, weightKg?: number, age?: number, scr?: number) => {
    adjustedDose: string;
    frequency: string;
    reductionPercentage: string;
    status: 'normal' | 'reduced' | 'contraindicated' | 'extended_interval';
    recommendationSummary: string;
    alertSeverity: 'low' | 'moderate' | 'high' | 'critical';
    clinicalWarning: string;
    monitoringParameters: string[];
  };
  guidelineReference: string;
}

export const renalDrugAdjustmentRules: RenalDrugAdjustmentRule[] = [
  {
    id: 'enoxaparin',
    drugName: 'Enoxaparin Sodium (LMWH)',
    brandNames: ['Clexane', 'Lovenox'],
    category: 'Cardiovascular & Anticoagulants',
    standardDose: 'DVT/PE Treatment: 1 mg/kg SC q12h (or 1.5 mg/kg SC q24h). Prophylaxis: 40 mg SC q24h.',
    calculateAdjustedDose: (crcl, weightKg = 70) => {
      if (crcl < 30) {
        return {
          adjustedDose: `Treatment: ${Math.round(weightKg)} mg (1 mg/kg) SC ONCE DAILY. Prophylaxis: 30 mg SC ONCE DAILY.`,
          frequency: 'Every 24 hours (ONCE DAILY ONLY)',
          reductionPercentage: '50% Dose Reduction / Interval Extended',
          status: 'reduced',
          recommendationSummary: 'CrCl < 30 mL/min: Substantial renal accumulation occurs. Reduce treatment dose to 1 mg/kg once daily. Avoid unfractionated heparin unless anti-Xa monitoring is available.',
          alertSeverity: 'critical',
          clinicalWarning: 'CRITICAL BLEEDING ALERT: Failure to reduce Enoxaparin in severe renal failure causes drug accumulation, prolonged Anti-Xa elevation, and fatal retroperitoneal or intracranial hemorrhage.',
          monitoringParameters: ['Peak Anti-Xa level (target 0.5 - 1.0 IU/mL for treatment 4h post-dose)', 'Hemoglobin / Hematocrit', 'Platelet count (HIT check)', 'Urine output']
        };
      }
      return {
        adjustedDose: `Treatment: ${Math.round(weightKg)} mg (1 mg/kg) SC q12h. Prophylaxis: 40 mg SC q24h.`,
        frequency: 'Every 12 hours (Treatment) / Every 24 hours (Prophylaxis)',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'Normal to mild renal clearance. Standard weight-based dosing appropriate.',
        alertSeverity: 'low',
        clinicalWarning: 'Re-assess if acute kidney injury (AKI) supervenes.',
        monitoringParameters: ['Platelets', 'Hemoglobin', 'Serum Creatinine']
      };
    },
    guidelineReference: 'CHEST Guidelines & ASHP Anticoagulation Dosing Protocol'
  },
  {
    id: 'vancomycin',
    drugName: 'Vancomycin Hydrochloride IV',
    brandNames: ['Vancocin', 'Vancomycin USP'],
    category: 'Antimicrobials',
    standardDose: '15 - 20 mg/kg IV q8h to q12h (Target AUC24/MIC: 400 - 600 mg·h/L).',
    calculateAdjustedDose: (crcl, weightKg = 70) => {
      const doseMg = Math.round((weightKg * 15) / 250) * 250; // rounded to nearest 250mg
      if (crcl < 15) {
        return {
          adjustedDose: `Loading dose: ${doseMg} mg IV x 1, then re-dose ONLY when serum trough < 15-20 mcg/mL.`,
          frequency: 'Pulse-dosing guided by pre-dialysis serum levels',
          reductionPercentage: 'Substantial Reduction (>75% extension)',
          status: 'extended_interval',
          recommendationSummary: 'End-Stage Renal Disease / Hemodialysis: Administer standard loading dose; monitor serum levels and redose only when concentration clears to 15 mcg/mL.',
          alertSeverity: 'critical',
          clinicalWarning: 'NEPHROTOXICITY & OTOTOXICITY ALERT: Sustained troughs > 20 mcg/mL or AUC > 650 accelerate permanent inner ear hair cell loss and severe acute tubular necrosis.',
          monitoringParameters: ['Pre-dialysis serum vancomycin trough', 'Audiometry if prolonged course', 'Serum Creatinine']
        };
      } else if (crcl < 30) {
        return {
          adjustedDose: `${doseMg} mg IV every 48 hours.`,
          frequency: 'Every 48 hours',
          reductionPercentage: '50% Dose Frequency Reduction',
          status: 'extended_interval',
          recommendationSummary: 'CrCl 15 - 29 mL/min: Extend interval to every 48 hours. Draw trough level prior to the 3rd dose.',
          alertSeverity: 'high',
          clinicalWarning: 'Extreme caution if combined with Piperacillin-Tazobactam (synergistic AKI risk).',
          monitoringParameters: ['Trough level before 3rd dose (target 10 - 15 or 15 - 20 for severe MRSA)', 'Daily eGFR / SCr']
        };
      } else if (crcl < 50) {
        return {
          adjustedDose: `${doseMg} mg IV every 24 hours.`,
          frequency: 'Every 24 hours (Once daily)',
          reductionPercentage: '50% Frequency Reduction',
          status: 'extended_interval',
          recommendationSummary: 'CrCl 30 - 49 mL/min: Extend interval to every 24 hours. Target AUC24/MIC 400 - 600 mg·h/L.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Monitor for rising serum creatinine indicating drug-induced nephrotoxicity.',
          monitoringParameters: ['AUC/MIC calculation', 'Serum trough at steady state', 'Urine output']
        };
      }
      return {
        adjustedDose: `${doseMg} mg IV every 12 hours.`,
        frequency: 'Every 12 hours',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl ≥ 50 mL/min: Standard pharmacokinetic interval q12h. Measure steady-state trough before 4th dose.',
        alertSeverity: 'low',
        clinicalWarning: 'Ensure infusion over at least 60-90 minutes to prevent Red Man Syndrome.',
        monitoringParameters: ['Trough before 4th dose', 'Serum Creatinine at day 3 and day 7']
      };
    },
    guidelineReference: 'ASHP/IDSA/PIDS/SIDP Consensus Guidelines on Precision Vancomycin Dosing'
  },
  {
    id: 'cefepime',
    drugName: 'Cefepime IV (4th Gen Cephalosporin)',
    brandNames: ['Maxipime', 'Cefepime USP'],
    category: 'Antimicrobials',
    standardDose: '2 g IV every 8 hours (Severe pseudomonal / neutropenic infections).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 11) {
        return {
          adjustedDose: '1 g IV every 24 hours (On hemodialysis days, administer after dialysis).',
          frequency: 'Every 24 hours',
          reductionPercentage: '83% Cumulative Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl < 11 mL/min: Reduce dose to 1 g IV every 24 hours. High risk of cefepime neurotoxicity in uremic patients.',
          alertSeverity: 'critical',
          clinicalWarning: 'HIGH NEUROTOXICITY ALERT: Unadjusted Cefepime in renal impairment penetrates the blood-brain barrier causing non-convulsive status epilepticus, myoclonus, encephalopathy, and coma.',
          monitoringParameters: ['Neurological status & Glasgow Coma Scale (GCS)', 'EEG if altered mental status', 'Serum Creatinine']
        };
      } else if (crcl <= 29) {
        return {
          adjustedDose: '2 g IV every 24 hours.',
          frequency: 'Every 24 hours',
          reductionPercentage: '67% Cumulative Dose Reduction',
          status: 'extended_interval',
          recommendationSummary: 'CrCl 11 - 29 mL/min: Extend dosing interval to every 24 hours.',
          alertSeverity: 'high',
          clinicalWarning: 'Monitor closely for confusion, hallucinations, or tremor.',
          monitoringParameters: ['Mental status daily', 'Serum Creatinine every 48h']
        };
      } else if (crcl <= 60) {
        return {
          adjustedDose: '2 g IV every 12 hours.',
          frequency: 'Every 12 hours',
          reductionPercentage: '33% Cumulative Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 30 - 60 mL/min: Moderate reduction to 2 g IV every 12 hours.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Do not administer q8h in moderate renal impairment.',
          monitoringParameters: ['Serum Creatinine', 'Clinical infection resolution']
        };
      }
      return {
        adjustedDose: '2 g IV every 8 hours.',
        frequency: 'Every 8 hours',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 60 mL/min: Standard antipseudomonal full dose 2g q8h.',
        alertSeverity: 'low',
        clinicalWarning: 'Standard monitoring.',
        monitoringParameters: ['Renal baseline', 'CBC']
      };
    },
    guidelineReference: 'FDA Safety Alert on Cefepime Neurotoxicity & Ethiopian National STG'
  },
  {
    id: 'piperacillin_tazobactam',
    drugName: 'Piperacillin / Tazobactam IV',
    brandNames: ['Zosyn', 'Tazocin'],
    category: 'Antimicrobials',
    standardDose: '4.5 g (or 3.375 g) IV every 6 hours.',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 20) {
        return {
          adjustedDose: '2.25 g IV every 8 hours (For HD: 2.25g q12h + 0.75g supplemental post-dialysis).',
          frequency: 'Every 8 hours',
          reductionPercentage: '50% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl < 20 mL/min: Reduce dose to 2.25 g IV q8h to prevent neuromuscular excitability and bone marrow suppression.',
          alertSeverity: 'high',
          clinicalWarning: 'Dual administration with Vancomycin dramatically multiplies acute kidney injury incidence.',
          monitoringParameters: ['Serum Creatinine & BUN', 'CBC with differential (neutropenia check)', 'Platelets']
        };
      } else if (crcl <= 50) {
        return {
          adjustedDose: '3.375 g IV every 6 hours (or 2.25 g IV q6h).',
          frequency: 'Every 6 hours',
          reductionPercentage: '25% - 33% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 20 - 50 mL/min: Reduce dose to 3.375 g IV every 6 hours (extended 3-4 hour infusion preferred).',
          alertSeverity: 'moderate',
          clinicalWarning: 'Extended infusion (over 3-4 hours) improves pharmacokinetic time above MIC.',
          monitoringParameters: ['Serum Creatinine', 'Electrolytes (Sodium load in formulation)']
        };
      }
      return {
        adjustedDose: '4.5 g IV every 6 hours (or 3.375 g q6h extended infusion).',
        frequency: 'Every 6 hours',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard full dose for nosocomial pneumonia or intra-abdominal sepsis.',
        alertSeverity: 'low',
        clinicalWarning: 'Ensure adequate hydration.',
        monitoringParameters: ['Renal labs']
      };
    },
    guidelineReference: 'Sanford Guide & IDSA Antimicrobial Dosing Compendium'
  },
  {
    id: 'meropenem',
    drugName: 'Meropenem IV (Carbapenem)',
    brandNames: ['Meronem', 'Meropenem USP'],
    category: 'Antimicrobials',
    standardDose: '1 g IV every 8 hours (2 g q8h for bacterial meningitis).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 10) {
        return {
          adjustedDose: '500 mg IV every 24 hours (Give dose after hemodialysis on dialysis days).',
          frequency: 'Every 24 hours',
          reductionPercentage: '83% Cumulative Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl < 10 mL/min: Reduce dose to 500 mg IV every 24 hours. Dialyzable (~50% removed by HD).',
          alertSeverity: 'critical',
          clinicalWarning: 'SEIZURE RISK: Drug accumulation in severe renal failure lowers seizure threshold, particularly in patients with CNS lesions.',
          monitoringParameters: ['Neurological & seizure monitoring', 'Serum Creatinine', 'LFTs']
        };
      } else if (crcl <= 25) {
        return {
          adjustedDose: '500 mg IV every 12 hours.',
          frequency: 'Every 12 hours',
          reductionPercentage: '67% Cumulative Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 10 - 25 mL/min: Reduce to 500 mg IV every 12 hours.',
          alertSeverity: 'high',
          clinicalWarning: 'Do not use Valproic Acid concurrently (carbapenems plunge valproate levels causing breakthrough seizures).',
          monitoringParameters: ['Renal function', 'CNS assessment']
        };
      } else if (crcl <= 50) {
        return {
          adjustedDose: '1 g IV every 12 hours.',
          frequency: 'Every 12 hours',
          reductionPercentage: '33% Cumulative Dose Reduction',
          status: 'extended_interval',
          recommendationSummary: 'CrCl 26 - 50 mL/min: Extend dosing interval to 1 g IV every 12 hours.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Monitor for clinical response; 3-hour extended infusions optimize pharmacodynamics.',
          monitoringParameters: ['Daily SCr']
        };
      }
      return {
        adjustedDose: '1 g IV every 8 hours.',
        frequency: 'Every 8 hours',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard antipseudomonal/ESBL dosage.',
        alertSeverity: 'low',
        clinicalWarning: 'Standard monitoring.',
        monitoringParameters: ['CBC', 'Renal baseline']
      };
    },
    guidelineReference: 'British National Formulary (BNF 86) & Ethiopian STG'
  },
  {
    id: 'metformin',
    drugName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet'],
    category: 'Diabetes & Endocrine',
    standardDose: '500 - 1000 mg PO BID (Max 2000 - 2550 mg/day).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 30) {
        return {
          adjustedDose: 'STRICTLY CONTRAINDICATED (0 mg / Discontinue immediately).',
          frequency: 'DO NOT ADMINISTER',
          reductionPercentage: '100% Contraindicated ⛔',
          status: 'contraindicated',
          recommendationSummary: 'CrCl / eGFR < 30 mL/min: Metformin is strictly contraindicated due to inability to excrete the drug, causing fatal accumulation and lactic acidosis.',
          alertSeverity: 'critical',
          clinicalWarning: 'FATAL LACTIC ACIDOSIS ALERT: 50% mortality rate. Switch patient immediately to Insulin, Linagliptin, or Repaglinide.',
          monitoringParameters: ['Serum Lactate if symptomatic (nausea, tachypnea, severe malaise)', 'Arterial Blood Gas', 'Blood glucose']
        };
      } else if (crcl < 45) {
        return {
          adjustedDose: 'Maximum 1,000 mg/day (e.g. 500 mg PO twice daily). Do NOT initiate in new patients.',
          frequency: 'Twice daily with meals (Max 1000mg/day)',
          reductionPercentage: '50% Dose Restriction',
          status: 'reduced',
          recommendationSummary: 'CrCl 30 - 44 mL/min: Dose capped at 1000 mg/day. Assess renal labs every 3 months. Withhold before iodinated contrast procedures.',
          alertSeverity: 'high',
          clinicalWarning: 'Do NOT start Metformin in treatment-naïve patients if eGFR is < 45 mL/min.',
          monitoringParameters: ['Serum Creatinine every 3 months', 'Electrolytes', 'HbA1c']
        };
      } else if (crcl < 60) {
        return {
          adjustedDose: 'Maximum 2,000 mg/day in divided doses.',
          frequency: 'Twice daily with meals',
          reductionPercentage: 'Moderate Dose Limit',
          status: 'normal',
          recommendationSummary: 'CrCl 45 - 59 mL/min: Standard doses acceptable up to 2000 mg/day. Monitor renal function every 3 to 6 months.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Advise patient on temporary cessation during dehydrating illnesses.',
          monitoringParameters: ['Serum Creatinine every 6 months']
        };
      }
      return {
        adjustedDose: '500 - 1000 mg PO BID (Up to max 2550 mg/day).',
        frequency: 'Twice daily with meals',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'Normal renal clearance. First-line agent for Type 2 Diabetes.',
        alertSeverity: 'low',
        clinicalWarning: 'Take with food to minimize gastrointestinal disturbances.',
        monitoringParameters: ['Annual eGFR', 'Vitamin B12 levels annually']
      };
    },
    guidelineReference: 'ADA/EASD Consensus Standards of Medical Care & FDA Drug Safety Communication'
  },
  {
    id: 'apixaban',
    drugName: 'Apixaban (DOAC Factor Xa Inhibitor)',
    brandNames: ['Eliquis'],
    category: 'Cardiovascular & Anticoagulants',
    standardDose: '5 mg PO twice daily (Non-valvular Atrial Fibrillation stroke prevention).',
    calculateAdjustedDose: (crcl, weightKg = 70, age = 65, scr = 1.0) => {
      // 2 of 3 criteria: Age >= 80, Weight <= 60 kg, Serum Cr >= 1.5 mg/dL
      const criteriaCount = (age >= 80 ? 1 : 0) + (weightKg <= 60 ? 1 : 0) + (scr >= 1.5 ? 1 : 0);
      if (crcl < 15) {
        return {
          adjustedDose: 'Avoid or use with extreme caution (2.5 mg PO BID only if dialysis validated).',
          frequency: 'Twice daily (High bleeding risk)',
          reductionPercentage: '50% Dose Reduction / High Caution',
          status: 'reduced',
          recommendationSummary: 'CrCl < 15 mL/min: Limited clinical trial data in non-dialysis ESRD. Warfarin with INR monitoring is frequently preferred.',
          alertSeverity: 'critical',
          clinicalWarning: 'Severe risk of major hemorrhagic complications. Co-administration of P-gp or strong CYP3A4 inhibitors is contraindicated.',
          monitoringParameters: ['Hemoglobin', 'Signs of occult GI bleeding', 'Renal function']
        };
      } else if (criteriaCount >= 2) {
        return {
          adjustedDose: '2.5 mg PO twice daily (Meets ≥ 2 dose reduction criteria).',
          frequency: 'Twice daily',
          reductionPercentage: '50% Dose Reduction',
          status: 'reduced',
          recommendationSummary: `Patient meets ${criteriaCount} of 3 dose reduction criteria (Age ≥ 80: ${age >= 80 ? 'Yes' : 'No'}, Wt ≤ 60kg: ${weightKg <= 60 ? 'Yes' : 'No'}, SCr ≥ 1.5mg/dL: ${scr >= 1.5 ? 'Yes' : 'No'}). Reduce to 2.5 mg BID.`,
          alertSeverity: 'high',
          clinicalWarning: 'Do NOT give standard 5mg BID when patient meets 2 reduction criteria.',
          monitoringParameters: ['Renal function every 3 months', 'CBC']
        };
      }
      return {
        adjustedDose: '5 mg PO twice daily.',
        frequency: 'Twice daily',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'Patient does not meet 2 of the 3 ABC reduction criteria. Standard 5mg BID dose is indicated.',
        alertSeverity: 'low',
        clinicalWarning: 'No routine coagulation monitoring required.',
        monitoringParameters: ['Annual renal function check']
      };
    },
    guidelineReference: 'ARISTOTLE Trial & AHA/ACC/HRS Atrial Fibrillation Guidelines'
  },
  {
    id: 'rivaroxaban',
    drugName: 'Rivaroxaban (Oral Factor Xa Inhibitor)',
    brandNames: ['Xarelto'],
    category: 'Cardiovascular & Anticoagulants',
    standardDose: '20 mg PO once daily with the evening meal.',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 15) {
        return {
          adjustedDose: 'AVOID / CONTRAINDICATED (0 mg).',
          frequency: 'DO NOT ADMINISTER',
          reductionPercentage: '100% Contraindicated ⛔',
          status: 'contraindicated',
          recommendationSummary: 'CrCl < 15 mL/min: Rivaroxaban is not recommended due to significant renal elimination (~36% unchanged in urine) and lack of safety data.',
          alertSeverity: 'critical',
          clinicalWarning: 'Fatal hemorrhage risk. Use adjusted-dose parenteral anticoagulation or Warfarin.',
          monitoringParameters: ['Switch to alternative agent']
        };
      } else if (crcl <= 50) {
        return {
          adjustedDose: '15 mg PO once daily with the evening meal.',
          frequency: 'Once daily with evening meal',
          reductionPercentage: '25% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 15 - 50 mL/min: Reduce dose to 15 mg PO once daily. Must be taken with food for complete bioavailability.',
          alertSeverity: 'high',
          clinicalWarning: 'Taking 15mg or 20mg without food decreases absorption by >35%, causing therapeutic failure and stroke.',
          monitoringParameters: ['Renal labs every 3 months', 'Signs of bleeding', 'CBC']
        };
      }
      return {
        adjustedDose: '20 mg PO once daily with the evening meal.',
        frequency: 'Once daily with evening meal',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard 20 mg once daily with meal.',
        alertSeverity: 'low',
        clinicalWarning: 'Must be ingested with a substantial meal.',
        monitoringParameters: ['Annual renal function']
      };
    },
    guidelineReference: 'ROCKET-AF Trial & FDA Package Insert'
  },
  {
    id: 'ciprofloxacin',
    drugName: 'Ciprofloxacin (Fluoroquinolone)',
    brandNames: ['Cipro', 'Ciflox'],
    category: 'Antimicrobials',
    standardDose: '500 - 750 mg PO q12h (or 400 mg IV q8-12h).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 30) {
        return {
          adjustedDose: '250 - 500 mg PO every 18 to 24 hours (or 200 - 400 mg IV q18-24h).',
          frequency: 'Every 18 to 24 hours',
          reductionPercentage: '50% Dose & Frequency Reduction',
          status: 'extended_interval',
          recommendationSummary: 'CrCl < 30 mL/min: Reduce dose and extend interval to once every 18-24 hours.',
          alertSeverity: 'high',
          clinicalWarning: 'Elevated serum levels increase risks of QT prolongation, CNS toxicity/seizures, and tendon rupture.',
          monitoringParameters: ['ECG interval (QTc)', 'Renal labs', 'Mental status']
        };
      } else if (crcl <= 50) {
        return {
          adjustedDose: '250 - 500 mg PO every 12 hours (or 200 - 400 mg IV q12h).',
          frequency: 'Every 12 hours',
          reductionPercentage: '25% - 33% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 30 - 50 mL/min: Mild dose reduction to 250-500 mg PO every 12 hours.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Separate from oral antacids, calcium, iron, or sucralfate by at least 2 hours before or 6 hours after.',
          monitoringParameters: ['Renal function']
        };
      }
      return {
        adjustedDose: '500 mg PO every 12 hours (750mg BID for severe Pseudomonas).',
        frequency: 'Every 12 hours',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard dosing.',
        alertSeverity: 'low',
        clinicalWarning: 'Maintain high fluid intake to prevent crystalluria.',
        monitoringParameters: ['Clinical response']
      };
    },
    guidelineReference: 'Ethiopian National STG 5th Edition & Sanford Antimicrobial Guide'
  },
  {
    id: 'fluconazole',
    drugName: 'Fluconazole (Triazole Antifungal)',
    brandNames: ['Diflucan'],
    category: 'Antimicrobials',
    standardDose: '100 - 400 mg PO/IV once daily (800mg day 1 in cryptococcal meningitis).',
    calculateAdjustedDose: (crcl) => {
      if (crcl <= 50) {
        return {
          adjustedDose: 'Loading dose 100% on Day 1, then REDUCE daily maintenance dose by 50%.',
          frequency: 'Once daily (50% of standard dose)',
          reductionPercentage: '50% Maintenance Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl ≤ 50 mL/min: Administer full loading dose on Day 1 (100%), then reduce subsequent daily maintenance doses by 50%. On hemodialysis days, give dose after dialysis.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Fluconazole is 80% eliminated unchanged in urine. Accumulation prolongs QTc and elevates liver transaminases.',
          monitoringParameters: ['ECG QTc interval', 'Liver function tests (ALT/AST)', 'Serum Creatinine']
        };
      }
      return {
        adjustedDose: '100 - 400 mg PO/IV once daily.',
        frequency: 'Once daily',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard full dose.',
        alertSeverity: 'low',
        clinicalWarning: 'Potent CYP2C9 and moderate CYP3A4 inhibitor; check for drug-drug interactions (Warfarin, Phenytoin, DOACs).',
        monitoringParameters: ['LFTs periodically']
      };
    },
    guidelineReference: 'IDSA Clinical Practice Guidelines for the Management of Candidiasis'
  },
  {
    id: 'colchicine',
    drugName: 'Colchicine',
    brandNames: ['Colcrys'],
    category: 'Analgesics & Gout',
    standardDose: 'Acute flare: 1.2 mg PO stat, followed by 0.6 mg in 1 hour (max 1.8 mg). Prophylaxis: 0.6 mg daily.',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 15) {
        return {
          adjustedDose: 'STRICTLY CONTRAINDICATED (0 mg).',
          frequency: 'DO NOT ADMINISTER',
          reductionPercentage: '100% Contraindicated ⛔',
          status: 'contraindicated',
          recommendationSummary: 'CrCl < 15 mL/min: Colchicine is contraindicated due to fatal neuromyopathy, rhabdomyolysis, and bone marrow aplasia.',
          alertSeverity: 'critical',
          clinicalWarning: 'FATAL TOXICITY: Use intra-articular or oral corticosteroid (Prednisolone) for acute gout in severe renal failure.',
          monitoringParameters: ['Alternative therapy with steroids']
        };
      } else if (crcl < 30) {
        return {
          adjustedDose: '0.3 mg PO once daily (or 0.6 mg every other day). For acute gout: 0.6 mg single dose, do NOT repeat course for at least 2 weeks.',
          frequency: 'Every other day or single dose',
          reductionPercentage: '67% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 15 - 29 mL/min: Substantial dose reduction required. Do not repeat acute flare treatment course within 14 days.',
          alertSeverity: 'high',
          clinicalWarning: 'Never combine with clarithromycin, ketoconazole, or cyclosporine (fatal interaction reported in CKD).',
          monitoringParameters: ['Creatine Kinase (myopathy check)', 'CBC', 'Renal labs']
        };
      } else if (crcl < 50) {
        return {
          adjustedDose: '0.6 mg PO once daily (or 0.3 mg twice daily).',
          frequency: 'Once daily',
          reductionPercentage: 'Standard / Mild Limit',
          status: 'normal',
          recommendationSummary: 'CrCl 30 - 49 mL/min: Standard acute dose acceptable; prophylaxis limit to 0.6 mg daily.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Discontinue immediately at first sign of nausea, diarrhea, or muscle weakness.',
          monitoringParameters: ['GI symptoms', 'Renal function']
        };
      }
      return {
        adjustedDose: 'Acute flare: 1.2 mg PO stat, then 0.6 mg in 1 hour. Prophylaxis: 0.6 mg once or twice daily.',
        frequency: 'As indicated for acute flare / prophylaxis',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl ≥ 50 mL/min: Standard dosage.',
        alertSeverity: 'low',
        clinicalWarning: 'Avoid grapefruit juice.',
        monitoringParameters: ['Clinical resolution']
      };
    },
    guidelineReference: 'ACR Gout Guidelines & FDA Black Box Alert on Colchicine Interactions'
  },
  {
    id: 'allopurinol',
    drugName: 'Allopurinol (Xanthine Oxidase Inhibitor)',
    brandNames: ['Zyloprim'],
    category: 'Analgesics & Gout',
    standardDose: '100 - 300 mg PO once daily (Titrate up to 800 mg/day as needed to reach serum urate < 6 mg/dL).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 10) {
        return {
          adjustedDose: 'Start with 50 mg PO every 2 to 3 days (or 50 mg twice weekly).',
          frequency: 'Every 2-3 days (Max 100 mg/day)',
          reductionPercentage: '75% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl < 10 mL/min: Severe accumulation of active metabolite Oxypurinol occurs. Start with 50mg every 2-3 days.',
          alertSeverity: 'critical',
          clinicalWarning: 'ALLOPURINOL HYPERSENSITIVITY SYNDROME (AHS / DRESS): Life-threatening toxic epidermal necrolysis, eosinophilia, and hepatitis risk escalates markedly in unadjusted renal impairment.',
          monitoringParameters: ['Skin inspection for rash or mucosal blisters (STOP immediately)', 'CBC with differential (eosinophils)', 'LFTs', 'Serum Urate']
        };
      } else if (crcl <= 20) {
        return {
          adjustedDose: 'Start with 50 - 100 mg PO once daily (Max 100 mg/day).',
          frequency: 'Once daily (Max 100mg)',
          reductionPercentage: '67% Dose Restriction',
          status: 'reduced',
          recommendationSummary: 'CrCl 10 - 20 mL/min: Start with 50-100 mg daily. Titrate very slowly while checking for dermatologic reactions.',
          alertSeverity: 'high',
          clinicalWarning: 'HLA-B*5801 allele screening recommended in high-risk populations.',
          monitoringParameters: ['Skin examination', 'Serum Uric Acid', 'Renal function']
        };
      } else if (crcl <= 50) {
        return {
          adjustedDose: 'Start with 100 mg PO once daily (Max 200 mg/day).',
          frequency: 'Once daily (Max 200mg)',
          reductionPercentage: '33% Dose Restriction',
          status: 'reduced',
          recommendationSummary: 'CrCl 21 - 50 mL/min: Start at 100 mg daily; titrate cautiously to target serum urate < 6.0 mg/dL.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Ensure co-prophylaxis with low-dose colchicine or steroid during initiation.',
          monitoringParameters: ['Serum Urate monthly during titration']
        };
      }
      return {
        adjustedDose: '100 mg PO daily starting dose, titrate by 100mg every 2-4 weeks to target urate < 6 mg/dL (Max 800mg).',
        frequency: 'Once daily (Divided doses if > 300mg)',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard protocol.',
        alertSeverity: 'low',
        clinicalWarning: 'Take after meals with plenty of fluids.',
        monitoringParameters: ['Serum Urate every 2-4 weeks during titration']
      };
    },
    guidelineReference: 'ACR Guideline for the Management of Gout'
  },
  {
    id: 'digoxin',
    drugName: 'Digoxin (Cardiac Glycoside)',
    brandNames: ['Lanoxin'],
    category: 'Cardiovascular & Anticoagulants',
    standardDose: '0.125 - 0.25 mg PO once daily (Target serum level: 0.5 - 0.9 ng/mL).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 10) {
        return {
          adjustedDose: '0.0625 mg PO every 48 hours (or 0.0625 mg twice weekly).',
          frequency: 'Every 2 to 3 days',
          reductionPercentage: '75% Dose Reduction',
          status: 'extended_interval',
          recommendationSummary: 'CrCl < 10 mL/min: Digoxin is 70-80% excreted unchanged by kidneys. Half-life extends from 36 hours to > 5 days in ESRD. Avoid if possible.',
          alertSeverity: 'critical',
          clinicalWarning: 'DIGITALIS TOXICITY ALERT: Lethal ventricular tachyarrhythmias, heart block, xanthopsia (yellow-green vision), and nausea. Maintain strict potassium > 4.0 mEq/L.',
          monitoringParameters: ['Serum Digoxin concentration (draw >6-8h post dose)', 'Serum Potassium and Magnesium', 'ECG (PR prolongation, ventricular ectopy)']
        };
      } else if (crcl < 30) {
        return {
          adjustedDose: '0.0625 mg PO once daily (or 0.125 mg every other day).',
          frequency: 'Once daily low-dose or alternate days',
          reductionPercentage: '50% - 60% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 10 - 29 mL/min: Reduce dose to 0.0625 mg daily. Target therapeutic window 0.5 - 0.9 ng/mL for heart failure.',
          alertSeverity: 'high',
          clinicalWarning: 'Toxicity risk increases dramatically if amiodarone, clarithromycin, or spironolactone is co-prescribed.',
          monitoringParameters: ['Serum Digoxin level', 'Serum K+ (hypokalemia provokes toxicity)', 'Heart rate']
        };
      } else if (crcl <= 50) {
        return {
          adjustedDose: '0.125 mg PO once daily.',
          frequency: 'Once daily',
          reductionPercentage: '50% Dose Reduction',
          status: 'reduced',
          recommendationSummary: 'CrCl 30 - 50 mL/min: Reduce to 0.125 mg once daily. Monitor serum level after 1-2 weeks of steady state.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Check serum electrolytes before each dose adjustment.',
          monitoringParameters: ['Serum Digoxin', 'Potassium', 'Renal function']
        };
      }
      return {
        adjustedDose: '0.125 - 0.25 mg PO once daily.',
        frequency: 'Once daily',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl > 50 mL/min: Standard maintenance dose.',
        alertSeverity: 'low',
        clinicalWarning: 'Target level 0.5 - 0.9 ng/mL.',
        monitoringParameters: ['Annual Digoxin level', 'Serum K+']
      };
    },
    guidelineReference: 'ACC/AHA Heart Failure Guidelines & Lexicomp Clinical Drug Reference'
  },
  {
    id: 'empagliflozin',
    drugName: 'Empagliflozin / Dapagliflozin (SGLT2 Inhibitor)',
    brandNames: ['Jardiance', 'Forxiga'],
    category: 'Diabetes & Endocrine',
    standardDose: '10 mg PO once daily (can increase to 25 mg daily for glycemic control if eGFR > 45).',
    calculateAdjustedDose: (crcl) => {
      if (crcl < 20) {
        return {
          adjustedDose: 'Initiation not recommended (Withhold if on dialysis).',
          frequency: 'NOT RECOMMENDED',
          reductionPercentage: 'Withhold / Contraindicated',
          status: 'contraindicated',
          recommendationSummary: 'CrCl < 20 mL/min: Insufficient filtration to drive SGLT2 glucosuria. Discontinue if patient transitions to hemodialysis.',
          alertSeverity: 'high',
          clinicalWarning: 'Euglycemic DKA risk in catabolic or surgical patients. Withhold 3-4 days before scheduled major surgery.',
          monitoringParameters: ['Volume status', 'Electrolytes']
        };
      } else if (crcl < 45) {
        return {
          adjustedDose: '10 mg PO once daily (Fixed dose; do NOT escalate to 25 mg).',
          frequency: 'Once daily morning',
          reductionPercentage: 'Dose Capped at 10mg',
          status: 'reduced',
          recommendationSummary: 'CrCl 20 - 44 mL/min: Continue 10 mg daily for proven cardiorenal risk reduction (EMPA-KIDNEY / DAPA-CKD). Note: Glycemic lowering effect is diminished; additional hypoglycemic agents may be required.',
          alertSeverity: 'moderate',
          clinicalWarning: 'Expect a transient reversible drop in eGFR up to 30% upon initiation (hemodynamic intraglomerular pressure reduction; nephroprotective long-term).',
          monitoringParameters: ['Serum Creatinine at 2-4 weeks', 'Urine output', 'Signs of mycotic genital infection']
        };
      }
      return {
        adjustedDose: '10 mg PO once daily (can titrate to 25 mg daily for glycemic target).',
        frequency: 'Once daily morning',
        reductionPercentage: 'Standard Dose (100%)',
        status: 'normal',
        recommendationSummary: 'CrCl ≥ 45 mL/min: Full glycemic and cardiorenal organoprotection.',
        alertSeverity: 'low',
        clinicalWarning: 'Counsel on perineal hygiene and staying hydrated.',
        monitoringParameters: ['eGFR every 6 months', 'HbA1c']
      };
    },
    guidelineReference: 'KDIGO 2023 Clinical Practice Guideline for Diabetes Management in CKD'
  }
];
