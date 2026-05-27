import React from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Đã sao chép");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      title="Sao chép"
      aria-label="Sao chép code"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
};

const MarkdownRenderer = ({ content, isBot }) => {
  if (!content) return null;

  return (
    <div className="prose-sm max-w-none">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className={
                isBot
                  ? "text-zinc-900 hover:text-zinc-700 font-semibold underline"
                  : "text-white hover:text-zinc-100 font-semibold underline"
              }
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-4 mb-2 last:mb-0 space-y-1"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-4 mb-2 last:mb-0 space-y-1"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-bold mb-2 mt-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm font-bold mb-1.5 mt-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-semibold mb-1 mt-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className={`border-l-[3px] pl-3 py-1 my-2 rounded-r-md text-sm
                ${
                  isBot
                    ? "border-zinc-400 text-zinc-600 bg-zinc-50"
                    : "border-white/40 text-white/80 bg-white/10"
                }`}
              {...props}
            />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeStr = String(children).replace(/\n$/, "");

            if (!inline) {
              return (
                <div className="my-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-800">
                    <span className="text-[11px] font-mono text-slate-400">
                      {match?.[1] || "code"}
                    </span>
                    <CopyButton text={codeStr} />
                  </div>
                  <div className="p-3.5 overflow-x-auto bg-[#1a1d2e]">
                    <code
                      className="text-[12.5px] font-mono text-slate-200 whitespace-pre"
                      {...props}
                    >
                      {children}
                    </code>
                  </div>
                </div>
              );
            }

            return (
              <code
                className={`px-1.5 py-0.5 rounded-md font-mono text-[0.88em]
                  ${
                    isBot
                      ? "bg-zinc-150 text-zinc-800 border border-zinc-200/50"
                      : "bg-white/20 text-white"
                  }`}
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2 rounded-xl border border-slate-200 shadow-sm">
              <table
                className="min-w-full divide-y divide-slate-100"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3 py-2 bg-slate-50 text-left text-xs font-semibold text-slate-600"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-3 py-2 text-[13px] border-t border-slate-50"
              {...props}
            />
          ),
          hr: () => <hr className="my-3 border-slate-100" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
