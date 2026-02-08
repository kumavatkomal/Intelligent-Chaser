import { AlertTriangle, TrendingDown } from "lucide-react";
import { useAnalytics } from "../../hooks/useAnalytics.js";
import Loader from "../Common/Loader.jsx";

const RiskScoreCard = () => {
  const { risk } = useAnalytics();

  if (!risk) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
        <Loader label="Loading risk" />
      </div>
    );
  }

  const topRisk = risk.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500">
            <AlertTriangle size={17} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-red-400 font-semibold">Risk Watch</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Likely to Miss</h3>
          </div>
        </div>
        <TrendingDown size={16} className="text-red-300" />
      </div>
      <ul className="mt-5 grid gap-2.5 text-sm">
        {topRisk.map((item) => (
          <li key={item.taskId} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.assignee}</p>
            </div>
            <span className="rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-3 py-1 text-xs font-bold text-red-500">
              {Math.round(item.riskScore)}%
            </span>
          </li>
        ))}
        {topRisk.length === 0 && <p className="text-slate-400 text-sm py-4 text-center">No at-risk tasks</p>}
      </ul>
    </div>
  );
};

export default RiskScoreCard;
