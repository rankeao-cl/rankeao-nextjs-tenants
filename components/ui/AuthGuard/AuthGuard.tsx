"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import s from "./styles/AuthGuard.module.css";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated()) {
      router.replace("/panel/login");
      return;
    }

    if (!user?.tenant_id) {
      const redirectTarget = search ? `${pathname}?${search}` : pathname;
      router.replace(`/panel/select-tenant?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }
  }, [hasHydrated, isAuthenticated, pathname, router, search, user]);

  if (!hasHydrated || !isAuthenticated() || !user?.tenant_id) {
    return (
      <div className={s.loading}>
        <div className={s.spinner} />
      </div>
    );
  }

  return <>{children}</>;
}
