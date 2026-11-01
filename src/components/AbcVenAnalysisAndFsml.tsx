import React, { useState, useMemo, useRef } from 'react';
import { 
  Building2, Layers, FileText, CheckCircle2, AlertTriangle, 
  Search, Plus, Filter, Printer, ShieldCheck, Sparkles, 
  RefreshCw, TrendingDown, TrendingUp, Check, Copy, ShieldAlert,
  ArrowRight, Download, BarChart3, PieChart, Sliders, DollarSign,
  ChevronDown, ChevronRight, X, AlertCircle, FileCheck, Stethoscope,
  Info, Award, Users, Scale, HelpCircle, Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  rawHospitalPharmaceuticals, 
  initialFacilityMedicines, 
  initialDtcMetadata, 
  calculateAbcVenAnalysis 
} from '../data/abcVenFsmlData';
import { 
  AbcVenMedicineItem, 
  FacilityMedicineItem, 
  DtcReportMetadata,
  AbcClass,
  VenClass,
  AbcVenMatrixCell,
  PriorityTier,
  HospitalFacilityTier
} from '../types';

interface AbcVenAnalysisAndFsmlProps {
  currentUser?: any;
  onOpenConsultation?: () => void;
}

export const AbcVenAnalysisAndFsml: React.FC<AbcVenAnalysisAndFsmlProps> = ({ currentUser }) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'abc' | 'ven' | 'matrix' | 'fsml' | 'dtc_resolution'>('abc');

  // ABC Thresholds
  const [thresholdA, setThresholdA] = useState<number>(75);
  const [thresholdB, setThresholdB] = useState<number>(90);

  // Facility Metadata
  const [metadata, setMetadata] = useState<DtcReportMetadata>(initialDtcMetadata);

  // Datasets
  const [items, setItems] = useState(rawHospitalPharmaceuticals);
  const [facilityMedicines, setFacilityMedicines] = useState<FacilityMedicineItem[]>(initialFacilityMedicines);

  // Budget Simulation State
  const [simulatedBudgetCutPercent, setSimulatedBudgetCutPercent] = useState<number>(0);

  // Filter & Search States
  const [abcSearch, setAbcSearch] = useState('');
  const [abcFilterClass, setAbcFilterClass] = useState<'all' | AbcClass>('all');
  const [abcFilterVen, setAbcFilterVen] = useState<'all' | VenClass>('all');
  const [fsmlSearch, setFsmlSearch] = useState('');
  const [fsmlCategoryFilter, setFsmlCategoryFilter] = useState('all');
  const [fsmlTierFilter, setFsmlTierFilter] = useState<'all' | HospitalFacilityTier>('all');
  const [fsmlStatusFilter, setFsmlStatusFilter] = useState('all');

  // Modal / Form States
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddFsmlModalOpen, setIsAddFsmlModalOpen] = useState(false);
  const [isPrintDossierOpen, setIsPrintDossierOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // New ABC Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemStrength, setNewItemStrength] = useState('');
  const [newItemForm, setNewItemForm] = useState('Vial');
  const [newItemCategory, setNewItemCategory] = useState('Anti-infective');
  const [newItemConsumption, setNewItemConsumption] = useState<number>(5000);
  const [newItemUnitCost, setNewItemUnitCost] = useState<number>(150);
  const [newItemVen, setNewItemVen] = useState<VenClass>('E');
  const [newItemLevel, setNewItemLevel] = useState<HospitalFacilityTier>('General');

  // New FSML Item Form State
  const [newFsmlInn, setNewFsmlInn] = useState('');
  const [newFsmlStrengthForm, setNewFsmlStrengthForm] = useState('');
  const [newFsmlCategory, setNewFsmlCategory] = useState('Cardiovascular');
  const [newFsmlSubcategory, setNewFsmlSubcategory] = useState('');
  const [newFsmlLevel, setNewFsmlLevel] = useState<HospitalFacilityTier>('General');
  const [newFsmlPrescriber, setNewFsmlPrescriber] = useState('General Medical Practitioner');
  const [newFsmlVen, setNewFsmlVen] = useState<VenClass>('E');
  const [newFsmlIndication, setNewFsmlIndication] = useState('');
  const [newFsmlRationale, setNewFsmlRationale] = useState('');
  const [newFsmlMaxDays, setNewFsmlMaxDays] = useState<number>(30);

  // Compute dynamic ABC & VEN Analysis
  const analysis = useMemo(() => {
    return calculateAbcVenAnalysis(items, thresholdA, thresholdB);
  }, [items, thresholdA, thresholdB]);

  // Filtered ABC items
  const filteredAbcItems = useMemo(() => {
    return analysis.processedItems.filter(item => {
      const matchSearch = item.genericName.toLowerCase().includes(abcSearch.toLowerCase()) ||
                          item.itemCode.toLowerCase().includes(abcSearch.toLowerCase()) ||
                          (item.brandAliases && item.brandAliases.toLowerCase().includes(abcSearch.toLowerCase()));
      const matchClass = abcFilterClass === 'all' || item.abcClass === abcFilterClass;
      const matchVen = abcFilterVen === 'all' || item.venClass === abcFilterVen;
      return matchSearch && matchClass && matchVen;
    });
  }, [analysis.processedItems, abcSearch, abcFilterClass, abcFilterVen]);

  // Filtered FSML items
  const filteredFsml = useMemo(() => {
    return facilityMedicines.filter(m => {
      const matchSearch = m.inn.toLowerCase().includes(fsmlSearch.toLowerCase()) ||
                          m.stgIndication.toLowerCase().includes(fsmlSearch.toLowerCase()) ||
                          m.subCategory.toLowerCase().includes(fsmlSearch.toLowerCase());
      const matchCat = fsmlCategoryFilter === 'all' || m.therapeuticCategory === fsmlCategoryFilter;
      const matchTier = fsmlTierFilter === 'all' || m.levelOfUse === fsmlTierFilter;
      const matchStatus = fsmlStatusFilter === 'all' || m.dtcApprovalStatus === fsmlStatusFilter;
      return matchSearch && matchCat && matchTier && matchStatus;
    });
  }, [facilityMedicines, fsmlSearch, fsmlCategoryFilter, fsmlTierFilter, fsmlStatusFilter]);

  // Therapeutic categories list for FSML
  const therapeuticCategories = useMemo(() => {
    return Array.from(new Set(facilityMedicines.map(m => m.therapeuticCategory)));
  }, [facilityMedicines]);

  // Handle adding new ABC item
  const handleAddNewAbcItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem = {
      id: `med-${Date.now()}`,
      itemCode: `ETH-MED-${(items.length + 1).toString().padStart(3, '0')}`,
      genericName: newItemName.trim(),
      strength: newItemStrength.trim() || 'Standard Dose',
      dosageForm: newItemForm,
      unitOfIssue: newItemForm,
      therapeuticCategory: newItemCategory,
      annualConsumption: Number(newItemConsumption) || 1,
      unitCostETB: Number(newItemUnitCost) || 1,
      venClass: newItemVen,
      levelOfUse: newItemLevel,
      prescriberRestriction: newItemLevel === 'Specialized' ? 'Specialist / Senior Consultant' as const : 'General Medical Practitioner' as const,
      nemlStatus: 'Core NEML' as const,
      dtcApproved: true,
      clinicalRationale: 'Proposed facility medication added to DTC ABC-VEN annual consumption ledger.'
    };

    setItems([newItem, ...items]);
    setIsAddItemModalOpen(false);
    setNewItemName('');
    setNewItemStrength('');

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  // Handle adding new FSML item
  const handleAddNewFsmlItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFsmlInn) return;

    const newMed: FacilityMedicineItem = {
      id: `fsm-${Date.now()}`,
      inn: newFsmlInn.trim(),
      strengthForm: newFsmlStrengthForm.trim() || 'Standard Form',
      therapeuticCategory: newFsmlCategory,
      subCategory: newFsmlSubcategory.trim() || 'Therapeutic Agent',
      levelOfUse: newFsmlLevel,
      prescriberLevel: newFsmlPrescriber,
      venCategory: newFsmlVen,
      nemlStatus: 'Core NEML',
      efdaRegistrationStatus: 'Registered',
      maxPrescriptionDays: Number(newFsmlMaxDays) || 30,
      dtcApprovalStatus: 'Approved',
      stgIndication: newFsmlIndication.trim() || 'Clinical indication approved by hospital DTC.',
      rationale: newFsmlRationale.trim() || 'Approved based on local epidemiological disease burden and cost-effectiveness.',
      lastReviewedDate: new Date().toISOString().slice(0, 10),
      leadReviewer: 'Hospital DTC Formulary Review Board'
    };

    setFacilityMedicines([newMed, ...facilityMedicines]);
    setIsAddFsmlModalOpen(false);
    setNewFsmlInn('');
    setNewFsmlStrengthForm('');
    setNewFsmlIndication('');
    setNewFsmlRationale('');

    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch (e) {}
  };

  // Toggle DTC Approval Status for FSML
  const handleToggleFsmlStatus = (id: string, newStatus: 'Approved' | 'Restricted' | 'Under Review') => {
    setFacilityMedicines(prev => prev.map(m => m.id === id ? { ...m, dtcApprovalStatus: newStatus } : m));
  };

  // Trigger Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Copy to clipboard helper
  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Rank', 'Item Code', 'Generic Name', 'Strength & Form', 'Category', 'Annual Consumption', 'Unit Cost (ETB)', 'Total Cost (ETB)', '% of Spend', 'Cumulative %', 'ABC Class', 'VEN Class', 'Matrix Cell', 'Priority Tier'];
    const rows = analysis.processedItems.map(i => [
      i.itemRank,
      i.itemCode,
      `"${i.genericName.replace(/"/g, '""')}"`,
      `"${i.strength} ${i.dosageForm}"`,
      `"${i.therapeuticCategory}"`,
      i.annualConsumption,
      i.unitCostETB,
      i.totalCostETB,
      i.percentOfTotalSpend.toFixed(2),
      i.cumulativePercent.toFixed(2),
      i.abcClass,
      i.venClass,
      i.matrixCategory,
      `"${i.priorityTier}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DTC_ABC_VEN_Analysis_${metadata.facilityName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5 shadow">
                <Scale className="w-3.5 h-3.5 text-teal-400" />
                <span>EPSS &amp; MoH Pharmaceutical Management Standard</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                DTC Formulary &amp; Health Economics Suite
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>ABC &amp; VEN Analysis &amp; Facility Specific Medicine List</span>
            </h1>

            <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
              Execute Pareto cumulative pharmaceutical expenditure analysis (ABC), Vital/Essential/Non-Essential clinical criticality classification (VEN), the 9-cell ABC-VEN decision matrix, and official Drug and Therapeutics Committee (DTC) Facility-Specific Medicine List preparation with printable PDF resolution dossiers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span>Facility: <strong className="text-white">{metadata.facilityName}</strong></span>
              <span>•</span>
              <span>Level: <span className="text-teal-300 font-bold">{metadata.facilityLevel} Hospital</span></span>
              <span>•</span>
              <span>Resolution No: <span className="font-mono text-amber-300">{metadata.meetingResolutionNumber}</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="Export ABC-VEN Dataset to CSV"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('dtc_resolution');
                setTimeout(() => window.print(), 300);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-600/30"
              title="Print Official DTC Resolution & Medicine List"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF Dossier</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Expenditure</span>
            <span className="text-base md:text-lg font-black text-white font-mono">
              {(analysis.totalExpenditureETB / 1000000).toFixed(2)}M <span className="text-[10px] text-teal-400 font-sans">ETB</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{analysis.totalItemCount} medicines analyzed</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-amber-500/30 rounded-2xl">
            <span className="text-[10px] text-amber-400 uppercase font-bold block flex items-center gap-1">
              <span>Category A (High Spend)</span>
            </span>
            <span className="text-base md:text-lg font-black text-amber-300 font-mono">
              {analysis.abcSummary.A.percentSpend.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {analysis.abcSummary.A.count} items ({(analysis.abcSummary.A.spendETB / 1000000).toFixed(1)}M ETB)
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-emerald-500/30 rounded-2xl">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Vital (V) Share</span>
            <span className="text-base md:text-lg font-black text-emerald-300 font-mono">
              {analysis.venSummary.V.percentSpend.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {analysis.venSummary.V.count} items (100% buffer target)
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-cyan-500/30 rounded-2xl">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block">Essential (E) Share</span>
            <span className="text-base md:text-lg font-black text-cyan-300 font-mono">
              {analysis.venSummary.E.percentSpend.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {analysis.venSummary.E.count} items (core diseases)
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-rose-500/30 rounded-2xl">
            <span className="text-[10px] text-rose-400 uppercase font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Non-Essential (N)</span>
            </span>
            <span className="text-base md:text-lg font-black text-rose-300 font-mono">
              {analysis.venSummary.N.percentSpend.toFixed(1)}%
            </span>
            <span className="text-[10px] text-rose-400/90 block mt-0.5 font-semibold">
              {(analysis.venSummary.N.spendETB / 1000000).toFixed(2)}M ETB cut target
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-teal-500/30 rounded-2xl">
            <span className="text-[10px] text-teal-400 uppercase font-bold block">Approved FSML</span>
            <span className="text-base md:text-lg font-black text-teal-300 font-mono">
              {facilityMedicines.filter(m => m.dtcApprovalStatus === 'Approved').length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              of {facilityMedicines.length} formulary items
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('abc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'abc'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1. ABC Analysis (Pareto Spend)</span>
          <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded-full font-mono text-teal-300">
            {analysis.totalItemCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ven')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'ven'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>2. VEN Classification (Criticality)</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. ABC-VEN 9-Cell Matrix</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-mono">
            Matrix
          </span>
        </button>

        <button
          onClick={() => setActiveTab('fsml')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'fsml'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>4. Facility-Specific Medicine List (FSML)</span>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-mono">
            {facilityMedicines.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dtc_resolution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'dtc_resolution'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/30'
          }`}
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>5. Official DTC Resolution &amp; Print Dossier</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ABC ANALYSIS (PARETO EXPENDITURE) */}
      {/* ========================================================================= */}
      {activeTab === 'abc' && (
        <div className="space-y-6">
          {/* Pareto Distribution Overview Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-400" />
                  <span>Pareto 80/20 Cumulative Expenditure Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Class A represents the top expenditure driver requiring stringent control, weekly counts, and buffer optimization.
                </p>
              </div>

              {/* Threshold Adjuster Controls */}
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span className="text-slate-400 font-medium">A Cutoff:</span>
                <input
                  type="number"
                  min="60"
                  max="85"
                  value={thresholdA}
                  onChange={(e) => setThresholdA(Number(e.target.value) || 75)}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-white text-xs"
                />
                <span className="text-slate-500">%</span>
                <span className="text-slate-400 font-medium ml-2">B Cutoff:</span>
                <input
                  type="number"
                  min={thresholdA + 1}
                  max="95"
                  value={thresholdB}
                  onChange={(e) => setThresholdB(Number(e.target.value) || 90)}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-white text-xs"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            {/* Visual Cumulative Spend Bar */}
            <div className="space-y-2">
              <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800 shadow-inner">
                <div 
                  style={{ width: `${analysis.abcSummary.A.percentSpend}%` }}
                  className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-black text-slate-950 tracking-wider transition-all"
                  title={`Class A: ${analysis.abcSummary.A.percentSpend.toFixed(1)}%`}
                >
                  A ({analysis.abcSummary.A.percentSpend.toFixed(1)}%)
                </div>
                <div 
                  style={{ width: `${analysis.abcSummary.B.percentSpend}%` }}
                  className="bg-teal-500 h-full flex items-center justify-center text-[10px] font-black text-slate-950 tracking-wider transition-all"
                  title={`Class B: ${analysis.abcSummary.B.percentSpend.toFixed(1)}%`}
                >
                  B ({analysis.abcSummary.B.percentSpend.toFixed(1)}%)
                </div>
                <div 
                  style={{ width: `${analysis.abcSummary.C.percentSpend}%` }}
                  className="bg-cyan-600 h-full flex items-center justify-center text-[10px] font-black text-white tracking-wider transition-all"
                  title={`Class C: ${analysis.abcSummary.C.percentSpend.toFixed(1)}%`}
                >
                  C ({analysis.abcSummary.C.percentSpend.toFixed(1)}%)
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                  <span><strong>Class A:</strong> {analysis.abcSummary.A.count} items ({analysis.abcSummary.A.percentItems.toFixed(1)}% items) → <strong>{(analysis.abcSummary.A.spendETB / 1000000).toFixed(2)}M ETB</strong> ({analysis.abcSummary.A.percentSpend.toFixed(1)}% spend)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-teal-500 inline-block" />
                  <span><strong>Class B:</strong> {analysis.abcSummary.B.count} items ({analysis.abcSummary.B.percentItems.toFixed(1)}% items) → <strong>{(analysis.abcSummary.B.spendETB / 1000000).toFixed(2)}M ETB</strong> ({analysis.abcSummary.B.percentSpend.toFixed(1)}% spend)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-cyan-600 inline-block" />
                  <span><strong>Class C:</strong> {analysis.abcSummary.C.count} items ({analysis.abcSummary.C.percentItems.toFixed(1)}% items) → <strong>{(analysis.abcSummary.C.spendETB / 1000000).toFixed(2)}M ETB</strong> ({analysis.abcSummary.C.percentSpend.toFixed(1)}% spend)</span>
                </div>
              </div>
            </div>

            {/* Strategic Managerial Rules for ABC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
                <span className="font-bold text-amber-300 block">Category A Inventory Policy:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Tightest inventory control. Keep safety stocks low (1-2 months). Place frequent small orders directly with EPSS. Require Chief Pharmacist approval for bulk issues.
                </p>
              </div>
              <div className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-1">
                <span className="font-bold text-teal-300 block">Category B Inventory Policy:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Moderate control. Maintain standard bimonthly IPLS replenishment (2-4 months of stock). Quarterly review of consumption trends.
                </p>
              </div>
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-1">
                <span className="font-bold text-cyan-300 block">Category C Inventory Policy:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Simple control. Bulk order (4-6 months of stock) to minimize procurement transaction costs; stockouts cost more in disruption than holding savings.
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filter & Add Record Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by generic name, brand or code..."
                  value={abcSearch}
                  onChange={(e) => setAbcSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <select
                value={abcFilterClass}
                onChange={(e) => setAbcFilterClass(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All ABC Classes</option>
                <option value="A">Class A Only (Top 75%)</option>
                <option value="B">Class B Only (Next 15%)</option>
                <option value="C">Class C Only (Bottom 10%)</option>
              </select>

              <select
                value={abcFilterVen}
                onChange={(e) => setAbcFilterVen(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All VEN Classes</option>
                <option value="V">Vital (V) Only</option>
                <option value="E">Essential (E) Only</option>
                <option value="N">Non-Essential (N) Only</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine to ABC</span>
            </button>
          </div>

          {/* ABC Analysis Full Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Pareto Ranked Pharmaceutical Expenditure</span>
                <span className="text-xs text-slate-400">({filteredAbcItems.length} items shown)</span>
              </div>
              <span className="text-xs text-slate-400">Values in Ethiopian Birr (ETB)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-3 px-3 font-semibold text-center w-12">Rank</th>
                    <th className="py-3 px-3 font-semibold">Medicine Description</th>
                    <th className="py-3 px-3 font-semibold text-right">Annual Qty</th>
                    <th className="py-3 px-3 font-semibold text-right">Unit Cost</th>
                    <th className="py-3 px-3 font-semibold text-right">Total Spend (ETB)</th>
                    <th className="py-3 px-3 font-semibold text-right">% Spend</th>
                    <th className="py-3 px-3 font-semibold text-right">Cumul %</th>
                    <th className="py-3 px-3 font-semibold text-center">ABC</th>
                    <th className="py-3 px-3 font-semibold text-center">VEN</th>
                    <th className="py-3 px-3 font-semibold text-center">Matrix</th>
                    <th className="py-3 px-3 font-semibold">Policy Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAbcItems.map((item) => {
                    const isClassA = item.abcClass === 'A';
                    const isClassB = item.abcClass === 'B';
                    const isVenN = item.venClass === 'N';
                    const isVenV = item.venClass === 'V';

                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-800/40 transition ${
                          isClassA && isVenN ? 'bg-rose-950/15' : isClassA ? 'bg-amber-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                          #{item.itemRank}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.genericName}</span>
                            {item.brandAliases && (
                              <span className="text-[10px] text-slate-400 font-normal">({item.brandAliases})</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{item.strength} • {item.dosageForm}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-500">{item.itemCode}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {item.annualConsumption.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {item.unitCostETB.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          {item.totalCostETB.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-teal-300">
                          {item.percentOfTotalSpend.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {item.cumulativePercent.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-black text-xs font-mono shadow-sm ${
                            isClassA ? 'bg-amber-500 text-slate-950' :
                            isClassB ? 'bg-teal-500 text-slate-950' : 'bg-cyan-900 text-cyan-200'
                          }`}>
                            {item.abcClass}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-black text-xs font-mono shadow-sm ${
                            isVenV ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            item.venClass === 'E' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            {item.venClass}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            item.matrixCategory === 'AN' ? 'bg-rose-600 text-white animate-pulse' :
                            item.matrixCategory.startsWith('A') ? 'bg-amber-500/20 text-amber-300' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {item.matrixCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 max-w-xs text-[11px] leading-relaxed">
                          {item.budgetActionRecommendation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VEN CLASSIFICATION (CRITICALITY) */}
      {/* ========================================================================= */}
      {activeTab === 'ven' && (
        <div className="space-y-6">
          {/* VEN Principles Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                  V
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">
                  {analysis.venSummary.V.count} Items ({analysis.venSummary.V.percentSpend.toFixed(1)}% spend)
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Vital (V) Medicines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Life-saving medications, critical emergency antidotes, vaccines, and resuscitation agents. Their absence leads to death or severe permanent disability within hours.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-emerald-300 block">Inventory Policy:</span>
                <p className="text-slate-400 text-[11px]">
                  <strong>100% Availability Target.</strong> Zero tolerance for stockouts. Buffer must never breach safety levels. Immediate emergency redistribution if buffer drops &lt;1 month.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg">
                  E
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 font-mono">
                  {analysis.venSummary.E.count} Items ({analysis.venSummary.E.percentSpend.toFixed(1)}% spend)
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Essential (E) Medicines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Effective against major endemic communicable and non-communicable diseases (e.g. malaria, diabetes, hypertension, bacterial infections). Vital over weeks, but not immediate minutes.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-cyan-300 block">Inventory Policy:</span>
                <p className="text-slate-400 text-[11px]">
                  <strong>95%+ Availability Target.</strong> Standard bimonthly review. Controlled substitution allowed with approved therapeutic alternatives if short stock occurs.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-rose-500/40 rounded-3xl p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-lg">
                  N
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 font-mono">
                  {analysis.venSummary.N.count} Items ({analysis.venSummary.N.percentSpend.toFixed(1)}% spend)
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Non-Essential (N) Medicines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Used for minor, self-limiting conditions, symptomatic relief, vitamins with questionable therapeutic efficacy, or high-cost luxury alternatives.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-rose-300 block">Inventory Policy:</span>
                <p className="text-slate-400 text-[11px]">
                  <strong>Lowest Priority.</strong> First candidate for budget pruning. In case of budgetary deficit, procurement of N items must be completely suspended or shifted to patient out-of-pocket.
                </p>
              </div>
            </div>
          </div>

          {/* VEN Filtered Items Display */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h4 className="font-bold text-white text-sm">VEN Categorized Hospital Formulary Breakdown</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vital List */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-xs">Vital Group ({analysis.venSummary.V.count})</span>
                  <span className="font-mono text-xs text-white">{(analysis.venSummary.V.spendETB / 1000000).toFixed(2)}M ETB</span>
                </div>
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {analysis.processedItems.filter(i => i.venClass === 'V').map(item => (
                    <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{item.genericName}</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.matrixCategory}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.strength} • {item.dosageForm}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>Spend: <strong>{item.totalCostETB.toLocaleString()} ETB</strong></span>
                        <span className="text-teal-300 font-mono">Rank #{item.itemRank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential List */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-xs">Essential Group ({analysis.venSummary.E.count})</span>
                  <span className="font-mono text-xs text-white">{(analysis.venSummary.E.spendETB / 1000000).toFixed(2)}M ETB</span>
                </div>
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {analysis.processedItems.filter(i => i.venClass === 'E').map(item => (
                    <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{item.genericName}</span>
                        <span className="font-mono text-cyan-400 font-bold">{item.matrixCategory}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.strength} • {item.dosageForm}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>Spend: <strong>{item.totalCostETB.toLocaleString()} ETB</strong></span>
                        <span className="text-teal-300 font-mono">Rank #{item.itemRank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Essential List */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between">
                  <span className="font-bold text-rose-300 text-xs">Non-Essential Group ({analysis.venSummary.N.count})</span>
                  <span className="font-mono text-xs text-rose-300">{(analysis.venSummary.N.spendETB / 1000000).toFixed(2)}M ETB</span>
                </div>
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {analysis.processedItems.filter(i => i.venClass === 'N').map(item => (
                    <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{item.genericName}</span>
                        <span className="font-mono text-rose-400 font-bold">{item.matrixCategory}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.strength} • {item.dosageForm}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>Spend: <strong>{item.totalCostETB.toLocaleString()} ETB</strong></span>
                        <span className="text-rose-400 font-mono font-bold">Cut Candidate</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ABC-VEN 9-CELL MATRIX (THE DECISION ENGINE) */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Matrix Theory Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-400" />
                  <span>The 9-Cell ABC-VEN Strategic Decision Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Cross-tabulating financial cost (ABC) with medical necessity (VEN) produces 9 cells grouped into 3 managerial priority categories. Cell <strong>AN</strong> is the primary institutional audit red flag.
                </p>
              </div>

              {/* Budget Cut Simulation Slider */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 min-w-[280px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>Budget Deficit Simulator:</span>
                  </span>
                  <span className="font-mono text-rose-400 font-bold">-{simulatedBudgetCutPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={simulatedBudgetCutPercent}
                  onChange={(e) => setSimulatedBudgetCutPercent(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (Full Budget)</span>
                  <span>-20% Deficit</span>
                  <span>-40% Crisis Cut</span>
                </div>
              </div>
            </div>

            {/* Budget Simulation Alert if > 0 */}
            {simulatedBudgetCutPercent > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-100">
                    Simulated Budget Cut: {simulatedBudgetCutPercent}% ({(analysis.totalExpenditureETB * (simulatedBudgetCutPercent / 100) / 1000000).toFixed(2)}M ETB Reduction Required)
                  </p>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed mt-0.5">
                    <strong>Algorithmic Action:</strong> 100% of Vital items (AV, BV, CV) and Essential items (AE) are protected. 
                    Immediate cut applied to Category <strong>AN</strong> ({(analysis.matrixSummary.AN.spendETB / 1000000).toFixed(2)}M ETB), followed by <strong>BN</strong> ({(analysis.matrixSummary.BN.spendETB / 1000000).toFixed(2)}M ETB) and <strong>CN</strong> ({(analysis.matrixSummary.CN.spendETB / 1000000).toFixed(2)}M ETB).
                  </p>
                </div>
              </div>
            )}

            {/* The 9-Cell Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Row 1: Vital Column (AV, BV, CV) */}
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-emerald-500/40">
                  <span className="font-black text-emerald-400 text-sm tracking-wider uppercase block">VITAL (V) COLUMN</span>
                  <span className="text-[11px] text-slate-400">100% Availability Target</span>
                </div>

                {/* AV Cell */}
                <div className="p-4 rounded-2xl bg-emerald-950/25 border-2 border-emerald-500/50 space-y-2 hover:border-emerald-400 transition shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs font-mono">
                      CELL AV
                    </span>
                    <span className="text-xs font-mono text-emerald-300 font-bold">
                      {(analysis.matrixSummary.AV.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.AV.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">High Cost + Vital (Top Priority)</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Meropenem, Trastuzumab, Piperacillin/Tazobactam.
                  </p>
                  <div className="text-[10px] text-emerald-300/90 pt-1 border-t border-slate-800">
                    Policy: Continuous senior consultant audit. Direct EPSS central bulk contract to negotiate price. Keep buffer tight.
                  </div>
                </div>

                {/* BV Cell */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 hover:border-emerald-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600/60 text-emerald-100 font-black text-xs font-mono">
                      CELL BV
                    </span>
                    <span className="text-xs font-mono text-emerald-300 font-bold">
                      {(analysis.matrixSummary.BV.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.BV.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Moderate Cost + Vital</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Oxytocin, Adrenaline, Magnesium Sulfate, Atropine.
                  </p>
                  <div className="text-[10px] text-emerald-300/90 pt-1 border-t border-slate-800">
                    Policy: Zero stockout tolerance. Bimonthly replenishment with 2-4 months buffer.
                  </div>
                </div>

                {/* CV Cell */}
                <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/20 space-y-2 hover:border-emerald-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700/40 text-emerald-200 font-black text-xs font-mono">
                      CELL CV
                    </span>
                    <span className="text-xs font-mono text-emerald-300 font-bold">
                      {(analysis.matrixSummary.CV.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.CV.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Low Cost + Vital (Bulk Safety)</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Diazepam, Hydrocortisone, Tetanus Toxoid, Salbutamol.
                  </p>
                  <div className="text-[10px] text-emerald-300/90 pt-1 border-t border-slate-800">
                    Policy: Low holding cost. Order in 6-month bulk batches. Never allow stockouts for cheap life-savers!
                  </div>
                </div>
              </div>

              {/* Row 2: Essential Column (AE, BE, CE) */}
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-cyan-500/40">
                  <span className="font-black text-cyan-400 text-sm tracking-wider uppercase block">ESSENTIAL (E) COLUMN</span>
                  <span className="text-[11px] text-slate-400">95%+ Availability Target</span>
                </div>

                {/* AE Cell */}
                <div className="p-4 rounded-2xl bg-cyan-950/25 border-2 border-cyan-500/50 space-y-2 hover:border-cyan-400 transition shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs font-mono">
                      CELL AE
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {(analysis.matrixSummary.AE.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.AE.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">High Cost + Essential (Prime Saving Target)</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Enoxaparin, Insulin Glargine, Ceftriaxone.
                  </p>
                  <div className="text-[10px] text-cyan-300/90 pt-1 border-t border-slate-800">
                    Policy: Major target for cost-reduction! Promote generic substitution, therapeutic step-down, and price tenders.
                  </div>
                </div>

                {/* BE Cell */}
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-600/60 text-cyan-100 font-black text-xs font-mono">
                      CELL BE
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {(analysis.matrixSummary.BE.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.BE.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Moderate Cost + Essential</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Amoxicillin/Clavulanate, Atorvastatin, Metformin.
                  </p>
                  <div className="text-[10px] text-cyan-300/90 pt-1 border-t border-slate-800">
                    Policy: Standard IPLS bimonthly orders. Reconcile with disease surveillance data.
                  </div>
                </div>

                {/* CE Cell */}
                <div className="p-4 rounded-2xl bg-cyan-950/15 border border-cyan-500/20 space-y-2 hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-700/40 text-cyan-200 font-black text-xs font-mono">
                      CELL CE
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {(analysis.matrixSummary.CE.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.CE.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Low Cost + Essential</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Paracetamol, ORS, Folic Acid, Ciprofloxacin.
                  </p>
                  <div className="text-[10px] text-cyan-300/90 pt-1 border-t border-slate-800">
                    Policy: Routine dispensary replenishment. Minimize stockouts of cheap community essentials.
                  </div>
                </div>
              </div>

              {/* Row 3: Non-Essential Column (AN, BN, CN) */}
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-rose-500/40">
                  <span className="font-black text-rose-400 text-sm tracking-wider uppercase block">NON-ESSENTIAL (N) COLUMN</span>
                  <span className="text-[11px] text-rose-400/80">Audit &amp; Elimination Targets</span>
                </div>

                {/* AN Cell */}
                <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500 space-y-2 hover:border-rose-400 transition shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider rounded-bl-lg">
                    CRITICAL AUDIT
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs font-mono">
                      CELL AN
                    </span>
                    <span className="text-xs font-mono text-rose-300 font-bold">
                      {(analysis.matrixSummary.AN.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.AN.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-rose-200 text-xs">High Cost + Non-Essential (Cardinal Flag!)</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Human Albumin 20%, IV Multivitamin Complexes.
                  </p>
                  <div className="text-[10px] text-rose-300 pt-1 border-t border-rose-900/80 font-semibold">
                    Policy: Unacceptable budget drain! DTC must require prior authorization form or eliminate from hospital budget.
                  </div>
                </div>

                {/* BN Cell */}
                <div className="p-4 rounded-2xl bg-rose-950/25 border border-rose-500/40 space-y-2 hover:border-rose-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-700/60 text-rose-200 font-black text-xs font-mono">
                      CELL BN
                    </span>
                    <span className="text-xs font-mono text-rose-300 font-bold">
                      {(analysis.matrixSummary.BN.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.BN.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Moderate Cost + Non-Essential</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Topical Analgesic Balms, Brand cough preparations.
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    Policy: Do not subsidize. Sell only in private hospital wing or refer to community pharmacy.
                  </div>
                </div>

                {/* CN Cell */}
                <div className="p-4 rounded-2xl bg-rose-950/15 border border-rose-500/20 space-y-2 hover:border-rose-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-900/40 text-rose-300 font-black text-xs font-mono">
                      CELL CN
                    </span>
                    <span className="text-xs font-mono text-rose-300 font-bold">
                      {(analysis.matrixSummary.CN.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.CN.percentSpend.toFixed(1)}%)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Low Cost + Non-Essential</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Examples: Throat Lozenges, Menthol rubs.
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    Policy: Delist from procurement entirely. Do not waste warehouse bin card space.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FACILITY-SPECIFIC MEDICINE LIST (FSML) PREPARATION */}
      {/* ========================================================================= */}
      {activeTab === 'fsml' && (
        <div className="space-y-6">
          {/* FSML Header and Action Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-400" />
                  <span>Hospital Facility-Specific Medicine List (FSML) Master Registry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Aligned with Ethiopian National Essential Medicines List (NEML) and Standard Treatment Guidelines (STG) 5th Edition.
                </p>
              </div>

              <button
                onClick={() => setIsAddFsmlModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-teal-600/30 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Propose Medicine to DTC</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search INN or indication..."
                  value={fsmlSearch}
                  onChange={(e) => setFsmlSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <select
                value={fsmlCategoryFilter}
                onChange={(e) => setFsmlCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All Therapeutic Categories</option>
                {therapeuticCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={fsmlTierFilter}
                onChange={(e) => setFsmlTierFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All Hospital Tiers</option>
                <option value="Primary">Primary Hospital / Health Center</option>
                <option value="General">General Hospital</option>
                <option value="Specialized">Specialized / Tertiary Hospital</option>
              </select>

              <select
                value={fsmlStatusFilter}
                onChange={(e) => setFsmlStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All DTC Approval Statuses</option>
                <option value="Approved">Approved for Formulary</option>
                <option value="Restricted">Restricted / Prior Auth Required</option>
                <option value="Conditional">Conditional / Step-down</option>
                <option value="Under Review">Under Review / Delist Candidate</option>
              </select>
            </div>
          </div>

          {/* FSML Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFsml.map(med => {
              const isApproved = med.dtcApprovalStatus === 'Approved';
              const isRestricted = med.dtcApprovalStatus === 'Restricted';
              const isReview = med.dtcApprovalStatus === 'Under Review';

              return (
                <div 
                  key={med.id}
                  className={`p-5 rounded-2xl bg-slate-900/90 border transition space-y-3 shadow-md ${
                    isRestricted ? 'border-amber-500/40 bg-amber-950/10' :
                    isReview ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800 hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{med.inn}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                          med.venCategory === 'V' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          med.venCategory === 'E' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          VEN: {med.venCategory}
                        </span>
                      </div>
                      <p className="text-teal-400 font-semibold text-xs mt-0.5">{med.strengthForm}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        isRestricted ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {med.dtcApprovalStatus}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Max: {med.maxPrescriptionDays} days</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-slate-400">STG Indication:</strong> {med.stgIndication}
                    </p>
                    <p className="leading-relaxed text-slate-400 text-[11px]">
                      <strong className="text-slate-300">DTC Rationale:</strong> {med.rationale}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>Tier: <strong className="text-teal-300">{med.levelOfUse}</strong></span>
                      <span>•</span>
                      <span>Rx Level: <strong className="text-slate-200">{med.prescriberLevel}</strong></span>
                    </div>

                    {/* Status Toggles */}
                    <div className="flex items-center gap-1.5">
                      {med.dtcApprovalStatus !== 'Approved' && (
                        <button
                          onClick={() => handleToggleFsmlStatus(med.id, 'Approved')}
                          className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 text-[10px] font-bold border border-emerald-500/40 cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {med.dtcApprovalStatus !== 'Restricted' && (
                        <button
                          onClick={() => handleToggleFsmlStatus(med.id, 'Restricted')}
                          className="px-2 py-0.5 rounded bg-amber-600/30 text-amber-300 hover:bg-amber-600/50 text-[10px] font-bold border border-amber-500/40 cursor-pointer"
                        >
                          Restrict
                        </button>
                      )}
                      {med.dtcApprovalStatus !== 'Under Review' && (
                        <button
                          onClick={() => handleToggleFsmlStatus(med.id, 'Under Review')}
                          className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 hover:bg-rose-600/50 text-[10px] font-bold border border-rose-500/40 cursor-pointer"
                        >
                          Delist Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: OFFICIAL DTC RESOLUTION & PRINTABLE PDF DOSSIER */}
      {/* ========================================================================= */}
      {activeTab === 'dtc_resolution' && (
        <div className="space-y-6">
          {/* Print Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-white text-sm">Official DTC Resolution &amp; Medicine Formulary Dossier</span>
              <p className="text-xs text-slate-400">Formatted for print, legal audit archiving, and Ministry of Health / Regional Health Bureau submission.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-teal-600/30"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document (Ctrl+P / PDF)</span>
              </button>
            </div>
          </div>

          {/* PRINTABLE DOSSIER SHEET (Styled with clean print CSS) */}
          <div className="bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-200 print:p-0 print:border-none print:shadow-none space-y-8 max-w-5xl mx-auto font-serif">
            {/* Official Ethiopian Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
              <div className="text-xs font-sans uppercase tracking-widest text-slate-600 font-bold">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA • MINISTRY OF HEALTH
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 font-sans tracking-tight">
                {metadata.facilityName}
              </h2>
              <div className="text-sm font-sans font-bold text-teal-800 uppercase tracking-wider">
                DRUG AND THERAPEUTICS COMMITTEE (DTC)
              </div>
              <div className="text-xs font-sans text-slate-600 flex justify-center items-center gap-4 pt-1">
                <span>Facility Level: <strong>{metadata.facilityLevel} Hospital</strong></span>
                <span>•</span>
                <span>Resolution Ref: <strong>{metadata.meetingResolutionNumber}</strong></span>
                <span>•</span>
                <span>Meeting Date: <strong>{metadata.meetingDate}</strong></span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold font-sans text-slate-900 uppercase">
                EXECUTIVE RESOLUTION ON FACILITY MEDICINE FORMULARY &amp; ABC-VEN ANALYSIS
              </h3>
              <p className="text-xs font-sans text-slate-600 italic">
                Adoption of Fiscal Year {metadata.fiscalYear} Pharmaceutical Procurement Budget &amp; Essential Medicines List
              </p>
            </div>

            {/* Resolution Statement */}
            <div className="font-sans text-xs text-slate-800 leading-relaxed space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <p>
                Pursuant to the powers vested in the Drug and Therapeutics Committee (DTC) by the Ethiopian Ministry of Health and the Ethiopian Food and Drug Authority (EFDA) guidelines, the Committee convened on <strong>{metadata.meetingDate}</strong> to conduct the formal annual review of pharmaceutical consumption, therapeutic efficacy, and expenditure allocation.
              </p>
              <p>
                Following rigorous ABC Pareto expenditure analysis, VEN criticality ranking, and STG concordance auditing, the Committee hereby adopts the following budgetary allocations and medicine formulary for the hospital.
              </p>
            </div>

            {/* Key Figures Summary Table */}
            <div className="space-y-3 font-sans">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b pb-1">
                1. Financial Allocation &amp; ABC-VEN Pareto Distribution
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block">Approved Annual Drug Budget</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {metadata.totalAnnualBudgetETB.toLocaleString()} ETB
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Category A Spend (75.4%)</span>
                  <span className="text-base font-bold text-amber-900 font-mono">
                    {analysis.abcSummary.A.spendETB.toLocaleString()} ETB
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Vital (V) Guaranteed Allocation</span>
                  <span className="text-base font-bold text-emerald-900 font-mono">
                    {analysis.venSummary.V.spendETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            {/* 9-Cell ABC-VEN Matrix Summary */}
            <div className="space-y-3 font-sans">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b pb-1">
                2. Nine-Cell ABC-VEN Matrix Summary (Values in ETB)
              </h4>
              <table className="w-full text-xs border border-slate-300 border-collapse text-center">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold">
                    <th className="border p-2">Category</th>
                    <th className="border p-2 bg-emerald-100 text-emerald-900">Vital (V)</th>
                    <th className="border p-2 bg-cyan-100 text-cyan-900">Essential (E)</th>
                    <th className="border p-2 bg-rose-100 text-rose-900">Non-Essential (N)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-bold bg-amber-100 text-left">Class A (Top 75%)</td>
                    <td className="border p-2 font-mono font-bold">
                      AV: {(analysis.matrixSummary.AV.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.AV.count} items)
                    </td>
                    <td className="border p-2 font-mono font-bold">
                      AE: {(analysis.matrixSummary.AE.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.AE.count} items)
                    </td>
                    <td className="border p-2 font-mono font-bold text-rose-700 bg-rose-50">
                      AN: {(analysis.matrixSummary.AN.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.AN.count} items)
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold bg-teal-50 text-left">Class B (Next 15%)</td>
                    <td className="border p-2 font-mono">
                      BV: {(analysis.matrixSummary.BV.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.BV.count} items)
                    </td>
                    <td className="border p-2 font-mono">
                      BE: {(analysis.matrixSummary.BE.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.BE.count} items)
                    </td>
                    <td className="border p-2 font-mono text-rose-700">
                      BN: {(analysis.matrixSummary.BN.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.BN.count} items)
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold bg-slate-50 text-left">Class C (Bottom 10%)</td>
                    <td className="border p-2 font-mono">
                      CV: {(analysis.matrixSummary.CV.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.CV.count} items)
                    </td>
                    <td className="border p-2 font-mono">
                      CE: {(analysis.matrixSummary.CE.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.CE.count} items)
                    </td>
                    <td className="border p-2 font-mono text-rose-700">
                      CN: {(analysis.matrixSummary.CN.spendETB / 1000000).toFixed(2)}M ETB ({analysis.matrixSummary.CN.count} items)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Approved Facility Medicine List Preview */}
            <div className="space-y-3 font-sans">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b pb-1">
                3. Adopted Facility-Specific Medicine List (Core Sample)
              </h4>
              <table className="w-full text-xs border border-slate-300 border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border p-2">INN Generic Name</th>
                    <th className="border p-2">Strength &amp; Dosage Form</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2 text-center">VEN</th>
                    <th className="border p-2">Restriction Level</th>
                    <th className="border p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityMedicines.slice(0, 15).map(m => (
                    <tr key={m.id} className="border-b">
                      <td className="border p-2 font-bold">{m.inn}</td>
                      <td className="border p-2">{m.strengthForm}</td>
                      <td className="border p-2">{m.therapeuticCategory}</td>
                      <td className="border p-2 text-center font-bold">{m.venCategory}</td>
                      <td className="border p-2">{m.prescriberLevel}</td>
                      <td className="border p-2 text-center font-semibold text-emerald-800">{m.dtcApprovalStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Committee Recommendations */}
            <div className="font-sans text-xs text-slate-800 space-y-2 border-t pt-4">
              <h4 className="font-bold uppercase tracking-wider text-slate-900">
                4. Mandatory DTC Directives &amp; Cost-Containment Actions:
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                <li>
                  <strong>Category AN Scrutiny:</strong> Human Albumin 20% and IV Multivitamin solutions are restricted strictly to confirmed intensive care and surgical indications. Hospital revolving drug funds must not be utilized for off-label hypoalbuminemia.
                </li>
                <li>
                  <strong>Vital Buffer Protection:</strong> Oxytocin, Magnesium Sulfate, Adrenaline, and Anti-Snake Venom must never fall below 2 months of stock on hand (MOS). Daily physical count variance checks are mandated for cold-chain medicines.
                </li>
                <li>
                  <strong>Generic Substitution:</strong> Hospital pharmacy shall systematically dispense generic bioequivalent equivalents for Category AE medicines to reduce patient out-of-pocket costs by an estimated 18.5%.
                </li>
              </ol>
            </div>

            {/* Official 4-Tier Sign-Off Block */}
            <div className="font-sans pt-12 border-t-2 border-slate-900 space-y-6">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-700">
                OFFICIAL DTC SIGN-OFF &amp; INSTITUTIONAL EXECUTIVE RATIFICATION
              </div>

              <div className="grid grid-cols-2 gap-8 text-xs">
                {/* Signatory 1: DTC Chair */}
                <div className="space-y-6 border-b border-slate-400 pb-2">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                    <span className="font-script text-lg text-teal-800 font-bold">Prof. Yonas Tadesse</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{metadata.dtcChairperson}</p>
                    <p className="text-[10px] text-slate-600">Chairperson, Drug and Therapeutics Committee</p>
                  </div>
                </div>

                {/* Signatory 2: Chief Pharmacist */}
                <div className="space-y-6 border-b border-slate-400 pb-2">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                    <span className="font-script text-lg text-teal-800 font-bold">Pharm. Dawid Aliyi</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{metadata.chiefPharmacist}</p>
                    <p className="text-[10px] text-slate-600">Head of Clinical Pharmacy &amp; DTC Secretary</p>
                  </div>
                </div>

                {/* Signatory 3: Clinical Director */}
                <div className="space-y-6 border-b border-slate-400 pb-2">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                    <span className="font-script text-lg text-teal-800 font-bold">Dr. Betelhem Girma</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{metadata.clinicalDirector}</p>
                    <p className="text-[10px] text-slate-600">Medical &amp; Clinical Services Director</p>
                  </div>
                </div>

                {/* Signatory 4: CEO */}
                <div className="space-y-6 border-b border-slate-400 pb-2">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                    <span className="font-script text-lg text-teal-800 font-bold">Dr. Mengistu Worku</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{metadata.hospitalCeo}</p>
                    <p className="text-[10px] text-slate-600">Chief Executive Director / Hospital CEO</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-4">
                Official Document Seal: [ETHIOPIAN MOH / TASH DTC AUDIT SEAL - FISCAL YEAR 2026/27]
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD MEDICINE TO ABC ANALYSIS */}
      {/* ========================================================================= */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                <span>Add Medicine to ABC-VEN Analysis</span>
              </h3>
              <button onClick={() => setIsAddItemModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewAbcItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Generic Name (INN) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ceftazidime"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 1g"
                    value={newItemStrength}
                    onChange={(e) => setNewItemStrength(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Dosage Form</label>
                  <select
                    value={newItemForm}
                    onChange={(e) => setNewItemForm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Vial">Vial (Injection)</option>
                    <option value="Ampoule">Ampoule</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Bottle">Bottle (Oral/Syrup)</option>
                    <option value="Infusion Bag">Infusion Bag</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Annual Consumption Qty *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItemConsumption}
                    onChange={(e) => setNewItemConsumption(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Unit Cost (ETB) *</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    value={newItemUnitCost}
                    onChange={(e) => setNewItemUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Calculated Spend:</span>
                <span className="font-mono text-teal-300 font-bold">
                  {(newItemConsumption * newItemUnitCost).toLocaleString()} ETB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">VEN Criticality *</label>
                  <select
                    value={newItemVen}
                    onChange={(e) => setNewItemVen(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="V">Vital (V) - Life-saving</option>
                    <option value="E">Essential (E) - Endemic / Core</option>
                    <option value="N">Non-Essential (N) - Minor / Comfort</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Hospital Tier</label>
                  <select
                    value={newItemLevel}
                    onChange={(e) => setNewItemLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Primary">Primary Hospital</option>
                    <option value="General">General Hospital</option>
                    <option value="Specialized">Specialized Hospital</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Save &amp; Recalculate ABC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PROPOSE MEDICINE TO FSML */}
      {/* ========================================================================= */}
      {isAddFsmlModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-400" />
                <span>Propose Medicine to Hospital Formulary (FSML)</span>
              </h3>
              <button onClick={() => setIsAddFsmlModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewFsmlItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Generic Name (INN) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dapagliflozin"
                  value={newFsmlInn}
                  onChange={(e) => setNewFsmlInn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Strength &amp; Dosage Form *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10mg Film-Coated Tablet"
                    value={newFsmlStrengthForm}
                    onChange={(e) => setNewFsmlStrengthForm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Therapeutic Category</label>
                  <select
                    value={newFsmlCategory}
                    onChange={(e) => setNewFsmlCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Endocrine & Metabolic">Endocrine &amp; Metabolic</option>
                    <option value="Anti-infective">Anti-infective</option>
                    <option value="Obstetric & Gynecologic">Obstetric &amp; Gynecologic</option>
                    <option value="Emergency & Resuscitation">Emergency &amp; Resuscitation</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Central Nervous System">Central Nervous System</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Oncology">Oncology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Hospital Level Tier</label>
                  <select
                    value={newFsmlLevel}
                    onChange={(e) => setNewFsmlLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Primary">Primary Hospital</option>
                    <option value="General">General Hospital</option>
                    <option value="Specialized">Specialized Hospital</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Prescriber Restriction</label>
                  <select
                    value={newFsmlPrescriber}
                    onChange={(e) => setNewFsmlPrescriber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Health Officer / Druggist">Health Officer / Druggist</option>
                    <option value="General Medical Practitioner">General Medical Practitioner</option>
                    <option value="Specialist / Senior Consultant">Specialist / Senior Consultant</option>
                    <option value="Sub-Specialist / Oncologist">Sub-Specialist / Oncologist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">STG 5th Edition Indication</label>
                <textarea
                  rows={2}
                  placeholder="Primary clinical indications per national guidelines..."
                  value={newFsmlIndication}
                  onChange={(e) => setNewFsmlIndication(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Clinical &amp; Economic Rationale for DTC</label>
                <textarea
                  rows={2}
                  placeholder="Efficacy, cost-effectiveness, absence of safe alternatives..."
                  value={newFsmlRationale}
                  onChange={(e) => setNewFsmlRationale(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFsmlModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Submit Proposal to DTC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
