"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@heroui/react";
import {
    LayoutDashboard,
    LogOut,
    ShoppingBag,
    ShoppingCart,
    PackageSearch,
    Ticket,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

const NAV_ITEMS = [
    {
        label: "Panel",
        href: "/panel/dashboard",
        icon: LayoutDashboard,
    },
] as const;

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export function Sidebar({
    collapsed,
    onToggle,
    mobileOpen,
    onMobileClose,
}: SidebarProps) {
    const pathname = usePathname();

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2a2f4b]/50">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-zinc-800 to-black">
                    <Image
                        src="/logo.png"
                        alt="Rankeao"
                        fill
                        sizes="36px"
                        className="object-contain p-1"
                        priority
                    />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="font-[var(--font-heading)] text-lg font-bold text-gradient-purple-cyan">
                            Rankeao
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Panel Tienda
                        </span>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-auto px-2 py-4 space-y-1">
                {NAV_ITEMS.map((item, i) => {
                    if ("type" in item && item.type === "divider") {
                        return (
                            <div key={i} className="pt-4 pb-1 px-3">
                                {!collapsed && (
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                                        {item.label}
                                    </span>
                                )}
                                {collapsed && <div className="border-t border-[#2a2f4b]/40 my-1" />}
                            </div>
                        );
                    }

                    if (!("href" in item)) return null;
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={`
                group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                transition-all duration-200
                ${isActive
                                    ? "bg-white/10 text-zinc-200 shadow-[inset_0_0_0_1px_rgba(248,250,252,0.22)]"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                                }
              `}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon
                                className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive
                                    ? "text-zinc-200"
                                    : "text-zinc-500 group-hover:text-zinc-300"
                                    }`}
                            />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse toggle (desktop only) */}
            <div className="hidden md:flex border-t border-[#2a2f4b]/50 p-3">
                <Button
                    variant="ghost"
                    onPress={onToggle}
                    className="w-full text-zinc-500 hover:text-zinc-300"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0a0b12] border-r border-[#2a2f4b]/40
          transition-transform duration-300 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    onPress={onMobileClose}
                    className="absolute right-3 top-4 text-zinc-500 hover:text-zinc-300"
                >
                    <X className="h-5 w-5" />
                </Button>
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`
          hidden md:flex flex-col bg-[#0a0b12] border-r border-[#2a2f4b]/40
          transition-all duration-300 shrink-0
          ${collapsed ? "w-[68px]" : "w-60"}
        `}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
