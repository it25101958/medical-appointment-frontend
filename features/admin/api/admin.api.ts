import { apiRequest } from "@/lib/api-client";
import type {
  AdminUserDetails,
  LoadCurrent,
  PageableResponse,
} from "../types/admin.types";
import type { User } from "@/features/admin";

const USERS_BASE = "/users";

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
  );
}

export async function toggleActive(userId: number, active: boolean) {
  return apiRequest(
    `${USERS_BASE}/${active ? "activate" : "deactivate"}/${userId}`,
    {
      method: "PATCH",
    },
  );
}

export async function changeRole(userId: number, newRoleType: number) {
  return apiRequest(`${USERS_BASE}/role/${userId}?newRoleType=${newRoleType}`, {
    method: "PATCH",
  });
}

export async function getUser(userId: number): Promise<AdminUserDetails> {
  return apiRequest<AdminUserDetails>(`${USERS_BASE}/${userId}`);
}

export async function updateUser(userId: number, payload: unknown) {
  return apiRequest(`${USERS_BASE}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface UserOption {
  userId: number;
  firstName?: string;
  lastName?: string;
}

export async function getUsersByRole(roleType: number): Promise<UserOption[]> {
  return apiRequest<UserOption[]>(`${USERS_BASE}/role/${roleType}`, {
    method: "GET",
    cache: "no-store",
  });
}
