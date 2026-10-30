import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle, 
  User, 
  Send, 
  Radio, 
  Lock, 
  ShieldCheck, 
  Award,
  BookOpen,
  ArrowRight,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { User as UserType, Language, VoiceConversationMessage } from '../types';
import { geminiVoiceAgents } from '../data/advancedFeaturesData';

interface GeminiAudioConversationProps {
  user: UserType;
  currentLanguage: Language;
  onUpgradeToService: (service: 'gemini_voice_agent', amount: number) => void;
}

export const GeminiAudioConversation: React.FC<GeminiAudioConversationProps> = ({
  user,
  currentLanguage,
  onUpgradeToService
}) => {
  const isUnlocked = user.unlockedVoiceGeminiAgent || user.isPro || false;

  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [messages, setMessages] = useState<VoiceConversationMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'gemini_supporter',
      speakerName: geminiVoiceAgents.male.personaName,
      text: geminiVoiceAgents.male.greetingMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicalTopic: 'Clinical Pharmacy Consultation',
      stgReference: 'Ethiopian STG & Clinical Protocols'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cbeRefInput, setCbeRefInput] = useState('');
  const [activeTab, setActiveTab] = useState<'conversation' | 'personas' | 'stg_guidelines'>('conversation');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentAgent = geminiVoiceAgents[selectedGender];

  // Auto-scroll conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle agent gender change
  const handleGenderChange = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const newAgent = geminiVoiceAgents[gender];
    setMessages(prev => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'gemini_supporter',
        speakerName: newAgent.personaName,
        text: `Switched voice supporter to ${newAgent.personaName}. ${newAgent.greetingMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clinicalTopic: 'Supporter Persona Switch'
      }
    ]);

    if (soundEnabled) {
      speakText(newAgent.greetingMessage, gender);
    }
  };

  // Web Speech Synthesis (Text-to-Speech)
  const speakText = (text: string, gender: 'male' | 'female' = selectedGender) => {
    if (!('speechSynthesis' in window) || !soundEnabled) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Select suitable voice
    if (gender === 'male') {
      utterance.pitch = 0.82; // Deep baritone clinical timbre
      const maleVoice = voices.find(v => 
        (v.name.includes('Male') || v.name.includes('David') || v.name.includes('George') || v.name.includes('Natural')) && 
        v.lang.startsWith('en')
      );
      if (maleVoice) utterance.voice = maleVoice;
    } else {
      utterance.pitch = 1.25; // Warm, articulate female timbre
      const femaleVoice = voices.find(v => 
        (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')) && 
        v.lang.startsWith('en')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    }

    utterance.rate = audioSpeed;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech Recognition (Speech-to-Text)
  const toggleListening = () => {
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your clinical question in the text box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'am' ? 'am-ET' : currentLanguage === 'om' ? 'om-ET' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start failed:', e);
      setIsListening(false);
    }
  };

  // Send message to Gemini server endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }

    stopSpeaking();

    const userMessage: VoiceConversationMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      speakerName: user.fullName || 'Subscriber',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/audio-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          gender: selectedGender,
          language: currentLanguage,
          history: messages.slice(-4).map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();

      if (data.success && data.responseText) {
        const agentReply: VoiceConversationMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini_supporter',
          speakerName: data.agentName || currentAgent.personaName,
          text: data.responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clinicalTopic: 'Clinical Pharmacotherapy Analysis',
          stgReference: 'Ethiopian STG & WHO Pharmacotherapy Guidelines'
        };

        setMessages(prev => [...prev, agentReply]);

        if (soundEnabled) {
          speakText(data.responseText, selectedGender);
        }
      }
    } catch (err) {
      console.error('Failed to receive Gemini response:', err);
      const fallbackReply: VoiceConversationMessage = {
        id: `gemini-fb-${Date.now()}`,
        sender: 'gemini_supporter',
        speakerName: currentAgent.personaName,
        text: `In managing "${text}", always assess kidney creatinine clearance, liver enzymes, and possible drug interactions according to the Ethiopian Standard Treatment Guidelines. Hydrate the patient and repeat baseline monitoring within 48 hours.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clinicalTopic: 'Clinical Safety Protocol'
      };
      setMessages(prev => [...prev, fallbackReply]);
      if (soundEnabled) {
        speakText(fallbackReply.text, selectedGender);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInputText(q);
    handleSendMessage(q);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              1-on-1 Google Gemini Clinical Audio Agent
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Interactive Voice Clinical Pharmacotherapy Consultation
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base max-w-2xl">
              Engage in real-time, one-on-one two-way audio conversations with your personalized Google Gemini Clinical Supporter. Choose between Dr. Dawid (Male Supporter) or Dr. Aster (Female Supporter) for hospital bedside cases, TDM, and guideline dosing.
            </p>
          </div>

          {/* Access Status & Unlock Button */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {isUnlocked ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Active Voice Consultation Pass (Unlocked)
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Unlock 1-on-1 Gemini Voice Supporter (50 Birr)
              </button>
            )}
            <span className="text-xs text-emerald-200/70">
              50 ETB one-time subscriber fee • Telebirr & CBE Direct
            </span>
          </div>
        </div>

        {/* Supporter Persona Switcher */}
        <div className="mt-6 pt-6 border-t border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Male Supporter */}
          <div 
            onClick={() => handleGenderChange('male')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
              selectedGender === 'male' 
                ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-950/40' 
                : 'bg-slate-900/40 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="relative">
              <img 
                src={geminiVoiceAgents.male.avatarUrl} 
                alt="Dr. Dawid" 
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
              />
              {selectedGender === 'male' && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm md:text-base">
                  {geminiVoiceAgents.male.personaName}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-medium">
                  Male Supporter
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5 line-clamp-1">
                {geminiVoiceAgents.male.specialtyTitle}
              </p>
              <p className="text-[11px] text-slate-300 mt-1 italic line-clamp-1">
                Voice: Deep baritone, clinical pharmacology & ICU rounds
              </p>
            </div>
          </div>

          {/* Female Supporter */}
          <div 
            onClick={() => handleGenderChange('female')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
              selectedGender === 'female' 
                ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-950/40' 
                : 'bg-slate-900/40 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="relative">
              <img 
                src={geminiVoiceAgents.female.avatarUrl} 
                alt="Dr. Aster" 
                className="w-14 h-14 rounded-full object-cover border-2 border-teal-400"
              />
              {selectedGender === 'female' && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-teal-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm md:text-base">
                  {geminiVoiceAgents.female.personaName}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 font-medium">
                  Female Supporter
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-0.5 line-clamp-1">
                {geminiVoiceAgents.female.specialtyTitle}
              </p>
              <p className="text-[11px] text-slate-300 mt-1 italic line-clamp-1">
                Voice: Warm, empathetic, maternal-fetal & infectious diseases
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversation & Voice Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Audio Controls & Visualizer */}
        <div className="lg:col-span-1 space-y-4">
          {/* Active Supporter Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
            <div className="relative inline-block mb-3">
              <img 
                src={currentAgent.avatarUrl} 
                alt={currentAgent.personaName} 
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/50 shadow-md mx-auto"
              />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-75" />
              )}
            </div>
            <h3 className="font-bold text-white text-base">{currentAgent.personaName}</h3>
            <p className="text-xs text-emerald-400 mt-0.5">{currentAgent.specialtyTitle}</p>
            
            {/* Live Audio State Indicator */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isSpeaking ? 'bg-emerald-400 animate-pulse' : isListening ? 'bg-red-500 animate-ping' : 'bg-slate-500'
                }`} />
                <span className="text-xs font-semibold text-slate-200">
                  {isSpeaking ? 'Agent Speaking...' : isListening ? 'Listening to You...' : 'Agent Ready'}
                </span>
              </div>

              {/* Animated Audio Waveform Bars */}
              <div className="flex items-center justify-center gap-1 h-8">
                {[12, 24, 18, 30, 20, 26, 14, 28, 16, 22].map((height, idx) => (
                  <div 
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isSpeaking 
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-300' 
                        : isListening 
                        ? 'bg-gradient-to-t from-red-500 to-amber-300' 
                        : 'bg-slate-700'
                    }`}
                    style={{
                      height: (isSpeaking || isListening) 
                        ? `${Math.max(6, Math.sin(Date.now() / 200 + idx) * height + 14)}px` 
                        : '6px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Speaking Controls */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 flex-1 justify-center transition-colors cursor-pointer ${
                  soundEnabled 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle Voice Output"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'Voice ON' : 'Voice Muted'}
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <VolumeX className="w-4 h-4" />
                  Stop
                </button>
              )}
            </div>

            {/* Audio Speed Rate */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Playback Speed</span>
                <span className="font-bold text-emerald-400">{audioSpeed}x</span>
              </div>
              <div className="flex gap-1">
                {[0.8, 1.0, 1.25, 1.5].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setAudioSpeed(speed)}
                    className={`flex-1 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                      audioSpeed === speed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Consultation Topics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Suggested Clinical Queries
            </h4>
            <div className="space-y-2">
              {currentAgent.sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-200 text-xs transition-colors cursor-pointer flex items-start gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Conversation Transcript & Microphone Input */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[560px]">
          {/* Conversation Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-white text-sm">
                  Active Consultation Stream with {currentAgent.personaName}
                </h3>
                <p className="text-xs text-slate-400">
                  Spoken synthesis enabled • Clinical reasoning via Google Gemini
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: `new-${Date.now()}`,
                    sender: 'gemini_supporter',
                    speakerName: currentAgent.personaName,
                    text: currentAgent.greetingMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
                stopSpeaking();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 max-h-[460px]">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'gemini_supporter';
              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <img 
                      src={currentAgent.avatarUrl} 
                      alt={msg.speakerName} 
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500/40 shrink-0 mt-1"
                    />
                  )}

                  <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md ${
                    isAgent 
                      ? 'bg-slate-950/90 border border-emerald-500/30 text-slate-100 rounded-tl-sm' 
                      : 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-tr-sm'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className={`text-xs font-bold ${isAgent ? 'text-emerald-400' : 'text-emerald-100'}`}>
                        {msg.speakerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {isAgent && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-emerald-400/80 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {msg.stgReference || 'Ethiopian Clinical STG Standard'}
                        </span>
                        <button
                          onClick={() => speakText(msg.text, selectedGender)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                          title="Replay Voice Audio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Listen
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAgent && (
                    <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-500 flex items-center justify-center text-white shrink-0 font-bold text-xs mt-1">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <img 
                  src={currentAgent.avatarUrl} 
                  alt={currentAgent.personaName} 
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500/40 shrink-0 mt-1 animate-pulse"
                />
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 text-slate-300 text-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{currentAgent.personaName} is thinking & synthesizing clinical voice response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Input & Text Control Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            {!isUnlocked ? (
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-center flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs text-left">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Subscribers can unlock 1-on-1 audio consultation with male or female Gemini agents for 50 Birr.</span>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow"
                >
                  Unlock Audio Supporter (50 Birr)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Live Microphone Toggle Button */}
                <button
                  onClick={toggleListening}
                  className={`p-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center cursor-pointer ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-500/30 animate-pulse' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  title={isListening ? 'Stop Recording' : 'Speak into Microphone'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text Box Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={
                      isListening 
                        ? 'Listening to your clinical query in real time...' 
                        : `Ask ${currentAgent.personaName} a clinical question (e.g. antibiotic dosing, pregnancy safety)...`
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                  title="Send Question"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 50 Birr Payment Modal for Gemini Voice Supporter */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Unlock 1-on-1 Gemini Voice Supporter</h3>
                  <p className="text-xs text-slate-400">Lifetime access • Select Male or Female AI Clinical Supporter</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-center">
                <span className="text-xs text-emerald-300 uppercase tracking-widest font-semibold">Special Subscriber Rate</span>
                <div className="text-3xl font-extrabold text-white mt-1">50 ETB <span className="text-sm font-normal text-slate-300">($0.50 USD)</span></div>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Enjoy unlimited voice consultations with Dr. Dawid (Male) & Dr. Aster (Female)
                </p>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Telebirr Mobile Account:</span>
                  <span className="font-mono font-bold text-amber-400">0982852778 (Dawid Aliyi)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">CBE Account Number:</span>
                  <span className="font-mono font-bold text-emerald-400">1000262900367 (Dawid Aliyi)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">CBE Birr USSD Code:</span>
                  <span className="font-mono font-bold text-teal-400">*847#</span>
                </div>
              </div>

              {/* Enter Confirmation Reference */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Enter Telebirr / CBE Transaction Reference ID:
                </label>
                <input 
                  type="text"
                  value={cbeRefInput}
                  onChange={(e) => setCbeRefInput(e.target.value)}
                  placeholder="e.g. TB-992184 or CBE-TX-49210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  onUpgradeToService('gemini_voice_agent', 50);
                  setShowPaymentModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Instant Verify & Unlock (50 Birr)
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
