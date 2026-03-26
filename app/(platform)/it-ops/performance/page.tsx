"use client";

import { Activity, Database, Globe, Zap } from "lucide-react";

import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockCDNMetrics,
  mockPerformanceMetrics,
  mockPerformanceRecommendations,
  mockPerformanceStats,
  mockSlowQueries,
} from "@/constants/it-ops-mock-data";

const impactColors: Record<string, { bg: string; text: string }> = {
  High: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const effortColors: Record<string, { bg: string; text: string }> = {
  High: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Low: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsPerformancePage() {
  const stats = mockPerformanceStats;
  const maxResponseTime = Math.max(...mockPerformanceMetrics.map((m) => m.p99ResponseTime));

  return (
    <div>
      <PageHeader
        title="Performance Optimization"
        description="API response times, slow queries, CDN metrics, and optimization recommendations"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Avg Page Load"
          value={stats.avgPageLoad}
          icon={Globe}
          subtitle="Time to interactive"
        />
        <StatCard
          label="Avg API Response"
          value={stats.avgApiResponse}
          icon={Zap}
          subtitle="All endpoints"
        />
        <StatCard
          label="Cache Hit Ratio"
          value={stats.cacheHitRatio}
          icon={Activity}
          subtitle="CDN global"
          accent="success"
        />
        <StatCard
          label="Slow Queries"
          value={stats.slowQueries}
          icon={Database}
          accent={stats.slowQueries > 0 ? "warning" : "default"}
          subtitle="> 500ms avg"
        />
        <StatCard
          label="Error Rate"
          value={stats.errorRate}
          accent={parseFloat(stats.errorRate) > 1 ? "danger" : "default"}
        />
        <StatCard
          label="Throughput"
          value={stats.throughput}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* API Endpoint Response Times */}
          <SectionCard title="API Endpoint Response Times (Ranked by P99)">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Endpoint</th>
                    <th className="pb-3 font-medium">Avg</th>
                    <th className="pb-3 font-medium">P95</th>
                    <th className="pb-3 font-medium">P99</th>
                    <th className="pb-3 font-medium">Throughput</th>
                    <th className="pb-3 font-medium">Error Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...mockPerformanceMetrics]
                    .sort((a, b) => b.p99ResponseTime - a.p99ResponseTime)
                    .map((metric) => (
                      <tr key={metric.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">
                              {metric.method}
                            </span>
                            <span className="font-mono text-xs">{metric.endpoint}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{metric.avgResponseTime}ms</td>
                        <td className="py-2.5 text-secondary-foreground">{metric.p95ResponseTime}ms</td>
                        <td className={`py-2.5 font-medium ${metric.p99ResponseTime > 1000 ? "text-[#dc2626]" : metric.p99ResponseTime > 500 ? "text-[#b45309]" : "text-secondary-foreground"}`}>
                          {metric.p99ResponseTime}ms
                          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-foreground"
                              style={{ width: `${(metric.p99ResponseTime / maxResponseTime) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{metric.throughput.toLocaleString()}/min</td>
                        <td className={`py-2.5 ${metric.errorRate > 0.5 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {metric.errorRate}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Slow Queries */}
          <SectionCard title="Slow Queries (Top 5 by Avg Duration)">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Query</th>
                    <th className="pb-3 font-medium">Avg Duration</th>
                    <th className="pb-3 font-medium">Executions</th>
                    <th className="pb-3 font-medium">Last Executed</th>
                    <th className="pb-3 font-medium">Database</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSlowQueries.map((sq) => (
                    <tr key={sq.id} className="transition-colors hover:bg-secondary/40">
                      <td className="py-2.5">
                        <p className="max-w-[200px] truncate font-mono text-xs text-secondary-foreground" title={sq.query}>
                          {sq.query}
                        </p>
                      </td>
                      <td className={`py-2.5 font-medium ${sq.avgDuration > 1000 ? "text-[#dc2626]" : "text-[#b45309]"}`}>
                        {sq.avgDuration}ms
                      </td>
                      <td className="py-2.5 text-secondary-foreground">{sq.executions.toLocaleString()}</td>
                      <td className="py-2.5 text-secondary-foreground">{formatDateTime(sq.lastExecuted)}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">{sq.database}</span>
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
          {/* Recommendations */}
          <SectionCard title="Optimization Recommendations">
            <div className="space-y-3">
              {mockPerformanceRecommendations.map((rec) => {
                const impactCol = impactColors[rec.impact] ?? impactColors.Low;
                const effortCol = effortColors[rec.effort] ?? effortColors.Low;
                return (
                  <div key={rec.id} className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="mt-1 text-xs text-secondary-foreground">{rec.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${impactCol.bg} ${impactCol.text}`}>
                        Impact: {rec.impact}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${effortCol.bg} ${effortCol.text}`}>
                        Effort: {rec.effort}
                      </span>
                      <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#475569]">
                        {rec.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* CDN Metrics */}
          <SectionCard title="CDN Metrics by Region">
            <div className="divide-y divide-border">
              {mockCDNMetrics.map((cdn) => (
                <div key={cdn.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cdn.region}</span>
                    <span className="text-sm text-secondary-foreground">{cdn.cacheHitRatio}% cache</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{ width: `${cdn.cacheHitRatio}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-secondary-foreground">
                    <span>{cdn.requests.toLocaleString()} req</span>
                    <span>{cdn.bandwidth}</span>
                    <span>{cdn.latency}ms latency</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
