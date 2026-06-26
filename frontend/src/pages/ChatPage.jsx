import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";
import ErrorToast from "../components/ErrorToast";
import { useChat } from "../hooks/useChat";
import { useHistory } from "../hooks/useHistory";
import { useAuth0 } from "@auth0/auth0-react";



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
  const {
  isAuthenticated,
  loginWithRedirect,
  logout,
  user,
} = useAuth0();

  
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
if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="absolute w-72 h-72 bg-purple-400 blur-[180px] rounded-full"></div>
      <div className="absolute w-72 h-72 bg-green-500/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md p-8 relative">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center">
          <h1 className="text-5xl font-bold text-white mb-3">
            ZENIN
          </h1>

          <p className="text-gray-400 mb-8">
            Your AI Technical Mentor
          </p>

          <button
            onClick={() => loginWithRedirect()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Continue to Zenin
          </button>

          <p className="text-gray-500 text-sm mt-6">
            Secure authentication powered by Auth0
          </p>
        </div>
      </div>
    </div>
  );
}
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

         {/* #login and logout butto */}
          <div className="flex items-center gap-3">
  {isAuthenticated ? (
    <>
      <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-500 flex-shrink-0">
    <img
      src={user?.picture}
      alt={user?.name}
      
      className="w-full h-full object-cover"
    />
  </div>

  <div>
    
    <p className="text-sm font-medium text-white">
      {user?.name}
    </p>
    <p className="text-xs text-slate-400">
      {user?.email}
    </p>
  </div>
</div>

      <button
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
        className="px-3 py-1 rounded bg-red-500 text-white text-sm"
      >
        Logout
      </button>
    </>
  ) : (
    <button
      onClick={() => loginWithRedirect()}
      className="px-3 py-1 rounded bg-brand-500 text-white text-sm"
    >
      Login
    </button>
  )}
  
</div>    
             {/* Status indicator  */}
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
