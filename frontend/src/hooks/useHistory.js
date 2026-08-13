import { useState, useEffect, useCallback } from "react";
import { getAllSessions, deleteSession, clearAllSessions, setAuthToken } from "../utils/api";

// Manages the list of all past chat sessions shown in the sidebar
export function useHistory(user) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all sessions from the DB
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSessions();
      setSessions(response.data);
    } catch (err) {
      console.error("Failed to load sessions:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a single session
  const removeSession = useCallback(async (sessionId) => {
    try {
      await deleteSession(sessionId);
      // Remove from local state immediately (optimistic update)
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch (err) {
      console.error("Failed to delete session:", err.message);
    }
  }, []);

  // Clear all sessions
  const clearAll = useCallback(async () => {
    try {
      await clearAllSessions();
      setSessions([]);
    } catch (err) {
      console.error("Failed to clear sessions:", err.message);
    }
  }, []);

  // Load sessions only after user is authenticated and header is configured
  useEffect(() => {
    if (user?.sub) {
      setAuthToken(user.sub);
      fetchSessions();
    } else {
      setAuthToken(null);
    }
  }, [user, fetchSessions]);

  return { sessions, isLoading, fetchSessions, removeSession, clearAll };
}
