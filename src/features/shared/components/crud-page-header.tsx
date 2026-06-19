import { ReactNode } from "react";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CrudPageHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  createAction?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
}

export function CrudPageHeader({
  title,
  description,
  onRefresh,
  createAction,
}: CrudPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onRefresh} size="sm" variant="outline">
          <RefreshCcw className="h-4 w-4" />
        </Button>

        {createAction && (
          <Button onClick={createAction.onClick} size="sm">
            {createAction.icon}
            {createAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
