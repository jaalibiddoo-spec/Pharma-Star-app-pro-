import React, { useState } from 'react';
import { Course, User } from '../types';
import { 
  X, CheckCircle2, Smartphone, Landmark, ShieldCheck, Sparkles, 
  Copy, Check, BookOpen, AlertCircle, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoursePaymentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseId: string) => void;
  currentUser: User;
}

export const CoursePaymentModal: React.FC<CoursePaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
  currentUser
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'telebirr' | 'cbe' | 'cbe_birr'>('telebirr');
  const [payerName, setPayerName] = useState(currentUser.fullName || "");
  const [payerPhone, setPayerPhone] = useState(currentUser.phone || "09");
  const [txReference, setTxReference] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSimulatePaymentAndUnlock = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const generatedRef = txReference.trim() || `ET-CRS-${Date.now().toString().slice(-6)}`;
      
      // Update unlocked courses list
      const currentUnlocked = currentUser.unlockedCourseIds || [];
      const updatedUnlocked = Array.from(new Set([...currentUnlocked, course.id]));
      
      const updatedUser: User = {
        ...currentUser,
        fullName: payerName || currentUser.fullName,
        phone: payerPhone || currentUser.phone,
        unlockedCourseIds: updatedUnlocked,
        cbeReference: generatedRef
      };

      try {
        localStorage.setItem('pharmastar_registered_user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('pharmastar_auth_sync'));
      } catch (e) {
        console.error(e);
      }

      setIsVerifying(false);
      setIsCompleted(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setTimeout(() => {
        onSuccess(course.id);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              100 Birr Individual Course Pass
            </span>
            <h3 className="text-lg font-bold mt-1 text-white leading-tight">
              Unlock {course.title} ({course.code})
            </h3>
          </div>
        </div>

        {isCompleted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Enrollment Active!</h4>
              <p className="text-xs text-slate-300 mt-1">
                You have successfully unlocked <span className="text-teal-400 font-semibold">{course.title}</span>.
                Full reading modules, video lectures, 3D simulations, and Google Gemini AI Tutor are ready!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Price Banner */}
            <div className="bg-gradient-to-r from-teal-950/60 to-slate-950 p-4 rounded-xl border border-teal-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Single Course Fee:</span>
                <span className="text-2xl font-black text-teal-400">100 ETB</span>
                <span className="text-[11px] text-slate-400 ml-1.5">(Ethiopian Birr)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full block">
                  Lifetime Access
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Includes Gemini AI Tutor</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Instant Payment Channel:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('telebirr')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    selectedMethod === 'telebirr'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                  <span className="text-xs font-bold block">Telebirr</span>
                  <span className="text-[9px] text-slate-400">0982852778</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('cbe')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    selectedMethod === 'cbe'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Landmark className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                  <span className="text-xs font-bold block">CBE Account</span>
                  <span className="text-[9px] text-slate-400">1000262900367</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('cbe_birr')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    selectedMethod === 'cbe_birr'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="text-xs font-bold block">CBE Birr</span>
                  <span className="text-[9px] text-slate-400">USSD *847#</span>
                </button>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
              {selectedMethod === 'telebirr' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Telebirr Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sky-400">0982852778</span>
                      <button
                        onClick={() => copyToClipboard('0982852778', 'telebirr')}
                        className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                      >
                        {copiedField === 'telebirr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Account Holder:</span>
                    <span className="text-white font-medium">Pharmacist Dawid Aliyi</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    Send <strong>100 ETB</strong> via Telebirr app or USSD <code>*127#</code>.
                  </p>
                </div>
              )}

              {selectedMethod === 'cbe' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CBE Account Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-purple-400">1000262900367</span>
                      <button
                        onClick={() => copyToClipboard('1000262900367', 'cbe')}
                        className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                      >
                        {copiedField === 'cbe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Beneficiary:</span>
                    <span className="text-white font-medium">Dawid Aliyi (Commercial Bank of Ethiopia)</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'cbe_birr' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CBE Birr USSD:</span>
                    <span className="font-mono font-bold text-amber-400">*847#</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Receiver Phone:</span>
                    <span className="text-white font-medium">0982852778 (Dawid Aliyi)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Student / Practitioner Input Fields */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Your Full Name:</label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g., Dr. / Pharm. Kidist"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">SMS Transaction Reference (Optional):</label>
              <input
                type="text"
                value={txReference}
                onChange={(e) => setTxReference(e.target.value)}
                placeholder="e.g., FT2630... or Telebirr Trans ID"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {/* Instant Auto-Unlock Button */}
            <button
              onClick={handleSimulatePaymentAndUnlock}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Verifying 100 Birr Transfer & Activating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify 100 Birr Payment & Unlock Course</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Instant auto-registration enabled by Pharmacist Dawid Aliyi</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
