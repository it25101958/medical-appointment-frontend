import type { AppointmentResponse } from "../types/appointment.types";

// Basic permission helpers — adjust logic as needed.
export function canEditAppointment(_appointment: AppointmentResponse) {
  return true;
}

export function canDeleteAppointment(_appointment: AppointmentResponse) {
  return true;
}

export default null;
