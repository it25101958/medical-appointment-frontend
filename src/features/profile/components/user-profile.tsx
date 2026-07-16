"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  IdCard,
  Mail,
  Phone,
  RefreshCcw,
  Edit3,
  Key,
} from "lucide-react";
import { toast } from "sonner";

import { Badge, Button, PageHeader } from "@/components/ui";
import { formatDate } from "@/features/shared/util/format-date";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface UserProfileResponse {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nic?: string;
  NIC?: string;
  address?: string;
  roleType?: number;
  roleName?: string;
  role?: string;
  status?: string;
  active?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function formatValue(value?: string | number | boolean | null) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Active" : "Inactive";
  return String(value);
}

export function UserProfile() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await apiRequest<UserProfileResponse>("/users/me", {
        method: "GET",
        cache: "no-store",
      });
      setProfile(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load user profile"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await loadProfile();
    })();
  }, []);

  const fullName = useMemo(() => {
    const name = [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return name || "My Profile";
  }, [profile]);

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <PageHeader
        title="My Profile"
        description="Review the account details connected to your signed-in user."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadProfile}
              disabled={loading}
              aria-label="Refresh profile"
              title="Refresh"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Loading your profile...
          </div>
        ) : profile ? (
          <div className="grid gap-6 p-6 md:grid-cols-3">
            <div className="col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-400 text-white">
                  <span className="text-2xl font-semibold">
                    {String(fullName)
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{fullName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatValue(profile.userId)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => toast.info("Change password")}>
                  <Key className="h-4 w-4 mr-2" /> Change Password
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.info("View activity")}
                >
                  Activity
                </Button>
              </div>
            </div>

            <div className="col-span-2 grid gap-4 md:grid-cols-2">
              <ProfileInfo
                icon={<Mail className="size-4" />}
                label="Email"
                value={formatValue(profile.email)}
              />
              <ProfileInfo
                icon={<Phone className="size-4" />}
                label="Phone"
                value={formatValue(profile.phone)}
              />
              <ProfileInfo
                icon={<IdCard className="size-4" />}
                label="NIC"
                value={formatValue(profile.nic || profile.NIC)}
              />
              <ProfileInfo
                icon={<CalendarDays className="size-4" />}
                label="Created"
                value={formatDate(profile.createdAt)}
              />

              <div className="rounded-lg border border-border/60 bg-muted/20 p-4 md:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Address
                </p>
                <p className="mt-2 text-sm font-medium">
                  {formatValue(profile.address)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Profile details are not available.
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
