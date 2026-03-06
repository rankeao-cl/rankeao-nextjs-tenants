"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, Avatar } from "@heroui/react";
import { Mail, User, Shield, Info } from "lucide-react";

export default function PerfilPage() {
    const { user, isLoading } = useAuth();

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-zinc-500 text-sm animate-pulse">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto w-full pb-12">
            <div>
                <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                    Mi Perfil
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Gestiona tu información de usuario de tienda
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left col - Avatar & basic info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40 shadow-xl shadow-black/40 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-24" />
                        <CardContent className="p-6 flex flex-col items-center text-center relative z-10 pt-10">
                            <Avatar
                                size="lg"
                                className="w-24 h-24 text-large ring-4 ring-[#0f1017] bg-white/10 text-zinc-200 mb-4"
                            >
                                {user.avatar_url ? (
                                    <Avatar.Image src={user.avatar_url} alt={user.username} />
                                ) : null}
                                <Avatar.Fallback>{user.username?.[0]?.toUpperCase() || "T"}</Avatar.Fallback>
                            </Avatar>
                            <h2 className="text-xl font-bold text-white mb-1">
                                {user.username || "Usuario Tienda"}
                            </h2>
                            <p className="text-sm text-zinc-400 mb-4">
                                Vendedor
                            </p>
                            <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                                <Shield className="w-3.5 h-3.5" />
                                {user.tenant_id ? "Tienda Vinculada" : "Gestor Principal"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right col - Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-4 h-4 text-purple-400" />
                                Información de la Cuenta
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-white/5">
                                    <div className="text-sm text-zinc-500 font-medium">Usuario</div>
                                    <div className="sm:col-span-2 text-sm text-zinc-200 font-medium">{user.username || "No asignado"}</div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-white/5">
                                    <div className="text-sm text-zinc-500 font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Correo
                                    </div>
                                    <div className="sm:col-span-2 text-sm text-zinc-200">{user.email}</div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-white/5">
                                    <div className="text-sm text-zinc-500 font-medium">ID de Tienda</div>
                                    <div className="sm:col-span-2 text-sm text-zinc-400 font-mono text-xs">{user.tenant_id || "No asignado"}</div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3">
                                    <div className="text-sm text-zinc-500 font-medium">Miembro desde</div>
                                    <div className="sm:col-span-2 text-sm text-zinc-400">
                                        {/* @ts-ignore */}
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Desconocido"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-900/10 border border-purple-500/20">
                        <CardContent className="p-4 flex gap-3">
                            <Info className="w-5 h-5 text-purple-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-purple-200 mb-1">Acerca del Perfil</h4>
                                <p className="text-xs text-purple-200/70">
                                    Actualmente la información del perfil y avatar se gestionan directamente a través de Soporte de Rankeao. Próximamente habilitaremos la edición directa.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
