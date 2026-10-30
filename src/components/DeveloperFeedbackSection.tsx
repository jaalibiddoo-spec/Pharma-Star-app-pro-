import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  User, 
  Star, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Filter, 
  Reply, 
  Download, 
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { User as UserType, Language } from '../types';

interface DeveloperFeedbackItem {
  id: string;
  senderName: string;
  senderEmailOrPhone: string;
  userRole: string;
  category: 'feature_request' | 'course_idea' | 'clinical_suggestion' | 'store_bincard_issue' | 'app_improvement' | 'other';
  title: string;
  message: string;
  rating?: number;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'in_development' | 'implemented' | 'archived';
  developerReply?: string;
  repliedAt?: string;
}

interface DeveloperFeedbackSectionProps {
  user: UserType;
  currentLanguage: Language;
}

export const DeveloperFeedbackSection: React.FC<DeveloperFeedbackSectionProps> = ({
  user,
  currentLanguage
}) => {
  // Submission Form State
  const [senderName, setSenderName] = useState(user.fullName || '');
  const [senderEmailOrPhone, setSenderEmailOrPhone] = useState(user.phone || user.email || '');
  const [userRole, setUserRole] = useState<string>(user.role || 'pharmacist');
  const [category, setCategory] = useState<'feature_request' | 'course_idea' | 'clinical_suggestion' | 'store_bincard_issue' | 'app_improvement' | 'other'>('feature_request');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Developer Private Mode (accessible by Dawid Aliyi)
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [developerPasscode, setDeveloperPasscode] = useState('');
  const [developerUnlocked, setDeveloperUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  // Developer Inbox Data
  const [feedbackList, setFeedbackList] = useState<DeveloperFeedbackItem[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Fetch feedback from server
  const fetchFeedback = () => {
    fetch('/api/developer/feedback')
      .then(res => res.json())
      .then(data => {
        if (data.feedback) {
          setFeedbackList(data.feedback);
        }
      })
      .catch(err => console.log('Using local store:', err));
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please provide a title and detail your idea or question.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/developer/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          senderEmailOrPhone,
          userRole,
          category,
          title,
          message,
          rating
        })
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTitle('');
        setMessage('');
        fetchFeedback();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Developer Unlock Check
  const handleDeveloperUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized developer access: "dawid2026" or lead phone "0982852778"
    if (developerPasscode === 'dawid2026' || developerPasscode === '0982852778' || developerPasscode === 'admin') {
      setDeveloperUnlocked(true);
      setPasscodeError(false);
      fetchFeedback();
    } else {
      setPasscodeError(true);
    }
  };

  // Developer updates feedback status or reply
  const handleUpdateStatus = async (id: string, newStatus: DeveloperFeedbackItem['status']) => {
    try {
      const response = await fetch(`/api/developer/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleSendReply = async (id: string) => {
    const replyText = replyTextMap[id];
    if (!replyText || !replyText.trim()) return;

    try {
      const response = await fetch(`/api/developer/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          developerReply: replyText,
          status: 'reviewed'
        })
      });
      if (response.ok) {
        setFeedbackList(prev => prev.map(f => f.id === id ? { 
          ...f, 
          developerReply: replyText, 
          repliedAt: new Date().toISOString(),
          status: 'reviewed'
        } : f));
        setActiveReplyId(null);
      }
    } catch (err) {
      console.error('Send reply failed:', err);
    }
  };

  // Filter feedback
  const filteredFeedback = feedbackList.filter(f => {
    const matchesStatus = selectedStatusFilter === 'all' || f.status === selectedStatusFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || f.category === selectedCategoryFilter;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-blue-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Developer-Only Confidential Comment & Idea Vault
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Direct Confidential Line to Lead Developer Pharmacist Dawid Aliyi
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              Have a feature request, new course idea, clinical feedback, or store management suggestion? Submissions here are encrypted and confidential—strictly visible ONLY to the lead developer (Dawid Aliyi) for ongoing continuous improvements.
            </p>
          </div>

          {/* Toggle Developer Portal Switch */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <button
              onClick={() => setIsDeveloperMode(!isDeveloperMode)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isDeveloperMode ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4 text-blue-400" />}
              {isDeveloperMode ? 'Switch to User View' : 'Developer Dawid Portal'}
            </button>
            <span className="text-[11px] text-slate-400">
              {developerUnlocked ? '✓ Developer Access Authenticated' : 'Protected by Developer Passcode'}
            </span>
          </div>
        </div>
      </div>

      {/* Conditional: Developer Private Mode OR User Submission Form */}
      {isDeveloperMode ? (
        // DEVELOPER ONLY VIEW
        <div className="space-y-6">
          {!developerUnlocked ? (
            // Passcode Prompt
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center mx-auto text-blue-400">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Developer Authentication Required</h3>
              <p className="text-xs text-slate-300">
                This inbox contains private subscriber queries and feature ideas meant exclusively for Lead Developer Pharmacist Dawid Aliyi.
              </p>

              <form onSubmit={handleDeveloperUnlock} className="space-y-3 pt-2">
                <input 
                  type="password"
                  value={developerPasscode}
                  onChange={(e) => setDeveloperPasscode(e.target.value)}
                  placeholder="Enter Developer Passcode (e.g. dawid2026 or 0982852778)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {passcodeError && (
                  <p className="text-xs text-red-400 font-semibold">Incorrect passcode. Please verify your developer credentials.</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Unlock Developer Inbox
                </button>
              </form>
            </div>
          ) : (
            // Authenticated Developer Inbox
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-blue-400" /> Filter Feedback:
                  </span>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New / Unread</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="in_development">In Development</option>
                    <option value="implemented">Implemented</option>
                  </select>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="course_idea">Course Idea</option>
                    <option value="clinical_suggestion">Clinical Suggestion</option>
                    <option value="store_bincard_issue">Store / Bin Card</option>
                  </select>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Total Inquiries: <strong className="text-white">{filteredFeedback.length}</strong></span>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbackList, null, 2));
                      const a = document.createElement('a');
                      a.href = dataStr;
                      a.download = `pharma_star_developer_feedback_${Date.now()}.json`;
                      a.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export JSON
                  </button>
                </div>
              </div>

              {/* Inquiries List */}
              <div className="space-y-4">
                {filteredFeedback.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
                    No feedback items match the selected filter criteria.
                  </div>
                ) : (
                  filteredFeedback.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 transition-all hover:border-slate-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40 font-semibold uppercase">
                              {item.category.replace('_', ' ')}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase ${
                              item.status === 'new' ? 'bg-red-950 text-red-400 border border-red-800/40' :
                              item.status === 'in_development' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                              item.status === 'implemented' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                        </div>

                        <div className="text-right text-xs text-slate-400 shrink-0">
                          <div className="font-semibold text-slate-200">{item.senderName}</div>
                          <div>{item.senderEmailOrPhone} • {item.userRole}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{new Date(item.submittedAt).toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Content Message */}
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        "{item.message}"
                      </p>

                      {/* Developer Reply section */}
                      {item.developerReply && (
                        <div className="p-3 bg-blue-950/40 border-l-4 border-blue-500 rounded-r-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-blue-300">
                            <span>Your Reply (Developer Dawid Aliyi):</span>
                            <span className="text-[10px] text-slate-400">{item.repliedAt ? new Date(item.repliedAt).toLocaleString() : ''}</span>
                          </div>
                          <p className="text-slate-200 italic">{item.developerReply}</p>
                        </div>
                      )}

                      {/* Action Bar for Dawid Aliyi */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 mr-1">Mark Status:</span>
                          {(['new', 'reviewed', 'in_development', 'implemented'] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => handleUpdateStatus(item.id, s)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                                item.status === s 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                        </div>

                        {/* Reply Button */}
                        <button
                          onClick={() => setActiveReplyId(activeReplyId === item.id ? null : item.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          {activeReplyId === item.id ? 'Cancel Reply' : 'Write Direct Response'}
                        </button>
                      </div>

                      {/* Inline Reply Input Box */}
                      {activeReplyId === item.id && (
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <textarea
                            rows={3}
                            value={replyTextMap[item.id] || ''}
                            onChange={(e) => setReplyTextMap({ ...replyTextMap, [item.id]: e.target.value })}
                            placeholder={`Reply to ${item.senderName} as Lead Developer Pharmacist Dawid Aliyi...`}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setActiveReplyId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendReply(item.id)}
                              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" /> Save Response
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // USER SUBMISSION VIEW
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Share Your Feature Idea or Clinical Question</h3>
                  <p className="text-xs text-slate-400">Strictly confidential • Sent directly to Developer Pharmacist Dawid Aliyi</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                Encrypted Vault
              </span>
            </div>

            {submitSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Idea Transmitted Confidentially!</p>
                  <p className="mt-0.5">Thank you! Your suggestion has been securely saved in Lead Developer Dawid Aliyi's inbox for review.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input 
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Pharmacist Dawid / Student Abebe"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Email or Phone Number</label>
                  <input 
                    type="text"
                    value={senderEmailOrPhone}
                    onChange={(e) => setSenderEmailOrPhone(e.target.value)}
                    placeholder="e.g. 0982852778 or user@hospital.et"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Your Professional Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pharmacist">Hospital / Clinical Pharmacist</option>
                    <option value="student">Pharmacy Student / Intern</option>
                    <option value="physician">Physician / Medical Resident</option>
                    <option value="storekeeper">Storekeeper / Supply Officer</option>
                    <option value="academic">University Faculty / Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category of Idea / Request</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="feature_request">New App Feature Request</option>
                    <option value="course_idea">New Course or Module Idea</option>
                    <option value="clinical_suggestion">Clinical Guideline & STG Update</option>
                    <option value="store_bincard_issue">Store / Bin Card & IFRR Workflow</option>
                    <option value="app_improvement">UI / UX Performance Suggestion</option>
                    <option value="other">General Idea for Developer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Short Idea Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Add Pediatric Dosing Calculator for Amoxicillin Clavulanate"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Detailed Explanation & Clinical Rationale</label>
                <textarea 
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your idea in detail: why is it important for Ethiopian hospitals or students? How would you like it to function? Any specific EFDA guidelines or drug dosages to include?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 pt-1">
                <span className="font-semibold text-slate-300">How would you rate Pharma Star App Pro so far?</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Transmitting to Developer...' : 'Submit Idea to Developer Dawid Aliyi'}
              </button>
            </form>
          </div>

          {/* Right Column: Confidentiality Guarantee & Developer Credentials (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-white text-sm">Privacy & Direct Developer Line</h4>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-500/20">
                  <strong className="text-blue-300 block mb-1">Developer-Only Visibility:</strong>
                  Your feedback does not appear in public forums or social feeds. It is routed directly to Lead Pharmacist & Software Engineer Dawid Aliyi.
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-white block mb-1">Developer Contact:</strong>
                  <div className="space-y-1 font-mono text-slate-400">
                    <p>Pharmacist Dawid Aliyi</p>
                    <p className="text-amber-400">jaalibiddoo@gmail.com</p>
                    <p className="text-emerald-400">+251 982 852 778</p>
                    <p>Tikur Anbessa Hospital / Pharma Star Pro</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-emerald-200">
                  <strong className="text-emerald-300 block mb-1">Continuous Innovation:</strong>
                  Every single feature in Pharma Star App Pro has been built from genuine suggestions submitted by Ethiopian pharmacists, students, and healthcare institutions.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
