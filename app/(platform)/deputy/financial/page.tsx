"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockFinancialSummary,
  monthlyRevenueTrend,
} from "@/constants/deputy-mock-data";

const departments = [
  "All",
  "Engineering",
  "Economics",
  "Health Sciences",
  "Humanities",
  "Design",
  "Natural Sciences",
];

const periods = ["Q1 2026", "Semester 2026", "FY 2025"];

export default function FinancialPage() {
  const [deptFilter, setDeptFilter] = useState("All");
  const [period, setPeriod] = useState("Q1 2026");

  const totalBudget = mockFinancialSummary.reduce(
    (s, d) => s + d.budgetAllocated,
    0,
  );
  const totalSpent = mockFinancialSummary.reduce(
    (s, d) => s + d.budgetSpent,
    0,
  );
  const totalRevenue = mockFinancialSummary.reduce(
    (s, d) => s + d.revenueCollected,
    0,
  );
  const totalDebt = mockFinancialSummary.reduce(
    (s, d) => s + d.outstandingDebt,
    0,
  );
  const overallCollectionRate =
    mockFinancialSummary.reduce((s, d) => s + d.collectionRate, 0) /
    mockFinancialSummary.length;
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  const filteredSummary =
    deptFilter === "All"
      ? mockFinancialSummary
      : mockFinancialSummary.filter((d) => d.department === deptFilter);

  const barChartData = mockFinancialSummary.map((d) => ({
    name: d.department.split(" ")[0],
    budget: d.budgetAllocated / 1_000_000,
    revenue: d.revenueCollected / 1_000_000,
  }));

  const revenueChartData = monthlyRevenueTrend.map((m) => ({
    month: m.month,
    revenue: m.value / 1_000_000,
  }));

  return (
    <div>
      <PageHeader
        title="Financial Analytics"
        description="Budget utilization, revenue collection, and debt monitoring across departments"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Budget"
          value={`$${(totalBudget / 1_000_000).toFixed(1)}M`}
          icon={Wallet}
          subtitle="Allocated"
        />
        <StatCard
          label="Total Spent"
          value={`$${(totalSpent / 1_000_000).toFixed(1)}M`}
          icon={TrendingDown}
          accent="warning"
          subtitle={`${budgetUtilization.toFixed(1)}% utilized`}
        />
        <StatCard
          label="Total Revenue"
          value={`$${(totalRevenue / 1_000_000).toFixed(1)}M`}
          icon={TrendingUp}
          accent="success"
          subtitle="Collected YTD"
        />
        <StatCard
          label="Outstanding Debt"
          value={`$${(totalDebt / 1_000).toFixed(0)}K`}
          icon={DollarSign}
          accent="danger"
          subtitle="Across all depts"
        />
        <StatCard
          label="Collection Rate"
          value={`${overallCollectionRate.toFixed(1)}%`}
          icon={TrendingUp}
          accent={overallCollectionRate >= 92 ? "success" : "warning"}
          subtitle="Revenue collection"
        />
        <StatCard
          label="Budget Utilization"
          value={`${budgetUtilization.toFixed(1)}%`}
          icon={Wallet}
          accent={
            budgetUtilization > 95
              ? "danger"
              : budgetUtilization > 85
                ? "warning"
                : "success"
          }
          subtitle="Spent vs allocated"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {periods.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Revenue vs Budget by Department ($M)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [`$${Number(v).toFixed(2)}M`, ""]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="budget" fill="#e3e3e3" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-4 text-xs text-secondary-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#e3e3e3]" /> Budget
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#22c55e]" /> Revenue Collected
              </span>
            </div>
          </SectionCard>

          <SectionCard title="Monthly Revenue Trend ($M)">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={revenueChartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [`$${Number(v).toFixed(2)}M`, "Revenue"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Department Financial Summary">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">Allocated</th>
                    <th className="pb-2 font-medium">Spent</th>
                    <th className="pb-2 font-medium">Revenue</th>
                    <th className="pb-2 font-medium">Debt</th>
                    <th className="pb-2 font-medium">Collection</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSummary.map((d) => (
                    <tr
                      key={d.department}
                      className="border-b border-border hover:bg-secondary/50 last:border-0"
                    >
                      <td className="py-2.5 font-medium">{d.department}</td>
                      <td className="py-2.5">
                        ${(d.budgetAllocated / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="py-2.5">
                        ${(d.budgetSpent / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="py-2.5 text-[#166534]">
                        ${(d.revenueCollected / 1_000_000).toFixed(1)}M
                      </td>
                      <td
                        className={`py-2.5 ${d.outstandingDebt > 250_000 ? "text-[#991b1b]" : "text-[#92400e]"}`}
                      >
                        ${(d.outstandingDebt / 1_000).toFixed(0)}K
                      </td>
                      <td
                        className={`py-2.5 font-medium ${d.collectionRate >= 92 ? "text-[#166534]" : d.collectionRate >= 88 ? "" : "text-[#991b1b]"}`}
                      >
                        {d.collectionRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Budget Utilization">
            <div className="space-y-4">
              {mockFinancialSummary.map((d) => {
                const util = (d.budgetSpent / d.budgetAllocated) * 100;
                return (
                  <div key={d.department}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">
                        {d.department.split(" ")[0]}
                      </span>
                      <span
                        className={
                          util > 95
                            ? "text-[#991b1b]"
                            : util > 85
                              ? "text-[#92400e]"
                              : "text-[#166534]"
                        }
                      >
                        {util.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${util > 95 ? "bg-[#ef4444]" : util > 85 ? "bg-[#f59e0b]" : "bg-[#22c55e]"}`}
                        style={{ width: `${Math.min(util, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Outstanding Debt Distribution">
            {mockFinancialSummary.map((d) => {
              const pct = (d.outstandingDebt / totalDebt) * 100;
              return (
                <div key={d.department} className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{d.department.split(" ")[0]}</span>
                    <span className="font-medium">
                      ${(d.outstandingDebt / 1_000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-[#ef4444]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {pct.toFixed(1)}% of total debt
                  </p>
                </div>
              );
            })}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
