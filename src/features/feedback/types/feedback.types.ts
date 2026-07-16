export type FeedbackStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface FeedbackRequest {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comments?: string;
}

export interface FeedbackUpdateRequest {
  rating: number;
  comments?: string;
}

export interface FeedbackResponse {
  feedbackId: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  rating: number;
  comments?: string | null;
  status: FeedbackStatus;
  createdAt: string;
}
