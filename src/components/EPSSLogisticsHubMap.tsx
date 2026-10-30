import React, { useState } from 'react';
import { 
  Building2, MapPin, Search, AlertTriangle, 
  CheckCircle2, AlertOctagon, Phone, Mail, 
  Send, RefreshCw, Filter, ArrowRight, ShieldCheck, 
  Package, Truck, ArrowLeftRight
} from 'lucide-react';
import { EPSSRegionalHub, User } from '../types';
import { sampleEPSSRegionalHubs } from '../data/advancedFeaturesData';

interface Props {
  currentUser: User;
  onOpenConsultation?: () => void;
}

export const EPSSLogisticsHubMap: React.FC<Props> = ({ currentUser }) => {
  const [hubs, setHubs] = useState<EPSSRegionalHub[]>(sampleEPSSRegionalHubs);
  const [selectedHubId, setSelectedHubId] = useState<string>(sampleEPSSRegionalHubs[0].id);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [requisitionDispatched, setRequisitionDispatched] = useState(false);
  const [requisitionData, setRequisitionData] = useState({
    drugName: 'Oxytocin Injection 10 IU/1 mL',
    quantity: 200,
    requestingFacility: 'Tikur Anbessa Specialized Hospital',
    urgency: 'STAT Emergency'
  });

  const activeHub = hubs.find(h => h.id === selectedHubId) || hubs[0];

  const filteredHubs = hubs.filter(h => {
    const matchReg = selectedRegionFilter === 'all' || h.region.toLowerCase().includes(selectedRegionFilter.toLowerCase());
    const matchSearch = h.hubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        h.hubCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchReg && matchSearch;
  });

  const handleDispatchRequisition = () => {
    setRequisitionDispatched(true);
    setTimeout(() => {
      setRequisitionDispatched(false);
      setIsRequisitionModalOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Ethiopian Pharmaceutical Supply Service (EPSS)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                19 Regional Hubs Active Network
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Interactive EPSS Regional Hub Logistics & Stock Availability Map
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Real-time monitoring of tracer essential medicines across all 19 EPSS regional supply hubs (Addis Ababa, Adama, Hawassa, Jimma, Bahir Dar, Gondar, Mekelle, Dire Dawa, Nekemte, etc.). Prevent facility stockouts and coordinate emergency inter-hub allocations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsRequisitionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Generate Emergency Hub Requisition</span>
            </button>
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Filter Region:</span>
          {[
            { id: 'all', label: 'All 19 Hubs' },
            { id: 'Addis Ababa', label: 'Addis Ababa' },
            { id: 'Oromia', label: 'Oromia' },
            { id: 'Amhara', label: 'Amhara' },
            { id: 'Sidama', label: 'Sidama & South' },
            { id: 'Tigray', label: 'Tigray' },
            { id: 'Dire Dawa', label: 'Eastern' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegionFilter(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                selectedRegionFilter === r.id
                  ? 'bg-teal-600 border-teal-400 text-white shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map & Directory (7 cols) + Selected Hub Stock Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Regional SVG Map & Hub Cards */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Ethiopian Regional Logistics Map (Click Any Hub)</span>
              </h3>
              <span className="text-[10px] text-slate-400">Interactive geographic visualization of EPSS central and regional stores</span>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hub name or city..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Interactive Geographic Map Viewport (SVG Representation of Ethiopia) */}
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-4 flex items-center justify-center">
            {/* Background Map Contours SVG */}
            <svg viewBox="0 0 1000 600" className="w-full h-full opacity-30 pointer-events-none">
              <path 
                d="M 280,120 L 450,80 L 580,110 L 720,180 L 850,260 L 880,340 L 780,420 L 640,490 L 520,540 L 380,510 L 290,420 L 220,330 L 240,220 Z" 
                fill="#0f172a" 
                stroke="#14b8a6" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              <path 
                d="M 400,240 Q 500,280 580,340" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="1.5" 
                strokeDasharray="2 2"
              />
            </svg>

            {/* Hub Pins Positioned Over Map */}
            {filteredHubs.map(hub => {
              const isSelected = activeHub.id === hub.id;
              const hasCritical = hub.tracerStock.some(s => s.status === 'critical_stockout');

              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHubId(hub.id)}
                  style={{ left: `${hub.mapX}%`, top: `${hub.mapY}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition group cursor-pointer ${
                    isSelected
                      ? 'scale-125 z-30'
                      : 'hover:scale-110 z-10'
                  }`}
                  title={`${hub.hubName} (${hub.city})`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-lg transition ${
                    hasCritical
                      ? 'bg-rose-500 border-white text-white animate-pulse'
                      : isSelected
                      ? 'bg-teal-500 border-white text-slate-950 ring-4 ring-teal-500/30'
                      : 'bg-slate-900 border-teal-400 text-teal-300'
                  }`}>
                    ✦
                  </div>
                  {/* Tooltip Label */}
                  <span className={`absolute left-1/2 -translate-x-1/2 top-7 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none ${
                    isSelected
                      ? 'bg-teal-600 text-white block z-40'
                      : 'bg-slate-900/90 text-slate-300 hidden group-hover:block border border-slate-700'
                  }`}>
                    {hub.city}
                  </span>
                </button>
              );
            })}

            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-400">
              Showing <strong>{filteredHubs.length}</strong> Ethiopian Supply Hubs
            </div>
          </div>

          {/* Quick Hub Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {filteredHubs.map(hub => {
              const isSelected = activeHub.id === hub.id;
              const hasCritical = hub.tracerStock.some(s => s.status === 'critical_stockout');

              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHubId(hub.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-white truncate">{hub.city}</span>
                    {hasCritical ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{hub.hubCode}</p>
                  <div className="text-[10px] text-teal-400 mt-1 font-semibold">
                    Supply: {hub.overallSupplyIndexPercent}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Regional Hub Inventory & Tracer Stock */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                  {activeHub.hubCode}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeHub.overallSupplyIndexPercent > 85
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  Supply Index: {activeHub.overallSupplyIndexPercent}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{activeHub.hubName}</h3>
              <p className="text-xs text-slate-400">
                Region: <strong className="text-slate-200">{activeHub.region}</strong> • Servicing <strong>{activeHub.servicedFacilitiesCount}</strong> Health Facilities
              </p>
            </div>

            {/* Coordinator Contact Card */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Regional Coordinator:</span>
              <strong className="text-white block">{activeHub.leadCoordinator}</strong>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <a href={`tel:${activeHub.contactPhone}`} className="text-teal-400 hover:underline flex items-center gap-1 font-bold">
                  <Phone className="w-3 h-3" />
                  <span>{activeHub.contactPhone}</span>
                </a>
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  <Mail className="w-3 h-3" />
                  <span>{activeHub.contactEmail}</span>
                </span>
              </div>
            </div>

            {/* Tracer Medicines Inventory List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Tracer Essential Commodities Stock</span>
              </h4>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {activeHub.tracerStock.map((med, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      med.status === 'critical_stockout'
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : med.status === 'low_stock'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">{med.drugName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {med.strength} • {med.dosageForm}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-teal-300">
                        {med.quantityAvailable.toLocaleString()} {med.unit}
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        med.status === 'critical_stockout'
                          ? 'bg-rose-500/30 text-rose-300'
                          : med.status === 'low_stock'
                          ? 'bg-amber-500/30 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {med.monthsOfStock} MOS ({med.status.replace('_', ' ')})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsRequisitionModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Request Allocation from {activeHub.city} Hub</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: EMERGENCY EPSS REQUISITION GENERATOR */}
      {/* ======================================================== */}
      {isRequisitionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-400" />
                <span>EPSS Inter-Hub Emergency Requisition</span>
              </h3>
              <button 
                onClick={() => setIsRequisitionModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requisitionDispatched ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Emergency Requisition Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Electronic requisition forwarded directly to <strong>{activeHub.leadCoordinator}</strong> at {activeHub.hubName} with digital signoff by Pharmacist Dawid Aliyi.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Target EPSS Regional Hub</label>
                  <input
                    type="text"
                    readOnly
                    value={`${activeHub.hubName} (${activeHub.city})`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-teal-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Requesting Health Facility</label>
                  <input
                    type="text"
                    value={requisitionData.requestingFacility}
                    onChange={(e) => setRequisitionData({ ...requisitionData, requestingFacility: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Tracer Medicine Needed</label>
                    <input
                      type="text"
                      value={requisitionData.drugName}
                      onChange={(e) => setRequisitionData({ ...requisitionData, drugName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Quantity Requested</label>
                    <input
                      type="number"
                      value={requisitionData.quantity}
                      onChange={(e) => setRequisitionData({ ...requisitionData, quantity: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Urgency Priority</label>
                  <select
                    value={requisitionData.urgency}
                    onChange={(e) => setRequisitionData({ ...requisitionData, urgency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="STAT Emergency">STAT Emergency (&lt; 24h Stockout Threat)</option>
                    <option value="Urgent">Urgent Reorder (&lt; 1 Month Stock on Hand)</option>
                    <option value="Standard Monthly IFRR">Standard Monthly IFRR Requisition</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setIsRequisitionModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDispatchRequisition}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Requisition to {activeHub.city}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
