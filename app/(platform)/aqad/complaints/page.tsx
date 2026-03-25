"use client";

import { useState } from "react";
import { MessageSquareWarning, X } from "lucide-react";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { PriorityBadge } from "@/components/aqad/priority-badge";
import { SectionCard } from "@/components/aqad/section-card";
import { SLAIndicator } from "@/components/aqad/sla-indicator";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { Timeline } from "@/components/aqad/timeline";
import { PageHeader } from "@/components/platform/page-header";
import { mockAQADMembers, mockComplaints } from "@/constants/aqad-mock-data";
import type { Complaint, ComplaintOutcome } from "@/types/aqad";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "Submitted" },
  { label: "In Review", value: "InReview" },
  { label: "Resolved", value: "Resolved" },
];

const CATEGORY_LABELS: Record<string, string> = {
  ContentQuality: "Content Quality",
  TeacherBehavior: "Teacher Behavior",
  Technical: "Technical",
  Exam: "Exam",
  Other: "Other",
};

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ComplaintsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState<ComplaintOutcome | "">("");
  const [resolutionDesc, setResolutionDesc] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = mockComplaints.filter((c) => {
    const matchesFilter = activeFilter === "all" || c.status === activeFilter;
    const matchesSearch =
      c.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const submitted = mockComplaints.filter((c) => c.status === "Submitted").length;
  const inReview = mockComplaints.filter((c) => c.status === "InReview").length;
  const resolved = mockComplaints.filter((c) => c.status === "Resolved").length;
  const selected: Complaint | undefined = mockComplaints.find((c) => c.id === selectedId);

  return (
    <div>
      <PageHeader title="Complaints" description={`${mockComplaints.length} total complaints`} />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Submitted" value={submitted} icon={MessageSquareWarning} subtitle="Awaiting triage" accent={submitted > 0 ? "warning" : "default"} />
        <StatCard label="In Review" value={inReview} icon={MessageSquareWarning} subtitle="Under investigation" />
        <StatCard label="Resolved" value={resolved} icon={MessageSquareWarning} subtitle="This semester" accent="success" />
      </div>

      <FilterBar filters={STATUS_FILTERS} activeFilter={activeFilter} onFilterChange={setActiveFilter} searchValue={search} onSearchChange={setSearch} placeholder="Search by student, course, ID…" />

      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquareWarning} title="No complaints found" description="Try adjusting your filters." />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Student / Course</th>
                  <th className="px-4 py-2.5 text-left font-medium">Category</th>
                  <th className="px-4 py-2.5 text-left font-medium">Submitted</th>
                  <th className="px-4 py-2.5 text-center font-medium">Priority</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Investigator</th>
                  <th className="px-4 py-2.5 text-center font-medium">SLA</th>
                  <th className="px-4 py-2.5 text-center font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={`border-b last:border-b-0 hover:bg-secondary/30 ${selectedId === c.id ? "bg-secondary/50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.studentName}</p>
                      <p className="text-xs text-secondary-foreground">{c.courseTitle}</p>
                      {c.lectureTitle && <p className="text-xs text-secondary-foreground">↳ {c.lectureTitle}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{CATEGORY_LABELS[c.category] ?? c.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary-foreground">{formatDate(c.submittedAt)}</td>
                    <td className="px-4 py-3 text-center"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-xs">{c.investigatorName ?? <span className="italic text-secondary-foreground">Unassigned</span>}</td>
                    <td className="px-4 py-3 text-center">
                      {c.status !== "Resolved" ? <SLAIndicator deadline={c.slaDeadline} /> : <span className="text-xs text-secondary-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setSelectedId(selectedId === c.id ? null : c.id)} className="rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                        {selectedId === c.id ? "Close" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title={`Complaint ${selected.id}`} action={<button onClick={() => setSelectedId(null)}><X className="h-4 w-4" /></button>}>
              <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-secondary/30 p-3 md:grid-cols-3">
                <div><p className="text-xs text-secondary-foreground">Student</p><p className="text-sm font-medium">{selected.studentName}</p></div>
                <div><p className="text-xs text-secondary-foreground">Course</p><p className="text-sm font-medium">{selected.courseTitle}</p></div>
                <div><p className="text-xs text-secondary-foreground">Category</p><p className="text-sm font-medium">{CATEGORY_LABELS[selected.category]}</p></div>
                {selected.lectureTitle && <div><p className="text-xs text-secondary-foreground">Lecture</p><p className="text-sm font-medium">{selected.lectureTitle}</p></div>}
              </div>
              <p className="mb-1 text-xs font-medium text-secondary-foreground">Description</p>
              <p className="mb-4 text-sm">{selected.description}</p>
              {selected.evidence.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-secondary-foreground">Evidence</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.evidence.map((ev) => (
                      <span key={ev.id} className="rounded-md border bg-secondary px-3 py-1 text-xs">{ev.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            {selected.status !== "Resolved" && (
              <SectionCard title="Investigation">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">Assign Investigator</label>
                    <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select investigator…</option>
                      {mockAQADMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">Priority</label>
                    <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                </div>
                <label className="mb-1 block text-xs font-medium">Investigation Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Document findings…" rows={3} className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
              </SectionCard>
            )}

            {selected.status !== "Resolved" && (
              <SectionCard title="Resolution">
                <div className="mb-4 space-y-2">
                  {(["Upheld", "PartiallyUpheld", "Dismissed"] as ComplaintOutcome[]).map((o) => (
                    <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${resolution === o ? "border-foreground bg-secondary" : ""}`}>
                      <input type="radio" name="outcome" value={o} checked={resolution === o} onChange={() => setResolution(o)} />
                      <div>
                        <p className="text-sm font-medium">{o === "PartiallyUpheld" ? "Partially Upheld" : o}</p>
                        <p className="text-xs text-secondary-foreground">
                          {o === "Upheld" && "Complaint confirmed. Corrective action will be issued."}
                          {o === "PartiallyUpheld" && "Some aspects of the complaint confirmed."}
                          {o === "Dismissed" && "Complaint not confirmed after investigation."}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <textarea value={resolutionDesc} onChange={(e) => setResolutionDesc(e.target.value)} placeholder="Describe the resolution…" rows={3} className="mb-4 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
                {resolution === "Upheld" && (
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" /> Create corrective action for teacher
                  </label>
                )}
                <div className="mt-4 flex justify-end">
                  <button disabled={!resolution} className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                    Submit Resolution
                  </button>
                </div>
              </SectionCard>
            )}

            {selected.status === "Resolved" && (
              <SectionCard title="Resolution">
                <p className="mb-2 text-sm font-medium">Outcome: {selected.outcome}</p>
                {selected.resolutionDescription && <p className="text-sm text-secondary-foreground">{selected.resolutionDescription}</p>}
              </SectionCard>
            )}
          </div>

          <SectionCard title="Timeline">
            <Timeline items={[
              { id: "filed", timestamp: selected.submittedAt, title: "Complaint filed", actor: selected.studentName, type: "default" },
              ...(selected.investigatorName ? [{ id: "assigned", timestamp: selected.submittedAt, title: "Investigator assigned", actor: selected.investigatorName, type: "default" as const }] : []),
              ...(selected.status === "Resolved" ? [{ id: "resolved", timestamp: selected.slaDeadline, title: `Resolved — ${selected.outcome}`, description: selected.resolutionDescription, actor: selected.investigatorName, type: selected.outcome === "Upheld" ? "danger" as const : "success" as const }] : []),
            ]} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
