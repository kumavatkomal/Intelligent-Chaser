import { useState } from "react";
import api from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

const TaskForm = ({ onTaskCreated }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigneeEmail: "",
    dueDate: "",
    priority: "medium",
    status: "pending"
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/tasks", form);
      setForm({ title: "", description: "", assigneeEmail: "", dueDate: "", priority: "medium", status: "pending" });
      addToast("Task created successfully!", "success");
      if (onTaskCreated) onTaskCreated();
      window.location.reload();
    } catch (error) {
      addToast("Failed to create task", "error");
      console.error(error);
    }
  };

  const inputClass = "rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all";

  return (
    <form className="mt-4 grid gap-3 text-sm" onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" className={inputClass} required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className={inputClass} rows="3" />
      <input type="email" name="assigneeEmail" value={form.assigneeEmail} onChange={handleChange} placeholder="Assignee email" className={inputClass} />
      <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputClass} required step="60" />
      <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md shadow-indigo-500/20 mt-1">Create Task</button>
    </form>
  );
};

export default TaskForm;
