export interface PrescriptionItemResponse {
  prescriptionItemId: number;
  medicationId?: number;
  medicationName: string;
  genericName?: string;
  dosage: string;
  quantity: number;
  specialInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrescriptionResponse {
  prescriptionId: number;
  appointmentId: number;
  doctorName: string;
  patientName: string;
  prescriptionDate: string;
  status: string;
  notes?: string;
  items: PrescriptionItemResponse[];
  createdAt?: string;
}
