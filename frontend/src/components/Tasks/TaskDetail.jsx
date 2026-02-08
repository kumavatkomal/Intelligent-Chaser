import { useState } from "react";
import { formatDate } from "../../utils/dateHelpers.js";
import api from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

const TaskDetail = ({ task, onDelete }) => {
  const { addToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  if (!task) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Task Focus</h3>
        <p className="mt-3 text-sm text-slate-400">Select a task to view details.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      await api.delete(`/tasks/${task._id}`);
      addToast("Task deleted", "success");
      window.dispatchEvent(new Event("tasks:refresh"));
      if (onDelete) onDelete();
    } catch (error) {
      addToast("Failed to delete task", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getTimeLeftLabel = () => {
    if (!task?.dueDate) return "N/A";
    const diffMs = new Date(task.dueDate) - new Date();
    if (diffMs <= 0) return "Overdue";

    const totalMinutes = Math.ceil(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remHours = hours % 24;
      return `${days}d ${remHours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  const timeLeft = getTimeLeftLabel();
  const isOverdue = timeLeft === "Overdue";
  const priorityColors = { low: "bg-slate-100 text-slate-500", medium: "bg-amber-50 text-amber-600", high: "bg-orange-50 text-orange-600", urgent: "bg-red-50 text-red-600" };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Task Focus</h3>
      <div className="mt-4 space-y-3 text-sm">
        <p className="font-bold text-slate-800 dark:text-white text-base">{task.title}</p>
        <p className="text-slate-500 dark:text-slate-400">{task.description || "No description"}</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Due</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{formatDate(task.dueDate)}</p>
          </div>
          <div className={`rounded-xl border px-3 py-2.5 ${isOverdue ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900'}`}>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Time Left</p>
            <p className={`font-bold mt-0.5 ${isOverdue ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>{timeLeft}</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Assignee</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{task.assignee?.name || "Unassigned"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Priority</p>
            <span className={`inline-block mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${priorityColors[task.priority] || priorityColors.medium}`}>{task.priority}</span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full rounded-full border border-red-200 dark:border-red-900 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
