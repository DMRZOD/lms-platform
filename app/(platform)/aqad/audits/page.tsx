"use client";

import { useState } from "react";
import { CalendarCheck, Plus, X } from "lucide-react";
import { EmptyState } from "@/components/aqad/empty-state";
import { SectionCard } from "@/components/aqad/section-card";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockAQADMembers, mockAudits, mockPublishedCourses } from "@/constants/aqad-mock-data";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const RESULT_STYLES: Record<string, string> = {
  Passed: "bg-[#dcfce7] text-[#16a34a]",
  IssuesFound: "bg-[#fef3c7] text-[#d97706]",
  Suspended: "bg-[#fee2e2] text-[#dc2626]",
};

export default function AuditsPage() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [newAudit, setNewAudit] = useState({ courseId: "", date: "", type: "Scheduled", reason: "" });

  const upcoming = mockAudits.filter((a) => !a.completedAt);
  const completed = mockAudits.filter((a) => a.completedAt);

  const passedCount = completed.filter((a) => a.result === "Passed").length;
  const issuesCount = completed.filter((a) => a.result === "IssuesFound").length;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader title="Audits" description={`${upcoming.length} upcoming · ${completed.length} completed`} />
        <button onClick={() => setShowSchedule(true)} className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Schedule Audit
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Upcoming" value={upcoming.length} icon={CalendarCheck} subtitle="Scheduled this month" />
        <StatCard label="Completed" value={completed.length} icon={CalendarCheck} subtitle="This semester" accent="success" />
        <StatCard label="Passed" value={passedCount} icon={CalendarCheck} subtitle="No issues found" accent="success" />
        <StatCard label="Issues Found" value={issuesCount} icon={CalendarCheck} subtitle="Required corrective actions" accent={issuesCount > 0 ? "warning" : "default"} />
      </div>

      {/* Upcoming Audits */}
      <SectionCard title="Upcoming Audits" className="mb-6">
        {upcoming.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No upcoming audits" description="Schedule a new audit using the button above." />
        ) : (
          <div className="space-y-3">
            {upcoming.map((audit) => (
              <div key={audit.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{audit.courseTitle}</p>
                    <StatusBadge status={audit.type} />
                  </div>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {audit.teacherName} · {audit.programName}
                  </p>
                  {audit.reason && (
                    <p className="mt-1 text-xs text-[#d97706]">Reason: {audit.reason}</p>
                  )}
                </div>
                <div className="ml-4 shrink-0 text-right">
                  <p className="text-sm font-medium">{formatDate(audit.scheduledAt)}</p>
                  <p className="text-xs text-secondary-foreground">{audit.auditorName ?? "Unassigned"}</p>
                </div>
                <div className="ml-4 flex gap-2">
                  <button className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background hover:opacity-90">
                    Conduct Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Completed Audits */}
      <SectionCard title="Completed Audits">
        {completed.length === 0 ? (
          <p className="text-sm text-secondary-foreground">No completed audits yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Course</th>
                  <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-center font-medium">Type</th>
                  <th className="px-4 py-2.5 text-center font-medium">Result</th>
                  <th className="px-4 py-2.5 text-left font-medium">Auditor</th>
                  <th className="px-4 py-2.5 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((audit) => (
                  <tr key={audit.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{audit.courseTitle}</p>
                      <p className="text-xs text-secondary-foreground">{audit.programName}</p>
                    </td>
                    <td className="px-4 py-3 text-secondary-foreground">{audit.teacherName}</td>
                    <td className="px-4 py-3 text-xs text-secondary-foreground">{formatDate(audit.completedAt!)}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={audit.type} /></td>
                    <td className="px-4 py-3 text-center">
                      {audit.result && (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RESULT_STYLES[audit.result] ?? "bg-[#f4f4f4] text-[#6b7280]"}`}>
                          {audit.result === "IssuesFound" ? "Issues Found" : audit.result}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">{audit.auditorName}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-2 text-xs text-secondary-foreground">{audit.notes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Schedule Audit Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Schedule Audit</h3>
              <button onClick={() => setShowSchedule(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Course</label>
                <select value={newAudit.courseId} onChange={(e) => setNewAudit((p) => ({ ...p, courseId: e.target.value }))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select course…</option>
                  {mockPublishedCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Auditor</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select auditor…</option>
                  {mockAQADMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Date</label>
                <input type="date" value={newAudit.date} onChange={(e) => setNewAudit((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Type</label>
                <select value={newAudit.type} onChange={(e) => setNewAudit((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="Scheduled">Scheduled (periodic)</option>
                  <option value="Unplanned">Unplanned</option>
                </select>
              </div>
              {newAudit.type === "Unplanned" && (
                <div>
                  <label className="mb-1 block text-xs font-medium">Reason</label>
                  <textarea value={newAudit.reason} onChange={(e) => setNewAudit((p) => ({ ...p, reason: e.target.value }))} rows={2} placeholder="Reason for unplanned audit…" className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowSchedule(false)} className="rounded-md border px-4 py-2 text-sm hover:bg-secondary">Cancel</button>
              <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
