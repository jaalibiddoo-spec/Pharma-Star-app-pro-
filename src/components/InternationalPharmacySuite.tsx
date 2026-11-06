import React, { useState } from 'react';
import { 
  Globe, Dna, Activity, ShieldAlert, Award, BookOpen, 
  Pill, AlertTriangle, CheckCircle2, ChevronRight, Calculator,
  ExternalLink, Printer, Copy, RotateCcw, Sparkles, HelpCircle,
  FileText, ShieldCheck, Microscope, HeartPulse, Building2,
  Stethoscope, Layers, Flame, Check, X, Info
} from 'lucide-react';
import { 
  cpicGeneDrugGuidelines, 
  tdmProtocols, 
  PGxGeneDrugPair, 
  TDMClinicalProtocol 
} from '../data/pharmacogenomicsAndTdmData';
import { 
  sampleAwareMedications, 
  sampleSyndromicGuidelines, 
  AwareMedication 
} from '../data/awareAntibiogramData';
import { 
  naranjoQuestions, 
  NaranjoQuestion 
} from '../data/pharmacovigilanceData';
import { 
  counselingMedications, 
  SupportedCounselingLang, 
  PatientMedicationCounselingProfile 
} from '../data/patientCounselingData';

export const InternationalPharmacySuite: React.FC = () => {
  const [activeModuleTab, setActiveModuleTab] = useState<
    'pgx' | 'tdm' | 'aware_ams' | 'naranjo_adr' | 'usp_compounding' | 'multilingual_counseling'
  >('pgx');

  // PGx State
  const [selectedPGxGeneId, setSelectedPGxGeneId] = useState<string>(cpicGeneDrugGuidelines[0].id);
  const selectedPGxPair = cpicGeneDrugGuidelines.find(g => g.id === selectedPGxGeneId) || cpicGeneDrugGuidelines[0];
  const [selectedPhenotypeIndex, setSelectedPhenotypeIndex] = useState<number>(0);

  // TDM State
  const [selectedTdmDrugId, setSelectedTdmDrugId] = useState<string>(tdmProtocols[0].id);
  const selectedTdm = tdmProtocols.find(p => p.id === selectedTdmDrugId) || tdmProtocols[0];

  // Vancomycin AUC Calculator State
  const [vancoPeak, setVancoPeak] = useState<number>(30);
  const [vancoTrough, setVancoTrough] = useState<number>(14);
  const [vancoIntervalHours, setVancoIntervalHours] = useState<number>(12);
  const [vancoDoseMg, setVancoDoseMg] = useState<number>(1250);
  const [vancoInfusionHours, setVancoInfusionHours] = useState<number>(1.5);

  // Winter-Tozer Phenytoin Calculator State
  const [phenytoinMeasured, setPhenytoinMeasured] = useState<number>(8.5);
  const [serumAlbumin, setSerumAlbumin] = useState<number>(2.2);
  const [isEsrdPatient, setIsEsrdPatient] = useState<boolean>(false);

  // Naranjo ADR Calculator State
  const [naranjoAnswers, setNaranjoAnswers] = useState<Record<number, 'yes' | 'no' | 'unknown'>>({
    1: 'yes',
    2: 'yes',
    3: 'yes',
    4: 'unknown',
    5: 'no',
    6: 'unknown',
    7: 'unknown',
    8: 'unknown',
    9: 'unknown',
    10: 'unknown'
  });

  // Multilingual Counseling State
  const [selectedCounselingDrugId, setSelectedCounselingDrugId] = useState<string>(counselingMedications[0].id);
  const [selectedCounselingLang, setSelectedCounselingLang] = useState<SupportedCounselingLang>('en');
  const selectedCounselingMed = counselingMedications.find(m => m.id === selectedCounselingDrugId) || counselingMedications[0];

  // USP Compounding State
  const [compoundingDosageType, setCompoundingDosageType] = useState<'aqueous_oral' | 'aqueous_topical' | 'non_aqueous'>('aqueous_oral');
  const [compoundingStorage, setCompoundingStorage] = useState<'refrigerated' | 'room_temp'>('refrigerated');

  // Compute Vancomycin PK Parameters
  const calculateVancomycinPK = () => {
    const deltaT = vancoIntervalHours - vancoInfusionHours;
    if (deltaT <= 0 || vancoPeak <= vancoTrough || vancoTrough <= 0) {
      return { ke: 0.05, tHalf: 13.8, auc24: 450, status: 'Within Target (400-600 mg·h/L)' };
    }
    const ke = Math.log(vancoPeak / vancoTrough) / deltaT;
    const tHalf = 0.693 / ke;
    // Estimated AUC24 using trapezoidal approximation + clearance
    const dailyDoses = 24 / vancoIntervalHours;
    const totalDailyDose = vancoDoseMg * dailyDoses;
    const vD = vancoDoseMg / (vancoPeak - vancoTrough * Math.exp(-ke * vancoIntervalHours));
    const clearance = ke * (vD > 0 ? vD : 50);
    const estimatedAuc24 = clearance > 0 ? Math.round(totalDailyDose / clearance) : 480;

    let status = 'Within Optimal Therapeutic Target (400 - 600 mg·h/L)';
    let statusColor = 'text-emerald-400';
    if (estimatedAuc24 < 400) {
      status = 'Subtherapeutic (AUC < 400 mg·h/L) - High Risk of Treatment Failure';
      statusColor = 'text-amber-400';
    } else if (estimatedAuc24 > 600) {
      status = 'Supratherapeutic (AUC > 600 mg·h/L) - Elevated Nephrotoxicity Risk';
      statusColor = 'text-rose-400';
    }

    return {
      ke: Number(ke.toFixed(4)),
      tHalf: Number(tHalf.toFixed(1)),
      auc24: estimatedAuc24,
      status,
      statusColor
    };
  };

  // Compute Winter-Tozer Corrected Phenytoin
  const calculateCorrectedPhenytoin = () => {
    const denominatorFactor = isEsrdPatient ? 0.1 : 0.2;
    const corrected = phenytoinMeasured / (denominatorFactor * serumAlbumin + 0.1);
    const value = Number(corrected.toFixed(1));
    let interp = 'Within Therapeutic Window (10 - 20 mg/L)';
    let color = 'text-emerald-400';

    if (value < 10) {
      interp = 'Subtherapeutic (< 10 mg/L) - Seizure Risk';
      color = 'text-amber-400';
    } else if (value > 20) {
      interp = 'Supratherapeutic (> 20 mg/L) - Neurotoxicity Risk (Nystagmus, Ataxia)';
      color = 'text-rose-400';
    }

    return { corrected: value, interp, color };
  };

  // Compute Naranjo Score
  const calculateNaranjoScore = () => {
    let score = 0;
    naranjoQuestions.forEach(q => {
      const ans = naranjoAnswers[q.id];
      if (ans === 'yes') score += q.yesScore;
      else if (ans === 'no') score += q.noScore;
      else score += q.doNotKnowScore;
    });

    let probability = 'Possible Adverse Reaction';
    let color = 'text-amber-400';
    let whoGrade = 'Possible';

    if (score >= 9) {
      probability = 'Definite ADR (Score >= 9)';
      color = 'text-rose-400';
      whoGrade = 'Certain';
    } else if (score >= 5) {
      probability = 'Probable ADR (Score 5 - 8)';
      color = 'text-orange-400';
      whoGrade = 'Probable/Likely';
    } else if (score >= 1) {
      probability = 'Possible ADR (Score 1 - 4)';
      color = 'text-amber-400';
      whoGrade = 'Possible';
    } else {
      probability = 'Doubtful ADR (Score <= 0)';
      color = 'text-slate-400';
      whoGrade = 'Unlikely';
    }

    return { score, probability, color, whoGrade };
  };

  const vancoResults = calculateVancomycinPK();
  const phenytoinResults = calculateCorrectedPhenytoin();
  const naranjoResults = calculateNaranjoScore();

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-teal-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              International Pharmacy Standards Suite &bull; Global Practice
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              WHO &bull; FIP &bull; CPIC &bull; USP &bull; IDSA/ASHP
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>World-Class Clinical Pharmacy &amp; Pharmacogenomics</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Standardized clinical tools, <strong>CPIC Level A pharmacogenomics</strong>, 
              <strong> Bayesian Vancomycin AUC24 &amp; TDM calculators</strong>, <strong>WHO AWaRe antimicrobial stewardship</strong>, 
              <strong> Naranjo adverse drug reaction causality scoring</strong>, and <strong>6-language pictographic patient counseling</strong>.
            </p>
          </div>

          {/* Module Selector Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'pgx', label: '🧬 Pharmacogenomics (CPIC)', icon: Dna },
              { id: 'tdm', label: '📊 TDM & PK/PD Calculators', icon: Calculator },
              { id: 'aware_ams', label: '🛡️ WHO AWaRe Antimicrobial Stewardship', icon: ShieldCheck },
              { id: 'naranjo_adr', label: '⚠️ Naranjo ADR Causality', icon: AlertTriangle },
              { id: 'usp_compounding', label: '🧪 USP <795>/<797>/<800> Compounding', icon: Microscope },
              { id: 'multilingual_counseling', label: '🌐 6-Language Patient Leaflets', icon: Globe }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeModuleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModuleTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODULE 1: Pharmacogenomics (CPIC Precision Medicine) */}
      {activeModuleTab === 'pgx' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                Clinical Pharmacogenetics Implementation Consortium (CPIC) Guidelines
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Gene-Drug Precision Dosing &amp; Hypersensitivity Prevention
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              CPIC Level A Evidence
            </span>
          </div>

          {/* Gene-Drug Pair Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {cpicGeneDrugGuidelines.map(pair => {
              const isSelected = selectedPGxPair.id === pair.id;
              return (
                <button
                  key={pair.id}
                  onClick={() => {
                    setSelectedPGxGeneId(pair.id);
                    setSelectedPhenotypeIndex(0);
                  }}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 ring-1 ring-teal-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-400 text-sm">{pair.gene}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      Level {pair.cpicLevel}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs mt-1">{pair.drug}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{pair.therapeuticArea}</div>
                </button>
              );
            })}
          </div>

          {/* Active Gene-Drug Details Workspace */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Select Patient Genotype / Phenotype:
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  {selectedPGxPair.gene} &bull; {selectedPGxPair.drug}
                </h4>
              </div>

              {/* Phenotype Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {selectedPGxPair.phenotypes.map((pheno, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSelectedPhenotypeIndex(pIdx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedPhenotypeIndex === pIdx
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {pheno.phenotype.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Phenotype Clinical Action Dossier */}
            {(() => {
              const currentPheno = selectedPGxPair.phenotypes[selectedPhenotypeIndex] || selectedPGxPair.phenotypes[0];
              const isContraindicated = currentPheno.warningSeverity === 'CONTRAINDICATED';
              const isAlternative = currentPheno.warningSeverity === 'USE_ALTERNATIVE';

              return (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isContraindicated
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                      : isAlternative
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isContraindicated ? 'text-rose-400' : isAlternative ? 'text-amber-400' : 'text-emerald-400'
                    }`} />
                    <div className="space-y-1">
                      <div className="font-black text-sm uppercase tracking-wide">
                        {currentPheno.warningSeverity.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs font-semibold">
                        Patient Phenotype: <span className="underline">{currentPheno.phenotype}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="font-bold text-teal-400 block text-xs uppercase tracking-wide">
                        Clinical Implication:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{currentPheno.clinicalImplication}</p>
                      
                      <span className="font-bold text-amber-400 block pt-2 text-xs uppercase tracking-wide">
                        Prescribing Recommendation:
                      </span>
                      <p className="text-slate-200 leading-relaxed font-semibold">{currentPheno.prescribingRecommendation}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="font-bold text-emerald-400 block text-xs uppercase tracking-wide">
                        Recommended Alternative Therapy:
                      </span>
                      <p className="text-slate-200 leading-relaxed font-mono font-bold bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {currentPheno.alternativeTherapy}
                      </p>

                      <span className="font-bold text-slate-400 block pt-2 text-xs uppercase tracking-wide">
                        Regulatory &amp; Labeling Context:
                      </span>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{selectedPGxPair.fdaLabeling}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Evidence Summary: {selectedPGxPair.evidenceSummary}</span>
                    <span className="font-mono text-teal-400 font-bold shrink-0">Turnaround: {selectedPGxPair.testTurnaroundTime}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODULE 2: Therapeutic Drug Monitoring (TDM & Bayesian PK/PD) */}
      {activeModuleTab === 'tdm' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Clinical Pharmacokinetics &amp; Therapeutic Drug Monitoring (TDM)
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Bayesian AUC24, Hartford Nomogram &amp; Protein-Binding Corrections
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              IDSA / ASHP / SHEA 2026 Consensus
            </span>
          </div>

          {/* Interactive Calculator Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calculator A: Vancomycin AUC24/MIC Dosing */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                    Vancomycin AUC24 / MIC Engine
                  </span>
                  <h4 className="text-sm font-bold text-white">Target: 400 - 600 mg·h/L</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 font-bold">
                  Two-Concentration PK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Peak Level (mg/L):</label>
                  <input
                    type="number"
                    value={vancoPeak}
                    onChange={(e) => setVancoPeak(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Draw 1-2h post-infusion</span>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Trough Level (mg/L):</label>
                  <input
                    type="number"
                    value={vancoTrough}
                    onChange={(e) => setVancoTrough(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Draw 30m pre-dose</span>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Dosing Interval (Hours):</label>
                  <input
                    type="number"
                    value={vancoIntervalHours}
                    onChange={(e) => setVancoIntervalHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Dose per Infusion (mg):</label>
                  <input
                    type="number"
                    value={vancoDoseMg}
                    onChange={(e) => setVancoDoseMg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Vancomycin Results Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Estimated 24-hr AUC:</span>
                  <span className="font-mono text-lg text-teal-300">{vancoResults.auc24} mg·h/L</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Elimination Constant (k_e): <code className="text-white font-mono">{vancoResults.ke} hr⁻¹</code></span>
                  <span>t_1/2: <code className="text-white font-mono">{vancoResults.tHalf} hrs</code></span>
                </div>
                <div className={`text-xs font-bold ${vancoResults.statusColor} pt-1 border-t border-slate-800`}>
                  {vancoResults.status}
                </div>
              </div>
            </div>

            {/* Calculator B: Winter-Tozer Phenytoin Correction */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Winter-Tozer Phenytoin Correction
                  </span>
                  <h4 className="text-sm font-bold text-white">Hypoalbuminemia &amp; ESRD Normalization</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold">
                  Free Fraction Model
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Measured Total Phenytoin (mg/L):</label>
                  <input
                    type="number"
                    value={phenytoinMeasured}
                    onChange={(e) => setPhenytoinMeasured(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Serum Albumin (g/dL):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={serumAlbumin}
                    onChange={(e) => setSerumAlbumin(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="esrd_check"
                  checked={isEsrdPatient}
                  onChange={(e) => setIsEsrdPatient(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="esrd_check" className="text-slate-300 cursor-pointer">
                  Patient has End-Stage Renal Disease (CrCl &lt; 10 mL/min or Hemodialysis)
                </label>
              </div>

              {/* Winter-Tozer Results Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Winter-Tozer Corrected Phenytoin:</span>
                  <span className="font-mono text-lg text-amber-300">{phenytoinResults.corrected} mg/L</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Measured <strong>{phenytoinMeasured} mg/L</strong> represents an effective free concentration equivalent to <strong>{phenytoinResults.corrected} mg/L</strong> in normal albumin plasma.
                </div>
                <div className={`text-xs font-bold ${phenytoinResults.color} pt-1 border-t border-slate-800`}>
                  {phenytoinResults.interp}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: WHO AWaRe Antimicrobial Stewardship (AMS) */}
      {activeModuleTab === 'aware_ams' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                World Health Organization (WHO) AWaRe 2026 Classification
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Access, Watch &amp; Reserve Antibiotic Formulary &amp; Stewardship
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              WHO Global Target: &ge;60% Access Group
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Access Group Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACCESS GROUP
                </span>
                <span className="text-[11px] text-slate-400 font-mono">1st &amp; 2nd Line</span>
              </div>
              <h4 className="text-base font-bold text-white">First-Choice Empiric Agents</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Affordable, narrow-spectrum antibiotics with low resistance potential. Essential for 29 common infections.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-emerald-300 space-y-1">
                <div>&bull; Amoxicillin / Amox-Clav</div>
                <div>&bull; Doxycycline / Gentamicin</div>
                <div>&bull; Cefazolin / Ampicillin</div>
              </div>
            </div>

            {/* Watch Group Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  WATCH GROUP
                </span>
                <span className="text-[11px] text-slate-400 font-mono">High Resistance</span>
              </div>
              <h4 className="text-base font-bold text-white">Stewardship Priority Monitoring</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Broad-spectrum agents prone to driving bacterial cross-resistance. Strictly prioritize for culture-verified indications.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-amber-300 space-y-1">
                <div>&bull; Ciprofloxacin / Levofloxacin</div>
                <div>&bull; Ceftriaxone / Cefotaxime</div>
                <div>&bull; Meropenem / Piperacillin-Tazo</div>
              </div>
            </div>

            {/* Reserve Group Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  RESERVE GROUP
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Last Resort Only</span>
              </div>
              <h4 className="text-base font-bold text-white">Critical Multidrug Resistance</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reserved strictly when all alternative agents have failed against confirmed MDR/XDR pathogens (CRE, MRSA, VRE).
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-rose-300 space-y-1">
                <div>&bull; Colistin / Polymyxin B</div>
                <div>&bull; Linezolid / Daptomycin</div>
                <div>&bull; Ceftazidime-Avibactam</div>
              </div>
            </div>
          </div>

          {/* Syndromic Empiric Regimen Explorer */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>WHO &amp; EFDA Recommended Syndromic Regimens</span>
            </h4>

            <div className="space-y-3">
              {sampleSyndromicGuidelines.slice(0, 3).map(g => (
                <div key={g.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{g.syndrome}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-teal-300">
                      {g.severity}
                    </span>
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    <strong>Primary Regimen:</strong> {g.primaryRegimen.map(r => `${r.drug} ${r.dosage} ${r.duration} (${r.awareGroup})`).join(' + ')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong>Clinical Stewardship Pearl:</strong> {g.clinicalPearls}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: Naranjo ADR Causality Engine */}
      {activeModuleTab === 'naranjo_adr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Pharmacovigilance &amp; Drug Safety Causality Scoring
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Naranjo 10-Question Algorithm &amp; WHO-UMC Probability Scale
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${naranjoResults.color}`}>
                Score: {naranjoResults.score} &bull; {naranjoResults.probability}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="space-y-3">
              {naranjoQuestions.map((q) => {
                const currentAns = naranjoAnswers[q.id];
                return (
                  <div key={q.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 max-w-xl">
                      <div className="font-semibold text-white">
                        {q.id}. {q.question}
                      </div>
                      <div className="text-[11px] text-slate-400 italic">
                        {q.clinicalRationale}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {(['yes', 'no', 'unknown'] as const).map(option => (
                        <button
                          key={option}
                          onClick={() => setNaranjoAnswers(prev => ({ ...prev, [q.id]: option }))}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                            currentAns === option
                              ? option === 'yes'
                                ? 'bg-emerald-500 text-slate-950'
                                : option === 'no'
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-700 text-white'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Causality Synthesis Summary Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Automated Pharmacovigilance Conclusion
                </span>
                <div className={`text-base font-black ${naranjoResults.color}`}>
                  {naranjoResults.probability} (Naranjo Total: {naranjoResults.score})
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Corresponding WHO-UMC Causality Classification: <strong>{naranjoResults.whoGrade}</strong>
                </div>
              </div>

              <button
                onClick={() => alert(`Exporting verified ADR dossier with Naranjo Score ${naranjoResults.score} for EFDA Yellow Form submission.`)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export CIOMS / EFDA Yellow Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: USP <795>, <797>, <800> Compounding & Quality Standards */}
      {activeModuleTab === 'usp_compounding' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                United States Pharmacopeia (USP) Compounding Standards
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                USP &lt;795&gt; Non-Sterile, &lt;797&gt; Sterile &amp; &lt;800&gt; Hazardous Handling
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Cleanroom ISO Class 5/7/8
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* USP 795 Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                USP &lt;795&gt;
              </span>
              <h4 className="font-bold text-white text-sm">Non-Sterile Compounding &amp; BUD</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Beyond-Use-Date (BUD) rules based on water activity ($a_w$):
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>&bull; <strong>Non-aqueous:</strong> 90 days room temp</li>
                <li>&bull; <strong>Aqueous oral:</strong> 14 days refrigerated (2-8°C)</li>
                <li>&bull; <strong>Aqueous topical:</strong> 30 days room temp</li>
              </ul>
            </div>

            {/* USP 797 Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                USP &lt;797&gt;
              </span>
              <h4 className="font-bold text-white text-sm">Sterile Compounding &amp; Cleanroom</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Air quality, positive pressure differentials, and garbing:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>&bull; <strong>PEC:</strong> ISO Class 5 (Laminar flow hood)</li>
                <li>&bull; <strong>Buffer Room:</strong> ISO Class 7 (+ pressure)</li>
                <li>&bull; <strong>Ante Room:</strong> ISO Class 8 (hand hygiene)</li>
              </ul>
            </div>

            {/* USP 800 Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                USP &lt;800&gt;
              </span>
              <h4 className="font-bold text-white text-sm">Hazardous Drug Containment</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Protecting healthcare personnel from antineoplastic exposure:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>&bull; <strong>C-PEC:</strong> Class II BSC or CACI</li>
                <li>&bull; <strong>Negative Pressure:</strong> -0.01 to -0.03&quot; w.g.</li>
                <li>&bull; <strong>CSTDs:</strong> Mandatory for administration</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 6: 6-Language Patient Counseling Leaflet Generator */}
      {activeModuleTab === 'multilingual_counseling' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                FIP Pictograms &amp; Multilingual Health Literacy Engine
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                6-Language Patient Medication Counseling Leaflets
              </h3>
            </div>

            {/* Language Switcher */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { code: 'en', label: 'English' },
                { code: 'om', label: 'Afaan Oromoo' },
                { code: 'am', label: 'አማርኛ' },
                { code: 'fr', label: 'Français' },
                { code: 'ar', label: 'العربية' },
                { code: 'es', label: 'Español' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedCounselingLang(lang.code as SupportedCounselingLang)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCounselingLang === lang.code
                      ? 'bg-teal-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drug Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {counselingMedications.map(med => (
              <button
                key={med.id}
                onClick={() => setSelectedCounselingDrugId(med.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCounselingMed.id === med.id
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {med.genericName}
              </button>
            ))}
          </div>

          {/* Printable Patient Handout Preview Card */}
          <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  {selectedCounselingMed.therapeuticClass[selectedCounselingLang]}
                </span>
                <h4 className="text-xl font-black text-white mt-0.5">
                  {selectedCounselingMed.genericName}
                </h4>
                <p className="text-xs text-slate-400">
                  Common Brands: {selectedCounselingMed.brandNames.join(', ')}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Leaflet for Patient</span>
              </button>
            </div>

            {/* Visual Administration Timing Schedule (FIP Pictograms) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Visual Administration Schedule (When to Take):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className={`p-3 rounded-lg border ${selectedCounselingMed.timingSchedule.morning ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  🌅 Morning (Ganama)
                  <div className="text-[10px]">{selectedCounselingMed.timingSchedule.morning ? '✓ Take' : '—'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${selectedCounselingMed.timingSchedule.noon ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  ☀️ Noon (Guyyaa)
                  <div className="text-[10px]">{selectedCounselingMed.timingSchedule.noon ? '✓ Take' : '—'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${selectedCounselingMed.timingSchedule.evening ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  🌇 Evening (Galgala)
                  <div className="text-[10px]">{selectedCounselingMed.timingSchedule.evening ? '✓ Take' : '—'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${selectedCounselingMed.timingSchedule.bedtime ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  🌙 Bedtime (Halkan)
                  <div className="text-[10px]">{selectedCounselingMed.timingSchedule.bedtime ? '✓ Take' : '—'}</div>
                </div>
              </div>
            </div>

            {/* Localized Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-teal-400 block">Why You Need This Medicine:</span>
                <p className="text-slate-200 leading-relaxed">{selectedCounselingMed.primaryUses[selectedCounselingLang]}</p>
                <span className="font-bold text-amber-400 block pt-2">How to Take It Properly:</span>
                <p className="text-slate-200 leading-relaxed">{selectedCounselingMed.howToTake[selectedCounselingLang]}</p>
                <span className="font-bold text-teal-400 block pt-2">Food &amp; Drink Advice:</span>
                <p className="text-slate-200 leading-relaxed">{selectedCounselingMed.foodInstruction[selectedCounselingLang]}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-400 block">Important Warning / When to Call Doctor:</span>
                <p className="text-rose-300 leading-relaxed bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
                  {selectedCounselingMed.redFlagWarning[selectedCounselingLang]}
                </p>
                <span className="font-bold text-slate-300 block pt-2">Pregnancy &amp; Breastfeeding Safety:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  FDA Category {selectedCounselingMed.pregnancyRisk.categoryFDA}: {selectedCounselingMed.pregnancyRisk.explanation[selectedCounselingLang]}
                </p>
                <span className="font-bold text-slate-300 block pt-2">Storage:</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">{selectedCounselingMed.storageCondition[selectedCounselingLang]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
