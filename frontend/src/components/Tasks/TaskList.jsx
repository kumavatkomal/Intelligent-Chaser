import { useState } from "react";
import { useTasks } from "../../hooks/useTasks.js";
import { formatDate } from "../../utils/dateHelpers.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import api from "../../services/api.js";
import Loader from "../Common/Loader.jsx";
import { Trash2 } from "lucide-react";

const statusStyle = {
  pending: { active: "bg-amber-400 text-white border-amber-400", inactive: "border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-amber-300 hover:text-amber-500" },
  in_progress: { active: "bg-indigo-500 text-white border-indigo-500", inactive: "border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-indigo-300 hover:text-indigo-500" },
  completed: { active: "bg-emerald-500 text-white border-emerald-500", inactive: "border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-emerald-300 hover:text-emerald-500" },
};

const TaskList = ({ onSelectTask, selectedTask }) => {
  const { tasks, loading, refresh } = useTasks();
  const { addToast } = useToast();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const toggleSelection = (taskId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(taskId)) newSelected.delete(taskId); else newSelected.add(taskId);
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === tasks.length && tasks.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(tasks.map((t) => t._id)));
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    if (!window.confirm(`Delete ${count} task${count > 1 ? "s" : ""}? This cannot be undone.`)) return;
    try {
      setIsDeleting(true);
      await api.post("/tasks/bulk-delete", { ids: Array.from(selectedIds) });
      addToast(`${count} task${count > 1 ? "s" : ""} deleted`, "success");
      setSelectedIds(new Set());
      refresh();
    } catch { addToast("Failed to delete tasks", "error"); } finally { setIsDeleting(false); }
  };

  if (loading) return <Loader label="Loading tasks" />;

  return (
    <div>
      {tasks.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === tasks.length && tasks.length > 0}
              onChange={selectAll}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
            </span>
          </label>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-900 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition disabled:opacity-60"
            >
              <Trash2 size={12} />
              {isDeleting ? "Deleting..." : `Delete ${selectedIds.size}`}
            </button>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-2.5">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`rounded-xl px-4 py-3 transition-all ${
              selectedTask?._id === task._id
                ? "bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-300 dark:border-indigo-700"
                : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:border-slate-200 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.has(task._id)}
                onChange={() => toggleSelection(task._id)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <button
                onClick={() => onSelectTask(task)}
                className="flex-1 flex items-center justify-between text-left hover:opacity-70 transition"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{task.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Due {formatDate(task.dueDate)}</p>
                </div>
              </button>
            </div>
            <div className="mt-2 ml-7 flex items-center gap-2">
              {["pending", "in_progress", "completed"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    if (task.status !== status) {
                      setUpdatingId(task._id);
                      api.patch(`/tasks/${task._id}`, { status })
                        .then(() => { addToast(`Marked as ${status.replace("_", " ")}`, "success"); window.dispatchEvent(new Event("tasks:refresh")); })
                        .catch(() => addToast("Failed to update status", "error"))
                        .finally(() => setUpdatingId(null));
                    }
                  }}
                  disabled={updatingId === task._id}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${
                    task.status === status
                      ? statusStyle[status].active
                      : statusStyle[status].inactive
                  } disabled:opacity-60`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 px-4 py-8 text-center text-sm text-slate-400">
          No tasks yet. Create one to get started!
        </div>
      )}
    </div>
  );
};

export default TaskList;
