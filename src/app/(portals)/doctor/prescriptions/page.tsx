import { getMyPrescriptions, PrescriptionList } from "@/features/prescriptions";

export default async function DoctorPrescriptionsPage() {
  const data = await getMyPrescriptions(0, 100);

  return (
    <div className="col-start-1 col-end-14 space-y-6">
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
