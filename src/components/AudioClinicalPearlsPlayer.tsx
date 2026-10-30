import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Play, Pause, RotateCcw, VolumeX, 
  Sparkles, Globe, UserCheck, Lock, CreditCard, 
  Check, FileText, ChevronRight, Award, Headphones, 
  Radio, Sliders, Mic, ShieldCheck, Download
} from 'lucide-react';
import { AudioClinicalPearl, User } from '../types';
import { sampleAudioClinicalPearls } from '../data/advancedFeaturesData';

interface Props {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export const AudioClinicalPearlsPlayer: React.FC<Props> = ({ currentUser, onUpdateUser }) => {
  const [pearls, setPearls] = useState<AudioClinicalPearl[]>(sampleAudioClinicalPearls);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'am' | 'om' | 'en'>('all');
  const [activePearl, setActivePearl] = useState<AudioClinicalPearl>(sampleAudioClinicalPearls[0]);
  
  // Document Auto-Reader State
  const [readerGender, setReaderGender] = useState<'male' | 'female'>('male');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechProgress, setSpeechProgress] = useState<number>(0);
  const [customDocumentText, setCustomDocumentText] = useState<string>('');
  const [selectedDocSource, setSelectedDocSource] = useState<'pearl' | 'custom' | 'guideline' | 'pharmacology'>('pearl');

