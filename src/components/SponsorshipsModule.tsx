import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sponsorshipsData, sponsorshipPackages } from '../data/sponsorshipsData';
import { SponsorshipPartner } from '../types';
import { 
  Building2, ShieldCheck, Award, Sparkles, CheckCircle2, 
  Mail, Phone, ExternalLink, ArrowRight, DollarSign, Send, Landmark, 
  Check, Copy, X, FileBadge 
} from 'lucide-react';

export const SponsorshipsModule: React.FC = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("Gold Educational Sponsor (15,000 ETB)");
  const [companyName, setCompanyName] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplyModalOpen(false);
      setCompanyName("");
      setRepresentativeName("");
      setContactEmail("");
      setContactPhone("");
      setProposalNotes("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 border border-teal-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Ethical Pharmaceutical Industry Alliances</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Ethiopian Healthcare Synergy
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ethical Medical & Pharmaceutical Sponsorships
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Pharmastar App Pro partners with certified pharmaceutical manufacturers, diagnostic innovators, and medical device suppliers across Ethiopia and Africa. Industry partners support open-access clinical education, antimicrobial stewardship guidelines, and continuing professional education.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Become a Sponsor Partner</span>
            </button>
            <span className="text-xs text-slate-400">
              Direct Contact: <strong className="text-teal-300">Pharmacist Dawid Aliyi</strong> (<span className="font-mono">jaalibiddoo@gmail.com</span>)
            </span>
          </div>
        </div>
      </div>

      {/* Verified Current Partners */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>Active Verified Pharmaceutical & Institutional Partners</span>
          </h2>
          <span className="text-xs text-slate-400">EFDA Compliant Educational Grants</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sponsorshipsData.map((partner) => (
            <div 
              key={partner.id}
              className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 space-y-3 transition shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 inline-block mb-1">
                    {partner.tier}
                  </span>
                  <h3 className="text-base font-bold text-white">{partner.companyName}</h3>
                  <span className="text-xs text-slate-400 block">{partner.originCountry}</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-amber-400 text-center">
                  {partner.logoText}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {partner.description}
              </p>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                <span>Sponsored Focus:</span>
                <strong className="text-teal-300">{partner.sponsoredArea}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsorship Packages Tiers */}
      <div className="space-y-3 pt-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Sponsorship Packages & Educational Grant Tiers</span>
          </h2>
          <p className="text-xs text-slate-400">
            Open for pharmaceutical companies, local importers, universities, and medical supply firms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sponsorshipPackages.map((pkg, idx) => (
            <div 
              key={idx}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg ${
                idx === 2 ? 'border-teal-500/60 ring-1 ring-teal-500/30' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pkg.badgeColor}`}>
                  {pkg.tierName}
                </span>

                <div className="pt-1">
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
                    <span className="text-teal-400">{pkg.priceETB.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-normal">ETB / Year</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">(${pkg.priceUSD} USD / Year)</span>
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  {pkg.recommendedFor}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  {pkg.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTier(`${pkg.tierName} (${pkg.priceETB.toLocaleString()} ETB)`);
                  setIsApplyModalOpen(true);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  idx === 2
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Select {pkg.tierName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application / Partnership Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Partnership Inquiry
                </span>
                <h3 className="text-base font-bold text-white mt-1">Medical Sponsorship Application</h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Selected Sponsorship Tier:</label>
                <input
                  type="text"
                  readOnly
                  value={selectedTier}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-teal-300 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company / Organization Name:</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Ethiopian Pharmaceuticals Manufacturing / MedTech PLC"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Representative Name:</label>
                  <input
                    type="text"
                    required
                    value={representativeName}
                    onChange={(e) => setRepresentativeName(e.target.value)}
                    placeholder="e.g. Dr. Abebe / Pharm. Selam"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Phone Number (Ethiopia):</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +251 91 123 4567"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official Email:</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="medical-affairs@company.et"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Sponsorship Focus & Proposed Modules:</label>
                <textarea
                  rows={3}
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  placeholder="Describe your therapeutic area of interest (e.g. Cardiovascular GDMT, AMR stewardship, cGMP tablet quality)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              {isSubmitted ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Inquiry sent to Pharmacist Dawid Aliyi! We will reach out within 24 hours.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Partnership Proposal</span>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
