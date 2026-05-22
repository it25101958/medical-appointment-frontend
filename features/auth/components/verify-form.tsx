"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  resendVerificationAction,
  verifyAccountAction,
} from "@/lib/actions/verification-actions";
import { FieldLabel } from "@/components/ui/field";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      toast.error("Verification failed", {
        description: "Verification code is required.",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await verifyAccountAction({
      email: emailFromUrl.trim(),
      code: code.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Account verified successfully!", {
        description: "Redirecting to login...",
      });

      setTimeout(() => {
        router.replace("/patient/login");
      }, 1000);
    } else {
      toast.error("Verification failed", {
        description: result.error || "Invalid verification code.",
      });
    }
  };

  const handleResendCode = async () => {
    if (!emailFromUrl.trim()) {
      toast.error("Unable to resend code", {
        description: "Email is missing. Please register again.",
      });
      return;
    }

    setIsResending(true);

    const result = await resendVerificationAction({
      email: emailFromUrl.trim(),
    });

    setIsResending(false);

    if (result.success) {
      toast.success("Verification code sent!", {
        description: "Check your email for the new code.",
      });
    } else {
      toast.error("Unable to resend code", {
        description: result.error || "Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl ">
      <div className="space-y-2">
        <FieldLabel className="text-sm font-medium">
          Verification Code
        </FieldLabel>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <ShieldCheck className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </InputGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Account"
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResendCode}
        disabled={isSubmitting || isResending}
      >
        {isResending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Code...
          </>
        ) : (
          "Resend Code"
        )}
      </Button>
    </form>
  );
}
