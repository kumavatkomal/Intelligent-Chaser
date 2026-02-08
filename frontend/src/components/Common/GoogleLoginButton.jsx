import { useState, useEffect, useRef } from "react";
import { LogIn, Mail, LogOut, User, ChevronDown, Shield, Calendar } from "lucide-react";
import EmailLoginForm from "../Auth/EmailLoginForm.jsx";

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem("authToken"));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL.replace("/api", "")}/api/auth/google`;
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.reload();
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  if (user) {
    return (
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[11px] font-bold text-white ring-2 ring-white dark:ring-slate-800">
              {getInitials(user.name)}
            </div>
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">{user.name}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
        </button>

        {showProfile && (
          <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden animate-in">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-5">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full ring-2 ring-white/30" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white ring-2 ring-white/30">
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-white text-sm">{user.name}</p>
                  <p className="text-xs text-indigo-100 mt-0.5">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Name</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Email</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-500">
                  <Shield size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Role</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.role || "Team Member"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-500">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Joined</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently"}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showEmailLogin) {
    return (
      <div className="relative">
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-ink/10 bg-white p-4 shadow-lift dark:border-white/10 dark:bg-ink/90">
          <EmailLoginForm onSuccess={() => setShowEmailLogin(false)} />
        </div>
        <button
          onClick={() => setShowEmailLogin(false)}
          className="rounded-full border border-ink/10 px-4 py-2 text-sm dark:border-white/10"
        >
          ✕ Close
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white hover:bg-ink/80"
      >
        <LogIn size={16} />
        Google
      </button>
      <button
        onClick={() => setShowEmailLogin(true)}
        className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm hover:bg-ink/5 dark:border-white/10"
      >
        <Mail size={16} />
        Email
      </button>
    </div>
  );
};

export default GoogleLoginButton;
