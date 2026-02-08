import { Task } from "../models/Task.js";
import { ChaseLog } from "../models/ChaseLog.js";
import { generateChaseMessage } from "./aiService.js";
import { selectChannelForTime } from "../utils/timeOptimizer.js";
import { sendEmail, sendSlack, sendWhatsApp } from "./channelService.js";

export const triggerChase = async ({ task, assignee, channelOverride }) => {
  const chaseCount = task.chaseCount || 0;

  let aiMessage = "";
  let aiSource = "fallback";
  try {
    const aiResult = await generateChaseMessage({ task, assignee, chaseCount });
    aiMessage = aiResult.text;
    aiSource = aiResult.source || "fallback";
    console.log(`🤖 AI message generated (${aiSource})`);
  } catch (error) {
    console.warn("AI message failed, using default:", error.message);
    aiMessage = "Hi there, just a friendly reminder about your upcoming task.";
    aiSource = "fallback";
  }

  const message = aiMessage;

  const preferredChannel = assignee?.preferredChannel || "email";
  const channelDecision = channelOverride || selectChannelForTime({
    now: new Date(),
    priority: task.priority,
    preferredChannel
  });

  const channels = channelDecision === "multi" ? ["email", "slack"] : [channelDecision];

  const results = [];
  for (const channel of channels) {
    let status = "sent";
    let result = null;

    try {
      if (channel === "email") {
        console.log(`📧 Sending email to ${assignee.email} for task: "${task.title}"`);
        result = await sendEmail({
          to: assignee.email,
          subject: `⏰ Task Reminder: ${task.title}`,
          body: message,
          task,
          assignee,
          chaseCount,
          aiSource
        });
        console.log(`✅ Email sent successfully`);
      }

      if (channel === "slack") {
        console.log(`💬 Sending Slack message to ${assignee.slackId || "#general"}`);
        result = await sendSlack({
          channel: assignee.slackId || "#general",
          text: message
        });
        console.log(`✅ Slack message sent successfully`);
      }

      if (channel === "whatsapp") {
        console.log(`📱 Sending WhatsApp to ${assignee.whatsapp}`);
        result = await sendWhatsApp({
          number: assignee.whatsapp,
          text: message
        });
        console.log(`✅ WhatsApp sent successfully`);
      }
    } catch (error) {
      status = "failed";
      result = { status: "failed", error: error.message };
      console.error(`❌ ${channel.toUpperCase()} send failed:`, error.message);
    }

    results.push(result || { status });

    await ChaseLog.create({
      task: task._id,
      assignee: assignee._id,
      channel,
      message,
      status
    });
  }

  await Task.findByIdAndUpdate(task._id, {
    $inc: { chaseCount: 1 },
    $set: { lastChasedAt: new Date() }
  });

  console.log(`✅ Chase #${chaseCount + 1} completed for "${task.title}"`);
  return results;
};
