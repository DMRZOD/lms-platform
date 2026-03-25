"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { EmptyState } from "@/components/accountant/empty-state";
import { FilterBar } from "@/components/accountant/filter-bar";
import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockFinanceStats,
  mockReconciliationRecords,
  mockReconciliationStats,
} from "@/constants/accountant-mock-data";
import type { ReconciliationStatus } from "@/types/accountant";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<ReconciliationStatus, string> = {
  Matched: "bg-[#dcfce7] text-[#166534]",
  Mismatch: "bg-[#fee2e2] text-[#991b1b]",
  Pending: "bg-[#fef9c3] text-[#854d0e]",
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Matched", value: "Matched" },
  { label: "Mismatch", value: "Mismatch" },
  { label: "Pending", value: "Pending" },
];

export default function ReconciliationPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState("");

  const filtered = mockReconciliationRecords.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      search === "" ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.recordNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.contractNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  }

  const resolveRecord = mockReconciliationRecords.find(
    (r) => r.id === resolveId,
  );

  return (
    <div>
      <PageHeader
        title="1C Reconciliation"
        description="Compare and reconcile LMS financial data with 1C accounting system"
      />

      {/* Sync Status */}
      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {mockFinanceStats.syncStatus === "Synced" ? (
            <CheckCircle2 className="h-5 w-5 text-[#16a34a]" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />
          )}
          <div>
            <p className="font-semibold">
              {mockFinanceStats.syncStatus === "Synced"
                ? "Synchronized"
                : mockFinanceStats.syncStatus}
            </p>
            <p className="text-xs text-secondary-foreground">
              Last sync:{" "}
              {new Date(mockFinanceStats.lastSyncAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Run Sync"}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Records"
          value={mockReconciliationStats.totalRecords}
          icon={ArrowLeftRight}
        />
        <StatCard
          label="Matched"
          value={mockReconciliationStats.matched}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="Mismatches"
          value={mockReconciliationStats.mismatches}
          icon={AlertTriangle}
          accent="danger"
        />
        <StatCard
          label="Pending Review"
          value={mockReconciliationStats.pendingReview}
          icon={ArrowLeftRight}
          accent="warning"
        />
      </div>

      <SectionCard>
        <h2 className="mb-4 font-semibold">Reconciliation Records</h2>

        <FilterBar
          filters={statusFilters}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search by student, record #, contract..."
          className="mb-4"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No records found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[800px] grid-cols-[1fr_1.2fr_1fr_110px_110px_100px_90px_120px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
              <span>Record #</span>
              <span>Student</span>
              <span>Contract</span>
              <span>LMS Amount</span>
              <span>1C Amount</span>
              <span>Difference</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="min-w-[800px] divide-y divide-border">
              {filtered.map((record) => (
                <div
                  key={record.id}
                  className="grid grid-cols-[1fr_1.2fr_1fr_110px_110px_100px_90px_120px] items-center gap-x-4 px-3 py-3 hover:bg-secondary"
                >
                  <span className="text-sm font-medium">
                    {record.recordNumber}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{record.studentName}</p>
                  </div>
                  <span className="text-sm text-secondary-foreground">
                    {record.contractNumber}
                  </span>
                  <span className="text-sm">
                    {formatCurrency(record.lmsAmount)}
                  </span>
                  <span className="text-sm">
                    {formatCurrency(record.oneCAmount)}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      record.difference !== 0
                        ? "text-[#dc2626]"
                        : "text-[#16a34a]"
                    }`}
                  >
                    {record.difference !== 0
                      ? `${record.difference > 0 ? "+" : ""}${formatCurrency(record.difference)}`
                      : "—"}
                  </span>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    {record.status === "Mismatch" && (
                      <button
                        onClick={() => setResolveId(record.id)}
                        className="text-xs text-secondary-foreground hover:text-foreground"
                      >
                        Resolve
                      </button>
                    )}
                    <button className="text-xs text-secondary-foreground hover:text-foreground">
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Resolve Dialog */}
      {resolveId && resolveRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <h3 className="font-semibold">Resolve Mismatch</h3>
            <p className="mt-1 text-sm text-secondary-foreground">
              {resolveRecord.recordNumber} — {resolveRecord.studentName}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-md bg-secondary p-3 text-sm">
              <span className="text-secondary-foreground">LMS Amount</span>
              <span className="font-medium">
                {formatCurrency(resolveRecord.lmsAmount)}
              </span>
              <span className="text-secondary-foreground">1C Amount</span>
              <span className="font-medium">
                {formatCurrency(resolveRecord.oneCAmount)}
              </span>
              <span className="text-secondary-foreground">Difference</span>
              <span className="font-medium text-[#dc2626]">
                {formatCurrency(resolveRecord.difference)}
              </span>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">
                Resolution notes
              </label>
              <textarea
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                rows={3}
                placeholder="Explain the resolution..."
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setResolveId(null);
                  setResolveNote("");
                }}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResolveId(null);
                  setResolveNote("");
                }}
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
