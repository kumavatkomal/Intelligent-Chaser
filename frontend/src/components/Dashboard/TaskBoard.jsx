import { useState } from "react";
import { Check, LayoutGrid, Filter } from "lucide-react";
import { useTasks } from "../../hooks/useTasks.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import Loader from "../Common/Loader.jsx";

const statusConfig = {
  pending: { color: "bg-amber-400", ring: "ring-amber-100 dark:ring-amber-950/40", check: "border-amber-400 bg-amber-400" },
  in_progress: { color: "bg-indigo-500", ring: "ring-indigo-100 dark:ring-indigo-950/40", check: "border-indigo-500 bg-indigo-500" },
  completed: { color: "bg-emerald-500", ring: "ring-emerald-100 dark:ring-emerald-950/40", check: "border-emerald-500 bg-emerald-500" },
};

const TaskBoard = ({ onSelectTask, selectedTask }) => {
  const { tasks, loading } = useTasks();
  const statusGroups = ["pending", "in_progress", "completed"];
  const [visibleStatuses, setVisibleStatuses] = useState(new Set(statusGroups));

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
        <Loader label="Loading tasks" />
      </div>
    );
  }

  const toggleStatusVisibility = (status) => {
    setVisibleStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) { next.delete(status); } else { next.add(status); }
      return next;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-500">
            <LayoutGrid size={17} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Workflow</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Task Board</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-300">
          <Filter size={14} />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Filters</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {statusGroups.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => toggleStatusVisibility(status)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all ${
              visibleStatuses.has(status)
                ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                : "border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600"
            }`}
            aria-pressed={visibleStatuses.has(status)}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                visibleStatuses.has(status)
                  ? `${statusConfig[status].check} text-white`
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent"
              }`}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            {status.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 max-h-64 overflow-y-auto pr-1">
        {statusGroups
          .filter((status) => visibleStatuses.has(status))
          .map((status) => (
            tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <button
                  key={task._id}
                  onClick={() => onSelectTask(task)}
                  className={`flex items-start gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    selectedTask?._id === task._id
                      ? "bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-300 dark:border-indigo-700"
                      : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:border-slate-200 dark:hover:border-slate-600"
                  }`}
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${statusConfig[status].color} ring-4 ${statusConfig[status].ring}`} />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{task.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{task.assignee?.name || "Unassigned"}</p>
                  </div>
                </button>
              ))
          ))}
      </div>
    </div>
  );
};

export default TaskBoard;
