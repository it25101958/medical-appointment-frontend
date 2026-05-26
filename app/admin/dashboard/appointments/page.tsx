// src/app/(dashboard)/appointments/page.tsx

"use client";

import SharedAppointmentsPage from "@/features/appointments/components/shared-appointments-page";

export default function AppointmentsPage() {
  return <SharedAppointmentsPage role="ADMIN" />;
}
