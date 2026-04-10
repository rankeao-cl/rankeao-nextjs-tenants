"use client";

import { Button } from "@/components/ui/button";

interface CouponHeaderProps {
  onNewCoupon: () => void;
}

export function CouponHeader({ onNewCoupon }: CouponHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
          Cupones
        </h1>
        <p className="text-sm text-[var(--c-gray-500)] mt-1">
          Gestiona los descuentos y promociones de tu tienda
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="default" 
          onClick={onNewCoupon}
          className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white rounded-xl shadow-sm transition-all"
        >
          Nuevo Cupón
        </Button>
      </div>
    </div>
  );
}
