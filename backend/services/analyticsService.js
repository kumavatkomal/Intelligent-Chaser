import { Task } from "../models/Task.js";
import { ChaseLog } from "../models/ChaseLog.js";
import { EmailEvent } from "../models/EmailEvent.js";
import { RiskScore } from "../models/RiskScore.js";
import { ResponsePattern } from "../models/ResponsePattern.js";

export const getOverviewMetrics = async () => {
  const [total, completed, overdue] = await Promise.all([
    Task.countDocuments({}),
    Task.countDocuments({ status: "completed" }),
    Task.countDocuments({ status: "overdue" })
  ]);

  return {
    totalTasks: total,
    completedTasks: completed,
    overdueTasks: overdue,
    completionRate: total > 0 ? (completed / total) * 100 : 0
  };
};

export const getRiskScores = async () => {
  const riskScores = await RiskScore.find({}).populate({
    path: "taskId",
    populate: { path: "assignee" }
  }).sort({ score: -1 });
  
  return riskScores.map((risk) => ({
    taskId: risk.taskId?._id,
    title: risk.taskId?.title,
    assignee: risk.taskId?.assignee?.name || "Unassigned",
    riskScore: risk.score,
    riskLevel: risk.riskLevel,
    recommendations: risk.recommendations
  }));
};

export const getResponseAnalytics = async () => {
  const logs = await ChaseLog.find({}).sort({ sentAt: -1 }).limit(100);
  const averageResponseTime = logs.length
    ? logs.reduce((acc, log) => acc + (log.responseAt ? (log.responseAt - log.sentAt) : 0), 0) /
      logs.length /
      (1000 * 60 * 60)
    : 0;

  return {
    averageResponseTimeHours: Number(averageResponseTime.toFixed(2)),
    recentLogs: logs
  };
};

export const getDashboardAnalytics = async () => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({});
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const overdueTasks = tasks.filter(t => new Date(t.dueDate) < now && t.status !== "completed").length;
    
    const riskScores = await RiskScore.find({});
    const emailEvents = await EmailEvent.find({ timestamp: { $gte: last30Days } });
    const recentChases = await ChaseLog.find({ sentAt: { $gte: last30Days } });

    const emailStats = {
      sent: emailEvents.filter(e => e.eventType === "sent").length,
      opened: emailEvents.filter(e => e.eventType === "opened").length,
      clicked: emailEvents.filter(e => e.eventType === "clicked").length,
      replied: emailEvents.filter(e => e.eventType === "replied").length
    };

    return {
      overview: {
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
      },
      riskBreakdown: {
        critical: riskScores.filter(r => r.riskLevel === "critical").length,
        high: riskScores.filter(r => r.riskLevel === "high").length,
        medium: riskScores.filter(r => r.riskLevel === "medium").length,
        low: riskScores.filter(r => r.riskLevel === "low").length
      },
      emailEngagement: {
        ...emailStats,
        openRate: emailStats.sent > 0 ? ((emailStats.opened / emailStats.sent) * 100).toFixed(1) + "%" : "0%",
        replyRate: emailStats.sent > 0 ? ((emailStats.replied / emailStats.sent) * 100).toFixed(1) + "%" : "0%"
      },
      chaseMetrics: {
        totalChases: recentChases.length,
        successRate: recentChases.length > 0 ? 
          ((recentChases.filter(c => c.status === "success").length / recentChases.length) * 100).toFixed(1) + "%" : "0%"
      }
    };
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    throw error;
  }
};
