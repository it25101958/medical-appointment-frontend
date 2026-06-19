import { apiRequest } from "@/lib/api-client";

export interface DoctorResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  nic?: string;
  NIC?: string;
  address: string;
  isActive: boolean;
  roleType: number;
  doctorId: number;
  specialization: string;
  licenseNumber: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  createdAt?: string;
  updatedAt?: string;
}

export function getDoctorDisplayName(
  doctor: Pick<DoctorResponse, "firstName" | "lastName" | "doctorId">,
) {
  const fullName = [doctor.firstName, doctor.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || `Doctor ${doctor.doctorId}`;
}

export function getDoctorOptionLabel(doctor: DoctorResponse) {
  const specialization = doctor.specialization.replaceAll("_", " ");
  const fee = Number(doctor.consultationFee);
  const parts = [
    getDoctorDisplayName(doctor),
    specialization || null,
    Number.isFinite(fee) ? `Rs. ${fee.toLocaleString("en-LK")}` : null,
  ].filter(Boolean);

  return parts.join(" - ");
}

export const doctorApi = {
  getOptions: async () => {
    return apiRequest<DoctorResponse[]>("/doctor/options", {
      method: "GET",
    });
  },
};
