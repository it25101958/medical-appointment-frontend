import * as z from "zod";

export const feedbackCreateSchema = z.object({
  appointmentId: z.coerce.number().min(1, "Appointment is required"),
  patientId: z.coerce.number().min(1, "Patient is required"),
  doctorId: z.coerce.number().min(1, "Doctor is required"),
  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comments: z
    .string()
    .max(255, "Comments cannot exceed 255 characters")
    .optional(),
});

export const feedbackUpdateSchema = feedbackCreateSchema.pick({
  rating: true,
  comments: true,
});

export type FeedbackCreateValues = z.infer<typeof feedbackCreateSchema>;
export type FeedbackUpdateValues = z.infer<typeof feedbackUpdateSchema>;
