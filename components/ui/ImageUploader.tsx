"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import { deleteImage, uploadImage, type EntityType } from "@/lib/api/images";

interface ImageUploaderProps {
  entityType: EntityType;
  entityId?: string;
  currentUrl?: string;
  onUploaded: (record: { public_url: string }) => void;
  /** "banner" = full-width 3:1, "logo" = small square, "square" = medium square */
  variant?: "banner" | "logo" | "square";
  className?: string;
}

export function ImageUploader({
  entityType,
  entityId,
  currentUrl,
  onUploaded,
  variant = "square",
  className = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClass =
    variant === "banner"
      ? "w-full aspect-[3/1]"
      : variant === "logo"
      ? "w-20 h-20"
      : "w-24 h-24";

  const radiusClass = variant === "logo" ? "rounded-2xl" : "rounded-[20px]";

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const record = await uploadImage(file, entityType, entityId);
      if (uploadedImageId && uploadedImageId !== record.id) {
        try {
          await deleteImage(uploadedImageId);
        } catch {
          toast.warning("No se pudo limpiar la imagen anterior");
        }
      }
      setUploadedImageId(record.id);
      setPreview(record.public_url);
      onUploaded(record);
      toast.success("Imagen actualizada");
    } catch {
      setPreview(currentUrl);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`relative group cursor-pointer overflow-hidden ${sizeClass} ${radiusClass} ${className}`}
      onClick={() => !uploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />

      {preview ? (
        <img src={preview} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[var(--surface)] border-2 border-dashed border-[var(--border)]">
          <Upload className="h-5 w-5 text-[var(--muted-foreground)]" />
          <span className="text-[11px] text-[var(--muted-foreground)] font-medium">Subir imagen</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
        {uploading ? (
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
            <Camera className="h-5 w-5 text-white drop-shadow" />
            <span className="text-[10px] text-white font-bold drop-shadow">Cambiar</span>
          </div>
        )}
      </div>
    </div>
  );
}
