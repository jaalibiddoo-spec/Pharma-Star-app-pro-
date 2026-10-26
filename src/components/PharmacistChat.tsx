import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { 
  Send, User, ShieldCheck, AlertTriangle, Paperclip, 
  Sparkles, Stethoscope, Clock, CheckCircle2, RefreshCw 
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
      text: "Greetings! I am on duty. How may I assist you with clinical dosing, drug interactions, renal adjustments, or prescription review today?",
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

    // Simulate smart clinical pharmacist response with contextual understanding
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
          recommendation: "Total Daily Dose: 90 mg/kg * 12 kg = 1,080 mg/day (Approx. 1,000 mg/day divided BID = 500 mg every 12 hours).",
          doseAdvice: "Using 250 mg/5 mL suspension: Administer 10 mL (500 mg) orally every 12 hours with meals for 10 days."
        };
      } else if (lower.includes("warfarin") && lower.includes("ibuprofen")) {
        replyText = "Strictly avoid concurrent Ibuprofen with Warfarin. Ibuprofen inhibits platelet COX-1 and causes gastric mucosal injury, drastically multiplying bleeding risk.";
        cardData = {
          drugName: "Warfarin + NSAID Interaction Warning",
          warning: "Major Hemorrhagic & Upper GI Bleeding Risk",
          recommendation: "Substitute Acetaminophen (Paracetamol) 500 mg - 1000 mg TID PRN (maximum 2g/day while on warfarin) or topical capsaicin cream.",
          doseAdvice: "If NSAID is ever essential, co-prescribe Pantoprazole 40 mg daily and check INR within 3-5 days."
        };
      } else if (lower.includes("levofloxacin") && lower.includes("crcl")) {
        replyText = "Levofloxacin is eliminated predominantly by the kidneys (87%). Renal dose reduction is essential when CrCl < 50 mL/min to prevent neurotoxicity, seizures, and tendon rupture.";
        cardData = {
          drugName: "Levofloxacin Renal Adjustment (CrCl 28 mL/min)",
          recommendation: "Standard 500 mg dose adjusted to: Initial loading dose 500 mg, followed by 250 mg every 24 hours.",
          doseAdvice: "Standard 750 mg dose adjusted to: 750 mg once every 48 hours. Ensure hydration and monitor QT interval."
        };
      } else {
        replyText = `Thank you for consulting on "${selectedCategory}". Our clinical pharmacy team has reviewed your query: "${text}". Please ensure to cross-reference patient kidney biomarkers (CrCl/eGFR), hepatic panel, and documented drug allergies.`;
        cardData = {
          drugName: selectedCategory,
          recommendation: "Clinical evaluation indicates verifying therapeutic serum levels, auditing concurrent CYP450 inhibitors/inducers, and confirming adherence.",
          doseAdvice: "Follow Ethiopian STG and WHO Essential Medicine Formulary guidance for standard maintenance regimens."
        };
      }

      const pharmMsg: ChatMessage = {
        id: `pharm-${Date.now()}`,
        sender: "pharmacist",
        senderName: "Pharm. Dawid Aliyi, BCPS (Clinical Specialist)",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: selectedCategory,
        isClinicalCard: !!cardData,
        clinicalData: cardData
      };

      setMessages(prev => [...prev, pharmMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[650px]">
      {/* Consultation Header */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
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
            <p className="text-xs text-slate-400">Direct access to clinical pharmacotherapy and dosing guidance</p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Triage:</span>
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
              <div className="text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
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
          onClick={() => alert("Prescription scanning & image attachment simulator: You can attach patient prescriptions, hospital discharge summaries, or lab charts for direct pharmacist review.")}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
          title="Attach Prescription or Lab Document"
        >
          <Paperclip className="w-4 h-4" />
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
    </div>
  );
};
