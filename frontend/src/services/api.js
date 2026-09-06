const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function postJSON(path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    return {
      success: false,
      message: "Sorry, I couldn't process your request right now. Please try again.",
    };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = { success: false, message: "Unexpected server response." };
  }
  return data;
}

export function sendChatMessage({ message, conversationHistory, settings }) {
  return postJSON("/chat", { message, conversationHistory, settings });
}

export function sendQuickAction({ action, conversationHistory, settings }) {
  return postJSON("/chat/quick-action", { action, conversationHistory, settings });
}
