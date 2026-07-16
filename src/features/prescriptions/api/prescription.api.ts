"use server";

import { revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api-client";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  createCachedReadOptions,
  createScopedCacheTag,
} from "@/lib/cache";
import type { PrescriptionResponse } from "../types/prescription.types";

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface PrescriptionItem {
  prescriptionItemId: number;
  medicationName: string;
  dosage: string;
  quantity: number;
  specialInstructions: string;
}

export interface Prescription {
  prescriptionId: number;
  appointmentId: number;
  doctorName: string;
  patientName: string;
  prescriptionDate: string;
  status: string;
  notes: string;
  items: PrescriptionItem[];
}

export interface PrescriptionListItem {
  prescriptionId: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  status: string;
  createdAt: string;
}

export interface PrescriptionsResponse {
  content: PrescriptionListItem[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
}

export interface CreatePrescriptionItemPayload {
  medicationId: number;
  dosage: string;
  quantity: number;
  specialInstructions?: string;
}

export interface CreatePrescriptionPayload {
  appointmentId: number;
  status: string;
  notes?: string;
  items: CreatePrescriptionItemPayload[];
}

function getPrescriptionListReadOptions(scope: "all" | "my", page: number, size: number) {
  return createCachedReadOptions(
    [
      CACHE_TAGS.prescriptions,
      createScopedCacheTag(CACHE_TAGS.prescriptions, scope),
      createScopedCacheTag(CACHE_TAGS.prescriptions, `${scope}:${page}:${size}`),
    ],
    CACHE_REVALIDATE_SECONDS.short,
  );
}

function getPrescriptionReadOptions(prescriptionId: number) {
  return createCachedReadOptions(
    [
      CACHE_TAGS.prescriptions,
      createScopedCacheTag(CACHE_TAGS.prescriptions, prescriptionId),
    ],
    CACHE_REVALIDATE_SECONDS.short,
  );
}

function invalidatePrescriptionCache(prescriptionId?: number) {
  revalidateTag(CACHE_TAGS.prescriptions, "max");

  if (prescriptionId) {
    revalidateTag(createScopedCacheTag(CACHE_TAGS.prescriptions, prescriptionId), "max");
  }
}

export async function getPaginatedPrescriptions(
  page: number = 0,
  size: number = 5,
): Promise<PaginatedResponse<Prescription>> {
  return await apiRequest(`/prescription?page=${page}&size=${size}`, {
    ...getPrescriptionListReadOptions("all", page, size),
  });
}

export async function getPrescriptions(
  page: number = 0,
  size: number = 100,
): Promise<PrescriptionsResponse> {
  return await apiRequest(`/prescription?page=${page}&size=${size}`, {
    ...getPrescriptionListReadOptions("all", page, size),
  });
}

export async function getMyPrescriptions(
  page: number = 0,
  size: number = 100,
): Promise<PrescriptionsResponse> {
  return await apiRequest(`/prescription/my?page=${page}&size=${size}`, {
    ...getPrescriptionListReadOptions("my", page, size),
  });
}

export async function getPrescription(
  prescriptionId: number,
): Promise<PrescriptionResponse> {
  return await apiRequest(`/prescription/${prescriptionId}`, {
    ...getPrescriptionReadOptions(prescriptionId),
  });
}

export async function createPrescription(
  payload: CreatePrescriptionPayload,
): Promise<PrescriptionResponse> {
  const prescription = await apiRequest<PrescriptionResponse>("/prescription", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  invalidatePrescriptionCache(prescription.prescriptionId);
  return prescription;
}
