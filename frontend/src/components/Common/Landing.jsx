import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Timer, Shield, Zap, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Activity, Bell, BarChart3, Clock, Users, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const features = [
  {
    title: "Signal-rich intake",
    desc: "Collect task context, priority, and deadlines with smart validation.",
    icon: <Timer size={28} />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    border: "border-indigo-200 dark:border-indigo-900",
    accent: "from-indigo-500 to-indigo-600",
    dot: "bg-indigo-500",
    step: "01",
  },
  {
    title: "AI-crafted nudges",
    desc: "Generate human-sounding chasers tuned to urgency and status.",
    icon: <Zap size={28} />,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-900",
    accent: "from-violet-500 to-violet-600",
    dot: "bg-violet-500",
    step: "02",
  },
  {
    title: "Trusted escalation",
    desc: "Schedule multi-channel reminders with audit-ready logging.",
    icon: <Shield size={28} />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900",
    accent: "from-emerald-500 to-emerald-600",
    dot: "bg-emerald-500",
    step: "03",
  },
];

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [direction, setDirection] = useState("next"); // "next" or "prev"
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx, dir) => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setActiveFeature(idx);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((activeFeature + 1) % features.length, "next");
  }, [activeFeature, goTo]);

  const prev = useCallback(() => {
    goTo((activeFeature - 1 + features.length) % features.length, "prev");
  }, [activeFeature, goTo]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Reset timer on manual navigation
  const handleNav = (idx, dir) => {
    clearInterval(timerRef.current);
    goTo(idx, dir);
    timerRef.current = setInterval(next, 4000);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50/90 via-white/70 to-transparent dark:from-slate-900/80 dark:via-slate-950/60 dark:to-transparent" />
      {/* Grid background */}
      <div className="absolute inset-0 z-[1] bg-grid" />
      <div className="absolute top-10 right-16 w-80 h-80 bg-indigo-100 dark:bg-indigo-950/50 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-48 -left-10 w-64 h-64 bg-violet-100 dark:bg-violet-950/40 rounded-full blur-3xl opacity-30" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white grid place-items-center font-bold text-sm shadow-lg shadow-indigo-500/25">IC</div>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Chaser Control</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
            Log in
          </Link>
          <Link to="/login" className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
            Get Started
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-28 lg:px-16 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="grid items-center gap-16 pt-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7 animate-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Sparkles size={13} />
              AI-powered deadline management
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.08] text-slate-900 dark:text-white sm:text-5xl lg:text-[3.6rem] tracking-[-0.04em]">
              Keep every task on<br className="hidden sm:block" /> track with{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI that sounds human</span>.
            </h2>

            <p className="max-w-lg text-[1.05rem] leading-[1.75] text-slate-500 dark:text-slate-400">
              Intelligent Chaser Agent blends signal-based scheduling, personalized prompts, and
              status-aware messaging so your team never misses a deadline.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link to="/login" className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[0.95rem] font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                Launch Dashboard
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#flow" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                See how it works
                <ChevronDown size={14} />
              </a>
            </div>

            <div className="flex flex-wrap gap-6 text-[0.85rem] text-slate-500 dark:text-slate-400 pt-3 font-medium">
              <span className="inline-flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500" /> Smart follow-ups
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500" /> AI-crafted nudges
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500" /> Multi-channel
              </span>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative animate-slide-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 font-semibold">Live pulse</p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Reminder Studio</h3>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                  AI Ready
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Priya R. — Overdue", sub: "Next nudge in 2h 15m", dot: "bg-red-500", dotRing: "ring-red-100", icon: <Clock size={14} className="text-red-400" /> },
                  { label: "AI drafting message…", sub: "Tone: firm / helpful", dot: "bg-amber-400", dotRing: "ring-amber-100", icon: <MessageSquare size={14} className="text-amber-400" />, typing: true },
                  { label: "Response rate ↑ 18%", sub: "Trending up this week", dot: "bg-emerald-500", dotRing: "ring-emerald-100", icon: <BarChart3 size={14} className="text-emerald-400" /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 p-4 hover:border-slate-200 dark:hover:border-slate-600 transition-all group">
                    <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${item.dot} ring-4 ${item.dotRing} dark:ring-slate-800`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                        {item.typing && (
                          <span className="flex gap-0.5 items-center">
                            <span className="typing-dot w-1 h-1 rounded-full bg-amber-400"></span>
                            <span className="typing-dot w-1 h-1 rounded-full bg-amber-400" style={{animationDelay: '0.15s'}}></span>
                            <span className="typing-dot w-1 h-1 rounded-full bg-amber-400" style={{animationDelay: '0.3s'}}></span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">{item.icon}</span>
                  </div>
                ))}
              </div>
              {/* Mini progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Daily follow-up progress</span>
                  <span className="text-indigo-500">73%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[73%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full hero-progress-fill" />
                </div>
              </div>
            </div>
            {/* Shadow decoration */}
            <div className="absolute -z-10 inset-x-4 -bottom-3 h-8 rounded-2xl bg-indigo-100/50 dark:bg-indigo-950/20 blur-md" />
          </div>
        </section>

        {/* Trusted by ticker */}
        <section className="mt-24">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 font-semibold mb-5">Built with</p>
          <div className="ticker-wrapper overflow-hidden relative">
            <div className="ticker-track flex items-center gap-10">
              {["React", "Node.js", "MongoDB", "Gemini AI", "Tailwind CSS", "Express", "Recharts", "Google OAuth", "React", "Node.js", "MongoDB", "Gemini AI", "Tailwind CSS", "Express", "Recharts", "Google OAuth"].map((tech, i) => (
                <span key={i} className="text-sm font-semibold text-slate-300 dark:text-slate-600 whitespace-nowrap select-none">{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features — Carousel */}
        <section id="flow" className="mt-24">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-3">How it works</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Three steps to zero missed deadlines</h3>
          </div>

          {/* Carousel container */}
          <div className="relative max-w-xl mx-auto">
            {/* Card */}
            <div className="overflow-hidden rounded-2xl">
              {features.map((item, idx) => (
                <div
                  key={item.title}
                  className={`
                    ${idx === activeFeature ? "block" : "hidden"}
                    ${isAnimating && idx === activeFeature ? (direction === "next" ? "feature-exit-left" : "feature-exit-right") : ""}
                    ${!isAnimating && idx === activeFeature ? "feature-enter" : ""}
                  `}
                >
                  <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${item.border} p-8 sm:p-10 shadow-lg shadow-slate-200/40 dark:shadow-black/20 space-y-5 text-center`}>
                    {/* Step number */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className={`text-xs font-bold tracking-widest uppercase bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
                        Step {item.step}
                      </span>
                      <span className="text-xs text-slate-300 dark:text-slate-600">/</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">03</span>
                    </div>

                    {/* Icon */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} ${item.color} border ${item.border} mx-auto shadow-sm`}>
                      {item.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">{item.title}</h3>

                    {/* Description */}
                    <p className="text-[0.95rem] leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => handleNav((activeFeature - 1 + features.length) % features.length, "prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 sm:-translate-x-14 h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all hover:shadow-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleNav((activeFeature + 1) % features.length, "next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 sm:translate-x-14 h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all hover:shadow-lg"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2.5 mt-8">
              {features.map((item, idx) => (
                <button
                  key={item.title}
                  onClick={() => handleNav(idx, idx > activeFeature ? "next" : "prev")}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeFeature
                      ? `w-8 h-2.5 ${item.dot}`
                      : "w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full max-w-xs mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full feature-progress"
                key={activeFeature}
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-32">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { value: "48h", label: "Early warning window", icon: <Clock size={18} />, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
              { value: "3x", label: "Faster response rates", icon: <Activity size={18} />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
              { value: "95%", label: "Delivery accuracy", icon: <Bell size={18} />, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
              { value: "24/7", label: "Automated chasing", icon: <Users size={18} />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 text-center hover:shadow-lg hover:shadow-slate-200/30 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 sm:p-14 text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 space-y-6 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-xs font-semibold text-white/90">
                <Sparkles size={13} />
                Ready to launch?
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Turn on the chaser.<br/>Never miss a deadline.</h3>
              <p className="text-indigo-100/80 text-[0.95rem]">Log in to activate your AI reminder engine and start tracking deadlines today.</p>
              <Link to="/login" className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[0.95rem] font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-all shadow-xl shadow-black/15 hover:-translate-y-0.5">
                Get Started Free
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        Built for hackathon — Intelligent Chaser Agent
      </footer>
    </div>
  );
};

export default Landing;
