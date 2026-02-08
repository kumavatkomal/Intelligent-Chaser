import api from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

const ManualChaseButton = ({ task }) => {
  const { addToast } = useToast();

  const handleChase = async () => {
    if (!task) {
      addToast("Please select a task first", "error");
      return;
    }
    if (!task.assignee) {
      addToast("Task has no assignee - add email when creating task", "error");
      return;
    }
    try {
      await api.post(`/chasers/manual/${task._id}`, { channel: "email" });
      addToast("Chase triggered successfully!", "success");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to trigger chase";
      addToast(msg, "error");
      console.error("Chase error:", error.response?.data || error.message);
    }
  };

  return (
    <button
      onClick={handleChase}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={!task}
    >
      Trigger Chase
    </button>
  );
};

export default ManualChaseButton;
