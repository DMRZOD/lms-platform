"use client";

import { BarChart3, DollarSign, Server, TrendingUp, Users } from "lucide-react";

import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockCapacityResources,
  mockCapacityStats,
  mockCostEntries,
  mockInfraItems,
  mockScalingRecommendations,
} from "@/constants/it-ops-mock-data";

const urgencyColors: Record<string, { bg: string; text: string }> = {
  Immediate: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Soon: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Planned: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const trendColors: Record<string, string> = {
  Up: "text-[#dc2626]",
  Down: "text-[#166534]",
  Stable: "text-secondary-foreground",
};

const infraStatusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Inactive: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
  Decommissioned: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

function usageAccent(pct: number): "danger" | "warning" | "default" {
  if (pct >= 85) return "danger";
  if (pct >= 70) return "warning";
  return "default";
}

export default function ItOpsCapacityPage() {
  const stats = mockCapacityStats;

  const totalMonthlyCost = mockCostEntries.reduce((sum, e) => sum + e.monthlyCost, 0);

  return (
    <div>
      <PageHeader
        title="Capacity Planning"
        description="Resource utilization, growth trends, cost analysis, and scaling recommendations"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="CPU Utilization"
          value={`${stats.cpuUtilization}%`}
          icon={BarChart3}
          subtitle="Avg across nodes"
          accent={usageAccent(stats.cpuUtilization)}
        />
        <StatCard
          label="Memory Utilization"
          value={`${stats.memoryUtilization}%`}
          icon={Server}
          subtitle="Avg across nodes"
          accent={usageAccent(stats.memoryUtilization)}
        />
        <StatCard
          label="Storage Utilization"
          value={`${stats.storageUtilization}%`}
          subtitle="Primary storage"
          accent={usageAccent(stats.storageUtilization)}
        />
        <StatCard
          label="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Users}
          subtitle="Current concurrent"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Resource Utilization */}
          <SectionCard title="Resource Utilization">
            <div className="space-y-4">
              {mockCapacityResources.map((res) => {
                const usagePct = Math.round((res.currentUsage / res.limit) * 100);
                return (
                  <div key={res.id}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{res.name}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                          {res.type}
                        </span>
                        <span className={`text-xs font-medium ${trendColors[res.trend]}`}>
                          {res.trend === "Up" ? "↑" : res.trend === "Down" ? "↓" : "→"} {res.trend}
                        </span>
                      </div>
                      <span className="font-medium">
                        {typeof res.currentUsage === "number" && res.currentUsage < 10
                          ? res.currentUsage.toFixed(1)
                          : res.currentUsage.toLocaleString()}{" "}
                        / {res.limit} {res.unit} ({usagePct}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${usagePct >= 85 ? "bg-[#ef4444]" : usagePct >= 70 ? "bg-[#f59e0b]" : "bg-foreground"}`}
                        style={{ width: `${Math.min(usagePct, 100)}%` }}
                      />
                    </div>
                    {res.forecastedFullDate && (
                      <p className="mt-0.5 text-xs text-[#b45309]">
                        Projected full: {res.forecastedFullDate}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Cost Analysis */}
          <SectionCard
            title="Monthly Cost by Resource"
            action={
              <span className="font-medium">
                Total: ${totalMonthlyCost.toLocaleString()}/mo
              </span>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Resource</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Monthly Cost</th>
                    <th className="pb-3 font-medium">Trend</th>
                    <th className="pb-3 font-medium">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...mockCostEntries]
                    .sort((a, b) => b.monthlyCost - a.monthlyCost)
                    .map((cost) => (
                      <tr key={cost.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{cost.resource}</td>
                        <td className="py-2.5">
                          <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">{cost.category}</span>
                        </td>
                        <td className="py-2.5 font-medium">${cost.monthlyCost.toLocaleString()}</td>
                        <td className={`py-2.5 font-medium ${trendColors[cost.trend]}`}>
                          {cost.trend === "Up" ? "↑" : cost.trend === "Down" ? "↓" : "→"} {cost.trend}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-foreground"
                                style={{ width: `${(cost.monthlyCost / totalMonthlyCost) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-secondary-foreground">
                              {Math.round((cost.monthlyCost / totalMonthlyCost) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Scaling Recommendations */}
          <SectionCard title="Scaling Recommendations">
            <div className="space-y-3">
              {mockScalingRecommendations.map((rec) => {
                const colors = urgencyColors[rec.urgency] ?? urgencyColors.Planned;
                return (
                  <div key={rec.id} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{rec.resource}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {rec.urgency}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-secondary-foreground">{rec.recommendation}</p>
                    <p className="mt-1 text-xs font-medium text-foreground">{rec.estimatedCost}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Infrastructure Inventory */}
          <SectionCard title="Infrastructure Inventory">
            <div className="divide-y divide-border">
              {mockInfraItems.map((item) => {
                const colors = infraStatusColors[item.status] ?? infraStatusColors.Active;
                return (
                  <div key={item.id} className="py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{item.name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-foreground">{item.type} · {item.location}</p>
                    <p className="text-xs text-secondary-foreground">{item.specs}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Growth Summary */}
          <SectionCard title="Growth Summary">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Monthly growth rate</span>
                <span className="flex items-center gap-1 font-medium text-[#dc2626]">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {stats.monthlyGrowthPercent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Storage full by</span>
                <span className="font-medium">{stats.projectedFullDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Total monthly cost</span>
                <span className="flex items-center gap-1 font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  ${totalMonthlyCost.toLocaleString()}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
