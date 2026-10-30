export type Language = 'en' | 'am' | 'om' | 'fr' | 'ar' | 'es';

export interface PaymentRecord {
  id: string;
  transactionRef: string; // CBE Ref or Telebirr Txn
  paymentMethod: 'CBE Birr' | 'Telebirr' | 'Awash Bank' | 'PayPal / Card' | 'Direct Agent';
  amountETB: number;
  serviceName: string;
  serviceId: string; // e.g. 'exit_exam', 'ngat', 'wholesaler_quarterly', 'registration', 'cpd_certificate', etc.
  timestamp: string;
  status: 'verified' | 'pending' | 'completed';
  payerPhone?: string;
  payerName?: string;
  expiryDate?: string;
  notes?: string;
}

export interface User {
  username: string;
  isPro: boolean;
  fullName: string;
  email?: string;
  phone?: string;
  role: 'student' | 'pharmacist' | 'physician' | 'intern';
  cbeReference?: string;
  registrationDate: string;
  offlineReady: boolean;
  membershipId?: string;
  paymentMethod?: string;
  registeredVia?: 'automated_payment' | 'manual' | 'demo';
  activatedAt?: string;
  unlockedCourseIds?: string[];
  unlockedStoreMonitor?: boolean;
  unlockedAutoReader?: boolean;
  unlockedVoiceGeminiAgent?: boolean;
  unlockedPharmaTube?: boolean;
  unlockedDocToPpt?: boolean;
  unlockedExitExam?: boolean;
  unlockedNgat?: boolean;
  unlockedWholesaler?: boolean;
  wholesalerSubscriptionExpiresAt?: string;
  isInstitutionSubscribed?: boolean;
  institutionName?: string;
  institutionId?: string;
  institutionRole?: string;
  region?: string;
  country?: string;
  department?: string;
  university?: string;
  organization?: string;
  rememberMe?: boolean;
  payments?: PaymentRecord[];
}

export interface CourseQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTopic: string;
  clinicalPearl?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  summary: string;
  content: string;
  clinicalPearls: string[];
  keyDrugsOrConcepts: string[];
  recommendedReadings?: string[];
  referenceTextbookChapters?: string[];
}

export interface RecognizedTextbook {
  title: string;
  authors: string;
  edition: string;
  recognizingBody: 'FIP (International Pharmaceutical Federation)' | 'ASHP (American Society of Health-System Pharmacists)' | 'ACCP (American College of Clinical Pharmacy)' | 'Ethiopian Pharmaceutical Association (EPA)' | 'WHO / EFDA' | 'Royal Pharmaceutical Society (RPS)';
  isbn?: string;
  description: string;
  keyChapters: string[];
  downloadOrReadLink?: string;
}

export interface FurtherReadingMaterial {
  title: string;
  source: string;
  year: string;
  type: 'Guideline' | 'Clinical Review' | 'Practice Standard' | 'Systematic Review';
  summary: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  level: string;
  duration: string;
  category: 'clinical' | 'pharmaceutics' | 'chemistry' | 'internship' | 'basic_sciences';
  icon: string;
  description: string;
  priceETB: number;
  learningObjectives: string[];
  modules: CourseModule[];
  quizQuestions?: CourseQuizQuestion[];
  has3DModel?: boolean;
  moaModelId?: string;
  videoDuration: string;
  recognizedTextbooks?: RecognizedTextbook[];
  furtherReadingMaterials?: FurtherReadingMaterial[];
}

export interface BinCardItem {
  id: string;
  itemCode: string;
  drugName: string;
  dosageForm: string;
  strength: string;
  unitOfIssue: string;
  batchNumber: string;
  expiryDate: string;
  folderId: string;
  shelfLocation: string;
  beginningBalance: number;
  quantityReceived: number;
  quantityIssued: number;
  lossOrAdjustment: number;
  endingBalance: number;
  calculatedLedgerBalance: number;
  discrepancy: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  averageMonthlyConsumption: number;
  daysOutOfStock: number;
  status: 'adequate' | 'near_expiry' | 'low_stock' | 'stockout';
  lastUpdated: string;
  auditedBy: string;
  notes?: string;
  scannedDocumentUrl?: string;
}

