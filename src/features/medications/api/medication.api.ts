"use server";

import { revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api-client";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  createCachedReadOptions,
} from "@/lib/cache";

export interface Medication {
  medicationId: number;
  name: string;
  genericName: string;
  manufacturer: string;
  dosage: string;
  dosageForm: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationPayload {
  name: string;
  genericName: string;
  manufacturer: string;
  dosage: string;
  dosageForm: string;
  status: string;
}

const medicationReadOptions = {
  ...createCachedReadOptions(
    [CACHE_TAGS.medications],
    CACHE_REVALIDATE_SECONDS.medium,
  ),
};

function invalidateMedicationCache() {
  revalidateTag(CACHE_TAGS.medications, "max");
}

export async function getMedications(): Promise<Medication[]> {
  return (await apiRequest(
    "/medication",
    medicationReadOptions,
  )) as Medication[];
}

export async function getMedication(medicationId: number): Promise<Medication> {
  return (await apiRequest(
    `/medication/${medicationId}`,
    medicationReadOptions,
  )) as Medication;
}

export async function searchMedications(name: string): Promise<Medication[]> {
  return (await apiRequest(
    `/medication/search?name=${encodeURIComponent(name)}`,
    medicationReadOptions,
  )) as Medication[];
}

export async function searchMedicationsByGenericName(
  name: string,
): Promise<Medication[]> {
  return (await apiRequest(
    `/medication/search/generic?name=${encodeURIComponent(name)}`,
    medicationReadOptions,
  )) as Medication[];
}

export async function getMedicationsByStatus(
  status: string,
): Promise<Medication[]> {
  return (await apiRequest(
    `/medication/status/${encodeURIComponent(status)}`,
    medicationReadOptions,
  )) as Medication[];
}

export async function getMedicationsByDosageForm(
  form: string,
): Promise<Medication[]> {
  return (await apiRequest(
    `/medication/dosage-form/${encodeURIComponent(form)}`,
    medicationReadOptions,
  )) as Medication[];
}

export async function getMedicationsByManufacturer(
  name: string,
): Promise<Medication[]> {
  return (await apiRequest(
    `/medication/manufacturer?name=${encodeURIComponent(name)}`,
    medicationReadOptions,
  )) as Medication[];
}

export async function createMedication(
  payload: MedicationPayload,
): Promise<Medication> {
  const medication = (await apiRequest("/medication", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })) as Medication;

  invalidateMedicationCache();
  return medication;
}

export async function updateMedication(
  medicationId: number,
  payload: MedicationPayload,
): Promise<Medication> {
  const medication = (await apiRequest(`/medication/${medicationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })) as Medication;

  invalidateMedicationCache();
  return medication;
}

export async function updateMedicationStatus(
  medicationId: number,
  status: string,
): Promise<Medication> {
  const medication = (await apiRequest(
    `/medication/${medicationId}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PATCH",
    },
  )) as Medication;

  invalidateMedicationCache();
  return medication;
}

export async function deleteMedication(medicationId: number): Promise<void> {
  await apiRequest(`/medication/${medicationId}`, {
    method: "DELETE",
  });

  invalidateMedicationCache();
}
