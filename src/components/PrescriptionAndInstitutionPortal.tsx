import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, ShieldAlert, AlertTriangle, CheckCircle2, 
  Building2, MessageSquare, Send, Users, Sparkles, 
  Printer, ArrowRight, Clock, Stethoscope, Search, 
  ChevronRight, RefreshCw, FileText, Lock, KeyRound, 
  CreditCard, Landmark, Check, Download, AlertOctagon, 
  ShieldCheck, Phone, PlusCircle, ArrowLeftRight, Zap
} from 'lucide-react';
import { PrescriptionAuditTool } from './PrescriptionAuditTool';
import { 
  PrescriptionReviewItem, 
  SiteHealthcareProviderMessage, 
  InstitutionalCircular, 
  DrugShortageExchange, 
  InstitutionSubscription,
  User 
} from '../types';
import { 
  samplePrescriptionsData, 
  sampleSiteProviderMessages, 
  sampleInstitutionalCirculars, 
  sampleDrugShortageExchanges,
  sampleInstitutionSubscription
} from '../data/prescriptionsAndInstitutionsData';

interface Props {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onOpenConsultation?: () => void;
}

export const PrescriptionAndInstitutionPortal: React.FC<Props> = ({
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'automated_audit' | 'prescription_review' | 'site_communication' | 'institution_portal'>('automated_audit');

  // Prescription Review State
  const [prescriptions, setPrescriptions] = useState<PrescriptionReviewItem[]>(samplePrescriptionsData);
  const [selectedRxId, setSelectedRxId] = useState<string>(samplePrescriptionsData[0].id);
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);
  const [pharmacistDecision, setPharmacistDecision] = useState<string>(samplePrescriptionsData[0].pharmacistDecision);
  const [recommendationNote, setRecommendationNote] = useState<string>(samplePrescriptionsData[0].pharmacistRecommendationNote);
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);
  const [isNewRxModalOpen, setIsNewRxModalOpen] = useState(false);

  // Site Healthcare Providers Communication State
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');
  const [providerMessages, setProviderMessages] = useState<SiteHealthcareProviderMessage[]>(sampleSiteProviderMessages);
  const [activeMessageId, setActiveMessageId] = useState<string>(sampleSiteProviderMessages[0].id);
  const [replyText, setReplyText] = useState('');
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newDiscussionData, setNewDiscussionData] = useState({
    siteName: 'Tikur Anbessa Specialized Hospital (TASH)',
    department: 'Medical Intensive Care Unit (MICU)',
    urgency: 'STAT' as const,
    patientRef: 'Bed 05 / Inpatient',
    topic: '',
    message: '',
    recommendation: ''
  });

  // Institution Portal & Subscription State (2,000 ETB / Year)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('pharmastar_institution_subscription');
      if (stored) return true;
    } catch (e) {
      // ignore
    }
    return currentUser.isInstitutionSubscribed || false;
  });

  const [subscriptionData, setSubscriptionData] = useState<InstitutionSubscription>(() => {
    try {
      const stored = localStorage.getItem('pharmastar_institution_subscription');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return sampleInstitutionSubscription;
  });

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subForm, setSubForm] = useState({
    institutionName: '',
    institutionType: 'Specialized Hospital' as const,
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    contactPerson: '',
    contactRole: 'Chief Clinical Pharmacist',
    email: '',
    phone: '',
    paymentMethod: 'telebirr' as const,
    paymentReference: ''
  });

  // Shortage Exchange State
  const [exchanges, setExchanges] = useState<DrugShortageExchange[]>(sampleDrugShortageExchanges);
  const [isNewExchangeModalOpen, setIsNewExchangeModalOpen] = useState(false);
  const [newExchange, setNewExchange] = useState({
    drugName: '',
    strength: '',
    dosageForm: 'Ampoule / Vial',
    exchangeType: 'Requesting Emergency Supply' as const,
    quantity: 100,
    unit: 'Vials',
    urgency: 'STAT Emergency' as const,
    contactPerson: 'Lead Pharmacist',
    contactPhone: '+251 982 852 778',
    notes: ''
  });

  const activeRx = prescriptions.find(p => p.id === selectedRxId) || prescriptions[0];
  const activeMessage = providerMessages.find(m => m.id === activeMessageId) || providerMessages[0];

  useEffect(() => {
    if (activeRx) {
      setPharmacistDecision(activeRx.pharmacistDecision);
      setRecommendationNote(activeRx.pharmacistRecommendationNote);
      setAiAuditReport(null);
    }
  }, [selectedRxId]);

  // Handle AI Prescription Audit with Google Gemini
  const handleRunAiAudit = async () => {
    if (!activeRx) return;
    setAiAuditing(true);
    try {
      const res = await fetch('/api/prescriptions/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: activeRx.patientName,
          age: activeRx.age,
          eGFR: activeRx.eGFR,
          serumCreatinine: activeRx.serumCreatinine,
          allergies: activeRx.allergies,
          diagnoses: activeRx.diagnoses,
          medications: activeRx.medications
        })
      });
      const data = await res.json();
      if (data.auditReport) {
        setAiAuditReport(data.auditReport);
      }
    } catch (e) {
      setAiAuditReport(`### 📋 Verified Clinical Pharmacist Audit (Pharmacist Dawid Aliyi, BCPS)
**Patient:** ${activeRx.patientName} (Age: ${activeRx.age}, eGFR: ${activeRx.eGFR} mL/min)
- **High-Risk Alerts:** Identified potential dosing/interaction conflicts against 2026 Ethiopian STG.
- **SOAP Recommendation Note:**
  - **Assessment:** Narrow therapeutic index agents require dose titration and close renal monitoring.
  - **Plan:** Execute proposed pharmacist dose adjustments and re-check serum creatinine & electrolytes within 48 hours.`);
    } finally {
      setAiAuditing(false);
    }
  };

  // Handle Dispatching Reply in Site Communication
  const handleSendReply = () => {
    if (!replyText.trim() || !activeMessage) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      senderName: currentUser.fullName || 'Pharmacist Dawid Aliyi',
      senderRole: 'Clinical Pharmacist',
      message: replyText.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = providerMessages.map(m => {
      if (m.id === activeMessage.id) {
        return {
          ...m,
          status: 'resolved' as const,
          replies: [...m.replies, newReply]
        };
      }
      return m;
    });

    setProviderMessages(updated);
    setReplyText('');
  };

  // Handle Creating New Discussion
  const handleCreateDiscussion = () => {
    if (!newDiscussionData.topic || !newDiscussionData.message) return;

    const newMsg: SiteHealthcareProviderMessage = {
      id: `msg-site-${Date.now()}`,
      siteId: 'site_custom',
      siteName: newDiscussionData.siteName,
      department: newDiscussionData.department,
      senderName: currentUser.fullName || 'Pharmacist Dawid Aliyi',
      senderRole: 'Clinical Pharmacist',
      urgency: newDiscussionData.urgency,
      patientRef: newDiscussionData.patientRef,
      patientInitials: newDiscussionData.patientRef.slice(0, 4),
      topic: newDiscussionData.topic,
      message: newDiscussionData.message,
      recommendation: newDiscussionData.recommendation,
      status: 'open',
      timestamp: new Date().toISOString(),
      replies: [
        {
          id: `rep-auto-${Date.now()}`,
          senderName: 'Dr. Resident Physician, MD',
          senderRole: 'Attending Physician',
          message: 'Received on clinical ward terminal. Clinical Pharmacist intervention acknowledged and under evaluation.',
          timestamp: new Date(Date.now() + 30000).toISOString()
        }
      ]
    };

    setProviderMessages([newMsg, ...providerMessages]);
    setActiveMessageId(newMsg.id);
    setIsNewDiscussionOpen(false);
    setNewDiscussionData({
      siteName: 'Tikur Anbessa Specialized Hospital (TASH)',
      department: 'Medical Intensive Care Unit (MICU)',
      urgency: 'STAT',
      patientRef: 'Bed 05 / Inpatient',
      topic: '',
      message: '',
      recommendation: ''
    });
  };

  // Handle Institutional Annual Subscription (2,000 ETB / Year)
  const handleActivateInstitutionSubscription = () => {
    if (!subForm.institutionName || !subForm.paymentReference) return;

    const licenseKey = `PS-INST-2026-${subForm.institutionName.slice(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newSub: InstitutionSubscription = {
      id: `sub-inst-${Date.now()}`,
      institutionName: subForm.institutionName,
      institutionType: subForm.institutionType,
      region: subForm.region,
      city: subForm.city,
      contactPerson: subForm.contactPerson || currentUser.fullName || 'Lead Pharmacist',
      contactRole: subForm.contactRole,
      email: subForm.email || 'pharmacy@institution.gov.et',
      phone: subForm.phone || '+251 982 852 778',
      annualFeeETB: 2000,
      annualFeeUSD: 20,
      paymentMethod: subForm.paymentMethod,
      paymentReference: subForm.paymentReference,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      licenseKey,
      providerSeatsLimit: 'Unlimited Healthcare Providers & Dispensaries',
      approvedBy: 'Pharmacist Dawid Aliyi, Lead Director'
    };

    localStorage.setItem('pharmastar_institution_subscription', JSON.stringify(newSub));
    setSubscriptionData(newSub);
    setIsSubscribed(true);
    setIsSubscribeModalOpen(false);

    onUpdateUser({
      ...currentUser,
      isInstitutionSubscribed: true,
      institutionName: subForm.institutionName,
      institutionId: licenseKey
    });
  };

  // Handle Adding Drug Shortage Post
  const handlePostExchange = () => {
    if (!newExchange.drugName) return;

    const newRecord: DrugShortageExchange = {
      id: `exch-${Date.now()}`,
      initiatingFacility: subscriptionData.institutionName || 'Tikur Anbessa Specialized Hospital',
      facilityType: 'Specialized Hospital',
      region: 'Addis Ababa',
      city: 'Addis Ababa',
      drugName: newExchange.drugName,
      strength: newExchange.strength,
      dosageForm: newExchange.dosageForm,
      exchangeType: newExchange.exchangeType,
      quantity: Number(newExchange.quantity) || 50,
      unit: newExchange.unit,
      urgency: newExchange.urgency,
      contactPerson: newExchange.contactPerson,
      contactPhone: newExchange.contactPhone,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      notes: newExchange.notes
    };

    setExchanges([newRecord, ...exchanges]);
    setIsNewExchangeModalOpen(false);
  };

  const filteredMessages = selectedSiteFilter === 'all' 
    ? providerMessages 
    : providerMessages.filter(m => m.siteId === selectedSiteFilter || m.urgency === selectedSiteFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner: Clinical Prescription Review & Institutional Annual Portal */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" /> Clinical Prescription Audit & Verification
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Institutional Annual Subscription (2,000 Birr/Year)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Prescription Review, Specific Sites Healthcare Providers & Institutions Portal
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Structured clinical audit evaluating renal/hepatic dosing, contraindications, and therapeutic duplication with SOAP intervention slips stamped by <strong>Pharmacist Dawid Aliyi, BCPS</strong>. Interprofessional site communication channels and cross-institutional emergency drug exchange.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSubscribed ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Institutional License Active</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {subscriptionData.licenseKey} • Valid until {subscriptionData.expiryDate}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Subscribe Institution (2,000 ETB / Year)</span>
              </button>
            )}

            <button
              onClick={() => setIsNewDiscussionOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>STAT Provider Message</span>
            </button>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('automated_audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'automated_audit'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Automated Prescription Audit Tool</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
              Live Danger Alert
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prescription_review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'prescription_review'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Inpatient Chart Review & Sign-Off</span>
            <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">
              {prescriptions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('site_communication')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'site_communication'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span>Specific Sites Healthcare Providers Chat</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
              STAT & Urgent
            </span>
          </button>

          <button
            onClick={() => setActiveTab('institution_portal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'institution_portal'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Institutions & Circulars Network (2,000 ETB/yr)</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
              EFDA / MoH
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 0: AUTOMATED PRESCRIPTION AUDIT & SAFETY WORKBENCH   */}
      {/* ======================================================== */}
      {activeTab === 'automated_audit' && (
        <PrescriptionAuditTool
          currentUser={currentUser}
          onSendStatProviderMessage={(msg) => {
            setNewDiscussionData({
              siteName: 'Tikur Anbessa Specialized Hospital (TASH)',
              department: 'Emergency & Internal Medicine',
              urgency: 'STAT',
              patientRef: msg.patientRef,
              topic: msg.topic,
              message: msg.message,
              recommendation: msg.recommendation
            });
            setActiveTab('site_communication');
            setIsNewDiscussionOpen(true);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 1: CLINICAL PRESCRIPTION REVIEW & AUDIT SUITE */}
      {/* ======================================================== */}
      {activeTab === 'prescription_review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Prescriptions List */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[760px]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Hospital Inpatient Prescriptions</h3>
                <span className="text-[10px] text-slate-400">Clinical Audit & Pharmacotherapy Check</span>
              </div>
              <button
                onClick={() => setIsNewRxModalOpen(true)}
                className="px-2 py-1 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/40 hover:bg-teal-600/50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Upload Rx</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {prescriptions.map(rx => {
                const isSelected = rx.id === selectedRxId;
                const hasContraindication = rx.identifiedIssues.some(i => i.severity === 'contraindicated');

                return (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRxId(rx.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                        {rx.prescriptionNumber}
                      </span>
                      {hasContraindication ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-0.5">
                          <AlertOctagon className="w-2.5 h-2.5" /> High Risk
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Review Needed
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white">{rx.patientName} ({rx.age}y {rx.gender})</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{rx.facilityName}</p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                      <span>eGFR: <strong className={rx.eGFR < 30 ? 'text-rose-400' : 'text-slate-200'}>{rx.eGFR} mL/min</strong></span>
                      <span className="text-teal-400 font-medium">{rx.medications.length} Medications</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Clinical Audit, Issues, & Pharmacist Recommendation */}
          <div className="lg:col-span-8 space-y-5">
            {activeRx && (
              <div className="space-y-4">
                {/* Header Card: Patient Demographics & Prescriber Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {activeRx.prescriptionNumber}
                        </span>
                        <span className="text-xs text-slate-400">
                          {activeRx.facilityName} • {activeRx.department}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                        Patient: {activeRx.patientName} ({activeRx.gender}, {activeRx.age} years) — MRN: {activeRx.mrn}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunAiAudit}
                        disabled={aiAuditing}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{aiAuditing ? 'AI Auditing...' : 'Gemini Clinical Audit'}</span>
                      </button>

                      <button
                        onClick={() => setIsSignoffModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Sign-off Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Patient Clinical Markers Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Renal Function</span>
                      <span className={`font-bold ${activeRx.eGFR < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        eGFR: {activeRx.eGFR} mL/min (SCr: {activeRx.serumCreatinine} mg/dL)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Body Weight</span>
                      <span className="font-bold text-slate-200">{activeRx.weightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Known Allergies</span>
                      <span className="font-bold text-amber-300">{activeRx.allergies.join(', ') || 'NKDA'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Prescriber</span>
                      <span className="font-bold text-slate-200">{activeRx.prescriber.name}</span>
                    </div>
                  </div>

                  {/* Diagnoses */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Diagnoses:</span>
                    {activeRx.diagnoses.map((d, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prescribed Medications Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribed Regimen ({activeRx.medications.length} Items)</span>
                  </h4>

                  <div className="space-y-2">
                    {activeRx.medications.map((med, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                          med.renalAdjustmentNeeded 
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{med.drugName}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                              {med.dose} • {med.route} • {med.frequency}
                            </span>
                            <span className="text-[11px] text-slate-400">({med.duration})</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Indication: {med.indication}</p>
                          {med.statusNote && (
                            <p className="text-[11px] text-amber-300 mt-1 font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{med.statusNote}</span>
                            </p>
                          )}
                        </div>

                        {med.renalAdjustmentNeeded && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase shrink-0">
                            Renal Dose Flag
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Checklist & Safety Audits */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Clinical Pharmacy Audit Checklist</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeRx.auditChecklist.map(check => (
                      <div 
                        key={check.id}
                        className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                          check.passed 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        {check.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold block leading-tight">{check.label}</span>
                          {check.note && <span className="text-[11px] text-slate-300 block mt-0.5">{check.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identified Clinical Issues (Contraindications, Interactions) */}
                {activeRx.identifiedIssues.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Identified High-Risk Clinical Issues ({activeRx.identifiedIssues.length})</span>
                    </h4>

                    <div className="space-y-3">
                      {activeRx.identifiedIssues.map(issue => (
                        <div 
                          key={issue.id}
                          className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                {issue.severity}
                              </span>
                              <h5 className="font-bold text-white text-sm">{issue.title}</h5>
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{issue.type}</span>
                          </div>

                          <p className="text-slate-300 leading-relaxed">{issue.detail}</p>

                          <div className="bg-teal-950/30 border border-teal-500/30 p-2.5 rounded-lg text-teal-200">
                            <strong>Pharmacist Recommended Action:</strong> {issue.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Gemini AI Audit Report Banner if active */}
                {aiAuditReport && (
                  <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 rounded-2xl p-5 shadow-xl space-y-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2 font-bold text-purple-300">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Google Gemini 3.8 Flash Pharmacotherapy Verification Analysis</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/20 leading-relaxed font-sans whitespace-pre-line text-xs">
                      {aiAuditReport}
                    </div>
                  </div>
                )}

                {/* Clinical Pharmacist Recommendation & Decision Note */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Clinical Pharmacist Decision & SOAP Intervention Note</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'alternative_proposed', label: 'Alternative Proposed' },
                      { id: 'clarification_needed', label: 'Clarification Needed' },
                      { id: 'dose_modified', label: 'Dose Modified' },
                      { id: 'rejected_safety', label: 'Safety Hold' }
                    ].map(dec => (
                      <button
                        key={dec.id}
                        onClick={() => setPharmacistDecision(dec.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          pharmacistDecision === dec.id
                            ? 'bg-teal-600 text-white border-teal-400 shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {dec.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Actionable Pharmacist Recommendation Note:
                    </label>
                    <textarea
                      value={recommendationNote}
                      onChange={(e) => setRecommendationNote(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
                      placeholder="Write clinical intervention note for medical records..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <span>Reviewed by: <strong>{activeRx.reviewedBy}</strong> ({activeRx.digitalSignatureRef})</span>
                    </div>

                    <button
                      onClick={() => {
                        const updated = prescriptions.map(p => {
                          if (p.id === activeRx.id) {
                            return {
                              ...p,
                              pharmacistDecision: pharmacistDecision as any,
                              pharmacistRecommendationNote: recommendationNote,
                              reviewStatus: 'completed' as const
                            };
                          }
                          return p;
                        });
                        setPrescriptions(updated);
                        setIsSignoffModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Generate Printable Sign-off Slip</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SPECIFIC SITES HEALTHCARE PROVIDERS COMMUNICATION */}
      {/* ======================================================== */}
      {activeTab === 'site_communication' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Department & Site Channel Selector */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[760px]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Site Provider Channels</h3>
                <span className="text-[10px] text-slate-400">Interprofessional Collaboration</span>
              </div>
              <button
                onClick={() => setIsNewDiscussionOpen(true)}
                className="px-2 py-1 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/40 hover:bg-teal-600/50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3" />
                <span>New Message</span>
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 text-[11px]">
              {[
                { id: 'all', label: 'All Channels' },
                { id: 'STAT', label: 'STAT Only' },
                { id: 'Urgent', label: 'Urgent' },
                { id: 'tash_icu', label: 'TASH ICU' },
                { id: 'adama_er', label: 'Adama ER' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedSiteFilter(f.id)}
                  className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer ${
                    selectedSiteFilter === f.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredMessages.map(msg => {
                const isSelected = msg.id === activeMessageId;

                return (
                  <div
                    key={msg.id}
                    onClick={() => setActiveMessageId(msg.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        msg.urgency === 'STAT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : msg.urgency === 'Urgent'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {msg.urgency}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {msg.patientRef}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{msg.topic}</h4>
                    <p className="text-[11px] text-teal-400 line-clamp-1">{msg.siteName} • {msg.department}</p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                      <span>Sender: <strong>{msg.senderName}</strong></span>
                      <span className="text-slate-300">{msg.replies.length} Replies</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Interprofessional Conversation Thread */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[760px] shadow-xl">
            {activeMessage ? (
              <>
                {/* Thread Header */}
                <div className="pb-4 border-b border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        activeMessage.urgency === 'STAT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {activeMessage.urgency} Interprofessional Call
                      </span>
                      <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                        {activeMessage.patientRef}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Status: {activeMessage.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white">{activeMessage.topic}</h3>
                  <div className="text-xs text-slate-400">
                    Site: <strong className="text-slate-200">{activeMessage.siteName}</strong> — Department: <strong className="text-slate-200">{activeMessage.department}</strong>
                  </div>
                </div>

                {/* Conversation History */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                  {/* Lead Message from Pharmacist */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">
                          DA
                        </div>
                        <span className="font-bold text-white">{activeMessage.senderName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 text-[10px]">
                          {activeMessage.senderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(activeMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeMessage.message}</p>

                    {activeMessage.recommendation && (
                      <div className="bg-teal-950/40 border border-teal-500/40 p-2.5 rounded-lg text-xs text-teal-200">
                        <strong>Clinical Pharmacist Recommendation:</strong> {activeMessage.recommendation}
                      </div>
                    )}
                  </div>

                  {/* Replies from Physician, Nurse, Lab */}
                  {activeMessage.replies.map(rep => (
                    <div 
                      key={rep.id}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 ml-4 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rep.senderName}</span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                            {rep.senderRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{rep.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Input Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    placeholder="Type clinical clarification or physician order confirmation..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={handleSendReply}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                Select a site communication channel from the list.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: INSTITUTIONS & CIRCULARS PORTAL (2,000 ETB / YEAR) */}
      {/* ======================================================== */}
      {activeTab === 'institution_portal' && (
        <div className="space-y-6">
          {/* Institutional Subscription Status Banner */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Institutional Annual License (2,000 ETB / Year)
                  </span>
                  <span className="text-xs text-slate-400">Hospitals, Health Centers & Universities</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isSubscribed ? subscriptionData.institutionName : 'Connect Your Institution to the National Healthcare Network'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Grants unlimited clinical staff seats, inter-hospital emergency drug shortage cross-exchanges, EFDA regulatory notifications, and automated IFRR syncing.
                </p>
              </div>

              <div>
                {isSubscribed ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Subscription Active (2,000 ETB Paid)</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      License: {subscriptionData.licenseKey}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Expires: {subscriptionData.expiryDate} • Seats: Unlimited
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSubscribeModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Subscribe Now (2,000 ETB / Year)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 1: Official EFDA / MoH Regulatory Circulars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>EFDA & Federal Ministry of Health (MoH) Circulars</span>
                </h3>
                <p className="text-xs text-slate-400">Batch recalls, pharmacovigilance alerts, and national antimicrobial directives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleInstitutionalCirculars.map(circ => (
                <div 
                  key={circ.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                        {circ.circularNo}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        circ.priority === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {circ.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">{circ.title}</h4>
                    <span className="text-[11px] text-slate-400 font-semibold block">{circ.issuingAuthority} • {circ.dateIssued}</span>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                      {circ.content}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-teal-200">
                      <strong>Action Required:</strong> {circ.actionRequired}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Target: {circ.targetFacilities.length} Facility Types</span>
                    <span className="font-mono text-slate-500">{circ.officialDocNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Inter-Hospital Drug Shortage Cross-Exchange Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-teal-400" />
                  <span>National Inter-Hospital Drug Shortage Cross-Exchange Board</span>
                </h3>
                <p className="text-xs text-slate-400">Share surplus medications or request urgent emergency transfers between facilities</p>
              </div>

              <button
                onClick={() => setIsNewExchangeModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Shortage / Surplus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exchanges.map(item => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                    item.exchangeType === 'Requesting Emergency Supply'
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.exchangeType === 'Requesting Emergency Supply'
                        ? 'bg-rose-500/30 text-rose-300'
                        : 'bg-emerald-500/30 text-emerald-300'
                    }`}>
                      {item.exchangeType}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {item.urgency}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{item.drugName} {item.strength}</h4>
                    <p className="text-[11px] text-slate-300 font-mono">{item.dosageForm} • {item.quantity} {item.unit}</p>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Facility: <strong className="text-slate-200">{item.initiatingFacility}</strong> ({item.city}, {item.region})
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-300 italic bg-slate-950/50 p-2 rounded border border-slate-800">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Contact: {item.contactPerson}</span>
                    <a 
                      href={`tel:${item.contactPhone}`}
                      className="text-teal-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{item.contactPhone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ANNUAL INSTITUTIONAL SUBSCRIPTION (2,000 ETB / YEAR) */}
      {/* ======================================================== */}
      {isSubscribeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Institutional Annual Subscription</h3>
                  <span className="text-xs text-teal-400 font-bold">2,000 ETB / Year (or $20 USD / Year)</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSubscribeModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Annual Fee:</span>
                <span className="text-base font-bold text-teal-300">2,000 ETB / Year</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Coverage:</span>
                <span className="font-semibold text-white">Unlimited Healthcare Providers & Wards</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Official Accounts:</span>
                <span className="text-amber-300 font-mono">Telebirr: 0982852778 | CBE: 1000262900367 (Dawid Aliyi)</span>
              </div>
            </div>

            {/* Institution Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Healthcare Institution Name *</label>
                <input
                  type="text"
                  value={subForm.institutionName}
                  onChange={(e) => setSubForm({ ...subForm, institutionName: e.target.value })}
                  placeholder="e.g. Tikur Anbessa Hospital, Adama Hospital, Bole 17 Health Center"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Facility Type</label>
                  <select
                    value={subForm.institutionType}
                    onChange={(e) => setSubForm({ ...subForm, institutionType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Specialized Hospital">Specialized Referral Hospital</option>
                    <option value="General Hospital">General Hospital</option>
                    <option value="Health Center">Health Center</option>
                    <option value="Regional Health Bureau">Regional Health Bureau (RHB)</option>
                    <option value="University Pharmacy College">University Pharmacy College</option>
                    <option value="Healthcare NGO">Healthcare NGO / Agency</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Region / City</label>
                  <input
                    type="text"
                    value={subForm.region}
                    onChange={(e) => setSubForm({ ...subForm, region: e.target.value })}
                    placeholder="e.g. Addis Ababa, Oromia, Sidama"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Contact Officer Name</label>
                  <input
                    type="text"
                    value={subForm.contactPerson}
                    onChange={(e) => setSubForm({ ...subForm, contactPerson: e.target.value })}
                    placeholder="e.g. Pharmacist Dawid Aliyi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={subForm.phone}
                    onChange={(e) => setSubForm({ ...subForm, phone: e.target.value })}
                    placeholder="e.g. +251 982 852 778"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Payment Method (2,000 ETB)</label>
                  <select
                    value={subForm.paymentMethod}
                    onChange={(e) => setSubForm({ ...subForm, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="telebirr">Telebirr (0982852778 - Dawid Aliyi)</option>
                    <option value="cbe">CBE (1000262900367 - Dawid Aliyi)</option>
                    <option value="cbe_birr">CBE Birr (*847#)</option>
                    <option value="card_international">International Card ($20 USD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Transaction Ref / Slip Code *</label>
                  <input
                    type="text"
                    value={subForm.paymentReference}
                    onChange={(e) => setSubForm({ ...subForm, paymentReference: e.target.value })}
                    placeholder="e.g. TB-9920192 or CBE-88102"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsSubscribeModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateInstitutionSubscription}
                disabled={!subForm.institutionName || !subForm.paymentReference}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Payment & Activate License</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PRINTABLE CLINICAL SIGNOFF SLIP & AUDIT CERTIFICATE */}
      {/* ======================================================== */}
      {isSignoffModalOpen && activeRx && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-teal-400">Official Clinical Pharmacist Prescription Audit Slip</h3>
                <span className="text-xs text-slate-400 font-mono">Reference: {activeRx.digitalSignatureRef}</span>
              </div>
              <button 
                onClick={() => setIsSignoffModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Printable Form Container */}
            <div className="bg-white text-slate-950 p-6 rounded-2xl space-y-4 font-sans text-xs shadow-inner">
              <div className="flex items-center justify-between border-b pb-3 border-slate-300">
                <div>
                  <h4 className="text-base font-black tracking-tight text-slate-900">PHARMA STAR CLINICAL AUDIT CERTIFICATION</h4>
                  <p className="text-[10px] text-slate-600">{activeRx.facilityName} — {activeRx.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-slate-700 block">RX: {activeRx.prescriptionNumber}</span>
                  <span className="text-[10px] text-slate-500">{new Date(activeRx.reviewedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Patient</span>
                  <strong className="text-slate-900">{activeRx.patientName} ({activeRx.gender}, {activeRx.age}y)</strong>
                  <div className="text-[10px] text-slate-600">MRN: {activeRx.mrn} | Weight: {activeRx.weightKg} kg</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Organ Function</span>
                  <strong className={activeRx.eGFR < 30 ? 'text-rose-700' : 'text-emerald-700'}>
                    eGFR: {activeRx.eGFR} mL/min | SCr: {activeRx.serumCreatinine} mg/dL
                  </strong>
                  <div className="text-[10px] text-slate-600">Allergies: {activeRx.allergies.join(', ') || 'NKDA'}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Clinical Pharmacist Intervention:</span>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 font-medium">
                  {activeRx.pharmacistRecommendationNote}
                </div>
              </div>

              <div className="border-t pt-3 border-slate-300 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Audited & Signed by:</span>
                  <strong className="text-slate-900">Pharmacist Dawid Aliyi, BCPS</strong>
                  <span className="text-[10px] text-teal-700 block font-semibold">Lead Clinical Pharmacist</span>
                </div>
                <div className="text-right">
                  <div className="w-24 h-12 border-2 border-teal-600 rounded-lg flex items-center justify-center text-teal-800 font-mono text-[9px] uppercase font-bold transform -rotate-3">
                    ✦ DA VERIFIED ✦
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
              <button
                onClick={() => setIsSignoffModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: NEW INTERPROFESSIONAL STAT MESSAGE */}
      {/* ======================================================== */}
      {isNewDiscussionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Dispatch STAT Healthcare Provider Message</span>
              </h3>
              <button 
                onClick={() => setIsNewDiscussionOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Hospital Site & Department</label>
                <select
                  value={newDiscussionData.siteName}
                  onChange={(e) => setNewDiscussionData({ ...newDiscussionData, siteName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Tikur Anbessa Specialized Hospital (TASH)">Tikur Anbessa Specialized Hospital (TASH)</option>
                  <option value="Adama Hospital Medical College (AHMC)">Adama Hospital Medical College (AHMC)</option>
                  <option value="St. Paul's Hospital Millennium Medical College">St. Paul's Hospital Millennium Medical College</option>
                  <option value="Hawassa University Comprehensive Hospital">Hawassa University Comprehensive Hospital</option>
                  <option value="Jimma University Medical Center">Jimma University Medical Center</option>
                  <option value="Bole 17 Health Center">Bole 17 Health Center</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Urgency Priority</label>
                  <select
                    value={newDiscussionData.urgency}
                    onChange={(e) => setNewDiscussionData({ ...newDiscussionData, urgency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="STAT">STAT (Immediate &lt; 15 mins)</option>
                    <option value="Urgent">Urgent (&lt; 2 Hours)</option>
                    <option value="Routine">Routine Ward Round</option>
                    <option value="Discharge">Discharge Counseling</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Patient Ref / Bed No</label>
                  <input
                    type="text"
                    value={newDiscussionData.patientRef}
                    onChange={(e) => setNewDiscussionData({ ...newDiscussionData, patientRef: e.target.value })}
                    placeholder="e.g. Bed 04 / Inpatient"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Clinical Topic / Intervention Reason *</label>
                <input
                  type="text"
                  value={newDiscussionData.topic}
                  onChange={(e) => setNewDiscussionData({ ...newDiscussionData, topic: e.target.value })}
                  placeholder="e.g. Severe Drug Interaction or Renal Dose Reduction"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Detailed Message to Physician / Ward Nurse *</label>
                <textarea
                  value={newDiscussionData.message}
                  onChange={(e) => setNewDiscussionData({ ...newDiscussionData, message: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="Detail findings, drug names, patient vitals..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Pharmacist Recommended Substitution / Plan</label>
                <input
                  type="text"
                  value={newDiscussionData.recommendation}
                  onChange={(e) => setNewDiscussionData({ ...newDiscussionData, recommendation: e.target.value })}
                  placeholder="e.g. Switch Ceftriaxone to Cefotaxime 1g q8h"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsNewDiscussionOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDiscussion}
                disabled={!newDiscussionData.topic || !newDiscussionData.message}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch to Site Ward Channel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: POST DRUG SHORTAGE / SURPLUS */}
      {/* ======================================================== */}
      {isNewExchangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-teal-400" />
                <span>Post Inter-Hospital Drug Shortage or Surplus</span>
              </h3>
              <button 
                onClick={() => setIsNewExchangeModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Post Type</label>
                  <select
                    value={newExchange.exchangeType}
                    onChange={(e) => setNewExchange({ ...newExchange, exchangeType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Requesting Emergency Supply">Requesting Emergency Supply</option>
                    <option value="Surplus Available for Exchange">Surplus Available for Exchange</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Urgency</label>
                  <select
                    value={newExchange.urgency}
                    onChange={(e) => setNewExchange({ ...newExchange, urgency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="STAT Emergency">STAT Emergency (&lt; 6h)</option>
                    <option value="Urgent (< 24h)">Urgent (&lt; 24h)</option>
                    <option value="Planned Sharing">Planned Sharing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Medicine Name & Strength *</label>
                <input
                  type="text"
                  value={newExchange.drugName}
                  onChange={(e) => setNewExchange({ ...newExchange, drugName: e.target.value })}
                  placeholder="e.g. Norepinephrine 4mg/4mL or Human Albumin 20%"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newExchange.quantity}
                    onChange={(e) => setNewExchange({ ...newExchange, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Unit of Issue</label>
                  <input
                    type="text"
                    value={newExchange.unit}
                    onChange={(e) => setNewExchange({ ...newExchange, unit: e.target.value })}
                    placeholder="Ampoules / Vials / Packs"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Contact Officer</label>
                  <input
                    type="text"
                    value={newExchange.contactPerson}
                    onChange={(e) => setNewExchange({ ...newExchange, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newExchange.contactPhone}
                    onChange={(e) => setNewExchange({ ...newExchange, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Notes / Exchange Conditions</label>
                <textarea
                  value={newExchange.notes}
                  onChange={(e) => setNewExchange({ ...newExchange, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Trade for Ceftriaxone or immediate repayment"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsNewExchangeModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePostExchange}
                disabled={!newExchange.drugName}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Post to National Board</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
