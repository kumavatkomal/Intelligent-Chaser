import { createClaudeClient } from "../config/claude.js";
import { buildPrompt } from "../utils/messageGenerator.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateChaseMessage = async ({ task, assignee, chaseCount }) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const daysUntilDeadline = Math.max(Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)), 0);

  const prompt = buildPrompt({ task, assignee, chaseCount, daysUntilDeadline });
  const signatureName = "Intelligent Chaser";

  // Try Gemini first (FREE)
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Trying Gemini API...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModels = [
        "models/gemini-2.5-flash",
        "models/gemini-2.5-pro",
        "models/gemini-2.0-flash",
        "models/gemini-2.0-flash-001",
        "models/gemini-2.0-flash-lite",
        "models/gemini-2.0-flash-lite-001",
        "models/gemini-2.5-flash-lite"
      ];

      for (const modelName of geminiModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text && text.trim()) {
            console.log(`✅ Gemini message generated successfully (${modelName})`);
            const cleaned = text
              .replace(/\[Your Name\]/gi, signatureName)
              .replace(/\bYour Name\b/gi, signatureName)
              .trim();
            return { text: cleaned, source: "gemini" };
          }
        } catch (modelError) {
          console.warn(`⚠️ Gemini model failed (${modelName}):`, modelError.message);
        }
      }
    } catch (geminiError) {
      console.warn("⚠️ Gemini failed:", geminiError.message);
    }
  }

  // Fallback to Claude
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log("Trying Claude API...");
      const client = createClaudeClient(process.env.ANTHROPIC_API_KEY);
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 220,
        temperature: 0.6,
        messages: [{ role: "user", content: prompt }]
      });
      const text = response?.content?.[0]?.text || "";
      if (text && text.trim()) {
        console.log("✅ Claude message generated successfully");
        const cleaned = text
          .replace(/\[Your Name\]/gi, signatureName)
          .replace(/\bYour Name\b/gi, signatureName)
          .trim();
        return { text: cleaned, source: "claude" };
      }
    } catch (claudeError) {
      console.warn("⚠️ Claude failed:", claudeError.message);
    }
  }

  return {
    text: "Hi there, just a friendly reminder about your upcoming task.",
    source: "fallback"
  };
};
