import { apiRequest } from "@/lib/api-client";
import { PrescriptionList } from "@/features/admin";

interface PrescriptionListItem {
  prescriptionId: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  status: string;
  createdAt: string;
}

interface PrescriptionsResponse {
  content: PrescriptionListItem[];
}

export default async function DoctorPrescriptionsPage() {
  const data = await apiRequest<PrescriptionsResponse>(
    "/prescription/my?page=0&size=100",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return (
    <div className="space-y-6 col-span-1 col-span-13">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
        <p className="text-muted-foreground">Prescriptions issued by you</p>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/50 overflow-hidden shadow-sm">
        <PrescriptionList data={data.content} />
      </div>
    </div>
  );
}
