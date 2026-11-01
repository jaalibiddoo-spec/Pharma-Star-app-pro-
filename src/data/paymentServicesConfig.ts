export interface PaymentServiceItem {
  id: string;
  name: string;
  category: 'clinical_education' | 'board_exams' | 'enterprise_facility' | 'telehealth' | 'research_publishing' | 'logistics' | 'connectivity';
  priceETB: number;
  priceUSD: number;
  badge: string;
  description: string;
  benefits: string[];
  unlockKey: string;
}

export const PAYMENT_ACCOUNTS = {
  cbe: {
    name: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000262900367',
    accountHolder: 'Dawid Aliyi',
    branch: 'Addis Ababa Main / Nationwide',
    ussd: '*847#',
    instructions: 'Transfer the exact amount via CBE Mobile Banking App, Internet Banking, or any CBE branch nationwide to account 1000262900367.'
  },
  telebirr: {
    name: 'Telebirr (Ethio Telecom Mobile Money)',
    phone: '0982852778',
    accountHolder: 'Dawid Aliyi',
    ussd: '*127#',
    instructions: 'Send money via the Telebirr App or dial *127# to 0982852778. Instant automated confirmation available.'
  },
  cbeBirr: {
    name: 'CBE Birr (Commercial Bank USSD)',
    merchantCode: '262900',
    accountNumber: '1000262900367',
    accountHolder: 'Dawid Aliyi',
    ussd: '*847#',
    instructions: 'Dial *847# on your mobile, select Pay/Transfer -> Enter CBE Account 1000262900367 or Merchant Code 262900.'
  },
  chapa: {
    name: 'Chapa Unified Payment Gateway',
    provider: 'Chapa Financial Technologies S.C.',
    supportedChannels: ['Telebirr', 'CBE Birr', 'Awash Birr', 'Amole (Dashen)', 'Coop Bank', 'Bank of Abyssinia', 'Local Debit Cards'],
    instructions: 'Secure multi-bank gateway for instant domestic card and mobile wallet checkout with automated webhook settlement.'
  },
  international: {
    name: 'International Cards & Digital Wallets',
    supportedGateways: ['Visa', 'Mastercard', 'American Express', 'PayPal', 'Stripe Global', 'Apple Pay'],
    currency: 'USD',
    exchangeRateNote: 'Fair and feasible global medical education rate (1 USD ≈ 125 ETB subsidized tier).',
    instructions: 'Secure 256-bit SSL encrypted checkout for international physicians, pharmacists, healthcare NGOs, and diaspora supporters.'
  }
};

