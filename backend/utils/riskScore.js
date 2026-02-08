export const calculateRiskScore = (task, assignee) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const daysLeft = Math.max(Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)), 0);
  const responseRate = assignee?.avgResponseTime || 24;
  const taskComplexity = task.priority === "high" || task.priority === "urgent" ? 1.5 : 1;

  const riskScore = (100 - daysLeft * 10) * (responseRate / 24) * taskComplexity;
  return Math.min(Math.max(riskScore, 0), 100);
};