export interface DigitalFolder {
  id: string;
  name: string;
  description: string;
  department: string;
  itemCount: number;
  totalStockUnits: number;
  nearExpiryCount: number;
  stockoutCount: number;
}

export interface IFRRReport {
  id: string;
  reportNumber: string;
  facilityName: string;
  healthFacilityType: 'Hospital' | 'Health Center' | 'Specialized Clinic';
  dispensaryUnit: string;
  reportingPeriod: string;
  datePrepared: string;
  storekeeperName: string;
  storekeeperEmail: string;
  dispensaryHeadName: string;
  leadPharmacist: string;
  items: {
    itemId: string;
    drugName: string;
    unit: string;
    beginningBalance: number;
    quantityReceived: number;
    quantityDispensed: number;
    lossAndAdjustment: number;
    endingBalance: number;
    daysOutOfStock: number;
    amc: number;
    monthsOfStockOnHand: number;
    maxStockQuantity: number;
    quantityRequested: number;
    remarks: string;
  }[];
  totalItems: number;
  status: 'draft' | 'emailed' | 'approved_by_store';
  emailDispatchedAt?: string;
  emailMessageId?: string;
}

export interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'major' | 'moderate' | 'minor';
  mechanism: string;
  clinicalEffect: string;
  management: string;
  alternatives: string[];
  cypEnzyme?: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: 'renal' | 'hepatic' | 'hematology' | 'cardiac_electrolytes' | 'tdm' | 'endocrine' | 'coagulation';
  standardUnit: string;
  maleRange: string;
  femaleRange: string;
  minNormal: number;
  maxNormal: number;
  criticalLow?: number;
  criticalHigh?: number;
  description: string;
  highSignificance: string;
  lowSignificance: string;
  pharmacistAction: string;
  dosingAdjustments?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female';
  weightKg: number;
  heightCm: number;
  serumCreatinine: number;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: {
    drugName: string;
    dose: string;
    frequency: string;
    indication: string;
    startDate: string;
  }[];
  soapNotes: {
    id: string;
    date: string;
    author: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }[];
}

export interface MedicationScheduleItem {
  id: string;
  patientName: string;
  drugName: string;
  dose: string;
  frequency: string;
  timing: ('morning' | 'noon' | 'evening' | 'bedtime')[];
  withFood: 'before' | 'with' | 'after' | 'any';
  remainingPills: number;
  refillReminderThreshold: number;
  prescribedFor: string;
  takenToday: {
    morning?: boolean;
    noon?: boolean;
    evening?: boolean;
    bedtime?: boolean;
  };
}

export interface Guideline {
  id: string;
  title: string;
  authority: string;
  jurisdiction: 'National (Ethiopia)' | 'International';
  year: string;
  status: 'Latest 2026' | 'Updated 2025' | 'Active Standard';
  category: 'Infectious Disease' | 'Cardiology' | 'Endocrinology' | 'Nephrology' | 'Respiratory' | 'Formulary / STG';
  summary: string;
  keyPoints: string[];
  sourceUrlName: string;
  offlineCached: boolean;
  downloadSize: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pharmacist' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  category?: string;
  isClinicalCard?: boolean;
  clinicalData?: {
    drugName?: string;
    recommendation?: string;
    warning?: string;
    doseAdvice?: string;
  };
}

export interface CPDQuizQuestion {
  id: string;
  question: string;
  scenario?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  guidelineReference: string;
}

export interface CPDModule {
  id: string;
  courseCode: string;
  courseTitle: string;
  category: string;
  ceuCredits: number; // e.g. 10 or 15 CEU points
  accreditationAuthority: string; // "EFDA & Ethiopian Ministry of Health (MoH)"
  standardFeeETB: number; // 200 - 500 ETB
  internationalFeeUSD: number; // $5.00 - $10.00
  durationHours: string;
  passingScorePercent: number; // 70%
  description: string;
  competencyObjectives: string[];
  questions: CPDQuizQuestion[];
}

export interface IssuedCPDCertificate {
  id: string;
  certificateNumber: string;
  candidateName: string;
  licenseNumber: string;
  courseCode: string;
  courseTitle: string;
  ceuCredits: number;
  scoreAchievedPercent: number;
  issueDate: string;
  expiryDate: string;
  issuerName: string;
  issuerTitle: string;
  institution: string;
  accreditationBody: string;
  paymentReference: string;
  feePaidETB: number;
  status: 'valid' | 'verified';
}

