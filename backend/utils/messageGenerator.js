export const getTone = (priority, chaseCount) => {
  if (priority === "urgent" || chaseCount >= 2) return "urgent";
  if (priority === "high") return "supportive";
  return "friendly";
};

export const buildPrompt = ({ task, assignee, chaseCount, daysUntilDeadline }) => {
  const tone = getTone(task.priority, chaseCount);

  return `Generate a professional but ${tone} chase message for:\n` +
    `- Task: ${task.title}\n` +
    `- Assignee: ${assignee.name}\n` +
    `- Due in: ${daysUntilDeadline} days\n` +
    `- Previous chases: ${chaseCount}\n` +
    `- Assignee typically responds: ${assignee.responsePattern || "unknown"}\n` +
    `Make it personalized and concise.`;
};
