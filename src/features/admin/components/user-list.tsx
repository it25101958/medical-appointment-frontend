"use client";

import { Button, DataTable, type Column } from "@/components/ui";
import { StatusBadge } from "@/components/ui";
import { highlightText } from "@/lib/highlight-search";
import { formatDate } from "@/features/shared/util/format-date";

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

interface UserTableProps {
  users: User[];
  searchQuery?: string;
  onToggleActive: (userId: number, active: boolean) => void;
  onEditRole?: (user: User) => void;
  onViewUserDetails?: (userId: number) => void;
}

const SYSTEM_ADMIN_ID = 1;

export function UserTable({
  users,
  searchQuery = "",
  onToggleActive,
  onEditRole,
  onViewUserDetails,
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
          className=" font-medium text-muted-foreground hover:text-primary hover:underline cursor-pointer"
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
      className: "",
      align: "center",
      render: (user) => {
        const isSystemAdmin = user.userId === SYSTEM_ADMIN_ID;
        return (
          <div className="flex items-end justify-end gap-2">
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
      pageable={false}
      showActions={false}
      minWidth="1000px"
      emptyMessage="No users found."
      bordered={false}
    />
  );
}
