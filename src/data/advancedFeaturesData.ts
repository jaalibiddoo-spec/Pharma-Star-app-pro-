import { 
  BarcodeScanResult, 
  AudioClinicalPearl, 
  EPSSRegionalHub, 
  PaymentWebhookEvent,
  GeminiVoiceAgentConfig,
  PharmaTubeVideo,
  SlideDeck
} from '../types';

export const sampleBarcodeDatabase: BarcodeScanResult[] = [
  {
    id: "bc-efda-rec-001",
    rawCode: "(01)08901023490123(17)280228(10)PAR-ET-2025-419(21)SN89210492",
    format: "GS1_DATAMATRIX",
    gtin: "08901023490123",
    batchNumber: "PAR-ET-2025-419",
    expiryDate: "2028-02-28",
    serialNumber: "SN89210492",
    drugName: "Paracetamol IV Infusion",
    strength: "1000 mg / 100 mL",
    dosageForm: "Intravenous Infusion Bottle",
    manufacturer: "Global Parenterals Ltd",
    countryOfOrigin: "India",
    importerInEthiopia: "Ethio-Pharma Wholesalers PLC",
    efdaRegistrationNumber: "EFDA-MED-REG-2021-9981",
    safetyStatus: "recalled_batch",
    verificationTimestamp: "2026-10-29T06:20:00Z",
    verifiedBy: "EFDA Post-Marketing Surveillance Alert Engine",
    recallAlertDetails: {
      recallCode: "EFDA/ALERT/2026/08",
      reason: "CRITICAL RECALL: Subpotent active pharmaceutical ingredient (assay < 82% of declared content). Failed pharmacopeial dissolution testing.",
      directiveAction: "DO NOT DISPENSE. Immediately quarantine in facility store and return to supplier or EPSS with official Form Q-1."
    },
    storageConditions: "Store below 30°C. Protect from direct freezing and light.",
    indications: "Mild to moderate pain, acute fever reduction in hospital inpatients."
  },
  {
    id: "bc-safe-002",
    rawCode: "(01)06001234567890(17)271130(10)EPH-2026-881(21)ET9928104",
    format: "GS1_DATAMATRIX",
    gtin: "06001234567890",
    batchNumber: "EPH-2026-881",
    expiryDate: "2027-11-30",
    serialNumber: "ET9928104",
    drugName: "Amoxicillin + Clavulanic Acid (Augmentin)",
    strength: "625 mg (500/125 mg)",
    dosageForm: "Film-Coated Tablet",
    manufacturer: "Ethiopian Pharmaceuticals Manufacturing Sh.Co. (EPHARM)",
    countryOfOrigin: "Ethiopia",
    importerInEthiopia: "Domestic Manufacturer (Addis Ababa, Ethiopia)",
    efdaRegistrationNumber: "EFDA-MED-GMP-2024-0012",
    safetyStatus: "authentic_safe",
    verificationTimestamp: "2026-10-29T06:21:00Z",
    verifiedBy: "Pharmacist Dawid Aliyi, BCPS (Pharma Star Verified)",
    storageConditions: "Store below 25°C in a dry place. Protect from moisture.",
    indications: "Lower respiratory tract infections, severe otitis media, skin and soft tissue infections, dental abscesses."
  },
  {
    id: "bc-safe-003",
    rawCode: "(01)08902034901928(17)270915(10)CAD-ET-7719(21)SN4490123",
    format: "GS1_DATAMATRIX",
    gtin: "08902034901928",
    batchNumber: "CAD-ET-7719",
    expiryDate: "2027-09-15",
    serialNumber: "SN4490123",
    drugName: "Ceftriaxone Sodium for Injection",
    strength: "1 g",
    dosageForm: "Dry Powder for Reconstitution (Vial)",
    manufacturer: "Cadila Pharmaceuticals Ltd",
    countryOfOrigin: "India",
    importerInEthiopia: "Cadila Pharmaceuticals (Ethiopia) PLC",
    efdaRegistrationNumber: "EFDA-MED-REG-2023-4412",
    safetyStatus: "authentic_safe",
    verificationTimestamp: "2026-10-29T06:22:00Z",
    verifiedBy: "Pharmacist Dawid Aliyi, BCPS",
    storageConditions: "Store powder below 25°C. After reconstitution with sterile water, stable for 24h at 2-8°C.",
    indications: "Bacterial meningitis, severe sepsis, pyelonephritis, gonorrhea (single dose per MoH STG)."
  },
  {
    id: "bc-warn-004",
    rawCode: "0793573189201",
    format: "EAN_13",
    gtin: "0793573189201",
    batchNumber: "UNREG-FAKE-2025",
    expiryDate: "2026-04-10",
    drugName: "Suspected Counterfeit Artemether + Lumefantrine",
    strength: "20/120 mg",
    dosageForm: "Tablet",
    manufacturer: "Unverified / Unknown Shadow Manufacturer",
    countryOfOrigin: "Unknown Origin",
    importerInEthiopia: "Unregistered Parallel Smuggled Channel",
    efdaRegistrationNumber: "NOT_FOUND_IN_EFDA_DATABASE",
    safetyStatus: "unregistered_warning",
    verificationTimestamp: "2026-10-29T06:23:00Z",
    verifiedBy: "Pharma Star Anti-Counterfeit Detector",
    recallAlertDetails: {
      recallCode: "EFDA/FRAUD/2026/02",
      reason: "UNREGISTERED PRODUCT: Barcode not registered with EFDA national database. Missing holographic security label and QR seal.",
      directiveAction: "ALERT DISPENSARY HEAD IMMEDIATELY. Report seizure to EFDA Inspectorate Hot Line 8482."
    },
    storageConditions: "Unknown.",
    indications: "Unverified antimalarial claims."
  }
];

