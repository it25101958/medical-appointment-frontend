"use client";

import { Button, DataTable, type Column } from "@/components/ui";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/features/shared/util/format-date";
import { highlightText } from "@/lib/highlight-search";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleType: number;
  roleName: string;
  isActive: boolean;
  NIC: number;
  createdAt: string;
}

export interface UserTableProps {
  users: User[];
  searchQuery?: string;
  onToggleActive: (userId: number, active: boolean) => void;
  onEditRole?: (user: User) => void;
  onViewUserDetails?: (userId: number) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const SYSTEM_ADMIN_ID = 1;

export function UserTable({
  users,
  searchQuery = "",
  onToggleActive,
  onEditRole,
  onViewUserDetails,
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
}: UserTableProps) {
  const columns: Column<User>[] = [
    {
      header: "ID",
      headerClassName: "",
      className: "font-medium text-muted-foreground",
      render: (user) => highlightText(user.userId.toString(), searchQuery),
    },
    {
      header: "Name",
      headerClassName: "",
      className: "",
      render: (user) => (
        <span
          className="hover:text-primary hover:underline cursor-pointer"
          onClick={() => onViewUserDetails?.(user.userId)}
        >
          {highlightText(`${user.firstName} ${user.lastName}`, searchQuery)}
        </span>
      ),
    },
    {
      header: "Email",
      headerClassName: "",
      className: "text-sm text-muted-foreground",
      render: (user) => highlightText(user.email, searchQuery),
    },
    {
      header: "Role",
      headerClassName: "",
      className: "",
      render: (user) => <StatusBadge status={user.roleName} />,
    },
    {
      header: "Status",
      headerClassName: "text-center",
      className: "text-center",
      render: (user) => (
        <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      header: "Created At",
      headerClassName: "",
      className: "",
      render: (user) => highlightText(formatDate(user.createdAt), searchQuery),
    },
    {
      header: "Actions",
      headerClassName: "",
      className: "min-w-[220px] whitespace-nowrap",
      align: "center",
      render: (user) => {
        const isSystemAdmin = user.userId === SYSTEM_ADMIN_ID;
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isSystemAdmin}
              onClick={() => onToggleActive(user.userId, !user.isActive)}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </Button>

            {onEditRole && (
              <Button
                size="sm"
                variant="secondary"
                disabled={isSystemAdmin}
                onClick={() => onEditRole(user)}
              >
                Change Role
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      searchQuery={searchQuery}
      pageable={true}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      canManage
      showActions={false}
      minWidth="1000px"
      emptyMessage="No users found."
    />
  );
}
