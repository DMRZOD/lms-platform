"use client";

import { Check, Key, Lock, ShieldCheck, Users, X } from "lucide-react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockRoleDefinitions } from "@/constants/admin-mock-data";
import type { PermissionModule, RolePermission } from "@/types/admin";

const modules: { key: PermissionModule; label: string }[] = [
  { key: "users", label: "Users" },
  { key: "courses", label: "Courses" },
  { key: "finance", label: "Finance" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
  { key: "integrations", label: "Integrations" },
  { key: "logs", label: "Logs" },
  { key: "security", label: "Security" },
];

const accessLevels: RolePermission[] = ["read", "write", "delete", "admin"];

const accessLabelMap: Record<RolePermission, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
  admin: "Admin",
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

export default function AdminRolesPage() {
  const totalPermissions = mockRoleDefinitions.reduce(
    (acc, r) =>
      acc + r.permissions.reduce((a, p) => a + p.access.length, 0),
    0,
  );
  const systemRoles = mockRoleDefinitions.filter((r) => r.isSystem).length;
  const totalUsersAssigned = mockRoleDefinitions.reduce(
    (acc, r) => acc + r.userCount,
    0,
  );

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Manage role definitions, access levels, and permission matrices"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Roles"
          value={mockRoleDefinitions.length}
          icon={ShieldCheck}
        />
        <StatCard
          label="System Roles"
          value={systemRoles}
          icon={Lock}
          accent="info"
        />
        <StatCard
          label="Permission Entries"
          value={totalPermissions}
          icon={Key}
        />
        <StatCard
          label="Users Assigned"
          value={totalUsersAssigned.toLocaleString()}
          icon={Users}
          accent="success"
        />
      </div>

      <SectionCard title="Role Definitions">
        <Accordion type="multiple" className="w-full">
          {mockRoleDefinitions.map((role) => {
            const rc = roleColors[role.role] ?? roleColors.student;
            return (
              <AccordionItem key={role.id} value={role.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center gap-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rc.bg} ${rc.text}`}
                    >
                      {role.label}
                    </span>
                    <span className="text-sm text-secondary-foreground">
                      {role.description}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-secondary-foreground">
                        {role.userCount} user{role.userCount !== 1 ? "s" : ""}
                      </span>
                      {role.isSystem && (
                        <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-xs text-[#475569]">
                          System
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto pb-2 pt-1">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-secondary-foreground">
                          <th className="pb-2 font-medium">Module</th>
                          {accessLevels.map((a) => (
                            <th
                              key={a}
                              className="pb-2 text-center font-medium"
                            >
                              {accessLabelMap[a]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {modules.map((mod) => {
                          const perm = role.permissions.find(
                            (p) => p.module === mod.key,
                          );
                          const access = perm?.access ?? [];
                          return (
                            <tr
                              key={mod.key}
                              className="hover:bg-secondary/30 transition-colors"
                            >
                              <td className="py-2 font-medium">{mod.label}</td>
                              {accessLevels.map((level) => (
                                <td
                                  key={level}
                                  className="py-2 text-center"
                                >
                                  {access.includes(level) ? (
                                    <Check className="mx-auto h-4 w-4 text-[#16a34a]" />
                                  ) : (
                                    <X className="mx-auto h-4 w-4 text-[#e2e8f0]" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {role.isSystem && (
                      <p className="mt-3 text-xs text-secondary-foreground">
                        System roles cannot be deleted. Contact a super admin to
                        modify permissions.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </SectionCard>
    </div>
  );
}
