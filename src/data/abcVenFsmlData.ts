import { 
  AbcVenMedicineItem, 
  FacilityMedicineItem, 
  DtcReportMetadata,
  AbcClass,
  VenClass,
  AbcVenMatrixCell,
  PriorityTier
} from '../types';

export const initialDtcMetadata: DtcReportMetadata = {
  facilityName: 'Tikur Anbessa Specialized Hospital (TASH)',
  facilityLevel: 'Specialized',
  region: 'Addis Ababa City Administration Health Bureau / AAU',
  dtcChairperson: 'Prof. Yonas Tadesse (Chairperson, DTC & Senior Clinical Consultant)',
  chiefPharmacist: 'Pharm. Dawid Aliyi (Secretary DTC & Head of Clinical Pharmacy)',
  clinicalDirector: 'Dr. Betelhem Girma (Medical & Clinical Services Director)',
  hospitalCeo: 'Dr. Mengistu Worku (Chief Executive Director, Hospital Operations)',
  fiscalYear: '2026/2027 (2018/2019 E.C.)',
  meetingDate: 'October 28, 2026',
  meetingResolutionNumber: 'TASH-DTC-RES-2026/044',
  totalAnnualBudgetETB: 185000000, // 185 Million ETB
  allocatedBudgetETB: 168450000
};

// Initial Raw Dataset for ABC & VEN Analysis (32 representative Hospital Commodities)
export const rawHospitalPharmaceuticals: Omit<
  AbcVenMedicineItem, 
  'totalCostETB' | 'percentOfTotalSpend' | 'cumulativeCostETB' | 'cumulativePercent' | 'cumulativeItemPercent' | 'itemRank' | 'abcClass' | 'matrixCategory' | 'priorityTier' | 'budgetActionRecommendation'
