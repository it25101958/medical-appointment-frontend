"use client";

import React from "react";
import { AppointmentTable } from "@/features/appointments";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";

export default function SharedAppointmentsPage({ role }: { role?: string }) {
  const { appointments, isLoading, refetch } = useAppointments();

  const currentUserRole = role ?? "PATIENT";
  const canManage = currentUserRole === "ADMIN" || currentUserRole === "STAFF";

  return (
    <div className="space-y-6 col-start-1 col-end-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-normal tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Manage patient appointments, doctor schedules, billing,
            prescriptions, and lab orders.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading appointments...
        </div>
      ) : (
        <AppointmentTable
          appointments={appointments}
          canManage={canManage}
          onChanged={refetch}
        />
      )}
    </div>
  );
}
