export interface PediatricDrugProfile {
  id: string;
  genericName: string;
  brandExamples: string[];
  therapeuticClass: string;
  indications: string[];
  standardDoseMgPerKg: {
    min: number;
    max: number;
    unit: 'mg/kg/day' | 'mg/kg/dose';
    frequency: string;
    maxDailyDoseMg: number;
  };
  neonatalDose?: string;
  contraindications: string[];
  monitoringParameters: string[];
  availableConcentrations: string[]; // e.g. "125 mg / 5 mL", "250 mg / 5 mL"
}

export interface ExtemporaneousMasterFormula {
  id: string;
  name: string;
  targetConcentration: string;
  indication: string;
  ingredients: {
    item: string;
    quantity: string;
    function: string;
  }[];
  compoundingProcedure: string[];
  usp795Category: 'Non-aqueous' | 'Water-containing Oral' | 'Water-containing Topical/Mucosal';
  beyondUseDateRoomTempDays: number;
  beyondUseDateRefrigeratedDays: number;
  storageConditions: string;
  auxiliaryLabels: string[];
  pharmacopeiaRef: string;
}

export const pediatricDrugProfiles: PediatricDrugProfile[] = [
  {
    id: 'amoxicillin_ped',
    genericName: 'Amoxicillin Trihydrate',
    brandExamples: ['Amoxil', 'Novamox', 'EPHARM Amoxicillin'],
    therapeuticClass: 'Aminopenicillin',
    indications: ['Acute Otitis Media', 'Community-Acquired Pneumonia', 'Strep Pharyngitis'],
    standardDoseMgPerKg: {
      min: 40,
      max: 90,
      unit: 'mg/kg/day',
      frequency: 'Divided every 8 to 12 hours (High-dose 80-90 mg/kg/day for AOM & severe CAP)',
      maxDailyDoseMg: 3000
    },
    neonatalDose: '20-30 mg/kg/day divided q12h (age <= 14 days) or q8h (> 14 days)',
    contraindications: ['Severe penicillin/beta-lactam anaphylaxis'],
    monitoringParameters: ['Skin rash (distinguish viral from allergic)', 'Stool frequency/hydration'],
    availableConcentrations: ['125 mg / 5 mL (25 mg/mL)', '250 mg / 5 mL (50 mg/mL)', '400 mg / 5 mL (80 mg/mL)']
  },
  {
    id: 'ceftriaxone_ped',
    genericName: 'Ceftriaxone Sodium',
    brandExamples: ['Rocephin', 'Ceftriaxone IV/IM'],
    therapeuticClass: '3rd Generation Cephalosporin',
    indications: ['Bacterial Meningitis', 'Severe Sepsis', 'Complicated Pneumonia', 'Typhoid Fever'],
    standardDoseMgPerKg: {
      min: 50,
      max: 100,
      unit: 'mg/kg/day',
      frequency: 'Once daily IV/IM (divided every 12 hours for bacterial meningitis)',
      maxDailyDoseMg: 4000
    },
    neonatalDose: 'CONTRAINDICATED in hyperbilirubinemic neonates and with IV calcium due to fatal vascular precipitates.',
    contraindications: ['Neonates <= 28 days receiving IV calcium', 'Severe cephalosporin anaphylaxis'],
    monitoringParameters: ['Biliary sludge ultrasound on prolonged therapy', 'CBC with differential'],
    availableConcentrations: ['250 mg vial', '500 mg vial', '1000 mg (1 g) vial']
  },
  {
    id: 'paracetamol_ped',
    genericName: 'Paracetamol (Acetaminophen)',
    brandExamples: ['Panadol Baby', 'Calpol', 'Tylenol Children'],
    therapeuticClass: 'Analgesic & Antipyretic',
    indications: ['Fever reduction', 'Mild to moderate pediatric pain', 'Post-vaccination pyrexia'],
    standardDoseMgPerKg: {
      min: 10,
      max: 15,
      unit: 'mg/kg/dose',
      frequency: 'Every 4 to 6 hours as needed (Maximum 5 doses or 75 mg/kg in 24 hours)',
      maxDailyDoseMg: 4000
    },
    neonatalDose: '10-15 mg/kg/dose every 6 to 8 hours (max 60 mg/kg/day)',
    contraindications: ['Acute hepatic failure or severe active liver disease'],
    monitoringParameters: ['24-hour cumulative dose tracking (prevent accidental double-dosing with OTC cough syrups)'],
    availableConcentrations: ['120 mg / 5 mL (24 mg/mL)', '250 mg / 5 mL (50 mg/mL)', '100 mg / mL Infant Drops']
  },
  {
    id: 'ibuprofen_ped',
    genericName: 'Ibuprofen',
    brandExamples: ['Brufen Paediatric', 'Advil Children', 'Nurofen for Children'],
    therapeuticClass: 'NSAID',
    indications: ['Inflammatory pain', 'High fever refractory to paracetamol', 'Juvenile idiopathic arthritis'],
    standardDoseMgPerKg: {
      min: 5,
      max: 10,
      unit: 'mg/kg/dose',
      frequency: 'Every 6 to 8 hours with food (Maximum 40 mg/kg/day)',
      maxDailyDoseMg: 2400
    },
    neonatalDose: 'Only approved as specialized IV Ibuprofen lysine for closure of patent ductus arteriosus (PDA) under neonatologist supervision.',
    contraindications: ['Infants < 3 months or < 5 kg', 'Active GI ulceration', 'Dehydration/hypovolemia (acute renal injury risk)'],
    monitoringParameters: ['Hydration status and urine output', 'Signs of GI bleeding'],
    availableConcentrations: ['100 mg / 5 mL (20 mg/mL)']
  },
  {
    id: 'gentamicin_ped',
    genericName: 'Gentamicin Sulfate',
    brandExamples: ['Gentamicin IV/IM'],
    therapeuticClass: 'Aminoglycoside',
    indications: ['Neonatal Sepsis', 'Gram-negative intra-abdominal infection', 'Urinary tract sepsis'],
    standardDoseMgPerKg: {
      min: 5,
      max: 7.5,
      unit: 'mg/kg/day',
      frequency: 'Once daily IV infusion over 30-60 min (Extended-interval dosing preferred)',
      maxDailyDoseMg: 360
    },
    neonatalDose: 'Gestational age < 30 weeks: 4.5-5 mg/kg every 36-48 hours; Term neonates: 4-5 mg/kg every 24 hours',
    contraindications: ['Pre-existing vestibular or cochlear damage', 'Myasthenia gravis'],
    monitoringParameters: ['Serum trough concentration (< 1 mcg/mL before next dose)', 'Serum creatinine / BUN', 'Hearing screening'],
    availableConcentrations: ['20 mg / 2 mL (10 mg/mL)', '80 mg / 2 mL (40 mg/mL)']
  },
  {
    id: 'prednisolone_ped',
    genericName: 'Prednisolone Oral Solution',
    brandExamples: ['Prelone', 'Pediapred', 'Prednisolone Liquid'],
    therapeuticClass: 'Systemic Glucocorticoid',
    indications: ['Acute asthma exacerbation', 'Croup (laryngotracheobronchitis)', 'Nephrotic syndrome'],
    standardDoseMgPerKg: {
      min: 1,
      max: 2,
      unit: 'mg/kg/day',
      frequency: 'Once daily in the morning with breakfast for 3 to 5 days (Burst therapy - no taper needed)',
      maxDailyDoseMg: 60
    },
    neonatalDose: 'Reserve for specialized bronchopulmonary dysplasia (BPD) under pediatric intensivist guidance.',
    contraindications: ['Systemic fungal infections', 'Live viral vaccines during high-dose therapy'],
    monitoringParameters: ['Blood pressure', 'Blood glucose', 'Growth velocity with prolonged courses'],
    availableConcentrations: ['15 mg / 5 mL (3 mg/mL)', '5 mg / 5 mL (1 mg/mL)']
  }
];

