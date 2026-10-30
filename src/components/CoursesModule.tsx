import React, { useState } from 'react';
import { coursesData } from '../data/coursesData';
import { Course, CourseModule, User } from '../types';
import { 
  BookOpen, Video, Sparkles, CheckCircle2, ChevronRight, 
  Layers, Search, Award, Pill, Stethoscope, Factory, 
  ShieldAlert, ClipboardCheck, Dna, Atom, GraduationCap,
  Activity, HelpCircle, Lock, ShieldCheck, Check, ArrowRight,
  BookMarked, ExternalLink
} from 'lucide-react';
import { CoursePaymentModal } from './CoursePaymentModal';
import { GeminiQuestionAssistant } from './GeminiQuestionAssistant';

interface CoursesModuleProps {
  onOpenVideo: (course: Course) => void;
  onOpen3D: (modelId?: string) => void;
  onOpenCPD?: () => void;
  currentUser?: User;
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
  
  // Payment modal state
  const [paymentModalCourse, setPaymentModalCourse] = useState<Course | null>(null);

  const activeCourse = coursesData.find(c => c.id === selectedCourseId) || coursesData[0];
  const activeModule = activeCourse.modules.find(m => m.id === selectedModuleId) || activeCourse.modules[0];

  const isFirstCourseFree = activeCourse.priceETB === 0 || activeCourse.id === 'pharmacology';
  const isCourseUnlocked = isFirstCourseFree || currentUser.isPro || 
    (currentUser.unlockedCourseIds && currentUser.unlockedCourseIds.includes(activeCourse.id));

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                12 Comprehensive Pharmacy & Medical Science Modules
              </span>
              <span className="text-xs text-slate-400">100 ETB Per Course • Lifetime Access</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Academic Curriculum, Clinical Pearls & Google Gemini AI Assist
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Includes core Basic Sciences (Biochemistry, Physiology), Pharmacology, Therapeutics, Toxicology, and Internship Clerkship with 3D WebGL mechanisms and built-in Gemini concept breakdowns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenVideo(activeCourse)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Watch Video Lecture</span>
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

