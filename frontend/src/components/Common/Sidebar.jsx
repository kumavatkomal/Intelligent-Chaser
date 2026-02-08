import { Activity, BarChart3, ClipboardCheck, Zap } from "lucide-react";

const navItems = [
  { key: "overview", label: "Live Overview", icon: Activity },
  { key: "tasks", label: "Tasks", icon: ClipboardCheck },
  { key: "chasers", label: "Chasers", icon: Zap },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const Sidebar = ({ activeView, onSelectView }) => {
  return (
    <aside className="hidden w-60 flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-4 py-6 lg:flex">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white grid place-items-center font-bold text-xs shadow-md shadow-indigo-500/20">IA</div>
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-[0.15em]">Workspace</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Hackathon Ops</p>
        </div>
      </div>

      <nav className="grid gap-1.5 text-[0.84rem]">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelectView(key)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-150 ${
              activeView === key
                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/25"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white font-medium"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
