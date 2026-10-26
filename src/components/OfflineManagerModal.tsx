import React, { useState } from 'react';
import { 
  Wifi, WifiOff, HardDrive, DownloadCloud, CheckCircle2, 
  RefreshCw, Database, ShieldCheck, X 
} from 'lucide-react';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulatingOffline: boolean;
  onToggleOffline: () => void;
  isPro: boolean;
  onOpenProModal: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  isSimulatingOffline,
  onToggleOffline,
  isPro,
  onOpenProModal
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedPercent, setSyncedPercent] = useState(100);

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncedPercent(25);
    setTimeout(() => setSyncedPercent(60), 600);
    setTimeout(() => setSyncedPercent(85), 1100);
    setTimeout(() => {
      setSyncedPercent(100);
      setIsSyncing(false);
    }, 1600);
  };

  const offlinePackages = [
    { name: "Ethiopian EFDA & MoH National Guidelines", size: "24.5 MB", status: "Cached" },
    { name: "Complete 10 Pharmacy Curriculum Courses", size: "48.2 MB", status: "Cached" },
    { name: "Drug-Drug & CYP450 Interaction Database", size: "18.4 MB", status: "Cached" },
    { name: "Laboratory Interpretation & Dosing Engine", size: "12.8 MB", status: "Cached" },
    { name: "International WHO & Specialty Guidelines", size: "38.6 MB", status: "Cached" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            Remote Areas Offline Database
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Offline Access Center</h2>
          <p className="text-xs text-slate-300">
            Zero-connectivity access designed for rural clinics and remote hospitals.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Offline Mode Toggle Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isSimulatingOffline ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {isSimulatingOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {isSimulatingOffline ? 'Offline Mode Active' : 'Online Mode (Connected)'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isSimulatingOffline 
                    ? 'Operating purely from local device storage without internet.' 
                    : 'Real-time sync with online clinical servers.'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleOffline}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isSimulatingOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isSimulatingOffline ? 'Go Online' : 'Simulate Offline'}
            </button>
          </div>

          {/* Sync Progress & Storage */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-slate-200">Device Storage Caching:</span>
              </div>
              <span className="font-mono text-teal-400 font-bold">142.5 MB / 150 MB (100% Ready)</span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${syncedPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Last verified: Today at 08:45 AM
              </span>

              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync All Now'}</span>
              </button>
            </div>
          </div>

          {/* Downloaded Packages Breakdown */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Installed Clinical Databases:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {offlinePackages.map((pkg, i) => (
                <div key={i} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300 font-medium">{pkg.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{pkg.size}</span>
                </div>
              ))}
            </div>
          </div>

          {!isPro && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <p className="text-[11px] text-amber-300">
                Upgrade to Pro (100 Birr / $1) for automated background sync in remote areas!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenProModal();
                }}
                className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[11px] cursor-pointer"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
