"use server";

import { revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api-client";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  createCachedReadOptions,
  createScopedCacheTag,
} from "@/lib/cache";

const laboratoryReadOptions = createCachedReadOptions(
  [CACHE_TAGS.laboratories],
  CACHE_REVALIDATE_SECONDS.long,
);

function getLaboratoryReadOptions(laboratoryId: number) {
  return createCachedReadOptions(
    [
      CACHE_TAGS.laboratories,
      createScopedCacheTag(CACHE_TAGS.laboratories, laboratoryId),
    ],
    CACHE_REVALIDATE_SECONDS.long,
  );
}

function invalidateLaboratoryCache(laboratoryId?: number) {
  revalidateTag(CACHE_TAGS.laboratories, "max");

  if (laboratoryId) {
    revalidateTag(createScopedCacheTag(CACHE_TAGS.laboratories, laboratoryId), "max");
  }
}

export interface Laboratory {
  laboratoryId: number;
  name: string;
  address: string;
  openingHours: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LaboratoryPayload {
  name: string;
  address: string;
  openingHours: string;
  phone: string;
  email: string;
}

export async function getLaboratories(): Promise<Laboratory[]> {
  return await apiRequest("/laboratory", laboratoryReadOptions);
}

export async function getLaboratory(laboratoryId: number): Promise<Laboratory> {
  return await apiRequest(
    `/laboratory/${laboratoryId}`,
    getLaboratoryReadOptions(laboratoryId),
  );
}

export async function createLaboratory(
  payload: LaboratoryPayload,
): Promise<Laboratory> {
  const laboratory = await apiRequest<Laboratory>("/laboratory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateLaboratoryCache(laboratory.laboratoryId);
  return laboratory;
}

export async function updateLaboratory(
  laboratoryId: number,
  payload: LaboratoryPayload,
): Promise<Laboratory> {
  const laboratory = await apiRequest<Laboratory>(`/laboratory/${laboratoryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateLaboratoryCache(laboratoryId);
  return laboratory;
}

export async function deleteLaboratory(laboratoryId: number): Promise<void> {
  await apiRequest(`/laboratory/${laboratoryId}`, {
    method: "DELETE",
  });

  invalidateLaboratoryCache(laboratoryId);
}
