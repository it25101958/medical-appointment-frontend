"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { zodValidator } from "@/lib/validations/zod-validator";
import {
  loginEmailSchema,
  loginPasswordSchema,
  loginSchema,
} from "@/lib/validations/auth";
import { loginAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type LoginAudience = "patient" | "portal";

interface LoginFormProps {
  audience?: LoginAudience;
}

const roleRedirects: Record<number, string> = {
  1: "/admin/dashboard",
  2: "/staff/dashboard",
  3: "/doctor/dashboard",
  4: "/patient/dashboard",
};

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

export function LoginForm({ audience = "portal" }: LoginFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        const result = await loginAction(value, audience);
        if (result.success) {
          const target = roleRedirects[result.role as number] || "/portal";
          router.push(target);
        } else {
          toast.error("Authentication Failed", {
            description: result.error || "Please check your credentials.",
          });
        }
      } catch (err) {
        toast.error("Something went wrong. Try again later.");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.Field
        name="email"
        validators={{
          onChange: zodValidator(loginEmailSchema),
          onBlur: zodValidator(loginEmailSchema),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Mail className="size-4 text-muted-foreground/60" />
              </InputGroupAddon>
              <InputGroupInput
                id={field.name}
                type="email"
                placeholder="johndoe@gmail.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </InputGroup>
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError className="form-error">
                {getFieldErrorMessage(field.state.meta.errors[0])}
              </FieldError>
            )}
          </Field>
        )}
      </form.Field>
      <form.Field
        name="password"
        validators={{
          onChange: zodValidator(loginPasswordSchema),
          onBlur: zodValidator(loginPasswordSchema),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Lock className="size-4 text-muted-foreground/60" />
              </InputGroupAddon>
              <InputGroupInput
                id={field.name}
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </InputGroup>
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError className="form-error">
                {getFieldErrorMessage(field.state.meta.errors[0])}
              </FieldError>
            )}
          </Field>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => ({
          email: state.values.email,
          password: state.values.password,
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ email, password, canSubmit, isSubmitting }) => {
          const emailValue = typeof email === "string" ? email : "";
          const passwordValue = typeof password === "string" ? password : "";
          const isDisabled =
            !emailValue.trim() ||
            !passwordValue.trim() ||
            !canSubmit ||
            isSubmitting;

          return (
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              Login
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
