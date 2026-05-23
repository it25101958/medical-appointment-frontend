import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";
import Image from "next/image";
import AuthLayout from "@/components/layout/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      description="Staff, doctors, and admins can sign in here."
      imageSrc="/login.png"
      imageAlt="Admin login"
      infoText="If any error occure, please contact admin"
    >
      <LoginForm />
    </AuthLayout>
  );
}
