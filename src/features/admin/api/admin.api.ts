"use server";

import { revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api-client";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  createCachedReadOptions,
  createScopedCacheTag,
} from "@/lib/cache";
import type {
  AdminUserDetails,
  LoadCurrent,
  PageableResponse,
} from "../types/admin.types";
import type { User } from "@/features/admin";

const USERS_BASE = "/users";

function getUsersByRoleReadOptions(roleType: number) {
  return createCachedReadOptions(
    [CACHE_TAGS.users, createScopedCacheTag(CACHE_TAGS.users, `role:${roleType}`)],
    CACHE_REVALIDATE_SECONDS.medium,
  );
}

function invalidateUserOptionCache() {
  revalidateTag(CACHE_TAGS.users, "max");
  revalidateTag(CACHE_TAGS.doctors, "max");
}

export async function loadCurrent(): Promise<LoadCurrent> {
  return apiRequest<LoadCurrent>(`${USERS_BASE}/me`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function fetchUsers(
  page = 0,
  size = 10,
): Promise<PageableResponse<User>> {
  return apiRequest<PageableResponse<User>>(
    `${USERS_BASE}?page=${page}&size=${size}&sort=userId,asc`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
}

export async function toggleActive(userId: number, active: boolean) {
  const result = await apiRequest(
    `${USERS_BASE}/${active ? "activate" : "deactivate"}/${userId}`,
    {
      method: "PATCH",
    },
  );

  invalidateUserOptionCache();
  return result;
}

export async function changeRole(userId: number, newRoleType: number) {
  const result = await apiRequest(`${USERS_BASE}/role/${userId}?newRoleType=${newRoleType}`, {
    method: "PATCH",
  });

  invalidateUserOptionCache();
  return result;
}

export async function getUser(userId: number): Promise<AdminUserDetails> {
  return apiRequest<AdminUserDetails>(`${USERS_BASE}/${userId}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function updateUser(userId: number, payload: unknown) {
  const result = await apiRequest(`${USERS_BASE}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateUserOptionCache();
  return result;
}

export interface UserOption {
  userId: number;
  firstName?: string;
  lastName?: string;
}

export async function getUsersByRole(roleType: number): Promise<UserOption[]> {
  return apiRequest<UserOption[]>(
    `${USERS_BASE}/role/${roleType}`,
    getUsersByRoleReadOptions(roleType),
  );
}
