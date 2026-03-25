"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";

import { EmptyState } from "@/components/accountant/empty-state";
import { FilterBar } from "@/components/accountant/filter-bar";
import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockDebts, mockDebtStats } from "@/constants/accountant-mock-data";
import type { DebtSeverity, DebtStatus } from "@/types/accountant";

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

const statusColors: Record<DebtStatus, string> = {
  Outstanding: "bg-[#fef9c3] text-[#854d0e]",
  Overdue: "bg-[#fee2e2] text-[#991b1b]",
  PartiallyPaid: "bg-[#e0e7ff] text-[#3730a3]",
  WrittenOff: "bg-[#f3f4f6] text-[#374151]",
};

const severityColors: Record<DebtSeverity, string> = {
  Critical: "bg-[#fee2e2] text-[#991b1b]",
  High: "bg-[#ffedd5] text-[#9a3412]",
  Medium: "bg-[#fef9c3] text-[#854d0e]",
  Low: "bg-[#f3f4f6] text-[#374151]",
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Outstanding", value: "Outstanding" },
  { label: "Overdue", value: "Overdue" },
  { label: "Partially Paid", value: "PartiallyPaid" },
  { label: "Written Off", value: "WrittenOff" },
];

const severityFilters = [
  { label: "All Severity", value: "all" },
  { label: "Critical", value: "Critical" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export default function DebtsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filtered = mockDebts.filter((d) => {
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || d.severity === severityFilter;
    const matchesSearch =
      search === "" ||
      d.studentName.toLowerCase().includes(search.toLowerCase()) ||
      d.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.program.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Debt Management"
        description="Track and manage student financial debts"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Outstanding"
          value={formatCurrency(mockDebtStats.totalOutstanding)}
          icon={DollarSign}
          accent="danger"
        />
        <StatCard
          label="Overdue Amount"
          value={formatCurrency(mockDebtStats.overdueAmount)}
          icon={DollarSign}
          accent="danger"
        />
        <StatCard
          label="Students with Debt"
          value={mockDebtStats.studentsWithDebt}
          icon={DollarSign}
          accent="warning"
        />
        <StatCard
          label="Avg Days Overdue"
          value={`${mockDebtStats.avgDaysOverdue} days`}
          icon={DollarSign}
          accent="warning"
        />
      </div>

      <SectionCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">All Debts</h2>
          <div className="flex flex-wrap gap-1.5">
            {severityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSeverityFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  severityFilter === f.value
                    ? "bg-foreground text-background"
                    : "border border-border bg-background hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <FilterBar
          filters={statusFilters}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search by student, contract, program..."
          className="mb-4"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No debts found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[1.2fr_1fr_1fr_100px_110px_100px_90px_90px_120px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
              <span>Student</span>
              <span>Contract</span>
              <span>Program</span>
              <span>Amount</span>
              <span>Due Date</span>
              <span>Days Overdue</span>
              <span>Severity</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="min-w-[900px] divide-y divide-border">
              {filtered.map((debt) => (
                <div
                  key={debt.id}
                  className="grid grid-cols-[1.2fr_1fr_1fr_100px_110px_100px_90px_90px_120px] items-center gap-x-4 px-3 py-3 hover:bg-secondary"
                >
                  <div>
                    <p className="text-sm font-medium">{debt.studentName}</p>
                    <p className="text-xs text-secondary-foreground">
                      {debt.studentEmail}
                    </p>
                  </div>
                  <span className="text-sm text-secondary-foreground">
                    {debt.contractNumber}
                  </span>
                  <span className="truncate text-sm">{debt.program}</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(debt.amount)}
                  </span>
                  <span className="text-sm">{formatDate(debt.dueDate)}</span>
                  <span
                    className={`text-sm font-medium ${
                      debt.daysOverdue > 0
                        ? "text-[#dc2626]"
                        : "text-secondary-foreground"
                    }`}
                  >
                    {debt.daysOverdue > 0 ? `${debt.daysOverdue}d` : "—"}
                  </span>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColors[debt.severity]}`}
                    >
                      {debt.severity}
                    </span>
                  </span>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[debt.status]}`}
                    >
                      {debt.status}
                    </span>
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActionMenuId(
                          actionMenuId === debt.id ? null : debt.id,
                        )
                      }
                      className="text-sm text-secondary-foreground hover:text-foreground"
                    >
                      Actions ▾
                    </button>
                    {actionMenuId === debt.id && (
                      <div className="absolute right-0 top-6 z-10 w-44 rounded-md border border-border bg-background shadow-md">
                        {[
                          "Send Reminder",
                          "Create Payment Plan",
                          "Block Student",
                          "Write Off",
                        ].map((action) => (
                          <button
                            key={action}
                            onClick={() => setActionMenuId(null)}
                            className={`block w-full px-3 py-2 text-left text-sm hover:bg-secondary ${
                              action === "Block Student" ||
                              action === "Write Off"
                                ? "text-[#dc2626]"
                                : ""
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
