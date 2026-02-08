import { Clock, Zap } from "lucide-react";

const slots = [
  { time: "48h", label: "Early warning", color: "bg-emerald-400", ring: "ring-emerald-100 dark:ring-emerald-950/40" },
  { time: "24h", label: "First nudge", color: "bg-amber-400", ring: "ring-amber-100 dark:ring-amber-950/40" },
  { time: "4h", label: "Escalation", color: "bg-orange-400", ring: "ring-orange-100 dark:ring-orange-950/40" },
  { time: "1h", label: "Final push", color: "bg-red-500", ring: "ring-red-100 dark:ring-red-950/40" },
];

const ScheduledChasers = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-500">
          <Clock size={17} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Schedule</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Next Chasers</h3>
        </div>
      </div>
      <div className="mt-5 grid gap-2.5 text-sm">
        {slots.map((slot) => (
          <div key={slot.time} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-600 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${slot.color} ring-4 ${slot.ring}`} />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{slot.time} window</span>
                <p className="text-xs text-slate-400 mt-0.5">{slot.label}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-500"><Zap size={11} />Auto</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledChasers;
