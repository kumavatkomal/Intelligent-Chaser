import Anthropic from "@anthropic-ai/sdk";

export const createClaudeClient = (apiKey) => {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  return new Anthropic({
    apiKey
  });
};
