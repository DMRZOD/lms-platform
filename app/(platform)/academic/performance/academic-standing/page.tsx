"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FilterBar } from "@/components/academic/filter-bar";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockPerformanceRecords, mockStandingChanges } from "@/constants/academic-mock-data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Good Standing", value: "GoodStanding" },
  { label: "Warning", value: "Warning" },
  { label: "Probation", value: "Probation" },
  { label: "Dismissed", value: "Dismissed" },
];

export default function AcademicStandingPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [changeModal, setChangeModal] = useState<string | null>(null);
  const [changeForm, setChangeForm] = useState({ newStanding: "Warning", reason: "" });

  const filtered = mockPerformanceRecords.filter((r) => {
    const matchesFilter = filter === "all" || r.standing === filter;
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const good = mockPerformanceRecords.filter((r) => r.standing === "GoodStanding").length;
  const warning = mockPerformanceRecords.filter((r) => r.standing === "Warning").length;
  const probation = mockPerformanceRecords.filter((r) => r.standing === "Probation").length;
  const dismissed = mockPerformanceRecords.filter((r) => r.standing === "Dismissed").length;

  return (
    <div>
      <Link href="/academic/performance" className="mb-4 flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Performance
      </Link>

      <PageHeader title="Academic Standing" description="Monitor and manage student academic statuses" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Good Standing" value={good} accent="success" />
        <StatCard label="Warning" value={warning} accent="warning" />
        <StatCard label="Probation" value={probation} accent="danger" />
        <StatCard label="Dismissed" value={dismissed} />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search student..."
      />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-secondary-foreground">Student</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Group</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Standing</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">GPA</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Attendance</th>
              <th className="px-4 py-3 font-medium text-secondary-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium">{r.studentName}</td>
                <td className="px-4 py-3 text-secondary-foreground">{r.groupName}</td>
                <td className="px-4 py-3"><StatusBadge status={r.standing} /></td>
                <td className={`px-4 py-3 font-medium ${r.gpa < 2.0 ? "text-[#dc2626]" : r.gpa < 2.5 ? "text-[#d97706]" : ""}`}>
                  {r.gpa.toFixed(2)}
                </td>
                <td className={`px-4 py-3 ${r.attendanceRate < 75 ? "text-[#dc2626]" : ""}`}>{r.attendanceRate}%</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setChangeModal(r.studentName)}
                    className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary"
                  >
                    Change Standing
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <SectionCard title="Standing Change History">
          <div className="space-y-3">
            {mockStandingChanges.map((change) => (
              <div key={change.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{change.studentName}</span>
                    <StatusBadge status={change.previousStanding} />
                    <span className="text-secondary-foreground">→</span>
                    <StatusBadge status={change.newStanding} />
                  </div>
                  <p className="mt-0.5 text-sm text-secondary-foreground">{change.reason}</p>
                </div>
                <div className="text-right text-xs text-secondary-foreground">
                  <p>{change.changedBy}</p>
                  <p>{new Date(change.changedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Change Standing Modal */}
      {changeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-1 font-semibold">Change Academic Standing</h2>
            <p className="mb-4 text-sm text-secondary-foreground">For <strong>{changeModal}</strong>. A reason is required and will be logged.</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">New Standing</label>
                <select value={changeForm.newStanding} onChange={(e) => setChangeForm({ ...changeForm, newStanding: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="GoodStanding">Good Standing</option>
                  <option value="Warning">Warning</option>
                  <option value="Probation">Probation</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Reason <span className="text-[#dc2626]">*</span></label>
                <textarea
                  value={changeForm.reason}
                  onChange={(e) => setChangeForm({ ...changeForm, reason: e.target.value })}
                  rows={3}
                  placeholder="Mandatory reason for changing academic standing..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setChangeModal(null)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!changeForm.reason.trim()}
                onClick={() => { setChangeModal(null); setChangeForm({ newStanding: "Warning", reason: "" }); }}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
