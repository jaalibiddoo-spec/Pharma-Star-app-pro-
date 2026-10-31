import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, 
  MessageSquare, User, Clock, ShieldCheck, FileText, 
  CreditCard, Landmark, DollarSign, Sparkles, AlertCircle, 
  CheckCircle2, Pill, Stethoscope, Send, ChevronRight, 
  Sliders, ArrowRight, Printer, Share2, Copy, Check, 
  Calendar, Phone, Radio, HeartPulse, Activity
} from 'lucide-react';
import { User as AppUser, PaymentRecord } from '../types';
import { saveUserAndPayment } from '../utils/userStorage';

interface TelemedicineProps {
  currentUser: AppUser;
  onUpdateUser?: (user: AppUser) => void;
  onOpenConsultationChat?: () => void;
}

interface TeleConsultationSession {
  id: string;
  patientName: string;
  patientMrn: string;
  age: number;
  gender: 'Male' | 'Female';
  facilityLocation: string; // e.g., 'Bale Goba Rural Primary Health Center'
  chiefComplaint: string;
  specialty: 'Clinical Pharmacotherapy (MTM)' | 'General Telemedicine' | 'Pediatric Dosing' | 'Chronic Disease Care';
  scheduledTime: string;
  triagePriority: 'Urgent (Red)' | 'Priority (Yellow)' | 'Routine (Green)';
  standardFeeETB: number;
  negotiatedFeeETB: number;
  paymentStatus: 'Negotiated & Verified' | 'Pending Offer' | 'Subsidized Rural Post (Free)';
  chapaTxRef?: string;
  vitals: {
    bp: string;
    hr: number;
    spo2: number;
    temp: number;
    rbs: number;
  };
}

