import React, { useState } from 'react';
import { 
  Calculator, Activity, Droplets, Scale, Stethoscope, 
  RefreshCw, Copy, Check, Info, ShieldCheck, AlertTriangle, 
  Baby, HeartPulse, ChevronRight, ArrowRight
} from 'lucide-react';

export const ClinicalCalculator: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<
    'crcl' | 'bmi' | 'iv_drip' | 'pediatric' | 'timi' | 'childpugh' | 'padua' | 'curb65' | 'cha2ds2vasc'
  >('crcl');
  const [copiedText, setCopiedText] = useState(false);

  // =========================================================================
  // 1. CrCl (Cockcroft-Gault) & CKD Calculator State
  // =========================================================================
  const [crclAge, setCrclAge] = useState<number>(65);
  const [crclGender, setCrclGender] = useState<'Male' | 'Female'>('Male');
  const [crclWeight, setCrclWeight] = useState<number>(70);
  const [crclHeightCm, setCrclHeightCm] = useState<number>(172);
  const [crclScr, setCrclScr] = useState<number>(1.6);
  const [weightBasis, setWeightBasis] = useState<'actual' | 'ibw' | 'adjbw'>('actual');

  // Height in inches
  const heightInches = crclHeightCm / 2.54;
  const inchesOver60 = Math.max(0, heightInches - 60);

  // Ideal Body Weight (Devine formula)
  const ibw = crclGender === 'Male'
    ? 50 + 2.3 * inchesOver60
    : 45.5 + 2.3 * inchesOver60;

  // Adjusted Body Weight (for patients > 120% of IBW)
  const isObese = crclWeight > 1.2 * ibw;
  const adjBw = ibw + 0.4 * (crclWeight - ibw);

  // Selected weight for CrCl
  const effectiveWeight = weightBasis === 'ibw' ? ibw : weightBasis === 'adjbw' ? adjBw : crclWeight;

  // Cockcroft-Gault calculation
  const rawCrCl = crclScr > 0
    ? ((140 - crclAge) * effectiveWeight) / (72 * crclScr)
    : 0;
  const crcl = crclGender === 'Female' ? rawCrCl * 0.85 : rawCrCl;
  const roundedCrCl = Math.max(0, Math.round(crcl * 10) / 10);

  // CKD Stage classification
  let ckdStage = 'Normal (G1)';
  let ckdColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let renalGuidelineNote = 'Standard pharmacotherapy doses acceptable. Monitor baseline.';

  if (roundedCrCl < 15) {
    ckdStage = 'Kidney Failure / Stage 5 (eGFR/CrCl < 15 mL/min)';
    ckdColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    renalGuidelineNote = 'Metformin, SGLT2i, NSAIDs CONTRAINDICATED. Substantially reduce Enoxaparin, Cipro, Aminoglycosides. Prepare for RRT/Dialysis.';
  } else if (roundedCrCl < 30) {
    ckdStage = 'Severe Impairment / Stage 4 (CrCl 15 - 29 mL/min)';
    ckdColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    renalGuidelineNote = 'Metformin CONTRAINDICATED (lactic acidosis). Enoxaparin reduce to 1mg/kg QD. Lisinopril max 5mg. Spironolactone avoid or close K+ check.';
  } else if (roundedCrCl < 45) {
    ckdStage = 'Moderate-Severe / Stage 3b (CrCl 30 - 44 mL/min)';
    ckdColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    renalGuidelineNote = 'Metformin maximum 1,000 mg/day (500mg BID). Adjust Ciprofloxacin to 500mg daily. Monitor electrolytes.';
  } else if (roundedCrCl < 60) {
    ckdStage = 'Moderate Impairment / Stage 3a (CrCl 45 - 59 mL/min)';
    ckdColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    renalGuidelineNote = 'Mild dose titration for narrow therapeutic index agents (Digoxin, Lithium, Vancomycin).';
  } else if (roundedCrCl < 90) {
    ckdStage = 'Mild Impairment / Stage 2 (CrCl 60 - 89 mL/min)';
    ckdColor = 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    renalGuidelineNote = 'Usually requires no dose adjustment for broad-therapeutic index antimicrobials.';
  }

  // =========================================================================
  // 2. BMI, IBW, BSA Calculator State
  // =========================================================================
  const [bmiWeight, setBmiWeight] = useState<number>(75);
  const [bmiHeightCm, setBmiHeightCm] = useState<number>(175);
  const [bmiGender, setBmiGender] = useState<'Male' | 'Female'>('Male');

  const heightM = bmiHeightCm / 100;
  const bmi = heightM > 0 ? bmiWeight / (heightM * heightM) : 0;
  const roundedBmi = Math.round(bmi * 10) / 10;

  // BSA (Mosteller: sqrt(wt * ht / 3600))
  const bsa = Math.sqrt((bmiWeight * bmiHeightCm) / 3600);
  const roundedBsa = Math.round(bsa * 100) / 100;

  // BMI Category
  let bmiCategory = 'Normal Weight';
  let bmiBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (roundedBmi < 18.5) {
    bmiCategory = 'Underweight (Risk of cachexia / altered volume of distribution)';
    bmiBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (roundedBmi < 25) {
    bmiCategory = 'Normal Weight (18.5 - 24.9 kg/m²)';
    bmiBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (roundedBmi < 30) {
    bmiCategory = 'Overweight (Pre-obesity 25.0 - 29.9 kg/m²)';
    bmiBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (roundedBmi < 35) {
    bmiCategory = 'Obese Class I (30.0 - 34.9 kg/m²)';
    bmiBadgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (roundedBmi < 40) {
    bmiCategory = 'Obese Class II (35.0 - 39.9 kg/m²)';
    bmiBadgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else {
    bmiCategory = 'Obese Class III / Severe Morbid Obesity (≥ 40.0 kg/m²)';
    bmiBadgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  // =========================================================================
  // 3. IV Drip Rate & Infusion Calculator State
  // =========================================================================
  const [ivVolumeMl, setIvVolumeMl] = useState<number>(1000); // 1000 mL Normal Saline
  const [ivDurationHours, setIvDurationHours] = useState<number>(8);
  const [ivDropFactor, setIvDropFactor] = useState<number>(20); // 20 gtt/mL (standard macrodrip)

  const totalMinutes = ivDurationHours * 60;
  const flowRateMlHr = ivDurationHours > 0 ? Math.round((ivVolumeMl / ivDurationHours) * 10) / 10 : 0;
  const dripRateGttMin = totalMinutes > 0 ? Math.round((ivVolumeMl * ivDropFactor) / totalMinutes) : 0;
  const dropsPerSecond = dripRateGttMin > 0 ? Math.round((60 / dripRateGttMin) * 10) / 10 : 0;

  // =========================================================================
  // 4. Pediatric Dosage Calculator State
  // =========================================================================
  const [pedsWeightKg, setPedsWeightKg] = useState<number>(15);
  const [pedsDosePerKg, setPedsDosePerKg] = useState<number>(15); // e.g. 15 mg/kg Paracetamol
  const [pedsConcentrationMg, setPedsConcentrationMg] = useState<number>(250); // 250 mg
  const [pedsConcentrationMl, setPedsConcentrationMl] = useState<number>(5); // in 5 mL

  const pedsTotalDoseMg = Math.round(pedsWeightKg * pedsDosePerKg * 10) / 10;
  const pedsDoseVolumeMl = pedsConcentrationMg > 0
    ? Math.round(((pedsTotalDoseMg * pedsConcentrationMl) / pedsConcentrationMg) * 10) / 10
    : 0;

  // =========================================================================
  // 5. TIMI Risk Score (UA / NSTEMI)
  // =========================================================================
  const [timiAge65, setTimiAge65] = useState(true);
  const [timiCadRiskFactors, setTimiCadRiskFactors] = useState(true); // >=3 CAD risk factors
  const [timiKnownCad, setTimiKnownCad] = useState(false); // Stenosis >= 50%
  const [timiAspirinPast7d, setTimiAspirinPast7d] = useState(true);
  const [timiSevereAngina, setTimiSevereAngina] = useState(true); // >=2 episodes in 24h
  const [timiStDeviation, setTimiStDeviation] = useState(true); // ST deviation >= 0.5mm
  const [timiElevatedMarkers, setTimiElevatedMarkers] = useState(true); // Troponin / CK-MB

  const timiScore = (timiAge65 ? 1 : 0) +
                    (timiCadRiskFactors ? 1 : 0) +
                    (timiKnownCad ? 1 : 0) +
                    (timiAspirinPast7d ? 1 : 0) +
                    (timiSevereAngina ? 1 : 0) +
                    (timiStDeviation ? 1 : 0) +
                    (timiElevatedMarkers ? 1 : 0);

  let timi14DayRisk = '4.7% (Low Risk)';
  let timiColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let timiStrategy = 'Conservative medical stabilization. Dual antiplatelet therapy (Aspirin + Clopidogrel) + Enoxaparin / Fondaparinux.';
  if (timiScore >= 5) {
    timi14DayRisk = timiScore === 5 ? '26.2% (High Risk)' : '40.9% (Very High Risk)';
    timiColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    timiStrategy = 'Early invasive strategy indicated (Coronary Angiography < 24h). Dual antiplatelet, high-intensity statin (Atorvastatin 80mg), and parenteral anticoagulation.';
  } else if (timiScore >= 3) {
    timi14DayRisk = timiScore === 3 ? '13.2% (Intermediate Risk)' : '19.9% (Intermediate-High Risk)';
    timiColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    timiStrategy = 'Inpatient monitored bed. Routine early invasive angiography recommended within 24–72 hours.';
  } else if (timiScore === 2) {
    timi14DayRisk = '8.3% (Low-Intermediate Risk)';
    timiColor = 'text-teal-400 bg-teal-500/10 border-teal-500/30';
  }

  // =========================================================================
  // 6. Child-Pugh Score (Cirrhosis & Hepatic Drug Clearance)
  // =========================================================================
  const [childBilirubin, setChildBilirubin] = useState<1 | 2 | 3>(2); // 1: <2, 2: 2-3, 3: >3 mg/dL
  const [childAlbumin, setChildAlbumin] = useState<1 | 2 | 3>(2); // 1: >3.5, 2: 2.8-3.5, 3: <2.8 g/dL
  const [childInr, setChildInr] = useState<1 | 2 | 3>(1); // 1: <1.7, 2: 1.7-2.3, 3: >2.3
  const [childAscites, setChildAscites] = useState<1 | 2 | 3>(2); // 1: None, 2: Slight/Controlled, 3: Moderate/Severe
  const [childEncephalopathy, setChildEncephalopathy] = useState<1 | 2 | 3>(1); // 1: None, 2: Grade 1-2, 3: Grade 3-4

  const childPughScore = childBilirubin + childAlbumin + childInr + childAscites + childEncephalopathy;
  let childClass = 'Class A (Well-Compensated Disease)';
  let childSurvival = '100% 1-year survival • 85% 2-year survival';
  let childDosing = 'Standard or mild dose reduction (approx. 25%) for high-extraction hepatically metabolized drugs (e.g. Propranolol, Morphine, Verapamil).';
  let childBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  if (childPughScore >= 10) {
    childClass = 'Class C (Decompensated Cirrhosis)';
    childSurvival = '45% 1-year survival • 35% 2-year survival';
    childDosing = 'Severe hepatic clearance impairment. Avoid hepatically metabolized sedatives/narcotics (precipitates coma). Reduce maintenance doses by > 50%. Paracetamol max 2g/day.';
    childBadgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (childPughScore >= 7) {
    childClass = 'Class B (Significant Functional Hepatic Compromise)';
    childSurvival = '80% 1-year survival • 60% 2-year survival';
    childDosing = 'Moderate hepatic impairment. Reduce doses of hepatically cleared medications by 25% to 50%. Monitor LFTs and mental status.';
    childBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  // =========================================================================
  // 7. Padua Prediction Score (VTE in Hospitalized Medical Patients)
  // =========================================================================
  const [paduaActiveCancer, setPaduaActiveCancer] = useState(false); // 3 pts
  const [paduaPreviousVte, setPaduaPreviousVte] = useState(false); // 3 pts
  const [paduaReducedMobility, setPaduaReducedMobility] = useState(true); // 3 pts (bedridden >= 3d)
  const [paduaThrombophilia, setPaduaThrombophilia] = useState(false); // 3 pts
  const [paduaRecentTraumaSurgery, setPaduaRecentTraumaSurgery] = useState(false); // 2 pts
  const [paduaAge70, setPaduaAge70] = useState(true); // 1 pt
  const [paduaHeartRespFailure, setPaduaHeartRespFailure] = useState(true); // 1 pt
  const [paduaAcuteMiStroke, setPaduaAcuteMiStroke] = useState(false); // 1 pt
  const [paduaAcuteInfection, setPaduaAcuteInfection] = useState(true); // 1 pt
  const [paduaObesity, setPaduaObesity] = useState(false); // 1 pt (BMI >= 30)
  const [paduaHormonalTx, setPaduaHormonalTx] = useState(false); // 1 pt

  const paduaScore = (paduaActiveCancer ? 3 : 0) +
                     (paduaPreviousVte ? 3 : 0) +
                     (paduaReducedMobility ? 3 : 0) +
                     (paduaThrombophilia ? 3 : 0) +
                     (paduaRecentTraumaSurgery ? 2 : 0) +
                     (paduaAge70 ? 1 : 0) +
                     (paduaHeartRespFailure ? 1 : 0) +
                     (paduaAcuteMiStroke ? 1 : 0) +
                     (paduaAcuteInfection ? 1 : 0) +
                     (paduaObesity ? 1 : 0) +
                     (paduaHormonalTx ? 1 : 0);

  const isPaduaHighRisk = paduaScore >= 4;

  // =========================================================================
  // 8. CURB-65 Pneumonia Severity Score
  // =========================================================================
  const [curbConfusion, setCurbConfusion] = useState(false);
  const [curbUrea, setCurbUrea] = useState(true); // BUN > 19 mg/dL (Urea > 7 mmol/L)
  const [curbRr, setCurbRr] = useState(true); // RR >= 30 /min
  const [curbBp, setCurbBp] = useState(false); // SBP < 90 or DBP <= 60
  const [curbAge65, setCurbAge65] = useState(true);

  const curbScore = (curbConfusion ? 1 : 0) + (curbUrea ? 1 : 0) + (curbRr ? 1 : 0) + (curbBp ? 1 : 0) + (curbAge65 ? 1 : 0);

  // =========================================================================
  // 9. CHA2DS2-VASc Atrial Fibrillation Stroke Risk Score
  // =========================================================================
  const [chadsChf, setChadsChf] = useState(true); // 1 pt
  const [chadsHtn, setChadsHtn] = useState(true); // 1 pt
  const [chadsAge75, setChadsAge75] = useState(false); // 2 pts
  const [chadsDm, setChadsDm] = useState(false); // 1 pt
  const [chadsStroke, setChadsStroke] = useState(false); // 2 pts
  const [chadsVascular, setChadsVascular] = useState(true); // 1 pt
  const [chadsAge6574, setChadsAge6574] = useState(true); // 1 pt
  const [chadsFemale, setChadsFemale] = useState(false); // 1 pt

  const chadsScore = (chadsChf ? 1 : 0) +
                     (chadsHtn ? 1 : 0) +
                     (chadsAge75 ? 2 : (chadsAge6574 ? 1 : 0)) +
                     (chadsDm ? 1 : 0) +
                     (chadsStroke ? 2 : 0) +
                     (chadsVascular ? 1 : 0) +
                     (chadsFemale ? 1 : 0);

  // Copy Result Function
  const handleCopyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center gap-1">
                <Calculator className="w-3 h-3 text-teal-400" />
                Clinical Pharmacotherapy Engine
              </span>
              <span className="text-[11px] text-slate-400">Verified Cockcroft-Gault, Mosteller & IV Nomograms</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">Clinical Pharmacist Medical Calculators</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Precision clinical formulas for hospital wards, ICU, and outpatient dispensaries: Renal clearance, body composition, IV drip rates, and pediatric weight-based dosing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Lead Clinical Pharmacist: <strong className="text-teal-300">Dawid Aliyi, BCPS</strong>
            </span>
          </div>
        </div>

        {/* Calculator Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCalc('crcl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'crcl'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-300" />
            <span>CrCl (Cockcroft-Gault) & Renal Staging</span>
          </button>

          <button
            onClick={() => setActiveCalc('bmi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'bmi'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-300" />
            <span>BMI, Ideal Body Weight & BSA</span>
          </button>

          <button
            onClick={() => setActiveCalc('iv_drip')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'iv_drip'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-300" />
            <span>IV Drip Rate & Infusion Speed</span>
          </button>

          <button
            onClick={() => setActiveCalc('pediatric')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'pediatric'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Baby className="w-3.5 h-3.5 text-amber-300" />
            <span>Pediatric mg/kg</span>
          </button>

          <button
            onClick={() => setActiveCalc('timi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'timi'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>TIMI Risk Score (UA/NSTEMI)</span>
          </button>

          <button
            onClick={() => setActiveCalc('childpugh')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'childpugh'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Child-Pugh Score (Hepatic Cirrhosis)</span>
          </button>

          <button
            onClick={() => setActiveCalc('padua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'padua'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Padua Score (VTE Prophylaxis)</span>
          </button>

          <button
            onClick={() => setActiveCalc('curb65')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'curb65'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>CURB-65 Pneumonia</span>
          </button>

          <button
            onClick={() => setActiveCalc('cha2ds2vasc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeCalc === 'cha2ds2vasc'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-purple-400" />
            <span>CHA2DS2-VASc (AF Stroke Risk)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CrCl (COCKCROFT-GAULT) & RENAL DOSING CALCULATOR */}
      {/* ========================================================================= */}
      {activeCalc === 'crcl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Patient Parameters for Renal Clearance</span>
              </h3>
              <span className="text-[10px] text-teal-400 font-mono">Cockcroft-Gault Equation</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Gender</label>
                <select
                  value={crclGender}
                  onChange={(e) => setCrclGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:border-teal-500"
                >
                  <option value="Male">Male (Factor: 1.0)</option>
                  <option value="Female">Female (Factor: 0.85)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={crclAge}
                  onChange={(e) => setCrclAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Actual Body Weight (kg)</label>
                <input
                  type="number"
                  value={crclWeight}
                  onChange={(e) => setCrclWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={crclHeightCm}
                  onChange={(e) => setCrclHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:border-teal-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Serum Creatinine (mg/dL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={crclScr}
                    onChange={(e) => setCrclScr(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold text-base focus:border-teal-500"
                  />
                  <div className="flex items-center gap-1">
                    {[0.8, 1.2, 1.8, 2.5, 3.5].map(val => (
                      <button
                        key={val}
                        onClick={() => setCrclScr(val)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                          crclScr === val ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight Basis Selection */}
              <div className="col-span-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Weight Basis for Calculation</span>
                  {isObese && (
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Patient is Obese ({Math.round(crclWeight / ibw * 100)}% of IBW)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setWeightBasis('actual')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      weightBasis === 'actual' ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] block font-bold">Actual Weight</span>
                    <span className="text-xs font-mono">{crclWeight} kg</span>
                  </button>
                  <button
                    onClick={() => setWeightBasis('ibw')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      weightBasis === 'ibw' ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] block font-bold">Ideal (IBW)</span>
                    <span className="text-xs font-mono">{Math.round(ibw * 10) / 10} kg</span>
                  </button>
                  <button
                    onClick={() => setWeightBasis('adjbw')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      weightBasis === 'adjbw' ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] block font-bold">Adjusted (AdjBW)</span>
                    <span className="text-xs font-mono">{Math.round(adjBw * 10) / 10} kg</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Pharmacotherapy Action Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cockcroft-Gault Creatinine Clearance Result
                </span>
                <button
                  onClick={() => handleCopyResult(`CrCl: ${roundedCrCl} mL/min (${ckdStage}) | SCr: ${crclScr} mg/dL, Age: ${crclAge}y, Wt: ${effectiveWeight} kg`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-teal-400" />}
                  <span>{copiedText ? 'Copied' : 'Copy Result'}</span>
                </button>
              </div>

              {/* Big Result Badge */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold">Estimated Creatinine Clearance (CrCl)</span>
                <div className="text-4xl font-black text-teal-400 font-mono">
                  {roundedCrCl} <span className="text-lg font-bold text-slate-400">mL/min</span>
                </div>
                <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${ckdColor}`}>
                  {ckdStage}
                </div>
              </div>

              {/* Clinical Guidelines Warning */}
              <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-teal-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clinical Pharmacist Renal Dosing Directive (2026 Ethiopian STG):</span>
                </div>
                <p className="leading-relaxed pl-5">
                  {renalGuidelineNote}
                </p>
              </div>

              {/* Fast Renal Dosing Reference Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Common Drug Dosing for this Clearance ({roundedCrCl} mL/min):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block">Metformin:</span>
                    <span className={roundedCrCl < 30 ? 'text-rose-400 font-bold' : roundedCrCl < 45 ? 'text-amber-300' : 'text-slate-300'}>
                      {roundedCrCl < 30 ? 'CONTRAINDICATED' : roundedCrCl < 45 ? 'Max 1000 mg/day (500 BID)' : 'Standard Dosing'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block">Ciprofloxacin:</span>
                    <span className={roundedCrCl < 30 ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                      {roundedCrCl < 30 ? '250-500 mg q18-24h' : '500-750 mg q12h'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block">Enoxaparin (Therapeutic):</span>
                    <span className={roundedCrCl < 30 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {roundedCrCl < 30 ? '1 mg/kg q24h (or UFH)' : '1 mg/kg q12h'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-white block">Gabapentin:</span>
                    <span className={roundedCrCl < 30 ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                      {roundedCrCl < 30 ? '200-300 mg daily or QOD' : '300-600 mg TID'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BMI, IDEAL BODY WEIGHT & BSA CALCULATOR */}
      {/* ========================================================================= */}
      {activeCalc === 'bmi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Anthropometric Measurements</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Quetelet & Mosteller Nomograms</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Gender</label>
                <select
                  value={bmiGender}
                  onChange={(e) => setBmiGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={bmiWeight}
                  onChange={(e) => setBmiWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={bmiHeightCm}
                  onChange={(e) => setBmiHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Body Composition Analysis
              </span>
              <button
                onClick={() => handleCopyResult(`BMI: ${roundedBmi} kg/m² (${bmiCategory}) | BSA: ${roundedBsa} m² | Weight: ${bmiWeight} kg, Height: ${bmiHeightCm} cm`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-teal-400" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-bold block">Body Mass Index (BMI)</span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                  {roundedBmi} <span className="text-xs text-slate-400">kg/m²</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-bold block">Body Surface Area (BSA)</span>
                <div className="text-3xl font-black text-teal-400 font-mono mt-1">
                  {roundedBsa} <span className="text-xs text-slate-400">m²</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs font-bold text-center ${bmiBadgeColor}`}>
              Classification: {bmiCategory}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ideal Body Weight (Devine):</span>
                <span className="font-bold text-white font-mono">
                  {Math.round((bmiGender === 'Male' ? 50 + 2.3 * Math.max(0, bmiHeightCm / 2.54 - 60) : 45.5 + 2.3 * Math.max(0, bmiHeightCm / 2.54 - 60)) * 10) / 10} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Chemotherapy / Oncology Dosing Base:</span>
                <span className="font-bold text-teal-400 font-mono">{roundedBsa} m² (Mosteller)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. IV DRIP RATE & INFUSION CALCULATOR */}
      {/* ========================================================================= */}
      {activeCalc === 'iv_drip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>IV Fluid & Administration Set Inputs</span>
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">Gravity & Pump Flow</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Total Infusion Volume (mL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={ivVolumeMl}
                    onChange={(e) => setIvVolumeMl(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                  <div className="flex gap-1">
                    {[100, 250, 500, 1000].map(v => (
                      <button
                        key={v}
                        onClick={() => setIvVolumeMl(v)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          ivVolumeMl === v ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {v}ml
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Infusion Duration (Hours)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={ivDurationHours}
                    onChange={(e) => setIvDurationHours(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                  <div className="flex gap-1">
                    {[1, 2, 4, 8, 12, 24].map(h => (
                      <button
                        key={h}
                        onClick={() => setIvDurationHours(h)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          ivDurationHours === h ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Drop Factor (gtt/mL)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { factor: 20, label: '20 gtt/mL (Standard)' },
                    { factor: 15, label: '15 gtt/mL (Baxter)' },
                    { factor: 10, label: '10 gtt/mL (Blood/Abbott)' },
                    { factor: 60, label: '60 gtt/mL (Microdrip)' }
                  ].map(df => (
                    <button
                      key={df.factor}
                      onClick={() => setIvDropFactor(df.factor)}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        ivDropFactor === df.factor
                          ? 'bg-cyan-600 text-white border-cyan-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">{df.factor} gtt</span>
                      <span className="text-[9px] text-slate-400 block">{df.label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Infusion Administration Plan
              </span>
              <button
                onClick={() => handleCopyResult(`IV Rate: ${dripRateGttMin} drops/min (${flowRateMlHr} mL/hr) | Volume: ${ivVolumeMl} mL over ${ivDurationHours} hrs using ${ivDropFactor} gtt/mL set`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-center">
                <span className="text-xs text-slate-400 font-bold block">Gravity Drip Rate</span>
                <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
                  {dripRateGttMin} <span className="text-xs text-slate-400">drops/min</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  ≈ 1 drop every {dropsPerSecond} seconds
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-bold block">Electronic Pump Rate</span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {flowRateMlHr} <span className="text-xs text-slate-400">mL/hr</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Total Volume: {ivVolumeMl} mL
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Info className="w-3.5 h-3.5" />
                <span>Bedside Nursing & Pharmacy Verification Note:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] pl-5">
                Administering {ivVolumeMl} mL over {ivDurationHours} hours requires setting gravity roller clamp to <strong>{dripRateGttMin} gtt/min</strong> (approx {Math.round(dripRateGttMin / 4)} drops every 15 seconds) using a {ivDropFactor} gtt/mL IV infusion set.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PEDIATRIC DOSAGE & LIQUID VOLUME CALCULATOR */}
      {/* ========================================================================= */}
      {activeCalc === 'pediatric' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Baby className="w-4 h-4 text-amber-400" />
                <span>Pediatric Patient & Drug Suspension</span>
              </h3>
              <span className="text-[10px] text-amber-400 font-mono">Weight-Based Nomogram</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Child Body Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={pedsWeightKg}
                  onChange={(e) => setPedsWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Prescribed Dose per kg (mg/kg/dose)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={pedsDosePerKg}
                    onChange={(e) => setPedsDosePerKg(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                  <div className="flex gap-1">
                    {[10, 15, 20, 25, 45].map(d => (
                      <button
                        key={d}
                        onClick={() => setPedsDosePerKg(d)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          pedsDosePerKg === d ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {d}mg/kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Drug Amount (mg)</label>
                  <input
                    type="number"
                    value={pedsConcentrationMg}
                    onChange={(e) => setPedsConcentrationMg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium"
                    placeholder="e.g. 250 mg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">in Liquid Volume (mL)</label>
                  <input
                    type="number"
                    value={pedsConcentrationMl}
                    onChange={(e) => setPedsConcentrationMl(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium"
                    placeholder="e.g. 5 mL"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pediatric Dispensing Calculation
              </span>
              <button
                onClick={() => handleCopyResult(`Pediatric Dose: ${pedsTotalDoseMg} mg (${pedsDoseVolumeMl} mL of ${pedsConcentrationMg}mg/${pedsConcentrationMl}mL) for ${pedsWeightKg} kg child (${pedsDosePerKg} mg/kg)`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-center">
                <span className="text-xs text-slate-400 font-bold block">Volume to Measure</span>
                <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                  {pedsDoseVolumeMl} <span className="text-xs text-slate-400">mL</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Using oral syringe / cup
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-bold block">Total Dose per Administration</span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {pedsTotalDoseMg} <span className="text-xs text-slate-400">mg</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {pedsDosePerKg} mg/kg × {pedsWeightKg} kg
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Info className="w-3.5 h-3.5" />
                <span>Caregiver Dispensing Instructions:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] pl-5">
                Instruct parent to shake suspension well before use. Measure exactly <strong>{pedsDoseVolumeMl} mL</strong> with oral dosing syringe. Store per manufacturer storage guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TIMI RISK SCORE (UA / NSTEMI & STEMI) */}
      {/* ========================================================================= */}
      {activeCalc === 'timi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>TIMI Risk Criteria (Unstable Angina / NSTEMI)</span>
              </h3>
              <span className="text-[10px] text-slate-400">1 Point per Item</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Age ≥ 65 years', val: timiAge65, setVal: setTimiAge65, desc: 'Elderly acute coronary presentation' },
                { label: '≥ 3 CAD Risk Factors', val: timiCadRiskFactors, setVal: setTimiCadRiskFactors, desc: 'HTN, Diabetes, Dyslipidemia, Smoker, Family Hx' },
                { label: 'Known CAD (Stenosis ≥ 50%)', val: timiKnownCad, setVal: setTimiKnownCad, desc: 'Prior angiography documentation' },
                { label: 'Aspirin use in past 7 days', val: timiAspirinPast7d, setVal: setTimiAspirinPast7d, desc: 'Ischemia occurred despite antiplatelet coverage' },
                { label: 'Severe Angina (≥ 2 episodes in last 24h)', val: timiSevereAngina, setVal: setTimiSevereAngina, desc: 'Accelerating anginal frequency / rest pain' },
                { label: 'ST-segment deviation ≥ 0.5 mm on ECG', val: timiStDeviation, setVal: setTimiStDeviation, desc: 'Acute ischemic electrophysiologic changes' },
                { label: 'Elevated cardiac biomarkers', val: timiElevatedMarkers, setVal: setTimiElevatedMarkers, desc: 'Troponin I/T or CK-MB above upper reference limit' }
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.setVal(e.target.checked)}
                    className="mt-0.5 accent-rose-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-200 block">{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                TIMI Risk Assessment
              </span>
              <button
                onClick={() => handleCopyResult(`TIMI Score: ${timiScore}/7 • 14-Day Risk: ${timi14DayRisk} • Strategy: ${timiStrategy}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-400" />}
                <span>{copiedText ? 'Copied' : 'Copy Score'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 text-center">
              <span className="text-xs text-slate-400 font-bold block">Total TIMI Score (0 - 7)</span>
              <div className="text-4xl font-black text-rose-400 font-mono mt-1">
                {timiScore} <span className="text-xs text-slate-400">/ 7</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 border ${timiColor}`}>
                14-Day Event Risk: {timi14DayRisk}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Clinical Pharmacotherapy & Revascularization Plan:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {timiStrategy}
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                Endpoint: All-cause mortality, new/recurrent myocardial infarction, or severe recurrent ischemia requiring urgent revascularization at 14 days.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CHILD-PUGH SCORE (HEPATIC CIRRHOSIS & DRUG DOSING) */}
      {/* ========================================================================= */}
      {activeCalc === 'childpugh' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Child-Turcotte-Pugh Clinical Parameters</span>
              </h3>
              <span className="text-[10px] text-slate-400">1 to 3 Points each</span>
            </div>

            {/* Total Bilirubin */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">1. Total Bilirubin (mg/dL):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '< 2.0 mg/dL (1 pt)', val: 1 },
                  { label: '2.0 - 3.0 mg/dL (2 pts)', val: 2 },
                  { label: '> 3.0 mg/dL (3 pts)', val: 3 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setChildBilirubin(opt.val as any)}
                    className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                      childBilirubin === opt.val ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Serum Albumin */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">2. Serum Albumin (g/dL):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '> 3.5 g/dL (1 pt)', val: 1 },
                  { label: '2.8 - 3.5 g/dL (2 pts)', val: 2 },
                  { label: '< 2.8 g/dL (3 pts)', val: 3 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setChildAlbumin(opt.val as any)}
                    className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                      childAlbumin === opt.val ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prothrombin Time / INR */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">3. INR / Prothrombin Time:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'INR < 1.7 (1 pt)', val: 1 },
                  { label: 'INR 1.7 - 2.3 (2 pts)', val: 2 },
                  { label: 'INR > 2.3 (3 pts)', val: 3 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setChildInr(opt.val as any)}
                    className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                      childInr === opt.val ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ascites */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">4. Ascites:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'None (1 pt)', val: 1 },
                  { label: 'Slight / Controlled (2 pts)', val: 2 },
                  { label: 'Moderate / Refractory (3 pts)', val: 3 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setChildAscites(opt.val as any)}
                    className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                      childAscites === opt.val ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hepatic Encephalopathy */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">5. Hepatic Encephalopathy:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'None (1 pt)', val: 1 },
                  { label: 'Grade 1-2 (2 pts)', val: 2 },
                  { label: 'Grade 3-4 (3 pts)', val: 3 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setChildEncephalopathy(opt.val as any)}
                    className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                      childEncephalopathy === opt.val ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Hepatic Staging & Prognosis
              </span>
              <button
                onClick={() => handleCopyResult(`Child-Pugh Score: ${childPughScore} (${childClass}) • Survival: ${childSurvival} • Dosing: ${childDosing}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-center">
              <span className="text-xs text-slate-400 font-bold block">Total Child-Pugh Score (5 - 15)</span>
              <div className="text-4xl font-black text-amber-400 font-mono mt-1">
                {childPughScore} <span className="text-xs text-slate-400">Points</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 border ${childBadgeColor}`}>
                {childClass}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div>
                <strong className="text-white block mb-0.5">Estimated Cirrhosis Survival:</strong>
                <span className="text-slate-300 text-[11px]">{childSurvival}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <strong className="text-amber-300 block mb-0.5">Clinical Pharmacist Dosing Directive:</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">{childDosing}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PADUA PREDICTION SCORE (VTE THROMBOPROPHYLAXIS) */}
      {/* ========================================================================= */}
      {activeCalc === 'padua' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Padua VTE Risk Factors (Hospitalized Medical Patients)</span>
              </h3>
              <span className="text-[10px] text-slate-400">Score ≥ 4 = High VTE Risk</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Active cancer (3 pts)', val: paduaActiveCancer, setVal: setPaduaActiveCancer, desc: 'Metastases and/or chemo/radiotherapy in last 6 months' },
                { label: 'Previous VTE (3 pts)', val: paduaPreviousVte, setVal: setPaduaPreviousVte, desc: 'Prior DVT or pulmonary embolism' },
                { label: 'Reduced mobility (3 pts)', val: paduaReducedMobility, setVal: setPaduaReducedMobility, desc: 'Bedridden with bathroom privileges for ≥ 3 days' },
                { label: 'Known thrombophilic condition (3 pts)', val: paduaThrombophilia, setVal: setPaduaThrombophilia, desc: 'Factor V Leiden, Antiphospholipid syndrome, Protein C/S' },
                { label: 'Recent trauma and/or surgery ≤ 1 month (2 pts)', val: paduaRecentTraumaSurgery, setVal: setPaduaRecentTraumaSurgery, desc: 'Major surgery or orthopedic fracture' },
                { label: 'Elderly age ≥ 70 years (1 pt)', val: paduaAge70, setVal: setPaduaAge70, desc: 'Advanced age physiological stasis' },
                { label: 'Heart and/or respiratory failure (1 pt)', val: paduaHeartRespFailure, setVal: setPaduaHeartRespFailure, desc: 'NYHA Class III-IV or acute COPD exacerbation' },
                { label: 'Acute MI or ischemic stroke (1 pt)', val: paduaAcuteMiStroke, setVal: setPaduaAcuteMiStroke, desc: 'Acute vascular event' },
                { label: 'Acute infection and/or rheumatologic disorder (1 pt)', val: paduaAcuteInfection, setVal: setPaduaAcuteInfection, desc: 'Pneumonia, sepsis, active inflammatory flare' },
                { label: 'Obesity with BMI ≥ 30 kg/m² (1 pt)', val: paduaObesity, setVal: setPaduaObesity, desc: 'Elevated intra-abdominal pressure' },
                { label: 'Ongoing hormonal replacement / OCP (1 pt)', val: paduaHormonalTx, setVal: setPaduaHormonalTx, desc: 'Estrogen-mediated prothrombotic state' }
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.setVal(e.target.checked)}
                    className="mt-0.5 accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-200 block">{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                VTE Thromboprophylaxis Recommendation
              </span>
              <button
                onClick={() => handleCopyResult(`Padua Score: ${paduaScore} (${isPaduaHighRisk ? 'High VTE Risk' : 'Low VTE Risk'}) • Recommendation: ${isPaduaHighRisk ? 'Pharmacologic Thromboprophylaxis with Enoxaparin 40mg SC daily' : 'Early ambulation & mechanical prophylaxis'}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className={`p-4 rounded-xl border text-center ${
              isPaduaHighRisk ? 'bg-rose-950/20 border-rose-500/40' : 'bg-emerald-950/20 border-emerald-500/40'
            }`}>
              <span className="text-xs text-slate-400 font-bold block">Padua Prediction Score</span>
              <div className={`text-4xl font-black font-mono mt-1 ${isPaduaHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                {paduaScore} <span className="text-xs text-slate-400">Points</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 border ${
                isPaduaHighRisk ? 'text-rose-300 bg-rose-500/20 border-rose-500/40' : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40'
              }`}>
                {isPaduaHighRisk ? 'HIGH VTE RISK (≥ 4 Points: ~11.0% VTE Incidence)' : 'LOW VTE RISK (< 4 Points: ~0.3% VTE Incidence)'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <strong className="text-cyan-300 block">Anticoagulation Guideline Protocol (CHEST & Ethiopian STG):</strong>
              {isPaduaHighRisk ? (
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <p>✓ <strong>Pharmacologic Thromboprophylaxis STRONGLY INDICATED:</strong></p>
                  <p>• <strong>Enoxaparin (LMWH):</strong> 40 mg Subcutaneously once daily (adjust to 30 mg SC daily if CrCl &lt; 30 mL/min).</p>
                  <p>• <strong>Unfractionated Heparin (UFH):</strong> 5,000 units SC every 8 or 12 hours (preferred in severe renal failure CrCl &lt; 15).</p>
                  <p className="text-amber-300">⚠️ Always screen for active bleeding, severe thrombocytopenia (platelets &lt; 50,000), or recent intracranial hemorrhage.</p>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <p>✓ Low baseline risk of venous thromboembolism.</p>
                  <p>• Routine pharmacologic anticoagulation is NOT routinely indicated unless clinical status deteriorates.</p>
                  <p>• Encourage early ambulation, hydration, and graduated compression stockings if indicated.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CURB-65 PNEUMONIA SEVERITY SCORE */}
      {/* ========================================================================= */}
      {activeCalc === 'curb65' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>CURB-65 Criteria (Community-Acquired Pneumonia)</span>
              </h3>
              <span className="text-[10px] text-slate-400">1 Point each</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'C - Confusion', val: curbConfusion, setVal: setCurbConfusion, desc: 'Abbreviated Mental Test score ≤ 8 or acute disorientation' },
                { label: 'U - Urea > 7 mmol/L (BUN > 19 mg/dL)', val: curbUrea, setVal: setCurbUrea, desc: 'Azotemia reflecting hypoperfusion or renal impairment' },
                { label: 'R - Respiratory Rate ≥ 30 breaths/min', val: curbRr, setVal: setCurbRr, desc: 'Severe tachypnea / respiratory distress' },
                { label: 'B - Blood Pressure: SBP < 90 or DBP ≤ 60 mmHg', val: curbBp, setVal: setCurbBp, desc: 'Systemic hypotension indicating septic shock' },
                { label: '65 - Age ≥ 65 years', val: curbAge65, setVal: setCurbAge65, desc: 'Advanced age mortality risk factor' }
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.setVal(e.target.checked)}
                    className="mt-0.5 accent-teal-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 text-center">
              <span className="text-xs text-slate-400 font-bold block">CURB-65 Pneumonia Score</span>
              <div className="text-4xl font-black text-teal-400 font-mono mt-1">
                {curbScore} <span className="text-xs text-slate-400">/ 5</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 border ${
                curbScore >= 3 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : curbScore === 2 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {curbScore >= 3 ? 'Severe CAP (Mortality ~14-28%): Urgent Inpatient / ICU' : curbScore === 2 ? 'Moderate CAP (Mortality ~9%): Hospital Inpatient Ward' : 'Mild CAP (Mortality < 2%): Outpatient Management'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <strong className="text-teal-300 block">Antimicrobial Regimen (Ethiopian National STG):</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {curbScore >= 3 
                  ? 'Inpatient ICU: Ceftriaxone 2g IV Q24H + Azithromycin 500mg IV/PO daily (or Clarithromycin). Add MRSA/Pseudomonas coverage if risk factors present.'
                  : curbScore === 2
                  ? 'Inpatient Ward: Ceftriaxone 1g IV Q24H + Azithromycin 500mg PO daily (or Ampicillin 1-2g IV Q6H + Azithromycin).'
                  : 'Outpatient: Amoxicillin 1g PO TID or Amoxicillin-Clavulanate 1000mg PO BID + Doxycycline 100mg PO BID (or Azithromycin 500mg Day 1, then 250mg QD).'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. CHA2DS2-VASc SCORE (ATRIAL FIBRILLATION STROKE RISK) */}
      {/* ========================================================================= */}
      {activeCalc === 'cha2ds2vasc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-purple-400" />
                <span>CHA2DS2-VASc Criteria (Non-Valvular AF)</span>
              </h3>
              <span className="text-[10px] text-slate-400">Total up to 9 pts</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'C - Congestive Heart Failure (+1)', val: chadsChf, setVal: setChadsChf, desc: 'LVEF ≤ 40% or clinical heart failure' },
                { label: 'H - Hypertension (+1)', val: chadsHtn, setVal: setChadsHtn, desc: 'Resting BP > 140/90 or on antihypertensives' },
                { label: 'A2 - Age ≥ 75 years (+2)', val: chadsAge75, setVal: setChadsAge75, desc: 'Doubled risk weighting for age ≥ 75' },
                { label: 'D - Diabetes Mellitus (+1)', val: chadsDm, setVal: setChadsDm, desc: 'Fasting glucose > 126 mg/dL or on antidiabetics' },
                { label: 'S2 - Stroke / TIA / Thromboembolism (+2)', val: chadsStroke, setVal: setChadsStroke, desc: 'Prior ischemic cerebrovascular event' },
                { label: 'V - Vascular Disease (+1)', val: chadsVascular, setVal: setChadsVascular, desc: 'Prior MI, peripheral artery disease, or aortic plaque' },
                { label: 'A - Age 65 - 74 years (+1)', val: chadsAge6574, setVal: setChadsAge6574, desc: 'Only counts if age < 75' },
                { label: 'Sc - Sex Category Female (+1)', val: chadsFemale, setVal: setChadsFemale, desc: 'Female gender stroke modifier' }
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.setVal(e.target.checked)}
                    className="mt-0.5 accent-purple-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 text-center">
              <span className="text-xs text-slate-400 font-bold block">CHA2DS2-VASc Stroke Risk Score</span>
              <div className="text-4xl font-black text-purple-400 font-mono mt-1">
                {chadsScore} <span className="text-xs text-slate-400">Points</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 border ${
                chadsScore >= 2 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : chadsScore === 1 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {chadsScore >= 2 ? 'High Stroke Risk: Oral Anticoagulation (DOAC/Warfarin) STRONGLY RECOMMENDED' : chadsScore === 1 ? 'Moderate Stroke Risk: Oral Anticoagulation should be considered' : 'Low Stroke Risk: No antithrombotic therapy recommended'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <strong className="text-purple-300 block">Anticoagulant Selection (DOAC vs Warfarin):</strong>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <p>• <strong>DOACs Preferred over Warfarin:</strong> Apixaban 5mg BID (2.5mg BID if 2 of: age ≥80, wt ≤60kg, SCr ≥1.5) or Rivaroxaban 20mg daily with food.</p>
                <p>• <strong>Warfarin (Coumadin):</strong> Target INR 2.0 - 3.0. Mandatory if mechanical prosthetic valve or moderate-severe mitral stenosis.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
