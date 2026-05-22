"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group";

import { patientRegisterFormSchema } from "@/lib/validations/auth";
import { registerAction } from "@/lib/actions/register-action";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "date-fns";

export function RegisterForm() {
  const router = useRouter();
  const [calendarValue, setCalendarValue] = React.useState<Date | undefined>(
    undefined,
  );

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      nic: "",
      dateOfBirth: "",
      gender: "MALE",
      address: "",
    },
    validators: {
      onSubmit: patientRegisterFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await registerAction(value);
        if (result.success) {
          toast.success(
            "Registration successful! Check your email for verification code.",
          );
          router.push(`/auth/verify?email=${encodeURIComponent(value.email)}`);
          return;
        }
        toast.error("Registration failed", {
          description: result.error || "Please try again",
        });
      } catch {
        toast.error("An error occurred", {
          description: "Please try again later",
        });
      }
    },
  });

  return (
    <form
      id="register-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 w-full max-w-2xl mx-auto"
    >
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="firstName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="John"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="lastName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Doe"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="email">
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="john@example.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="phone">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+94771234567"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="nic">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>NIC</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value.toUpperCase()}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  placeholder="123456789V"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="dateOfBirth">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            const handleSelect = (date: Date | undefined) => {
              setCalendarValue(date);
              if (date) {
                const isoString = date.toISOString().split("T")[0];
                field.handleChange(isoString);
              } else {
                field.handleChange("");
              }
            };

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="py-2 h-10">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {calendarValue
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }).format(calendarValue)
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={calendarValue}
                      onSelect={handleSelect}
                    />
                  </PopoverContent>
                </Popover>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="gender">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
              <Select
                name={field.name}
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger id={field.name} className="min-w-[120px]">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="md:col-span-2" data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="I'm having an issue with the login button on mobile."
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.state.value.length}/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Include steps to reproduce, expected behavior, and what
                  actually happened.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [
          state.values.address,
          state.values.dateOfBirth,
          state.values.email,
          state.values.firstName,
          state.values.gender,
          state.values.lastName,
          state.values.nic,
          state.values.password,
          state.values.phone,
          state.canSubmit,
          state.isSubmitting,
        ]}
      >
        {([
          address,
          dateOfBirth,
          email,
          firstName,
          gender,
          lastName,
          nic,
          password,
          phone,
          canSubmit,
          isSubmitting,
        ]) => {
          const hasRequiredFields = [
            address,
            dateOfBirth,
            email,
            firstName,
            gender,
            lastName,
            nic,
            password,
            phone,
          ].every((val) => String(val).trim().length > 0);

          const isDisabled = !hasRequiredFields || !canSubmit || isSubmitting;

          return (
            <div className="mt-4 flex gap-2">
              <Button type="reset" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isDisabled}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
