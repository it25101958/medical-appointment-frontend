import React from "react";

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) {
    return text;
  }

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <>
      {parts.map((part, idx) => (
        <span
          key={idx}
          className={
            part.toLowerCase() === query.toLowerCase()
              ? "bg-purple-300 dark:bg-purple-600 text-foreground font-medium"
              : ""
          }
        >
          {part}
        </span>
      ))}
    </>
  );
}
