import React, { useState } from 'react';
import { 
  Wifi, 
  Smartphone, 
  Globe, 
  Zap, 
  CheckCircle, 
  CreditCard, 
  PhoneCall, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Download, 
  Share2, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Building,
  Check
} from 'lucide-react';
import { User as UserType, Language } from '../types';

export interface DataPackage {
  id: string;
  carrier: 'ethiotelecom' | 'safaricom' | 'regional_kenya' | 'regional_sudan' | 'regional_somalia' | 'regional_djibouti' | 'global_roaming';
  carrierName: string;
  country: string;
  packageName: string;
  volumeFormatted: string;
  validity: string;
  priceETBOrLocal: string;
  priceAmount: number;
  currency: string;
  ussdCode: string;
  category: 'daily' | 'weekly' | 'monthly' | 'unlimited_hospital';
  badge?: string;
  description: string;
}

const sampleDataPackages: DataPackage[] = [
  // Ethio Telecom Ethiopia
  {
    id: "et-daily-1gb",
    carrier: "ethiotelecom",
    carrierName: "Ethio Telecom (ኢትዮ ቴሌኮም)",
    country: "Ethiopia",
    packageName: "Daily Healthcare Fast Bundle",
    volumeFormatted: "1 GB",
    validity: "24 Hours",
    priceETBOrLocal: "25 ETB",
    priceAmount: 25,
    currency: "ETB",
    ussdCode: "*999*1*1#",
    category: "daily",
    description: "Ideal for quick ward rounds guideline verification and drug interaction lookup."
  },
  {
    id: "et-weekly-5gb",
    carrier: "ethiotelecom",
    carrierName: "Ethio Telecom (ኢትዮ ቴሌኮም)",
    country: "Ethiopia",
    packageName: "Weekly Medical Student Pass",
    volumeFormatted: "5 GB",
    validity: "7 Days",
    priceETBOrLocal: "120 ETB",
    priceAmount: 120,
    currency: "ETB",
    ussdCode: "*999*1*2#",
    category: "weekly",
    badge: "Popular",
    description: "High-speed 4G/5G data for attending online clinical webinars and lecture replays."
  },
  {
    id: "et-monthly-20gb",
    carrier: "ethiotelecom",
    carrierName: "Ethio Telecom (ኢትዮ ቴሌኮም)",
    country: "Ethiopia",
    packageName: "Monthly Hospital Dispensary Premium",
    volumeFormatted: "20 GB + 100 Min Voice",
    validity: "30 Days",
    priceETBOrLocal: "420 ETB",
    priceAmount: 420,
    currency: "ETB",
    ussdCode: "*999*1*3#",
    category: "monthly",
    badge: "Healthcare Value",
    description: "Continuous synchronization for digital bin cards, IFRR store updates, and pharmacy wiki."
  },
  {
    id: "et-unlimited-night",
    carrier: "ethiotelecom",
    carrierName: "Ethio Telecom (ኢትዮ ቴሌኮም)",
    country: "Ethiopia",
    packageName: "Unlimited Night Shift Duty Bundle",
    volumeFormatted: "Unlimited (11 PM - 6 AM)",
    validity: "Overnight Duty",
    priceETBOrLocal: "35 ETB",
    priceAmount: 35,
    currency: "ETB",
    ussdCode: "*999*5*1#",
    category: "unlimited_hospital",
    badge: "Night Shift",
    description: "Unlimited high-speed streaming for night dispensary duties and PharmaTube study beats."
  },

  // Safaricom Ethiopia
  {
    id: "saf-daily-1-5gb",
    carrier: "safaricom",
    carrierName: "Safaricom Ethiopia (ሳፋሪኮም)",
    country: "Ethiopia",
    packageName: "Safaricom 4G/5G Daily Boost",
    volumeFormatted: "1.5 GB",
    validity: "24 Hours",
    priceETBOrLocal: "30 ETB",
    priceAmount: 30,
    currency: "ETB",
    ussdCode: "*777*1#",
    category: "daily",
    description: "Low-latency streaming for 3D molecular kinetics and live pharmacist chat consultations."
  },
  {
    id: "saf-weekly-10gb",
    carrier: "safaricom",
    carrierName: "Safaricom Ethiopia (ሳፋሪኮም)",
    country: "Ethiopia",
    packageName: "Safaricom Weekly SuperData",
    volumeFormatted: "10 GB",
    validity: "7 Days",
    priceETBOrLocal: "220 ETB",
    priceAmount: 220,
    currency: "ETB",
    ussdCode: "*777*2#",
    category: "weekly",
    badge: "Fast 5G",
    description: "Ultra-fast browsing and video download for high-resolution medical animations."
  },
  {
    id: "saf-monthly-35gb",
    carrier: "safaricom",
    carrierName: "Safaricom Ethiopia (ሳፋሪኮም)",
    country: "Ethiopia",
    packageName: "Safaricom Monthly Health Center Suite",
    volumeFormatted: "35 GB Data",
    validity: "30 Days",
    priceETBOrLocal: "650 ETB",
    priceAmount: 650,
    currency: "ETB",
    ussdCode: "*777*3#",
    category: "monthly",
    badge: "Top Speed",
    description: "Reliable internet for regional hospitals, clinic router Wi-Fi, and electronic health records."
  },

  // Regional Countries
  // Kenya
  {
    id: "ken-saf-10gb",
    carrier: "regional_kenya",
    carrierName: "Safaricom Kenya (M-PESA)",
    country: "Kenya",
    packageName: "East Africa Clinical Data Pass",
    volumeFormatted: "10 GB + Free WhatsApp",
    validity: "30 Days",
    priceETBOrLocal: "1,000 KES (~450 ETB)",
    priceAmount: 450,
    currency: "KES",
    ussdCode: "*544#",
    category: "monthly",
    description: "Cross-border medical collaboration between Kenyan and Ethiopian teaching hospitals."
  },
  // Sudan
  {
    id: "sud-zain-15gb",
    carrier: "regional_sudan",
    carrierName: "Zain Sudan / MTN",
    country: "Sudan",
    packageName: "Sudan Border Health Mission Data",
    volumeFormatted: "15 GB",
    validity: "30 Days",
    priceETBOrLocal: "7,500 SDG (~380 ETB)",
    priceAmount: 380,
    currency: "SDG",
    ussdCode: "*123#",
    category: "monthly",
    description: "Emergency relief clinic data for Metema, Gallabat, and Sudanese border refugee hubs."
  },
  // Somalia / Somaliland
  {
    id: "som-telesom-20gb",
    carrier: "regional_somalia",
    carrierName: "Telesom Zaad / Hormuud",
    country: "Somalia & Somaliland",
    packageName: "Horn of Africa Clinical Link",
    volumeFormatted: "20 GB High Speed",
    validity: "30 Days",
    priceETBOrLocal: "$15 USD (~1,950 ETB)",
    priceAmount: 1950,
    currency: "USD",
    ussdCode: "*888#",
    category: "monthly",
    description: "Used by Somali Region dispensaries, Jigjiga, and Hargeisa referral hospitals."
  },
  // Djibouti
  {
    id: "dji-telecom-12gb",
    carrier: "regional_djibouti",
    carrierName: "Djibouti Telecom (Evatis)",
    country: "Djibouti",
    packageName: "Corridor Port & Logistics Data",
    volumeFormatted: "12 GB Data",
    validity: "30 Days",
    priceETBOrLocal: "2,500 DJF (~1,800 ETB)",
    priceAmount: 1800,
    currency: "DJF",
    ussdCode: "*160#",
    category: "monthly",
    description: "Ensuring cold-chain tracking for pharmaceutical shipments arriving via Djibouti port."
  },
  // Global / Diaspora eSIM
  {
    id: "glb-esim-5gb",
    carrier: "global_roaming",
    carrierName: "Global Healthcare eSIM Roaming",
    country: "Global & Diaspora",
    packageName: "Worldwide Medical Roaming Pass",
    volumeFormatted: "5 GB Global",
    validity: "30 Days",
    priceETBOrLocal: "$18 USD (~2,340 ETB)",
    priceAmount: 2340,
    currency: "USD",
    ussdCode: "eSIM QR Activation",
    category: "monthly",
    badge: "140+ Countries",
    description: "For diaspora specialists, visiting medical mission doctors, and international students."
  }
];

