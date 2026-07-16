import { cn } from "@/lib/utils";

export function tableBadgeClassName(
  type: "primary" | "success" | "danger" | "warning" | "muted",
) {
  const base = "rounded-md px-2.5 py-1 text-xs font-medium";

  const variants = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    muted: "bg-muted text-muted-foreground",
  };

  return cn(base, variants[type]);
}
