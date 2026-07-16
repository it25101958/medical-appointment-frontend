import { LabResultManagement } from "@/features/lab-results";

export default function AdminLabResultsPage() {
  return (
    <LabResultManagement
      title="Lab Result Management"
      description="Create, view, and update patient lab results by appointment and patient ID."
      canManage
    />
  );
}
