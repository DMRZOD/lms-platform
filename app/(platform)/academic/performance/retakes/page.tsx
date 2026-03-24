"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { FilterBar } from "@/components/academic/filter-bar";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockRetakeRequests } from "@/constants/academic-mock-data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function RetakesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [createForm, setCreateForm] = useState({ student: "", course: "", examType: "Final", reason: "" });

  const filtered = mockRetakeRequests.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pending = mockRetakeRequests.filter((r) => r.status === "Pending").length;
  const scheduled = mockRetakeRequests.filter((r) => r.status === "Scheduled").length;
  const completed = mockRetakeRequests.filter((r) => r.status === "Completed").length;

  return (
    <div>
      <Link href="/academic/performance" className="mb-4 flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Performance
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Retake Management" description="Manage exam retake requests and scheduling" />
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Retake
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total" value={mockRetakeRequests.length} />
        <StatCard label="Pending" value={pending} accent={pending > 0 ? "warning" : "default"} />
        <StatCard label="Scheduled" value={scheduled} />
        <StatCard label="Completed" value={completed} accent="success" />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search student or course..."
      />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-secondary-foreground">Student</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Course</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Exam</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Original Score</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Retake Score</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Attempt</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Scheduled</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium">{r.studentName}</td>
                <td className="px-4 py-3 text-secondary-foreground">{r.courseName}</td>
                <td className="px-4 py-3">{r.examType}</td>
                <td className={`px-4 py-3 font-medium ${r.originalScore < 50 ? "text-[#dc2626]" : ""}`}>{r.originalScore}</td>
                <td className="px-4 py-3">
                  {r.retakeScore !== undefined ? (
                    <span className={r.retakeScore >= 50 ? "text-[#16a34a] font-medium" : "text-[#dc2626] font-medium"}>
                      {r.retakeScore}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="text-secondary-foreground">{r.attempt}/{r.maxAttempts}</span>
                </td>
                <td className="px-4 py-3 text-secondary-foreground">
                  {r.scheduledDate
                    ? new Date(r.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {r.status === "Pending" && (
                      <button
                        onClick={() => setScheduleModal(r.id)}
                        className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary"
                      >
                        Schedule
                      </button>
                    )}
                    {(r.status === "Pending" || r.status === "Scheduled") && (
                      <button className="rounded-md border border-[#fca5a5] px-2.5 py-1 text-xs text-[#dc2626] hover:bg-[#fee2e2]">
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-4 font-semibold">Schedule Retake</h2>
            <label className="mb-1.5 block text-sm font-medium">Date & Time <span className="text-[#dc2626]">*</span></label>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
            <div className="mt-5 flex gap-2">
              <button onClick={() => setScheduleModal(null)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!scheduleDate}
                onClick={() => { setScheduleModal(null); setScheduleDate(""); }}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Retake Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-4 font-semibold">Create Retake Request</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Student</label>
                <input value={createForm.student} onChange={(e) => setCreateForm({ ...createForm, student: e.target.value })} placeholder="Student name or ID..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Course</label>
                <input value={createForm.course} onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })} placeholder="Course name..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Exam Type</label>
                <select value={createForm.examType} onChange={(e) => setCreateForm({ ...createForm, examType: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option>Midterm</option>
                  <option>Final</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Reason</label>
                <textarea value={createForm.reason} onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })} rows={2} placeholder="Reason for retake..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setCreateModal(false)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button onClick={() => setCreateModal(false)} className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background hover:opacity-90">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
