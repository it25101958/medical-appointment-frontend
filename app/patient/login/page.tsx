import { LoginForm } from "@/features/auth";
import AuthLayout from "@/components/layout/auth-layout";

export default function PatientLoginPage() {
  return (
    <AuthLayout
      title="Login"
      description="Access your appointments, feedback, prescriptions, and records."
      registerLink={{ href: "/auth/register", label: "Register Now" }}
      imageSrc="/login.png"
      imageAlt="Patient login"
    >
      <LoginForm audience="patient" />
    </AuthLayout>
  );
}
