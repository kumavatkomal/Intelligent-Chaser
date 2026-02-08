import { useAnalytics } from "../../hooks/useAnalytics.js";
import { Mail, MessageSquare } from "lucide-react";

const ChaserHistory = () => {
  const { responses } = useAnalytics();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-500">
          <MessageSquare size={17} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Logs</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Chaser History</h3>
        </div>
      </div>
      <div className="mt-5 grid gap-2.5 text-sm">
        {(responses?.recentLogs || []).slice(0, 5).map((log) => (
          <div key={log._id} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
            <Mail size={14} className="text-slate-300 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">{log.message.slice(0, 40)}...</p>
              <p className="text-xs text-slate-400 mt-0.5">{log.channel}</p>
            </div>
          </div>
        ))}
        {!responses && <p className="text-slate-400 text-sm py-4 text-center">No chaser data yet.</p>}
      </div>
    </div>
  );
};

export default ChaserHistory;
