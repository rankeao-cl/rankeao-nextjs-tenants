"use client";

import { Card } from "@heroui/react";
import { PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { getPanelInventoryValuation } from "@/lib/api-panel";
import { getErrorMessage } from "@/lib/error-message";
import { toast } from "@heroui/react";

export default function DashboardPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        getPanelInventoryValuation()
            .then(setStats)
            .catch((err) => toast.danger(getErrorMessage(err, "No se pudieron cargar las estadísticas")));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                    Panel de Tienda
                </h1>
                <p className="text-[var(--muted)] mt-1">Resumen general de tu negocio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[var(--surface)] border border-[var(--border)]">
                    <Card.Content className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                                <PackageSearch className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--muted)]">Total Inventario (Retail)</p>
                                <p className="text-2xl font-bold text-[var(--foreground)]">
                                    ${stats?.total_retail_value || 0}
                                </p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
            {/* The rest of the dashboard layout left blank for future widgets */}
        </div>
    );
}

