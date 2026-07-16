"use server";

import { revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api-client";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  createCachedReadOptions,
  createScopedCacheTag,
} from "@/lib/cache";

const labTestReadOptions = createCachedReadOptions(
  [CACHE_TAGS.labTests],
  CACHE_REVALIDATE_SECONDS.long,
);

function getLabTestReadOptions(labTestId: number) {
  return createCachedReadOptions(
    [
      CACHE_TAGS.labTests,
      createScopedCacheTag(CACHE_TAGS.labTests, labTestId),
    ],
    CACHE_REVALIDATE_SECONDS.long,
  );
}

function invalidateLabTestCache(labTestId?: number) {
  revalidateTag(CACHE_TAGS.labTests, "max");

  if (labTestId) {
    revalidateTag(createScopedCacheTag(CACHE_TAGS.labTests, labTestId), "max");
  }
}

export interface LabTest {
  id: number;
  testName: string;
  category: string;
  description: string;
  standardPrice: number | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabTestPayload {
  testName: string;
  category: string;
  description: string;
  standardPrice: number;
  isActive: boolean;
}

export async function getAllLabTests(): Promise<LabTest[]> {
  return await apiRequest("/lab-test", labTestReadOptions);
}

export async function getActiveLabTests(): Promise<LabTest[]> {
  return await apiRequest("/lab-test/active", labTestReadOptions);
}

export async function getInactiveLabTests(): Promise<LabTest[]> {
  return await apiRequest("/lab-test/inactive", labTestReadOptions);
}

export async function getLabTest(labTestId: number): Promise<LabTest> {
  return await apiRequest(`/lab-test/${labTestId}`, getLabTestReadOptions(labTestId));
}

export async function createLabTest(payload: LabTestPayload): Promise<LabTest> {
  const labTest = await apiRequest<LabTest>("/lab-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateLabTestCache(labTest.id);
  return labTest;
}

export async function updateLabTest(
  labTestId: number,
  payload: LabTestPayload,
): Promise<LabTest> {
  const labTest = await apiRequest<LabTest>(`/lab-test/${labTestId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateLabTestCache(labTestId);
  return labTest;
}

export async function deleteLabTest(labTestId: number): Promise<void> {
  await apiRequest(`/lab-test/${labTestId}`, {
    method: "DELETE",
  });

  invalidateLabTestCache(labTestId);
}
