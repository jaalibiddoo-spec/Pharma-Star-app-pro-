import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ChatMessage, ConsultationBooking, PaymentMethodType } from '../types';
import { 
  Send, User, ShieldCheck, AlertTriangle, Paperclip, 
  Sparkles, Stethoscope, Clock, CheckCircle2, RefreshCw, 
  Calendar, CreditCard, Landmark, Smartphone, Zap, Building2, 
  Wallet, Globe, Copy, Check, X, Phone, MessageSquare 
} from 'lucide-react';

interface PharmacistChatProps {
  isPro?: boolean;
  onUpgrade?: () => void;
}

export const PharmacistChat: React.FC<PharmacistChatProps> = ({ isPro, onUpgrade }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "system",
      senderName: "System",
      text: "Connected to Pharma Star Clinical Pharmacy On-Duty Consultation Service (Active 24/7).",
      timestamp: "Just now"
    },
    {
      id: "msg-2",
      sender: "pharmacist",
      senderName: "Pharm. Dawid Aliyi, BCPS (Lead Clinical Pharmacist)",
      text: "Greetings! I am on duty. How may I assist you with clinical dosing, drug interactions, renal adjustments, or prescription review today? You can also book a dedicated 1-on-1 Medication Therapy Management (MTM) consultation session.",
      timestamp: "Just now",
      isClinicalCard: true,
      clinicalData: {
        drugName: "Service Status: Active",
        recommendation: "Instant review of prescriptions, Cockcroft-Gault dose adjustments, and guideline-directed regimens.",
        doseAdvice: "All clinical recommendations comply with Ethiopian EFDA and International WHO/FDA guidelines."
      }
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Drug Interaction Review");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1-on-1 Consultation Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [consultationType, setConsultationType] = useState<ConsultationBooking['consultationType']>('mtm_review');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState("Morning (9:00 AM - 12:00 PM)");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('cbe');
  const [paymentRef, setPaymentRef] = useState("");
  const [bookedConsultation, setBookedConsultation] = useState<ConsultationBooking | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const categories = [
    "Drug Interaction Review",
    "Renal/Hepatic Dose Adjustment",
    "Pediatric Dosing",
    "Pregnancy & Lactation Safety",
    "Prescription Verification",
    "Adverse Drug Reaction (ADR)"
  ];

  const quickInquiries = [
    "Can I combine Lisinopril and Spironolactone if serum K+ is 5.2?",
    "What is the safe Amoxicillin suspension dose for a 12 kg pediatric patient with otitis media?",
    "Patient on Warfarin needs pain relief for knee osteoarthritis; is Ibuprofen safe?",
    "How to adjust Levofloxacin for a patient with CrCl 28 mL/min?"
  ];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      senderName: "You (Healthcare Professional / Student)",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      let cardData: any = undefined;

      const lower = text.toLowerCase();
      if (lower.includes("lisinopril") && lower.includes("spironolactone")) {
        replyText = "Caution advised! Combining Lisinopril with Spironolactone carries a Major risk of severe hyperkalemia.";
        cardData = {
          drugName: "Lisinopril + Spironolactone",
          warning: "High Risk of Hyperkalemia (K+ > 5.5 mEq/L)",
          recommendation: "With K+ already at 5.2 mEq/L, do NOT increase Spironolactone dose. Recheck BMP within 7-10 days. Advise low-potassium diet and consider Patiromer if K+ continues rising.",
          doseAdvice: "Keep Spironolactone at 12.5-25 mg daily maximum. Monitor ECG for peaked T waves if K+ exceeds 5.5."
        };
      } else if (lower.includes("amoxicillin") && lower.includes("pediatric")) {
        replyText = "For acute otitis media, the recommended high-dose regimen is 80 to 90 mg/kg/day divided into 2 doses (every 12 hours) to overcome intermediate Streptococcus pneumoniae resistance.";
        cardData = {
          drugName: "Amoxicillin Pediatric Dose (12 kg child)",
          recommendation: "Calculate: 12 kg * 90 mg/kg/day = 1080 mg/day -> 540 mg PO every 12 hours for 10 days.",
          doseAdvice: "Using 250 mg/5 mL suspension: 11 mL PO BID. Using 400 mg/5 mL: 6.75 mL PO BID with food."
        };
      } else if (lower.includes("warfarin") && lower.includes("ibuprofen")) {
        replyText = "Contraindicated without gastroprotection! Combining Warfarin with Ibuprofen dramatically increases gastrointestinal bleeding risk by 3 to 6-fold via dual platelet inhibition and mucosal injury.";
        cardData = {
          drugName: "Warfarin + Ibuprofen (NSAID)",
          warning: "Major Hemorrhagic Hazard",
          recommendation: "Avoid oral NSAIDs. Recommend Acetaminophen (Paracetamol) up to 2 g/day maximum for osteoarthritic pain, or topical NSAID gel (Diclofenac 1%).",
          doseAdvice: "If Paracetamol is taken chronically (>2g/day for >3 days), monitor INR closely as it may mildly inhibit CYP2C9."
        };
      } else if (lower.includes("levofloxacin") && (lower.includes("crcl") || lower.includes("renal"))) {
        replyText = "Renal dose titration required! Levofloxacin is eliminated ~80% unchanged via glomerular filtration and tubular secretion.";
        cardData = {
          drugName: "Levofloxacin Renal Adjustment (CrCl 28 mL/min)",
          recommendation: "For standard 500 mg q24h indication: Give initial loading dose of 500 mg, then reduce maintenance to 250 mg every 24 hours.",
          doseAdvice: "For severe CAP (750 mg q24h standard): Give 750 mg loading, then 750 mg every 48 hours. Maintain adequate hydration to prevent crystalluria."
        };
      } else {
        replyText = `Thank you for your clinical inquiry regarding ${selectedCategory}. I have reviewed your submission against Ethiopian STG 5th edition and WHO therapeutic standards.`;
        cardData = {
          drugName: "Clinical Case Assessment",
          recommendation: "Verify baseline renal panel (eGFR/Scr), hepatic enzymes, and concurrent prescription list before adjusting regimen.",
          doseAdvice: "For complex polypharmacy audits or inpatient ward reviews, consider booking a dedicated 1-on-1 MTM session."
        };
      }

      const pharmacistMsg: ChatMessage = {
        id: `pharm-${Date.now()}`,
        sender: "pharmacist",
        senderName: "Pharm. Dawid Aliyi, BCPS (Lead Clinical Pharmacist)",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: selectedCategory,
        isClinicalCard: !!cardData,
        clinicalData: cardData
      };

      setMessages(prev => [...prev, pharmacistMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    const ref = paymentRef || `CBE-MTM-${Date.now().toString().slice(-6)}`;
    const newBooking: ConsultationBooking = {
      id: `mtm-${Date.now()}`,
      clientName: clientName || "Healthcare Colleague",
      contactEmailOrPhone: contactInfo || "0911234567",
      consultationType,
      preferredDate,
      preferredTimeSlot: preferredTime,
      patientClinicalSummary: clinicalNotes || "Comprehensive patient medication review requested.",
      feeETB: 250,
      feeUSD: 5.0,
      paymentMethod: selectedMethod,
      paymentReference: ref,
      status: 'confirmed',
      consultantName: "Pharmacist Dawid Aliyi, BCPS",
      meetingLinkOrLocation: "Live Tele-Pharmacy / Hospital Clinical Ward Review"
    };

    setTimeout(() => {
      setIsSubmittingBooking(false);
      setBookedConsultation(newBooking);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Add system message to chat
      setMessages(prev => [
        ...prev,
        {
          id: `sys-booked-${Date.now()}`,
          sender: "system",
          senderName: "System",
          text: `1-on-1 Clinical MTM Consultation scheduled with Pharmacist Dawid Aliyi for ${preferredDate} (${preferredTime}). Appointment Ref: ${ref}`,
          timestamp: "Just now"
        }
      ]);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-xl relative">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-sm">
              <Stethoscope className="w-5 h-5 text-teal-400" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Pharmacist Live Consultation</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Certified BCPS On-Duty
              </span>
            </div>
            <p className="text-xs text-slate-400">Pharm. Dawid Aliyi • Clinical Pharmacotherapy & Dosing</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBookedConsultation(null);
              setIsBookingModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book 1-on-1 MTM Consultation (250 ETB)</span>
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-teal-500 outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' 
                ? 'items-end' 
                : m.sender === 'system' 
                ? 'items-center' 
                : 'items-start'
            }`}
          >
            {m.sender === 'system' ? (
              <div className="text-[11px] text-slate-300 bg-slate-900/90 px-3 py-1 rounded-full border border-teal-500/30 shadow">
                {m.text}
              </div>
            ) : (
              <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5`}>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                  <span className="font-semibold text-slate-300">{m.senderName}</span>
                  <span>• {m.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Clinical Recommendation Card */}
                  {m.isClinicalCard && m.clinicalData && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-teal-500/30 text-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-teal-400">
                          {m.clinicalData.drugName}
                        </span>
                        {m.clinicalData.warning && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> Warning
                          </span>
                        )}
                      </div>
                      {m.clinicalData.recommendation && (
                        <p className="text-[11px] text-slate-300">
                          <strong>Recommendation:</strong> {m.clinicalData.recommendation}
                        </p>
                      )}
                      {m.clinicalData.doseAdvice && (
                        <p className="text-[11px] text-emerald-300/90">
                          <strong>Clinical Pearl:</strong> {m.clinicalData.doseAdvice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-teal-400 p-2 bg-slate-900/60 rounded-xl w-fit border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Clinical Pharmacist is reviewing literature & calculating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Inquiries Carousel */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-semibold text-[11px] shrink-0">Quick Queries:</span>
        {quickInquiries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap text-[11px] cursor-pointer transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="p-2 rounded-xl text-teal-400 hover:text-teal-300 hover:bg-slate-900 transition cursor-pointer"
          title="Book 1-on-1 Consultation"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask Clinical Pharmacist about ${selectedCategory}...`}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim() || isTyping}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Direct Clinical Appointment
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Book 1-on-1 Medication Therapy Management (MTM)
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {!bookedConsultation ? (
                <form onSubmit={handleBookConsultation} className="space-y-4">
                  {/* Lead Consultant Bio */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold">
                      DA
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Lead Consultant: Pharmacist Dawid Aliyi, BCPS</h4>
                      <p className="text-[11px] text-slate-300">Board Certified Pharmacotherapy Specialist • 250 ETB ($5 USD)</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Dr. Almaz / Patient Tadesse"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Phone Number (or Telegram / WhatsApp):</label>
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="e.g. +251 92 047 9133 or @username"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Consultation Service Type:</label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs cursor-pointer"
                    >
                      <option value="mtm_review">Comprehensive Medication Therapy Management (MTM)</option>
                      <option value="renal_hepatic_dosing">Renal / Hepatic Impairment Dose Optimization</option>
                      <option value="oncology_antimicrobial">Antimicrobial Stewardship & Culture De-escalation</option>
                      <option value="polypharmacy_deprescribing">Geriatric Polypharmacy & De-prescribing</option>
                      <option value="academic_mentorship">Junior Pharmacist & Clerkship Clinical Mentorship</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Preferred Date:</label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Time Window:</label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                      >
                        <option>Morning (9:00 AM - 12:00 PM)</option>
                        <option>Afternoon (2:00 PM - 5:00 PM)</option>
                        <option>Evening (6:00 PM - 9:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Clinical Case Brief / Questions:</label>
                    <textarea
                      rows={2}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Mention current drugs, diagnosis, creatinine/LFTs..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>

                  {/* Payment Method Selector (All Allowed) */}
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <span className="font-bold text-slate-300 text-[11px] block uppercase">
                      Select Payment Method (Fee: 250 ETB / $5 USD):
                    </span>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('cbe')}
                        className={`p-2 rounded-lg border text-center text-xs cursor-pointer ${
                          selectedMethod === 'cbe' ? 'bg-purple-950/60 border-purple-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        CBE Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('telebirr')}
                        className={`p-2 rounded-lg border text-center text-xs cursor-pointer ${
                          selectedMethod === 'telebirr' ? 'bg-amber-950/60 border-amber-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Telebirr
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('cbe_birr')}
                        className={`p-2 rounded-lg border text-center text-xs cursor-pointer ${
                          selectedMethod === 'cbe_birr' ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        CBE Birr
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="font-mono text-teal-300 text-xs">
                        {selectedMethod === 'cbe' && "CBE: 1000262900367 (Dawid Aliyi)"}
                        {selectedMethod === 'telebirr' && "Telebirr: 0982852778 (Dawid Aliyi)"}
                        {selectedMethod === 'cbe_birr' && "CBE Birr *847# -> 1000262900367"}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedMethod === 'cbe' ? "1000262900367" : "0982852778", 'booking-ref')}
                        className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded"
                      >
                        {copiedKey === 'booking-ref' ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-0.5 text-[11px]">Transaction / SMS Reference:</label>
                      <input
                        type="text"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="e.g. FT262900367XYZ or TB-98214"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                    >
                      {isSubmittingBooking ? (
                        <span>Confirming Appointment...</span>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Book & Confirm Clinical Session</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Booking Success Ticket */
                <div className="space-y-4 text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">Consultation Booked Successfully!</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pharmacist Dawid Aliyi has received your clinical consultation request.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Appointment Code:</span>
                      <span className="font-mono font-bold text-teal-300">{bookedConsultation.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consultant:</span>
                      <strong className="text-white">{bookedConsultation.consultantName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date & Window:</span>
                      <span className="text-white">{bookedConsultation.preferredDate} ({bookedConsultation.preferredTimeSlot})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Direct Contact:</span>
                      <span className="text-emerald-400 font-mono">jaalibiddoo@gmail.com</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Return to Live Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
