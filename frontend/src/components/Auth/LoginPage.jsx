import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import EmailLoginForm from "./EmailLoginForm.jsx";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL.replace("/api", "")}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-50/90 via-white/70 to-transparent dark:from-slate-900/80 dark:via-slate-950/60 dark:to-transparent" />
      {/* Grid background */}
      <div className="absolute inset-0 z-[1] bg-grid" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100 dark:bg-indigo-950/50 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-100 dark:bg-violet-950/30 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 grid min-h-screen items-center gap-12 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 max-w-7xl mx-auto">
        {/* Left side */}
        <div className="space-y-7 animate-in">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft size={16} />
            Back to overview
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm">
            <ShieldCheck size={13} />
            Secure sign in
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-[-0.04em]">Welcome back, Chaser.</h1>
          <p className="max-w-md text-[1.05rem] leading-[1.75] text-slate-500 dark:text-slate-400">
            Sign in to activate the command center and keep every deadline on your radar.
          </p>

          {/* Feature list */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Why log in?</p>
            <p className="text-[0.9rem] text-slate-500 dark:text-slate-400">Access real-time analytics, task intelligence, and AI nudges.</p>
            <div className="grid gap-2.5">
              {["Risk pulse alerts", "Multi-channel chasers", "Proof of follow-ups"].map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-950/40" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — Auth card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/20 w-full max-w-md justify-self-center animate-slide-in">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Sign in</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">Choose your method</h2>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-[0.95rem] font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <LogIn size={17} />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              or use email
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
                <Mail size={14} />
                Email OTP
              </div>
              <EmailLoginForm onSuccess={() => navigate("/dashboard")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
