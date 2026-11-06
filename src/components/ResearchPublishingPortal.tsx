import React, { useState } from 'react';
import { 
  BookMarked, FileText, Sparkles, Building2, 
  Search, CheckCircle2, Download, Printer, 
  PlusCircle, Award, ExternalLink, ShieldCheck, 
  Check, Lock, CreditCard, Landmark, ChevronRight,
  Eye, FileCheck, Share2
} from 'lucide-react';
import { ResearchManuscript, User } from '../types';
import { sampleResearchManuscripts } from '../data/researchPublishingData';

interface Props {
  currentUser: User;
  onOpenAuthModal?: () => void;
}

export const ResearchPublishingPortal: React.FC<Props> = ({ currentUser }) => {
  const [manuscripts, setManuscripts] = useState<ResearchManuscript[]>(sampleResearchManuscripts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedManuscript, setSelectedManuscript] = useState<ResearchManuscript | null>(sampleResearchManuscripts[0]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certManuscript, setCertManuscript] = useState<ResearchManuscript | null>(null);

  // Form State for 1,000 Birr Submission
  const [submitForm, setSubmitForm] = useState({
    title: '',
    abstract: '',
    leadInstitution: 'Addis Ababa University - College of Health Sciences',
    irbApprovalNumber: '',
    researchCategory: 'Clinical Pharmacy & Therapeutics' as const,
    authorName: currentUser.fullName || 'Lead Pharmacist Investigator',
    authorTitle: 'Clinical Pharmacist & Researcher',
    authorEmail: currentUser.email || 'researcher@institution.edu.et',
    keywords: 'Clinical Pharmacy, Ethiopia, Pharmacotherapy',
    paymentMethod: 'telebirr' as const,
    paymentReference: '',
    fullText: ''
  });

  const categories = [
    { id: 'all', label: 'All 4 Categories' },
    { id: 'Clinical Pharmacy & Therapeutics', label: 'Clinical Pharmacy & TDM' },
    { id: 'Antimicrobial Resistance (AMR)', label: 'AMR & Microbiology' },
    { id: 'Traditional Herbal Medicine & Phytochemistry', label: 'Traditional Medicine (Bisana)' },
    { id: 'Health Economics & EPSS Supply Chain', label: 'IPLS & Supply Chain' },
  ];

  const filteredManuscripts = manuscripts.filter(m => {
    const matchCat = selectedCategory === 'all' || m.researchCategory === selectedCategory;
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.leadInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.doi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePublishRequest = async () => {
    if (!submitForm.title || !submitForm.abstract || !submitForm.paymentReference) return;

    const doi = `10.5829/pharmastar.2026.${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}`;
    const newDoc: ResearchManuscript = {
      id: `manuscript-${Date.now()}`,
      doi,
      title: submitForm.title,
      abstract: submitForm.abstract,
      leadInstitution: submitForm.leadInstitution,
      irbApprovalNumber: submitForm.irbApprovalNumber || `IRB-ETH-${Date.now().toString().slice(-5)}`,
      researchCategory: submitForm.researchCategory,
      authors: [
        {
          name: submitForm.authorName,
          title: submitForm.authorTitle,
          affiliation: submitForm.leadInstitution,
          email: submitForm.authorEmail,
          isCorresponding: true
        },
        {
          name: 'Pharmacist Dawid Aliyi, BCPS',
          title: 'Senior Clinical Reviewer & Peer Editor',
          affiliation: 'Pharma Star Research Division',
          isCorresponding: false
        }
      ],
      keywords: submitForm.keywords.split(',').map(k => k.trim()),
      publicationStatus: 'published',
      submissionFeeETB: 1000,
      submissionFeeUSD: 10,
      paymentMethod: submitForm.paymentMethod,
      paymentReference: submitForm.paymentReference,
      submittedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      citationCount: 1,
      peerReviewScore: 9.6,
      chiefEditorSignoff: 'Pharmacist Dawid Aliyi, Editor-in-Chief',
      journalVolume: `Pharma Star Ethiopian Medical Journal, Vol. 4, Issue 2 (${new Date().getFullYear()})`,
      fullArticleText: submitForm.fullText || submitForm.abstract
    };

    setManuscripts([newDoc, ...manuscripts]);
    setSelectedManuscript(newDoc);
    setIsSubmitModalOpen(false);
    setCertManuscript(newDoc);
    setIsCertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <BookMarked className="w-3.5 h-3.5" /> Ethiopian Institutions Scientific Publishing Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                1,000 Birr (ETB) Per Publication Request
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Peer-Reviewed Research Publishing for Ethiopian Health & Academic Institutions
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Official institutional portal for publishing and indexing original clinical trials, pharmacovigilance surveillance, traditional Ethiopian phytochemistry, and health supply chain research. Peer-reviewed with verified DOI issuance stamped by <strong>Editor-in-Chief Pharmacist Dawid Aliyi, BCPS</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Research (1,000 Birr)</span>
            </button>
          </div>
        </div>

        {/* Institution Highlights Badge Row */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
          <span className="font-bold text-teal-400">Collaborating Institutions:</span>
          {['Addis Ababa University (TASH)', 'Jimma University', 'University of Gondar', 'Hawassa University', 'SPHMMC', 'EPHI'].map((inst, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/80 text-slate-300">
              {inst}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Manuscripts Repository (4 cols) & Manuscript Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Directory & Search */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[760px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, DOI, author, institution..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 text-[11px]">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Article List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredManuscripts.map(art => {
              const isSelected = selectedManuscript?.id === art.id;

              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedManuscript(art)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-1.5 py-0.5 rounded">
                      DOI: {art.doi}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Peer Reviewed
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{art.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{art.leadInstitution}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                    <span>Citations: <strong className="text-teal-300">{art.citationCount}</strong></span>
                    <span className="text-amber-300 font-medium">Score: {art.peerReviewScore}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Manuscript View & PDF Preview */}
        <div className="lg:col-span-8 space-y-5">
          {selectedManuscript && (
            <div className="space-y-4">
              {/* Manuscript Header Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      DOI: {selectedManuscript.doi}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedManuscript.journalVolume}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCertManuscript(selectedManuscript);
                        setIsCertModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>Publication Certificate</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {selectedManuscript.title}
                </h3>

                {/* Lead Institution & Authors */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs text-slate-300">
                    <strong className="text-teal-400">Lead Institution:</strong> {selectedManuscript.leadInstitution}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-semibold">Authors:</span>
                    {selectedManuscript.authors.map((auth, idx) => (
                      <span key={idx} className="text-slate-200">
                        {auth.name} ({auth.title}){idx < selectedManuscript.authors.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    IRB Clearance Code: <strong className="text-slate-300">{selectedManuscript.irbApprovalNumber}</strong>
                  </div>
                </div>

                {/* Abstract */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                    Structured Abstract:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    {selectedManuscript.abstract}
                  </p>
                </div>

                {/* Keywords & Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Keywords:</span>
                    {selectedManuscript.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <span>Peer Review Score: <strong className="text-emerald-400">{selectedManuscript.peerReviewScore}/10</strong></span>
                    <span>Citations: <strong className="text-teal-400">{selectedManuscript.citationCount}</strong></span>
                  </div>
                </div>
              </div>

              {/* Full Text / Clinical Implications Section */}
              {selectedManuscript.fullArticleText && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Published Study Findings & National Health Impact</span>
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-2">
                    {selectedManuscript.fullArticleText}
                  </div>
                </div>
              )}

              {/* Editorial Stamped Sign-off */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span>
                    Official Peer-Review Verification: <strong>{selectedManuscript.chiefEditorSignoff}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">1,000 ETB Verified Institutional Publication</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: SUBMIT RESEARCH MANUSCRIPT (1,000 BIRR) */}
      {/* ======================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Submit Research Manuscript</h3>
                  <span className="text-xs text-teal-400 font-bold">Publication Fee: 1,000 Birr (ETB)</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Publication Listing & DOI Issuance:</span>
                <span className="text-teal-300 font-bold">1,000 ETB (or $10 USD)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Official Account: <strong className="text-amber-300">Telebirr: 0982852778</strong> | <strong className="text-white">CBE: 1000262900367</strong> (Dawid Aliyi)
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Lead Health / Academic Institution *</label>
                <input
                  type="text"
                  value={submitForm.leadInstitution}
                  onChange={(e) => setSubmitForm({ ...submitForm, leadInstitution: e.target.value })}
                  placeholder="e.g. Addis Ababa University, Jimma University, Gondar University"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Research Category</label>
                  <select
                    value={submitForm.researchCategory}
                    onChange={(e) => setSubmitForm({ ...submitForm, researchCategory: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Clinical Pharmacy & Therapeutics">Clinical Pharmacy & Therapeutics</option>
                    <option value="Antimicrobial Resistance (AMR)">Antimicrobial Resistance (AMR)</option>
                    <option value="Traditional Herbal Medicine & Phytochemistry">Traditional Herbal Medicine (Bisana)</option>
                    <option value="Health Economics & EPSS Supply Chain">Health Economics & Supply Chain</option>
                    <option value="Pharmacovigilance & Drug Safety">Pharmacovigilance & Drug Safety</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">IRB Approval Code</label>
                  <input
                    type="text"
                    value={submitForm.irbApprovalNumber}
                    onChange={(e) => setSubmitForm({ ...submitForm, irbApprovalNumber: e.target.value })}
                    placeholder="e.g. AAU-CHS-IRB-2026-09"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Manuscript Title *</label>
                <input
                  type="text"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  placeholder="e.g. Clinical Assessment of Pharmacist-Led Anticoagulation Management..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Structured Abstract (Background, Methods, Results, Conclusion) *</label>
                <textarea
                  value={submitForm.abstract}
                  onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="Paste abstract text here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Principal Investigator</label>
                  <input
                    type="text"
                    value={submitForm.authorName}
                    onChange={(e) => setSubmitForm({ ...submitForm, authorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Keywords</label>
                  <input
                    type="text"
                    value={submitForm.keywords}
                    onChange={(e) => setSubmitForm({ ...submitForm, keywords: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Payment Method (1,000 ETB)</label>
                  <select
                    value={submitForm.paymentMethod}
                    onChange={(e) => setSubmitForm({ ...submitForm, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="telebirr">Telebirr (0982852778 - Dawid Aliyi)</option>
                    <option value="cbe">CBE (1000262900367 - Dawid Aliyi)</option>
                    <option value="cbe_birr">CBE Birr (*847#)</option>
                    <option value="card_international">International Card ($10 USD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Payment Ref / Transaction Code *</label>
                  <input
                    type="text"
                    value={submitForm.paymentReference}
                    onChange={(e) => setSubmitForm({ ...submitForm, paymentReference: e.target.value })}
                    placeholder="e.g. TB-8829104 or CBE-99120"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishRequest}
                disabled={!submitForm.title || !submitForm.abstract || !submitForm.paymentReference}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit & Publish (1,000 Birr Verified)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PRINTABLE CERTIFICATE OF PUBLICATION */}
      {/* ======================================================== */}
      {isCertModalOpen && certManuscript && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-teal-400">Official Certificate of Scientific Publication</h3>
              <button 
                onClick={() => setIsCertModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Printable Certificate */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-teal-50 text-slate-950 p-8 rounded-2xl border-4 border-double border-amber-600/40 space-y-4 font-serif text-center shadow-inner">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                  Pharma Star Ethiopian Medical Journal
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  CERTIFICATE OF PUBLICATION
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  This certifies that the original peer-reviewed manuscript has been officially published and indexed:
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <h4 className="text-sm font-bold text-slate-900 font-sans leading-snug">
                  "{certManuscript.title}"
                </h4>
                <div className="text-xs text-teal-900 font-sans font-semibold mt-1">
                  Lead Institution: {certManuscript.leadInstitution}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans text-left bg-slate-100/60 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Digital Object Identifier (DOI)</span>
                  <strong className="text-teal-800 font-mono">{certManuscript.doi}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Peer-Review Index</span>
                  <strong className="text-slate-900">{certManuscript.peerReviewScore} / 10 (Accepted)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">IRB Clearance</span>
                  <strong className="text-slate-900">{certManuscript.irbApprovalNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Institutional Fee</span>
                  <strong className="text-emerald-800">1,000 ETB Verified</strong>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-4 flex items-center justify-between text-xs font-sans text-left">
                <div>
                  <span className="text-[10px] text-slate-500 block">Editor-in-Chief & Lead Director:</span>
                  <strong className="text-slate-900 text-sm">Pharmacist Dawid Aliyi, BCPS</strong>
                  <span className="text-[10px] text-teal-700 block font-semibold">Pharma Star Clinical Research Publishing</span>
                </div>
                <div className="text-right">
                  <div className="w-24 h-12 border-2 border-amber-600 rounded-lg flex items-center justify-center text-amber-800 font-mono text-[9px] uppercase font-bold transform rotate-2">
                    ✦ OFFICIAL DOI ✦
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
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
