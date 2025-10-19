// src/components/CodeBlock.tsx
import React, { useMemo, useState } from "react";
import Prism from "../prism-setup"; // import your prism setup file
import { parseHighlightMeta } from "../lib/highlight-meta";

export interface CodeBlockProps {
  code: string;
  language?: string;
  meta?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "plaintext",
  meta,
  showLineNumbers = true,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const prismLang = Prism.languages[language] || Prism.languages.markup;

  // highlight code only once
  const htmlLines = useMemo(() => {
    const html = Prism.highlight(code, prismLang, language);
    const lines = html.split("\n");
    if (code.endsWith("\n")) lines.push("");
    return lines;
  }, [code, language, prismLang]);

  const highlighted = useMemo(
    () => parseHighlightMeta(meta, htmlLines.length),
    [meta, htmlLines.length]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-[#0B1020] ${className}`}
    >
      {/* Header bar */}
      <div className="flex justify-between items-center px-3 py-2 text-xs text-gray-400 border-b border-gray-800">
        <div className="flex gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-200 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code area */}
      <pre className="m-0 p-0 font-mono text-sm overflow-x-auto">
        <code className="grid grid-cols-[auto_1fr] min-w-full">
          {htmlLines.map((html, i) => {
            const lineNo = i + 1;
            const isHL = highlighted.has(lineNo);
            return (
              <React.Fragment key={i}>
                {showLineNumbers && (
                  <span
                    className={`select-none text-right pr-3 pl-2 tabular-nums text-xs ${
                      isHL ? "bg-gray-800/60" : ""
                    } text-gray-500`}
                  >
                    {lineNo}
                  </span>
                )}
                <span
                  className={`block px-3 leading-6 ${
                    isHL ? "bg-gray-800/60" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: html || " " }}
                />
              </React.Fragment>
            );
          })}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
