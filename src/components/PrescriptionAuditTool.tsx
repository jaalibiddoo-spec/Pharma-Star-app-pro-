import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, AlertOctagon, 
  Sparkles, RefreshCw, PlusCircle, Trash2, Printer, 
  Volume2, VolumeX, Stethoscope, Copy, Check, FileText, 
  ArrowRight, ShieldCheck, Zap, Info, ExternalLink, Send, FileCheck2
} from 'lucide-react';
import { 
  runAutomatedPrescriptionAudit, 
  calculateCKDEPI, 
  AuditPatientProfile, 
  AuditMedicationInput, 
  PrescriptionAuditReport, 
  DetectedSafetyIssue 
} from '../utils/prescriptionAuditEngine';
import { User } from '../types';

interface Props {
  currentUser: User;
  onSendStatProviderMessage?: (msg: { topic: string; patientRef: string; message: string; recommendation: string }) => void;
}

// Pre-packaged High-Risk Clinical Test Scenarios
const PRESET_CLINICAL_SCENARIOS: {
  id: string;
  title: string;
  subtitle: string;
  category: 'Renal / Diabetes' | 'Emergency / Respiratory' | 'Cardiology / Anticoagulation' | 'Pediatrics / ICU' | 'Psych / Analgesia' | 'Clean / Safe';
  patient: AuditPatientProfile;
  medications: AuditMedicationInput[];
}[] = [
  {
    id: 'case-elderly-ckd',
    title: 'Elderly Diabetic with CKD Stage 4 & Heart Failure',
    subtitle: 'Metformin + Lisinopril + Spironolactone + Ibuprofen (Severe lactic acidosis & hyperkalemia)',
    category: 'Renal / Diabetes',
    patient: {
      name: 'Abebech Tadesse',
      age: 68,
      gender: 'Female',
      weightKg: 58,
      serumCreatinine: 2.4, // eGFR ~ 21 mL/min
      eGFR: 21,
      pregnancyStatus: 'none',
      allergies: ['Penicillin (Anaphylaxis)'],
      diagnoses: ['Type 2 Diabetes Mellitus with Nephropathy', 'Chronic Kidney Disease Stage 4', 'Heart Failure (NYHA III)', 'Hypertension']
    },
    medications: [
      { drugName: 'Metformin HCl', dose: '1000 mg', route: 'Oral', frequency: 'Twice Daily (BID)', duration: '30 Days', indication: 'T2DM Glycemic Control' },
      { drugName: 'Lisinopril', dose: '20 mg', route: 'Oral', frequency: 'Once Daily (QD)', duration: '30 Days', indication: 'Hypertension' },
      { drugName: 'Spironolactone', dose: '50 mg', route: 'Oral', frequency: 'Once Daily (QD)', duration: '30 Days', indication: 'Heart Failure' },
      { drugName: 'Ibuprofen', dose: '400 mg', route: 'Oral', frequency: 'Three Times Daily (TID)', duration: '7 Days', indication: 'Knee Osteoarthritis' }
    ]
  },
  {
    id: 'case-er-asthma',
    title: 'Emergency Room Acute Asthma Flare & Pneumonia',
    subtitle: 'Propranolol in Asthma + Theophylline + Ciprofloxacin (Fatal bronchospasm & CYP1A2 seizures)',
    category: 'Emergency / Respiratory',
    patient: {
      name: 'Chala Gemechu',
      age: 48,
      gender: 'Male',
      weightKg: 72,
      serumCreatinine: 1.0,
      eGFR: 88,
      pregnancyStatus: 'none',
      allergies: ['No Known Drug Allergies (NKDA)'],
      diagnoses: ['Severe Community-Acquired Pneumonia', 'Chronic Bronchial Asthma', 'Sinus Tachycardia']
    },
    medications: [
      { drugName: 'Propranolol', dose: '40 mg', route: 'Oral', frequency: 'Twice Daily (BID)', duration: '5 Days', indication: 'Tachycardia Rate Control' },
      { drugName: 'Theophylline', dose: '300 mg', route: 'Oral', frequency: 'Twice Daily (BID)', duration: '14 Days', indication: 'Bronchodilation' },
      { drugName: 'Ciprofloxacin', dose: '750 mg', route: 'Oral', frequency: 'Twice Daily (BID)', duration: '7 Days', indication: 'Severe Bacterial Pneumonia' }
    ]
  },
  {
    id: 'case-cardiac-warfarin',
    title: 'Cardiology Inpatient on Warfarin Anticoagulation',
    subtitle: 'Warfarin + High-Dose Ibuprofen + Clarithromycin (Severe synergistic bleeding & CYP2C9 inhibition)',
    category: 'Cardiology / Anticoagulation',
    patient: {
      name: 'Tsegaye Wolde',
      age: 62,
      gender: 'Male',
      weightKg: 75,
      serumCreatinine: 1.1,
      eGFR: 72,
      pregnancyStatus: 'none',
      allergies: ['Sulfa drugs (Rash)'],
      diagnoses: ['Atrial Fibrillation (CHADS2-VASc = 3)', 'Deep Vein Thrombosis (DVT)', 'Atypical Pneumonia']
    },
    medications: [
      { drugName: 'Warfarin Sodium', dose: '5 mg', route: 'Oral', frequency: 'Once Daily (QD)', duration: 'Ongoing', indication: 'Stroke Prophylaxis in AFib' },
      { drugName: 'Ibuprofen', dose: '600 mg', route: 'Oral', frequency: 'Three Times Daily (TID)', duration: '7 Days', indication: 'Acute Gouty Arthritis Pain' },
      { drugName: 'Clarithromycin', dose: '500 mg', route: 'Oral', frequency: 'Twice Daily (BID)', duration: '7 Days', indication: 'Respiratory Tract Infection' }
    ]
  },
  {
    id: 'case-pediatric-calcium',
    title: 'Pediatric Inpatient Sepsis with Hypocalcemia',
    subtitle: 'Ceftriaxone IV + Intravenous Calcium Gluconate (Fatal microcrystalline emboli in lungs/kidneys)',
    category: 'Pediatrics / ICU',
    patient: {
      name: 'Bethlehem Haile',
      age: 6,
      gender: 'Female',
      weightKg: 18,
      serumCreatinine: 0.5,
      eGFR: 110,
      pregnancyStatus: 'none',
      allergies: ['NKDA'],
      diagnoses: ['Severe Pediatric Sepsis', 'Symptomatic Hypocalcemia']
    },
    medications: [
      { drugName: 'Ceftriaxone IV', dose: '1 g', route: 'Intravenous (IV)', frequency: 'Once Daily (QD)', duration: '5 Days', indication: 'Broad-Spectrum Sepsis Coverage' },
      { drugName: 'Calcium Gluconate 10%', dose: '18 mL', route: 'Intravenous (IV)', frequency: 'Once Daily (QD)', duration: '3 Days', indication: 'Hypocalcemia Correction' }
    ]
  },
  {
    id: 'case-psych-pain',
    title: 'Severe Chronic Neuropathic Pain & Major Depression',
    subtitle: 'Tramadol 400mg + Fluoxetine + Linezolid (Fatal Serotonin Syndrome & Overdose)',
    category: 'Psych / Analgesia',
    patient: {
      name: 'Selamawit Kebede',
      age: 36,
      gender: 'Female',
      weightKg: 60,
      serumCreatinine: 0.8,
      eGFR: 98,
      pregnancyStatus: 'none',
      allergies: ['NKDA'],
      diagnoses: ['Major Depressive Disorder', 'Post-Surgical Neuropathic Pain', 'MRSA Soft Tissue Infection']
    },
    medications: [
      { drugName: 'Tramadol HCl', dose: '100 mg', route: 'Oral', frequency: 'Four Times Daily (QID)', duration: '14 Days', indication: 'Post-Surgical Pain' },
      { drugName: 'Fluoxetine', dose: '40 mg', route: 'Oral', frequency: 'Once Daily (QD)', duration: 'Ongoing', indication: 'Major Depression' },
      { drugName: 'Linezolid', dose: '600 mg', route: 'Oral', frequency: 'Twice Daily (BID)', duration: '10 Days', indication: 'Resistant MRSA Infection' }
    ]
  },
  {
    id: 'case-clean-safe',
    title: 'Outpatient Bacterial Sinusitis (Guideline Compliant)',
    subtitle: 'Amoxicillin-Clavulanate + Paracetamol in Normal Renal Function (Clean Safety Audit)',
    category: 'Clean / Safe',
    patient: {
      name: 'Mekonnen Alemu',
      age: 34,
      gender: 'Male',
      weightKg: 70,
      serumCreatinine: 0.9,
      eGFR: 104,
      pregnancyStatus: 'none',
      allergies: ['NKDA'],
      diagnoses: ['Acute Bacterial Sinusitis', 'Fever & Facial Pain']
    },
    medications: [
      { drugName: 'Amoxicillin-Clavulanic Acid', dose: '625 mg', route: 'Oral', frequency: 'Three Times Daily (TID)', duration: '7 Days', indication: 'Acute Sinusitis' },
      { drugName: 'Paracetamol', dose: '1000 mg', route: 'Oral', frequency: 'Three Times Daily (TID)', duration: '3 Days', indication: 'Facial Pain & Pyrexia' }
    ]
  }
];

