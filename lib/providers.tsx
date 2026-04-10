"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { Toast } from "@heroui/react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Force light mode — remove any dark class from previous sessions
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.removeAttribute("data-theme");
    localStorage.removeItem("rankeao-panel-theme");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toast.Provider placement="top end" />
    </QueryClientProvider>
  );
}
