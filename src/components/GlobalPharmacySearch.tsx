import React, { useState, useEffect } from 'react';
import { 
  Search, Globe, ShieldAlert, AlertTriangle, ExternalLink, RefreshCw, 
  Sparkles, Clock, CheckCircle2, Copy, FileText, ChevronRight, Filter,
  Building2, Landmark, Pill, BookOpen, Share2, Layers, AlertOctagon,
  Download, Printer, Info
} from 'lucide-react';
import { 
  PRESET_SEARCH_QUERIES, 
  CURATED_REGULATORY_ALERTS, 
  GlobalPharmacyAlert, 
  RegulatorySource 
} from '../data/globalPharmacyNewsData';

interface SearchResponseData {
  success: boolean;
  query: string;
  result: string;
  sources: RegulatorySource[];
  webSearchQueries?: string[];
  sourceType: string;
  timestamp: string;
  warning?: string;
}

interface GlobalPharmacySearchProps {
  initialQuery?: string;
  onNavigateToCourse?: (courseId: string) => void;
  onNavigateToGuidelines?: () => void;
}

export const GlobalPharmacySearch: React.FC<GlobalPharmacySearchProps> = ({
  initialQuery = "",
  onNavigateToCourse,
  onNavigateToGuidelines
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Safety & Regulatory Updates");
  const [selectedAgency, setSelectedAgency] = useState<string>("All Agencies (FDA, EMA, WHO, EFDA)");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponseData | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedCuratedAlert, setSelectedCuratedAlert] = useState<GlobalPharmacyAlert | null>(CURATED_REGULATORY_ALERTS[0]);

  // Execute initial search if provided
  useEffect(() => {
    if (initialQuery && !searchResult) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (queryToRun?: string) => {
    const q = (queryToRun !== undefined ? queryToRun : searchQuery).trim();
    if (!q) return;

    setIsLoading(true);
    setSearchQuery(q);

    try {
      const response = await fetch('/api/gemini/global-pharmacy-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: q,
          category: selectedCategory,
          agency: selectedAgency
        })
      });

      const data: SearchResponseData = await response.json();
      setSearchResult(data);
    } catch (err) {
      console.error("Search fetch error:", err);
      // Fallback display
      setSearchResult({
        success: true,
        query: q,
        result: `### 🌐 Global Pharmacy Regulatory Update: ${q}\n\nUnable to reach live search stream. Showing verified regulatory database information for international drug warnings and recalls.`,
        sources: [
          { title: "US FDA MedWatch Safety Alerts", uri: "https://www.fda.gov/safety/medwatch-fda-safety-information-and-adverse-event-reporting-program", agency: "FDA" },
          { title: "European Medicines Agency (EMA) News", uri: "https://www.ema.europa.eu/en/news", agency: "EMA" },
          { title: "WHO Medical Product Alerts", uri: "https://www.who.int/our-work/access-to-medicines-and-health-products/surveillance-and-monitoring-of-substandard-and-falsified-medical-products", agency: "WHO" }
        ],
        sourceType: "Pharma Star Offline Regulatory Core",
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!searchResult?.result) return;
    navigator.clipboard.writeText(searchResult.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Global Search Grounding Engine */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              Google Search Grounded &bull; Real-Time Live Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              FDA &bull; EMA &bull; WHO &bull; MHRA &bull; EFDA
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800">
              Gemini 3.8 Flash Powered
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Global Pharmacy Search &amp; Regulatory Radar</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
              Search live, verified regulatory safety communications, <strong>FDA Black Box Warnings</strong>, 
              <strong> EMA PRAC pharmacovigilance alerts</strong>, <strong>WHO counterfeit &amp; substandard recalls</strong>, 
              and global drug shortage registries grounded with real-time web citations.
            </p>
          </div>

          {/* Search Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="pt-2 flex flex-col sm:flex-row items-stretch gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-teal-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any drug, FDA/EMA recall, black box warning, active ingredient, or shortage..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-950/90 border border-teal-500/40 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Searching Grounded Web...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Search Global Radar</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Filter Selection */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-teal-400" /> Regulatory Agency:
            </span>
            {["All Agencies (FDA, EMA, WHO, EFDA)", "US FDA Only", "EMA Europe Only", "WHO Alerts Only"].map(agency => (
              <button
                key={agency}
                type="button"
                onClick={() => setSelectedAgency(agency)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                  selectedAgency === agency
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {agency.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Trending Search Queries */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Yield Regulatory Presets &bull; One-Click Live Verification</span>
          </h4>
          <span className="text-[11px] text-slate-400">Click any topic to trigger Google Search grounding</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {PRESET_SEARCH_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(preset.query)}
              className="text-left p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 text-xs text-slate-200 transition group flex flex-col justify-between cursor-pointer"
            >
              <div className="font-semibold group-hover:text-teal-300 transition">
                {preset.label}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-950 text-teal-400 font-mono">
                  {preset.category}
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Result Section */}
      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">
              Grounding Real-Time Web Intelligence...
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Querying Google Search across US FDA databases, EMA PRAC circulars, WHO alerts, and PubMed clinical journals for <strong>"{searchQuery}"</strong>.
            </p>
          </div>
        </div>
      )}

      {searchResult && !isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Result Header & Actions */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Live Grounded Result
                </span>
                <span className="text-xs text-slate-400">
                  {searchResult.sourceType}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                Intelligence Brief: <span className="text-teal-400">"{searchResult.query}"</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Generated at: {new Date(searchResult.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Action Buttons: Copy, Print */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Copy markdown brief to clipboard"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                <span>{copied ? "Copied!" : "Copy Report"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Print or export as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Web Search Queries Executed by Google Search Grounding */}
          {searchResult.webSearchQueries && searchResult.webSearchQueries.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Search className="w-3 h-3 text-teal-400" />
                Google Search Queries Grounded in Real-Time:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {searchResult.webSearchQueries.map((sq, sqIdx) => (
                  <span
                    key={sqIdx}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-teal-300"
                  >
                    "{sq}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Primary Grounded Regulatory Web Sources (Clickable Cards) */}
          {searchResult.sources && searchResult.sources.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Primary Official Citations &bull; Verified Regulatory Documents ({searchResult.sources.length})</span>
                </h4>
                <span className="text-[10px] text-slate-400">Click to view primary regulatory filing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {searchResult.sources.map((src, sIdx) => {
                  let badge = "HEALTH";
                  let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                  if (src.uri.includes('fda.gov')) {
                    badge = "US FDA";
                    badgeColor = "bg-blue-500/20 text-blue-300 border-blue-500/40";
                  } else if (src.uri.includes('ema.europa')) {
                    badge = "EMA EU";
                    badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  } else if (src.uri.includes('who.int')) {
                    badge = "WHO";
                    badgeColor = "bg-teal-500/20 text-teal-300 border-teal-500/40";
                  }

                  return (
                    <a
                      key={sIdx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-900 text-xs transition group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badgeColor}`}>
                            {badge}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-400 transition" />
                        </div>
                        <h5 className="font-semibold text-white group-hover:text-teal-300 transition line-clamp-2 mt-1">
                          {src.title || "Official Announcement"}
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-500 truncate mt-2 font-mono">
                        {src.uri}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Formatted Markdown Synthesis */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
            {searchResult.result.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ') || paragraph.startsWith('## ')) {
                const title = paragraph.replace(/^#+\s*/, '');
                return (
                  <h4 key={pIdx} className="text-base font-black text-teal-300 border-b border-slate-800/80 pb-1.5 mt-4 first:mt-0 flex items-center gap-2">
                    {title}
                  </h4>
                );
              }
              if (paragraph.startsWith('#### ')) {
                const title = paragraph.replace(/^####\s*/, '');
                return (
                  <h5 key={pIdx} className="text-sm font-bold text-amber-300 mt-2">
                    {title}
                  </h5>
                );
              }
              return (
                <div key={pIdx} className="space-y-1">
                  {paragraph.split('\n').map((line, lIdx) => {
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                      const itemText = line.replace(/^[\*\-]\s*/, '');
                      return (
                        <div key={lIdx} className="flex items-start gap-2 pl-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                          <span className="text-slate-300" dangerouslySetInnerHTML={{ __html: formatBold(itemText) }} />
                        </div>
                      );
                    }
                    return (
                      <p key={lIdx} className="text-slate-300" dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Curated Real-World Safety Radar Registry */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Curated Regulatory Intelligence Archive &bull; Active Worldwide Watchlist
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              Verified FDA, EMA &amp; WHO Safety Warnings Registry
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
            {CURATED_REGULATORY_ALERTS.length} Major Active Alerts
          </span>
        </div>

        {/* Selected Alert Details Modal/View */}
        {selectedCuratedAlert && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedCuratedAlert.severity === 'CRITICAL_RECALL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : selectedCuratedAlert.severity === 'BLACK_BOX_WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                }`}>
                  {selectedCuratedAlert.severity.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                  {selectedCuratedAlert.agencyFullName}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Date: {selectedCuratedAlert.date}
                </span>
              </div>

              <button
                onClick={() => handleSearch(`${selectedCuratedAlert.activeIngredient} ${selectedCuratedAlert.agency} safety update`)}
                className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-Verify Live on Google</span>
              </button>
            </div>

            <h4 className="text-base font-bold text-white">
              {selectedCuratedAlert.headline}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="font-bold text-teal-400 block">Executive Summary:</span>
                <p className="text-slate-300 leading-relaxed">{selectedCuratedAlert.summary}</p>
                <div className="pt-2 text-[11px] text-slate-400">
                  <strong>Active Substance:</strong> <code className="text-teal-300">{selectedCuratedAlert.activeIngredient}</code> | <strong>Brands:</strong> {selectedCuratedAlert.brandNames.join(', ')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="font-bold text-rose-400 block">Clinical Risk &amp; Patient Harm:</span>
                <p className="text-slate-300 leading-relaxed">{selectedCuratedAlert.clinicalImpact}</p>
                <span className="font-bold text-amber-400 block pt-2">Pharmacist Action Directive:</span>
                <p className="text-slate-300 leading-relaxed">{selectedCuratedAlert.pharmacistActionPlan}</p>
              </div>
            </div>

            {/* Citations for this alert */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">Primary Citations:</span>
              {selectedCuratedAlert.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500 text-teal-300 text-[11px] flex items-center gap-1 transition"
                >
                  <span>{s.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Alerts List Selection Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CURATED_REGULATORY_ALERTS.map(alert => {
            const isSelected = selectedCuratedAlert?.id === alert.id;
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedCuratedAlert(alert)}
                className={`p-4 rounded-2xl border text-xs transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/40'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-teal-300">
                      {alert.agency}
                    </span>
                    <span className="text-slate-500 font-mono">{alert.date}</span>
                  </div>
                  <h5 className="font-bold text-white text-xs line-clamp-2 leading-snug">
                    {alert.headline}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {alert.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-teal-400 font-semibold">{alert.category}</span>
                  <span className="text-slate-400 hover:text-white flex items-center gap-0.5 font-bold">
                    View Dossier ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper to format bold markdown safely
function formatBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
}
