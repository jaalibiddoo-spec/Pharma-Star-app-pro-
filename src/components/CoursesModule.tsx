import React, { useState, useEffect } from 'react';
import { coursesData } from '../data/coursesData';
import { Course, CourseModule, User } from '../types';
import { 
  BookOpen, Video, Sparkles, CheckCircle2, ChevronRight, ChevronLeft,
  Layers, Search, Award, Pill, Stethoscope, Factory, 
  ShieldAlert, ClipboardCheck, Dna, Atom, GraduationCap,
  Activity, HelpCircle, Lock, ShieldCheck, Check, ArrowRight,
  BookMarked, ExternalLink, Bookmark, Clock, RotateCcw, X, CheckSquare,
  BarChart2, Zap
} from 'lucide-react';
import { CoursePaymentModal } from './CoursePaymentModal';
import { GeminiQuestionAssistant } from './GeminiQuestionAssistant';

interface CoursesModuleProps {
  onOpenVideo: (course: Course) => void;
  onOpen3D: (modelId?: string) => void;
  onOpenCPD?: () => void;
  currentUser?: User;
}

export interface CourseProgressRecord {
  courseId: string;
  completedModuleIds: string[];
  lastStoppedModuleId: string;
  lastStoppedTab: 'reading' | 'quiz' | 'textbooks';
  lastAccessedAt: string;
  percentComplete: number;
}

export interface LastStoppedPoint {
  courseId: string;
  courseTitle: string;
  courseCode: string;
  moduleId: string;
  moduleTitle: string;
  tab: 'reading' | 'quiz' | 'textbooks';
  timestamp: string;
}

