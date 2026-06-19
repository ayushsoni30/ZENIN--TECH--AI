import React from "react";
import { Terminal } from "lucide-react";

// Shows animated dots while the AI is generating a response
function TypingIndicator() {
  return (
    <div className="message-enter flex gap-3">
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-surface-700 border border-brand-800 text-brand-400 mt-1">
        <Terminal size={16} />
      </div>

      {/* Typing bubble */}
      <div className="flex flex-col items-start">
        <div className="mb-1 text-xs text-slate-500 font-medium">TechBot</div>
        <div className="bg-surface-700 border border-surface-500 rounded-2xl rounded-tl-sm px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 ml-1">Thinking...</p>
      </div>
    </div>
  );
}

export default TypingIndicator;
