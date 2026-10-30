import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  FileCheck, 
  Sparkles, 
  Download, 
  Send, 
  MapPin, 
  HelpCircle,
  Truck,
  Flame,
  Radio,
  ExternalLink
} from 'lucide-react';
import { User as UserType, Language } from '../types';

interface OutbreakAlert {
  id: string;
  diseaseName: string;
  pathogen: string;
  affectedRegions: string[];
  alertLevel: 'critical_emergency' | 'high_vigilance' | 'active_surveillance';
  caseCountReported: number;
  mortalityRatePercent: number;
  primaryInterventions: string[];
  recommendedPharmacotherapy: string;
  epssStockRequisitionCode: string;
  ephiNoticeDate: string;
}

const activeOutbreaks: OutbreakAlert[] = [
  {
    id: "outbreak-cholera-2026",
    diseaseName: "Acute Watery Diarrhea / Cholera Outbreak",
    pathogen: "Vibrio cholerae O1 El Tor",
    affectedRegions: ["Somali Region", "Oromia (Bale & Guji Zones)", "Afar Region", "Dire Dawa"],
    alertLevel: "critical_emergency",
    caseCountReported: 3480,
    mortalityRatePercent: 1.4,
    primaryInterventions: [
      "Immediate isotonic fluid resuscitation (Ringer's Lactate 100 mL/kg within 3 hours)",
      "Oral Rehydration Salts (ORS) + Zinc Sulfate 20 mg/day for children under 5",
      "Single-dose Doxycycline 300 mg for adults (or Azithromycin 1 g for pregnant women)",
      "Emergency chlorine tablet water treatment and OCV (Oral Cholera Vaccine) ring vaccination"
    ],
    recommendedPharmacotherapy: "Ringer's Lactate IV + ORS + Doxycycline 300mg PO stat or Azithromycin 1g PO in pregnancy + Zinc 20mg daily x 14 days",
    epssStockRequisitionCode: "EPSS-EMERG-CHOL-2026",
    ephiNoticeDate: "October 2026 (Active Epidemic)"
  },
  {
    id: "outbreak-dengue-2026",
    diseaseName: "Dengue Fever Epidemic Resurgence",
    pathogen: "Dengue Virus (DENV-2 & DENV-3 Serotypes)",
    affectedRegions: ["Dire Dawa City", "Afar (Semera)", "Somali (Gode)", "Mille"],
    alertLevel: "critical_emergency",
    caseCountReported: 1820,
    mortalityRatePercent: 0.8,
    primaryInterventions: [
      "Strict avoidance of Aspirin, Ibuprofen, Diclofenac or other NSAIDs (avoids fatal hemorrhage)",
      "Judicious crystalloid infusion titrated to hematocrit and urine output (> 0.5 mL/kg/h)",
      "Oral Paracetamol 1 g q6h (max 4 g/day) for pain and febrile management",
      "Intensive vector abatement and pyrethroid insecticide-treated bed nets"
    ],
    recommendedPharmacotherapy: "Isotonic 0.9% Normal Saline / Ringer's Lactate + Paracetamol PO/IV. STRICT CONTRAINDICATION: NSAIDs & Antiplatelets",
    epssStockRequisitionCode: "EPSS-EMERG-DENG-2026",
    ephiNoticeDate: "October 2026 (Active Epidemic)"
  },
  {
    id: "outbreak-meningitis-2026",
    diseaseName: "Meningococcal Meningitis Outbreak",
    pathogen: "Neisseria meningitidis Serogroup C / W",
    affectedRegions: ["Gambella Region", "Benishangul-Gumuz", "West Oromia"],
    alertLevel: "high_vigilance",
    caseCountReported: 620,
    mortalityRatePercent: 4.8,
    primaryInterventions: [
      "Immediate lumbar puncture and empiric IV Ceftriaxone 2 g q12h",
      "IV Dexamethasone 10 mg given 15 minutes before or with first antibiotic dose",
      "Respiratory droplet isolation for first 24 hours of antimicrobial therapy",
      "Chemoprophylaxis for close household and ward contacts with Ciprofloxacin 500 mg PO single dose"
    ],
    recommendedPharmacotherapy: "Ceftriaxone 2g IV q12h (or Cefotaxime 2g IV q6h in neonates) + Dexamethasone 10mg IV q6h x 4 days + Ciprofloxacin contact prophylaxis",
    epssStockRequisitionCode: "EPSS-EMERG-MEN-2026",
    ephiNoticeDate: "October 2026 (Surveillance)"
  }
];

interface EpidemicOutbreakCPDProps {
  user: UserType;
  currentLanguage: Language;
  onUpgradeToService: (service: 'cpd_certificate', amount: number) => void;
}

