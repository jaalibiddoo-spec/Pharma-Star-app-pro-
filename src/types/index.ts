export type Language = 'en' | 'am' | 'om' | 'fr' | 'ar' | 'es';

export interface User {
  username: string;
  isPro: boolean;
  fullName: string;
  email?: string;
  role: 'student' | 'pharmacist' | 'physician' | 'intern';
  cbeReference?: string;
  registrationDate: string;
  offlineReady: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  summary: string;
  content: string;
  clinicalPearls: string[];
  keyDrugsOrConcepts: string[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  level: string;
  duration: string;
  category: 'clinical' | 'pharmaceutics' | 'chemistry' | 'internship';
  icon: string;
  description: string;
  learningObjectives: string[];
  modules: CourseModule[];
  has3DModel?: boolean;
  moaModelId?: string;
  videoDuration: string;
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
