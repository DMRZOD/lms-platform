"use client";

import {
  Ban,
  Check,
  Clock,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { FilterBar } from "@/components/admin/filter-bar";
import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockSystemUsers, mockUserStats } from "@/constants/admin-mock-data";
import type { UserRole, UserStatus } from "@/types/admin";

const statusColors: Record<UserStatus, { bg: string; text: string }> = {
  Active: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Inactive: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
  Suspended: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Pending: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
};

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  "it-ops": { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  deputy: { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
  academic: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  accountant: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  aqad: { bg: "bg-[#ecfeff]", text: "text-[#0e7490]" },
  resource: { bg: "bg-[#fefce8]", text: "text-[#a16207]" },
  teacher: { bg: "bg-[#f0f9ff]", text: "text-[#0369a1]" },
  student: { bg: "bg-[#f8fafc]", text: "text-[#334155]" },
  applicant: { bg: "bg-[#fafaf9]", text: "text-[#44403c]" },
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
  { label: "Pending", value: "Pending" },
];

const roleOptions: { label: string; value: string }[] = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "IT Operations", value: "it-ops" },
  { label: "Deputy Director", value: "deputy" },
  { label: "Academic", value: "academic" },
  { label: "Finance", value: "accountant" },
  { label: "AQAD", value: "aqad" },
  { label: "Resource", value: "resource" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
  { label: "Applicant", value: "applicant" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLastLogin(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const roleLabelMap: Record<UserRole, string> = {
  admin: "Admin",
  "it-ops": "IT Ops",
  deputy: "Deputy",
  academic: "Academic",
  accountant: "Finance",
  aqad: "AQAD",
  resource: "Resource",
  teacher: "Teacher",
  student: "Student",
  applicant: "Applicant",
};

export default function AdminUsersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockSystemUsers.filter((u) => {
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch =
      search === "" ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchRole && matchSearch;
  });

  const usersByRole = roleOptions
    .filter((r) => r.value !== "all")
    .map((r) => ({
      role: r.label,
      count: mockSystemUsers.filter((u) => u.role === r.value).length,
    }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxRoleCount = Math.max(...usersByRole.map((r) => r.count));

  const recentRegistrations = [...mockSystemUsers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage platform users, roles, and account status"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Total Users"
          value={mockUserStats.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Active"
          value={mockUserStats.activeUsers}
          icon={UserCheck}
          accent="success"
        />
        <StatCard
          label="Suspended"
          value={mockUserStats.suspendedUsers}
          icon={Ban}
          accent={mockUserStats.suspendedUsers > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Pending"
          value={mockUserStats.pendingUsers}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="New This Month"
          value={mockUserStats.newUsersThisMonth}
          icon={UserPlus}
          accent="info"
        />
        <StatCard
          label="2FA Adoption"
          value={`${mockUserStats.twoFactorAdoption}%`}
          icon={ShieldCheck}
          accent={mockUserStats.twoFactorAdoption >= 80 ? "success" : "warning"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Users table — 2/3 */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FilterBar
                filters={statusFilters}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
                searchValue={search}
                onSearchChange={setSearch}
                placeholder="Search by name or email..."
                className="mb-0 flex-1"
              />
            </div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm text-secondary-foreground">
                  Role:
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-secondary-foreground">
                {filtered.length} user{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Last Login</th>
                    <th className="pb-2 text-center font-medium">2FA</th>
                    <th className="pb-2 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((user) => {
                    const sc =
                      statusColors[user.status] ?? statusColors.Inactive;
                    const rc =
                      roleColors[user.role] ?? roleColors.student;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-secondary/40 transition-colors"
                      >
                        <td className="py-2.5">
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-xs text-secondary-foreground">
                            {user.email}
                          </p>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${rc.bg} ${rc.text}`}
                          >
                            {roleLabelMap[user.role]}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatLastLogin(user.lastLogin)}
                        </td>
                        <td className="py-2.5 text-center">
                          {user.twoFactorEnabled ? (
                            <Check className="mx-auto h-4 w-4 text-[#16a34a]" />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-[#dc2626]" />
                          )}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No users match the selected filters.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right sidebar — 1/3 */}
        <div className="space-y-6">
          <SectionCard title="Users by Role">
            <div className="space-y-2.5">
              {usersByRole.map((r) => (
                <div key={r.role}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{r.role}</span>
                    <span className="font-medium">{r.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{
                        width: `${(r.count / maxRoleCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent Registrations">
            <div className="space-y-3">
              {recentRegistrations.map((u) => {
                const rc = roleColors[u.role] ?? roleColors.student;
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                      {u.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {u.fullName}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${rc.bg} ${rc.text}`}
                        >
                          {roleLabelMap[u.role]}
                        </span>
                        <span className="text-xs text-secondary-foreground">
                          {formatDate(u.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
