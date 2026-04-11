import { apiFetch } from "./client";

export type EntityType =
  | "user_profile"
  | "user_cover"
  | "store_logo"
  | "store_cover"
  | "product_image"
  | "tournament_cover"
  | "game_cover";

export interface PresignResponse {
  upload_url: string;
  key: string;
  expires_at: string;
}

export interface ImageRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  public_url: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export async function presignImage(
  entityType: EntityType,
  contentType: string,
  entityId?: string
): Promise<PresignResponse> {
  const raw = await apiFetch<{ success: boolean; data: PresignResponse }>("/images/presign", {
    method: "POST",
    body: { entity_type: entityType, content_type: contentType, entity_id: entityId ?? "" },
  });
  return raw.data;
}

export async function uploadToR2(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`R2 upload failed: ${res.status}`);
}

export async function confirmImage(
  key: string,
  entityType: EntityType,
  entityId?: string
): Promise<ImageRecord> {
  const raw = await apiFetch<{ success: boolean; data: ImageRecord }>("/images/confirm", {
    method: "POST",
    body: { key, entity_type: entityType, entity_id: entityId ?? "" },
  });
  return raw.data;
}

/** Full flow: presign → PUT directly to R2 → confirm → returns ImageRecord */
export async function uploadImage(
  file: File,
  entityType: EntityType,
  entityId?: string
): Promise<ImageRecord> {
  const { upload_url, key } = await presignImage(entityType, file.type, entityId);
  await uploadToR2(upload_url, file);
  return confirmImage(key, entityType, entityId);
}

export async function deleteImage(imageId: string): Promise<void> {
  await apiFetch(`/images/${imageId}`, { method: "DELETE" });
}