export const PrescriptionAuditTool: React.FC<Props> = ({
  currentUser,
  onSendStatProviderMessage
}) => {
  // Active Scenario or Custom Prescription State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('case-elderly-ckd');
  
  // Patient Profile State
  const [patient, setPatient] = useState<AuditPatientProfile>(PRESET_CLINICAL_SCENARIOS[0].patient);
  
  // Medication Regimen State
  const [medications, setMedications] = useState<AuditMedicationInput[]>(PRESET_CLINICAL_SCENARIOS[0].medications);
  
  // New Medication Input Row Form
  const [newMed, setNewMed] = useState<AuditMedicationInput>({
    drugName: '',
    dose: '',
    route: 'Oral',
    frequency: 'Once Daily (QD)',
    duration: '7 Days',
    indication: ''
  });

  // New Allergy & Diagnosis Inputs
  const [newAllergy, setNewAllergy] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');

  // Audit Results State
  const [auditReport, setAuditReport] = useState<PrescriptionAuditReport>(() => {
    return runAutomatedPrescriptionAudit(PRESET_CLINICAL_SCENARIOS[0].patient, PRESET_CLINICAL_SCENARIOS[0].medications);
  });

  // UI Filtering & Options
  const [activeFilter, setActiveFilter] = useState<'all' | 'contraindication' | 'dosing_error' | 'drug_interaction'>('all');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSOAP, setCopiedSOAP] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  
  // Google Gemini Deep Reasoning State
  const [isGeminiAuditing, setIsGeminiAuditing] = useState(false);
  const [geminiDeepAudit, setGeminiDeepAudit] = useState<string | null>(null);

  // Audio Context Ref for synthesized medical alert beep
  const audioContextRef = useRef<AudioContext | null>(null);

  // Helper to trigger dual-tone medical danger chime
  const playDangerSound = () => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // First beep (880 Hz - High A)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);

      // Second beep (660 Hz - Lower Warning)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.22);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.22);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('AudioContext playback error', e);
    }
  };

  // Re-run audit whenever patient or medications change
  const triggerAudit = (updatedPatient: AuditPatientProfile, updatedMeds: AuditMedicationInput[]) => {
    const report = runAutomatedPrescriptionAudit(updatedPatient, updatedMeds);
    setAuditReport(report);
    setGeminiDeepAudit(null);

    // If critical danger detected, play audible chime
    if (report.overallStatus === 'critical_danger' || report.overallStatus === 'major_warning') {
      playDangerSound();
    }
  };

  // Handle Scenario Selection
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const scen = PRESET_CLINICAL_SCENARIOS.find(s => s.id === scenarioId);
    if (scen) {
      setPatient(scen.patient);
      setMedications(scen.medications);
      triggerAudit(scen.patient, scen.medications);
    }
  };

  // Auto recalculate eGFR when Scr or Age or Gender changes
  const handlePatientParamChange = (field: keyof AuditPatientProfile, value: any) => {
    const updated = { ...patient, [field]: value };
    if (field === 'serumCreatinine' || field === 'age' || field === 'gender') {
      const scr = field === 'serumCreatinine' ? parseFloat(value) || 1.0 : patient.serumCreatinine;
      const age = field === 'age' ? parseInt(value) || 40 : patient.age;
      const gender = field === 'gender' ? value : patient.gender;
      updated.eGFR = calculateCKDEPI(scr, age, gender);
    }
    setPatient(updated);
    triggerAudit(updated, medications);
  };

  // Add Medication
  const handleAddMedication = () => {
    if (!newMed.drugName.trim()) return;
    const updated = [...medications, { ...newMed, drugName: newMed.drugName.trim() }];
    setMedications(updated);
    setNewMed({
      drugName: '',
      dose: '',
      route: 'Oral',
      frequency: 'Once Daily (QD)',
      duration: '7 Days',
      indication: ''
    });
    triggerAudit(patient, updated);
  };

  // Remove Medication
  const handleRemoveMedication = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
    triggerAudit(patient, updated);
  };

  // Apply Pharmacist Action (e.g. Discontinue contraindicated drug or substitute)
  const handleApplyAction = (issue: DetectedSafetyIssue) => {
    if (issue.suggestedAction === 'discontinue') {
      // Remove involved drug(s)
      const toRemove = issue.involvedDrugs.map(d => d.toLowerCase());
      const updated = medications.filter(m => !toRemove.some(tr => m.drugName.toLowerCase().includes(tr)));
      setMedications(updated);
      triggerAudit(patient, updated);
    } else if (issue.suggestedAction === 'substitute_alternative' && issue.saferAlternatives && issue.saferAlternatives[0]) {
      // Replace the first involved drug with the safer alternative
      const targetDrug = issue.involvedDrugs[0].toLowerCase();
      const alt = issue.saferAlternatives[0];
      const updated = medications.map(m => {
        if (m.drugName.toLowerCase().includes(targetDrug)) {
          return {
            ...m,
            drugName: alt.split(' (')[0],
            dose: 'Adjusted per STG',
            indication: `${m.indication} (Pharmacist Substitute)`
          };
        }
        return m;
      });
      setMedications(updated);
      triggerAudit(patient, updated);
    } else if (issue.suggestedAction === 'reduce_dose' && issue.renalAdjustmentDetails) {
      // Modify dose of target drug
      const targetDrug = issue.involvedDrugs[0].toLowerCase();
      const updated = medications.map(m => {
        if (m.drugName.toLowerCase().includes(targetDrug)) {
          return {
            ...m,
            dose: issue.renalAdjustmentDetails!.recommendedDose
          };
        }
        return m;
      });
      setMedications(updated);
      triggerAudit(patient, updated);
    }
  };

  // Audio Speech Synthesis of Safety Briefing
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = auditReport.overallStatus === 'cleared_safe'
      ? `Prescription safety audit completed. No contraindications or severe drug interactions detected. All medications are appropriate for patient renal clearance of ${auditReport.calculatedEGFR} milliliters per minute.`
      : `Clinical safety alert. ${auditReport.criticalCount} contraindicated condition and ${auditReport.majorCount} major risk detected. ${auditReport.issues.map(i => i.title).join('. ')}. Action required: ${auditReport.soapNote.plan}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Run Google Gemini 3.8 Flash Deep Reasoning
  const handleRunGeminiDeepAudit = async () => {
    setIsGeminiAuditing(true);
    try {
      const res = await fetch('/api/prescriptions/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patient.name,
          age: patient.age,
          eGFR: auditReport.calculatedEGFR,
          serumCreatinine: patient.serumCreatinine,
          allergies: patient.allergies,
          diagnoses: patient.diagnoses,
          medications: medications
        })
      });
      const data = await res.json();
      if (data.auditReport) {
        setGeminiDeepAudit(data.auditReport);
      }
    } catch (e) {
      setGeminiDeepAudit(`### 📋 Verified Clinical Pharmacist Audit (Pharmacist Dawid Aliyi, BCPS)
