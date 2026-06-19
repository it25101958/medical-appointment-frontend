"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodValidator } from "@/lib/validations/zod-validator";
import { forgotPasswordSchema } from "@/features/auth";

function getFieldErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : "Invalid input";
  }

  return "Invalid input";
}

export function ForgotPasswordForm() {
  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      const email = value.email.trim();
      toast.success("If an account exists, a reset code will be sent.", {
        description: email,
      });
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: zodValidator(forgotPasswordSchema),
          onBlur: zodValidator(forgotPasswordSchema),
        }}
      >
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="johndoe@example.com"
              />
              {isInvalid && (
                <FieldError className="form-error">
                  {getFieldErrorMessage(field.state.meta.errors[0])}
                </FieldError>
              )}
            </Field>
          );
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          email: state.values.email,
        })}
      >
        {({ canSubmit, isSubmitting, email }) => {
          const isDisabled = !email.trim() || !canSubmit || isSubmitting;

          return (
            <Button type="submit" className="w-full" disabled={isDisabled}>
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
