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

type ApiError = Error & {
  body?: ErrorBody;
  status?: number;
  rawText?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text().catch(() => "");
    const parsedBody = contentType.includes("application/json")
      ? (() => {
          try {
            return rawText ? JSON.parse(rawText) : undefined;
          } catch {
            return undefined;
          }
        })()
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

    const err = new Error(message) as ApiError;
    err.body = errorData;
    err.status = response.status;
    err.rawText = rawText;
    throw err;
  }

  const text = await response.text();

  if (!text) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
