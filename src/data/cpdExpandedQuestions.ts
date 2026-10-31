import { CPDQuizQuestion } from '../types';

export const cpd20QuestionsBank: Record<string, CPDQuizQuestion[]> = {
  "cpd-pharmacotherapy": [
    {
      id: "pt-1",
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
      id: "pt-2",
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
      id: "pt-3",
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
      id: "pt-4",
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
      id: "pt-5",
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
    },
    {
      id: "pt-6",
      question: "In Diabetic Ketoacidosis (DKA) management, at what serum potassium threshold must intravenous insulin infusion be DELAYED to avoid fatal cardiac arrhythmias?",
      options: [
        "Serum K+ < 5.0 mEq/L",
        "Serum K+ < 3.3 mEq/L",
        "Serum K+ > 5.5 mEq/L",
        "Insulin must never be delayed in DKA regardless of potassium"
      ],
      correctAnswerIndex: 1,
      explanation: "Insulin drives potassium into cells. If baseline K+ is < 3.3 mEq/L, starting insulin can precipitate fatal ventricular arrhythmias, asystole, or respiratory arrest. Potassium must be replenished above 3.3 mEq/L before insulin is initiated.",
      guidelineReference: "ADA Diabetes Care Guidelines on Hyperglycemic Crises in Adults"
    },
    {
      id: "pt-7",
      question: "Which beta-blocker is NOT evidence-based for reducing all-cause mortality in patients with Heart Failure with Reduced Ejection Fraction (HFrEF)?",
      options: [
        "Carvedilol",
        "Bisoprolol",
        "Metoprolol Succinate (Extended Release)",
        "Atenolol"
      ],
      correctAnswerIndex: 3,
      explanation: "Only three beta-blockers have demonstrated mortality benefit in landmark HFrEF clinical trials: Bisoprolol (CIBIS-II), Carvedilol (COPERNICUS), and Metoprolol Succinate extended release (MERIT-HF). Atenolol and short-acting Metoprolol Tartrate are NOT approved for HFrEF mortality reduction.",
      guidelineReference: "ACC/AHA Guideline for the Management of Heart Failure"
    },
    {
      id: "pt-8",
      question: "A 67-year-old female with non-valvular atrial fibrillation has a CHA2DS2-VASc score of 4. Her estimated CrCl is 22 mL/min. Which anticoagulant dose is recommended?",
      options: [
        "Aspirin 81 mg daily alone",
        "Apixaban 2.5 mg PO twice daily (or dose adjusted per criteria)",
        "Dabigatran 150 mg PO twice daily",
        "Rivaroxaban 20 mg PO daily"
      ],
      correctAnswerIndex: 1,
      explanation: "Apixaban is primarily eliminated non-renally (approx. 27% renal elimination) and is FDA/EMA approved with dosage adjustments down to ESRD on dialysis. Dabigatran is 80% renally cleared and contraindicated at CrCl < 30 mL/min.",
      guidelineReference: "AHA/ACC Atrial Fibrillation Guidelines & FDA Prescribing Information"
    },
    {
      id: "pt-9",
      question: "What is the recommended ratio of Spironolactone to Furosemide when initiating diuretic therapy for cirrhotic ascites to maintain normokalemia?",
      options: [
        "100 mg Spironolactone to 40 mg Furosemide",
        "25 mg Spironolactone to 80 mg Furosemide",
        "200 mg Spironolactone to 10 mg Furosemide",
        "Spironolactone should never be combined with Furosemide in cirrhosis"
      ],
      correctAnswerIndex: 0,
      explanation: "The standard 100:40 ratio (100mg Spironolactone : 40mg Furosemide) maintains electrolyte balance (counteracts furosemide hypokalemia with spironolactone potassium-sparing action) while effectively mobilizing intra-abdominal fluid.",
      guidelineReference: "AASLD Practice Guidelines: Management of Adult Patients with Ascites"
    },
    {
      id: "pt-10",
      question: "In the resuscitation of adult septic shock, what is the initial recommended crystalloid fluid bolus volume according to the Surviving Sepsis Campaign within the first 3 hours?",
      options: [
        "500 mL Normal Saline bolus",
        "30 mL/kg of balanced crystalloid (e.g. Ringer's Lactate)",
        "10 mL/kg of 5% Albumin",
        "50 mL/kg of Dextrose 5% in Water"
      ],
      correctAnswerIndex: 1,
      explanation: "The Surviving Sepsis Campaign 1-hour/3-hour bundle recommends 30 mL/kg of IV crystalloids (preferably balanced crystalloids like Ringer's Lactate) for hypotension or serum lactate ≥ 4 mmol/L.",
      guidelineReference: "Surviving Sepsis Campaign International Guidelines 2024"
    },
    {
      id: "pt-11",
      question: "Which intravenous agent is the first-line medication for terminating prolonged generalized convulsive Status Epilepticus within the first 5 to 10 minutes?",
      options: [
        "Phenytoin IV 100 mg",
        "Lorazepam IV (0.1 mg/kg) or Diazepam IV (0.2 mg/kg)",
        "Valproate Sodium IV infusion",
        "Phenobarbital IM"
      ],
      correctAnswerIndex: 1,
      explanation: "Benzodiazepines (IV Lorazepam 4mg or Diazepam 10mg) are established by the Neurocritical Care Society and AES guidelines as first-line emergent therapy to arrest active seizure activity rapidly.",
      guidelineReference: "American Epilepsy Society (AES) Status Epilepticus Guideline"
    },
    {
      id: "pt-12",
      question: "What is the primary target for intravenous Nicardipine or Labetalol in a patient presenting with Hypertensive Emergency with acute aortic dissection?",
      options: [
        "Lower SBP to < 120 mmHg and heart rate < 60 bpm within 20 minutes",
        "Lower SBP by exactly 25% over 24 hours",
        "Maintain SBP between 160 and 180 mmHg",
        "Administer Sublingual Nifedipine immediately"
      ],
      correctAnswerIndex: 0,
      explanation: "In acute aortic dissection, shear stress (dP/dt) must be rapidly aborted. Beta-blockade (e.g., Esmolol/Labetalol) to HR < 60 bpm followed by vasodilator to SBP < 120 mmHg within 20 minutes is critical. Sublingual Nifedipine is contraindicated.",
      guidelineReference: "AHA/ACC Guideline for the Management of Hypertensive Crises"
    },
    {
      id: "pt-13",
      question: "What is the primary cellular mechanism of Digoxin toxicity that explains why hypokalemia dramatically exacerbates digitalis arrhythmias?",
      options: [
        "Potassium competitively inhibits Digoxin binding to the myocardial Na+/K+ ATPase pump",
        "Digoxin accelerates renal potassium excretion via collecting tubules",
        "Hypokalemia converts Digoxin into an active toxic epoxide",
        "Digoxin causes hypercalcemia by activating parathyroid hormone"
      ],
      correctAnswerIndex: 0,
      explanation: "Extracellular potassium ions compete with Digoxin for the phosphorylation site on Na+/K+ ATPase. When serum K+ is low, Digoxin binding increases exponentially, causing excessive intracellular Ca2+ overload and triggered automaticity.",
      guidelineReference: "Goodman & Gilman's Pharmacological Basis of Therapeutics"
    },
    {
      id: "pt-14",
      question: "In the 2024 Global Initiative for Asthma (GINA) guidelines, which strategy is recommended as the preferred reliever across all asthma severities (Track 1)?",
      options: [
        "Short-Acting Beta-2 Agonist (SABA e.g. Salbutamol) alone on demand",
        "Low-dose Inhaled Corticosteroid (ICS) combined with Formoterol (SMART / MART strategy)",
        "Oral Prednisone 20 mg on demand",
        "Theophylline sustained-release tablets daily"
      ],
      correctAnswerIndex: 1,
      explanation: "GINA no longer recommends SABA-only treatment due to increased risk of severe exacerbations and death. As-needed low-dose ICS-formoterol acts as both rapid symptom reliever and prevents inflammatory airway flares simultaneously.",
      guidelineReference: "GINA Global Strategy for Asthma Management and Prevention 2024"
    },
    {
      id: "pt-15",
      question: "What is the recommended serum urate target when titrating Allopurinol for chronic management of severe tophaceous gout?",
      options: [
        "Serum urate < 8.0 mg/dL",
        "Serum urate < 6.0 mg/dL (< 5.0 mg/dL if visible tophi present)",
        "Serum urate between 7.0 and 9.0 mg/dL",
        "Titrate allopurinol based only on joint pain without checking uric acid"
      ],
      correctAnswerIndex: 1,
      explanation: "ACR gout guidelines recommend a treat-to-target strategy with a serum urate goal of < 6.0 mg/dL (and < 5.0 mg/dL in severe tophaceous disease) to allow dissolution of existing monosodium urate crystals.",
      guidelineReference: "American College of Rheumatology (ACR) Guideline for Gout Management"
    },
    {
      id: "pt-16",
      question: "Which regimen is recommended as first-line empiric eradication therapy for Helicobacter pylori in areas with high Clarithromycin resistance (>15%)?",
      options: [
        "Standard Triple Therapy (PPI + Clarithromycin + Amoxicillin) for 7 days",
        "Bismuth Quadruple Therapy (PPI + Bismuth subsalicylate + Metronidazole + Tetracycline) for 14 days",
        "Amoxicillin alone for 21 days",
        "Ciprofloxacin plus Metronidazole for 5 days"
      ],
      correctAnswerIndex: 1,
      explanation: "Bismuth Quadruple Therapy for 14 days overcomes clarithromycin resistance and achieves eradication rates > 90%. Standard triple therapy is ineffective in areas with documented high macrolide resistance.",
      guidelineReference: "ACG Clinical Guideline: Treatment of Helicobacter pylori Infection"
    },
    {
      id: "pt-17",
      question: "A patient with acute hyperkalemia (serum K+ 6.8 mEq/L) exhibits widened QRS complexes and peaked T waves on 12-lead ECG. What is the immediate first-line medication to administer?",
      options: [
        "Sodium Polystyrene Sulfonate (Kayexalate) orally",
        "Intravenous Calcium Gluconate (10 mL of 10% solution over 2-3 minutes)",
        "Furosemide 40 mg IV bolus",
        "Hemodialysis catheter placement"
      ],
      correctAnswerIndex: 1,
      explanation: "Intravenous Calcium Gluconate does not lower potassium, but it membrane-stabilizes cardiac myocytes immediately (within 1-3 minutes) by antagonizing the depolarizing effect of hyperkalemia, preventing fatal ventricular fibrillation.",
      guidelineReference: "AHA ACLS Acute Hyperkalemia Emergency Protocols"
    },
    {
      id: "pt-18",
      question: "In suspected Heparin-Induced Thrombocytopenia (HIT Type II), what is the mandatory immediate management action?",
      options: [
        "Switch from Unfractionated Heparin to Enoxaparin immediately",
        "Stop all forms of heparin immediately and initiate a non-heparin direct thrombin inhibitor (e.g., Argatroban) or Fondaparinux",
        "Administer a prophylactic platelet transfusion",
        "Start Warfarin loading dose 10 mg stat"
      ],
      correctAnswerIndex: 1,
      explanation: "LMWH cross-reacts with PF4 antibodies in >95% of cases and must NOT be used. Platelet transfusions fuel the prothrombotic fire. Warfarin without a direct thrombin inhibitor can cause venous limb gangrene. Argatroban or Fondaparinux is mandatory.",
      guidelineReference: "American Society of Hematology (ASH) HIT Guidelines"
    },
    {
      id: "pt-19",
      question: "According to the updated IDSA/SHEA guidelines, what is the preferred first-line oral antimicrobial for an initial episode of Clostridioides difficile infection?",
      options: [
        "Oral Metronidazole 500 mg TID",
        "Oral Vancomycin 125 mg QID (or Oral Fidaxomicin 200 mg BID) for 10 days",
        "Intravenous Vancomycin 1 g BID",
        "Oral Ciprofloxacin 500 mg BID"
      ],
      correctAnswerIndex: 1,
      explanation: "Oral Vancomycin or Fidaxomicin is superior to Metronidazole for clinical cure and prevention of recurrence. Note that IV Vancomycin does NOT penetrate into the colonic lumen and is completely ineffective for C. difficile colitis.",
      guidelineReference: "IDSA/SHEA Focused Update on Clostridioides difficile Infection in Adults"
    },
    {
      id: "pt-20",
      question: "Which P2Y12 platelet inhibitor is a prodrug requiring two-step hepatic CYP activation and is subject to reduced efficacy in CYP2C19 poor metabolizers?",
      options: [
        "Ticagrelor",
        "Prasugrel",
        "Clopidogrel",
        "Cangrelor"
      ],
      correctAnswerIndex: 2,
      explanation: "Clopidogrel requires biotransformation by hepatic CYP2C19 into its active thiol metabolite. Patients with loss-of-function CYP2C19 alleles (*2, *3) exhibit impaired platelet inhibition and higher stent thrombosis rates. Ticagrelor is not a prodrug; Prasugrel metabolism is less CYP2C19 dependent.",
      guidelineReference: "CPIC Guideline for Clopidogrel and CYP2C19 Genotype"
    }
  ],
  "cpd-toxicology": [
    {
      id: "tox-1",
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
      id: "tox-2",
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
      id: "tox-3",
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
      id: "tox-4",
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
      id: "tox-5",
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
    },
    {
      id: "tox-6",
      question: "What is the specific antidote for acute Cyanide poisoning that works by directly binding cyanide ions to form non-toxic cyanocobalamin, excreted in the urine?",
      options: [
        "Hydroxocobalamin (Vitamin B12a)",
        "Methylene Blue",
        "Sodium Bicarbonate",
        "Atropine sulfate"
      ],
      correctAnswerIndex: 0,
      explanation: "Hydroxocobalamin contains a cobalt ion that binds cyanide with higher affinity than cytochrome c oxidase, creating non-toxic cyanocobalamin (Vitamin B12), which is safely excreted renally.",
      guidelineReference: "Emergency Medicine & Medical Toxicology Guidelines"
    },
    {
      id: "tox-7",
      question: "What characteristic urine color change indicates successful chelation of elemental iron during intravenous Deferoxamine therapy?",
      options: [
        "Bright green urine",
        "'Vin-rosé' (red-orange) colored urine caused by ferrioxamine complex",
        "Milky white urine",
        "Dark black urine"
      ],
      correctAnswerIndex: 1,
      explanation: "Deferoxamine chelates free ferric iron (Fe3+) in the bloodstream to form ferrioxamine, which imparts a classic reddish-orange ('vin-rosé') tint to the patient's urine, confirming active excretion.",
      guidelineReference: "Goldfrank's Toxicologic Emergencies"
    },
    {
      id: "tox-8",
      question: "Why is Sodium Bicarbonate IV infusion indicated in severe Tricyclic Antidepressant (TCA e.g. Amitriptyline) overdose when QRS duration exceeds 100 milliseconds?",
      options: [
        "It lowers serum potassium to stabilize conduction",
        "It provides a sodium load and alkalizes serum pH, reversing voltage-gated fast sodium channel blockade",
        "It directly binds TCA in the stomach to prevent absorption",
        "It induces rapid sedation to prevent convulsions"
      ],
      correctAnswerIndex: 1,
      explanation: "TCAs block cardiac fast inward sodium channels (Phase 0 depolarization), producing QRS prolongation and ventricular tachycardia. Sodium bicarbonate provides hypertonic sodium and alkalizes pH to 7.45–7.55, uncoupling the drug from the sodium channel.",
      guidelineReference: "ACMT Practice Guidelines on TCA Overdose Management"
    },
    {
      id: "tox-9",
      question: "In acute Ethylene Glycol (antifreeze) or Methanol ingestion, what is the competitive alcohol dehydrogenase inhibitor of choice used to prevent the formation of toxic metabolites?",
      options: [
        "Fomepizole (4-methylpyrazole) or intravenous Ethanol",
        "Disulfiram",
        "N-acetylcysteine",
        "Flumazenil"
      ],
      correctAnswerIndex: 0,
      explanation: "Ethylene glycol and methanol are metabolized by alcohol dehydrogenase into toxic glycolic/oxalic acids and formic acid. Fomepizole competitively inhibits alcohol dehydrogenase with an affinity 8,000 times greater than ethanol.",
      guidelineReference: "AACT Practice Guidelines on Toxic Alcohol Ingestions"
    },
    {
      id: "tox-10",
      question: "Why is the routine use of Flumazenil cautioned or contraindicated in comatose patients with suspected chronic benzodiazepine dependence or concurrent tricyclic antidepressant overdose?",
      options: [
        "It causes irreversible respiratory depression",
        "It can precipitate acute, refractory status epilepticus and lethal cardiac dysrhythmias",
        "It blocks dopamine receptors in the basal ganglia",
        "It induces severe hypertensive encephalopathy"
      ],
      correctAnswerIndex: 1,
      explanation: "Flumazenil precipitates sudden, severe benzodiazepine withdrawal seizures that are refractory to standard GABAergic therapies. In mixed TCA overdoses, removing benzodiazepine seizure protection results in fatal status epilepticus.",
      guidelineReference: "American College of Emergency Physicians (ACEP) Toxicology Protocols"
    },
    {
      id: "tox-11",
      question: "Which specific pharmacological agent is used to treat life-threatening methemoglobinemia when methemoglobin levels exceed 20-30%?",
      options: [
        "Methylene Blue (1-2 mg/kg IV)",
        "Vitamin C oral high-dose",
        "Glucagon IV",
        "Calcium Chloride"
      ],
      correctAnswerIndex: 0,
      explanation: "Methylene blue acts as a cofactor for NADPH-methemoglobin reductase, accelerating the reduction of ferric iron (Fe3+) in methemoglobin back to ferrous iron (Fe2+) in functional hemoglobin.",
      guidelineReference: "Clinical Practice Guideline: Management of Methemoglobinemia"
    },
    {
      id: "tox-12",
      question: "What is the mechanism of N-acetylcysteine (NAC) in preventing liver necrosis in severe Paracetamol (Acetaminophen) toxicity?",
      options: [
        "Inhibits gastric absorption of paracetamol",
        "Replenishes hepatic glutathione stores and acts as a direct substitute to detoxify NAPQI",
        "Blocks glucuronidation in the liver",
        "Accelerates renal clearance of parent paracetamol"
      ],
      correctAnswerIndex: 1,
      explanation: "When hepatic glutathione is exhausted (>70% depletion), the reactive toxic metabolite NAPQI binds to hepatocytes causing centrilobular necrosis. NAC supplies cysteine to synthesize glutathione and directly binds NAPQI.",
      guidelineReference: "WHO Poisoning Series: Paracetamol Toxicity"
    },
    {
      id: "tox-13",
      question: "In acute heavy metal poisoning by elemental Lead or Arsenic, which chelating agent is formulated for oral outpatient administration in children and adults?",
      options: [
        "Dimercaprol (BAL) in peanut oil",
        "Succimer (DMSA - Meso-2,3-dimercaptosuccinic acid)",
        "Penicillamine alone",
        "Deferasirox"
      ],
      correctAnswerIndex: 1,
      explanation: "Succimer (DMSA) is an orally bioavailable, hydrophilic chelator with lower toxicity and higher selectivity for lead and arsenic, making it preferred for pediatric lead poisoning with blood levels 45-69 mcg/dL.",
      guidelineReference: "CDC Guidelines for Childhood Lead Poisoning Prevention"
    },
    {
      id: "tox-14",
      question: "A patient presents with hyperthermia (temp 39.8°C), ocular clonus, spontaneous ankle myoclonus, hyperreflexia, and diarrhea after starting Fluoxetine and Tramadol. What is the diagnosis and antidote?",
      options: [
        "Neuroleptic Malignant Syndrome; treat with Dantrolene",
        "Serotonin Syndrome (Hunter Criteria); treat with Cyproheptadine (5-HT2A antagonist)",
        "Malignant Hyperthermia; treat with Haloperidol",
        "Anticholinergic toxidrome; treat with Physostigmine"
      ],
      correctAnswerIndex: 1,
      explanation: "The Hunter Toxicity Criteria (clonus + hyperreflexia + hyperthermia) establishes Serotonin Syndrome resulting from synergistic serotonergic agents (SSRI + Tramadol). Cyproheptadine is the specific 5-HT2A receptor antagonist antidote.",
      guidelineReference: "Hunter Serotonin Toxicity Criteria & NEJM Clinical Practice Review"
    },
    {
      id: "tox-15",
      question: "What is the primary antidote for acute Isoniazid (INH) overdose presenting with severe refractory seizures and lactic acidosis?",
      options: [
        "Pyridoxine (Vitamin B6) administered gram-for-gram to the amount of INH ingested",
        "Thiamine (Vitamin B1)",
        "Niacin (Vitamin B3)",
        "Folic acid"
      ],
      correctAnswerIndex: 0,
      explanation: "Isoniazid inhibits pyridoxal phosphate (Vitamin B6), halting GABA synthesis in the brain. Giving IV Pyridoxine (1g per 1g of INH ingested, or 5g empirically) immediately restores GABA and aborts intractable status epilepticus.",
      guidelineReference: "Goldfrank's Toxicologic Emergencies & WHO INH Overdose Guidelines"
    },
    {
      id: "tox-16",
      question: "Which antidote is administered for severe Sulfonylurea-induced recurrent hypoglycemia refractory to continuous intravenous dextrose infusions?",
      options: [
        "Glucagon bolus repeated Q15min",
        "Octreotide (somatostatin analog) 50-100 mcg Subcutaneously Q8-12H",
        "Hydrocortisone IV",
        "Metformin"
      ],
      correctAnswerIndex: 1,
      explanation: "Dextrose infusion stimulates additional insulin release from pancreatic beta cells in sulfonylurea overdose. Octreotide directly suppresses insulin secretion from beta-islet cells, preventing rebound hypoglycemia.",
      guidelineReference: "Emergency Medicine Toxicology Practice Guidelines"
    },
    {
      id: "tox-17",
      question: "What is the target urinary pH when performing urinary alkalinization with intravenous Sodium Bicarbonate for moderate Salicylate (Aspirin) poisoning?",
      options: [
        "Urinary pH between 5.5 and 6.0",
        "Urinary pH between 7.5 and 8.5",
        "Urinary pH strictly > 9.5",
        "Urine pH does not affect salicylate clearance"
      ],
      correctAnswerIndex: 1,
      explanation: "Salicylic acid is a weak acid. Alkalinizing the urine to pH 7.5–8.5 converts salicylate into its charged, ionized form (salicylate anion) in the renal tubules, trapping it and preventing reabsorption ('ion trapping'), increasing clearance by over 20-fold.",
      guidelineReference: "Clinical Toxicology Consensus on Salicylate Alkalinization"
    },
    {
      id: "tox-18",
      question: "Which of the following is an absolute contraindication to the administration of Activated Charcoal in an acute poisoning ingestion?",
      options: [
        "Ingestion of Paracetamol 2 hours prior",
        "Ingestion of Corrosive strong acids/alkalis, hydrocarbons, or an unprotected compromised airway",
        "Ingestion of extended-release Theophylline",
        "Ingestion of Carbamazepine"
      ],
      correctAnswerIndex: 1,
      explanation: "Activated charcoal does not bind caustics/corrosives (acids/alkalis) and obscures endoscopy visualization. In hydrocarbons, aspiration chemical pneumonitis risk is catastrophic. Unprotected airway carries high aspiration risk.",
      guidelineReference: "AACT/EAPCCT Position Paper: Single-Dose Activated Charcoal"
    },
    {
      id: "tox-19",
      question: "In life-threatening Digoxin toxicity with refractory ventricular arrhythmias or severe hyperkalemia (K+ > 5.5 mEq/L), what is the definitive antidote?",
      options: [
        "Calcium gluconate IV bolus",
        "Digoxin-Specific Antibody Fragments (DigiFab / Digibind)",
        "Hemodialysis",
        "Atropine alone"
      ],
      correctAnswerIndex: 1,
      explanation: "Digoxin-specific Fab fragments bind free intravascular digoxin with an affinity 1000x greater than Na+/K+ ATPase, rapidly reversing cardiac toxicity. Calcium is contraindicated in severe digoxin toxicity ('stone heart' hypothesis).",
      guidelineReference: "AHA Statement on Management of Digitalis Poisoning"
    },
    {
      id: "tox-20",
      question: "Which toxidrome is characterized by: Mydriasis, dry flushed skin, hyperthermia, delirium ('mad as a hatter'), urinary retention, and absent bowel sounds?",
      options: [
        "Cholinergic toxidrome",
        "Anticholinergic toxidrome (e.g., Atropine, Diphenhydramine, Scopolamine)",
        "Sympathomimetic toxidrome",
        "Opioid toxidrome"
      ],
      correctAnswerIndex: 1,
      explanation: "Classic mnemonic: 'Blind as a bat (mydriasis), dry as a bone (anhidrosis), red as a beet (cutaneous vasodilation), hot as a hare (hyperthermia), mad as a hatter (delirium), and full as a flask (urinary retention)'.",
      guidelineReference: "Goldfrank's Toxicologic Emergencies & Emergency Medicine Core Protocols"
    }
  ]
};

// Generic expansion pool that complements any CPD module to guarantee exactly 20 questions
export function get20QuestionsForModule(module: { id: string; questions: CPDQuizQuestion[] }): CPDQuizQuestion[] {
  // If specific 20 questions exist in bank:
  if (cpd20QuestionsBank[module.id] && cpd20QuestionsBank[module.id].length >= 20) {
    return cpd20QuestionsBank[module.id].slice(0, 20);
  }

  // Otherwise, use module's original questions and complement from domain bank to make 20:
  const base = [...module.questions];
  const domainFallback = cpd20QuestionsBank["cpd-pharmacotherapy"];

  let i = 0;
  while (base.length < 20 && i < domainFallback.length) {
    const candidate = domainFallback[i];
    if (!base.some(q => q.question === candidate.question)) {
      base.push({
        ...candidate,
        id: `${module.id}-gen-${base.length + 1}`
      });
    }
    i++;
  }

  return base.slice(0, 20);
}
