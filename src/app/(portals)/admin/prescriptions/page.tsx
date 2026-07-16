import { PageHeader } from "@/components/ui/page-header";
import { AdminPrescriptionsClient } from "./admin-prescriptions-client";
import { getPrescriptions } from "@/features/prescriptions";

export default async function AdminPrescriptionsPage() {
  const data = await getPrescriptions(0, 100);

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
