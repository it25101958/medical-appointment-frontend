import { LabResultManagement } from "@/features/lab-results";

export default function DoctorLabResultsPage() {
  return (
    <LabResultManagement
      title="Patient Lab Results"
      description="Create, view, and update lab results recorded for patient appointments."
      canManage
    />
  );
}
