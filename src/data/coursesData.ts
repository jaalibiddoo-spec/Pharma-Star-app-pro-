import { Course } from '../types';

export const coursesData: Course[] = [
  {
    id: "pharmacology",
    code: "PHARM-301",
    title: "Pharmacology",
    level: "Year 3 / Core",
    duration: "16 Weeks (64 Hours)",
    category: "clinical",
    icon: "Pill",
    description: "In-depth study of pharmacodynamics, pharmacokinetics, receptor kinetics, autonomous & central nervous system pharmacology, cardiovascular, and antimicrobial agents.",
    learningObjectives: [
      "Understand receptor-ligand binding kinetics and signal transduction pathways (GPCR, Tyrosine Kinase, Ion Channels).",
      "Differentiate competitive vs non-competitive antagonism with dose-response curve shifts.",
      "Calculate Volume of Distribution (Vd), Clearance (Cl), Half-life (t1/2), and steady-state kinetics.",
      "Master autonomic pharmacology: Cholinergic, Adrenergic agonist and antagonists."
    ],
    has3DModel: true,
    moaModelId: "gpcr_beta_blocker",
    videoDuration: "42 mins high-yield",
    modules: [
      {
        id: "pharm-m1",
        title: "Receptor Theory & Signal Transduction (GPCRs & Ion Channels)",
        summary: "Understanding the molecular targets of drugs and cellular amplification mechanisms.",
        content: `Pharmacodynamics examines the biochemical and physiologic effects of drugs and their mechanisms of action.
1. Receptor Classes:
   - G-Protein Coupled Receptors (GPCRs, 7-transmembrane): Gs (stimulates adenylyl cyclase -> cAMP increase), Gi (inhibits AC -> cAMP decrease), Gq (activates PLC -> IP3 & DAG -> Ca2+ mobilization and PKC activation).
   - Receptor Tyrosine Kinases (RTKs): Insulin and epidermal growth factors.
   - Ligand-gated ion channels: Nicotinic ACh receptors, GABA-A receptors (Cl- influx causes hyperpolarization).
   - Intracellular/Nuclear receptors: Glucocorticoids, thyroid hormone, estrogen.
2. Agonism vs Antagonism:
   - Full Agonist: Emax = 100%.
   - Partial Agonist: Emax < 100% even at full receptor occupancy; acts as competitive antagonist in the presence of full agonist.
   - Competitive Antagonist: Parallel rightward shift of log concentration-effect curve (increases EC50, no change in Emax). Reversible with higher agonist dose.
   - Non-Competitive / Irreversible Antagonist: Downward shift (depresses Emax, little or no shift in EC50). Cannot be overcome by increasing agonist concentration.`,
        clinicalPearls: [
          "Buprenorphine is a partial mu-opioid agonist; giving it to a patient with active methadone/fentanyl dependence can precipitate severe withdrawal.",
          "Esmolol has an ultra-short half-life (9 mins) due to rapid hydrolysis by red blood cell esterases, making it ideal for acute aortic dissection titration.",
          "Therapeutic index = TD50 / ED50. Narrow therapeutic index drugs (warfarin, digoxin, lithium, theophylline) require frequent TDM."
        ],
        keyDrugsOrConcepts: ["Propranolol", "Epinephrine", "Atropine", "Buprenorphine", "G-protein sub-types (Gs, Gi, Gq)"]
      },
      {
        id: "pharm-m2",
        title: "Cardiovascular Pharmacology: Anti-arrhythmics & Anti-hypertensives",
        summary: "Vaughan Williams classification, renin-angiotensin-aldosterone axis, and vasodilators.",
        content: `Cardiac electrophysiology dictates antiarrhythmic therapy:
- Class IA: Quinidine, Procainamide (moderate Na+ block, lengthens APD and QT interval).
- Class IB: Lidocaine, Mexiletine (weak Na+ block, shortens APD; preferentially binds ischemic myocardium).
- Class IC: Flecainide, Propafenone (strong Na+ block, marked QRS widening, contraindicated in structural heart disease).
- Class II: Beta-blockers (slow AV nodal conduction, decrease mortality post-MI).
- Class III: Amiodarone, Sotalol (K+ channel blockers; prolong APD, risk of Torsades de Pointes).
- Class IV: Diltiazem, Verapamil (non-DHP Calcium channel blockers, negative inotrope/dromotrope).`,
        clinicalPearls: [
          "Amiodarone contains 37% iodine by weight; monitor baseline and periodic thyroid (TSH/free T4), liver function, and pulmonary function tests (risk of pulmonary fibrosis).",
          "Never combine Verapamil or Diltiazem with high-dose Beta-blockers IV due to fatal risk of complete AV block and cardiogenic collapse."
        ],
        keyDrugsOrConcepts: ["Amiodarone", "Lidocaine", "Metoprolol Succinate", "Diltiazem", "Digoxin"]
      }
    ]
  },
  {
    id: "pharmacotherapy",
    code: "PHARM-401",
    title: "Pharmacotherapy",
    level: "Year 4 / Clinical",
    duration: "18 Weeks (72 Hours)",
    category: "clinical",
    icon: "Stethoscope",
    description: "Evidence-based clinical disease state management across cardiology, endocrinology, nephrology, oncology, and infectious diseases.",
    learningObjectives: [
      "Design personalized pharmacotherapy regimens based on patient comorbidities and kidney/liver biomarkers.",
      "Apply international clinical guidelines (ADA, AHA/ACC, KDIGO, GINA, IDSA) and national Ethiopian standard treatment guidelines (STG).",
      "Monitor efficacy, toxicity, and quality of life in complex polypharmacy patients."
    ],
    has3DModel: true,
    moaModelId: "ace_inhibitor_raas",
    videoDuration: "55 mins clinical cases",
    modules: [
      {
        id: "ther-m1",
        title: "Heart Failure with Reduced Ejection Fraction (HFrEF) Guideline-Directed Medical Therapy (GDMT)",
        summary: "The 4 Pillars of HFrEF management that reduce cardiovascular mortality.",
        content: `Current standard of care requires initiating the 'Four Pillars' of HFrEF:
1. ARNI (Sacubitril/Valsartan) or ACEi/ARB:
   - Sacubitril inhibits neprilysin (degrades ANP, BNP, and bradykinin). Valsartan blocks AT1 receptor.
   - Crucial: 36-hour washout period required when switching from ACE inhibitor to Sacubitril/Valsartan to avoid catastrophic angioedema!
2. Evidence-Based Beta-Blocker:
   - Only 3 proven agents: Carvedilol, Bisoprolol, Metoprolol Succinate.
3. Mineralocorticoid Receptor Antagonist (MRA):
   - Spironolactone or Eplerenone (indicated if eGFR > 30 mL/min and K+ < 5.0 mEq/L).
4. SGLT2 Inhibitor:
   - Empagliflozin 10 mg daily or Dapagliflozin 10 mg daily regardless of diabetes status.`,
        clinicalPearls: [
          "Do not stop beta-blocker during mild acute decompensation; down-titrate only if hypotension or shock ensues.",
          "Serum potassium and renal function must be checked 1 to 2 weeks after initiating or titrating ACEi/ARB/ARNI and Spironolactone.",
          "BNP levels are falsely elevated in patients taking Sacubitril/Valsartan; use NT-proBNP for clinical monitoring instead."
        ],
        keyDrugsOrConcepts: ["Sacubitril/Valsartan", "Empagliflozin", "Carvedilol", "Spironolactone"]
      },
      {
        id: "ther-m2",
        title: "Type 2 Diabetes Mellitus: ADA & Ethiopian STG Regimen Optimization",
        summary: "Individualized glycemic targets, organ protection (cardiorenal), and insulin titration.",
        content: `Glycemic management should be cardiorenal-risk oriented:
- If ASCVD or high ASCVD risk: Add GLP-1 RA with proven benefit (Semaglutide, Liraglutide) or SGLT2i.
- If Heart Failure or CKD (eGFR 20-60 or UACR > 30 mg/g): Prefer SGLT2i (Empagliflozin, Dapagliflozin) for organ preservation.
- Metformin remains first-line unless contraindicated (eGFR < 30 mL/min/1.73m2).
- Insulin titration: Basal insulin starting at 10 units/day or 0.1-0.2 units/kg/day, titrate by 2 units every 3 days until fasting target reached (80-130 mg/dL).`,
        clinicalPearls: [
          "Euglycemic DKA can occur with SGLT2 inhibitors during acute illness, dehydration, or pre-surgery; withhold 3-4 days prior to elective major surgery.",
          "Vitamin B12 deficiency is common with long-term Metformin use (> 3 years); monitor annual CBC and B12 levels to avoid misdiagnosing neuropathy."
        ],
        keyDrugsOrConcepts: ["Metformin", "Semaglutide", "Empagliflozin", "Gargine Insulin U-100"]
      }
    ]
  },
  {
    id: "toxicology",
    code: "TOX-402",
    title: "Toxicology",
    level: "Year 4 / Specialist",
    duration: "14 Weeks (56 Hours)",
    category: "clinical",
    icon: "ShieldAlert",
    description: "Principles of clinical and forensic toxicology, poisonings, toxidromes, organophosphates, heavy metal chelators, and specific antidotes.",
    learningObjectives: [
      "Rapidly identify 5 major clinical toxidromes: Anticholinergic, Cholinergic, Opioid, Sympathomimetic, Sedative-Hypnotic.",
      "Calculate Rumack-Matthew nomogram risk for Acetaminophen (Paracetamol) overdose and administer N-Acetylcysteine (NAC).",
      "Manage organophosphate and carbamate poisonings with Atropine and Pralidoxime (2-PAM)."
    ],
    has3DModel: true,
    moaModelId: "neuromuscular_ache_organophosphate",
    videoDuration: "48 mins emergency tox",
    modules: [
      {
        id: "tox-m1",
        title: "Organophosphate & Carbamate Toxicity & Antidote Protocols",
        summary: "Inhibition of acetylcholinesterase, lethal muscarinic/nicotinic crises, and rapid resuscitation.",
        content: `Organophosphates phosphorylate the esteratic site of Acetylcholinesterase (AChE), causing accumulation of Acetylcholine at muscarinic, nicotinic, and CNS synapses.
- Toxidrome Mnemonic: DUMBELS (Defecation, Urination, Miosis, Bronchospasm/Bronchorrhea, Emesis, Lacrimation, Salivation).
- Killer Bs: Bronchospasm, Bronchorrhea, and Bradycardia are the immediate cause of death from respiratory failure.
- Treatment Protocol:
  1. Decontamination: Remove clothing, wash with soap/water, wear personal protective equipment (PPE).
  2. Atropine: 2 to 4 mg IV bolus every 3-5 minutes until pulmonary secretions clear (Endpoint is NOT pupil dilation, but clear breath sounds and HR > 80 bpm!).
  3. Pralidoxime (2-PAM): Reactivates un-aged enzyme by hydrolyzing the phosphate ester bond. Must be given before 'aging' occurs.`,
        clinicalPearls: [
          "Carbamate toxicity is self-limiting (spontaneous decarbamylation within 24-48 hours) and does not exhibit aging, but Atropine is still life-saving.",
          "Never administer succinylcholine to an organophosphate-poisoned patient; pseudocholinesterase is inhibited, causing prolonged apnea for hours!"
        ],
        keyDrugsOrConcepts: ["Atropine Sulfate", "Pralidoxime (2-PAM)", "Malathion", "DUMBELS toxidrome"]
      },
      {
        id: "tox-m2",
        title: "Acetaminophen Overdose & Rumack-Matthew Nomogram",
        summary: "NAPQI formation, glutathione depletion, and N-acetylcysteine (NAC) protocols.",
        content: `Paracetamol is normally metabolized via glucuronidation and sulfation. In overdose, these pathways saturate, shunting drug to CYP2E1 which forms the highly reactive, hepatotoxic metabolite NAPQI.
- When hepatic glutathione is depleted by >70%, NAPQI binds covalently to hepatocytes, causing centrilobular necrosis and acute liver failure.
- Antidote: N-Acetylcysteine (NAC) restores glutathione stores and acts as a direct scavenger.
- 4-Hour Post-Ingestion Level: Plot on Rumack-Matthew nomogram. Treatment line starts at 150 mcg/mL at 4 hours.
- IV NAC 21-Hour Protocol: 150 mg/kg over 1h, then 50 mg/kg over 4h, then 100 mg/kg over 16h.`,
        clinicalPearls: [
          "NAC is virtually 100% hepatoprotective if started within 8 hours of acute ingestion, but is still beneficial even in late presentation with fulminant liver failure.",
          "Anaphylactoid reactions to IV NAC occur in up to 15% of patients (flushing, hives); manage with antihistamines and slow the infusion rate without discontinuing therapy."
        ],
        keyDrugsOrConcepts: ["N-Acetylcysteine", "NAPQI", "Rumack-Matthew Nomogram", "CYP2E1"]
      }
    ]
  },
  {
    id: "industrial_pharmacy",
    code: "IND-302",
    title: "Industrial Pharmacy",
    level: "Year 3 / Industrial",
    duration: "16 Weeks (64 Hours)",
    category: "pharmaceutics",
    icon: "Factory",
    description: "Good Manufacturing Practice (cGMP), formulation technology, pilot plant scale-up, tableting defects, freeze drying, validation, and cleanroom HVAC systems.",
    learningObjectives: [
      "Implement cGMP guidelines per WHO, PIC/S, and Ethiopian EFDA regulatory standards.",
      "Diagnose and resolve tablet manufacturing defects: capping, lamination, sticking, picking, mottling.",
      "Execute qualification protocols: Design (DQ), Installation (IQ), Operational (OQ), and Performance Qualification (PQ)."
    ],
    has3DModel: false,
    videoDuration: "50 mins plant tour",
    modules: [
      {
        id: "ind-m1",
        title: "Solid Dosage Form Manufacturing & Tableting Defects",
        summary: "Direct compression, wet/dry granulation, physics of compaction, and defect troubleshooting.",
        content: `Tablet manufacturing involves blend uniformity, die filling, compression, and ejection.
Key Tableting Defects & Root Causes:
1. Capping & Lamination:
   - Capping: Partial or complete separation of the top or bottom crown of a tablet from the main body.
   - Cause: Entrapped air during compression, excessive fines, low moisture in granules (<1%), high compression speed.
   - Solution: Pre-compression dwell time, decrease fines, adjust binder level.
2. Sticking & Picking:
   - Sticking: Tablet material adheres to the die wall.
   - Picking: Material adheres to the punch face logos/debossing.
   - Cause: Inadequate lubrication (Magnesium stearate), damp granules (>3% moisture), pitted punch faces.
   - Solution: Increase lubricant (0.5-1.5%), dry granules thoroughly, polish punches with chromium plating.
3. Mottling: Unequal color distribution on the tablet surface. Cause: Migration of dye during drying or improper mixing of colorants.`,
        clinicalPearls: [
          "Over-blending Magnesium Stearate creates a hydrophobic film around particles, drastically delaying disintegration and dissolution time.",
          "Carr's Index < 15% and Hausner Ratio < 1.18 signify excellent powder flowability required for high-speed rotary tablet presses."
        ],
        keyDrugsOrConcepts: ["Rotary Press", "Magnesium Stearate", "Capping", "Fluid Bed Granulation"]
      }
    ]
  },
  {
    id: "pharmacy_practice",
    code: "PRAC-303",
    title: "Pharmacy Practice",
    level: "Year 3 & 4 / Professional",
    duration: "14 Weeks (56 Hours)",
    category: "clinical",
    icon: "ClipboardCheck",
    description: "Community and hospital pharmacy operations, patient counseling, prescription dispensing ethics, antimicrobial stewardship (AMS), and pharmacovigilance.",
    learningObjectives: [
      "Perform systematic prescription auditing to detect medication errors, dosing discrepancies, and drug interactions.",
      "Deliver structured patient counseling using the Indian Health Service (IHS) Three Prime Questions model.",
      "Report Adverse Drug Reactions (ADRs) to national authorities using the Yellow Card / EFDA reporting form."
    ],
    has3DModel: false,
    videoDuration: "40 mins clinical roleplay",
    modules: [
      {
        id: "prac-m1",
        title: "Prescription Auditing, Clinical Counseling & Medication Reconciliation",
        summary: "IHS Three Prime Questions, five rights of medication administration, and reducing dispensing errors.",
        content: `Systematic Prescription Dispensing:
1. Verification: Patient name, age, weight (pediatric/geriatric), date, prescriber credentials, signature.
2. Clinical Screen: Indication, dosage, route, frequency, duration, contraindications, allergies.
3. Counseling Protocol (IHS 3 Prime Questions):
   - "What did your doctor tell you this medication is for?"
   - "How did your doctor tell you to take this medication?"
   - "What did your doctor tell you to expect from this medication?"
4. High-Alert Medications (ISMP list):
   - PINCH mnemonic: Potassium IV, Insulin, Narcotics, Chemotherapy, Heparin/Anticoagulants. Dual independent pharmacist check mandatory.`,
        clinicalPearls: [
          "Tall-Man lettering (e.g., predniSONE vs prednisoLONE, hydrOXYzine vs hydrALAZINE) reduces look-alike sound-alike (LASA) dispensing errors.",
          "Pharmacovigilance causality assessment: Use the Naranjo Algorithm score (>9 definite, 5-8 probable, 1-4 possible) to evaluate suspected ADRs."
        ],
        keyDrugsOrConcepts: ["IHS Prime Questions", "Naranjo Algorithm", "Tall-Man Lettering", "High-Alert Meds"]
      }
    ]
  },
  {
    id: "biopharmaceutics",
    code: "BIOPH-403",
    title: "Biopharmaceuticals",
    level: "Year 4 / Advanced",
    duration: "16 Weeks (64 Hours)",
    category: "pharmaceutics",
    icon: "Dna",
    description: "Biopharmaceutics Classification System (BCS), bioavailability, bioequivalence (BA/BE), monoclonal antibodies, recombinant proteins, and lipid nanoparticle drug delivery.",
    learningObjectives: [
      "Categorize drug molecules into BCS Classes I through IV and predict in-vitro/in-vivo correlation (IVIVC).",
      "Calculate absolute and relative bioavailability using Area Under the Curve (AUC).",
      "Explain the PK/PD of biologics, FcRn recycling, target-mediated drug disposition (TMDD), and immunogenicity."
    ],
    has3DModel: true,
    moaModelId: "liposome_nanocarrier",
    videoDuration: "45 mins molecular bio",
    modules: [
      {
        id: "bio-m1",
        title: "Biopharmaceutics Classification System (BCS) & Bioequivalence (BA/BE)",
        summary: "BCS Classes I-IV, criteria for biowaivers, and pharmacokinetic equivalence testing.",
        content: `The BCS classifies active pharmaceutical ingredients into 4 classes based on aqueous solubility and intestinal permeability:
- BCS Class I: High Solubility, High Permeability (e.g., Metoprolol, Paracetamol). Eligible for biowaiver if dissolution is rapid (>85% in 15 mins at pH 1.2, 4.5, 6.8).
- BCS Class II: Low Solubility, High Permeability (e.g., Ibuprofen, Carbamazepine, Ketoconazole). Rate-limiting step is drug dissolution; formulate with nanosuspensions, solid dispersions, or lipid carriers.
- BCS Class III: High Solubility, Low Permeability (e.g., Atenolol, Cimetidine). Rate-limiting step is permeability across intestinal epithelium.
- BCS Class IV: Low Solubility, Low Permeability (e.g., Paclitaxel, Furosemide). Very challenging bioavailability.

Bioequivalence Criteria:
- 90% Confidence Interval for the geometric mean ratio (Test / Reference) for Cmax and AUC must fall strictly between 80.00% and 125.00%.`,
        clinicalPearls: [
          "Narrow therapeutic index drugs (e.g. Warfarin, Levothyroxine) are not suitable for generic substitution without close laboratory monitoring.",
          "Monoclonal antibodies (IgG1) have half-lives of ~21 days because the neonatal Fc receptor (FcRn) salvages them from lysosomal degradation inside endothelial cells."
        ],
        keyDrugsOrConcepts: ["BCS Class I-IV", "Biowaiver", "AUC / Cmax 80-125%", "Liposomal Doxorubicin"]
      }
    ]
  },
  {
    id: "medicinal_chemistry",
    code: "MEDCHEM-304",
    title: "Medicinal Chemistry",
    level: "Year 3 / Chemical",
    duration: "16 Weeks (64 Hours)",
    category: "chemistry",
    icon: "Atom",
    description: "Structure-Activity Relationships (SAR), bioisosterism, prodrug design, CYP450 metabolism pathways, and enzyme inhibitor molecular docking.",
    learningObjectives: [
      "Interpret Structure-Activity Relationships (SAR) of beta-lactams, opioids, statins, and NSAIDs.",
      "Apply classical and non-classical bioisosteric replacements to enhance drug metabolic stability and receptor affinity.",
      "Design prodrugs (esters, amides, carbamates) to overcome low membrane permeability or premature first-pass metabolism."
    ],
    has3DModel: true,
    moaModelId: "bacterial_cell_wall_penicillin",
    videoDuration: "52 mins chemical structures",
    modules: [
      {
        id: "chem-m1",
        title: "Beta-Lactam Antibiotics SAR & Beta-Lactamase Suicide Inhibitors",
        summary: "The strained 4-membered beta-lactam ring, acyl side chains, and mechanism of suicide inhibition.",
        content: `Beta-lactam antibiotics inhibit bacterial cell wall synthesis by mimicking D-Ala-D-Ala terminus of peptidoglycan:
1. Core Pharmacophore:
   - The strained 4-membered beta-lactam ring is essential. Ring strain (coplanarity hindered by thiazolidine ring in penicillins or dihydrothiazine in cephalosporins) makes the carbonyl carbon exceptionally reactive to nucleophilic attack by the active site Serine hydroxyl of Transpeptidase (Penicillin-Binding Proteins, PBPs).
2. Resistance & Beta-Lactamases:
   - Bacterial beta-lactamases hydrolyze the amide bond, opening the 4-membered ring and producing inactive penicilloic acid.
3. Mechanism-Based / Suicide Inhibitors:
   - Clavulanic Acid, Sulbactam, and Tazobactam lack substantial antimicrobial activity alone, but act as irreversible suicide inhibitors of class A serine beta-lactamases. After binding to Ser70, an unmasking reaction creates a second covalent linkage that permanently inactivates the enzyme.`,
        clinicalPearls: [
          "Addition of electron-withdrawing groups at the alpha-position (e.g. amino group in Ampicillin/Amoxicillin) protects against acid degradation in the stomach.",
          "Bulky aryl side-chains (e.g. Oxacillin, Cloxacillin) provide steric hindrance that protects the beta-lactam ring from staphylococcal penicillinase."
        ],
        keyDrugsOrConcepts: ["Amoxicillin-Clavulanate", "D-Ala-D-Ala Mimicry", "Transpeptidase Acylation", "Bioisosterism"]
      }
    ]
  },
  {
    id: "physical_pharmaceutics",
    code: "PHYS-201",
    title: "Integrated Physical Pharmaceutics",
    level: "Year 2 & 3 / Fundamental",
    duration: "16 Weeks (64 Hours)",
    category: "pharmaceutics",
    icon: "Layers",
    description: "Thermodynamics of solutions, rheology, colloidal dispersions, micellization, interfacial phenomena, Noyes-Whitney dissolution kinetics, and stability testing.",
    learningObjectives: [
      "Calculate dissolution rates using Noyes-Whitney equation and adjust particle size / surface area.",
      "Determine colloidal stability using DLVO theory, zeta potential (mV), and Ostwald ripening prevention.",
      "Evaluate non-Newtonian fluid rheology: plastic, pseudoplastic (shear-thinning), and thixotropic formulations."
    ],
    has3DModel: false,
    videoDuration: "44 mins lab kinetics",
    modules: [
      {
        id: "phys-m1",
        title: "Dissolution Kinetics, Noyes-Whitney Equation & Rheology",
        summary: "Mathematical modeling of dissolution, diffusion layer thickness, and thixotropy in suspensions.",
        content: `1. Noyes-Whitney Dissolution Equation:
   dM/dt = (D * S / h) * (Cs - C)
   Where:
   - dM/dt = rate of dissolution
   - D = diffusion coefficient of drug in solvent
   - S = surface area of the dissolving particles (micronization increases S, boosting dissolution)
   - h = thickness of the stagnant diffusion layer (stirring/agitation decreases h)
   - Cs = saturation solubility of drug in dissolution medium
   - C = concentration of drug in bulk solution at time t
2. Suspension Rheology & Thixotropy:
   - Pharmaceutical suspensions ideally demonstrate shear-thinning (pseudoplastic) flow with thixotropy.
   - Thixotropy is a reversible time-dependent breakdown of gel structure upon shearing, followed by gradual recovery upon standing.
   - Benefit: High viscosity in the bottle prevents sedimentation/caking, while shaking causes fluid thinning for accurate pourable dosing.`,
        clinicalPearls: [
          "A zeta potential greater than +30 mV or less than -30 mV produces sufficient electrostatic repulsion to prevent particle aggregation and flocculation.",
          "Caking is an irreversible compact sediment that cannot be re-dispersed by shaking; controlled flocculation produces loose, easily re-dispersible aggregates."
        ],
        keyDrugsOrConcepts: ["Noyes-Whitney", "Zeta Potential", "Thixotropy", "Critical Micelle Concentration (CMC)"]
      }
    ]
  },
  {
    id: "pharmacognosy",
    code: "PCOG-202",
    title: "Pharmacognosy & Phytochemistry",
    level: "Year 2 & 3 / Natural Products",
    duration: "14 Weeks (56 Hours)",
    category: "pharmaceutics",
    icon: "Sparkles",
    description: "Medicinal plants, secondary plant metabolites (alkaloids, glycosides, flavonoids, tannins, saponins), extraction techniques, and standardization of herbal drugs.",
    learningObjectives: [
      "Classify bioactive secondary metabolites and their biosynthetic pathways (mevalonate, shikimate).",
      "Identify therapeutic natural products: cardiac glycosides (Digitalis), antimalarials (Artemisia annua), and anticancer alkaloids (Vinca, Taxus).",
      "Apply herbal drug standardization, chromatography (TLC/HPLC), and assess herb-drug interactions (e.g., St. John's Wort CYP3A4 induction)."
    ],
    has3DModel: false,
    videoDuration: "38 mins botanical extract",
    modules: [
      {
        id: "pcog-m1",
        title: "Bioactive Alkaloids, Glycosides & Antimalarial Phytomedicines",
        summary: "Artemisinin from sweet wormwood, cardiac glycosides, and standardization of herbal extracts.",
        content: `1. Artemisinin & Sesquiterpene Lactones:
   - Derived from Artemisia annua (sweet wormwood). Contains an endoperoxide bridge essential for antimalarial activity.
   - Cleavage of endoperoxide by intraparasitic iron generates lethal carbon-centered free radicals that alkylate plasmodial proteins.
   - Semisynthetic derivatives: Artesunate (water-soluble, IV formulation for severe falciparum malaria), Artemether (lipid-soluble).
2. Cardiac Glycosides (Digitalis purpurea / lanata):
   - Aglycone (genin) steroid nucleus with unsaturated lactone ring + sugar moieties.
   - Inhibits Na+/K+-ATPase in myocardial cells -> elevates intracellular Na+ -> reduces Na+/Ca2+ exchange -> increases intracellular Ca2+ -> positive inotropy.
3. Herb-Drug Interactions:
   - St. John's Wort (Hypericum perforatum) potent inducer of CYP3A4 and P-glycoprotein; drastically reduces levels of cyclosporine, oral contraceptives, and antiretrovirals.`,
        clinicalPearls: [
          "Khat (Catha edulis), widely consumed in the Horn of Africa, contains cathinone (schedule I amphetamine-like alkaloid) which is metabolized to cathine and norephedrine, causing tachycardia, hypertension, and CYP2D6 inhibition.",
          "Ginkgo biloba, Garlic (Allium sativum), and Ginseng ('The 3 Gs') inhibit platelet aggregation and dramatically increase bleeding risk with Warfarin and DOACs."
        ],
        keyDrugsOrConcepts: ["Artemisinin", "Digoxin", "Catha edulis (Khat)", "St. John's Wort", "Secondary Metabolites"]
      }
    ]
  },
  {
    id: "internship_practice",
    code: "INTERN-501",
    title: "Internship Practice for Students & Professionals",
    level: "Year 5 / Clinical Clerkship",
    duration: "52 Weeks (Full Rotations)",
    category: "internship",
    icon: "GraduationCap",
    description: "Core hospital clinical rotations: Internal Medicine, Pediatrics, Surgery, ICU, Ambulatory Care, Drug Information Services, and Hospital Ward Round Protocols.",
    learningObjectives: [
      "Participate actively in interprofessional ICU/ward rounds, providing therapeutic interventions and dose calculations.",
      "Master Clinical Documentation using SOAP (Subjective, Objective, Assessment, Plan) format.",
      "Conduct Total Parenteral Nutrition (TPN) calculations, therapeutic drug monitoring (TDM), and antimicrobial stewardship reviews."
    ],
    has3DModel: false,
    videoDuration: "60 mins ward rounds masterclass",
    modules: [
      {
        id: "int-m1",
        title: "ICU & Inpatient Ward Rounds: SOAP Note Documentation & Critical Calculations",
        summary: "How to perform morning pre-rounds, calculate Cockcroft-Gault CrCl, and document clinical pharmacist interventions.",
        content: `The 5-Step Ward Pre-Round Workflow for Pharmacy Interns:
1. Chart Review:
   - Vital signs (BP, MAP > 65, HR, Temp, SpO2, Urine output in mL/kg/h).
   - Fluid balance (24-hour Ins and Outs).
   - Lab trends: Serum Creatinine, eGFR, K+, Na+, Platelets, WBC, Bands, Bilirubin.
   - Current MAR (Medication Administration Record): verify IV to PO switch opportunities, stop dates of empiric antibiotics.
2. SOAP Note Structure:
   - S: Chief complaint, patient symptoms reported this morning, pain score.
   - O: Physical exam vitals, labs, culture & susceptibility results, imaging.
   - A: Problem list with etiology and drug therapy evaluation (efficacy, safety, untreated indications, drug interactions).
   - P: Specific recommendations (exact drug, dose, route, frequency, duration, monitoring parameters).
3. Critical Intensive Care Calculations:
   - Mean Arterial Pressure (MAP) = (2 * DBP + SBP) / 3 (Target >= 65 mmHg).
   - Corrected Phenytoin = Measured Phenytoin / [(0.2 * Albumin) + 0.1].`,
        clinicalPearls: [
          "Always perform a 'FASST-HUGS BID' checklist on daily ICU rounds: Feeding, Analgesia, Sedation, Spontaneous breathing trial, Thromboprophylaxis, Head-of-bed elevation, Ulcer prophylaxis, Glucose control, Skin care.",
          "When recommending renal dose adjustments, base recommendations on Cockcroft-Gault CrCl rather than eGFR from MDRD/CKD-EPI, as almost all FDA/international drug package inserts were validated using Cockcroft-Gault!"
        ],
        keyDrugsOrConcepts: ["SOAP Documentation", "FAST-HUGS BID", "CrCl Cockcroft-Gault", "IV-to-PO Conversion"]
      }
    ]
  }
];
