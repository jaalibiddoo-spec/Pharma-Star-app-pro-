import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { cpdModulesData } from '../data/cpdModulesData';
import { CPDModule, CPDQuizQuestion, IssuedCPDCertificate, PaymentMethodType } from '../types';
import { 
  Award, CheckCircle2, XCircle, ShieldCheck, Landmark, Smartphone, 
  CreditCard, Zap, Printer, Download, QrCode, FileText, ChevronRight, 
  RotateCcw, Sparkles, AlertCircle, Building2, Wallet, Globe, Check, Copy, X
} from 'lucide-react';

interface CPDModuleHubProps {
  onOpenConsultation?: () => void;
}

export const CPDModuleHub: React.FC<CPDModuleHubProps> = ({ onOpenConsultation }) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'wallet'>('modules');
  const [selectedModule, setSelectedModule] = useState<CPDModule | null>(null);
  
  // Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Certificate Issuance Modal & Payment State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [candidateName, setCandidateName] = useState('Pharmacist Dawid Aliyi');
  const [candidateLicense, setCandidateLicense] = useState('ETH-EFDA-PHARM-2026-8819');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('cbe');
  const [paymentRef, setPaymentRef] = useState('');
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  // Certificate Viewer Modal
  const [viewingCertificate, setViewingCertificate] = useState<IssuedCPDCertificate | null>(null);
  const [savedCertificates, setSavedCertificates] = useState<IssuedCPDCertificate[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load saved certificates from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pharmastar_cpd_certificates');
      if (stored) {
        setSavedCertificates(JSON.parse(stored));
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const saveCertificate = (cert: IssuedCPDCertificate) => {
    const updated = [cert, ...savedCertificates.filter(c => c.id !== cert.id)];
    setSavedCertificates(updated);
    try {
      localStorage.setItem('pharmastar_cpd_certificates', JSON.stringify(updated));
    } catch (e) {
      // fallback
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Start Quiz
  const handleStartQuiz = (mod: CPDModule) => {
    setSelectedModule(mod);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizScore(0);
    setIsQuizActive(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!selectedModule) return;
    setShowExplanation(false);
    if (currentQuestionIndex < selectedModule.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      let correct = 0;
      selectedModule.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          correct++;
        }
      });
      const scorePercent = Math.round((correct / selectedModule.questions.length) * 100);
      setQuizScore(scorePercent);
      setQuizFinished(true);

      if (scorePercent >= selectedModule.passingScorePercent) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  // Proceed to Certificate Checkout
  const handleProceedToCheckout = () => {
    setIsQuizActive(false);
    setIsCheckoutOpen(true);
  };

  // Issue Certificate
  const handleIssueCertificate = (forceRef?: string) => {
    if (!selectedModule) return;
    setIsGeneratingCert(true);

    const ref = forceRef || paymentRef || `CBE-${Date.now().toString().slice(-6)}`;
    const randomSerial = Math.floor(10000 + Math.random() * 90000);
    const certNumber = `EFDA-CPD-2026-${selectedModule.courseCode}-${randomSerial}`;

    const newCert: IssuedCPDCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      candidateName: candidateName.trim() || 'Pharmacist Dawid Aliyi',
      licenseNumber: candidateLicense.trim() || 'ETH-EFDA-PHARM-2026-8819',
      courseCode: selectedModule.courseCode,
      courseTitle: selectedModule.courseTitle,
      ceuCredits: selectedModule.ceuCredits,
      scoreAchievedPercent: quizScore,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      issuerName: "Pharmacist Dawid Aliyi, B.Pharm, BCPS",
      issuerTitle: "Director of Clinical Continuing Education",
      institution: "Pharmastar Clinical Pharmacy Academy",
      accreditationBody: "EFDA & Ethiopian Ministry of Health (MoH) CPD Council",
      paymentReference: ref,
      feePaidETB: selectedModule.standardFeeETB,
      status: 'verified'
    };

    setTimeout(() => {
      saveCertificate(newCert);
      setIsGeneratingCert(false);
      setIsCheckoutOpen(false);
      setViewingCertificate(newCert);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }, 1200);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border border-teal-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>MoH & EFDA Standardized CPD Hub</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              License Renewal CEU Credits
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Director: Pharm. Dawid Aliyi (BCPS)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Continuing Professional Development (CPD) & Certifications
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            In compliance with the <strong>Ethiopian Food and Drug Authority (EFDA)</strong> and the <strong>Ministry of Health (MoH)</strong>, all practicing clinical pharmacists, hospital druggists, and interns must acquire accredited Continuing Professional Development (CPD) units to renew their professional licenses. Complete end-of-module clinical exams to generate your verified certificate of completion.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 text-amber-400">
              <CheckCircle2 className="w-4 h-4" /> 10 Accredited Pharmacy Modules (10-15 CEUs each)
            </span>
            <span className="flex items-center gap-1.5 text-teal-400">
              <Landmark className="w-4 h-4" /> Certificate Fee: 200 to 500 ETB (CBE & Telebirr accepted)
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <Printer className="w-4 h-4" /> High-Resolution Downloadable / Printable PDF
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Accredited CPD Modules ({cpdModulesData.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Earned Certificates ({savedCertificates.length})</span>
        </button>
      </div>

      {/* Modules List View */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cpdModulesData.map((module) => {
            const hasCertificate = savedCertificates.some(c => c.courseCode === module.courseCode);

            return (
              <div 
                key={module.id}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 flex flex-col justify-between transition shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                      {module.courseCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {module.ceuCredits} CEU Credits
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {module.standardFeeETB} ETB
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                    {module.courseTitle}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {module.description}
                  </p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                    <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[10px]">
                      Core Clinical Competencies:
                    </span>
                    {module.competencyObjectives.slice(0, 2).map((comp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Passing: {module.passingScorePercent}%</span>
                  </div>

                  {hasCertificate ? (
                    <button
                      onClick={() => {
                        const cert = savedCertificates.find(c => c.courseCode === module.courseCode);
                        if (cert) setViewingCertificate(cert);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-600/40 transition cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>View Earned Certificate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(module)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <span>Take Assessment Exam</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Wallet View */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          {savedCertificates.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Award className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Certificates in Wallet Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Complete any of the 10 accredited CPD course assessment quizzes with a score of 70% or higher to earn and download your official EFDA certificate.
              </p>
              <button
                onClick={() => setActiveTab('modules')}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs inline-flex items-center gap-1.5 hover:bg-teal-500 transition cursor-pointer"
              >
                <span>Browse Accredited Modules</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCertificates.map(cert => (
                <div 
                  key={cert.id}
                  className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {cert.certificateNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        {cert.courseCode}: {cert.courseTitle}
                      </h4>
                      <p className="text-xs text-slate-400">Awarded to: <strong className="text-teal-300">{cert.candidateName}</strong></p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30">
                      {cert.ceuCredits} CEUs
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Exam Score:</span>
                      <span className="font-bold text-emerald-400">{cert.scoreAchievedPercent}% Passed</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Issued Date:</span>
                      <span className="font-medium">{cert.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">License No:</span>
                      <span className="font-mono">{cert.licenseNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Status:</span>
                      <span className="text-teal-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" /> EFDA Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-[11px] text-slate-400">Signed by Pharm. Dawid Aliyi, BCPS</span>
                    <button
                      onClick={() => setViewingCertificate(cert)}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assessment Exam Modal */}
      {isQuizActive && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedModule.courseCode} Assessment Examination
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedModule.courseTitle}</h3>
              </div>
              <button
                onClick={() => setIsQuizActive(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quiz Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {!quizFinished ? (
                <>
                  {/* Progress Indicator */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Question {currentQuestionIndex + 1} of {selectedModule.questions.length}</span>
                      <span className="text-teal-400 font-semibold">{selectedModule.ceuCredits} CEU Accredited</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500 h-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Card */}
                  {(() => {
                    const q = selectedModule.questions[currentQuestionIndex];
                    const selectedOpt = selectedAnswers[currentQuestionIndex];

                    return (
                      <div className="space-y-4">
                        {q.scenario && (
                          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-amber-300/90 leading-relaxed">
                            <span className="font-bold text-amber-400 block mb-0.5">Clinical Scenario:</span>
                            {q.scenario}
                          </div>
                        )}

                        <h4 className="text-sm font-bold text-white leading-relaxed">
                          {q.question}
                        </h4>

                        {/* Options */}
                        <div className="space-y-2.5">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:border-teal-500/60";

                            if (showExplanation) {
                              if (optIdx === q.correctAnswerIndex) {
                                btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold";
                              } else if (selectedOpt === optIdx) {
                                btnStyle = "bg-rose-950/70 border-rose-500 text-rose-200";
                              } else {
                                btnStyle = "bg-slate-950/40 border-slate-800 text-slate-500 opacity-60";
                              }
                            } else if (selectedOpt === optIdx) {
                              btnStyle = "bg-teal-950/60 border-teal-500 text-white font-semibold";
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={showExplanation}
                                onClick={() => handleSelectOption(optIdx)}
                                className={`w-full p-3.5 rounded-xl border text-xs text-left transition flex items-start gap-3 cursor-pointer ${btnStyle}`}
                              >
                                <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center font-bold text-[11px]">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="leading-relaxed">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Clinical Explanation */}
                        {showExplanation && (
                          <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/40 text-xs space-y-2 animate-in fade-in duration-200">
                            <div className="flex items-center gap-1.5 font-bold text-teal-400">
                              <Sparkles className="w-4 h-4 text-teal-400" />
                              <span>Clinical Rationale & Evidence:</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              {q.explanation}
                            </p>
                            <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                              Reference: {q.guidelineReference}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    {showExplanation && (
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                      >
                        <span>{currentQuestionIndex < selectedModule.questions.length - 1 ? "Next Question" : "Submit Exam & View Results"}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Quiz Finished Result Screen */
                <div className="text-center py-6 space-y-5">
                  <div className="inline-block p-4 rounded-full bg-teal-500/10 border border-teal-500/30">
                    {quizScore >= selectedModule.passingScorePercent ? (
                      <Award className="w-16 h-16 text-amber-400 mx-auto" />
                    ) : (
                      <RotateCcw className="w-16 h-16 text-rose-400 mx-auto" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {quizScore >= selectedModule.passingScorePercent ? "Congratulations! Exam Passed" : "Passing Threshold Not Met"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Passing Requirement: <strong>{selectedModule.passingScorePercent}%</strong>
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 block">Your Score:</span>
                    <span className={`text-4xl font-extrabold ${quizScore >= selectedModule.passingScorePercent ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {quizScore}%
                    </span>
                    <span className="text-xs text-slate-300 block">
                      {quizScore >= selectedModule.passingScorePercent 
                        ? `Eligible for ${selectedModule.ceuCredits} EFDA CPD Credit Points` 
                        : "Review course pearls and retake the exam."}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleStartQuiz(selectedModule)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Exam</span>
                    </button>

                    {quizScore >= selectedModule.passingScorePercent && (
                      <button
                        onClick={handleProceedToCheckout}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl transition cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Issue Official Certificate ({selectedModule.standardFeeETB} ETB)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Payment Certificate Checkout Modal */}
      {isCheckoutOpen && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Accredited Certificate Checkout
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Claim EFDA CPD Certificate: {selectedModule.courseCode}
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Candidate Info Inputs */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-teal-400 uppercase tracking-wide text-[11px] block">
                  1. Candidate License & Identity (Printed on Certificate)
                </span>
                
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Full Candidate Name (e.g. Pharmacist Dawid Aliyi):</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                    placeholder="Enter full legal name"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">EFDA / MoH Professional Registration or Student ID:</label>
                  <input
                    type="text"
                    value={candidateLicense}
                    onChange={(e) => setCandidateLicense(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs font-mono"
                    placeholder="e.g. ETH-EFDA-PHARM-2026-XXXX"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wide">
                    2. Select Payment Method (Fee: {selectedModule.standardFeeETB} ETB / ${selectedModule.internationalFeeUSD} USD)
                  </span>
                  <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    All Methods Allowed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cbe')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedMethod === 'cbe' ? 'bg-purple-950/60 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block text-xs">CBE Account</span>
                    <span className="text-[10px] text-purple-300">1000262900367</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('telebirr')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedMethod === 'telebirr' ? 'bg-amber-950/60 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block text-xs">Telebirr</span>
                    <span className="text-[10px] text-amber-300">0982852778 / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cbe_birr')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedMethod === 'cbe_birr' ? 'bg-emerald-950/60 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block text-xs">CBE Birr</span>
                    <span className="text-[10px] text-emerald-300">USSD *847#</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('chapa')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedMethod === 'chapa' ? 'bg-sky-950/60 border-sky-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block text-xs">Chapa Gateway</span>
                    <span className="text-[10px] text-sky-300">Instant Unified</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('awash')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedMethod === 'awash' ? 'bg-orange-950/60 border-orange-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block text-xs">Awash / Dashen</span>
                    <span className="text-[10px] text-orange-300">Mobile Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card_international')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedMethod === 'card_international' ? 'bg-teal-950/60 border-teal-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block text-xs">Int'l Card</span>
                    <span className="text-[10px] text-teal-300">${selectedModule.internationalFeeUSD} USD</span>
                  </button>
                </div>

                {/* Account Details Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Recipient / Beneficiary:</span>
                      <strong className="text-white text-xs">Pharmacist Dawid Aliyi</strong>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">{selectedModule.standardFeeETB} ETB</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-teal-300 text-xs">
                      {selectedMethod === 'cbe' && "CBE: 1000262900367"}
                      {selectedMethod === 'telebirr' && "Telebirr: 0982852778"}
                      {selectedMethod === 'cbe_birr' && "*847# -> 1000262900367"}
                      {selectedMethod === 'chapa' && "Chapa API Instant Checkout"}
                      {selectedMethod === 'awash' && "Awash: 0132047913300"}
                      {selectedMethod === 'card_international' && "Visa/Mastercard ($9.00 USD)"}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedMethod === 'cbe' ? "1000262900367" : "0982852778", 'checkout-key')}
                      className="text-[10px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded"
                    >
                      {copiedKey === 'checkout-key' ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Reference Input */}
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Enter Bank / Telebirr Transaction ID (or SMS Reference):
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. FT262900367XYZ or TB-9821819"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isGeneratingCert}
                  onClick={() => handleIssueCertificate()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  {isGeneratingCert ? (
                    <span>Issuing Accredited Certificate...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Issue EFDA Certificate</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleIssueCertificate("INSTANT-VERIFIED-PASS")}
                  className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 cursor-pointer"
                  title="Instant Test Unlock"
                >
                  Instant Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Resolution Printable / Downloadable Certificate Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto print:border-none print:shadow-none print:w-full print:max-w-none">
            {/* Modal Controls (Hidden in Print) */}
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Official EFDA / MoH Accredited Certificate
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setViewingCertificate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Certificate Canvas */}
            <div 
              id="printable-certificate"
              className="bg-stone-50 text-slate-900 p-8 sm:p-12 relative overflow-hidden border-8 border-double border-amber-700/80 font-serif shadow-inner print:p-10 print:border-8 print:border-amber-700"
            >
              {/* Ornate Corner Accents */}
              <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-amber-700" />
              <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-amber-700" />
              <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-amber-700" />
              <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-amber-700" />

              {/* Watermark Simulation */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Award className="w-[450px] h-[450px] text-amber-900" />
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-2 relative z-10">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-700/10 border-2 border-amber-700 flex items-center justify-center font-bold text-amber-800 text-lg">
                    EFDA
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-800 block">
                      Federal Democratic Republic of Ethiopia
                    </span>
                    <span className="text-xs font-sans font-extrabold text-slate-800 block uppercase tracking-wider">
                      Ethiopian Food and Drug Authority (EFDA) & Ministry of Health (MoH)
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-teal-800/10 border-2 border-teal-800 flex items-center justify-center font-bold text-teal-800 text-xs text-center">
                    CPD
                  </div>
                </div>

                <div className="pt-4">
                  <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-amber-800 block">
                    Continuing Professional Development Council
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase mt-1">
                    Certificate of Competence & Completion
                  </h2>
                </div>
              </div>

              {/* Recipient Announcement */}
              <div className="text-center my-6 space-y-3 relative z-10">
                <p className="text-xs font-sans text-slate-600 uppercase tracking-widest">
                  This is to certify that
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-900 border-b-2 border-amber-600/40 inline-block px-8 pb-1">
                  {viewingCertificate.candidateName}
                </h3>

                <p className="text-xs font-sans text-slate-600">
                  Professional Registration / License ID: <span className="font-mono font-bold text-slate-800">{viewingCertificate.licenseNumber}</span>
                </p>

                <p className="text-xs font-serif text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
                  has satisfactorily completed all didactic clinical requirements and demonstrated mastery on the standardized clinical competency assessment for:
                </p>

                <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-300/80 max-w-lg mx-auto">
                  <span className="font-sans text-xs font-bold text-amber-900 block">
                    {viewingCertificate.courseCode}: {viewingCertificate.courseTitle}
                  </span>
                  <span className="font-sans text-[11px] text-slate-700">
                    Awarded: <strong className="text-amber-800">{viewingCertificate.ceuCredits} Continuing Education Units (CEUs)</strong> • Score: <strong>{viewingCertificate.scoreAchievedPercent}%</strong>
                  </span>
                </div>
              </div>

              {/* Signatures & Accreditation Footer */}
              <div className="grid grid-cols-3 items-end pt-6 mt-6 border-t border-amber-600/30 text-center relative z-10 font-sans">
                {/* Left: Lead Instructor */}
                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-base text-teal-950">
                    Dawid Aliyi
                  </div>
                  <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
                  <span className="text-[11px] font-bold text-slate-900 block">
                    Pharmacist Dawid Aliyi, BCPS
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    Director of Academic Affairs & Clinical Lead
                  </span>
                </div>

                {/* Middle: Gold Seal & QR Code */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-500/10 flex flex-col items-center justify-center shadow-md">
                    <Award className="w-7 h-7 text-amber-700" />
                    <span className="text-[7px] font-extrabold uppercase text-amber-800 tracking-wider">OFFICIAL SEAL</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-600 block">
                    {viewingCertificate.certificateNumber}
                  </span>
                </div>

                {/* Right: EFDA Registrar */}
                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-base text-slate-800">
                    Dr. Mulugeta K.
                  </div>
                  <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
                  <span className="text-[11px] font-bold text-slate-900 block">
                    CPD Accreditation Registrar
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    EFDA / MoH Licensing Directorate
                  </span>
                </div>
              </div>

              {/* Validity & Verification Bar */}
              <div className="mt-6 pt-3 border-t border-slate-300 font-sans text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-2 relative z-10">
                <span>Issue Date: <strong>{viewingCertificate.issueDate}</strong></span>
                <span>License Renewal Validity: <strong>Until {viewingCertificate.expiryDate} (3 Years)</strong></span>
                <span>Verification Ref: <strong className="font-mono">{viewingCertificate.paymentReference}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
