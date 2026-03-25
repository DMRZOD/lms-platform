"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, XCircle, Zap } from "lucide-react";
import { KPIGauge } from "@/components/deputy/kpi-gauge";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockKPIs } from "@/constants/deputy-mock-data";
import type { KPICategory } from "@/types/deputy";

const categoryFilters = [
  { label: "All", value: "all" },
  { label: "Academic", value: "Academic" },
  { label: "Financial", value: "Financial" },
  { label: "Quality", value: "Quality" },
  { label: "Operational", value: "Operational" },
  { label: "Student", value: "Student" },
];

const departments = [
  "All",
  "Engineering",
  "Economics",
  "Health Sciences",
  "Humanities",
  "Design",
  "Natural Sciences",
];

const categoryColors: Record<string, string> = {
  Academic: "#3b82f6",
  Financial: "#22c55e",
  Quality: "#f59e0b",
  Operational: "#8b5cf6",
  Student: "#ec4899",
};

export default function KPICenterPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("All");
  const [search, setSearch] = useState("");

  const totalKPIs = mockKPIs.length;
  const onTrack = mockKPIs.filter((k) => k.status === "OnTrack").length;
  const atRisk = mockKPIs.filter((k) => k.status === "AtRisk").length;
  const critical = mockKPIs.filter((k) => k.status === "Critical").length;
  const exceeded = mockKPIs.filter((k) => k.status === "Exceeded").length;

  const filtered = mockKPIs.filter((kpi) => {
    if (categoryFilter !== "all" && kpi.category !== (categoryFilter as KPICategory)) return false;
    if (deptFilter !== "All" && kpi.department && kpi.department !== deptFilter) return false;
    if (search && !kpi.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const alertKPIs = mockKPIs.filter(
    (k) => k.status === "AtRisk" || k.status === "Critical",
  );

  const categoryBreakdown = Object.entries(
    mockKPIs.reduce(
      (acc, kpi) => {
        if (!acc[kpi.category]) acc[kpi.category] = { onTrack: 0, atRisk: 0, critical: 0, exceeded: 0 };
        if (kpi.status === "OnTrack") acc[kpi.category].onTrack++;
        else if (kpi.status === "AtRisk") acc[kpi.category].atRisk++;
        else if (kpi.status === "Critical") acc[kpi.category].critical++;
        else if (kpi.status === "Exceeded") acc[kpi.category].exceeded++;
        return acc;
      },
      {} as Record<string, { onTrack: number; atRisk: number; critical: number; exceeded: number }>,
    ),
  );

  return (
    <div>
      <PageHeader
        title="KPI Center"
        description="Monitor all key performance indicators across departments and categories"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        <StatCard label="Total KPIs" value={totalKPIs} icon={Zap} />
        <StatCard
          label="On Track"
          value={onTrack}
          icon={CheckCircle}
          accent="success"
          subtitle={`${Math.round((onTrack / totalKPIs) * 100)}% of total`}
        />
        <StatCard
          label="At Risk"
          value={atRisk}
          icon={AlertTriangle}
          accent="warning"
          subtitle={`${Math.round((atRisk / totalKPIs) * 100)}% of total`}
        />
        <StatCard
          label="Critical"
          value={critical}
          icon={XCircle}
          accent="danger"
          subtitle={`${Math.round((critical / totalKPIs) * 100)}% of total`}
        />
        <StatCard
          label="Exceeded"
          value={exceeded}
          icon={TrendingUp}
          accent="info"
          subtitle={`${Math.round((exceeded / totalKPIs) * 100)}% of total`}
        />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategoryFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                categoryFilter === f.value
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search KPIs..."
            className="w-48 rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title={`KPI Dashboard (${filtered.length})`}>
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-secondary-foreground">
                No KPIs match the selected filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filtered.map((kpi) => (
                  <KPIGauge key={kpi.id} kpi={kpi} />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="KPI Alerts">
            <div className="space-y-3">
              {alertKPIs.map((kpi) => (
                <div
                  key={kpi.id}
                  className="flex items-start gap-2 rounded-lg border border-border p-3"
                >
                  {kpi.status === "Critical" ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ef4444]" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{kpi.name}</p>
                    <p className="text-xs text-secondary-foreground">
                      {kpi.currentValue}
                      {kpi.unit} / Target: {kpi.targetValue}
                      {kpi.unit}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {kpi.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-[#ef4444]" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-[#22c55e]" />
                      )}
                      <span
                        className={`text-xs ${kpi.changePercent < 0 ? "text-[#ef4444]" : "text-[#22c55e]"}`}
                      >
                        {kpi.changePercent > 0 ? "+" : ""}
                        {kpi.changePercent}% this period
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Category Breakdown">
            <div className="space-y-4">
              {categoryBreakdown.map(([category, counts]) => {
                const total =
                  counts.onTrack + counts.atRisk + counts.critical + counts.exceeded;
                return (
                  <div key={category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              categoryColors[category] ?? "#6b7280",
                          }}
                        />
                        <span className="font-medium">{category}</span>
                      </div>
                      <span className="text-xs text-secondary-foreground">
                        {total} KPIs
                      </span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full">
                      {counts.exceeded > 0 && (
                        <div
                          className="bg-[#3b82f6]"
                          style={{ width: `${(counts.exceeded / total) * 100}%` }}
                        />
                      )}
                      {counts.onTrack > 0 && (
                        <div
                          className="bg-[#22c55e]"
                          style={{ width: `${(counts.onTrack / total) * 100}%` }}
                        />
                      )}
                      {counts.atRisk > 0 && (
                        <div
                          className="bg-[#f59e0b]"
                          style={{ width: `${(counts.atRisk / total) * 100}%` }}
                        />
                      )}
                      {counts.critical > 0 && (
                        <div
                          className="bg-[#ef4444]"
                          style={{ width: `${(counts.critical / total) * 100}%` }}
                        />
                      )}
                    </div>
                    <div className="mt-1 flex gap-3 text-xs text-secondary-foreground">
                      {counts.exceeded > 0 && (
                        <span className="text-[#1e40af]">↑{counts.exceeded}</span>
                      )}
                      {counts.onTrack > 0 && (
                        <span className="text-[#166534]">✓{counts.onTrack}</span>
                      )}
                      {counts.atRisk > 0 && (
                        <span className="text-[#92400e]">⚠{counts.atRisk}</span>
                      )}
                      {counts.critical > 0 && (
                        <span className="text-[#991b1b]">✗{counts.critical}</span>
                      )}
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
