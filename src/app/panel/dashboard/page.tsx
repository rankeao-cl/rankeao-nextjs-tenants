"use client";

import { Card, CardContent } from "@heroui/react";
import { PackageSearch, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { getPanelInventoryValuation } from "@/lib/api-panel";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        getPanelInventoryValuation()
            .then(setStats)
            .catch((err) => console.error("Could not load stats:", err));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                    Panel de Tienda
                </h1>
                <p className="text-zinc-500 mt-1">Resumen general de tu negocio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                <PackageSearch className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Total Inventario (Retail)</p>
                                <p className="text-2xl font-bold text-white">
                                    ${stats?.total_retail_value || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* The rest of the dashboard layout left blank for future widgets */}
        </div>
    );
}
