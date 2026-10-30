import React, { useState } from 'react';
import { 
  FileText, 
  Presentation, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Layers, 
  Palette, 
  Eye, 
  Copy, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  ArrowRight,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { User as UserType, Language, SlideDeck, SlideItem, SlideTheme } from '../types';
import { sampleSlideDecks } from '../data/advancedFeaturesData';

interface DocumentToPptConverterProps {
  user: UserType;
  currentLanguage: Language;
  onUpgradeToService: (service: 'doc_to_ppt', amount: number) => void;
}

export const DocumentToPptConverter: React.FC<DocumentToPptConverterProps> = ({
  user,
  currentLanguage,
  onUpgradeToService
}) => {
  const isUnlocked = user.unlockedDocToPpt || user.isPro || false;

  const [inputText, setInputText] = useState<string>(`Clinical Pharmacotherapy Protocol in Acute Decompensated Heart Failure (ADHF)

1. Executive Summary & Triage:
Acute decompensated heart failure represents a medical emergency characterized by sudden onset of pulmonary congestion, peripheral edema, and systemic hypoperfusion. Rapid bedside evaluation of hemodynamic profile (Warm & Wet vs. Cold & Wet) determines first-line pharmacotherapeutic interventions.

2. Loop Diuretics Strategy (DOSE Trial Protocol):
Intravenous loop diuretics (Furosemide) remain the foundation of therapy. For patients receiving chronic oral diuretic therapy, initial IV dosing should be at least 1.0 to 2.5 times their daily home oral dose administered as bolus or continuous infusion. Monitor spot urine sodium at 2 hours (> 50-70 mEq/L) and 6-hour hourly urine output (> 100-150 mL/h).

3. Vasodilator & Inotropic Interventions:
In patients with systolic blood pressure > 110 mmHg, IV Nitroglycerin or Nitroprusside reduces preload and afterload, easing myocardial workload. In Cold & Wet profiles with symptomatic hypotension, Dobutamine or Milrinone is indicated to restore end-organ perfusion.

4. Guideline-Directed Medical Therapy (GDMT) Continuation:
Do NOT abruptly discontinue beta-blockers unless patient is in overt cardiogenic shock. Initiate or up-titrate SGLT2 inhibitors (Empagliflozin/Dapagliflozin) prior to hospital discharge as demonstrated in the EMPULSE trial to reduce 90-day readmissions.`);

  const [documentTitle, setDocumentTitle] = useState<string>('Acute Decompensated Heart Failure (ADHF) Masterclass');
  const [presenterName, setPresenterName] = useState<string>(user.fullName || 'Pharmacist Dawid Aliyi, BCPS');
  const [institution, setInstitution] = useState<string>('Tikur Anbessa Hospital / Pharma Star Pro');
  const [selectedTheme, setSelectedTheme] = useState<SlideTheme>('emerald_pharma');
  const [currentDeck, setCurrentDeck] = useState<SlideDeck>(sampleSlideDecks[0]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [cbeRefInput, setCbeRefInput] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Convert Document to PPT
  const handleConvert = async () => {
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }

    if (!inputText.trim()) {
      alert('Please provide document text to convert.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/document/convert-to-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle,
          documentText: inputText,
          presenterName,
          institution,
          theme: selectedTheme
        })
      });

      const data = await response.json();
      if (data.success && data.deck) {
        setCurrentDeck(data.deck);
        setActiveSlideIndex(0);
      }
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export as PPT Presentation File (HTML / PPTX XML compliant format that PowerPoint opens directly)
  const handleDownloadPpt = () => {
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }

    // Generate HTML-based PPT format with Microsoft Office XML namespaces
    const slideHtml = `
<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:p="urn:schemas-microsoft-com:office:powerpoint"
xmlns:oa="urn:schemas-microsoft-com:office:activation">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="PowerPoint.Slide">
<meta name="Generator" content="Pharma Star App Pro - Pharmacist Dawid Aliyi">
<title>${currentDeck.title}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; margin: 0; background-color: #0f172a; color: #ffffff; }
  .slide-page { page-break-after: always; width: 960px; height: 540px; padding: 40px; box-sizing: border-box; background: #022c22; color: #ffffff; border-radius: 8px; margin: 20px auto; border: 2px solid #10b981; }
  h1 { color: #34d399; font-size: 32px; margin-bottom: 8px; }
  h2 { color: #a7f3d0; font-size: 24px; margin-bottom: 20px; }
  h3 { color: #6ee7b7; font-size: 18px; }
  ul { font-size: 16px; line-height: 1.6; }
  li { margin-bottom: 8px; }
  .badge { background: #065f46; color: #a7f3d0; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
  .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #065f46; padding-top: 8px; }
  .two-col { display: flex; gap: 30px; }
  .col { flex: 1; }
</style>
</head>
<body>
  ${currentDeck.slides.map(slide => `
    <div class="slide-page">
      <span class="badge">Slide ${slide.slideNumber} • ${slide.layout.toUpperCase()}</span>
      <h1>${slide.title}</h1>
      ${slide.subtitle ? `<h2>${slide.subtitle}</h2>` : ''}

      ${slide.bullets && slide.bullets.length > 0 ? `
        <ul>
          ${slide.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      ` : ''}

      ${slide.leftColumnBullets ? `
        <div class="two-col">
          <div class="col">
            <h3>${slide.leftColumnTitle || 'Diagnostics'}</h3>
            <ul>
              ${slide.leftColumnBullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
          <div class="col">
            <h3>${slide.rightColumnTitle || 'Therapeutics'}</h3>
            <ul>
              ${slide.rightColumnBullets ? slide.rightColumnBullets.map(b => `<li>${b}</li>`).join('') : ''}
            </ul>
          </div>
        </div>
      ` : ''}

      ${slide.calloutText ? `
        <div style="background: rgba(16, 185, 129, 0.15); border-left: 4px solid #10b981; padding: 10px; margin-top: 15px;">
          <strong>${slide.calloutBadge || 'Clinical Pearl'}:</strong> ${slide.calloutText}
        </div>
      ` : ''}

      <div class="footer">
        ${currentDeck.author} • ${currentDeck.institution} • Generated via Pharma Star App Pro (50 Birr Pass)
      </div>
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([slideHtml], { type: 'application/vnd.ms-powerpoint;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDeck.title.replace(/[^a-zA-Z0-9]/g, '_')}_Presentation.ppt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const activeSlide: SlideItem = currentDeck.slides[activeSlideIndex] || currentDeck.slides[0];

  const themeStyles: Record<SlideTheme, { bg: string; text: string; accent: string; border: string }> = {
    emerald_pharma: {
      bg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950',
      text: 'text-white',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40'
    },
    midnight_clinical: {
      bg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950',
      text: 'text-white',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/40'
    },
    academic_slate: {
      bg: 'bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950',
      text: 'text-white',
      accent: 'text-amber-400',
      border: 'border-amber-500/40'
    },
    crisp_minimal: {
      bg: 'bg-slate-900',
      text: 'text-slate-100',
      accent: 'text-teal-300',
      border: 'border-slate-700'
    }
  };

  const activeTheme = themeStyles[selectedTheme];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-teal-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <Presentation className="w-3.5 h-3.5" />
              Document to PowerPoint (.PPT / .PPTX) Converter
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Clinical Document & Notes to PowerPoint Converter
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              Transform clinical notes, hospital treatment protocols, case reports, or study materials into structured, beautifully styled PowerPoint presentations with agenda, two-column diagnostics, and author citations.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {isUnlocked ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Active PPT Generator Pass (Unlocked)
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-600 hover:from-amber-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Unlock Document to PPT (50 Birr)
              </button>
            )}
            <span className="text-xs text-slate-400">
              One-time 50 ETB fee • Unlimited slide generation & instant PPT download
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Input & Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                Source Clinical Document
              </h3>
              <span className="text-xs text-slate-400">Word count: ~{inputText.split(/\s+/).length}</span>
            </div>

            {/* Title & Metadata inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Presentation Title</label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Presenter</label>
                  <input
                    type="text"
                    value={presenterName}
                    onChange={(e) => setPresenterName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              {/* Theme Picker */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-teal-400" />
                  Slide Visual Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'emerald_pharma', label: 'Emerald Pharma', color: 'from-emerald-950 to-teal-950' },
                    { id: 'midnight_clinical', label: 'Midnight Clinical', color: 'from-slate-950 to-blue-950' },
                    { id: 'academic_slate', label: 'Academic Slate', color: 'from-slate-900 to-amber-950' },
                    { id: 'crisp_minimal', label: 'Crisp Minimal', color: 'from-slate-900 to-slate-800' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id as SlideTheme)}
                      className={`p-2 rounded-xl text-left border text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                        selectedTheme === theme.id 
                          ? 'bg-teal-950/60 border-teal-400 text-white font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${theme.color} border border-white/20`} />
                      <span className="truncate">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Text Input */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Document Content or Paste Text</label>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste clinical case, pharmacotherapy notes, guideline chapter, or research abstract..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Convert Trigger */}
            <button
              onClick={handleConvert}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing & Generating PowerPoint Slides...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Convert to PowerPoint Presentation (50 Birr)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Presentation Slide Deck Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Top Presentation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Slide {activeSlideIndex + 1} of {currentDeck.slides.length}
                </span>
                <h3 className="font-bold text-white text-base truncate max-w-md">
                  {currentDeck.title}
                </h3>
              </div>

              {/* Download PPT Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPpt}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition-transform hover:scale-105 flex items-center gap-1.5 shadow-md cursor-pointer"
                  title="Download .PPT presentation file"
                >
                  <Download className="w-4 h-4" />
                  Download PPT File
                </button>
              </div>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Presentation downloaded successfully! Compatible with Microsoft PowerPoint, LibreOffice, and Google Slides.</span>
              </div>
            )}

            {/* 16:9 Slide Display Box */}
            <div className={`aspect-[16/9] w-full rounded-2xl border ${activeTheme.border} ${activeTheme.bg} p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300`}>
              {/* Slide Background Subtle Ornament */}
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Slide Header */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-black/40 border border-white/10 text-teal-300">
                    {activeSlide.layout.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    #{activeSlide.slideNumber}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                  {activeSlide.title}
                </h2>
                {activeSlide.subtitle && (
                  <p className="text-xs md:text-sm text-teal-200/90 font-medium">
                    {activeSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Slide Body by Layout */}
              <div className="my-auto py-2 relative z-10 space-y-3">
                {activeSlide.layout === 'title' && (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center mx-auto text-teal-300">
                      <Presentation className="w-8 h-8" />
                    </div>
                    {activeSlide.calloutBadge && (
                      <span className="inline-block px-3 py-1 rounded-full bg-teal-900/60 border border-teal-400/40 text-teal-200 text-xs font-bold">
                        {activeSlide.calloutBadge}
                      </span>
                    )}
                  </div>
                )}

                {/* Bullets layout */}
                {activeSlide.bullets && activeSlide.bullets.length > 0 && (
                  <ul className="space-y-2 text-xs md:text-sm text-slate-100">
                    {activeSlide.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Two-column layout */}
                {activeSlide.leftColumnBullets && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <h4 className="font-bold text-teal-300 mb-2 border-b border-white/10 pb-1">
                        {activeSlide.leftColumnTitle || 'Diagnostics & Markers'}
                      </h4>
                      <ul className="space-y-1.5 text-slate-200">
                        {activeSlide.leftColumnBullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <h4 className="font-bold text-teal-300 mb-2 border-b border-white/10 pb-1">
                        {activeSlide.rightColumnTitle || 'Therapeutics & Monitoring'}
                      </h4>
                      <ul className="space-y-1.5 text-slate-200">
                        {activeSlide.rightColumnBullets?.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Callout Box */}
                {activeSlide.calloutText && (
                  <div className="p-3 rounded-xl bg-teal-950/70 border-l-4 border-teal-400 text-xs text-teal-100">
                    <span className="font-bold text-teal-300 mr-1.5">
                      {activeSlide.calloutBadge || 'Clinical Pearl'}:
                    </span>
                    {activeSlide.calloutText}
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                <span className="truncate max-w-[240px]">{currentDeck.author} • {currentDeck.institution}</span>
                <span className="font-mono text-teal-400">Pharma Star App Pro</span>
              </div>
            </div>

            {/* Slide Navigation Buttons & Thumbnails */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={activeSlideIndex === 0}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {currentDeck.slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      activeSlideIndex === idx 
                        ? 'bg-teal-600 text-white ring-2 ring-teal-400' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveSlideIndex(prev => Math.min(currentDeck.slides.length - 1, prev + 1))}
                disabled={activeSlideIndex === currentDeck.slides.length - 1}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Speaker Notes Toggle */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                className="text-xs text-slate-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 cursor-pointer mb-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showSpeakerNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes for this Slide'}
              </button>

              {showSpeakerNotes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                  <strong>Speaker Presentation Cue:</strong> {activeSlide.speakerNotes || 'Emphasize the primary clinical endpoint, mechanism of action, and organ dosage adjustment guidelines.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 50 Birr Payment Modal for Document to PPT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Unlock Document to PPT Converter</h3>
                  <p className="text-xs text-slate-400">Lifetime access • Professional slide generation & instant PPT download</p>
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
              <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-4 text-center">
                <span className="text-xs text-teal-300 uppercase tracking-widest font-semibold">Special Feature Pass</span>
                <div className="text-3xl font-extrabold text-white mt-1">50 ETB <span className="text-sm font-normal text-slate-300">($0.50 USD)</span></div>
                <p className="text-xs text-teal-200/80 mt-1">
                  Convert unlimited clinical documents into PowerPoint presentations ready for hospital rounds & exams
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Enter Telebirr / CBE Transaction Reference ID:
                </label>
                <input 
                  type="text"
                  value={cbeRefInput}
                  onChange={(e) => setCbeRefInput(e.target.value)}
                  placeholder="e.g. TB-891042 or CBE-TX-2910"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  onUpgradeToService('doc_to_ppt', 50);
                  setShowPaymentModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
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
