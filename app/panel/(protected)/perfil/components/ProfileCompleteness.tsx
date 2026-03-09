"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton } from "@heroui/react";
import { CheckCircle2, Circle } from "lucide-react";
import { getMyTenant, getTenantSchedules, getTenantSocialLinks, listPaymentMethods } from "@/lib/api/tenant";
import type { ScheduleDay, SocialLink, PaymentMethod } from "@/lib/types/tenant";

interface CheckItem {
    label: string;
    done: boolean;
}

export function ProfileCompleteness() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<CheckItem[]>([]);

    useEffect(() => {
        async function fetchAll() {
            try {
                const [tenant, schedules, socialLinks, paymentMethods] = await Promise.all([
                    getMyTenant(),
                    getTenantSchedules().catch(() => [] as ScheduleDay[]),
                    getTenantSocialLinks().catch(() => [] as SocialLink[]),
                    listPaymentMethods().catch(() => [] as PaymentMethod[]),
                ]);

                const checks: CheckItem[] = [
                    { label: "Nombre de tienda", done: !!tenant.name },
                    { label: "Slug (URL)", done: !!tenant.slug },
                    { label: "Logo", done: !!(tenant.logo_url || tenant.logo) },
                    { label: "Banner", done: !!(tenant.banner_url || tenant.banner) },
                    { label: "Ciudad o región", done: !!(tenant.city || tenant.region) },
                    { label: "Horarios configurados", done: schedules.some((s: ScheduleDay) => !s.is_closed) },
                    { label: "Red social activa", done: socialLinks.some((l: SocialLink) => l.is_active && !!l.url) },
                    { label: "Método de pago activo", done: paymentMethods.some((m: PaymentMethod) => m.is_active) },
                ];

                setItems(checks);
            } catch {
                setItems([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    if (loading) {
        return (
            <Card className="bg-[var(--surface)] border border-[var(--border)] p-5">
                <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-48 rounded-lg" />
                    <Skeleton className="h-5 w-12 rounded-lg" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
            </Card>
        );
    }

    const doneCount = items.filter((i) => i.done).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const pending = items.filter((i) => !i.done);

    return (
        <Card className="bg-[var(--surface)] border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Completitud del Perfil
                </h3>
                <span
                    className={`text-sm font-bold ${percentage === 100
                            ? "text-emerald-400"
                            : percentage >= 60
                                ? "text-amber-400"
                                : "text-red-400"
                        }`}
                >
                    {percentage}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${percentage === 100
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : percentage >= 60
                                ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                : "bg-gradient-to-r from-red-500 to-red-400"
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Checklist */}
            {percentage < 100 && pending.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {pending.map((item) => (
                        <span
                            key={item.label}
                            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] bg-[var(--surface-sunken)] border border-[var(--border)] px-2.5 py-1 rounded-full"
                        >
                            <Circle className="w-3 h-3 text-[var(--muted)]" />
                            {item.label}
                        </span>
                    ))}
                </div>
            )}
            {percentage === 100 && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">¡Perfil completo! Tu tienda está lista.</span>
                </div>
            )}
        </Card>
    );
}
