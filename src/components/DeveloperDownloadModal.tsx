import React, { useState } from 'react';
import JSZip from 'jszip';
import { coursesData } from '../data/coursesData';
import { drugInteractionsData } from '../data/drugInteractionsData';
import { guidelinesData } from '../data/guidelinesData';
import { labTestsData } from '../data/labInterpretationData';
import { 
  Download, FileArchive, CheckCircle2, Lock, Sparkles, 
  Smartphone, ShieldCheck, Terminal, X, ArrowDownToLine, RefreshCw 
} from 'lucide-react';

interface DeveloperDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperDownloadModal: React.FC<DeveloperDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFullZip = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();

      // 1. Android Manifest
      const manifestRes = await fetch('/manifest.json').catch(() => null);
      const manifestText = manifestRes ? await manifestRes.text() : JSON.stringify({
        id: "pharmastar-app-pro",
        name: "Pharmastar app pro",
        short_name: "Pharmastar",
        developer: { name: "Pharmacist Dawid Aliyi", email: "jaalibiddoo@gmail.com" }
      }, null, 2);
      zip.file('manifest.json', manifestText);

      // 2. Offline Databases
      const offlineFolder = zip.folder('offline-database');
      if (offlineFolder) {
        offlineFolder.file('10-pharmacy-courses.json', JSON.stringify(coursesData, null, 2));
        offlineFolder.file('drug-interactions-matrix.json', JSON.stringify(drugInteractionsData, null, 2));
        offlineFolder.file('clinical-guidelines-efda-who.json', JSON.stringify(guidelinesData, null, 2));
        offlineFolder.file('laboratory-dosing-tests.json', JSON.stringify(labTestsData, null, 2));
      }

      // 3. Android TWA Config for Google Play Store
      const androidFolder = zip.folder('android-playstore-config');
      if (androidFolder) {
        androidFolder.file('bubblewrap-twa-config.json', JSON.stringify({
          packageId: "com.pharmastar.pro",
          host: "ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app",
          name: "Pharmastar app pro",
          launcherName: "Pharmastar",
          themeColor: "#0d9488",
          navigationColor: "#020617",
          backgroundColor: "#020617",
          startUrl: "/",
          iconUrl: "https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app/pwa-512x512.svg",
          maskableIconUrl: "https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app/pwa-maskable-512x512.svg",
          developer: {
            name: "Pharmacist Dawid Aliyi",
            email: "jaalibiddoo@gmail.com"
          }
        }, null, 2));

        androidFolder.file('assetlinks.json', JSON.stringify([
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: "com.pharmastar.pro",
              sha256_cert_fingerprints: ["*YOUR_RELEASE_KEYSTORE_SHA256_FINGERPRINT*"]
            }
          }
        ], null, 2));
      }

      // 4. Personalized Readme for Dawid Aliyi
      zip.file('README-DAWID-ALIYI.md', `# Pharmastar App Pro — Complete Offline & Deployment Package
Developer: Pharmacist Dawid Aliyi
Email: jaalibiddoo@gmail.com
Bank: Commercial Bank of Ethiopia 1000262900367 (Dawid Aliyi)
Registration: 100 Birr / $1.00 USD
Live App URL: https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app

### Package Contents:
1. manifest.json: Verified Web App Manifest for PWABuilder / Play Store
2. offline-database/:
   - 10-pharmacy-courses.json (Pharmacology, Pharmacotherapy, Toxicology, Industrial Pharmacy, Pharmacy Practice, Biopharmaceuticals, Medicinal Chemistry, Physical Pharmaceutics, Pharmacognosy, Internship Practice)
   - drug-interactions-matrix.json (Pairwise severity & CYP450 checks)
   - clinical-guidelines-efda-who.json (Ethiopian EFDA, MoH STG, WHO AWaRe, ADA, AHA/ACC)
   - laboratory-dosing-tests.json (Cockcroft-Gault & reference ranges)
3. android-playstore-config/:
   - bubblewrap-twa-config.json
   - assetlinks.json
`);

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });

      // Trigger download
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `pharmastar-app-pro-dawid-aliyi-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setIsGenerating(false);
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Zip generation error:", err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Exclusive Developer Portal
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">Direct App Download Package</h2>
          <p className="text-xs text-slate-300">
            Dedicated export for: <strong className="text-teal-300">Pharmacist Dawid Aliyi</strong> (<span className="font-mono text-slate-400">jaalibiddoo@gmail.com</span>)
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <FileArchive className="w-4 h-4 text-teal-400" />
                <span>Complete App Package (.ZIP)</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-900 text-teal-300 px-2 py-0.5 rounded border border-slate-800">
                Offline Ready
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Downloads a standalone archive containing all 10 pharmacy curriculum courses, offline JSON databases, Play Store TWA configs, and manifest assets for direct installation or GitHub backup.
            </p>
          </div>

          {/* Action Download Button */}
          <button
            onClick={handleDownloadFullZip}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Packaging App & Databases into ZIP...</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download App Package (.ZIP) for Dawid Aliyi</span>
              </>
            )}
          </button>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                Download started successfully! Your offline package is saved to your downloads folder.
              </span>
            </div>
          )}

          {/* Package Content Breakdown */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">
              Included In Your Personal Package:
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">📁 10 Pharmacy Courses JSON</span>
                <span className="text-teal-400">Complete Syllabus</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">📁 Drug Interactions & CYP450</span>
                <span className="text-teal-400">Full Matrix</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">📁 EFDA & WHO Guidelines</span>
                <span className="text-teal-400">Clinical Protocols</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">📁 Android TWA & Assetlinks</span>
                <span className="text-teal-400">Play Store Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
