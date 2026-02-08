import { Bell, Moon, Sun } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Intelligent Chaser</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-[-0.03em]">Deadline Command Center</h1>
      </div>
      <div className="flex items-center gap-2">
        <GoogleLoginButton />
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400 dark:text-slate-500 hover:text-slate-600"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400 dark:text-slate-500 hover:text-slate-600 relative">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