export const EpidemicOutbreakCPD: React.FC<EpidemicOutbreakCPDProps> = ({
  user,
  currentLanguage,
  onUpgradeToService
}) => {
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakAlert>(activeOutbreaks[0]);
  const [activeStep, setActiveStep] = useState<'overview' | 'curriculum' | 'exam' | 'certificate'>('overview');
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [cbeRefInput, setCbeRefInput] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(user.isPro || false);

  const examQuestions = [
    {
      id: 1,
      question: "In the ongoing Cholera outbreak, which fluid regimen is universally recommended by the Ethiopian Ministry of Health for severe dehydration in adults?",
      options: [
        "0.9% Normal Saline 50 mL/kg over 8 hours",
        "Ringer's Lactate 100 mL/kg IV within 3 hours (30 mL/kg in 30 min, then 70 mL/kg in 2.5 hours)",
        "Dextrose 5% in Water 2 Liters bolus",
        "Oral rehydration salts alone without intravenous access"
      ],
      correctIndex: 1,
      explanation: "Ringer's Lactate is the fluid of choice because it rapidly replaces massive electrolyte loss (sodium, potassium, bicarbonate) without inducing severe hyperchloremic metabolic acidosis seen with heavy Normal Saline."
    },
    {
      id: 2,
      question: "Which antibiotic is first-line single-dose chemoprophylaxis/treatment for adult cholera cases according to EFDA protocols?",
      options: [
        "Amoxicillin 500 mg TID for 7 days",
        "Doxycycline 300 mg PO single dose (or Azithromycin 1 g PO in pregnancy)",
        "Ciprofloxacin 250 mg daily for 10 days",
        "Gentamicin 80 mg IV single dose"
      ],
      correctIndex: 1,
      explanation: "A single stat dose of Doxycycline 300 mg significantly reduces vibrio excretion duration and stool volume. For pregnant women, Azithromycin 1 g PO single dose is the preferred safe alternative."
    },
    {
      id: 3,
      question: "Why are NSAIDs (such as Ibuprofen and Diclofenac) strictly contraindicated in patients presenting with suspected Dengue Fever in Dire Dawa/Afar?",
      options: [
        "They cause sudden hypokalemia and muscle paralysis",
        "They induce platelet dysfunction and severe gastrointestinal hemorrhage in presence of Dengue thrombocytopenia",
        "They inhibit viral replication prematurely",
        "They inactivate intravenous normal saline solutions"
      ],
      correctIndex: 1,
      explanation: "Dengue causes severe viral-induced thrombocytopenia and vascular permeability. NSAIDs inhibit platelet COX-1, dramatically amplifying lethal gastrointestinal and intracranial bleeding risks. Only Paracetamol is permitted."
    },
    {
      id: 4,
      question: "In severe Meningococcal Meningitis triage, what is the critical timing for intravenous Dexamethasone administration?",
      options: [
        "Given 24 hours after full antibiotic sterilization",
        "Administered 15 minutes prior to or alongside the first dose of IV Ceftriaxone",
        "Only administered if blood cultures return sterile",
        "Given as continuous infusion over 7 days"
      ],
      correctIndex: 1,
      explanation: "Steroids must be present in the CSF before antibiotics induce massive bacterial lysis and release of inflammatory cytokines, effectively preventing severe neurological hearing loss and cerebral edema."
    },
    {
      id: 5,
      question: "What is the role of EPSS (Ethiopian Pharmaceuticals Supply Service) emergency buffer stock during regional epidemics?",
      options: [
        "Halt distribution until annual budget reconciliation",
        "Execute rapid replenishment of tracer outbreak kits (Ringer's, IV catheters, PPE, Antibiotics) within 24-48 hours",
        "Export antibiotics to private pharmacies only",
        "Only manage non-communicable disease tablets"
      ],
      correctIndex: 1,
      explanation: "EPSS maintains pre-positioned emergency outbreak tracer stockpiles at all 19 regional hubs to immediately dispatch life-saving rehydration fluids, antibiotics, and vaccines upon outbreak declaration."
    }
  ];

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    setExamAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleGradeExam = () => {
    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);

    if (score >= 4) {
      if (isUnlocked) {
        setActiveStep('certificate');
      } else {
        setShowPaymentModal(true);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Alert Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-red-500/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/30 border border-red-400/50 text-red-200 text-xs font-bold uppercase tracking-wider animate-pulse">
              <Flame className="w-4 h-4 text-red-400" />
              Active National Outbreak & Epidemic Surveillance Alert
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Rapid-Response Epidemic CPD Course & Outbreak Management
            </h1>
            <p className="text-red-100/90 text-sm md:text-base max-w-2xl">
              Automatic provision of certified emergency CPD courses during public health emergencies. Learn verified case definition, emergency pharmacotherapy protocols, and EPSS logistics mobilization with certified EFDA/MoH CEU credits.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {isUnlocked ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Emergency CPD Accreditation Active
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Enroll & Unlock Outbreak CPD (100 Birr)
              </button>
            )}
            <span className="text-xs text-red-200/70">
              Emergency subsidized fee: 100 ETB • Certified CPD Units
            </span>
          </div>
        </div>

        {/* Active Outbreak Selector */}
        <div className="mt-6 pt-5 border-t border-red-500/30 grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeOutbreaks.map((outbreak) => (
            <div
              key={outbreak.id}
              onClick={() => {
                setSelectedOutbreak(outbreak);
                setActiveStep('overview');
                setExamSubmitted(false);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedOutbreak.id === outbreak.id
                  ? 'bg-red-900/40 border-red-400 shadow-md ring-2 ring-red-500/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  {outbreak.alertLevel.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400">{outbreak.caseCountReported.toLocaleString()} Cases</span>
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-1">{outbreak.diseaseName}</h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">Regions: {outbreak.affectedRegions.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Step Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: '1. Outbreak Overview & Triage', icon: Activity },
          { id: 'curriculum', label: '2. Emergency Pharmacotherapy Protocol', icon: BookOpen },
          { id: 'exam', label: '3. Clinical Competency Exam', icon: HelpCircle },
          { id: 'certificate', label: '4. Accredited CPD Certificate', icon: Award }
        ].map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeStep === step.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Step 1: Overview */}
      {activeStep === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Active National Epidemic</span>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">{selectedOutbreak.diseaseName}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Etiologic Agent: {selectedOutbreak.pathogen}</p>
            </div>
            <div className="text-right text-xs">
              <span className="px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-800/40 font-bold">
                Mortality: {selectedOutbreak.mortalityRatePercent}%
              </span>
              <p className="text-[11px] text-slate-400 mt-1">EPHI Alert Status: {selectedOutbreak.ephiNoticeDate}</p>
            </div>
          </div>

          {/* Regional Map & Affected Zones */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              Severely Impacted Zones & Transmission Hotspots:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedOutbreak.affectedRegions.map((region, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-red-950/60 text-red-200 border border-red-500/30 text-xs font-medium">
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Core Emergency Interventions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Immediate Healthcare Provider Action Protocol (WHO / EFDA)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedOutbreak.primaryInterventions.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EPSS Stock Code */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-400" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300">EPSS Emergency Supply Requisition Code:</span>
                <span className="font-mono text-white ml-2">{selectedOutbreak.epssStockRequisitionCode}</span>
                <p className="text-slate-400 mt-0.5">Tracer medicine reserves pre-positioned across Kaliti, Adama, Hawassa, and Dire Dawa hubs.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveStep('curriculum')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Start Emergency CPD Module →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Curriculum */}
      {activeStep === 'curriculum' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">MoH / EFDA Outbreak Curriculum</span>
            <h3 className="text-xl font-bold text-white mt-1">
              Clinical Pharmacotherapy Protocol: {selectedOutbreak.diseaseName}
            </h3>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="p-4 bg-red-950/40 border-l-4 border-red-500 rounded-r-xl">
              <strong className="text-red-300 block mb-1">Standard Treatment Guideline Regimen:</strong>
              <p className="text-white text-sm font-mono leading-relaxed">{selectedOutbreak.recommendedPharmacotherapy}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h5 className="font-bold text-emerald-400 uppercase tracking-wider">Primary Drug Mechanisms & Dosing</h5>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>Rapid fluid deficit replacement restores microvascular capillary refill.</li>
                  <li>Targeted antimicrobials clear infectious organism excretion within 48h.</li>
                  <li>Zinc supplementation regenerates damaged mucosal enterocytes and reduces diarrhea relapse.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h5 className="font-bold text-amber-400 uppercase tracking-wider">Contraindications & Safety Warnings</h5>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>Never co-administer NSAIDs in suspected dengue or hemorrhagic fevers.</li>
                  <li>Avoid pure 5% Dextrose as resuscitation fluid for hypovolemic shock.</li>
                  <li>Doxycycline is safe in short single stat dose for adult cholera; prefer Azithromycin in pregnancy.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep('exam')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Take 5-Question Clinical Exam (100 Birr Pass) →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Exam */}
      {activeStep === 'exam' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Emergency Accreditation Assessment</span>
              <h3 className="text-xl font-bold text-white mt-1">Outbreak Clinical Competency Quiz</h3>
              <p className="text-xs text-slate-400">Score at least 80% (4/5) to qualify for official EFDA / MoH CPD certification.</p>
            </div>
            {examSubmitted && (
              <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                examScore >= 4 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500' 
                  : 'bg-red-950 text-red-300 border-red-500'
              }`}>
                Score: {examScore} / {examQuestions.length} ({examScore >= 4 ? 'PASSED' : 'RETRY'})
              </div>
            )}
          </div>

          <div className="space-y-6">
            {examQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-900/60 text-red-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>
                </div>

                <div className="space-y-2 pl-9">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = examAnswers[idx] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => !examSubmitted && handleSelectAnswer(idx, optIdx)}
                        className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                          examSubmitted
                            ? isCorrect
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                              : isSelected
                              ? 'bg-red-950/60 border-red-500 text-red-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            : isSelected
                            ? 'bg-red-950/60 border-red-500 text-white font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    );
                  })}
                </div>

                {examSubmitted && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <strong className="text-emerald-400 block mb-1">Clinical Rationale:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              Answered {Object.keys(examAnswers).length} of {examQuestions.length} questions
            </span>
            <div className="flex gap-3">
              {examSubmitted && examScore >= 4 ? (
                <button
                  onClick={() => {
                    if (isUnlocked) {
                      setActiveStep('certificate');
                    } else {
                      setShowPaymentModal(true);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  View & Download CPD Certificate →
                </button>
              ) : (
                <button
                  onClick={handleGradeExam}
                  disabled={Object.keys(examAnswers).length < examQuestions.length}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm shadow cursor-pointer"
                >
                  {examSubmitted ? 'Recalculate Score' : 'Submit & Grade Exam'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Certificate */}
      {activeStep === 'certificate' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {!isUnlocked ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-red-500/30 space-y-4 max-w-md mx-auto">
              <Lock className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Emergency CPD Pass Required</h3>
              <p className="text-xs text-slate-300">
                You passed the clinical competency exam! Unlock and download your officially accredited EFDA / MoH certificate for 100 Birr.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow cursor-pointer"
              >
                Unlock Certificate (100 Birr)
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Certificate Canvas Mock */}
              <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border-4 border-double border-amber-500/60 shadow-2xl text-center space-y-6 text-white relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-amber-500/40 pb-4">
                  <div className="text-left text-xs text-amber-300 font-mono">
                    <p className="font-bold">EFDA / MoH ETHIOPIA</p>
                    <p className="text-slate-400">National Emergency Health Division</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="text-right text-xs text-emerald-400 font-mono">
                    <p className="font-bold">5 CPD CREDITS</p>
                    <p className="text-slate-400">Category 1 Verified</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
                    Certificate of Emergency Clinical Competence
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    {user.fullName || 'Healthcare Professional'}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Has successfully completed the rapid-response public health masterclass and passed clinical examination for:
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-emerald-400">
                    {selectedOutbreak.diseaseName} Epidemic Protocol
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left text-xs bg-black/40 p-4 rounded-2xl border border-white/10 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CERTIFICATE ID:</span>
                    <span className="text-amber-400 font-bold">CPD-EMERG-2026-9912</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ISSUE DATE:</span>
                    <span className="text-white">October 29, 2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LEAD CLINICAL TRAINER:</span>
                    <span className="text-white font-bold">Pharm. Dawid Aliyi, BCPS</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VERIFICATION:</span>
                    <span className="text-emerald-400 font-bold">✓ VERIFIED BY EFDA</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Printable Certificate (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 100 Birr Payment Modal for Outbreak CPD */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Unlock Outbreak CPD & Certificate</h3>
                  <p className="text-xs text-slate-400">Emergency accredited continuing education • 100 Birr</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-center">
                <span className="text-xs text-red-300 uppercase tracking-widest font-semibold">Emergency Epidemic Course Fee</span>
                <div className="text-3xl font-extrabold text-white mt-1">100 ETB <span className="text-sm font-normal text-slate-300">($1.00 USD)</span></div>
                <p className="text-xs text-red-200/80 mt-1">
                  Access all emergency outbreak modules and download certified EFDA CPD certificate
                </p>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Telebirr Mobile Account:</span>
                  <span className="font-mono font-bold text-amber-400">0982852778 (Dawid Aliyi)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">CBE Account Number:</span>
                  <span className="font-mono font-bold text-emerald-400">1000262900367 (Dawid Aliyi)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">CBE Birr USSD Code:</span>
                  <span className="font-mono font-bold text-teal-400">*847#</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Enter Telebirr / CBE Transaction Reference ID:
                </label>
                <input 
                  type="text"
                  value={cbeRefInput}
                  onChange={(e) => setCbeRefInput(e.target.value)}
                  placeholder="e.g. TB-892100 or CBE-99120"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsUnlocked(true);
                  onUpgradeToService('cpd_certificate', 100);
                  setShowPaymentModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Verify & Unlock Emergency CPD (100 Birr)
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
