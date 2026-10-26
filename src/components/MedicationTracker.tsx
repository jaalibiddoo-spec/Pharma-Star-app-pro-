import React, { useState } from 'react';
import { initialMedicationSchedules } from '../data/medicationTrackerData';
import { MedicationScheduleItem } from '../types';
import { 
  Check, Clock, Plus, AlertCircle, Calendar, 
  RefreshCw, CheckCircle2, XCircle, Pill, Bell 
} from 'lucide-react';

export const MedicationTracker: React.FC = () => {
  const [schedules, setSchedules] = useState<MedicationScheduleItem[]>(initialMedicationSchedules);
  const [isAddingMed, setIsAddingMed] = useState(false);

  // New med state
  const [patientName, setPatientName] = useState("Abebe Kebede");
  const [drugName, setDrugName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("Once Daily");
  const [timingMorning, setTimingMorning] = useState(true);
  const [timingNoon, setTimingNoon] = useState(false);
  const [timingEvening, setTimingEvening] = useState(false);
  const [timingBedtime, setTimingBedtime] = useState(false);
  const [pillsCount, setPillsCount] = useState(30);

  const toggleDose = (id: string, timeSlot: 'morning' | 'noon' | 'evening' | 'bedtime') => {
    setSchedules(prev => prev.map(item => {
      if (item.id === id) {
        const current = item.takenToday[timeSlot];
        const updated = {
          ...item.takenToday,
          [timeSlot]: !current
        };
        const delta = !current ? -1 : 1;
        return {
          ...item,
          remainingPills: Math.max(0, item.remainingPills + delta),
          takenToday: updated
        };
      }
      return item;
    }));
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName.trim()) return;

    const timings: ('morning' | 'noon' | 'evening' | 'bedtime')[] = [];
    if (timingMorning) timings.push('morning');
    if (timingNoon) timings.push('noon');
    if (timingEvening) timings.push('evening');
    if (timingBedtime) timings.push('bedtime');

    const newItem: MedicationScheduleItem = {
      id: `med-${Date.now()}`,
      patientName,
      drugName,
      dose: dose || "1 Tablet",
      frequency,
      timing: timings.length > 0 ? timings : ['morning'],
      withFood: 'any',
      remainingPills: pillsCount,
      refillReminderThreshold: 7,
      prescribedFor: "Prescription Care",
      takenToday: {}
    };

    setSchedules(prev => [newItem, ...prev]);
    setIsAddingMed(false);
    setDrugName("");
    setDose("");
  };

  // Calculate overall adherence today
  let totalScheduledDoses = 0;
  let totalTakenDoses = 0;
  schedules.forEach(item => {
    item.timing.forEach(t => {
      totalScheduledDoses++;
      if (item.takenToday[t]) totalTakenDoses++;
    });
  });
  const adherencePercent = totalScheduledDoses > 0 ? Math.round((totalTakenDoses / totalScheduledDoses) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Patient Adherence & Prescription Tracking
              </span>
              <span className="text-xs text-slate-400">Pill Timing, Refills & Alarms</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Medication Tracking & Adherence Module</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Track multi-drug administration schedules, log taken vs missed doses across 4 diurnal windows, and monitor refill inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Adherence Gauge Card */}
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Today's Adherence</span>
              <div className="text-xl font-bold text-teal-400 font-mono">
                {adherencePercent}%
              </div>
            </div>

            <button
              onClick={() => setIsAddingMed(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map(item => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Patient: {item.patientName}
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-400" />
                  <span>{item.drugName}</span>
                </h3>
                <p className="text-xs text-teal-400 font-mono mt-0.5">
                  {item.dose} • {item.frequency}
                </p>
              </div>

              {/* Refill Status Pill */}
              <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                item.remainingPills <= item.refillReminderThreshold
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {item.remainingPills <= item.refillReminderThreshold ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Refill Soon ({item.remainingPills} left)</span>
                  </>
                ) : (
                  <span>{item.remainingPills} pills left</span>
                )}
              </div>
            </div>

            {/* Dose Checkboxes for Day */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                Today's Dosing Slots (Tap to confirm taken):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['morning', 'noon', 'evening', 'bedtime'] as const).map(slot => {
                  const isScheduled = item.timing.includes(slot);
                  const isTaken = !!item.takenToday[slot];

                  if (!isScheduled) return null;

                  return (
                    <button
                      key={slot}
                      onClick={() => toggleDose(item.id, slot)}
                      className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition cursor-pointer ${
                        isTaken
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="capitalize text-[11px] font-bold">{slot}</span>
                      {isTaken ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                      <span className="text-[10px] font-normal">
                        {isTaken ? 'Taken' : 'Pending'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Indication: {item.prescribedFor}</span>
              <button
                onClick={() => {
                  setSchedules(prev => prev.map(m => m.id === item.id ? { ...m, remainingPills: m.remainingPills + 30 } : m));
                }}
                className="text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Log Refill (+30)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {isAddingMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Medication Schedule</h3>
              <button onClick={() => setIsAddingMed(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMed} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Patient Name:</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Drug Name & Strength:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin 850 mg"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Dose Units:</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Tablet"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Total Pill Count:</label>
                  <input
                    type="number"
                    value={pillsCount}
                    onChange={(e) => setPillsCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Dosing Times per Day:</label>
                <div className="grid grid-cols-4 gap-2">
                  <label className="flex items-center gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked={timingMorning} onChange={(e) => setTimingMorning(e.target.checked)} />
                    <span>Morn</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked={timingNoon} onChange={(e) => setTimingNoon(e.target.checked)} />
                    <span>Noon</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked={timingEvening} onChange={(e) => setTimingEvening(e.target.checked)} />
                    <span>Eve</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked={timingBedtime} onChange={(e) => setTimingBedtime(e.target.checked)} />
                    <span>Bed</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMed(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
