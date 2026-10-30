import React, { useState } from 'react';
import { initialPatientsData } from '../data/patientsData';
import { Patient } from '../types';
import { PatientOverview } from './PatientOverview';
import { 
  Users, UserCheck, AlertTriangle, FileText, Plus, 
  Search, ShieldAlert, Heart, Activity, Pill, CheckCircle2 
} from 'lucide-react';

interface PatientManagementProps {
  onCheckInteractions?: (drugs: string[]) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({ onCheckInteractions }) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatientsData);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientsData[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isAddingSoap, setIsAddingSoap] = useState(false);
  const [patientViewMode, setPatientViewMode] = useState<'overview' | 'soap_records'>('overview');

  // New patient state
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState<number>(50);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female'>('Male');
  const [newPatientWeight, setNewPatientWeight] = useState<number>(70);
  const [newPatientAllergies, setNewPatientAllergies] = useState("Penicillin");
  const [newPatientConditions, setNewPatientConditions] = useState("Hypertension, Type 2 Diabetes");
  const [newPatientMed, setNewPatientMed] = useState("Amlodipine 5mg daily, Metformin 500mg BID");

  // New SOAP state
  const [soapSubjective, setSoapSubjective] = useState("");
  const [soapObjective, setSoapObjective] = useState("");
  const [soapAssessment, setSoapAssessment] = useState("");
  const [soapPlan, setSoapPlan] = useState("");

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      mrn: `ETH-MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: newPatientName.trim(),
      age: newPatientAge,
      gender: newPatientGender,
      weightKg: newPatientWeight,
      heightCm: 170,
      serumCreatinine: 1.0,
      allergies: newPatientAllergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: newPatientConditions.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: newPatientMed.split(',').map(s => ({
        drugName: s.trim(),
        dose: "Standard",
        frequency: "Daily",
        indication: "Chronic Management",
        startDate: new Date().toISOString().split('T')[0]
      })).filter(x => x.drugName),
      soapNotes: [
        {
          id: `soap-init-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: "Clinical Pharmacist",
          subjective: "New patient admitted to clinic for comprehensive medication review.",
          objective: `Vitals stable. Weight: ${newPatientWeight} kg.`,
          assessment: "Baseline evaluation complete.",
          plan: "Optimize pharmacological regimen per clinical guidelines."
        }
      ]
    };

    setPatients(prev => [newPat, ...prev]);
    setSelectedPatientId(newPat.id);
    setIsAddingPatient(false);
    setNewPatientName("");
  };

  const handleAddSoapNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soapAssessment.trim()) return;

    const newSoap = {
      id: `soap-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: "Pharm. Dawid Aliyi, BCPS",
      subjective: soapSubjective || "Patient presented for routine pharmacotherapy follow-up.",
      objective: soapObjective || "Vitals within normal limits. Labs pending.",
      assessment: soapAssessment,
      plan: soapPlan || "Continue current regimen and monitor for adherence."
    };

    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          soapNotes: [newSoap, ...p.soapNotes]
        };
      }
      return p;
    }));

    setIsAddingSoap(false);
    setSoapSubjective("");
    setSoapObjective("");
    setSoapAssessment("");
    setSoapPlan("");
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Hospital & Outpatient Clinical Records
              </span>
              <span className="text-xs text-slate-400">Electronic Patient Record (EPR) & SOAP Documentation</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Patient History Management Module</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Maintain full patient longitudinal records, allergy registries, active drug therapies, and clinical SOAP progress notes.
            </p>
          </div>

          <button
            onClick={() => setIsAddingPatient(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Patients List (4 cols) & Patient Profile (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Browser */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[650px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name or MRN..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPatients.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedPatientId === p.id
                    ? 'bg-teal-950/40 border-teal-500/60 text-white'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold">{p.fullName}</h4>
                  <span className="text-[10px] font-mono text-teal-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {p.mrn}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{p.age} yrs • {p.gender}</span>
                  <span>• {p.weightKg} kg</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {p.allergies.slice(0, 1).map((a, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Allergy: {a.split(' ')[0]}
                    </span>
                  ))}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {p.currentMedications.length} Meds
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Patient File */}
        <div className="lg:col-span-8 space-y-4">
          {activePatient && (
            <>
              {/* Patient Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
                <button
                  onClick={() => setPatientViewMode('overview')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    patientViewMode === 'overview'
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-teal-300" />
                  <span>Patient Overview & Health Dashboard</span>
                </button>

                <button
                  onClick={() => setPatientViewMode('soap_records')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    patientViewMode === 'soap_records'
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Clinical SOAP Notes & Records ({activePatient.soapNotes.length})</span>
                </button>
              </div>

              {patientViewMode === 'overview' ? (
                <PatientOverview
                  patient={activePatient}
                  onAuditRegimen={onCheckInteractions}
                  onWriteSoapNote={() => {
                    setPatientViewMode('soap_records');
                    setIsAddingSoap(true);
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {/* Demographics Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      MRN: {activePatient.mrn}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{activePatient.fullName}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400">Age: </span>
                      <span className="font-bold text-slate-200">{activePatient.age}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Gender: </span>
                      <span className="font-bold text-slate-200">{activePatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Weight: </span>
                      <span className="font-bold text-slate-200">{activePatient.weightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Scr: </span>
                      <span className="font-bold text-teal-400">{activePatient.serumCreatinine} mg/dL</span>
                    </div>
                  </div>
                </div>

                {/* Allergies & Conditions Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-rose-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Documented Allergies (Severe):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activePatient.allergies.map((allergy, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 mb-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Chronic Medical Conditions:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activePatient.chronicConditions.map((cond, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Medications List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-400" />
                    <span>Active Pharmacotherapy Regimen ({activePatient.currentMedications.length})</span>
                  </h4>

                  {onCheckInteractions && (
                    <button
                      onClick={() => onCheckInteractions(activePatient.currentMedications.map(m => m.drugName))}
                      className="px-3 py-1 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 text-xs font-semibold cursor-pointer transition"
                    >
                      Audit In Drug Checker ➔
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePatient.currentMedications.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-slate-200">{med.drugName}</h5>
                        <p className="text-[11px] text-teal-400 font-mono">{med.dose} • {med.frequency}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Indication: {med.indication}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Since {med.startDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOAP Notes Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span>Clinical Pharmacist Progress Notes (SOAP)</span>
                  </h4>

                  <button
                    onClick={() => setIsAddingSoap(!isAddingSoap)}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingSoap ? 'Cancel' : 'Write New SOAP'}</span>
                  </button>
                </div>

                {/* Add SOAP Note Form */}
                {isAddingSoap && (
                  <form onSubmit={handleAddSoapNote} className="bg-slate-950 p-4 rounded-xl border border-teal-500/40 space-y-3">
                    <h5 className="text-xs font-bold text-teal-400">Document Clinical Pharmacist Encounter</h5>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Subjective (Symptoms, chief complaint):</label>
                        <input
                          type="text"
                          value={soapSubjective}
                          onChange={(e) => setSoapSubjective(e.target.value)}
                          placeholder="e.g. Patient reports compliance with Lisinopril, mild ankle swelling..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Objective (Vitals, lab values, exam):</label>
                        <input
                          type="text"
                          value={soapObjective}
                          onChange={(e) => setSoapObjective(e.target.value)}
                          placeholder="e.g. BP 132/82, Serum K+ 5.2, Scr 1.6..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5 font-bold text-teal-400">Assessment (Pharmacist evaluation & DDI risk):</label>
                        <textarea
                          rows={2}
                          required
                          value={soapAssessment}
                          onChange={(e) => setSoapAssessment(e.target.value)}
                          placeholder="e.g. Mild hyperkalemia secondary to ACEi + Spironolactone in CKD 3a..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Plan (Drug adjustments, lab monitoring):</label>
                        <input
                          type="text"
                          value={soapPlan}
                          onChange={(e) => setSoapPlan(e.target.value)}
                          placeholder="e.g. Check BMP in 10 days, dietary potassium restriction..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow"
                    >
                      Save SOAP Clinical Note
                    </button>
                  </form>
                )}

                {/* Rendered SOAP Notes */}
                <div className="space-y-3">
                  {activePatient.soapNotes.map(note => (
                    <div key={note.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-teal-400">{note.author}</span>
                        <span className="text-slate-400">{note.date}</span>
                      </div>
                      <div className="space-y-1.5 leading-relaxed text-slate-300">
                        <p><strong className="text-slate-400">S:</strong> {note.subjective}</p>
                        <p><strong className="text-slate-400">O:</strong> {note.objective}</p>
                        <p><strong className="text-teal-300">A:</strong> {note.assessment}</p>
                        <p><strong className="text-emerald-400">P:</strong> {note.plan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>

      {/* Register New Patient Modal */}
      {isAddingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Register New Patient File</h3>
              <button onClick={() => setIsAddingPatient(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Patient Name:</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g., Almaz Bekele"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Age:</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Gender:</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg):</label>
                  <input
                    type="number"
                    value={newPatientWeight}
                    onChange={(e) => setNewPatientWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Known Drug Allergies (comma separated):</label>
                <input
                  type="text"
                  value={newPatientAllergies}
                  onChange={(e) => setNewPatientAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Aspirin"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Chronic Conditions:</label>
                <input
                  type="text"
                  value={newPatientConditions}
                  onChange={(e) => setNewPatientConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Asthma, CKD"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Current Medications:</label>
                <input
                  type="text"
                  value={newPatientMed}
                  onChange={(e) => setNewPatientMed(e.target.value)}
                  placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPatient(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Create Patient File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
