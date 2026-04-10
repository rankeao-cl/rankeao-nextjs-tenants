"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProducts, useDeleteProduct } from "@/lib/hooks/use-products";
import { getErrorMessage } from "@/lib/utils/error-message";
import { EditProductModal } from "./components/EditProductModal";
import { CreateProductModal } from "./components/CreateProductModal";
import { ProductHeader } from "./components/ProductHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductList } from "./components/ProductList";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, query: query || undefined });
  const products = data?.items ?? [];
  const meta = data?.meta;

  const deleteMutation = useDeleteProduct();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Producto eliminado exitosamente");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar producto"));
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://rankeao-go-gateway-production.up.railway.app/api/v1";
    const host = baseUrl.replace(/\/api\/v1\/?$/, "");
    return `${host}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ProductHeader onAddProduct={() => setCreateModalOpen(true)} />

      <div className="space-y-6">
        <ProductFilters query={query} onQueryChange={(val) => { setQuery(val); setPage(1); }} />

        <ProductList 
          products={products} 
          isLoading={isLoading} 
          onEdit={(id) => { setSelectedProductId(id); setEditModalOpen(true); }}
          onDelete={handleDelete}
          getImageUrl={getImageUrl}
        />

        {/* Pagination Section */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white border border-[var(--c-gray-200)] rounded-2xl shadow-sm">
            <p className="text-[13px] text-[var(--c-gray-500)] font-semibold">
              Página <span className="text-[var(--c-gray-800)]">{meta.page}</span> de <span className="text-[var(--c-gray-800)]">{meta.total_pages}</span> · {meta.total} productos
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 px-4 text-[13px] font-bold border-[var(--c-gray-200)] text-[var(--c-gray-600)] rounded-xl hover:bg-[var(--c-gray-50)]"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 px-4 text-[13px] font-bold border-[var(--c-gray-200)] text-[var(--c-gray-600)] rounded-xl hover:bg-[var(--c-gray-50)]"
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        productId={selectedProductId}
        onProductUpdated={() => {}}
      />
    </div>
  );
}
