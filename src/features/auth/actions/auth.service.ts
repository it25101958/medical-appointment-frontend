import { getErrorMessage } from "../../../lib/utils";

export interface LoginValues {
  email: string;
  password: string;
}

export type LoginAudience = "patient" | "portal";

export interface LoginResponse {
  token: string;
  user: {
    roleType: number;
    roleName: string;
    accessLevel: string;
  };
}

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export type AuthApiRequest = <T = unknown>(
  endpoint: string,
  options?: RequestInit & {
    next?: {
      revalidate?: number;
      tags?: string[];
    };
  },
) => Promise<T>;

export interface CookieWriter {
  set: (
    name: string,
    value: string,
    options?: Record<string, unknown>,
  ) => void;
}

const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  "If an account exists, a reset code will be sent.";

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

export async function authenticateLogin({
  apiRequest,
  audience = "portal",
  cookieStore,
  nodeEnv = process.env.NODE_ENV,
  values,
}: {
  apiRequest: AuthApiRequest;
  audience?: LoginAudience;
  cookieStore: CookieWriter;
  nodeEnv?: string;
  values: LoginValues;
}) {
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

    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: nodeEnv === "production",
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

export async function requestAction<T>(
  apiRequest: AuthApiRequest,
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

export async function requestPasswordReset(
  apiRequest: AuthApiRequest,
  values: { email: string },
): Promise<ActionResult> {
  try {
    await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: values.email.trim() }),
    });
  } catch {
    // Avoid account enumeration by keeping the response identical.
  }

  return {
    success: true,
    message: FORGOT_PASSWORD_SUCCESS_MESSAGE,
  };
}
