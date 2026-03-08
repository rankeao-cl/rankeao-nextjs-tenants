"use client";
import { Toast, toast } from '@heroui/react';
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                {children}
                <Toast.Provider placement="top end" />
            </AuthProvider>
        </ThemeProvider>
    );
}
