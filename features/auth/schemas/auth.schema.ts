import * as z from "zod";

export const loginEmailSchema = z
  .string({ required_error: "Email is required." })
  .trim()
  .min(1, { message: "Email is required." })
  .email({ message: "Please enter a valid email address." })
  .transform((s) => s.toLowerCase());

export const loginPasswordSchema = z
  .string({ required_error: "Password is required." })
  .min(1, { message: "Password is required." });

export const loginSchema = z.object({
  email: loginEmailSchema,
  password: loginPasswordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export const patientRegisterFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().min(1, "Phone is required."),
  nic: z
    .string()
    .min(1, "NIC is required.")
    .regex(/^([0-9]{9}[Vv]|[0-9]{12})$/, "Invalid NIC format"),
  dateOfBirth: z.string().refine((s) => !!s && !Number.isNaN(Date.parse(s)), {
    message: "Date of birth is required and must be a valid date",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().min(1, "Address is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PatientRegisterFormInput = z.infer<
  typeof patientRegisterFormSchema
>;