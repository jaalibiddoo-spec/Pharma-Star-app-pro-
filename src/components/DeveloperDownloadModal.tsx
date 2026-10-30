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

      // 4. GitHub Actions Workflows & F-Droid Config
      const githubFolder = zip.folder('.github/workflows');
      if (githubFolder) {
        githubFolder.file('ci.yml', `name: CI & Build Verification
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 20 }
    - run: npm ci
    - run: npm run lint
    - run: npm run build
`);
        githubFolder.file('pages.yml', `name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment: { name: github-pages, url: "\${{ steps.deployment.outputs.page_url }}" }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: './dist' }
      - uses: actions/deploy-pages@v4
        id: deployment
`);
      }

      // 5. F-Droid metadata
      zip.file('.fdroid.yml', `Categories:
  - Science & Education
  - Healthcare
License: Apache-2.0
WebSite: https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app
SourceCode: https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro
Summary: "Clinical pharmacy, 3D molecular mechanics, and drug science suite"
RepoType: git
Repo: https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro.git
`);

      // 6. Personalized Readme for Dawid Aliyi
      zip.file('README-DAWID-ALIYI.md', `# Pharmastar App Pro — Complete Offline, GitHub & F-Droid Package
Developer: Pharmacist Dawid Aliyi
Email: jaalibiddoo@gmail.com
Bank: Commercial Bank of Ethiopia 1000262900367 (Dawid Aliyi)
Registration: 100 Birr / $1.00 USD
Live App URL: https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app

### Quick Git Push to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit of Pharmastar App Pro by Pharmacist Dawid Aliyi"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/pharmastar-app-pro.git
git push -u origin main
\`\`\`

### F-Droid Repository Submission:
1. Submit MR to https://gitlab.com/fdroid/fdroiddata
2. Add metadata/com.pharmastar.app.pro.yml with .fdroid.yml configuration
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
