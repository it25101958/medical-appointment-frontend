// src/features/appointments/components/appointment-status-badge.tsx

import { StatusBadge } from "@/components/ui";
import { AppointmentStatus } from "../types/appointment.types";

export function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  return <StatusBadge status={status} />;
}
