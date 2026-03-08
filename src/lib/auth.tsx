"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, clearTokens } from "@/lib/api-panel";

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar_url?: string;
    tenant_id?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function checkAuth() {
            const token = getToken();

            if (!token) {
                if (mounted) {
                    setIsLoading(false);
                    setUser(null);
                }
                return;
            }

            try {
                const storedUser = localStorage.getItem("rankeao_panel_user");
                if (storedUser && mounted) {
                    setUser(JSON.parse(storedUser));
                } else if (!storedUser && mounted) {
                    setUser(null);
                }
            } catch {
                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        checkAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const logout = () => {
        clearTokens();
        setUser(null);
        window.location.href = "/panel/login";
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
