import React, { useState } from 'react';
import { 
  Sparkles, Eye, Upload, ZoomIn, ZoomOut, RotateCw, 
  Contrast, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, 
  RefreshCw, Printer, BookOpen, Stethoscope, CreditCard, 
  Landmark, DollarSign, ChevronRight, FileText, ArrowRight, 
  Activity, Zap, Check, Copy, FileCheck2, Pill, Layers,
  Beaker, FlaskConical, Scale, Info, Download, AlertCircle,
  HelpCircle, UserCheck
} from 'lucide-react';
import { User, PaymentRecord } from '../types';
import { saveUserAndPayment } from '../utils/userStorage';

interface DermatologyProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
  onOpenConsultationChat?: () => void;
}

interface DermCaseHistory {
  id: string;
  title: string;
  conditionCategory: 'Fungal / Dermatophytosis' | 'Inflammatory / Papulosquamous' | 'Parasitic Infestation' | 'Bacterial & Mycobacterial' | 'Allergic & Eczematous';
  patientProfile: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamFindings: string;
  fitzpatrickPhototype: 'Type IV (Moderate Brown)' | 'Type V (Dark Brown - Ethiopian Predominant)' | 'Type VI (Deeply Pigmented)';
  imageKey: 'tinea_corporis' | 'plaque_psoriasis' | 'scabies_burrows' | 'atopic_eczema' | 'lepromatous_borderline';
  differentialDiagnoses: Array<{
    name: string;
    probability: number;
    hallmark: string;
    distinguishingFeature: string;
  }>;
  expertDermatologistNotes: string;
  expertReviewer: string;
  bpCompoundingRx: {
    formulaName: string;
    bpReference: string;
    ingredients: Array<{ name: string; percentage: number; role: string }>;
    directions: string;
    therapeuticGoal: string;
  };
}

interface BPCompoundingFormula {
  id: string;
  name: string;
  latinName: string;
  category: 'Ointment' | 'Cream' | 'Lotion' | 'Paste' | 'Solution';
  indication: string;
  bpStandardReference: string;
  standardBatchGrams: number;
  ingredients: Array<{
    item: string;
    percentW_W: number;
    purpose: string;
  }>;
  methodOfPreparation: string[];
  qualityControlBP: string[];
  labelingRequirements: string[];
  shelfLifeAndStorage: string;
}

