import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";

const modules = import.meta.glob("../../external-content/**/*.md", {
  eager: true,
  as: "raw",
});

export default function Articles() {
  return (
    <div className="min-h-screen bg-[#070B18] text-gray-100 p-6 space-y-8">
      {Object.entries(modules).map(([path, content]) => {
        const name = path.split("/").pop()?.replace(".md", "");
        return (
          <div key={path}>
            <h2 className="text-2xl font-bold mb-4">{name}</h2>
            <MarkdownRenderer content={content as string} />
          </div>
        );
      })}
    </div>
  );
}
