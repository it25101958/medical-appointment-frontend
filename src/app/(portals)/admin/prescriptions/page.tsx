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
  totalPages: number;
}

export default async function AdminPrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 0;

  const data = await apiRequest<PrescriptionsResponse>(
    `/prescription?page=${page}&size=5`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return (
    <div className="col-start-1 col-end-14">
      <PageHeader
        title="Prescriptions"
        description="View and manage patient prescription records"
      />

      <AdminPrescriptionsClient
        data={data.content}
        currentPage={page}
        totalPages={data.totalPages}
      />
    </div>
  );
}
