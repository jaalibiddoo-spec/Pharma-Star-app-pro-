import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Award, Video, ShieldCheck, Stethoscope, 
  Activity, Users, Pill, Globe, Wifi, WifiOff, HardDrive, 
  KeyRound, CreditCard, Landmark, CheckCircle2, 
  ChevronRight, MessageSquare, Smartphone, Download, Lock,
  Building2, BookMarked, ExternalLink, ArrowRight, Star, 
  HelpCircle, Copy, Check, HeartHandshake, PhoneCall, Mail,
  Layers, Cpu, Play, Search, GraduationCap, ShieldAlert, Zap,
  FileCheck2, FileScan, AlertTriangle, Calculator, Package, Scale,
  Share2
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { Language, User } from '../types';
import { AdminSponsorLettersModal } from './AdminSponsorLettersModal';
import { useCurrency } from '../context/CurrencyContext';
import { CountryCurrencySelector } from './CountryCurrencySelector';

interface OfficialWebsiteProps {
  onLaunchApp: (tab?: string) => void;
  onOpenSubModal: () => void;
  onOpenAuthModal: () => void;
  onOpenInstallModal: () => void;
  onOpenDevDownload: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isPro: boolean;
  currentUser?: User;
}

export const OfficialWebsite: React.FC<OfficialWebsiteProps> = ({
  onLaunchApp,
  onOpenSubModal,
  onOpenAuthModal,
  onOpenInstallModal,
  onOpenDevDownload,
  currentLang,
  onLanguageChange,
  isPro,
  currentUser
}) => {
  const { isEthiopia, currency, formatPrice } = useCurrency();
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'international_suite' | 'global_search' | 'cpd' | 'telehealth_guidelines' | 'sponsorship_portal' | 'courses' | 'abc_ven' | 'dtp_interventions' | 'store_ifrr' | 'prescriptions' | 'research' | 'moa3d' | 'clinical' | 'consult' | 'offline'>('international_suite');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [isSponsorLettersOpen, setIsSponsorLettersOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const featureTabs = [
    { id: 'international_suite', title: 'Intl Clinical Suite (PGx/TDM)', icon: Globe, subtitle: 'CPIC precision & Bayesian TDM' },
    { id: 'global_search', title: 'Global Search & FDA/EMA Radar', icon: Search, subtitle: 'Google Grounded real-time alerts' },
    { id: 'cpd', title: 'EFDA CPD & Cycle Status', icon: Award, subtitle: 'Directive No. 49/2022 renewal audit' },
    { id: 'telehealth_guidelines', title: 'Telemedicine & Telepharmacy Directives', icon: Video, subtitle: 'MoH & EFDA statutory standards' },
    { id: 'sponsorship_portal', title: 'Sponsors & Non-Gov History', icon: Building2, subtitle: 'Platinum, Gold, Bronze Non-Gov' },
    { id: 'abc_ven', title: 'ABC & VEN Analysis (DTC)', icon: Scale, subtitle: 'Pareto 80/20 & FSML Master PDF' },
    { id: 'dtp_interventions', title: 'DTP Reports & SBAR', icon: AlertTriangle, subtitle: 'Quick export & clinical report' },
    { id: 'courses', title: '12 Courses + Gemini AI', icon: BookOpen, subtitle: 'First course free for everyone!' },
    { id: 'prescriptions', title: 'Prescription Review & Sites', icon: FileCheck2, subtitle: '2,000 ETB/yr site network' },
    { id: 'store_ifrr', title: 'Hospital Store & IFRR', icon: Building2, subtitle: 'Bin cards & email store man' },
    { id: 'research', title: 'Research Publishing', icon: BookMarked, subtitle: '1,000 ETB for institutions' },
    { id: 'moa3d', title: '3D Molecular MOA', icon: Video, subtitle: 'Interactive Three.js simulations' },
    { id: 'clinical', title: 'Clinical Decision Engine', icon: Pill, subtitle: 'Interactions, labs & SOAP' },
    { id: 'consult', title: '1-on-1 Consultations', icon: MessageSquare, subtitle: 'Direct reviews with Dawid' },
    { id: 'offline', title: '100% Offline Ready', icon: HardDrive, subtitle: 'IndexedDB for remote clinics' },
  ] as const;

  const faqs = [
    {
      q: 'How do Ethiopian pharmacists and druggists earn EFDA / MoH CPD points?',
      a: 'Practicing pharmacists and druggists in Ethiopia are required to earn Continuing Professional Development (CPD) points annually to renew their practicing licenses with the Ethiopian Food and Drug Authority (EFDA) and the Ministry of Health (MoH). In Pharma Star App Pro, complete any of the 10 accredited modules, pass the end-of-module assessment with 80%+ score, and generate your official verifiable PDF certificate with QR code for 200–500 ETB.'
    },
    {
      q: 'What payment methods are supported in Ethiopia and internationally?',
      a: 'We support all major Ethiopian domestic payment channels: Telebirr (0982852778 - Dawid Aliyi), Commercial Bank of Ethiopia (CBE account: 1000262900367 - Dawid Aliyi), and CBE Birr (*847#). For automated instant online checkout and international professionals, secure payments via Chapa and global USD cards ($10.00 USD) are supported.'
    },
    {
      q: 'Can Pharma Star App Pro run in rural health centers without internet access?',
      a: 'Yes! The entire application is built with a standalone 142MB Offline Database Engine utilizing browser IndexedDB, LocalStorage, and Progressive Web App (PWA) service workers. All 10 courses, drug interaction matrices, laboratory calculation algorithms, and guidelines work 100% offline in remote hospital wards and rural dispensaries.'
    },
    {
      q: 'Does Pharma Star App Pro work in any country worldwide?',
      a: 'Yes! Pharma Star App Pro is engineered to run seamlessly across all countries and geographic locations worldwide. Users in Ethiopia automatically see and pay in Ethiopian Birr (ETB) using Telebirr (0982852778), CBE (1000262900367), or CBE Birr (*847#). Users in all other international locations automatically see and pay in US Dollars ($USD) with Visa, Mastercard, American Express, PayPal, and Apple Pay. You can also switch your country and currency anytime via the interactive Country & Currency selector.'
    },
    {
      q: 'Who is the lead developer and author of Pharma Star App Pro?',
      a: 'Pharma Star App Pro is developed and authored by Pharmacist Dawid Aliyi (jaalibiddoo@gmail.com), a licensed clinical pharmacist, academic curriculum contributor, and health informatics software engineer based in Ethiopia.'
    },
    {
      q: 'How can verified pharmaceutical manufacturers sponsor modules?',
      a: 'Ethical pharmaceutical manufacturers and medical equipment suppliers verified by EFDA can sponsor specific educational course modules or clinical guidelines. This provides ethical visibility to thousands of Ethiopian pharmacists while funding subsidized CPD certificates for rural healthcare workers.'
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-teal-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-b border-teal-500/20 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {currentUser?.isPro ? (
              <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>PRO REGISTERED: {currentUser.fullName || currentUser.username} ({currentUser.membershipId || 'PS-PRO-VERIFIED'})</span>
              </span>
            ) : (
              <span className="bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/40 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" /> Official Website & Web Portal
              </span>
            )}
            <span className="text-slate-300 hidden sm:inline">
              Developer: <strong className="text-white">Pharmacist Dawid Aliyi</strong> | Telebirr: <span className="font-mono text-teal-300 font-bold">0982852778</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.isPro ? (
              <span className="text-[11px] text-emerald-400 font-semibold hidden md:inline flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Full Access Unlocked
              </span>
            ) : (
              <button
                onClick={onOpenSubModal}
                className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{isEthiopia ? 'Auto-Register (1,000 Birr)' : 'Auto-Register ($10.00 USD)'}</span>
              </button>
            )}

            <button
              onClick={() => onLaunchApp('courses')}
              className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Launch App Workstation</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Website Navigation Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black text-xl">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg font-black tracking-tight text-white">
                  Pharma Star <span className="text-teal-400">App Pro</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  EFDA • MoH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Ethiopia's Clinical Pharmacy & Molecular Science Suite
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-teal-300 transition">Features</a>
            <a href="#courses" className="hover:text-teal-300 transition">10 Courses</a>
            <a href="#cpd" className="hover:text-teal-300 transition">EFDA CPD Credits</a>
            <a href="#payments" className="hover:text-teal-300 transition">Telebirr & CBE</a>
            <a href="#developer" className="hover:text-teal-300 transition">Author Dawid</a>
            <a href="#faq" className="hover:text-teal-300 transition">FAQ</a>
            <a 
              href="https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
            >
              <BookMarked className="w-3.5 h-3.5" /> Wiki <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLaunchApp('global_search')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-bold transition shadow cursor-pointer"
              title="Search live FDA/EMA Drug Warnings & Global News with Google Grounding"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span>Global Radar</span>
            </button>

            <CountryCurrencySelector />

            <button
              onClick={onOpenInstallModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Install App</span>
            </button>

            <button
              onClick={() => onLaunchApp('courses')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-500/25 cursor-pointer"
            >
              <span>Open Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Release 2026 • Verified for Ethiopian EFDA & MoH Practice</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Clinical Pharmacy, 3D Molecular MOA & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">EFDA CPD Licensing</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering Ethiopian pharmacists, druggists, interns, and healthcare professionals. Master 10 academic disciplines, renew annual licenses through verifiable CPD certificates, and practice safely with offline point-of-care tools.
            </p>

            {/* Quick credentials & buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onLaunchApp('courses')}
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition shadow-xl shadow-teal-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch Clinical Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchApp('cpd_modules')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/40 font-bold text-sm transition shadow flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-teal-400" />
                <span>{isEthiopia ? 'Enroll in EFDA CPD (200-500 ETB)' : 'Enroll in EFDA CPD ($2.00 - $5.00 USD)'}</span>
              </button>

              <button
                onClick={onOpenSubModal}
                className="px-5 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isEthiopia ? 'Get Pro (1,000 Birr / $10 USD)' : 'Get Pro ($10.00 USD / 1,000 ETB)'}</span>
              </button>
            </div>

            {/* Free entry callout */}
            <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                <span>Instant Demo Login: <strong className="text-white">Pharmastar</strong></span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>CBE: <strong className="text-white font-mono">1000262900367</strong></span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>Telebirr: <strong className="text-white font-mono">0982852778</strong></span>
              </span>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-black text-teal-400">12</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Core Disciplines (+ Biochem & Physio)</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-black text-emerald-400">5 - 15</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">CPD Points per Accredited Module</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-black text-cyan-400">142 MB</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Full Offline Engine (No Internet Required)</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-black text-amber-400">
                {isEthiopia ? '100 ETB' : '$1.00 USD'}
              </div>
              <div className="text-xs text-slate-400 font-semibold mt-1">
                {isEthiopia ? 'Lifetime Pro Access (or $1.00 USD)' : 'Lifetime Pro Access (Worldwide)'}
              </div>
            </div>
          </div>

          {/* Quick-Access Specialized Clinical Suites */}
          <div className="mt-14 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Newly Integrated Clinical & Diagnostic Hubs</span>
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">Specialized Telemedicine, Imaging, DTP & Dermatology</h3>
              </div>
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">Negotiable fees via Chapa & CBE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {/* Card 1: DTP Identifier */}
              <div 
                onClick={() => onLaunchApp('dtp_identifier')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono">Cipolle 7-Category</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Drug Therapy Problem (DTP) Identifier</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Screen inpatient and outpatient regimens for Indication, Effectiveness, Safety, and Adherence issues with automated SOAP workup generator.
                </p>
                <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 pt-1">
                  <span>Audit Patient Regimen</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Clinical Scores */}
              <div 
                onClick={() => onLaunchApp('clinical_calc')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-mono">TIMI / Child-Pugh / Padua</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Medical Diagnostic Scores & Calculators</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculate TIMI Risk (UA/NSTEMI & STEMI), Child-Pugh cirrhosis grading, Padua VTE risk, CURB-65 pneumonia, and CHA2DS2-VASc stroke score.
                </p>
                <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 pt-1">
                  <span>Calculate Risk Score</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Dermatology & Compounding */}
              <div 
                onClick={() => onLaunchApp('dermatology_suite')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">British Pharmacopoeia (BP)</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Dermatology & BP Compounding Suite</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Skin lesion scanner with senior dermatologist oversight, official BP master compounding sheets (Whitfield's, Coal Tar), and Rx provider.
                </p>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                  <span>Interpret Lesions & Compound</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Telemedicine & Telepharmacy */}
              <div 
                onClick={() => onLaunchApp('telemedicine')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded font-mono">Chapa Negotiable</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Telemedicine & Telepharmacy Room</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live encrypted audio/video consultation with clinical pharmacists and doctors, digital e-prescribing, MTM, and flexible fee settlement.
                </p>
                <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 pt-1">
                  <span>Start Virtual Session</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 5: Radiology Interpretation */}
              <div 
                onClick={() => onLaunchApp('radiology_portal')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                    <FileScan className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded font-mono">Scans & PDF</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Radiology Interpretation Portal</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive multi-modality radiology DICOM/PDF reader with contrast/zoom windowing, student teaching cases, and remote patient triage.
                </p>
                <div className="text-[11px] text-violet-400 font-semibold flex items-center gap-1 pt-1">
                  <span>Analyze Scan or PDF</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 6: National Training Manuals */}
              <div 
                onClick={() => onLaunchApp('national_manuals')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono">EFDA & MoH Official</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">National Training Manuals Hub</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Official repository of Ethiopian STG 5th Edition, Good Dispensing Practice (GDP), AMS stewardship, TB/Leprosy, IPLS, and IMNCI.
                </p>
                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 pt-1">
                  <span>Browse National STGs</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 7: Pharmacy Library & Readable Bookshelf */}
              <div 
                onClick={() => onLaunchApp('pharmacy_library')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <BookMarked className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono">3D Bookshelf</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Pharmacy Library &amp; Readable Bookshelf</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive wooden bookshelf with DiPiro 12th Ed, Goodman &amp; Gilman, BP 2024, Stockley&apos;s, and Goldfrank&apos;s with text-to-speech narration.
                </p>
                <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 pt-1">
                  <span>Open Readable Bookshelf</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 8: Universal Drug Compendium & DIS */}
              <div 
                onClick={() => onLaunchApp('medical_advancements')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-mono">Active • Expelled • Pipeline</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Universal Drug Compendium &amp; Advancements</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Everything about drugs (active, expelled forensics, pipeline), breakthrough scenarios (Lenacapavir, BPaLM, Casgevy), and DIS consultation desk.
                </p>
                <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 pt-1">
                  <span>Explore Drug Compendium &amp; DIS</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 9: DAGU 2.0 eLMIS (Ethiopian Standard) */}
              <div 
                onClick={() => onLaunchApp('dagu_elmis')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">EPSS &amp; MoH IPLS</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">DAGU 2.0 eLMIS (Ethiopian Standard)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Facility stockcards, bin cards, 11-column Bimonthly RRF to EPSS Hubs, IFRR dispensary orders, physical count variance, FEFO matrix, and 2°C-8°C cold chain log.
                </p>
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 pt-1">
                  <span>Open DAGU 2.0 Facility Logistics</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 10: Auditable Pharmaceutical Transactions & Ledger */}
              <div 
                onClick={() => onLaunchApp('pharma_transactions')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono">SHA-256 Chained</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition">Auditable Pharma Transactions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cryptographically verified hospital transaction ledger, Model 19 (GRV) receiving, Model 22 (SIV) issuing, batch-level recalls, and compliance printouts.
                </p>
                <div className="text-[11px] text-teal-300 font-semibold flex items-center gap-1 pt-1">
                  <span>Audit Pharmaceutical Ledger</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 11: ABC & VEN Analysis & Facility-Specific Medicine List (DTC) */}
              <div 
                onClick={() => onLaunchApp('abc_ven_analysis')}
                className="group p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl cursor-pointer transition shadow-sm space-y-2 md:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono">DTC 9-Cell Matrix</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition">ABC/VEN Analysis &amp; FSML Master</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pareto 80/20 cumulative spend analysis, Vital/Essential/Non-Essential clinical triage, 9-cell budget matrix, and MoH/DTC Facility-Specific Medicine List PDF dossier.
                </p>
                <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 pt-1">
                  <span>Launch ABC-VEN &amp; FSML Suite</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Deep-Dive Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">Built for Real Clinical Impact</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Integrated Solutions for Healthcare Practice
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Switch between core pillars of Pharma Star App Pro to explore clinical, educational, and regulatory capabilities.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {featureTabs.map((f) => {
            const Icon = f.icon;
            const isActive = activeFeatureTab === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeatureTab(f.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-400'}`} />
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-10">
          {activeFeatureTab === 'international_suite' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    CPIC &bull; WHO AWaRe &bull; USP &bull; IDSA Standards
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Precision Medicine &amp; Clinical PK
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white">
                  World-Class Clinical Pharmacy &amp; Pharmacogenomics
                </h3>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Pharma Star App Pro integrates international clinical decision engines: CPIC Level A pharmacogenomics (CYP2C19, CYP2D6, HLA-B*5701, TPMT), Vancomycin Bayesian AUC24/MIC and Hartford aminoglycoside TDM calculators, WHO AWaRe antibiotic stewardship, Naranjo ADR causality scoring, and 6-language pictographic patient leaflets.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gene-drug action recommendations with FDA black box warning correlation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Quantified Vancomycin AUC24/MIC (400-600) and Winter-Tozer Phenytoin corrections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>FIP-endorsed 6-language patient counseling cards (English, Oromo, Amharic, French, Arabic, Spanish)</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onLaunchApp('international_suite')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Open International Practice Suite</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Clinical Engine Highlights
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300">
                    6 Active Tools
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <span className="font-mono text-teal-400 font-bold text-[10px]">CPIC Pharmacogenomics</span>
                  <h5 className="font-bold text-white">CYP2C19 &bull; Clopidogrel Resistance</h5>
                  <p className="text-slate-400 text-[11px]">Identifies poor metabolizers (*2/*2) and guides immediate substitution to Prasugrel or Ticagrelor.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <span className="font-mono text-amber-400 font-bold text-[10px]">Bayesian Pharmacokinetics</span>
                  <h5 className="font-bold text-white">Vancomycin 24-Hour AUC Calculator</h5>
                  <p className="text-slate-400 text-[11px]">Computes patient-specific elimination rate constant ($k_e$) and AUC24 targeting 400–600 mg·h/L.</p>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'global_search' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    Google Search Grounding Engine
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Real-Time FDA &amp; EMA Intelligence
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white">
                  Real-Time FDA, EMA &amp; WHO Safety Alerts
                </h3>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Never miss critical pharmaceutical alerts. Pharma Star App Pro integrates direct Google Search Grounding to monitor real-time US FDA MedWatch Black Box Warnings, European Medicines Agency (EMA) PRAC pharmacovigilance recalls, WHO counterfeit drug alerts, and global supply deficit reports with verified primary citations.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time Google Grounded search across official health regulatory portals</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Primary regulatory documents and direct web citations extracted on the fly</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Actionable pharmacist triage, batch quarantine directives, and patient counseling notes</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onLaunchApp('global_search')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Launch Global Pharmacy Search</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Live Grounded Radar Preview
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                    Active Grounding
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-amber-400 font-bold">FDA Black Box Warning</span>
                    <span className="text-slate-500">2026 Alert</span>
                  </div>
                  <h5 className="font-bold text-white">Compounded Semaglutide &amp; Multi-Dose Syringe Overdose Warnings</h5>
                  <p className="text-slate-400 text-[11px]">FDA alerts regarding unauthorized salt forms and volume miscalculation on U-100 insulin syringes causing severe hospitalizations.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-teal-400 font-bold">EMA PRAC Notice</span>
                    <span className="text-slate-500">Pharmacovigilance</span>
                  </div>
                  <h5 className="font-bold text-white">Pseudoephedrine Measures on PRES &amp; RCVS Ischemia</h5>
                  <p className="text-slate-400 text-[11px]">Contraindicated in severe or uncontrolled hypertension; stop immediately on sudden thunderclap headache.</p>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'cpd' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    MoH &amp; EFDA Directive No. 49/2022
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    Live Status API &amp; CI Pipeline
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Continuing Professional Development (CPD) &amp; License Cycle Tracking
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  In Ethiopia, practicing pharmacists, druggists, and clinicians are required by the Ministry of Health (MoH) and EFDA to complete accredited CPD units during their active license window for annual re-registration.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Federal Cap Rules Enforced:</strong> 15-CEU maximum single course ceiling, mandatory 5-CEU ethics quota, and 30-CEU total annual threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>No-Rollover Cycle Verification:</strong> Automated live verification endpoint (<code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">/api/users/:userId/cpd-status</code>) tracking active operational dates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Official Verifiable Certificates:</strong> Instant high-resolution printable PDF certificates with tamper-proof QR code hashes and Ministry serials (200 to 500 ETB).</span>
                  </li>
                </ul>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onLaunchApp('cpd_modules')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                  >
                    <Award className="w-4 h-4" />
                    <span>Launch CPD Hub &amp; Status Tracker</span>
                  </button>
                  <span className="text-xs text-slate-400">Pay via Telebirr: <strong>0982852778</strong></span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  <span>Directive No. 49/2022 Cycle Monitor</span>
                  <span className="text-emerald-400 font-mono font-bold">2026 CYCLE ACTIVE</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Annual Quota Progress:</span>
                    <span className="font-mono text-teal-300 font-bold">26 / 30 CEUs (87%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full w-[87%]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Ethics Quota:</span>
                      <span className="font-bold text-emerald-400">6 / 5 CEUs (Met ✓)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Remaining Shortfall:</span>
                      <span className="font-bold text-amber-400">4 CEUs Needed</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ceiling Constraint:</span>
                      <span className="text-slate-300">Max 15 CEU / Activity</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Renewal Status:</span>
                      <span className="font-bold text-teal-300">Audit in Progress</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Validated by automated CI regulatory test pipeline &amp; PostgreSQL persistence.</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'abc_ven' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Hospital DTC Master Suite
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    WHO &amp; MoH Protocol
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  ABC &amp; VEN Spend Analysis &amp; Facility-Specific Medicine List (FSML)
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Equip Hospital Drug and Therapeutics Committees (DTC) with automated Pareto 80/20 spend classification, Vital/Essential/Non-Essential (VEN) clinical triage, and an interactive 9-cell budget matrix ($AV, BV, CV, AE, BE, CE, AN, BN, CN$) to safeguard vital medicines during pharmaceutical budget deficits.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Pareto 80/20 Expenditure Curve:</strong> Real-time ranked cumulative cost engine isolating Category A drivers (70-80% hospital budget).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>9-Cell Strategic Matrix:</strong> Deficit simulator with rational substitution, price re-negotiation, and non-essential deprescribing algorithms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Official DTC Resolution Dossier (Printable PDF):</strong> Complete hospital committee resolution with 4-tier signature blocks (DTC Chair, Chief Pharmacist, Clinical Director, CEO).</span>
                  </li>
                </ul>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onLaunchApp('abc_ven_analysis')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Launch ABC/VEN Analysis &amp; FSML Suite</span>
                  </button>
                  <span className="text-xs text-slate-400">Exportable MoH DTC Resolution Format</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  <span>DTC 9-Cell Matrix Distribution</span>
                  <span className="text-amber-400 font-mono">32 Hospital Pharmaceuticals</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-rose-950/40 border border-rose-500/40 p-2.5 rounded-xl">
                    <div className="font-bold text-rose-300 text-sm">AV (Cat I)</div>
                    <div className="text-[10px] text-slate-400">Vital High Spend</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">45.2% Spend</div>
                  </div>
                  <div className="bg-orange-950/40 border border-orange-500/40 p-2.5 rounded-xl">
                    <div className="font-bold text-orange-300 text-sm">BV (Cat I)</div>
                    <div className="text-[10px] text-slate-400">Vital Mod Spend</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">11.8% Spend</div>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl">
                    <div className="font-bold text-emerald-300 text-sm">CV (Cat I)</div>
                    <div className="text-[10px] text-slate-400">Vital Low Spend</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">3.1% Spend</div>
                  </div>

                  <div className="bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-xl">
                    <div className="font-bold text-amber-300 text-sm">AE (Cat II)</div>
                    <div className="text-[10px] text-slate-400">Essential High</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">26.4% Spend</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="font-bold text-slate-300 text-sm">BE (Cat II)</div>
                    <div className="text-[10px] text-slate-400">Essential Mod</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">6.5% Spend</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="font-bold text-slate-300 text-sm">CE (Cat II)</div>
                    <div className="text-[10px] text-slate-400">Essential Low</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">1.2% Spend</div>
                  </div>

                  <div className="bg-purple-950/40 border border-purple-500/40 p-2.5 rounded-xl">
                    <div className="font-bold text-purple-300 text-sm">AN (Cat III)</div>
                    <div className="text-[10px] text-slate-400">Scrutinize / Cut</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">4.2% Spend</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="font-bold text-slate-300 text-sm">BN (Cat III)</div>
                    <div className="text-[10px] text-slate-400">Scrutinize</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">1.1% Spend</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="font-bold text-slate-300 text-sm">CN (Cat III)</div>
                    <div className="text-[10px] text-slate-400">Non-Essential</div>
                    <div className="text-xs font-mono text-white font-bold mt-1">0.5% Spend</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Priority Tier I (Vitals): Guaranteed 100% Availability</span>
                  <span className="text-emerald-400 font-bold">12 Medicines (60.1%)</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'dtp_interventions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Cipolle, Strand &amp; Morley Standard
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    New Quick Clinical Sharing
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Drug Therapy Problem (DTP) Identifier &amp; Intervention Reports
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Identify, resolve, and prevent medication problems across the 7 standardized pharmaceutical care categories: Unnecessary Drug, Additional Therapy Needed, Ineffective Drug, Dosage Too Low, Adverse Drug Reaction, Dosage Too High, and Non-Adherence.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Quick Export Feature:</strong> Generate clean plain-text clinical handover summaries formatted for rapid sharing across hospital EMRs, WhatsApp/Telegram clinical groups, and morning ward rounds.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Standardized Intervention Report (Printable PDF):</strong> MoH / DTC letterhead structure with SBAR workup, Cipolle table, and Attending Physician disposition checkboxes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Integrated Pharmacist Authentication:</strong> Complete digital verification by Pharmacist Dawid Aliyi, BCPS (EFDA License: EFDA/CLIN/ETH/2026/0491).</span>
                  </li>
                </ul>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onLaunchApp('dtp_identifier')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Open DTP Identifier &amp; Reports</span>
                  </button>
                  <span className="text-xs text-slate-400">Zero-popup in-app printable engine</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  <span>Standardized Clinical Report Preview</span>
                  <span className="text-teal-400 font-mono">CPIR-2026-ETH</span>
                </div>

                <div className="bg-white text-slate-900 rounded-xl p-4 text-xs space-y-2 border border-slate-200 shadow-md">
                  <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center text-[10px] text-teal-800 font-bold uppercase">
                    <span>MoH Ethiopia • Clinical Pharmacy Service</span>
                    <span>Ref: CPIR-2026-ETH-982</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">Patient:</strong> 71yo male • Jimma Medical Center Cardiology Ward
                  </div>
                  <div className="text-[11px] bg-rose-50 border border-rose-200 p-2 rounded text-rose-900">
                    <strong>Critical DTP:</strong> Diclofenac 50mg TID causing acute renal vasoconstriction &amp; heart failure decompensation. Action: Discontinue NSAID immediately; switch to IV Furosemide.
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 text-[10px] text-slate-600 flex justify-between items-center">
                    <span>Physician: [X] Accepted as Recommended</span>
                    <span className="font-semibold text-teal-800">Dawid Aliyi, BCPS</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Share2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Supports 1-click plain text copying and print-to-PDF formatting without popup blockers.</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'telehealth_guidelines' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    MoH Directive 62/2026 &amp; EFDA Standard
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Statutory Telehealth &amp; Telepharmacy</span>
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Ethiopian National Telemedicine &amp; Telepharmacy Guidelines
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Fully operationalized implementation of the Federal Ministry of Health (MoH) and Ethiopian Food and Drug Authority (EFDA) digital clinical practice directives. Connect hospital clinical pharmacists and physicians with rural dispensaries, remote patients, and healthcare extension posts.
                </p>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>MoH Provider Standards:</strong> Active EFDA/MoH clinician licensure verification, pre-encounter patient identification, and recorded digital informed consent.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>EFDA Telepharmacy &amp; e-Rx Rules:</strong> Electronic prescription digital signature verification, strict prohibition of Schedule II/III narcotics via telehealth, and mandatory virtual MTM counseling.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Encrypted &amp; Archival:</strong> Peer-to-peer WebRTC video with zero storage of raw streams and 5-year archival of clinical SOAP notes and intervention records.</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onLaunchApp('telemedicine')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/25"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Virtual Telemedicine Suite</span>
                  </button>
                  <span className="text-xs text-slate-400">Negotiable fee settlement via Chapa &amp; Telebirr</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 pb-2">
                  <span>Directive Compliance Summary</span>
                  <span className="text-teal-400 font-mono">ETH-MOH-DIR-62</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/30 space-y-1">
                    <div className="flex items-center justify-between text-teal-300 font-bold">
                      <span>1. Remote MTM &amp; Dispensing:</span>
                      <span className="text-[10px] bg-teal-500/20 px-2 py-0.5 rounded text-teal-300">Mandatory</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Pharmacist performs drug interaction screening, renal dose adjustments, and live counseling before dispatch.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
                    <div className="flex items-center justify-between text-amber-300 font-bold">
                      <span>2. Controlled Substances Safeguard:</span>
                      <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">Restricted</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Schedule II/III Narcotics require physical triplicate prescription paper; prohibited from automated delivery.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>3. Emergency Referral (Red Flags):</span>
                      <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">STAT Transfer</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Immediate SBAR handover to referral centers (Tikur Anbessa, Jimma, Gondar, Hawassa) for acute emergencies.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'sponsorship_portal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    EFDA Ethical Promotion &amp; Compliance
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    Platinum • Gold • Bronze Non-Gov
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Formal Sponsors Invitation, Non-Government Tiers &amp; Letters History
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Institutional sponsorship architecture tailored for pharmaceutical manufacturers, financial institutions, and Non-Governmental Organizations (NGOs). Includes full compliance auditing (Conflict of Interest declarations, EFDA Directive 49/2022 neutrality, transparent funding disclosures) and automated formal invitation dispatch.
                </p>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-teal-500/40 text-center space-y-1">
                    <span className="text-[10px] text-teal-400 font-bold block uppercase">Platinum Non-Gov</span>
                    <span className="font-mono font-bold text-white text-xs">150,000 ETB</span>
                    <span className="text-[9px] text-slate-400 block">$3,000 USD (500 Licenses)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-center space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block uppercase">Gold Non-Gov</span>
                    <span className="font-mono font-bold text-white text-xs">75,000 ETB</span>
                    <span className="text-[9px] text-slate-400 block">$1,500 USD (250 Licenses)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-center space-y-1">
                    <span className="text-[10px] text-slate-300 font-bold block uppercase">Bronze Non-Gov</span>
                    <span className="font-mono font-bold text-white text-xs">35,000 ETB</span>
                    <span className="text-[9px] text-slate-400 block">$700 USD (100 Licenses)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsSponsorLettersOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Open Admin Letters Directorate &amp; Generator</span>
                  </button>
                  <button
                    onClick={() => onLaunchApp('institutional_sponsor')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Institutional Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 pb-2">
                  <span>Non-Government Compliance &amp; Letters Ledger</span>
                  <span className="text-amber-400 font-mono">DIR-SPON-2026</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/30 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">CHAI Ethiopia (Clinton Health Access)</span>
                      <span className="text-[11px] text-slate-400">Ref: REF: PS/DIR-SPON/2026/101 • Platinum Non-Government</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Partnered
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white">Amref Health Africa - Ethiopia</span>
                      <span className="text-[11px] text-slate-400 block">Ref: REF: PS/DIR-SPON/2026/104 • Gold Non-Government</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Meeting
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white">Ethiopian Red Cross Society &amp; Health Unit</span>
                      <span className="text-[11px] text-slate-400 block">Ref: REF: PS/DIR-SPON/2026/108 • Bronze Non-Government</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Under Review
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>EFDA Ethical Code Certified</span>
                  </span>
                  <span>Author: Pharm. Dawid Aliyi, BCPS</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'courses' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Full Academic Syllabus (12 Disciplines)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Google Gemini AI Tutor</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  12 Comprehensive Pharmaceutical & Basic Science Courses
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Curated according to standard international pharmacy syllabi and Ethiopian university curricula (AAU, Gondar, Jimma, Hawassa, Haramaya). Now includes <strong>Medical Biochemistry</strong> and <strong>Human Physiology</strong> with 100 ETB individual course passes and Gemini AI concept tutoring for every question.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {coursesData.slice(0, 8).map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <BookOpen className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="truncate text-slate-200 font-medium">{c.title}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold shrink-0">100 ETB</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onLaunchApp('courses')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explore All 12 Courses & AI Tutor</span>
                  </button>
                  <span className="text-xs text-slate-400">100 Birr per course via Telebirr: <strong>0982852778</strong></span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Concept Tutoring with Google Gemini</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/30 text-xs space-y-1">
                    <strong className="text-teal-300 block">✨ Medical Biochemistry (BIOCHEM-201):</strong>
                    <span className="text-slate-300">PFK-1 pacemaker kinetics, TCA bioenergetics, HMG-CoA reductase, and UGT1A1 bilirubin conjugation.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/30 text-xs space-y-1">
                    <strong className="text-teal-300 block">✨ Human Physiology (PHYS-202):</strong>
                    <span className="text-slate-300">Nephron segmental NKCC2 transport, countercurrent multiplication, Frank-Starling hemodynamics, and RAAS.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <strong className="text-white block">✨ Google Gemini Assist for Every Question:</strong>
                    <span className="text-slate-400">Breaks down why the correct answer is scientifically true, analyzes distractors, gives real-world hospital correlates, and provides mnemonics.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'store_ifrr' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Hospital & Health Center Logistics
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    100 Birr Site Pass
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Store Stockcard, Bin Card Monitoring & Automated IFRR Requisition
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Engineered specifically for Ethiopian public hospitals, health centers, and pharmacy students during clerkships. Digitize physical paper shelf bin cards into digital folders with OCR, track Average Monthly Consumption (AMC) and Months of Stock (MOS), and automatically generate official Ethiopian Ministry of Health / EPSA IFRR requisition forms.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Optical Bin Card OCR:</strong> Scan physical paper cards directly into facility folders.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Automated IFRR Generator:</strong> Calculates Beginning, Received, Dispensed, AMC, Max stock, and Reorder Quantity.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Email Store Man:</strong> Transmit verified requisitions straight to Central Storekeeper with formal receipts.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onLaunchApp('store_monitor')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Launch Store & Bin Card Monitor</span>
                  </button>
                  <span className="text-xs text-slate-400">100 ETB Pass via Telebirr: <strong>0982852778</strong></span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase flex items-center justify-between">
                  <span>EPSA / MoH Standard IFRR Live Preview</span>
                  <span className="font-mono text-emerald-400">TASH-OPD-2026</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Health Facility:</span>
                    <span className="font-bold text-white">Tikur Anbessa Hospital (OPD Pharmacy)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Dispensary Lead:</span>
                    <span className="text-teal-300 font-semibold">Pharmacist Dawid Aliyi</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Storekeeper Recipient:</span>
                    <span className="text-amber-300 font-mono">storekeeper@hospital.gov.et</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Emergency Stockouts:</span>
                    <span className="text-rose-400 font-bold">Ceftriaxone 1g (Reorder: 250 vials)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'prescriptions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Clinical Audit & Provider Communication
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    2,000 ETB / Year Institution License
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Prescription Review, Specific Sites Healthcare Providers & Institutions Portal
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  A high-yield clinical audit engine for Ethiopian hospital wards and outpatient pharmacies. Screen for organ dosing adjustments (eGFR & Child-Pugh), severe drug-drug interactions, and contraindications. Connect ward pharmacists, attending physicians, and nurses via STAT interprofessional communication channels.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Clinical Prescription Review:</strong> Organ-specific audit with printable SOAP intervention slips.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Specific Sites Collaboration:</strong> Channels tailored for Tikur Anbessa ICU, Adama ER, Hawassa Pediatrics, and SPHMMC Nephrology.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Institutions Communication Portal:</strong> Cross-hospital emergency drug shortage exchange & EFDA circular alerts for <strong>2,000 ETB / Year</strong>.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onLaunchApp('prescription_review')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Launch Prescription & Institutions Portal</span>
                  </button>
                  <span className="text-xs text-slate-400">Institutional pass: <strong>2,000 Birr/year</strong></span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Verified Clinical Audit & Interprofessional Network</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 text-xs space-y-1">
                    <strong className="text-rose-300 block">🚨 Metformin in Stage 4 CKD & Contrast Media:</strong>
                    <span className="text-slate-300">eGFR 24 mL/min flagged for fatal lactic acidosis; auto-recommends Linagliptin 5mg daily.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs space-y-1">
                    <strong className="text-amber-300 block">⚡ STAT Provider Communication:</strong>
                    <span className="text-slate-300">Instant triage between Pharmacist Dawid Aliyi and ER Attending Physicians on Propranolol asthma hold.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs space-y-1">
                    <strong className="text-indigo-300 block">🏥 Inter-Hospital Emergency Drug Exchange:</strong>
                    <span className="text-slate-300">Cross-exchange vasopressors, oxytocin, and tracer antibiotics between referral centers.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'research' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Scientific Publications & Medical Journal
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    1,000 Birr Per Publication
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Research Publishing Portal for Ethiopian Academic & Health Institutions
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Upon request by Ethiopian universities, referral hospitals, and health bureaus, submit and publish original clinical research, antimicrobial resistance surveillance, traditional phytotherapy studies (such as Croton macrostachyus / Bisana), and health logistics evaluations with official DOI indexing.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Verified Institutional Publishing:</strong> AAU, Jimma, Gondar, Hawassa, Haramaya, SPHMMC, EPHI.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>1,000 ETB Affordable Fee:</strong> Telebirr (0982852778) or CBE (1000262900367) with verifiable DOI.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Official Publication Certificate:</strong> Signed by Editor-in-Chief Pharmacist Dawid Aliyi, BCPS.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onLaunchApp('research_publishing')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <BookMarked className="w-4 h-4" />
                    <span>Open Research Publishing Portal</span>
                  </button>
                  <span className="text-xs text-slate-400">1,000 Birr per publication request</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                  <span>Featured Ethiopian Scientific Publications</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/30 text-xs space-y-1">
                    <span className="text-[10px] text-teal-400 font-mono">DOI: 10.5829/pharmastar.2026.01.042</span>
                    <strong className="text-white block">Vancomycin TDM & Nephrotoxicity Outcomes in ICU (TASH)</strong>
                    <span className="text-slate-400">Lead Investigator: Pharmacist Dawid Aliyi, BCPS et al. (AAU CHS).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] text-teal-400 font-mono">DOI: 10.5829/pharmastar.2026.02.019</span>
                    <strong className="text-white block">AMR Profiles & ESBL Uropathogens in Oromia Referral Hospitals</strong>
                    <span className="text-slate-400">Jimma University & Adama Hospital Medical College.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] text-teal-400 font-mono">DOI: 10.5829/pharmastar.2026.03.008</span>
                    <strong className="text-white block">Anti-Hyperglycemic Activity of Bisana (Croton macrostachyus)</strong>
                    <span className="text-slate-400">University of Gondar & Ethiopian Public Health Institute (EPHI).</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'moa3d' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Three.js Molecular Kinetics
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Interactive 3D Macromolecular Drug Targets
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Bridge theoretical pharmacology and molecular reality. Visualize competitive inhibition, lock-and-key receptor kinetics, and active site conformations in real-time 3D WebGL.
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span><strong>GPCR & Beta-Blockers:</strong> Allosteric vs orthosteric binding dynamics.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                    <span><strong>ACE Inhibitors:</strong> Catalytic zinc ion chelation and active-site pocket.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span><strong>Penicillin PBP Transpeptidase:</strong> Irreversible suicide acylation.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span><strong>Liposomal mRNA Nanocarriers:</strong> Lipid nanoparticle cellular endocytosis.</span>
                  </div>
                </div>
                <button
                  onClick={() => onLaunchApp('moa3d')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch 3D Visualizer</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-2xl font-black">
                  3D
                </div>
                <div className="text-base font-bold text-white">WebGL Macromolecular Engine</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Rotate, pan, zoom, and trigger conformational ligand docking inside your browser or mobile phone without downloading bulky external files.
                </p>
                <button
                  onClick={() => onLaunchApp('moa3d')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                >
                  Interact in 3D ➔
                </button>
              </div>
            </div>
          )}

          {activeFeatureTab === 'clinical' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Point-of-Care Clinical Suite
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Drug Interactions, Lab Interpreter & Patient Care Plans
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Prevent adverse drug events and adjust renal doses accurately. Built-in clinical calculators ensure safe dosing for low-GFR patients, pediatric patients, and polypharmacy cases.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>CYP450 Enzyme Interaction Matrix:</strong> CYP3A4, 2D6, 2C9, 2C19 induction & inhibition.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Lab Interpretation:</strong> Cockcroft-Gault CrCl, Corrected Calcium, Anion Gap, AST/ALT.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>SOAP Note Engine:</strong> Subjective, Objective, Assessment, Plan documentation.</span>
                  </li>
                </ul>
                <button
                  onClick={() => onLaunchApp('drug_checker')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Pill className="w-4 h-4" />
                  <span>Check Drug Interactions</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-xs text-slate-400 uppercase font-bold">Clinical Safety Matrix</div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <strong>Severe Contraindication Alert:</strong> Simvastatin + Clarithromycin (CYP3A4 inhibition increases Rhabdomyolysis risk by 10-fold).
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <strong>Renal Clearance Warning:</strong> Metformin contraindicated when eGFR &lt; 30 mL/min due to Lactic Acidosis hazard.
                </div>
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
                  <strong>Pharmacokinetic Adjustment:</strong> Vancomycin trough target: 15–20 mcg/mL in severe MRSA bacteremia.
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'consult' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Direct Clinical Mentorship
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Paid Clinical Pharmacist Consultations & MTM Sessions
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Patients, interns, and junior pharmacists can book 1-on-1 medication therapy management (MTM) reviews, complicated hospital case conferences, and academic thesis mentoring directly with Pharmacist Dawid Aliyi.
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span><strong>Comprehensive Polypharmacy Review:</strong> {isEthiopia ? '350 – 500 ETB' : '$3.50 – $5.00 USD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span><strong>1-on-1 Clinical Case Review:</strong> {isEthiopia ? '500 – 750 ETB' : '$5.00 – $7.50 USD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span><strong>Payment Method:</strong> {isEthiopia ? 'Telebirr 0982852778 or CBE 1000262900367' : 'Credit Card, PayPal or Chapa USD'}</span>
                  </div>
                </div>
                <button
                  onClick={() => onLaunchApp('live_chat')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Live Consultation</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-lg">
                    DA
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Pharmacist Dawid Aliyi</div>
                    <div className="text-xs text-teal-400">Lead Clinical Preceptor & Developer</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">
                  "Safe medication therapy saves lives. Through direct 1-on-1 consultation and peer case reviews, we ensure no clinical error slips through the cracks."
                </p>
                <div className="pt-2 text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  Phone / Telebirr: 0982852778
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'offline' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Zero Connectivity Required
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Autonomous 142MB Offline Database Engine
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Internet blackouts and remote clinic locations should never interrupt medical decisions. Pharma Star App Pro pre-caches complete courses, drug matrices, lab interpreters, and guidelines locally.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>IndexedDB Architecture:</strong> High-speed local client-side querying.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Progressive Web App (PWA):</strong> Installs like a native Android APK or Desktop app.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Sync on Reconnect:</strong> Automatically synchronizes quiz completions and certificates when online.</span>
                  </li>
                </ul>
                <button
                  onClick={onOpenInstallModal}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Install PWA App</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                <WifiOff className="w-12 h-12 text-amber-400 mx-auto" />
                <div className="text-sm font-bold text-white">100% Offline Clinical Assurance</div>
                <div className="text-xs text-slate-400">
                  Tested and verified in rural hospitals in Oromia, Amhara, Tigray, Sidama, Somali, and Southern Ethiopia.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section id="courses" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">10 Stated Disciplines</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Comprehensive Academic Curriculum
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Each discipline includes structured chapters, interactive clinical case studies, 3D molecular links, and assessment quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coursesData.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 transition group hover:shadow-xl hover:shadow-teal-500/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {course.modules.length} Modules
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-teal-400 font-semibold">{course.modules.length * 3} CPD Points ({course.level})</span>
                  <button
                    onClick={() => onLaunchApp('courses')}
                    className="text-white hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Study Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Subscription Gateway Section */}
      <section id="payments" className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Direct Payment Channels</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Seamless Ethiopian &amp; International Payments
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            {isEthiopia 
              ? 'Register your pro account, purchase accredited EFDA CPD certificates, or book a consultation via Telebirr or CBE.' 
              : 'Register your pro account, purchase accredited EFDA CPD certificates, or access clinical tools worldwide via Visa, Mastercard, PayPal, or Chapa.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Channel 1: Telebirr (or International Card if outside Ethiopia) */}
          <div className={`bg-slate-900 border rounded-3xl p-6 relative flex flex-col justify-between shadow-lg ${
            isEthiopia ? 'border-teal-500/40 shadow-teal-500/5' : 'border-slate-800'
          }`}>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-black text-xl">
                📱
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Telebirr Mobile Money</h3>
                <p className="text-xs text-slate-400 mt-1">Instant peer-to-peer verification</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">Telebirr Phone Number:</div>
                <div className="text-lg font-mono font-black text-teal-300">0982852778</div>
                <div className="text-xs text-slate-300 font-medium">Account Name: Pharmacist Dawid Aliyi</div>
              </div>

              <p className="text-xs text-slate-400">
                Send 1,000 ETB for Lifetime Pro Access or 200–500 ETB for an accredited CPD certificate.
              </p>
            </div>

            <div className="space-y-2 mt-6">
              <button
                onClick={() => copyToClipboard('0982852778', 'telebirr')}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {copiedAccount === 'telebirr' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied 0982852778!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Telebirr Number</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenSubModal}
                className="w-full py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Paid via Telebirr? Auto-Register Now</span>
              </button>
            </div>
          </div>

          {/* Channel 2: Commercial Bank of Ethiopia (CBE) */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 relative flex flex-col justify-between shadow-lg shadow-amber-500/5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-xl">
                🏦
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Commercial Bank of Ethiopia</h3>
                <p className="text-xs text-slate-400 mt-1">CBE Mobile Banking &amp; Branch Deposits</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">CBE Account Number:</div>
                <div className="text-base font-mono font-black text-amber-300">1000262900367</div>
                <div className="text-xs text-slate-300 font-medium">Account Name: Dawid Aliyi</div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-400">
                CBE Birr USSD Code: <strong className="text-white font-mono">*847#</strong>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <button
                onClick={() => copyToClipboard('1000262900367', 'cbe')}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {copiedAccount === 'cbe' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied 1000262900367!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy CBE Account</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenSubModal}
                className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Paid via CBE? Auto-Register Now</span>
              </button>
            </div>
          </div>

          {/* Channel 3: International / USD */}
          <div className={`bg-slate-900 border rounded-3xl p-6 relative flex flex-col justify-between shadow-lg ${
            !isEthiopia ? 'border-cyan-500/50 shadow-cyan-500/10 ring-1 ring-cyan-500/30' : 'border-slate-800'
          }`}>
            {!isEthiopia && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                Recommended for your location
              </div>
            )}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xl">
                🌐
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">International &amp; Worldwide</h3>
                <p className="text-xs text-slate-400 mt-1">Visa, Mastercard, PayPal, Apple Pay, Chapa</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">Lifetime Registration:</div>
                <div className="text-lg font-black text-cyan-300">
                  {isEthiopia ? '1,000 ETB / $10.00 USD' : '$10.00 USD (or 1,000 ETB)'}
                </div>
                <div className="text-xs text-slate-400">Global credit/debit cards &amp; PayPal accepted</div>
              </div>

              <p className="text-xs text-slate-400">
                Instantly activated for pharmacists, medical practitioners, and researchers worldwide.
              </p>
            </div>

            <button
              onClick={onOpenSubModal}
              className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow ${
                !isEthiopia 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4 text-current" />
              <span>{isEthiopia ? 'Pay Online with Chapa ($10 USD)' : 'Pay with Card / PayPal ($10.00 USD)'}</span>
            </button>
          </div>
        </div>

        {/* Institutional & Academic Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-6">
          {/* Institutional Subscription Tier */}
          <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Annual Hospital &amp; Organization Pass
                </span>
                <span className="text-xl font-black text-indigo-300">
                  {isEthiopia ? '2,000 ETB / Year' : '$20.00 USD / Year'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Institutions &amp; Specific Sites Communication Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your entire hospital, health center, or university pharmacy department. Includes STAT interprofessional provider channels, regional drug shortage cross-exchange, and EFDA regulatory alerts.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Unlimited Healthcare Providers, Pharmacists &amp; Nurses</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isEthiopia ? 'Telebirr: 0982852778 | CBE: 1000262900367 (Dawid Aliyi)' : 'International Cards, PayPal & Global Invoicing'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onLaunchApp('prescription_review')}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>{isEthiopia ? 'Subscribe Institution (2,000 Birr/Year)' : 'Subscribe Institution ($20.00 USD/Year)'}</span>
            </button>
          </div>

          {/* Research Publishing Tier */}
          <div className="bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Institutional Research Publishing
                </span>
                <span className="text-xl font-black text-teal-300">
                  {isEthiopia ? '1,000 ETB / Paper' : '$10.00 USD / Paper'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Institutions &amp; Global Research Publishing Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish peer-reviewed manuscripts upon request by Ethiopian institutions (AAU, Jimma, Gondar, Hawassa, Haramaya, SPHMMC, EPHI) and international collaborative bodies. Verified DOI assignment and publication certificates.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Official DOI &amp; Indexed in National Medical Journal</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Signed by Editor-in-Chief Pharmacist Dawid Aliyi, BCPS</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onLaunchApp('research_publishing')}
              className="mt-5 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <BookMarked className="w-4 h-4" />
              <span>{isEthiopia ? 'Submit Manuscript (1,000 Birr)' : 'Submit Manuscript ($10.00 USD)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Developer Spotlight & Credential Section */}
      <section id="developer" className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-4xl shadow-2xl shadow-teal-500/30 shrink-0">
                DA
              </div>

              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold border border-teal-500/30">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-400" /> Lead Author & Architect
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white">
                  Pharmacist Dawid Aliyi
                </h3>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Clinical Pharmacist, Health Informatics Specialist, and creator of Pharma Star App Pro. Dedicated to modernizing pharmaceutical practice across Ethiopia through evidence-based technology, offline-first digital clinical tools, and accredited continuing education.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs">
                  <a
                    href="mailto:jaalibiddoo@gmail.com"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>jaalibiddoo@gmail.com</span>
                  </a>

                  <a
                    href="tel:+251982852778"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                    <span>+251 982 852 778</span>
                  </a>

                  <a
                    href="https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <BookMarked className="w-3.5 h-3.5 text-teal-400" />
                    <span>GitHub Repository</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">Got Questions?</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-teal-300 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-teal-400 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-teal-950/30 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Ready to Advance Your Clinical & Pharmaceutical Practice?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join hundreds of Ethiopian pharmacists, druggists, interns, and students elevating healthcare standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onLaunchApp('courses')}
              className="px-8 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition shadow-xl shadow-teal-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Open Pharma Star App Pro</span>
            </button>
            <button
              onClick={onOpenInstallModal}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Install PWA / Android APK</span>
            </button>
          </div>
        </div>
      </section>

      {/* Website Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">Pharma Star App Pro</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Global clinical pharmacy and continuing medical education suite authored by Pharmacist Dawid Aliyi. Operating in ETB for Ethiopia and USD worldwide.
            </p>
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 block mb-1">Country &amp; Currency:</span>
              <CountryCurrencySelector />
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Quick Modules</div>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onLaunchApp('courses')} className="hover:text-teal-300 transition cursor-pointer">10 Core Courses</button></li>
              <li><button onClick={() => onLaunchApp('cpd_modules')} className="hover:text-teal-300 transition cursor-pointer">EFDA / MoH CPD Points</button></li>
              <li><button onClick={() => onLaunchApp('telemedicine')} className="hover:text-teal-300 transition cursor-pointer">Telemedicine &amp; Telepharmacy Room</button></li>
              <li><button onClick={() => setIsSponsorLettersOpen(true)} className="hover:text-amber-300 text-amber-400 font-bold transition cursor-pointer flex items-center gap-1"><Building2 className="w-3 h-3 text-amber-400" /> Sponsor Invitations &amp; Letters History</button></li>
              <li><button onClick={() => onLaunchApp('moa3d')} className="hover:text-teal-300 transition cursor-pointer">3D Molecular MOA Visualizer</button></li>
              <li><button onClick={() => onLaunchApp('drug_checker')} className="hover:text-teal-300 transition cursor-pointer">Drug Interaction Checker</button></li>
              <li><button onClick={() => onLaunchApp('wiki')} className="hover:text-teal-300 transition cursor-pointer">Pharmacy Wiki &amp; Calculators</button></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Payment Details</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Telebirr: <strong className="text-teal-300 font-mono">0982852778</strong> (Dawid Aliyi)</li>
              <li>CBE: <strong className="text-amber-300 font-mono">1000262900367</strong></li>
              <li>CBE Birr: <strong className="text-white font-mono">*847#</strong></li>
              <li>Registration Fee: <strong className="text-white">{isEthiopia ? '1,000 Birr (Telebirr, CBE)' : '$10.00 USD (Cards, PayPal)'}</strong></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Official Repositories</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1.5 transition"
                >
                  <BookMarked className="w-3.5 h-3.5 text-teal-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                  <span>GitHub Wiki Docs</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://jaalibiddoo-spec.github.io/Pharma-Star-app-pro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1.5 transition"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  <span>GitHub Pages Portal</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-slate-500 text-[11px]">
          <div>
            Pharma Star App Pro © {new Date().getFullYear()} Pharmacist Dawid Aliyi. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Aligned with EFDA, MoH, WHO &amp; FIP</span>
            <span>•</span>
            <button onClick={() => setIsSponsorLettersOpen(true)} className="text-amber-400 hover:underline cursor-pointer">
              Admin Sponsor Portal
            </button>
            <span>•</span>
            <button onClick={onOpenDevDownload} className="text-slate-400 hover:text-amber-300 cursor-pointer">
              Download App Package (For Dawid)
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Sponsor Directorate & Letters History Modal */}
      <AdminSponsorLettersModal
        isOpen={isSponsorLettersOpen}
        onClose={() => setIsSponsorLettersOpen(false)}
      />
    </div>
  );
};