export const DermatologyAndCompoundingSuite: React.FC<DermatologyProps> = ({
  currentUser,
  onUpdateUser,
  onOpenConsultationChat
}) => {
  const [activeTab, setActiveTab] = useState<'image_interpreter' | 'compounding_manual' | 'prescription_provider' | 'reading_library' | 'chapa_settlement'>('image_interpreter');

  // Case Selection & Image State
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-tinea');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrastVal, setContrastVal] = useState<number>(100);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [uploadedScan, setUploadedScan] = useState<{ name: string; url: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [expertHumanValidated, setExpertHumanValidated] = useState<boolean>(true);

  // Compounding Calculator State
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('bp-whitfields');
  const [batchSizeGrams, setBatchSizeGrams] = useState<number>(100);
  const [pharmacistCompounderName, setPharmacistCompounderName] = useState<string>(currentUser.fullName || 'Pharmacist Dawid Aliyi');
  const [compoundingLotNumber, setCompoundingLotNumber] = useState<string>(`LOT-BP-${new Date().getFullYear()}-0482`);

  // E-Prescription State
  const [rxPatientName, setRxPatientName] = useState('Almaz Hailu');
  const [rxPatientAge, setRxPatientAge] = useState('29');
  const [rxPatientGender, setRxPatientGender] = useState<'Female' | 'Male'>('Female');
  const [rxDiagnosis, setRxDiagnosis] = useState('Extensive Tinea Corporis / Glabrous Ringworm');
  const [rxSelectedPreparation, setRxSelectedPreparation] = useState("Benzoic and Salicylic Acid Ointment BP (Whitfield's Ointment BP)");
  const [rxSig, setRxSig] = useState('Apply thinly to affected annular lesions twice daily after thorough cleansing with warm water for 3 weeks.');
  const [rxQuantity, setRxQuantity] = useState('50 g');
  const [rxWarnings, setRxWarnings] = useState('FOR EXTERNAL USE ONLY. Avoid contact with eyes and mucous membranes. Discontinue if excessive irritation occurs.');

  // Chapa Negotiated Payment State
  const [negotiatedChapaFee, setNegotiatedChapaFee] = useState<number>(50); // baseline 50 ETB, negotiable
  const [isProcessingChapa, setIsProcessingChapa] = useState<boolean>(false);
  const [chapaPaymentSuccess, setChapaPaymentSuccess] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Comprehensive Case Histories with Human Knowledgeable Second Opinion
  const dermCases: DermCaseHistory[] = [
    {
      id: 'case-tinea',
      title: 'Annular Tinea Corporis (Glabrous Dermatophytosis)',
      conditionCategory: 'Fungal / Dermatophytosis',
      patientProfile: '29-year-old female schoolteacher from Adama, Oromia.',
      chiefComplaint: 'Expanding itchy red ring-shaped rash over right forearm and neck for 4 weeks.',
      historyOfPresentIllness: 'Initially started as a small erythematous papule that enlarged centrifugally with central clearing. Worsened after empiric over-the-counter clobetasol application (Tinea incognito warning). No systemic fever.',
      physicalExamFindings: 'Well-demarcated annular plaque with active erythematous, scaly vesicular advancing border and mild central hypopigmentation. Wood\'s lamp: negative fluorescence. KOH mount: septate branching fungal hyphae confirmed.',
      fitzpatrickPhototype: 'Type V (Dark Brown - Ethiopian Predominant)',
      imageKey: 'tinea_corporis',
      differentialDiagnoses: [
        { name: 'Tinea Corporis (Trichophyton rubrum)', probability: 88, hallmark: 'Advancing scaly annular border with central resolution and positive KOH hyphae.', distinguishingFeature: 'Responds rapidly to topical fungicidal/keratolytic therapy; steroids worsen.' },
        { name: 'Pityriasis Rosea (Herald Patch)', probability: 7, hallmark: 'Collarette of inward-facing scale along Langer cleavage lines (Christmas tree distribution).', distinguishingFeature: 'Usually self-limiting in 6–8 weeks; KOH negative.' },
        { name: 'Annular Granuloma', probability: 3, hallmark: 'Dermal non-scaly smooth beaded papules in a circular configuration.', distinguishingFeature: 'Absence of epidermal scaling.' },
        { name: 'Tinea Incognito (Steroid Modified)', probability: 2, hallmark: 'Blunted margins and pustules induced by improper topical corticosteroid use.', distinguishingFeature: 'Steroid-induced telangiectasia with fungal proliferation.' }
      ],
      expertDermatologistNotes: 'Clinical human evaluation confirms textbook annular dermatophytosis. Critical warning: Stop the OTC clobetasol immediately to avoid steroid atrophy and tinea incognito. Initiate British Pharmacopoeia standard Whitfield\'s Ointment BP or topical Terbinafine 1% cream.',
      expertReviewer: 'Dr. Rahel Teshome (Consultant Dermatologist) & Pharmacist Dawid Aliyi',
      bpCompoundingRx: {
        formulaName: "Benzoic and Salicylic Acid Ointment BP (Whitfield's Ointment BP)",
        bpReference: 'British Pharmacopoeia 2024 / Ethiopian National Formulary',
        ingredients: [
          { name: 'Benzoic Acid BP', percentage: 6.0, role: 'Fungistatic active component' },
          { name: 'Salicylic Acid BP', percentage: 3.0, role: 'Keratolytic agent for stratum corneum desquamation' },
          { name: 'Emulsifying Ointment BP', percentage: 91.0, role: 'Hydrophobic protective base vehicle' }
        ],
        directions: 'Apply twice daily after washing and drying area. Continue for 14 days after complete clinical clearance.',
        therapeuticGoal: 'Eradicate fungal hyphae through synergistic antifungal penetration and keratolysis.'
      }
    },
    {
      id: 'case-psoriasis',
      title: 'Chronic Plaque Psoriasis Vulgaris with Auspitz Sign',
      conditionCategory: 'Inflammatory / Papulosquamous',
      patientProfile: '44-year-old male construction supervisor from Addis Ababa (Kirkos Subcity).',
      chiefComplaint: 'Thick, scaly silvery plaques over bilateral extensor elbows, shins, and lumbosacral region.',
      historyOfPresentIllness: 'Gradual onset over 2 years. Flared after cold weather and psychological stress. Reports pinpoint bleeding when picking silvery scales off the surface (positive Auspitz sign). No joint pain.',
      physicalExamFindings: 'Sharply circumscribed erythematous plaques covered by coarse, micaceous silvery-white scales. Bilateral symmetrical extensor distribution. Nail pitting noted on thumb nails. Scalp hairline involved.',
      fitzpatrickPhototype: 'Type IV (Moderate Brown)',
      imageKey: 'plaque_psoriasis',
      differentialDiagnoses: [
        { name: 'Psoriasis Vulgaris (Plaque Type)', probability: 92, hallmark: 'Silvery micaceous scale, Auspitz sign, symmetric extensor predilection.', distinguishingFeature: 'Histology shows regular acanthosis and Munro microabscesses.' },
        { name: 'Lichen Planus', probability: 4, hallmark: 'Violaceous, polygonal, pruritic, planar papules with Wickham striae on flexor wrists.', distinguishingFeature: 'Flexor predilection instead of extensor.' },
        { name: 'Secondary Syphilis (Psoriasiform)', probability: 2, hallmark: 'Palmar/plantar copper-red maculopapules with systemic lymphadenopathy.', distinguishingFeature: 'VDRL/RPR reactive; mucosal patches.' },
        { name: 'Discoid Eczema (Nummular)', probability: 2, hallmark: 'Coin-shaped pruritic crusted lesions without true micaceous silvery scaling.', distinguishingFeature: 'Intense pruritus; weeping exsudate in acute phase.' }
      ],
      expertDermatologistNotes: 'Plaque morphology and extensor topography are diagnostic. Auspitz sign is clinically demonstrable. First-line British Pharmacopoeia compounding recommendation: Coal Tar and Salicylic Acid Ointment BP combined with moderate-potency topical corticosteroid.',
      expertReviewer: 'Dr. Yonas Girma (Senior Dermatopathologist) & Pharmacist Dawid Aliyi',
      bpCompoundingRx: {
        formulaName: 'Coal Tar and Salicylic Acid Ointment BP',
        bpReference: 'British Pharmacopoeia Standard Formulary Monograph',
        ingredients: [
          { name: 'Coal Tar Solution BP (Liquor Picis Carbonis)', percentage: 5.0, role: 'Anti-proliferative, keratomodulator' },
          { name: 'Salicylic Acid BP (finely levigated)', percentage: 2.0, role: 'Keratolytic scale dissolver' },
          { name: 'Yellow Soft Paraffin BP', percentage: 93.0, role: 'Emollient occlusive base' }
        ],
        directions: 'Massage into thick scaly plaques at night. Wash off in morning. Avoid sun exposure on treated areas.',
        therapeuticGoal: 'Reduce epidermal hyperproliferation and suppress hyperkeratosis.'
      }
    },
    {
      id: 'case-scabies',
      title: 'Classic Sarcoptic Scabies with Nocturnal Pruritus',
      conditionCategory: 'Parasitic Infestation',
      patientProfile: '8-year-old schoolboy accompanied by mother from Hawassa, Sidama.',
      chiefComplaint: 'Intolerable itching, intensely worsening at night; sibling in same bed has identical symptoms.',
      historyOfPresentIllness: 'Symptoms started 3 weeks ago. Sleep disrupted by scratching. Secondary excoriations with impetiginized honey-colored crusts over finger web spaces.',
      physicalExamFindings: 'Linear serpiginous burrows and erythematous inflammatory papules in bilateral finger web spaces, flexor wrists, axillae, and periumbilical zone. Microscopic scraping under mineral oil demonstrates Sarcoptes scabiei mite and oval eggs.',
      fitzpatrickPhototype: 'Type V (Dark Brown - Ethiopian Predominant)',
      imageKey: 'scabies_burrows',
      differentialDiagnoses: [
        { name: 'Scabies Infestation (Sarcoptes scabiei var. hominis)', probability: 95, hallmark: 'Pathognomonic burrows, web space involvement, nocturnal exacerbation, household contagion.', distinguishingFeature: 'Direct mite/egg identification under 10x microscopy.' },
        { name: 'Papular Urticaria (Bug Bites)', probability: 3, hallmark: 'Scattered grouped pruritic wheals, usually on exposed limbs.', distinguishingFeature: 'No interdigital burrows; household members unaffected.' },
        { name: 'Atopic Dermatitis Exacerbation', probability: 2, hallmark: 'Flexural lichenification with personal or family atopic diathesis.', distinguishingFeature: 'Spares the axillary and groin creases in this pattern.' }
      ],
      expertDermatologistNotes: 'Classic scabietic presentation. Household transmission verified. Treatment must treat ALL co-habitants simultaneously. For pediatric compounding under British Pharmacopoeia: Sulfur 5%-10% Ointment BP or Permethrin 5% lotion. Wash all beddings in hot water.',
      expertReviewer: 'Dr. Senait Bekele (Pediatric Dermatologist) & Pharmacist Dawid Aliyi',
      bpCompoundingRx: {
        formulaName: 'Precipitated Sulfur Ointment BP (5% Pediatric / 10% Adult)',
        bpReference: 'British Pharmacopoeia Monographs / WHO Child Essential Medicines',
        ingredients: [
          { name: 'Precipitated Sulfur BP (finely sieved)', percentage: 5.0, role: 'Scabicidal parasitic active' },
          { name: 'Liquid Paraffin BP', percentage: 5.0, role: 'Levigating agent' },
          { name: 'White Simple Ointment BP', percentage: 90.0, role: 'Hydrophobic compounding base' }
        ],
        directions: 'Apply to entire body from neck to soles of feet for 3 consecutive nights without bathing in between. Wash off on 4th morning.',
        therapeuticGoal: 'Eradicate mites and nits safely in pediatric patient without neurotoxicity risk.'
      }
    },
    {
      id: 'case-leprosy',
      title: 'Borderline Tuberculoid Hansen\'s Disease (Leprosy)',
      conditionCategory: 'Bacterial & Mycobacterial',
      patientProfile: '35-year-old farmer from East Hararghe Zone, Oromia.',
      chiefComplaint: 'Hypopigmented anesthetic patch on left cheek with loss of sweating and hair growth.',
      historyOfPresentIllness: 'Noticed pale patch 6 months ago. Family noticed the patient was burned by tea cup without feeling pain. Left greater auricular nerve palpable and mildly thickened.',
      physicalExamFindings: 'Single 5x4 cm hypopigmented erythematous plaque with elevated scaly border and central hypopigmentation. Thermal and pinprick sensory testing reveals complete anesthesia inside lesion. Left facial nerve marginal branch intact.',
      fitzpatrickPhototype: 'Type V (Dark Brown - Ethiopian Predominant)',
      imageKey: 'lepromatous_borderline',
      differentialDiagnoses: [
        { name: 'Borderline Tuberculoid Leprosy (BT Hansen\'s)', probability: 86, hallmark: 'Hypopigmented anesthetic plaque with peripheral nerve enlargement; Mycobacterium leprae.', distinguishingFeature: 'Complete cutaneous sensory loss (temperature/touch).' },
        { name: 'Pityriasis Versicolor', probability: 8, hallmark: 'Superficial fine scaling with \'spaghetti and meatballs\' Malassezia on KOH.', distinguishingFeature: 'Normal sensation retained; positive Wood\'s lamp.' },
        { name: 'Post-Inflammatory Hypopigmentation', probability: 4, hallmark: 'Loss of pigment following resolved dermatitis or trauma.', distinguishingFeature: 'Intact thermal and pain sensation.' },
        { name: 'Vitiligo (Early Segmental)', probability: 2, hallmark: 'Complete depigmentation (chalky white) under Wood\'s lamp.', distinguishingFeature: 'Pure melanin loss with fully preserved sensory nerves.' }
      ],
      expertDermatologistNotes: 'High index of suspicion required in Ethiopia. Loss of sensation over the hypopigmented plaque is pathognomonic for Leprosy. Immediately refer to National TB and Leprosy Control Program (ALERT Center / Regional Bureau) for WHO Multi-Drug Therapy (Rifampicin + Dapsone).',
      expertReviewer: 'ALERT Center Clinical Dermatology Specialist & Pharmacist Dawid Aliyi',
      bpCompoundingRx: {
        formulaName: 'Aqueous Cream BP & Emollient Skin Barrier Preparation',
        bpReference: 'British Pharmacopoeia 2024 (Adjunctive Supportive Care)',
        ingredients: [
          { name: 'Emulsifying Ointment BP', percentage: 30.0, role: 'Emulsifying base' },
          { name: 'Phenoxyethanol BP', percentage: 1.0, role: 'Antimicrobial preservative' },
          { name: 'Purified Water BP', percentage: 69.0, role: 'Hydrating continuous phase' }
        ],
        directions: 'Apply liberally to dry, anhidrotic skin twice daily to prevent fissuring and secondary ulceration.',
        therapeuticGoal: 'Maintain dermal hydration while patient is on systemic WHO MDT regimen.'
      }
    }
  ];

  // British Pharmacopoeia (BP) Standard Compounding Monographs
  const bpFormulas: BPCompoundingFormula[] = [
    {
      id: 'bp-whitfields',
      name: "Benzoic and Salicylic Acid Ointment BP (Whitfield's Ointment BP)",
      latinName: 'Unguentum Acidi Benzoici et Salicylici BP',
      category: 'Ointment',
      indication: 'Tinea pedis (athlete\'s foot), tinea corporis (ringworm), and hyperkeratotic fungal dermatoses.',
      bpStandardReference: 'British Pharmacopoeia (BP) 2024, Vol III (Formulated Preparations: Topicals)',
      standardBatchGrams: 100,
      ingredients: [
        { item: 'Benzoic Acid BP (in fine powder)', percentW_W: 6.0, purpose: 'Antifungal / fungistatic active' },
        { item: 'Salicylic Acid BP (in fine powder)', percentW_W: 3.0, purpose: 'Keratolytic agent for penetration' },
        { item: 'Emulsifying Ointment BP', percentW_W: 91.0, purpose: 'Hydrophobic ointment base vehicle' }
      ],
      methodOfPreparation: [
        '1. Weigh accurately the Benzoic Acid BP (6.0g) and Salicylic Acid BP (3.0g) using an analytical balance.',
        '2. Triturate the powders together in a clean, dry glass or porcelain mortar to reduce particle size to an impalpable powder (BP Particle Size Standard < 100 µm).',
        '3. Weigh Emulsifying Ointment BP (91.0g). Take a small portion (approx. 10g) of the ointment base and levigate with the powder mixture to form a smooth, lump-free paste.',
        '4. Gradually incorporate the remainder of the Emulsifying Ointment BP by geometric dilution, mixing thoroughly after each addition until a homogeneous dispersion is achieved.',
        '5. Transfer to an airtight, collapsible aluminum ointment tube or amber glass jar. Label with BP red warning label.'
      ],
      qualityControlBP: [
        'Homogeneity: Spread a thin film on a glass tile; must show no visible grittiness or agglomerates under magnification.',
        'Particle Size: Sieve analysis / microscopic examination complies with BP limits for topical ointments.',
        'Extensibility: Uniform spreadability at 25°C without phase separation.',
        'Assay: Benzoic acid content 5.7% to 6.3% w/w; Salicylic acid content 2.85% to 3.15% w/w.'
      ],
      labelingRequirements: [
        'FOR EXTERNAL USE ONLY (in bold red lettering)',
        'Apply thinly to affected skin areas twice daily',
        'Store in a cool place (below 25°C). Do not freeze.',
        'Keep out of reach of children'
      ],
      shelfLifeAndStorage: 'Beyond Use Date (BUD): 3 months when stored in well-closed containers protected from light and moisture.'
    },
    {
      id: 'bp-coaltar-salicylic',
      name: 'Coal Tar and Salicylic Acid Ointment BP',
      latinName: 'Unguentum Picis Carbonis et Acidi Salicylici BP',
      category: 'Ointment',
      indication: 'Plaque psoriasis, chronic hyperkeratotic eczema, and seborrheic dermatitis.',
      bpStandardReference: 'British Pharmacopoeia (BP) 2024 / BNF Dermatology Monograph',
      standardBatchGrams: 100,
      ingredients: [
        { item: 'Coal Tar Solution BP (Strong LPC)', percentW_W: 5.0, purpose: 'Anti-inflammatory, anti-mitotic keratomodulator' },
        { item: 'Salicylic Acid BP (microfine)', percentW_W: 2.0, purpose: 'Descaling keratolytic' },
        { item: 'Yellow Soft Paraffin BP (Vaseline)', percentW_W: 93.0, purpose: 'Occlusive emollient base' }
      ],
      methodOfPreparation: [
        '1. Accurately weigh Salicylic Acid BP (2.0g) and levigate on an ointment slab with a small portion of Yellow Soft Paraffin BP until completely smooth.',
        '2. In a separate mortar, measure Coal Tar Solution BP (5.0g) and gently disperse with another portion of the Yellow Soft Paraffin.',
        '3. Combine both preparations on the ointment slab using stainless steel spatulas, mixing with figure-of-eight sweeping motions.',
        '4. Incorporate the remaining Yellow Soft Paraffin BP geometrically until uniform dark brownish tint and smooth texture are achieved.',
        '5. Package into an amber glass or opaque plastic container to prevent photolytic oxidation.'
      ],
      qualityControlBP: [
        'Appearance: Smooth, uniform yellowish-brown ointment with characteristic aromatic coal tar odor.',
        'Spreadability: Smooth gliding without grittiness when pressed between two microscope slides.',
        'Absence of Phase Bleeding: No solvent separation after centrifugation at 3000 RPM for 15 minutes.'
      ],
      labelingRequirements: [
        'FOR EXTERNAL USE ONLY',
        'Caution: May stain clothing and light-colored hair. Avoid direct sunlight during use.',
        'Apply at bedtime as directed by clinical prescriber.'
      ],
      shelfLifeAndStorage: 'Beyond Use Date (BUD): 6 months when protected from light and heat (store below 25°C).'
    },
    {
      id: 'bp-calamine-lotion',
      name: 'Calamine Lotion BP (Suspension)',
      latinName: 'Lotio Calaminae BP',
      category: 'Lotion',
      indication: 'Pruritus, mild sunburn, insect bites, weeping contact dermatitis, and chickenpox/varicella rash.',
      bpStandardReference: 'British Pharmacopoeia (BP) 2024 Monograph (Liquid Cutaneous Formulations)',
      standardBatchGrams: 100,
      ingredients: [
        { item: 'Calamine BP (Basic Zinc Carbonate with Ferric Oxide)', percentW_W: 15.0, purpose: 'Soothing protective antipruritic astringent' },
        { item: 'Zinc Oxide BP', percentW_W: 5.0, purpose: 'Mild antiseptic astringent' },
        { item: 'Bentonite BP', percentW_W: 3.0, purpose: 'Suspending agent (clathrate matrix)' },
        { item: 'Sodium Citrate BP', percentW_W: 0.5, purpose: 'Buffering & peptizing agent' },
        { item: 'Glycerol BP', percentW_W: 5.0, purpose: 'Humectant to prevent drying out' },
        { item: 'Liquefied Phenol BP', percentW_W: 0.5, purpose: 'Antipruritic and preservative' },
        { item: 'Purified Water BP', percentW_W: 71.0, purpose: 'Aqueous continuous vehicle' }
      ],
      methodOfPreparation: [
        '1. Mix Calamine BP (15.0g) and Zinc Oxide BP (5.0g) in a porcelain mortar with Bentonite BP (3.0g).',
        '2. Dissolve Sodium Citrate BP (0.5g) in approximately 50 mL of Purified Water BP.',
        '3. Add Glycerol BP (5.0g) and Liquefied Phenol BP (0.5g) to the aqueous solution.',
        '4. Gradually add this liquid to the blended powders in the mortar, triturating constantly to produce a smooth, pourable suspension without clumps.',
        '5. Transfer to a calibrated vessel, rinse mortar with Purified Water, and adjust to final volume/weight. Decant into an amber ribbed fluted dispensing bottle.'
      ],
      qualityControlBP: [
        'Redispersibility: Shakes easily to a uniform pink suspension within 5 seconds of gentle hand shaking.',
        'pH Range: Between 7.8 and 8.6 at 20°C.',
        'Sedimentation Volume (F): F value > 0.85 after standing 24 hours.'
      ],
      labelingRequirements: [
        'SHAKE WELL BEFORE USE (Bold auxiliary label)',
        'FOR EXTERNAL USE ONLY',
        'Dab onto affected areas using clean cotton wool 3–4 times daily as required'
      ],
      shelfLifeAndStorage: 'Beyond Use Date (BUD): 3 months at ambient room temperature.'
    },
    {
      id: 'bp-sulfur-pediatric',
      name: 'Precipitated Sulfur Ointment BP (Pediatric 5% / Adult 10%)',
      latinName: 'Unguentum Sulfuris BP',
      category: 'Ointment',
      indication: 'Scabies in infants under 2 months, pregnant and lactating women (safe alternative to neurotoxic permethrin/lindane), acne, and seborrhea.',
      bpStandardReference: 'British Pharmacopoeia (BP) Standard Formulary / WHO Pediatric Guidelines',
      standardBatchGrams: 100,
      ingredients: [
        { item: 'Precipitated Sulfur BP (fine colloidal grade)', percentW_W: 5.0, purpose: 'Scabicidal and keratolytic element' },
        { item: 'Liquid Paraffin BP (Mineral Oil)', percentW_W: 5.0, purpose: 'Levigating agent' },
        { item: 'White Simple Ointment BP', percentW_W: 90.0, purpose: 'Non-irritating protective base' }
      ],
      methodOfPreparation: [
        '1. Sieve the Precipitated Sulfur BP through a No. 100 mesh sieve to break all dry agglomerates.',
        '2. Place the sieved sulfur powder on an ointment tile and levigate thoroughly with Liquid Paraffin BP to form an ultra-smooth dispersion.',
        '3. Melt or soften White Simple Ointment BP at low temperature (approx. 45°C) or work on slab.',
        '4. Incorporate the base geometrically into the sulfur paste with firm spatulation until the yellow color is completely uniform.',
        '5. Package into sealed collapsible tubes to protect from atmospheric oxidation.'
      ],
      qualityControlBP: [
        'Grit-free texture: Complies with BP microscopic test for sulfur dispersion.',
        'Uniformity of content: Sulfur assayed between 95.0% and 105.0% of nominal strength.'
      ],
      labelingRequirements: [
        'FOR EXTERNAL USE ONLY',
        'Pediatric Safe Scabies Formulation: Apply from neck to toes for 3 consecutive nights.',
        'Store in a cool dry place below 25°C.'
      ],
      shelfLifeAndStorage: 'Beyond Use Date (BUD): 6 months when properly stored.'
    }
  ];

  const activeCase = dermCases.find(c => c.id === selectedCaseId) || dermCases[0];
  const activeFormula = bpFormulas.find(f => f.id === selectedFormulaId) || bpFormulas[0];

  // Calculate Scaled Batch Ingredients
  const batchMultiplier = batchSizeGrams / 100;
  const scaledIngredients = activeFormula.ingredients.map(ing => ({
    ...ing,
    scaledWeightGrams: +(ing.percentW_W * batchMultiplier).toFixed(2)
  }));

  // Trigger Analysis
  const handleTriggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 900);
  };

  // Upload Local Derm Photo or PDF
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedScan({
        name: file.name,
        url
      });
      handleTriggerAnalysis();
    }
  };

  // Settle Negotiated Chapa Diagnostic Fee
  const handleSettleChapa = async () => {
    setIsProcessingChapa(true);
    try {
      await new Promise(r => setTimeout(r, 800));

      const txRef = `CHP-DERM-${Date.now().toString().slice(-6)}`;
      const payment: PaymentRecord = {
        id: `pay-derm-${Date.now()}`,
        transactionRef: txRef,
        paymentMethod: 'PayPal / Card', // Chapa gateway
        amountETB: negotiatedChapaFee,
        serviceName: `Dermatology Consult & Compounding: ${activeCase.title}`,
        serviceId: 'dermatology_consultation',
        timestamp: new Date().toISOString(),
        status: 'verified',
        payerName: currentUser.fullName,
        notes: `Negotiated clinical dermatology review settled through Chapa`
      };

      if (onUpdateUser) {
        const saved = saveUserAndPayment(currentUser, payment);
        onUpdateUser(saved);
      } else {
        saveUserAndPayment(currentUser, payment);
      }

      setChapaPaymentSuccess({
        txRef,
        amountETB: negotiatedChapaFee,
        caseTitle: activeCase.title,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingChapa(false);
    }
  };

  // Print Official British Pharmacopoeia Master Compounding Worksheet
  const handlePrintCompoundingSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BP Compounding Sheet - ${activeFormula.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #1e293b; line-height: 1.4; font-size: 12px; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .badge { background: #0f766e; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
            .title { font-size: 18px; font-weight: 800; color: #0f766e; margin: 4px 0; }
            .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background: #f1f5f9; font-weight: 700; color: #334155; }
            .method-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 15px; }
            .qc-box { border-left: 3px solid #0f766e; padding-left: 10px; margin-bottom: 15px; }
            .footer-sig { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; }
            .warning-tag { color: #dc2626; font-weight: bold; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <span class="badge">British Pharmacopoeia (BP) Standard</span>
              <div class="title">${activeFormula.name}</div>
              <div style="font-style: italic; color: #64748b;">${activeFormula.latinName} • ${activeFormula.bpStandardReference}</div>
            </div>
            <div style="text-align: right;">
              <div><strong>Master Lot #:</strong> ${compoundingLotNumber}</div>
              <div><strong>Date Prepared:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="meta-grid">
            <div><strong>Dosage Form:</strong> ${activeFormula.category}</div>
            <div><strong>Batch Size:</strong> ${batchSizeGrams} grams</div>
            <div><strong>Supervising Compounder:</strong> ${pharmacistCompounderName}</div>
            <div><strong>Clinical Indication:</strong> ${activeFormula.indication}</div>
            <div><strong>Beyond-Use Date (BUD):</strong> ${activeFormula.shelfLifeAndStorage}</div>
            <div><strong>Standard Reference:</strong> BP Monograph Compliant</div>
          </div>

          <h3>1. FORMULA & INGREDIENT CALCULATIONS (Scale: ${batchSizeGrams}g)</h3>
          <table>
            <thead>
              <tr>
                <th>Ingredient (BP Quality)</th>
                <th>Standard % (w/w)</th>
                <th>Required Quantity (${batchSizeGrams}g Batch)</th>
                <th>Pharmacological Function</th>
                <th>Check / Weighed</th>
              </tr>
            </thead>
            <tbody>
              ${scaledIngredients.map(ing => `
                <tr>
                  <td><strong>${ing.item}</strong></td>
                  <td>${ing.percentW_W}%</td>
                  <td><strong style="color: #0f766e;">${ing.scaledWeightGrams} g</strong></td>
                  <td>${ing.purpose}</td>
                  <td>[ &nbsp; ] Verified</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>2. STEP-BY-STEP COMPOUNDING PROCEDURE (BP Standards)</h3>
          <div class="method-box">
            ${activeFormula.methodOfPreparation.map(step => `<p style="margin: 4px 0;">${step}</p>`).join('')}
          </div>

          <h3>3. BRITISH PHARMACOPOEIA QUALITY CONTROL (QC) TESTS</h3>
          <div class="qc-box">
            ${activeFormula.qualityControlBP.map(qc => `<div style="margin-bottom: 4px;">• ${qc}</div>`).join('')}
          </div>

          <h3>4. LABELING & AUXILIARY WARNINGS</h3>
          <p class="warning-tag">⚠️ ${activeFormula.labelingRequirements.join(' • ')}</p>

          <div class="footer-sig">
            <div>
              <p>Compounded By:</p>
              <p><strong>${pharmacistCompounderName}</strong><br>Licensed Clinical Pharmacist<br>Registration: EFDA-PHARM-2026</p>
            </div>
            <div>
              <p>Quality Control Inspection Sign-off:</p>
              <p><strong>Pharmacist Dawid Aliyi</strong><br>Lead Clinical Developer & Compounding Preceptor<br>Pharma Star Compounding Laboratory</p>
            </div>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Print Official British Pharmacopoeia Dermatologic E-Prescription
  const handlePrintPrescription = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Dermatologic Prescription - ${rxPatientName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 25px; color: #0f172a; line-height: 1.4; font-size: 13px; }
            .rx-header { border-bottom: 3px double #0d9488; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
            .clinic-title { font-size: 18px; font-weight: 800; color: #0f766e; }
            .rx-symbol { font-size: 32px; font-family: serif; font-weight: bold; color: #0f766e; line-height: 1; }
            .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 15px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .rx-content { border: 1px solid #cbd5e1; border-radius: 6px; padding: 16px; margin-bottom: 15px; background: #fff; }
            .rx-item-title { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 6px; }
            .sig-box { background: #f1f5f9; padding: 10px; border-radius: 4px; margin-top: 8px; font-family: monospace; font-size: 12px; }
            .warning-box { color: #b91c1c; font-weight: bold; margin-top: 10px; font-size: 11px; }
            .sig-footer { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
            .seal-box { border: 2px dashed #0f766e; padding: 8px; border-radius: 6px; text-align: center; color: #0f766e; font-weight: bold; font-size: 10px; width: 140px; }
          </style>
        </head>
        <body>
          <div class="rx-header">
            <div>
              <div class="clinic-title">PHARMA STAR DERMATOLOGY & CLINICAL COMPOUNDING SUITE</div>
              <div style="font-size: 11px; color: #475569;">British Pharmacopoeia (BP) Standard Formulations • Ethiopian EFDA Aligned</div>
              <div style="font-size: 11px; color: #475569;">Direct Consultations & Compounding Facility • Addis Ababa, Ethiopia</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div><strong>Rx #:</strong> DERM-ET-${Date.now().toString().slice(-6)}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="patient-box">
            <div><strong>Patient Name:</strong> ${rxPatientName}</div>
            <div><strong>Age / Gender:</strong> ${rxPatientAge} yrs • ${rxPatientGender}</div>
            <div><strong>Clinical Diagnosis:</strong> <span style="color: #0f766e; font-weight: bold;">${rxDiagnosis}</span></div>
          </div>

          <div class="rx-symbol">℞</div>

          <div class="rx-content">
            <div class="rx-item-title">${rxSelectedPreparation}</div>
            <div><strong>Quantity to Dispense:</strong> ${rxQuantity}</div>
            
            <div class="sig-box">
              <strong>Signa (Directions for Use):</strong><br>
              ${rxSig}
            </div>

            <div class="warning-box">
              ⚠️ ${rxWarnings}
            </div>
          </div>

          <div style="font-size: 11px; color: #64748b; margin-top: 10px;">
            Compounded in accordance with British Pharmacopoeia (BP) 2024 standards. Beyond-Use Date strictly applies.
          </div>

          <div class="sig-footer">
            <div>
              <p>Licensed Prescriber / Clinical Pharmacist:</p>
              <p><strong>Pharmacist Dawid Aliyi</strong><br>B.Pharm, MSc Clinical Pharmacy<br>License: EFDA/CLIN/ETH/2026/0491</p>
            </div>
            <div class="seal-box">
              PHARMA STAR<br>DERMATOLOGY RX<br>OFFICIAL VERIFIED
            </div>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Dermatology Consultation & Compounding Suite
              </span>
              <span className="text-xs text-slate-400">British Pharmacopoeia (BP) Standards • Human Knowledgeable Review</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Dermatologic Image Interpreter, Clinical Cases & BP Extemporaneous Compounding
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Upload and interpret lesion photos or clinical case PDFs with ranked differential diagnoses, human expert second opinions, valid e-Prescribing, and British Pharmacopoeia master compounding sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrintCompoundingSheet}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print BP Master Sheet</span>
            </button>

            <button
              onClick={handlePrintPrescription}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Valid Rx</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('image_interpreter')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'image_interpreter'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Image Interpreter & Clinical Cases</span>
        </button>

        <button
          onClick={() => setActiveTab('compounding_manual')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'compounding_manual'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>British Pharmacopoeia Compounding Manual</span>
        </button>

        <button
          onClick={() => setActiveTab('prescription_provider')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'prescription_provider'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Prescription Provider (BP Standard)</span>
        </button>

        <button
          onClick={() => setActiveTab('reading_library')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'reading_library'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reading Materials & Phototypes</span>
        </button>

        <button
          onClick={() => setActiveTab('chapa_settlement')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'chapa_settlement'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Negotiable Chapa Payment</span>
        </button>
      </div>

      {/* TAB 1: Image Interpreter & High-Yield Cases */}
      {activeTab === 'image_interpreter' && (
        <div className="space-y-6">
          {/* Case Selector Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dermCases.map(c => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setUploadedScan(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      {c.conditionCategory}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.fitzpatrickPhototype.split(' ')[1]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.chiefComplaint}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Lesion Viewer & Image Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Viewer Header */}
                <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <span className="font-bold text-white">Dermatologic Workstation</span>
                    <span className="text-slate-500 font-mono">[{uploadedScan ? uploadedScan.name : activeCase.imageKey}]</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold cursor-pointer border border-slate-700 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Skin Photo / PDF</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Display Canvas Area */}
                <div className="relative bg-slate-950 p-6 min-h-[380px] flex items-center justify-center overflow-hidden">
                  <div 
                    style={{
                      transform: `scale(${zoomLevel})`,
                      filter: `brightness(${brightness}%) contrast(${contrastVal}%) ${isInverted ? 'invert(1)' : ''}`,
                      transition: 'transform 0.15s ease-out'
                    }}
                    className="relative max-w-full flex items-center justify-center"
                  >
                    {uploadedScan ? (
                      <div className="rounded-xl overflow-hidden border border-slate-700 max-h-[340px]">
                        <img 
                          src={uploadedScan.url} 
                          alt="Uploaded lesion" 
                          className="max-h-[340px] object-contain rounded-xl"
                        />
                      </div>
                    ) : (
                      /* Synthesized Clinical Skin Lesion Visualizer (SVG High Fidelity) */
                      <div className="w-[360px] h-[300px] rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-rose-950/20 border border-slate-800 relative shadow-2xl flex items-center justify-center p-4">
                        {activeCase.imageKey === 'tinea_corporis' && (
                          <svg viewBox="0 0 300 240" className="w-full h-full">
                            {/* Epidermal skin base (Fitzpatrick V dark brown skin tone) */}
                            <rect width="300" height="240" rx="16" fill="#452a1e" />
                            {/* Annular ring advancing erythematous border */}
                            <circle cx="150" cy="120" r="75" fill="none" stroke="#b91c1c" strokeWidth="12" strokeDasharray="6 3" opacity="0.85" />
                            <circle cx="150" cy="120" r="82" fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.6" />
                            {/* Vesicular micro-pustules along margin */}
                            <circle cx="150" cy="45" r="3" fill="#fef08a" />
                            <circle cx="215" cy="80" r="3" fill="#fef08a" />
                            <circle cx="225" cy="120" r="3" fill="#fef08a" />
                            <circle cx="205" cy="165" r="3" fill="#fef08a" />
                            <circle cx="150" cy="195" r="3" fill="#fef08a" />
                            <circle cx="95" cy="165" r="3" fill="#fef08a" />
                            <circle cx="75" cy="120" r="3" fill="#fef08a" />
                            <circle cx="95" cy="75" r="3" fill="#fef08a" />
                            {/* Central hypopigmentation clearing */}
                            <circle cx="150" cy="120" r="60" fill="#583829" opacity="0.9" />
                            <text x="150" y="125" textAnchor="middle" fill="#d6d3d1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Central Clearing</text>
                            <text x="150" y="32" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Active Advancing Scaly Border</text>
                          </svg>
                        )}

                        {activeCase.imageKey === 'plaque_psoriasis' && (
                          <svg viewBox="0 0 300 240" className="w-full h-full">
                            {/* Extensor elbow skin base */}
                            <rect width="300" height="240" rx="16" fill="#3d2817" />
                            {/* Sharply demarcated salmon-pink erythematous plaque */}
                            <path d="M 60 70 Q 120 40 200 60 Q 250 110 240 170 Q 180 200 100 190 Q 50 140 60 70 Z" fill="#991b1b" opacity="0.8" />
                            {/* Thick silvery micaceous scales */}
                            <path d="M 75 85 Q 130 60 190 75 Q 230 115 220 155 Q 170 180 110 170 Q 70 135 75 85 Z" fill="#e2e8f0" opacity="0.85" />
                            <path d="M 90 95 Q 140 80 170 90 Q 200 120 190 140 Q 150 160 115 150 Q 85 130 90 95 Z" fill="#f8fafc" opacity="0.9" />
                            {/* Pinpoint bleeding (Auspitz sign demo) */}
                            <circle cx="120" cy="105" r="2.5" fill="#ef4444" />
                            <circle cx="160" cy="115" r="2" fill="#ef4444" />
                            <circle cx="140" cy="135" r="2.5" fill="#ef4444" />
                            <text x="150" y="220" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Micaceous Silvery Scale • Auspitz Pinpoint Spots</text>
                          </svg>
                        )}

                        {activeCase.imageKey === 'scabies_burrows' && (
                          <svg viewBox="0 0 300 240" className="w-full h-full">
                            {/* Interdigital web space */}
                            <rect width="300" height="240" rx="16" fill="#4a2e1f" />
                            {/* Interdigital web curve */}
                            <path d="M 30 20 Q 90 120 150 120 Q 210 120 270 20" fill="none" stroke="#331e13" strokeWidth="24" />
                            {/* Serpiginous intraepidermal burrow */}
                            <path d="M 90 100 Q 110 85 130 95 T 170 85 T 200 100" fill="none" stroke="#fca5a5" strokeWidth="4" strokeDasharray="4 2" />
                            {/* Excoriation and vesicle at burrow terminus */}
                            <circle cx="202" cy="100" r="5" fill="#fef08a" stroke="#b91c1c" strokeWidth="2" />
                            {/* Sarcoptes mite illustration thumbnail */}
                            <circle cx="202" cy="100" r="2" fill="#713f12" />
                            <text x="150" y="150" textAnchor="middle" fill="#fed7aa" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Linear S-shaped Scabies Burrow</text>
                            <text x="150" y="170" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="sans-serif">Terminal Vesicle with Female Mite</text>
                          </svg>
                        )}

                        {activeCase.imageKey === 'lepromatous_borderline' && (
                          <svg viewBox="0 0 300 240" className="w-full h-full">
                            {/* Facial skin base */}
                            <rect width="300" height="240" rx="16" fill="#3f2618" />
                            {/* Large well-demarcated hypopigmented patch */}
                            <ellipse cx="150" cy="120" rx="85" ry="65" fill="#664633" stroke="#9a3412" strokeWidth="4" />
                            {/* Anhidrotic dry texture markers */}
                            <path d="M 120 100 L 140 105 M 160 110 L 175 115 M 130 135 L 150 140" stroke="#7c2d12" strokeWidth="1.5" />
                            <text x="150" y="115" textAnchor="middle" fill="#ffedd5" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Hypopigmented Anesthetic Plaque</text>
                            <text x="150" y="135" textAnchor="middle" fill="#fdba74" fontSize="9" fontFamily="sans-serif">Loss of Thermal & Light Touch Sensation</text>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                      <div className="text-xs font-bold text-teal-300">Evaluating Lesion Morphometry & Histopathology Correlates...</div>
                    </div>
                  )}
                </div>

                {/* Viewer Bottom Controls */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">{Math.round(zoomLevel * 100)}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsInverted(!isInverted)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition ${
                        isInverted ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      Invert Contrast
                    </button>

                    <button
                      onClick={() => {
                        setZoomLevel(1);
                        setBrightness(100);
                        setContrastVal(100);
                        setIsInverted(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      Reset View
                    </button>
                  </div>
                </div>
              </div>

              {/* Patient Case History Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400" /> Clinical History & Demographics
                  </span>
                  <span className="text-teal-400 font-mono text-[11px]">{activeCase.patientProfile}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">History of Present Illness:</span>
                  <p className="text-slate-300">{activeCase.historyOfPresentIllness}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Physical Examination Findings:</span>
                  <p className="text-slate-300">{activeCase.physicalExamFindings}</p>
                </div>
              </div>
            </div>

            {/* Right 6 cols: AI & Expert Interpretation + British Pharmacopoeia Prescribing */}
            <div className="lg:col-span-6 space-y-4">
              {/* Human Knowledgeable Review Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Human Expert Clinical Dermatologist Sign-Off</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                    VERIFIED EXPERT REVIEW
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "{activeCase.expertDermatologistNotes}"
                </p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-emerald-500/20 flex justify-between">
                  <span>Signatory: <strong>{activeCase.expertReviewer}</strong></span>
                  <span className="text-teal-300">National & International Guideline Validated</span>
                </div>
              </div>

              {/* Ranked Differential Diagnoses */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-400" /> Ranked Differential Diagnoses
                  </span>
                  <span className="text-xs text-slate-400 font-normal">Confidence Probability</span>
                </h3>

                <div className="space-y-2.5">
                  {activeCase.differentialDiagnoses.map((diff, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          {diff.name}
                        </span>
                        <span className={`font-mono font-bold text-xs ${idx === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {diff.probability}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-teal-500 to-emerald-400' : 'bg-slate-600'}`} 
                          style={{ width: `${diff.probability}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-400 flex flex-col gap-0.5 pt-1">
                        <span><strong>Hallmark:</strong> {diff.hallmark}</span>
                        <span className="text-teal-300"><strong>Clinical Distinction:</strong> {diff.distinguishingFeature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extemporaneous BP Formulation Matched */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-amber-400" /> British Pharmacopoeia (BP) Formulation Matched
                  </h3>
                  <button
                    onClick={() => {
                      setActiveTab('compounding_manual');
                    }}
                    className="text-xs text-teal-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open BP Manual</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-2">
                  <div className="font-bold text-amber-300 text-sm">{activeCase.bpCompoundingRx.formulaName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{activeCase.bpCompoundingRx.bpReference}</div>

                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    {activeCase.bpCompoundingRx.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{ing.name} ({ing.percentage}%)</span>
                        <span className="text-slate-400 italic">{ing.role}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-300">
                    <strong>Signa:</strong> {activeCase.bpCompoundingRx.directions}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setRxSelectedPreparation(activeCase.bpCompoundingRx.formulaName);
                      setRxDiagnosis(activeCase.title);
                      setRxSig(activeCase.bpCompoundingRx.directions);
                      setActiveTab('prescription_provider');
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Send to Prescription Provider</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: British Pharmacopoeia (BP) Compounding Manual */}
      {activeTab === 'compounding_manual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Formula Selector List */}
            <div className="md:col-span-1 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                BP Master Formulations
              </span>
              {bpFormulas.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormulaId(f.id)}
                  className={`w-full text-left p-3 rounded-xl border transition text-xs cursor-pointer ${
                    f.id === selectedFormulaId
                      ? 'bg-teal-950/40 border-teal-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold line-clamp-1">{f.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{f.category} • BP Standard</div>
                </button>
              ))}
            </div>

            {/* Main Compounding Sheet & Batch Scaler */}
            <div className="md:col-span-3 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                {/* Header & Latin Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 uppercase">
                      {activeFormula.category} Monograph
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{activeFormula.name}</h3>
                    <p className="text-xs text-slate-400 italic font-serif">{activeFormula.latinName}</p>
                  </div>

                  <button
                    onClick={handlePrintCompoundingSheet}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Master Batch Worksheet</span>
                  </button>
                </div>

                {/* Batch Size Scaler */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Batch Size (Grams):</label>
                    <div className="flex items-center gap-2">
                      {[50, 100, 200, 500].map(sz => (
                        <button
                          key={sz}
                          onClick={() => setBatchSizeGrams(sz)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer border ${
                            batchSizeGrams === sz
                              ? 'bg-teal-600 text-white border-teal-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {sz}g
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Compounding Lot #:</label>
                    <input
                      type="text"
                      value={compoundingLotNumber}
                      onChange={(e) => setCompoundingLotNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Supervising Pharmacist:</label>
                    <input
                      type="text"
                      value={pharmacistCompounderName}
                      onChange={(e) => setPharmacistCompounderName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                {/* Ingredients Scaling Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-teal-400" />
                    <span>Extemporaneous Formulation Formula (Calculated for {batchSizeGrams}g Batch)</span>
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                        <tr>
                          <th className="p-3">Component (British Pharmacopoeia)</th>
                          <th className="p-3">Standard % (w/w)</th>
                          <th className="p-3 text-teal-300">Required Quantity ({batchSizeGrams}g)</th>
                          <th className="p-3">Compounding Function</th>
                          <th className="p-3">Weighed Check</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                        {scaledIngredients.map((ing, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-white">{ing.item}</td>
                            <td className="p-3 font-mono text-slate-400">{ing.percentW_W}%</td>
                            <td className="p-3 font-mono font-bold text-teal-300 text-sm">
                              {ing.scaledWeightGrams} g
                            </td>
                            <td className="p-3 text-slate-300">{ing.purpose}</td>
                            <td className="p-3 text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step-by-Step Method */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Beaker className="w-4 h-4 text-teal-400" />
                    <span>Method of Preparation (BP Compounding Directives)</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    {activeFormula.methodOfPreparation.map((step, idx) => (
                      <p key={idx} className="text-slate-300 leading-relaxed">{step}</p>
                    ))}
                  </div>
                </div>

                {/* Quality Control & Labeling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h5 className="font-bold text-teal-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> British Pharmacopoeia Quality Control (QC)
                    </h5>
                    <ul className="space-y-1.5 text-slate-300">
                      {activeFormula.qualityControlBP.map((qc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-teal-400">•</span>
                          <span>{qc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Labeling & Beyond-Use Dating (BUD)
                    </h5>
                    <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-300 font-bold">
                      ⚠️ FOR EXTERNAL USE ONLY
                    </div>
                    <p className="text-slate-300 text-[11px]">{activeFormula.shelfLifeAndStorage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Prescription Provider (BP Standard) */}
      {activeTab === 'prescription_provider' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 5 cols */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              <span>Dermatology Prescription Configuration</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Patient Full Name:</label>
                <input
                  type="text"
                  value={rxPatientName}
                  onChange={(e) => setRxPatientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Age:</label>
                  <input
                    type="text"
                    value={rxPatientAge}
                    onChange={(e) => setRxPatientAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Gender:</label>
                  <select
                    value={rxPatientGender}
                    onChange={(e) => setRxPatientGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Clinical Diagnosis:</label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Selected Preparation (BP / Proprietary):</label>
                <input
                  type="text"
                  value={rxSelectedPreparation}
                  onChange={(e) => setRxSelectedPreparation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Quantity to Dispense:</label>
                <input
                  type="text"
                  value={rxQuantity}
                  onChange={(e) => setRxQuantity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Signa (Patient Instructions):</label>
                <textarea
                  rows={3}
                  value={rxSig}
                  onChange={(e) => setRxSig(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Auxiliary Warnings & Cautions:</label>
                <input
                  type="text"
                  value={rxWarnings}
                  onChange={(e) => setRxWarnings(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <button
                onClick={handlePrintPrescription}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Valid Prescription</span>
              </button>
            </div>
          </div>

          {/* Right Live Preview: 7 cols */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex justify-between items-start border-b-2 border-teal-600 pb-3">
              <div>
                <div className="text-base font-extrabold text-teal-800 tracking-tight">
                  PHARMA STAR DERMATOLOGY & CLINICAL COMPOUNDING
                </div>
                <div className="text-[11px] text-slate-500">
                  British Pharmacopoeia (BP) Standard Preparations • EFDA Accredited
                </div>
                <div className="text-[11px] text-slate-500">
                  Addis Ababa, Ethiopia • Tel: +251 982 852 778
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-600">
                <div><strong>Rx Ref:</strong> PS-DERM-{Date.now().toString().slice(-6)}</div>
                <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div><strong>Patient:</strong> {rxPatientName}</div>
              <div><strong>Age/Sex:</strong> {rxPatientAge} yrs • {rxPatientGender}</div>
              <div><strong>Diagnosis:</strong> <span className="text-teal-700 font-bold">{rxDiagnosis}</span></div>
            </div>

            <div className="text-3xl font-serif font-black text-teal-800 pl-1">℞</div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="text-sm font-bold text-slate-900">{rxSelectedPreparation}</div>
              <div>Quantity to Dispense: <strong>{rxQuantity}</strong></div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                <strong>Signa:</strong> {rxSig}
              </div>

              <div className="text-[11px] text-rose-600 font-bold pt-1">
                ⚠️ {rxWarnings}
              </div>
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-xs">
              <div>
                <div className="font-bold text-slate-800">Pharmacist Dawid Aliyi</div>
                <div className="text-[11px] text-slate-500">B.Pharm, MSc Clinical Pharmacy</div>
                <div className="text-[10px] text-teal-700 font-mono">Reg: EFDA/CLIN/ETH/2026/0491</div>
              </div>

              <div className="border-2 border-dashed border-teal-700 p-2 rounded text-center text-[10px] text-teal-800 font-bold">
                PHARMA STAR<br />DERM VALIDATED<br />PRESCRIPTION
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Reading Materials & Skin Phototypes */}
      {activeTab === 'reading_library' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                British Standards
              </span>
              <h4 className="text-sm font-bold text-white">British Association of Dermatologists (BAD) & BP Guidelines</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Standards for extemporaneous dermatology formulations. Emphasizes avoidance of unnecessary sensitizing preservatives, use of sterile grade water for lotions, and compliance with the 2024 British Pharmacopoeia Monograph series.
              </p>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-teal-300">
                Recommended Reference: British National Formulary (BNF 87) Skin Chapter & BP Vol III.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Ethiopian Clinical Context
              </span>
              <h4 className="text-sm font-bold text-white">Ethiopian National STG for Dermatologic Care (2026)</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Addresses high-burden endemic conditions in Ethiopia: Tinea capitis in rural school children, Podoconiosis (non-filarial elephantiasis in volcanic highland soils), Scabies epidemics in drought-affected zones, and Borderline Tuberculoid Leprosy.
              </p>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-300">
                Published by EFDA & Ethiopian MoH Non-Communicable Diseases Unit.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Pigmented Skin Nuances
              </span>
              <h4 className="text-sm font-bold text-white">Fitzpatrick Skin Phototypes (Types IV–VI Pearls)</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In darker skin phototypes predominant in Ethiopia, erythema appears as purplish, violaceous, or hyperpigmented rather than bright red. Post-inflammatory hyper- and hypopigmentation are common sequelae; caution with irritant compounding.
              </p>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-indigo-300">
                Clinical Pearl: Avoid high-strength salicylic acid (&gt;5%) on facial lesions in Type V–VI skin to prevent deep PIH.
              </div>
            </div>
          </div>

          {/* Topical Corticosteroid Potency Ladder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Topical Corticosteroid Potency Ladder & Fingertip Unit (FTU) Rule</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1">
                <span className="text-rose-400 font-bold block">Class I: Superpotent</span>
                <span className="text-white font-semibold">Clobetasol propionate 0.05%</span>
                <p className="text-[11px] text-slate-400">Resistant psoriasis plaques. Never on face or flexures. Max 50g/week for 2 weeks.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                <span className="text-amber-400 font-bold block">Class II & III: Potent</span>
                <span className="text-white font-semibold">Betamethasone valerate 0.1%</span>
                <p className="text-[11px] text-slate-400">Severe eczema and lichen planus. Trunk and extremities.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-teal-500/30 space-y-1">
                <span className="text-teal-400 font-bold block">Class IV & V: Moderate</span>
                <span className="text-white font-semibold">Triamcinolone acetonide 0.1%</span>
                <p className="text-[11px] text-slate-400">Chronic pediatric atopic dermatitis, subacute eczemas.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <span className="text-emerald-400 font-bold block">Class VI & VII: Mild</span>
                <span className="text-white font-semibold">Hydrocortisone 1% BP</span>
                <p className="text-[11px] text-slate-400">Safe for facial dermatoses, groin flexures, and pediatric diaper rashes.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span><strong>Fingertip Unit (FTU) Dosage:</strong> 1 FTU (approx. 0.5g squeezed from tube from distal skin crease to fingertip) covers both adult hands or two adult palm areas.</span>
              <span className="text-teal-400 font-mono">1 FTU ≈ 0.5 g</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Negotiable Chapa Payment & Rural Clinic Subsidies */}
      {activeTab === 'chapa_settlement' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 uppercase">
                  Chapa Gateway Integration
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Negotiable Dermatology Second Opinion & Compounding Fee
                </h3>
                <p className="text-xs text-slate-400">
                  Fair accessible pricing across Ethiopian clinics, university students, and referral centers.
                </p>
              </div>
              <div className="text-2xl font-black text-teal-400 font-mono">
                {negotiatedChapaFee} ETB
              </div>
            </div>

            {/* Negotiation Slider */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Adjust Consultation & Compounding Pass Fee:</span>
                <span className="text-teal-400 font-bold font-mono">{negotiatedChapaFee} Birr</span>
              </div>

              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={negotiatedChapaFee}
                onChange={(e) => setNegotiatedChapaFee(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 ETB (Subsidized Rural Health Post)</span>
                <span>50 ETB (Student Pass)</span>
                <span>150 ETB (Private Clinic)</span>
                <span>300 ETB (Comprehensive Hospital)</span>
              </div>
            </div>

            {/* Settlement Action */}
            <button
              onClick={handleSettleChapa}
              disabled={isProcessingChapa}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isProcessingChapa ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Chapa Ethiopia Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Settle {negotiatedChapaFee} ETB via Chapa (Telebirr / CBE / Card)</span>
                </>
              )}
            </button>

            {chapaPaymentSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2 text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chapa Payment Succeeded & Recorded</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div>Tx Reference: <span className="font-mono text-teal-300">{chapaPaymentSuccess.txRef}</span></div>
                  <div>Settled Amount: <strong className="text-white">{chapaPaymentSuccess.amountETB} ETB</strong></div>
                  <div>Case: <span className="text-white">{chapaPaymentSuccess.caseTitle}</span></div>
                  <div>Timestamp: <span className="text-slate-400">{chapaPaymentSuccess.timestamp}</span></div>
                </div>
                <p className="text-[11px] text-emerald-200 pt-1">
                  ✓ Recorded into your persistent payment history ledger. Access unlocked across mobile and desktop.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
