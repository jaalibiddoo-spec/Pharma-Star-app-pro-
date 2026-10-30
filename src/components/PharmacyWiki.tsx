import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { 
  BookMarked, Search, Calculator, ShieldAlert, Sparkles, 
  ExternalLink, Copy, Check, Download, FileText, ChevronRight, 
  ArrowLeft, HeartPulse, Pill, Scale, Activity, ShieldCheck, 
  Bookmark, Share2, HelpCircle, Layers, Award
} from 'lucide-react';
import { wikiArticlesData, wikiCategories, WikiArticle } from '../data/wikiData';
import { coursesData } from '../data/coursesData';

interface PharmacyWikiProps {
  onNavigateToCourse?: (courseId: string) => void;
  onNavigateTo3D?: (modelId: string) => void;
}

export const PharmacyWiki: React.FC<PharmacyWikiProps> = ({
  onNavigateToCourse,
  onNavigateTo3D
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>('wiki-gh-01');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [showGitHubHelpModal, setShowGitHubHelpModal] = useState(false);

  // --- Interactive Calculator States ---
  // Cockcroft-Gault
  const [cgAge, setCgAge] = useState<number>(55);
  const [cgWeight, setCgWeight] = useState<number>(65);
  const [cgScr, setCgScr] = useState<number>(1.2);
  const [cgGender, setCgGender] = useState<'male' | 'female'>('male');

  // Corrected Calcium
  const [ccTotalCa, setCcTotalCa] = useState<number>(7.8);
  const [ccAlbumin, setCcAlbumin] = useState<number>(2.5);

  // Anion Gap
  const [agNa, setAgNa] = useState<number>(138);
  const [agCl, setAgCl] = useState<number>(101);
  const [agHco3, setAgHco3] = useState<number>(15);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return wikiArticlesData.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.tags.some(tag => tag.toLowerCase().includes(q)) ||
        article.contentMarkdown.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeArticle = useMemo(() => {
    return wikiArticlesData.find(a => a.id === selectedArticleId) || wikiArticlesData[0];
  }, [selectedArticleId]);

  // Calculations
  const crClResult = useMemo(() => {
    if (cgScr <= 0 || cgWeight <= 0 || cgAge <= 0) return 0;
    const raw = ((140 - cgAge) * cgWeight) / (72 * cgScr);
    return Math.round((cgGender === 'female' ? raw * 0.85 : raw) * 10) / 10;
  }, [cgAge, cgWeight, cgScr, cgGender]);

  const correctedCaResult = useMemo(() => {
    const raw = ccTotalCa + 0.8 * (4.0 - ccAlbumin);
    return Math.round(raw * 10) / 10;
  }, [ccTotalCa, ccAlbumin]);

  const anionGapResult = useMemo(() => {
    return agNa - (agCl + agHco3);
  }, [agNa, agCl, agHco3]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Generate GitHub Wiki Markdown Zip
  const handleDownloadWikiBundle = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // 1. Home.md
      const homeMd = `# 🌟 Pharmastar App Pro — Clinical Pharmacy Wiki
> **Official Knowledge Base & Clinical Formulary**  
> *Maintained by Pharmacist Dawid Aliyi*

Welcome to the **Pharmastar App Pro** wiki! This repository powers the clinical pharmaceutical sciences, 3D molecular mechanics, and MoH/EFDA accredited learning platform.

### 📞 Contact & Official Accounts
* **Developer:** Pharmacist Dawid Aliyi (\`jaalibiddoo@gmail.com\`)
* **Live App URL:** https://ais-pre-mh4jmp6i4ovuyf4sqf523i-955023450528.europe-west2.run.app
* **Telebirr:** \`0982852778\` (Dawid Aliyi)
* **CBE Account:** \`1000262900367\` (Dawid Aliyi)
* **CBE Birr USSD:** \`*847#\`

---

### 📑 Wiki Contents
1. [[Academic-Courses-Syllabi]] — Detailed syllabus for all 10 core pharmacy courses.
2. [[Clinical-Formulas-Calculators]] — Cockcroft-Gault, Anion Gap, and Corrected Calcium.
3. [[Emergency-Toxicology-Antidotes]] — Organophosphate, Paracetamol, and Opioid protocols.
4. [[Ethiopian-EFDA-Guidelines]] — Prescription standards, WHO AWaRe classification, and STG.
5. [[Drug-Monographs]] — In-depth monographs for essential medicines in Ethiopia.
`;
      zip.file('Home.md', homeMd);

      // 2. Individual articles as Markdown files
      wikiArticlesData.forEach(art => {
        const fileContent = `---
title: "${art.title}"
category: "${art.category}"
author: "${art.author}"
lastUpdated: "${art.lastUpdated}"
tags: [${art.tags.map(t => `"${t}"`).join(', ')}]
---

${art.contentMarkdown}

---
### 📚 Scientific References
${art.references.map(r => `* ${r}`).join('\n')}
`;
        zip.file(`${art.slug}.md`, fileContent);
      });

      // 3. Courses syllabus wiki page
      const coursesMd = `# 📚 10 Core Academic Courses Syllabus
${coursesData.map(c => `
## ${c.title} (${c.code})
* **Duration:** ${c.duration} | **Level:** ${c.level}
* **Description:** ${c.description}
* **Learning Objectives:**
${c.learningObjectives.map(obj => `  - ${obj}`).join('\n')}
* **Key Modules:**
${c.modules.map(m => `  - **${m.title}**: ${m.summary}`).join('\n')}
`).join('\n---\n')}
`;
      zip.file('Academic-Courses-Syllabi.md', coursesMd);

      // 4. Generate & trigger download
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Pharmastar-GitHub-Wiki-Pages-DawidAliyi.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate wiki zip:", err);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wiki Banner / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-xs flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-teal-400" />
                Clinical Pharmacy Wiki & Knowledge Base
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                EFDA & MoH Aligned
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pharmastar Knowledge Base & GitHub Wiki
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curated by <strong>Pharmacist Dawid Aliyi</strong>. High-yield drug monographs, point-of-care clinical calculators, emergency toxicology protocols, and synchronized documentation for your official GitHub repository.
            </p>
          </div>

          {/* GitHub Wiki Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open GitHub Wiki</span>
            </a>

            <button
              onClick={handleDownloadWikiBundle}
              disabled={isExportingZip}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl transition cursor-pointer"
            >
              {isExportingZip ? (
                <span>Generating Bundle...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Wiki (.md) Bundle</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowGitHubHelpModal(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title="How to manage your GitHub Wiki"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Search & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinical monographs, equations, antidotes, EFDA guidelines, or MUDPILES..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {wikiCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Topic List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              Wiki Articles ({filteredArticles.length})
            </span>
            <span className="text-[11px] text-teal-400 font-mono">
              GitHub Repo Synced
            </span>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No wiki articles match "{searchQuery}".
              </div>
            ) : (
              filteredArticles.map(art => {
                const isSelected = activeArticle.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer relative group ${
                      isSelected
                        ? 'bg-teal-950/50 border-teal-500/70 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        art.category === 'emergency_antidote'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : art.category === 'clinical_formula'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : art.category === 'drug_monograph'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : art.category === 'ethiopian_formulary'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}>
                        {art.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {art.readTimeMinutes} min read
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-teal-300 transition line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {art.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Content Area: Active Article Reader & Live Interactive Calculators */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Article Top Navigation & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
                  Pharmacist Dawid Aliyi Clinical Wiki
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">
                  Updated: {activeArticle.lastUpdated}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeArticle.contentMarkdown, 'article-md')}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-teal-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === 'article-md' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Markdown!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy for GitHub Wiki</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Article Title & Abstract */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-medium">
                💡 <strong className="text-amber-300">Executive Clinical Summary:</strong> {activeArticle.summary}
              </p>
            </div>

            {/* Interactive Calculator (If Applicable) */}
            {activeArticle.interactiveCalculator === 'cockcroft_gault' && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Point-of-Care CrCl Calculator (Cockcroft-Gault)
                    </h4>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">
                    Interactive
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Age (Years):</label>
                    <input
                      type="number"
                      value={cgAge}
                      onChange={(e) => setCgAge(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Weight (kg):</label>
                    <input
                      type="number"
                      value={cgWeight}
                      onChange={(e) => setCgWeight(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Serum Creatinine (mg/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cgScr}
                      onChange={(e) => setCgScr(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Biological Sex:</label>
                    <select
                      value={cgGender}
                      onChange={(e) => setCgGender(e.target.value as 'male' | 'female')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    >
                      <option value="male">Male (x 1.0)</option>
                      <option value="female">Female (x 0.85)</option>
                    </select>
                  </div>
                </div>

                {/* CrCl Result Display */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Estimated Creatinine Clearance:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-teal-300">{crClResult}</span>
                      <span className="text-xs text-slate-400 font-mono">mL/min</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Renal Function Stage:</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded inline-block mt-0.5 ${
                      crClResult >= 90
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : crClResult >= 60
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : crClResult >= 30
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {crClResult >= 90 ? "Normal (>90 mL/min)" : crClResult >= 60 ? "Mild Impairment (60-89)" : crClResult >= 30 ? "Moderate Impairment (30-59)" : "Severe Impairment (<30)"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeArticle.interactiveCalculator === 'corrected_calcium' && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-950 border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Corrected Calcium for Hypoalbuminemia
                    </h4>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                    Interactive
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Measured Total Calcium (mg/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ccTotalCa}
                      onChange={(e) => setCcTotalCa(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Serum Albumin (g/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ccAlbumin}
                      onChange={(e) => setCcAlbumin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Corrected Total Calcium:</span>
                    <span className="text-2xl font-black font-mono text-amber-300">{correctedCaResult} mg/dL</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                    correctedCaResult >= 8.5 && correctedCaResult <= 10.5
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : correctedCaResult < 8.5
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {correctedCaResult >= 8.5 && correctedCaResult <= 10.5 ? "Normal Range (8.5 - 10.5)" : correctedCaResult < 8.5 ? "True Hypocalcemia" : "Hypercalcemia"}
                  </span>
                </div>
              </div>
            )}

            {activeArticle.interactiveCalculator === 'anion_gap' && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/60 to-slate-950 border border-rose-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Serum Anion Gap (MUDPILES Acidosis Evaluator)
                    </h4>
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">
                    Interactive
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Sodium [Na+] (mEq/L):</label>
                    <input
                      type="number"
                      value={agNa}
                      onChange={(e) => setAgNa(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Chloride [Cl-] (mEq/L):</label>
                    <input
                      type="number"
                      value={agCl}
                      onChange={(e) => setAgCl(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Bicarbonate [HCO3-] (mEq/L):</label>
                    <input
                      type="number"
                      value={agHco3}
                      onChange={(e) => setAgHco3(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Serum Anion Gap:</span>
                    <span className="text-2xl font-black font-mono text-rose-300">{anionGapResult} mEq/L</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                    anionGapResult > 12
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {anionGapResult > 12 ? "High Anion Gap (HAGMA) - Review MUDPILES" : "Normal Anion Gap (8-12 mEq/L)"}
                  </span>
                </div>
              </div>
            )}

            {/* Markdown Body Formatted Content */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-4 pt-2">
              <div className="prose prose-invert max-w-none space-y-3">
                {activeArticle.contentMarkdown
                  .split('\n\n')
                  .map((paragraph, idx) => {
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h2 key={idx} className="text-lg font-black text-white pt-2 border-b border-slate-800 pb-1">
                          {paragraph.replace('# ', '')}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-sm font-bold text-teal-300 pt-1">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('* ')) {
                      const items = paragraph.split('\n* ');
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                          {items.map((item, i) => (
                            <li key={i}>{item.replace(/^\* /, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.startsWith('1. ')) {
                      const items = paragraph.split(/\n[0-9]+\.\s/);
                      return (
                        <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-slate-300 text-xs">
                          {items.map((item, i) => (
                            <li key={i}>{item.replace(/^[0-9]+\.\s/, '')}</li>
                          ))}
                        </ol>
                      );
                    }
                    return (
                      <p key={idx} className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {paragraph}
                      </p>
                    );
                  })}
              </div>
            </div>

            {/* References Section */}
            {activeArticle.references.length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Academic & Clinical References:
                </span>
                <ul className="space-y-1">
                  {activeArticle.references.map((ref, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 font-mono flex items-start gap-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Wiki Helper Modal */}
      {showGitHubHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">How to Activate Your GitHub Wiki</h3>
              </div>
              <button
                onClick={() => setShowGitHubHelpModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                GitHub provides a free built-in Wiki for every repository at:
                <br />
                <code className="text-teal-300 font-mono text-[11px] bg-slate-950 px-2 py-1 rounded block mt-1">
                  https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro/wiki
                </code>
              </p>

              <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                <li>
                  Open your repository settings: <strong>Settings ➔ General ➔ Features</strong>.
                </li>
                <li>
                  Check the <strong>Wikis</strong> checkbox to turn it on.
                </li>
                <li>
                  Click the <strong>Wiki</strong> tab at the top of your GitHub repository.
                </li>
                <li>
                  Click <strong>Create the first page</strong> and paste the contents from our <strong>Download Wiki Bundle</strong> or click <strong>Copy for GitHub Wiki</strong> above!
                </li>
              </ol>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowGitHubHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
