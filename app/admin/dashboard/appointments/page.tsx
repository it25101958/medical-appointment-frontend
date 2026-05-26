// src/app/(dashboard)/appointments/page.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";
import { AppointmentTable } from "@/features/appointments";

export default function AppointmentsPage() {
  const { appointments, isLoading, refetch } = useAppointments();

  // Replace this later with your real auth user role.
  const currentUserRole = "ADMIN";
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
