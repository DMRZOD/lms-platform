"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { AuditTrail } from "@/components/academic/audit-trail";
import { CountdownBadge } from "@/components/academic/countdown-badge";
import { FilterBar } from "@/components/academic/filter-bar";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockExceptions } from "@/constants/academic-mock-data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
  { label: "Revoked", value: "Revoked" },
];

const TYPE_FILTERS = [
  { label: "All Types", value: "all" },
  { label: "Debt", value: "Debt" },
  { label: "Attendance", value: "Attendance" },
  { label: "Prerequisite", value: "Prerequisite" },
  { label: "Probation", value: "Probation" },
];

const REASON_CODES = [
  "MEDICAL_LEAVE",
  "PAYMENT_PLAN",
  "OFFICIAL_DELEGATION",
  "TRANSFER_CREDIT",
  "SCHOLARSHIP_PROCESSING",
  "FAMILY_EMERGENCY",
  "TECHNICAL_ERROR",
  "OTHER",
];

export default function ExceptionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({
    studentName: "",
    type: "Debt",
    reasonCode: "",
    description: "",
    scope: "FullAccess",
    expiresAt: "",
  });

  const filtered = mockExceptions.filter((e) => {
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    const matchesSearch =
      e.studentName.toLowerCase().includes(search.toLowerCase()) ||
      e.reasonCode.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const now = new Date().getTime();
  const active = mockExceptions.filter((e) => e.status === "Active").length;
  const expired = mockExceptions.filter((e) => e.status === "Expired").length;
  const expiringSoon = mockExceptions.filter((e) => {
    if (e.status !== "Active") return false;
    const daysLeft = (new Date(e.expiresAt).getTime() - now) / 86400000;
    return daysLeft <= 3;
  }).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Exceptions" description="Manage academic exceptions and overrides — all actions are audited" />
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Grant Exception
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active" value={active} accent="success" />
        <StatCard label="Expired" value={expired} />
        <StatCard label="Expiring Soon" value={expiringSoon} accent={expiringSoon > 0 ? "danger" : "default"} subtitle="Within 3 days" />
        <StatCard label="Total" value={mockExceptions.length} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground hover:bg-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search student or reason..."
      />

      <div className="space-y-2">
        {filtered.map((exc) => (
          <div key={exc.id} className="rounded-lg border border-border bg-background">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex-1 min-w-0 grid grid-cols-1 gap-2 sm:grid-cols-5">
                <div>
                  <p className="font-medium">{exc.studentName}</p>
                  <p className="text-xs text-secondary-foreground">{exc.reasonCode.replace(/_/g, " ")}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={exc.type} />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground">Scope</p>
                  <p className="text-sm font-medium">{exc.scope.replace(/([A-Z])/g, " $1").trim()}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground">Granted by</p>
                  <p className="text-sm">{exc.grantedBy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={exc.status} />
                  {exc.status === "Active" && <CountdownBadge expiresAt={exc.expiresAt} />}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {exc.status === "Active" && (
                  <button className="rounded-md border border-[#fca5a5] px-2.5 py-1 text-xs font-medium text-[#dc2626] hover:bg-[#fee2e2]">
                    Revoke
                  </button>
                )}
                <button
                  onClick={() => setExpanded(expanded === exc.id ? null : exc.id)}
                  className="rounded-md p-1.5 text-secondary-foreground hover:bg-secondary"
                >
                  {expanded === exc.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {expanded === exc.id && (
              <div className="border-t border-border p-4">
                <p className="mb-1 text-xs font-medium text-secondary-foreground uppercase tracking-wide">Description</p>
                <p className="mb-4 text-sm">{exc.description}</p>
                <p className="mb-3 text-xs font-medium text-secondary-foreground uppercase tracking-wide">Audit Trail</p>
                <AuditTrail entries={exc.auditTrail} />
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-secondary-foreground">No exceptions found.</p>
        )}
      </div>

      {/* Create Exception Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-4 font-semibold">Grant Exception</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Student <span className="text-[#dc2626]">*</span></label>
                <input
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="Student name or ID..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Exception Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="Debt">Debt</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Prerequisite">Prerequisite</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Reason Code <span className="text-[#dc2626]">*</span></label>
                  <select
                    value={form.reasonCode}
                    onChange={(e) => setForm({ ...form, reasonCode: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select reason…</option>
                    {REASON_CODES.map((r) => (
                      <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Additional details..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Scope</label>
                  <select
                    value={form.scope}
                    onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="FullAccess">Full Access</option>
                    <option value="ExamOnly">Exam Only</option>
                    <option value="LecturesOnly">Lectures Only</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Expiry Date <span className="text-[#dc2626]">*</span></label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setCreateModal(false)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!form.studentName.trim() || !form.reasonCode || !form.expiresAt}
                onClick={() => setCreateModal(false)}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Grant Exception
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
