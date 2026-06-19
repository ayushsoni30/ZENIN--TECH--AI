import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Terminal, User, Copy, Check } from "lucide-react";
import { useState } from "react";

// Renders a single chat message bubble — both user and assistant
function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Copy message text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format timestamp nicely
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`message-enter flex gap-3 group ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-1 ${
          isUser
            ? "bg-brand-600 text-white"
            : "bg-surface-700 border border-brand-800 text-brand-400"
        }`}
      >
        {isUser ? (
          <User size={16} />
        ) : (
          <Terminal size={16} />
        )}
      </div>

      {/* Message content */}
      <div
        className={`flex flex-col max-w-[85%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Role label + timestamp */}
        <div
          className={`flex items-center gap-2 mb-1 text-xs text-slate-500 ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="font-medium text-slate-400">
            {isUser ? "You" : "TechBot"}
          </span>
          <span>•</span>
          <span>{time}</span>
        </div>

        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 ${
            isUser
              ? // User messages: brand green style
                "bg-brand-900 border border-brand-700 text-brand-50 rounded-tr-sm text-sm leading-relaxed"
              : // Assistant messages: dark surface style
                "bg-surface-700 border border-surface-500 rounded-tl-sm w-full"
          }`}
        >
          {isUser ? (
            // Plain text for user messages
            <p className="font-body text-sm">{message.content}</p>
          ) : (
            // Rich markdown for assistant messages
            // prose-green applies our custom green color scheme
            // prose-invert makes it work on dark backgrounds
            <div className="prose prose-sm prose-green prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style inline code differently
                  code({ node, inline, className, children, ...props }) {
                    if (inline) {
                      return (
                        <code
                          className="font-mono text-brand-300 bg-surface-800 px-1.5 py-0.5 rounded text-xs border border-surface-500"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    // Extract language from className (e.g., "language-javascript")
                    const language = className?.replace("language-", "") || "";
                    return (
                      <div className="relative group/code not-prose">
                        {/* Language badge */}
                        {language && (
                          <div className="absolute top-3 left-4 text-xs font-mono text-brand-500 uppercase tracking-wider">
                            {language}
                          </div>
                        )}
                        {/* Copy code button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(String(children));
                          }}
                          className="absolute top-2 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity bg-surface-600 hover:bg-surface-500 text-slate-400 hover:text-white px-2 py-1 rounded text-xs font-body"
                        >
                          Copy
                        </button>
                        <pre className="bg-[#0d1117] border border-surface-600 rounded-xl p-4 overflow-x-auto text-sm font-mono text-slate-200 mt-0 mb-0">
                          <code
                            className={`${className} ${language ? "pt-4 block" : ""}`}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  // Style links
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
                      >
                        {children}
                      </a>
                    );
                  },
                  // Style tables
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto rounded-lg border border-surface-600 my-3">
                        <table className="w-full text-sm">{children}</table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="bg-surface-800 text-brand-400 font-semibold px-4 py-2 text-left border-b border-surface-600">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="px-4 py-2 text-slate-300 border-b border-surface-700">
                        {children}
                      </td>
                    );
                  },
                  // Style blockquotes
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-brand-600 bg-brand-950/30 px-4 py-2 rounded-r-lg my-3 not-italic">
                        {children}
                      </blockquote>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button for assistant messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? (
              <>
                <Check size={12} className="text-brand-500" />
                <span className="text-brand-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy response</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
