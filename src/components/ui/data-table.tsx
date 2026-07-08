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
  render?: (row: T, context: DataTableRenderContext) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: TableTextAlign;
  headerAlign?: TableTextAlign;
  cellAlign?: TableTextAlign;
  isAction?: boolean;
  requiresManage?: boolean;
};

type TableTextAlign = "left" | "center" | "right";

export type DataTableRenderContext = {
  canManage: boolean;
};

const textAlignClasses: Record<TableTextAlign, string> = {
  left: "text-left",
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
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showActions?: boolean;
  canManage?: boolean;
  minWidth?: string;
  bordered?: boolean;
  defaultHeaderAlign?: TableTextAlign;
  defaultCellAlign?: TableTextAlign;
  actionAlign?: TableTextAlign;
}

export function DataTable<T extends object>({
  canManage = false,
  columns,
  data,
  searchQuery = "",
  onRowClick,
  onView,
  emptyMessage = "No results found.",
  className,
  pageable = true,
  pageSize = 5,
  pageSizeOptions = [5, 10],
  currentPage,
  totalPages: totalPagesProp,
  onPageChange,
  onPageSizeChange,
  showActions = false,
  minWidth = "1000px",
  bordered = true,
  defaultHeaderAlign = "left",
  defaultCellAlign = "left",
  actionAlign = "right",
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalPageSize, setInternalPageSize] = React.useState(pageSize);
  const isServerPaginated = typeof totalPagesProp === "number";
  const canManageRows = Boolean(canManage);
  const visibleColumns = React.useMemo(
    () => columns.filter((column) => canManageRows || !column.requiresManage),
    [canManageRows, columns],
  );
  const hasBuiltInActions = Boolean(showActions && canManageRows && onView);
  const renderContext = React.useMemo<DataTableRenderContext>(
    () => ({ canManage: canManageRows }),
    [canManageRows],
  );

  const resolvedCurrentPage =
    typeof currentPage === "number" ? currentPage : internalPage;
  const resolvedPageSize = onPageSizeChange ? pageSize : internalPageSize;

  const totalPages = isServerPaginated
    ? Math.max(1, totalPagesProp ?? 1)
    : Math.max(1, Math.ceil(data.length / resolvedPageSize));
  const startIdx = resolvedCurrentPage * resolvedPageSize;
  const endIdx = startIdx + resolvedPageSize;
  const paginatedData = isServerPaginated ? data : data.slice(startIdx, endIdx);

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
              {visibleColumns.map((col, idx) => {
                const isActionColumn =
                  col.isAction ||
                  col.header.toLowerCase().includes("action") ||
                  col.header.toLowerCase().includes("manage");

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

              {hasBuiltInActions && (
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(
                    visibleColumns.length + (hasBuiltInActions ? 1 : 0),
                    1,
                  )}
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
                  {visibleColumns.map((col, cIdx) => {
                    const isActionColumn =
                      col.isAction ||
                      col.header.toLowerCase().includes("action") ||
                      col.header.toLowerCase().includes("manage");

                    return (
                      <TableCell
                        key={cIdx}
                        className={cn(
                          "px-4 py-3 align-middle text-sm",
                          columnSeparatorClass,
                          rowSeparatorClass(rIdx),
                          textAlignClasses[
                            col.cellAlign ??
                              col.align ??
                              (isActionColumn ? actionAlign : defaultCellAlign)
                          ],
                          col.className,
                        )}
                      >
                        {col.render
                          ? col.render(row, renderContext)
                          : highlightText(
                              getCellValue(row, col.accessor),
                              searchQuery,
                            )}
                      </TableCell>
                    );
                  })}

                  {hasBuiltInActions && (
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

      {pageable && (
        <div className="bg-card">
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

export default DataTable;