      {/* Main Grid: Course List (4 cols) & Course Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 12 Courses List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[750px]">
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

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredCourses.map(course => {
              const isFreeCourse = course.priceETB === 0 || course.id === 'pharmacology';
              const unlocked = isFreeCourse || currentUser.isPro || 
                (currentUser.unlockedCourseIds && currentUser.unlockedCourseIds.includes(course.id));

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    if (course.modules[0]) setSelectedModuleId(course.modules[0].id);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedCourseId === course.id
                      ? 'bg-teal-950/40 border-teal-500/60 text-white'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {getCourseIcon(course.icon)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{course.title}</h4>
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
                    {isFirstCourseFree ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Free For Everyone (0 Birr)</span>
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
                    onClick={() => setActiveCourseTab('reading')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      activeCourseTab === 'reading'
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Modules & High-Yield Reading</span>
                  </button>

                  <button
                    onClick={() => setActiveCourseTab('quiz')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      activeCourseTab === 'quiz'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Practice Questions & Google Gemini AI Tutor</span>
                    {activeCourse.quizQuestions?.length ? (
                      <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">
                        {activeCourse.quizQuestions.length}
                      </span>
                    ) : null}
                  </button>

                  <button
                    onClick={() => setActiveCourseTab('textbooks')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      activeCourseTab === 'textbooks'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5 text-amber-200" />
                    <span>Recognized Textbooks & Readings</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-bold">
                      FIP/EPA
                    </span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: Reading Material & Modules */}
              {activeCourseTab === 'reading' && (
                <div className="space-y-4">
                  {/* Module Selector Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {activeCourse.modules.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-left border ${
                          selectedModuleId === mod.id
                            ? 'bg-slate-800 border-teal-500 text-teal-300 shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mod.title}
                      </button>
                    ))}
                  </div>

                  {/* Detailed Reading Material & High-Yield Pearls */}
                  {activeModule && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                      <div>
                        <h4 className="text-base font-bold text-white">{activeModule.title}</h4>
                        <p className="text-xs text-teal-400 mt-0.5">{activeModule.summary}</p>
                      </div>

                      {/* Reading Material Body */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-2">
                        {activeModule.content}
                      </div>

                      {/* High Yield Clinical Pearls Box */}
                      <div className="bg-teal-950/20 border border-teal-500/30 p-4 rounded-xl space-y-2 text-xs">
                        <span className="font-bold text-teal-400 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>High-Yield Clinical Pearls for Exams & Hospital Rounds:</span>
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
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: Interactive Questions & Google Gemini AI Assist */}
              {activeCourseTab === 'quiz' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      Formative Assessment & AI Tutoring
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      Practice Questions for {activeCourse.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Select your answer to test your recall, then click <strong>"Ask Google Gemini Assist"</strong> to receive an in-depth mechanistic breakdown, distractor analysis, Ethiopian hospital clinical correlates, and high-yield memory mnemonics!
                    </p>
                  </div>

                  {activeCourse.quizQuestions && activeCourse.quizQuestions.length > 0 ? (
                    <div className="space-y-6">
                      {activeCourse.quizQuestions.map((q, qIndex) => {
                        const selectedIdx = quizAnswers[q.id] !== undefined ? quizAnswers[q.id] : null;
                        const isAnswered = selectedIdx !== null;
                        const isCorrect = selectedIdx === q.correctIndex;

                        return (
                          <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-xs">
                                  Q{qIndex + 1}
                                </span>
                                <h5 className="text-xs md:text-sm font-semibold text-white leading-snug">
                                  {q.question}
                                </h5>
                              </div>
                            </div>

                            {/* Option Radio / Button List */}
                            <div className="space-y-1.5 pt-1">
                              {q.options.map((opt, optIndex) => {
                                const isThisSelected = selectedIdx === optIndex;
                                const isThisCorrect = optIndex === q.correctIndex;

                                let buttonStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
                                if (isAnswered) {
                                  if (isThisCorrect) {
                                    buttonStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200";
                                  } else if (isThisSelected && !isThisCorrect) {
                                    buttonStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                                  }
                                }

                                return (
                                  <button
                                    key={optIndex}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${buttonStyle}`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <span>{opt}</span>
                                    </span>

                                    {isAnswered && isThisCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Immediate Feedback Note */}
                            {isAnswered && (
                              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                                isCorrect
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                              }`}>
                                <div className="font-bold flex items-center gap-1.5 mb-1">
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      <span>Correct Answer!</span>
                                    </>
                                  ) : (
                                    <>
                                      <HelpCircle className="w-4 h-4 text-rose-400" />
                                      <span>Review Needed: Correct choice is {String.fromCharCode(65 + q.correctIndex)}</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-300">{q.explanation}</p>
                              </div>
                            )}

                            {/* Google Gemini AI Tutor Assistant */}
                            <GeminiQuestionAssistant
                              courseTitle={activeCourse.title}
                              question={q}
                              selectedOptionIndex={selectedIdx}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No quiz questions found for this course. Check the Reading Modules tab!
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 3: Recognized Textbooks & Scientific Readings */}
              {activeCourseTab === 'textbooks' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-900 to-amber-950/30 p-4 rounded-xl border border-amber-500/30">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Curriculum Standard & Society Recognition
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      National & International Accredited Textbooks for {activeCourse.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      All reading materials are curated and recognized by the <strong>International Pharmaceutical Federation (FIP)</strong>, <strong>American Society of Health-System Pharmacists (ASHP)</strong>, <strong>American College of Clinical Pharmacy (ACCP)</strong>, and the <strong>Ethiopian Pharmaceutical Association (EPA)</strong>.
                    </p>
                  </div>

                  {/* Textbooks Cards */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <BookMarked className="w-4 h-4" /> Recommended Standard Textbooks
                    </h5>

                    {(activeCourse.recognizedTextbooks && activeCourse.recognizedTextbooks.length > 0
                      ? activeCourse.recognizedTextbooks
                      : [
                          {
                            title: "Goodman & Gilman's: The Pharmacological Basis of Therapeutics",
                            authors: "Brunton LL, Knollmann BC",
                            edition: "14th Edition",
                            recognizingBody: "FIP (International Pharmaceutical Federation)" as const,
                            description: "Primary international gold standard textbook referenced across medical and pharmacy university faculties worldwide.",
                            keyChapters: ["General Principles of Pharmacology", "Pharmacokinetics & Drug Elimination", "Organ System Therapeutics"]
                          },
                          {
                            title: "Basic & Clinical Pharmacology",
                            authors: "Katzung BG, Vanderah TW",
                            edition: "16th Edition",
                            recognizingBody: "Ethiopian Pharmaceutical Association (EPA)" as const,
                            description: "Approved core syllabus textbook across Ethiopian university health science colleges and hospital residency programs.",
                            keyChapters: ["Receptors & Pharmacodynamics", "Autonomic Nervous System", "Chemotherapy & Antimicrobials"]
                          }
                        ]
                    ).map((book, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              Recognized by: {book.recognizingBody}
                            </span>
                            <h6 className="text-sm font-bold text-white mt-1">{book.title}</h6>
                            <p className="text-xs text-slate-400">
                              By {book.authors} • <span className="text-slate-300">{book.edition}</span>
                              {book.isbn ? ` • ISBN: ${book.isbn}` : ''}
                            </p>
                          </div>

                          {book.downloadOrReadLink && (
                            <a
                              href={book.downloadOrReadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center gap-1 self-start transition cursor-pointer"
                            >
                              <span>Publisher Ref</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {book.description}
                        </p>

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                            Key Core Curriculum Chapters:
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

                  {/* Further Reading Materials */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Regulatory Guidelines & Further Scientific Readings
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(activeCourse.furtherReadingMaterials && activeCourse.furtherReadingMaterials.length > 0
                        ? activeCourse.furtherReadingMaterials
                        : [
                            {
                              title: "Ethiopian Standard Treatment Guidelines (STG 2026)",
                              source: "Ethiopian Ministry of Health (MoH) & EFDA",
                              year: "2024 - 2026",
                              type: "Practice Standard" as const,
                              summary: "Mandatory therapeutic protocols and essential medicines classification for Ethiopian hospitals."
                            },
                            {
                              title: "WHO Model List of Essential Medicines",
                              source: "World Health Organization",
                              year: "2024",
                              type: "Guideline" as const,
                              summary: "International evidence-based priority medicines baseline for universal health coverage."
                            }
                          ]
                      ).map((mat, mIdx) => (
                        <div key={mIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                              {mat.type}
                            </span>
                            <span className="text-[10px] text-slate-400">{mat.year}</span>
                          </div>
                          <h6 className="font-bold text-white text-xs">{mat.title}</h6>
                          <p className="text-[11px] text-slate-400">{mat.source}</p>
                          <p className="text-xs text-slate-300 pt-1 leading-snug">{mat.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
