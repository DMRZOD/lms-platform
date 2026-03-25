"use client";

import { useState } from "react";
import { CheckSquare, Plus, X } from "lucide-react";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { PriorityBadge } from "@/components/aqad/priority-badge";
import { SectionCard } from "@/components/aqad/section-card";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { Timeline } from "@/components/aqad/timeline";
import { PageHeader } from "@/components/platform/page-header";
import { mockCorrectiveActions, mockPublishedCourses } from "@/constants/aqad-mock-data";
import type { CorrectiveAction } from "@/types/aqad";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Issued", value: "Issued" },
  { label: "In Progress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
  { label: "Verified", value: "Verified" },
  { label: "Overdue", value: "Overdue" },
];

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDaysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

export default function CorrectiveActionsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newAction, setNewAction] = useState({ courseId: "", issue: "", required: "", deadline: "", priority: "Medium" });

  const filtered = mockCorrectiveActions.filter((a) => {
    const matchesFilter = activeFilter === "all" || a.status === activeFilter;
    const matchesSearch =
      a.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const issued = mockCorrectiveActions.filter((a) => a.status === "Issued").length;
  const inProgress = mockCorrectiveActions.filter((a) => a.status === "InProgress").length;
  const overdue = mockCorrectiveActions.filter((a) => a.status === "Overdue").length;
  const verified = mockCorrectiveActions.filter((a) => a.status === "Verified").length;
  const selected: CorrectiveAction | undefined = mockCorrectiveActions.find((a) => a.id === selectedId);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader title="Corrective Actions" description={`${mockCorrectiveActions.length} total actions`} />
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> New Action
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Issued" value={issued} icon={CheckSquare} subtitle="Awaiting start" accent="warning" />
        <StatCard label="In Progress" value={inProgress} icon={CheckSquare} subtitle="Teacher working" />
        <StatCard label="Overdue" value={overdue} icon={CheckSquare} subtitle="Past deadline" accent={overdue > 0 ? "danger" : "default"} />
        <StatCard label="Verified" value={verified} icon={CheckSquare} subtitle="Closed successfully" accent="success" />
      </div>

      <FilterBar filters={FILTERS} activeFilter={activeFilter} onFilterChange={setActiveFilter} searchValue={search} onSearchChange={setSearch} placeholder="Search by course, teacher, ID…" />

      {filtered.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No actions found" description="Try adjusting your filters." />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Course / Teacher</th>
                  <th className="px-4 py-2.5 text-left font-medium">Issue</th>
                  <th className="px-4 py-2.5 text-left font-medium">Deadline</th>
                  <th className="px-4 py-2.5 text-center font-medium">Priority</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                  <th className="px-4 py-2.5 text-center font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const days = getDaysUntil(a.deadline);
                  return (
                    <tr key={a.id} className={`border-b last:border-b-0 hover:bg-secondary/30 ${selectedId === a.id ? "bg-secondary/50" : ""}`}>
                      <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{a.courseTitle}</p>
                        <p className="text-xs text-secondary-foreground">{a.teacherName}</p>
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-2 text-xs text-secondary-foreground">{a.issueDescription}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs">{formatDate(a.deadline)}</p>
                        {a.status !== "Verified" && a.status !== "Completed" && (
                          <p className={`text-xs font-medium ${days < 0 ? "text-[#dc2626]" : days <= 2 ? "text-[#d97706]" : "text-[#16a34a]"}`}>
                            {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : `${days}d left`}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center"><PriorityBadge priority={a.priority} /></td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setSelectedId(selectedId === a.id ? null : a.id)} className="rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                          {selectedId === a.id ? "Close" : "View"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title={`Action ${selected.id}`} action={<button onClick={() => setSelectedId(null)}><X className="h-4 w-4" /></button>}>
              <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-secondary/30 p-3">
                <div><p className="text-xs text-secondary-foreground">Course</p><p className="text-sm font-medium">{selected.courseTitle}</p></div>
                <div><p className="text-xs text-secondary-foreground">Teacher</p><p className="text-sm font-medium">{selected.teacherName}</p></div>
                <div><p className="text-xs text-secondary-foreground">Deadline</p><p className="text-sm font-medium">{formatDate(selected.deadline)}</p></div>
                <div><p className="text-xs text-secondary-foreground">Issued by</p><p className="text-sm font-medium">{selected.issuedByName}</p></div>
              </div>
              <p className="mb-1 text-xs font-medium text-secondary-foreground">Issue Description</p>
              <p className="mb-4 text-sm">{selected.issueDescription}</p>
              <p className="mb-1 text-xs font-medium text-secondary-foreground">Required Action</p>
              <p className="mb-4 text-sm">{selected.requiredAction}</p>
              {selected.evidence.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-secondary-foreground">Evidence</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.evidence.map((ev, i) => <span key={i} className="rounded-md border bg-secondary px-3 py-1 text-xs">{ev}</span>)}
                  </div>
                </div>
              )}
            </SectionCard>

            {selected.teacherResponse && (
              <SectionCard title="Teacher Response">
                <p className="text-sm">{selected.teacherResponse}</p>
                {selected.completedAt && <p className="mt-2 text-xs text-secondary-foreground">Completed {formatDate(selected.completedAt)}</p>}
              </SectionCard>
            )}

            {(selected.status === "Completed" || selected.status === "Reopened") && (
              <div className="flex gap-3">
                <button className="rounded-md bg-[#16a34a] px-4 py-2 text-sm text-white hover:opacity-90">Verify — Mark as Done</button>
                <button className="rounded-md border border-[#dc2626] px-4 py-2 text-sm text-[#dc2626] hover:bg-[#fee2e2]">Reopen — Not Accepted</button>
              </div>
            )}
          </div>

          <SectionCard title="Timeline">
            <Timeline items={[
              { id: "issued", timestamp: selected.issuedAt, title: "Action issued", actor: selected.issuedByName, type: "warning" },
              ...(selected.teacherResponse ? [{ id: "resp", timestamp: selected.completedAt ?? selected.issuedAt, title: "Teacher responded", type: "default" as const }] : []),
              ...(selected.completedAt ? [{ id: "done", timestamp: selected.completedAt, title: "Marked as completed", type: "default" as const }] : []),
              ...(selected.verifiedAt ? [{ id: "verified", timestamp: selected.verifiedAt, title: "Verified by AQAD", type: "success" as const }] : []),
            ]} />
          </SectionCard>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">New Corrective Action</h3>
              <button onClick={() => setShowCreate(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Course</label>
                <select value={newAction.courseId} onChange={(e) => setNewAction((p) => ({ ...p, courseId: e.target.value }))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select course…</option>
                  {mockPublishedCourses.map((c) => <option key={c.id} value={c.id}>{c.title} — {c.teacherName}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Issue Description</label>
                <textarea value={newAction.issue} onChange={(e) => setNewAction((p) => ({ ...p, issue: e.target.value }))} rows={3} placeholder="Describe the issue…" className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Required Action</label>
                <textarea value={newAction.required} onChange={(e) => setNewAction((p) => ({ ...p, required: e.target.value }))} rows={3} placeholder="What must the teacher do…" className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Deadline</label>
                  <input type="date" value={newAction.deadline} onChange={(e) => setNewAction((p) => ({ ...p, deadline: e.target.value }))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Priority</label>
                  <select value={newAction.priority} onChange={(e) => setNewAction((p) => ({ ...p, priority: e.target.value }))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                    <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-md border px-4 py-2 text-sm hover:bg-secondary">Cancel</button>
              <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">Issue Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
