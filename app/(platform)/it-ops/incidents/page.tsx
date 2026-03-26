"use client";

import { useState } from "react";
import { Clock, Flame } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockIncidentStats,
  mockItOpsIncidents,
} from "@/constants/it-ops-mock-data";

const statusColors: Record<string, { bg: string; text: string }> = {
  Open: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Investigating: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  Mitigated: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Resolved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Closed: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const severityColors: Record<string, { bg: string; text: string }> = {
  P1: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  P2: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  P3: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  P4: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Open", value: "Open" },
  { label: "Investigating", value: "Investigating" },
  { label: "Mitigated", value: "Mitigated" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
];

const severityFilters = [
  { label: "All", value: "all" },
  { label: "P1", value: "P1" },
  { label: "P2", value: "P2" },
  { label: "P3", value: "P3" },
  { label: "P4", value: "P4" },
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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ItOpsIncidentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = mockIncidentStats;

  const filtered = mockItOpsIncidents.filter((inc) => {
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || inc.severity === severityFilter;
    const matchesSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.assignee.toLowerCase().includes(search.toLowerCase()) ||
      inc.affectedServices.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const recentResolved = mockItOpsIncidents
    .filter((i) => i.status === "Resolved" || i.status === "Closed")
    .slice(0, 4);

  const severityCounts = {
    P1: mockItOpsIncidents.filter((i) => i.severity === "P1").length,
    P2: mockItOpsIncidents.filter((i) => i.severity === "P2").length,
    P3: mockItOpsIncidents.filter((i) => i.severity === "P3").length,
    P4: mockItOpsIncidents.filter((i) => i.severity === "P4").length,
  };
  const maxCount = Math.max(...Object.values(severityCounts), 1);

  return (
    <div>
      <PageHeader
        title="Incident Management"
        description="Track, investigate, and resolve infrastructure incidents"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Open Incidents"
          value={stats.openIncidents}
          icon={Flame}
          accent={stats.openIncidents > 0 ? "danger" : "default"}
        />
        <StatCard
          label="MTTR"
          value={`${stats.mttrMinutes}m`}
          icon={Clock}
          subtitle="Mean time to resolve"
        />
        <StatCard
          label="MTTA"
          value={`${stats.mttaMinutes}m`}
          icon={Clock}
          subtitle="Mean time to acknowledge"
        />
        <StatCard
          label="Resolved This Week"
          value={stats.resolvedThisWeek}
          accent="success"
        />
        <StatCard
          label="P1 Incidents"
          value={stats.p1Count}
          accent={stats.p1Count > 0 ? "danger" : "default"}
        />
        <StatCard
          label="P2 Incidents"
          value={stats.p2Count}
          accent={stats.p2Count > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="lg:col-span-2">
          <SectionCard title={`Incidents (${filtered.length})`}>
            {/* Status filter */}
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-secondary-foreground">Filter by Status</p>
              <div className="flex flex-wrap gap-1.5">
                {statusFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === f.value
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Severity filter */}
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium text-secondary-foreground">Filter by Severity</p>
              <div className="flex flex-wrap gap-1.5">
                {severityFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setSeverityFilter(f.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      severityFilter === f.value
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Search */}
            <FilterBar
              filters={[]}
              activeFilter=""
              onFilterChange={() => {}}
              searchValue={search}
              onSearchChange={setSearch}
              placeholder="Search incidents..."
              className="mb-4"
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Incident</th>
                    <th className="pb-3 font-medium">Severity</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Assignee</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-secondary-foreground">
                        No incidents match your filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inc) => {
                      const sevColors = severityColors[inc.severity] ?? severityColors.P4;
                      const stColors = statusColors[inc.status] ?? statusColors.Open;
                      return (
                        <tr key={inc.id} className="transition-colors hover:bg-secondary/40">
                          <td className="py-3">
                            <p className="font-medium">{inc.title}</p>
                            <p className="mt-0.5 text-xs text-secondary-foreground">
                              {inc.affectedServices.join(", ")}
                            </p>
                          </td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevColors.bg} ${sevColors.text}`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stColors.bg} ${stColors.text}`}>
                              {inc.status}
                            </span>
                          </td>
                          <td className="py-3 text-secondary-foreground">{inc.assignee}</td>
                          <td className="py-3 text-secondary-foreground">{timeAgo(inc.createdAt)}</td>
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
          {/* Severity Breakdown */}
          <SectionCard title="Incidents by Severity">
            <div className="space-y-3">
              {(Object.entries(severityCounts) as [string, number][]).map(([sev, count]) => {
                const colors = severityColors[sev] ?? severityColors.P4;
                return (
                  <div key={sev}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {sev}
                        </span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Recently Resolved */}
          <SectionCard title="Recently Resolved">
            <div className="divide-y divide-border">
              {recentResolved.map((inc) => {
                const sevColors = severityColors[inc.severity] ?? severityColors.P4;
                return (
                  <div key={inc.id} className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevColors.bg} ${sevColors.text}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{inc.title}</p>
                    <p className="text-xs text-secondary-foreground">
                      {inc.resolvedAt ? formatDateTime(inc.resolvedAt) : "—"}
                    </p>
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
