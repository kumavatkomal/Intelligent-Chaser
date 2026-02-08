export const bolticConfig = {
  apiKey: process.env.BOLTIC_API_KEY || "",
  emailWebhook: process.env.BOLTIC_EMAIL_WEBHOOK || "",
  slackWebhook: process.env.BOLTIC_SLACK_WEBHOOK || "",
  escalationWebhook: process.env.BOLTIC_ESCALATION_WEBHOOK || "",
  weeklyWebhook: process.env.BOLTIC_WEEKLY_WEBHOOK || ""
};
