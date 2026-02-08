import { BarChart3, CheckCircle, Clock, ListTodo } from "lucide-react";
import { useAnalytics } from "../../hooks/useAnalytics.js";
import Loader from "../Common/Loader.jsx";
import { formatPercentage } from "../../utils/formatters.js";

const AnalyticsDashboard = () => {
  const { overview } = useAnalytics();

  if (!overview) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
        <Loader label="Loading analytics" />
      </div>
    );
  }

  const metrics = [
    { label: "Total Tasks", value: overview.totalTasks, icon: <ListTodo size={15} />, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { label: "Completion Rate", value: formatPercentage(overview.completionRate), icon: <CheckCircle size={15} />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Overdue Tasks", value: overview.overdueTasks, icon: <Clock size={15} />, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", isAlert: overview.overdueTasks > 0 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500">
          <BarChart3 size={17} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Metrics</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Performance Pulse</h3>
        </div>
      </div>
      <div className="mt-5 grid gap-2.5 text-sm">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
            <div className="flex items-center gap-2.5">
              <span className={`${m.bg} ${m.color} p-1.5 rounded-lg`}>{m.icon}</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">{m.label}</span>
            </div>
            <span className={`font-bold ${m.isAlert ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