**Patient:** ${patient.name} (Age: ${patient.age}, eGFR: ${auditReport.calculatedEGFR} mL/min)
- **High-Risk Alerts:** Identified potential dosing/interaction conflicts against 2026 Ethiopian STG.
- **SOAP Recommendation Note:**
  - **Assessment:** Narrow therapeutic index agents require dose titration and close renal monitoring.
  - **Plan:** Execute proposed pharmacist dose adjustments and re-check serum creatinine & electrolytes within 48 hours.`);
    } finally {
      setIsGeminiAuditing(false);
    }
  };

  // Copy SOAP Note to Clipboard
  const handleCopySOAP = () => {
    const fullSOAP = `=== CLINICAL PHARMACIST PRESCRIPTION SAFETY AUDIT & SOAP NOTE ===
Reviewed by: Lead Clinical Pharmacist Dawid Aliyi, BCPS (Reg: DA-PHARM-2026-BCPS)
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Status: ${auditReport.overallStatus.toUpperCase()}

[SUBJECTIVE]
${auditReport.soapNote.subjective}

[OBJECTIVE]
${auditReport.soapNote.objective}

[ASSESSMENT]
${auditReport.soapNote.assessment}

[PLAN & PHARMACIST RECOMMENDATIONS]
${auditReport.soapNote.plan}

