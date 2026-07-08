// src/features/appointments/components/appointment-table.tsx

"use client";

import { useState } from "react";

import { DataTable, type Column } from "@/components/ui";

import { AppointmentResponse } from "../types/appointment.types";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";
import { AppointmentActions } from "./appointment-actions";

interface Props {
  appointments: AppointmentResponse[];
  canManage?: boolean;
  onChanged?: () => void;
  emptyMessage?: string;
}

export function AppointmentTable({
  appointments,
  canManage = false,
  onChanged,
  emptyMessage = "No appointments found",
}: Props) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);

  const columns: Column<AppointmentResponse>[] = [
    {
      header: "Appointment",
      render: (appointment) => (
        <div className="space-y-1">
          <button
            type="button"
            className="text-left text-sm font-medium hover:text-primary hover:underline"
            onClick={() => setSelectedAppointment(appointment)}
          >
            {appointment.appointmentNumber}
          </button>
        </div>
      ),
    },
    { header: "Date", accessor: "appointmentDate" },
    { header: "Time", accessor: "appointmentTime" },
    {
      header: "Patient",
      render: (appointment) => `${appointment.patient.fullName}`,
    },
    {
      header: "Doctor",
      render: (appointment) => `${appointment.doctor.fullName}`,
    },
    {
      header: "Room",
      render: (appointment) => `${appointment.room.roomNumber}`,
    },
    {
      header: "Status",
      render: (appointment) => (
        <AppointmentStatusBadge status={appointment.status} />
      ),
    },
    {
      header: "Manage",
      isAction: true,
      requiresManage: true,
      render: (appointment) => (
        <div className="flex items-center justify-center">
          <AppointmentActions appointment={appointment} onChanged={onChanged} />
        </div>
      ),
      className: "w-[120px] text-center",
      align: "center",
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <DataTable
          columns={columns}
          data={appointments}
          pageable={true}
          pageSize={10}
          canManage={canManage}
          showActions={false}
          minWidth={canManage ? "1040px" : "920px"}
          emptyMessage={emptyMessage}
        />
      </div>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </>
  );
}
