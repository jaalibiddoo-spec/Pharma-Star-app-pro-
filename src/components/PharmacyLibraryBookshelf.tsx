import React, { useState, useEffect } from 'react';
import { 
  BookOpen, BookMarked, Search, Filter, Volume2, VolumeX, 
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Bookmark,
  Download, Printer, Share2, Layers, Award, Star, Clock, 
  ExternalLink, Eye, RotateCcw, X, ZoomIn, ZoomOut, Sun, Moon,
  FileText, ShieldCheck, HelpCircle, Check, Play, Pause
} from 'lucide-react';
import { libraryBooksData, LibraryBook, LibraryBookChapter } from '../data/libraryBooksData';

export const PharmacyLibraryBookshelf: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'bookshelf' | 'catalog'>('bookshelf');
  
  // Reader Modal State
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [readerTheme, setReaderTheme] = useState<'paper' | 'sepia' | 'dark' | 'midnight'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [inBookSearch, setInBookSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio / Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Stored Bookmarks & Reading Progress ({ [bookId]: { lastChapterIndex, percent, timestamp } })
  const [readingProgress, setReadingProgress] = useState<Record<string, {
    lastChapterIndex: number;
    chapterTitle: string;
    timestamp: string;
    percent: number;
  }>>(() => {
    try {
      const saved = localStorage.getItem('pharmastar_library_reading_points');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save reading progress to localStorage
  const saveReadingPoint = (book: LibraryBook, chapterIdx: number, percent: number = 50) => {
    const updated = {
      ...readingProgress,
      [book.id]: {
        lastChapterIndex: chapterIdx,
        chapterTitle: book.chapters[chapterIdx]?.title || 'Chapter 1',
        timestamp: new Date().toISOString(),
        percent
      }
    };
    setReadingProgress(updated);
    try {
      localStorage.setItem('pharmastar_library_reading_points', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    showToast(`Saved bookmark: "${book.chapters[chapterIdx]?.title.slice(0, 30)}..."`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // TTS Web Speech Narration
  useEffect(() => {
    if (!isPlayingAudio) {
      window.speechSynthesis?.cancel();
    }
  }, [isPlayingAudio]);

  useEffect(() => {
    // When reader closes or chapter changes, cancel speech
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [activeReadingBook, activeChapterIndex]);

  const toggleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported by your current browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      if (!activeReadingBook) return;
      const chapter = activeReadingBook.chapters[activeChapterIndex];
      if (!chapter) return;

      const fullText = `${chapter.title}. ` + chapter.sections.map(s => `${s.heading}. ${s.content}`).join('. ');
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      showToast('Playing clinical audio narration...');
    }
  };

  const openBookInReader = (book: LibraryBook, chapterIdx: number = 0) => {
    setActiveReadingBook(book);
    const savedPoint = readingProgress[book.id];
    const initialChapter = (chapterIdx !== undefined && chapterIdx !== null) 
      ? chapterIdx 
      : (savedPoint?.lastChapterIndex ?? 0);
    setActiveChapterIndex(Math.min(initialChapter, book.chapters.length - 1));
  };

  const filteredBooks = libraryBooksData.filter(b => {
    const matchCategory = selectedCategory === 'all' || 
      (selectedCategory === 'in_progress' ? !!readingProgress[b.id] : b.category === selectedCategory);
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const activeChapter = activeReadingBook?.chapters[activeChapterIndex];

  // Theme styling for the reader
  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'paper':
        return 'bg-amber-50/90 text-stone-900 border-amber-200';
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#5c4033] border-[#e2d5bc]';
      case 'midnight':
        return 'bg-black text-amber-100 border-neutral-900';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100 border-slate-800';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs md:text-sm';
      case 'lg': return 'text-base md:text-lg';
      case 'xl': return 'text-lg md:text-xl';
      case 'base':
      default: return 'text-sm md:text-base';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce border border-teal-400">
          <Bookmark className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
                <BookMarked className="w-3.5 h-3.5 text-teal-400" />
                <span>Premier Clinical Pharmacy Library</span>
              </span>
              <span className="text-xs text-slate-400">
                Full Readable Books • Audio Narration • Clinical Tables • STGs
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Pharmacy Library & Readable Bookshelf
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Explore authentic, landmark clinical pharmacy textbooks, British Pharmacopoeia (BP 2024), Goodman &amp; Gilman, DiPiro, Stockley&apos;s Drug Interactions, and Ethiopian MoH/EFDA Standard Treatment Guidelines on an interactive, readable 3D bookshelf.
            </p>
          </div>

          {/* Quick Stats & View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-4 text-xs shadow-inner">
              <div className="text-center">
                <span className="block text-lg font-black text-teal-400">{libraryBooksData.length}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Landmarks</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <span className="block text-lg font-black text-amber-400">14,800+</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Pages</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <span className="block text-lg font-black text-indigo-400">100%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Free Readable</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1.5 rounded-2xl">
              <button
                onClick={() => setViewMode('bookshelf')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'bookshelf'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Bookshelf</span>
              </button>
              <button
                onClick={() => setViewMode('catalog')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'catalog'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Catalog Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, DiPiro, Goodman & Gilman, BP 2024, STG..."
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All References' },
              { id: 'clinical', label: 'Clinical & Therapeutics' },
              { id: 'formularies', label: 'Ethiopian MoH / EFDA STGs' },
              { id: 'pharmacopeia', label: 'BP 2024 & Compounding' },
              { id: 'interactions', label: 'Interactions (Stockley)' },
              { id: 'toxicology', label: 'Toxicology & Emergency' },
              { id: 'in_progress', label: `My Bookmarks (${Object.keys(readingProgress).length})` }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTINUOUS READING / STOPPED POINT BANNER (If user has bookmarks) */}
      {Object.keys(readingProgress).length > 0 && (
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/40 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Bookmark className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                Resume Your Reading
              </span>
              <p className="text-xs text-white font-semibold">
                You have active reading positions in {Object.keys(readingProgress).length} landmark volumes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {Object.entries(readingProgress).map(([bookId, prog]) => {
              const book = libraryBooksData.find(b => b.id === bookId);
              if (!book) return null;
              return (
                <button
                  key={bookId}
                  onClick={() => openBookInReader(book, prog.lastChapterIndex)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-xs text-slate-200 flex items-center gap-2 cursor-pointer transition whitespace-nowrap group"
                >
                  <span className="font-bold text-teal-300">{book.title.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">Ch. {prog.lastChapterIndex + 1}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 1: VISUAL 3D BOOKSHELF VIEW */}
      {viewMode === 'bookshelf' && (
        <div className="space-y-10">
          {/* Wooden Bookshelf Tier 1 */}
          <div className="relative rounded-3xl p-6 pt-10 shadow-2xl border-4 border-amber-950/80 bg-gradient-to-b from-stone-900 via-neutral-900 to-[#1e150f] overflow-hidden">
            {/* Shelf Backboard Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#2d1e13_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 border-b border-amber-900/40 pb-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Main Tier: Core Clinical Therapeutics &amp; Pharmacopeias</span>
                </span>
                <span className="text-[11px] text-amber-300/70 font-serif italic">
                  Tap any spine to pull from shelf and open reader
                </span>
              </div>

              {/* Books on the Shelf */}
              <div className="flex items-end justify-center md:justify-start gap-3 sm:gap-5 md:gap-8 overflow-x-auto pb-4 pt-6 px-4 min-h-[340px]">
                {filteredBooks.map((book, idx) => {
                  const hasBookmark = !!readingProgress[book.id];
                  // Vary heights and widths realistically
                  const heights = ['h-[280px]', 'h-[295px]', 'h-[270px]', 'h-[305px]', 'h-[285px]'];
                  const bookHeight = heights[idx % heights.length];
                  
                  return (
                    <div
                      key={book.id}
                      onClick={() => openBookInReader(book)}
                      className={`relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-4 hover:scale-105 shrink-0 ${bookHeight}`}
                      style={{ perspective: '1000px' }}
                    >
                      {/* Ribbon Bookmark if in progress */}
                      {hasBookmark && (
                        <div className="absolute -top-3 right-3 z-30 w-3 h-8 bg-rose-600 rounded-b shadow-lg border-b border-rose-400 animate-pulse" title="Bookmarked in progress" />
                      )}

                      {/* 3D Realistic Spine */}
                      <div className={`w-14 sm:w-16 md:w-20 h-full rounded-sm shadow-2xl relative flex flex-col justify-between py-4 px-2 border-r-2 border-black/40 overflow-hidden ${book.spineBg}`}>
                        {/* Gold Embossed Ribs on Spine */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-amber-400/40 shadow" />
                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-amber-400/20" />
                        <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-amber-400/20" />
                        <div className="absolute bottom-4 left-0 right-0 h-1 bg-amber-400/40 shadow" />

                        {/* Top: Edition Badge */}
                        <div className="text-center z-10">
                          <span className="text-[9px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-black/40 text-amber-300 block truncate">
                            {book.edition}
                          </span>
                        </div>

                        {/* Vertical Embossed Title */}
                        <div className="flex-1 flex items-center justify-center my-2 overflow-hidden">
                          <span 
                            className={`text-xs md:text-sm font-extrabold tracking-wider uppercase font-serif whitespace-nowrap rotate-90 transform select-none ${book.textColor}`}
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                          >
                            {book.title.length > 22 ? book.title.slice(0, 20) + '...' : book.title}
                          </span>
                        </div>

                        {/* Bottom: Publisher & Category Tab */}
                        <div className="text-center z-10 space-y-1">
                          <span className="text-[8px] font-bold text-slate-300/80 block uppercase truncate">
                            {book.authors.split(',')[0]}
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full mx-auto bg-amber-400/70 block shadow-sm" />
                        </div>
                      </div>

                      {/* Hover Tooltip Card */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 border border-teal-500/60 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-left">
                        <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider block">
                          {book.categoryLabel}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-1">{book.title}</h4>
                        <p className="text-[10px] text-slate-300 line-clamp-2 mt-1">{book.subtitle}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>{book.pagesCount} pages</span>
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" /> {book.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heavy Hardwood Shelf Plank with Brass Rail */}
            <div className="relative z-20 -mx-6 h-8 bg-gradient-to-r from-[#3e2716] via-[#634026] to-[#3e2716] shadow-[0_12px_25px_rgba(0,0,0,0.9)] border-t border-amber-600/40 flex items-center justify-between px-6">
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500/30 via-amber-300/50 to-amber-500/30 rounded-full" />
            </div>
            <div className="relative z-10 -mx-6 h-4 bg-gradient-to-b from-[#1b1009] to-[#0c0704]" />
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CATALOG GRID VIEW */}
      {viewMode === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => {
            const hasBookmark = !!readingProgress[book.id];
            return (
              <div 
                key={book.id}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 space-y-4 shadow-xl transition-all hover:shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${book.accentBadgeColor}`}>
                      {book.categoryLabel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{book.edition}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white hover:text-teal-300 transition cursor-pointer" onClick={() => openBookInReader(book)}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-teal-400 mt-0.5 font-medium">{book.subtitle}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Authors: {book.authors}</p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Chapter Highlights */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Featured Readable Chapters:
                    </span>
                    <ul className="space-y-1">
                      {book.chapters.slice(0, 2).map((ch, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center justify-between">
                          <span className="truncate pr-2">Ch {ch.chapterNumber}: {ch.title}</span>
                          <span className="text-[10px] text-teal-400 font-mono shrink-0">{ch.estimatedReadTime}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    <span className="font-bold text-white">{book.pagesCount}</span> pages • <span className="text-amber-400">★ {book.rating}</span>
                  </div>

                  <button
                    onClick={() => openBookInReader(book)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{hasBookmark ? 'Resume Reading' : 'Open & Read'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL IMMERSIVE READABLE BOOK READER MODAL */}
      {activeReadingBook && activeChapter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className={`w-full max-w-6xl rounded-3xl shadow-2xl flex flex-col h-[92vh] border overflow-hidden transition-colors ${getThemeClasses()}`}>
            
            {/* Top Reader Navigation Bar */}
            <div className="px-5 py-3.5 border-b flex items-center justify-between gap-3 bg-black/20 backdrop-blur">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Toggle Table of Contents"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                      {activeReadingBook.edition}
                    </span>
                    <h3 className="text-xs md:text-sm font-bold truncate max-w-md">
                      {activeReadingBook.title}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    Chapter {activeChapter.chapterNumber}: {activeChapter.title} ({activeChapter.pages})
                  </span>
                </div>
              </div>

              {/* Reader Tools: Audio Narration, Font Size, Theme, Bookmark, Print */}
              <div className="flex items-center gap-2">
                {/* Audio TTS Button */}
                <button
                  onClick={toggleAudioNarration}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-teal-600/80 hover:bg-teal-500 text-white'
                  }`}
                  title="Listen to clinical narration"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isPlayingAudio ? 'Pause Narration' : 'Listen Narration'}</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => saveReadingPoint(activeReadingBook, activeChapterIndex, 75)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                  title="Save stopped point and bookmark this chapter"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Point</span>
                </button>

                {/* Font Size Selector */}
                <div className="hidden md:flex items-center bg-slate-800/50 rounded-xl p-0.5 border border-slate-700/60">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-1 rounded text-xs ${fontSize === 'sm' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-1 rounded text-xs ${fontSize === 'base' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-1 rounded text-xs ${fontSize === 'lg' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    A+
                  </button>
                </div>

                {/* Theme Selector */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-800/50 rounded-xl p-1 border border-slate-700/60">
                  <button
                    onClick={() => setReaderTheme('dark')}
                    className={`w-5 h-5 rounded-full bg-slate-900 border ${readerTheme === 'dark' ? 'border-teal-400 ring-2 ring-teal-400/40' : 'border-slate-700'}`}
                    title="Dark Studio"
                  />
                  <button
                    onClick={() => setReaderTheme('sepia')}
                    className={`w-5 h-5 rounded-full bg-[#f4ecd8] border ${readerTheme === 'sepia' ? 'border-amber-600 ring-2 ring-amber-600/40' : 'border-stone-400'}`}
                    title="Warm Sepia"
                  />
                  <button
                    onClick={() => setReaderTheme('paper')}
                    className={`w-5 h-5 rounded-full bg-stone-100 border ${readerTheme === 'paper' ? 'border-slate-800 ring-2 ring-slate-800/40' : 'border-slate-300'}`}
                    title="Paper White"
                  />
                  <button
                    onClick={() => setReaderTheme('midnight')}
                    className={`w-5 h-5 rounded-full bg-black border ${readerTheme === 'midnight' ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-neutral-800'}`}
                    title="Midnight OLED"
                  />
                </div>

                {/* Print Chapter */}
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 cursor-pointer hidden md:block"
                  title="Print Chapter / Save as PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setActiveReadingBook(null);
                    window.speechSynthesis?.cancel();
                    setIsPlayingAudio(false);
                  }}
                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
                  title="Close Reader"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Screen: Table of Contents & Main Reading Text */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar: Table of Contents */}
              {isSidebarOpen && (
                <div className="w-72 sm:w-80 border-r bg-black/10 overflow-y-auto p-4 space-y-4 shrink-0 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                      Table of Contents
                    </span>
                    <div className="space-y-1.5">
                      {activeReadingBook.chapters.map((ch, idx) => {
                        const isCurrent = idx === activeChapterIndex;
                        return (
                          <button
                            key={ch.id}
                            onClick={() => {
                              setActiveChapterIndex(idx);
                              saveReadingPoint(activeReadingBook, idx);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left transition cursor-pointer text-xs ${
                              isCurrent
                                ? 'bg-teal-600 text-white font-bold shadow-md'
                                : 'hover:bg-white/5 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] opacity-75">Chapter {ch.chapterNumber}</span>
                              <span className="text-[9px] opacity-75 font-mono">{ch.estimatedReadTime}</span>
                            </div>
                            <h5 className="font-semibold mt-0.5 line-clamp-2">{ch.title}</h5>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Book Metadata Footer */}
                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p><strong>ISBN:</strong> {activeReadingBook.isbn}</p>
                    <p><strong>Publisher:</strong> {activeReadingBook.publisher}</p>
                    <p><strong>Audience:</strong> {activeReadingBook.targetAudience}</p>
                  </div>
                </div>
              )}

              {/* Main Reading Canvas */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 font-sans">
                {/* Chapter Heading Banner */}
                <div className="border-b pb-6 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300">
                      Chapter {activeChapter.chapterNumber}
                    </span>
                    <span className="text-xs text-slate-400">{activeChapter.pages}</span>
                    <span className="text-xs text-slate-400">• Estimated reading: {activeChapter.estimatedReadTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">
                    {activeChapter.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {activeChapter.keyThemes.map((theme, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-mono font-medium">
                        #{theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chapter Sections */}
                <div className="space-y-8">
                  {activeChapter.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      <h3 className="text-base md:text-lg font-bold flex items-center gap-2 text-teal-400">
                        <span>{section.heading}</span>
                      </h3>

                      <div className={`${getFontSizeClass()} leading-relaxed whitespace-pre-line space-y-3 font-normal opacity-95`}>
                        {section.content}
                      </div>

                      {/* Clinical Pearls Box */}
                      {section.clinicalPearls && section.clinicalPearls.length > 0 && (
                        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2 text-xs md:text-sm">
                          <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Clinical Pharmacist Practice Pearls:</span>
                          </span>
                          <ul className="space-y-1.5">
                            {section.clinicalPearls.map((pearl, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{pearl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Clinical Reference Table */}
                      {section.tables && (
                        <div className="space-y-2 overflow-x-auto rounded-2xl border border-slate-700/80 bg-black/20 p-4">
                          {section.tables.title && (
                            <span className="text-xs font-bold text-amber-400 block mb-2">
                              {section.tables.title}
                            </span>
                          )}
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-700 text-teal-300 font-semibold">
                                {section.tables.headers.map((hdr, hIdx) => (
                                  <th key={hIdx} className="py-2 px-3">{hdr}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {section.tables.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="py-2.5 px-3">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Stepwise Clinical Algorithm */}
                      {section.algorithmSteps && (
                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 text-xs">
                          <span className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] block">
                            Evidence-Based Clinical Decision Pathway:
                          </span>
                          <ol className="space-y-1.5">
                            {section.algorithmSteps.map((step, stIdx) => (
                              <li key={stIdx} className="flex items-start gap-2 text-slate-200">
                                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold font-mono text-[10px]">
                                  {stIdx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Navigation between Chapters */}
                <div className="pt-8 border-t flex items-center justify-between gap-4">
                  <button
                    disabled={activeChapterIndex === 0}
                    onClick={() => {
                      if (activeChapterIndex > 0) {
                        const newIdx = activeChapterIndex - 1;
                        setActiveChapterIndex(newIdx);
                        saveReadingPoint(activeReadingBook, newIdx);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      activeChapterIndex === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </button>

                  <button
                    onClick={() => saveReadingPoint(activeReadingBook, activeChapterIndex, 100)}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Chapter Completed</span>
                  </button>

                  <button
                    disabled={activeChapterIndex >= activeReadingBook.chapters.length - 1}
                    onClick={() => {
                      if (activeChapterIndex < activeReadingBook.chapters.length - 1) {
                        const newIdx = activeChapterIndex + 1;
                        setActiveChapterIndex(newIdx);
                        saveReadingPoint(activeReadingBook, newIdx);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      activeChapterIndex >= activeReadingBook.chapters.length - 1
                        ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
