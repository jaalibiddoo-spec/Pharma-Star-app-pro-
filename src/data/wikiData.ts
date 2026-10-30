export interface WikiArticle {
  id: string;
  slug: string;
  title: string;
  category: 'drug_monograph' | 'clinical_formula' | 'emergency_antidote' | 'ethiopian_formulary' | 'github_wiki_guide';
  tags: string[];
  readTimeMinutes: number;
  lastUpdated: string;
  summary: string;
  author: string;
  contentMarkdown: string;
  references: string[];
  interactiveCalculator?: 'cockcroft_gault' | 'corrected_calcium' | 'anion_gap' | 'bsa_mosteller';
}

export const wikiCategories = [
  { id: 'all', label: 'All Wiki Topics', count: 12 },
  { id: 'drug_monograph', label: 'Drug Monographs', count: 4 },
  { id: 'clinical_formula', label: 'Formulas & Calculators', count: 3 },
  { id: 'emergency_antidote', label: 'Emergency Antidotes', count: 3 },
  { id: 'ethiopian_formulary', label: 'EFDA & MoH Guidelines', count: 2 },
  { id: 'github_wiki_guide', label: 'GitHub Wiki Setup', count: 1 },
] as const;

export const wikiArticlesData: WikiArticle[] = [
  {
    id: "wiki-gh-01",
    slug: "github-wiki-quickstart",
    title: "GitHub Repository Wiki Setup & Publishing Guide",
    category: "github_wiki_guide",
    tags: ["GitHub", "Wiki", "Documentation", "Open Source", "F-Droid"],
    readTimeMinutes: 4,
    lastUpdated: "2026-10-28",
    summary: "How Pharmacist Dawid Aliyi can activate, edit, and publish rich documentation on https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "GitHub Docs: Documenting your project with wikis",
      "EFDA & MoH Digital Health Documentation Standards 2026"
    ],
    contentMarkdown: `
# 📖 GitHub Wiki: Pharma-Star-app-pro

Welcome to the official repository wiki for **Pharmastar App Pro** by **Pharmacist Dawid Aliyi**.

### 🔗 Your Official GitHub Wiki URL:
**[https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki](https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki)**

---

### 🛠️ How to Enable the Wiki on Your GitHub Repository:
1. Open your repository at: **https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro**
2. Click on the **⚙️ Settings** tab in the top navigation bar.
3. Scroll down to the **Features** section.
4. Check the box for **Wikis** (enable "Restrict editing to users in teams with push access only" for security).
5. A new **📖 Wiki** tab will immediately appear at the top of your GitHub repository.
6. Click **Create the first page** to create your \`Home.md\` welcome page!

---

### 📂 Recommended Wiki Structure for Pharmastar App Pro:
* **[[Home]]**: Overview of Pharmastar App Pro, developer contact, CBE Account \`1000262900367\`, Telebirr \`0982852778\`.
* **[[Course-Syllabi]]**: Full syllabi for all 10 academic pharmacy courses (Pharmacology, Pharmacotherapy, Toxicology, Biopharmaceutics, etc.).
* **[[MoH-EFDA-CPD-Accreditation]]**: Ethiopian CPD point renewal system, accredited modules, assessment quiz guides.
* **[[Interactive-3D-MOA]]**: Documentation on Three.js WebGL molecular targets (GPCR, ACE, Penicillin-PBP, AChE-2PAM).
* **[[Clinical-Formulas-Calculations]]**: Cockcroft-Gault renal dosing, BSA, Anion Gap, therapeutic drug monitoring.
* **[[Emergency-Toxicology-Antidotes]]**: Emergency protocols for Ethiopian hospital emergency wards and health centers.
* **[[F-Droid-Android-Release]]**: Packaging instructions for the F-Droid open source repository.
`
  },
  {
    id: "wiki-calc-01",
    slug: "cockcroft-gault-renal-dosing",
    title: "Cockcroft-Gault Equation & Renal Dose Adjustment Protocols",
    category: "clinical_formula",
    tags: ["Renal", "CrCl", "Pharmacokinetics", "Dosing", "Nephrology"],
    readTimeMinutes: 5,
    lastUpdated: "2026-10-28",
    interactiveCalculator: "cockcroft_gault",
    summary: "Gold standard clinical creatinine clearance estimation for renally eliminated antimicrobials, anticoagulants, and hypoglycemics.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Cockcroft DW, Gault MH. Nephron. 1976;16(1):31-41.",
      "Ethiopian STG for General Hospitals (EFDA/MoH 2024 Revision)."
    ],
    contentMarkdown: `
# 🧮 Cockcroft-Gault Creatinine Clearance (CrCl)

The **Cockcroft-Gault formula** remains the standard pharmacokinetic formula endorsed by the FDA and Ethiopian EFDA for drug dosage adjustment in renal impairment.

### Formula:
$$\\text{CrCl (Male, mL/min)} = \\frac{(140 - \\text{Age}) \\times \\text{Weight (kg)}}{72 \\times \\text{Serum Creatinine (mg/dL)}}$$

$$\\text{CrCl (Female, mL/min)} = \\text{CrCl (Male)} \\times 0.85$$

*(Factor of 0.85 accounts for lower average female muscle mass.)*

---

### ⚖️ Ideal Body Weight (IBW) Correction:
If patient actual body weight (ABW) exceeds Ideal Body Weight by >120% (obesity), use **Adjusted Body Weight (AdjBW)**:
* **IBW (Male):** $50 + 2.3 \\times (\\text{Height in inches} - 60)$
* **IBW (Female):** $45.5 + 2.3 \\times (\\text{Height in inches} - 60)$
* **AdjBW:** $\\text{IBW} + 0.4 \\times (\\text{ABW} - \\text{IBW})$

---

### 💊 High-Yield Renal Dosage Adjustments:
1. **Ciprofloxacin:** If CrCl < 30 mL/min, reduce dose to 250–500 mg q18–24h.
2. **Metformin:** Contraindicated if eGFR/CrCl < 30 mL/min due to lactic acidosis risk; 50% dose if CrCl 30–44 mL/min.
3. **Vancomycin:** Trough-guided TDM; extend dosing interval to q24–48h when CrCl < 50 mL/min.
4. **Enoxaparin:** CrCl < 30 mL/min requires dose reduction to 1 mg/kg once daily (from 1 mg/kg BID for acute DVT/PE).
`
  },
  {
    id: "wiki-calc-02",
    slug: "serum-anion-gap-metabolic-acidosis",
    title: "Serum Anion Gap & Toxicological Ingestion Diagnostic Pathway",
    category: "clinical_formula",
    tags: ["Anion Gap", "Acid-Base", "Toxicology", "Emergency", "MUDPILES"],
    readTimeMinutes: 4,
    lastUpdated: "2026-10-28",
    interactiveCalculator: "anion_gap",
    summary: "Differential diagnosis of high anion gap metabolic acidosis (HAGMA) using the MUDPILES / GOLD MARK mnemonic.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007.",
      "WHO Emergency Triage Assessment and Treatment (ETAT) Guidelines."
    ],
    contentMarkdown: `
# 🧪 Serum Anion Gap (AG)

Calculates unmeasured serum anions, differentiating high anion gap metabolic acidosis (HAGMA) from normal anion gap (NAGMA) hyperchloremic acidosis.

### Formula:
$$\\text{Anion Gap} = [\\text{Na}^+] - ([\\text{Cl}^-] + [\\text{HCO}_3^-])$$

* **Normal Reference Range:** 8 to 12 mEq/L (without potassium) or 12 to 16 mEq/L (if potassium included).
* **Albumin Correction:** For every 1 g/dL decrease in serum albumin below 4.0 g/dL, normal anion gap drops by 2.5 mEq/L!

---

### 🚨 Mnemonic for High Anion Gap Metabolic Acidosis (>12 mEq/L):
* **M** — Methanol ingestion (formic acid toxicity, visual blur, antidote: Fomepizole/Ethanol)
* **U** — Uremia (renal failure accumulating phosphates & sulfates)
* **D** — Diabetic Ketoacidosis (DKA, beta-hydroxybutyrate & acetoacetate)
* **P** — Paraldehyde or Propylene glycol
* **I** — Isoniazid (INH toxicity, refractory seizures, antidote: Pyridoxine Vitamin B6)
* **L** — Lactic Acidosis (sepsis, metformin toxicity, hypoperfusion, severe hypoxia)
* **E** — Ethylene Glycol (antifreeze, calcium oxalate crystalluria, antidote: Fomepizole)
* **S** — Salicylates (Aspirin poisoning, early respiratory alkalosis + late HAGMA, urine alkalinization)
`
  },
  {
    id: "wiki-calc-03",
    slug: "corrected-calcium-hypoalbuminemia",
    title: "Corrected Calcium for Hypoalbuminemia in Inpatients & ICU",
    category: "clinical_formula",
    tags: ["Electrolytes", "Calcium", "Albumin", "ICU", "Clinical Pearls"],
    readTimeMinutes: 3,
    lastUpdated: "2026-10-28",
    interactiveCalculator: "corrected_calcium",
    summary: "Avoid pseudo-hypocalcemia diagnosis by adjusting total serum calcium for abnormal serum albumin levels.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins. Br Med J. 1973."
    ],
    contentMarkdown: `
# 🦴 Corrected Calcium for Serum Albumin

Approximately 40–50% of serum calcium is bound to albumin. In critically ill, malnourished, or nephrotic patients with low albumin, measured total calcium appears low despite normal biologically active **ionized calcium**!

### Formula:
$$\\text{Corrected Calcium (mg/dL)} = \\text{Measured Total Calcium (mg/dL)} + 0.8 \\times (4.0 - \\text{Serum Albumin (g/dL)})$$

### Clinical Rules:
* If serum albumin is **< 4.0 g/dL**, measured total calcium underestimates true physiological calcium.
* Always check **ionized calcium** (free calcium) when managing tetany, Chvostek's/Trousseau's signs, or severe hypercalcemia crisis.
`
  },
  {
    id: "wiki-tox-01",
    slug: "organophosphate-poisoning-atropine-pralidoxime",
    title: "Organophosphate & Carbamate Toxicity: Atropine & 2-PAM Resuscitation",
    category: "emergency_antidote",
    tags: ["Toxicology", "Antidotes", "Atropine", "Pralidoxime", "Pesticides", "SLUDGE"],
    readTimeMinutes: 6,
    lastUpdated: "2026-10-28",
    summary: "Critical clinical management of agricultural organophosphate pesticide poisoning in Ethiopian rural and district hospitals.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Eddleston M, et al. Management of acute organophosphorus pesticide poisoning. Lancet. 2008.",
      "Ethiopian National Poison Information & Control Centre Guidelines (EFDA/EPHI)."
    ],
    contentMarkdown: `
# ☠️ Organophosphate & Carbamate Pesticide Management

Agricultural insecticides (Diazinon, Malathion, Chlorpyrifos) irreversible inhibit **acetylcholinesterase (AChE)** by phosphorylating the active-site serine-200 residue, triggering an acute cholinergic crisis.

---

### 🚨 Clinical Presentation (DUMBELS / SLUDGE):
* **D**iaphoresis & **D**iarrhea
* **U**rination
* **M**iosis (pinpoint pupils) & Muscle fasciculations
* **B**ronchorrhea, **B**ronchospasm, **B**radycardia *(The Fatal Killer Triad!)*
* **E**mesis
* **L**acrimation
* **S**alivation

---

### 💉 Pharmacotherapy Protocol:
1. **Atropine Sulfate (Muscarinic Antagonist):**
   * **Initial Dose:** 1 to 2 mg IV push (adult) or 0.05 mg/kg IV (pediatric).
   * **Titration:** **Double the dose every 3 to 5 minutes** until respiratory secretions dry up!
   * *Target Endpoint:* Clear lungs, heart rate > 80 bpm, systolic BP > 90 mmHg, warm dry skin. *(Do NOT titrate to pupillary dilation alone!)*
2. **Pralidoxime Chloride (2-PAM - AChE Oxime Reactivator):**
   * **Mechanism:** Removes phosphoryl group from active serine site before irreversible covalent **aging** occurs!
   * **Dose:** 1 to 2 g IV over 30 minutes, followed by continuous infusion of 500 mg/hour.
3. **Decontamination:** Remove all contaminated clothes immediately and wash skin with soap and copious water (use PPE to prevent secondary poisoning of healthcare workers).
`
  },
  {
    id: "wiki-tox-02",
    slug: "paracetamol-toxicity-acetylcysteine-nomogram",
    title: "Acetaminophen (Paracetamol) Overdose: N-Acetylcysteine (NAC) Protocol",
    category: "emergency_antidote",
    tags: ["Toxicology", "Paracetamol", "NAC", "Rumack-Matthew", "Hepatotoxicity"],
    readTimeMinutes: 5,
    lastUpdated: "2026-10-28",
    summary: "Prevent fulminant hepatic necrosis via N-Acetylcysteine replenishment of hepatic glutathione reserves.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Rumack BH, Matthew H. Acetaminophen poisoning and toxicity. Pediatrics. 1975.",
      "EFDA Guideline for Rational Paracetamol Dosing and Overdose Countermeasures."
    ],
    contentMarkdown: `
# 💊 Acetaminophen (Paracetamol) Hepatotoxicity & NAC

Paracetamol therapeutic doses undergo safe glucuronidation and sulfation. In overdose, phase II pathways saturate, shunting drug through **CYP2E1** to generate toxic electrophile **NAPQI** (N-acetyl-p-benzoquinone imine). When glutathione stores deplete by >70%, NAPQI binds hepatocellular proteins causing centrilobular liver necrosis.

---

### ⏱️ The Rumack-Matthew Nomogram:
* Applicable to **acute single ingestions** between 4 and 24 hours post-ingestion.
* Draw 4-hour serum paracetamol concentration. If level falls on or above the 150 mcg/mL treatment line (at 4h), initiate **N-Acetylcysteine (NAC)** immediately!

---

### 💉 IV 21-Hour Acetylcysteine Regimen (3-Bag):
1. **Bag 1 (Loading):** 150 mg/kg IV in 200 mL D5W over 60 minutes.
2. **Bag 2 (Second):** 50 mg/kg IV in 500 mL D5W over 4 hours.
3. **Bag 3 (Maintenance):** 100 mg/kg IV in 1,000 mL D5W over 16 hours.

*Clinical Pearl:* NAC is 100% protective against hepatotoxicity if administered within **8 hours** of acute ingestion.
`
  },
  {
    id: "wiki-tox-03",
    slug: "opioid-poisoning-naloxone-resuscitation",
    title: "Acute Opioid Overdose & Naloxone Emergency Reversal",
    category: "emergency_antidote",
    tags: ["Opioids", "Naloxone", "Narcan", "Emergency", "Respiratory Depression"],
    readTimeMinutes: 4,
    lastUpdated: "2026-10-28",
    summary: "Pure mu-opioid receptor antagonist administration, ventilation rescue, and duration-of-action matching.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "WHO Guidelines for community management of opioid overdose (2024 update)."
    ],
    contentMarkdown: `
# 💉 Acute Opioid Toxicity & Naloxone

### 🚨 Classical Opioid Overdose Triad:
1. **Central Nervous System Depression** (Stupor, Coma)
2. **Miosis** (Pinpoint pupils, except meperidine/normeperidine which causes mydriasis)
3. **Severe Respiratory Depression** (Respiratory rate < 8–10 breaths/min, cyanosis)

---

### 🩺 Naloxone Administration:
* **Initial Dose:** 0.4 to 2 mg IV, IM, or SubQ (or 4 mg Intranasal spray).
* **Onset:** 1 to 2 minutes IV, 3 to 5 minutes IM/IN.
* **Goal of Therapy:** Restore adequate spontaneous ventilation (respiratory rate $\\ge 12$ breaths/min), NOT complete full wakefulness! *(Avoid triggering acute violent opioid withdrawal).*
* **Half-Life Hazard:** Naloxone half-life is **30 to 90 minutes**, whereas opioids like Methadone or sustained-release Morphine/Oxycodone persist for 12–24+ hours. Patient can re-enter lethal coma after Naloxone wears off! Monitor for at least 4–6 hours or prepare a continuous infusion.
`
  },
  {
    id: "wiki-drug-01",
    slug: "metformin-hcl-clinical-monograph",
    title: "Metformin Hydrochloride: Mechanism, ADA Guidelines & Renal Thresholds",
    category: "drug_monograph",
    tags: ["Endocrinology", "Diabetes", "AMPK", "Lactic Acidosis", "eGFR", "Metformin"],
    readTimeMinutes: 5,
    lastUpdated: "2026-10-28",
    summary: "Biguanide frontline antidiabetic therapy, hepatic gluconeogenesis inhibition via AMPK, and eGFR safety boundaries.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "American Diabetes Association (ADA) Standards of Care in Diabetes 2026.",
      "Ethiopian Diabetes Association Clinical Practice Guidelines."
    ],
    contentMarkdown: `
# 🍬 Metformin Hydrochloride (Biguanide)

### 🔬 Mechanism of Action:
* Activates **AMP-activated protein kinase (AMPK)** in hepatocytes.
* Inhibits mitochondrial complex I (NADH dehydrogenase), reducing hepatic gluconeogenesis and glycogenolysis.
* Increases peripheral insulin sensitivity in skeletal muscle without stimulating pancreatic beta-cell insulin secretion (negligible hypoglycemia risk as monotherapy).

---

### 📋 Dosage & Administration:
* **Starting:** 500 mg orally once or twice daily with meals to mitigate gastrointestinal side effects (nausea, diarrhea, metallic taste).
* **Titration:** Increase by 500 mg weekly to target dose of 1,000 mg BID or 850 mg TID (maximum: 2,550 mg/day).

---

### ⚠️ Renal Thresholds (eGFR):
* $\\text{eGFR} \\ge 45 \\text{ mL/min}$: Full dose permitted.
* $\\text{eGFR } 30 - 44 \\text{ mL/min}$: Maximum recommended dose 1,000 mg/day (50% reduction); monitor renal function every 3 months.
* $\\text{eGFR} < 30 \\text{ mL/min}$: **Absolute Contraindication** due to risk of fatal Metformin-Associated Lactic Acidosis (MALA).
* **Iodinated Contrast Warning:** Withhold metformin at time of or prior to iodinated radiocontrast procedure if eGFR 30–60 mL/min; re-evaluate eGFR 48 hours post-procedure before restarting.
`
  },
  {
    id: "wiki-drug-02",
    slug: "artemether-lumefantrine-act-malaria",
    title: "Artemether + Lumefantrine (Coartem): First-Line Ethiopian Antimalarial",
    category: "drug_monograph",
    tags: ["Infectious Disease", "Malaria", "Plasmodium", "ACT", "EFDA", "Coartem"],
    readTimeMinutes: 5,
    lastUpdated: "2026-10-28",
    summary: "Ethiopian National Guideline frontline ACT for uncomplicated P. falciparum malaria with high-fat food absorption counseling.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Ethiopian National Malaria Diagnosis and Treatment Guidelines (MoH 2024).",
      "WHO Guidelines for Malaria 2025."
    ],
    contentMarkdown: `
# 🦟 Artemether / Lumefantrine (20 mg / 120 mg)

The first-line artemisinin-based combination therapy (ACT) approved across Ethiopia for uncomplicated *Plasmodium falciparum* and chloroquine-resistant *P. vivax* malaria.

---

### 🔬 Dual Mechanism:
* **Artemether:** Rapidly activated by intraparasitic heme iron, generating reactive endoperoxide free radicals that damage parasite membrane proteins and sarco/endoplasmic reticulum calcium ATPase (SERCA/PfATP6). Achieves rapid parasitemia clearance within 24–48 hours.
* **Lumefantrine:** Long-acting fluorene derivative that inhibits heme polymerization into inert hemozoin crystals, preventing recrudescence over 28 days.

---

### 💊 Standard 6-Dose Regimen (Adults $\\ge 35$ kg):
* 4 tablets per dose (total 24 tablets over 3 days):
  * **Day 1:** Hour 0 (4 tablets), then Hour 8 (4 tablets)
  * **Day 2:** Hour 24 (4 tablets), then Hour 36 (4 tablets)
  * **Day 3:** Hour 48 (4 tablets), then Hour 60 (4 tablets)

---

### 🥛 Vital Pharmacist Patient Counseling Pearl:
* **High-Fat Meal Requirement:** Lumefantrine absorption increases up to **16-fold** when taken with dietary lipids! Advise patient to swallow tablets with milk, buttered porridge, or rich Ethiopian stew (*wot*) to prevent treatment failure.
`
  },
  {
    id: "wiki-drug-03",
    slug: "ceftriaxone-third-generation-cephalosporin",
    title: "Ceftriaxone Sodium: Indications, Biliary Excretion & Neonatal Warning",
    category: "drug_monograph",
    tags: ["Antimicrobial", "Cephalosporin", "Meningitis", "PBP", "Kernicterus", "WHO AWaRe"],
    readTimeMinutes: 5,
    lastUpdated: "2026-10-28",
    summary: "Broad-spectrum parenteral cephalosporin, dual biliary/renal clearance, and fatal calcium-ceftriaxone ceftriaxone precipitation risks.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "WHO Model List of Essential Medicines & AWaRe Classification (Watch Category).",
      "Ethiopian STG for Inpatient Pediatric & Adult Sepsis."
    ],
    contentMarkdown: `
# 💉 Ceftriaxone Sodium (3rd Gen Cephalosporin)

### 🔬 Mechanism & Microbiology:
* Irreversibly acylates bacterial **Penicillin-Binding Proteins (PBPs 1a, 1b, and 2)**, halting peptidoglycan cell-wall cross-linking and triggering autolysin-mediated bacterial lysis.
* High CSF penetration; drug of choice for bacterial meningitis (*N. meningitidis, S. pneumoniae, H. influenzae*).

---

### ⚖️ Unique Pharmacokinetic Advantage:
* **Dual Elimination Route:** 60% eliminated unchanged in urine, 40% cleared in bile. Therefore, **no dose adjustment is required in isolated mild-to-moderate renal or hepatic dysfunction!** Only severe dual hepatic AND renal failure requires capping at 2 g/day.

---

### 🚨 Black-Box & Pediatric Fatal Warnings:
1. **Neonatal Kernicterus:** Contraindicated in neonates $\\le 28$ days old with hyperbilirubinemia. Ceftriaxone displaces bilirubin from human serum albumin, crossing the immature blood-brain barrier to precipitate kernicterus.
2. **Fatal Calcium Precipitation:** Never co-infuse or mix with calcium-containing IV solutions (e.g., Ringer's Lactate) through the same IV line, even sequentially! Fatal microvascular crystalline precipitates can form in neonatal lungs and kidneys.
`
  },
  {
    id: "wiki-efda-01",
    slug: "ethiopian-stg-prescription-regulations",
    title: "Ethiopian STG & EFDA Prescription Writing and Auditing Regulations",
    category: "ethiopian_formulary",
    tags: ["EFDA", "MoH", "Prescription Auditing", "Ethics", "Legislation", "Controlled Drugs"],
    readTimeMinutes: 4,
    lastUpdated: "2026-10-28",
    summary: "Legal components of valid medical prescriptions in Ethiopia, Schedule II narcotic auditing, and pharmacist dispensing liability.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "Ethiopian Food and Drug Authority (EFDA) Proclamation No. 1112/2019.",
      "Federal Ministry of Health (MoH) Prescription Paper Standardization Directive."
    ],
    contentMarkdown: `
# 📜 Ethiopian Prescription Standards (EFDA Directive)

Every practicing pharmacist and druggist in Ethiopia must verify the 8 mandatory legal components before dispensing:

1. **Facility Header:** Name of Health Center, Hospital, or Clinic with physical address and telephone.
2. **Patient Identifier:** Full name, age, sex, weight (mandatory for pediatrics), Card/MRN Number.
3. **Prescriber Details:** Full name, professional qualification (MD, HO, Pharmacist Specialist), EFDA license number, and signature.
4. **Prescription Body (Rx):** Generic drug name (INN), dosage form, strength, frequency, route, and total duration.
5. **Quantity in Words & Digits:** Especially mandatory for all controlled narcotics and psychotropic drugs (Morphine, Pethidine, Diazepam).
6. **Date of Issue:** Standard prescriptions are valid for **15 days** from date of issue; narcotic prescriptions valid for **7 days**.
7. **No Erasing or Alterations:** Any modification must be countersigned by the prescriber.
8. **Pharmacist Dispensing Record:** Dispenser name, signature, batch number, expiry date, and date of dispensing.
`
  },
  {
    id: "wiki-efda-02",
    slug: "who-aware-classification-antimicrobial-stewardship",
    title: "WHO AWaRe Classification & Ethiopian Antimicrobial Stewardship",
    category: "ethiopian_formulary",
    tags: ["Antimicrobial Stewardship", "AWaRe", "Access", "Watch", "Reserve", "AMR", "EFDA"],
    readTimeMinutes: 5,
    lastUpdated: "2026-10-28",
    summary: "Implementing Access, Watch, and Reserve antibiotic stewardship categories to combat multidrug-resistant pathogens in Ethiopia.",
    author: "Pharmacist Dawid Aliyi",
    references: [
      "WHO AWaRe Antibiotic Book 2024.",
      "Ethiopian National Action Plan on Antimicrobial Resistance (2025–2030)."
    ],
    contentMarkdown: `
# 🛡️ WHO AWaRe Classification in Hospital Practice

The Ethiopian Ministry of Health and EFDA mandate the WHO AWaRe framework to preserve antibiotic efficacy:

---

### 🟢 1. ACCESS Group (Target $\\ge 60\\%$ of National Consumption):
* First- and second-choice antibiotics for the 25 most common clinical syndromes.
* Narrow-spectrum, lower resistance potential, good safety profile.
* *Examples:* Amoxicillin, Ampicillin, Doxycycline, Gentamicin, Metronidazole, Co-trimoxazole.

---

### 🟡 2. WATCH Group (Prior Authorization / Close Monitoring):
* Critical antimicrobials with higher potential for driving multi-drug resistance (ESBL, MRSA).
* Restricted to specific clinical indications with culture-proven or high-suspicion infections.
* *Examples:* Ceftriaxone, Ciprofloxacin, Azithromycin, Meropenem, Vancomycin.

---

### 🔴 3. RESERVE Group ("Last-Resort" Options):
* Reserved exclusively for confirmed life-threatening infections caused by multidrug-resistant pathogens (e.g., Carbapenem-Resistant Enterobacteriaceae - CRE, Acinetobacter baumannii).
* Requires Infectious Disease or Clinical Pharmacist panel approval.
* *Examples:* Colistin (Polymyxin E), Linezolid, Tigecycline, Ceftazidime-Avibactam.
`
  }
];
