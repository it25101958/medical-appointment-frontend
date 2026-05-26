"use client";

import { Button, DataTable, type Column } from "@/components/ui";
import { StatusBadge } from "@/components/ui";
import { highlightText } from "@/lib/highlight-search";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleType: number;
  roleName: string;
  isActive: boolean;
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
      headerClassName: "w-[80px]",
      className: "w-[80px] font-medium text-muted-foreground",
      render: (user) => highlightText(user.userId.toString(), searchQuery),
    },
    {
      header: "Name",
      headerClassName: "w-[180px]",
      className: "w-[180px]",
      render: (user) => (
        <span
          className="text-sm font-medium text-foreground hover:text-primary hover:underline cursor-pointer"
          onClick={() => onViewUserDetails?.(user.userId)}
        >
          {highlightText(`${user.firstName} ${user.lastName}`, searchQuery)}
        </span>
      ),
    },
    {
      header: "Email",
      headerClassName: "w-[220px]",
      className: "w-[220px] text-sm text-muted-foreground",
      render: (user) => highlightText(user.email, searchQuery),
    },
    {
      header: "Role",
      headerClassName: "w-[140px]",
      className: "w-[140px]",
      render: (user) => (
        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {highlightText(user.roleName, searchQuery)}
        </span>
      ),
    },
    {
      header: "Status",
      headerClassName: "w-[100px] text-center",
      className: "w-[100px] text-center",
      render: (user) => (
        <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      header: "Actions",
      headerClassName: "w-[220px] text-center",
      className: "w-[220px] text-center",
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
      pageable={false}
      showActions={false}
      minWidth="1000px"
      emptyMessage="No users found."
      bordered={false}
    />
  );
}
