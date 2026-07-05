import { apiRequest } from "@/lib/api-client";
import { PrescriptionList } from "@/features/admin";
import { PageHeader } from "@/components/ui";

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

export default async function PatientPrescriptionsPage() {
  let data: PrescriptionsResponse = {
    content: [],
  };
  let errorMessage = "";

  try {
    data = await apiRequest<PrescriptionsResponse>(
      "/prescription/my?page=0&size=100",
      {
        method: "GET",
        cache: "no-store",
      },
    );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Could not load prescriptions";
  }

  return (
    <div className="space-y-6 col-start-1 col-end-14">
      <PageHeader
        title="My Prescriptions"
        description="View prescriptions issued by your doctor and open each record for medication details."
      />

      {errorMessage ? (
        <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
          {errorMessage}
        </div>
      ) : (
        <>
          <PrescriptionList data={data.content || []} />
        </>
      )}
    </div>
  );
}