export const sampleAudioClinicalPearls: AudioClinicalPearl[] = [
  {
    id: "audio-am-001",
    title: "Renal Dosing in Chronic Kidney Disease (CKD)",
    titleLocal: "የኩላሊት ድካም እና የመድኃኒት መጠን ማስተካከያ (Renal Dosing in CKD)",
    conceptTopic: "eGFR-Based Dose Titration & Nephrotoxicity",
    category: "Renal & Hepatic",
    durationSeconds: 154,
    durationFormatted: "2:34 min",
    language: "am",
    speakerName: "ክሊኒካል ፋርማሲስት ዳዊት አሊዪ (Dawid Aliyi)",
    speakerTitle: "Senior Clinical Pharmacist, BCPS",
    clinicalSignificance: "በኢትዮጵያ ሆስፒታሎች ውስጥ ከ30% በላይ የታካሚዎች የኩላሊት ጉዳት የሚከሰተው ባልተስተካከለ የመድኃኒት መጠን ምክንያት ነው።",
    guidelineReference: "Ethiopian MoH National Standard Treatment Guidelines (2026) & KDIGO",
    voiceSynthesisText: `ሰላም ጤና ይስጥልኝ! ክሊኒካል ፋርማሲስት ዳዊት አሊዪ ነኝ። ዛሬ በዋርድ ዙር የምንመለከተው የኩላሊት ድካም ያለባቸው ታካሚዎች የመድኃኒት አወሳሰድ ደንብ ነው።
በመጀመሪያ የታካሚው eGFR ከ30 ሚሊሊትር በደቂቃ በታች ሲወርድ፡ ሜትፎርሚን (Metformin) በፍጹም መሰጠት የለበትም። ይህ በሰውነት ውስጥ ላክቲክ አሲዶሲስ የተባለ ገዳይ መመረዝ ሊያስከትል ይችላል።
ሁለተኛ፡ ኤንሳኤ አይ ዲ (NSAIDs) እንደ ዲክሎፌናክ ወይም አይቡፕሮፌን ኩላሊት ላይ የሚደርሰውን የደም ፍሰት ስለሚገድቡ በኩላሊት ድካም ህመምተኞች ላይ ሙሉ በሙሉ የተከለከሉ ናቸው።
ሶስተኛ፡ አንቲባዮቲክስ እንደ ሲፕሮፍሎክሳሲን ወይም ቫንኮማይሲን ስናዝ የታካሚውን የሴረም ክሬአቲኒን መጠን በማየት መጠኑን በግማሽ መቀነስ ወይም የመስጫ ሰዓቱን ማራዘም አለብን።
ያስታውሱ፡ የተስተካከለ የመድኃኒት መጠን የህመምተኛውን ኩላሊት ይታደጋል! እናመሰግናለን።`,
    audioTranscript: `ሰላም ጤና ይስጥልኝ! ክሊኒካል ፋርማሲስት ዳዊት አሊዪ ነኝ። ዛሬ በዋርድ ዙር የምንመለከተው የኩላሊት ድካም ያለባቸው ታካሚዎች የመድኃኒት አወሳሰድ ደንብ ነው።

1. eGFR < 30 mL/min ሲሆን፡ ሜትፎርሚን (Metformin) በፍጹም አይሰጥም (Fatal Lactic Acidosis risk)። በምትኩ ሊናግሊፕቲን (Linagliptin 5mg) ይጠቀሙ።
2. NSAIDs (Diclofenac, Ibuprofen) የኩላሊት የደም ስር (Afferent arteriole) በማጥበብ ተጨማሪ ጉዳት ስለሚያስከትሉ የተከለከሉ ናቸው።
3. Ciprofloxacin, Cefepime እና Aminoglycosides መጠናቸው በክሊራንስ መሠረት መቀነስ አለበት።`,
    keyTakeaways: [
      "Metformin is contraindicated when eGFR < 30 mL/min due to fatal lactic acidosis risk.",
      "Avoid all NSAIDs in CKD stages 3-5; use Paracetamol or low-dose opioids.",
      "Check baseline Serum Creatinine and calculate CrCl before initiating renally eliminated antibiotics."
    ]
  },
  {
    id: "audio-om-002",
    title: "Asthma vs Beta-Blocker Contraindication",
    titleLocal: "Wal-faallessaa Qorichoota Asmii fi Beta-blocker (Asthma Contraindication)",
    conceptTopic: "Bronchospasm Risk with Non-Selective Beta-Blockers",
    category: "Respiratory & Asthma",
    durationSeconds: 142,
    durationFormatted: "2:22 min",
    language: "om",
    speakerName: "Faarmaasistii Dawaad Aliyyii (Dawid Aliyi)",
    speakerTitle: "Senior Clinical Pharmacist, BCPS",
    clinicalSignificance: "Dhukkubsataa asmii qabuuf Propranolol kennuun sirna hafuuraa cufuun balaa lubbuu fiduu danda'a.",
    guidelineReference: "GINA Asthma Guidelines & Ethiopian National Formulary",
    voiceSynthesisText: `Akkam jirtu! Ani Ogeessa Faarmaasii Yaalii Dawaad Aliyyiiti. Har'a qabxii murteessaa waa'ee qorichoota Asmii fi Beta-blocker ilaalla.
Dhukkubsataa asmii ykn dhibee sombaa qabu kamiifiyyuu qoricha non-selective beta-blocker kan akka Propranolol gonkumaa kennuu hin qabnu!
Kunis sababni isaa, Propranolol qabannoo beta-2 somba keessaa waan cufuuf ujummoo qilleensaa kosiin dhiphisa (severe bronchospasm). Kunis qoricha asmiitiin hin banamu.
Kanaafuu, dhibee onneetiif yoo barbaachise, qorichoota cardioselective ta'an kan akka Bisoprolol ykn Metoprolol qofa of-eeggannoon fayyadamuun barbaachisaadha.
Hubadhaa: Seenaa dhukkubsataa sirriitti qorachuun lubbuu baraara! Galatoomaa.`,
    audioTranscript: `Akkam jirtu! Ani Ogeessa Faarmaasii Yaalii Dawaad Aliyyiiti. Har'a qabxii murteessaa waa'ee qorichoota Asmii fi Beta-blocker ilaalla.

1. Propranolol dhukkubsataa asmii qabuuf gonkumaa dhorkaa dha (Contraindicated).
2. Qorichi kun ujummoo sombaa keessatti beta-2 cufuun hafuura baafannaa dhorkee balaa cimaa uuma.
3. Yoo dirqama ta'e, qorichoota cardioselective beta-1 qofa irratti hojjetan (Bisoprolol/Atenolol) faayidaarra oolchuun dirqama.`,
    keyTakeaways: [
      "Non-selective beta-blockers (Propranolol, Timolol eye drops) provoke catastrophic bronchospasm in asthma.",
      "Always verify respiratory medical history before prescribing rate-control agents.",
      "Cardioselective beta-blockers (Bisoprolol) are preferred if cardiovascular therapy is mandatory."
    ]
  },
  {
    id: "audio-am-003",
    title: "Vancomycin TDM & AUC24/MIC Monitoring in ICU",
    titleLocal: "የቫንኮማይሲን TDM እና የኩላሊት ደህንነት ክትትል በፅኑ ህሙማን ክፍል (ICU)",
    conceptTopic: "Therapeutic Drug Monitoring (TDM) & Nephrotoxicity",
    category: "Antimicrobial Stewardship",
    durationSeconds: 165,
    durationFormatted: "2:45 min",
    language: "am",
    speakerName: "ክሊኒካል ፋርማሲስት ዳዊት አሊዪ (Dawid Aliyi)",
    speakerTitle: "Senior Clinical Pharmacist, BCPS",
    clinicalSignificance: "ቫንኮማይሲን በኢትዮጵያ ICU ውስጥ ለMRSA ህክምና ወሳኝ ሲሆን፣ ትክክለኛ የላብራቶሪ ክትትል ካልተደረገበት የኩላሊት መቆም (AKI) ያስከትላል።",
    guidelineReference: "IDSA / ASHP Consensus Guidelines & Ethiopian ASP Protocols",
    voiceSynthesisText: `ክሊኒካል ፋርማሲስት ዳዊት አሊዪ ነኝ። ዛሬ በፅኑ ህሙማን ክፍል (ICU) የቫንኮማይሲን መድሃኒት ቁጥጥር እና የደም ትኩረት ክትትልን እንመለከታለን።
ቫንኮማይሲን ጠባብ የህክምና ወሰን (Narrow Therapeutic Index) ያለው መድሃኒት ነው።
የመጀመሪያውን ዶዝ ከሰጠን በኋላ በአራተኛው ዶዝ ላይ ከመርፌው 30 ደቂቃ በፊት የደም ናሙና (Trough level) መወሰድ አለበት።
ተፈላጊው የደም ክምችት መጠን ከ15 እስከ 20 ማይክሮግራም በደቂቃ መሆን አለበት። መጠኑ ከ20 በላይ ከሆነ የኩላሊት ሴሎችን በማቃጠል ጉዳት ያደርሳል።
እንዲሁም ቫንኮማይሲን በሚሰጥበት ወቅት ቢያንስ በአንድ ሰዓት ውስጥ ቀስ ተብሎ መዝነብ አለበት፤ በፍጥነት ከተሰጠ ሬድ ማን ሲንድረም የተባለ የሰውነት መቅላት እና የደም ግፊት መውደቅ ያስከትላል።`,
    audioTranscript: `ክሊኒካል ፋርማሲስት ዳዊት አሊዪ ነኝ። በICU ውስጥ የቫንኮማይሲን ክትትል ዋና ዋና ነጥቦች፡

1. Trough Sampling: በአራተኛው ዶዝ ላይ ልክ ከመሰጠቱ 30 ደቂቃ በፊት ይወሰዳል።
2. Target Trough: ለከባድ ኢንፌክሽኖች (Sepsis, MRSA pneumonia) 15 - 20 mcg/mL ነው።
3. Infusion Rate: በሰዓት ከ1 ግራም በላይ በፍጥነት አይሰጥም (Red Man Syndrome መከላከያ)።`,
    keyTakeaways: [
      "Sample steady-state trough 30 minutes prior to the 4th dose.",
      "Maintain target AUC24/MIC between 400-600 (or trough 15-20 mcg/mL for severe MRSA).",
      "Infuse over at least 60 minutes to prevent histaminergic Red Man Syndrome."
    ]
  },
  {
    id: "audio-om-004",
    title: "Ceftriaxone & Calcium Precipitation Prevention in Pediatrics",
    titleLocal: "Qoricha Ceftriaxone fi Kaalsiyemii Walitti Laaquu Dhiisuu (Ceftriaxone + Calcium Danger)",
    conceptTopic: "Fatal Intravascular Crystallization in Children",
    category: "Pediatrics",
    durationSeconds: 138,
    durationFormatted: "2:18 min",
    language: "om",
    speakerName: "Faarmaasistii Dawaad Aliyyii (Dawid Aliyi)",
    speakerTitle: "Senior Clinical Pharmacist, BCPS",
    clinicalSignificance: "Ceftriaxone fi Calcium walitti kennamuun daa'imman irratti dhangala'aa sombaa fi kalee keessatti ciroofachuu (crystalline emboli) fiduun lubbuu dabarsa.",
    guidelineReference: "WHO Pediatric Treatment Guidelines & EFDA Safety Warning",
    voiceSynthesisText: `Ogeessa Faarmaasii Yaalii Dawaad Aliyyiiti. Qabxii dhimma daa'immaniif baay'ee murteessaa ta'e tokko mee wal-barsiifna.
Yeroo baay'ee kutaa yaalii daa'immanii keessatti qorichi Ceftriaxone fi Calcium Gluconate wal-bira qabamee ajajama.
Garuu hubadhaa! Ceftriaxone fi Kaalsiyemiin yoo ujummoo tokkoon walitti makaman, dhangala'oo hin baqne (insoluble calcium-ceftriaxone precipitate) uumuun ujummoo sombaa fi kalee daa'immanii cufuun battalumatti lubbuu dabarsu danda'u.
Kanaafuu: Daa'imman reefu dhalatan irratti gonkumaa wal-bira hin kennamu. Daa'imman gurguddoo irratti immoo, ujummoo dhiigaa gargariin ykn yoo xiqqaate sa'aatii 48 gargar fageessuun qofa kennamuu qaba.
Yoo dirqama ta'e, Ceftriaxone bakka Cefotaxime fayyadamuun balaa kana guutummaatti ittisa. Fayyaa ta'aa!`,
    audioTranscript: `Qoricha Ceftriaxone fi Kaalsiyemii Walitti Laaquu Dhiisuu:

1. Ceftriaxone fi Calcium walitti makamuun dhagaa sombaa fi kalee (precipitate) uuma.
2. Daa'imman daa'immanii (neonates) irratti gonkumaa wal-faana hin kennamu!
3. Yoo dirqama ta'e, bakka Ceftriaxone qoricha Cefotaxime 1g q8h fayyadamaa.`,
    keyTakeaways: [
      "Never co-infuse Ceftriaxone and IV Calcium solutions simultaneously in pediatric patients.",
      "Precipitates form insoluble crystals in pulmonary and renal vasculature with fatal outcomes.",
      "Use Cefotaxime as a safe third-generation cephalosporin alternative with zero calcium binding risk."
    ]
  }
];

