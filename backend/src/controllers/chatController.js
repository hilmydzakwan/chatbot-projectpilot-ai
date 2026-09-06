import { generateChatResponse } from "../services/geminiService.js";
import { resolveQuickAction } from "../prompts/quickActionPrompts.js";

const DEFAULT_SETTINGS = {
  persona: "mentor",
  experienceLevel: "beginner",
  language: "id",
  projectType: "web",
};

export async function handleChat(req, res) {
  try {
    const { message, conversationHistory = [], settings = {} } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message first.",
      });
    }

    const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };

    const reply = await generateChatResponse({
      message: message.trim(),
      conversationHistory,
      settings: mergedSettings,
    });

    return res.json({ success: true, message: reply });
  } catch (err) {
    return handleGeminiError(err, res);
  }
}

export async function handleQuickAction(req, res) {
  try {
    const { action, conversationHistory = [], settings = {} } = req.body || {};
    const prompt = resolveQuickAction(action);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Unknown quick action.",
      });
    }

    const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };

    const reply = await generateChatResponse({
      message: prompt,
      conversationHistory,
      settings: mergedSettings,
    });

    return res.json({ success: true, message: reply });
  } catch (err) {
    return handleGeminiError(err, res);
  }
}

function handleGeminiError(err, res) {
  console.error("Gemini request failed:", err?.message || err);

  if (err?.message === "MISSING_API_KEY") {
    return res.status(500).json({
      success: false,
      message: "AI service is not configured.",
    });
  }

  if (err?.message === "EMPTY_RESPONSE") {
    return res.status(502).json({
      success: false,
      message: "Sorry, I couldn't process your request right now. Please try again.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Sorry, I couldn't process your request right now. Please try again.",
  });
}
