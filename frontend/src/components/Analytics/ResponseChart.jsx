import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAnalytics } from "../../hooks/useAnalytics.js";
import { Activity } from "lucide-react";

const ResponseChart = () => {
  const { responses } = useAnalytics();
  const data = (responses?.recentLogs || []).slice(0, 6).map((log, index) => ({
    name: `Chase ${index + 1}`,
    hours: log.responseAt ? (new Date(log.responseAt) - new Date(log.sentAt)) / (1000 * 60 * 60) : 0
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500">
          <Activity size={17} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Trend</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Response Velocity</h3>
        </div>
      </div>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" hide />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} />
            <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResponseChart;
