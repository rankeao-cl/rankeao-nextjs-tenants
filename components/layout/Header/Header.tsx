"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
} from "@heroui/react";
import { Menu, LogOut, User, Settings } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_GROUPS, type NavMainGroup, type NavItem } from "@/lib/constants/nav-items";
import { RankeaoLogo } from "@/components/icons/RankeaoLogo";
import s from "./styles/Header.module.css";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const user = useAuthStore((st) => st.user);
  const logout = useAuthStore((st) => st.logout);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/panel/login");
  };

  // Find the active Top-Level Group based on the current URL
  const activePathGroup = NAV_GROUPS.find((g) => {
    if (g.href && (pathname === g.href || pathname.startsWith(g.href + "/"))) return true;
    if (g.sections) {
      return g.sections.some((sec) =>
        sec.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
      );
    }
    return false;
  });

  // Extract all valid Sub-Items of the active group to display in the Header
  const headerNavItems: NavItem[] = activePathGroup?.sections 
    ? activePathGroup.sections.flatMap(sec => sec.items) 
    : [];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#e2e8f0] bg-white flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
      <div className="flex items-center">
        {/* Logo */}
        <div className="flex items-center mr-4 md:mr-8 border-none md:border-r border-[#eaeff4] md:pr-6">
          <div className="flex items-center justify-start shrink-0">
             <RankeaoLogo className="h-7 w-auto transition-colors text-foreground" />
          </div>
        </div>
      </div>

      {/* Horizontal Sub-Navigation (Context-Aware) perfectly centered with Framer Motion */}
      <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 xl:gap-2">
          <AnimatePresence mode="popLayout">
            {headerNavItems.map((item, idx) => {
              const isItemActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.25, delay: idx * 0.04, ease: "easeOut" }}
                  onClick={() => router.push(item.href)}
                  className={`text-[14px] font-medium transition-colors px-3 py-1.5 rounded-full ${
                    isItemActive
                      ? "bg-[#eff9fa] text-[#334155]" // Very light cyan background with deep slate text based on mockup
                      : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#334155]"
                  }`}
                >
                  {item.label}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </nav>
      <div className="flex items-center gap-4">
        {/* Help button (Outlined cyan Bsale style) */}
        <button 
          className="hidden sm:flex items-center px-4 py-1 rounded-full border border-[#009baf] text-[#009baf] text-[14px] font-semibold hover:bg-[#e2f6f8]/50 transition-colors"
          type="button"
        >
          Ayuda
        </button>

        {/* Settings */}
        <button
          className="text-[#758392] hover:text-[#333941] transition-colors"
          onClick={() => router.push("/panel/perfil")}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* User profile Popover */}
        <div className="ml-2">
          <Popover>
            <PopoverTrigger className="rounded-full cursor-pointer flex border-2 border-transparent hover:border-[#009baf]/40 transition-colors outline-none">
              <Avatar size="sm" className="h-[34px] w-[34px] bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]">
                {user?.avatar_url ? (
                  <Avatar.Image src={user.avatar_url} alt="Avatar" />
                ) : null}
                <Avatar.Fallback delayMs={600}>
                  {user?.username?.[0]?.toUpperCase() || "AD"}
                </Avatar.Fallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] max-w-[calc(100vw-2rem)] p-0 overflow-hidden bg-white border border-[#e2e8f0] shadow-lg !rounded-[20px]">
              {/* User Info Header */}
              <div className="relative">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#009baf]" />
                <div className="flex items-center gap-3 px-4 py-4 pt-5">
                  <Avatar size="sm" className="ring-2 ring-[#009baf]/30 bg-[#f8fafc] text-[#64748b]">
                    {user?.avatar_url ? (
                      <Avatar.Image src={user.avatar_url} alt="Avatar" />
                    ) : null}
                    <Avatar.Fallback delayMs={600}>
                      {user?.username?.[0]?.toUpperCase() || "AD"}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-[#2d3748] truncate">{user?.username || "Usuario Admin"}</p>
                    <p className="text-[11px] text-[#64748b] truncate">{user?.email || "admin@rutten.cl"}</p>
                  </div>
                </div>
              </div>

              {/* Menu Sections */}
              <div className="border-t border-[#e2e8f0]">
                <div className="p-1.5">
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Mi cuenta</p>
                  <button onClick={() => router.push("/panel/perfil")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer border-none bg-transparent">
                    <User className="h-4 w-4 text-[#64748b]" />
                    <span className="text-sm text-[#2d3748]">Mi Perfil</span>
                  </button>
                  <button onClick={() => router.push("/panel/tienda")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer border-none bg-transparent">
                    <Settings className="h-4 w-4 text-[#64748b]" />
                    <span className="text-sm text-[#2d3748]">Configuración Tienda</span>
                  </button>
                </div>

                <div className="border-t border-[#e2e8f0] p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-left border-none bg-transparent"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500 font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
