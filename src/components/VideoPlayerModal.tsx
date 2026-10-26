import React, { useState, useEffect, useRef } from 'react';
import { Course } from '../types';
import { Play, Pause, Volume2, VolumeX, Maximize2, SkipForward, SkipBack, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface VideoPlayerModalProps {
  course: Course;
  onClose: () => void;
  onLaunch3D?: (modelId?: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  course,
  onClose,
  onLaunch3D
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(15);
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes' | 'pearls'>('chapters');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulated dynamic visual lecture animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03 * playbackSpeed;
      if (!isPlaying) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animated wave representation of receptor binding or signal cascade
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height / 2 + Math.sin((x * 0.015) + t) * 45 + Math.cos((x * 0.03) - t * 0.8) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Pulsing molecular binding node
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 35 + Math.sin(t * 2) * 8;

      ctx.fillStyle = 'rgba(20, 184, 166, 0.25)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Molecular text label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(course.title, centerX, centerY + 5);

      // Ligand particle flow
      for (let i = 0; i < 6; i++) {
        const angle = t * 1.5 + (i * Math.PI / 3);
        const dist = 90 + Math.sin(t * 3 + i) * 20;
        const lx = centerX + Math.cos(angle) * dist;
        const ly = centerY + Math.sin(angle) * dist;

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(lx, ly, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed, course.title]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-bold text-xs border border-teal-500/30">
              {course.code}
            </span>
            <h3 className="text-sm md:text-base font-bold text-white">
              {course.title}: Directed Masterclass Video & Visualization
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Video Canvas & Controls */}
        <div className="relative bg-black aspect-video max-h-[420px] w-full flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={860}
            height={420}
            className="w-full h-full object-cover"
          />

          {/* Floating Course Badge */}
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300">
            High-Definition Animation • Course Directed
          </div>

          {/* 3D MOA Overlay Callout Button */}
          {course.has3DModel && onLaunch3D && (
            <button
              onClick={() => {
                onClose();
                onLaunch3D(course.moaModelId);
              }}
              className="absolute top-4 right-4 bg-teal-600/90 hover:bg-teal-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-teal-400/40 cursor-pointer transition transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Interactive 3D Model</span>
            </button>
          )}

          {/* Bottom Player Overlay Bar */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col gap-2">
            {/* Scrubber Bar */}
            <div 
              className="w-full h-1.5 bg-slate-700/80 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setProgress(Math.round(pos));
              }}
            >
              <div 
                className="h-full bg-teal-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-teal-600 hover:bg-teal-500 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:text-teal-400 transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-slate-300 font-mono text-[11px]">
                  {Math.floor((progress / 100) * 45)}:12 / 45:00
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed buttons */}
                {[0.75, 1, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                      playbackSpeed === spd ? 'bg-teal-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs: Chapters, Clinical Notes, High-Yield Pearls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex-1 overflow-y-auto">
          <div className="flex border-b border-slate-800 gap-4 mb-3">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'chapters'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Lecture Chapters
            </button>
            <button
              onClick={() => setActiveTab('pearls')}
              className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'pearls'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              High-Yield Clinical Pearls
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Course Summary & Guide
            </button>
          </div>

          {activeTab === 'chapters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.modules.map((mod, i) => (
                <div
                  key={mod.id}
                  onClick={() => setProgress(25 * (i + 1))}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{mod.title}</h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{mod.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pearls' && (
            <div className="space-y-2">
              {course.modules.flatMap(m => m.clinicalPearls).map((pearl, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">{pearl}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="text-xs text-slate-300 space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
              <p className="font-semibold text-teal-400">Course Overview:</p>
              <p>{course.description}</p>
              <p className="font-semibold text-teal-400 mt-2">Core Learning Objectives:</p>
              <ul className="list-disc pl-5 space-y-1">
                {course.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
