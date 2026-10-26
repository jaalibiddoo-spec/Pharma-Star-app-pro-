import React, { useState } from 'react';
import { commonDrugList, drugInteractionsData } from '../data/drugInteractionsData';
import { DrugInteraction } from '../types';
import { 
  AlertOctagon, AlertTriangle, Info, Plus, X, Search, 
  ShieldCheck, ArrowRight, Check, Pill, RefreshCw 
} from 'lucide-react';

export const DrugInteractionChecker: React.FC = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([
    "Warfarin",
    "Ibuprofen"
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customDrugName, setCustomDrugName] = useState("");

  const handleAddDrug = (drug: string) => {
    if (!selectedDrugs.includes(drug)) {
      setSelectedDrugs(prev => [...prev, drug]);
    }
    setSearchQuery("");
  };

  const handleRemoveDrug = (drug: string) => {
    setSelectedDrugs(prev => prev.filter(d => d !== drug));
  };

  const handleAddCustomDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDrugName.trim() && !selectedDrugs.includes(customDrugName.trim())) {
      setSelectedDrugs(prev => [...prev, customDrugName.trim()]);
      setCustomDrugName("");
    }
  };

  // Find all pairwise interactions between selected drugs
  const detectedInteractions: DrugInteraction[] = [];
  for (let i = 0; i < selectedDrugs.length; i++) {
    for (let j = i + 1; j < selectedDrugs.length; j++) {
      const d1 = selectedDrugs[i].toLowerCase();
      const d2 = selectedDrugs[j].toLowerCase();

      const found = drugInteractionsData.find(item => {
        const a = item.drugA.toLowerCase();
        const b = item.drugB.toLowerCase();
        return (d1.includes(a) || a.includes(d1)) && (d2.includes(b) || b.includes(d2)) ||
               (d2.includes(a) || a.includes(d2)) && (d1.includes(b) || b.includes(d1));
      });

      if (found && !detectedInteractions.some(x => x.id === found.id)) {
        detectedInteractions.push(found);
      }
    }
  }

  const filteredSuggestions = commonDrugList.filter(
    d => !selectedDrugs.includes(d) && d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Clinical Pharmacovigilance Engine
              </span>
              <span className="text-xs text-slate-400">CYP450 & Hemodynamic Checks</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Drug Interaction Checker</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Cross-examine polypharmacy regimens for pharmacokinetic (CYP3A4/2C19/2D6) and pharmacodynamic interactions, hemorrhagic synergies, and organ toxicities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDrugs(["Lisinopril", "Spironolactone"])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              Test Hyperkalemia
            </button>
            <button
              onClick={() => setSelectedDrugs(["Clopidogrel", "Omeprazole"])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              Test CYP2C19
            </button>
          </div>
        </div>

        {/* Selected Drugs Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">
              Active Regimen ({selectedDrugs.length} medications selected):
            </span>
            {selectedDrugs.length > 0 && (
              <button
                onClick={() => setSelectedDrugs([])}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedDrugs.map(drug => (
              <span
                key={drug}
                className="inline-flex items-center gap-1.5 bg-slate-800 border border-teal-500/40 text-teal-300 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
              >
                <Pill className="w-3.5 h-3.5 text-teal-400" />
                <span>{drug}</span>
                <button
                  onClick={() => handleRemoveDrug(drug)}
                  className="hover:text-rose-400 transition ml-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {selectedDrugs.length === 0 && (
              <p className="text-xs text-slate-400 italic">No drugs selected. Add medications below to evaluate interactions.</p>
            )}
          </div>
        </div>

        {/* Search & Add Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drug list (e.g., Warfarin, Simvastatin, Digoxin, Metformin)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <form onSubmit={handleAddCustomDrug} className="flex gap-2">
            <input
              type="text"
              value={customDrugName}
              onChange={(e) => setCustomDrugName(e.target.value)}
              placeholder="Add custom drug..."
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            />
            <button
              type="submit"
              disabled={!customDrugName.trim()}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        {searchQuery && filteredSuggestions.length > 0 && (
          <div className="mt-2 p-2 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            {filteredSuggestions.map(s => (
              <button
                key={s}
                onClick={() => handleAddDrug(s)}
                className="text-xs bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detected Interactions Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Interaction Analysis</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              detectedInteractions.length > 0 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {detectedInteractions.length} Identified
            </span>
          </h3>
        </div>

        {detectedInteractions.length === 0 ? (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No Severe Known Interactions Detected</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The selected combination did not trigger major pairwise interactions in our database. Always verify patient individual renal, hepatic, and age-related risk factors.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {detectedInteractions.map(interaction => (
              <div
                key={interaction.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-3.5 transition"
              >
                {/* Header: Drug Pair & Severity */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-teal-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      {interaction.drugA}
                    </span>
                    <span className="text-slate-400 font-bold">+</span>
                    <span className="font-bold text-sm text-teal-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      {interaction.drugB}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {interaction.cypEnzyme && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {interaction.cypEnzyme}
                      </span>
                    )}

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      interaction.severity === 'major'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : interaction.severity === 'moderate'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}>
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>{interaction.severity} SEVERITY</span>
                    </span>
                  </div>
                </div>

                {/* Mechanism & Effect */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Pharmacological Mechanism
                    </span>
                    <p className="text-slate-300 leading-relaxed">{interaction.mechanism}</p>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                      Clinical Risk & Manifestation
                    </span>
                    <p className="text-slate-300 leading-relaxed">{interaction.clinicalEffect}</p>
                  </div>
                </div>

                {/* Clinical Management & Alternatives */}
                <div className="bg-teal-950/20 border border-teal-500/30 p-3.5 rounded-xl space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-teal-400 uppercase tracking-wide text-[11px]">
                      Recommended Clinical Action & Monitoring:
                    </span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{interaction.management}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-teal-500/20 text-[11px]">
                    <span className="font-semibold text-slate-400">Safer Alternatives:</span>
                    {interaction.alternatives.map((alt, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
