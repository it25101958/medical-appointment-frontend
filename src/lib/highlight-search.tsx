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
              ? "bg-yellow-300 dark:bg-yellow-600 text-foreground font-medium rounded px-0.5"
              : ""
          }
        >
          {part}
        </span>
      ))}
    </>
  );
}
