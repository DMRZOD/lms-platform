"use client";

import { useState } from "react";
import { CheckCircle2, ScrollText, ShieldAlert, XCircle } from "lucide-react";

import { EmptyState } from "@/components/accountant/empty-state";
import { FilterBar } from "@/components/accountant/filter-bar";
import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockAuditEntries } from "@/constants/accountant-mock-data";
import type { AlertSeverity } from "@/types/accountant";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const severityColors: Record<AlertSeverity, string> = {
  info: "bg-[#e0e7ff] text-[#3730a3]",
  warning: "bg-[#fef9c3] text-[#854d0e]",
  danger: "bg-[#fee2e2] text-[#991b1b]",
  success: "bg-[#dcfce7] text-[#166534]",
};

const actionTypeLabels: Record<string, string> = {
  ContractCreated: "Contract Created",
  ContractTerminated: "Contract Terminated",
  PaymentRecorded: "Payment Recorded",
  DebtCreated: "Debt Created",
  DebtWrittenOff: "Debt Written Off",
  StudentBlocked: "Student Blocked",
  StudentUnblocked: "Student Unblocked",
  ExceptionGranted: "Exception Granted",
  SettingsUpdated: "Settings Updated",
  ReportGenerated: "Report Generated",
  SyncTriggered: "Sync Triggered",
};

const actionFilters = [
  { label: "All", value: "all" },
  { label: "Payments", value: "PaymentRecorded" },
  { label: "Contracts", value: "ContractCreated" },
  { label: "Blocks", value: "StudentBlocked" },
  { label: "Unblocks", value: "StudentUnblocked" },
  { label: "System", value: "SyncTriggered" },
];

const complianceChecklist = [
  { label: "All contracts have valid start/end dates", status: "passed" },
  { label: "No unsigned contracts older than 7 days", status: "passed" },
  { label: "1C reconciliation run within 24 hours", status: "passed" },
  { label: "All mismatches reviewed within 3 business days", status: "warning" },
  { label: "Auto-block rules enabled and configured", status: "passed" },
  { label: "Late penalty rates approved and current", status: "passed" },
  { label: "No unresolved critical debts > 90 days", status: "failed" },
  { label: "Monthly revenue report generated", status: "passed" },
];

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockAuditEntries.filter((entry) => {
    const matchesAction =
      actionFilter === "all" || entry.action === actionFilter;
    const matchesSearch =
      search === "" ||
      entry.userName.toLowerCase().includes(search.toLowerCase()) ||
      entry.entityLabel.toLowerCase().includes(search.toLowerCase()) ||
      entry.details.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const flaggedCount = mockAuditEntries.filter(
    (e) => e.severity === "danger" || e.severity === "warning",
  ).length;
  const resolvedCount = mockAuditEntries.filter(
    (e) => e.severity === "success",
  ).length;

  return (
    <div>
      <PageHeader
        title="Audit & Compliance"
        description="Audit trail, compliance checks, and financial oversight"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Actions This Month"
          value={mockAuditEntries.length}
          icon={ScrollText}
        />
        <StatCard
          label="Flagged"
          value={flaggedCount}
          icon={ShieldAlert}
          accent="warning"
        />
        <StatCard
          label="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="Pending Review"
          value={
            complianceChecklist.filter((c) => c.status === "warning").length
          }
          icon={ScrollText}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Audit Log */}
        <div className="lg:col-span-2">
          <SectionCard title="Audit Log">
            <FilterBar
              filters={actionFilters}
              activeFilter={actionFilter}
              onFilterChange={setActionFilter}
              searchValue={search}
              onSearchChange={setSearch}
              placeholder="Search by user, entity, details..."
              className="mb-4"
            />

            {filtered.length === 0 ? (
              <EmptyState
                icon={ScrollText}
                title="No audit entries found"
                description="Try adjusting your filters or search query."
              />
            ) : (
              <div className="space-y-2">
                {filtered.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-md border border-border p-3 hover:bg-secondary"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColors[entry.severity]}`}
                        >
                          {actionTypeLabels[entry.action] ?? entry.action}
                        </span>
                        <span className="text-sm font-medium">
                          {entry.entityLabel}
                        </span>
                      </div>
                      <span className="text-xs text-secondary-foreground">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-secondary-foreground">
                      {entry.details}
                    </p>
                    <p className="mt-1 text-xs text-secondary-foreground">
                      By <span className="font-medium">{entry.userName}</span> ·{" "}
                      {entry.entityType}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Compliance Checklist */}
        <div className="space-y-6">
          <SectionCard title="Compliance Checklist">
            <div className="space-y-2.5">
              {complianceChecklist.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  {item.status === "passed" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" />
                  ) : item.status === "failed" ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
                  ) : (
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
                  )}
                  <p
                    className={`text-sm ${
                      item.status === "failed"
                        ? "text-[#dc2626]"
                        : item.status === "warning"
                          ? "text-[#854d0e]"
                          : ""
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3 text-xs text-secondary-foreground">
              <span>
                ✓ {complianceChecklist.filter((c) => c.status === "passed").length} passed
              </span>
              <span>
                ⚠ {complianceChecklist.filter((c) => c.status === "warning").length} warning
              </span>
              <span>
                ✕ {complianceChecklist.filter((c) => c.status === "failed").length} failed
              </span>
            </div>
          </SectionCard>

          {/* Recent Alerts */}
          <SectionCard title="Recent Compliance Alerts">
            <div className="space-y-2">
              {mockAuditEntries
                .filter((e) => e.severity === "danger" || e.severity === "warning")
                .slice(0, 5)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`rounded-md p-3 ${entry.severity === "danger" ? "bg-[#fef2f2]" : "bg-[#fefce8]"}`}
                  >
                    <p
                      className={`text-sm font-medium ${entry.severity === "danger" ? "text-[#991b1b]" : "text-[#854d0e]"}`}
                    >
                      {actionTypeLabels[entry.action] ?? entry.action}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${entry.severity === "danger" ? "text-[#b91c1c]" : "text-[#92400e]"}`}
                    >
                      {entry.entityLabel} · {formatDate(entry.timestamp)}
                    </p>
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
