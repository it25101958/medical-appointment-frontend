"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail, Lock } from "lucide-react";
import { useRouter } from "next/router";
import {
  registerDoctorSchema,
  registerAdminSchema,
  registerStaffSchema,
} from "@/lib/validations/auth";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function RegisterForm() {
  
}