export const sampleEPSSRegionalHubs: EPSSRegionalHub[] = [
  {
    id: "epss-addis-central",
    hubName: "Addis Ababa Central EPSS Hub (Kaliti)",
    hubCode: "EPSS-HUB-01",
    region: "Addis Ababa City Administration",
    city: "Addis Ababa",
    latitude: 8.8980,
    longitude: 38.7610,
    mapX: 50,
    mapY: 48,
    leadCoordinator: "Pharmacist Dawid Aliyi / Director Alemayehu",
    contactPhone: "+251 982 852 778",
    contactEmail: "addis.hub@epss.gov.et",
    servicedFacilitiesCount: 148,
    overallSupplyIndexPercent: 91.4,
    emergencyTransferActive: true,
    lastSyncTimestamp: "2026-10-29T06:15:00Z",
    tracerStock: [
      { drugName: "Artemether + Lumefantrine (Coartem)", strength: "20/120 mg", dosageForm: "Tablet", quantityAvailable: 340000, unit: "Packs", monthsOfStock: 4.2, status: "adequate", leadTimeDays: 2 },
      { drugName: "Ceftriaxone Sodium", strength: "1 g", dosageForm: "Vial", quantityAvailable: 185000, unit: "Vials", monthsOfStock: 3.8, status: "adequate", leadTimeDays: 2 },
      { drugName: "Oxytocin Injection", strength: "10 IU/1 mL", dosageForm: "Ampoule", quantityAvailable: 82000, unit: "Ampoules", monthsOfStock: 3.5, status: "adequate", leadTimeDays: 1 },
      { drugName: "Human Regular Insulin", strength: "100 IU/mL", dosageForm: "Vial", quantityAvailable: 28000, unit: "Vials", monthsOfStock: 2.1, status: "adequate", leadTimeDays: 2 },
      { drugName: "Amoxicillin Dispersible", strength: "250 mg", dosageForm: "DT", quantityAvailable: 450000, unit: "Tablets", monthsOfStock: 4.8, status: "adequate", leadTimeDays: 2 }
    ]
  },
  {
    id: "epss-adama",
    hubName: "Adama Regional EPSS Hub",
    hubCode: "EPSS-HUB-02",
    region: "Oromia Region",
    city: "Adama",
    latitude: 8.5400,
    longitude: 39.2700,
    mapX: 56,
    mapY: 52,
    leadCoordinator: "Mr. Tolossa Diba / Logistics Lead",
    contactPhone: "+251 922 789 012",
    contactEmail: "adama.hub@epss.gov.et",
    servicedFacilitiesCount: 112,
    overallSupplyIndexPercent: 84.2,
    emergencyTransferActive: true,
    lastSyncTimestamp: "2026-10-29T06:10:00Z",
    tracerStock: [
      { drugName: "Artemether + Lumefantrine (Coartem)", strength: "20/120 mg", dosageForm: "Tablet", quantityAvailable: 195000, unit: "Packs", monthsOfStock: 3.2, status: "adequate", leadTimeDays: 3 },
      { drugName: "Ceftriaxone Sodium", strength: "1 g", dosageForm: "Vial", quantityAvailable: 62000, unit: "Vials", monthsOfStock: 2.4, status: "adequate", leadTimeDays: 3 },
      { drugName: "Oxytocin Injection", strength: "10 IU/1 mL", dosageForm: "Ampoule", quantityAvailable: 14000, unit: "Ampoules", monthsOfStock: 1.1, status: "low_stock", leadTimeDays: 2 },
      { drugName: "Human Regular Insulin", strength: "100 IU/mL", dosageForm: "Vial", quantityAvailable: 4200, unit: "Vials", monthsOfStock: 0.8, status: "critical_stockout", leadTimeDays: 2 }
    ]
  },
  {
    id: "epss-hawassa",
    hubName: "Hawassa Regional EPSS Hub",
    hubCode: "EPSS-HUB-03",
    region: "Sidama Region",
    city: "Hawassa",
    latitude: 7.0500,
    longitude: 38.4700,
    mapX: 48,
    mapY: 65,
    leadCoordinator: "Sister Aster / Supply Director",
    contactPhone: "+251 933 456 789",
    contactEmail: "hawassa.hub@epss.gov.et",
    servicedFacilitiesCount: 96,
    overallSupplyIndexPercent: 88.5,
    emergencyTransferActive: false,
    lastSyncTimestamp: "2026-10-29T06:00:00Z",
    tracerStock: [
      { drugName: "Artemether + Lumefantrine (Coartem)", strength: "20/120 mg", dosageForm: "Tablet", quantityAvailable: 220000, unit: "Packs", monthsOfStock: 4.1, status: "adequate", leadTimeDays: 3 },
      { drugName: "Ceftriaxone Sodium", strength: "1 g", dosageForm: "Vial", quantityAvailable: 78000, unit: "Vials", monthsOfStock: 3.1, status: "adequate", leadTimeDays: 3 },
      { drugName: "Oxytocin Injection", strength: "10 IU/1 mL", dosageForm: "Ampoule", quantityAvailable: 31000, unit: "Ampoules", monthsOfStock: 2.8, status: "adequate", leadTimeDays: 2 }
    ]
  },
  {
    id: "epss-jimma",
    hubName: "Jimma Regional EPSS Hub",
    hubCode: "EPSS-HUB-04",
    region: "Oromia Region",
    city: "Jimma",
    latitude: 7.6700,
    longitude: 36.8300,
    mapX: 36,
    mapY: 60,
    leadCoordinator: "Mr. Gemechu Chala",
    contactPhone: "+251 917 223 344",
    contactEmail: "jimma.hub@epss.gov.et",
    servicedFacilitiesCount: 88,
    overallSupplyIndexPercent: 79.8,
    emergencyTransferActive: true,
    lastSyncTimestamp: "2026-10-29T05:50:00Z",
    tracerStock: [
      { drugName: "Artemether + Lumefantrine (Coartem)", strength: "20/120 mg", dosageForm: "Tablet", quantityAvailable: 140000, unit: "Packs", monthsOfStock: 2.6, status: "adequate", leadTimeDays: 4 },
      { drugName: "Ceftriaxone Sodium", strength: "1 g", dosageForm: "Vial", quantityAvailable: 38000, unit: "Vials", monthsOfStock: 1.3, status: "low_stock", leadTimeDays: 3 }
    ]
  },
  {
    id: "epss-bahirdar",
    hubName: "Bahir Dar Regional EPSS Hub",
    hubCode: "EPSS-HUB-05",
    region: "Amhara Region",
    city: "Bahir Dar",
    latitude: 11.5900,
    longitude: 37.3900,
    mapX: 42,
    mapY: 30,
    leadCoordinator: "Dr. Getachew Alemu",
    contactPhone: "+251 918 334 455",
    contactEmail: "bahirdar.hub@epss.gov.et",
    servicedFacilitiesCount: 104,
    overallSupplyIndexPercent: 86.1,
    emergencyTransferActive: false,
    lastSyncTimestamp: "2026-10-29T05:45:00Z",
    tracerStock: [
      { drugName: "Ceftriaxone Sodium", strength: "1 g", dosageForm: "Vial", quantityAvailable: 95000, unit: "Vials", monthsOfStock: 3.4, status: "adequate", leadTimeDays: 3 },
      { drugName: "Human Regular Insulin", strength: "100 IU/mL", dosageForm: "Vial", quantityAvailable: 12000, unit: "Vials", monthsOfStock: 2.4, status: "adequate", leadTimeDays: 3 }
    ]
  },
  {
    id: "epss-gondar",
    hubName: "Gondar Regional EPSS Hub",
    hubCode: "EPSS-HUB-06",
    region: "Amhara Region",
    city: "Gondar",
    latitude: 12.6000,
    longitude: 37.4600,
    mapX: 41,
    mapY: 22,
    leadCoordinator: "Mr. Fikadu Tadesse",
    contactPhone: "+251 918 445 566",
    contactEmail: "gondar.hub@epss.gov.et",
    servicedFacilitiesCount: 82,
    overallSupplyIndexPercent: 82.0,
    emergencyTransferActive: false,
    lastSyncTimestamp: "2026-10-29T05:30:00Z",
    tracerStock: [
      { drugName: "Artemether + Lumefantrine", strength: "20/120 mg", dosageForm: "Tablet", quantityAvailable: 110000, unit: "Packs", monthsOfStock: 2.8, status: "adequate", leadTimeDays: 4 }
    ]
  },
  {
    id: "epss-mekelle",
    hubName: "Mekelle Regional EPSS Hub",
    hubCode: "EPSS-HUB-07",
    region: "Tigray Region",
    city: "Mekelle",
    latitude: 13.4900,
    longitude: 39.4700,
    mapX: 52,
    mapY: 15,
    leadCoordinator: "Mr. Berhane Gebre",
    contactPhone: "+251 914 556 677",
    contactEmail: "mekelle.hub@epss.gov.et",
    servicedFacilitiesCount: 94,
    overallSupplyIndexPercent: 78.4,
    emergencyTransferActive: true,
    lastSyncTimestamp: "2026-10-29T05:15:00Z",
    tracerStock: [
      { drugName: "Oxytocin Injection", strength: "10 IU/1 mL", dosageForm: "Ampoule", quantityAvailable: 9500, unit: "Ampoules", monthsOfStock: 0.9, status: "critical_stockout", leadTimeDays: 5 }
    ]
  },
  {
    id: "epss-diredawa",
    hubName: "Dire Dawa Regional EPSS Hub",
    hubCode: "EPSS-HUB-08",
    region: "Dire Dawa Administration",
    city: "Dire Dawa",
    latitude: 9.6000,
    longitude: 41.8600,
    mapX: 74,
    mapY: 44,
    leadCoordinator: "Mr. Mohammed Ahmed",
    contactPhone: "+251 925 667 788",
    contactEmail: "diredawa.hub@epss.gov.et",
    servicedFacilitiesCount: 76,
    overallSupplyIndexPercent: 89.2,
    emergencyTransferActive: false,
    lastSyncTimestamp: "2026-10-29T05:20:00Z",
    tracerStock: [
      { drugName: "Artemether + Lumefantrine", strength: "20/120 mg", dosageForm: "Tablet", quantityAvailable: 180000, unit: "Packs", monthsOfStock: 3.9, status: "adequate", leadTimeDays: 3 }
    ]
  },
  {
    id: "epss-nekemte",
    hubName: "Nekemte Regional EPSS Hub",
    hubCode: "EPSS-HUB-09",
    region: "Oromia Region",
    city: "Nekemte",
    latitude: 9.0800,
    longitude: 36.5500,
    mapX: 33,
    mapY: 47,
    leadCoordinator: "Mr. Daba Gudeta",
    contactPhone: "+251 917 778 899",
    contactEmail: "nekemte.hub@epss.gov.et",
    servicedFacilitiesCount: 68,
    overallSupplyIndexPercent: 81.5,
    emergencyTransferActive: false,
    lastSyncTimestamp: "2026-10-29T05:00:00Z",
    tracerStock: [
      { drugName: "Ceftriaxone Sodium", strength: "1 g", dosageForm: "Vial", quantityAvailable: 42000, unit: "Vials", monthsOfStock: 2.1, status: "adequate", leadTimeDays: 4 }
    ]
  },
  {
    id: "epss-shashemene",
    hubName: "Shashemene Regional EPSS Hub",
    hubCode: "EPSS-HUB-10",
    region: "Oromia Region",
    city: "Shashemene",
    latitude: 7.2000,
    longitude: 38.6000,
    mapX: 50,
    mapY: 62,
    leadCoordinator: "Sister Rahel Abera",
    contactPhone: "+251 916 889 900",
    contactEmail: "shashemene.hub@epss.gov.et",
    servicedFacilitiesCount: 72,
    overallSupplyIndexPercent: 85.0,
    emergencyTransferActive: false,
    lastSyncTimestamp: "2026-10-29T05:10:00Z",
    tracerStock: [
      { drugName: "Oxytocin Injection", strength: "10 IU/1 mL", dosageForm: "Ampoule", quantityAvailable: 24000, unit: "Ampoules", monthsOfStock: 2.5, status: "adequate", leadTimeDays: 2 }
    ]
  }
];

