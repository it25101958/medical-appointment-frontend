"use client";
import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <section className="col-start-4 col-end-10 overflow-hidden rounded-3xl border border-border p-8">
      <div className="w-auto">
        <div className="mb-6 space-y-2 text-center lg:text-left">
          <h1 className="text-3xl font-semibold tracking-tight">
            Forgot Password
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Enter your email and we will send a password reset code if your
            account exists.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="mt-6 border-t border-border/10 pt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/patient/login"
            className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            Login Here
          </Link>
        </p>
      </div>
    </section>
  );
}
