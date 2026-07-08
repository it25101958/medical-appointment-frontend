import { apiRequest } from "@/lib/api-client";
import { PageHeader } from "@/components/ui/page-header";
import { AdminPrescriptionsClient } from "./admin-prescriptions-client";

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

export default async function AdminPrescriptionsPage() {
  const data = await apiRequest<PrescriptionsResponse>(
    "/prescription?page=0&size=100",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <PageHeader
        title="Prescriptions"
        description="View and manage patient prescription records"
      />

      <AdminPrescriptionsClient data={data.content} />
    </div>
  );
}
