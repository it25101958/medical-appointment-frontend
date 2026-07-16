import { apiRequest } from "@/lib/api-client";
import {
  LabOrderRequest,
  LabOrderResponse,
  LabOrderSearchParams,
} from "../types/lab-order.types";

const BASE_URL = "/lab-order";

function buildSearchQuery(params: LabOrderSearchParams) {
  const search = new URLSearchParams();

  if (params.patientId && params.patientId > 0) {
    search.set("patientId", String(params.patientId));
  }

  if (params.status?.trim()) {
    search.set("status", params.status.trim());
  }

  if (params.date?.trim()) {
    search.set("date", params.date.trim());
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export const labOrderApi = {
  create: async (data: LabOrderRequest) => {
    return apiRequest<LabOrderResponse>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getById: async (labOrderId: number) => {
    return apiRequest<LabOrderResponse>(`${BASE_URL}/${labOrderId}`, {
      cache: "no-store",
    });
  },

  update: async (labOrderId: number, data: LabOrderRequest) => {
    return apiRequest<LabOrderResponse>(`${BASE_URL}/${labOrderId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  remove: async (labOrderId: number) => {
    return apiRequest<void>(`${BASE_URL}/${labOrderId}`, {
      method: "DELETE",
    });
  },

  search: async (params: LabOrderSearchParams = {}) => {
    return apiRequest<LabOrderResponse[]>(
      `${BASE_URL}/search${buildSearchQuery(params)}`,
      {
        cache: "no-store",
      },
    );
  },
};