interface InternetPackageStoreProps {
  user: UserType;
  currentLanguage: Language;
}

export const InternetPackageStore: React.FC<InternetPackageStoreProps> = ({
  user,
  currentLanguage
}) => {
  const [selectedCarrier, setSelectedCarrier] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phone || '0982852778');
  const [activePackage, setActivePackage] = useState<DataPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe_birr' | 'cbe_bank' | 'mpesa'>('telebirr');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState<{
    txId: string;
    packageName: string;
    carrierName: string;
    phone: string;
    amount: string;
    ussdCode: string;
    activatedAt: string;
  } | null>(null);

  // Filter packages
  const filteredPackages = sampleDataPackages.filter(pkg => {
    const matchesCarrier = selectedCarrier === 'all' || pkg.carrier === selectedCarrier;
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    return matchesCarrier && matchesCategory;
  });

  const handlePurchase = (pkg: DataPackage) => {
    setActivePackage(pkg);
  };

  const handleConfirmPurchase = () => {
    if (!activePackage) return;
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid recipient phone number.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const receipt = {
        txId: `DATA-${Date.now().toString().slice(-8)}`,
        packageName: activePackage.packageName,
        carrierName: activePackage.carrierName,
        phone: phoneNumber,
        amount: activePackage.priceETBOrLocal,
        ussdCode: activePackage.ussdCode,
        activatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setPurchaseReceipt(receipt);
      setIsProcessing(false);
      setActivePackage(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Wifi className="w-3.5 h-3.5" />
              Telecommunication & Internet Package Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Buy Mobile Data & Internet Packages
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base max-w-2xl">
              Instant 4G/5G data bundle recharges for healthcare providers, students, and hospital dispensaries. Choose from Ethio Telecom, Safaricom Ethiopia, and cross-border African packages (Kenya, Sudan, Somalia, Djibouti & Global).
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left md:text-right">
              <span className="text-[11px] text-slate-400 block">Instant Payment Channels:</span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                Telebirr (0982852778) • CBE (*847#) • M-PESA
              </span>
            </div>
          </div>
        </div>

        {/* Carrier Tabs */}
        <div className="mt-6 pt-5 border-t border-emerald-500/20 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Operators', country: 'Global' },
            { id: 'ethiotelecom', label: 'Ethio Telecom (ኢትዮ ቴሌኮም)', country: '🇪🇹 Ethiopia' },
            { id: 'safaricom', label: 'Safaricom Ethiopia (ሳፋሪኮም)', country: '🇪🇹 Ethiopia' },
            { id: 'regional_kenya', label: 'Safaricom M-PESA', country: '🇰🇪 Kenya' },
            { id: 'regional_sudan', label: 'Zain / MTN', country: '🇸🇩 Sudan' },
            { id: 'regional_somalia', label: 'Telesom Zaad', country: '🇸🇴 Somalia' },
            { id: 'regional_djibouti', label: 'Djibouti Telecom', country: '🇩🇯 Djibouti' },
            { id: 'global_roaming', label: 'Global Healthcare eSIM', country: '🌐 Worldwide' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCarrier(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCarrier === c.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{c.country}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient Number Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Recipient Handset / Hospital Router SIM Number:
            </h4>
            <p className="text-[11px] text-slate-400">
              Data packages are provisioned over-the-air to this mobile number.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. 0982852778 or +251 982 852 778"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => setPhoneNumber(user.phone || '0982852778')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            My Phone
          </button>
        </div>
      </div>

      {/* Success Receipt Banner */}
      {purchaseReceipt && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Data Package Successfully Recharged!
              </span>
              <h3 className="text-base font-bold text-white">
                {purchaseReceipt.packageName} ({purchaseReceipt.amount})
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Dispatched to {purchaseReceipt.phone} via {purchaseReceipt.carrierName} • TX: {purchaseReceipt.txId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${encodeURIComponent(purchaseReceipt.ussdCode)}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Dial USSD ({purchaseReceipt.ussdCode})
            </a>
            <button
              onClick={() => setPurchaseReceipt(null)}
              className="p-2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-emerald-950/30 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {pkg.country}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {pkg.carrierName}
                  </span>
                </div>
                {pkg.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {pkg.packageName}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white">{pkg.volumeFormatted}</span>
                  <span className="text-xs text-slate-400 font-mono">/ {pkg.validity}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {pkg.description}
              </p>

              {/* Direct USSD String */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px]">USSD String:</span>
                <span className="text-emerald-400 font-bold">{pkg.ussdCode}</span>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Price:</span>
                <span className="text-lg font-bold text-white">{pkg.priceETBOrLocal}</span>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Buy Package
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation & Checkout Modal */}
      {activePackage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Confirm Internet Purchase</h3>
                  <p className="text-xs text-slate-400">{activePackage.carrierName}</p>
                </div>
              </div>
              <button
                onClick={() => setActivePackage(null)}
                className="text-slate-400 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Package Summary Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Bundle Name:</span>
                <span className="font-bold text-white">{activePackage.packageName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Data Volume:</span>
                <span className="font-bold text-emerald-400 text-sm">{activePackage.volumeFormatted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Validity Period:</span>
                <span className="text-slate-200">{activePackage.validity}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-bold">Total Price:</span>
                <span className="font-extrabold text-amber-400 text-base">{activePackage.priceETBOrLocal}</span>
              </div>
            </div>

            {/* Target Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target SIM Mobile Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Instant Payment Gateway:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'telebirr', label: 'Telebirr (0982852778)' },
                  { id: 'cbe_birr', label: 'CBE Birr (*847#)' },
                  { id: 'cbe_bank', label: 'CBE (1000262900367)' },
                  { id: 'mpesa', label: 'M-PESA / Airtime' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-emerald-950/60 border-emerald-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isProcessing ? 'Processing Recharge...' : `Recharge Now (${activePackage.priceETBOrLocal})`}
              </button>
              <button
                onClick={() => setActivePackage(null)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
