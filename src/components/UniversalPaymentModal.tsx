import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Smartphone, Landmark, ShieldCheck, Sparkles, 
  Copy, Check, AlertCircle, ArrowRight, CreditCard, Globe, 
  QrCode, Zap, Lock, DollarSign, Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentServiceItem, PAYMENT_ACCOUNTS } from '../data/paymentServicesConfig';
import { User, PaymentRecord, PaymentMethodType } from '../types';
import { saveUserAndPayment } from '../utils/userStorage';
import { validatePaymentReference } from '../utils/paymentValidator';
import { useCurrency } from '../context/CurrencyContext';

interface UniversalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: PaymentServiceItem;
  currentUser: User;
  onSuccess: (paymentRecord: PaymentRecord, updatedUser: User) => void;
}

export const UniversalPaymentModal: React.FC<UniversalPaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  currentUser,
  onSuccess
}) => {
  const { currency: globalCurrency, isEthiopia, country } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState<'ETB' | 'USD'>(globalCurrency);
  const [paymentGateway, setPaymentGateway] = useState<'cbe' | 'telebirr' | 'cbeBirr' | 'chapa' | 'international'>(
    isEthiopia ? 'cbe' : 'international'
  );
  const [payerName, setPayerName] = useState(currentUser.fullName || '');
  const [payerPhone, setPayerPhone] = useState(currentUser.phone || '09');
  const [txRef, setTxRef] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setSelectedCurrency(globalCurrency);
    if (!isEthiopia) {
      setPaymentGateway('international');
    }
  }, [globalCurrency, isEthiopia]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // International Card Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [billingCountry, setBillingCountry] = useState('United States / Global Diaspora');

  if (!isOpen) return null;

  const currentPrice = selectedCurrency === 'ETB' ? `${service.priceETB} ETB` : `$${service.priceUSD.toFixed(2)} USD`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleProcessPayment = () => {
    setValidationError(null);

    // Strictly validate payment reference and mandatory payer info
    const validation = validatePaymentReference(
      txRef,
      paymentGateway,
      payerName,
      payerPhone
    );

    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Invalid payment confirmation reference.');
      return;
    }

    setIsProcessing(true);

    const finalTxRef = validation.cleanedRef || txRef.trim();

    setTimeout(() => {
      // Build Payment Record
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        transactionRef: finalTxRef,
        paymentMethod: paymentGateway === 'cbe' ? 'CBE Bank Transfer' :
                       paymentGateway === 'telebirr' ? 'Telebirr Mobile Money' :
                       paymentGateway === 'cbeBirr' ? 'CBE Birr USSD' :
                       paymentGateway === 'chapa' ? 'Chapa Gateway' : 'International Card / PayPal',
        amountETB: service.priceETB,
        serviceName: service.name,
        serviceId: service.id,
        timestamp: new Date().toISOString(),
        status: 'verified',
        payerName: payerName.trim() || currentUser.fullName || 'Healthcare Professional'
      };

      // Dynamically unlock the corresponding feature key on User
      const updatedUser: User = {
        ...currentUser,
        fullName: payerName.trim() || currentUser.fullName,
        phone: payerPhone.trim() || currentUser.phone,
        cbeReference: finalTxRef,
        [service.unlockKey]: true,
        // If unlocking pro_registration, set isPro to true
        isPro: service.id === 'pro_registration' ? true : currentUser.isPro
      };

      // If it's a single course, also add to unlockedCourseIds
      if (service.id === 'single_course') {
        const currentIds = currentUser.unlockedCourseIds || [];
        updatedUser.unlockedCourseIds = Array.from(new Set([...currentIds, 'active_course']));
      }

      saveUserAndPayment(updatedUser, newPayment);

      setIsProcessing(false);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onSuccess(newPayment, updatedUser);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-400 shrink-0">
            <Sparkles className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {service.badge}
              </span>
              <span className="text-xs text-slate-400">Fair &amp; Subsidized Access Rate</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white mt-0.5">
              {service.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Pricing & Currency Toggle */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fee for Service</span>
            <div className="text-2xl font-black text-teal-400 font-mono">
              {currentPrice}
            </div>
            <span className="text-[11px] text-slate-400">
              {selectedCurrency === 'ETB' ? 'Subsidized National Health Worker Rate' : 'Global Medical Education / Diaspora Rate'}
            </span>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setSelectedCurrency('ETB');
                if (paymentGateway === 'international') setPaymentGateway('cbe');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCurrency === 'ETB' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ETB (Birr)
            </button>
            <button
              onClick={() => {
                setSelectedCurrency('USD');
                setPaymentGateway('international');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCurrency === 'USD' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Payment Gateway Tabs */}
        <div className="space-y-3 mb-5">
          <label className="text-[11px] uppercase font-bold text-slate-400 block">
            Select Preferred Payment Method:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {/* CBE */}
            <button
              type="button"
              onClick={() => setPaymentGateway('cbe')}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                paymentGateway === 'cbe'
                  ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold shadow-lg ring-1 ring-purple-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <span className="block text-[11px]">CBE Bank</span>
            </button>

            {/* Telebirr */}
            <button
              type="button"
              onClick={() => setPaymentGateway('telebirr')}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                paymentGateway === 'telebirr'
                  ? 'bg-teal-600/30 border-teal-500 text-teal-200 font-bold shadow-lg ring-1 ring-teal-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 mx-auto mb-1 text-teal-400" />
              <span className="block text-[11px]">Telebirr</span>
            </button>

            {/* Chapa */}
            <button
              type="button"
              onClick={() => setPaymentGateway('chapa')}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                paymentGateway === 'chapa'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-lg ring-1 ring-emerald-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <span className="block text-[11px]">Chapa</span>
            </button>

            {/* CBE Birr */}
            <button
              type="button"
              onClick={() => setPaymentGateway('cbeBirr')}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                paymentGateway === 'cbeBirr'
                  ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold shadow-lg ring-1 ring-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <span className="block text-[11px]">CBE Birr</span>
            </button>

            {/* International */}
            <button
              type="button"
              onClick={() => {
                setPaymentGateway('international');
                setSelectedCurrency('USD');
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                paymentGateway === 'international'
                  ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 font-bold shadow-lg ring-1 ring-cyan-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <span className="block text-[11px]">Card / PayPal</span>
            </button>
          </div>
        </div>

        {/* Gateway Specific Detail Panels */}
        <div className="space-y-4 mb-5">
          {/* 1. CBE PANEL */}
          {paymentGateway === 'cbe' && (
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  Commercial Bank of Ethiopia (CBE) Direct Deposit:
                </span>
                <span className="font-mono text-purple-400 font-bold">{service.priceETB} ETB</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">CBE Account Number:</span>
                    <span className="text-base font-black text-white font-mono tracking-wider">
                      {PAYMENT_ACCOUNTS.cbe.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(PAYMENT_ACCOUNTS.cbe.accountNumber, 'cbe_acc')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                  >
                    {copiedKey === 'cbe_acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cbe_acc' ? 'Copied!' : 'Copy Account'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Account Name: <strong>{PAYMENT_ACCOUNTS.cbe.accountHolder}</strong></span>
                  <span className="text-slate-400">Branch: Nationwide</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {PAYMENT_ACCOUNTS.cbe.instructions}
              </p>
            </div>
          )}

          {/* 2. TELEBIRR PANEL */}
          {paymentGateway === 'telebirr' && (
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  Ethio Telecom Telebirr Mobile Money:
                </span>
                <span className="font-mono text-teal-400 font-bold">{service.priceETB} ETB</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Telebirr Mobile Number:</span>
                    <span className="text-base font-black text-teal-300 font-mono tracking-wider">
                      {PAYMENT_ACCOUNTS.telebirr.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-teal-400" />
                      <span>{showQR ? 'Hide QR' : 'QR Code'}</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(PAYMENT_ACCOUNTS.telebirr.phone, 'tb_phone')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                    >
                      {copiedKey === 'tb_phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'tb_phone' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Recipient: <strong>{PAYMENT_ACCOUNTS.telebirr.accountHolder}</strong></span>
                  <span className="text-teal-400 font-mono font-bold">USSD: *127#</span>
                </div>

                {showQR && (
                  <div className="p-3 bg-white rounded-xl text-slate-950 text-center space-y-1 mt-2">
                    <span className="text-[10px] font-bold block text-slate-600">Scan with Telebirr App</span>
                    <div className="w-28 h-28 bg-slate-900 mx-auto rounded-lg flex items-center justify-center text-teal-400 font-mono text-[10px] font-bold p-2 text-center text-white">
                      [TELEBIRR QR: 0982852778 Dawid Aliyi]
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {PAYMENT_ACCOUNTS.telebirr.instructions}
              </p>
            </div>
          )}

          {/* 3. CHAPA PANEL */}
          {paymentGateway === 'chapa' && (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Chapa Unified Ethiopian Payment Gateway:
                </span>
                <span className="font-mono text-emerald-400 font-bold">{service.priceETB} ETB</span>
              </div>

              <p className="text-[11px] text-slate-300">
                Chapa enables instant checkout supporting Telebirr, CBE Birr, Awash Birr, Amole (Dashen Bank), Bank of Abyssinia, and domestic debit cards in one flow.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Supported Integrated Banks &amp; Wallets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PAYMENT_ACCOUNTS.chapa.supportedChannels.map(ch => (
                    <span key={ch} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-emerald-300 font-medium">
                      ✓ {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. CBE BIRR USSD PANEL */}
          {paymentGateway === 'cbeBirr' && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" />
                  CBE Birr USSD Mobile Banking (*847#):
                </span>
                <span className="font-mono text-amber-400 font-bold">{service.priceETB} ETB</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">CBE Account / Merchant:</span>
                    <span className="text-base font-black text-amber-300 font-mono tracking-wider">
                      1000262900367 <span className="text-xs text-slate-400">(Merchant: 262900)</span>
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('1000262900367', 'cbe_birr_acc')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                  >
                    {copiedKey === 'cbe_birr_acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cbe_birr_acc' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300">
                  {PAYMENT_ACCOUNTS.cbeBirr.instructions}
                </p>
              </div>
            </div>
          )}

          {/* 5. INTERNATIONAL PANEL */}
          {paymentGateway === 'international' && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  International Credit / Debit Card &amp; PayPal:
                </span>
                <span className="font-mono text-cyan-400 font-bold">${service.priceUSD.toFixed(2)} USD</span>
              </div>

              <p className="text-[11px] text-slate-300">
                {PAYMENT_ACCOUNTS.international.exchangeRateNote} Secure 256-bit TLS encrypted processing.
              </p>

              {/* Card Inputs Simulation */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Card Number:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono text-xs focus:border-cyan-500"
                    />
                    <CreditCard className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Expiry (MM/YY):</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">CVC / CVV:</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Country / Region:</label>
                  <input
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-xs focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payer Verification Form */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs mb-5">
          <span className="text-[11px] font-bold text-white uppercase block">
            Payer &amp; Transaction Details:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Full Payer Name:</label>
              <input
                type="text"
                placeholder="e.g. Dawid Aliyi / Dr. Abebe"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mobile / WhatsApp Number:</label>
              <input
                type="text"
                placeholder="0911XXXXXX"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              {paymentGateway === 'international' ? 'Card Authorization Reference / Notes *:' : 'Bank SMS / Transfer Reference Code *:'}
            </label>
            <input
              type="text"
              placeholder={paymentGateway === 'telebirr' ? 'e.g. TB991204821 or REC2026-X9' : paymentGateway === 'cbe' ? 'e.g. CBE-FT26910 or FT26910123' : 'e.g. CHP-8912401 or PAYID-98124'}
              value={txRef}
              onChange={(e) => {
                setTxRef(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className={`w-full bg-slate-900 border rounded-xl p-2.5 text-white font-mono text-xs outline-none transition ${
                validationError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-teal-500'
              }`}
            />
          </div>

          {/* Inline Validation Error Notification */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-200">Payment Verification Blocked</p>
                <p className="text-[11px] text-rose-300/90 leading-tight mt-0.5">{validationError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Strictly Compulsory Verification */}
        <div className="space-y-2">
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Banking Settlement & Security Hash...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Settlement & Unlock {service.name} ({currentPrice})</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Compulsory anti-bypass validation: All transactions are audited and settled in real-time.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
