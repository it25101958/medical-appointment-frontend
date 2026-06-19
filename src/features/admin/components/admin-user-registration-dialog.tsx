"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  BadgeDollarSign,
  Briefcase,
  CalendarDays,
  Clock,
  GraduationCap,
  IdCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

interface AdminUserRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  currentUser?: {
    userId: number;
    roleType: number;
    accessLevel?: string;
  } | null;
}

const ROLE_OPTIONS = [
  { value: 1, label: "ADMIN" },
  { value: 2, label: "STAFF" },
  { value: 3, label: "DOCTOR" },
];

const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const ACCESS_LEVEL_OPTIONS = ["FULL", "LIMITED"];
const STAFF_STATUS_OPTIONS = ["ACTIVE", "ON_LEAVE", "INACTIVE"];

interface RegistrationFormValues {
  roleType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nic: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  specialization: string;
  licenseNumber: string;
  qualification: string;
  experienceYears: string;
  consultationFee: string;
  status: string;
  workingHours: string;
  department: string;
  accessLevel: string;
}

const initialValues: RegistrationFormValues = {
  roleType: "3",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  nic: "",
  dateOfBirth: "",
  gender: "MALE",
  address: "",
  specialization: "",
  licenseNumber: "",
  qualification: "",
  experienceYears: "",
  consultationFee: "",
  status: "ACTIVE",
  workingHours: "",
  department: "",
  accessLevel: "FULL",
};

function hasFullAccess(accessLevel?: string) {
  return ["full", "FULL", "1"].includes(String(accessLevel));
}

function compactPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (typeof value === "string") return value.trim().length > 0;
      return value !== undefined && value !== null;
    }),
  );
}

function getRegisterEndpoint(roleType: number) {
  if (roleType === 3) return "/auth/register/doctor";
  if (roleType === 2) return "/auth/register/staff";
  return "/auth/register/admin";
}

