import React, { useState } from 'react';
import { 
  Sparkles, Building2, Users, CheckCircle2, Share2, 
  Send, Copy, Check, ExternalLink, ShieldCheck, 
  BookOpen, Calculator, Store, GraduationCap, X, 
  Layers, MapPin, HeartHandshake, Award
} from 'lucide-react';
import { User } from '../types';

interface AutoRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNavigateTab?: (tab: any) => void;
}

interface MatchRecommendation {
  id: string;
  targetAudience: string;
  institutionType: string;
  matchScore: number;
  headline: string;
  description: string;
  recommendedFeatures: { name: string; tag: string; tabId?: string }[];
  complianceStandard: string;
}

export const AutoRecommendationModal: React.FC<AutoRecommendationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateTab
}) => {
  const [selectedProfileType, setSelectedProfileType] = useState<'individual' | 'organization'>('individual');
  const [selectedRole, setSelectedRole] = useState<'pharmacist' | 'student' | 'wholesaler' | 'hospital' | 'university'>('pharmacist');
  const [copiedLink, setCopiedLink] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const recommendations: Record<string, MatchRecommendation> = {
    pharmacist: {
      id: 'rec-pharmacist',
      targetAudience: 'Hospital & Clinical Pharmacists',
      institutionType: 'Referral & District Hospitals, Outpatient Dispensaries',
      matchScore: 99,
      headline: 'Automated Prescription Audit & Bedside Clinical Calculators',
      description: 'Pharma Star automatically flags renal dose adjustments, high-risk DDIs, contraindications (Asthma + Beta-blockers, PUD + NSAIDs), and plots patient longitudinal lab trends with Recharts.',
      recommendedFeatures: [
        { name: 'Automated Prescription Audit Tool', tag: 'High-Alert DDI Engine', tabId: 'prescription_review' },
        { name: 'Clinical Calculator (CrCl / BMI / IV Drip)', tag: 'Cockcroft-Gault', tabId: 'clinical_calc' },
        { name: 'Patient Health Dashboard & Lab Trends', tag: 'Diagnostic Recharts', tabId: 'patient_history' },
        { name: 'MoH/EFDA CPD Accredited Hours', tag: 'Continuing Education', tabId: 'cpd_modules' }
      ],
      complianceStandard: 'Ethiopian MoH / EFDA Good Hospital Pharmacy Practice & WHO Standards'
    },
    student: {
      id: 'rec-student',
      targetAudience: 'Pharmacy Undergraduates & NGAT Candidates',
      institutionType: 'Ethiopian Universities (AAU, Jimma, Gondar, Haramaya, Hawassa)',
      matchScore: 98,
      headline: 'National Exit Exam Simulator (50 Birr) & Recognized Textbooks',
      description: 'Complete blueprint-aligned mock exam engine covering 6 core domains with timed exam simulations, Ethiopian STG citations, and international reference reading materials.',
      recommendedFeatures: [
        { name: 'Exit Exam & NGAT Preparation (50 Birr)', tag: 'Exam Simulator', tabId: 'exit_exam' },
        { name: '12 Comprehensive Academic Courses', tag: 'Free Year 3 Pharmacology', tabId: 'courses' },
        { name: '3D Receptor & Molecular Animations', tag: 'WebGL Simulation', tabId: 'moa3d' },
        { name: 'National & International Textbooks (FIP/EPA)', tag: 'Recognized Curricula', tabId: 'courses' }
      ],
      complianceStandard: 'Ministry of Education National Exit Exam Blueprint & FIP Competency Model'
    },
    wholesaler: {
      id: 'rec-wholesaler',
      targetAudience: 'Pharmaceutical Wholesalers, Importers & Distributors',
      institutionType: 'B2B Medical Supply Chains & Regional Distributors',
      matchScore: 97,
      headline: 'Wholesaler Inventory Portal & Direct Client Communication',
      description: 'List wholesale pharmaceutical stock, update available quantities instantly, receive direct client purchase inquiries, with an affordable 500 Birr quarterly subscription.',
      recommendedFeatures: [
        { name: 'B2B Wholesaler Inventory Portal', tag: '500 Birr / 3 Months', tabId: 'wholesaler_portal' },
        { name: 'Client-to-Wholesaler Messaging', tag: 'Direct Procurement', tabId: 'wholesaler_portal' },
        { name: 'EPSS Regional Logistics Hub Map', tag: 'Distribution Hubs', tabId: 'epss_logistics' },
        { name: 'Anti-Counterfeit Barcode Scanner', tag: 'EFDA Compliance', tabId: 'anti_counterfeit' }
      ],
      complianceStandard: 'EFDA Good Distribution Practice (GDP) & B2B Inventory Guidelines'
    },
    hospital: {
      id: 'rec-hospital',
      targetAudience: 'Hospital Directors, Chief Pharmacists & Health Centers',
      institutionType: 'Tertiary Hospitals, Specialized Clinics & Primary Care Units',
      matchScore: 96,
      headline: 'Institutional Multi-Seat Subscriptions & Drug Shortage Network',
      description: 'Equip an entire clinical department with audit automation, hospital stockcard/bin card tracking (IFRR dispatch), and inter-hospital stock exchange for 2,000 Birr annually.',
      recommendedFeatures: [
        { name: 'Prescription & Institution Portal', tag: 'Multi-User Site Access', tabId: 'prescription_review' },
        { name: 'Stockcard & Bin Card Monitoring (IFRR)', tag: 'Supply Logistics', tabId: 'store_monitor' },
        { name: 'Inter-Hospital Drug Shortage Exchange', tag: 'Emergency Pooling', tabId: 'prescription_review' },
        { name: 'Offline Dispensary Database Mode', tag: 'Remote Resilience', tabId: 'prescription_review' }
      ],
      complianceStandard: 'Ethiopian Essential Medicines Supply Chain & EFDA Regulatory Circulars'
    },
    university: {
      id: 'rec-university',
      targetAudience: 'Pharmacy Faculty Deans, Instructors & Academic Departments',
      institutionType: 'Higher Education Health Science Colleges',
      matchScore: 99,
      headline: 'Research Publishing Portal & Standardized Medical Curricula',
      description: 'Peer-reviewed research manuscript submission, institutional circulars distribution, and accredited course modules with Google Gemini AI question tutoring.',
      recommendedFeatures: [
        { name: 'Research Publishing Portal', tag: 'DOI & Peer Review', tabId: 'research_publishing' },
        { name: 'Recognized Textbooks (FIP / ASHP / ACCP / EPA)', tag: 'Curriculum Syllabi', tabId: 'courses' },
        { name: 'Exit Exam Question Bank & Mock Sessions', tag: 'Formative Assessment', tabId: 'exit_exam' },
        { name: 'Doc-to-PPT Slide Deck Generator', tag: 'Lecture Prep', tabId: 'doc_to_ppt' }
      ],
      complianceStandard: 'Higher Education Relevance and Quality Agency (HERQA) & FIP Academic Section'
    }
  };

  const activeRec = recommendations[selectedRole] || recommendations.pharmacist;

  const appShareUrl = `https://pharmastar.et?rec=${selectedRole}&ref=${currentUser.username}`;
  const shareMessage = `🌟 Highly Recommended for ${activeRec.targetAudience} & ${activeRec.institutionType}: Check out Pharma Star App Pro! Features include ${activeRec.headline}, full EFDA/MoH alignment, and offline clinical support. Explore here: ${appShareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Auto-Recommendation & Institutional Match Engine</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Targeted Configuration
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Matches individuals and organizations with the exact clinical, diagnostic, and commercial modules they require
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold">Select Profile Type:</span>
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedRole('pharmacist')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'pharmacist' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clinical Pharmacist
              </button>
              <button
                onClick={() => setSelectedRole('student')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'student' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pharmacy Student (Exit/NGAT)
              </button>
              <button
                onClick={() => setSelectedRole('wholesaler')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'wholesaler' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wholesaler / Importer
              </button>
              <button
                onClick={() => setSelectedRole('hospital')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'hospital' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hospital / Clinic
              </button>
              <button
                onClick={() => setSelectedRole('university')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'university' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                University Faculty
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Match Compatibility: {activeRec.matchScore}%</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 flex-1">
          {/* Recommendation Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/30 p-5 rounded-2xl border border-teal-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Recommended for: {activeRec.targetAudience}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{activeRec.headline}</h4>
              </div>
              <span className="text-[11px] text-slate-400 self-start sm:self-auto bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {activeRec.institutionType}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeRec.description}
            </p>

            {/* Recommended Feature Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                Tailored Feature Suite & Ready Configuration:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeRec.recommendedFeatures.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (f.tabId && onNavigateTab) {
                        onNavigateTab(f.tabId);
                        onClose();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/60 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-white group-hover:text-teal-300 transition text-xs block">
                        {f.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{f.tag}</span>
                    </div>
                    <span className="text-teal-400 text-[11px] font-bold group-hover:translate-x-1 transition">➔</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Badge */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accreditation & Standards: <strong className="text-slate-200">{activeRec.complianceStandard}</strong></span>
            </div>
          </div>

          {/* Social Recommendation & Invite Links */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> Auto-Recommend & Share with Peers & Organizations
              </span>
              {broadcastSent && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Recommendation broadcast simulated!
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Send this personalized configuration recommendation to colleagues, classmates, hospital committees, or supplier partners:
            </p>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-teal-300 break-all select-all">
              {shareMessage}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Invitation!' : 'Copy Shareable Link'}</span>
              </button>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(appShareUrl)}&text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share via Telegram</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={handleSendBroadcast}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Network Broadcast</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Auto-Matching Powered by Pharma Star Institutional Directory
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
