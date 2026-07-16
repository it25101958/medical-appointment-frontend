"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, CalendarDays, X } from "lucide-react";

import { Button } from "@/components/ui";
import {
  appointmentApi,
  AppointmentStatusBadge,
  type AppointmentResponse,
} from "@/features/appointments";
import { getErrorMessage } from "@/lib/utils";

interface UpcomingAppointmentHighlightProps {
  patientId?: number;
  appo;
  isPatientLoading?: boolean;
  refreshKey?: number;
  onBookAppointment: () => void;
  onViewVisits: () => void;
}

function getAppointmentTime(value: AppointmentResponse) {
  const dateTime = new Date(
    `${value.appointmentDate}T${value.appointmentTime}`,
  ).getTime();

  return Number.isNaN(dateTime) ? Number.POSITIVE_INFINITY : dateTime;
}

function getUpcomingAppointment(appointments: AppointmentResponse[]) {
  const now = Date.now();

  return appointments
    .filter((appointment) => {
      const status = appointment.status?.toUpperCase();

      return (
        status !== "COMPLETED" &&
        status !== "CANCELLED" &&
        getAppointmentTime(appointment) >= now
      );
    })
    .sort((left, right) => getAppointmentTime(left) - getAppointmentTime(right))
    .at(0);
}

function getRelativeDayLabel(appointment?: AppointmentResponse | null) {
  if (!appointment) return "No appointment selected";

  const today = new Date();
  const appointmentDate = new Date(`${appointment.appointmentDate}T00:00:00`);

  if (Number.isNaN(appointmentDate.getTime())) {
    return "Upcoming";
  }

  today.setHours(0, 0, 0, 0);
  appointmentDate.setHours(0, 0, 0, 0);

  const daysAway = Math.round(
    (appointmentDate.getTime() - today.getTime()) / 86_400_000,
  );

  if (daysAway === 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  if (daysAway > 1) return `In ${daysAway} days`;

  return "Upcoming";
}

export function UpcomingAppointmentHighlight({
  patientId,
  isPatientLoading = false,
  refreshKey = 0,
  onBookAppointment,
  onViewVisits,
}: UpcomingAppointmentHighlightProps) {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(
    Boolean(patientId) || isPatientLoading,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [dismissedAppointmentId, setDismissedAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!patientId) {
      setAppointments([]);
      setIsLoading(isPatientLoading);
      return;
    }

    let isMounted = true;
    const resolvedPatientId = patientId;

    async function loadUpcomingAppointment() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await appointmentApi.getMyVisits(resolvedPatientId);

        if (isMounted) {
          setAppointments(data || []);
        }
      } catch (error) {
        if (isMounted) {
          setAppointments([]);
          setErrorMessage(
            getErrorMessage(error, "Could not load your next appointment"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUpcomingAppointment();

    return () => {
      isMounted = false;
    };
  }, [isPatientLoading, patientId, refreshKey]);

  const upcomingAppointment = useMemo(
    () => getUpcomingAppointment(appointments),
    [appointments],
  );

  if (
    upcomingAppointment &&
    dismissedAppointmentId === upcomingAppointment.appointmentId
  ) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="col-span-12">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-4  pt-0 shadow-sm sm:px-5  sm:pt-0">
          <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-primary/40" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (!upcomingAppointment) {
    return (
      <motion.section
        className="col-span-12"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-4  pt-0 shadow-sm sm:px-5 sm: sm:pt-0">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary/30" />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {errorMessage ||
                "No upcoming appointment is scheduled right now."}
            </p>
            <Button size="sm" onClick={onBookAppointment}>
              <CalendarClock className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </motion.section>
    );
  }

  const relativeDayLabel = getRelativeDayLabel(upcomingAppointment);

  return (
    <motion.section
      className="col-span-12"
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-4  pt-0 shadow-sm sm:px-5 sm: sm:pt-0"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-1 bg-primary"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <div className="relative flex flex-col py-4 gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <h3 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              You have an appintment {relativeDayLabel} with{" "}
              {upcomingAppointment.doctor?.fullName || "your doctor"} at{" "}
              {upcomingAppointment.appointmentTime}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button size="sm" variant="outline" onClick={onViewVisits}>
              <CalendarDays className="h-4 w-4" />
              View Appointment
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="shrink-0"
              onClick={() =>
                setDismissedAppointmentId(upcomingAppointment.appointmentId)
              }
              aria-label="Dismiss next appointment banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
