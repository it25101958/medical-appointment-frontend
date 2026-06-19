"use client";

import React from "react";
import { Button, DataTable, type Column } from "@/components/ui";
import { RefreshCcw } from "lucide-react";

export default function RoomScheduleList<T extends object>({
  title,
  description,
  data,
  columns,
  isLoading,
  onRefresh,
}: {
  title?: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <div className="col-start-1 col-end-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          {title ? <h1 className="text-2xl font-semibold">{title}</h1> : null}
          {description ? (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
        <Button onClick={onRefresh} size="sm" variant="outline">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <DataTable<T>
        columns={columns}
        data={data}
        pageable
        pageSize={10}
        showActions={false}
      />
    </div>
  );
}
