import React, { useState } from 'react';
import { coursesData } from '../data/coursesData';
import { Course, CourseModule } from '../types';
import { 
  BookOpen, Video, Sparkles, CheckCircle2, ChevronRight, 
  Layers, Search, Award, Pill, Stethoscope, Factory, 
  ShieldAlert, ClipboardCheck, Dna, Atom, GraduationCap 
} from 'lucide-react';

interface CoursesModuleProps {
  onOpenVideo: (course: Course) => void;
  onOpen3D: (modelId?: string) => void;
}

export const CoursesModule: React.FC<CoursesModuleProps> = ({
  onOpenVideo,
  onOpen3D
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(coursesData[0].id);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(coursesData[0].modules[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'clinical' | 'pharmaceutics' | 'chemistry' | 'internship'>('all');

  const activeCourse = coursesData.find(c => c.id === selectedCourseId) || coursesData[0];
  const activeModule = activeCourse.modules.find(m => m.id === selectedModuleId) || activeCourse.modules[0];

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
      default: return <BookOpen className="w-4 h-4 text-teal-400" />;
    }
  };

  const filteredCourses = coursesData.filter(c => {
    const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                Academic & Professional Pharmacy Curriculum
              </span>
              <span className="text-xs text-slate-400">10 Comprehensive Modules with 3D & Video</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Interactive Pharmacy Courses Portal</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Study verified reading materials, high-yield clinical pearls, industrial processes, and launch synchronized 3D mechanism visualizers.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          {[
            { id: 'all', name: 'All 10 Courses' },
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
        {/* Left: 10 Courses List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[700px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title or code..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredCourses.map(course => (
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

                  {course.has3DModel && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                      3D MOA
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {course.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>{course.duration}</span>
                  <span className="text-slate-400">{course.modules.length} modules</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Course Reading Material & Modules */}
        <div className="lg:col-span-8 space-y-5">
          {activeCourse && (
            <div className="space-y-4">
              {/* Course Title & Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
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
                    <button
                      onClick={() => onOpenVideo(activeCourse)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video ({activeCourse.videoDuration})</span>
                    </button>

                    {activeCourse.has3DModel && (
                      <button
                        onClick={() => onOpen3D(activeCourse.moaModelId)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>3D Simulation</span>
                      </button>
                    )}
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
              </div>

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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
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
        </div>
      </div>
    </div>
  );
};
