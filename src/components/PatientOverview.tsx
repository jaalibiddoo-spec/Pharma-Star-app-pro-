import React, { useState } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine 
} from 'recharts';
import { 
  Activity, Pill, FileText, AlertTriangle, ShieldAlert, 
  CheckCircle2, TrendingUp, Heart, Sparkles, Calendar, 
  Stethoscope, ShieldCheck, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { Patient } from '../types';

interface PatientOverviewProps {
  patient: Patient;
  onAuditRegimen?: (drugs: string[]) => void;
  onWriteSoapNote?: () => void;
}

export interface PatientTrendPoint {
  date: string;
  scr: number;
  egfr: number;
  sbp: number;
  dbp: number;
  k: number;
  hba1c: number;
  fbg: number;
  inr?: number;
  ldl?: number;
  pef?: number;
}

// Longitudinal trend data over the past 6-12 months for diagnostic visualization
export const getPatientLabTrends = (patientId: string): PatientTrendPoint[] => {
  if (patientId === 'pat-101') {
    // Abebe Kebede: CKD 3a, T2DM, HFrEF
    return [
      { date: 'Nov 2025', scr: 1.3, egfr: 58, k: 4.6, hba1c: 8.4, fbg: 168, sbp: 148, dbp: 92, inr: 1.1, ldl: 110 },
      { date: 'Jan 2026', scr: 1.4, egfr: 53, k: 4.8, hba1c: 8.0, fbg: 154, sbp: 142, dbp: 88, inr: 1.1, ldl: 104 },
      { date: 'Apr 2026', scr: 1.5, egfr: 49, k: 5.0, hba1c: 7.6, fbg: 140, sbp: 136, dbp: 84, inr: 1.2, ldl: 98 },
      { date: 'Jul 2026', scr: 1.5, egfr: 48, k: 5.1, hba1c: 7.5, fbg: 135, sbp: 134, dbp: 82, inr: 1.1, ldl: 92 },
      { date: 'Oct 2026', scr: 1.6, egfr: 46, k: 5.2, hba1c: 7.4, fbg: 132, sbp: 132, dbp: 82, inr: 1.2, ldl: 88 }
    ];
  } else if (patientId === 'pat-102') {
    // Chaltu Tolosa: AFib, Asthma, Dyslipidemia
    return [
      { date: 'Nov 2025', scr: 0.8, egfr: 92, inr: 1.8, ldl: 145, sbp: 130, dbp: 82, pef: 320, k: 4.2, hba1c: 5.6, fbg: 92 },
      { date: 'Jan 2026', scr: 0.82, egfr: 90, inr: 2.2, ldl: 120, sbp: 128, dbp: 80, pef: 350, k: 4.3, hba1c: 5.5, fbg: 94 },
      { date: 'Apr 2026', scr: 0.85, egfr: 88, inr: 2.5, ldl: 98, sbp: 124, dbp: 78, pef: 380, k: 4.2, hba1c: 5.4, fbg: 90 },
      { date: 'Jul 2026', scr: 0.84, egfr: 89, inr: 2.4, ldl: 86, sbp: 122, dbp: 78, pef: 400, k: 4.4, hba1c: 5.5, fbg: 91 },
      { date: 'Oct 2026', scr: 0.85, egfr: 88, inr: 2.6, ldl: 78, sbp: 120, dbp: 76, pef: 410, k: 4.3, hba1c: 5.4, fbg: 89 }
    ];
  }

  // Default synthetic clinical series
  return [
    { date: '6 Mos Ago', scr: 1.0, egfr: 85, k: 4.2, hba1c: 6.8, fbg: 110, sbp: 130, dbp: 82, inr: 1.0, ldl: 110 },
    { date: '4 Mos Ago', scr: 1.1, egfr: 80, k: 4.4, hba1c: 6.6, fbg: 105, sbp: 126, dbp: 80, inr: 1.1, ldl: 105 },
    { date: '2 Mos Ago', scr: 1.05, egfr: 82, k: 4.3, hba1c: 6.5, fbg: 102, sbp: 124, dbp: 78, inr: 1.0, ldl: 100 },
    { date: 'Current', scr: 1.0, egfr: 86, k: 4.3, hba1c: 6.4, fbg: 98, sbp: 122, dbp: 76, inr: 1.0, ldl: 95 }
  ];
};

export const PatientOverview: React.FC<PatientOverviewProps> = ({
  patient,
  onAuditRegimen,
  onWriteSoapNote
}) => {
  const [activeTrendMetric, setActiveTrendMetric] = useState<'renal' | 'glycemic' | 'bp' | 'potassium'>('renal');
  const trendData = getPatientLabTrends(patient.id);

  // Derive alert flags
  const hasSevereAllergies = patient.allergies.length > 0;
  const hasRenalImpairment = patient.serumCreatinine >= 1.5;
  const hasMultipleConditions = patient.chronicConditions.length >= 3;
  const polypharmacy = patient.currentMedications.length >= 5;

  // Recent lab values summary
  const latestData = trendData[trendData.length - 1];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. AGGREGATED PATIENT HEADER & CRITICAL ALERT STATUS BADGES */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                MRN: {patient.mrn}
              </span>
              <span className="text-xs text-slate-400">
                {patient.age} years • {patient.gender} • {patient.weightKg} kg ({patient.heightCm} cm)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Patient Overview: {patient.fullName}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Comprehensive clinical synopsis: active pharmacotherapy, recent lab trends, and multidisciplinary safety alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onAuditRegimen && (
              <button
                onClick={() => onAuditRegimen(patient.currentMedications.map(m => m.drugName))}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audit in Safety Engine</span>
              </button>
            )}

            {onWriteSoapNote && (
              <button
                onClick={onWriteSoapNote}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document SOAP Note</span>
              </button>
            )}
          </div>
        </div>

        {/* Multidisciplinary Alert Status Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800 text-xs">
          {/* Alert 1: Allergies */}
          <div className={`p-3 rounded-xl border flex items-start gap-2 ${
            hasSevereAllergies 
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' 
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          }`}>
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase block">Allergy Registry</span>
              <span className="font-bold block text-white text-xs">
                {hasSevereAllergies ? `${patient.allergies.length} High-Risk` : 'NKDA (None)'}
              </span>
              <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                {patient.allergies.join(', ') || 'No known allergies'}
              </span>
            </div>
          </div>

          {/* Alert 2: Renal Clearance Status */}
          <div className={`p-3 rounded-xl border flex items-start gap-2 ${
            hasRenalImpairment 
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' 
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          }`}>
            <Activity className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase block">Renal Clearance</span>
              <span className="font-bold block text-white text-xs">
                SCr: {patient.serumCreatinine} mg/dL
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {hasRenalImpairment ? 'Stage 3 CKD Alert (eGFR < 50)' : 'Normal Renal Function'}
              </span>
            </div>
          </div>

          {/* Alert 3: Polypharmacy & Regimen Size */}
          <div className={`p-3 rounded-xl border flex items-start gap-2 ${
            polypharmacy 
              ? 'bg-indigo-950/20 border-indigo-500/40 text-indigo-300' 
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <Pill className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
            <div>
              <span className="text-[10px] font-bold uppercase block">Regimen Size</span>
              <span className="font-bold block text-white text-xs">
                {patient.currentMedications.length} Active Medications
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {polypharmacy ? 'Polypharmacy Monitor' : 'Appropriate Regimen'}
              </span>
            </div>
          </div>

          {/* Alert 4: Chronic Comorbidity Burden */}
          <div className={`p-3 rounded-xl border flex items-start gap-2 ${
            hasMultipleConditions 
              ? 'bg-purple-950/20 border-purple-500/40 text-purple-300' 
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <Heart className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
            <div>
              <span className="text-[10px] font-bold uppercase block">Comorbidities</span>
              <span className="font-bold block text-white text-xs">
                {patient.chronicConditions.length} Active Diagnoses
              </span>
              <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                {patient.chronicConditions[0] || 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 'HEALTH DASHBOARD' WIDGET (RECHARTS LAB TRENDS OVER TIME) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-teal-400" />
                Health Dashboard Widget
              </span>
              <span className="text-xs text-slate-400">Recharts Longitudinal Visualization</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Diagnostic Lab & Vital Trends Over Time
            </h3>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'renal', label: 'Renal (eGFR & SCr)' },
              { id: 'glycemic', label: 'Glycemic (HbA1c & Glucose)' },
              { id: 'bp', label: 'Blood Pressure' },
              { id: 'potassium', label: 'Serum K+ & Lytes' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveTrendMetric(m.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  activeTrendMetric === m.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Recharts Chart Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeTrendMetric === 'renal' ? (
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#14b8a6" domain={[30, 100]} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" domain={[0.5, 3.0]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} 
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine yAxisId="left" y={60} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'CKD Cutoff (60)', fill: '#f59e0b', fontSize: 10 }} />
                <Line yAxisId="left" type="monotone" dataKey="egfr" name="eGFR (mL/min/1.73m²)" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="scr" name="Serum Creatinine (mg/dL)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            ) : activeTrendMetric === 'glycemic' ? (
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFbg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="fbg" stroke="#38bdf8" domain={[80, 200]} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="a1c" orientation="right" stroke="#a855f7" domain={[5, 10]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine yAxisId="a1c" y={7.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target A1c < 7.0%', fill: '#10b981', fontSize: 10 }} />
                <Area yAxisId="fbg" type="monotone" dataKey="fbg" name="Fasting Glucose (mg/dL)" stroke="#38bdf8" fillOpacity={1} fill="url(#colorFbg)" />
                <Line yAxisId="a1c" type="monotone" dataKey="hba1c" name="HbA1c (%)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
              </AreaChart>
            ) : activeTrendMetric === 'bp' ? (
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 170]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={130} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Target SBP < 130', fill: '#10b981', fontSize: 10 }} />
                <Line type="monotone" dataKey="sbp" name="Systolic BP (mmHg)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="dbp" name="Diastolic BP (mmHg)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorK" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[3.5, 6.0]} stroke="#f59e0b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={5.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Hyperkalemia Alert (5.0)', fill: '#f43f5e', fontSize: 10 }} />
                <Area type="monotone" dataKey="k" name="Serum Potassium K+ (mEq/L)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorK)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Diagnostic Trend Interpretation Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-slate-300">
              <strong>Clinical Pharmacist Interpretation:</strong>{' '}
              {activeTrendMetric === 'renal'
                ? `eGFR shows gradual decline to 46 mL/min with SCr 1.6 mg/dL. Aligns with CKD 3a progression. Maintain ACEi/ARB renal dose titration.`
                : activeTrendMetric === 'glycemic'
                ? `HbA1c has favorably dropped from 8.4% to 7.4% under dual oral therapy. Good therapeutic response.`
                : activeTrendMetric === 'bp'
                ? `Blood pressure improved from 148/92 to 132/82 mmHg under GDMT beta-blocker and Lisinopril.`
                : `Serum K+ currently 5.2 mEq/L (borderline hyperkalemia secondary to RAAS blockade). Requires low-potassium dietary adherence.`}
            </span>
          </div>

          <span className="text-[10px] text-teal-400 font-mono shrink-0 ml-2">
            Updated: {latestData ? latestData.date : 'Today'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AGGREGATED ACTIVE MEDICATIONS & LAB RESULTS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Medications Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-400" />
              <span>Current Medications ({patient.currentMedications.length})</span>
            </h4>
            <span className="text-[10px] text-teal-400 font-medium">Verified Inpatient Regimen</span>
          </div>

          <div className="space-y-2">
            {patient.currentMedications.map((med, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{med.drugName}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]">
                      {med.dose}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {med.frequency} • <strong className="text-slate-300">Indication:</strong> {med.indication}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 block">
                    Started: {med.startDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Lab Values Column */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Recent Diagnostic Lab Results</span>
            </h4>
            <span className="text-[10px] text-slate-400">Clinical Chemistry</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Serum Creatinine</span>
                <span className="text-[10px] text-slate-400">Ref: 0.7 - 1.2 mg/dL</span>
              </div>
              <div className="text-right">
                <span className={`font-mono font-bold ${patient.serumCreatinine > 1.2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {patient.serumCreatinine} mg/dL
                </span>
                <span className="text-[9px] text-amber-300 font-bold block">Elevated (CKD)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Estimated GFR</span>
                <span className="text-[10px] text-slate-400">Ref: ≥ 90 mL/min/1.73m²</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-amber-400">
                  {latestData ? latestData.egfr : 46} mL/min
                </span>
                <span className="text-[9px] text-amber-300 font-bold block">Stage 3a Impairment</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Serum Potassium (K+)</span>
                <span className="text-[10px] text-slate-400">Ref: 3.5 - 5.0 mEq/L</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-amber-400">
                  {latestData ? latestData.k : 5.2} mEq/L
                </span>
                <span className="text-[9px] text-amber-300 font-bold block">Borderline High</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Hemoglobin A1c</span>
                <span className="text-[10px] text-slate-400">Target: &lt; 7.0%</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-teal-400">
                  {latestData ? latestData.hba1c : 7.4}%
                </span>
                <span className="text-[9px] text-teal-300 font-bold block">Good Glycemic Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
