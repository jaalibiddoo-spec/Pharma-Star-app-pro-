import React, { useState } from 'react';
import { 
  Pill, AlertTriangle, Sparkles, BookOpen, Search, Filter, 
  ChevronRight, ArrowRight, ShieldAlert, ShieldCheck, CheckCircle2,
  FileText, Printer, HelpCircle, Activity, Award, Clock, 
  ExternalLink, Layers, Check, X, Sliders, Dna, Stethoscope,
  Send, RotateCcw, AlertOctagon, Heart, Zap, UserCheck
} from 'lucide-react';
import { 
  universalDrugCompendiumData, 
  medicalAdvancementScenarios, 
  drugInformationConsultsData,
  DrugMonograph,
  MedicalAdvancementScenario,
  DrugInformationConsult,
  DrugStatus
} from '../data/universalDrugCompendiumData';

export const systematicSearchAlgorithmSteps = [
  {
    stepNumber: 1,
    title: "Step 1: Secure Inquirer Demographics & True Clinical Question",
    description: "Identify caller role, training level, patient-specific factors (age, weight, organ function), and differentiate the superficial question from the core clinical problem.",
    keyDatabasesOrReferences: ["Clinical Ward Chart", "Direct Clinician Interview"]
  },
  {
    stepNumber: 2,
    title: "Step 2: Classify Question into Sub-Specialty Domain",
    description: "Categorize as Adverse Drug Reaction, IV Y-Site Compatibility, TDM, Teratogenicity, Renal Dosing, or Off-label use to prioritize secondary search strings.",
    keyDatabasesOrReferences: ["ASHP Classification Matrix", "EFDA Pharmacovigilance"]
  },
  {
    stepNumber: 3,
    title: "Step 3: Systematic Search: Tertiary ➔ Secondary ➔ Primary",
    description: "Start with tertiary compendia (Micromedex, Lexicomp, Trissel's), proceed to secondary indexing (PubMed/MEDLINE, Cochrane), and analyze primary randomized clinical trials.",
    keyDatabasesOrReferences: ["Trissel's", "PubMed", "Cochrane Systematic Reviews", "DiPiro 12th Ed"]
  },
  {
    stepNumber: 4,
    title: "Step 4: Synthesize Evidence & Filter Conflicting Data",
    description: "Critically appraise study methodologies, bias, clinical relevance, and reconcile differences between FDA approvals, EMA alerts, and local Ethiopian STG guidelines.",
    keyDatabasesOrReferences: ["GRADE Methodology", "Evidence-Based Medicine Framework"]
  },
  {
    stepNumber: 5,
    title: "Step 5: Formulate Patient-Specific Action Plan",
    description: "Deliver an unambiguous, direct answer first, followed by pharmacokinetic rationale, stepwise alternatives, monitoring parameters, and contingency recommendations.",
    keyDatabasesOrReferences: ["Pharmacist Consultation Protocol", "Ethiopian MoH STGs"]
  },
  {
    stepNumber: 6,
    title: "Step 6: Document Consultation in Official Medical Record",
    description: "Record written documentation in hospital pharmacy DIS archive with timestamps, inquiry category, sources cited, and verification by a licensed clinical specialist.",
    keyDatabasesOrReferences: ["Hospital EMR / Ward DIS Logbook"]
  },
  {
    stepNumber: 7,
    title: "Step 7: Proactive Clinical Follow-up",
    description: "Re-contact the clinical ward team within 12-24 hours to monitor patient response, assess lab biomarkers (eGFR, CBC, cultures), and verify clinical resolution.",
    keyDatabasesOrReferences: ["Inpatient Rounding Sheet", "Bedside Monitoring Chart"]
  }
];

