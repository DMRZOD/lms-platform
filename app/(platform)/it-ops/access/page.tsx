"use client";

import { useState } from "react";
import { Key, KeyRound, Server, Shield } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAccessRequests,
  mockAccessStats,
  mockSSHKeys,
  mockServerAccess,
  mockServiceAccounts,
} from "@/constants/it-ops-mock-data";

const keyStatusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Expired: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Revoked: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const requestStatusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Approved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Denied: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Expired: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const requestFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Denied", value: "Denied" },
];

const NOW = new Date("2026-03-26").getTime();

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsAccessPage() {
  const [requestFilter, setRequestFilter] = useState("all");
  const [requestSearch, setRequestSearch] = useState("");

  const stats = mockAccessStats;

  const filteredRequests = mockAccessRequests.filter((req) => {
    const matchesStatus = requestFilter === "all" || req.status === requestFilter;
    const matchesSearch =
      req.requester.toLowerCase().includes(requestSearch.toLowerCase()) ||
      req.serverName.toLowerCase().includes(requestSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const expiringKeys = mockSSHKeys.filter((k) => {
    if (!k.expiresAt) return false;
    const days = Math.ceil((new Date(k.expiresAt).getTime() - NOW) / 86400000);
    return days < 30 && days > 0;
  });

  return (
    <div>
      <PageHeader
        title="Infrastructure Access Management"
        description="SSH keys, server access, service accounts, and access requests"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="SSH Keys"
          value={stats.totalSSHKeys}
          icon={Key}
          subtitle={`${mockSSHKeys.filter((k) => k.status === "Active").length} active`}
        />
        <StatCard
          label="Active Servers"
          value={stats.activeServers}
          icon={Server}
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingRequests}
          icon={KeyRound}
          accent={stats.pendingRequests > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Service Accounts"
          value={stats.serviceAccounts}
          icon={Shield}
        />
        <StatCard
          label="Expiring Soon"
          value={expiringKeys.length}
          accent={expiringKeys.length > 0 ? "warning" : "default"}
          subtitle="Keys within 30 days"
        />
        <StatCard
          label="Access Entries"
          value={mockServerAccess.length}
          subtitle="Active grants"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* SSH Keys */}
          <SectionCard title="SSH Keys">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Fingerprint</th>
                    <th className="pb-3 font-medium">Last Used</th>
                    <th className="pb-3 font-medium">Expires</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSSHKeys.map((key) => {
                    const colors = keyStatusColors[key.status] ?? keyStatusColors.Active;
                    const daysLeft = key.expiresAt
                      ? Math.ceil((new Date(key.expiresAt).getTime() - NOW) / 86400000)
                      : null;
                    return (
                      <tr key={key.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{key.name}</td>
                        <td className="py-2.5 text-secondary-foreground">{key.user}</td>
                        <td className="py-2.5 font-mono text-xs text-secondary-foreground">{key.fingerprint}</td>
                        <td className="py-2.5 text-secondary-foreground">
                          {key.lastUsed ? formatDateTime(key.lastUsed) : "Never"}
                        </td>
                        <td className={`py-2.5 ${daysLeft !== null && daysLeft < 30 && daysLeft > 0 ? "font-medium text-[#b45309]" : daysLeft !== null && daysLeft <= 0 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {key.expiresAt ? `${formatDate(key.expiresAt)}${daysLeft !== null && daysLeft > 0 ? ` (${daysLeft}d)` : ""}` : "No expiry"}
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {key.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Server Access */}
          <SectionCard title="Server Access Grants">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Server</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Granted</th>
                    <th className="pb-3 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockServerAccess.map((access) => (
                    <tr key={access.id} className="transition-colors hover:bg-secondary/40">
                      <td className="py-2.5 font-medium">{access.serverName}</td>
                      <td className="py-2.5 text-secondary-foreground">{access.userName}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">{access.role}</span>
                      </td>
                      <td className="py-2.5 text-secondary-foreground">{formatDate(access.grantedAt)}</td>
                      <td className="py-2.5 text-secondary-foreground">
                        {access.expiresAt ? formatDate(access.expiresAt) : "Permanent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Access Requests */}
          <SectionCard title="Access Request Queue">
            <FilterBar
              filters={requestFilters}
              activeFilter={requestFilter}
              onFilterChange={setRequestFilter}
              searchValue={requestSearch}
              onSearchChange={setRequestSearch}
              placeholder="Search requests..."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Requester</th>
                    <th className="pb-3 font-medium">Server</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Requested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-secondary-foreground">
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const colors = requestStatusColors[req.status] ?? requestStatusColors.Pending;
                      return (
                        <tr key={req.id} className="transition-colors hover:bg-secondary/40">
                          <td className="py-2.5 font-medium">{req.requester}</td>
                          <td className="py-2.5 text-secondary-foreground">{req.serverName}</td>
                          <td className="max-w-[160px] py-2.5">
                            <p className="truncate text-xs text-secondary-foreground" title={req.reason}>
                              {req.reason}
                            </p>
                          </td>
                          <td className="py-2.5">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-secondary-foreground">{formatDateTime(req.requestedAt)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Service Accounts */}
          <SectionCard title="Service Accounts">
            <div className="divide-y divide-border">
              {mockServiceAccounts.map((svcAcc) => (
                <div key={svcAcc.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{svcAcc.name}</p>
                  </div>
                  <p className="text-xs text-secondary-foreground">Service: {svcAcc.service}</p>
                  <p className="text-xs text-secondary-foreground">
                    Key rotated: {formatDate(svcAcc.keyRotatedAt)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {svcAcc.permissions.slice(0, 3).map((perm) => (
                      <span key={perm} className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                        {perm}
                      </span>
                    ))}
                    {svcAcc.permissions.length > 3 && (
                      <span className="text-xs text-secondary-foreground">+{svcAcc.permissions.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Access Policy Summary */}
          <SectionCard title="Access Policies">
            <div className="space-y-3 text-sm">
              {[
                { label: "SSH key rotation", value: "Every 12 months" },
                { label: "Service account rotation", value: "Every 3 months" },
                { label: "Temporary access max", value: "30 days" },
                { label: "MFA required", value: "All admin roles" },
                { label: "Bastion host required", value: "Production access" },
              ].map((policy) => (
                <div key={policy.label} className="flex items-start justify-between gap-2">
                  <span className="text-secondary-foreground">{policy.label}</span>
                  <span className="text-right font-medium">{policy.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
