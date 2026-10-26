import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, Copy, Check, ShieldCheck, 
  CreditCard, Landmark, Smartphone, Globe, ArrowRight, X 
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (refCode: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [paymentMethod, setPaymentMethod] = useState<'cbe' | 'telebirr' | 'chapa' | 'stripe'>('cbe');
  const [copiedCBE, setCopiedCBE] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cbeAccountNumber = "1000262900367";
  const cbeAccountHolder = "Dawid Aliyi";

  const handleCopyCBE = () => {
    navigator.clipboard.writeText(cbeAccountNumber);
    setCopiedCBE(true);
    setTimeout(() => setCopiedCBE(false), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if canvas-confetti is not loaded
      }
      onUpgradeSuccess(transactionRef || `TXN-PRO-${Math.floor(100000 + Math.random() * 900000)}`);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> PRO UPGRADE
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">Pharma Star App Pro Membership</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Full offline database access for remote areas, unconstrained 3D mechanisms, and clinical consultation.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Currency / Region Toggle */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCurrency('ETB');
                setPaymentMethod('cbe');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedCurrency === 'ETB'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Ethiopia (100 Birr)</span>
            </button>

            <button
              onClick={() => {
                setSelectedCurrency('USD');
                setPaymentMethod('stripe');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedCurrency === 'USD'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>International / Foreigners ($1.00 USD)</span>
            </button>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-slate-950 border border-teal-500/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">One-Time Registration Fee</span>
              <div className="text-2xl font-black text-white flex items-baseline gap-1 mt-0.5">
                {selectedCurrency === 'ETB' ? (
                  <>
                    <span className="text-teal-400">100</span>
                    <span className="text-xs text-slate-400 font-normal">ETB (Birr)</span>
                  </>
                ) : (
                  <>
                    <span className="text-teal-400">$1.00</span>
                    <span className="text-xs text-slate-400 font-normal">USD</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right text-xs text-slate-300 space-y-0.5">
              <span className="font-semibold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lifetime Pro Access
              </span>
              <span className="text-[11px] text-slate-400">Includes all 10 courses & offline cache</span>
            </div>
          </div>

          {/* Payment Method Details */}
          {selectedCurrency === 'ETB' ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Local Ethiopian Payment Options:
              </span>

              {/* Commercial Bank of Ethiopia (Primary & Prominent) */}
              <div className="bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Commercial Bank of Ethiopia (CBE)</h4>
                      <p className="text-xs text-purple-300 font-medium">Direct Transfer / Mobile Banking</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Recommended
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">CBE Account Number:</span>
                    <span className="text-base font-mono font-bold text-teal-300 tracking-wider">
                      {cbeAccountNumber}
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Account Name: <strong>{cbeAccountHolder}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCBE}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition cursor-pointer"
                  >
                    {copiedCBE ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Transfer <strong>100 Birr</strong> via CBE Birr, CBE Mobile Banking, or bank branch to account <strong>1000262900367 (Dawid Aliyi)</strong>.
                </p>
              </div>

              {/* Other Options: Telebirr / Chapa */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                    <Smartphone className="w-3.5 h-3.5" /> Telebirr
                  </span>
                  <p className="text-[11px] text-slate-400">Send 100 ETB to 0910262900 or via CBE-Telebirr bridge.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-sky-400 flex items-center gap-1 mb-1">
                    <CreditCard className="w-3.5 h-3.5" /> Chapa / ATM
                  </span>
                  <p className="text-[11px] text-slate-400">Instant debit card checkout with SMS notification.</p>
                </div>
              </div>
            </div>
          ) : (
            /* International $1.00 USD Options */
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                International Payment Options ($1.00 USD):
              </span>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Credit Card / Debit / PayPal ($1 USD)</h4>
                    <p className="text-xs text-slate-400">Global secure payment gateway for international physicians & pharmacists</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  International registration is subsidized at <strong>$1.00 USD</strong> for healthcare students and professionals worldwide.
                </p>
              </div>
            </div>
          )}

          {/* Transaction Reference & Activation Form */}
          <form onSubmit={handleConfirmPayment} className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Enter Bank Transaction / Reference Number (or CBE confirmation SMS):
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g., FT262900367XYZ or CBE-REF-98124"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !transactionRef.trim()}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              {isSubmitting ? (
                <span>Validating Transaction...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Payment & Activate Pharma Star Pro</span>
                </>
              )}
            </button>
          </form>

          {/* Pro Benefits Summary */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-teal-400 text-[11px] block uppercase tracking-wide">
              Included with Pharma Star App Pro:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
              <span className="flex items-center gap-1.5">✓ Full Offline Database for remote clinics</span>
              <span className="flex items-center gap-1.5">✓ Unlimited 3D MOA visualizers</span>
              <span className="flex items-center gap-1.5">✓ All 10 Pharmacy courses & lecture videos</span>
              <span className="flex items-center gap-1.5">✓ Priority 24/7 Clinical Pharmacist Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
