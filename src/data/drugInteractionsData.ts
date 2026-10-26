import { DrugInteraction } from '../types';

export const commonDrugList = [
  "Warfarin",
  "Aspirin",
  "Ibuprofen",
  "Lisinopril",
  "Spironolactone",
  "Potassium Chloride",
  "Clopidogrel",
  "Omeprazole",
  "Pantoprazole",
  "Simvastatin",
  "Atorvastatin",
  "Clarithromycin",
  "Erythromycin",
  "Metformin",
  "Iodinated Contrast",
  "Fluoxetine",
  "Phenelzine (MAOI)",
  "Tramadol",
  "Digoxin",
  "Amiodarone",
  "Ciprofloxacin",
  "Calcium Carbonate",
  "Lithium",
  "Hydrochlorothiazide",
  "Sildenafil",
  "Nitroglycerin",
  "Levothyroxine",
  "Ferrous Sulfate",
  "Theophylline",
  "Methotrexate",
  "Carbamazepine",
  "Rifampin",
  "Oral Contraceptive (EE/LNG)",
  "Tacrolimus",
  "Fluconazole"
];

export const drugInteractionsData: DrugInteraction[] = [
  {
    id: "int-1",
    drugA: "Warfarin",
    drugB: "Ibuprofen",
    severity: "major",
    mechanism: "NSAIDs inhibit platelet cyclooxygenase-1 (COX-1), diminishing thromboxane A2-mediated platelet aggregation and induce direct gastrointestinal mucosal erosion, synergistically multiplying bleeding risk with vitamin K antagonism.",
    clinicalEffect: "Substantially elevated risk of severe upper gastrointestinal bleeding, prolonged INR, and hemorrhagic complications.",
    management: "Avoid combination. For mild to moderate pain or osteoarthritis, substitute Acetaminophen (Paracetamol) <= 2g/day or topical agents (capsaicin). If NSAID is strictly mandatory, co-prescribe a proton pump inhibitor (e.g. Pantoprazole) and monitor INR within 3-5 days.",
    alternatives: ["Acetaminophen (Paracetamol)", "Topical Diclofenac", "Physical therapy"]
  },
  {
    id: "int-2",
    drugA: "Lisinopril",
    drugB: "Spironolactone",
    severity: "major",
    mechanism: "Both agents impair renal potassium excretion: ACE inhibitors decrease aldosterone synthesis via angiotensin II suppression, while Spironolactone competitively antagonizes aldosterone receptors in the cortical collecting tubule.",
    clinicalEffect: "Severe, life-threatening hyperkalemia (serum K+ > 5.5-6.5 mEq/L) which may trigger peaked T waves, conduction delays, ventricular arrhythmias, and asystole.",
    management: "If combined for HFrEF GDMT, ensure baseline eGFR > 30 mL/min and baseline K+ < 5.0 mEq/L. Start with low-dose Spironolactone (12.5-25 mg daily). Check serum potassium and creatinine at 1 week, 4 weeks, and every 3-6 months thereafter.",
    alternatives: ["Eplerenone (with identical potassium monitoring)", "Hydralazine + Isosorbide Dinitrate if hyperkalemic"]
  },
  {
    id: "int-3",
    drugA: "Clopidogrel",
    drugB: "Omeprazole",
    severity: "major",
    mechanism: "Clopidogrel is an inactive prodrug requiring CYP2C19 bioactivation into its thiol metabolite. Omeprazole is a potent, irreversible mechanism-based inhibitor of CYP2C19.",
    clinicalEffect: "Significant reduction (up to 45%) in active antiplatelet metabolite levels, leading to increased risk of stent thrombosis and recurrent myocardial infarction.",
    management: "Avoid Omeprazole and Esomeprazole. Switch to Pantoprazole or Rabeprazole, which exhibit minimal CYP2C19 inhibition, or use an H2-receptor antagonist like Famotidine if GI protection is indicated.",
    alternatives: ["Pantoprazole", "Famotidine", "Rabeprazole"],
    cypEnzyme: "CYP2C19"
  },
  {
    id: "int-4",
    drugA: "Simvastatin",
    drugB: "Clarithromycin",
    severity: "major",
    mechanism: "Clarithromycin is a potent CYP3A4 and OATP1B1 inhibitor. Simvastatin undergoes extensive first-pass metabolism by CYP3A4; inhibition causes a 10- to 12-fold spike in systemic simvastatin acid exposure.",
    clinicalEffect: "Severe statin-induced myopathy and fatal rhabdomyolysis with acute kidney failure.",
    management: "Contraindicated. Temporarily suspend Simvastatin during macrolide therapy, or substitute an antimicrobial that does not inhibit CYP3A4 (such as Azithromycin or Amoxicillin-Clavulanate), or switch statin to Rosuvastatin or Pravastatin.",
    alternatives: ["Azithromycin (no CYP3A4 inhibition)", "Rosuvastatin (metabolized by CYP2C9)", "Pravastatin"],
    cypEnzyme: "CYP3A4"
  },
  {
    id: "int-5",
    drugA: "Sildenafil",
    drugB: "Nitroglycerin",
    severity: "major",
    mechanism: "PDE5 inhibitors prevent cyclic GMP breakdown in vascular smooth muscle, while organic nitrates deliver nitric oxide to stimulate guanylyl cyclase. Concurrent use causes dramatic synergistic accumulation of cGMP.",
    clinicalEffect: "Profound, uncorrectable systemic vasodilation, precipitous drop in blood pressure, reflex tachycardia, coronary hypoperfusion, and fatal myocardial infarction.",
    management: "Absolute contraindication. Never administer nitrates within 24 hours of Sildenafil or Vardenafil, and within 48 hours of Tadalafil.",
    alternatives: ["Non-nitrate antianginal agents (e.g. Beta-blockers, Ranolazine, Amlodipine)"]
  },
  {
    id: "int-6",
    drugA: "Digoxin",
    drugB: "Amiodarone",
    severity: "major",
    mechanism: "Amiodarone inhibits P-glycoprotein (MDR1) efflux transporter in renal tubules and biliary tract, halving Digoxin clearance. It also displaces digoxin from tissue binding sites.",
    clinicalEffect: "Digoxin toxicity: nausea, yellow-green visual halos (xanthopsia), heart block, ventricular premature contractions, bidirectional ventricular tachycardia.",
    management: "Empirically reduce Digoxin dose by 50% immediately upon starting Amiodarone. Check serum Digoxin concentration and ECG after 1-2 weeks (Target Digoxin level 0.5-0.9 ng/mL).",
    alternatives: ["Reduce Digoxin dose by 50%", "Consider discontinuing Digoxin if Amiodarone controls ventricular rate alone"]
  },
  {
    id: "int-7",
    drugA: "Lithium",
    drugB: "Hydrochlorothiazide",
    severity: "major",
    mechanism: "Thiazide diuretics induce sodium and water depletion in the distal convoluted tubule, triggering compensatory proximal tubule reabsorption of both Sodium and Lithium (which shares the Na+ transporter).",
    clinicalEffect: "Lithium accumulation and acute toxicity: coarse tremors, ataxia, confusion, seizures, acute tubular necrosis, coma.",
    management: "Avoid thiazides if possible. If required, reduce Lithium dose by 30-50% and monitor serum Lithium levels twice weekly until steady state (target 0.6-1.0 mEq/L). Maintain adequate hydration.",
    alternatives: ["Calcium channel blocker for hypertension (e.g. Amlodipine)", "Loop diuretic with careful monitoring"]
  },
  {
    id: "int-8",
    drugA: "Ciprofloxacin",
    drugB: "Calcium Carbonate",
    severity: "moderate",
    mechanism: "Polyvalent multivalent metal cations (Ca2+, Mg2+, Fe2+, Al3+) form insoluble, non-absorbable chelate complexes with the 4-keto and 3-carboxyl groups of fluoroquinolones in the GI lumen.",
    clinicalEffect: "Up to 80% decrease in fluoroquinolone bioavailability, causing clinical treatment failure and emergence of bacterial resistance.",
    management: "Space administration: Give Ciprofloxacin at least 2 hours before or 4 to 6 hours after any calcium, magnesium, iron, or antacid supplements.",
    alternatives: ["Space administration by 4 hours", "Switch to Ceftriaxone or Azithromycin if spacing is unreliable"]
  },
  {
    id: "int-9",
    drugA: "Metformin",
    drugB: "Iodinated Contrast",
    severity: "major",
    mechanism: "Iodinated radiocontrast media can induce acute contrast-induced nephropathy (CIN), impairing renal elimination of Metformin and precipitating toxic biguanide accumulation.",
    clinicalEffect: "Metformin-associated lactic acidosis (MALA), with mortality rates exceeding 30-50%.",
    management: "Discontinue Metformin prior to or at the time of contrast administration in patients with eGFR 30-60 mL/min or undergoing arterial catheterization. Re-evaluate eGFR 48 hours post-procedure; restart only if renal function remains stable.",
    alternatives: ["Withhold Metformin 48 hours post-procedure", "Use intravenous hydration with normal saline prior to contrast"]
  },
  {
    id: "int-10",
    drugA: "Levothyroxine",
    drugB: "Ferrous Sulfate",
    severity: "moderate",
    mechanism: "Ferrous iron ions bind levothyroxine molecules in the acidic gastric environment forming a poorly soluble, unabsorbable ferric-thyroxine complex.",
    clinicalEffect: "Decreased thyroid hormone absorption leading to persistently elevated TSH and unresolved hypothyroid symptoms (fatigue, weight gain, cold intolerance).",
    management: "Separate oral administration times by at least 4 hours. Patient should take Levothyroxine on an empty stomach with plain water at least 60 minutes before breakfast, and Iron supplements with lunch or dinner.",
    alternatives: ["Separate dosing by 4 hours", "Take thyroid hormone on awakening and iron in the evening"]
  },
  {
    id: "int-11",
    drugA: "Fluoxetine",
    drugB: "Tramadol",
    severity: "major",
    mechanism: "Both medications increase synaptic serotonin concentrations (Fluoxetine via 5-HT reuptake inhibition; Tramadol via dual serotonin-norepinephrine reuptake inhibition). In addition, Fluoxetine strongly inhibits CYP2D6, the enzyme responsible for converting Tramadol into its active M1 mu-opioid metabolite.",
    clinicalEffect: "High risk of Serotonin Syndrome (hyperreflexia, clonus, autonomic instability, hyperthermia) and decreased analgesic efficacy accompanied by increased seizure risk.",
    management: "Avoid combination. Choose non-serotonergic analgesics (e.g. Paracetamol, topical NSAID) or an alternative antidepressant. If opioid is required, consider low-dose Morphine or Oxycodone with close monitoring.",
    alternatives: ["Acetaminophen", "Morphine low-dose", "Non-pharmacological pain strategies"]
  },
  {
    id: "int-12",
    drugA: "Rifampin",
    drugB: "Oral Contraceptive (EE/LNG)",
    severity: "major",
    mechanism: "Rifampin is one of the most potent known inducers of hepatic CYP3A4 enzymes and UDP-glucuronosyltransferases, accelerating the metabolism of ethinyl estradiol and progestins.",
    clinicalEffect: "Marked reduction in contraceptive hormone levels causing breakthrough bleeding, ovulation, and contraceptive failure (unintended pregnancy).",
    management: "Oral contraceptives, transdermal patches, and vaginal rings are ineffective during Rifampin therapy. Counsel patient to use a non-hormonal copper intrauterine device (IUD) or consistent dual barrier methods throughout therapy and for 28 days after completing Rifampin.",
    alternatives: ["Copper IUD (ParaGard)", "Barrier methods (male/female condoms)"]
  }
];