>[] = [
  {
    id: 'med-01',
    itemCode: 'ETH-MED-001',
    genericName: 'Meropenem Trihydrate',
    brandAliases: 'Meronem, Penem-1g',
    strength: '1g',
    dosageForm: 'Powder for Injection (IV)',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Anti-infective (Carbapenem)',
    annualConsumption: 24500,
    unitCostETB: 680,
    venClass: 'V',
    levelOfUse: 'Specialized',
    prescriberRestriction: 'Specialist / Senior Consultant',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Reserve antimicrobial for multidrug-resistant ESBL Gram-negative septic shock, ventilator-associated pneumonia, and severe intra-abdominal infections.'
  },
  {
    id: 'med-02',
    itemCode: 'ETH-MED-002',
    genericName: 'Trastuzumab',
    brandAliases: 'Herceptin, Ogivri',
    strength: '440mg',
    dosageForm: 'Powder for Concentrate for Infusion',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Oncology (HER2+ Monoclonal Antibody)',
    annualConsumption: 820,
    unitCostETB: 18500,
    venClass: 'V',
    levelOfUse: 'Specialized',
    prescriberRestriction: 'Sub-Specialist / Oncologist',
    nemlStatus: 'Complementary',
    dtcApproved: true,
    clinicalRationale: 'Targeted biological therapy for HER2-positive metastatic and early-stage breast cancer; life-prolonging essential oncology commodity.'
  },
  {
    id: 'med-03',
    itemCode: 'ETH-MED-003',
    genericName: 'Piperacillin + Tazobactam',
    brandAliases: 'Tazocin, Piptaz',
    strength: '4.5g',
    dosageForm: 'Powder for Injection',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Anti-infective (Extended Spectrum Penicillin)',
    annualConsumption: 28000,
    unitCostETB: 420,
    venClass: 'V',
    levelOfUse: 'Specialized',
    prescriberRestriction: 'Specialist / Senior Consultant',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Empiric broad-spectrum coverage for hospital-acquired Pseudomonas aeruginosa, neutropenic fever, and complicated sepsis.'
  },
  {
    id: 'med-04',
    itemCode: 'ETH-MED-004',
    genericName: 'Human Albumin Solution 20%',
    brandAliases: 'AlbuRx, Albutein',
    strength: '20% (100ml)',
    dosageForm: 'IV Infusion Bottle',
    unitOfIssue: 'Bottle',
    therapeuticCategory: 'Blood Derivative / Colloid',
    annualConsumption: 6500,
    unitCostETB: 1750,
    venClass: 'N',
    levelOfUse: 'Specialized',
    prescriberRestriction: 'Specialist / Senior Consultant',
    nemlStatus: 'Complementary',
    dtcApproved: false,
    clinicalRationale: 'High cost with limited evidence outside large-volume paracentesis and hepatorenal syndrome; frequently overprescribed for simple hypoalbuminemia.'
  },
  {
    id: 'med-05',
    itemCode: 'ETH-MED-005',
    genericName: 'Enoxaparin Sodium',
    brandAliases: 'Clexane, Lovenox',
    strength: '40mg / 0.4ml',
    dosageForm: 'Prefilled Syringe (SC)',
    unitOfIssue: 'Syringe',
    therapeuticCategory: 'Anticoagulant (LMWH)',
    annualConsumption: 32000,
    unitCostETB: 290,
    venClass: 'E',
    levelOfUse: 'General',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Prophylaxis and therapeutic treatment of deep vein thrombosis (DVT), pulmonary embolism (PE), and acute coronary syndrome (ACS).'
  },
  {
    id: 'med-06',
    itemCode: 'ETH-MED-006',
    genericName: 'Insulin Glargine (Long-Acting Analog)',
    brandAliases: 'Lantus, Basalog',
    strength: '100 IU/ml (10ml)',
    dosageForm: 'Injection Cartridge / Vial',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Endocrine (Basal Insulin)',
    annualConsumption: 12500,
    unitCostETB: 650,
    venClass: 'E',
    levelOfUse: 'General',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Complementary',
    dtcApproved: true,
    clinicalRationale: 'Once-daily basal insulin providing peakless 24h glucose control; reduces nocturnal hypoglycemia in brittle Type 1 and Type 2 diabetes.'
  },
  {
    id: 'med-07',
    itemCode: 'ETH-MED-007',
    genericName: 'Vancomycin Hydrochloride',
    brandAliases: 'Vancocin',
    strength: '500mg',
    dosageForm: 'Powder for Injection (IV)',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Anti-infective (Glycopeptide)',
    annualConsumption: 22000,
    unitCostETB: 340,
    venClass: 'V',
    levelOfUse: 'General',
    prescriberRestriction: 'Specialist / Senior Consultant',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'First-line therapy for confirmed MRSA bacteremia, prosthetic joint infections, and enterococcal endocarditis with renal TDM monitoring.'
  },
  {
    id: 'med-08',
    itemCode: 'ETH-MED-008',
    genericName: 'Propofol Injectable Emulsion',
    brandAliases: 'Diprivan',
    strength: '10mg/ml (20ml)',
    dosageForm: 'Emulsion for IV Injection',
    unitOfIssue: 'Ampoule',
    therapeuticCategory: 'Anesthetic (General IV)',
    annualConsumption: 25000,
    unitCostETB: 280,
    venClass: 'V',
    levelOfUse: 'General',
    prescriberRestriction: 'Specialist / Senior Consultant',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Induction and maintenance of general anesthesia, procedural sedation, and mechanical ventilation sedation in ICU.'
  },
  {
    id: 'med-09',
    itemCode: 'ETH-MED-009',
    genericName: 'Intravenous Multivitamin + Trace Minerals Complex',
    brandAliases: 'Cernevit, M.V.I. Adult',
    strength: '10ml',
    dosageForm: 'Lyophilized IV Concentrate',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Nutrition / Vitamins',
    annualConsumption: 18000,
    unitCostETB: 380,
    venClass: 'N',
    levelOfUse: 'Specialized',
    prescriberRestriction: 'Specialist / Senior Consultant',
    nemlStatus: 'Non-NEML (Facility Specific)',
    dtcApproved: false,
    clinicalRationale: 'Extremely costly non-essential formulation; routinely abused in ward admissions without total parenteral nutrition (TPN) indications.'
  },
  {
    id: 'med-10',
    itemCode: 'ETH-MED-010',
    genericName: 'Ceftriaxone Sodium',
    brandAliases: 'Rocephin, Mesporin',
    strength: '1g',
    dosageForm: 'Powder for Injection (IV/IM)',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Anti-infective (3rd Gen Cephalosporin)',
    annualConsumption: 65000,
    unitCostETB: 95,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Workhorse inpatient antibiotic for community-acquired pneumonia, bacterial meningitis, pyelonephritis, and surgical prophylaxis.'
  },
  {
    id: 'med-11',
    itemCode: 'ETH-MED-011',
    genericName: 'Oxytocin',
    brandAliases: 'Pitocin, Syntocinon',
    strength: '10 IU / 1ml',
    dosageForm: 'Injection (IM/IV)',
    unitOfIssue: 'Ampoule',
    therapeuticCategory: 'Obstetric & Gynecologic (Uterotonic)',
    annualConsumption: 48000,
    unitCostETB: 75,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Mandatory life-saving medication for prevention and active management of Postpartum Hemorrhage (PPH); zero-tolerance stockout.'
  },
  {
    id: 'med-12',
    itemCode: 'ETH-MED-012',
    genericName: 'Adrenaline (Epinephrine)',
    brandAliases: 'EpiPen, Adrenaline Tartrate',
    strength: '1mg / 1ml (1:1000)',
    dosageForm: 'Injection (IM/IV/SC)',
    unitOfIssue: 'Ampoule',
    therapeuticCategory: 'Emergency / Resuscitation',
    annualConsumption: 34000,
    unitCostETB: 85,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Immediate life-saving reversal for systemic anaphylaxis, cardiac arrest ACLS protocols, and severe croup nebulization.'
  },
  {
    id: 'med-13',
    itemCode: 'ETH-MED-013',
    genericName: 'Magnesium Sulfate',
    brandAliases: 'MgSO4 50%',
    strength: '50% (5g / 10ml)',
    dosageForm: 'Injection for IV/IM',
    unitOfIssue: 'Ampoule',
    therapeuticCategory: 'Obstetric & Anticonvulsant',
    annualConsumption: 31000,
    unitCostETB: 80,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Gold standard prevention and treatment of eclamptic convulsions in severe pre-eclampsia; national maternal survival tracer.'
  },
  {
    id: 'med-14',
    itemCode: 'ETH-MED-014',
    genericName: 'Amoxicillin + Clavulanic Acid',
    brandAliases: 'Augmentin, Clavam',
    strength: '625mg',
    dosageForm: 'Film-Coated Tablet',
    unitOfIssue: 'Tablet (Box of 14)',
    annualConsumption: 42000,
    unitCostETB: 55,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Beta-lactamase resistant aminopenicillin for recurrent otitis media, acute sinusitis, dog bites, and skin/soft tissue infections.'
  },
  {
    id: 'med-15',
    itemCode: 'ETH-MED-015',
    genericName: 'Atorvastatin Calcium',
    brandAliases: 'Lipitor, Atorva',
    strength: '20mg',
    dosageForm: 'Film-Coated Tablet',
    unitOfIssue: 'Tablet (Strip of 10)',
    annualConsumption: 55000,
    unitCostETB: 38,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'HMG-CoA reductase inhibitor for atherosclerotic cardiovascular disease (ASCVD), post-MI secondary prevention, and familial hypercholesterolemia.'
  },
  {
    id: 'med-16',
    itemCode: 'ETH-MED-016',
    genericName: 'Metformin Hydrochloride',
    brandAliases: 'Glucophage',
    strength: '500mg',
    dosageForm: 'Tablet',
    unitOfIssue: 'Tablet (Pack of 100)',
    annualConsumption: 75000,
    unitCostETB: 24,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'First-line biguanide oral antihyperglycemic for Type 2 diabetes mellitus with proven cardiovascular and weight-neutral benefits.'
  },
  {
    id: 'med-17',
    itemCode: 'ETH-MED-017',
    genericName: 'Topical Analgesic & Herbal Menthol Balm',
    brandAliases: 'Tiger Balm, Counterpain',
    strength: '20g',
    dosageForm: 'Ointment',
    unitOfIssue: 'Jar',
    therapeuticCategory: 'Dermatological / Counterirritant',
    annualConsumption: 22000,
    unitCostETB: 70,
    venClass: 'N',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Non-NEML (Facility Specific)',
    dtcApproved: false,
    clinicalRationale: 'Symptomatic counterirritant with zero disease-modifying utility; non-essential expenditure consuming facility revolving drug funds.'
  },
  {
    id: 'med-18',
    itemCode: 'ETH-MED-018',
    genericName: 'Atropine Sulfate',
    brandAliases: 'Atropine Inj',
    strength: '1mg / 1ml',
    dosageForm: 'Injection (IV/IM/SC)',
    unitOfIssue: 'Ampoule',
    therapeuticCategory: 'Emergency / Antidote',
    annualConsumption: 28000,
    unitCostETB: 45,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Life-saving antidote for organophosphate / carbamate insecticide poisoning (common in rural Ethiopian agro-regions) and symptomatic bradycardia.'
  },
  {
    id: 'med-19',
    itemCode: 'ETH-MED-019',
    genericName: 'Hydrocortisone Sodium Succinate',
    brandAliases: 'Solu-Cortef',
    strength: '100mg',
    dosageForm: 'Powder for Injection (IV)',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Endocrine / Corticosteroid',
    annualConsumption: 35000,
    unitCostETB: 35,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Emergency steroid for acute Addisonian adrenal crisis, severe refractory status asthmaticus, and septic shock vasopressor unresponsiveness.'
  },
  {
    id: 'med-20',
    itemCode: 'ETH-MED-020',
    genericName: 'Diazepam',
    brandAliases: 'Valium',
    strength: '10mg / 2ml',
    dosageForm: 'Injection (IV/IM)',
    unitOfIssue: 'Ampoule',
    therapeuticCategory: 'CNS / Anticonvulsant',
    annualConsumption: 30000,
    unitCostETB: 30,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'First-line rapid-acting benzodiazepine for acute status epilepticus convulsions, febrile seizures, and severe acute alcohol withdrawal agitation.'
  },
  {
    id: 'med-21',
    itemCode: 'ETH-MED-021',
    genericName: 'Paracetamol (Acetaminophen)',
    brandAliases: 'Panadol, Calpol',
    strength: '500mg',
    dosageForm: 'Tablet',
    unitOfIssue: 'Tablet (Pack of 1000)',
    annualConsumption: 98000,
    unitCostETB: 8,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Universal antipyretic and mild-to-moderate analgesic with high safety profile in pregnancy, pediatrics, and dengue/viral fevers.'
  },
  {
    id: 'med-22',
    itemCode: 'ETH-MED-022',
    genericName: 'Oral Rehydration Salts (ORS) + Zinc',
    brandAliases: 'WHO Low Osmolarity ORS',
    strength: '20.5g sachet (for 1 Liter) + 20mg Zinc',
    dosageForm: 'Oral Powder Sachet',
    unitOfIssue: 'Co-pack Sachet',
    therapeuticCategory: 'Gastrointestinal / Electrolytes',
    annualConsumption: 85000,
    unitCostETB: 9,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Pivotal child-survival intervention for preventing diarrheal dehydration mortality under Integrated Management of Neonatal and Childhood Illness (IMNCI).'
  },
  {
    id: 'med-23',
    itemCode: 'ETH-MED-023',
    genericName: 'Folic Acid',
    brandAliases: 'Folvite',
    strength: '5mg',
    dosageForm: 'Tablet',
    unitOfIssue: 'Tablet (Tin of 1000)',
    annualConsumption: 60000,
    unitCostETB: 5,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Antenatal supplementation for neural tube defect (spina bifida) prevention and treatment of folate deficiency megaloblastic anemia.'
  },
  {
    id: 'med-24',
    itemCode: 'ETH-MED-024',
    genericName: 'Salbutamol (Albuterol) Inhaler',
    brandAliases: 'Ventolin HFA',
    strength: '100mcg / puff (200 doses)',
    dosageForm: 'Metered Dose Inhaler (MDI)',
    unitOfIssue: 'Canister',
    therapeuticCategory: 'Respiratory / Bronchodilator',
    annualConsumption: 14000,
    unitCostETB: 42,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Short-acting beta-2 agonist (SABA) rapid reliever for acute bronchospasm, acute asthma exacerbation, and COPD breathlessness.'
  },
  {
    id: 'med-25',
    itemCode: 'ETH-MED-025',
    genericName: 'Cough Syrups Containing Promethazine + Dextromethorphan',
    brandAliases: 'Phensedyl, Histalix',
    strength: '100ml',
    dosageForm: 'Oral Liquid Syrup',
    unitOfIssue: 'Bottle',
    therapeuticCategory: 'Respiratory / Antitussive',
    annualConsumption: 12000,
    unitCostETB: 48,
    venClass: 'N',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Non-NEML (Facility Specific)',
    dtcApproved: false,
    clinicalRationale: 'High abuse liability, risk of central respiratory depression in children, and lack of proven efficacy in self-limiting upper respiratory infections.'
  },
  {
    id: 'med-26',
    itemCode: 'ETH-MED-026',
    genericName: 'Throat Lozenges with Antiseptic',
    brandAliases: 'Strepsils, Vocalzone',
    strength: 'Pack of 16',
    dosageForm: 'Lozenges',
    unitOfIssue: 'Strip',
    therapeuticCategory: 'ENT / Symptomatic',
    annualConsumption: 10000,
    unitCostETB: 35,
    venClass: 'N',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Non-NEML (Facility Specific)',
    dtcApproved: false,
    clinicalRationale: 'Non-essential symptomatic comfort item with zero antimicrobial cure effect; candidate for immediate elimination from hospital purchase list.'
  },
  {
    id: 'med-27',
    itemCode: 'ETH-MED-027',
    genericName: 'Tetanus Toxoid Vaccine Adsorbed',
    brandAliases: 'TT Vaccine',
    strength: '0.5ml (10-dose vial)',
    dosageForm: 'Suspension for Injection',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Vaccine / Immunological',
    annualConsumption: 15000,
    unitCostETB: 22,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Prevention of neonatal tetanus and trauma-related Clostridium tetani infection; routine EPI and emergency wound management staple.'
  },
  {
    id: 'med-28',
    itemCode: 'ETH-MED-028',
    genericName: 'Amoxicillin Trihydrate Capsules',
    brandAliases: 'Amoxil',
    strength: '500mg',
    dosageForm: 'Capsule',
    unitOfIssue: 'Capsule (Tin of 1000)',
    annualConsumption: 92000,
    unitCostETB: 5.5,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'First-line outpatient antibiotic for fast-breathing pneumonia in children, streptococcal pharyngitis, and acute otitis media.'
  },
  {
    id: 'med-29',
    itemCode: 'ETH-MED-029',
    genericName: 'Ciprofloxacin Hydrochloride',
    brandAliases: 'Cipro, Ciprobay',
    strength: '500mg',
    dosageForm: 'Film-Coated Tablet',
    unitOfIssue: 'Tablet (Strip of 10)',
    annualConsumption: 45000,
    unitCostETB: 8,
    venClass: 'E',
    levelOfUse: 'Primary',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Fluoroquinolone for acute complicated urinary tract infections, severe enteric typhoid fever, and infectious diarrhea.'
  },
  {
    id: 'med-30',
    itemCode: 'ETH-MED-030',
    genericName: 'Anti-Snake Venom (Polyvalent Equine)',
    brandAliases: 'ASV Polyvalent African',
    strength: '10ml',
    dosageForm: 'Lyophilized Powder with Diluent',
    unitOfIssue: 'Vial',
    therapeuticCategory: 'Antidote / Antivenom',
    annualConsumption: 2400,
    unitCostETB: 3200,
    venClass: 'V',
    levelOfUse: 'General',
    prescriberRestriction: 'General Medical Practitioner',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Life-saving neutralizer for cytotoxic and neurotoxic envenomation (Echis, Bitis, Naja species) in regional agricultural districts.'
  },
  {
    id: 'med-31',
    itemCode: 'ETH-MED-031',
    genericName: 'Artemether + Lumefantrine (Coartem)',
    brandAliases: 'Coartem 20/120',
    strength: '20mg / 120mg',
    dosageForm: 'Dispersible Tablet',
    unitOfIssue: 'Blister Pack (6x4)',
    annualConsumption: 38000,
    unitCostETB: 42,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'First-line Artemisinin-based Combination Therapy (ACT) for uncomplicated Plasmodium falciparum malaria nationwide.'
  },
  {
    id: 'med-32',
    itemCode: 'ETH-MED-032',
    genericName: 'Lactated Ringer\'s Solution (Hartmann\'s)',
    brandAliases: 'Ringer Lactate IV',
    strength: '1000ml (1 Liter)',
    dosageForm: 'Infusion Bag',
    unitOfIssue: 'Bag',
    therapeuticCategory: 'IV Fluids / Resuscitation',
    annualConsumption: 52000,
    unitCostETB: 68,
    venClass: 'V',
    levelOfUse: 'Primary',
    prescriberRestriction: 'Health Officer / Druggist',
    nemlStatus: 'Core NEML',
    dtcApproved: true,
    clinicalRationale: 'Balanced crystalloid fluid for acute hemorrhagic hypovolemia, surgical rehydration, and septic shock resuscitation.'
  }
];

