import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";
import ErrorToast from "../components/ErrorToast";
import { useChat } from "../hooks/useChat";
import { useHistory } from "../hooks/useHistory";

function ChatPage() {
  const {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    loadSession,
    newChat,
    setError,
  } = useChat();

  const {
    sessions,
    isLoading: historyLoading,
    fetchSessions,
    removeSession,
    clearAll,
  } = useHistory();

  // Reference to the bottom of the message list for auto-scrolling
  const bottomRef = useRef(null);

  // Scroll to bottom whenever new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // After a successful message, refresh the sidebar history
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      fetchSessions();
    }
  }, [sessionId, messages.length]);

  // Handle clicking a past session in the sidebar
  const handleSelectSession = (sid) => {
    if (sid === sessionId) return; // Already viewing this session
    loadSession(sid);
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    newChat();
  };

  // Handle deleting a session from the sidebar
  const handleDeleteSession = async (sid) => {
    await removeSession(sid);
    // If we deleted the active session, start fresh
    if (sid === sessionId) {
      newChat();
    }
  };

  // Handle clearing all history
  const handleClearAll = async () => {
    await clearAll();
    newChat();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      {/* ── Left Sidebar ── */}
      <Sidebar
        sessions={sessions}
        activeSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAll}
        isLoading={historyLoading}
      />

      {/* ── Main Chat Area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-surface-700 bg-surface-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-display font-semibold text-white text-sm">
                {isEmpty ? "New Conversation" : sessions.find((s) => s.sessionId === sessionId)?.title || "Technical Chat"}
              </h2>
              <p className="text-xs text-slate-600">
                {isEmpty
                  ? "Ask me anything technical"
                  : `${messages.length} message${messages.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isLoading ? "bg-yellow-500 animate-pulse" : "bg-brand-500"
              }`}
            />
            <span className="text-slate-500">
              {isLoading ? "Generating..." : "Ready"}
            </span>
          </div>
        </header>

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* Welcome screen when no messages */}
            {isEmpty && !isLoading && <WelcomeScreen />}

            {/* Render all messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator while AI is thinking */}
            {isLoading && <TypingIndicator />}

            {/* Invisible element at the bottom to scroll to */}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Input area ── */}
        <div className="border-t border-surface-700 bg-surface-800/50 backdrop-blur-sm px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={sendMessage}
              isLoading={isLoading}
              isEmpty={isEmpty}
            />
          </div>
        </div>
      </main>

      {/* ── Error toast ── */}
      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </div>
  );
}

export default ChatPage;
