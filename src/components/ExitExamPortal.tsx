import React, { useState } from 'react';
import { 
  GraduationCap, Award, CheckCircle2, AlertCircle, 
  Clock, BookOpen, Sparkles, RefreshCw, Trophy, 
  HelpCircle, ArrowRight, ShieldCheck, CreditCard, 
  Landmark, Phone, Check, Search, Filter, Lock
} from 'lucide-react';
import { ExitExamQuestion, User } from '../types';
import { sampleExitExamQuestions } from '../data/exitExamData';

interface ExitExamPortalProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
}

export const ExitExamPortal: React.FC<ExitExamPortalProps> = ({
  currentUser,
  onUpdateUser
}) => {
  // Check if unlocked (50 Birr payment gate)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('pharmastar_unlocked_exit_exam');
      if (stored) return true;
    } catch (e) {
      // fallback
    }
    return currentUser.unlockedExitExam || currentUser.isPro || false;
  });

  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe' | 'cbeBirr' | 'chapa'>('telebirr');
  const [txRef, setTxRef] = useState('');
  const [activeTab, setActiveTab] = useState<'exam_sim' | 'ngat_prep' | 'domains' | 'study_guide'>('exam_sim');
  
  // Exam simulator state
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  // Filtered questions
  const filteredQuestions = sampleExitExamQuestions.filter(q => {
    if (selectedDomain === 'all') return true;
    if (selectedDomain === 'ngat') return q.domain === 'NGAT Core Aptitude';
    return q.domain === selectedDomain;
  });

  const currentQ = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Handle Answer Selection
  const handleSelectOption = (questionId: string, optionId: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowExplanation(prev => ({ ...prev, [questionId]: true }));
  };

  // Calculate Score
  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctOption) {
        correct += 1;
      }
    });
    return {
      correct,
      total: filteredQuestions.length,
      percentage: Math.round((correct / filteredQuestions.length) * 100)
    };
  };

  // Handle 50 Birr Unlock
  const handleConfirmPayment = () => {
    if (!txRef.trim()) return;

    localStorage.setItem('pharmastar_unlocked_exit_exam', 'true');
    setIsUnlocked(true);
    setIsUnlockModalOpen(false);

    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        unlockedExitExam: true,
        unlockedNgat: true
      });
    }
  };

  // Instant Free Access for Demo / Enrolled Students
  const handleQuickDemoUnlock = () => {
    localStorage.setItem('pharmastar_unlocked_exit_exam', 'true');
    setIsUnlocked(true);
    setIsUnlockModalOpen(false);

    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        unlockedExitExam: true,
        unlockedNgat: true
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-400" />
                Ministry of Education (MoE) & Health Sciences
              </span>
              <span className="text-[11px] text-slate-400">Exit Exam & NGAT Preparation Suite</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Ethiopian Pharmacy Exit Exam & NGAT Portal
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              High-yield question banks, domain-specific mock exams, and rationales strictly aligned with the Ethiopian National Pharmacy Exit Exam Blueprint and NGAT quantitative health reasoning.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isUnlocked ? (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-emerald-300 block">Full Access Unlocked</span>
                  <span className="text-[10px] text-slate-400">50 Birr Course Pass Active</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Exit Exam & NGAT (50 Birr)</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('exam_sim')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'exam_sim'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>Interactive Exit Exam Simulator</span>
            <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">
              {sampleExitExamQuestions.length} Questions
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedDomain('ngat');
              setActiveTab('ngat_prep');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'ngat_prep'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>NGAT Preparation (50 Birr)</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
              Quantitative & Reasoning
            </span>
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'domains'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-teal-300" />
            <span>Exam Blueprint & Weightage</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE EXAM SIMULATOR */}
      {/* ========================================================================= */}
      {(activeTab === 'exam_sim' || activeTab === 'ngat_prep') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question View */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentQ?.domain}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>
              </div>

              <span className="text-[10px] text-teal-400 font-semibold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {currentQ?.difficulty}
              </span>
            </div>

            {/* Question Stem */}
            <div className="text-sm font-semibold text-white leading-relaxed">
              {currentQ?.questionText}
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ?.options.map(opt => {
                const isSelected = userAnswers[currentQ.id] === opt.id;
                const isCorrect = currentQ.correctOption === opt.id;
                const isRevealed = showExplanation[currentQ.id];

                let optionStyles = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700';
                if (isRevealed) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-teal-950/40 border-teal-500 text-white';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-start gap-3 ${optionStyles}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                      isRevealed && isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : isRevealed && isSelected && !isCorrect
                        ? 'bg-rose-500 text-white'
                        : isSelected
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="leading-relaxed mt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Rationale Box (Appears after answer selection) */}
            {showExplanation[currentQ?.id] && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-teal-400">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Clinical Pharmacy & Ethiopian STG Rationale:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {currentQ?.explanation}
                </p>
                <div className="pt-2 border-t border-slate-850 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Guideline Reference: <strong className="text-teal-300">{currentQ?.stgReference}</strong></span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Previous Question
              </button>

              <button
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Scorecard & Question Grid */}
          <div className="lg:col-span-4 space-y-4">
            {/* Scorecard */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Candidate Performance Scorecard</span>
              </h4>

              {(() => {
                const score = calculateScore();
                return (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                    <span className="text-xs text-slate-400 font-bold">Accuracy on Answered Items</span>
                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      {score.percentage}%
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {score.correct} Correct out of {score.total} Questions
                    </span>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      score.percentage >= 70 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {score.percentage >= 70 ? 'Pass (MoE Benchmark Exceeded)' : 'Remediation Review Advised'}
                    </div>
                  </div>
                );
              })()}

              {/* Question Number Palette */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Question Palette</span>
                <div className="grid grid-cols-6 gap-1.5">
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;
                    const isCorrect = userAnswers[q.id] === q.correctOption;

                    let bg = 'bg-slate-950 text-slate-400 border-slate-800';
                    if (isCurrent) {
                      bg = 'bg-teal-600 text-white border-teal-400';
                    } else if (isAnswered) {
                      bg = isCorrect ? 'bg-emerald-950 text-emerald-300 border-emerald-500' : 'bg-rose-950 text-rose-300 border-rose-500';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`p-2 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXAM BLUEPRINT & DOMAINS */}
      {/* ========================================================================= */}
      {activeTab === 'domains' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Ethiopian Pharmacy Exit Exam Blueprint</h3>
          <p className="text-xs text-slate-300">
            Official competency domains and percentage weightage stipulated by the Ministry of Education (MoE) for nationwide graduating pharmacy candidates:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { domain: 'Clinical Pharmacy & Therapeutics', weight: '35%', desc: 'Internal medicine, infectious diseases (HIV, TB, Malaria), cardiovascular pharmacotherapy, renal dosing.' },
              { domain: 'Pharmacology & Toxicology', weight: '25%', desc: 'Receptor pharmacology, CYP450 interactions, toxicology antidotes, mechanism of action.' },
              { domain: 'Pharmaceutics & Biopharmaceutics', weight: '15%', desc: 'Dosage form design, sterile compounding, bioavailability, dissolution kinetics.' },
              { domain: 'Social & Administrative Pharmacy', weight: '15%', desc: 'EPSS logistics, Bin card ledger management, Good Dispensing Practice (GDP), EFDA directives.' },
              { domain: 'Medicinal Chemistry & Phytochemistry', weight: '10%', desc: 'Structure-activity relationships (SAR), traditional Ethiopian medicinal plants and phytotherapy.' }
            ].map(b => (
              <div key={b.domain} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{b.domain}</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                    {b.weight}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 50 Birr Payment Modal */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Unlock Exit Exam & NGAT (50 Birr)</h3>
                <span className="text-[10px] text-slate-400">Complete Board Exam Simulator & Question Bank</span>
              </div>
              <button onClick={() => setIsUnlockModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payment Details */}
            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 text-xs space-y-1">
              <span className="font-bold text-emerald-300 block">Official Accounts (50 Birr Fee):</span>
              <div className="text-slate-300 space-y-0.5 text-[11px]">
                <p>• <strong>Telebirr:</strong> 0982852778 (Dawid Aliyi)</p>
                <p>• <strong>CBE:</strong> 1000262900367 (Dawid Aliyi)</p>
                <p>• <strong>CBE Birr:</strong> *847# (Merchant: 262900)</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Payment Gateway</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="telebirr">Telebirr (0982852778)</option>
                  <option value="cbe">Commercial Bank of Ethiopia (1000262900367)</option>
                  <option value="cbeBirr">CBE Birr (*847#)</option>
                  <option value="chapa">Chapa Unified Payment</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Reference / SMS Code</label>
                <input
                  type="text"
                  placeholder="e.g. TB-EXAM-50-XXXXX"
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
              >
                Confirm Payment & Unlock Exam Suite (50 Birr)
              </button>

              <button
                onClick={handleQuickDemoUnlock}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold cursor-pointer border border-slate-700"
              >
                1-Click Free Entry for Enrolled Students
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