export const MedicalAdvancementsAndDrugDirectory: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'compendium' | 'scenarios' | 'dis_portal'>('compendium');

  // Compendium State
  const [drugStatusFilter, setDrugStatusFilter] = useState<'all' | DrugStatus>('all');
  const [therapeuticFilter, setTherapeuticFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonograph, setSelectedMonograph] = useState<DrugMonograph | null>(null);
  const [comparisonDrugs, setComparisonDrugs] = useState<DrugMonograph[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Scenario Simulator State
  const [activeScenarioId, setActiveScenarioId] = useState<string>(medicalAdvancementScenarios[0]?.id || '');
  const [scenarioParadigm, setScenarioParadigm] = useState<'traditional' | 'advancement'>('advancement');

  // DIS Consultation State
  const [selectedConsult, setSelectedConsult] = useState<DrugInformationConsult | null>(null);
  const [disInquirerType, setDisInquirerType] = useState<string>('Pharmacy Student');
  const [disUrgency, setDisUrgency] = useState<string>('Immediate / STAT (Emergency)');
  const [disCategory, setDisCategory] = useState<string>('IV Y-Site Compatibility & Precipitation');
  const [disPatientInfo, setDisPatientInfo] = useState<string>('14-day-old term neonate, 3.2 kg, treated for suspected sepsis in NICU.');
  const [disQuestionText, setDisQuestionText] = useState<string>('Can IV Ceftriaxone be administered through the same line as Calcium Gluconate or TPN in a neonate?');
  const [submittedConsultation, setSubmittedConsultation] = useState<{
    id: string;
    date: string;
    inquirer: string;
    urgency: string;
    category: string;
    patient: string;
    question: string;
    answerSummary: string;
    evidenceGrade: string;
  } | null>(null);

  const activeScenario = medicalAdvancementScenarios.find(s => s.id === activeScenarioId) || medicalAdvancementScenarios[0];

  // Compendium Filtered Drugs
  const filteredDrugs = universalDrugCompendiumData.filter(drug => {
    const matchStatus = drugStatusFilter === 'all' || drug.status === drugStatusFilter;
    const matchTherapeutic = therapeuticFilter === 'all' || drug.therapeuticCategory.toLowerCase().includes(therapeuticFilter.toLowerCase());
    const matchSearch = drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.brandNames.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      drug.mechanismOfAction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.indications.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchTherapeutic && matchSearch;
  });

  const toggleCompareDrug = (drug: DrugMonograph) => {
    if (comparisonDrugs.some(d => d.id === drug.id)) {
      setComparisonDrugs(comparisonDrugs.filter(d => d.id !== drug.id));
    } else {
      if (comparisonDrugs.length >= 3) {
        alert('You can compare a maximum of 3 medications simultaneously.');
        return;
      }
      setComparisonDrugs([...comparisonDrugs, drug]);
    }
  };

  const handlePrintMonograph = () => {
    window.print();
  };

  const handleDISSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disQuestionText.trim()) return;

    setSubmittedConsultation({
      id: `DIS-ETH-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      inquirer: disInquirerType,
      urgency: disUrgency,
      category: disCategory,
      patient: disPatientInfo || 'Patient details recorded in clinical ward chart',
      question: disQuestionText,
      answerSummary: `Consultation synthesized using 7-Step Modified Systematic Search. Primary reference: Ethiopian STG 5th Ed, Trissel's Handbook on Injectable Drugs, and Micromedex. Recommendation: STRICTLY CONTRAINDICATED in neonates due to fatal micro-vascular crystalline precipitation.`,
      evidenceGrade: 'Grade A (Level 1 Systematic Review / FDA Black Box Alert)'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Clinical Pharmacology &amp; Advancements Suite</span>
              </span>
              <span className="text-xs text-slate-400">
                Active Drugs • Expelled Forensics • Investigational Pipelines • DIS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Universal Drug Compendium, Advancements &amp; DIS
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Explore exhaustive pharmacologic monographs for active medications, safety forensics for withdrawn/expelled drugs, interactive clinical breakthrough simulators, and a systematic Drug Information Service consultation desk.
            </p>
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveMainTab('compendium')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeMainTab === 'compendium'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Universal Drug Compendium</span>
            </button>

            <button
              onClick={() => setActiveMainTab('scenarios')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeMainTab === 'scenarios'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Medical Advancements</span>
            </button>

            <button
              onClick={() => setActiveMainTab('dis_portal')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeMainTab === 'dis_portal'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Drug Info Services (DIS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: UNIVERSAL DRUG COMPENDIUM ("EVERYTHING ABOUT DRUGS")               */}
      {/* ========================================================================= */}
      {activeMainTab === 'compendium' && (
        <div className="space-y-6">
          {/* Filter Bar & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search generic, brand, MOA, or indication..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              {/* Compare Button */}
              {comparisonDrugs.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">
                    Selected for comparison: <strong>{comparisonDrugs.length}</strong> / 3
                  </span>
                  <button
                    onClick={() => setIsComparing(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Matrix ({comparisonDrugs.length})</span>
                  </button>
                  <button
                    onClick={() => setComparisonDrugs([])}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Clear comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Lifecycle Status & Category Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: `All Drugs (${universalDrugCompendiumData.length})` },
                  { id: 'active', label: 'Actively Approved & Used' },
                  { id: 'suspended', label: 'Suspended / Expelled from Market' },
                  { id: 'pipeline', label: 'Under Development (Pipeline)' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDrugStatusFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      drugStatusFilter === tab.id
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-semibold">Category:</span>
                <select
                  value={therapeuticFilter}
                  onChange={(e) => setTherapeuticFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Cardiovascular">Cardiovascular &amp; Hematology</option>
                  <option value="Infectious">Infectious Diseases</option>
                  <option value="Endocrinology">Endocrinology &amp; Diabetes</option>
                  <option value="Oncology">Oncology &amp; Immunotherapy</option>
                  <option value="Analgesics">Analgesics &amp; Rheumatology</option>
                  <option value="Rare">Rare Diseases &amp; Gene Therapy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drug Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrugs.map(drug => {
              const isSelectedForComp = comparisonDrugs.some(d => d.id === drug.id);

              return (
                <div
                  key={drug.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between transition-all hover:border-teal-500/60 ${
                    drug.status === 'suspended'
                      ? 'border-rose-900/50 bg-gradient-to-b from-slate-900 via-rose-950/10 to-slate-900'
                      : drug.status === 'pipeline'
                      ? 'border-indigo-900/50 bg-gradient-to-b from-slate-900 via-indigo-950/10 to-slate-900'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        drug.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : drug.status === 'suspended'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {drug.status === 'active' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {drug.status === 'suspended' && <AlertOctagon className="w-3 h-3 text-rose-400" />}
                        {drug.status === 'pipeline' && <Sparkles className="w-3 h-3 text-indigo-400" />}
                        <span>
                          {drug.status === 'active' ? 'Approved & In Use' :
                           drug.status === 'suspended' ? 'Suspended / Expelled' :
                           'Pipeline Breakthrough'}
                        </span>
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {drug.atcCode}
                      </span>
                    </div>

                    {/* Drug Name & Brand */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300">
                        {drug.name}
                      </h3>
                      <p className="text-xs text-teal-400 font-mono mt-0.5">
                        Brand: {drug.brandNames.join(', ')}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Class: {drug.drugClass}
                      </p>
                    </div>

                    {/* Mechanism of Action snippet */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Mechanism of Action:
                      </span>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {drug.mechanismOfAction}
                      </p>
                    </div>

                    {/* Expelled Drug Highlight or Pipeline Highlight */}
                    {drug.status === 'suspended' && drug.marketLifecycleDetails.toxicologicalRootCause && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-xs">
                        <span className="font-bold text-rose-400 flex items-center gap-1 text-[11px]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Recall Year: {drug.marketLifecycleDetails.yearWithdrawnOrSuspended} • Forensics:</span>
                        </span>
                        <p className="text-slate-300 text-[11px] line-clamp-2">
                          {drug.marketLifecycleDetails.toxicologicalRootCause}
                        </p>
                      </div>
                    )}

                    {drug.status === 'pipeline' && drug.marketLifecycleDetails.clinicalTrialPhase && (
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-1 text-xs">
                        <span className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{drug.marketLifecycleDetails.clinicalTrialPhase} • Sponsor: {drug.marketLifecycleDetails.leadSponsor}</span>
                        </span>
                        <p className="text-slate-300 text-[11px] line-clamp-2">
                          {drug.marketLifecycleDetails.clinicalAdvantageOverStandard}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleCompareDrug(drug)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                        isSelectedForComp
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{isSelectedForComp ? 'Added' : 'Compare'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedMonograph(drug)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Full Monograph</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FULL 12-SECTION MONOGRAPH MODAL */}
          {selectedMonograph && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        selectedMonograph.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : selectedMonograph.status === 'suspended'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {selectedMonograph.statusBadge}
                      </span>
                      <span className="text-xs text-slate-400">{selectedMonograph.therapeuticCategory}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{selectedMonograph.name}</h2>
                    <p className="text-xs text-teal-400 font-mono mt-0.5">
                      Proprietary / Brand: {selectedMonograph.brandNames.join(', ')} • ATC: {selectedMonograph.atcCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintMonograph}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Print Monograph"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedMonograph(null)}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 cursor-pointer"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Body: 12 Exhaustive Monograph Sections */}
                <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-200">
                  {/* Forensics Box if Withdrawn */}
                  {selectedMonograph.status === 'suspended' && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4" />
                          <span>Pharmacovigilance Forensics &amp; Market Expulsion Analysis</span>
                        </span>
                        <span className="text-xs font-mono text-rose-300 font-bold">
                          Recalled: {selectedMonograph.marketLifecycleDetails.yearWithdrawnOrSuspended}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-200">
                        <strong>Toxicological Root Cause:</strong> {selectedMonograph.marketLifecycleDetails.toxicologicalRootCause}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-300">
                        <strong>Pivotal Safety Evidence:</strong> {selectedMonograph.marketLifecycleDetails.pivotalSafetyTrials}
                      </p>
                      {selectedMonograph.marketLifecycleDetails.saferAlternatives && (
                        <div className="pt-2 border-t border-rose-500/20 text-xs text-emerald-400 font-semibold">
                          <strong>Safer Clinical Alternatives:</strong> {selectedMonograph.marketLifecycleDetails.saferAlternatives.join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pipeline Box if Investigational */}
                  {selectedMonograph.status === 'pipeline' && (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>Investigational Clinical Pipeline &amp; Breakthrough Biology</span>
                        </span>
                        <span className="text-xs font-mono text-indigo-200 font-bold">
                          {selectedMonograph.marketLifecycleDetails.clinicalTrialPhase}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-200">
                        <strong>Lead Sponsor:</strong> {selectedMonograph.marketLifecycleDetails.leadSponsor} • <strong>Target:</strong> {selectedMonograph.molecularTarget}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-300">
                        <strong>Anticipated Approval:</strong> {selectedMonograph.marketLifecycleDetails.expectedApprovalYear}
                      </p>
                      <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                        <strong>Endpoints &amp; Advantages:</strong> {selectedMonograph.marketLifecycleDetails.clinicalAdvantageOverStandard}
                      </div>
                    </div>
                  )}

                  {/* Section 1: Indications & MOA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                        1. Mechanism of Action (MOA)
                      </span>
                      <p className="text-xs leading-relaxed text-slate-300">{selectedMonograph.mechanismOfAction}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                        2. Clinical Indications
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {selectedMonograph.indications.map((ind, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Section 2: Dosing & Organ Adjustments */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                      3. Standard Dosing &amp; Organ Adjustments
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <strong className="text-white block mb-1">Adult Dosage:</strong>
                        <span className="text-slate-300 leading-relaxed">{selectedMonograph.dosingAndAdministration.adult}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <strong className="text-white block mb-1">Renal Adjustment:</strong>
                        <span className="text-slate-300 leading-relaxed">{selectedMonograph.organDoseAdjustments.renal}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <strong className="text-white block mb-1">Hepatic Adjustment:</strong>
                        <span className="text-slate-300 leading-relaxed">{selectedMonograph.organDoseAdjustments.hepatic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Pharmacokinetics Table */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                      4. Pharmacokinetic Profile (ADME)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900 text-center">
                        <span className="text-[10px] text-slate-400 block">Bioavailability</span>
                        <strong className="text-white">{selectedMonograph.pharmacokinetics.bioavailability}</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-center">
                        <span className="text-[10px] text-slate-400 block">Half-Life (t1/2)</span>
                        <strong className="text-white">{selectedMonograph.pharmacokinetics.halfLife}</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-center">
                        <span className="text-[10px] text-slate-400 block">Tmax</span>
                        <strong className="text-white">{selectedMonograph.pharmacokinetics.tmax}</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-center">
                        <span className="text-[10px] text-slate-400 block">Protein Binding</span>
                        <strong className="text-white">{selectedMonograph.pharmacokinetics.proteinBinding}</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-center col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 block">Elimination</span>
                        <strong className="text-white">{selectedMonograph.pharmacokinetics.elimination}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Black Box Warnings & Safety */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <span className="font-bold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Black Box Warnings &amp; Critical Safety Alerts</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {selectedMonograph.blackBoxWarnings.map((warn, wIdx) => (
                        <li key={wIdx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 5: Clinical Pearls */}
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2 text-xs">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Clinical Pharmacist Practice Pearls:</span>
                    </span>
                    <ul className="space-y-1">
                      {selectedMonograph.clinicalPharmacistPearls.map((pearl, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-slate-200">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{pearl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Pharma Star Universal Monograph Database • Evidence-Based Pharmacology
                  </span>
                  <button
                    onClick={() => setSelectedMonograph(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIDE-BY-SIDE DRUG COMPARISON MATRIX MODAL */}
          {isComparing && comparisonDrugs.length > 0 && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Side-by-Side Clinical Drug Comparison</h3>
                  </div>
                  <button
                    onClick={() => setIsComparing(false)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-teal-300">
                        <th className="py-3 px-3 w-1/4">Parameter</th>
                        {comparisonDrugs.map(d => (
                          <th key={d.id} className="py-3 px-3 font-bold text-white text-sm">
                            {d.name}
                            <span className="block text-[10px] text-teal-400 font-normal">{d.brandNames[0]}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-400">Lifecycle Status</td>
                        {comparisonDrugs.map(d => (
                          <td key={d.id} className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                              {d.statusBadge}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-400">Class &amp; MOA</td>
                        {comparisonDrugs.map(d => (
                          <td key={d.id} className="py-2.5 px-3 text-slate-300 leading-snug">
                            <strong>{d.drugClass}:</strong> {d.mechanismOfAction.slice(0, 140)}...
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-400">Adult Dosing</td>
                        {comparisonDrugs.map(d => (
                          <td key={d.id} className="py-2.5 px-3 text-slate-200">
                            {d.dosingAndAdministration.adult}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-400">Renal Cut-Off</td>
                        {comparisonDrugs.map(d => (
                          <td key={d.id} className="py-2.5 px-3 text-amber-300">
                            {d.organDoseAdjustments.renal}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-400">Half-Life (t1/2)</td>
                        {comparisonDrugs.map(d => (
                          <td key={d.id} className="py-2.5 px-3 text-slate-200 font-mono">
                            {d.pharmacokinetics.halfLife}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-400">Black Box Warning</td>
                        {comparisonDrugs.map(d => (
                          <td key={d.id} className="py-2.5 px-3 text-rose-300 leading-snug">
                            {d.blackBoxWarnings[0]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                  <button
                    onClick={() => setIsComparing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MEDICAL ADVANCEMENT SCENARIO SIMULATOR                            */}
      {/* ========================================================================= */}
      {activeMainTab === 'scenarios' && activeScenario && (
        <div className="space-y-6">
          {/* Scenario Selector Ribbon */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2 overflow-x-auto">
              {medicalAdvancementScenarios.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                    activeScenarioId === sc.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{sc.clinicalDomain}: {sc.title.split(':')[0]}</span>
                </button>
              ))}
            </div>

            {/* Paradigm Toggle: Traditional vs Advancement */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shrink-0">
              <button
                onClick={() => setScenarioParadigm('traditional')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  scenarioParadigm === 'traditional'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Historical Standard</span>
              </button>
              <button
                onClick={() => setScenarioParadigm('advancement')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  scenarioParadigm === 'advancement'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Breakthrough Advancement</span>
              </button>
            </div>
          </div>

          {/* Active Scenario Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeScenario.clinicalDomain} Clinical Scenario
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white mt-1.5">
                  {activeScenario.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  {activeScenario.patientVignette}
                </p>
              </div>
            </div>

            {/* Interactive Side-by-Side Paradigm Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traditional Paradigm Panel */}
              <div className={`rounded-2xl p-5 border space-y-4 transition-all ${
                scenarioParadigm === 'traditional'
                  ? 'border-rose-500 bg-rose-950/20 ring-2 ring-rose-500/40 shadow-xl'
                  : 'border-slate-800 bg-slate-950/60 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Historical / Toxic Standard Paradigm</span>
                  </span>
                  <span className="text-xs text-rose-400 font-mono font-bold">Prior Approach</span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {activeScenario.historicalOrToxicParadigm.approachName}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.historicalOrToxicParadigm.description}
                </p>

                {/* Drawbacks list */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Documented Toxicities &amp; Drawbacks:
                  </span>
                  {activeScenario.historicalOrToxicParadigm.clinicalDrawbacksAndFatalRisks.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 text-xs text-rose-200">
                  <strong>Patient Outcome:</strong> {activeScenario.historicalOrToxicParadigm.patientOutcome}
                </div>
              </div>

              {/* Modern Advancement Paradigm Panel */}
              <div className={`rounded-2xl p-5 border space-y-4 transition-all ${
                scenarioParadigm === 'advancement'
                  ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/40 shadow-xl'
                  : 'border-slate-800 bg-slate-950/60 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Modern Advancement Breakthrough</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">2026 Innovation</span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {activeScenario.advancementParadigm.breakthroughAgent}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.advancementParadigm.innovativeMechanism}
                </p>

                {/* Superiority Endpoints */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Proven Clinical Superiority:
                  </span>
                  {activeScenario.advancementParadigm.clinicalAdvantages.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-xs text-emerald-200">
                  <strong>Breakthrough Trajectory:</strong> {activeScenario.advancementParadigm.patientOutcome}
                </div>
              </div>
            </div>

            {/* Interactive Biomarker Comparison Chart */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Interactive Biomarker Trajectory &amp; Outcome Metrics</span>
                </span>
                <span className="text-xs text-slate-400">
                  Showing <strong>{scenarioParadigm === 'advancement' ? 'Breakthrough Paradigm' : 'Historical Paradigm'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeScenario.interactiveComparisonMetrics.map((bm, bIdx) => (
                  <div key={bIdx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">{bm.parameter}</span>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-rose-300">
                        <span className="text-[10px] text-slate-400">Historical:</span>
                        <span className="font-mono">{bm.historicalValue}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span className="text-[10px] text-slate-400">Advancement:</span>
                        <span className="font-mono">{bm.advancedValue}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-teal-400 leading-snug">
                      {bm.impactSummary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Pearls */}
            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Clinical Pharmacy Teaching Pearls:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {activeScenario.pharmacistTeachingPoints.map((pearl, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pearl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DRUG INFORMATION SERVICES (DIS) FOR STUDENTS & PROFESSIONALS      */}
      {/* ========================================================================= */}
      {activeMainTab === 'dis_portal' && (
        <div className="space-y-6">
          {/* Systematic Search Algorithm Ribbon */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  Good Pharmacy Practice Standard (GPP / ASHP)
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  7-Step Modified Systematic Search Algorithm for Clinical Drug Inquiries
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Standardized Methodology
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {systematicSearchAlgorithmSteps.slice(0, 4).map(step => (
                <div key={step.stepNumber} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold font-mono text-[10px]">
                    Step {step.stepNumber}
                  </span>
                  <h4 className="font-bold text-white text-xs">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{step.description}</p>
                  <p className="text-[10px] text-teal-400 pt-1 border-t border-slate-800">
                    <strong>Ref:</strong> {step.keyDatabasesOrReferences[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Inquiry Portal & Hospital Consults Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Submit Inquiry Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  Submit Clinical Inquiry
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  DIS Consultation Request Form
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  For ward clinical pharmacists, pharmacy students, interns, and physicians needing systematic tertiary drug evidence.
                </p>

                <form onSubmit={handleDISSubmit} className="space-y-3 mt-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Inquirer Role:</label>
                    <select
                      value={disInquirerType}
                      onChange={(e) => setDisInquirerType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500"
                    >
                      <option>Pharmacy Student</option>
                      <option>Ward Clinical Pharmacist</option>
                      <option>Attending Physician</option>
                      <option>Resident Physician</option>
                      <option>Critical Care Nurse</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Urgency:</label>
                      <select
                        value={disUrgency}
                        onChange={(e) => setDisUrgency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-teal-500"
                      >
                        <option>Immediate / STAT (Emergency)</option>
                        <option>Within 2 Hours (Urgent Inpatient)</option>
                        <option>Same Day Ward Rounds</option>
                        <option>Routine Academic / Learning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Subject Category:</label>
                      <select
                        value={disCategory}
                        onChange={(e) => setDisCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-teal-500"
                      >
                        <option>IV Y-Site Compatibility &amp; Precipitation</option>
                        <option>Dosing &amp; Therapeutic Drug Monitoring (TDM)</option>
                        <option>Renal &amp; Hepatic Dose Adjustments</option>
                        <option>Adverse Drug Reaction &amp; Toxicity</option>
                        <option>Pregnancy &amp; Teratogenicity</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Patient Clinical Demographics &amp; Labs:</label>
                    <textarea
                      rows={2}
                      value={disPatientInfo}
                      onChange={(e) => setDisPatientInfo(e.target.value)}
                      placeholder="Age, weight, organ function (eGFR, ALT/AST), concurrent meds..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Clinical Question / Inquiry:</label>
                    <textarea
                      rows={3}
                      value={disQuestionText}
                      onChange={(e) => setDisQuestionText(e.target.value)}
                      placeholder="State the clinical scenario and question in detail..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Process Systematic Consultation</span>
                  </button>
                </form>
              </div>

              {/* Submitted Response Preview Card */}
              {submittedConsultation && (
                <div className="mt-4 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-300">{submittedConsultation.id}</span>
                    <span className="text-[10px] text-slate-400">{submittedConsultation.date}</span>
                  </div>
                  <p className="text-white font-semibold">{submittedConsultation.question}</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{submittedConsultation.answerSummary}</p>
                  <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between text-[10px]">
                    <span className="text-amber-300">{submittedConsultation.evidenceGrade}</span>
                    <button
                      onClick={() => window.print()}
                      className="text-teal-400 hover:underline font-bold"
                    >
                      Export PDF ➔
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Pre-Answered Real Hospital Consultations (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                    Peer-Reviewed Inpatient Repository
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Pre-Answered Landmark Hospital Consultations
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {drugInformationConsultsData.length} High-Yield Consults
                </span>
              </div>

              <div className="space-y-4">
                {drugInformationConsultsData.map(consult => (
                  <div
                    key={consult.id}
                    className="bg-slate-900 border border-slate-800 hover:border-teal-500/60 rounded-2xl p-5 space-y-3 shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold text-[10px]">
                          {consult.inquiryCode}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                          {consult.inquiryCategory}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full bg-rose-500/10">
                        {consult.requesterRole}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {consult.inquiryQuestion}
                    </h4>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">Patient Background &amp; Setting:</span>
                      <p>{consult.patientBackground} ({consult.clinicalSetting})</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/30 space-y-2 text-xs">
                      <span className="font-bold text-teal-400 uppercase tracking-wider text-[10px] block">
                        Evidence Synthesis &amp; Pharmacist Recommendation:
                      </span>
                      <p className="text-slate-200 leading-relaxed font-sans">
                        {consult.evidenceSynthesisAndClinicalRecommendation.directAnswer}
                      </p>
                    </div>

                    {/* Stepwise Actions & References */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-slate-400">
                        <strong>Setting:</strong> {consult.clinicalSetting}
                      </span>
                      <button
                        onClick={() => setSelectedConsult(consult)}
                        className="text-teal-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Consultation Record &amp; PDF</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FULL DIS CONSULTATION MODAL FOR PRINT / WARD ROUNDS */}
          {selectedConsult && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <h3 className="text-base font-bold text-white">
                      Official Drug Information Consultation Record ({selectedConsult.inquiryCode})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedConsult(null)}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-slate-200 font-sans">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span><strong>Category:</strong> {selectedConsult.inquiryCategory}</span>
                      <span><strong>Role:</strong> {selectedConsult.requesterRole}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{selectedConsult.inquiryQuestion}</h4>
                    <p className="text-xs text-slate-300">{selectedConsult.patientBackground}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-2">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-xs block">
                      Direct Clinical Answer:
                    </span>
                    <p className="leading-relaxed whitespace-pre-line text-xs md:text-sm">
                      {selectedConsult.evidenceSynthesisAndClinicalRecommendation.directAnswer}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px] block">
                      Pharmacological Rationale:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedConsult.evidenceSynthesisAndClinicalRecommendation.pharmacologicalRationale}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
                      Stepwise Implementation Checklist:
                    </span>
                    <ol className="space-y-1">
                      {selectedConsult.evidenceSynthesisAndClinicalRecommendation.actionableStepByStepPlan.map((st, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="font-bold text-teal-400">{i + 1}.</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-2 text-xs text-slate-400 space-y-1">
                    <p><strong>Primary Literature References:</strong> {selectedConsult.evidenceSynthesisAndClinicalRecommendation.primaryLiteratureReferences.join('; ')}</p>
                    <p><strong>Monitoring Parameters:</strong> {selectedConsult.evidenceSynthesisAndClinicalRecommendation.monitoringParameters.join(', ')}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                  <button
                    onClick={() => setSelectedConsult(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