/**
 * Computes full ABC & VEN analysis parameters including Pareto Lorenz ranks,
 * cumulative costs, percentage distribution, and 9-cell matrix placement.
 */
export function calculateAbcVenAnalysis(
  items = rawHospitalPharmaceuticals,
  thresholdA = 75, // Category A default: top 75% of spend
  thresholdB = 90  // Category B default: next 15% (75-90%) of spend
): {
  processedItems: AbcVenMedicineItem[];
  totalExpenditureETB: number;
  totalItemCount: number;
  abcSummary: Record<AbcClass, { count: number; spendETB: number; percentSpend: number; percentItems: number }>;
  venSummary: Record<VenClass, { count: number; spendETB: number; percentSpend: number; percentItems: number }>;
  matrixSummary: Record<AbcVenMatrixCell, { count: number; spendETB: number; percentSpend: number; items: AbcVenMedicineItem[] }>;
  prioritySummary: Record<PriorityTier, { count: number; spendETB: number; percentSpend: number }>;
} {
  // Step 1: Calculate Total Spend for each item
  const withTotal = items.map(item => {
    const totalCostETB = item.annualConsumption * item.unitCostETB;
    return { ...item, totalCostETB };
  });

  // Step 2: Sort descending by total cost
  withTotal.sort((a, b) => b.totalCostETB - a.totalCostETB);

  // Step 3: Total facility spend
  const totalExpenditureETB = withTotal.reduce((acc, curr) => acc + curr.totalCostETB, 0);
  const totalItemCount = withTotal.length;

  // Step 4: Calculate cumulative figures & assign ABC & Matrix
  let runningSpend = 0;

  const processedItems: AbcVenMedicineItem[] = withTotal.map((item, index) => {
    runningSpend += item.totalCostETB;
    const percentOfTotalSpend = totalExpenditureETB > 0 ? (item.totalCostETB / totalExpenditureETB) * 100 : 0;
    const cumulativeCostETB = runningSpend;
    const cumulativePercent = totalExpenditureETB > 0 ? (runningSpend / totalExpenditureETB) * 100 : 0;
    const cumulativeItemPercent = ((index + 1) / totalItemCount) * 100;
    const itemRank = index + 1;

    // Assign ABC Category based on cumulative spend
    let abcClass: AbcClass = 'C';
    if (cumulativePercent <= thresholdA || (index === 0 && cumulativePercent > thresholdA)) {
      abcClass = 'A';
    } else if (cumulativePercent <= thresholdB) {
      abcClass = 'B';
    } else {
      abcClass = 'C';
    }

    const matrixCategory: AbcVenMatrixCell = `${abcClass}${item.venClass}` as AbcVenMatrixCell;

    // Priority Tier
    // Category I: AV, BV, CV, AE, AN (Top managerial oversight)
    // Category II: BE, CE, BN
    // Category III: CN, and scrutinize AN
    let priorityTier: PriorityTier = 'Category II (Medium)';
    let budgetActionRecommendation = '';

    if (item.venClass === 'V' || (abcClass === 'A' && item.venClass === 'E')) {
      priorityTier = 'Category I (High)';
      budgetActionRecommendation = 'Strict availability required (target 100% buffer). Tight safety stock control, monthly review, direct EPSS framework contract.';
    } else if (abcClass === 'A' && item.venClass === 'N') {
      priorityTier = 'Category I (High)'; // Highest managerial attention to cut or substitute!
      budgetActionRecommendation = 'CRITICAL SCRUTINY: High budget drain on non-essential commodity. Institute DTC therapeutic restriction or substitute with cheaper generic/core item.';
    } else if (abcClass === 'C' && item.venClass === 'N') {
      priorityTier = 'Category III (Low / Scrutinize)';
      budgetActionRecommendation = 'Lowest priority. Consider full deletion from facility formulary or purchase only on private patient demand.';
    } else if (item.venClass === 'N') {
      priorityTier = 'Category III (Low / Scrutinize)';
      budgetActionRecommendation = 'Review clinical necessity. First candidate for budget reduction if departmental allocation is reduced.';
    } else {
      priorityTier = 'Category II (Medium)';
      budgetActionRecommendation = 'Standard IPLS bimonthly replenishment. Maintain 2-4 months of stock.';
    }

    return {
      ...item,
      percentOfTotalSpend,
      cumulativeCostETB,
      cumulativePercent,
      cumulativeItemPercent,
      itemRank,
      abcClass,
      matrixCategory,
      priorityTier,
      budgetActionRecommendation
    };
  });

  // Step 5: Calculate Summaries
  const abcSummary: Record<AbcClass, { count: number; spendETB: number; percentSpend: number; percentItems: number }> = {
    A: { count: 0, spendETB: 0, percentSpend: 0, percentItems: 0 },
    B: { count: 0, spendETB: 0, percentSpend: 0, percentItems: 0 },
    C: { count: 0, spendETB: 0, percentSpend: 0, percentItems: 0 },
  };

  const venSummary: Record<VenClass, { count: number; spendETB: number; percentSpend: number; percentItems: number }> = {
    V: { count: 0, spendETB: 0, percentSpend: 0, percentItems: 0 },
    E: { count: 0, spendETB: 0, percentSpend: 0, percentItems: 0 },
    N: { count: 0, spendETB: 0, percentSpend: 0, percentItems: 0 },
  };

  const matrixSummary: Record<AbcVenMatrixCell, { count: number; spendETB: number; percentSpend: number; items: AbcVenMedicineItem[] }> = {
    AV: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    BV: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    CV: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    AE: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    BE: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    CE: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    AN: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    BN: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
    CN: { count: 0, spendETB: 0, percentSpend: 0, items: [] },
  };

  const prioritySummary: Record<PriorityTier, { count: number; spendETB: number; percentSpend: number }> = {
    'Category I (High)': { count: 0, spendETB: 0, percentSpend: 0 },
    'Category II (Medium)': { count: 0, spendETB: 0, percentSpend: 0 },
    'Category III (Low / Scrutinize)': { count: 0, spendETB: 0, percentSpend: 0 },
  };

  processedItems.forEach(item => {
    // ABC
    abcSummary[item.abcClass].count += 1;
    abcSummary[item.abcClass].spendETB += item.totalCostETB;

    // VEN
    venSummary[item.venClass].count += 1;
    venSummary[item.venClass].spendETB += item.totalCostETB;

    // Matrix
    matrixSummary[item.matrixCategory].count += 1;
    matrixSummary[item.matrixCategory].spendETB += item.totalCostETB;
    matrixSummary[item.matrixCategory].items.push(item);

    // Priority
    prioritySummary[item.priorityTier].count += 1;
    prioritySummary[item.priorityTier].spendETB += item.totalCostETB;
  });

  // Percentages
  (['A', 'B', 'C'] as AbcClass[]).forEach(k => {
    abcSummary[k].percentSpend = totalExpenditureETB > 0 ? (abcSummary[k].spendETB / totalExpenditureETB) * 100 : 0;
    abcSummary[k].percentItems = totalItemCount > 0 ? (abcSummary[k].count / totalItemCount) * 100 : 0;
  });

  (['V', 'E', 'N'] as VenClass[]).forEach(k => {
    venSummary[k].percentSpend = totalExpenditureETB > 0 ? (venSummary[k].spendETB / totalExpenditureETB) * 100 : 0;
    venSummary[k].percentItems = totalItemCount > 0 ? (venSummary[k].count / totalItemCount) * 100 : 0;
  });

  (Object.keys(matrixSummary) as AbcVenMatrixCell[]).forEach(cell => {
    matrixSummary[cell].percentSpend = totalExpenditureETB > 0 ? (matrixSummary[cell].spendETB / totalExpenditureETB) * 100 : 0;
  });

  (Object.keys(prioritySummary) as PriorityTier[]).forEach(p => {
    prioritySummary[p].percentSpend = totalExpenditureETB > 0 ? (prioritySummary[p].spendETB / totalExpenditureETB) * 100 : 0;
  });

  return {
    processedItems,
    totalExpenditureETB,
    totalItemCount,
    abcSummary,
    venSummary,
    matrixSummary,
    prioritySummary
  };
}

