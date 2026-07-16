import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface CrudActionButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

export function CrudActionButton({
  label,
  icon,
  onClick,
  destructive = false,
}: CrudActionButtonProps) {
  return (
    <Button
      size="icon-sm"
      variant="outline"
      className={
        destructive
          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
          : undefined
      }
      onClick={onClick}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
