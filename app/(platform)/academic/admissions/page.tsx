"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, FileText, X } from "lucide-react";
import { BulkActionBar } from "@/components/academic/bulk-action-bar";
import { FilterBar } from "@/components/academic/filter-bar";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockAdmissionApplicants } from "@/constants/academic-mock-data";
import type { AdmissionApplicant } from "@/types/academic";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Docs Pending", value: "DocsPending" },
  { label: "In Review", value: "DocsInReview" },
  { label: "Verified", value: "Verified" },
  { label: "Rejected", value: "RejectedDocs" },
  { label: "Waitlisted", value: "Waitlisted" },
];

export default function AdmissionsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [decisionModal, setDecisionModal] = useState<{ app: AdmissionApplicant; type: "verify" | "reject" } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = mockAdmissionApplicants.filter((a) => {
    const matchesFilter = activeFilter === "all" || a.docStatus === activeFilter;
    const matchesSearch =
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.programName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const pending = mockAdmissionApplicants.filter((a) => a.docStatus === "DocsPending" || a.docStatus === "DocsInReview").length;

  return (
    <div>
      <PageHeader title="Admissions" description="Review and process applicant documents — Spring 2026 intake" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total" value={mockAdmissionApplicants.length} />
        <StatCard label="Pending Review" value={pending} accent={pending > 0 ? "warning" : "default"} />
        <StatCard label="Verified" value={mockAdmissionApplicants.filter((a) => a.docStatus === "Verified").length} accent="success" />
        <StatCard label="Rejected" value={mockAdmissionApplicants.filter((a) => a.docStatus === "RejectedDocs").length} accent="danger" />
        <StatCard label="Waitlisted" value={mockAdmissionApplicants.filter((a) => a.docStatus === "Waitlisted").length} />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search applicants..."
      />

      <BulkActionBar
        selectedCount={selected.length}
        onClearSelection={() => setSelected([])}
        actions={[
          { label: "Verify Selected", onClick: () => setSelected([]) },
          { label: "Reject Selected", onClick: () => setSelected([]), variant: "danger" },
        ]}
      />

      <div className="space-y-2">
        {filtered.map((app) => (
          <div key={app.id} className="rounded-lg border border-border bg-background">
            <div className="flex items-center gap-3 p-4">
              <input
                type="checkbox"
                checked={selected.includes(app.id)}
                onChange={() => toggleSelect(app.id)}
                className="h-4 w-4 rounded border-border"
              />
              <div className="flex-1 grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
                <div>
                  <p className="font-medium">{app.applicantName}</p>
                  <p className="text-xs text-secondary-foreground">{app.email}</p>
                </div>
                <div>
                  <p className="text-sm">{app.programName}</p>
                  <p className="text-xs text-secondary-foreground">
                    Applied {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.docStatus} />
                  {app.score && (
                    <span className="text-sm font-medium">Score: {app.score}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(app.docStatus === "DocsPending" || app.docStatus === "DocsInReview") && (
                    <>
                      <button
                        onClick={() => setDecisionModal({ app, type: "verify" })}
                        className="flex items-center gap-1 rounded-md bg-[#dcfce7] px-3 py-1.5 text-xs font-medium text-[#16a34a] hover:bg-[#bbf7d0]"
                      >
                        <Check className="h-3 w-3" />
                        Verify
                      </button>
                      <button
                        onClick={() => setDecisionModal({ app, type: "reject" })}
                        className="flex items-center gap-1 rounded-md bg-[#fee2e2] px-3 py-1.5 text-xs font-medium text-[#dc2626] hover:bg-[#fecaca]"
                      >
                        <X className="h-3 w-3" />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="ml-auto rounded-md p-1.5 text-secondary-foreground hover:bg-secondary"
                  >
                    {expanded === app.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded — Documents */}
            {expanded === app.id && (
              <div className="border-t border-border p-4">
                <p className="mb-3 text-sm font-medium">Documents</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {app.documents.map((doc) => (
                    <div key={doc.id} className={`flex items-center gap-2 rounded-lg border p-3 ${
                      doc.status === "Verified" ? "border-[#86efac] bg-[#f0fdf4]" :
                      doc.status === "Rejected" ? "border-[#fca5a5] bg-[#fef2f2]" :
                      doc.status === "Missing" ? "border-[#fde68a] bg-[#fffbeb]" :
                      "border-border"
                    }`}>
                      <FileText className="h-4 w-4 shrink-0 text-secondary-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{doc.type}</p>
                        <p className="truncate text-xs text-secondary-foreground">{doc.name}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        doc.status === "Verified" ? "bg-[#dcfce7] text-[#16a34a]" :
                        doc.status === "Rejected" ? "bg-[#fee2e2] text-[#dc2626]" :
                        doc.status === "Missing" ? "bg-[#fef3c7] text-[#d97706]" :
                        "bg-[#f4f4f4] text-[#6b7280]"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
                {app.rejectionReason && (
                  <div className="mt-3 rounded-md border border-[#fca5a5] bg-[#fee2e2] p-3 text-sm text-[#7f1d1d]">
                    <strong>Rejection reason:</strong> {app.rejectionReason}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-secondary-foreground">No applicants found.</p>
        )}
      </div>

      {/* Decision Modal */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-1 font-semibold">
              {decisionModal.type === "verify" ? "Verify Applicant" : "Reject Application"}
            </h2>
            <p className="mb-4 text-sm text-secondary-foreground">
              {decisionModal.type === "verify"
                ? `Confirming that all documents for ${decisionModal.app.applicantName} are valid and complete.`
                : `Rejecting the application of ${decisionModal.app.applicantName}. A reason is required.`}
            </p>
            {decisionModal.type === "reject" && (
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium">
                  Rejection Reason <span className="text-[#dc2626]">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Describe what documents are missing or invalid..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setDecisionModal(null); setRejectReason(""); }}
                className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                disabled={decisionModal.type === "reject" && !rejectReason.trim()}
                onClick={() => { setDecisionModal(null); setRejectReason(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium text-white disabled:opacity-40 ${
                  decisionModal.type === "verify" ? "bg-[#16a34a] hover:bg-[#15803d]" : "bg-[#dc2626] hover:bg-[#b91c1c]"
                }`}
              >
                {decisionModal.type === "verify" ? "Confirm Verified" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
