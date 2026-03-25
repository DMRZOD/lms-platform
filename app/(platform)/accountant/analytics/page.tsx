"use client";

import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";

const periods = ["Last 3 months", "Last 6 months", "Last 12 months", "This Academic Year"];
const programs = ["All Programs", "Computer Science", "Business Administration", "Medicine", "Law", "Architecture", "Data Science"];
const departments = ["All Departments", "Engineering", "Economics", "Health Sciences", "Humanities", "Design"];

const monthlyRevenue = [
  { month: "Oct", amount: 520_000 },
  { month: "Nov", amount: 480_000 },
  { month: "Dec", amount: 390_000 },
  { month: "Jan", amount: 710_000 },
  { month: "Feb", amount: 640_000 },
  { month: "Mar", amount: 680_000 },
];

const paymentDistribution = [
  { label: "Installment", percent: 54, color: "bg-[#3b82f6]" },
  { label: "Full (Tuition)", percent: 32, color: "bg-[#22c55e]" },
  { label: "Fine", percent: 8, color: "bg-[#f59e0b]" },
  { label: "Other", percent: 6, color: "bg-[#8b5cf6]" },
];

const debtAging = [
  { label: "0–14 days", count: 12, color: "bg-[#fef9c3]", textColor: "text-[#854d0e]" },
  { label: "15–30 days", count: 8, color: "bg-[#ffedd5]", textColor: "text-[#9a3412]" },
  { label: "31–60 days", count: 14, color: "bg-[#fee2e2]", textColor: "text-[#991b1b]" },
  { label: "60+ days", count: 9, color: "bg-[#fecaca]", textColor: "text-[#7f1d1d]" },
];

const programRevenue = [
  { label: "Health Sciences", amount: 1_580_000, percent: 33 },
  { label: "Engineering", amount: 1_240_000, percent: 26 },
  { label: "Economics", amount: 980_000, percent: 20 },
  { label: "Design", amount: 630_000, percent: 13 },
  { label: "Humanities", amount: 420_000, percent: 9 },
];

const maxRevenue = Math.max(...monthlyRevenue.map((r) => r.amount));

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(periods[2]);
  const [program, setProgram] = useState(programs[0]);
  const [department, setDepartment] = useState(departments[0]);

  return (
    <div>
      <PageHeader
        title="Financial Analytics"
        description="Trends, distributions, and performance insights"
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Revenue Growth"
          value="+8.4%"
          icon={TrendingUp}
          accent="success"
          subtitle="vs last month"
        />
        <StatCard
          label="Collection Rate"
          value="93.7%"
          icon={BarChart3}
          accent="success"
          subtitle="payments on time"
        />
        <StatCard
          label="Avg Payment Time"
          value="4.2 days"
          icon={BarChart3}
          subtitle="from due date"
        />
        <StatCard
          label="Debt Ratio"
          value="6.6%"
          icon={BarChart3}
          accent="warning"
          subtitle="of total revenue"
        />
        <StatCard
          label="Active Contracts"
          value="+12"
          icon={TrendingUp}
          accent="success"
          subtitle="this month"
        />
        <StatCard
          label="Recon. Accuracy"
          value="96.0%"
          icon={BarChart3}
          accent="success"
          subtitle="1C match rate"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: "Period", value: period, options: periods, onChange: setPeriod },
          { label: "Program", value: program, options: programs, onChange: setProgram },
          { label: "Department", value: department, options: departments, onChange: setDepartment },
        ].map((filter) => (
          <div key={filter.label} className="flex items-center gap-2">
            <span className="text-sm text-secondary-foreground">{filter.label}:</span>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:border-foreground"
            >
              {filter.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trends */}
        <SectionCard title="Revenue Trends">
          <p className="mb-4 text-xs text-secondary-foreground">
            Monthly revenue for {period.toLowerCase()}
          </p>
          <div className="flex items-end gap-3">
            {monthlyRevenue.map((item) => {
              const heightPercent = (item.amount / maxRevenue) * 100;
              return (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-secondary-foreground">
                    ${(item.amount / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full rounded-t-sm bg-foreground/80 transition-all"
                    style={{ height: `${Math.max(heightPercent * 1.2, 8)}px` }}
                  />
                  <span className="text-xs text-secondary-foreground">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Payment Distribution */}
        <SectionCard title="Payment Distribution by Type">
          <p className="mb-4 text-xs text-secondary-foreground">
            Breakdown of payment types
          </p>
          <div className="space-y-3">
            {paymentDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.percent}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Debt Aging */}
        <SectionCard title="Debt Aging Analysis">
          <p className="mb-4 text-xs text-secondary-foreground">
            Number of debts by overdue bracket
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {debtAging.map((item) => (
              <div
                key={item.label}
                className={`rounded-lg p-4 text-center ${item.color}`}
              >
                <p className={`text-2xl font-bold ${item.textColor}`}>
                  {item.count}
                </p>
                <p className={`mt-1 text-xs ${item.textColor}`}>{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-secondary-foreground">
            Total active debts:{" "}
            {debtAging.reduce((sum, i) => sum + i.count, 0)}
          </p>
        </SectionCard>

        {/* Program Revenue Comparison */}
        <SectionCard title="Program Revenue Comparison">
          <p className="mb-4 text-xs text-secondary-foreground">
            Revenue contribution by faculty
          </p>
          <div className="space-y-3">
            {programRevenue.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-semibold text-secondary-foreground">
                    ${(item.amount / 1_000_000).toFixed(2)}M ({item.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-foreground/70"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Collection Efficiency */}
        <SectionCard title="Collection Efficiency" className="lg:col-span-2">
          <p className="mb-4 text-xs text-secondary-foreground">
            Monthly on-time payment rate (%)
          </p>
          <div className="flex items-end gap-3">
            {[
              { month: "Oct", rate: 91 },
              { month: "Nov", rate: 89 },
              { month: "Dec", rate: 86 },
              { month: "Jan", rate: 94 },
              { month: "Feb", rate: 92 },
              { month: "Mar", rate: 94 },
            ].map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-secondary-foreground">
                  {item.rate}%
                </span>
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    item.rate >= 93
                      ? "bg-[#22c55e]/80"
                      : item.rate >= 90
                        ? "bg-[#f59e0b]/80"
                        : "bg-[#ef4444]/80"
                  }`}
                  style={{ height: `${item.rate * 0.8}px` }}
                />
                <span className="text-xs text-secondary-foreground">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-secondary-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#22c55e]/80" />
              ≥93% (good)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#f59e0b]/80" />
              90–92% (ok)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#ef4444]/80" />
              &lt;90% (poor)
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
