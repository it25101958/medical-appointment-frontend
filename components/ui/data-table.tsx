"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightText } from "@/lib/highlight-search";
import { PaginationControls } from "@/components/ui/pagination-controls";

export type Column<T> = {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchQuery?: string;
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  pageable?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showActions?: boolean;
  minWidth?: string;
  bordered?: boolean;
}

export function DataTable<T extends object>({
  columns,
  data,
  searchQuery = "",
  onRowClick,
  onView,
  emptyMessage = "No results found.",
  className,
  pageable = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20],
  currentPage,
  onPageChange,
  onPageSizeChange,
  showActions = true,
  minWidth = "1000px",
  bordered = true,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalPageSize, setInternalPageSize] = React.useState(pageSize);

  const resolvedCurrentPage =
    typeof currentPage === "number" ? currentPage : internalPage;
  const resolvedPageSize = onPageSizeChange ? pageSize : internalPageSize;

  const totalPages = Math.ceil(data.length / resolvedPageSize);
  const startIdx = resolvedCurrentPage * resolvedPageSize;
  const endIdx = startIdx + resolvedPageSize;
  const paginatedData = data.slice(startIdx, endIdx);

  const setPage = React.useCallback(
    (nextPage: number) => {
      const boundedPage = Math.max(0, Math.min(nextPage, totalPages - 1));

      onPageChange?.(boundedPage);

      if (typeof currentPage !== "number") {
        setInternalPage(boundedPage);
      }
    },
    [currentPage, onPageChange, totalPages],
  );

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
    }
    setPage(0);
  };

  const getCellValue = (row: T, accessor?: keyof T | string) => {
    if (!accessor) return "";

    const value = (row as Record<string, unknown>)[accessor as string];

    if (value === null || value === undefined) return "";

    return String(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <ScrollArea
        className={cn(
          "table-dark-border bg-card overflow-x-auto",
          bordered ? "table-border rounded-lg" : "rounded-none border-0",
        )}
      >
        <Table className="w-full" style={{ minWidth }} data-testid="data-table">
          <TableHeader>
            <TableRow className="table-header-row">
              {columns.map((col, idx) => {
                const isActionColumn =
                  typeof col.header === "string" &&
                  col.header.toLowerCase().includes("action");

                return (
                  <TableHead
                    key={idx}
                    className={cn(
                      "tableHead table-head-text",
                      isActionColumn && "text-center",
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </TableHead>
                );
              })}

              {showActions && (
                <TableHead className="w-[130px] tableHead table-head-text text-center">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center text-sm py-6 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rIdx) => (
                <TableRow
                  key={rIdx}
                  className={cn(
                    "table-row-hover",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, cIdx) => {
                    const isActionColumn =
                      typeof col.header === "string" &&
                      col.header.toLowerCase().includes("action");

                    return (
                      <TableCell
                        key={cIdx}
                        className={cn(
                          "px-4 py-3 align-middle text-sm",
                          isActionColumn && "text-center",
                          col.className,
                        )}
                      >
                        {col.render
                          ? col.render(row)
                          : highlightText(
                              getCellValue(row, col.accessor),
                              searchQuery,
                            )}
                      </TableCell>
                    );
                  })}

                  {showActions && (
                    <TableCell className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        {onView && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                          >
                            <Info className="h-4 w-4" />
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {pageable && totalPages > 1 && (
        <div className="border-t border-border">
          <PaginationControls
            currentPage={resolvedCurrentPage}
            totalPages={totalPages}
            pageSize={resolvedPageSize}
            pageSizeOptions={pageSizeOptions}
            onPageChange={(page) => setPage(page)}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}

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

export default DataTable;
