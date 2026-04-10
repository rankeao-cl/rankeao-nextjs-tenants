"use client";

// Light-only theme - no dark mode support
export function useTheme() {
  return {
    theme: "light" as const,
    setTheme: () => {},
    toggleTheme: () => {},
  };
}
