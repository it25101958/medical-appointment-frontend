"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/features/dashboard";
import { AppointmentForm } from "@/features/appointments";
import { UpcomingAppointmentHighlight } from "@/features/patient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarPlus,
  CalendarClock,
  FileText,
  Pill,
  ClipboardList,
  CreditCard,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface CurrentUser {
  userId: number;
  firstName?: string;
  lastName?: string;
  roleType: number;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [patient, setPatient] = useState<CurrentUser | null>(null);
  const [isPatientLoading, setIsPatientLoading] = useState(true);
  const [appointmentsRefreshKey, setAppointmentsRefreshKey] = useState(0);

  useEffect(() => {
    async function loadPatient() {
      try {
        const currentUser = await apiRequest<CurrentUser>("/users/me", {
          method: "GET",
          cache: "no-store",
        });
        setPatient(currentUser);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load patient profile"));
      } finally {
        setIsPatientLoading(false);
      }
    }

    loadPatient();
  }, []);

  const openAppointmentForm = () => setAppointmentDialogOpen(true);

  const patientItems = [
    {
      icon: CalendarPlus,
      title: "Appointment",
      buttonText: "Schedule Now",
      action: openAppointmentForm,
    },
    {
      icon: UserRound,
      title: "My Profile",
      buttonText: "View Profile",
      action: () => router.push("/patient/profile"),
    },
    {
      icon: FileText,
      title: "Prescriptions",
      buttonText: "View Current",
      action: () => router.push("/patient/prescriptions"),
    },
    {
      icon: Pill,
      title: "Medications",
      buttonText: "View Medicines",
      action: () => router.push("/patient/medications"),
    },
    {
      icon: ClipboardList,
      title: "Lab Results",
      buttonText: "Check Status",
      action: () => router.push("/patient/results"),
    },
    {
      icon: CreditCard,
      title: "Billing",
      buttonText: "View Billing",
      action: () => router.push("/patient/billing"),
    },
  ];

  return (
    <>
      <DashboardShell
        badgeText="Patient Care Portal"
        title={
          <>
            Your Health Center <br />
            <span>Manage Appointments & Records</span>
          </>
        }
        description="Stay on top of your health. Book new appointments, pay your medical bills, and access your lab results securely."
        primaryButton={{
          text: "Book Appointment",
          onClick: openAppointmentForm,
        }}
        secondaryButton={{
          text: "View My Visits",
          onClick: () => router.push("/patient/visits"),
        }}
        bentoItems={patientItems}
        topContent={
          <UpcomingAppointmentHighlight
            patientId={patient?.userId}
            isPatientLoading={isPatientLoading}
            refreshKey={appointmentsRefreshKey}
            onBookAppointment={openAppointmentForm}
            onViewVisits={() => router.push("/patient/visits")}
          />
        }
      />

      <Dialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-card p-0 shadow-xl sm:max-w-[760px]">
          <DialogHeader>
            <div className="border-b border-border/60 px-6 pb-5 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarClock className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold tracking-tight">
                    Book Appointment
                  </DialogTitle>
                  <DialogDescription>
                    Choose your doctor, appointment time, and visit type.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {isPatientLoading ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              Loading your patient profile...
            </p>
          ) : patient?.userId ? (
            <AppointmentForm
              patientId={patient.userId}
              onCancel={() => setAppointmentDialogOpen(false)}
              onCreated={() => {
                setAppointmentDialogOpen(false);
                setAppointmentsRefreshKey((current) => current + 1);
              }}
            />
          ) : (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              We could not load your patient profile. Please sign in again.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