export const sampleWebhookEvents: PaymentWebhookEvent[] = [
  {
    id: "evt-tb-2026-9901",
    gateway: "telebirr",
    eventType: "payment.success",
    transactionRef: "TB-8829104-DAWID",
    externalTransactionId: "TEL-20261029-992140",
    amountETB: 2000,
    customerPhoneOrEmail: "0982852778",
    customerName: "Tikur Anbessa Hospital Pharmacy",
    serviceType: "institution_annual",
    verifiedAt: "2026-10-29T06:05:00Z",
    signatureHmac: "hmac_sha256_9f8812cba04499120bc7",
    status: "verified_active"
  },
  {
    id: "evt-chapa-2026-8812",
    gateway: "chapa",
    eventType: "payment.success",
    transactionRef: "CHP-PUB-1000-JU",
    externalTransactionId: "CHP-TX-4481023",
    amountETB: 1000,
    customerPhoneOrEmail: "tolossa.diba@ahmc.edu.et",
    customerName: "Dr. Tolossa Diba (Adama Hospital)",
    serviceType: "research_publication",
    verifiedAt: "2026-10-29T05:45:00Z",
    signatureHmac: "chapa_sig_77201948ba1204899",
    status: "verified_active"
  }
];

export const geminiVoiceAgents: Record<'male' | 'female', GeminiVoiceAgentConfig> = {
  male: {
    gender: 'male',
    personaName: 'Dr. Dawid Aliyi / Dr. Abel Tesfaye',
    specialtyTitle: 'Senior Clinical Pharmacotherapist & Critical Care Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    pitch: 0.85,
    rate: 0.95,
    language: 'en',
    voiceStyle: 'Deep, authoritative, encouraging, baritone clinical cadence with bedside precision.',
    greetingMessage: 'Hello! I am Dr. Dawid Aliyi, your Clinical Pharmacy Supporter. What patient case, pharmacokinetic dilemma, or drug mechanism would you like to review together today?',
    sampleQuestions: [
      'How do I calculate Vancomycin AUC/MIC empiric loading dose in septic shock?',
      'Can you explain the clinical risk of Ceftriaxone in neonates with hyperbilirubinemia?',
      'What are the renal dose adjustments for Enoxaparin when CrCl is under 30 mL/min?',
      'How does the Ethiopian STG guide first-line treatment for Severe Community-Acquired Pneumonia?'
    ]
  },
  female: {
    gender: 'female',
    personaName: 'Dr. Aster Kebede / Dr. Bethlehem Haile',
    specialtyTitle: 'Professor of Pharmacotherapy & Infectious Disease Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813570-580795c643b7?w=200&auto=format&fit=crop&q=80',
    pitch: 1.25,
    rate: 0.98,
    language: 'en',
    voiceStyle: 'Warm, articulate, empathetic, clear clinical tone tailored for interactive consultations.',
    greetingMessage: 'Greetings! I am Dr. Aster Kebede, your Senior Pharmacotherapy Supporter. Feel free to ask me anything regarding prescription safety, maternal-fetal pharmacology, or antimicrobial stewardship.',
    sampleQuestions: [
      'Which antihypertensives are safest during third-trimester pregnancy and lactation?',
      'How do I manage a severe Warfarin and Ciprofloxacin INR spike clinically?',
      'What are the EFDA guidance parameters for switching IV to oral antibiotics?',
      'Could you explain the biochemical difference between Regular Insulin and Glargine 300U/mL?'
    ]
  }
};

