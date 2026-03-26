"use client";

import { useState } from "react";
import { Calendar, Clock, Wrench } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockChangeRequests,
  mockMaintenanceStats,
  mockMaintenanceWindows,
  mockPatchStatuses,
  mockServiceRestarts,
} from "@/constants/it-ops-mock-data";

const maintenanceStatusColors: Record<string, { bg: string; text: string }> = {
  Scheduled: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  InProgress: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Completed: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Cancelled: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const maintenanceTypeColors: Record<string, { bg: string; text: string }> = {
  Planned: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Emergency: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Routine: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const patchStatusColors: Record<string, { bg: string; text: string }> = {
  UpToDate: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  PatchAvailable: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  PatchPending: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const changeStatusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Approved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  InProgress: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Completed: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
  Rejected: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const changePriorityColors: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  High: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  Medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const maintenanceFilters = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsMaintenancePage() {
  const [mwFilter, setMwFilter] = useState("all");
  const [mwSearch, setMwSearch] = useState("");

  const stats = mockMaintenanceStats;

  const filteredWindows = mockMaintenanceWindows.filter((mw) => {
    const matchesStatus = mwFilter === "all" || mw.status === mwFilter;
    const matchesSearch =
      mw.title.toLowerCase().includes(mwSearch.toLowerCase()) ||
      mw.affectedServices.some((s) => s.toLowerCase().includes(mwSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="System Maintenance"
        description="Maintenance windows, patch management, and change request queue"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Scheduled Windows"
          value={stats.scheduledWindows}
          icon={Calendar}
          accent="info"
        />
        <StatCard
          label="Completed This Month"
          value={stats.completedThisMonth}
          accent="success"
        />
        <StatCard
          label="Pending Patches"
          value={stats.pendingPatches}
          icon={Wrench}
          accent={stats.pendingPatches > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Change Requests"
          value={stats.changeRequests}
          accent={stats.changeRequests > 0 ? "info" : "default"}
        />
        <StatCard
          label="Avg Downtime"
          value={`${stats.avgDowntimeMinutes}m`}
          icon={Clock}
          subtitle="Per maintenance window"
        />
        <StatCard
          label="Next Window"
          value={new Date(stats.nextWindow).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          subtitle={new Date(stats.nextWindow).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Maintenance Windows */}
          <SectionCard title="Maintenance Windows">
            <FilterBar
              filters={maintenanceFilters}
              activeFilter={mwFilter}
              onFilterChange={setMwFilter}
              searchValue={mwSearch}
              onSearchChange={setMwSearch}
              placeholder="Search windows..."
            />
            <div className="space-y-3">
              {filteredWindows.map((mw) => {
                const stColors = maintenanceStatusColors[mw.status] ?? maintenanceStatusColors.Scheduled;
                const typeColors = maintenanceTypeColors[mw.type] ?? maintenanceTypeColors.Planned;
                return (
                  <div key={mw.id} className="rounded-md border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{mw.title}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            {mw.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-secondary-foreground">{mw.description}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${stColors.bg} ${stColors.text}`}>
                        {mw.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary-foreground">
                      <span>Start: {formatDateTime(mw.scheduledStart)}</span>
                      <span>End: {formatDateTime(mw.scheduledEnd)}</span>
                      <span>By: {mw.createdBy}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {mw.affectedServices.map((svc) => (
                        <span key={svc} className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Patch Status */}
          <SectionCard title="Patch Status">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">System</th>
                    <th className="pb-3 font-medium">Current Version</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Last Patched</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPatchStatuses.map((ps) => {
                    const colors = patchStatusColors[ps.status] ?? patchStatusColors.UpToDate;
                    return (
                      <tr key={ps.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{ps.systemName}</td>
                        <td className="py-2.5 font-mono text-xs text-secondary-foreground">
                          {ps.currentVersion}
                          {ps.currentVersion !== ps.latestVersion && (
                            <div className="text-[#b45309]">→ {ps.latestVersion}</div>
                          )}
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {ps.status === "UpToDate" ? "Up to Date" : ps.status === "PatchAvailable" ? "Available" : ps.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {ps.patchDate ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Change Requests */}
          <SectionCard title="Change Request Queue">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Requester</th>
                    <th className="pb-3 font-medium">Scheduled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockChangeRequests.map((cr) => {
                    const stColors = changeStatusColors[cr.status] ?? changeStatusColors.Pending;
                    const prColors = changePriorityColors[cr.priority] ?? changePriorityColors.Low;
                    return (
                      <tr key={cr.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{cr.title}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${prColors.bg} ${prColors.text}`}>
                            {cr.priority}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stColors.bg} ${stColors.text}`}>
                            {cr.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{cr.requester}</td>
                        <td className="py-2.5 text-secondary-foreground">
                          {cr.scheduledFor ? formatDateTime(cr.scheduledFor) : "TBD"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Service Restart History */}
          <SectionCard title="Recent Service Restarts">
            <div className="divide-y divide-border">
              {mockServiceRestarts.map((sr) => (
                <div key={sr.id} className="py-3">
                  <p className="text-sm font-medium">{sr.serviceName}</p>
                  <p className="text-xs text-secondary-foreground">{sr.reason}</p>
                  <div className="mt-1 flex justify-between text-xs text-secondary-foreground">
                    <span>{formatDateTime(sr.restartedAt)}</span>
                    <span className="font-medium text-foreground">Downtime: {sr.downtime}</span>
                  </div>
                  <p className="text-xs text-secondary-foreground">By: {sr.restartedBy}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Impact Summary */}
          <SectionCard title="Maintenance Impact Analysis">
            <div className="space-y-2.5 text-sm">
              {[
                { label: "Avg services affected", value: "2.1 per window" },
                { label: "Peak downtime window", value: "Emergency restarts" },
                { label: "Most affected service", value: "Notification Service" },
                { label: "Zero-downtime windows", value: "2 of 3 planned" },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-2">
                  <span className="text-secondary-foreground">{item.label}</span>
                  <span className="text-right font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
