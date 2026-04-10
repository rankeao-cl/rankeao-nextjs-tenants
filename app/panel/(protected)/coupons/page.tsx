"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/lib/hooks/use-coupons";
import { getCouponUsages } from "@/lib/api/coupons";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { Coupon, CouponUsage } from "@/lib/types/coupons";

// Modular Components
import { CouponHeader } from "./components/CouponHeader";
import { CouponList } from "./components/CouponList";
import { CouponFormModal } from "./components/CouponFormModal";
import { CouponUsagesModal } from "./components/CouponUsagesModal";

export default function CouponsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCoupons({ page, query: query || undefined });
  const coupons = data?.items ?? [];
  const meta = data?.meta;

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Partial<Coupon> | null>(null);

  const [showUsagesModal, setShowUsagesModal] = useState(false);
  const [usages, setUsages] = useState<CouponUsage[]>([]);
  const [loadingUsages, setLoadingUsages] = useState(false);
  const [activeCouponCode, setActiveCouponCode] = useState("");

  const handleOpenForm = (coupon?: Coupon) => {
    setSelectedCoupon(coupon || { code: "", discount_type: "PERCENTAGE", discount_value: 0, status: "ACTIVE" });
    setShowFormModal(true);
  };

  const handleUpdateFormData = (data: Partial<Coupon>) => {
    setSelectedCoupon(data);
  };

  const handleSaveCoupon = async (data: Partial<Coupon>) => {
    if (!data.code || data.discount_value === undefined) {
      return toast.error("Código y Descuento son requeridos");
    }
    try {
      if (data.id) {
        await updateMutation.mutateAsync({ id: data.id, data: data as Record<string, unknown> });
        toast.success("Cupón actualizado");
      } else {
        await createMutation.mutateAsync(data as Record<string, unknown>);
        toast.success("Cupón creado");
      }
      setShowFormModal(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al guardar cupón"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar cupón? Esta acción no se puede deshacer.")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Cupón eliminado");
    } catch {
      toast.error("Error al eliminar el cupón");
    }
  };

  const handleViewUsages = async (id: string, code: string) => {
    setActiveCouponCode(code);
    setShowUsagesModal(true);
    setLoadingUsages(true);
    try {
      const data = await getCouponUsages(id);
      setUsages(data);
    } catch {
      toast.error(`Error al cargar usos del cupón ${code}`);
      setShowUsagesModal(false);
    } finally {
      setLoadingUsages(false);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <CouponHeader onNewCoupon={() => handleOpenForm()} />

      <CouponList
        coupons={coupons}
        isLoading={isLoading}
        query={query}
        onQueryChange={setQuery}
        page={page}
        totalPages={meta?.total_pages || 1}
        totalItems={meta?.total || 0}
        onPageChange={setPage}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
        onViewUsages={handleViewUsages}
      />

      <CouponFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        coupon={selectedCoupon}
        onSave={handleSaveCoupon}
        saving={saving}
      />

      <CouponUsagesModal
        open={showUsagesModal}
        onOpenChange={setShowUsagesModal}
        usages={usages}
        loading={loadingUsages}
        couponCode={activeCouponCode}
      />
    </div>
  );
}