export const CoursesModule: React.FC<CoursesModuleProps> = ({
  onOpenVideo,
  onOpen3D,
  onOpenCPD,
  currentUser = {
    username: "Pharmastar",
    isPro: false,
    fullName: "Pharmastar Member",
    role: "pharmacist",
    registrationDate: "2026-10-26",
    offlineReady: true
  }
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(coursesData[0].id);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(coursesData[0].modules[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'clinical' | 'basic_sciences' | 'pharmaceutics' | 'chemistry' | 'internship'>('all');
  const [activeCourseTab, setActiveCourseTab] = useState<'reading' | 'quiz' | 'textbooks'>('reading');

  // Quiz state: stores selected answers per question id
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  
  // 30-Page Chapter Concept Navigator State
  const [currentChapterPageNum, setCurrentChapterPageNum] = useState<number>(1);

  // Sequential Quiz Question Stepping State (strictly enforce answering question N before N+1)
  const [activeQuizQuestionIndex, setActiveQuizQuestionIndex] = useState<number>(0);

  // Reset chapter page number to 1 on chapter switch
  useEffect(() => {
    setCurrentChapterPageNum(1);
  }, [selectedModuleId]);

  // Reset active quiz question index to 0 on course switch
  useEffect(() => {
    setActiveQuizQuestionIndex(0);
  }, [selectedCourseId]);
  
  // Payment modal state
  const [paymentModalCourse, setPaymentModalCourse] = useState<Course | null>(null);

  // Progress audit modal state
  const [isProgressAuditOpen, setIsProgressAuditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Course Progress from LocalStorage
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgressRecord>>(() => {
    try {
      const saved = localStorage.getItem('pharmastar_courses_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load Global Last Stopped Point from LocalStorage
  const [lastStoppedPoint, setLastStoppedPoint] = useState<LastStoppedPoint | null>(() => {
    try {
      const saved = localStorage.getItem('pharmastar_last_stopped_point');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const activeCourse = coursesData.find(c => c.id === selectedCourseId) || coursesData[0];
  const activeModule = activeCourse.modules.find(m => m.id === selectedModuleId) || activeCourse.modules[0];

  const isFirstCourseFree = activeCourse.priceETB === 0 || activeCourse.id === 'pharmacology';
  const isCourseUnlocked = isFirstCourseFree || currentUser.isPro || 
    (currentUser.unlockedCourseIds && currentUser.unlockedCourseIds.includes(activeCourse.id));

  // Save Progress Helper
  const updateProgressAndStoppedPoint = (
    courseId: string, 
    moduleId: string, 
    tab: 'reading' | 'quiz' | 'textbooks' = activeCourseTab,
    showToastNotification: boolean = false
  ) => {
    const course = coursesData.find(c => c.id === courseId) || activeCourse;
    const moduleItem = course.modules.find(m => m.id === moduleId) || course.modules[0];
    const prevRecord = courseProgress[courseId] || {
      courseId,
      completedModuleIds: [],
      lastStoppedModuleId: moduleId,
      lastStoppedTab: tab,
      lastAccessedAt: new Date().toISOString(),
      percentComplete: 0
    };

    const updatedRecord: CourseProgressRecord = {
      ...prevRecord,
      lastStoppedModuleId: moduleId,
      lastStoppedTab: tab,
      lastAccessedAt: new Date().toISOString(),
      percentComplete: Math.round(((prevRecord.completedModuleIds?.length || 0) / (course.modules.length || 1)) * 100)
    };

    const updatedProgress = {
      ...courseProgress,
      [courseId]: updatedRecord
    };

    const newStoppedPoint: LastStoppedPoint = {
      courseId,
      courseTitle: course.title,
      courseCode: course.code,
      moduleId,
      moduleTitle: moduleItem?.title || 'Overview',
      tab,
      timestamp: new Date().toISOString()
    };

    setCourseProgress(updatedProgress);
    setLastStoppedPoint(newStoppedPoint);

    try {
      localStorage.setItem('pharmastar_courses_progress', JSON.stringify(updatedProgress));
      localStorage.setItem('pharmastar_last_stopped_point', JSON.stringify(newStoppedPoint));
    } catch (e) {
      // ignore
    }

    if (showToastNotification) {
      showToast(`Saved study point: ${course.code} - ${moduleItem?.title.slice(0, 32)}...`);
    }
  };

  // Toggle Module Completed
  const toggleModuleCompleted = (courseId: string, moduleId: string) => {
    const course = coursesData.find(c => c.id === courseId) || activeCourse;
    const prevRecord = courseProgress[courseId] || {
      courseId,
      completedModuleIds: [],
      lastStoppedModuleId: moduleId,
      lastStoppedTab: activeCourseTab,
      lastAccessedAt: new Date().toISOString(),
      percentComplete: 0
    };

    const alreadyCompleted = prevRecord.completedModuleIds?.includes(moduleId);
    const newCompletedIds = alreadyCompleted
      ? prevRecord.completedModuleIds.filter(id => id !== moduleId)
      : [...(prevRecord.completedModuleIds || []), moduleId];

    const newPercent = Math.round((newCompletedIds.length / (course.modules.length || 1)) * 100);

    const updatedRecord: CourseProgressRecord = {
      ...prevRecord,
      completedModuleIds: newCompletedIds,
      lastStoppedModuleId: moduleId,
      lastAccessedAt: new Date().toISOString(),
      percentComplete: newPercent
    };

    const updatedProgress = {
      ...courseProgress,
      [courseId]: updatedRecord
    };

    setCourseProgress(updatedProgress);
    try {
      localStorage.setItem('pharmastar_courses_progress', JSON.stringify(updatedProgress));
    } catch (e) {
      // ignore
    }

    showToast(alreadyCompleted 
      ? `Module unmarked. Progress: ${newPercent}%` 
      : `Module completed! Course progress updated to ${newPercent}%`
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Advance to Next Module
  const handleNextModule = () => {
    const currentIndex = activeCourse.modules.findIndex(m => m.id === selectedModuleId);
    if (currentIndex >= 0 && currentIndex < activeCourse.modules.length - 1) {
      // Auto-mark current module completed if not already
      const currentMod = activeCourse.modules[currentIndex];
      const prevRecord = courseProgress[activeCourse.id];
      if (!prevRecord?.completedModuleIds?.includes(currentMod.id)) {
        toggleModuleCompleted(activeCourse.id, currentMod.id);
      }
      const nextMod = activeCourse.modules[currentIndex + 1];
      setSelectedModuleId(nextMod.id);
      updateProgressAndStoppedPoint(activeCourse.id, nextMod.id, activeCourseTab);
    }
  };

  // Move to Previous Module
  const handlePrevModule = () => {
    const currentIndex = activeCourse.modules.findIndex(m => m.id === selectedModuleId);
    if (currentIndex > 0) {
      const prevMod = activeCourse.modules[currentIndex - 1];
      setSelectedModuleId(prevMod.id);
      updateProgressAndStoppedPoint(activeCourse.id, prevMod.id, activeCourseTab);
    }
  };

  // Resume directly from global last stopped point
  const handleResumeLastStopped = () => {
    if (!lastStoppedPoint) return;
    setSelectedCourseId(lastStoppedPoint.courseId);
    setSelectedModuleId(lastStoppedPoint.moduleId);
    setActiveCourseTab(lastStoppedPoint.tab);
    showToast(`Resumed: ${lastStoppedPoint.courseTitle} - ${lastStoppedPoint.moduleTitle}`);
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pill': return <Pill className="w-4 h-4 text-sky-400" />;
      case 'Stethoscope': return <Stethoscope className="w-4 h-4 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Factory': return <Factory className="w-4 h-4 text-amber-400" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-4 h-4 text-teal-400" />;
      case 'Dna': return <Dna className="w-4 h-4 text-purple-400" />;
      case 'Atom': return <Atom className="w-4 h-4 text-blue-400" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-emerald-300" />;
      case 'Activity': return <Activity className="w-4 h-4 text-rose-400" />;
      default: return <BookOpen className="w-4 h-4 text-teal-400" />;
    }
  };

  const filteredCourses = coursesData.filter(c => {
    const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeProgressRecord = courseProgress[activeCourse.id];
  const isCurrentModuleCompleted = activeProgressRecord?.completedModuleIds?.includes(activeModule?.id || '');
  const activeCourseCompletionPercent = activeProgressRecord?.percentComplete || 0;

  // Total modules completed across all courses
  const totalCompletedModulesCount = Object.values(courseProgress).reduce(
    (sum, record) => sum + (record.completedModuleIds?.length || 0), 0
  );

  // Compulsory Chapter Progression & Exam Ban Logic (EFDA & MoH Standards)
  const activeCourseCompletedCount = activeProgressRecord?.completedModuleIds?.length || 0;
  const areAllChaptersCompleted = activeCourse.modules.length > 0 && 
    activeCourse.modules.every(m => activeProgressRecord?.completedModuleIds?.includes(m.id));

  // Sequential chapter lock: Chapter 1 is unlocked by default; Chapter N requires Chapter N-1 completed
  const isChapterUnlocked = (chapterIndex: number): boolean => {
    if (chapterIndex === 0) return true;
    for (let i = 0; i < chapterIndex; i++) {
      const prevMod = activeCourse.modules[i];
      if (!prevMod || !activeProgressRecord?.completedModuleIds?.includes(prevMod.id)) {
        return false;
      }
    }
    return true;
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
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                12 Comprehensive Pharmacy &amp; Medical Science Modules
              </span>
              <span className="text-xs text-slate-400">100 ETB Per Course • Lifetime Access</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Academic Curriculum, Clinical Pearls &amp; Progress Tracker
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Includes core Basic Sciences, Pharmacology, Therapeutics, and Internship Clerkship with 3D mechanisms, stopping point bookmarking, and automated progress updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Learning Journey & Progress Tracker Modal Button */}
            <button
              onClick={() => setIsProgressAuditOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer"
              title="View your learning progress and stopping points across all courses"
            >
              <BarChart2 className="w-4 h-4 text-teal-400" />
              <span>Learning Progress ({totalCompletedModulesCount} Modules)</span>
            </button>

            <button
              onClick={() => onOpenVideo(activeCourse)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Watch Video</span>
            </button>

            {activeCourse.has3DModel && (
              <button
                onClick={() => onOpen3D(activeCourse.moaModelId)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch 3D MOA</span>
              </button>
            )}

            {onOpenCPD && (
              <button
                onClick={onOpenCPD}
                className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Award className="w-4 h-4 text-purple-400" />
                <span>Take CPD Exam</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          {[
            { id: 'all', name: 'All 12 Courses' },
            { id: 'basic_sciences', name: 'Biochemistry & Physiology' },
            { id: 'clinical', name: 'Clinical & Therapeutics' },
            { id: 'pharmaceutics', name: 'Pharmaceutics & Industrial' },
            { id: 'chemistry', name: 'Medicinal Chemistry' },
            { id: 'internship', name: 'Internship Clerkship' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* CONTINUOUS STUDY: RESUME WHERE YOU STOPPED BANNER */}
      {lastStoppedPoint && (
        <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-indigo-950/60 border border-teal-500/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
              <Bookmark className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  Last Stopped Point
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(lastStoppedPoint.timestamp).toLocaleDateString()} {new Date(lastStoppedPoint.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {lastStoppedPoint.courseCode}: {lastStoppedPoint.courseTitle} ➔ <span className="text-teal-300">{lastStoppedPoint.moduleTitle}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumeLastStopped}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Resume Study from Here</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Course List (4 cols) & Course Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 12 Courses List with Progress Bars */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[780px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 12 courses, code, biochemistry..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredCourses.map(course => {
              const isFreeCourse = course.priceETB === 0 || course.id === 'pharmacology';
              const unlocked = isFreeCourse || currentUser.isPro || 
                (currentUser.unlockedCourseIds && currentUser.unlockedCourseIds.includes(course.id));

              const prog = courseProgress[course.id];
              const completedCount = prog?.completedModuleIds?.length || 0;
              const totalModules = course.modules.length;
              const percent = prog?.percentComplete || 0;
              const isLastStoppedCourse = lastStoppedPoint?.courseId === course.id;

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    const lastMod = prog?.lastStoppedModuleId || course.modules[0]?.id || "";
                    setSelectedModuleId(lastMod);
                    updateProgressAndStoppedPoint(course.id, lastMod, activeCourseTab);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedCourseId === course.id
                      ? 'bg-teal-950/40 border-teal-500/60 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {getCourseIcon(course.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold leading-tight">{course.title}</h4>
                          {isLastStoppedCourse && (
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" title="Last stopped here" />
                          )}
                        </div>
                        <span className="text-[10px] text-teal-400 font-mono">{course.code}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isFreeCourse ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> FREE
                        </span>
                      ) : unlocked ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Enrolled
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          100 ETB
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {course.description}
                  </p>

                  {/* Course Progress Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">
                        Progress: <strong className="text-white">{completedCount}/{totalModules}</strong> modules
                      </span>
                      <span className="font-bold text-teal-400">{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                    <span>{course.duration}</span>
                    <span className="text-teal-400 font-medium">
                      {course.quizQuestions?.length ? `${course.quizQuestions.length} AI Quizzes` : 'Clinical Pearls'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Course Reading Material, AI Tutor & Modules */}
        <div className="lg:col-span-8 space-y-5">
          {activeCourse && (
            <div className="space-y-4">
              {/* Course Title & Enrollment Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        {activeCourse.code}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {activeCourse.level} • {activeCourse.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{activeCourse.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bookmark Current Point Button */}
                    <button
                      onClick={() => updateProgressAndStoppedPoint(activeCourse.id, activeModule?.id || '', activeCourseTab, true)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      title="Save point on which you stopped studying"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bookmark Point</span>
                    </button>

                    {isFirstCourseFree ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Free Access (0 Birr)</span>
                      </span>
                    ) : !isCourseUnlocked ? (
                      <button
                        onClick={() => setPaymentModalCourse(activeCourse)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Enroll Course (100 ETB)</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enrolled / Full Access</span>
                      </span>
                    )}

                    <button
                      onClick={() => onOpenVideo(activeCourse)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>
                  </div>
                </div>

                {/* Course Completion Progress Summary Bar */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Course Progress: {activeProgressRecord?.completedModuleIds?.length || 0} of {activeCourse.modules.length} Modules Completed</span>
                    </span>
                    <span className="font-bold text-teal-400">{activeCourseCompletionPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${activeCourseCompletionPercent}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeCourse.description}
                </p>

                {/* Learning Objectives */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wide block">
                    Core Learning Competencies:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                    {activeCourse.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub-Tabs: Reading Material vs Interactive Practice & Gemini AI */}
                <div className="flex items-center gap-2 border-t border-slate-800 pt-3">
                  <button
                    onClick={() => {
                      setActiveCourseTab('reading');
                      updateProgressAndStoppedPoint(activeCourse.id, selectedModuleId, 'reading');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      activeCourseTab === 'reading'
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Modules &amp; High-Yield Reading</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!areAllChaptersCompleted) {
                        showToast(`EXAM TAKING STRICTLY BANNED: Incomplete prerequisite! Complete all 4 chapters first (${activeCourseCompletedCount}/4 done).`);
                        setActiveCourseTab('quiz'); // Will render the full-screen official Ban Screen
                        return;
                      }
                      setActiveCourseTab('quiz');
                      updateProgressAndStoppedPoint(activeCourse.id, selectedModuleId, 'quiz');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      !areAllChaptersCompleted
                        ? 'bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-950/60'
                        : activeCourseTab === 'quiz'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {!areAllChaptersCompleted ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>Exam Banned (Complete 4 Chapters First)</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/30 text-[10px] font-mono text-rose-200">
                          {activeCourseCompletedCount}/4
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Practice Questions &amp; Gemini AI Tutor</span>
                        {activeCourse.quizQuestions?.length ? (
                          <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">
                            {activeCourse.quizQuestions.length}
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveCourseTab('textbooks');
                      updateProgressAndStoppedPoint(activeCourse.id, selectedModuleId, 'textbooks');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      activeCourseTab === 'textbooks'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5 text-amber-200" />
                    <span>Recognized Textbooks &amp; Readings</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-bold">
                      FIP/EPA
                    </span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: Reading Material & Modules */}
              {activeCourseTab === 'reading' && (
                <div className="space-y-4">
                  {/* 4 Compulsory Chapters Selector with Sequential Lock Enforcement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pb-1 text-xs">
                    {activeCourse.modules.map((mod, modIdx) => {
                      const isCompleted = activeProgressRecord?.completedModuleIds?.includes(mod.id);
                      const isUnlocked = isChapterUnlocked(modIdx);
                      const isSelected = selectedModuleId === mod.id;

                      return (
                        <button
                          key={mod.id}
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (!isUnlocked) {
                              showToast(`Chapter ${modIdx + 1} is locked! Complete Chapter ${modIdx} first.`);
                              return;
                            }
                            setSelectedModuleId(mod.id);
                            updateProgressAndStoppedPoint(activeCourse.id, mod.id, 'reading');
                          }}
                          className={`p-3.5 rounded-xl font-bold transition text-left border flex flex-col justify-between gap-2 ${
                            !isUnlocked
                              ? 'bg-slate-950/70 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-slate-800 border-teal-500 text-teal-300 shadow ring-1 ring-teal-500/40 cursor-pointer'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                              Chapter {modIdx + 1} of 4
                            </span>
                            {isCompleted ? (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
                              </span>
                            ) : isUnlocked ? (
                              <span className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                                In Progress
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold bg-slate-900 px-1.5 py-0.5 rounded">
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold line-clamp-2 leading-snug">{mod.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {!isUnlocked ? `Prerequisite: Complete Chapter ${modIdx}` : `30 In-Depth Concept Pages`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Reading Material & 30-Page Advanced Concept Dossier */}
                  {activeModule && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">{activeModule.title}</h4>
                            {isCurrentModuleCompleted && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Chapter Completed
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-teal-400 mt-0.5">{activeModule.summary}</p>
                        </div>

                        {/* Mark As Completed Toggle Button */}
                        <button
                          onClick={() => toggleModuleCompleted(activeCourse.id, activeModule.id)}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                            isCurrentModuleCompleted
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40'
                              : 'bg-teal-600 hover:bg-teal-500 text-white shadow'
                          }`}
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>{isCurrentModuleCompleted ? 'Completed (Tap to Unmark)' : 'Mark Chapter Completed'}</span>
                        </button>
                      </div>

                      {/* 30-PAGE INTERACTIVE CONCEPT NAVIGATOR */}
                      {activeModule.chapterPages && activeModule.chapterPages.length > 0 ? (
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold text-xs">
                                PAGE {currentChapterPageNum} OF 30
                              </span>
                              <span className="text-xs text-slate-300 font-semibold">
                                {activeModule.chapterPages[currentChapterPageNum - 1]?.category}
                              </span>
                            </div>
                            <span className="text-[11px] text-amber-300 font-medium">
                              Progress: {Math.round((currentChapterPageNum / 30) * 100)}% of 30 Pages
                            </span>
                          </div>

                          {/* Horizontal Page Pills (1 to 30) */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin">
                            {activeModule.chapterPages.map((pg) => {
                              const isCurrentPg = pg.pageNumber === currentChapterPageNum;
                              return (
                                <button
                                  key={pg.pageNumber}
                                  onClick={() => setCurrentChapterPageNum(pg.pageNumber)}
                                  className={`w-7 h-7 shrink-0 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center cursor-pointer border ${
                                    isCurrentPg
                                      ? 'bg-teal-600 text-white border-teal-400 ring-2 ring-teal-400/30'
                                      : pg.pageNumber < currentChapterPageNum
                                      ? 'bg-teal-950/60 text-teal-300 border-teal-600/40'
                                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                  }`}
                                  title={`Page ${pg.pageNumber}: ${pg.title}`}
                                >
                                  {pg.pageNumber}
                                </button>
                              );
                            })}
                          </div>

                          {/* Active Page Body */}
                          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 text-xs text-slate-200 leading-relaxed space-y-3">
                            <h5 className="text-sm font-bold text-teal-300 border-b border-slate-800 pb-1.5">
                              {activeModule.chapterPages[currentChapterPageNum - 1]?.title}
                            </h5>
                            <div className="whitespace-pre-line text-xs font-sans text-slate-300 leading-relaxed">
                              {activeModule.chapterPages[currentChapterPageNum - 1]?.content}
                            </div>
                          </div>

                          {/* Bottom Page Navigation Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                            <button
                              disabled={currentChapterPageNum === 1}
                              onClick={() => setCurrentChapterPageNum(p => Math.max(1, p - 1))}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>Previous Page</span>
                            </button>

                            {currentChapterPageNum < 30 ? (
                              <button
                                onClick={() => setCurrentChapterPageNum(p => Math.min(30, p + 1))}
                                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                              >
                                <span>Next Page ({currentChapterPageNum + 1}/30)</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (!isCurrentModuleCompleted) {
                                    toggleModuleCompleted(activeCourse.id, activeModule.id);
                                  }
                                  showToast(`All 30 pages completed! Chapter unlocked.`);
                                }}
                                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Complete 30 Pages &amp; Mark Chapter Completed</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-2">
                          {activeModule.content}
                        </div>
                      )}

                      {/* High Yield Clinical Pearls Box */}
                      <div className="bg-teal-950/20 border border-teal-500/30 p-4 rounded-xl space-y-2 text-xs">
                        <span className="font-bold text-teal-400 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>High-Yield Clinical Pearls for Exams &amp; Hospital Rounds:</span>
                        </span>
                        <ul className="space-y-1.5">
                          {activeModule.clinicalPearls.map((pearl, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-200 leading-relaxed">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{pearl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Drugs / Concept Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                        <span className="font-semibold text-slate-400 text-[11px]">Key Pharmacophores / Concepts:</span>
                        {activeModule.keyDrugsOrConcepts.map((item, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Module Stepping Navigation */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                        <button
                          onClick={handlePrevModule}
                          disabled={activeCourse.modules.findIndex(m => m.id === selectedModuleId) === 0}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous Module</span>
                        </button>

                        <button
                          onClick={() => updateProgressAndStoppedPoint(activeCourse.id, activeModule.id, 'reading', true)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save Stopping Point</span>
                        </button>

                        <button
                          onClick={handleNextModule}
                          disabled={activeCourse.modules.findIndex(m => m.id === selectedModuleId) >= activeCourse.modules.length - 1}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow"
                        >
                          <span>Complete &amp; Next Module</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: Interactive Examination & Google Gemini AI Assist */}
              {activeCourseTab === 'quiz' && (
                !areAllChaptersCompleted ? (
                  /* EXAM BAN BARRIER: Strictly enforce 4 chapters completion before exam access */
                  <div className="bg-slate-900 border-2 border-rose-500/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400 shadow-lg">
                      <Lock className="w-8 h-8" />
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-block">
                        EXAMINATION BANNED — INCOMPLETE CHAPTERS
                      </span>
                      <h3 className="text-xl font-black text-white">
                        Exam Access Strictly Banned
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        In accordance with <strong>EFDA &amp; MoH Directive No. 49/2022</strong> accredited CPD regulations, sitting for the certification examination is strictly banned until you have completed all 4 mandatory chapters for <strong>{activeCourse.title}</strong>.
                      </p>
                    </div>

                    {/* 4 Chapters Prerequisite Checklist */}
                    <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                        <span>Mandatory Chapters Checklist</span>
                        <span className="text-amber-400 font-mono">{activeCourseCompletedCount} / {activeCourse.modules.length} Completed</span>
                      </div>
                      {activeCourse.modules.map((m, idx) => {
                        const done = activeProgressRecord?.completedModuleIds?.includes(m.id);
                        return (
                          <div key={m.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                            <div className="flex items-center gap-2">
                              {done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                              <span className={done ? "text-slate-200 font-semibold" : "text-slate-400"}>
                                Chapter {idx + 1}: {m.title.slice(0, 36)}...
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              {done ? 'Completed' : 'Locked'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setActiveCourseTab('reading')}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg transition cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Return to Complete Chapter Readings</span>
                    </button>
                  </div>
                ) : (
                  /* SEQUENTIAL EXAM ENGINE: Strictly ban answering question N+1 before question N */
                  (() => {
                    const quizQuestions = activeCourse.quizQuestions || [];
                    if (quizQuestions.length === 0) {
                      return (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
                          <p className="text-sm text-slate-400">
                            No accredited examination questions currently published for {activeCourse.title}.
                          </p>
                        </div>
                      );
                    }

                    const currentQ = quizQuestions[activeQuizQuestionIndex] || quizQuestions[0];
                    const selectedIdx = quizAnswers[currentQ.id] !== undefined ? quizAnswers[currentQ.id] : null;
                    const isAnswered = selectedIdx !== null;
                    const isCorrect = selectedIdx === currentQ.correctIndex;

                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
                        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                              Accredited Examination &bull; Sequential Answering Mode Enforced
                            </span>
                            <h4 className="text-base font-bold text-white mt-0.5">
                              {activeCourse.title} Examination
                            </h4>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                            Question {activeQuizQuestionIndex + 1} of {quizQuestions.length}
                          </span>
                        </div>

                        {/* Sequential Question Navigator Bar (Cannot jump ahead to unanswered questions) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Sequential Examination Progress</span>
                            <span className="font-mono text-teal-400">
                              {Math.round(((activeQuizQuestionIndex + 1) / quizQuestions.length) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${((activeQuizQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                            />
                          </div>

                          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                            {quizQuestions.map((q, qIdx) => {
                              const isCurrent = qIdx === activeQuizQuestionIndex;
                              const isQAnswered = quizAnswers[q.id] !== undefined;
                              // Strictly allow jumping only if current question or all preceding questions are answered
                              const canAccess = qIdx === 0 || quizAnswers[quizQuestions[qIdx - 1]?.id] !== undefined;

                              return (
                                <button
                                  key={q.id}
                                  disabled={!canAccess}
                                  onClick={() => {
                                    if (!canAccess) {
                                      showToast(`Access Restricted: Answer Question ${qIdx} before proceeding to Question ${qIdx + 1}.`);
                                      return;
                                    }
                                    setActiveQuizQuestionIndex(qIdx);
                                  }}
                                  className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center border ${
                                    !canAccess
                                      ? 'bg-slate-950/60 text-slate-600 border-slate-900 cursor-not-allowed'
                                      : isCurrent
                                      ? 'bg-teal-600 text-white border-teal-400 ring-2 ring-teal-400/30 cursor-pointer'
                                      : isQAnswered
                                      ? 'bg-teal-950/70 text-teal-300 border-teal-500/50 cursor-pointer'
                                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white cursor-pointer'
                                  }`}
                                  title={!canAccess ? `Locked: Answer previous question first` : `Question ${qIdx + 1}`}
                                >
                                  {qIdx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Active Question Display */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                          <div className="flex items-start gap-2.5">
                            <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold text-xs shrink-0 mt-0.5">
                              Q{activeQuizQuestionIndex + 1}
                            </span>
                            <h5 className="text-sm font-semibold text-white leading-relaxed">
                              {currentQ.question}
                            </h5>
                          </div>

                          {/* Options List */}
                          <div className="space-y-2 pt-1">
                            {currentQ.options.map((opt, optIndex) => {
                              const isThisSelected = selectedIdx === optIndex;
                              const isThisCorrect = optIndex === currentQ.correctIndex;

                              let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                              if (isAnswered) {
                                if (isThisCorrect) {
                                  btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                                } else if (isThisSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                                } else {
                                  btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500';
                                }
                              }

                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => {
                                    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: optIndex }));
                                    updateProgressAndStoppedPoint(activeCourse.id, selectedModuleId, 'quiz');
                                  }}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-400">
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                  {isAnswered && isThisCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Preceding Question Requirement Warning */}
                          {!isAnswered && (
                            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                              <span>Compulsory: You must select an answer for Question {activeQuizQuestionIndex + 1} before proceeding to the next question.</span>
                            </div>
                          )}

                          {/* Explanation and AI Assistant */}
                          {isAnswered && (
                            <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                                <span className="font-bold text-teal-400 block">Correct Answer Rationale:</span>
                                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                              </div>

                              <GeminiQuestionAssistant 
                                courseTitle={activeCourse.title}
                                question={currentQ}
                                selectedOptionIndex={selectedIdx}
                              />
                            </div>
                          )}

                          {/* Bottom Stepping Controls (Strict Next Prevention) */}
                          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                            <button
                              disabled={activeQuizQuestionIndex === 0}
                              onClick={() => setActiveQuizQuestionIndex(idx => Math.max(0, idx - 1))}
                              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Previous Question</span>
                            </button>

                            {activeQuizQuestionIndex < quizQuestions.length - 1 ? (
                              <button
                                disabled={!isAnswered}
                                onClick={() => {
                                  if (!isAnswered) {
                                    showToast(`Answer Question ${activeQuizQuestionIndex + 1} first!`);
                                    return;
                                  }
                                  setActiveQuizQuestionIndex(idx => idx + 1);
                                }}
                                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                                title={!isAnswered ? "Answer current question before unlocking next question" : "Next Question"}
                              >
                                <span>Next Question ({activeQuizQuestionIndex + 2}/{quizQuestions.length})</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="text-right">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" /> All Questions Completed!
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )
              )}

              {/* VIEW 3: Recognized Textbooks & Readings */}
              {activeCourseTab === 'textbooks' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Curricular Standard References
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      FIP &amp; EPA Recognized Textbooks for {activeCourse.title}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {activeCourse.recognizedTextbooks?.map((book, bIdx) => (
                      <div key={bIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {book.recognizingBody}
                            </span>
                            <h5 className="font-bold text-white text-sm mt-1">{book.title} ({book.edition})</h5>
                            <p className="text-xs text-slate-400">Authors: {book.authors}</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{book.description}</p>

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[11px] font-bold text-teal-400 block">
                            Key Core Curricular Chapters:
                          </span>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {book.keyChapters.map((ch, chIdx) => (
                              <li key={chIdx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                                <span>{ch}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* LEARNING PROGRESS & STOPPING POINTS AUDIT MODAL */}
      {isProgressAuditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    My Course Progress &amp; Stopping Points
                  </h3>
                  <p className="text-xs text-slate-400">
                    Total: {totalCompletedModulesCount} modules completed across all 12 courses
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProgressAuditOpen(false)}
                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coursesData.map(c => {
                  const prog = courseProgress[c.id];
                  const completed = prog?.completedModuleIds?.length || 0;
                  const total = c.modules.length;
                  const pct = prog?.percentComplete || 0;
                  const lastMod = c.modules.find(m => m.id === prog?.lastStoppedModuleId) || c.modules[0];

                  return (
                    <div 
                      key={c.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-teal-400 font-bold">{c.code}</span>
                          <span className="font-bold text-white">{pct}%</span>
                        </div>
                        <h4 className="font-bold text-white text-xs mt-0.5">{c.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Stopped at: <span className="text-teal-300">{lastMod?.title}</span>
                        </p>
                        {prog?.lastAccessedAt && (
                          <p className="text-[10px] text-slate-500">
                            Last accessed: {new Date(prog.lastAccessedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">{completed}/{total} modules</span>
                          <button
                            onClick={() => {
                              setSelectedCourseId(c.id);
                              setSelectedModuleId(lastMod?.id || c.modules[0].id);
                              setIsProgressAuditOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Jump Here ➔
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Progress auto-synced to local storage for offline use.
              </span>
              <button
                onClick={() => setIsProgressAuditOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Payment Modal (100 ETB) */}
      {paymentModalCourse && (
        <CoursePaymentModal
          course={paymentModalCourse}
          isOpen={!!paymentModalCourse}
          onClose={() => setPaymentModalCourse(null)}
          onSuccess={(courseId) => {
            setPaymentModalCourse(null);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
