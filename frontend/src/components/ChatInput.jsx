import React, { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";

// suggested prompts when no chats are there.
const SUGGESTED_PROMPTS = [
  "is techpile good?",
  "How does React's useEffect hook work?",
  "What is the CAP theorem in distributed systems?",
  "Write a binary search algorithm in Python",
  "Explain Docker containers vs virtual machines",
  "What are SOLID principles in OOP?",
];

function ChatInput({ onSend, isLoading, isEmpty }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Autoo-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText("");
      //Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // Send on Enter and allow Shift+Enter for new lines)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      {/* Suggested prompt*/}
      {isEmpty && (
        <div className="flex flex-wrap gap-2 justify-center px-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSend(prompt)}
              disabled={isLoading}
              className="text-xs bg-surface-700 hover:bg-surface-600 border border-surface-500 hover:border-brand-700 text-slate-400 hover:text-brand-400 px-3 py-1.5 rounded-full transition-all duration-200 font-body"
            >
              {prompt.length > 45 ? prompt.substring(0, 45) + "..." : prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-3 bg-surface-700 border border-surface-500 hover:border-surface-400 focus-within:border-brand-600 rounded-2xl px-4 py-3 transition-all duration-200 focus-within:shadow-[0_0_0_2px_#22c55e30]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything technical... (Shift+Enter for new line)"
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none outline-none font-body leading-relaxed min-h-[24px] max-h-[160px] disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${text.trim() && !isLoading
              ? "bg-brand-600 hover:bg-brand-500 text-white glow-green"
              : "bg-surface-600 text-slate-600 cursor-not-allowed"
            }`}
        >
          <Send size={15} />
        </button>
      </div>

      {/* Footer wala */}
      <p className="text-center text-xs text-slate-700">
        ZeniN is specialized for technical topics only • <sub>Developed by Ayush</sub>
      </p>
    </div>
  );
}

export default ChatInput;
