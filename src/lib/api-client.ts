"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.INTERNAL_BACKEND_URL;

type ErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  errors?: Array<{ message?: string }>;
  [key: string]: unknown;
};

export type ApiError = Error & {
  body?: ErrorBody;
  endpoint?: string;
  method?: string;
  status?: number;
  rawText?: string;
  cause?: unknown;
};

type ApiErrorMeta = {
  body?: ErrorBody;
  cause?: unknown;
  endpoint?: string;
  method?: string;
  rawText?: string;
  status?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function createApiError(
  message: string,
  meta: ApiErrorMeta = {},
) {
  const error = new Error(message) as ApiError;

  Object.assign(error, meta);

  return error;
}

function getRequestMethod(options: RequestInit) {
  return (options.method || "GET").toUpperCase();
}

function getApiUrl(endpoint: string) {
  if (!BASE_URL) {
    throw createApiError("Backend URL is not configured.", { endpoint });
  }

  return `${BASE_URL}${endpoint}`;
}

function parseJsonSafely(value: string) {
  try {
    return value ? JSON.parse(value) : undefined;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit & {
    next?: {
      revalidate?: number;
      tags?: string[];
    };
  } = {},
): Promise<T> {
  const method = getRequestMethod(options);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response: Response;

  try {
    response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    throw createApiError(
      error instanceof Error
        ? error.message
        : "Could not connect to the backend API.",
      {
        cause: error,
        endpoint,
        method,
      },
    );
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text().catch(() => "");
    const parsedBody = contentType.includes("application/json")
      ? parseJsonSafely(rawText)
      : undefined;

    const errorData: ErrorBody = isRecord(parsedBody)
      ? {
          ...(parsedBody as ErrorBody),
        }
      : rawText
        ? { message: rawText }
        : {};

    const message =
      errorData?.message ||
      errorData?.error ||
      errorData?.detail ||
      rawText ||
      `Request failed with status ${response.status}`;

    throw createApiError(message, {
      body: errorData,
      endpoint,
      method,
      rawText,
      status: response.status,
    });
  }

  const text = await response.text();

  if (!text) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (parseJsonSafely(text) ?? text) as T;
  }

  return (parseJsonSafely(text) ?? text) as T;
}

function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    ("status" in error || "body" in error || "endpoint" in error)
  );
}