export const samplePharmaTubeVideos: PharmaTubeVideo[] = [
  {
    id: "pt-study-01",
    title: "10 Hours Deep Focus Lofi Beats - Midnight Hospital Pharmacy Nightshift",
    youtubeId: "jfKfPfyJRdk", // Classic lofi study stream id
    category: "study_beats",
    channelTitle: "Lofi Clinical Beats",
    durationFormatted: "Live Stream / 10 Hours",
    description: "Relaxing ambient melodies and binaural study rhythms designed for pharmacy students exam cramming and hospital dispensary pharmacists on overnight shifts.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    tags: ["Lofi", "Study", "Relaxation", "Night Shift", "Focus Beats"]
  },
  {
    id: "pt-moa-01",
    title: "3D Animation: How Beta-Lactam Antibiotics Inhibit Bacterial Cell Wall Synthesis (PBP Binding)",
    youtubeId: "qBdYrsr8058", // 3D animation mechanism
    category: "pharmacology_3d",
    channelTitle: "Medical MoA Animations 3D",
    durationFormatted: "4:42 min",
    description: "Ultra high-definition molecular animation showing Penicillins and Cephalosporins irreversibly acylating transpeptidase enzymes and inducing bacterial autolysis.",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=80",
    tags: ["3D MoA", "Antibiotics", "Penicillin", "Pharmacology", "Cell Wall"]
  },
  {
    id: "pt-moa-02",
    title: "Insulin Receptor Signaling Cascade: Tyrosine Kinase, IRS-1 & GLUT-4 Translocation in 3D",
    youtubeId: "5jCxgYI0J_Y",
    category: "pharmacology_3d",
    channelTitle: "BioMolecular Visuals",
    durationFormatted: "6:15 min",
    description: "Full biochemical pathway breakdown of insulin receptor autophosphorylation and vesicular exocytosis of glucose transporter GLUT4 into the plasma membrane.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500&auto=format&fit=crop&q=80",
    tags: ["Insulin", "Biochemistry", "Diabetes", "GLUT4", "Tyrosine Kinase"]
  },
  {
    id: "pt-ethiopia-01",
    title: "Ethiopian Pharmaceuticals Supply Service (EPSS): The Backbone of Healthcare Logistics",
    youtubeId: "9No-FiEInLA",
    category: "ethiopian_health",
    channelTitle: "Ethiopian Health & Logistics Ministry",
    durationFormatted: "12:30 min",
    description: "Documentary detailing cold-chain storage, fleet routing across 19 regional hubs, and digital inventory replenishment supplying 3,000+ public clinics and hospitals.",
    thumbnailUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80",
    tags: ["EPSS", "Ethiopia", "Supply Chain", "MoH", "Public Health"]
  },
  {
    id: "pt-clinical-01",
    title: "Bedside ICU Ward Rounds: Managing Septic Shock, Inotropic Support & Antimicrobial Dosing",
    youtubeId: "rVFn4_2d_e8",
    category: "clinical_cases",
    channelTitle: "Clinical Pharmacist ICU Rounds",
    durationFormatted: "18:40 min",
    description: "Comprehensive step-by-step ICU pharmacotherapy breakdown by clinical specialists evaluating Norepinephrine titrations and fluid resuscitation.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80",
    tags: ["ICU", "Clinical Pharmacy", "Sepsis", "Norepinephrine", "Ward Rounds"]
  },
  {
    id: "pt-ted-01",
    title: "The Future of Personalized Pharmacogenomics: Why One Dose Does NOT Fit All",
    youtubeId: "YfE88c3P0Ew",
    category: "ted_medicine",
    channelTitle: "TEDx Health & Science",
    durationFormatted: "14:10 min",
    description: "Inspiring global talk on how genetic polymorphisms in CYP2D6, CYP2C19, and VKORC1 dictate personalized pharmacotherapy and eliminate adverse drug events.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
    tags: ["TEDx", "Pharmacogenomics", "Future Medicine", "CYP450", "Precision"]
  },
  {
    id: "pt-comedy-01",
    title: "Pharmacist Night Shift Reality vs. What People Think We Do (Healthcare Stress Relief)",
    youtubeId: "kJQP7kiw5Fk",
    category: "stress_relief_comedy",
    channelTitle: "Pharma Humour & Relaxation",
    durationFormatted: "5:20 min",
    description: "Hilarious and relatable sketches on deciphering illegible doctors' handwritings, insurance rejections, and pharmacy customers asking for 'that small white pill'.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop&q=80",
    tags: ["Comedy", "Stress Relief", "Pharmacy Life", "Humor", "Night Shift"]
  }
];

