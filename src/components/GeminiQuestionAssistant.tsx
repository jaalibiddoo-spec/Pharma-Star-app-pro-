import React, { useState } from 'react';
import { CourseQuizQuestion } from '../types';
import { Sparkles, Bot, BrainCircuit, Lightbulb, CheckCircle2, AlertTriangle, RefreshCw, Send, BookOpen } from 'lucide-react';

interface GeminiQuestionAssistantProps {
  courseTitle: string;
  question: CourseQuizQuestion;
  selectedOptionIndex: number | null;
}

export const GeminiQuestionAssistant: React.FC<GeminiQuestionAssistantProps> = ({
  courseTitle,
  question,
  selectedOptionIndex,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [followUpResponses, setFollowUpResponses] = useState<{ query: string; answer: string }[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  const handleAskGemini = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          questionText: question.question,
          options: question.options,
          selectedOption: selectedOptionIndex !== null ? question.options[selectedOptionIndex] : null,
          correctAnswer: question.options[question.correctIndex],
          explanation: question.explanation,
          conceptTopic: question.conceptTopic
        })
      });

      const data = await res.json();
      if (data.success && data.aiExplanation) {
        setAiResponse(data.aiExplanation);
      } else {
        setAiResponse(question.explanation);
      }
    } catch (err) {
      console.error(err);
      setAiResponse(question.explanation);
    } finally {
      setLoading(false);
    }
  };

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim() || isFollowUpLoading) return;

    const currentQuery = followUpQuery.trim();
    setFollowUpQuery("");
    setIsFollowUpLoading(true);

    try {
      const res = await fetch('/api/gemini/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          questionText: `Follow-up question on ${question.conceptTopic}: "${currentQuery}". Original question was: "${question.question}". Correct concept: "${question.options[question.correctIndex]}"`,
          options: question.options,
          selectedOption: null,
          correctAnswer: question.options[question.correctIndex],
          explanation: question.explanation,
          conceptTopic: question.conceptTopic
        })
      });

      const data = await res.json();
      setFollowUpResponses(prev => [
        ...prev,
        {
          query: currentQuery,
          answer: data.aiExplanation || "Clinical explanation confirmed."
        }
      ]);
    } catch (err) {
      setFollowUpResponses(prev => [
        ...prev,
        {
          query: currentQuery,
          answer: "Always relate the pharmacologic target to clinical dosing safety."
        }
      ]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
      {!aiResponse ? (
        <button
          onClick={handleAskGemini}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-sky-500/10 hover:from-teal-500/20 hover:via-purple-500/20 hover:to-sky-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
              <span>Google Gemini AI is synthesizing concept breakdown...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <Bot className="w-4 h-4 text-teal-400" />
              <span>Ask Google Gemini Assist: Understand This Concept in Depth</span>
            </>
          )}
        </button>
      ) : (
        <div className="bg-slate-950/90 border border-teal-500/40 rounded-xl p-4 space-y-3 text-xs shadow-lg animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>Google Gemini 3.8 Flash Concept Tutor</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    AI Active
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Concept: {question.conceptTopic}
                </span>
              </div>
            </div>

            <button
              onClick={handleAskGemini}
              disabled={loading}
              title="Regenerate explanation"
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* AI Structured Explanation Body */}
          <div className="prose prose-invert max-w-none text-slate-200 text-xs leading-relaxed space-y-2 whitespace-pre-line font-sans">
            {aiResponse}
          </div>

          {/* Author Clinical Pearl Highlight */}
          {question.clinicalPearl && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-2.5 flex items-start gap-2 text-amber-200 text-[11px]">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Author Ward Pearl:</strong> {question.clinicalPearl}
              </div>
            </div>
          )}

          {/* Interactive Follow-up Conversation */}
          {followUpResponses.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {followUpResponses.map((item, idx) => (
                <div key={idx} className="space-y-1.5 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-bold text-teal-400 flex items-center gap-1.5">
                    <span>Q:</span>
                    <span>{item.query}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ask Follow-up Input */}
          <form onSubmit={handleAskFollowUp} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={followUpQuery}
              onChange={(e) => setFollowUpQuery(e.target.value)}
              placeholder="Ask Gemini follow-up (e.g., 'What if the patient has CKD stage 4?')..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={isFollowUpLoading || !followUpQuery.trim()}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
            >
              {isFollowUpLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
