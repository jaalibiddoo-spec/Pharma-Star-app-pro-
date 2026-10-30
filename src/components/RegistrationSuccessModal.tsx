import React, { useRef } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, QrCode, ArrowRight, 
  X, Download, Printer, User as UserIcon, Calendar, 
  Landmark, Smartphone, Award, Globe, ExternalLink
} from 'lucide-react';
import { User } from '../types';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLaunchWorkstation: () => void;
  onViewWebsite: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  onClose,
  user,
  onLaunchWorkstation,
  onViewWebsite
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-teal-500/50 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-950 border-b border-teal-500/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400 text-slate-950 flex items-center gap-1 shadow">
              <CheckCircle2 className="w-3.5 h-3.5" /> Automatic Registration Complete
            </span>
            <span className="text-xs font-mono text-emerald-300">Payment Executed & Verified</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Welcome to Pharma Star App Pro!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Your payment has been automatically confirmed. Full Pro access is now active and synchronized across both the Website and App Workstation.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Digital Membership ID Card */}
          <div 
            ref={cardRef}
            className="relative rounded-2xl p-6 bg-gradient-to-br from-slate-950 via-teal-950/60 to-slate-900 border-2 border-teal-500/40 shadow-xl text-white space-y-4 overflow-hidden"
          >
            {/* Background Holographic Ribbon */}
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Award className="w-48 h-48 text-teal-400" />
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-teal-500/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-400 text-slate-950 font-black flex items-center justify-center text-base">
                  ✦
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider text-teal-300 uppercase">Pharma Star App Pro</div>
                  <div className="text-[10px] text-slate-400">Official Clinical Pharmacy Membership Card</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                PRO ACTIVE
              </span>
            </div>

            {/* Card Member Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Member Name</span>
                <span className="font-bold text-white text-sm truncate block">{user.fullName || user.username}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registration ID</span>
                <span className="font-mono font-bold text-teal-300">{user.membershipId || `PS-ET-${Date.now().toString().slice(-6)}`}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Role / Designation</span>
                <span className="text-slate-200 capitalize font-medium">{user.role} (Accredited)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payment Reference</span>
                <span className="font-mono text-slate-200 truncate block">{user.cbeReference || 'TXN-TB-VERIFIED'}</span>
              </div>
            </div>

            {/* Card Footer with Verification QR */}
            <div className="flex items-center justify-between pt-3 border-t border-teal-500/30 text-[10px] text-slate-400">
              <div className="space-y-0.5">
                <div>Issued by: <strong>Pharmacist Dawid Aliyi</strong></div>
                <div>EFDA & MoH Ethiopia Continuing Education Aligned</div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-teal-500/30 font-mono text-[9px] text-teal-300">
                <QrCode className="w-3.5 h-3.5 text-teal-400" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Unlocked Benefits Checklist */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Features Automatically Activated On Both App & Website:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>10 Academic Course Modules Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>EFDA / MoH CPD Certification Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>142MB Offline Database Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Drug Interaction & CYP450 Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Clinical Lab Interpreter & Calculators</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>1-on-1 Consultation Priority Queue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print License Card</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewWebsite();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Browse Website
            </button>

            <button
              onClick={() => {
                onLaunchWorkstation();
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-500/25 cursor-pointer"
            >
              <span>Enter Clinical Workstation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
