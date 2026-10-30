import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Award, Video, ShieldCheck, Stethoscope, 
  Activity, Users, Pill, Globe, Wifi, WifiOff, HardDrive, 
  KeyRound, CreditCard, Landmark, CheckCircle2, 
  ChevronRight, MessageSquare, Smartphone, Download, Lock,
  Building2, BookMarked, ExternalLink, ArrowRight, Star, 
  HelpCircle, Copy, Check, HeartHandshake, PhoneCall, Mail,
  Layers, Cpu, Play, Search, GraduationCap, ShieldAlert, Zap,
  FileCheck2
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { Language, User } from '../types';

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
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'cpd' | 'courses' | 'store_ifrr' | 'prescriptions' | 'research' | 'moa3d' | 'clinical' | 'consult' | 'offline'>('cpd');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const featureTabs = [
    { id: 'cpd', title: 'EFDA CPD Credits', icon: Award, subtitle: 'Accredited annual license renewal' },
    { id: 'courses', title: '12 Courses + Gemini AI', icon: BookOpen, subtitle: 'First course free for everyone!' },
    { id: 'prescriptions', title: 'Prescription Review & Institutions', icon: FileCheck2, subtitle: '2,000 ETB/yr site network' },
    { id: 'research', title: 'Research Publishing', icon: BookMarked, subtitle: '1,000 ETB for institutions' },
    { id: 'store_ifrr', title: 'Hospital Store & IFRR', icon: Building2, subtitle: 'Bin cards & email store man' },
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
      a: 'We support all major Ethiopian domestic payment channels: Telebirr (0982852778 - Dawid Aliyi), Commercial Bank of Ethiopia (CBE account: 1000262900367 - Dawid Aliyi), and CBE Birr (*847#). For international professionals and members of the Ethiopian diaspora, secure payments in USD ($1.00 USD) and Chapa are supported.'
    },
    {
      q: 'Can Pharma Star App Pro run in rural health centers without internet access?',
      a: 'Yes! The entire application is built with a standalone 142MB Offline Database Engine utilizing browser IndexedDB, LocalStorage, and Progressive Web App (PWA) service workers. All 10 courses, drug interaction matrices, laboratory calculation algorithms, and guidelines work 100% offline in remote hospital wards and rural dispensaries.'
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
                <span>Auto-Register (100 Birr)</span>
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
                <span>Enroll in EFDA CPD (200-500 ETB)</span>
              </button>

              <button
                onClick={onOpenSubModal}
                className="px-5 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Get Pro (100 Birr / $1)</span>
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
              <div className="text-2xl md:text-3xl font-black text-amber-400">100 ETB</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Lifetime Pro Access (or $1.00 USD)</div>
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
          {activeFeatureTab === 'cpd' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  MoH & EFDA Annual License Renewal
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Continuing Professional Development (CPD) Credit Modules & Certificates
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  In Ethiopia and across Africa, practicing pharmacists and druggists are required by the Ministry of Health (MoH) and EFDA to earn CPD points to renew their annual practicing licenses.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>10 Accredited Modules:</strong> Pharmacotherapy, Clinical Toxicology, Biopharmaceutics, Pharmacokinetics, and more.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Comprehensive End-of-Module Quiz:</strong> 10 rigorous clinical scenario questions (80% pass score required).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Verifiable PDF Certificates:</strong> Embedded unique serial numbers & QR verification codes (200 to 500 ETB per certificate).</span>
                  </li>
                </ul>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onLaunchApp('cpd_modules')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Go to CPD Hub</span>
                  </button>
                  <span className="text-xs text-slate-400">Pay via Telebirr: <strong>0982852778</strong></span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Live Certificate Preview</div>
                <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 border border-teal-500/30 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="font-bold text-white text-sm">ETHIOPIAN HEALTHCARE ACCREDITATION</div>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">15 CPD PTS</span>
                  </div>
                  <div className="text-xs text-slate-300">This certifies that the candidate has completed:</div>
                  <div className="text-sm font-bold text-teal-300">Advanced Pharmacotherapy & Patient-Centered Care</div>
                  <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                    <span>Accreditor: MoH / EFDA Aligned</span>
                    <span className="font-mono text-amber-300">EFDA-CPD-2026-9812</span>
                  </div>
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
                    <span><strong>Comprehensive Polypharmacy Review:</strong> 350 – 500 ETB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span><strong>1-on-1 Clinical Case Review:</strong> 500 – 750 ETB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span><strong>Direct Telebirr Payment:</strong> <span className="font-mono font-bold text-teal-300">0982852778</span> (Dawid Aliyi)</span>
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
            Seamless Ethiopian & International Payments
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Register your pro account, purchase accredited EFDA CPD certificates, or book a consultation via Telebirr or CBE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Channel 1: Telebirr */}
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 relative flex flex-col justify-between shadow-lg shadow-teal-500/5">
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
                Send 100 ETB for Lifetime Pro Access or 200–500 ETB for an accredited CPD certificate.
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
                <p className="text-xs text-slate-400 mt-1">CBE Mobile Banking & Branch Deposits</p>
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xl">
                🌐
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">International & Diaspora</h3>
                <p className="text-xs text-slate-400 mt-1">Credit Card, Chapa, PayPal</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">Lifetime Registration:</div>
                <div className="text-lg font-black text-cyan-300">$1.00 USD</div>
                <div className="text-xs text-slate-400">Global debit/credit cards accepted</div>
              </div>

              <p className="text-xs text-slate-400">
                Instantly activated for pharmacists, preceptors, and diaspora members worldwide.
              </p>
            </div>

            <button
              onClick={onOpenSubModal}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Pay Online ($1 USD)</span>
            </button>
          </div>
        </div>

        {/* Institutional & Academic Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-6">
          {/* Institutional Subscription Tier: 2,000 ETB / Year */}
          <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Annual Hospital & Organization Pass
                </span>
                <span className="text-xl font-black text-indigo-300">2,000 ETB / Year</span>
              </div>
              <h3 className="text-lg font-bold text-white">Institutions & Specific Sites Communication Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your entire hospital, health center, or university pharmacy department. Includes STAT interprofessional provider channels, regional drug shortage cross-exchange, and EFDA regulatory alerts.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Unlimited Healthcare Providers, Pharmacists & Nurses</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Telebirr: <strong>0982852778</strong> | CBE: <strong>1000262900367</strong> (Dawid Aliyi)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onLaunchApp('prescription_review')}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Subscribe Institution (2,000 Birr/Year)</span>
            </button>
          </div>

          {/* Research Publishing Tier: 1,000 ETB */}
          <div className="bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Institutional Research Publishing
                </span>
                <span className="text-xl font-black text-teal-300">1,000 ETB / Paper</span>
              </div>
              <h3 className="text-lg font-bold text-white">Ethiopian Institutions Research Publishing Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish peer-reviewed manuscripts upon request by Ethiopian institutions (AAU, Jimma, Gondar, Hawassa, Haramaya, SPHMMC, EPHI). Verified DOI assignment and publication certificates.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Official DOI & Indexed in National Medical Journal</span>
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
              <span>Submit Manuscript (1,000 Birr)</span>
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
              Ethiopia's premier evidence-based clinical pharmacy and continuing education suite. Designed and authored by Pharmacist Dawid Aliyi.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Quick Modules</div>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onLaunchApp('courses')} className="hover:text-teal-300 transition cursor-pointer">10 Core Courses</button></li>
              <li><button onClick={() => onLaunchApp('cpd_modules')} className="hover:text-teal-300 transition cursor-pointer">EFDA / MoH CPD Points</button></li>
              <li><button onClick={() => onLaunchApp('moa3d')} className="hover:text-teal-300 transition cursor-pointer">3D Molecular MOA Visualizer</button></li>
              <li><button onClick={() => onLaunchApp('drug_checker')} className="hover:text-teal-300 transition cursor-pointer">Drug Interaction Checker</button></li>
              <li><button onClick={() => onLaunchApp('wiki')} className="hover:text-teal-300 transition cursor-pointer">Pharmacy Wiki & Calculators</button></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Payment Details</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Telebirr: <strong className="text-teal-300 font-mono">0982852778</strong> (Dawid Aliyi)</li>
              <li>CBE: <strong className="text-amber-300 font-mono">1000262900367</strong></li>
              <li>CBE Birr: <strong className="text-white font-mono">*847#</strong></li>
              <li>Registration Fee: <strong className="text-white">100 Birr / $1.00 USD</strong></li>
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
            <span>Aligned with EFDA, MoH, WHO & FIP</span>
            <span>•</span>
            <button onClick={onOpenDevDownload} className="text-slate-400 hover:text-amber-300 cursor-pointer">
              Download App Package (For Dawid)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
