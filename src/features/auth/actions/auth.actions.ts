"use server";

import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface LoginValues {
  email: string;
  password: string;
}

interface VerificationRequest {
  email: string;
  code: string;
}

interface ResendVerificationRequest {
  email: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nic: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact?: string;
  bloodGroup?: string;
  allergies?: string;
}

type LoginAudience = "patient" | "portal";

interface LoginResponse {
  token: string;
  user: {
    roleType: number;
    roleName: string;
    accessLevel: string;
  };
}

function isAllowedRole(role: number | undefined, audience: LoginAudience) {
  if (!role) return false;
  return audience === "patient" ? role === 4 : role !== 4;
}

function getRoleErrorMessage(audience: LoginAudience) {
  return audience === "patient"
    ? "This login is only for patients. Staff, doctors, and admins should use the portal login."
    : "This portal is for staff, doctors, and admins. Patients should use the patient login.";
}

function extractServerMessage(error: unknown) {
  if (!error || typeof error !== "object") return null;
  const body = (error as { body?: Record<string, unknown> }).body;
  if (!body) return null;

  const message = body.message || body.error || body.detail;
  return typeof message === "string" && message.trim() ? message : null;
}

async function requestAction<T>(
  endpoint: string,
  payload: T,
): Promise<ActionResult> {
  try {
    await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error: unknown) {
    const serverMessage = extractServerMessage(error);

    return {
      success: false,
      error: serverMessage || getErrorMessage(error),
    };
  }
}

export async function loginAction(
  values: LoginValues,
  audience: LoginAudience = "portal",
) {
  try {
    const data = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!isAllowedRole(data.user.roleType, audience)) {
      return {
        success: false,
        error: getRoleErrorMessage(audience),
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("user-role", data.user.roleType.toString(), { path: "/" });

    return {
      success: true,
      role: data.user.roleType,
      roleName: data.user.roleName,
      accessLevel: data.user.accessLevel,
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("user-role", "", {
    path: "/",
    maxAge: 0,
  });

  return { success: true };
}

export async function registerAction(payload: RegisterPayload) {
  try {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return {
      success: true,
      message:
        "Registration successful. Please check your email for the verification code.",
      data: response,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function verifyAccountAction(values: VerificationRequest) {
  return requestAction("/auth/verify", values);
}

export async function resendVerificationAction(
  values: ResendVerificationRequest,
) {
  return requestAction("/auth/resend-verification", values);
}
