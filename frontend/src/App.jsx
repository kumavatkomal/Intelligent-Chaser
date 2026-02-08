import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import Landing from "./components/Common/Landing.jsx";
import LoginPage from "./components/Auth/LoginPage.jsx";
import Header from "./components/Common/Header.jsx";
import Sidebar from "./components/Common/Sidebar.jsx";
import TaskBoard from "./components/Dashboard/TaskBoard.jsx";
import AnalyticsDashboard from "./components/Dashboard/AnalyticsDashboard.jsx";
import RiskScoreCard from "./components/Dashboard/RiskScoreCard.jsx";
import TaskList from "./components/Tasks/TaskList.jsx";
import TaskForm from "./components/Tasks/TaskForm.jsx";
import TaskDetail from "./components/Tasks/TaskDetail.jsx";
import ChaserHistory from "./components/Chasers/ChaserHistory.jsx";
import ManualChaseButton from "./components/Chasers/ManualChaseButton.jsx";
import ScheduledChasers from "./components/Chasers/ScheduledChasers.jsx";
import ResponseChart from "./components/Analytics/ResponseChart.jsx";
import PersonPerformance from "./components/Analytics/PersonPerformance.jsx";
import EffectivenessMetrics from "./components/Analytics/EffectivenessMetrics.jsx";
import AuthCallback from "./components/Auth/AuthCallback.jsx";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Dashboard = () => {
  const [activeTask, setActiveTask] = useState(null);
  const [activeView, setActiveView] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      <div className="absolute inset-0 bg-grid" />
      <Header />
      <div className="relative z-10 flex">
        <Sidebar activeView={activeView} onSelectView={setActiveView} />
        <main className="flex-1 px-6 pb-12 pt-6">
          {activeView === "overview" && (
            <>
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">Overview</h2>
                <div className="grid gap-6 lg:grid-cols-3">
                  <RiskScoreCard />
                  <AnalyticsDashboard />
                  <TaskBoard onSelectTask={setActiveTask} selectedTask={activeTask} />
                </div>
              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Tasks</h2>
                    <ManualChaseButton task={activeTask} />
                  </div>
                  <TaskList onSelectTask={setActiveTask} selectedTask={activeTask} />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Create Task</h2>
                  <TaskForm />
                </div>
              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <TaskDetail task={activeTask} onDelete={() => setActiveTask(null)} />
                </div>
                <ChaserHistory task={activeTask} />
                <ScheduledChasers />
              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-3">
                <ResponseChart />
                <PersonPerformance />
                <EffectivenessMetrics />
              </section>
            </>
          )}

          {activeView === "tasks" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">Tasks Management</h2>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Active Tasks</h3>
                    <ManualChaseButton task={activeTask} />
                  </div>
                  <TaskList onSelectTask={setActiveTask} selectedTask={activeTask} />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Create Task</h3>
                  <TaskForm />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <TaskDetail task={activeTask} onDelete={() => setActiveTask(null)} />
                </div>
              </div>
            </section>
          )}

          {activeView === "chasers" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">Chaser Management</h2>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Chaser Actions</h3>
                    <ManualChaseButton task={activeTask} />
                  </div>
                  <TaskList onSelectTask={setActiveTask} selectedTask={activeTask} />
                </div>
                <ChaserHistory task={activeTask} />
                <ScheduledChasers />
              </div>
            </section>
          )}

          {activeView === "analytics" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">Analytics</h2>
              <div className="grid gap-6 lg:grid-cols-3">
                <AnalyticsDashboard />
                <ResponseChart />
                <PersonPerformance />
                <EffectivenessMetrics />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