export const PHARMASTAR_SERVICES: PaymentServiceItem[] = [
  {
    id: 'pro_registration',
    name: 'PharmaStar Pro Lifetime All-Access & CPD Hub (Individual Pro)',
    category: 'clinical_education',
    priceETB: 1000,
    priceUSD: 10.00,
    badge: 'Individual Pro Lifetime',
    description: 'Complete lifetime individual pro access to all 30+ clinical modules, 3D molecular kinetics, ABC-VEN DTC suite, DAGU eLMIS, and Chapa/Telebirr/CBE instant unlock.',
    benefits: [
      'Lifetime individual access to all clinical modules & simulators',
      'Downloadable MoH/EFDA accredited certificates with QR verify',
      'Chapa instant multi-bank payment & Telebirr/CBE settlement',
      'ABC-VEN Analysis, DAGU 2.0 eLMIS & Facility Medicine List'
    ],
    unlockKey: 'isPro'
  },
  {
    id: 'exit_exam',
    name: 'Ethiopian Pharmacy Exit Exam & NGAT Board Simulator',
    category: 'board_exams',
    priceETB: 50,
    priceUSD: 0.50,
    badge: 'Student Special',
    description: 'High-yield 300+ question bank, timed mock examination engines, and rationales strictly aligned with the Ministry of Education (MoE) blueprint.',
    benefits: [
      'Simulated national exit exam interface with timer',
      'Categorized by domain (Clinical, Pharmacology, Pharmaceutics, SAP)',
      'Detailed rationale citations for every answer option',
      'NGAT quantitative reasoning and aptitude questions'
    ],
    unlockKey: 'unlockedExitExam'
  },
  {
    id: 'wholesaler',
    name: 'Wholesaler Inventory & B2B Facility Communication Portal',
    category: 'enterprise_facility',
    priceETB: 500,
    priceUSD: 5.00,
    badge: '3-Month B2B License',
    description: 'Verified pharmaceutical wholesaler listing, real-time batch inventory broadcasting, and direct encrypted messaging with hospital procurement heads.',
    benefits: [
      'Full 3-month verified supplier badge in hospital network',
      'Publish bulk stock, batches, and price lists',
      'Receive official RFQs and purchase requisitions',
      'EFDA registration badge on listings'
    ],
    unlockKey: 'unlockedWholesaler'
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine & Telepharmacy Virtual Consultation Room',
    category: 'telehealth',
    priceETB: 150,
    priceUSD: 2.00,
    badge: 'Per Session',
    description: 'Encrypted HD audio/video virtual telepharmacy consultation room with screen-sharing, digital e-prescribing, and MTM review.',
    benefits: [
      'Encrypted peer-to-peer WebRTC video/audio consult',
      'Integrated e-prescriptions with digital signature',
      'Pharmacist Medication Therapy Management (MTM)',
      'Flexible settlement via Telebirr or Chapa'
    ],
    unlockKey: 'unlockedTelemedicine'
  },
  {
    id: 'radiology_portal',
    name: 'Multimodal Radiology & Imaging Interpretation Portal',
    category: 'telehealth',
    priceETB: 100,
    priceUSD: 1.00,
    badge: 'Per Case Review',
    description: 'Interactive DICOM/PDF viewer with contrast, brightness, zoom, and invert windowing controls for Chest X-Rays, CT scans, and MRI teaching cases.',
    benefits: [
      'High-resolution multi-contrast windowing viewer',
      'Verified clinical teaching cases with radiological reports',
      'Direct upload of patient scans and ultrasound reports',
      'Expert radiologist second opinion triage'
    ],
    unlockKey: 'unlockedRadiology'
  },
  {
    id: 'dagu_elmis',
    name: 'DAGU 2.0 eLMIS & Store Supply Chain Facility Suite',
    category: 'logistics',
    priceETB: 100,
    priceUSD: 1.50,
    badge: 'Facility License',
    description: 'Full Ethiopian Integrated Pharmaceuticals Logistics System (IPLS): Automated AMC, MOS, Bimonthly RRF to EPSS Hubs, Model 19 GRV / Model 22 SIV.',
    benefits: [
      'Electronic bin cards and warehouse stockcard ledger',
      'Automated 11-column Bimonthly RRF calculation',
      'EPSS Regional Hub electronic order transmission',
      'Physical count variance audit & cold chain logger'
    ],
    unlockKey: 'unlockedStoreMonitor'
  },
  {
    id: 'epidemic_cpd',
    name: 'National Epidemic & Outbreak Emergency Stewardship CPD',
    category: 'clinical_education',
    priceETB: 100,
    priceUSD: 1.00,
    badge: '15 CEU Credits',
    description: 'Comprehensive emergency clinical response modules for Cholera, Mpox, Marburg virus, Dengue, and Avian Influenza with MoH/EFDA CEU certification.',
    benefits: [
      '15 verified Continuing Education Unit (CEU) credits',
      'MoH emergency clinical management protocols',
      'Interactive outbreak containment case simulations',
      'Instant PDF certificate generation with QR verification'
    ],
    unlockKey: 'unlockedOutbreakCPD'
  },
  {
    id: 'research_publishing',
    name: 'Ethiopian Pharmaceutical Research Peer-Review & Archival Publishing',
    category: 'research_publishing',
    priceETB: 1000,
    priceUSD: 10.00,
    badge: 'Academic DOI',
    description: 'Fast-track double-blind peer review by Ethiopian university pharmacy faculty, DOI assignment, and open-access archival publication.',
    benefits: [
      'Fast-track 14-day double-blind peer review',
      'Crossref DOI assignment & Google Scholar indexing',
      'Open-access archival in Ethiopian Pharmaceutical Repository',
      'Certificate of Academic Authorship'
    ],
    unlockKey: 'unlockedResearch'
  },
  {
    id: 'institutional_sponsor',
    name: 'Enterprise Institutional B2B Sponsor Dashboard (Annual License)',
    category: 'enterprise_facility',
    priceETB: 2000,
    priceUSD: 20.00,
    badge: 'Annual Hospital/Univ',
    description: 'Institutional sponsorship for hospitals, university pharmacy schools, and health bureaus to monitor staff CEU compliance and training rosters.',
    benefits: [
      'Unlimited staff and student enrollment seats',
      'Institutional Audit Trail & CEU progress dashboard',
      'Bulk certification export and compliance verification',
      'Direct link to Ministry of Health human resources database'
    ],
    unlockKey: 'unlockedInstitution'
  },
  {
    id: 'internet_package',
    name: 'Ethio Telecom Subsidized Health Worker Internet Bundle',
    category: 'connectivity',
    priceETB: 100,
    priceUSD: 1.00,
    badge: '15 GB Monthly',
    description: 'Subsidized Ethio Telecom high-speed 4G/5G data package delivered directly to healthcare professionals for uninterrupted clinical access.',
    benefits: [
      '15 GB monthly educational clinical data bundle',
      'Direct top-up to any Ethio Telecom SIM card',
      'Instant activation upon Telebirr or CBE settlement',
      'Zero-rate browsing on national guideline portals'
    ],
    unlockKey: 'unlockedInternet'
  },
  {
    id: 'single_course',
    name: 'Individual Masterclass Course Pass',
    category: 'clinical_education',
    priceETB: 100,
    priceUSD: 1.00,
    badge: 'Single Course',
    description: 'Full individual access to any single specialized lecture course, video presentations, 3D molecular targets, and end-of-course exam.',
    benefits: [
      'Complete video lecture streaming',
      '3D drug kinetics visualizer access',
      'Downloadable lecture slide decks (PPT/PDF)',
      'Individual verified course completion badge'
    ],
    unlockKey: 'unlockedSingleCourse'
  },
  {
    id: 'gemini_voice',
    name: 'Clinical AI Voice Agent & PharmaTube Premium Entertainment',
    category: 'clinical_education',
    priceETB: 100,
    priceUSD: 1.00,
    badge: 'Interactive Audio',
    description: 'Real-time two-way voice clinical pharmacology discussions and uninterrupted background pharmaceutical study music and videos.',
    benefits: [
      'Two-way audio dialogue with clinical pharmacology specialist',
      'Curated study beats, lo-fi medicine, and clinical podcasts',
      'Automated document to PowerPoint presentation generator',
      'Offline audio lecture caching'
    ],
    unlockKey: 'unlockedVoiceGeminiAgent'
  }
];
