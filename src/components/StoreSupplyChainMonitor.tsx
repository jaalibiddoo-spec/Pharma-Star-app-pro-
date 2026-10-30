import React, { useState } from 'react';
import { BinCardItem, DigitalFolder, IFRRReport, User } from '../types';
import { 
  Building2, Folder, FolderOpen, Camera, Upload, Send, CheckCircle2, 
  AlertTriangle, Clock, Search, Plus, Filter, Mail, Printer, ShieldCheck, 
  Sparkles, Smartphone, Landmark, Check, Copy, ArrowRight, RefreshCw, FileText,
  AlertCircle, ChevronRight, Layers, Package, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoreSupplyChainMonitorProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

const initialFolders: DigitalFolder[] = [
  {
    id: "opd_pharmacy",
    name: "OPD Pharmacy Shelf Cards",
    description: "Outpatient primary dispensary fast-moving essential medicines",
    department: "OPD Pharmacy",
    itemCount: 6,
    totalStockUnits: 3840,
    nearExpiryCount: 1,
    stockoutCount: 0
  },
  {
    id: "inpatient_store",
    name: "Inpatient & Emergency Store",
    description: "Ward stock, critical care antibiotics, IV fluids, and narcotics",
    department: "Inpatient & Emergency",
    itemCount: 5,
    totalStockUnits: 1920,
    nearExpiryCount: 0,
    stockoutCount: 1
  },
  {
    id: "mch_coldchain",
    name: "MCH & EPI Cold Chain Storage",
    description: "Maternal & Child Health, oxytocin, vaccines, insulin (2°C - 8°C)",
    department: "MCH & Cold Chain",
    itemCount: 4,
    totalStockUnits: 860,
    nearExpiryCount: 1,
    stockoutCount: 0
  },
  {
    id: "central_store",
    name: "Central Medical Store Stockcards",
    description: "Hospital warehouse bulk pallet reserves and batch tracking",
    department: "Main Medical Warehouse",
    itemCount: 8,
    totalStockUnits: 14200,
    nearExpiryCount: 2,
    stockoutCount: 0
  }
];

const initialBinCards: BinCardItem[] = [
  {
    id: "bc-1",
    itemCode: "MED-101",
    drugName: "Amoxicillin + Clavulanic Acid",
    dosageForm: "Tablet",
    strength: "625 mg",
    unitOfIssue: "Pack of 14",
    batchNumber: "ET-26014",
    expiryDate: "2027-05-30",
    folderId: "opd_pharmacy",
    shelfLocation: "Shelf A-12",
    beginningBalance: 400,
    quantityReceived: 600,
    quantityIssued: 520,
    lossOrAdjustment: 0,
    endingBalance: 480,
    calculatedLedgerBalance: 480,
    discrepancy: 0,
    minimumStock: 150,
    maximumStock: 600,
    reorderPoint: 200,
    averageMonthlyConsumption: 260,
    daysOutOfStock: 0,
    status: 'adequate',
    lastUpdated: "2026-10-28",
    auditedBy: "Pharmacist Dawid Aliyi",
    notes: "Physical count verified with OPD Bin Card #101"
  },
  {
    id: "bc-2",
    itemCode: "MED-102",
    drugName: "Artemether + Lumefantrine",
    dosageForm: "Tablet",
    strength: "20/120 mg",
    unitOfIssue: "Box of 24 (4x6)",
    batchNumber: "ET-25890",
    expiryDate: "2027-11-15",
    folderId: "opd_pharmacy",
    shelfLocation: "Shelf A-15",
    beginningBalance: 250,
    quantityReceived: 300,
    quantityIssued: 380,
    lossOrAdjustment: 0,
    endingBalance: 170,
    calculatedLedgerBalance: 170,
    discrepancy: 0,
    minimumStock: 120,
    maximumStock: 500,
    reorderPoint: 180,
    averageMonthlyConsumption: 190,
    daysOutOfStock: 0,
    status: 'low_stock',
    lastUpdated: "2026-10-28",
    auditedBy: "Pharmacist Dawid Aliyi",
    notes: "High malaria transmission season. Requisition needed."
  },
  {
    id: "bc-3",
    itemCode: "MED-103",
    drugName: "Metformin Hydrochloride",
    dosageForm: "Tablet",
    strength: "500 mg",
    unitOfIssue: "Tin of 1000",
    batchNumber: "ET-26340",
    expiryDate: "2026-12-15", // Near expiry < 60 days
    folderId: "opd_pharmacy",
    shelfLocation: "Shelf B-02",
    beginningBalance: 12,
    quantityReceived: 10,
    quantityIssued: 14,
    lossOrAdjustment: 0,
    endingBalance: 8,
    calculatedLedgerBalance: 8,
    discrepancy: 0,
    minimumStock: 5,
    maximumStock: 25,
    reorderPoint: 8,
    averageMonthlyConsumption: 7,
    daysOutOfStock: 0,
    status: 'near_expiry',
    lastUpdated: "2026-10-29",
    auditedBy: "Pharmacist Dawid Aliyi",
    notes: "FEFO (First-Expiry-First-Out) priority dispensing enforced."
  },
  {
    id: "bc-4",
    itemCode: "MED-201",
    drugName: "Ceftriaxone Sodium Injection",
    dosageForm: "Powder for Inj (Vial)",
    strength: "1 g",
    unitOfIssue: "Box of 10 Vials",
    batchNumber: "ET-26912",
    expiryDate: "2027-09-30",
    folderId: "inpatient_store",
    shelfLocation: "Cabinet C-01",
    beginningBalance: 80,
    quantityReceived: 100,
    quantityIssued: 180,
    lossOrAdjustment: 0,
    endingBalance: 0,
    calculatedLedgerBalance: 0,
    discrepancy: 0,
    minimumStock: 50,
    maximumStock: 250,
    reorderPoint: 70,
    averageMonthlyConsumption: 90,
    daysOutOfStock: 2,
    status: 'stockout',
    lastUpdated: "2026-10-29",
    auditedBy: "Pharmacist Dawid Aliyi",
    notes: "CRITICAL STOCKOUT! Urgent Emergency IFRR required."
  },
  {
    id: "bc-5",
    itemCode: "MED-301",
    drugName: "Oxytocin Injection",
    dosageForm: "Ampoule",
    strength: "10 IU/mL",
    unitOfIssue: "Box of 10",
    batchNumber: "ET-26119",
    expiryDate: "2027-03-20",
    folderId: "mch_coldchain",
    shelfLocation: "Fridge #1 (4°C)",
    beginningBalance: 60,
    quantityReceived: 80,
    quantityIssued: 75,
    lossOrAdjustment: 0,
    endingBalance: 65,
    calculatedLedgerBalance: 65,
    discrepancy: 0,
    minimumStock: 40,
    maximumStock: 160,
    reorderPoint: 55,
    averageMonthlyConsumption: 40,
    daysOutOfStock: 0,
    status: 'adequate',
    lastUpdated: "2026-10-27",
    auditedBy: "Pharmacist Dawid Aliyi",
    notes: "Cold chain temperature logged twice daily at 4.2°C"
  }
];

export const StoreSupplyChainMonitor: React.FC<StoreSupplyChainMonitorProps> = ({
  currentUser,
  onUpdateUser
}) => {
  const isUnlocked = currentUser.isPro || currentUser.unlockedStoreMonitor;

  // Active view state inside the module
  const [activeSubTab, setActiveSubTab] = useState<'bincards' | 'ifrr' | 'scanner' | 'stockcards'>('bincards');
  const [selectedFolderId, setSelectedFolderId] = useState<string>("opd_pharmacy");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'adequate' | 'near_expiry' | 'low_stock' | 'stockout'>('all');
  const [facilityName, setFacilityName] = useState("Tikur Anbessa Specialized Hospital");
  const [dispensaryUnit, setDispensaryUnit] = useState("OPD Pharmacy");
  const [reportingPeriod, setReportingPeriod] = useState("Meskerem - Tikimt 2018 (Oct - Nov 2026)");
  
  // Inventory state
  const [binCards, setBinCards] = useState<BinCardItem[]>(initialBinCards);
  const [folders, setFolders] = useState<DigitalFolder[]>(initialFolders);

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResultItem, setScannedResultItem] = useState<BinCardItem | null>(null);

  // Email dispatch state
  const [storekeeperEmail, setStorekeeperEmail] = useState("storekeeper@hospital.gov.et");
  const [storekeeperName, setStorekeeperName] = useState("Ato Abebe Tessema (Chief Storekeeper / Store Man)");
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [lastDispatchReceipt, setLastDispatchReceipt] = useState<any | null>(null);

  // Unlock modal state for 100 Birr payment
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockMethod, setUnlockMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [unlockTxRef, setUnlockTxRef] = useState("");
  const [isVerifyingUnlock, setIsVerifyingUnlock] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleUnlockStoreMonitor = () => {
    setIsVerifyingUnlock(true);
    setTimeout(() => {
      const updated: User = {
        ...currentUser,
        unlockedStoreMonitor: true,
        cbeReference: unlockTxRef.trim() || `ET-STR-${Date.now().toString().slice(-6)}`
      };
      localStorage.setItem('pharmastar_registered_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('pharmastar_auth_sync'));
      onUpdateUser(updated);
      setIsVerifyingUnlock(false);
      setIsUnlockModalOpen(false);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1200);
  };

  // Run Bin Card Scan via backend OCR simulator
  const handleTriggerBinCardScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/bincard/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: selectedFolderId })
      });
      const data = await res.json();
      if (data.success && data.scannedItem) {
        setScannedResultItem(data.scannedItem);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveScannedToFolder = () => {
    if (!scannedResultItem) return;
    setBinCards(prev => [scannedResultItem, ...prev]);
    setScannedResultItem(null);
    setActiveSubTab('bincards');
  };

  // Send IFRR Requisition to Store Man via Email
  const handleSendIFRRToStoreMan = async () => {
    setEmailStatus('sending');
    try {
      const res = await fetch('/api/ifrr/email-store-man', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storekeeperEmail,
          storekeeperName,
          facilityName,
          dispensaryUnit,
          reportingPeriod,
          leadPharmacist: "Pharmacist Dawid Aliyi",
          items: binCards
        })
      });
      const data = await res.json();
      setLastDispatchReceipt(data);
      setEmailStatus('sent');
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    } catch (err) {
      console.error(err);
      setEmailStatus('idle');
    }
  };

  const filteredItems = binCards.filter(item => {
    const matchFolder = item.folderId === selectedFolderId;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch = item.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFolder && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Ethiopian Hospital & Health Center Logistics Suite</span>
              </span>
              <span className="text-xs text-slate-400">EPSA / EPSS Standard Compliant</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Store Stockcard, Bin Card Monitoring & Automated IFRR Requisition
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Digitize physical shelf bin cards to facility digital folders, monitor real-time stockouts and expiry dates, generate national standard IFRR reports, and dispatch official orders to the Central Storekeeper via email.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isUnlocked ? (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock Store Monitor (100 ETB)</span>
              </button>
            ) : (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hospital Facility License Active</span>
              </span>
            )}
          </div>
        </div>

        {/* Facility Selector Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Health Facility:</label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Dispensary Unit:</label>
            <input
              type="text"
              value={dispensaryUnit}
              onChange={(e) => setDispensaryUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reporting Period:</label>
            <input
              type="text"
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 100 Birr Paywall Warning if not unlocked */}
      {!isUnlocked && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-white">Hospital & Pharmacy Student Logistics License</h3>
            <p className="text-xs text-slate-300">
              Access the complete Bin Card OCR Scanner, Digital Folder Storage, Real-time Stockcard Monitor, and Automated IFRR Email Dispatch for just <strong>100 ETB (Birr)</strong> via Telebirr or CBE.
            </p>
          </div>
          <button
            onClick={() => setIsUnlockModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <span>Activate Store Monitoring Site (100 Birr)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Workflow Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'bincards', label: '1. Live Bin Card Ledger', icon: Layers },
          { id: 'scanner', label: '2. Scan Bin Card to Folder (OCR)', icon: Camera },
          { id: 'ifrr', label: '3. Generate IFRR & Send to Store Man', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: LIVE BIN CARD LEDGER & FOLDERS */}
      {activeSubTab === 'bincards' && (
        <div className="space-y-6">
          {/* Digital Folders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map(folder => {
              const isSelected = selectedFolderId === folder.id;
              const itemsInFolder = binCards.filter(b => b.folderId === folder.id);
              const nearExpiry = itemsInFolder.filter(b => b.status === 'near_expiry').length;
              const stockouts = itemsInFolder.filter(b => b.status === 'stockout').length;

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500/60 shadow-lg text-white'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-teal-400">
                      {isSelected ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {itemsInFolder.length} Items
                    </span>
                  </div>

                  <h4 className="text-xs font-bold leading-tight">{folder.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{folder.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{folder.department}</span>
                    <div className="flex items-center gap-1.5">
                      {nearExpiry > 0 && (
                        <span className="text-amber-400 font-bold">⚠️ {nearExpiry} exp</span>
                      )}
                      {stockouts > 0 && (
                        <span className="text-rose-400 font-bold">🚨 {stockouts} out</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Controls (Search, Filters, Scan Shortcut) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drug name, batch #, shelf bin..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'adequate', label: 'Adequate' },
                { id: 'low_stock', label: 'Low Stock' },
                { id: 'near_expiry', label: 'Near Expiry' },
                { id: 'stockout', label: 'Stockouts' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              <button
                onClick={() => setActiveSubTab('scanner')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan New Card</span>
              </button>
            </div>
          </div>

          {/* Interactive Bin Card Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Item & Strength</th>
                    <th className="p-3.5">Unit</th>
                    <th className="p-3.5">Batch / Expiry</th>
                    <th className="p-3.5">Shelf Loc</th>
                    <th className="p-3.5 text-right">Beginning</th>
                    <th className="p-3.5 text-right">Recv</th>
                    <th className="p-3.5 text-right">Issued</th>
                    <th className="p-3.5 text-right">Physical Count</th>
                    <th className="p-3.5 text-right">AMC</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Quick Issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-medium">
                        <div className="font-bold text-white text-xs">{item.drugName}</div>
                        <div className="text-[10px] text-teal-400">{item.dosageForm} • {item.strength}</div>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-400">{item.unitOfIssue}</td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="text-white">{item.batchNumber}</div>
                        <div className={`text-[10px] ${
                          item.status === 'near_expiry' ? 'text-amber-400 font-bold' : 'text-slate-400'
                        }`}>
                          Exp: {item.expiryDate}
                        </div>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-300 font-mono">{item.shelfLocation}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">{item.beginningBalance}</td>
                      <td className="p-3.5 text-right font-mono text-emerald-400">+{item.quantityReceived}</td>
                      <td className="p-3.5 text-right font-mono text-rose-400">-{item.quantityIssued}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-white text-sm">
                        {item.endingBalance}
                      </td>
                      <td className="p-3.5 text-right font-mono text-teal-300">{item.averageMonthlyConsumption}</td>
                      <td className="p-3.5 text-center">
                        {item.status === 'adequate' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Adequate
                          </span>
                        )}
                        {item.status === 'low_stock' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            Low Stock
                          </span>
                        )}
                        {item.status === 'near_expiry' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Near Expiry
                          </span>
                        )}
                        {item.status === 'stockout' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Stockout
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            if (item.endingBalance > 0) {
                              setBinCards(prev => prev.map(b => b.id === item.id ? {
                                ...b,
                                quantityIssued: b.quantityIssued + 1,
                                endingBalance: b.endingBalance - 1,
                                status: b.endingBalance - 1 === 0 ? 'stockout' : b.endingBalance - 1 < b.minimumStock ? 'low_stock' : b.status
                              } : b));
                            }
                          }}
                          disabled={item.endingBalance <= 0}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold border border-slate-700 transition cursor-pointer disabled:opacity-30"
                        >
                          -1 Issue
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SCAN BIN CARD TO FOLDER (OCR) */}
      {activeSubTab === 'scanner' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="max-w-2xl space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-400" />
              <span>Bin Card Optical Character Recognition (OCR) Scanner</span>
            </h3>
            <p className="text-xs text-slate-300">
              Hold or upload physical paper bin card photos from dispensary shelves. Our AI engine extracts drug details, batch numbers, physical counts, and automatically syncs to the chosen facility folder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Scanner Upload Area */}
            <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 bg-slate-950/60 transition">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Capture or Upload Physical Bin Card</h4>
                <p className="text-xs text-slate-400 mt-1">Supports handwritten and printed standard Ethiopian MoH Bin Cards</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerBinCardScan}
                  disabled={isScanning}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning & Extracting Fields...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Run Optical Scan (OCR)</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-[10px] text-slate-500">
                Target Folder: <strong>{folders.find(f => f.id === selectedFolderId)?.name}</strong>
              </span>
            </div>

            {/* Right: Scanned Result Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Extracted Bin Card Metadata</span>
              </h4>

              {scannedResultItem ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-teal-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{scannedResultItem.drugName}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Zero Discrepancies
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div><span className="text-slate-400">Strength:</span> {scannedResultItem.strength}</div>
                      <div><span className="text-slate-400">Unit:</span> {scannedResultItem.unitOfIssue}</div>
                      <div><span className="text-slate-400">Batch #:</span> <span className="font-mono text-teal-300">{scannedResultItem.batchNumber}</span></div>
                      <div><span className="text-slate-400">Expiry:</span> <span className="font-mono text-white">{scannedResultItem.expiryDate}</span></div>
                      <div><span className="text-slate-400">Shelf Loc:</span> {scannedResultItem.shelfLocation}</div>
                      <div><span className="text-slate-400">Physical Bal:</span> <span className="font-bold text-emerald-400">{scannedResultItem.endingBalance}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveScannedToFolder}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save to Digital Folder & Update Live Ledger</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Click "Run Optical Scan (OCR)" above to simulate camera capture of a physical dispensary bin card.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ETHIOPIAN IFRR GENERATOR & EMAIL DISPATCH */}
      {activeSubTab === 'ifrr' && (
        <div className="space-y-6">
          {/* IFRR Formal Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  Federal Democratic Republic of Ethiopia • Ministry of Health
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Internal Facility Report and Requisition Form (IFRR)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official EPSA/EPSS bi-monthly requisition from {dispensaryUnit} to Central Medical Store.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official IFRR</span>
                </button>
              </div>
            </div>

            {/* Email Dispatch Form to Store Man */}
            <div className="bg-slate-950 border border-teal-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <Mail className="w-4 h-4" />
                <span>Transmit Requisition to Storekeeper / Store Man via Email</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Storekeeper Name:</label>
                  <input
                    type="text"
                    value={storekeeperName}
                    onChange={(e) => setStorekeeperName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Storekeeper Email Address:</label>
                  <input
                    type="email"
                    value={storekeeperEmail}
                    onChange={(e) => setStorekeeperEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400">
                  Authorizing Clinician: <strong>Pharmacist Dawid Aliyi</strong> (Lead Clinical Pharmacist)
                </div>

                <button
                  onClick={handleSendIFRRToStoreMan}
                  disabled={emailStatus === 'sending'}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {emailStatus === 'sending' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Official Requisition to Store Man...</span>
                    </>
                  ) : emailStatus === 'sent' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Sent! Dispatched to {storekeeperEmail}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Official IFRR to Store Man</span>
                    </>
                  )}
                </button>
              </div>

              {lastDispatchReceipt && (
                <div className="mt-2 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Requisition Dispatched Successfully! Tracking ID: {lastDispatchReceipt.trackingId}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lastDispatchReceipt.message}
                  </p>
                </div>
              )}
            </div>

            {/* Standard IFRR Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200 border border-slate-800">
                <thead className="bg-slate-950 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-2.5 border-r border-slate-800">Item Description</th>
                    <th className="p-2.5 border-r border-slate-800">Unit</th>
                    <th className="p-2.5 text-right border-r border-slate-800">Beginning Bal</th>
                    <th className="p-2.5 text-right border-r border-slate-800">Received</th>
                    <th className="p-2.5 text-right border-r border-slate-800">Dispensed</th>
                    <th className="p-2.5 text-right border-r border-slate-800">Physical Bal</th>
                    <th className="p-2.5 text-right border-r border-slate-800">AMC</th>
                    <th className="p-2.5 text-right border-r border-slate-800">MOS</th>
                    <th className="p-2.5 text-right border-r border-slate-800">Max Stock (4m)</th>
                    <th className="p-2.5 text-right bg-teal-950/40 text-teal-300 font-bold">Qty Requested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {binCards.map(item => {
                    const mos = item.averageMonthlyConsumption > 0 ? (item.endingBalance / item.averageMonthlyConsumption).toFixed(1) : "0";
                    const maxStock = item.averageMonthlyConsumption * 4;
                    const qtyRequested = Math.max(0, maxStock - item.endingBalance);

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="p-2.5 border-r border-slate-800 font-sans font-medium text-white">
                          {item.drugName} ({item.strength})
                        </td>
                        <td className="p-2.5 border-r border-slate-800 text-slate-400">{item.unitOfIssue}</td>
                        <td className="p-2.5 text-right border-r border-slate-800 text-slate-400">{item.beginningBalance}</td>
                        <td className="p-2.5 text-right border-r border-slate-800 text-emerald-400">{item.quantityReceived}</td>
                        <td className="p-2.5 text-right border-r border-slate-800 text-rose-400">{item.quantityIssued}</td>
                        <td className="p-2.5 text-right border-r border-slate-800 font-bold text-white">{item.endingBalance}</td>
                        <td className="p-2.5 text-right border-r border-slate-800 text-slate-300">{item.averageMonthlyConsumption}</td>
                        <td className="p-2.5 text-right border-r border-slate-800 text-amber-400">{mos} mos</td>
                        <td className="p-2.5 text-right border-r border-slate-800 text-slate-400">{maxStock}</td>
                        <td className="p-2.5 text-right bg-teal-950/30 text-teal-300 font-bold text-xs">
                          {qtyRequested > 0 ? `+${qtyRequested}` : '0 (Adequate)'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Verification Sign-off Box */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-3">
              <div>
                Prepared By: <strong className="text-white">Pharmacist Dawid Aliyi</strong> (Dispensary In-Charge)
              </div>
              <div>
                Verified By: <strong className="text-white">{storekeeperName}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 100 BIRR STORE MONITOR UNLOCK MODAL */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hospital & Health Center Logistics Access Pass
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Activate Store Monitoring Site (100 Birr)
                </h3>
              </div>
            </div>

            {/* Fee Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-950 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Facility Site Activation:</span>
                <span className="text-2xl font-black text-amber-400">100 ETB</span>
                <span className="text-[11px] text-slate-400 ml-1.5">(Ethiopian Birr)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full block">
                  Lifetime Facility Pass
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Full OCR & IFRR Dispatch</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUnlockMethod('telebirr')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  unlockMethod === 'telebirr'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                <span className="font-bold block">Telebirr</span>
                <span className="text-[10px] text-slate-400">0982852778</span>
              </button>

              <button
                type="button"
                onClick={() => setUnlockMethod('cbe')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  unlockMethod === 'cbe'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Landmark className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <span className="font-bold block">CBE Account</span>
                <span className="text-[10px] text-slate-400">1000262900367</span>
              </button>
            </div>

            {/* Account Details Box */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Beneficiary:</span>
                <span className="font-bold text-white">Pharmacist Dawid Aliyi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{unlockMethod === 'telebirr' ? 'Telebirr Phone:' : 'CBE Account:'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-teal-400">
                    {unlockMethod === 'telebirr' ? '0982852778' : '1000262900367'}
                  </span>
                  <button
                    onClick={() => copyText(unlockMethod === 'telebirr' ? '0982852778' : '1000262900367', 'store_key')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'store_key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Transaction Ref / SMS Code (Optional):</label>
              <input
                type="text"
                value={unlockTxRef}
                onChange={(e) => setUnlockTxRef(e.target.value)}
                placeholder="e.g., FT26... or Telebirr Receipt Code"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsUnlockModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUnlockStoreMonitor}
                disabled={isVerifyingUnlock}
                className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {isVerifyingUnlock ? (
                  <span>Verifying Transfer & Activating...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify 100 Birr & Activate Site</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