export const sampleSlideDecks: SlideDeck[] = [
  {
    id: "deck-clin-sepsis-2026",
    title: "Clinical Pharmacotherapy in Septic Shock & Sepsis-3",
    subtitle: "Evidence-Based Resuscitation, Inotropic Selection & Antimicrobial Stewardship",
    author: "Pharmacist Dawid Aliyi, BCPS",
    institution: "Tikur Anbessa Specialized Hospital / Pharma Star Pro",
    date: "October 2026",
    theme: "emerald_pharma",
    sourceDocumentName: "Ethiopian_STG_Sepsis_Management_Protocol.pdf",
    generatedAt: "2026-10-29T06:20:00Z",
    slides: [
      {
        id: "slide-1",
        slideNumber: 1,
        layout: "title",
        title: "Clinical Pharmacotherapy in Septic Shock & Sepsis-3",
        subtitle: "A High-Yield Evidence-Based Masterclass for Clinical Pharmacists & Physicians",
        calloutBadge: "EFDA / MoH Accredited Module",
        speakerNotes: "Welcome everyone. Today we analyze the Surviving Sepsis Campaign 1-hour bundle through the lens of bedside clinical pharmacology."
      },
      {
        id: "slide-2",
        slideNumber: 2,
        layout: "agenda",
        title: "Masterclass Agenda & Learning Objectives",
        subtitle: "Key Competencies Covered in this Slide Deck",
        bullets: [
          "Define Sepsis-3 Diagnostic Criteria: qSOFA vs. Sequential Organ Failure Assessment (SOFA).",
          "Initial Fluid Resuscitation: Crystalloid dosing (30 mL/kg Balanced Salt vs. 0.9% Normal Saline).",
          "First-Line Vasopressor Hierarchy: Why Norepinephrine remains the undisputed Gold Standard.",
          "Golden Hour Antimicrobial Timing: Blood cultures, empiric broad-spectrum coverage & de-escalation.",
          "Therapeutic Drug Monitoring (TDM): Aminoglycosides & Glycopeptide dosing in altered volume of distribution."
        ],
        speakerNotes: "Highlight the urgency of the Golden Hour bundle within 60 minutes of triage."
      },
      {
        id: "slide-3",
        slideNumber: 3,
        layout: "two_column",
        title: "Fluid Resuscitation & Hemodynamic Goals",
        subtitle: "Balanced Crystalloids vs. Normal Saline in Renal Preservation",
        leftColumnTitle: "Fluid Protocol & Dynamics",
        leftColumnBullets: [
          "Administer at least 30 mL/kg of IV crystalloids within the first 3 hours.",
          "Prefer Lactated Ringer's or Plasma-Lyte over large-volume 0.9% Saline.",
          "Prevent Hyperchloremic Metabolic Acidosis and renal vasoconstriction.",
          "Guide ongoing fluids via dynamic measures (passive leg raise, stroke volume variation)."
        ],
        rightColumnTitle: "Target Endpoints",
        rightColumnBullets: [
          "Mean Arterial Pressure (MAP) target: ≥ 65 mmHg.",
          "Serum Lactate clearance: Normalize within 6 hours (marker of tissue perfusion).",
          "Urine Output: ≥ 0.5 mL/kg/hour in non-dialysis dependent patients.",
          "Capillary Refill Time: < 2 seconds indicating restored microcirculation."
        ],
        calloutBadge: "Clinical Rule",
        calloutText: "Excessive fluid overload (> 10% positive balance) increases ICU mortality by 30%. Stop boluses once dynamic markers plateau!",
        speakerNotes: "Stress balanced crystalloids to avoid renal cortical vasoconstriction."
      },
      {
        id: "slide-4",
        slideNumber: 4,
        layout: "moa_pharmacology",
        title: "Vasopressor Pharmacology: Receptor Dynamics",
        subtitle: "Alpha-1 vs. Beta-1 Agonism in Peripheral Vascular Collapse",
        bullets: [
          "Norepinephrine: Potent α1 vasoconstrictor + mild β1 inotropy. Increases SVR without excessive tachycardia.",
          "Vasopressin (0.03 units/min): Stimulates vascular V1 receptors, overcoming autonomic vasoplegia.",
          "Epinephrine: Add-on agent when MAP remains refractory despite Norepinephrine + Vasopressin.",
          "Dobutamine (2.5-20 mcg/kg/min): Selective β1 inotrope indicated when myocardial dysfunction persists."
        ],
        calloutBadge: "Vasopressor Safety",
        calloutText: "Do NOT use pure Dopamine for septic shock due to tachyarrhythmia risks and excess mortality demonstrated in the SOAP II trial.",
        speakerNotes: "Emphasize peripheral extravasation antidote: Phentolamine infiltration if extravasation occurs."
      },
      {
        id: "slide-5",
        slideNumber: 5,
        layout: "conclusion",
        title: "Key Clinical Pearls & Summary",
        subtitle: "Take-Home Guidelines for Ward Practice",
        bullets: [
          "Every 1-hour delay in effective antibiotic therapy increases septic shock mortality by ~7.6%.",
          "Re-evaluate broad spectrum regimens daily with microbiology culture & susceptibility data.",
          "Monitor daily organ function (Scr, Bilirubin, Platelets) for individualized dosage titrations.",
          "Consult with the Clinical Pharmacy Team for bedside therapeutic drug monitoring!"
        ],
        calloutBadge: "Author Reference",
        calloutText: "Presented by Pharmacist Dawid Aliyi (jaalibiddoo@gmail.com | 0982852778). Pharma Star App Pro 2026.",
        speakerNotes: "Conclude with Q&A from participants."
      }
    ]
  }
];
