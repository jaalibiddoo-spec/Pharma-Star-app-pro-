import React, { useState } from 'react';
import { labTestsData } from '../data/labInterpretationData';
import { LabTest } from '../types';
import { 
  Activity, AlertCircle, AlertTriangle, CheckCircle2, 
  Calculator, ChevronRight, Search, Stethoscope, ArrowRight 
} from 'lucide-react';

export const LabInterpreter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>(labTestsData[0].id);
  const [testValueInput, setTestValueInput] = useState<number>(1.8);

  // Cockcroft-Gault Calculator States
  const [cgAge, setCgAge] = useState<number>(65);
  const [cgWeight, setCgWeight] = useState<number>(70);
  const [cgScr, setCgScr] = useState<number>(1.6);
  const [cgGender, setCgGender] = useState<'Male' | 'Female'>('Male');

  // Cockcroft-Gault calculation
  // CrCl = [(140 - Age) * Weight (kg)] / (72 * Scr) (* 0.85 if female)
  const calculatedCrCl = (() => {
    if (!cgScr || cgScr <= 0) return 0;
    const base = ((140 - cgAge) * cgWeight) / (72 * cgScr);
    return Math.round(cgGender === 'Female' ? base * 0.85 : base);
  })();

  const activeTest = labTestsData.find(t => t.id === selectedTestId) || labTestsData[0];

  const filteredTests = labTestsData.filter(t => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getTestStatus = (val: number, test: LabTest) => {
    if (test.criticalHigh && val >= test.criticalHigh) return { label: 'CRITICAL HIGH', color: 'rose', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
    if (test.criticalLow && val <= test.criticalLow) return { label: 'CRITICAL LOW', color: 'rose', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
    if (val > test.maxNormal) return { label: 'ELEVATED / HIGH', color: 'amber', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    if (val < test.minNormal) return { label: 'DECREASED / LOW', color: 'amber', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    return { label: 'NORMAL REFERENCE', color: 'emerald', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  };

  const currentStatus = getTestStatus(testValueInput, activeTest);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Diagnostic Clinical Interpretation
              </span>
              <span className="text-xs text-slate-400">Renal, Hepatic & TDM Dosing Protocols</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Laboratory Test Result Interpreter</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Interpret biochemical markers, determine clinical significance of abnormal findings, and calculate dose adjustments for renally and hepatically cleared drugs.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', name: 'All Tests' },
            { id: 'renal', name: 'Renal (Kidney)' },
            { id: 'cardiac_electrolytes', name: 'Electrolytes & Cardiac' },
            { id: 'hepatic', name: 'Hepatic (Liver)' },
            { id: 'coagulation', name: 'Coagulation (INR)' },
            { id: 'tdm', name: 'TDM (Levels)' },
            { id: 'endocrine', name: 'Endocrine & Glucose' },
            { id: 'hematology', name: 'Hematology (CBC)' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Calculator + Lab Test Encyclopedia */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Test Browser (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[600px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTests.map(test => (
              <div
                key={test.id}
                onClick={() => {
                  setSelectedTestId(test.id);
                  setTestValueInput(test.maxNormal * 1.2);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedTestId === test.id
                    ? 'bg-teal-950/40 border-teal-500/60 text-white'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold leading-tight">{test.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ref: {test.maleRange}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedTestId === test.id ? 'text-teal-400' : 'text-slate-600'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Test Deep Analysis & Simulator (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Lab Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  {activeTest.category.toUpperCase()} PANEL
                </span>
                <h3 className="text-lg font-bold text-white">{activeTest.name}</h3>
              </div>

              {/* Status Flag Badge */}
              <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border ${currentStatus.bg}`}>
                {currentStatus.label}
              </span>
            </div>

            {/* Value Simulator Input */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Simulate Patient Lab Result:</span>
                <span className="font-mono text-teal-400 font-bold text-sm">
                  {testValueInput} {activeTest.standardUnit}
                </span>
              </div>

              <input
                type="range"
                min={activeTest.minNormal * 0.2}
                max={activeTest.criticalHigh ? activeTest.criticalHigh * 1.5 : activeTest.maxNormal * 3}
                step={activeTest.standardUnit === 'mg/dL' || activeTest.standardUnit === 'mEq/L' ? 0.1 : 1}
                value={testValueInput}
                onChange={(e) => setTestValueInput(parseFloat(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Low: &lt;{activeTest.minNormal}</span>
                <span className="text-emerald-400">Normal Range: {activeTest.maleRange}</span>
                <span>High: &gt;{activeTest.maxNormal}</span>
              </div>
            </div>

            {/* Clinical Interpretation Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-rose-400 text-[11px]">If Result is Elevated / High:</span>
                <p className="text-slate-300 leading-relaxed">{activeTest.highSignificance}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 text-[11px]">If Result is Decreased / Low:</span>
                <p className="text-slate-300 leading-relaxed">{activeTest.lowSignificance}</p>
              </div>
            </div>

            {/* Pharmacist Action & Dosing Protocol */}
            <div className="bg-teal-950/20 border border-teal-500/30 p-4 rounded-xl text-xs space-y-2">
              <h5 className="font-bold text-teal-400 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>Clinical Pharmacist Action Required:</span>
              </h5>
              <p className="text-slate-200 leading-relaxed">{activeTest.pharmacistAction}</p>

              {activeTest.dosingAdjustments && (
                <div className="pt-2 border-t border-teal-500/20">
                  <span className="font-bold text-emerald-300">Medication Dosing Adjustments:</span>
                  <p className="text-slate-300 mt-0.5">{activeTest.dosingAdjustments}</p>
                </div>
              )}
            </div>
          </div>

          {/* Integrated Cockcroft-Gault CrCl Calculator Tool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cockcroft-Gault Creatinine Clearance (CrCl) Calculator</h4>
                <p className="text-xs text-slate-400">Validated standard for antimicrobial and anticoagulant dosing</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={cgAge}
                  onChange={(e) => setCgAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={cgWeight}
                  onChange={(e) => setCgWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Serum Cr (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cgScr}
                  onChange={(e) => setCgScr(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gender</label>
                <select
                  value={cgGender}
                  onChange={(e) => setCgGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female (0.85x)</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400">Estimated Creatinine Clearance:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-teal-400">{calculatedCrCl}</span>
                  <span className="text-xs text-slate-400">mL/min</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-300">Renal Function Category:</span>
                <div className="font-bold">
                  {calculatedCrCl >= 90 && <span className="text-emerald-400">Normal Renal Function (&gt;90 mL/min)</span>}
                  {calculatedCrCl >= 60 && calculatedCrCl < 90 && <span className="text-teal-400">Mild Renal Impairment (60-89 mL/min)</span>}
                  {calculatedCrCl >= 30 && calculatedCrCl < 60 && <span className="text-amber-400">Moderate Impairment (30-59 mL/min) - Dose reduction required!</span>}
                  {calculatedCrCl >= 15 && calculatedCrCl < 30 && <span className="text-rose-400">Severe Impairment (15-29 mL/min) - High risk!</span>}
                  {calculatedCrCl < 15 && <span className="text-rose-500 font-extrabold">Kidney Failure / Dialysis (&lt;15 mL/min)</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
