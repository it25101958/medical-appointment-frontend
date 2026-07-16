import { apiRequest } from "@/lib/api-client";
import {
  FeedbackRequest,
  FeedbackResponse,
  FeedbackStatus,
  FeedbackUpdateRequest,
} from "../types/feedback.types";

const BASE_URL = "/feedback";

export const feedbackApi = {
  create: async (data: FeedbackRequest) => {
    return apiRequest<FeedbackResponse>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getById: async (feedbackId: number) => {
    return apiRequest<FeedbackResponse>(`${BASE_URL}/${feedbackId}`, {
      cache: "no-store",
    });
  },

  getByPatient: async (patientId: number) => {
    return apiRequest<FeedbackResponse[]>(`${BASE_URL}/patient/${patientId}`, {
      cache: "no-store",
    });
  },

  update: async (feedbackId: number, data: FeedbackUpdateRequest) => {
    return apiRequest<FeedbackResponse>(`${BASE_URL}/${feedbackId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (feedbackId: number, status: FeedbackStatus) => {
    return apiRequest<FeedbackResponse>(
      `${BASE_URL}/${feedbackId}/status?status=${encodeURIComponent(status)}`,
      {
        method: "PATCH",
      },
    );
  },

  remove: async (feedbackId: number) => {
    return apiRequest<void>(`${BASE_URL}/${feedbackId}`, {
      method: "DELETE",
    });
  },
};
