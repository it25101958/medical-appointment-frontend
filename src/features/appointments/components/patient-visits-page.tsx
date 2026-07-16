"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  DataTable,
  PageHeader,
  SearchBar,
  StatusBadge,
  type Column,
} from "@/components/ui";
import { AppointmentDetailsDialog } from "@/features/appointments";
import { AppointmentStatusBadge } from "@/features/appointments";
import { appointmentApi } from "@/features/appointments";
import type { AppointmentResponse } from "@/features/appointments";
import {
  formatDateOnly,
  formatTime,
} from "@/features/shared/util/format-date";
import { apiRequest } from "@/lib/api-client";
import { highlightText } from "@/lib/highlight-search";
import { getErrorMessage } from "@/lib/utils";

interface CurrentUser {
  userId: number;
  firstName?: string;
  lastName?: string;
}

function toComparableDateTime(value: AppointmentResponse) {
  return new Date(
    `${value.appointmentDate}T${value.appointmentTime}`,
  ).getTime();
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function PatientVisitsPage() {
  const [patient, setPatient] = useState<CurrentUser | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const loadVisits = useCallback(async (patientId?: number) => {
    if (!patientId) return;

    setIsLoading(true);
    try {
      const data = await appointmentApi.getMyVisits(patientId);
      setAppointments(data || []);
    } catch (error) {
      toast.error("Could not load visits", {
        description: getErrorMessage(error),
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadPatientAndVisits = async () => {
      try {
        const currentUser = await apiRequest<CurrentUser>("/users/me", {
          method: "GET",
          cache: "no-store",
        });

        setPatient(currentUser);
        await loadVisits(currentUser.userId);
      } catch (error) {
        toast.error("Could not load patient profile", {
          description: getErrorMessage(error),
        });
        setIsLoading(false);
      }
    };

    loadPatientAndVisits();
  }, [loadVisits]);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => toComparableDateTime(b) - toComparableDateTime(a),
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const query = normalize(deferredSearchQuery);
    if (!query) return sortedAppointments;

    return sortedAppointments.filter((appointment) => {
      const haystack = [
        appointment.appointmentId?.toString(),
        appointment.appointmentNumber?.toString(),
        appointment.appointmentDate,
        appointment.appointmentTime,
        appointment.appointmentType,
        appointment.status,
        appointment.doctorId?.toString(),
        appointment.doctor?.fullName,
        appointment.doctor?.specialization,
        appointment.room?.roomNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [deferredSearchQuery, sortedAppointments]);

  const visitColumns: Column<AppointmentResponse>[] = [
    {
      header: "Appointment",
      render: (appointment) => (
        <button
          type="button"
          className="cursor-pointer text-left font-medium hover:text-primary hover:underline"
          onClick={() => setSelectedAppointment(appointment)}
        >
          {appointment.appointmentNumber}
        </button>
      ),
      className: "",
    },
    {
      header: "Date",
      render: (appointment) => (
        <span className="text-sm text-muted-foreground">
          {formatDateOnly(appointment.appointmentDate)}
        </span>
      ),
      className: "",
    },
    {
      header: "Time",
      render: (appointment) => (
        <span className="text-sm text-muted-foreground">
          {formatTime(appointment.appointmentTime)}
        </span>
      ),
      className: "",
    },
    {
      header: "Doctor",
      render: (appointment) =>
        highlightText(
          appointment.doctor?.fullName || `${appointment.doctorId}`,
          deferredSearchQuery,
        ),
      className: "",
    },
    {
      header: "Type",
      render: (appointment) => (
        <StatusBadge status={appointment.appointmentType} />
      ),
      className: "",
    },
    {
      header: "Status",
      render: (appointment) => (
        <AppointmentStatusBadge status={appointment.status} />
      ),
      className: "",
    },
  ];

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <PageHeader
        title="My Visits"
        description="Review your appointment history and open each visit to view full details."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadVisits(patient?.userId);
            }}
            disabled={!patient?.userId || isLoading}
            aria-label="Refresh visits"
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        }
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by appointment, doctor, date, type, room, or status"
        resultCount={filteredAppointments.length}
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <DataTable
          columns={visitColumns}
          data={filteredAppointments}
          pageable
          pageSize={10}
          pageSizeOptions={[5, 10, 50]}
          isLoading={isLoading}
          showActions={false}
          minWidth="1120px"
          emptyMessage="No visits found for your account."
        />
      </div>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
