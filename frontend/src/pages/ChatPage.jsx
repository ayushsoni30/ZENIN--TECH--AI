import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";
import ErrorToast from "../components/ErrorToast";
import { useChat } from "../hooks/useChat";
import { useHistory } from "../hooks/useHistory";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu } from "lucide-react";

function ChatPage() {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading: authLoading } = useAuth0();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  } = useHistory(user);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      fetchSessions();
    }
  }, [sessionId, messages.length]);

  // Loader screen while checking Auth0 session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center relative overflow-hidden font-body text-white">
        <div className="absolute w-[300px] h-[300px] bg-brand-500/10 blur-[150px] rounded-full top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500/10 blur-[150px] rounded-full bottom-1/4 right-1/4 animate-pulse"></div>
        
        <div className="text-center z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl flex items-center justify-center shadow-lg border border-brand-500/20 animate-bounce">
            <span className="text-white text-2xl font-bold tracking-tight font-display">Z</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-display font-bold text-white tracking-wide">Securing Connection</h2>
            <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed mx-auto">Verifying credentials and setting up your secure environment...</p>
          </div>
          
          <div className="relative w-8 h-8 mt-2">
            <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redesigned Auth0 Login page mock that initiates Auth0 flows
  if (!isAuthenticated) {
    const handleLogin = (e) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
        loginWithRedirect();
      }, 800);
    };

    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden font-body">
        {/* Background meshes */}
        <div className="absolute w-[500px] h-[500px] bg-brand-500/5 blur-[200px] rounded-full -top-40 -right-40" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/5 blur-[200px] rounded-full -bottom-40 -left-40" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0b0c15]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl mb-4 border border-brand-500/20 shadow-lg glow-green">
                <span className="text-white text-xl font-bold tracking-tight font-display">Z</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-1">Welcome to ZeniN</h2>
              <p className="text-slate-400 text-sm">Log in to continue to your AI Technical Mentor</p>
            </div>

            {/* Simulated Auth0 Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogin(); }} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-600/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting to Auth0...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-slate-500 uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Social connections */}
            <div className="space-y-3">
              <button
                onClick={() => handleLogin()}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <button
                onClick={() => handleLogin()}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-600 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <span className="text-slate-500 text-[11px] flex items-center justify-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secured by Auth0
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = messages.length === 0;

  const handleSelectSession = (sid) => {
    if (sid === sessionId) return;
    loadSession(sid);
  };

  const handleNewChat = () => newChat();

  const handleDeleteSession = async (sid) => {
    await removeSession(sid);
    if (sid === sessionId) newChat();
  };

  const handleClearAll = async () => {
    await clearAll();
    newChat();
  };

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden relative">
      {/* Mobile Sidebar overlay backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        sessions={sessions}
        activeSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAll}
        isLoading={historyLoading}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-surface-700 bg-surface-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-700/50 focus:outline-none transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-display font-semibold text-white text-sm">
                {isEmpty ? "New Conversation" : sessions.find((s) => s.sessionId === sessionId)?.title || "Technical Chat"}
              </h2>
              <p className="text-[10px] md:text-xs text-slate-600">
                {isEmpty ? "Ask me anything technical" : `${messages.length} message${messages.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-500 flex-shrink-0 flex items-center justify-center bg-brand-600 text-white text-xs font-bold font-display select-none">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}
                <span className="z-0 uppercase">
                  {user?.name ? user.name[0] : (user?.email ? user.email[0] : "U")}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name || user?.nickname || "User"}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email || "No email"}</p>
              </div>
            </div>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-xs font-medium transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {isEmpty && !isLoading && <WelcomeScreen />}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-surface-700 bg-surface-800/50 backdrop-blur-sm px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={sendMessage} isLoading={isLoading} isEmpty={isEmpty} />
          </div>
        </div>
      </main>

      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </div>
  );
}

export default ChatPage;