  // Auto-Reader Payment State (50 Birr)
  const [isAutoReaderUnlocked, setIsAutoReaderUnlocked] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('pharmastar_autoreader_unlocked') === 'true') return true;
    } catch (e) {
      // ignore
    }
    return currentUser.isPro || currentUser.unlockedAutoReader || false;
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe' | 'cbe_birr'>('telebirr');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getActiveTextToRead = () => {
    if (selectedDocSource === 'custom' && customDocumentText.trim()) {
      return customDocumentText;
    }
    if (selectedDocSource === 'guideline') {
      return `Ethiopian National Standard Treatment Guidelines (MoH 2026): First-line antimicrobial stewardship directives mandate prior authorization for all third-generation cephalosporins, carbapenems, and colistin. Inpatients with community-acquired pneumonia should receive Ceftriaxone 1 to 2 grams daily plus Azithromycin 500 milligrams daily for 5 to 7 days.`;
    }
    if (selectedDocSource === 'pharmacology') {
      return `Pharmacokinetics and Receptor Dynamics: Volume of distribution determines loading dose. Renal clearance is directly proportional to glomerular filtration rate. Competitive antagonists shift the agonist dose response curve to the right without lowering maximal efficacy.`;
    }
    return activePearl.voiceSynthesisText || activePearl.audioTranscript;
  };

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    // Check payment gate for full reading
    const text = getActiveTextToRead();

    // If not unlocked and text is long, limit demo or show payment modal
    if (!isAutoReaderUnlocked && text.length > 250) {
      // Demo preview for first 150 chars
      speakText(text.slice(0, 180) + '... To continue auto-reading full medical documents with male and female voices, please unlock Auto-Reader for 50 Birr.');
      setTimeout(() => {
        setIsPaymentModalOpen(true);
      }, 5000);
      return;
    }

    speakText(text);
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Pitch and Voice configuration based on Male vs Female Reader
    if (readerGender === 'female') {
      utterance.pitch = 1.35; // Higher frequency feminine formant
      utterance.rate = speechRate * 0.95;
    } else {
      utterance.pitch = 0.85; // Resonant masculine clinical formant
      utterance.rate = speechRate * 1.0;
    }

    // Attempt to select language voice if system has matching locale
    const voices = synthRef.current.getVoices();
    if (voices && voices.length) {
      const match = voices.find(v => {
        if (readerGender === 'female') {
          return v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha');
        } else {
          return v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george');
        }
      });
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setSpeechProgress(10);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setSpeechProgress(100);
      setTimeout(() => setSpeechProgress(0), 1500);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setSpeechProgress(0);
    };

    synthRef.current.speak(utterance);
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setSpeechProgress(0);
  };

  // Payment confirmation (50 Birr)
  const handleConfirmPayment = () => {
    if (!paymentRef.trim()) return;

    localStorage.setItem('pharmastar_autoreader_unlocked', 'true');
    setIsAutoReaderUnlocked(true);
    setIsPaymentModalOpen(false);

    onUpdateUser({
      ...currentUser,
      unlockedAutoReader: true
    });
  };

  const filteredPearls = selectedLanguage === 'all'
    ? pearls
    : pearls.filter(p => p.language === selectedLanguage);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" /> Document Auto-Reader (Male & Female Reader)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                50 Birr Lifetime Reader Pass
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Voice Clinical Pearls & Document Auto-Reader (Amharic & Afaan Oromoo)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Listen hands-free during hospital ward rounds and dispensary shifts. Includes high-yield voice briefings in <strong>Amharic (አማርኛ)</strong>, <strong>Afaan Oromoo</strong>, and English, with interactive text-to-speech auto-reading of clinical documents featuring selectable <strong>Male & Female Readers</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAutoReaderUnlocked ? (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Auto-Reader Unlocked (50 ETB Active)</span>
              </span>
            ) : (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Auto-Reader (50 Birr)</span>
              </button>
            )}
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Audio Language:</span>
          {[
            { id: 'all', label: 'All Audio Pearls' },
            { id: 'am', label: 'አማርኛ (Amharic Audio)' },
            { id: 'om', label: 'Afaan Oromoo (Audio)' },
            { id: 'en', label: 'English Clinical Pearls' },
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                selectedLanguage === lang.id
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Audio Pearls List (4 cols) & Document Auto-Reader Deck (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pre-loaded Audio Pearls */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[740px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Voice Clinical Pearls</h3>
              <span className="text-[10px] text-slate-400">Ward Round Audio Briefings</span>
            </div>
            <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
              {filteredPearls.length} Recordings
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredPearls.map(pearl => {
              const isSelected = activePearl.id === pearl.id && selectedDocSource === 'pearl';

              return (
                <div
                  key={pearl.id}
                  onClick={() => {
                    setActivePearl(pearl);
                    setSelectedDocSource('pearl');
                    if (isPlaying) handleStop();
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {pearl.language === 'am' ? 'አማርኛ' : pearl.language === 'om' ? 'Afaan Oromoo' : 'English'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {pearl.durationFormatted}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{pearl.titleLocal}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{pearl.conceptTopic}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80">
                    <span className="truncate">{pearl.speakerName}</span>
                    <span className="text-teal-400 font-medium shrink-0">Voice Play</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Document Auto-Reader Studio (Male & Female Reader Selectable) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {/* Header Controls: Document Source, Reader Gender, Speed */}
          <div className="pb-4 border-b border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                  <span>Document Auto-Reader Audio Deck</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Select male or female synthesized voice to auto-read any clinical document.
                </span>
              </div>

              {/* Male / Female Reader Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setReaderGender('male');
                    if (isPlaying) handleStop();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    readerGender === 'male'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>👨 Male Reader (Dawid)</span>
                </button>

                <button
                  onClick={() => {
                    setReaderGender('female');
                    if (isPlaying) handleStop();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    readerGender === 'female'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>👩 Female Reader (Aster)</span>
                </button>
              </div>
            </div>

            {/* Document Source Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">Document Source:</span>
                {[
                  { id: 'pearl', label: 'Current Clinical Pearl' },
                  { id: 'guideline', label: 'MoH STG Guideline' },
                  { id: 'pharmacology', label: 'Pharmacology Core' },
                  { id: 'custom', label: 'Custom Pasted Text' },
                ].map(src => (
                  <button
                    key={src.id}
                    onClick={() => {
                      setSelectedDocSource(src.id as any);
                      if (isPlaying) handleStop();
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                      selectedDocSource === src.id
                        ? 'bg-slate-800 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5].map(rate => (
                  <button
                    key={rate}
                    onClick={() => {
                      setSpeechRate(rate);
                      if (isPlaying) handleStop();
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                      speechRate === rate
                        ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player Controls & Scrubber */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white transition shadow-lg cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <button
                  onClick={handleStop}
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center cursor-pointer transition"
                  title="Stop Audio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{isPlaying ? 'Now Reading...' : 'Ready to Auto-Read'}</span>
                    <span className="text-xs text-indigo-400">
                      ({readerGender === 'male' ? 'Male Voice' : 'Female Voice'} • {speechRate}x)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {selectedDocSource === 'pearl' ? activePearl.titleLocal : 'Document Auto-Reader Audio Deck'}
                  </div>
                </div>
              </div>

              {!isAutoReaderUnlocked && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>50 ETB to Unlock Full Reading</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${isPlaying ? 60 : speechProgress}%` }}
              />
            </div>
          </div>

          {/* Document Content Viewport / Text to Read */}
          {selectedDocSource === 'custom' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 block">
                Paste or Write Any Document Text to Auto-Read (Dispensary Notes, Guidelines, Case Studies):
              </label>
              <textarea
                value={customDocumentText}
                onChange={(e) => setCustomDocumentText(e.target.value)}
                rows={8}
                placeholder="Paste clinical case notes, guidelines, or pharmacy syllabus text here to read aloud with male/female voice..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          ) : (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Document Reading Transcript
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedDocSource === 'pearl' ? activePearl.guidelineReference : 'Clinical Reference'}
                </span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 max-h-[220px] overflow-y-auto">
                {getActiveTextToRead()}
              </div>

              {selectedDocSource === 'pearl' && activePearl.keyTakeaways && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-teal-400 block">Key Takeaways for Rounds:</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {activePearl.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Speaker Credential Bar */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span>
                Synthesized Voice Mode: <strong>{readerGender === 'male' ? 'Pharmacist Dawid Aliyi (Male)' : 'Dr. Aster / Sr. Genet (Female)'}</strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Offline TTS Ready</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: UNLOCK DOCUMENT AUTO-READER (50 BIRR) */}
      {/* ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Unlock Document Auto-Reader</h3>
                  <span className="text-xs text-amber-300 font-bold">Only 50 Birr (ETB) Lifetime</span>
                </div>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Auto-read unlimited clinical documents, courses, guidelines, and custom medical case notes with male and female voice synthesis in <strong>Amharic, Afaan Oromoo, and English</strong>.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Lifetime Reader Fee:</span>
                <span className="text-base font-bold text-teal-300">50 ETB (or $0.50 USD)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Official Account: <strong className="text-amber-300 font-mono">Telebirr: 0982852778</strong> | <strong className="text-white font-mono">CBE: 1000262900367</strong> (Dawid Aliyi)
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Select Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="telebirr">Telebirr (0982852778 - Dawid Aliyi)</option>
                  <option value="cbe">CBE Account (1000262900367 - Dawid Aliyi)</option>
                  <option value="cbe_birr">CBE Birr (*847#)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Transaction Ref / Slip Code *</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. TB-8829104 or CBE-99120"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={!paymentRef.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm 50 Birr & Activate Reader</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
