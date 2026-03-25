"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Ban,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileBarChart,
  FileText,
  LayoutDashboard,
  RefreshCw,
  ScrollText,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockFinanceStats,
  mockPayments,
  mockDebts,
} from "@/constants/accountant-mock-data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const paymentStatusColors: Record<string, string> = {
  Completed: "bg-[#dcfce7] text-[#166534]",
  Pending: "bg-[#fef9c3] text-[#854d0e]",
  Failed: "bg-[#fee2e2] text-[#991b1b]",
  Refunded: "bg-[#e0e7ff] text-[#3730a3]",
};

const quickActions = [
  { label: "Contracts", href: "/accountant/contracts", icon: FileText },
  { label: "Payments", href: "/accountant/payments", icon: CreditCard },
  { label: "Reconciliation", href: "/accountant/reconciliation", icon: ArrowLeftRight },
  { label: "Debts", href: "/accountant/debts", icon: DollarSign },
  { label: "Blocking", href: "/accountant/blocking", icon: Ban },
  { label: "Reports", href: "/accountant/reports", icon: FileBarChart },
  { label: "Analytics", href: "/accountant/analytics", icon: BarChart3 },
  { label: "Settings", href: "/accountant/settings", icon: Settings },
];

export default function AccountantDashboardPage() {
  const recentPayments = mockPayments.slice(0, 5);
  const criticalDebts = mockDebts
    .filter((d) => d.severity === "Critical" || d.severity === "High")
    .slice(0, 5);

  const syncStatusColor =
    mockFinanceStats.syncStatus === "Synced"
      ? "text-[#166534]"
      : mockFinanceStats.syncStatus === "Error"
        ? "text-[#991b1b]"
        : "text-[#854d0e]";

  const syncBgColor =
    mockFinanceStats.syncStatus === "Synced"
      ? "bg-[#dcfce7]"
      : mockFinanceStats.syncStatus === "Error"
        ? "bg-[#fee2e2]"
        : "bg-[#fef9c3]";

  return (
    <div>
      <PageHeader
        title="Finance Dashboard"
        description="Monitor payments, debts, and financial operations"
      />

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(mockFinanceStats.totalRevenue)}
          icon={TrendingUp}
          subtitle={`+${mockFinanceStats.revenueChangePercent}% this month`}
          accent="success"
        />
        <StatCard
          label="Outstanding Debts"
          value={formatCurrency(mockFinanceStats.outstandingDebts)}
          icon={DollarSign}
          accent="danger"
        />
        <StatCard
          label="Pending Payments"
          value={mockFinanceStats.pendingPayments}
          icon={CreditCard}
          accent="warning"
        />
        <StatCard
          label="Active Contracts"
          value={mockFinanceStats.activeContracts}
          icon={FileText}
        />
        <StatCard
          label="Blocked Students"
          value={mockFinanceStats.blockedStudents}
          icon={Users}
          accent={mockFinanceStats.blockedStudents > 10 ? "danger" : "warning"}
        />
        <StatCard
          label="Monthly Collections"
          value={formatCurrency(mockFinanceStats.monthlyCollections)}
          icon={LayoutDashboard}
          accent="success"
        />
      </div>

      {/* Overdue Alert */}
      {criticalDebts.length > 0 && (
        <div className="mb-6 rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#dc2626]" />
            <div>
              <p className="font-semibold text-[#991b1b]">
                {criticalDebts.length} critical/high-severity debts require attention
              </p>
              <p className="mt-0.5 text-sm text-[#b91c1c]">
                Total overdue amount:{" "}
                <span className="font-semibold">
                  {formatCurrency(mockFinanceStats.outstandingDebts)}
                </span>
                . Review the debts section to send reminders or initiate blocks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — 2 columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Payments */}
          <SectionCard
            title="Recent Payments"
            action={
              <Link
                href="/accountant/payments"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="space-y-2">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-secondary"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {payment.studentName}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      {payment.paymentNumber} · {payment.type} · {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatusColors[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Overdue Debts */}
          <SectionCard
            title="Critical Debts"
            action={
              <Link
                href="/accountant/debts"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            {criticalDebts.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No critical debts</p>
            ) : (
              <div className="space-y-2">
                {criticalDebts.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-secondary"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {debt.studentName}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {debt.program} · {debt.daysOverdue > 0 ? `${debt.daysOverdue} days overdue` : `Due ${formatDate(debt.dueDate)}`}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {formatCurrency(debt.amount)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          debt.severity === "Critical"
                            ? "bg-[#fee2e2] text-[#991b1b]"
                            : "bg-[#ffedd5] text-[#9a3412]"
                        }`}
                      >
                        {debt.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right — 1 column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-1.5 rounded-md border border-border p-3 text-center hover:bg-secondary"
                >
                  <action.icon className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* 1C Sync Status */}
          <SectionCard title="1C Sync Status">
            <div className="space-y-3">
              <div className={`flex items-center gap-2 rounded-md p-3 ${syncBgColor}`}>
                {mockFinanceStats.syncStatus === "Synced" ? (
                  <CheckCircle2 className={`h-5 w-5 ${syncStatusColor}`} />
                ) : (
                  <AlertTriangle className={`h-5 w-5 ${syncStatusColor}`} />
                )}
                <span className={`text-sm font-semibold ${syncStatusColor}`}>
                  {mockFinanceStats.syncStatus}
                </span>
              </div>
              <p className="text-xs text-secondary-foreground">
                Last sync:{" "}
                {new Date(mockFinanceStats.lastSyncAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <Link
                href="/accountant/reconciliation"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                <RefreshCw className="h-4 w-4" />
                View Reconciliation
              </Link>
            </div>
          </SectionCard>

          {/* Upcoming Deadlines */}
          <SectionCard title="Upcoming Deadlines">
            <div className="space-y-2">
              {mockPayments
                .filter((p) => p.status === "Pending")
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{p.studentName}</p>
                      <p className="text-xs text-secondary-foreground">
                        Due {formatDate(p.date)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              {mockPayments.filter((p) => p.status === "Pending").length === 0 && (
                <p className="text-sm text-secondary-foreground">
                  No upcoming deadlines
                </p>
              )}
            </div>
          </SectionCard>

          {/* Finance Overview */}
          <SectionCard title="Finance Overview">
            <div className="space-y-3">
              {[
                { label: "Audit Trail", href: "/accountant/audit", icon: ScrollText },
                {
                  label: "Financial Reports",
                  href: "/accountant/reports",
                  icon: FileBarChart,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-secondary"
                >
                  <item.icon className="h-4 w-4 text-secondary-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
