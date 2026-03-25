"use client";

import { useState } from "react";
import { Download, Lock, ScrollText, X } from "lucide-react";
import { FilterBar } from "@/components/aqad/filter-bar";
import { SectionCard } from "@/components/aqad/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockAuditTrailEntries } from "@/constants/aqad-mock-data";
import type { AuditTrailActionType, AuditTrailEntry } from "@/types/aqad";

const ACTION_FILTERS = [
  { label: "All", value: "all" },
  { label: "Reviews", value: "Review" },
  { label: "Complaints", value: "Complaint" },
  { label: "Corrective Actions", value: "CorrectiveAction" },
  { label: "Audits", value: "Audit" },
  { label: "Exams", value: "Exam" },
];

const ACTION_STYLES: Record<AuditTrailActionType, string> = {
  Review: "bg-[#dbeafe] text-[#2563eb]",
  Complaint: "bg-[#fef3c7] text-[#d97706]",
  CorrectiveAction: "bg-[#fee2e2] text-[#dc2626]",
  Audit: "bg-[#dcfce7] text-[#16a34a]",
  Exam: "bg-[#ede9fe] text-[#7c3aed]",
};

const ACTION_LABELS: Record<AuditTrailActionType, string> = {
  Review: "Review",
  Complaint: "Complaint",
  CorrectiveAction: "Corrective Action",
  Audit: "Audit",
  Exam: "Exam",
};

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AuditTrailPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditTrailEntry | null>(null);

  const filtered = mockAuditTrailEntries.filter((e) => {
    const matchesFilter = activeFilter === "all" || e.actionType === activeFilter;
    const matchesSearch =
      e.details.toLowerCase().includes(search.toLowerCase()) ||
      e.actorName.toLowerCase().includes(search.toLowerCase()) ||
      (e.courseTitle ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <PageHeader title="Audit Trail" description="Immutable log of all AQAD actions" />

      {/* Immutability Banner */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border bg-[#f4f4f4] px-4 py-3">
        <Lock className="h-4 w-4 shrink-0 text-secondary-foreground" />
        <p className="text-sm text-secondary-foreground">
          All records in this audit trail are <strong className="text-foreground">immutable</strong> — they cannot be modified or deleted. This log is used for external audits and accreditation.
        </p>
        <button className="ml-auto flex shrink-0 items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-secondary">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <FilterBar filters={ACTION_FILTERS} activeFilter={activeFilter} onFilterChange={setActiveFilter} searchValue={search} onSearchChange={setSearch} placeholder="Search by actor, course, details…" />

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                <th className="px-4 py-2.5 text-left font-medium">Timestamp</th>
                <th className="px-4 py-2.5 text-center font-medium">Type</th>
                <th className="px-4 py-2.5 text-left font-medium">Actor</th>
                <th className="px-4 py-2.5 text-left font-medium">Course</th>
                <th className="px-4 py-2.5 text-left font-medium">Details</th>
                <th className="px-4 py-2.5 text-center font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className={`border-b last:border-b-0 hover:bg-secondary/30 ${selectedEntry?.id === entry.id ? "bg-secondary/50" : ""}`}>
                  <td className="px-4 py-3 text-xs text-secondary-foreground whitespace-nowrap">
                    {formatDateTime(entry.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_STYLES[entry.actionType]}`}>
                      {ACTION_LABELS[entry.actionType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{entry.actorName}</td>
                  <td className="px-4 py-3">
                    {entry.courseTitle ? (
                      <p className="max-w-[150px] truncate text-xs">{entry.courseTitle}</p>
                    ) : (
                      <span className="text-xs text-secondary-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="line-clamp-2 text-xs text-secondary-foreground">{entry.details}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)} className="rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                      {selectedEntry?.id === entry.id ? "Close" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <SectionCard
          title="Entry Details"
          action={<button onClick={() => setSelectedEntry(null)}><X className="h-4 w-4" /></button>}
          className="mt-6"
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div><p className="text-xs text-secondary-foreground">Timestamp</p><p className="text-sm font-medium">{formatDateTime(selectedEntry.timestamp)}</p></div>
            <div><p className="text-xs text-secondary-foreground">Action Type</p><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_STYLES[selectedEntry.actionType]}`}>{ACTION_LABELS[selectedEntry.actionType]}</span></div>
            <div><p className="text-xs text-secondary-foreground">Actor</p><p className="text-sm font-medium">{selectedEntry.actorName}</p></div>
            {selectedEntry.courseTitle && <div><p className="text-xs text-secondary-foreground">Course</p><p className="text-sm font-medium">{selectedEntry.courseTitle}</p></div>}
          </div>
          <div className="mt-4">
            <p className="mb-1 text-xs font-medium text-secondary-foreground">Details</p>
            <p className="text-sm">{selectedEntry.details}</p>
          </div>
          {selectedEntry.evidenceLinks.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-secondary-foreground">Evidence</p>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.evidenceLinks.map((link, i) => (
                  <span key={i} className="rounded-md border bg-secondary px-3 py-1 text-xs">{link}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#f4f4f4] px-3 py-2">
            <Lock className="h-3.5 w-3.5 text-secondary-foreground" />
            <p className="text-xs text-secondary-foreground">This record is tamper-evident and cannot be modified.</p>
          </div>
        </SectionCard>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <ScrollText className="mx-auto mb-3 h-8 w-8 text-secondary-foreground" />
          <p className="font-medium">No entries found</p>
          <p className="text-sm text-secondary-foreground">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
