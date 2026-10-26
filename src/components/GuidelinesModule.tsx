import React, { useState } from 'react';
import { guidelinesData } from '../data/guidelinesData';
import { Guideline } from '../types';
import { 
  BookOpen, DownloadCloud, CheckCircle2, Search, 
  ExternalLink, Globe, Landmark, Filter, Bookmark, Share2 
} from 'lucide-react';

export const GuidelinesModule: React.FC = () => {
  const [guidelines, setGuidelines] = useState<Guideline[]>(guidelinesData);
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'All' | 'National (Ethiopia)' | 'International'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['guide-efda-1']);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleOfflineCache = (id: string) => {
    setGuidelines(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, offlineCached: !g.offlineCached };
      }
      return g;
    }));
  };

  const categories = ['All', 'Formulary / STG', 'Infectious Disease', 'Cardiology', 'Endocrinology', 'Nephrology', 'Respiratory'];

  const filteredGuidelines = guidelines.filter(g => {
    const matchJurisdiction = jurisdictionFilter === 'All' || g.jurisdiction === jurisdictionFilter;
    const matchCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        g.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchJurisdiction && matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Official Clinical Evidence Feed
              </span>
              <span className="text-xs text-slate-400">EFDA, MoH Ethiopia, WHO & Global Societies</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Live National & International Clinical Guidelines</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Access the latest standard treatment guidelines, WHO AWaRe antibiotic protocols, Ethiopian national formularies, and evidence-based clinical practices with offline synchronization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGuidelines(prev => prev.map(g => ({ ...g, offlineCached: true })));
                alert("All guidelines downloaded and synced to your local offline database!");
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Download All Offline</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Jurisdiction & Search */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            {(['All', 'National (Ethiopia)', 'International'] as const).map(j => (
              <button
                key={j}
                onClick={() => setJurisdictionFilter(j)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  jurisdictionFilter === j
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {j === 'National (Ethiopia)' ? <Landmark className="w-3.5 h-3.5" /> : j === 'International' ? <Globe className="w-3.5 h-3.5" /> : null}
                <span>{j}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter guidelines..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-teal-300 border border-teal-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuidelines.map(g => (
          <div
            key={g.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-3.5 transition flex flex-col justify-between"
          >
            <div>
              {/* Jurisdiction & Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    g.jurisdiction === 'National (Ethiopia)'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {g.jurisdiction}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {g.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {g.status}
                  </span>
                  <button
                    onClick={() => toggleBookmark(g.id)}
                    className="p-1 rounded text-slate-400 hover:text-amber-400 transition cursor-pointer"
                    title="Bookmark Guideline"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(g.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Authority */}
              <h3 className="text-base font-bold text-white leading-snug">
                {g.title}
              </h3>
              <p className="text-xs text-teal-400 font-medium mt-1">
                Issued by: {g.authority} ({g.year})
              </p>

              {/* Summary */}
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {g.summary}
              </p>

              {/* Key Highlights Bullet points */}
              <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">
                  Key Recommendations & Pearls:
                </span>
                <ul className="space-y-1">
                  {g.keyPoints.map((point, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions: Offline Sync Status & Source */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => toggleOfflineCache(g.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                  g.offlineCached
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {g.offlineCached ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved Offline ({g.downloadSize})</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Download ({g.downloadSize})</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-400 font-mono">
                {g.sourceUrlName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