export type PaymentMethodType = 'cbe' | 'telebirr' | 'cbe_birr' | 'chapa' | 'awash' | 'dashen' | 'card_international' | 'free_demo';

export interface ConsultationBooking {
  id: string;
  clientName: string;
  contactEmailOrPhone: string;
  consultationType: 'mtm_review' | 'renal_hepatic_dosing' | 'oncology_antimicrobial' | 'polypharmacy_deprescribing' | 'academic_mentorship';
  preferredDate: string;
  preferredTimeSlot: string;
  patientClinicalSummary: string;
  feeETB: number;
  feeUSD: number;
  paymentMethod: PaymentMethodType;
  paymentReference: string;
  status: 'confirmed' | 'pending_verification' | 'completed';
  consultantName: string; // "Pharmacist Dawid Aliyi, BCPS"
  meetingLinkOrLocation: string;
}

export interface SponsorshipPartner {
  id: string;
  companyName: string;
  category: 'Pharmaceutical Manufacturer' | 'Medical Equipment' | 'Health NGO / Healthcare Group' | 'Academic Publisher';
  tier: 'Platinum Clinical Partner' | 'Gold Educational Sponsor' | 'Silver Module Sponsor';
  sponsoredArea: string;
  logoText: string;
  originCountry: string;
  description: string;
  accreditedSince: string;
  verifiedStatus: boolean;
}

export interface PrescriptionMedication {
  drugName: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  indication: string;
  renalAdjustmentNeeded?: boolean;
  hepaticAdjustmentNeeded?: boolean;
  statusNote?: string;
}

export interface PrescriptionClinicalIssue {
  id: string;
  type: 'interaction' | 'renal_hepatic' | 'duplication' | 'contraindication' | 'adr' | 'dosing';
  severity: 'contraindicated' | 'major' | 'moderate' | 'caution';
  title: string;
  detail: string;
  recommendation: string;
}

export interface PrescriptionReviewItem {
  id: string;
  prescriptionNumber: string;
  facilityName: string;
  department: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: 'Male' | 'Female';
  weightKg: number;
  serumCreatinine: number; // mg/dL
  eGFR: number; // mL/min/1.73m2
  allergies: string[];
  diagnoses: string[];
  prescriber: {
    name: string;
    title: string;
    facility: string;
    department: string;
    contact: string;
  };
  medications: PrescriptionMedication[];
  auditChecklist: {
    id: string;
    label: string;
    passed: boolean;
    note?: string;
  }[];
  identifiedIssues: PrescriptionClinicalIssue[];
  pharmacistDecision: 'approved' | 'clarification_needed' | 'alternative_proposed' | 'dose_modified' | 'rejected_safety';
  pharmacistRecommendationNote: string;
  reviewedBy: string;
  reviewedAt: string;
  reviewStatus: 'completed' | 'in_review' | 'pending';
  digitalSignatureRef: string;
}

export interface SiteHealthcareProviderMessage {
  id: string;
  siteId: string;
  siteName: string;
  department: string;
  senderName: string;
  senderRole: 'Clinical Pharmacist' | 'Attending Physician' | 'Chief Resident' | 'Ward Nurse' | 'Lab Specialist';
  urgency: 'STAT' | 'Urgent' | 'Routine' | 'Discharge';
  patientRef: string;
  patientInitials: string;
  topic: string;
  message: string;
  recommendation?: string;
  status: 'open' | 'in_discussion' | 'resolved' | 'acknowledged';
  timestamp: string;
  replies: {
    id: string;
    senderName: string;
    senderRole: string;
    message: string;
    timestamp: string;
  }[];
}

export interface InstitutionalCircular {
  id: string;
  circularNo: string;
  issuingAuthority: 'EFDA (Ethiopian Food & Drug Authority)' | 'Federal Ministry of Health (MoH)' | 'Regional Health Bureau' | 'EPSS (Supply Service)' | 'University Teaching Hospital';
  title: string;
  category: 'Drug Recall / Safety Alert' | 'National Treatment Guideline Update' | 'Emergency Shortage Protocol' | 'Antimicrobial Stewardship Directive' | 'Institutional Circular';
  dateIssued: string;
  priority: 'Critical' | 'High' | 'Informational';
  content: string;
  actionRequired: string;
  targetFacilities: string[];
  officialDocNumber: string;
}

