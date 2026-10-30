import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, Copy, Check, ShieldCheck, 
  CreditCard, Landmark, Smartphone, Globe, ArrowRight, X, 
  QrCode, Zap, Building2, Wallet, AlertCircle, KeyRound 
} from 'lucide-react';
import { PaymentMethodType, User } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (refCode: string, user?: User) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('cbe');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const paymentAccounts = {
    cbe: {
      name: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000262900367",
      accountHolder: "Dawid Aliyi",
      amountETB: 100,
      instructions: "Transfer 100 Birr via CBE Mobile Banking, CBE Birr, or any CBE branch nationwide."
    },
    telebirr: {
      name: "Telebirr (Ethio Telecom Mobile Money)",
      accountNumber: "0982852778",
      accountHolder: "Dawid Aliyi",
      amountETB: 100,
      instructions: "Send 100 Birr via Telebirr App or dial *127# to 0982852778."
    },
    cbe_birr: {
      name: "CBE Birr USSD Mobile Banking",
      ussdCode: "*847#",
      merchantCode: "262900",
      accountHolder: "Dawid Aliyi (1000262900367)",
      amountETB: 100,
      instructions: "Dial *847# on your phone, choose 'Transfer to CBE Account' and enter 1000262900367."
    },
    chapa: {
      name: "Chapa Unified Ethiopian Payment Gateway",
      provider: "Chapa Financial Technologies",
      amountETB: 100,
      instructions: "Instant checkout supporting Telebirr, CBE Birr, Awash Bank, Dashen (Amole), and domestic/international debit cards."
    },
    awash: {
      name: "Awash Bank",
      accountNumber: "0132047913300",
      accountHolder: "Dawid Aliyi",
      amountETB: 100,
      instructions: "Transfer 100 Birr via Awash Mobile Banking or branch deposit."
    },
    dashen: {
      name: "Dashen Bank / Amole",
      accountNumber: "5120262900367",
      accountHolder: "Dawid Aliyi",
      amountETB: 100,
      instructions: "Transfer 100 Birr via Amole App or Dashen Bank mobile banking."
    },
    card_international: {
      name: "International Visa / Mastercard / PayPal",
      amountUSD: 1.00,
      instructions: "Subsidized global medical education rate for international pharmacists & students."
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSimulatePayment = (ref?: string) => {
    setIsSubmitting(true);
    const methodPrefix = selectedMethod === 'telebirr' ? 'TB' : selectedMethod === 'cbe' ? 'CBE' : 'ET';
    const finalRef = ref || transactionRef.trim() || `${methodPrefix}-${Date.now().toString().slice(-7)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      const generatedUser: User = {
        username: payerName.trim() ? payerName.trim().replace(/\s+/g, '_') : "Pharmacist_Dawid_Member",
        fullName: payerName.trim() || "Licensed Clinical Pharmacist",
        phone: payerPhone.trim() || (selectedMethod === 'telebirr' ? '0982852778' : ''),
        email: payerPhone.includes('@') ? payerPhone.trim() : undefined,
        role: "pharmacist",
        isPro: true,
        cbeReference: finalRef,
        registrationDate: new Date().toISOString().split('T')[0],
        offlineReady: true,
        membershipId: `PS-ET-${Date.now().toString().slice(-6)}`,
        paymentMethod: selectedMethod,
        registeredVia: 'automated_payment',
        activatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('pharmastar_registered_user', JSON.stringify(generatedUser));
        window.dispatchEvent(new Event('pharmastar_auth_sync'));
      } catch (e) {
        // ignore
      }

      onUpgradeSuccess(finalRef, generatedUser);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> All Payment Methods Supported
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">Upgrade to Pharmastar App Pro</h2>
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
                if (selectedMethod === 'card_international') setSelectedMethod('cbe');
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
                setSelectedMethod('card_international');
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

          {/* Payment Method Selector Grid */}
          {selectedCurrency === 'ETB' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Select Your Preferred Ethiopian Payment Method:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* CBE */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cbe')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMethod === 'cbe'
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Landmark className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-xs text-white">CBE Account</span>
                  </div>
                  <span className="text-[10px] text-purple-300 block">1000262900367</span>
                </button>

                {/* Telebirr */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('telebirr')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMethod === 'telebirr'
                      ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-white">Telebirr</span>
                  </div>
                  <span className="text-[10px] text-amber-300 block">0982852778 / QR</span>
                </button>

                {/* CBE Birr USSD */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cbe_birr')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMethod === 'cbe_birr'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">CBE Birr</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 block">USSD *847#</span>
                </button>

                {/* Chapa Gateway */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('chapa')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMethod === 'chapa'
                      ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-xs text-white">Chapa Gateway</span>
                  </div>
                  <span className="text-[10px] text-sky-300 block">Instant Card & Telebirr</span>
                </button>

                {/* Awash Bank */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('awash')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMethod === 'awash'
                      ? 'bg-orange-950/60 border-orange-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-xs text-white">Awash Bank</span>
                  </div>
                  <span className="text-[10px] text-orange-300 block">Mobile & Branch</span>
                </button>

                {/* Dashen Bank */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('dashen')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMethod === 'dashen'
                      ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-xs text-white">Dashen / Amole</span>
                  </div>
                  <span className="text-[10px] text-blue-300 block">Amole Wallet</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Payment Details Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            {selectedMethod === 'cbe' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Commercial Bank of Ethiopia (CBE)</h4>
                      <p className="text-xs text-purple-300">Primary Official Account</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Recommended
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">CBE Account Number:</span>
                    <span className="text-base font-mono font-bold text-teal-300 tracking-wider">
                      {paymentAccounts.cbe.accountNumber}
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Account Name: <strong>{paymentAccounts.cbe.accountHolder}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentAccounts.cbe.accountNumber, 'cbe')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition cursor-pointer"
                  >
                    {copiedKey === 'cbe' ? (
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
                <p className="text-[11px] text-slate-400">{paymentAccounts.cbe.instructions}</p>
              </div>
            )}

            {selectedMethod === 'telebirr' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Telebirr Mobile Money</h4>
                      <p className="text-xs text-amber-300">Ethio Telecom Instant Transfer</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQR ? "Hide QR" : "Show Telebirr QR"}</span>
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Telebirr Mobile Number:</span>
                    <span className="text-base font-mono font-bold text-amber-300 tracking-wider">
                      {paymentAccounts.telebirr.accountNumber}
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Recipient: <strong>{paymentAccounts.telebirr.accountHolder}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentAccounts.telebirr.accountNumber, 'telebirr')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition cursor-pointer"
                  >
                    {copiedKey === 'telebirr' ? (
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

                {showQR && (
                  <div className="p-4 bg-white rounded-xl text-center flex flex-col items-center justify-center">
                    <div className="p-3 bg-amber-50 border-2 border-amber-500 rounded-xl">
                      <QrCode className="w-32 h-32 text-slate-900" />
                    </div>
                    <span className="text-slate-900 font-bold text-xs mt-2">Scan with Telebirr App</span>
                    <span className="text-slate-600 text-[10px]">Recipient: Dawid Aliyi (0982852778) • 100 ETB</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-400">{paymentAccounts.telebirr.instructions}</p>
              </div>
            )}

            {selectedMethod === 'cbe_birr' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">CBE Birr USSD Mobile Banking</h4>
                    <p className="text-xs text-emerald-300">Dial *847# from any phone</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Step 1: Dial Code</span>
                    <span className="font-mono font-bold text-teal-300 text-sm">*847#</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Step 2: Transfer to CBE</span>
                    <span className="font-mono text-xs text-slate-200">Account 1000262900367</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Step 3: Amount</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">100 ETB</span>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'chapa' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Chapa Unified Payment Checkout</h4>
                      <p className="text-xs text-sky-300">Instant Telebirr, CBE, Awash, Card Checkout</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Instant Auto-Activation
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Chapa directs you to a unified checkout screen where you can authenticate using your Telebirr PIN, CBE Birr, or debit card.
                </p>

                <button
                  type="button"
                  onClick={() => handleSimulatePayment(`CHAPA-${Date.now().toString().slice(-8)}`)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Launch Instant Chapa 100 ETB Checkout</span>
                </button>
              </div>
            )}

            {(selectedMethod === 'awash' || selectedMethod === 'dashen') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {selectedMethod === 'awash' ? 'Awash Bank Transfer' : 'Dashen Bank / Amole Transfer'}
                    </h4>
                    <p className="text-xs text-slate-400">Mobile banking or branch deposit</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {selectedMethod === 'awash' ? 'Awash Account:' : 'Dashen Account:'}
                    </span>
                    <span className="text-sm font-mono font-bold text-teal-300">
                      {selectedMethod === 'awash' ? paymentAccounts.awash.accountNumber : paymentAccounts.dashen.accountNumber}
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Account Name: <strong>Dawid Aliyi</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedMethod === 'awash' ? paymentAccounts.awash.accountNumber : paymentAccounts.dashen.accountNumber, selectedMethod)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    {copiedKey === selectedMethod ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === selectedMethod ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {selectedMethod === 'card_international' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">International Visa / Mastercard / PayPal</h4>
                    <p className="text-xs text-slate-400">Global Subsidized Medical Rate: $1.00 USD</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  Global students and clinical pharmacists outside Ethiopia can activate full lifetime Pro access for <strong>$1.00 USD</strong>.
                </p>

                <button
                  type="button"
                  onClick={() => handleSimulatePayment(`INT-CARD-${Date.now().toString().slice(-8)}`)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Pay $1.00 USD with International Card</span>
                </button>
              </div>
            )}
          </div>

          {/* Transaction Reference & Activation Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSimulatePayment(); }} className="space-y-3 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 text-teal-300 text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Automatic Cross-Platform Registration:</strong> Once payment is confirmed, your account is automatically created, verified, and linked between the Official Website and App Workstation.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Practitioner / Member Name:
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g. Pharmacist Dawid Aliyi"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Phone Number (Telebirr / CBE):
                </label>
                <input
                  type="text"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="e.g. 0982852778"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Bank / Telebirr Transaction Reference Number:
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. FT262900367XYZ, TB-9281928, or CBE Confirmation SMS"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Validating Reference...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Reference & Unlock Pro Access</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePayment("1-CLICK-VERIFIED-DEMO")}
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 border border-amber-500/30"
                title="Instant Free Test Unlock"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Instant Test Pass</span>
              </button>
            </div>
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