export const sampleExtemporaneousFormulas: ExtemporaneousMasterFormula[] = [
  {
    id: 'spironolactone_susp',
    name: 'Spironolactone 5 mg/mL Oral Suspension',
    targetConcentration: '5 mg / mL',
    indication: 'Pediatric Congestive Heart Failure, Bronchopulmonary Dysplasia, Ascites',
    ingredients: [
      { item: 'Spironolactone 25 mg commercial tablets', quantity: '20 tablets (500 mg active)', function: 'Active Pharmaceutical Ingredient (API)' },
      { item: 'Ora-Plus (or 1% Methylcellulose suspension)', quantity: '50 mL', function: 'Suspending vehicle' },
      { item: 'Ora-Sweet (or Simple Syrup BP 66% w/w)', quantity: 'qs to 100 mL', function: 'Flavoring and sweetening vehicle' }
    ],
    compoundingProcedure: [
      '1. Count twenty (20) Spironolactone 25 mg tablets into a clean, dry glass or ceramic mortar.',
      '2. Triturate thoroughly with pestle to a fine, uniform, grit-free powder.',
      '3. Wet the powder with approximately 5-10 mL of Ora-Plus (or Methylcellulose) to form a smooth, uniform paste.',
      '4. Incorporate the remaining Ora-Plus in small geometric increments while triturating continuously.',
      '5. Transfer the mixture quantitatively into a calibrated amber prescription bottle using a funnel.',
      '6. Rinse the mortar with successive portions of Ora-Sweet (or Simple Syrup) and transfer rinsings to bottle.',
      '7. Bring to final volume of 100 mL with vehicle. Cap tightly and shake vigorously for 60 seconds.'
    ],
    usp795Category: 'Water-containing Oral',
    beyondUseDateRoomTempDays: 14,
    beyondUseDateRefrigeratedDays: 60,
    storageConditions: 'Store in tight, light-resistant container. Refrigerate at 2°C to 8°C. Shake well before each use.',
    auxiliaryLabels: ['SHAKE WELL BEFORE USE', 'KEEP REFRIGERATED (2°C - 8°C)', 'PROTECT FROM LIGHT'],
    pharmacopeiaRef: 'USP-NF Monograph & Pediatric Formulations Compendium (Allen et al.)'
  },
  {
    id: 'sildenafil_susp',
    name: 'Sildenafil 2.5 mg/mL Oral Suspension',
    targetConcentration: '2.5 mg / mL',
    indication: 'Persistent Pulmonary Hypertension of the Newborn (PPHN) & Pediatric Pulmonary Arterial Hypertension',
    ingredients: [
      { item: 'Sildenafil Citrate 50 mg tablets', quantity: '5 tablets (250 mg active)', function: 'Phosphodiesterase-5 inhibitor API' },
      { item: 'Ora-Blend (or 1:1 mixture of Ora-Plus and Ora-Sweet)', quantity: 'qs to 100 mL', function: 'Pre-buffered flavored suspending vehicle' }
    ],
    compoundingProcedure: [
      '1. Place 5 Sildenafil 50 mg tablets in a glass mortar.',
      '2. Grind to an ultra-fine, uniform powder.',
      '3. Levigate with 10 mL of Ora-Blend vehicle until a homogeneous paste is achieved.',
      '4. Add vehicle geometrically until smooth and pourable.',
      '5. Transfer into a 100 mL calibrated amber plastic (PET) or glass bottle.',
      '6. Rinse mortar and pestle twice with small amounts of vehicle, adding rinsings to the bottle.',
      '7. Add Ora-Blend to bring exactly to 100 mL calibrated mark. Shake vigorously.'
    ],
    usp795Category: 'Water-containing Oral',
    beyondUseDateRoomTempDays: 14,
    beyondUseDateRefrigeratedDays: 90,
    storageConditions: 'Controlled room temperature (20°C - 25°C) or Refrigerated (2°C - 8°C). Do not freeze.',
    auxiliaryLabels: ['SHAKE THOROUGHLY BEFORE MEASURING DOSE', 'KEEP OUT OF REACH OF CHILDREN'],
    pharmacopeiaRef: 'American Journal of Health-System Pharmacy (AJHP) Compounding Standard'
  },
  {
    id: 'omeprazole_bicarb',
    name: 'Omeprazole 2 mg/mL in Sodium Bicarbonate 8.4% Suspension',
    targetConcentration: '2 mg / mL',
    indication: 'Pediatric Severe Gastroesophageal Reflux Disease (GERD) & Stress Ulcer Prophylaxis',
    ingredients: [
      { item: 'Omeprazole 20 mg delayed-release capsules', quantity: '5 capsules (100 mg active)', function: 'Proton Pump Inhibitor API' },
      { item: 'Sodium Bicarbonate 8.4% IV solution (or 8.4% oral compounding solution)', quantity: '50 mL', function: 'Alkaline buffer to prevent gastric acid degradation of un-enteric coated omeprazole' }
    ],
    compoundingProcedure: [
      '1. Open 5 Omeprazole 20 mg capsules and empty intact enteric-coated pellets into a clean container (do not crush pellets!).',
      '2. Add 50 mL of Sodium Bicarbonate 8.4% solution to the pellets in an amber bottle.',
      '3. Allow to stand for 20-30 minutes with intermittent gentle swirling until enteric coating dissolves and uniform cloudy white suspension forms.',
      '4. Inverting gently yields a 2 mg/mL buffered suspension.'
    ],
    usp795Category: 'Water-containing Oral',
    beyondUseDateRoomTempDays: 14,
    beyondUseDateRefrigeratedDays: 30,
    storageConditions: 'Refrigerate (2°C - 8°C) strictly. Protect from light.',
    auxiliaryLabels: ['REFRIGERATE - DO NOT FREEZE', 'SHAKE GENTLY BEFORE USE', 'ADMINISTER ON EMPTY STOMACH (30-60 MIN BEFORE FEEDING)'],
    pharmacopeiaRef: 'USP <795> Non-sterile Preparations & Children’s Hospital Guidelines'
  }
];
