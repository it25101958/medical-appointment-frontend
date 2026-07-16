"use server";

import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import {
  authenticateLogin,
  requestAction as requestAuthAction,
  requestPasswordReset,
  type ActionResult,
  type LoginAudience,
  type LoginValues,
} from "./auth.service";

interface VerificationRequest {
  email: string;
  code: string;
}

interface ResendVerificationRequest {
  email: string;
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

export async function loginAction(
  values: LoginValues,
  audience: LoginAudience = "portal",
) {
  const cookieStore = await cookies();

  return authenticateLogin({
    apiRequest,
    audience,
    cookieStore,
    values,
  });
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
  return requestAuthAction(apiRequest, "/auth/verify", values);
}

export async function resendVerificationAction(
  values: ResendVerificationRequest,
) {
  return requestAuthAction(apiRequest, "/auth/resend-verification", values);
}

export async function forgotPasswordAction(values: { email: string }) {
  return requestPasswordReset(apiRequest, values);
}