// Facility Specific Medicine List (FSML) Initial Data
export const initialFacilityMedicines: FacilityMedicineItem[] = [
  // 1. Cardiovascular Medicines
  {
    id: 'fsm-01',
    inn: 'Amlodipine Besylate',
    strengthForm: '5mg & 10mg Tablet',
    therapeuticCategory: 'Cardiovascular',
    subCategory: 'Calcium Channel Blocker (Dihydropyridine)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 90,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Essential hypertension, chronic stable angina pectoris, Raynaud phenomenon.',
    rationale: 'First-line monotherapy or combination therapy in African patients according to Ethiopian STG 5th Ed.',
    lastReviewedDate: '2026-09-14',
    leadReviewer: 'Cardiology Sub-committee'
  },
  {
    id: 'fsm-02',
    inn: 'Enalapril Maleate',
    strengthForm: '5mg, 10mg & 20mg Tablet',
    therapeuticCategory: 'Cardiovascular',
    subCategory: 'ACE Inhibitor',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 90,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Hypertension with diabetic nephropathy or microalbuminuria, Heart Failure with Reduced Ejection Fraction (HFrEF).',
    rationale: 'Renoprotective and mortality-reducing agent in systolic heart failure.',
    lastReviewedDate: '2026-09-14',
    leadReviewer: 'Cardiology Sub-committee'
  },
  {
    id: 'fsm-03',
    inn: 'Atorvastatin Calcium',
    strengthForm: '20mg & 40mg Tablet',
    therapeuticCategory: 'Cardiovascular',
    subCategory: 'Lipid-Lowering Agent (Statin)',
    levelOfUse: 'Primary',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 90,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Primary prevention in high ASCVD risk patients, secondary prevention post-ACS, ischemic stroke.',
    rationale: 'Potent statin with extensive cardiovascular morbidity reduction evidence.',
    lastReviewedDate: '2026-09-14',
    leadReviewer: 'Cardiology Sub-committee'
  },
  {
    id: 'fsm-04',
    inn: 'Carvedilol',
    strengthForm: '6.25mg, 12.5mg & 25mg Tablet',
    therapeuticCategory: 'Cardiovascular',
    subCategory: 'Non-Selective Beta-Blocker with Alpha-1 Activity',
    levelOfUse: 'General',
    prescriberLevel: 'Specialist / Senior Consultant',
    venCategory: 'E',
    nemlStatus: 'Complementary',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 60,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Chronic stable heart failure with reduced EF, post-MI left ventricular dysfunction.',
    rationale: 'Proven survival prolongation in heart failure; titrated slowly under clinical supervision.',
    lastReviewedDate: '2026-08-20',
    leadReviewer: 'Cardiology Sub-committee'
  },
  {
    id: 'fsm-05',
    inn: 'Dopamine Hydrochloride',
    strengthForm: '40mg/ml (5ml ampoule)',
    therapeuticCategory: 'Cardiovascular',
    subCategory: 'Inotropic / Vasopressor Agent',
    levelOfUse: 'General',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 5,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Cardiogenic shock, severe septic shock uncorrected by fluid expansion, severe symptomatic bradycardia.',
    rationale: 'Emergency inotrope for ICU, Emergency Department, and surgical recovery suites.',
    lastReviewedDate: '2026-10-02',
    leadReviewer: 'Emergency & Critical Care'
  },

  // 2. Anti-Infective Medicines
  {
    id: 'fsm-06',
    inn: 'Amoxicillin + Clavulanic Acid',
    strengthForm: '625mg & 1g Tablet; 1.2g IV Vial; 156mg/5ml & 312mg/5ml Syrup',
    therapeuticCategory: 'Anti-infective',
    subCategory: 'Beta-Lactam + Beta-Lactamase Inhibitor',
    levelOfUse: 'Primary',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 14,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Complicated community-acquired respiratory infections, bite wounds, skin/soft tissue infections.',
    rationale: 'Essential antibiotic overcoming beta-lactamase producing Staphylococci and H. influenzae.',
    lastReviewedDate: '2026-09-10',
    leadReviewer: 'Infectious Diseases & AMS'
  },
  {
    id: 'fsm-07',
    inn: 'Ceftriaxone Sodium',
    strengthForm: '500mg & 1g Powder for Injection',
    therapeuticCategory: 'Anti-infective',
    subCategory: 'Third-Generation Cephalosporin',
    levelOfUse: 'Primary',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 10,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Severe community-acquired pneumonia, acute bacterial meningitis, pyelonephritis, gonococcal infection.',
    rationale: 'WHO AWaRe classification: WATCH group; mandatory AMS prescription audit.',
    lastReviewedDate: '2026-09-10',
    leadReviewer: 'Infectious Diseases & AMS'
  },
  {
    id: 'fsm-08',
    inn: 'Meropenem Trihydrate',
    strengthForm: '500mg & 1g Powder for Injection',
    therapeuticCategory: 'Anti-infective',
    subCategory: 'Carbapenem',
    levelOfUse: 'Specialized',
    prescriberLevel: 'Specialist / Senior Consultant',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 14,
    dtcApprovalStatus: 'Restricted',
    stgIndication: 'Documented or strongly suspected ESBL Gram-negative septic shock, hospital-acquired bacteremia.',
    rationale: 'WHO AWaRe RESERVE antibiotic; requires Infectious Disease Specialist or DTC prior authorization.',
    lastReviewedDate: '2026-10-18',
    leadReviewer: 'Infectious Diseases & AMS'
  },
  {
    id: 'fsm-09',
    inn: 'Artemether + Lumefantrine',
    strengthForm: '20mg/120mg Tablet (6-dose blister)',
    therapeuticCategory: 'Anti-infective',
    subCategory: 'Antimalarial (ACT)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 3,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Confirmed uncomplicated Plasmodium falciparum and mixed malaria infections.',
    rationale: 'National Malaria Elimination Program tracer drug; distributed free under public health subsidy.',
    lastReviewedDate: '2026-07-15',
    leadReviewer: 'Parasitology & Public Health'
  },
  {
    id: 'fsm-10',
    inn: 'Fluconazole',
    strengthForm: '150mg & 200mg Capsule; 2mg/ml (100ml) IV Infusion',
    therapeuticCategory: 'Anti-infective',
    subCategory: 'Triazole Antifungal',
    levelOfUse: 'Primary',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 28,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Cryptococcal meningitis (maintenance phase), esophageal candidiasis, systemic candidemia.',
    rationale: 'Essential for immunocompromised and HIV/AIDS patient care protocols.',
    lastReviewedDate: '2026-08-11',
    leadReviewer: 'Infectious Diseases & AMS'
  },

  // 3. Endocrine & Metabolic
  {
    id: 'fsm-11',
    inn: 'Metformin Hydrochloride',
    strengthForm: '500mg & 850mg Tablet',
    therapeuticCategory: 'Endocrine & Metabolic',
    subCategory: 'Biguanide Antihyperglycemic',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 90,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Type 2 Diabetes Mellitus monotherapy and initial combination therapy.',
    rationale: 'Safe, affordable, effective with no hypoglycemia risk when used as monotherapy.',
    lastReviewedDate: '2026-09-01',
    leadReviewer: 'Endocrinology Sub-committee'
  },
  {
    id: 'fsm-12',
    inn: 'Insulin Human Regular (Soluble)',
    strengthForm: '100 IU/ml (10ml vial)',
    therapeuticCategory: 'Endocrine & Metabolic',
    subCategory: 'Short-Acting Human Insulin',
    levelOfUse: 'Primary',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 30,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Diabetic Ketoacidosis (DKA), Hyperosmolar Hyperglycemic State, emergency perioperative glucose control.',
    rationale: 'Vital resuscitation medicine for inpatient diabetes emergencies.',
    lastReviewedDate: '2026-09-01',
    leadReviewer: 'Endocrinology Sub-committee'
  },
  {
    id: 'fsm-13',
    inn: 'Glibenclamide',
    strengthForm: '5mg Tablet',
    therapeuticCategory: 'Endocrine & Metabolic',
    subCategory: 'Sulfonylurea (2nd Generation)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 90,
    dtcApprovalStatus: 'Conditional',
    stgIndication: 'Type 2 Diabetes Mellitus in non-elderly patients with adequate renal function.',
    rationale: 'Caution in elderly due to prolonged hypoglycemia risk; Glimepiride or Gliclazide preferred where available.',
    lastReviewedDate: '2026-09-01',
    leadReviewer: 'Endocrinology Sub-committee'
  },

  // 4. Obstetrics, Gynecology & Maternal Health
  {
    id: 'fsm-14',
    inn: 'Oxytocin',
    strengthForm: '10 IU / 1ml Injection',
    therapeuticCategory: 'Obstetric & Gynecologic',
    subCategory: 'Uterotonic Agent',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 1,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Active management of the third stage of labor (AMTSL), induction/augmentation of labor, postpartum hemorrhage.',
    rationale: 'National Maternal Mortality Reduction tracer; strict cold chain (2°C-8°C) monitoring required.',
    lastReviewedDate: '2026-10-01',
    leadReviewer: 'Ob-Gyn Department'
  },
  {
    id: 'fsm-15',
    inn: 'Magnesium Sulfate',
    strengthForm: '50% (5g / 10ml) Injection',
    therapeuticCategory: 'Obstetric & Gynecologic',
    subCategory: 'Anticonvulsant / Neuroprotective',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 2,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Prevention and control of seizures in severe pre-eclampsia and eclampsia; fetal neuroprotection before 32 weeks.',
    rationale: 'Life-saving obstetrical commodity; mandatory in all delivery rooms.',
    lastReviewedDate: '2026-10-01',
    leadReviewer: 'Ob-Gyn Department'
  },
  {
    id: 'fsm-16',
    inn: 'Misoprostol',
    strengthForm: '200mcg Tablet',
    therapeuticCategory: 'Obstetric & Gynecologic',
    subCategory: 'Prostaglandin E1 Analog',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 3,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Prevention and treatment of PPH where oxytocin is unavailable or cold chain failed; induction of labor for intrauterine fetal death.',
    rationale: 'Room-temperature stable uterotonic alternative indispensable for low-resource settings.',
    lastReviewedDate: '2026-10-01',
    leadReviewer: 'Ob-Gyn Department'
  },

  // 5. Emergency, Anesthesia & Resuscitation
  {
    id: 'fsm-17',
    inn: 'Adrenaline (Epinephrine)',
    strengthForm: '1mg / 1ml (1:1000) Injection',
    therapeuticCategory: 'Emergency & Resuscitation',
    subCategory: 'Adrenergic Agonist (Sympathomimetic)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 1,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Anaphylaxis, cardiac arrest, severe bronchospasm refractory to salbutamol.',
    rationale: 'Immediate life-saving medicine; present on all crash carts and emergency trays.',
    lastReviewedDate: '2026-09-20',
    leadReviewer: 'Emergency & Trauma'
  },
  {
    id: 'fsm-18',
    inn: 'Lidocaine Hydrochloride',
    strengthForm: '1% & 2% (20ml vial); 2% Jelly (30g tube)',
    therapeuticCategory: 'Emergency & Resuscitation',
    subCategory: 'Local Anesthetic / Class Ib Antiarrhythmic',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 1,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Local infiltration anesthesia for minor surgical procedures, suturing; ventricular tachycardia.',
    rationale: 'Indispensable local anesthetic for minor surgical theatre, OPD, and emergency suturing.',
    lastReviewedDate: '2026-09-20',
    leadReviewer: 'Anesthesia Department'
  },
  {
    id: 'fsm-19',
    inn: 'Atropine Sulfate',
    strengthForm: '1mg / 1ml Injection',
    therapeuticCategory: 'Emergency & Resuscitation',
    subCategory: 'Anticholinergic / Antimuscarinic',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 1,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Antidote for organophosphate and carbamate insecticide poisonings, symptomatic sinus bradycardia.',
    rationale: 'Critical toxicology antidote with high incidence in Ethiopian emergency departments.',
    lastReviewedDate: '2026-09-20',
    leadReviewer: 'Clinical Toxicology Unit'
  },

  // 6. Gastrointestinal Medicines
  {
    id: 'fsm-20',
    inn: 'Omeprazole',
    strengthForm: '20mg Capsule; 40mg IV Powder for Injection',
    therapeuticCategory: 'Gastrointestinal',
    subCategory: 'Proton Pump Inhibitor (PPI)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 60,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Peptic ulcer disease, GERD, Zollinger-Ellison syndrome, acute upper GI bleeding (IV formulation).',
    rationale: 'Core acid-suppressive agent; IV restricted to confirmed upper GI hemorrhage.',
    lastReviewedDate: '2026-08-30',
    leadReviewer: 'Gastroenterology Unit'
  },
  {
    id: 'fsm-21',
    inn: 'Oral Rehydration Salts (ORS) + Zinc',
    strengthForm: '20.5g Powder Sachet + 20mg Dispersible Zinc Tablet',
    therapeuticCategory: 'Gastrointestinal',
    subCategory: 'Oral Electrolyte Replacement',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 14,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Acute watery diarrhea, dehydration from cholera or gastroenteritis, child survival diarrhea protocol.',
    rationale: 'WHO/UNICEF formulated low-osmolarity solution reducing mortality and stool volume in childhood diarrhea.',
    lastReviewedDate: '2026-08-30',
    leadReviewer: 'Pediatrics Department'
  },

  // 7. Central Nervous System & Psychiatry
  {
    id: 'fsm-22',
    inn: 'Diazepam',
    strengthForm: '5mg Tablet; 10mg/2ml Injection',
    therapeuticCategory: 'Central Nervous System',
    subCategory: 'Benzodiazepine',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 7,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Status epilepticus, acute muscle spasms, acute alcohol withdrawal, severe panic/anxiety crisis.',
    rationale: 'Controlled substance (Class II narcotic); tracked on special prescription voucher.',
    lastReviewedDate: '2026-09-05',
    leadReviewer: 'Psychiatry & Neurology'
  },
  {
    id: 'fsm-23',
    inn: 'Amitriptyline Hydrochloride',
    strengthForm: '25mg Tablet',
    therapeuticCategory: 'Central Nervous System',
    subCategory: 'Tricyclic Antidepressant (TCA)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 60,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Major depressive disorder, neuropathic pain (diabetic peripheral neuropathy), chronic tension headache.',
    rationale: 'Dual indication for depression and neuropathic pain in primary and specialized care.',
    lastReviewedDate: '2026-09-05',
    leadReviewer: 'Psychiatry & Neurology'
  },
  {
    id: 'fsm-24',
    inn: 'Haloperidol',
    strengthForm: '5mg Tablet; 5mg/ml Injection; 50mg/ml Decanoate Depot',
    therapeuticCategory: 'Central Nervous System',
    subCategory: 'Typical Antipsychotic (Butyrophenone)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 60,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Acute psychosis, schizophrenia, severe behavioral agitation, Tourette syndrome.',
    rationale: 'High potency antipsychotic; monitor for extrapyramidal symptoms and co-prescribe trihexyphenidyl if needed.',
    lastReviewedDate: '2026-09-05',
    leadReviewer: 'Psychiatry & Neurology'
  },

  // 8. Respiratory Medicines
  {
    id: 'fsm-25',
    inn: 'Salbutamol (Albuterol)',
    strengthForm: '100mcg/puff MDI; 2mg & 4mg Tablet; 5mg/ml Nebulizer Solution',
    therapeuticCategory: 'Respiratory',
    subCategory: 'Short-Acting Beta-2 Agonist (SABA)',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 30,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Acute asthma exacerbation, exercise-induced bronchospasm, reversible airway obstruction in COPD.',
    rationale: 'Universal rapid bronchodilator indispensable in outpatient and emergency rooms.',
    lastReviewedDate: '2026-08-15',
    leadReviewer: 'Pulmonology Department'
  },
  {
    id: 'fsm-26',
    inn: 'Beclomethasone Dipropionate',
    strengthForm: '100mcg & 250mcg / puff Metered Dose Inhaler',
    therapeuticCategory: 'Respiratory',
    subCategory: 'Inhaled Corticosteroid (ICS)',
    levelOfUse: 'General',
    prescriberLevel: 'General Medical Practitioner',
    venCategory: 'E',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 90,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Maintenance controller therapy for persistent asthma in adults and children.',
    rationale: 'Anti-inflammatory controller preventing asthma hospitalizations and mortality.',
    lastReviewedDate: '2026-08-15',
    leadReviewer: 'Pulmonology Department'
  },

  // 9. Oncology & Specialized Immunomodulators
  {
    id: 'fsm-27',
    inn: 'Trastuzumab',
    strengthForm: '440mg Powder for Concentrate for Infusion',
    therapeuticCategory: 'Oncology',
    subCategory: 'Monoclonal Antibody (HER2 Receptor Antagonist)',
    levelOfUse: 'Specialized',
    prescriberLevel: 'Sub-Specialist / Oncologist',
    venCategory: 'V',
    nemlStatus: 'Complementary',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 21,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'HER2-overexpressing early or metastatic breast cancer, HER2+ metastatic gastric adenocarcinoma.',
    rationale: 'Requires echocardiogram LVEF baseline before every cycle; restricted to Oncology Center.',
    lastReviewedDate: '2026-10-10',
    leadReviewer: 'Oncology Board'
  },
  {
    id: 'fsm-28',
    inn: 'Cisplatin',
    strengthForm: '50mg / 50ml Injection',
    therapeuticCategory: 'Oncology',
    subCategory: 'Platinum-Based Alkylating-Like Agent',
    levelOfUse: 'Specialized',
    prescriberLevel: 'Sub-Specialist / Oncologist',
    venCategory: 'V',
    nemlStatus: 'Core NEML',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 21,
    dtcApprovalStatus: 'Approved',
    stgIndication: 'Testicular cancer, ovarian cancer, cervical cancer, head and neck carcinoma, small cell lung cancer.',
    rationale: 'High emetogenic risk and nephrotoxic; mandatory vigorous pre/post hydration protocol.',
    lastReviewedDate: '2026-10-10',
    leadReviewer: 'Oncology Board'
  },

  // 10. Delisted / Non-Essential Candidates under DTC Review
  {
    id: 'fsm-29',
    inn: 'Human Albumin Solution 20%',
    strengthForm: '20% (100ml) IV Infusion',
    therapeuticCategory: 'Blood Derivative',
    subCategory: 'Colloid Solution',
    levelOfUse: 'Specialized',
    prescriberLevel: 'Specialist / Senior Consultant',
    venCategory: 'N',
    nemlStatus: 'Complementary',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 3,
    dtcApprovalStatus: 'Restricted',
    stgIndication: 'Restricted strictly to: large volume paracentesis (>5L removal) and Hepatorenal Syndrome type 1.',
    rationale: 'DTC Alert: High expenditure ($1,750 ETB/vial) with high off-label usage in hypoalbuminemic ward patients.',
    lastReviewedDate: '2026-10-25',
    leadReviewer: 'DTC Executive Committee'
  },
  {
    id: 'fsm-30',
    inn: 'Promethazine + Dextromethorphan Cough Syrup',
    strengthForm: '100ml Bottle',
    therapeuticCategory: 'Respiratory',
    subCategory: 'Antitussive / Antihistamine Liquid',
    levelOfUse: 'Primary',
    prescriberLevel: 'Health Officer / Druggist',
    venCategory: 'N',
    nemlStatus: 'Facility Specific Exception',
    efdaRegistrationStatus: 'Registered',
    maxPrescriptionDays: 5,
    dtcApprovalStatus: 'Under Review',
    stgIndication: 'Temporary relief of acute dry cough associated with common cold.',
    rationale: 'DTC Recommendation: DELIST from hospital purchase. Replace with warm honey-lemon or hydration; high abuse potential.',
    lastReviewedDate: '2026-10-25',
    leadReviewer: 'DTC Executive Committee'
  }
];
