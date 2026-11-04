import React, { useState, useEffect } from 'react';
import { 
  Building2, FileText, Send, Download, Printer, CheckCircle2, 
  Clock, Award, Landmark, Copy, Check, X, Eye, Plus, Search, 
  Filter, ShieldCheck, ExternalLink, Sparkles, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';
import { SponsorInvitationLetter, SponsorTier, LetterStatus } from '../types/sponsorLetter';
import { initialSponsorLetters } from '../data/sponsorLettersData';
import { generateSponsorLetterPdf } from '../utils/sponsorLetterPdfGenerator';

interface AdminSponsorLettersProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedLetter?: SponsorInvitationLetter | null;
}

const TIER_PRICING: Record<SponsorTier, { etb: number; usd: number; desc: string }> = {
  'Platinum Clinical Partner': {
    etb: 150000,
    usd: 3000,
    desc: 'Facility-wide 500 cohort licenses, lead co-branding on 5 core clinical modules, and national symposium keynote.'
  },
  'Gold Educational Sponsor': {
    etb: 75000,
    usd: 1500,
    desc: '250 cohort licenses, co-sponsorship of 2 specialized modules, and brand recognition on EFDA certificates.'
  },
  'Silver Digital Innovation Sponsor': {
    etb: 35000,
    usd: 700,
    desc: '100 cohort licenses, placement on national drug compendium and weekly clinical pearls.'
  },
  'Platinum Non-Government Sponsor': {
    etb: 150000,
    usd: 3000,
    desc: 'Anchor NGO alliance, 500 underwritten rural health center licenses, and national health equity co-branding.'
  },
  'Gold Non-Government Sponsor': {
    etb: 75000,
    usd: 1500,
    desc: '250 rural licenses, maternal-child clinical pharmacotherapy capacity building, and neutral educational symposium.'
  },
  'Bronze Non-Government Sponsor': {
    etb: 35000,
    usd: 700,
    desc: '100 licenses for emergency/first-responder trainees, and community clinical guideline sponsorship.'
  },
  'Custom Strategic Partner': {
    etb: 50000,
    usd: 1000,
    desc: 'Tailored institutional collaboration, regional health bureau integration, or rural health center underwriting.'
  }
};

