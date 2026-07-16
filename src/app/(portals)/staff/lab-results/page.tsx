import { LabResultManagement } from "@/features/lab-results";

export default function StaffLabResultsPage() {
  return (
    <LabResultManagement
      title="Lab Results"
      description="View patient lab results by patient ID. Creating and editing results is restricted on this screen."
      canManage={false}
    />
  );
}
