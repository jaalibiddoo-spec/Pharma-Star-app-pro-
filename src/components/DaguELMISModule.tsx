import React, { useState } from 'react';
import { 
  Building2, Layers, FileText, CheckCircle2, AlertTriangle, 
  Search, Plus, Filter, Printer, ShieldCheck, Sparkles, 
  RefreshCw, Package, Calendar, Clock, Download, ArrowRight,
  TrendingDown, TrendingUp, Check, Copy, Thermometer, ShieldAlert,
  Send, Truck, HelpCircle, FileCheck, AlertCircle, X, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  daguInventoryItems, 
  DaguInventoryItem, 
  initialDaguRRFReport, 
  initialDaguColdChainLogs, 
  initialDaguVariances, 
  daguIPLSFormulas 
} from '../data/daguElmisData';
import { DaguRRFReport, DaguColdChainLog, DaguPhysicalCountVariance } from '../types';

interface DaguELMISModuleProps {
  onOpenStoreAudit?: () => void;
  onOpenPayment?: (serviceId?: string) => void;
}

export const DaguELMISModule: React.FC<DaguELMISModuleProps> = ({ onOpenPayment, onOpenStoreAudit }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'stockcards' | 'rrf' | 'ifrr' | 'variance' | 'fefo_expiry' | 'cold_chain'>('stockcards');

  // Facility Metadata
  const [facilityName, setFacilityName] = useState('Tikur Anbessa Specialized Hospital');
  const [facilityType, setFacilityType] = useState<'Specialized Hospital' | 'General Hospital' | 'Primary Hospital' | 'Health Center'>('Specialized Hospital');
  const [epssHub, setEpssHub] = useState('Addis Ababa Central Hub (Kaliti EPSS Depot)');
  const [reportingPeriod, setReportingPeriod] = useState('Meskerem - Tikimt 2018 (Oct - Nov 2026)');

  // Data states
  const [inventory, setInventory] = useState<DaguInventoryItem[]>(daguInventoryItems);
  const [rrfReport, setRrfReport] = useState<DaguRRFReport>(initialDaguRRFReport);
  const [coldChainLogs, setColdChainLogs] = useState<DaguColdChainLog[]>(initialDaguColdChainLogs);
  const [variances, setVariances] = useState<DaguPhysicalCountVariance[]>(initialDaguVariances);

  // Filters
  const [selectedSubStore, setSelectedSubStore] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & User Feedback
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [txType, setTxType] = useState<'grv' | 'siv'>('grv');
  const [selectedItemForTx, setSelectedItemForTx] = useState<string>(daguInventoryItems[0]?.id || '');
  const [txQuantity, setTxQuantity] = useState<number>(100);
  const [txVoucherNo, setTxVoucherNo] = useState<string>('GRV-2026-901');
  const [txNotes, setTxNotes] = useState<string>('Received from EPSS Central Hub');

  // New Cold Chain Reading Modal
  const [isColdChainModalOpen, setIsColdChainModalOpen] = useState(false);
  const [newFridgeName, setNewFridgeName] = useState('EPI Vaccine Solar Fridge #1 (MCH Ward)');
  const [newTempC, setNewTempC] = useState<number>(3.8);
  const [newLogTime, setNewLogTime] = useState<'08:00 AM' | '04:00 PM'>('08:00 AM');
  const [newLogAction, setNewLogAction] = useState('Routine check. Temp within safe 2°C - 8°C.');

  // Transmission state
  const [isTransmittingRRF, setIsTransmittingRRF] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Key KPI calculations
  const totalItemsCount = inventory.length;
  const stockoutCount = inventory.filter(i => i.status === 'stockout').length;
  const understockedCount = inventory.filter(i => i.status === 'under_stocked').length;
  const adequateCount = inventory.filter(i => i.status === 'adequate').length;
  const totalValueETB = inventory.reduce((sum, item) => sum + (item.stockOnHand * item.unitPriceETB), 0);

  // Filtered Stockcards
  const filteredInventory = inventory.filter(item => {
    const matchStore = selectedSubStore === 'all' || item.subStore === selectedSubStore;
    const matchProg = selectedProgram === 'all' || item.programType === selectedProgram;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchSearch = item.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStore && matchProg && matchStatus && matchSearch;
  });

  // Handle Recording New Model 19 GRV or Model 22 SIV Transaction
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = inventory.find(i => i.id === selectedItemForTx);
    if (!targetItem) return;

    const qty = Number(txQuantity) || 0;
    const newSOH = txType === 'grv' ? targetItem.stockOnHand + qty : Math.max(0, targetItem.stockOnHand - qty);
    const newReceived = txType === 'grv' ? targetItem.quantityReceivedGRV + qty : targetItem.quantityReceivedGRV;
    const newIssued = txType === 'siv' ? targetItem.quantityIssuedSIV + qty : targetItem.quantityIssuedSIV;
    const newMOS = daguIPLSFormulas.calculateMOS(newSOH, targetItem.calculatedAMC);

    let newStatus: DaguInventoryItem['status'] = 'adequate';
    if (newSOH === 0) newStatus = 'stockout';
    else if (newMOS < 2) newStatus = 'under_stocked';
    else if (newMOS > 4) newStatus = 'overstocked';

    setInventory(prev => prev.map(item => {
      if (item.id === selectedItemForTx) {
        return {
          ...item,
          stockOnHand: newSOH,
          physicalCount: newSOH,
          quantityReceivedGRV: newReceived,
          quantityIssuedSIV: newIssued,
          monthsOfStock: newMOS,
          status: newStatus,
          lastAuditedDate: new Date().toISOString().split('T')[0],
          notes: `${txType.toUpperCase()} #${txVoucherNo}: ${txNotes} (${new Date().toLocaleTimeString()})`
        };
      }
      return item;
    }));

    setIsAddTxModalOpen(false);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (err) {}
  };

  // Handle Log Cold Chain Temperature
  const handleSaveColdChain = (e: React.FormEvent) => {
    e.preventDefault();
    const temp = Number(newTempC);
    let status: 'normal' | 'low_alarm' | 'high_alarm' = 'normal';
    if (temp < 2.0) status = 'low_alarm';
    if (temp > 8.0) status = 'high_alarm';

    const newLog: DaguColdChainLog = {
      id: `ccl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: newLogTime,
      refrigeratorName: newFridgeName,
      temperatureC: temp,
      targetRange: '2°C - 8°C',
      status,
      loggedBy: 'Pharmacist Dawid Aliyi, BCPS',
      actionTaken: newLogAction
    };

    setColdChainLogs([newLog, ...coldChainLogs]);
    setIsColdChainModalOpen(false);
  };

  // Electronic Transmission of RRF to EPSS Central/Regional Hub
  const handleTransmitRRFToEPSS = () => {
    setIsTransmittingRRF(true);
    setTimeout(() => {
      setIsTransmittingRRF(false);
      setTransmissionSuccess(true);
      setRrfReport(prev => ({
        ...prev,
        status: 'submitted_to_epss',
        epssVoucherRef: `EPSS-ACK-${Math.floor(100000 + Math.random() * 900000)}`,
        epssReceiptTimestamp: new Date().toLocaleString()
      }));
      try {
        confetti({ particleCount: 100, spread: 80 });
      } catch (err) {}
    }, 1500);
  };

  // CSV Export for RRF
  const handleExportRRFCSV = () => {
    const headers = ['Item Code', 'Description', 'Unit', 'Beginning Balance', 'Received', 'Issued', 'Loss/Adj', 'Ending Balance (SOH)', 'Days Out Of Stock', 'AMC', 'Max Stock (4xAMC)', 'Order Qty', 'Remarks'];
    const rows = rrfReport.items.map(item => [
      item.itemCode,
      `"${item.description}"`,
      item.unitOfIssue,
      item.beginningBalance,
      item.quantityReceived,
      item.quantityIssued,
      item.lossesAndAdjustments,
      item.endingBalance,
      item.daysOutOfStock,
      item.calculatedAMC,
      item.maxStockQuantity,
      item.confirmedOrderQuantity,
      `"${item.remarks}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DAGU_RRF_${facilityName.replace(/\s+/g, '_')}_${reportingPeriod.slice(0, 15)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 border border-teal-500/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                Ethiopian National eLMIS Standard
              </span>
              <span className="text-xs text-slate-400">Integrated Pharmaceuticals Logistics System (IPLS / EPSS / MoH)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              <span>DAGU 2.0 eLMIS &amp; Supply Chain Engine</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Facility Level: {facilityType}
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Standardized electronic Logistics Management Information System powering Ethiopian health facilities: Automated Average Monthly Consumption (AMC), Months of Stock (MOS), Bimonthly RRF to EPSS Hubs, Model 19 GRV / Model 22 SIV, physical count reconciliation, and cold chain logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddTxModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Stock Transaction</span>
            </button>
            <button
              onClick={() => {
                const reportText = `DAGU eLMIS AUDIT SUMMARY - ${facilityName}\nTotal SOH Value: ${totalValueETB.toLocaleString()} ETB\nStockout Rate: ${((stockoutCount / totalItemsCount) * 100).toFixed(1)}%\nEPSS Hub: ${epssHub}`;
                navigator.clipboard.writeText(reportText);
                setCopiedToken(true);
                setTimeout(() => setCopiedToken(false), 2000);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-teal-400" />}
              <span>{copiedToken ? 'Copied Summary' : 'Copy Facility LMIS Summary'}</span>
            </button>
          </div>
        </div>

        {/* Facility Setup Details & EPSS Hub Linkage */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Health Facility Name:</label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Linked EPSS Supply Hub:</label>
            <select
              value={epssHub}
              onChange={(e) => setEpssHub(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-teal-500 cursor-pointer"
            >
              <option value="Addis Ababa Central Hub (Kaliti EPSS Depot)">Addis Ababa Central Hub (Kaliti)</option>
              <option value="Adama EPSS Hub (Oromia)">Adama EPSS Hub (Oromia)</option>
              <option value="Hawassa EPSS Hub (Sidama / South)">Hawassa EPSS Hub (Sidama / South)</option>
              <option value="Jimma EPSS Hub (Southwest)">Jimma EPSS Hub (Southwest)</option>
              <option value="Bahir Dar EPSS Hub (Amhara)">Bahir Dar EPSS Hub (Amhara)</option>
              <option value="Mekelle EPSS Hub (Tigray)">Mekelle EPSS Hub (Tigray)</option>
              <option value="Dire Dawa EPSS Hub (East)">Dire Dawa EPSS Hub (East)</option>
              <option value="Dessie EPSS Hub (Northeast)">Dessie EPSS Hub (Northeast)</option>
              <option value="Nekemte EPSS Hub (Western Oromia)">Nekemte EPSS Hub (Western Oromia)</option>
              <option value="Semera EPSS Hub (Afar)">Semera EPSS Hub (Afar)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Facility Level / Type:</label>
            <select
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-teal-500 cursor-pointer"
            >
              <option value="Specialized Hospital">Specialized Comprehensive Hospital</option>
              <option value="General Hospital">General Hospital</option>
              <option value="Primary Hospital">Primary Hospital</option>
              <option value="Health Center">Health Center (Woreda Level)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Bimonthly Reporting Period:</label>
            <input
              type="text"
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-teal-500"
            />
          </div>
        </div>

        {/* IPLS Key Performance Indicators (KPI Cards) */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active Items</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">{totalItemsCount} Tracers</div>
            <span className="text-[10px] text-teal-400 font-medium">100% IPLS Codified</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stockout Tracers</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${stockoutCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stockoutCount} Items <span className="text-xs">({((stockoutCount / totalItemsCount) * 100).toFixed(1)}%)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">National Target: &lt; 5%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Under-Stocked (&lt; 2 MOS)</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{understockedCount} Items</div>
            <span className="text-[10px] text-amber-300 font-medium">Requisition Priority</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Stock Valuation</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {totalValueETB.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ETB</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-medium">Revolving &amp; Program Stock</span>
          </div>
        </div>
      </div>

      {/* Main Workflow Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'stockcards', label: '1. Electronic Stockcards & Bin Cards', icon: Layers },
          { id: 'rrf', label: '2. Bimonthly RRF (Facility to EPSS Hub)', icon: FileText },
          { id: 'ifrr', label: '3. Internal Dispensary Requisition (IFRR)', icon: Truck },
          { id: 'variance', label: '4. Physical Count Variance & Reconciliation', icon: RefreshCw },
          { id: 'fefo_expiry', label: '5. FEFO Matrix & Expiry Redistribution', icon: Clock },
          { id: 'cold_chain', label: '6. Cold Chain Temperature Monitor (2°C - 8°C)', icon: Thermometer },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 text-teal-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ELECTRONIC STOCKCARDS & BIN CARDS */}
      {/* ========================================================================= */}
      {activeTab === 'stockcards' && (
        <div className="space-y-4">
          {/* Sub-Store & Program Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search item code, medicine name, batch number, or shelf bay..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500"
                />
              </div>

              {/* Sub-Store Selector */}
              <select
                value={selectedSubStore}
                onChange={(e) => setSelectedSubStore(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-teal-500 cursor-pointer"
              >
                <option value="all">All Store Units &amp; Dispensaries</option>
                <option value="Main Medical Warehouse">Main Medical Warehouse</option>
                <option value="OPD Pharmacy">OPD Pharmacy Shelf</option>
                <option value="Emergency & IPD Store">Emergency &amp; IPD Store</option>
                <option value="MCH & Cold Chain">MCH &amp; Cold Chain</option>
                <option value="ART Pharmacy">ART Pharmacy</option>
                <option value="TB Clinic">TB Clinic</option>
              </select>

              {/* Program Selector */}
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-teal-500 cursor-pointer"
              >
                <option value="all">All Programs (RDF &amp; Public)</option>
                <option value="RDF / CBHI">RDF / CBHI (Revolving Fund)</option>
                <option value="HIV/ART">HIV/AIDS &amp; ART</option>
                <option value="TB/Leprosy">TB &amp; Leprosy</option>
                <option value="Malaria">Malaria (Coartem)</option>
                <option value="MCH/FP">MCH &amp; Family Planning</option>
                <option value="EPI/Cold Chain">EPI Vaccines</option>
              </select>
            </div>

            {/* Quick Status Filters */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Status Filter:</span>
              {[
                { id: 'all', label: 'All Stock Levels' },
                { id: 'stockout', label: 'Stockouts (0 SOH)' },
                { id: 'under_stocked', label: 'Under-Stocked (< 2 MOS)' },
                { id: 'adequate', label: 'Adequate (2 - 4 MOS)' },
                { id: 'overstocked', label: 'Overstocked (> 4 MOS)' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedStatus === st.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Electronic Stockcards Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-3">Item Code &amp; Medicine</th>
                    <th className="py-3 px-3">Batch &amp; Expiry</th>
                    <th className="py-3 px-3">Program / VEN</th>
                    <th className="py-3 px-3 text-right">Beginning</th>
                    <th className="py-3 px-3 text-right text-emerald-400">Recv (GRV)</th>
                    <th className="py-3 px-3 text-right text-cyan-400">Issued (SIV)</th>
                    <th className="py-3 px-3 text-right font-bold text-white">SOH</th>
                    <th className="py-3 px-3 text-right">AMC</th>
                    <th className="py-3 px-3 text-center">MOS</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredInventory.map(item => {
                    const isNearExpiry = new Date(item.expiryDate).getTime() - new Date().getTime() < 180 * 24 * 60 * 60 * 1000;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10px] text-teal-400 font-bold block">{item.itemCode}</span>
                          <span className="font-bold text-white text-xs block">{item.drugName}</span>
                          <span className="text-[10px] text-slate-400">{item.strength} • {item.dosageForm} ({item.unitOfIssue})</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <span className="text-slate-300 block font-bold">{item.batchNumber}</span>
                          <span className={isNearExpiry ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            Exp: {item.expiryDate}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-teal-300 block mb-0.5 max-w-fit">
                            {item.programType}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            VEN: {item.venCategory} | ABC: {item.abcCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">{item.beginningBalance}</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">+{item.quantityReceivedGRV}</td>
                        <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">-{item.quantityIssuedSIV}</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-sm text-white">
                          {item.stockOnHand}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">{item.calculatedAMC}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono font-bold text-xs block text-slate-200">
                            {item.monthsOfStock} mo
                          </span>
                          <div className="w-14 bg-slate-950 rounded-full h-1.5 mx-auto mt-1 overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full ${
                                item.monthsOfStock === 0 ? 'bg-rose-500 w-0' :
                                item.monthsOfStock < 2 ? 'bg-amber-400 w-1/3' :
                                item.monthsOfStock <= 4 ? 'bg-emerald-500 w-3/4' : 'bg-indigo-500 w-full'
                              }`}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.status === 'stockout'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                : item.status === 'under_stocked'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : item.status === 'adequate'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedItemForTx(item.id);
                              setIsAddTxModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-[10px] border border-slate-700 cursor-pointer"
                          >
                            Post Tx
                          </button>
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
      {/* TAB 2: BIMONTHLY RRF (REPORT AND REQUISITION FORM - EPSS STANDARD) */}
      {/* ========================================================================= */}
      {activeTab === 'rrf' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Form Ref: {rrfReport.reportNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    Period: <strong>{reportingPeriod}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Official Facility Bimonthly Report and Requisition Form (RRF)
                </h3>
                <p className="text-xs text-slate-300">
                  National IPLS 11-column resupply order to <strong>{epssHub}</strong> with automated Max Stock &amp; Suggested Order calculation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportRRFCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Print Official RRF</span>
                </button>
                <button
                  onClick={handleTransmitRRFToEPSS}
                  disabled={isTransmittingRRF || rrfReport.status === 'submitted_to_epss'}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {isTransmittingRRF ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting to Hub...</span>
                    </>
                  ) : rrfReport.status === 'submitted_to_epss' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Transmitted to EPSS Hub</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit RRF to EPSS Hub</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transmission Receipt Banner if Transmitted */}
            {rrfReport.status === 'submitted_to_epss' && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Electronic RRF Acknowledged by {epssHub}</span>
                    <span className="text-[11px] opacity-90 font-mono">
                      Voucher Reference: {rrfReport.epssVoucherRef} | Received: {rrfReport.epssReceiptTimestamp}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Verified Order
                </span>
              </div>
            )}

            {/* RRF 11-Column Standard Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                    <th className="py-2.5 px-3">Item Code &amp; Description</th>
                    <th className="py-2.5 px-2">Unit</th>
                    <th className="py-2.5 px-2 text-right">Beginning (A)</th>
                    <th className="py-2.5 px-2 text-right text-emerald-400">Recv (B)</th>
                    <th className="py-2.5 px-2 text-right text-cyan-400">Issued (C)</th>
                    <th className="py-2.5 px-2 text-right text-amber-400">Loss/Adj (D)</th>
                    <th className="py-2.5 px-2 text-right font-bold text-white">Ending SOH (E)</th>
                    <th className="py-2.5 px-2 text-right">DOS</th>
                    <th className="py-2.5 px-2 text-right">AMC (G)</th>
                    <th className="py-2.5 px-2 text-right">Max Stock (4x)</th>
                    <th className="py-2.5 px-3 text-right font-black text-teal-300">Order Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {rrfReport.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-sans">
                        <span className="font-mono text-[10px] text-teal-400 font-bold block">{item.itemCode}</span>
                        <span className="font-bold text-white text-xs">{item.description}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{item.programType}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-300 font-sans text-[11px]">{item.unitOfIssue}</td>
                      <td className="py-3 px-2 text-right text-slate-400">{item.beginningBalance}</td>
                      <td className="py-3 px-2 text-right text-emerald-400 font-bold">+{item.quantityReceived}</td>
                      <td className="py-3 px-2 text-right text-cyan-400 font-bold">-{item.quantityIssued}</td>
                      <td className="py-3 px-2 text-right text-amber-400">{item.lossesAndAdjustments}</td>
                      <td className="py-3 px-2 text-right font-bold text-white text-sm">{item.endingBalance}</td>
                      <td className="py-3 px-2 text-right text-rose-400 font-bold">{item.daysOutOfStock}</td>
                      <td className="py-3 px-2 text-right text-slate-200">{item.calculatedAMC}</td>
                      <td className="py-3 px-2 text-right text-slate-400">{item.maxStockQuantity}</td>
                      <td className="py-3 px-3 text-right font-black text-sm text-teal-300 bg-teal-950/20">
                        {item.confirmedOrderQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Three-Tier Ethiopian Sign-Off Box */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Prepared By (Storekeeper):</span>
                <span className="font-bold text-white block">{rrfReport.storekeeperSign.name}</span>
                <span className="text-[11px] text-teal-300 font-mono block">License: {rrfReport.storekeeperSign.licenseNo}</span>
                <span className="text-[10px] text-slate-500 font-mono">Date: {rrfReport.storekeeperSign.signedAt}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Verified By (Pharmacy Head):</span>
                <span className="font-bold text-white block">{rrfReport.pharmacyHeadSign.name}</span>
                <span className="text-[11px] text-teal-300 font-mono block">License: {rrfReport.pharmacyHeadSign.licenseNo}</span>
                <span className="text-[10px] text-slate-500 font-mono">Date: {rrfReport.pharmacyHeadSign.signedAt}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Authorized By (Medical Director):</span>
                <span className="font-bold text-white block">{rrfReport.medicalDirectorSign.name}</span>
                <span className="text-[11px] text-teal-300 font-mono block">{rrfReport.medicalDirectorSign.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">Date: {rrfReport.medicalDirectorSign.signedAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERNAL FACILITY REQUISITION (IFRR) */}
      {/* ========================================================================= */}
      {activeTab === 'ifrr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Internal Facility Report and Requisition (IFRR)</h3>
              <p className="text-xs text-slate-300">
                Dispensary units (OPD, Emergency, IPD, Delivery, ART) requisitioning stock resupply from the Facility Central Store.
              </p>
            </div>
            <span className="text-xs text-teal-300 font-mono bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/30">
              Min Stock: 2 Weeks (0.5 Mo) | Max Stock: 4 Weeks (1.0 Mo)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-400" />
                <span>Pending Dispensary Requisitions to Central Warehouse</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">OPD Pharmacy Requisition #IFRR-042</span>
                    <span className="text-[11px] text-slate-400">Amoxicillin/Clavulanate 625mg (Qty: 250 packs)</span>
                  </div>
                  <button
                    onClick={() => {
                      alert('IFRR-042 approved! Model 22 SIV Voucher generated for OPD Pharmacy.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Issue SIV
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Emergency &amp; ICU Requisition #IFRR-043</span>
                    <span className="text-[11px] text-rose-300 font-bold">Meropenem 1g IV (Qty: 50 vials - STAT Emergency)</span>
                  </div>
                  <button
                    onClick={() => {
                      alert('IFRR-043 approved! Model 22 SIV Voucher generated for Emergency & ICU.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Issue SIV
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>National IPLS Internal Requisition Standard</span>
              </h4>
              <p>
                In the Ethiopian Integrated Pharmaceuticals Logistics System (IPLS), sub-stores calculate biweekly consumption. The Central Medical Storekeeper acts as the issuing authority using official Model 22 Store Issue Vouchers (SIV).
              </p>
              <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-[11px]">
                Formula: Quantity to Order = (Max Stock - Ending SOH) = (1.0 × AMC - SOH)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PHYSICAL COUNT VARIANCE & RECONCILIATION */}
      {/* ========================================================================= */}
      {activeTab === 'variance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Physical Inventory &amp; Variance Reconciliation</h3>
              <p className="text-xs text-slate-300">
                Quarterly and annual physical inventory cycle count audits against system-recorded Stock on Hand (SOH).
              </p>
            </div>
            <button
              onClick={() => {
                alert('Physical count sheet template generated for Central Warehouse.');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
            >
              Generate Blank Count Sheet
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3">Item Code &amp; Medicine</th>
                  <th className="py-2.5 px-3 text-right">System SOH</th>
                  <th className="py-2.5 px-3 text-right">Physical Count</th>
                  <th className="py-2.5 px-3 text-right text-rose-400">Variance Qty</th>
                  <th className="py-2.5 px-3 text-right">Variance Value (ETB)</th>
                  <th className="py-2.5 px-3">Root Cause Reason</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {variances.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-sans">
                      <span className="font-mono text-[10px] text-teal-400 font-bold block">{v.itemCode}</span>
                      <span className="font-bold text-white text-xs">{v.drugName}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300">{v.systemSOH}</td>
                    <td className="py-3 px-3 text-right text-white font-bold">{v.physicalCount}</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-400">
                      {v.varianceQty > 0 ? `+${v.varianceQty}` : v.varianceQty} {v.unitOfIssue}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300">
                      {v.varianceValueETB} ETB
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">{v.reason}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {v.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FEFO EXPIRY ALERT MATRIX & REDISTRIBUTION */}
      {/* ========================================================================= */}
      {activeTab === 'fefo_expiry' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">FEFO Matrix &amp; Inter-Facility Stock Redistribution</h3>
              <p className="text-xs text-slate-300">
                First Expire, First Out (FEFO) enforcement and early redistribution triggers to achieve zero facility expiry wastage.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
              National Expiry Wastage Target: &lt; 2% (Current: 0.8%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">Critical (&lt; 90 Days to Expiry)</span>
              <p className="text-[11px] text-slate-300">Medicines requiring immediate expedited dispensing or inter-facility transfer.</p>
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-rose-500/30 space-y-1">
                <span className="font-bold text-white text-xs block">Enoxaparin 40mg (Batch ENX-26190)</span>
                <span className="text-[10px] text-rose-300 font-mono block">Expires: 2027-01-31 (91 Days Remaining)</span>
                <button
                  onClick={() => {
                    alert('Inter-facility transfer notice sent to EPSS Hub for nearby Zewditu Memorial Hospital.');
                  }}
                  className="w-full mt-2 py-1 px-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                >
                  Initiate EPSS Redistribution
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Warning (90 - 180 Days)</span>
              <p className="text-[11px] text-slate-300">Flagged on physical bin cards. Dispense before newer batches.</p>
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 space-y-1">
                <span className="font-bold text-white text-xs block">Pentavalent Vaccine (PNT-26088)</span>
                <span className="text-[10px] text-amber-300 font-mono block">Expires: 2027-02-28 (119 Days Remaining)</span>
                <span className="text-[10px] text-slate-400 block">SOH: 54 Vials (Adequate consumption rate)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Stable Shelf Life (&gt; 180 Days)</span>
              <p className="text-[11px] text-slate-300">Safe inventory stock with over 6 months to 2 years validity.</p>
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-white text-xs block">Coartem 20/120mg (MAL-25890)</span>
                <span className="text-[10px] text-emerald-300 font-mono block">Expires: 2027-11-15 (379 Days)</span>
                <span className="text-[10px] text-slate-400 block">SOH: 340 Boxes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: COLD CHAIN TEMPERATURE MONITOR (2°C - 8°C) */}
      {/* ========================================================================= */}
      {activeTab === 'cold_chain' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Cold Chain Temperature Log (2°C - 8°C)</h3>
              <p className="text-xs text-slate-300">
                Twice-daily compliance logging for vaccines, oxytocin, insulin, and blood products to safeguard biological potency.
              </p>
            </div>
            <button
              onClick={() => setIsColdChainModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Temp Reading</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">Refrigerator Unit</th>
                  <th className="py-2.5 px-3 text-center">Recorded Temp (°C)</th>
                  <th className="py-2.5 px-3 text-center">Target Range</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Logged By</th>
                  <th className="py-2.5 px-3">Action Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {coldChainLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-sans">
                      <span className="font-bold text-white block">{log.date}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-200">{log.refrigeratorName}</td>
                    <td className="py-3 px-3 text-center font-bold text-sm">
                      <span className={log.temperatureC < 2.0 || log.temperatureC > 8.0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {log.temperatureC.toFixed(1)} °C
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400">{log.targetRange}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          log.status === 'normal'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">{log.loggedBy}</td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">{log.actionTaken || 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD STOCK TRANSACTION (MODEL 19 GRV / MODEL 22 SIV) */}
      {/* ========================================================================= */}
      {isAddTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-400" />
                <span>Post Model 19 (GRV) or Model 22 (SIV)</span>
              </h3>
              <button onClick={() => setIsAddTxModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transaction Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('grv')}
                    className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                      txType === 'grv' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Model 19 Receipt (GRV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('siv')}
                    className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                      txType === 'siv' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Model 22 Issue (SIV)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Medicine:</label>
                <select
                  value={selectedItemForTx}
                  onChange={(e) => setSelectedItemForTx(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-teal-500 cursor-pointer"
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.itemCode} - {item.drugName} (SOH: {item.stockOnHand})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={txQuantity}
                    onChange={(e) => setTxQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Voucher Number:</label>
                  <input
                    type="text"
                    value={txVoucherNo}
                    onChange={(e) => setTxVoucherNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transaction Remarks:</label>
                <input
                  type="text"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-lg"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOG COLD CHAIN TEMPERATURE */}
      {/* ========================================================================= */}
      {isColdChainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-teal-400" />
                <span>Record Cold Chain Temperature</span>
              </h3>
              <button onClick={() => setIsColdChainModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveColdChain} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Refrigerator Unit:</label>
                <select
                  value={newFridgeName}
                  onChange={(e) => setNewFridgeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-teal-500 cursor-pointer"
                >
                  <option value="EPI Vaccine Solar Fridge #1 (MCH Ward)">EPI Vaccine Solar Fridge #1 (MCH Ward)</option>
                  <option value="Insulin & Oxytocin Electric Fridge #2 (Main Store)">Insulin &amp; Oxytocin Electric Fridge #2 (Main Store)</option>
                  <option value="Blood Bank Reserve Fridge #3">Blood Bank Reserve Fridge #3</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Temperature (°C):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTempC}
                    onChange={(e) => setNewTempC(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-base focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Time of Log:</label>
                  <select
                    value={newLogTime}
                    onChange={(e) => setNewLogTime(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-teal-500 cursor-pointer"
                  >
                    <option value="08:00 AM">08:00 AM (Morning)</option>
                    <option value="04:00 PM">04:00 PM (Afternoon)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Action / Remarks:</label>
                <input
                  type="text"
                  value={newLogAction}
                  onChange={(e) => setNewLogAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsColdChainModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-lg"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
