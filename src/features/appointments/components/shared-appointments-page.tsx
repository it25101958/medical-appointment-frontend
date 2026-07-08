"use client";

import { useMemo, useState } from "react";

import { Button, PageHeader } from "@/components/ui";
import { AppointmentTable } from "@/features/appointments";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";
import type {
  AppointmentResponse,
  AppointmentStatus,
} from "@/features/appointments";

type AppointmentFilter = "today" | "all" | AppointmentStatus;

const statusFilters: Array<{ value: AppointmentStatus; label: string }> = [
  { value: "PENDING", label: "Pending" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function getTodayDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getAppointmentTimeValue(appointment: AppointmentResponse) {
  return new Date(
    `${appointment.appointmentDate}T${appointment.appointmentTime || "00:00"}`,
  ).getTime();
}

export default function SharedAppointmentsPage({ role }: { role?: string }) {
  const { appointments, isLoading, refetch } = useAppointments();
  const [activeFilter, setActiveFilter] =
    useState<AppointmentFilter>("today");

  const currentUserRole = role ?? "PATIENT";
  const canManage = ["ADMIN", "STAFF", "DOCTOR"].includes(
    currentUserRole.toUpperCase(),
  );
  const today = getTodayDateString();

  const filteredAppointments = useMemo(() => {
    const nextAppointments =
      activeFilter === "all"
        ? appointments
        : activeFilter === "today"
          ? appointments.filter(
              (appointment) => appointment.appointmentDate === today,
            )
          : appointments.filter(
              (appointment) => appointment.status === activeFilter,
            );

    return [...nextAppointments].sort(
      (left, right) =>
        getAppointmentTimeValue(left) - getAppointmentTimeValue(right),
    );
  }, [activeFilter, appointments, today]);

  const filterOptions = useMemo(
    () => [
      {
        value: "today" as const,
        label: "Today",
        count: appointments.filter(
          (appointment) => appointment.appointmentDate === today,
        ).length,
      },
      {
        value: "all" as const,
        label: "All",
        count: appointments.length,
      },
      ...statusFilters.map((filter) => ({
        ...filter,
        count: appointments.filter(
          (appointment) => appointment.status === filter.value,
        ).length,
      })),
    ],
    [appointments, today],
  );

  return (
    <div className="space-y-6 col-start-1 col-end-14">
      <PageHeader
        title="Appointments"
        description="Manage patient appointments, doctor schedules, billing, prescriptions, and lab orders."
      />

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            variant={activeFilter === filter.value ? "default" : "outline"}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
            <span className="text-xs opacity-75">{filter.count}</span>
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading appointments...
        </div>
      ) : (
        <AppointmentTable
          appointments={filteredAppointments}
          canManage={canManage}
          onChanged={refetch}
          emptyMessage={
            activeFilter === "today"
              ? "No appointments scheduled for today."
              : "No appointments found."
          }
        />
      )}
    </div>
  );
}
