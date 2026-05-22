"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/validations/auth";
import { loginAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { formatValidationErrors } from "@/lib/utils";

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

const zodValidator = (schema: z.ZodTypeAny) => (value: unknown) => {
  const fieldValue =
    typeof value === "object" && value !== null ? (value as any).value : value;

  const result = schema.safeParse(fieldValue);
  if (!result.success) return result.error.errors[0]?.message;
  return undefined;
};

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
        console.error(err);
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
        validators={{ onChange: zodValidator(loginSchema.shape.email) }}
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
            {field.state.meta.errors && (
              <p className="form-error">
                {formatValidationErrors(field.state.meta.errors)}
              </p>
            )}
          </Field>
        )}
      </form.Field>
      <form.Field
        name="password"
        validators={{ onChange: zodValidator(loginSchema.shape.password) }}
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
            {field.state.meta.errors && (
              <p className="form-error">
                {formatValidationErrors(field.state.meta.errors)}
              </p>
            )}
          </Field>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [
          state.values.email,
          state.values.password,
          state.canSubmit,
          state.isSubmitting,
        ]}
      >
        {([email, password, canSubmit, isSubmitting]) => {
          const isDisabled =
            !email?.trim() || !password?.trim() || !canSubmit || isSubmitting;

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
