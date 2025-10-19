import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.tsx";

// MarkdownRenderer component
interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer:
 * - Parses Markdown to React elements
 * - Uses our custom <CodeBlock /> for syntax-highlighted code fences
 * - Supports inline code, tables, lists, etc.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components: Partial<Components> = {
    // Customize how <code> blocks are rendered
    code({ node, inline, className, children, ...props }: any) {
      const txt = String(children ?? "");

      // inline code (like `example`)
      if (inline) {
        return (
          <code
            className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded text-[0.9em] font-mono"
            {...props}
          >
            {txt}
          </code>
        );
      }

      // fenced code blocks
      const match = /language-(\w+)/.exec(className || "");
      const language = match?.[1];
      // Some markdown processors support `{1,3-5}` meta to highlight lines
      // You can extract that if your markdown generator uses it
      const meta = node?.data?.meta as string | undefined;

      return (
        <CodeBlock
          code={txt.replace(/\n$/, "")}
          language={language || "plaintext"}
          meta={meta}
          showLineNumbers
        />
      );
    },
    // Headings with custom Tailwind classes
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-100">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-200">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-300">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-300">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-1 text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-1 text-gray-300">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 mb-4">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-700 text-sm text-gray-300">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-700 px-3 py-2 bg-gray-800 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-700 px-3 py-2">{children}</td>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        {children}
      </a>
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;