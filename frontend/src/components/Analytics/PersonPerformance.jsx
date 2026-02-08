import { useAnalytics } from "../../hooks/useAnalytics.js";
import { Users, Trophy } from "lucide-react";

const medals = ["🥇", "🥈", "🥉"];

const PersonPerformance = () => {
  const { risk } = useAnalytics();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500">
          <Users size={17} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Leaderboard</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Top Responders</h3>
        </div>
      </div>
      <div className="mt-5 grid gap-2.5 text-sm">
        {(risk || []).slice(0, 3).map((item, i) => (
          <div key={item.taskId} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{medals[i]}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{item.assignee}</span>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">{Math.round(100 - item.riskScore)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonPerformance;