export interface DrugShortageExchange {
  id: string;
  initiatingFacility: string;
  facilityType: string;
  region: string;
  city: string;
  drugName: string;
  strength: string;
  dosageForm: string;
  exchangeType: 'Requesting Emergency Supply' | 'Surplus Available for Exchange';
  quantity: number;
  unit: string;
  urgency: 'STAT Emergency' | 'Urgent (< 24h)' | 'Planned Sharing';
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'in_transit' | 'completed';
  postedDate: string;
  notes?: string;
}

export interface InstitutionSubscription {
  id: string;
  institutionName: string;
  institutionType: 'Specialized Hospital' | 'General Hospital' | 'Health Center' | 'Regional Health Bureau' | 'University Pharmacy College' | 'Healthcare NGO';
  region: string;
  city: string;
  contactPerson: string;
  contactRole: string;
  email: string;
  phone: string;
  annualFeeETB: number; // 2000 ETB
  annualFeeUSD: number; // 20 USD
  paymentMethod: PaymentMethodType;
  paymentReference: string;
  status: 'active' | 'pending_verification' | 'expired';
  startDate: string;
  expiryDate: string;
  licenseKey: string;
  providerSeatsLimit: string;
  approvedBy: string;
}

export interface ResearchManuscript {
  id: string;
  doi: string;
  title: string;
  abstract: string;
  leadInstitution: string;
  irbApprovalNumber: string;
  researchCategory: 'Clinical Pharmacy & Therapeutics' | 'Pharmacovigilance & Drug Safety' | 'Traditional Herbal Medicine & Phytochemistry' | 'Antimicrobial Resistance (AMR)' | 'Health Economics & EPSS Supply Chain' | 'Pharmaceutics & Formulation';
  authors: {
    name: string;
    title: string;
    affiliation: string;
    email?: string;
    isCorresponding?: boolean;
  }[];
  keywords: string[];
  publicationStatus: 'published' | 'under_peer_review' | 'accepted_in_press' | 'submitted_pending_payment';
  submissionFeeETB: number; // 1,000 ETB
  submissionFeeUSD: number; // 10 USD
  paymentMethod?: PaymentMethodType;
  paymentReference?: string;
  submittedAt: string;
  publishedAt?: string;
  pdfDownloadUrl?: string;
  citationCount: number;
  peerReviewScore: number;
  chiefEditorSignoff: string;
  journalVolume: string;
  fullArticleText?: string;
}

export interface BarcodeScanResult {
  id: string;
  rawCode: string;
  format: 'GS1_DATAMATRIX' | 'QR_CODE' | 'EAN_13' | 'CODE_128';
  gtin: string;
  batchNumber: string;
  expiryDate: string;
  serialNumber?: string;
  drugName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  countryOfOrigin: string;
  importerInEthiopia?: string;
  efdaRegistrationNumber: string;
  safetyStatus: 'authentic_safe' | 'recalled_batch' | 'expired' | 'unregistered_warning';
  verificationTimestamp: string;
  verifiedBy: string;
  recallAlertDetails?: {
    recallCode: string;
    reason: string;
    directiveAction: string;
  };
  storageConditions: string;
  indications: string;
}

export interface AudioClinicalPearl {
  id: string;
  title: string;
  titleLocal: string;
  conceptTopic: string;
  category: 'Renal & Hepatic' | 'Cardiology' | 'Respiratory & Asthma' | 'Pediatrics' | 'Antimicrobial Stewardship' | 'Endocrine & Insulin';
  durationSeconds: number;
  durationFormatted: string;
  language: 'am' | 'om' | 'en';
  speakerName: string;
  speakerTitle: string;
  audioTranscript: string;
  voiceSynthesisText: string;
  keyTakeaways: string[];
  clinicalSignificance: string;
  guidelineReference: string;
}

export interface TracerMedicineStock {
  drugName: string;
  strength: string;
  dosageForm: string;
  quantityAvailable: number;
  unit: string;
  monthsOfStock: number;
  status: 'adequate' | 'low_stock' | 'critical_stockout';
  leadTimeDays: number;
}

