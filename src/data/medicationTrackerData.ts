import { MedicationScheduleItem } from '../types';

export const initialMedicationSchedules: MedicationScheduleItem[] = [
  {
    id: "med-1",
    patientName: "Abebe Kebede",
    drugName: "Lisinopril 20 mg",
    dose: "1 Tablet (20 mg)",
    frequency: "Once Daily",
    timing: ["morning"],
    withFood: "any",
    remainingPills: 18,
    refillReminderThreshold: 7,
    prescribedFor: "Hypertension & Heart Failure",
    takenToday: {
      morning: true
    }
  },
  {
    id: "med-2",
    patientName: "Abebe Kebede",
    drugName: "Carvedilol 12.5 mg",
    dose: "1 Tablet (12.5 mg)",
    frequency: "Twice Daily",
    timing: ["morning", "evening"],
    withFood: "with",
    remainingPills: 24,
    refillReminderThreshold: 10,
    prescribedFor: "Cardioprotection HFrEF",
    takenToday: {
      morning: true,
      evening: false
    }
  },
  {
    id: "med-3",
    patientName: "Abebe Kebede",
    drugName: "Empagliflozin 10 mg",
    dose: "1 Tablet (10 mg)",
    frequency: "Once Daily",
    timing: ["morning"],
    withFood: "any",
    remainingPills: 6,
    refillReminderThreshold: 7,
    prescribedFor: "Cardiorenal protection & T2D",
    takenToday: {
      morning: false
    }
  },
  {
    id: "med-4",
    patientName: "Chaltu Tolosa",
    drugName: "Warfarin 5 mg",
    dose: "1 Tablet (5 mg)",
    frequency: "Once Daily Evening",
    timing: ["evening"],
    withFood: "any",
    remainingPills: 14,
    refillReminderThreshold: 7,
    prescribedFor: "Atrial Fibrillation Anticoagulation",
    takenToday: {
      evening: false
    }
  },
  {
    id: "med-5",
    patientName: "Chaltu Tolosa",
    drugName: "Budesonide/Formoterol Inhaler",
    dose: "2 Puffs (160/4.5 mcg)",
    frequency: "Twice Daily",
    timing: ["morning", "bedtime"],
    withFood: "any",
    remainingPills: 45,
    refillReminderThreshold: 15,
    prescribedFor: "Asthma Maintenance & Anti-inflammatory Reliever",
    takenToday: {
      morning: true,
      bedtime: false
    }
  }
];
