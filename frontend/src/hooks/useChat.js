import { useState, useCallback } from "react";
import { sendMessage as apiSendMessage, getSession } from "../utils/api";

// This hook manages all the chat state and logic.,It's separated from the UI so components stay clean.
export function useChat() {
  const [messages, setMessages] = useState([]);      // Current conversation messages
  const [sessionId, setSessionId] = useState(null);  // Active session ID
  const [isLoading, setIsLoading] = useState(false); // Is AI thinking?
  const [error, setError] = useState(null);           // error to display

  // Send a message and handle the response
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    // Immediately show the user's message in the UI
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiSendMessage(text.trim(), sessionId);
      const { reply, sessionId: newSessionId } = response.data;

      // Update session ID 
      setSessionId(newSessionId);

      // Add the assistant's reply
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMsg);

      // Remove the user message if it failed (so they can retry)
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  // Load an existing session from the DB
  const loadSession = useCallback(async (sid) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSession(sid);
      const session = response.data;

      // Map the DB format to our UI format
      const loadedMessages = session.messages.map((msg, idx) => ({
        id: idx,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));

      setMessages(loadedMessages);
      setSessionId(session.sessionId);
    } catch (err) {
      setError("Failed to load this conversation.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a fresh conversation
  const newChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    loadSession,
    newChat,
    setError,
  };
}