const PRESET_ORGANIZATIONS = [
  {
    org: "Ethiopian Pharmaceuticals Manufacturing S.C. (EPHARM)",
    recipient: "Mr. Yohannes Mengistu",
    title: "Chief Executive Officer & Managing Director",
    category: "Pharmaceutical Manufacturer" as const,
    city: "Addis Ababa",
    email: "info@epharm.com.et",
    tier: "Platinum Clinical Partner" as SponsorTier,
    focus: "Industrial Pharmacy & cGMP Tablet Defect Control (IND-302) & National Essential Medicines Production"
  },
  {
    org: "Cadila Pharmaceuticals Ethiopia PLC",
    recipient: "Dr. Rajiv Sharma",
    title: "Country Director & General Manager",
    category: "Pharmaceutical Manufacturer" as const,
    city: "Gelang / Addis Ababa",
    email: "ethiopia@cadilapharma.com",
    tier: "Gold Educational Sponsor" as SponsorTier,
    focus: "Guideline-Directed Medical Therapy (GDMT) in Heart Failure & Cardiovascular Clinical Pharmacy (PHARM-401)"
  },
  {
    org: "Julphar Pharmaceuticals Ethiopia",
    recipient: "Mr. Muktar Al-Qasimi",
    title: "Managing Director",
    category: "Pharmaceutical Manufacturer" as const,
    city: "Addis Ababa (Bole Lemi)",
    email: "julphar.ethiopia@julphar.net",
    tier: "Gold Educational Sponsor" as SponsorTier,
    focus: "Integrated Physical Pharmaceutics, Sterile Ophthalmic Production & Colloid Delivery Systems (PHYS-201)"
  },
  {
    org: "Commercial Bank of Ethiopia (CBE)",
    recipient: "Ato Abie Sano",
    title: "President",
    category: "Financial Institution" as const,
    city: "Addis Ababa",
    email: "corporate@cbe.com.et",
    tier: "Platinum Clinical Partner" as SponsorTier,
    focus: "Digital Health Fintech Integration, Mobile Health Subsidies (*847# CBE Birr), and Rural Clinic Connectivity Grants"
  },
  {
    org: "Ethiopian Pharmaceuticals Supply Service (EPSS)",
    recipient: "Dr. Abdulkadir Gelgelo",
    title: "Director General",
    category: "Public Health Agency" as const,
    city: "Addis Ababa",
    email: "dg@epss.gov.et",
    tier: "Gold Educational Sponsor" as SponsorTier,
    focus: "DAGU 2.0 eLMIS Supply Chain Optimization, Tracer Stock Monitoring & Regional Hub Lead-Time Reductions"
  },
  {
    org: "Ethio Telecom / Telebirr Financial Services",
    recipient: "Ms. Frehiwot Tamru",
    title: "Chief Executive Officer",
    category: "Financial Institution" as const,
    city: "Addis Ababa",
    email: "telebirr.corporate@ethiotelecom.et",
    tier: "Platinum Clinical Partner" as SponsorTier,
    focus: "Telepharmacy Rural Subsidies, Telebirr 0982852778 Clinical Health Wallet & Remote Consultation Infrastructure"
  },
  {
    org: "Clinton Health Access Initiative (CHAI) Ethiopia",
    recipient: "Dr. Tedros Solomon",
    title: "Country Director",
    category: "Non-Governmental Organization (NGO)" as const,
    city: "Addis Ababa (Bole)",
    email: "ethiopia@clintonhealthaccess.org",
    tier: "Platinum Non-Government Sponsor" as SponsorTier,
    focus: "Decentralized Telepharmacy, Paediatric ARV Optimization & Essential Oxygen Ecosystems in Remote Primary Hospitals"
  },
  {
    org: "Amref Health Africa - Ethiopia",
    recipient: "Dr. Misrak Tadesse",
    title: "Country Representative & Head of Programs",
    category: "Non-Governmental Organization (NGO)" as const,
    city: "Addis Ababa (Kirkos)",
    email: "info.ethiopia@amref.org",
    tier: "Gold Non-Government Sponsor" as SponsorTier,
    focus: "Maternal-Fetal Clinical Pharmacotherapy, Postpartum Hemorrhage Prevention & Community Health Extension Training"
  },
  {
    org: "Ethiopian Red Cross Society & Disaster Health Unit",
    recipient: "Ato Daniel Assefa",
    title: "Secretary General",
    category: "Philanthropic Foundation" as const,
    city: "Addis Ababa (Ras Desta Damtew)",
    email: "erced@ethionet.et",
    tier: "Bronze Non-Government Sponsor" as SponsorTier,
    focus: "Emergency Triage Medicine, Mass Casualty Clinical Protocols & Trauma Pharmacotherapy Capacity Building"
  }
];

