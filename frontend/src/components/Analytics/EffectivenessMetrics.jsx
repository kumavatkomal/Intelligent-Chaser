import { useAnalytics } from "../../hooks/useAnalytics.js";
import { Target, Timer, CheckCircle } from "lucide-react";

const EffectivenessMetrics = () => {
  const { responses } = useAnalytics();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-500">
          <Target size={17} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Impact</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Chase Effectiveness</h3>
        </div>
      </div>
      <div className="mt-5 grid gap-2.5 text-sm">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-50 dark:bg-amber-950/30 text-amber-500 p-1.5 rounded-lg"><Timer size={14} /></span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Response Time</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{responses?.averageResponseTimeHours || 0}h</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 p-1.5 rounded-lg"><CheckCircle size={14} /></span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Successful Chases</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{responses?.recentLogs?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default EffectivenessMetrics;
