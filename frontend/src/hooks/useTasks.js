import { useEffect, useState } from "react";
import api from "../services/api.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/tasks");
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const handleRefresh = () => {
      fetchTasks();
    };

    window.addEventListener("tasks:refresh", handleRefresh);
    return () => window.removeEventListener("tasks:refresh", handleRefresh);
  }, []);

  return { tasks, loading, error, refresh: fetchTasks };
};
