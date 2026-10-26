import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, Smartphone, CheckCircle2, Globe, Sparkles, 
  Layers, ExternalLink, X, HelpCircle, ShieldCheck, Play 
} from 'lucide-react';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct_android' | 'play_store'>('direct_android');

  if (!isOpen) return null;

  const appLiveUrl = "https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            Android Installation & Deployment Guide
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Pharmastar App Pro on Android</h2>
          <p className="text-xs text-slate-300">
            Developer: <strong className="text-teal-300">Pharmacist Dawid Aliyi</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('direct_android')}
            className={`pb-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'direct_android'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Method 1: Direct Android Phone Install (Instant)</span>
          </button>

          <button
            onClick={() => setActiveTab('play_store')}
            className={`pb-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'play_store'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Method 2: Google Play Store Packaging</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {activeTab === 'direct_android' ? (
            <div className="space-y-4">
              {/* Direct Install CTA */}
              <div className="bg-teal-950/40 border border-teal-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Instant Native Installation</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Installs full app icon, standalone screen, and offline cache on your phone.
                  </p>
                </div>

                {isInstallable ? (
                  <button
                    onClick={() => install()}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App Now</span>
                  </button>
                ) : (
                  <div className="text-[11px] bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-400">
                    Use Chrome / Mobile browser
                  </div>
                )}
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                  Step-by-Step Instructions for Any Android Device:
                </h4>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-white block">Open the Live App URL on Android:</strong>
                      <p className="text-slate-400 mt-0.5">
                        Open <strong className="text-teal-300 font-mono">Google Chrome</strong> or <strong className="text-teal-300 font-mono">Samsung Internet</strong> on your Android phone and visit:
                      </p>
                      <div className="mt-1.5 p-2 bg-slate-900 rounded-lg border border-slate-700 font-mono text-[11px] text-teal-300 break-all select-all">
                        {appLiveUrl}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-white block">Tap "Install" or Browser Menu:</strong>
                      <p className="text-slate-400 mt-0.5">
                        A banner saying <strong className="text-slate-200">"Add Pharmastar to Home screen"</strong> will pop up automatically. If you don't see it, tap the three dots (<strong className="text-white">⋮</strong>) at the top-right of Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-white block">Select "Install app" / "Add to Home screen":</strong>
                      <p className="text-slate-400 mt-0.5">
                        Tap <strong className="text-white">Install</strong>. Android will download the app package, add the teal <strong className="text-teal-300">Pharmastar</strong> icon to your app drawer, and enable 100% offline database functionality!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
                  Google Play Store Packaging (.AAB Package)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  The application is fully compliant with Google Play Trusted Web Activity (TWA) requirements. Follow these steps to generate the official Play Store package:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-white block">Open PWABuilder.com:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-teal-400 underline">PWABuilder.com</a> on your computer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-white block">Enter your Live URL:</strong>
                    <div className="mt-1 p-1.5 bg-slate-900 rounded font-mono text-[11px] text-teal-300 select-all">
                      {appLiveUrl}
                    </div>
                    <p className="text-slate-400 mt-1">
                      Click <strong className="text-white">Start</strong>. PWABuilder will scan and verify your manifest (`Pharmastar app pro`, Author: *Pharmacist Dawid Aliyi*, icons, screenshots).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-white block">Click "Package for Android":</strong>
                    <p className="text-slate-400 mt-0.5">
                      Select Android, choose package name (e.g. <code className="text-teal-300">com.pharmastar.pro</code>), and click <strong className="text-white">Generate</strong>. Download the generated <strong className="text-amber-300 font-mono">.aab</strong> file and signing key.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-white block">Publish to Google Play Console:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Log into <strong className="text-white">Google Play Console</strong> with your account (<code className="text-teal-300">jaalibiddoo@gmail.com</code>), create a new app listing, upload the <strong className="text-amber-300 font-mono">.aab</strong> bundle, and publish to the world!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