export function AdminUserRegistrationDialog({
  open,
  onOpenChange,
  onSuccess,
  currentUser,
}: AdminUserRegistrationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState<RegistrationFormValues>(initialValues);

  const selectedRole = Number(values.roleType);

  const allowedRoleOptions = useMemo(() => {
    return ROLE_OPTIONS.filter((role) => {
      if (role.value === 1) {
        return (
          currentUser?.roleType === 1 && hasFullAccess(currentUser.accessLevel)
        );
      }

      return currentUser?.roleType === 1;
    });
  }, [currentUser]);

  function updateValue<K extends keyof RegistrationFormValues>(
    key: K,
    value: RegistrationFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetAndClose(openState: boolean) {
    onOpenChange(openState);
    if (!openState) {
      setValues(initialValues);
    }
  }

  function buildPayload() {
    const commonPayload = {
      email: values.email.trim(),
      password: values.password,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone.trim(),
      nic: values.nic.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      address: values.address.trim(),
      roleType: selectedRole,
    };

    if (selectedRole === 3) {
      return compactPayload({
        ...commonPayload,
        specialization: values.specialization.trim(),
        licenseNumber: values.licenseNumber.trim(),
        qualification: values.qualification.trim(),
        experienceYears: Number(values.experienceYears),
        consultationFee: Number(values.consultationFee),
      });
    }

    if (selectedRole === 2) {
      return compactPayload({
        ...commonPayload,
        status: values.status,
        workingHours: values.workingHours.trim(),
        specialization: values.specialization.trim(),
      });
    }

    return compactPayload({
      ...commonPayload,
      department: values.department.trim(),
      accessLevel: values.accessLevel,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedRole === 1 && !hasFullAccess(currentUser?.accessLevel)) {
      toast.error("You are not authorized to create ADMIN users.");
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest(getRegisterEndpoint(selectedRole), {
        method: "POST",
        body: JSON.stringify(buildPayload()),
      });

      toast.success("User registered successfully!");
      resetAndClose(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to register user", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Role *</FieldLabel>
              <Select
                value={values.roleType}
                onValueChange={(value) => updateValue("roleType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {allowedRoleOptions.map((role) => (
                    <SelectItem key={role.value} value={String(role.value)}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <TextInput
              label="Email Address *"
              type="email"
              value={values.email}
              onChange={(value) => updateValue("email", value)}
              icon={<Mail className="size-4 text-muted-foreground/60" />}
              placeholder="name@hospital.com"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="First Name *"
              value={values.firstName}
              onChange={(value) => updateValue("firstName", value)}
              icon={<User className="size-4 text-muted-foreground/60" />}
              placeholder="Alice"
            />
            <TextInput
              label="Last Name *"
              value={values.lastName}
              onChange={(value) => updateValue("lastName", value)}
              icon={<User className="size-4 text-muted-foreground/60" />}
              placeholder="Smith"
            />
          </div>

          <TextInput
            label="Password *"
            type="password"
            value={values.password}
            onChange={(value) => updateValue("password", value)}
            icon={<Lock className="size-4 text-muted-foreground/60" />}
            placeholder="Secure password"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Phone *"
              value={values.phone}
              onChange={(value) => updateValue("phone", value)}
              icon={<Phone className="size-4 text-muted-foreground/60" />}
              placeholder="+94771112222"
            />
            <TextInput
              label="NIC *"
              value={values.nic}
              onChange={(value) => updateValue("nic", value)}
              icon={<IdCard className="size-4 text-muted-foreground/60" />}
              placeholder="198512345678"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Date of Birth *"
              type="date"
              value={values.dateOfBirth}
              onChange={(value) => updateValue("dateOfBirth", value)}
              icon={
                <CalendarDays className="size-4 text-muted-foreground/60" />
              }
            />
            <Field>
              <FieldLabel>Gender *</FieldLabel>
              <Select
                value={values.gender}
                onValueChange={(value) => updateValue("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <TextInput
            label="Address *"
            value={values.address}
            onChange={(value) => updateValue("address", value)}
            icon={<MapPin className="size-4 text-muted-foreground/60" />}
            placeholder="No 15, Park Street, Colombo 02"
          />

          {selectedRole === 3 && (
            <div className="grid gap-4 rounded-lg border border-border/60 p-4 md:grid-cols-2">
              <TextInput
                label="Specialization *"
                value={values.specialization}
                onChange={(value) => updateValue("specialization", value)}
                icon={
                  <Stethoscope className="size-4 text-muted-foreground/60" />
                }
                placeholder="CARDIOLOGY"
              />
              <TextInput
                label="License Number *"
                value={values.licenseNumber}
                onChange={(value) => updateValue("licenseNumber", value)}
                icon={<IdCard className="size-4 text-muted-foreground/60" />}
                placeholder="SLMC-998877"
              />
              <TextInput
                label="Qualification *"
                value={values.qualification}
                onChange={(value) => updateValue("qualification", value)}
                icon={
                  <GraduationCap className="size-4 text-muted-foreground/60" />
                }
                placeholder="MBBS, MD Cardiology"
              />
              <TextInput
                label="Experience Years *"
                type="number"
                value={values.experienceYears}
                onChange={(value) => updateValue("experienceYears", value)}
                icon={<Briefcase className="size-4 text-muted-foreground/60" />}
                placeholder="12"
              />
              <TextInput
                label="Consultation Fee *"
                type="number"
                value={values.consultationFee}
                onChange={(value) => updateValue("consultationFee", value)}
                icon={
                  <BadgeDollarSign className="size-4 text-muted-foreground/60" />
                }
                placeholder="2500.00"
              />
            </div>
          )}

          {selectedRole === 2 && (
            <div className="grid gap-4 rounded-lg border border-border/60 p-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Status *</FieldLabel>
                <Select
                  value={values.status}
                  onValueChange={(value) => updateValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <TextInput
                label="Working Hours *"
                value={values.workingHours}
                onChange={(value) => updateValue("workingHours", value)}
                icon={<Clock className="size-4 text-muted-foreground/60" />}
                placeholder="08:30 AM - 05:30 PM"
              />
              <TextInput
                label="Specialization *"
                value={values.specialization}
                onChange={(value) => updateValue("specialization", value)}
                icon={<Briefcase className="size-4 text-muted-foreground/60" />}
                placeholder="RECEPTIONIST"
              />
            </div>
          )}

          {selectedRole === 1 && (
            <div className="grid gap-4 rounded-lg border border-border/60 p-4 md:grid-cols-2">
              <TextInput
                label="Department *"
                value={values.department}
                onChange={(value) => updateValue("department", value)}
                icon={<Briefcase className="size-4 text-muted-foreground/60" />}
                placeholder="Operations"
              />
              <Field>
                <FieldLabel>Access Level *</FieldLabel>
                <Select
                  value={values.accessLevel}
                  onValueChange={(value) => updateValue("accessLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVEL_OPTIONS.map((accessLevel) => (
                      <SelectItem key={accessLevel} value={accessLevel}>
                        {accessLevel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => resetAndClose(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TextInput({
  label,
  value,
  onChange,
  icon,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field>
      <FieldLabel className="text-xs">{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>
        <InputGroupInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </InputGroup>
    </Field>
  );
}
