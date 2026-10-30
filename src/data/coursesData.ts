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
    priceETB: 0,
    description: "FREE FOR EVERYONE (100% Free Access). In-depth study of pharmacodynamics, pharmacokinetics, receptor kinetics, autonomous & central nervous system pharmacology, cardiovascular, and antimicrobial agents.",
    learningObjectives: [
      "Understand receptor-ligand binding kinetics and signal transduction pathways (GPCR, Tyrosine Kinase, Ion Channels).",
      "Differentiate competitive vs non-competitive antagonism with dose-response curve shifts.",
      "Calculate Volume of Distribution (Vd), Clearance (Cl), Half-life (t1/2), and steady-state kinetics.",
      "Master autonomic pharmacology: Cholinergic, Adrenergic agonist and antagonists."
    ],
    has3DModel: true,
    moaModelId: "gpcr_beta_blocker",
    videoDuration: "42 mins high-yield",
    quizQuestions: [
      {
        id: "q-pharm-1",
        question: "A pharmacologist tests a novel drug candidate and observes that increasing concentrations of the drug shift the agonist dose-response curve to the right without reducing the maximal response (Emax). Which type of antagonism is occurring?",
        options: [
          "Irreversible non-competitive antagonism",
          "Competitive reversible antagonism",
          "Functional/Physiological antagonism",
          "Allosteric negative modulatory antagonism"
        ],
        correctIndex: 1,
        explanation: "A competitive reversible antagonist competes with the agonist for the exact same receptor active site. By increasing the agonist concentration, the antagonism can be completely overcome, resulting in a parallel rightward shift of the curve (increased EC50) while preserving maximal response (Emax = 100%).",
        conceptTopic: "Receptor Kinetics & Dose-Response Curves",
        clinicalPearl: "Competitive antagonists like Propranolol or Naloxone can be overcome by high concentrations of endogenous catecholamines or opioid surges."
      },
      {
        id: "q-pharm-2",
        question: "Why does the ultra-short acting beta-blocker Esmolol have an elimination half-life of only approximately 9 minutes?",
        options: [
          "Rapid CYP2D6 hepatic ultra-metabolism",
          "Rapid hydrolysis by red blood cell cytosol esterases",
          "Instantaneous renal tubular secretion by organic cation transporters",
          "High volume of distribution in skeletal muscle tissue"
        ],
        correctIndex: 1,
        explanation: "Esmolol contains an ester linkage that is rapidly cleaved by intracellular esterases located in red blood cells (erythrocytes), completely independent of hepatic or renal function.",
        conceptTopic: "Cardiovascular Pharmacokinetics & Esterases",
        clinicalPearl: "Esmolol is ideal for hemodynamically unstable patients or acute aortic dissection where rapid titration or withdrawal is required."
      }
    ],
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
    ],
    recognizedTextbooks: [
      {
        title: "Goodman & Gilman's: The Pharmacological Basis of Therapeutics",
        authors: "Brunton LL, Knollmann BC",
        edition: "14th Edition (McGraw-Hill)",
        recognizingBody: "FIP (International Pharmaceutical Federation)",
        isbn: "978-1264258079",
        description: "The gold standard international reference for molecular pharmacology, drug targets, and pharmacokinetics cited by FIP, WHO, and ASHP.",
        keyChapters: [
          "Ch. 2: Pharmacokinetics: Dynamics of Drug Absorption, Distribution, Action, and Elimination",
          "Ch. 3: Pharmacodynamics: Molecular Mechanisms of Drug Action",
          "Ch. 8-12: Autonomic Pharmacology (Adrenergic & Cholinergic Systems)",
          "Ch. 27-32: Cardiovascular Pharmacology & Antihypertensives"
        ],
        downloadOrReadLink: "https://accesspharmacy.mhmedical.com/book.aspx?bookid=3191"
      },
      {
        title: "Basic & Clinical Pharmacology",
        authors: "Katzung BG, Vanderah TW",
        edition: "16th Edition (Lange)",
        recognizingBody: "Ethiopian Pharmaceutical Association (EPA)",
        isbn: "978-1264264841",
        description: "Primary curriculum textbook approved by Ethiopian universities and EPA for teaching mechanism-driven pharmacology and clinical correlates.",
        keyChapters: [
          "Ch. 1: Introduction: The Nature of Drugs & Drug Development",
          "Ch. 2: Drug Receptors & Pharmacodynamics",
          "Ch. 13: Drugs Used in Heart Failure & Renin-Angiotensin System",
          "Ch. 43-46: Beta-Lactams & Antimicrobial Agents"
        ],
        downloadOrReadLink: "https://accesspharmacy.mhmedical.com"
      },
      {
        title: "Rang & Dale's Pharmacology",
        authors: "Ritter JM, Flower R, Henderson G",
        edition: "10th Edition (Elsevier)",
        recognizingBody: "Royal Pharmaceutical Society (RPS)",
        isbn: "978-0702085000",
        description: "Internationally renowned for crystal-clear visual diagrams of cellular signal transduction, G-proteins, and receptor kinetics.",
        keyChapters: [
          "Ch. 3: How Drugs Act: Cellular Aspects - Excitation, Contraction & Secretion",
          "Ch. 8: Chemical Mediators and the Autonomic Nervous System",
          "Ch. 14: The Heart and Circulation"
        ]
      }
    ],
    furtherReadingMaterials: [
      {
        title: "WHO Model List of Essential Medicines - 24th List",
        source: "World Health Organization (WHO) & EFDA Alignment",
        year: "2024 - 2026",
        type: "Guideline",
        summary: "Defines priority core medicines with proven safety, efficacy, and cost-effectiveness for national healthcare systems."
      },
      {
        title: "Ethiopian National Essential Medicine List (NEML) & Standard Treatment Guidelines",
        source: "Ethiopian Food and Drug Authority (EFDA) / Ministry of Health",
        year: "2024",
        type: "Practice Standard",
        summary: "Mandatory regulatory therapeutic classification and dispensing restrictions across health centers and general hospitals in Ethiopia."
      },
      {
        title: "FIP Global Competency Framework for Pharmacists",
        source: "International Pharmaceutical Federation (FIP)",
        year: "2024",
        type: "Clinical Review",
        summary: "Core scientific competencies required for therapeutic drug monitoring, patient safety, and pharmaceutical care."
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
    priceETB: 100,
    description: "Evidence-based clinical disease state management across cardiology, endocrinology, nephrology, oncology, and infectious diseases.",
    learningObjectives: [
      "Design personalized pharmacotherapy regimens based on patient comorbidities and kidney/liver biomarkers.",
      "Apply international clinical guidelines (ADA, AHA/ACC, KDIGO, GINA, IDSA) and national Ethiopian standard treatment guidelines (STG).",
      "Monitor efficacy, toxicity, and quality of life in complex polypharmacy patients."
    ],
    has3DModel: true,
    moaModelId: "ace_inhibitor_raas",
    videoDuration: "55 mins clinical cases",
    quizQuestions: [
      {
        id: "q-ther-1",
        question: "When transitioning a patient with Heart Failure with Reduced Ejection Fraction (HFrEF) from an Enalapril regimen to Sacubitril/Valsartan (ARNI), what mandatory safety precaution must be observed?",
        options: [
          "Pre-medicate with high-dose intravenous diphenhydramine",
          "Ensure a mandatory 36-hour washout period after the last ACE inhibitor dose",
          "Initiate Spironolactone at triple the standard dose during transition",
          "Discontinue all beta-blocker therapy permanently"
        ],
        correctIndex: 1,
        explanation: "Both ACE inhibitors and Sacubitril (neprilysin inhibitor) prevent the breakdown of bradykinin. Co-administration or overlapping within 36 hours creates severe bradykinin accumulation that triggers life-threatening angioedema.",
        conceptTopic: "HFrEF GDMT & Angioedema Prevention",
        clinicalPearl: "No washout period is necessary when switching between an ARB (like Losartan) and Sacubitril/Valsartan because ARBs do not inhibit ACE bradykinin degradation."
      }
    ],
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
        keyDrugsOrConcepts: ["Sacubitril/Valsartan", "Empagliflozin", "Carvedilol", "Spironolactone", "Four Pillars"]
      }
    ]
  },
  {
    id: "biochemistry",
    code: "BIOCHEM-201",
    title: "Medical & Pharmaceutical Biochemistry",
    level: "Year 2 / Core Basic Sciences",
    duration: "16 Weeks (64 Hours)",
    category: "basic_sciences",
    icon: "Dna",
    priceETB: 100,
    description: "Cellular bioenergetics, enzyme kinetics, carbohydrate and lipid catabolism, protein synthesis, nucleic acid biochemistry, and clinical inborn metabolic errors.",
    learningObjectives: [
      "Analyze Michaelis-Menten enzyme kinetics, Lineweaver-Burk plots, and mechanisms of irreversible/allosteric inhibition.",
      "Map glycolysis, the tricarboxylic acid (Krebs) cycle, and oxidative phosphorylation ATP generation.",
      "Correlate dyslipidemias with LDL receptor defects, HMG-CoA reductase regulation, and statin pharmacology.",
      "Understand heme synthesis, bilirubin conjugation in hepatocytes, and biochemical differentiation of jaundice."
    ],
    has3DModel: true,
    moaModelId: "ace_inhibitor_raas",
    videoDuration: "50 mins biochemical pathways",
    quizQuestions: [
      {
        id: "q-biochem-1",
        question: "In the glycolytic pathway, which enzyme catalyzes the committed, rate-limiting step subject to potent allosteric stimulation by Fructose-2,6-bisphosphate?",
        options: [
          "Hexokinase / Glucokinase",
          "Phosphofructokinase-1 (PFK-1)",
          "Pyruvate kinase",
          "Glyceraldehyde-3-phosphate dehydrogenase"
        ],
        correctIndex: 1,
        explanation: "Phosphofructokinase-1 (PFK-1) catalyzes the phosphorylation of Fructose-6-phosphate to Fructose-1,6-bisphosphate. It is the key pacemaker of glycolysis, inhibited allosterically by ATP and citrate, and stimulated by AMP and Fructose-2,6-bisphosphate.",
        conceptTopic: "Glycolytic Pacemaker Enzymes & Metabolic Control",
        clinicalPearl: "Insulin promotes Fructose-2,6-bisphosphate synthesis, thereby accelerating glycolysis in the fed state, while glucagon suppresses it to favor gluconeogenesis."
      },
      {
        id: "q-biochem-2",
        question: "A newborn exhibits severe indirect (unconjugated) hyperbilirubinemia, lethargy, and risk of kernicterus. Genetic testing reveals an absence of UDP-glucuronosyltransferase (UGT1A1) activity. What is the diagnosis?",
        options: [
          "Crigler-Najjar Syndrome Type I",
          "Gilbert Syndrome",
          "Dubin-Johnson Syndrome",
          "Rotor Syndrome"
        ],
        correctIndex: 0,
        explanation: "Crigler-Najjar Syndrome Type I is characterized by complete absence of hepatic UDP-glucuronosyltransferase (UGT1A1), causing fatal unconjugated hyperbilirubinemia without phototherapy or liver transplant. In contrast, Gilbert syndrome is mild (~30% enzyme activity), and Dubin-Johnson affects conjugated bilirubin canalicular transport.",
        conceptTopic: "Heme Degradation, Bilirubin Metabolism & Jaundice",
        clinicalPearl: "Phenobarbital induces UGT1A1 expression in Crigler-Najjar Type II and Gilbert syndrome, but has zero effect in Type I due to complete enzyme gene deletion."
      }
    ],
    modules: [
      {
        id: "biochem-m1",
        title: "Clinical Enzymology, Michaelis-Menten Kinetics & Allosteric Inhibition",
        summary: "Km, Vmax, Lineweaver-Burk transformations, and therapeutic enzyme inhibitors.",
        content: `1. Michaelis-Menten Kinetics:
   - v0 = (Vmax * [S]) / (Km + [S]).
   - Km (Michaelis constant): Substrate concentration at which velocity is half-maximal (1/2 Vmax). Reflects affinity (lower Km = higher substrate affinity).
2. Enzyme Inhibition in Pharmacology:
   - Competitive Inhibition: Competes with substrate at the active site. Km increases (apparent affinity decreases); Vmax unchanged. Overcome by adding excess substrate.
   - Non-Competitive Inhibition: Binds to an allosteric site distinct from catalytic domain. Km unchanged; Vmax decreases. Cannot be overcome by increasing substrate.
   - Uncompetitive Inhibition: Binds strictly to the Enzyme-Substrate (ES) complex. Both Km and Vmax decrease proportionally.
3. Clinical Diagnostic Biomarkers:
   - Troponin I/T and CK-MB: Myocardial infarction kinetics.
   - ALT (Alanine Aminotransferase): Hepatocellular necrosis (more specific than AST).
   - Amylase and Lipase: Acute pancreatitis (Lipase stays elevated longer, 8-14 days).`,
        clinicalPearls: [
          "Statins are competitive structural analogs of HMG-CoA, binding the active site of HMG-CoA reductase and shifting Km upwards without changing the enzyme's ultimate maximal capacity.",
          "Methotrexate is a competitive inhibitor of dihydrofolate reductase (DHFR); high-dose rescue therapy with Leucovorin (folinic acid) bypasses the blocked enzyme in normal tissues."
        ],
        keyDrugsOrConcepts: ["Km & Vmax", "Lineweaver-Burk Plot", "Allosteric Sites", "HMG-CoA Reductase", "Troponin I"]
      },
      {
        id: "biochem-m2",
        title: "Carbohydrate Metabolism, Krebs Cycle & Mitochondrial ATP Generation",
        summary: "Glycolysis, anaerobic lactate fermentation, pyruvate dehydrogenase, and electron transport chain complexes I-IV.",
        content: `1. Glycolytic Energetics:
   - Glucose + 2 NAD+ + 2 ADP + 2 Pi -> 2 Pyruvate + 2 NADH + 2 ATP + 2 H2O.
   - Rate-limiting enzyme: Phosphofructokinase-1 (PFK-1).
   - In anaerobic conditions (shock, severe sepsis), pyruvate is reduced to lactate by Lactate Dehydrogenase (LDH) to regenerate NAD+ for ongoing glycolysis.
2. The Pyruvate Dehydrogenase (PDH) Complex:
   - Connects glycolysis to the Citric Acid Cycle inside the mitochondrial matrix.
   - Requires 5 essential cofactors: Thiamine pyrophosphate (TPP from Vitamin B1), FAD (from B2), NAD+ (from B3), CoA (from B5 pantothenate), and Lipoic Acid.
3. Oxidative Phosphorylation & ATP Synthase:
   - Complexes I, III, and IV pump protons from the matrix into the intermembrane space, creating an electrochemical proton gradient.
   - Complex V (Fo-F1 ATP synthase) utilizes proton return to synthesize ~30-32 net ATP per glucose molecule.
   - Cyanide and Carbon Monoxide inhibit Complex IV (Cytochrome c oxidase), causing rapid cellular asphyxiation.`,
        clinicalPearls: [
          "Thiamine deficiency (Vitamin B1) impairs Pyruvate Dehydrogenase and alpha-ketoglutarate dehydrogenase, causing Wernicke-Korsakoff encephalopathy and high-output wet beriberi heart failure.",
          "Giving IV glucose to a malnourished patient before administering IV thiamine can precipitate fatal acute Wernicke encephalopathy because glucose catabolism depletes the last remaining thiamine stores!"
        ],
        keyDrugsOrConcepts: ["PFK-1", "Pyruvate Dehydrogenase", "TPP Vitamin B1", "Complex IV", "Lactic Acidosis"]
      }
    ]
  },
  {
    id: "physiology",
    code: "PHYS-202",
    title: "Human Physiology & Pathophysiological Basis of Disease",
    level: "Year 2 / Core Basic Sciences",
    duration: "16 Weeks (64 Hours)",
    category: "basic_sciences",
    icon: "Activity",
    priceETB: 100,
    description: "Organ system function: cardiovascular hemodynamics, nephron transport mechanisms, neurophysiology, respiratory mechanics, and endocrine feedback loops.",
    learningObjectives: [
      "Trace tubular fluid reabsorption and secretion across each distinct nephron segment (PCT, Loop of Henle, DCT, Collecting Duct).",
      "Explain the Frank-Starling mechanism, cardiac pressure-volume loops, and baroreceptor hemodynamic reflexes.",
      "Master the Renin-Angiotensin-Aldosterone System (RAAS) and antidiuretic hormone (vasopressin) water regulation.",
      "Calculate alveolar-arterial oxygen gradient, Henderson-Hasselbalch acid-base disturbances, and anion gaps."
    ],
    has3DModel: true,
    moaModelId: "gpcr_beta_blocker",
    videoDuration: "52 mins organ systems",
    quizQuestions: [
      {
        id: "q-phys-1",
        question: "In the human nephron, what is the primary driving mechanism of the thick ascending limb of the Loop of Henle that allows generation of the hypertonic medullary interstitium?",
        options: [
          "Passive paracellular water reabsorption via Aquaporin-1",
          "Active secondary transport of 1 Na+, 1 K+, and 2 Cl- via the NKCC2 symporter",
          "Aldosterone-mediated opening of epithelial sodium channels (ENaC)",
          "Hydrogen ion secretion via apical H+/K+-ATPase pumps"
        ],
        correctIndex: 1,
        explanation: "The thick ascending limb of the Loop of Henle expresses the apical Na+-K+-2Cl- cotransporter (NKCC2). It is impermeable to water, pumping solutes into the medullary interstitium to create the countercurrent multiplier osmotic gradient.",
        conceptTopic: "Renal Physiology & Medullary Countercurrent Mechanics",
        clinicalPearl: "Loop diuretics like Furosemide specifically target and inhibit the NKCC2 symporter, abolishing the medullary gradient and inducing profound natriuresis and kaliuresis."
      },
      {
        id: "q-phys-2",
        question: "According to the Frank-Starling Law of the heart, how does an increase in end-diastolic volume (preload) within physiologic limits affect cardiac output?",
        options: [
          "Decreases stroke volume due to excessive sarcomere overlap",
          "Increases stroke volume by optimizing sarcomere actin-myosin cross-bridge overlap",
          "Slows SA nodal intrinsic firing rate through parasympathetic reflex",
          "Reduces total peripheral vascular resistance directly"
        ],
        correctIndex: 1,
        explanation: "The Frank-Starling mechanism states that increased ventricular filling (preload) stretches cardiac myocytes towards their optimal sarcomere length (2.2 micrometers), increasing troponin C sensitivity to calcium and producing greater contractile force and stroke volume.",
        conceptTopic: "Cardiovascular Hemodynamics & Frank-Starling Curve",
        clinicalPearl: "In severe dilated cardiomyopathy or end-stage heart failure, myocytes are stretched beyond optimal length on the descending limb of the curve, where further fluid loading causes pulmonary edema without improving cardiac output."
      }
    ],
    modules: [
      {
        id: "phys-m1",
        title: "Nephron Segmental Transport, Countercurrent Multiplication & RAAS",
        summary: "Glomerular filtration barrier, proximal tubule solute recovery, and hormonal regulation of volume.",
        content: `1. Glomerular Filtration & Autoregulation:
   - GFR is determined by Starling forces: GFR = Kf * [(Pgc - Pbs) - (PIGMAgc - PIGMAbs)].
   - Afferent arteriole dilation (mediated by Prostaglandin E2) increases GFR.
   - Efferent arteriole constriction (mediated by Angiotensin II) increases glomerular pressure and preserves GFR in hypovolemic states.
   - Clinical alert: NSAIDs block afferent dilation; ACE inhibitors block efferent constriction. Combining both in dehydrated patients causes acute prerenal renal failure!
2. Segmental Nephron Architecture:
   - Proximal Convoluted Tubule (PCT): Reabsorbs 65-70% of filtered Na+, water, 100% of glucose and amino acids (via SGLT2 and secondary active symporters), and 85% of HCO3- (via carbonic anhydrase).
   - Descending Thin Limb: Permeable to water, impermeable to solutes (tubular fluid concentrates).
   - Thick Ascending Limb (TAL): Impermeable to water; actively pumps Na+-K+-2Cl- (NKCC2). Generates the corticomedullary osmotic gradient.
   - Distal Convoluted Tubule (DCT): Reabsorbs Na+ and Cl- via NCC (target of thiazides); Ca2+ reabsorption regulated by Parathyroid Hormone (PTH).
   - Cortical Collecting Duct: Principal cells reabsorb Na+ via ENaC and secrete K+ under Aldosterone control; Intercalated cells regulate H+ secretion and acid-base balance; Aquaporin-2 channels inserted under Vasopressin (ADH) stimulation.`,
        clinicalPearls: [
          "Spironolactone and Amiloride spare potassium in the collecting duct by inhibiting aldosterone receptors or directly blocking ENaC channels.",
          "In Syndrome of Inappropriate Antidiuretic Hormone (SIADH), excessive ADH inserts aquaporins in the collecting duct regardless of serum osmolality, causing dilutional hyponatremia."
        ],
        keyDrugsOrConcepts: ["NKCC2", "ENaC", "SGLT2", "RAAS Axis", "Starling Forces", "Countercurrent Multiplier"]
      },
      {
        id: "phys-m2",
        title: "Cardiovascular Electrophysiology & Hemodynamic Control",
        summary: "Cardiac action potentials, Frank-Starling relationship, and autonomic baroreceptor control.",
        content: `1. Cardiac Action Potential Types:
   - Ventricular/Purkinje (Non-pacemaker):
     * Phase 0: Rapid depolarization via voltage-gated Na+ channels (INa).
     * Phase 1: Transient outward K+ current (Ito).
     * Phase 2: Plateau phase via L-type Ca2+ influx balanced by delayed rectifier K+ efflux.
     * Phase 3: Rapid repolarization via K+ efflux (IKr and IKs).
     * Phase 4: Stable resting membrane potential (-90 mV) maintained by Kir and Na+/K+-ATPase.
   - SA/AV Nodal (Pacemaker):
     * Phase 4: Spontaneous diastolic depolarization via 'funny' hyperpolarization-activated cyclic nucleotide-gated channels (If, target of Ivabradine).
     * Phase 0: Upstroke driven by L-type Ca2+ channels (NOT fast Na+ channels!).
2. Baroreceptor Reflex Architecture:
   - High-pressure sensors located in the Carotid Sinus (innervated by CN IX glossopharyngeal) and Aortic Arch (CN X vagus).
   - Decrease in blood pressure diminishes afferent firing to the medulla, unleashing sympathetic efferent discharge: increases heart rate, contractility, and venoconstriction.`,
        clinicalPearls: [
          "Orthostatic hypotension occurs when the baroreceptor reflex is blunted by autonomic neuropathy (diabetes) or alpha-1 adrenergic antagonists (Tamsulosin, Prazosin).",
          "Carotid sinus massage stimulates afferent CN IX firing, simulating sudden hypertension and triggering reflex vagal AV-nodal slowing to terminate Paroxysmal Supraventricular Tachycardia (PSVT)."
        ],
        keyDrugsOrConcepts: ["Cardiac Action Potential", "Funny Current (If)", "L-type Ca2+", "Baroreceptors", "Frank-Starling"]
      }
    ]
  },
  {
    id: "toxicology",
    code: "TOX-402",
    title: "Toxicology",
    level: "Year 4 / Clinical",
    duration: "14 Weeks (56 Hours)",
    category: "clinical",
    icon: "ShieldAlert",
    priceETB: 100,
    description: "Management of acute poisonings, toxicodynamics, toxidromes, antidotes, agricultural organophosphate emergencies, and environmental toxic exposures.",
    learningObjectives: [
      "Recognize cholinergic, anticholinergic, sympathomimetic, and opioid toxidromes rapidly.",
      "Administer life-saving specific antidotes (Atropine, Pralidoxime, N-acetylcysteine, Naloxone, Digoxin-Fab).",
      "Plot acetaminophen levels on the Rumack-Matthew nomogram."
    ],
    has3DModel: true,
    moaModelId: "ache_organophosphate_rescue",
    videoDuration: "48 mins emergency tox",
    quizQuestions: [
      {
        id: "q-tox-1",
        question: "A farm worker is brought to the emergency department after occupational organophosphate insecticide exposure with miosis, copious salivation, bradycardia, bronchospasm, and muscle fasciculations. What is the immediate first-line pharmacologic intervention?",
        options: [
          "Intravenous high-dose Atropine until pulmonary secretions clear",
          "Intravenous Pralidoxime (2-PAM) monotherapy without atropine",
          "Activated charcoal lavage after endotracheal extubation",
          "Intravenous physostigmine salicylate"
        ],
        correctIndex: 0,
        explanation: "The immediate cause of mortality in organophosphate poisoning is respiratory failure from copious bronchosecretion, bronchospasm, and central apnea (muscarinic overstimulation). High-dose Atropine must be titrated immediately until full 'atropinization' (dry lungs and secretions) is achieved.",
        conceptTopic: "Cholinergic Toxidrome & Organophosphate Resuscitation",
        clinicalPearl: "Pralidoxime (2-PAM) regenerates AChE at nicotinic neuromuscular junctions but works slowly; Atropine alone saves life by halting suffocation from secretions."
      }
    ],
    modules: [
      {
        id: "tox-m1",
        title: "Organophosphate & Carbamate Poisoning: AChE Inactivation and 2-PAM Rescue",
        summary: "Pathophysiology of acetylcholinesterase inhibition and enzyme aging.",
        content: `1. Mechanism: Organophosphates phosphorylate the active serine residue in the catalytic triad of Acetylcholinesterase (AChE).
2. Toxidrome: Muscarinic 'DUMBELS' (Defecation, Urination, Miosis, Bronchospasm/Bronchorrhea, Emesis, Lacrimation, Salivation) + Nicotinic (muscle fasciculations, weakness, paralysis).
3. 'Aging' Phenomenon: Dealkylation of the phosphorylated enzyme makes bond irreversible. Must give Oximes (Pralidoxime / 2-PAM) before aging occurs.`,
        clinicalPearls: [
          "Atropine reverses muscarinic symptoms only (secretions, bronchospasm, bradycardia); it has ZERO effect on nicotinic neuromuscular paralysis.",
          "End-point of atropinization: clear breath sounds and absence of bronchorrhea, NOT dilated pupils or tachycardia alone."
        ],
        keyDrugsOrConcepts: ["Atropine", "Pralidoxime (2-PAM)", "DUMBELS", "Aging", "AChE Catalytic Serine"]
      }
    ]
  },
  {
    id: "industrial_pharmacy",
    code: "IND-302",
    title: "Industrial Pharmacy",
    level: "Year 3 / Pharmaceutics",
    duration: "16 Weeks (64 Hours)",
    category: "pharmaceutics",
    icon: "Factory",
    priceETB: 100,
    description: "Current Good Manufacturing Practices (cGMP), cleanroom validation, rotary tablet press operation, tableting defects (capping, lamination, sticking), and lyophilization.",
    learningObjectives: [
      "Comply with WHO and Ethiopian EFDA cGMP cleanroom HVAC classifications (ISO 5/Class A to ISO 8/Class D).",
      "Diagnose and solve industrial tablet defects (capping, lamination, picking, sticking, chipping).",
      "Validate sterilization cycles, autoclave F0 value calculations, and aseptic filling lines."
    ],
    has3DModel: false,
    videoDuration: "45 mins industrial cGMP",
    quizQuestions: [
      {
        id: "q-ind-1",
        question: "During high-speed rotary tablet compression, tablets frequently split horizontally into distinct layers upon ejection from the die cavity. What is this tablet manufacturing defect called?",
        options: [
          "Mottling",
          "Capping / Lamination",
          "Picking",
          "Chipping"
        ],
        correctIndex: 1,
        explanation: "Capping refers to partial or complete separation of the top or bottom crown of a tablet from the main body, while lamination is separation into two or more distinct horizontal layers. Both are primarily caused by air entrapment in the granules during rapid compression or excessive fine powders.",
        conceptTopic: "Solid Dosage Manufacturing & Tablet Press Defect Troubleshooting",
        clinicalPearl: "Remedies include using tapered dies to allow air escape, slowing press speed, or adding pre-compression stages to de-aerate the formulation."
      }
    ],
    modules: [
      {
        id: "ind-m1",
        title: "Tablet Compression Defect Diagnostics & Remediation",
        summary: "Solving capping, lamination, and sticking in high-speed rotary tablet presses.",
        content: `1. Capping & Lamination:
   - Root Causes: Air entrapment during high-speed compression, excessive fine powder (< 100 mesh), inadequate binder, worn die tooling with ring grooves.
   - Troubleshooting: Reduce turret speed, introduce pre-compression roller pressure to expel air, use tapered dies.
2. Picking & Sticking:
   - Root Causes: Excessive formulation moisture, low lubricant concentration (Magnesium stearate < 0.5%), scratched punch face embossings.`,
        clinicalPearls: [
          "Over-blending Magnesium Stearate creates hydrophobic coating around granules, prolonging dissolution and reducing tablet tensile hardness.",
          "Cleanroom Grade A (ISO 5) requires <= 3,520 particles/m3 at 0.5 um and zero microbial colony-forming units."
        ],
        keyDrugsOrConcepts: ["Capping", "Magnesium Stearate", "Rotary Punch Tooling", "Grade A Cleanroom"]
      }
    ]
  },
  {
    id: "pharmacy_practice",
    code: "PRAC-303",
    title: "Pharmacy Practice",
    level: "Year 3 / Core",
    duration: "14 Weeks (56 Hours)",
    category: "clinical",
    icon: "ClipboardCheck",
    priceETB: 100,
    description: "Prescription auditing, medication dispensing protocols, patient counseling, pharmacovigilance adverse event reporting (Naranjo scale), and medication error prevention.",
    learningObjectives: [
      "Execute the Indian Health Service (IHS) 3 Prime Questions during outpatient medication dispensing.",
      "Score adverse drug reactions using the Naranjo Probability Algorithm.",
      "Audit prescriptions for drug-drug interactions, dose appropriateness, and therapeutic duplication."
    ],
    has3DModel: false,
    videoDuration: "35 mins clinical communication",
    quizQuestions: [
      {
        id: "q-prac-1",
        question: "When counseling an ambulatory patient receiving a new prescription, which three core inquiries constitute the standardized Indian Health Service (IHS) Prime Questions?",
        options: [
          "Do you have insurance? What is your full address? Who is your emergency contact?",
          "What did your doctor tell you this medication is for? How did your doctor tell you to take it? What did your doctor tell you to expect?",
          "Have you ever had an allergic reaction? Can you swallow pills? Do you prefer brand or generic?",
          "How much did you pay for this? Is your doctor licensed? Have you taken antibiotics recently?"
        ],
        correctIndex: 1,
        explanation: "The IHS 3 Prime Questions are the internationally recognized gold standard for patient counseling: (1) What did your doctor tell you the medication is for? (2) How did your doctor tell you to take the medication? (3) What did your doctor tell you to expect?",
        conceptTopic: "Patient Consultation, Health Literacy & Counseling Techniques",
        clinicalPearl: "Using open-ended Prime Questions prevents simple 'yes/no' head nodding and reveals crucial misunderstandings before the patient leaves the pharmacy."
      }
    ],
    modules: [
      {
        id: "prac-m1",
        title: "IHS 3 Prime Questions & Naranjo Adverse Drug Reaction (ADR) Algorithm",
        summary: "Structured patient counseling and pharmacovigilance causality assessment.",
        content: `1. IHS 3 Prime Questions:
   - Question 1: 'What did your doctor tell you this medication is for?' (Verifies indication)
   - Question 2: 'How did your doctor tell you to take it?' (Verifies dose, frequency, food relations)
   - Question 3: 'What did your doctor tell you to expect?' (Prepares for efficacy timeline and ADRs)
2. Naranjo ADR Probability Scale:
   - Definite ADR: Score >= 9
   - Probable ADR: Score 5 - 8
   - Possible ADR: Score 1 - 4
   - Doubtful: Score <= 0`,
        clinicalPearls: [
          "Re-challenge is unethical with Severe Cutaneous Adverse Reactions (SCAR) such as Stevens-Johnson Syndrome (SJS) or Toxic Epidermal Necrolysis (TEN).",
          "Always verify renal function before dispensing Metformin; stop if eGFR < 30 mL/min to prevent fatal lactic acidosis."
        ],
        keyDrugsOrConcepts: ["IHS Prime Questions", "Naranjo Algorithm", "SJS/TEN", "Dispensing Audit"]
      }
    ]
  },
  {
    id: "biopharmaceutics",
    code: "BIOPH-403",
    title: "Biopharmaceutics & Pharmacokinetics",
    level: "Year 4 / Pharmaceutics",
    duration: "16 Weeks (64 Hours)",
    category: "pharmaceutics",
    icon: "Layers",
    priceETB: 100,
    description: "Biopharmaceutics Classification System (BCS Classes I-IV), bioequivalence standards (80-125% 90% CI), dissolution kinetics, non-linear kinetics, and multi-compartment models.",
    learningObjectives: [
      "Categorize drug molecules into BCS Classes I, II, III, and IV based on aqueous solubility and intestinal permeability.",
      "Evaluate in vivo bioequivalence using AUC0-t, AUC0-inf, and Cmax geometric mean ratio criteria.",
      "Identify non-linear Michaelis-Menten elimination (e.g., Phenytoin, Alcohol) and dose-dependent toxicity."
    ],
    has3DModel: true,
    moaModelId: "liposomal_nanocarrier_core",
    videoDuration: "50 mins pharmacokinetics",
    quizQuestions: [
      {
        id: "q-bio-1",
        question: "According to international regulatory criteria (WHO, FDA, EFDA), what is the acceptable 90% confidence interval for the geometric mean ratio of AUC and Cmax between a generic test product and reference innovator to prove bioequivalence?",
        options: [
          "70.00% to 130.00%",
          "80.00% to 125.00%",
          "90.00% to 110.00%",
          "85.00% to 115.00%"
        ],
        correctIndex: 1,
        explanation: "To demonstrate therapeutic bioequivalence, the 90% confidence interval of the geometric mean ratio of Test to Reference for both AUC and Cmax must fall completely within the bioequivalence window of 80.00% to 125.00%.",
        conceptTopic: "Bioequivalence Regulatory Criteria & Geometric Mean Ratios",
        clinicalPearl: "For narrow therapeutic index (NTI) drugs like warfarin or levothyroxine, stricter bioequivalence limits (e.g., 90.00% to 111.11%) are enforced."
      }
    ],
    modules: [
      {
        id: "bio-m1",
        title: "Biopharmaceutics Classification System (BCS) & Bioequivalence Regulatory Criteria",
        summary: "BCS Classes I through IV and the 80.00-125.00% bioequivalence acceptance window.",
        content: `1. BCS Classification:
   - Class I: High Solubility, High Permeability (e.g., Metoprolol, Paracetamol). Ideal candidates for in vitro biowaivers.
   - Class II: Low Solubility, High Permeability (e.g., Ibuprofen, Carbamazepine). Absorption is dissolution-rate limited.
   - Class III: High Solubility, Low Permeability (e.g., Cimetidine, Acyclovir). Absorption is permeability-limited.
   - Class IV: Low Solubility, Low Permeability (e.g., Paclitaxel, Hydrochlorothiazide). Poor bioavailability.
2. Bioequivalence (BE) Acceptance Criteria:
   - The 90% Confidence Interval for the ratio of population geometric means (Test/Reference) for AUC0-t and Cmax must fall entirely within 80.00% - 125.00%.`,
        clinicalPearls: [
          "Phenytoin exhibits saturable, non-linear Michaelis-Menten pharmacokinetics; small dose increases can cause massive disproportionate spikes in serum concentration and cerebellar toxicity.",
          "Liposomal formulations (like Doxil) protect healthy myocardial tissue while concentrating in tumor vasculature via the Enhanced Permeability and Retention (EPR) effect."
        ],
        keyDrugsOrConcepts: ["BCS Classes I-IV", "Bioequivalence 80-125%", "Michaelis-Menten PK", "EPR Effect"]
      }
    ]
  },
  {
    id: "medicinal_chemistry",
    code: "MEDCHEM-304",
    title: "Medicinal Chemistry",
    level: "Year 3 / Chemistry",
    duration: "16 Weeks (64 Hours)",
    category: "chemistry",
    icon: "Atom",
    priceETB: 100,
    description: "Structure-Activity Relationships (SAR), beta-lactam core stability, bioisosteric modifications, prodrug design, and metabolic transformation pathways (Phase I & II).",
    learningObjectives: [
      "Correlate ring strain in beta-lactams with chemical hydrolysis, acid instability, and penicilloyl acylation.",
      "Design bioisosteric replacements (e.g., tetrazole ring for carboxylic acid) to improve pharmacokinetic half-life.",
      "Understand Phase I functionalization (CYP450) and Phase II conjugation (Glucuronidation, Sulfation, Glutathione)."
    ],
    has3DModel: true,
    moaModelId: "pbp_penicillin_suicide_inhibition",
    videoDuration: "44 mins chemical structures",
    quizQuestions: [
      {
        id: "q-med-1",
        question: "Why is the 4-membered strained beta-lactam ring of penicillin highly susceptible to nucleophilic attack by both bacterial transpeptidase enzymes and beta-lactamases?",
        options: [
          "Planar aromatic stabilization of the azetidinone ring",
          "Severe ring angle strain (~90 degrees) and lack of amide resonance stabilization",
          "Excessive steric hindrance of the adjacent sulfur atom",
          "Spontaneous decarboxylation at physiologic pH"
        ],
        correctIndex: 1,
        explanation: "Normal amides are resonance stabilized and planar with 120-degree bond angles. The fused bicyclic thiazolidine-beta-lactam ring system forces the carbonyl carbon and nitrogen into an unnatural, strained ~90-degree geometry, preventing resonance delocalization and rendering the carbonyl carbon electropositive and reactive.",
        conceptTopic: "Beta-Lactam Chemistry, Ring Strain & Transpeptidase Inactivation",
        clinicalPearl: "Suicide inhibitors like Clavulanic Acid contain the strained beta-lactam nucleus but lack the bulky acyl side-chain, allowing them to permanently acylate bacterial beta-lactamases."
      }
    ],
    modules: [
      {
        id: "med-m1",
        title: "Beta-Lactam Structure-Activity Relationship (SAR) & Suicide Beta-Lactamase Inhibitors",
        summary: "Penam core, ring strain, acyl side-chains, and mechanism-based suicide inhibition.",
        content: `1. Penicillin Core Architecture:
   - Formed by fused 4-membered beta-lactam ring and 5-membered thiazolidine ring.
   - High angle strain (~90 degrees) prevents amide resonance stabilization, rendering the carbonyl carbon highly electrophilic.
2. SAR Modifications:
   - Bulky side chains (e.g., Methicillin, Oxacillin) create steric hindrance that shields the beta-lactam carbonyl from staphylococcal penicillinases.
   - Amino substitution at alpha-position (Ampicillin, Amoxicillin) increases water solubility and penetration through Gram-negative porin channels.
3. Suicide Inhibitors:
   - Clavulanic acid and Tazobactam permanently covalently inactivate beta-lactamase through branched acyl-enzyme intermediate fragmentation.`,
        clinicalPearls: [
          "Ceftriaxone possesses an acidic aminothiazolyl oxime side chain that confers resistance to beta-lactamase and grants a long half-life (8 hours), permitting once-daily dosing.",
          "Replacing a carboxylic acid with a tetrazole ring (as in Losartan and Candesartan) preserves acidity and negative charge while increasing lipophilicity and oral bioavailability."
        ],
        keyDrugsOrConcepts: ["Penam Ring Strain", "Clavulanic Acid", "Bioisosterism", "Aminothiazolyl Oxime"]
      }
    ]
  },
  {
    id: "physical_pharmaceutics",
    code: "PHYS-201",
    title: "Integrated Physical Pharmaceutics",
    level: "Year 2 / Pharmaceutics",
    duration: "16 Weeks (64 Hours)",
    category: "pharmaceutics",
    icon: "Sparkles",
    priceETB: 100,
    description: "Noyes-Whitney dissolution kinetics, solubility parameters, zeta potential, colloid stability, rheology, thixotropy, and micellar solubilization.",
    learningObjectives: [
      "Calculate dissolution rates using the Noyes-Whitney equation: dC/dt = (D*A/h)*(Cs - C).",
      "Interpret Zeta Potential curves (> +30 mV or < -30 mV) to predict colloid and suspension stability.",
      "Distinguish Newtonian versus non-Newtonian flow behaviors (pseudoplastic, dilatant, thixotropic)."
    ],
    has3DModel: false,
    videoDuration: "40 mins colloid physics",
    quizQuestions: [
      {
        id: "q-phys-p1",
        question: "According to the Noyes-Whitney dissolution equation, what formulation strategy will directly enhance the dissolution rate (dC/dt) of a poorly water-soluble BCS Class II drug?",
        options: [
          "Increasing the stagnant diffusion layer thickness (h)",
          "Micronization of drug particles to drastically expand the effective surface area (A)",
          "Lowering temperature to minimize solvent viscosity",
          "Formulating as an insoluble crystalline polymorph with reduced saturation solubility (Cs)"
        ],
        correctIndex: 1,
        explanation: "In Noyes-Whitney equation: dC/dt = (D * A / h) * (Cs - C). Dissolution velocity is directly proportional to surface area (A). Micronizing or nano-sizing particles multiplies total surface area exponentially, accelerating dissolution.",
        conceptTopic: "Noyes-Whitney Dissolution Mechanics & Particle Sizing",
        clinicalPearl: "Amorphous solid dispersions increase apparent saturation solubility (Cs) by eliminating crystal lattice energy barriers, speeding up absorption in the GI tract."
      }
    ],
    modules: [
      {
        id: "physp-m1",
        title: "Noyes-Whitney Dissolution Kinetics & Zeta Potential Colloid Stability",
        summary: "Mathematical models of drug dissolution and electrical double layer stability.",
        content: `1. Noyes-Whitney Equation:
   - dC/dt = (D * A / h) * (Cs - C).
   - Increasing effective surface area (A) via micronization directly accelerates dissolution of poorly soluble drugs.
2. Zeta Potential & DLVO Theory:
   - Measures electrical potential at the slipping plane of colloidal particles.
   - Particles with Zeta potential greater than +30 mV or less than -30 mV exhibit strong electrostatic repulsion, preventing aggregation and irreversible caking.`,
        clinicalPearls: [
          "Flocculated suspensions form loose, light networks that settle rapidly but redisperse easily with gentle shaking; deflocculated suspensions form dense, fatal clay-like 'cakes' at the container bottom.",
          "Thixotropy (time-dependent shear-thinning) is the ideal rheological property for ophthalmic suspensions: thick in the bottle, fluid during blinking."
        ],
        keyDrugsOrConcepts: ["Noyes-Whitney", "Zeta Potential (+/- 30 mV)", "Flocculation vs Caking", "Thixotropy"]
      }
    ]
  },
  {
    id: "pharmacognosy",
    code: "PCOG-202",
    title: "Pharmacognosy & Phytomedicine",
    level: "Year 2 / Core",
    duration: "14 Weeks (56 Hours)",
    category: "clinical",
    icon: "BookOpen",
    priceETB: 100,
    description: "Plant-derived pharmaceuticals, secondary metabolites (alkaloids, glycosides, terpenoids, flavonoids), Ethiopian traditional herbal medicine, and herb-drug interactions.",
    learningObjectives: [
      "Understand the chemical structure and mechanism of Artemisinin, Quinine, Digoxin, and Cathinone.",
      "Analyze Ethiopian medicinal flora (Catha edulis, Hagenia abyssinica, Phytolacca dodecandra).",
      "Apply herbal drug standardization, chromatography (TLC/HPLC), and assess herb-drug interactions (e.g., St. John's Wort CYP3A4 induction)."
    ],
    has3DModel: false,
    videoDuration: "38 mins botanical extract",
    quizQuestions: [
      {
        id: "q-pcog-1",
        question: "What distinct chemical pharmacophore within the Artemisinin molecule is solely responsible for generating toxic parasitic free radicals upon cleavage by intra-erythrocytic heme iron?",
        options: [
          "The lactone ring carbonyl group",
          "The 1,2,4-trioxane endoperoxide bridge",
          "The tertiary methoxy bridge",
          "The conjugated cyclopentane double bond"
        ],
        correctIndex: 1,
        explanation: "Artemisinin from Artemisia annua possesses a unique 1,2,4-trioxane endoperoxide bridge (C-O-O-C). In the presence of intraparasitic Fe2+ iron released from hemoglobin digestion, this endoperoxide bond homolytically cleaves to generate lethal carbon-centered free radicals.",
        conceptTopic: "Phytochemical SAR, Artemisinin & Endoperoxide Bridge",
        clinicalPearl: "Artesunate is water-soluble due to its succinate ester group, allowing rapid IV injection for cerebral falciparum malaria, unlike lipophilic artemether."
      }
    ],
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
    priceETB: 100,
    description: "Core hospital clinical rotations: Internal Medicine, Pediatrics, Surgery, ICU, Ambulatory Care, Drug Information Services, and Hospital Ward Round Protocols.",
    learningObjectives: [
      "Participate actively in interprofessional ICU/ward rounds, providing therapeutic interventions and dose calculations.",
      "Master Clinical Documentation using SOAP (Subjective, Objective, Assessment, Plan) format.",
      "Conduct Total Parenteral Nutrition (TPN) calculations, therapeutic drug monitoring (TDM), and antimicrobial stewardship reviews."
    ],
    has3DModel: false,
    videoDuration: "60 mins ward rounds masterclass",
    quizQuestions: [
      {
        id: "q-int-1",
        question: "When conducting daily clinical pre-rounds on an intensive care unit (ICU) patient, which validated mnemonic checklist provides comprehensive systematic review of patient comfort, prophylaxis, and infection risk?",
        options: [
          "SBAR (Situation, Background, Assessment, Recommendation)",
          "FAST-HUGS BID (Feeding, Analgesia, Sedation, Thromboembolism, Head of bed, Ulcer, Glucose, Skin, Bowel, Indwelling lines, De-escalation)",
          "APGAR (Appearance, Pulse, Grimace, Activity, Respiration)",
          "MONA (Morphine, Oxygen, Nitroglycerin, Aspirin)"
        ],
        correctIndex: 1,
        explanation: "FAST-HUGS BID is the internationally adopted clinical pharmacy and intensive care bundle ensuring that critical preventative measures (prophylaxis, nutrition, head elevation to prevent ventilator-associated pneumonia) are never omitted.",
        conceptTopic: "ICU Clinical Pharmacy Bundles & FAST-HUGS BID Protocols",
        clinicalPearl: "Re-evaluating empiric antibiotics for 'De-escalation' (the 'D' in FAST-HUGS BID) by day 3 based on microbiological culture and susceptibility reduces resistant superinfections by over 40%."
      }
    ],
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
          "Always perform a 'FAST-HUGS BID' checklist on daily ICU rounds: Feeding, Analgesia, Sedation, Thromboprophylaxis, Head-of-bed elevation, Ulcer prophylaxis, Glucose control, Skin care.",
          "When recommending renal dose adjustments, base recommendations on Cockcroft-Gault CrCl rather than eGFR from MDRD/CKD-EPI, as almost all FDA/international drug package inserts were validated using Cockcroft-Gault!"
        ],
        keyDrugsOrConcepts: ["SOAP Documentation", "FAST-HUGS BID", "CrCl Cockcroft-Gault", "IV-to-PO Conversion"]
      }
    ]
  }
];
