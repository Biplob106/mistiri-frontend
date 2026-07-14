import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-8 shadow-sm">
      {children}
    </div>
  );
}