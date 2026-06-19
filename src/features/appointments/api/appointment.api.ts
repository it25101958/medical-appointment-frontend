// src/features/appointments/api/appointment.api.ts

import { apiRequest } from "@/lib/api-client";
import {
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  AppointmentStatusUpdateRequest,
  AppointmentResponse,
} from "../types/appointment.types";

const BASE_URL = "/appointment";

export const appointmentApi = {
  getAll: async () => {
    return apiRequest<AppointmentResponse[]>(BASE_URL);
  },

  getById: async (appointmentId: number) => {
    return apiRequest<AppointmentResponse>(`${BASE_URL}/${appointmentId}`);
  },

  getMyToday: async () => {
    return apiRequest<AppointmentResponse[]>(`${BASE_URL}/my/today`, {
      method: "GET",
      cache: "no-store",
    });
  },

  getMyVisits: async (patientId: number) => {
    const attempts = [
      () =>
        apiRequest<AppointmentResponse[]>(`${BASE_URL}/my`, {
          method: "GET",
          cache: "no-store",
        }),
      () =>
        apiRequest<AppointmentResponse[]>(`${BASE_URL}/patient/${patientId}`, {
          method: "GET",
          cache: "no-store",
        }),
    ];

    let lastError: unknown;

    for (const attempt of attempts) {
      try {
        const data = await attempt();
        if (Array.isArray(data)) {
          return data;
        }
      } catch (error) {
        lastError = error;
      }
    }

    try {
      const allAppointments = await apiRequest<AppointmentResponse[]>(
        BASE_URL,
        {
          method: "GET",
          cache: "no-store",
        },
      );
      return (allAppointments || []).filter(
        (appointment) => appointment.patientId === patientId,
      );
    } catch {
      throw lastError instanceof Error
        ? lastError
        : new Error("Could not load your visits");
    }
  },

  create: async (payload: AppointmentCreateRequest) => {
    return apiRequest<AppointmentResponse>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAvailableSlots: async (doctorId: number, date: string) => {
    return apiRequest<string[]>(
      `${BASE_URL}/available-slots?doctorId=${encodeURIComponent(String(doctorId))}&date=${encodeURIComponent(date)}`,
      {
        method: "GET",
      },
    );
  },

  update: async (appointmentId: number, data: AppointmentUpdateRequest) => {
    return apiRequest<AppointmentResponse>(`${BASE_URL}/${appointmentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (
    appointmentId: number,
    data: AppointmentStatusUpdateRequest,
  ) => {
    return apiRequest<AppointmentResponse>(
      `${BASE_URL}/${appointmentId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  cancel: async (appointmentId: number) => {
    return apiRequest<void>(`${BASE_URL}/${appointmentId}`, {
      method: "DELETE",
    });
  },
};
