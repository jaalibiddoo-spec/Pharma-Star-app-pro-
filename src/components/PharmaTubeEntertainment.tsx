import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Play, 
  Pause, 
  Search, 
  ExternalLink, 
  Music, 
  Film, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Volume2, 
  Smile, 
  Heart, 
  BookOpen, 
  Share2,
  Maximize2,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { User as UserType, Language, PharmaTubeVideo } from '../types';
import { samplePharmaTubeVideos } from '../data/advancedFeaturesData';

interface PharmaTubeEntertainmentProps {
  user: UserType;
  currentLanguage: Language;
  onUpgradeToService: (service: 'pharmatube_entertainment', amount: number) => void;
}

export const PharmaTubeEntertainment: React.FC<PharmaTubeEntertainmentProps> = ({
  user,
  currentLanguage,
  onUpgradeToService
}) => {
  const isUnlocked = user.unlockedPharmaTube || user.isPro || false;

  const [videos, setVideos] = useState<PharmaTubeVideo[]>(samplePharmaTubeVideos);
  const [selectedVideo, setSelectedVideo] = useState<PharmaTubeVideo>(samplePharmaTubeVideos[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [cbeRefInput, setCbeRefInput] = useState<string>('');
  const [theaterMode, setTheaterMode] = useState<boolean>(false);

  // Fetch videos from server if needed
  useEffect(() => {
    fetch('/api/pharmatube/videos')
      .then(res => res.json())
      .then(data => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        }
      })
      .catch(err => console.log('Using local video store:', err));
  }, []);

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract YouTube ID from URL or ID
  const extractYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    // Direct ID like jfKfPfyJRdk
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('?')) {
      return trimmed;
    }
    // Match watch?v=... or youtu.be/... or embed/...
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  const handleAddCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }

    const yId = extractYouTubeId(customUrlInput);
    if (!yId || yId.length !== 11) {
      alert('Please enter a valid YouTube video URL or 11-character video ID.');
      return;
    }

    const newCustomVideo: PharmaTubeVideo = {
      id: `pt-custom-${Date.now()}`,
      title: `Custom User Video (ID: ${yId})`,
      youtubeId: yId,
      category: 'study_beats',
      channelTitle: 'User Stream',
      durationFormatted: 'Custom Stream',
      description: 'Custom YouTube video imported into PharmaTube Entertainment Lounge.',
      thumbnailUrl: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
      tags: ['Custom', 'User Stream', 'PharmaTube']
    };

    setVideos(prev => [newCustomVideo, ...prev]);
    setSelectedVideo(newCustomVideo);
    setCustomUrlInput('');
  };

  const categories = [
    { id: 'all', label: 'All Entertainment', icon: Tv },
    { id: 'study_beats', label: 'Lofi & Study Beats', icon: Music },
    { id: 'pharmacology_3d', label: '3D Pharmacology MoA', icon: Sparkles },
    { id: 'ethiopian_health', label: 'Ethiopian Health & EPSS', icon: Film },
    { id: 'clinical_cases', label: 'ICU Ward Rounds', icon: BookOpen },
    { id: 'ted_medicine', label: 'TEDx & Breakthroughs', icon: HelpCircle },
    { id: 'stress_relief_comedy', label: 'Pharmacy Humor & Relief', icon: Smile }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-red-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-semibold uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5 text-red-400" />
              Integrated YouTube Entertainment & Relaxation Lounge
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              PharmaTube™ Media & Clinical Relaxation Suite
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              Curated for pharmacy professionals, interns, and students on demanding hospital night shifts. Stream calming study beats, 3D molecular mechanism animations, Ethiopian healthcare documentaries, and stress-relieving pharmacy comedy.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {isUnlocked ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Unlimited Entertainment Pass (Active)
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Unlock PharmaTube Entertainment (100 Birr)
              </button>
            )}
            <span className="text-xs text-slate-400">
              One-time 100 ETB fee • Unlimited video & custom URL streams
            </span>
          </div>
        </div>

        {/* Custom YouTube URL Pasting Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <form onSubmit={handleAddCustomVideo} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input 
                type="text"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Paste ANY YouTube Video URL or Video ID (e.g., https://www.youtube.com/watch?v=... or jfKfPfyJRdk)..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              Play Custom Video
            </button>
          </form>
        </div>
      </div>

      {/* Main Video Player & Playlist Layout */}
      <div className={`grid ${theaterMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
        {/* Active Player Window */}
        <div className={`${theaterMode ? 'col-span-1' : 'lg:col-span-2'} space-y-4`}>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
            {!isUnlocked ? (
              <div className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 relative">
                <img 
                  src={selectedVideo.thumbnailUrl} 
                  alt={selectedVideo.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
                />
                <div className="relative z-10 max-w-md space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">PharmaTube™ Entertainment Locked</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Subscribe for 100 Birr to stream all curated pharmacy videos, study music, 3D pharmacology models, and custom YouTube links.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    Unlock Now (100 Birr)
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {/* Video Details Bar */}
            <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/40">
                    {selectedVideo.channelTitle}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedVideo.durationFormatted}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {selectedVideo.title}
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setTheaterMode(!theaterMode)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Toggle Theater Mode"
                >
                  <Maximize2 className="w-4 h-4" />
                  {theaterMode ? 'Normal View' : 'Theater Mode'}
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist & Video Feed */}
        <div className="space-y-4">
          {/* Category Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, topics, study music..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeCategory === cat.id 
                        ? 'bg-red-600 text-white shadow' 
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Videos Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-bold uppercase tracking-wider">Lounge Playlist ({filteredVideos.length})</span>
              <span>Click to Stream</span>
            </div>

            <div className="space-y-2.5">
              {filteredVideos.map((vid) => {
                const isCurrent = vid.id === selectedVideo.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      isCurrent 
                        ? 'bg-red-950/40 border-red-500/50 shadow-md' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="relative w-28 h-18 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                      <img 
                        src={vid.thumbnailUrl} 
                        alt={vid.title} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] text-white font-mono">
                        {vid.durationFormatted}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h4 className={`text-xs font-bold line-clamp-2 ${isCurrent ? 'text-red-300' : 'text-slate-200'}`}>
                        {vid.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span className="truncate">{vid.channelTitle}</span>
                        {isCurrent && (
                          <span className="text-red-400 font-bold flex items-center gap-1 text-[10px]">
                            <Play className="w-2.5 h-2.5 fill-red-400" /> Playing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 100 Birr Payment Modal for PharmaTube Entertainment */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Unlock PharmaTube™ Lounge</h3>
                  <p className="text-xs text-slate-400">Lifetime access • Relaxation, 3D videos, & custom stream player</p>
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
              <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-center">
                <span className="text-xs text-red-300 uppercase tracking-widest font-semibold">One-Time Entertainment Pass</span>
                <div className="text-3xl font-extrabold text-white mt-1">100 ETB <span className="text-sm font-normal text-slate-300">($1.00 USD)</span></div>
                <p className="text-xs text-red-200/80 mt-1">
                  Enjoy unlimited streaming, background study beats, and embed ANY YouTube link
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
                  placeholder="e.g. TB-882194 or CBE-1002629"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  onUpgradeToService('pharmatube_entertainment', 100);
                  setShowPaymentModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Instant Verify & Unlock (100 Birr)
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