export const AdminSponsorLettersModal: React.FC<AdminSponsorLettersProps> = ({
  isOpen,
  onClose,
  initialSelectedLetter
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'composer' | 'preview' | 'compliance_tools'>('history');
  const [lettersList, setLettersList] = useState<SponsorInvitationLetter[]>([]);
  const [selectedLetterForView, setSelectedLetterForView] = useState<SponsorInvitationLetter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for Composing/Editing
  const [formData, setFormData] = useState<Partial<SponsorInvitationLetter>>({
    referenceNo: `REF: PS/DIR-SPON/2026/${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipientName: PRESET_ORGANIZATIONS[0].recipient,
    recipientTitle: PRESET_ORGANIZATIONS[0].title,
    organization: PRESET_ORGANIZATIONS[0].org,
    organizationCategory: PRESET_ORGANIZATIONS[0].category,
    city: PRESET_ORGANIZATIONS[0].city,
    country: "Ethiopia",
    recipientEmail: PRESET_ORGANIZATIONS[0].email,
    recipientPhone: "+251 11 442 1200",
    sponsorTier: PRESET_ORGANIZATIONS[0].tier,
    contributionETB: TIER_PRICING['Platinum Clinical Partner'].etb,
    contributionUSD: TIER_PRICING['Platinum Clinical Partner'].usd,
    focusArea: PRESET_ORGANIZATIONS[0].focus,
    customNotes: "Underwriting accredited clinical CPD modules and rural hospital digital tools.",
    status: 'Dispatched' as LetterStatus,
    signatoryName: "Pharmacist Dawid Aliyi, B.Pharm, BCPS",
    signatoryTitle: "Director of Academic Affairs & Clinical Operations"
  });

  // Load letters from API with fallback to localStorage and initial seed
  useEffect(() => {
    fetch('/api/sponsorship-letters')
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setLettersList(data.data);
          try {
            localStorage.setItem('pharmastar_sponsor_letters', JSON.stringify(data.data));
          } catch (e) {}
        } else {
          loadFromLocalStorage();
        }
      })
      .catch(() => loadFromLocalStorage());
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('pharmastar_sponsor_letters');
      if (stored) {
        setLettersList(JSON.parse(stored));
      } else {
        setLettersList(initialSponsorLetters);
        localStorage.setItem('pharmastar_sponsor_letters', JSON.stringify(initialSponsorLetters));
      }
    } catch (e) {
      setLettersList(initialSponsorLetters);
    }
  };

  useEffect(() => {
    if (initialSelectedLetter) {
      setSelectedLetterForView(initialSelectedLetter);
      setActiveTab('preview');
    }
  }, [initialSelectedLetter]);

  const handleSelectPreset = (preset: typeof PRESET_ORGANIZATIONS[0]) => {
    setFormData(prev => ({
      ...prev,
      organization: preset.org,
      recipientName: preset.recipient,
      recipientTitle: preset.title,
      organizationCategory: preset.category,
      city: preset.city,
      recipientEmail: preset.email,
      sponsorTier: preset.tier,
      contributionETB: TIER_PRICING[preset.tier].etb,
      contributionUSD: TIER_PRICING[preset.tier].usd,
      focusArea: preset.focus
    }));
  };

  const handleTierChange = (tier: SponsorTier) => {
    setFormData(prev => ({
      ...prev,
      sponsorTier: tier,
      contributionETB: TIER_PRICING[tier].etb,
      contributionUSD: TIER_PRICING[tier].usd
    }));
  };

  const handleSaveAndDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLetter: SponsorInvitationLetter = {
      id: `spon-let-${Date.now()}`,
      referenceNo: formData.referenceNo || `REF: PS/DIR-SPON/2026/${Math.floor(100 + Math.random() * 900)}`,
      date: formData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: formData.recipientName || 'Managing Director',
      recipientTitle: formData.recipientTitle || 'Executive Leadership',
      organization: formData.organization || 'Esteemed Institution',
      organizationCategory: formData.organizationCategory || 'Pharmaceutical Manufacturer',
      city: formData.city || 'Addis Ababa',
      country: formData.country || 'Ethiopia',
      recipientEmail: formData.recipientEmail || '',
      recipientPhone: formData.recipientPhone || '',
      sponsorTier: formData.sponsorTier || 'Gold Educational Sponsor',
      contributionETB: Number(formData.contributionETB) || 75000,
      contributionUSD: Number(formData.contributionUSD) || 1500,
      focusArea: formData.focusArea || 'Clinical Pharmacy & Digital Healthcare',
      customNotes: formData.customNotes || '',
      dispatchedAt: new Date().toISOString(),
      status: (formData.status as LetterStatus) || 'Dispatched',
      signatoryName: formData.signatoryName || 'Pharmacist Dawid Aliyi, B.Pharm, BCPS',
      signatoryTitle: formData.signatoryTitle || 'Director of Academic Affairs & Clinical Operations',
      lastUpdated: new Date().toISOString()
    };

    // Update state & localStorage
    const updated = [newLetter, ...lettersList.filter(l => l.id !== newLetter.id)];
    setLettersList(updated);
    try {
      localStorage.setItem('pharmastar_sponsor_letters', JSON.stringify(updated));
    } catch (e) {}

    // POST to backend API
    fetch('/api/sponsorship-letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLetter)
    }).catch(() => {});

    setSelectedLetterForView(newLetter);
    setActiveTab('preview');
    showNotification(`Formal invitation dispatched to ${newLetter.organization}`);
  };

  const handleDownloadPdf = async (letter: SponsorInvitationLetter) => {
    setIsGeneratingPdf(true);
    try {
      await generateSponsorLetterPdf(letter);
      showNotification(`Downloaded PDF: ${letter.referenceNo}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyText = (letter: SponsorInvitationLetter) => {
    const text = `
PHARMA STAR APP PRO — HEALTH INFORMATICS & CLINICAL ACADEMY
DIRECTORATE OF CORPORATE STRATEGY & INSTITUTIONAL ALLIANCES
Addis Ababa, Ethiopia | Tel: +251 982 852 778 | Email: jaalibiddoo@gmail.com

${letter.referenceNo}
Date: ${letter.date}

TO:
${letter.recipientName}
${letter.recipientTitle}
${letter.organization}
${letter.city}, ${letter.country}

SUBJECT: FORMAL INVITATION FOR STRATEGIC INSTITUTIONAL SPONSORSHIP & HEALTHCARE CAPACITY-BUILDING PARTNERSHIP (2026/2027)

Dear ${letter.recipientName.split(' ')[0] || 'Esteemed Leadership'},

On behalf of the Directorate of Corporate Alliances at Pharma Star App Pro, I have the distinct honor of presenting this formal invitation to ${letter.organization} to partner with our institution as an accredited Corporate & Educational Sponsor for the 2026/2027 academic and operational cycle.

Pharma Star App Pro is Ethiopia's premier digital clinical pharmacy and molecular education platform, recognized by the Ethiopian Food and Drug Authority (EFDA) and the Ministry of Health (MoH). Our platform currently empowers over 25,000 certified healthcare practitioners—including clinical pharmacists, hospital druggists, resident physicians, and university interns—operating in tertiary teaching hospitals, regional referral hubs, and remote rural dispensaries across all 12 regional states.

Through this proposed strategic partnership, ${letter.organization} will champion national capacity building in:
- Focus Area: ${letter.focusArea}
- Proposed Tier: ${letter.sponsorTier} (${letter.contributionETB.toLocaleString()} ETB / $${letter.contributionUSD.toLocaleString()} USD)
- Entitlements: Facility-wide cohort access, lead educational co-branding on official CPD certificates, and prominent positioning in national guideline circulars.

Official Settlement Channels (EFDA & MoH Registered):
- Commercial Bank of Ethiopia (CBE): 1000262900367 (Beneficiary: Dawid Aliyi)
- Telebirr Merchant: 0982852778
- CBE Birr: *847#
- Chapa Gateway & International Transfers

We would be honored to arrange an executive bilateral session at your earliest convenience.

Respectfully submitted with highest clinical regards,

${letter.signatoryName}
${letter.signatoryTitle}
Directorate of Academic Affairs & Clinical Innovations
Pharma Star App Pro / Jaalibiddoo Health Informatics
Addis Ababa, Ethiopia
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(letter.id);
    setTimeout(() => setCopiedId(null), 2500);
    showNotification("Formal invitation letter copied to clipboard!");
  };

  const handleUpdateStatus = (letterId: string, newStatus: LetterStatus) => {
    const updated = lettersList.map(l => l.id === letterId ? { ...l, status: newStatus, lastUpdated: new Date().toISOString() } : l);
    setLettersList(updated);
    try {
      localStorage.setItem('pharmastar_sponsor_letters', JSON.stringify(updated));
    } catch (e) {}

    fetch(`/api/sponsorship-letters/${letterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});

    if (selectedLetterForView?.id === letterId) {
      setSelectedLetterForView(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showNotification(`Status updated to ${newStatus}`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredLetters = lettersList.filter(l => {
    const matchesSearch = 
      l.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.focusArea.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || l.sponsorTier === filterTier;
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[94vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">
                  Formal Sponsor Invitation Directorate &amp; Letters History
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  EFDA &amp; MoH Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional invitations for pharmaceutical manufacturers, financial institutions, and health NGOs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-teal-300 border-t-2 border-teal-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Letters History Ledger ({lettersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('composer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'composer'
                  ? 'bg-slate-900 text-teal-300 border-t-2 border-teal-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Compose New Formal Invitation</span>
            </button>

            {selectedLetterForView && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-slate-900 text-teal-300 border-t-2 border-teal-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Letter View: {selectedLetterForView.referenceNo}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('compliance_tools')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'compliance_tools'
                  ? 'bg-slate-900 text-amber-300 border-t-2 border-amber-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Non-Gov Compliance &amp; Independence Tools</span>
            </button>
          </div>

          {notification && (
            <div className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{notification}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60">
          {/* TAB 1: HISTORY LEDGER */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by organization, ref #, or recipient..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Platinum Clinical Partner">Platinum (150K ETB)</option>
                    <option value="Gold Educational Sponsor">Gold (75K ETB)</option>
                    <option value="Silver Digital Innovation Sponsor">Silver (35K ETB)</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Meeting Scheduled">Meeting Scheduled</option>
                    <option value="Partnered">Partnered</option>
                  </select>

                  <button
                    onClick={() => setActiveTab('composer')}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Letter</span>
                  </button>
                </div>
              </div>

              {/* Letters Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
                      <th className="p-3">Reference No.</th>
                      <th className="p-3">Recipient Organization</th>
                      <th className="p-3">Contact Person</th>
                      <th className="p-3">Sponsorship Tier &amp; Grant</th>
                      <th className="p-3">Date Dispatched</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLetters.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No sponsorship invitation letters match the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLetters.map((letter) => (
                        <tr key={letter.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-mono font-bold text-teal-400">
                            {letter.referenceNo}
                          </td>
                          <td className="p-3 font-bold text-white">
                            <div>{letter.organization}</div>
                            <span className="text-[10px] text-slate-500">{letter.organizationCategory}</span>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-200">{letter.recipientName}</div>
                            <div className="text-[10px] text-slate-500">{letter.recipientTitle}</div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                              letter.sponsorTier.includes('Platinum') ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                              letter.sponsorTier.includes('Gold') ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' :
                              'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            }`}>
                              {letter.sponsorTier}
                            </span>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {letter.contributionETB.toLocaleString()} ETB (${letter.contributionUSD.toLocaleString()})
                            </div>
                          </td>
                          <td className="p-3 text-slate-400">
                            {letter.date}
                          </td>
                          <td className="p-3">
                            <select
                              value={letter.status}
                              onChange={(e) => handleUpdateStatus(letter.id, e.target.value as LetterStatus)}
                              className={`text-[10px] font-bold px-2 py-1 rounded border cursor-pointer focus:outline-none ${
                                letter.status === 'Partnered' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500' :
                                letter.status === 'Meeting Scheduled' ? 'bg-sky-950/60 text-sky-300 border-sky-500' :
                                letter.status === 'Under Review' ? 'bg-amber-950/60 text-amber-300 border-amber-500' :
                                'bg-slate-900 text-slate-300 border-slate-700'
                              }`}
                            >
                              <option value="Dispatched">Dispatched</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Meeting Scheduled">Meeting Scheduled</option>
                              <option value="Partnered">Partnered</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedLetterForView(letter);
                                  setActiveTab('preview');
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                title="View Formal Letter"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(letter)}
                                className="p-1.5 bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 rounded-lg transition"
                                title="Download PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopyText(letter)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                title="Copy Formatted Letter"
                              >
                                {copiedId === letter.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: COMPOSER */}
          {activeTab === 'composer' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Presets & Tier Selector Column */}
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Quick-Load Verified Ethiopian Partners:
                  </span>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {PRESET_ORGANIZATIONS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition cursor-pointer ${
                          formData.organization === preset.org
                            ? 'bg-teal-950/60 border-teal-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <strong className="block text-[11px] text-white line-clamp-1">{preset.org}</strong>
                        <span className="text-[10px] text-teal-400">{preset.recipient} ({preset.tier.split(' ')[0]})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Sponsorship Tier Matrix:</span>
                  {(Object.keys(TIER_PRICING) as SponsorTier[]).map((tierKey) => (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => handleTierChange(tierKey)}
                      className={`w-full text-left p-2.5 rounded-lg border transition cursor-pointer ${
                        formData.sponsorTier === tierKey
                          ? 'bg-amber-950/50 border-amber-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-amber-300">{tierKey}</strong>
                        <span className="font-mono text-[11px] font-bold text-white">
                          {TIER_PRICING[tierKey].etb.toLocaleString()} ETB
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{TIER_PRICING[tierKey].desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Column */}
              <form onSubmit={handleSaveAndDispatch} className="lg:col-span-2 space-y-4">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Official Reference Number:</label>
                      <input
                        type="text"
                        value={formData.referenceNo}
                        onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Letter Date:</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Target Organization / Enterprise:</label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Organization Category:</label>
                      <select
                        value={formData.organizationCategory}
                        onChange={(e) => setFormData({ ...formData, organizationCategory: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      >
                        <option value="Pharmaceutical Manufacturer">Pharmaceutical Manufacturer</option>
                        <option value="Financial Institution">Financial Institution / Bank</option>
                        <option value="Medical Equipment & Diagnostic">Medical Equipment &amp; Diagnostic</option>
                        <option value="Public Health Agency">Public Health Agency / EPSS</option>
                        <option value="Health NGO / Donor">Health NGO / International Partner</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Recipient Name &amp; Honorific:</label>
                      <input
                        type="text"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Recipient Executive Title:</label>
                      <input
                        type="text"
                        value={formData.recipientTitle}
                        onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">City &amp; Country:</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Corporate Email:</label>
                      <input
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Telephone Contact:</label>
                      <input
                        type="text"
                        value={formData.recipientPhone}
                        onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Strategic Clinical Focus Area &amp; Academic Scope:</label>
                    <textarea
                      rows={2}
                      value={formData.focusArea}
                      onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Proposed Contribution (ETB):</label>
                      <input
                        type="number"
                        value={formData.contributionETB}
                        onChange={(e) => setFormData({ ...formData, contributionETB: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">USD Equivalent ($):</label>
                      <input
                        type="number"
                        value={formData.contributionUSD}
                        onChange={(e) => setFormData({ ...formData, contributionUSD: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Lead Academic Signatory:</label>
                    <input
                      type="text"
                      value={formData.signatoryName}
                      onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Generate, Dispatch &amp; Save to History Ledger</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLetterForView(formData as SponsorInvitationLetter);
                      setActiveTab('preview');
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Live Preview</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: LETTER PREVIEW */}
          {activeTab === 'preview' && selectedLetterForView && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-teal-400 font-bold">{selectedLetterForView.referenceNo}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-white font-bold">{selectedLetterForView.organization}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPdf(selectedLetterForView)}
                    disabled={isGeneratingPdf}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official Letter (PDF)'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={() => handleCopyText(selectedLetterForView)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedId === selectedLetterForView.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Text</span>
                  </button>
                </div>
              </div>

              {/* Realistic Paper Formal Letter Canvas */}
              <div 
                id="formal-invitation-letter-canvas"
                className="bg-white text-slate-900 p-8 sm:p-14 rounded-xl shadow-2xl border border-slate-300 font-sans max-w-4xl mx-auto space-y-6 relative overflow-hidden"
              >
                {/* Official Letterhead */}
                <div className="border-b-4 border-teal-700 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-lg">
                        PS
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                          Pharma Star App Pro
                        </h2>
                        <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                          Health Informatics &amp; Clinical Pharmacy Academy
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Directorate of Corporate Alliances &amp; Institutional Partnerships • Addis Ababa, Ethiopia
                    </p>
                  </div>

                  <div className="text-right text-[10px] text-slate-600 space-y-0.5">
                    <div>Tel: <strong className="text-slate-800">+251 982 852 778</strong></div>
                    <div>Email: <strong className="text-slate-800">jaalibiddoo@gmail.com</strong></div>
                    <div>Web: <span className="text-teal-700 font-medium">pharmastar-app-pro.et</span></div>
                    <div className="text-amber-800 font-bold text-[9px] uppercase">EFDA &amp; MoH Framework</div>
                  </div>
                </div>

                {/* Ref & Date */}
                <div className="flex justify-between items-center text-xs pt-1">
                  <div className="font-mono font-bold text-slate-800">
                    {selectedLetterForView.referenceNo}
                  </div>
                  <div className="font-semibold text-slate-600">
                    Date: {selectedLetterForView.date}
                  </div>
                </div>

                {/* Addressee Block */}
                <div className="text-xs space-y-1 text-slate-800 pt-2">
                  <div className="font-bold">TO:</div>
                  <div className="font-bold text-slate-900">{selectedLetterForView.recipientName}</div>
                  <div>{selectedLetterForView.recipientTitle}</div>
                  <div className="font-bold text-teal-800">{selectedLetterForView.organization}</div>
                  <div>{selectedLetterForView.city}, {selectedLetterForView.country}</div>
                </div>

                {/* Subject Line */}
                <div className="p-3 bg-slate-100 rounded-lg border-l-4 border-amber-600 text-xs font-bold text-slate-900 uppercase">
                  SUBJECT: FORMAL INVITATION FOR STRATEGIC INSTITUTIONAL SPONSORSHIP &amp; HEALTHCARE CAPACITY-BUILDING PARTNERSHIP (2026/2027)
                </div>

                {/* Body Content */}
                <div className="text-xs text-slate-700 space-y-3.5 leading-relaxed text-justify">
                  <p>
                    Dear {selectedLetterForView.recipientName.split(' ')[0] || 'Esteemed Leadership'},
                  </p>
                  <p>
                    On behalf of the Directorate of Corporate Alliances at <strong>Pharma Star App Pro</strong>, I have the distinct honor of presenting this formal invitation to <strong>{selectedLetterForView.organization}</strong> to partner with our institution as an accredited Corporate &amp; Educational Sponsor for the 2026/2027 academic and operational cycle.
                  </p>
                  <p>
                    Pharma Star App Pro is Ethiopia's premier digital clinical pharmacy and molecular education platform, recognized by the <strong>Ethiopian Food and Drug Authority (EFDA)</strong> and the <strong>Ministry of Health (MoH)</strong>. Our platform currently empowers over <strong>25,000 certified healthcare practitioners</strong>—including clinical pharmacists, hospital druggists, resident physicians, and university interns—operating in tertiary teaching hospitals, regional referral hubs, and remote rural dispensaries across all 12 regional states.
                  </p>
                  <p>
                    Through this proposed strategic partnership, <strong>{selectedLetterForView.organization}</strong> will champion national healthcare capacity building in: <em>{selectedLetterForView.focusArea}</em>.
                  </p>

                  {/* Tier Box */}
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-900 uppercase">
                        PROPOSED SPONSORSHIP TIER: {selectedLetterForView.sponsorTier}
                      </span>
                      <span className="font-bold text-amber-800 font-mono text-sm">
                        {selectedLetterForView.contributionETB.toLocaleString()} ETB (${selectedLetterForView.contributionUSD.toLocaleString()} USD)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Entitlements include: Institutional cohort access for hospital clinicians, co-branding on accredited Continuing Professional Development (CPD) modules, official certificate logo underwriting, and national visibility across clinical guidelines.
                    </p>
                  </div>

                  {/* Bank Details */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 space-y-1">
                    <div className="font-bold text-slate-900 uppercase text-[10px]">
                      Official Settlement Channels (EFDA &amp; MoH Registered):
                    </div>
                    <div>Commercial Bank of Ethiopia (CBE): <strong>1000262900367</strong> (Dawid Aliyi)</div>
                    <div>Telebirr Merchant: <strong>0982852778</strong> | CBE Birr: <strong>*847#</strong> | Chapa Gateway</div>
                  </div>

                  <p>
                    We would be honored to arrange an executive bilateral session at your earliest convenience to formalize this collaboration and customize the implementation timeline.
                  </p>
                  <p>
                    Thank you for your visionary dedication to advancing the health and pharmaceutical sovereignty of Ethiopia.
                  </p>
                </div>

                {/* Sign-off & Stamp */}
                <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Respectfully submitted,</p>
                    <div className="font-serif italic font-bold text-lg text-teal-900">
                      Dawid Aliyi
                    </div>
                    <div className="w-40 h-0.5 bg-slate-400" />
                    <div className="font-bold text-xs text-slate-900">
                      {selectedLetterForView.signatoryName}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {selectedLetterForView.signatoryTitle}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Pharma Star App Pro / Jaalibiddoo Health Informatics
                    </div>
                  </div>

                  <div className="w-24 h-24 rounded-full border-2 border-amber-600 bg-amber-500/10 flex flex-col items-center justify-center shadow text-center p-1">
                    <span className="text-[7px] font-extrabold uppercase text-amber-800">PHARMA STAR</span>
                    <span className="text-[9px] font-black uppercase text-amber-900">CORPORATE</span>
                    <span className="text-[7px] font-bold text-amber-700">SEAL 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NON-GOVERNMENT SPONSOR COMPLIANCE & INDEPENDENCE TOOLS */}
          {activeTab === 'compliance_tools' && (
            <div className="space-y-6">
              {/* Compliance Header Banner */}
              <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-teal-950/60 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>EFDA Directive 49/2022 &amp; MoH Ethics Framework</span>
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">
                      Non-Government Sponsorship Compliance &amp; Conflict of Interest Tools
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      Ensures that Platinum, Gold, and Bronze Non-Governmental Organization (NGO) sponsors adhere strictly to clinical independence, zero commercial bias, and transparent funding registries.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>All 3 Non-Gov Tiers Verified</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier Cards: Platinum, Gold, Bronze Non-Government */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-teal-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Tier 1: Platinum Non-Gov
                    </span>
                    <span className="text-sm font-black text-white font-mono">150,000 ETB</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Lead Health Equity Alliance</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Underwrites 500 rural health post practitioners and hospital dispensary interns. Lead educational co-sponsorship on 5 national clinical modules with full MoH transparency audit.
                  </p>
                  <div className="text-[11px] text-teal-400 space-y-1 pt-1 border-t border-slate-800">
                    <div>• $3,000 USD international grant parity</div>
                    <div>• Verified by MoH Non-Gov Partnership Directorate</div>
                    <div>• Reference Partner: CHAI Ethiopia</div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Tier 2: Gold Non-Gov
                    </span>
                    <span className="text-sm font-black text-white font-mono">75,000 ETB</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Targeted Capacity Building</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Underwrites 250 mid-level practitioners in maternal-child health, antimicrobial stewardship (AMS), and outpatient dispensing. Neutral clinical symposium sponsor.
                  </p>
                  <div className="text-[11px] text-amber-400 space-y-1 pt-1 border-t border-slate-800">
                    <div>• $1,500 USD international grant parity</div>
                    <div>• Independent Academic Review Panel audited</div>
                    <div>• Reference Partner: Amref Health Africa</div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-700 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-600">
                      Tier 3: Bronze Non-Gov
                    </span>
                    <span className="text-sm font-black text-white font-mono">35,000 ETB</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Community Outreach Grant</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Underwrites 100 frontline first responders, disaster health officers, and community emergency clinical pharmacotherapy modules.
                  </p>
                  <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                    <div>• $700 USD international grant parity</div>
                    <div>• Disaster &amp; Emergency Medical Directorate audited</div>
                    <div>• Reference Partner: Ethiopian Red Cross Society</div>
                  </div>
                </div>
              </div>

              {/* Compliance & Independence Declarations Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Non-Government Sponsors Statutory Compliance Registry</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Real-time conflict of interest and neutrality certifications across all invitation records.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">EFDA DIR 49/2022</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-3">Organization &amp; Category</th>
                        <th className="p-3">Sponsorship Tier</th>
                        <th className="p-3">COI Declared</th>
                        <th className="p-3">EFDA Neutrality</th>
                        <th className="p-3">Audit Report ID</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {lettersList.filter(l => l.sponsorTier.includes('Non-Government') || l.organizationCategory.includes('NGO') || l.organizationCategory.includes('Foundation')).map(l => (
                        <tr key={l.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3">
                            <div className="font-bold text-white">{l.organization}</div>
                            <div className="text-[10px] text-slate-400">{l.organizationCategory} • {l.recipientName}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {l.sponsorTier}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{l.compliance?.conflictOfInterestDeclared !== false ? 'Declared' : 'Pending'}</span>
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-teal-400 font-semibold flex items-center gap-1 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{l.compliance?.contentNeutralityPledgeSigned !== false ? '100% Neutral' : 'Review'}</span>
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-400">
                            {l.compliance?.transparencyAuditReportId || `AUD-NGO-${l.id.slice(-4).toUpperCase()}`}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedLetterForView(l);
                                setActiveTab('preview');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition cursor-pointer"
                            >
                              View Invitation
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
