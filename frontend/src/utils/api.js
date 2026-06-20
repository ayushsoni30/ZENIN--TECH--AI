import axios from "axios";

// Base API instance — points to our Express backend
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_ID || "http://localhost:5173/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 second timeout (AI can be slow)
});

// ── Chat API functions ──────────────────────────────────────────────

// Send a message to the chatbot
export const sendMessage = (message, sessionId = null) =>
  api.post("/chat/message", { message, sessionId });

// Get all saved chat sessions (for sidebar history)
export const getAllSessions = () => api.get("/chat/sessions");

// Load a specific session's messages by its ID
export const getSession = (sessionId) => api.get(`/chat/session/${sessionId}`);

// Delete a specific session
export const deleteSession = (sessionId) =>
  api.delete(`/chat/session/${sessionId}`);

// Delete all sessions
export const clearAllSessions = () => api.delete("/chat/sessions/all");

export default api;
