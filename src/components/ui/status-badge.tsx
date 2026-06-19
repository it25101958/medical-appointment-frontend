"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  AVAILABLE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",

  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",

  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-200",
  ON_LEAVE: "bg-amber-100 text-amber-800 border-amber-200",
  OCCUPIED: "bg-amber-100 text-amber-800 border-amber-200",

  MAINTENANCE: "bg-orange-100 text-orange-800 border-orange-200",
  OVERDUE: "bg-orange-100 text-orange-800 border-orange-200",

  CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
  CANCELED: "bg-rose-100 text-rose-800 border-rose-200",
  INACTIVE: "bg-rose-100 text-rose-800 border-rose-200",
  NOT_AVAILABLE: "bg-rose-100 text-rose-800 border-rose-200",
  DISCONTINUED: "bg-rose-100 text-rose-800 border-rose-200",
  FAILED: "bg-rose-100 text-rose-800 border-rose-200",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
  EXPIRED: "bg-rose-100 text-rose-800 border-rose-200",

  REFUNDED: "bg-slate-100 text-slate-800 border-slate-200",
  DRAFT: "bg-slate-100 text-slate-800 border-slate-200",
};

type StatusBadgeProps = {
  status: string | number | boolean | null | undefined;
  className?: string;
  variant?: ComponentProps<typeof Badge>["variant"];
};

function normalizeStatus(status: StatusBadgeProps["status"]) {
  if (status === null || status === undefined) return "UNKNOWN";

  if (typeof status === "boolean") {
    return status ? "ACTIVE" : "INACTIVE";
  }

  return String(status).trim().replace(/\s+/g, "_").toUpperCase();
}

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function StatusBadge({
  status,
  className,
  variant = "outline",
}: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  const label = formatStatusLabel(normalized);

  return (
    <Badge
      variant={variant}
      className={cn(
        "rounded-full border px-3 py-0.5 text-xs font-medium",
        statusClasses[normalized] ||
          "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      {label}
    </Badge>
  );
}
