import axios from "axios";
import { bolticConfig } from "../config/boltic.js";
import { sendGmailEmail } from "./gmailService.js";

const postWebhook = async (url, payload) => {
  if (!url) {
    throw new Error("Boltic webhook URL is not configured");
  }

  const response = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      "X-Boltic-Key": bolticConfig.apiKey
    }
  });

  return response.data;
};

export const sendEmail = async ({ to, subject, body, task, assignee, chaseCount, aiSource }) => {
  // Try real Gmail first, fallback to Boltic webhook
  try {
    const html = generateEmailHTML({ body, task, assignee, chaseCount, aiSource });
    await sendGmailEmail({ to, subject, text: body, html });
    return { status: "sent", provider: "gmail" };
  } catch (gmailError) {
    console.warn("Gmail send failed, using Boltic webhook:", gmailError.message);
    try {
      return postWebhook(bolticConfig.emailWebhook, { to, subject, body });
    } catch (webhookError) {
      console.warn("Boltic webhook failed:", webhookError.message);
      return { status: "failed", provider: "boltic", error: webhookError.message };
    }
  }
};

const generateEmailHTML = ({ body, task, assignee, chaseCount, aiSource }) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const daysUntil = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
  const isDueToday = daysUntil === 0;
  const isOverdue = daysUntil < 0;
  
  const priorityConfig = {
    urgent: { color: "#dc2626", bg: "#fee2e2", icon: "🔴" },
    high: { color: "#d97706", bg: "#fef3c7", icon: "🟠" },
    medium: { color: "#0891b2", bg: "#cffafe", icon: "🔵" },
    low: { color: "#059669", bg: "#d1fae5", icon: "🟢" }
  };

  const statusConfig = {
    pending: { icon: "⏳", label: "Pending" },
    in_progress: { icon: "⚡", label: "In Progress" },
    completed: { icon: "✅", label: "Completed" },
    overdue: { icon: "⚠️", label: "Overdue" }
  };

  const priorityInfo = priorityConfig[task.priority] || priorityConfig.medium;
  const statusInfo = statusConfig[task.status] || statusConfig.pending;

  const aiSourceLabels = {
    gemini: "Gemini",
    claude: "Claude",
    fallback: "Fallback"
  };
  const aiSourceLabel = aiSourceLabels[aiSource] || "Fallback";

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e90ff 0%, #00bfff 100%); padding: 50px 40px; text-align: center;">
              <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">📋</div>
              <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: white;">Task Reminder</h1>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.95); letter-spacing: 0.5px;">REMINDER #${chaseCount + 1} • ${formatDate(now).toUpperCase()}</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 45px 40px;">
              
              <!-- GREETING -->
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #1a202c; line-height: 1.6;">
                Hey <span style="color: #1e90ff; font-weight: 600;">${assignee.name}</span>,
              </p>

              <!-- MESSAGE BOX -->
              <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 100%); border-left: 5px solid #1e90ff; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <p style="margin: 0; font-size: 15px; color: #1a3a52; line-height: 1.7;">${body}</p>
                <p style="margin: 12px 0 0 0; font-size: 11px; color: #475569;">AI Source: ${aiSourceLabel}</p>
              </div>

              <!-- TASK CARD -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px; margin-bottom: 28px;">
                
                <!-- Task Title -->
                <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #1a202c;">📌 ${task.title}</h2>

                <!-- Description -->
                ${task.description ? `<p style="margin: 0 0 20px 0; font-size: 14px; color: #4a5568; line-height: 1.6; padding: 0 0 20px 0; border-bottom: 1px solid #e5e7eb;">${task.description}</p>` : ''}

                <!-- Priority & Status Row -->
                <div style="display: flex; gap: 24px; margin-bottom: 20px;">
                  <div>
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">⚡ Priority</p>
                    <span style="display: inline-block; background: ${priorityInfo.bg}; color: ${priorityInfo.color}; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; text-transform: capitalize;">${priorityInfo.icon} ${task.priority}</span>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">📊 Status</p>
                    <span style="display: inline-block; background: #e2e8f0; color: #2d3748; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 600;">${statusInfo.icon} ${statusInfo.label}</span>
                  </div>
                </div>

                <!-- Deadline -->
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 5px solid #fb923c; border-radius: 8px; padding: 16px 20px;">
                  <p style="margin: 0 0 8px 0; font-size: 11px; color: #78350f; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">📅 Deadline</p>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 18px; font-weight: 700; color: #b45309;">${formatDate(dueDate)}</span>
                    <span style="font-size: 12px; font-weight: 600; color: ${isDueToday || isOverdue ? '#dc2626' : '#b45309'};">
                      ${isOverdue ? '⚠️ OVERDUE' : isDueToday ? '⏰ DUE TODAY' : `${daysUntil} days left`}
                    </span>
                  </div>
                </div>
              </div>

              <!-- STATS -->
              <div style="background: #f0f8ff; border-radius: 10px; padding: 24px; margin-bottom: 28px; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="text-align: center; border-right: 1px solid #d4e4f7;">
                      <div style="font-size: 28px; font-weight: 700; color: #1e90ff; margin-bottom: 6px;">${chaseCount}</div>
                      <div style="font-size: 11px; color: #4a5568; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Reminders Sent</div>
                    </td>
                    <td width="50%" style="text-align: center;">
                      <div style="font-size: 28px; font-weight: 700; color: #1e90ff; margin-bottom: 6px;">${daysUntil > 0 ? daysUntil : 0}</div>
                      <div style="font-size: 11px; color: #4a5568; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Days Left</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173" style="display: inline-block; background: linear-gradient(135deg, #1e90ff 0%, #00bfff 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 8px 16px rgba(30,144,255,0.25);">📱 View Task Details</a>
                  </td>
                </tr>
              </table>

              <!-- TIP BOX -->
              <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 8px; padding: 14px 16px; margin-bottom: 0;">
                <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">💡 <strong>Quick Tip:</strong> Complete this task in the app to stop receiving reminders.</p>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #718096; line-height: 1.6;">
                This is an automated reminder from <strong>Intelligent Chaser</strong>
              </p>
              <p style="margin: 0; font-size: 11px; color: #a0aec0;">
                © 2026 Intelligent Chaser. Keeping you on track. 🚀
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const sendSlack = async ({ channel, text }) => {
  return postWebhook(bolticConfig.slackWebhook, {
    channel,
    text
  });
};

export const sendWhatsApp = async ({ number, text }) => {
  return postWebhook(bolticConfig.emailWebhook, {
    number,
    text,
    type: "whatsapp"
  });
};