export const TelemedicineAndTelepharmacy: React.FC<TelemedicineProps> = ({
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'live_room' | 'telepharmacy_mtm' | 'queue_schedule' | 'negotiate_payment'>('live_room');

  // Live Video Room State
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(142); // seconds
  const [isCallConnected, setIsCallConnected] = useState(true);

  // In-Call Chat & Clinical Observations
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isDoctor?: boolean }>>([
    { sender: "System", text: "Encrypted P2P Clinical Telemedicine Room Connected. Session recording compliant with Ethiopian MoH Telehealth Guidelines.", time: "10:00 AM" },
    { sender: "Patient (Almaz Bekele)", text: "Greetings Doctor Dawid. I have severe dizziness since taking the new blood pressure medication yesterday.", time: "10:01 AM" },
    { sender: "Dr. Dawid Aliyi (Lead Pharmacist)", text: "Welcome Almaz. Let's review your vitals and standing blood pressure right now. Did you take Amlodipine on an empty stomach?", time: "10:02 AM", isDoctor: true }
  ]);
  const [currentMessageInput, setCurrentMessageInput] = useState('');

  // e-Prescription & Telepharmacy Counseling Dispensing State
  const [rxDrugName, setRxDrugName] = useState('Hydrochlorothiazide 25mg Tablet');
  const [rxDosage, setRxDosage] = useState('1 tablet daily in the morning');
  const [rxInstructions, setRxInstructions] = useState('Drink adequate water. Avoid sudden standing to prevent orthostatic hypotension. Check BP 3x weekly.');
  const [dispenseVerified, setDispenseVerified] = useState(false);

  // Payment Negotiation State (Negotiable via Chapa / Telebirr)
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [customNegotiatedBid, setCustomNegotiatedBid] = useState<number>(100);
  const [negotiationNotes, setNegotiationNotes] = useState('Requesting subsidized community rate for rural outpatient referral.');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);

  // Preset Active Telemedicine Queue
  const [sessions, setSessions] = useState<TeleConsultationSession[]>([
    {
      id: 'session-1',
      patientName: 'Almaz Bekele Tessema',
      patientMrn: 'MRN-BALE-8841',
      age: 58,
      gender: 'Female',
      facilityLocation: 'Bale Goba Primary Health Center, Oromia',
      chiefComplaint: 'Orthostatic dizziness & edema after initiating antihypertensive regimen',
      specialty: 'Clinical Pharmacotherapy (MTM)',
      scheduledTime: '10:00 AM (Active Now)',
      triagePriority: 'Priority (Yellow)',
      standardFeeETB: 200,
      negotiatedFeeETB: 100,
      paymentStatus: 'Negotiated & Verified',
      chapaTxRef: 'CHP-TELE-981240',
      vitals: { bp: '138/84 mmHg', hr: 78, spo2: 97, temp: 36.8, rbs: 114 }
    },
    {
      id: 'session-2',
      patientName: 'Tilahun Mengistu',
      patientMrn: 'MRN-GONDAR-4019',
      age: 44,
      gender: 'Male',
      facilityLocation: 'Debark District Clinic, Amhara Region',
      chiefComplaint: 'Severe dry hacking cough on Lisinopril 20mg daily; request ARB transition',
      specialty: 'Clinical Pharmacotherapy (MTM)',
      scheduledTime: '10:30 AM (Next in Queue)',
      triagePriority: 'Routine (Green)',
      standardFeeETB: 150,
      negotiatedFeeETB: 75,
      paymentStatus: 'Negotiated & Verified',
      chapaTxRef: 'CHP-TELE-981241',
      vitals: { bp: '144/88 mmHg', hr: 72, spo2: 98, temp: 36.5, rbs: 98 }
    },
    {
      id: 'session-3',
      patientName: 'Baby Fikirte Girma (Mother: Meron)',
      patientMrn: 'MRN-SIDAMA-2201',
      age: 3,
      gender: 'Female',
      facilityLocation: 'Yirgalem Remote Health Post, Sidama',
      chiefComplaint: 'Pediatric amoxicillin dosing check for acute otitis media with renal caution',
      specialty: 'Pediatric Dosing',
      scheduledTime: '11:00 AM',
      triagePriority: 'Urgent (Red)',
      standardFeeETB: 150,
      negotiatedFeeETB: 0,
      paymentStatus: 'Subsidized Rural Post (Free)',
      vitals: { bp: '92/60 mmHg', hr: 110, spo2: 96, temp: 38.6, rbs: 95 }
    }
  ]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Live timer for call
  useEffect(() => {
    if (!isCallConnected) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallConnected]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessageInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: `${currentUser.fullName} (${currentUser.role.toUpperCase()})`,
        text: currentMessageInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: true
      }
    ]);
    setCurrentMessageInput('');
  };

  // Submit Negotiated Payment through Chapa
  const handleExecuteNegotiatedChapaPayment = async () => {
    setPaymentProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 900));

      const txRef = `CHP-TELE-${Date.now().toString().slice(-6)}`;
      const paymentRecord: PaymentRecord = {
        id: `pay-tele-${Date.now()}`,
        transactionRef: txRef,
        paymentMethod: 'PayPal / Card', // Chapa gateway
        amountETB: customNegotiatedBid,
        serviceName: `Telehealth Consultation (${activeSession.specialty})`,
        serviceId: 'telemedicine_session',
        timestamp: new Date().toISOString(),
        status: 'verified',
        payerName: activeSession.patientName,
        notes: `Negotiated fee settled through Chapa Gateway from ${activeSession.facilityLocation}`
      };

      // Auto-remember user & payment performed
      if (onUpdateUser) {
        const saved = saveUserAndPayment(currentUser, paymentRecord);
        onUpdateUser(saved);
      } else {
        saveUserAndPayment(currentUser, paymentRecord);
      }

      // Update session status in state
      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            negotiatedFeeETB: customNegotiatedBid,
            paymentStatus: 'Negotiated & Verified',
            chapaTxRef: txRef
          };
        }
        return s;
      }));

      setPaymentSuccessData({
        txRef,
        amountETB: customNegotiatedBid,
        patientName: activeSession.patientName,
        facility: activeSession.facilityLocation,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (e) {
      console.error(e);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Telemedicine & Telepharmacy Master Suite */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Synchronous Virtual Clinical Care
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Payment Negotiable via Chapa
              </span>
              <span className="text-xs text-slate-400">MoH / EFDA Telepharmacy Framework</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Telemedicine & Telepharmacy Virtual Workstation
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Connect referral hospital specialists with remote rural health posts, conduct live encrypted video consultations, verify e-prescriptions with MTM counseling, and negotiate clinical service rates flexibly via Chapa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Room Status: <strong className="text-emerald-400">Connected</strong></span>
              <span className="text-slate-500 font-mono">({formatCallTime(callDuration)})</span>
            </div>

            <button
              onClick={() => setActiveTab('negotiate_payment')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Negotiate Fee (Chapa)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('live_room')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'live_room'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Live Teleconsultation Room</span>
        </button>

        <button
          onClick={() => setActiveTab('telepharmacy_mtm')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'telepharmacy_mtm'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Telepharmacy Dispensing & Counseling</span>
        </button>

        <button
          onClick={() => setActiveTab('queue_schedule')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'queue_schedule'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Patient Triage Queue ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('negotiate_payment')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'negotiate_payment'
              ? 'bg-gradient-to-r from-amber-600 to-teal-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
          <span>Negotiable Fee & Chapa Settlement</span>
        </button>
      </div>

      {/* VIEW 1: Live Teleconsultation Room */}
      {activeTab === 'live_room' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Screen & Remote Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Simulated Patient Video Stream */}
              {isVideoActive ? (
                <div className="w-full h-full relative bg-gradient-to-b from-slate-900 via-slate-950 to-teal-950 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-teal-300 shadow-xl mb-3 animate-pulse">
                    <User className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activeSession.patientName}</h3>
                  <p className="text-xs text-teal-400 flex items-center gap-1.5 mt-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
                    <span>Live Stream: {activeSession.facilityLocation}</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Consulting with: <strong>{currentUser.fullName} ({currentUser.role})</strong>
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-2">
                  <VideoOff className="w-12 h-12" />
                  <span className="text-xs">Camera Feed Paused</span>
                </div>
              )}

              {/* PiP Inset: Pharmacist / Clinician Self-View */}
              <div className="absolute top-4 right-4 w-36 h-24 rounded-xl bg-slate-900/95 border border-teal-500/50 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-2 text-center">
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold mb-1">
                  Dr
                </div>
                <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{currentUser.fullName}</span>
                <span className="text-[9px] text-teal-300">Host (You)</span>
              </div>

              {/* Patient Vitals Overlay HUD */}
              <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-rose-400" /> Patient Vitals HUD
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-300 text-[10px]">
                  <div>BP: <strong className="text-white">{activeSession.vitals.bp}</strong></div>
                  <div>HR: <strong className="text-emerald-400">{activeSession.vitals.hr} bpm</strong></div>
                  <div>SpO2: <strong className="text-sky-400">{activeSession.vitals.spo2}%</strong></div>
                  <div>Temp: <strong className="text-amber-400">{activeSession.vitals.temp}°C</strong></div>
                </div>
              </div>

              {/* Bottom Video Controls Toolbar */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-white text-xs">{formatCallTime(callDuration)}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAudioActive(!isAudioActive)}
                    className={`p-2.5 rounded-xl transition cursor-pointer ${
                      isAudioActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                    }`}
                    title={isAudioActive ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isAudioActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsVideoActive(!isVideoActive)}
                    className={`p-2.5 rounded-xl transition cursor-pointer ${
                      isVideoActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                    }`}
                    title={isVideoActive ? 'Turn Off Camera' : 'Turn On Camera'}
                  >
                    {isVideoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-2.5 rounded-xl transition cursor-pointer ${
                      isScreenSharing ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title="Share Screen / Lab Slides"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsCallConnected(!isCallConnected)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isCallConnected ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>{isCallConnected ? 'End Call' : 'Reconnect'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('telepharmacy_mtm')}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>e-Prescribe</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Clinical SOAP Case Notes for Active Session */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Active Session Case Summary
                </span>
                <span className="text-[11px] text-slate-400">
                  Priority: <strong className="text-amber-400">{activeSession.triagePriority}</strong>
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Chief Complaint:</strong> {activeSession.chiefComplaint}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                💡 <em>Pharmacist Dawid's Clinical Recommendation:</em> Evaluate Amlodipine 10mg dosing. Dizziness suggests peripheral vasodilation with post-prandial BP drop. Recommend splitting dose or transitioning to low-dose ACE inhibitor + thiazide combination with renal monitoring.
              </div>
            </div>
          </div>

          {/* Right: In-Call Medical Messaging & Triage (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Encrypted Telehealth Chat</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">P2P Secured</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl space-y-1 ${
                    msg.isDoctor
                      ? 'bg-teal-950/40 border border-teal-500/30 text-teal-100 ml-4'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type clinical advice or note..."
                value={currentMessageInput}
                onChange={(e) => setCurrentMessageInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: Telepharmacy Dispensing & Medication Counseling */}
      {activeTab === 'telepharmacy_mtm' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Digital Pharmacy Dispensing
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                e-Prescription Verification & Remote Pharmacist Sign-Off
              </h3>
              <p className="text-xs text-slate-400">
                Verify appropriateness of prescribed therapy, screen for contraindications, and generate an authorized dispensing slip for local dispensary pickup.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Medication & Strength</label>
                  <input
                    type="text"
                    value={rxDrugName}
                    onChange={(e) => setRxDrugName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Dosage Regimen</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Patient Counseling Directions (Telepharmacy MTM)</label>
                <textarea
                  rows={3}
                  value={rxInstructions}
                  onChange={(e) => setRxInstructions(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Dispensing Pharmacist: <strong className="text-white">{currentUser.fullName}</strong>
                </span>

                <button
                  onClick={() => setDispenseVerified(true)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Electronically Sign</span>
                </button>
              </div>

              {dispenseVerified && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    e-Prescription successfully signed by Pharmacist Dawid Aliyi! Dispensing voucher transmitted to Bale Goba Primary Health Center pharmacy dispensary.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Telepharmacy Video Counseling Tips */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>Telepharmacy Counseling Modules</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300">1. Proper Inhaler Technique (MDI & Spacer)</span>
                <p className="text-slate-400 text-[11px]">
                  Demonstrate slow deep inhalation over 5 seconds followed by 10-second breath hold. Rinse mouth after inhaled corticosteroids.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300">2. Insulin Pen Priming & Injection Rotation</span>
                <p className="text-slate-400 text-[11px]">
                  Dial 2 safety units to clear air bubbles before each injection. Rotate abdominal sites to prevent lipohypertrophy.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300">3. Oral Anticoagulation (Warfarin / DOAC) Safety</span>
                <p className="text-slate-400 text-[11px]">
                  Alert patient regarding green leafy vegetables (Vitamin K consistency), signs of hemorrhage, and avoiding concurrent NSAIDs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Patient Triage Queue */}
      {activeTab === 'queue_schedule' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Rural & Referral Telehealth Patient Queue</h3>
              <p className="text-xs text-slate-400">
                Incoming video consultation referrals sorted by clinical urgency and triage priority.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map(s => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSessionId(s.id);
                  setCustomNegotiatedBid(s.negotiatedFeeETB);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-3 ${
                  activeSessionId === s.id
                    ? 'bg-teal-950/30 border-teal-500/60 shadow-lg'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 block">{s.patientMrn}</span>
                    <h4 className="font-bold text-white text-sm mt-0.5">{s.patientName}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.triagePriority.includes('Red')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : s.triagePriority.includes('Yellow')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {s.triagePriority}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                  {s.chiefComplaint}
                </p>

                <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <div>Facility: <strong className="text-slate-200">{s.facilityLocation}</strong></div>
                  <div>Time: <strong className="text-teal-300">{s.scheduledTime}</strong></div>
                  <div className="flex items-center justify-between pt-1">
                    <span>Negotiated Fee:</span>
                    <strong className="text-amber-300 font-mono text-xs">{s.negotiatedFeeETB} ETB</strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('live_room')}
                  className="w-full py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Connect Live Session</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Negotiable Fee & Chapa Settlement */}
      {activeTab === 'negotiate_payment' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Flexible Institutional & Patient Access
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Payment Negotiable Gateway via Chapa & Telebirr
            </h3>
            <p className="text-xs text-slate-400">
              To guarantee healthcare equity across low-resource Ethiopian health centers, patients and clinics can negotiate teleconsultation rates dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Negotiation Bidder Form (7 cols) */}
            <div className="md:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Selected Consultation Case:</span>
                  <span className="font-bold text-white text-sm">{activeSession.patientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Standard Rate:</span>
                  <span className="text-xs font-bold text-slate-400 line-through">{activeSession.standardFeeETB} ETB</span>
                </div>
              </div>

              {/* Negotiation Slider & Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-teal-400" />
                    <span>Your Negotiated Bid Rate (ETB):</span>
                  </label>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    {customNegotiatedBid} ETB
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="500"
                  step="25"
                  value={customNegotiatedBid}
                  onChange={(e) => setCustomNegotiatedBid(parseInt(e.target.value, 10) || 0)}
                  className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 ETB (Free / Subsidized)</span>
                  <span>100 ETB (Standard Rural)</span>
                  <span>250 ETB</span>
                  <span>500 ETB (Specialized MTM)</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Negotiation Rationale / Subsidy Reason:</label>
                <textarea
                  rows={2}
                  value={negotiationNotes}
                  onChange={(e) => setNegotiationNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Remote rural health center referral, student discount, or low-income waiver..."
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Settlement Gateway: <strong className="text-teal-300">Chapa Direct Checkout</strong>
                </div>

                <button
                  onClick={handleExecuteNegotiatedChapaPayment}
                  disabled={paymentProcessing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold transition shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {paymentProcessing ? 'Processing via Chapa...' : `Pay Negotiated ${customNegotiatedBid} ETB via Chapa`}
                  </span>
                </button>
              </div>

              {paymentSuccessData && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Payment Negotiated & Settled via Chapa!</span>
                  </div>
                  <p className="text-[11px]">
                    Reference: <strong className="font-mono text-white">{paymentSuccessData.txRef}</strong> • Amount: <strong>{paymentSuccessData.amountETB} ETB</strong> • Patient: {paymentSuccessData.patientName}
                  </p>
                  <p className="text-[10px] text-emerald-300">
                    Logged permanently in your user payment ledger with automatic receipts.
                  </p>
                </div>
              )}
            </div>

            {/* Chapa Gateway Badges & Banking Rationale (5 cols) */}
            <div className="md:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Chapa Ethiopian Gateway Protocol</span>
              </h4>

              <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <strong>💳 Supported Local Channels:</strong>
                  <ul className="mt-1 space-y-0.5 text-slate-400">
                    <li>• Telebirr Direct API Callbacks</li>
                    <li>• CBE Birr & Awash Bank Direct Debit</li>
                    <li>• Visa, Mastercard & International Diaspora Cards</li>
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <strong>🏥 Healthcare Equity Policy:</strong>
                  <p className="mt-0.5 text-slate-400">
                    No patient in remote Ethiopian kebeles is turned away due to financial constraints. Negotiated rates are automatically reconciled with institutional sponsor grants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
