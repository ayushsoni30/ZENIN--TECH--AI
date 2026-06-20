import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Eraser,
} from "lucide-react";

function Sidebar({ sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession, onClearAll, isLoading }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Format a date nicely--- "Today", "Yesterday", or "Mar 15"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <aside
      className={`relative flex flex-col bg-surface-800 border-r border-surface-600 transition-all duration-300 ease-in-out flex-shrink-0 ${
        collapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-surface-600 border border-surface-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-500 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-surface-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0 glow-green" >
            <Terminal size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-display font-bold text-white text-sm leading-tight">
                ZeniN 
              </h1>
              <p className="text-xs text-brand-500">Artificial Inteligence</p>
            </div>
          )}
        </div>
      </div>

      {/* New Chat button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-2.5 bg-yellow-600 hover:bg-brand-500 text-white rounded-xl px-3 py-2.5 text-sm font-medium font-body transition-all duration-200 glow-green ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Plus size={16} />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat history list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {!collapsed && (
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider px-2 mb-2">
            Your Recent Chats ⬇️
          </p>
        )}

        {isLoading && !collapsed && (
          <div className="text-xs text-slate-600 px-2 py-4 text-center">
            Loading history...
          </div>
        )}

        {sessions.length === 0 && !isLoading && !collapsed && (
          <div className="text-center py-8 px-2">
            <MessageSquare size={24} className="text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-600">
              No chats yet. Start a conversation!
            </p>
          </div>
        )}

        {sessions.map((session) => {
          const isActive = session.sessionId === activeSessionId;
          return (
            <div
              key={session.sessionId}
              className={`group relative flex items-center gap-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                collapsed ? "p-2 justify-center" : "px-3 py-2.5"
              } ${
                isActive
                  ? "session-active border-brand-700/50 text-brand-400"
                  : "border-transparent hover:bg-surface-700 hover:border-surface-500 text-slate-400 hover:text-slate-300"
              }`}
              onClick={() => onSelectSession(session.sessionId)}
            >
              <MessageSquare
                size={15}
                className={`flex-shrink-0 ${isActive ? "text-brand-500" : ""}`}
              />

              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">
                      {session.title}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>

                  {/* Delete button (appears on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Don't trigger session select
                      onDeleteSession(session.sessionId);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear all button at the bottom */}
      {sessions.length > 0 && !collapsed && (
        <div className="p-3 border-t border-surface-600">
          {showConfirm ? (
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">Clear all chats?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { onClearAll(); setShowConfirm(false); }}
                  className="flex-1 text-xs bg-red-900/50 hover:bg-red-900 text-red-400 rounded-lg py-1.5 transition-colors"
                >
                  Yes, clear
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 text-xs bg-surface-700 hover:bg-surface-600 text-slate-400 rounded-lg py-1.5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-red-400 py-1.5 transition-colors rounded-lg hover:bg-surface-700"
            >
              <Eraser size={12} />
              Clear history
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
