import { RiskScore } from "../models/RiskScore.js";
import { ResponsePattern } from "../models/ResponsePattern.js";

export const calculateRiskScore = async (task, assignee) => {
  try {
    const now = new Date();
    const deadline = new Date(task.dueDate);
    const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);
    
    let score = 0;
    const factors = {};
    const recommendations = [];

    // Factor 1: Time until deadline (max 35 points)
    if (hoursUntilDeadline < 0) {
      score += 35;
      factors.overdue = true;
      recommendations.push("Task is overdue - immediate action required");
    } else if (hoursUntilDeadline < 4) {
      score += 30;
      recommendations.push("Less than 4 hours remaining");
    } else if (hoursUntilDeadline < 24) {
      score += 20;
      recommendations.push("Less than 24 hours remaining");
    } else if (hoursUntilDeadline < 48) {
      score += 10;
    }
    factors.timeUntilDeadline = hoursUntilDeadline;

    // Factor 2: Task priority (max 25 points)
    if (task.priority === "high") {
      score += 25;
      factors.taskPriority = "high";
      recommendations.push("High priority task");
    } else if (task.priority === "medium") {
      score += 15;
      factors.taskPriority = "medium";
    } else {
      score += 5;
      factors.taskPriority = "low";
    }

    // Factor 3: Chase count (max 20 points)
    const chaseCount = task.chaseCount || 0;
    if (chaseCount >= 3) {
      score += 20;
      factors.noResponse = true;
      recommendations.push("Multiple reminders sent with no response");
    } else if (chaseCount >= 2) {
      score += 15;
    } else if (chaseCount >= 1) {
      score += 10;
    }
    factors.chaseCount = chaseCount;

    // Factor 4: Assignee response rate (max 20 points)
    if (assignee) {
      const pattern = await ResponsePattern.findOne({ userId: assignee._id });
      if (pattern) {
        const responseRate = pattern.responseRate || 0;
        if (responseRate < 30) {
          score += 20;
          recommendations.push("Assignee has low response rate");
        } else if (responseRate < 60) {
          score += 10;
        }
        factors.assigneeResponseRate = responseRate;
      }
    }

    // Determine risk level
    let riskLevel;
    if (score >= 70) {
      riskLevel = "critical";
      recommendations.push("Consider immediate escalation");
    } else if (score >= 50) {
      riskLevel = "high";
      recommendations.push("Escalation may be needed soon");
    } else if (score >= 30) {
      riskLevel = "medium";
    } else {
      riskLevel = "low";
    }

    // Save or update risk score
    await RiskScore.findOneAndUpdate(
      { taskId: task._id },
      {
        score,
        riskLevel,
        factors,
        recommendations,
        calculatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return { score, riskLevel, factors, recommendations };
  } catch (error) {
    console.error("Risk calculation error:", error);
    return { score: 0, riskLevel: "low", factors: {}, recommendations: [] };
  }
};
