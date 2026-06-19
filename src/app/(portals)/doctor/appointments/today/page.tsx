import { appointmentApi } from "@/features/appointments";
import type { AppointmentResponse } from "@/features/appointments";
import { TodayAppointmentsList } from "./today-appointments-list";
import { getErrorMessage } from "@/lib/utils";

function getTodayInSriLanka() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export default async function DoctorTodayAppointmentsPage() {
  const today = getTodayInSriLanka();

  let todayAppointments: AppointmentResponse[] = [];
  let errorMessage = "";

  try {
    const appointments = await appointmentApi.getMyToday();

    todayAppointments = appointments.sort((a, b) =>
      String(a.appointmentTime ?? "").localeCompare(
        String(b.appointmentTime ?? ""),
      ),
    );
  } catch (error) {
    errorMessage = getErrorMessage(error, "Could not load today appointments");
  }

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Doctor Portal</p>

        <h1 className="text-2xl font-medium tracking-tight">
          Today&apos;s Appointments
        </h1>

        <p className="text-sm text-muted-foreground">
          Review your consultation schedule for {today}.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border bg-card p-8 text-sm text-muted-foreground shadow-sm">
          {errorMessage}
        </div>
      ) : (
        <TodayAppointmentsList appointments={todayAppointments} />
      )}
    </div>
  );
}
