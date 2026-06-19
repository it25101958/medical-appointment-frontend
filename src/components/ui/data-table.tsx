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
import { PaginationControls } from "./pagination-controls";

export type Column<T> = {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: TableTextAlign;
  headerAlign?: TableTextAlign;
  cellAlign?: TableTextAlign;
};

type TableTextAlign = "left" | "center" | "right";

const textAlignClasses: Record<TableTextAlign, string> = {
  left: "xl text-start",
  center: "text-center",
  right: "text-end",
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
  defaultHeaderAlign?: TableTextAlign;
  defaultCellAlign?: TableTextAlign;
  actionAlign?: TableTextAlign;
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
  defaultHeaderAlign = "left",
  defaultCellAlign = "left",
  actionAlign = "right",
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

  const columnSeparatorClass = bordered
    ? "border-l border-solid !border-border first:border-l-0"
    : "";
  const headerSeparatorClass = bordered
    ? "border-b border-solid !border-border"
    : "";
  const rowSeparatorClass = (rowIndex: number) =>
    bordered && rowIndex > 0 ? "border-t border-solid !border-border" : "";

  return (
    <div className={cn(className)}>
      <ScrollArea
        className={cn(
          "bg-card overflow-auto max-h-[60vh] md:max-h-[50vh]",
          bordered ? "rounded-lg" : "rounded-none",
        )}
      >
        <Table
          className="w-full table-auto border-separate border-spacing-0"
          style={{ minWidth }}
          data-testid="data-table"
        >
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
                      "table-head-text",
                      columnSeparatorClass,
                      headerSeparatorClass,
                      textAlignClasses[
                        col.headerAlign ??
                          col.align ??
                          (isActionColumn ? actionAlign : defaultHeaderAlign)
                      ],
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </TableHead>
                );
              })}

              {showActions && (
                <TableHead
                  className={cn(
                    "w-[130px] table-head-text",
                    columnSeparatorClass,
                    headerSeparatorClass,
                    textAlignClasses[actionAlign],
                  )}
                >
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
                          columnSeparatorClass,
                          rowSeparatorClass(rIdx),
                          textAlignClasses[
                            isActionColumn
                              ? actionAlign
                              : (col.cellAlign ?? col.align ?? defaultCellAlign)
                          ],
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
                    <TableCell
                      className={cn(
                        "px-4 py-3",
                        columnSeparatorClass,
                        rowSeparatorClass(rIdx),
                        textAlignClasses[actionAlign],
                      )}
                    >
                      <div className="flex items-center justify-end gap-2">
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
        <div className="border-t border-border bg-card">
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