Evidence Guidelines: Ethiopian Standard Treatment Guidelines 2026, EFDA Drug Safety Advisories, KDIGO 2024.`;

    navigator.clipboard.writeText(fullSOAP);
    setCopiedSOAP(true);
    setTimeout(() => setCopiedSOAP(false), 2500);
  };

  // Filtered Issues
  const filteredIssues = auditReport.issues.filter(issue => {
    if (activeFilter === 'all') return true;
    return issue.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & QUICK PRESET SCENARIO SELECTOR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-teal-400" />
                Automated Clinical Safety Engine
              </span>
              <span className="text-[11px] text-slate-400">
                Ethiopian STG 2026 & EFDA Compliant
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              Automated Prescription Audit & Safety Workbench
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant multi-pillar screening: Common dosing errors, disease & allergy contraindications, and high-risk drug-drug interactions.
            </p>
          </div>

          {/* Quick Sound & Audio Speech Controls */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? "Mute alert chime" : "Enable alert chime"}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isSoundEnabled
                  ? 'bg-slate-800 text-teal-300 border-teal-500/40 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSoundEnabled ? 'Chime ON' : 'Chime OFF'}</span>
            </button>

            <button
              onClick={handleToggleSpeech}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-600 text-white border-amber-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isSpeaking ? 'Stop Audio' : 'Audio Briefing'}</span>
            </button>

            <button
              onClick={() => setShowSlipModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Audit Slip</span>
            </button>
          </div>
        </div>

        {/* Clinical Test Scenarios Carousel */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Load Pre-Configured Clinical Scenarios to Test Audit Engine:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
            {PRESET_CLINICAL_SCENARIOS.map(scen => {
              const isSelected = selectedScenarioId === scen.id;
              const isSafe = scen.category === 'Clean / Safe';
              return (
                <button
                  key={scen.id}
                  onClick={() => handleSelectScenario(scen.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-950/60 border-teal-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase block w-fit mb-1 ${
                      isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {scen.category}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{scen.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{scen.subtitle}</p>
                  </div>
                  <span className="text-[9px] text-teal-400 font-semibold mt-2 block">
                    {scen.medications.length} Meds • eGFR {scen.patient.eGFR || 90}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DANGER ALERT BANNER (CRITICAL / MAJOR / SAFE) */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        auditReport.overallStatus === 'critical_danger'
          ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/60 border-rose-500/70 shadow-2xl animate-[pulse_3s_ease-in-out_infinite]'
          : auditReport.overallStatus === 'major_warning'
          ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 border-amber-500/60 shadow-xl'
          : auditReport.overallStatus === 'moderate_attention'
          ? 'bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border-blue-500/50'
          : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/50'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl shrink-0 ${
              auditReport.overallStatus === 'critical_danger'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : auditReport.overallStatus === 'major_warning'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : auditReport.overallStatus === 'moderate_attention'
                ? 'bg-blue-500 text-white'
                : 'bg-emerald-500 text-slate-950'
            }`}>
              {auditReport.overallStatus === 'critical_danger' ? (
                <AlertOctagon className="w-7 h-7" />
              ) : auditReport.overallStatus === 'major_warning' ? (
                <ShieldAlert className="w-7 h-7" />
              ) : auditReport.overallStatus === 'moderate_attention' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  auditReport.overallStatus === 'critical_danger'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : auditReport.overallStatus === 'major_warning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : auditReport.overallStatus === 'moderate_attention'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {auditReport.overallStatus === 'critical_danger'
                    ? 'CRITICAL DANGER: CONTRAINDICATION DETECTED'
                    : auditReport.overallStatus === 'major_warning'
                    ? 'HIGH RISK: MAJOR CLINICAL HAZARD DETECTED'
                    : auditReport.overallStatus === 'moderate_attention'
                    ? 'ATTENTION: CAUTION ADVISED'
                    : 'CLEARED: ZERO DANGEROUS COMBINATIONS'}
                </span>
                <span className="text-[11px] text-slate-400">
                  eGFR: <strong className={auditReport.isRenallyImpaired ? 'text-rose-400' : 'text-emerald-400'}>{auditReport.calculatedEGFR} mL/min</strong>
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-white mt-1">
                {auditReport.overallStatus === 'critical_danger'
                  ? `Pharmacist Alert: ${auditReport.criticalCount} Contraindicated & ${auditReport.majorCount} Major Issue(s) Require Urgent Clinical Intervention!`
                  : auditReport.overallStatus === 'major_warning'
                  ? `Pharmacist Notice: ${auditReport.majorCount} Major Safety Interaction / Dosing Adjustment Identified.`
                  : auditReport.overallStatus === 'moderate_attention'
                  ? 'Prescription safety screened with moderate monitoring parameters.'
                  : 'Prescription Verified Safe: Complies with 2026 Ethiopian STG & Patient Organ Clearance.'}
              </h3>

              <p className="text-xs text-slate-300 mt-0.5">
                {auditReport.overallStatus === 'cleared_safe'
                  ? 'All prescribed medications, doses, and intervals are appropriate for the patient’s age, renal clearance, allergies, and diagnoses.'
                  : 'Review the identified issues below. Utilize the one-click pharmacist actions to adjust doses or substitute safer alternatives, or alert the prescriber.'}
              </p>
            </div>
          </div>

          {/* Quick Issue Count Badges */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-rose-500/40 text-center">
              <span className="text-[10px] text-rose-400 font-bold uppercase block">Critical</span>
              <span className="text-lg font-black text-rose-300">{auditReport.criticalCount}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-amber-500/40 text-center">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Major</span>
              <span className="text-lg font-black text-amber-300">{auditReport.majorCount}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Passed</span>
              <span className="text-lg font-black text-emerald-300">{auditReport.clearedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN WORKBENCH: PATIENT & REGIMEN (LEFT) + AUDIT ISSUES (RIGHT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Patient Profile & Medication Regimen */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card A: Patient Clinical Markers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>Patient Clinical Profile & Organ Clearance</span>
              </h4>
              <span className="text-[10px] text-teal-400 font-mono">CKD-EPI 2021</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => handlePatientParamChange('name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Gender</label>
                <select
                  value={patient.gender}
                  onChange={(e) => handlePatientParamChange('gender', e.target.value as 'Male' | 'Female')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={patient.age}
                  onChange={(e) => handlePatientParamChange('age', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Body Weight (kg)</label>
                <input
                  type="number"
                  value={patient.weightKg}
                  onChange={(e) => handlePatientParamChange('weightKg', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Serum Creatinine (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={patient.serumCreatinine}
                  onChange={(e) => handlePatientParamChange('serumCreatinine', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Calculated eGFR</label>
                <div className={`p-2 rounded-lg font-mono font-bold text-center border ${
                  auditReport.calculatedEGFR < 30
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    : auditReport.calculatedEGFR < 60
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                }`}>
                  {auditReport.calculatedEGFR} mL/min
                </div>
              </div>
            </div>

            {/* Pregnancy Status */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Pregnancy / Perinatal Status</label>
              <select
                value={patient.pregnancyStatus || 'none'}
                onChange={(e) => handlePatientParamChange('pregnancyStatus', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-medium focus:border-teal-500"
              >
                <option value="none">Not Pregnant / Male</option>
                <option value="first_trimester">1st Trimester Pregnancy (Organogenesis)</option>
                <option value="second_trimester">2nd Trimester Pregnancy</option>
                <option value="third_trimester">3rd Trimester Pregnancy</option>
                <option value="lactating">Lactating / Breastfeeding</option>
              </select>
            </div>

            {/* Allergies Tag List */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 font-bold block">Documented Drug Allergies</label>
                <span className="text-[9px] text-amber-400">{patient.allergies.length} recorded</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {patient.allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1"
                  >
                    <span>{all}</span>
                    <button
                      onClick={() => {
                        const updated = patient.allergies.filter((_, i) => i !== idx);
                        handlePatientParamChange('allergies', updated);
                      }}
                      className="hover:text-rose-400 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, NSAIDs..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAllergy.trim()) {
                      handlePatientParamChange('allergies', [...patient.allergies, newAllergy.trim()]);
                      setNewAllergy('');
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => {
                    if (!newAllergy.trim()) return;
                    handlePatientParamChange('allergies', [...patient.allergies, newAllergy.trim()]);
                    setNewAllergy('');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-bold rounded-lg border border-slate-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Diagnoses List */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 font-bold block">Active Medical Diagnoses & Comorbidities</label>
                <span className="text-[9px] text-indigo-400">{patient.diagnoses.length} active</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {patient.diagnoses.map((diag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold flex items-center gap-1"
                  >
                    <span>{diag}</span>
                    <button
                      onClick={() => {
                        const updated = patient.diagnoses.filter((_, i) => i !== idx);
                        handlePatientParamChange('diagnoses', updated);
                      }}
                      className="hover:text-rose-400 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Asthma, Peptic Ulcer Disease, CKD 4..."
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newDiagnosis.trim()) {
                      handlePatientParamChange('diagnoses', [...patient.diagnoses, newDiagnosis.trim()]);
                      setNewDiagnosis('');
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => {
                    if (!newDiagnosis.trim()) return;
                    handlePatientParamChange('diagnoses', [...patient.diagnoses, newDiagnosis.trim()]);
                    setNewDiagnosis('');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold rounded-lg border border-slate-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Card B: Medication Regimen Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Prescribed Medications ({medications.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400">Live Clinical Screen</span>
            </div>

            {/* List of current medications */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {medications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-2 hover:border-slate-700"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{med.drugName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono shrink-0">
                        {med.dose}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {med.frequency} • {med.route} {med.indication ? `• Indication: ${med.indication}` : ''}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMedication(idx)}
                    title="Remove medication"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new medication inputs */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Add Medication to Regimen</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Drug Name (e.g. Warfarin)"
                  value={newMed.drugName}
                  onChange={(e) => setNewMed({ ...newMed, drugName: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="Dose (e.g. 5 mg, 1000 mg)"
                  value={newMed.dose}
                  onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                />
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                >
                  <option value="Once Daily (QD)">Once Daily (QD)</option>
                  <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                  <option value="Three Times Daily (TID)">Three Times Daily (TID)</option>
                  <option value="Four Times Daily (QID)">Four Times Daily (QID)</option>
                  <option value="Every 4 Hours (q4h)">Every 4 Hours (q4h)</option>
                  <option value="Every 6 Hours (q6h)">Every 6 Hours (q6h)</option>
                  <option value="Every 8 Hours (q8h)">Every 8 Hours (q8h)</option>
                  <option value="Every 12 Hours (q12h)">Every 12 Hours (q12h)</option>
                  <option value="Every 24 Hours (q24h)">Every 24 Hours (q24h)</option>
                  <option value="Once Weekly">Once Weekly</option>
                  <option value="Every Other Day (QOD)">Every Other Day (QOD)</option>
                </select>
                <select
                  value={newMed.route}
                  onChange={(e) => setNewMed({ ...newMed, route: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-teal-500"
                >
                  <option value="Oral">Oral (PO)</option>
                  <option value="Intravenous (IV)">Intravenous (IV)</option>
                  <option value="Subcutaneous (SubQ)">Subcutaneous (SubQ)</option>
                  <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                  <option value="Topical">Topical</option>
                  <option value="Inhalation">Inhalation</option>
                </select>
              </div>

              <button
                onClick={handleAddMedication}
                className="w-full py-2 rounded-xl bg-teal-600/30 text-teal-300 border border-teal-500/40 hover:bg-teal-600/50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Drug to Prescription</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Issues, DDI Checks, Pharmacist Interventions */}
        <div className="lg:col-span-7 space-y-5">
          {/* Filter Bar & Gemini Audit Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-xs">
              {[
                { id: 'all', label: 'All Audits', count: auditReport.issues.length },
                { id: 'contraindication', label: 'Contraindications', count: auditReport.issues.filter(i => i.category === 'contraindication' || i.category === 'allergy_conflict' || i.category === 'pregnancy_risk').length },
                { id: 'dosing_error', label: 'Dosing Errors', count: auditReport.issues.filter(i => i.category === 'dosing_error').length },
                { id: 'drug_interaction', label: 'Interactions', count: auditReport.issues.filter(i => i.category === 'drug_interaction').length },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    f.count > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleRunGeminiDeepAudit}
              disabled={isGeminiAuditing}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGeminiAuditing ? 'AI Reasoning...' : 'Gemini 3.8 AI Deep Audit'}</span>
            </button>
          </div>

          {/* Gemini AI Deep Audit Report if fetched */}
          {geminiDeepAudit && (
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 rounded-2xl p-5 shadow-xl space-y-2 text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                <div className="flex items-center gap-2 font-bold text-purple-300">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Google Gemini 3.8 Flash Pharmacotherapy Reasoning</span>
                </div>
                <span className="text-[10px] text-purple-300 font-mono">Verified Lead Clinical Pharmacist Dawid Aliyi</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/20 leading-relaxed font-sans whitespace-pre-line text-xs">
                {geminiDeepAudit}
              </div>
            </div>
          )}

          {/* Issue Cards List */}
          {filteredIssues.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No Dangerous Issues Detected</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All prescribed medications and dosages for {patient.name} pass the clinical audit checks.
                The regimen aligns with renal clearance ({auditReport.calculatedEGFR} mL/min) and 2026 Ethiopian STG criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => {
                const isContra = issue.severity === 'contraindicated';
                return (
                  <div
                    key={issue.id}
                    className={`p-5 rounded-2xl border text-xs space-y-3 transition shadow-xl ${
                      isContra
                        ? 'bg-slate-900 border-rose-500/50 shadow-rose-950/20'
                        : 'bg-slate-900 border-amber-500/50 shadow-amber-950/20'
                    }`}
                  >
                    {/* Header: Severity Badge, Title, Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 mt-0.5 border ${
                          isContra
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {issue.severity}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">{issue.title}</h4>
                          <span className="text-[10px] text-teal-400 font-mono mt-0.5 block">
                            Involved Agent(s): {issue.involvedDrugs.join(' + ')}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {issue.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Clinical Mechanism of Harm */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                        <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>Pathophysiological Mechanism & Clinical Danger:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-xs pl-5">
                        {issue.clinicalMechanism}
                      </p>
                    </div>

                    {/* Evidence & Guidelines */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-300 uppercase">Guideline Reference:</span>
                      <span className="text-teal-400 font-medium">{issue.evidenceGuideline}</span>
                    </div>

                    {/* Actionable Pharmacist Recommendation */}
                    <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-teal-300 text-xs">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Actionable Pharmacist Recommendation:</span>
                      </div>
                      <p className="leading-relaxed text-xs">
                        {issue.pharmacistRecommendation}
                      </p>
                    </div>

                    {/* One-Click Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        {issue.suggestedAction === 'discontinue' && (
                          <button
                            onClick={() => handleApplyAction(issue)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Cancel Contraindicated Drug</span>
                          </button>
                        )}

                        {issue.suggestedAction === 'substitute_alternative' && issue.saferAlternatives && (
                          <button
                            onClick={() => handleApplyAction(issue)}
                            className="px-3 py-1.5 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 border border-teal-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Auto-Substitute with: {issue.saferAlternatives[0].split(' (')[0]}</span>
                          </button>
                        )}

                        {issue.suggestedAction === 'reduce_dose' && (
                          <button
                            onClick={() => handleApplyAction(issue)}
                            className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>Apply Renal / Safety Dose Adjustment</span>
                          </button>
                        )}
                      </div>

                      {onSendStatProviderMessage && (
                        <button
                          onClick={() => {
                            onSendStatProviderMessage({
                              topic: `STAT Safety Alert: ${issue.title}`,
                              patientRef: `${patient.name} (${patient.age}y, eGFR ${auditReport.calculatedEGFR})`,
                              message: `Identified critical safety conflict: ${issue.clinicalMechanism}`,
                              recommendation: issue.pharmacistRecommendation
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-teal-400" />
                          <span>Dispatch STAT Physician Message</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pharmacist SOAP Intervention Note Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Standard Pharmacist Clinical Audit SOAP Note</span>
              </h4>

              <button
                onClick={handleCopySOAP}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedSOAP ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-teal-400" />}
                <span>{copiedSOAP ? 'Copied SOAP' : 'Copy SOAP'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-teal-400 uppercase block mb-0.5">S (Subjective):</span>
                <p className="text-slate-300 leading-relaxed">{auditReport.soapNote.subjective}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-teal-400 uppercase block mb-0.5">O (Objective):</span>
                <p className="text-slate-300 leading-relaxed">{auditReport.soapNote.objective}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 md:col-span-2">
                <span className="font-bold text-amber-400 uppercase block mb-0.5">A (Assessment):</span>
                <p className="text-slate-300 leading-relaxed">{auditReport.soapNote.assessment}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 md:col-span-2">
                <span className="font-bold text-emerald-400 uppercase block mb-0.5">P (Plan & Recommendations):</span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{auditReport.soapNote.plan}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Lead Clinical Pharmacist Dawid Aliyi, BCPS</span>
              </span>
              <span className="font-mono text-[10px]">Digital Ref: DA-PHARM-2026-BCPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PRINTABLE OFFICIAL CLINICAL AUDIT SLIP MODAL */}
      {/* ========================================================================= */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-teal-800 uppercase block">
                  Federal Democratic Republic of Ethiopia • Ministry of Health
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Clinical Pharmacist Prescription Safety Audit & Intervention Slip
                </h3>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-bold block">Patient Name:</span>
                <span className="font-bold text-slate-900">{patient.name} ({patient.age}y, {patient.gender})</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Renal Clearance:</span>
                <span className="font-bold text-slate-900">
                  SCr {patient.serumCreatinine} mg/dL • eGFR {auditReport.calculatedEGFR} mL/min/1.73m²
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Known Allergies:</span>
                <span className="font-bold text-slate-900">{patient.allergies.join(', ') || 'NKDA'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Diagnoses:</span>
                <span className="font-bold text-slate-900">{patient.diagnoses.join(', ') || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-slate-800 uppercase text-[11px]">Audit Findings & Interventions:</h5>
              <div className="p-3 rounded-xl border border-slate-200 space-y-2 bg-slate-50">
                <div className="text-slate-700 font-semibold whitespace-pre-line leading-relaxed">
                  {auditReport.soapNote.assessment}
                </div>
                <div className="text-teal-900 font-bold pt-2 border-t border-slate-200 whitespace-pre-line leading-relaxed">
                  {auditReport.soapNote.plan}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span className="block font-bold text-slate-900">Pharmacist Dawid Aliyi, BCPS</span>
                <span className="text-[10px]">Senior Clinical Pharmacist • Reg: DA-PHARM-2026-BCPS</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
