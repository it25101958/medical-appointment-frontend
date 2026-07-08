"use client";

import React from "react";
import { Button, DataTable, PageHeader, type Column } from "@/components/ui";
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
    <div className="col-start-1 col-end-14 space-y-6">
      <PageHeader
        title={title || "Room Schedules"}
        description={description || "Review room schedule records."}
        actions={
          <Button onClick={onRefresh} size="sm" variant="outline">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Loading room schedules...
          </div>
        ) : (
          <DataTable<T>
            columns={columns}
            data={data}
            pageable
            pageSize={10}
            showActions={false}
          />
        )}
      </div>
    </div>
  );
}
