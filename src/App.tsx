import React, { useState } from 'react';
import { translations } from './data/translations';
import { coursesData } from './data/coursesData';
import { Course, Language, User } from './types';
import { CoursesModule } from './components/CoursesModule';
import { ThreeDVisualizer } from './components/ThreeDVisualizer';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DrugInteractionChecker } from './components/DrugInteractionChecker';
import { LabInterpreter } from './components/LabInterpreter';
import { PatientManagement } from './components/PatientManagement';
import { MedicationTracker } from './components/MedicationTracker';
import { PharmacistChat } from './components/PharmacistChat';
import { GuidelinesModule } from './components/GuidelinesModule';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { DeveloperDownloadModal } from './components/DeveloperDownloadModal';

import { 
  Sparkles, BookOpen, Video, ShieldCheck, Stethoscope, 
  Activity, Users, Pill, Globe, Wifi, WifiOff, HardDrive, 
  KeyRound, CreditCard, Landmark, LogIn, LogOut, CheckCircle2, 
  Menu, X, ChevronRight, MessageSquare, Smartphone, Download, Lock 
} from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<
    'courses' | 'moa3d' | 'drug_checker' | 'lab_interpreter' | 
    'patient_history' | 'med_tracker' | 'live_chat' | 'guidelines'
  >('courses');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User>({
    username: "Pharmastar",
    isPro: false,
    fullName: "Pharmastar Member",
    role: "pharmacist",
    registrationDate: "2026-10-26",
    offlineReady: true
  });

  // Offline Simulation State
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDevDownloadOpen, setIsDevDownloadOpen] = useState(false);
  const [videoModalCourse, setVideoModalCourse] = useState<Course | null>(null);
  const [active3DModelId, setActive3DModelId] = useState<string>("gpcr_beta_blocker");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang] || translations.en;

  const handleOpen3DFromCourse = (modelId?: string) => {
    if (modelId) setActive3DModelId(modelId);
    setActiveTab('moa3d');
  };

  const handleOpenVideo = (course: Course) => {
    setVideoModalCourse(course);
  };

  const handleAuditPatientMedsInChecker = (drugs: string[]) => {
    setActiveTab('drug_checker');
  };

  const handleUpgradeSuccess = (refCode: string) => {
    setCurrentUser(prev => ({
      ...prev,
      isPro: true,
      cbeReference: refCode
    }));
  };

  const navItems = [
    { id: 'courses', label: t.courses, icon: BookOpen },
    { id: 'moa3d', label: t.moa3D, icon: Video },
    { id: 'drug_checker', label: t.drugChecker, icon: Pill },
    { id: 'lab_interpreter', label: t.labInterpretation, icon: Activity },
    { id: 'patient_history', label: t.patientHistory, icon: Users },
    { id: 'med_tracker', label: t.medTracker, icon: Stethoscope },
    { id: 'live_chat', label: t.liveChat, icon: MessageSquare },
    { id: 'guidelines', label: t.guidelines, icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Banner: Free Access Credentials & CBE Payment Notice */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-b border-teal-500/20 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Free Login info */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Free Entry
            </span>
            <span className="text-slate-300">
              Username: <strong className="text-white">Pharmastar</strong> | Password: <span className="font-mono text-teal-300 tracking-wider">••••••••••••••</span> <span className="text-[11px] text-slate-400">(Encrypted)</span>
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-teal-400 hover:underline font-semibold ml-1 cursor-pointer"
            >
              Sign In ➔
            </button>
          </div>

          {/* CBE & Registration Fee info */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">
              Registration: <strong className="text-teal-300">100 Birr</strong> (CBE: <strong className="text-white font-mono">1000262900367</strong> Dawid Aliyi) or <strong className="text-teal-300">$1 USD</strong>
            </span>

            <button
              onClick={() => setIsDevDownloadOpen(true)}
              className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] transition shadow cursor-pointer flex items-center gap-1"
              title="Download standalone app package for Pharmacist Dawid Aliyi"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>Download App (For Dawid)</span>
            </button>

            <button
              onClick={() => setIsSubModalOpen(true)}
              className="px-2.5 py-0.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] transition shadow cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{currentUser.isPro ? 'PRO ACTIVE' : 'Get Pro'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black text-xl">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-black tracking-tight text-white">
                  Pharma Star <span className="text-teal-400">App Pro</span>
                </h1>
                {currentUser.isPro ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    PRO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    FREE TIER
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Clinical Pharmacy & Pharmaceutical Sciences Suite
              </p>
            </div>
          </div>

          {/* Right Controls: Install App, Offline Sync, Language, User Profile */}
          <div className="flex items-center gap-2">
            {/* Install Android App Button */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition shadow cursor-pointer"
              title="Download & Install App on Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Install Android App</span>
              <span className="sm:hidden">Install</span>
            </button>

            {/* Offline Button */}
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isOfflineSimulated
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Manage Offline Database Access"
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Offline DB (142MB)</span>
                </>
              )}
            </button>

            {/* Language Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value as Language)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl pl-8 pr-3 py-1.5 focus:border-teal-500 outline-none cursor-pointer hover:border-slate-600 transition"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ (Amharic)</option>
                <option value="om">Afaan Oromoo</option>
                <option value="fr">Français</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* User Profile / Auth Trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">
                {currentUser.username[0].toUpperCase()}
              </div>
              <span className="font-semibold hidden sm:inline">{currentUser.username}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block border-t border-slate-800/80 bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* Offline Simulation Banner if active */}
        {isOfflineSimulated && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Offline Database Engine Active:</strong> Operating seamlessly without internet connectivity in remote/rural clinic mode. All courses, drug interactions, and clinical guidelines are served from local storage.
              </span>
            </div>
            <button
              onClick={() => setIsOfflineSimulated(false)}
              className="text-xs font-bold underline hover:text-white shrink-0 ml-2 cursor-pointer"
            >
              Disable Simulation
            </button>
          </div>
        )}

        {/* Tab 1: Academic & Professional Courses */}
        {activeTab === 'courses' && (
          <CoursesModule
            onOpenVideo={handleOpenVideo}
            onOpen3D={handleOpen3DFromCourse}
          />
        )}

        {/* Tab 2: 3D MOA & Video Animations */}
        {activeTab === 'moa3d' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      High-Precision Molecular Visualizer
                    </span>
                    <span className="text-xs text-slate-400">Three.js WebGL & Structural Kinetics</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Stated Courses Directed 3D Drug Mechanism Animations
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                    Interact directly with 3D macromolecular targets, ligand docking pockets, suicide enzyme acylation, and nanocarrier drug delivery models.
                  </p>
                </div>
              </div>
            </div>

            <ThreeDVisualizer initialModelId={active3DModelId} />
          </div>
        )}

        {/* Tab 3: Drug Interaction Checker */}
        {activeTab === 'drug_checker' && (
          <DrugInteractionChecker />
        )}

        {/* Tab 4: Laboratory Test Result Interpretation */}
        {activeTab === 'lab_interpreter' && (
          <LabInterpreter />
        )}

        {/* Tab 5: Patient History Management */}
        {activeTab === 'patient_history' && (
          <PatientManagement onCheckInteractions={handleAuditPatientMedsInChecker} />
        )}

        {/* Tab 6: Medication Tracking & Adherence */}
        {activeTab === 'med_tracker' && (
          <MedicationTracker />
        )}

        {/* Tab 7: Pharmacist Live Chat Consultation */}
        {activeTab === 'live_chat' && (
          <PharmacistChat
            isPro={currentUser.isPro}
            onUpgrade={() => setIsSubModalOpen(true)}
          />
        )}

        {/* Tab 8: Live National & International Guidelines */}
        {activeTab === 'guidelines' && (
          <GuidelinesModule />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-bold text-slate-200 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span>Pharma Star App Pro © {new Date().getFullYear()}</span>
              <span className="text-slate-600">•</span>
              <span className="text-teal-400">Developer: Pharmacist Dawid Aliyi</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Supporting Ethiopian EFDA, MoH, WHO, and international clinical guidelines. Developed for students, interns, and healthcare professionals globally.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>Bank: Commercial Bank of Ethiopia <strong className="text-white">1000262900367 (Dawid Aliyi)</strong></span>
            <span className="text-slate-600">•</span>
            <span>Registration: 100 Birr / $1.00 USD</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {videoModalCourse && (
        <VideoPlayerModal
          course={videoModalCourse}
          onClose={() => setVideoModalCourse(null)}
          onLaunch3D={handleOpen3DFromCourse}
        />
      )}

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onOpenProModal={() => setIsSubModalOpen(true)}
      />

      <OfflineManagerModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        isSimulatingOffline={isOfflineSimulated}
        onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
        isPro={currentUser.isPro}
        onOpenProModal={() => setIsSubModalOpen(true)}
      />

      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <DeveloperDownloadModal
        isOpen={isDevDownloadOpen}
        onClose={() => setIsDevDownloadOpen(false)}
      />
    </div>
  );
}
