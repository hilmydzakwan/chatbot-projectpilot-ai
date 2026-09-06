import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "../prompts/systemPrompt.js";

let client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

function toInteractionsInput(conversationHistory = [], newMessage) {
  const steps = conversationHistory.map((turn) => ({
    type: turn.role === "ai" ? "model_output" : "user_input",
    content: [{ type: "text", text: turn.text }],
  }));

  steps.push({
    type: "user_input",
    content: [{ type: "text", text: newMessage }],
  });

  return steps;
}

export async function generateChatResponse({ message, conversationHistory, settings }) {
  const ai = getClient();
  const systemInstruction = buildSystemPrompt(settings);
  const input = toInteractionsInput(conversationHistory, message);

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input,
    system_instruction: systemInstruction,
    generation_config: {
      thinking_level: "low",
      max_output_tokens: 4096,
    },
    store: false,
  });

  const text = interaction?.output_text;
  if (!text) {
    throw new Error("EMPTY_RESPONSE");
  }
  return text;
}