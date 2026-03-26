"use client";

import { useState } from "react";
import { Link2, RefreshCw } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockIntegrationStats,
  mockItOpsIntegrations,
  mockItOpsSyncEvents,
} from "@/constants/it-ops-mock-data";

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Connected: { bg: "bg-[#dcfce7]", text: "text-[#166534]", dot: "bg-[#22c55e]" },
  Disconnected: { bg: "bg-[#f1f5f9]", text: "text-[#475569]", dot: "bg-[#94a3b8]" },
  Error: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]", dot: "bg-[#ef4444]" },
  Syncing: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]", dot: "bg-[#3b82f6]" },
};

const syncResultColors: Record<string, { bg: string; text: string }> = {
  Success: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Partial: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
};

const integrationFilters = [
  { label: "All", value: "all" },
  { label: "Connected", value: "Connected" },
  { label: "Error", value: "Error" },
  { label: "Disconnected", value: "Disconnected" },
  { label: "Syncing", value: "Syncing" },
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

export default function ItOpsIntegrationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = mockIntegrationStats;

  const filtered = mockItOpsIntegrations.filter((intg) => {
    const matchesStatus = filter === "all" || intg.status === filter;
    const matchesSearch =
      intg.name.toLowerCase().includes(search.toLowerCase()) ||
      intg.type.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Integration Management"
        description="Manage and monitor external system integrations: Teams, 1C, aSc, Classmate, and more"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Total Integrations"
          value={stats.totalIntegrations}
          icon={Link2}
        />
        <StatCard
          label="Connected"
          value={stats.connected}
          accent="success"
        />
        <StatCard
          label="Errored"
          value={stats.errored}
          accent={stats.errored > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Syncs Today"
          value={stats.totalSyncsToday}
          icon={RefreshCw}
        />
        <StatCard
          label="Failed Syncs Today"
          value={stats.failedSyncsToday}
          accent={stats.failedSyncsToday > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Avg Sync Duration"
          value={stats.avgSyncDuration}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Integrations Table */}
          <SectionCard title={`Integrations (${filtered.length})`}>
            <FilterBar
              filters={integrationFilters}
              activeFilter={filter}
              onFilterChange={setFilter}
              searchValue={search}
              onSearchChange={setSearch}
              placeholder="Search integrations..."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Integration</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Last Sync</th>
                    <th className="pb-3 font-medium">Frequency</th>
                    <th className="pb-3 font-medium">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((intg) => {
                    const colors = statusColors[intg.status] ?? statusColors.Disconnected;
                    return (
                      <tr key={intg.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5">
                          <p className="font-medium">{intg.name}</p>
                          <p className="mt-0.5 max-w-[180px] truncate text-xs text-secondary-foreground">
                            {intg.description}
                          </p>
                        </td>
                        <td className="py-2.5">
                          <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">
                            {intg.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {intg.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatDateTime(intg.lastSync)}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{intg.syncFrequency}</td>
                        <td className={`py-2.5 font-medium ${intg.errorCount > 0 ? "text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {intg.errorCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Sync History */}
          <SectionCard title="Recent Sync History">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Integration</th>
                    <th className="pb-3 font-medium">Result</th>
                    <th className="pb-3 font-medium">Records</th>
                    <th className="pb-3 font-medium">Errors</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockItOpsSyncEvents.map((evt) => {
                    const colors = syncResultColors[evt.status] ?? syncResultColors.Success;
                    return (
                      <tr key={evt.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{evt.integrationName}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{evt.recordsProcessed.toLocaleString()}</td>
                        <td className={`py-2.5 ${evt.errors > 0 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {evt.errors}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{evt.duration}</td>
                        <td className="py-2.5 text-secondary-foreground">{formatDateTime(evt.timestamp)}</td>
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
          {/* Integration Health Summary */}
          <SectionCard title="Integration Health">
            <div className="space-y-3">
              {mockItOpsIntegrations.map((intg) => {
                const colors = statusColors[intg.status] ?? statusColors.Disconnected;
                return (
                  <div key={intg.id} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`} />
                        <p className="truncate text-sm font-medium">{intg.name}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {intg.status}
                      </span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-secondary-foreground">
                      <span>{intg.type}</span>
                      <span>{intg.recordsSynced.toLocaleString()} records</span>
                    </div>
                    {intg.errorCount > 0 && (
                      <p className="mt-0.5 text-xs font-medium text-[#dc2626]">{intg.errorCount} errors</p>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              {[
                { label: "Trigger Manual Sync", desc: "Force sync for any integration" },
                { label: "Configure API Keys", desc: "Manage integration credentials" },
                { label: "View Full Sync Logs", desc: "Detailed sync event history" },
              ].map((action) => (
                <div
                  key={action.label}
                  className="cursor-pointer rounded-md border border-border p-3 transition-colors hover:bg-secondary"
                >
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-secondary-foreground">{action.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
