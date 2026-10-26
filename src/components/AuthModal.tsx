import React, { useState } from 'react';
import { User } from '../types';
import { 
  KeyRound, User as UserIcon, Lock, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Copy, Check, X, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenProModal: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenProModal
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [showDemoPassword, setShowDemoPassword] = useState(false);
  const [showInputPassword, setShowInputPassword] = useState(false);

  if (!isOpen) return null;

  const DEMO_USER = "Pharmastar";
  const DEMO_PASS = "Jaalibiddoo@529d";

  const handleQuickLogin = () => {
    setUsername(DEMO_USER);
    setPassword(DEMO_PASS);
    setErrorMsg('');

    const freeUser: User = {
      username: DEMO_USER,
      isPro: false,
      fullName: "Pharmastar Member",
      role: "pharmacist",
      registrationDate: "2026-10-26",
      offlineReady: true
    };

    onLoginSuccess(freeUser);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (username.trim() === DEMO_USER && password === DEMO_PASS) {
      const freeUser: User = {
        username: DEMO_USER,
        isPro: false,
        fullName: "Pharmastar Member",
        role: "pharmacist",
        registrationDate: "2026-10-26",
        offlineReady: true
      };
      onLoginSuccess(freeUser);
      onClose();
    } else if (username.trim().length > 2 && password.length >= 4) {
      // Allow custom login/registration
      const customUser: User = {
        username: username.trim(),
        isPro: false,
        fullName: username.trim(),
        role: "student",
        registrationDate: new Date().toISOString().split('T')[0],
        offlineReady: true
      };
      onLoginSuccess(customUser);
      onClose();
    } else {
      setErrorMsg(`Invalid credentials. Please use the free access account or click 1-Click Free Entry.`);
    }
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Username: ${DEMO_USER}\nPassword: ${DEMO_PASS}`);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            Secure Authentication Portal
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Pharma Star App Pro</h2>
          <p className="text-xs text-slate-300">
            Sign in with free entry credentials or custom account.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Prominent Free Access Box */}
          <div className="bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 border border-teal-500/40 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Free Entry Account:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDemoPassword(!showDemoPassword)}
                  className="text-[11px] text-slate-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                  title={showDemoPassword ? "Hide Password" : "Show Password"}
                >
                  {showDemoPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showDemoPassword ? 'Hide' : 'Reveal'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="text-[11px] text-teal-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedDemo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDemo ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Username:</span>
                <span className="font-bold text-white">{DEMO_USER}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Password:</span>
                <span className="font-bold text-amber-300 tracking-wider">
                  {showDemoPassword ? DEMO_PASS : "••••••••••••••"}
                </span>
              </div>
            </div>

            {/* Instant 1-Click Login Button */}
            <button
              onClick={handleQuickLogin}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>1-Click Free Entry (Instant Login)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold absolute">
              Or Manual Sign In
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-3 text-xs">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Username:</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Pharmastar"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showInputPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowInputPassword(!showInputPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showInputPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer border border-slate-700 shadow"
            >
              Sign In
            </button>
          </form>

          {/* Upgrade prompt */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={() => {
                onClose();
                onOpenProModal();
              }}
              className="text-xs text-amber-400 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need Pro for Remote Areas? Register (100 Birr / $1) ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