export interface EPSSRegionalHub {
  id: string;
  hubName: string;
  hubCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  mapX: number; // Percentage for SVG map positioning
  mapY: number;
  leadCoordinator: string;
  contactPhone: string;
  contactEmail: string;
  servicedFacilitiesCount: number;
  overallSupplyIndexPercent: number;
  emergencyTransferActive: boolean;
  tracerStock: TracerMedicineStock[];
  lastSyncTimestamp: string;
}

export interface PaymentWebhookEvent {
  id: string;
  gateway: 'telebirr' | 'chapa' | 'cbe_birr' | 'cbe_bank';
  eventType: 'payment.success' | 'payment.failed' | 'payment.pending';
  transactionRef: string;
  externalTransactionId: string;
  amountETB: number;
  customerPhoneOrEmail: string;
  customerName: string;
  serviceType: 'pro_account' | 'cpd_certificate' | 'course_pass' | 'store_monitor' | 'institution_annual' | 'research_publication' | 'anti_counterfeit_pass' | 'auto_reader' | 'gemini_voice_agent' | 'pharmatube_entertainment' | 'doc_to_ppt';
  verifiedAt: string;
  signatureHmac: string;
  status: 'verified_active' | 'processing' | 'rejected';
  associatedUserId?: string;
}

export interface GeminiVoiceAgentConfig {
  gender: 'male' | 'female';
  personaName: string;
  specialtyTitle: string;
  avatarUrl: string;
  pitch: number;
  rate: number;
  language: 'en' | 'am' | 'om';
  voiceStyle: string;
  greetingMessage: string;
  sampleQuestions: string[];
}

export interface VoiceConversationMessage {
  id: string;
  sender: 'user' | 'gemini_supporter';
  speakerName: string;
  text: string;
  timestamp: string;
  audioDurationSec?: number;
  clinicalTopic?: string;
  stgReference?: string;
}

export interface PharmaTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
  category: 'study_beats' | 'pharmacology_3d' | 'ethiopian_health' | 'clinical_cases' | 'ted_medicine' | 'stress_relief_comedy';
  channelTitle: string;
  durationFormatted: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
}

export interface SlideItem {
  id: string;
  slideNumber: number;
  layout: 'title' | 'agenda' | 'content_bullets' | 'two_column' | 'clinical_case' | 'moa_pharmacology' | 'conclusion';
  title: string;
  subtitle?: string;
  bullets?: string[];
  leftColumnTitle?: string;
  leftColumnBullets?: string[];
  rightColumnTitle?: string;
  rightColumnBullets?: string[];
  calloutBadge?: string;
  calloutText?: string;
  speakerNotes?: string;
}

export type SlideTheme = 'emerald_pharma' | 'midnight_clinical' | 'academic_slate' | 'crisp_minimal';

export interface SlideDeck {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  institution: string;
  date: string;
  theme: SlideTheme;
  slides: SlideItem[];
  sourceDocumentName?: string;
  generatedAt: string;
}

export interface WholesalerItem {
  id: string;
  itemName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  quantityAvailable: number;
  unitPriceETB: number;
  unitOfMeasure: string;
  batchNumber: string;
  expiryDate: string;
  wholesalerId: string;
  wholesalerName: string;
  wholesalerLocation: string;
  wholesalerPhone: string;
  minimumOrderQuantity: number;
  efdaRegistered: boolean;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface WholesalerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  itemId?: string;
  itemName?: string;
  messageText: string;
  timestamp: string;
  status: 'sent' | 'read' | 'replied';
}

export interface WholesalerSubscription {
  id: string;
  wholesalerName: string;
  wholesalerId: string;
  licenseNo: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  region: string;
  city: string;
  quarterlyFeeETB: number; // 500 ETB
  paymentMethod: PaymentMethodType;
  paymentReference: string;
  status: 'active' | 'pending_verification' | 'expired';
  startDate: string;
  expiryDate: string; // 3 months
  subscriptionPeriod: '3_months';
  approvedBy: string;
}

export interface ExitExamQuestion {
  id: string;
  domain: 'Clinical Pharmacy' | 'Pharmacology & Toxicology' | 'Pharmaceutics & Formulation' | 'Medicinal Chemistry' | 'Social & Administrative Pharmacy' | 'NGAT Core Aptitude';
  questionText: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  stgReference: string;
  difficulty: 'Standard Exit Exam' | 'High-Yield Board Level';
}
