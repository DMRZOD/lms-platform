"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, BarChart3, Plus, TrendingUp } from "lucide-react";
import { FilterBar } from "@/components/academic/filter-bar";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockPerformanceRecords } from "@/constants/academic-mock-data";

const TABS = ["Gradebook Overview", "At-Risk", "Trends", "Interventions"];
const STANDING_FILTERS = [
  { label: "All", value: "all" },
  { label: "Good Standing", value: "GoodStanding" },
  { label: "Warning", value: "Warning" },
  { label: "Probation", value: "Probation" },
  { label: "Dismissed", value: "Dismissed" },
];

const RISK_LABELS: Record<string, string> = {
  LowAttendance: "Low Attendance",
  LowGrades: "Low Grades",
  FinancialIssue: "Financial Issue",
  MissedAssignments: "Missed Assignments",
};

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState("Gradebook Overview");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [interventionModal, setInterventionModal] = useState<string | null>(null);
  const [intForm, setIntForm] = useState({ type: "", description: "", assignee: "", deadline: "" });

  const filtered = mockPerformanceRecords.filter((r) => {
    const matchesFilter = filter === "all" || r.standing === filter;
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.groupName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const atRisk = mockPerformanceRecords.filter((r) => r.atRisk);
  const avgGpa = (mockPerformanceRecords.reduce((s, r) => s + r.gpa, 0) / mockPerformanceRecords.length).toFixed(2);
  const onProbation = mockPerformanceRecords.filter((r) => r.standing === "Probation").length;

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <PageHeader title="Performance Monitoring" description="Academic performance across all groups — Spring 2026" />
        <div className="flex shrink-0 gap-2">
          <Link href="/academic/performance/academic-standing" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">
            Academic Standing
          </Link>
          <Link href="/academic/performance/retakes" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">
            Retakes
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Students" value={mockPerformanceRecords.length} />
        <StatCard label="At-Risk" value={atRisk.length} accent={atRisk.length > 0 ? "danger" : "default"} />
        <StatCard label="On Probation" value={onProbation} accent={onProbation > 0 ? "warning" : "default"} />
        <StatCard label="Average GPA" value={avgGpa} icon={BarChart3} />
      </div>

      <div className="mb-6 flex gap-0 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "At-Risk" && atRisk.length > 0 && (
              <span className="ml-1.5 rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-bold text-white">{atRisk.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Gradebook Overview */}
      {activeTab === "Gradebook Overview" && (
        <>
          <FilterBar
            filters={STANDING_FILTERS}
            activeFilter={filter}
            onFilterChange={setFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search student or group..."
          />
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Student</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Group</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">GPA</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Sem GPA</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Attendance</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Credits</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className={r.atRisk ? "bg-[#fff8f8]" : ""}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {r.atRisk && <AlertTriangle className="h-3.5 w-3.5 text-[#dc2626]" />}
                        <span className="font-medium">{r.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary-foreground">{r.groupName}</td>
                    <td className={`px-4 py-3 font-medium ${r.gpa < 2.0 ? "text-[#dc2626]" : r.gpa < 2.5 ? "text-[#d97706]" : ""}`}>{r.gpa.toFixed(2)}</td>
                    <td className={`px-4 py-3 ${r.semesterGpa < 2.0 ? "text-[#dc2626]" : ""}`}>{r.semesterGpa.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 rounded-full bg-secondary">
                          <div className={`h-1.5 rounded-full ${r.attendanceRate >= 75 ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} style={{ width: `${r.attendanceRate}%` }} />
                        </div>
                        <span className={`text-sm ${r.attendanceRate < 75 ? "text-[#dc2626]" : ""}`}>{r.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary-foreground">{r.creditsPassed}/{r.creditsTotal}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.standing} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* At-Risk */}
      {activeTab === "At-Risk" && (
        <div className="space-y-3">
          {atRisk.map((r) => (
            <div key={r.id} className="flex items-start gap-4 rounded-lg border border-[#fca5a5] bg-[#fff8f8] p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{r.studentName}</p>
                  <StatusBadge status={r.standing} />
                </div>
                <p className="mt-0.5 text-sm text-secondary-foreground">{r.groupName} · GPA {r.gpa.toFixed(2)} · Attendance {r.attendanceRate}%</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.riskFactors.map((factor) => (
                    <span key={factor} className="rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-xs font-medium text-[#dc2626]">
                      {RISK_LABELS[factor] ?? factor}
                    </span>
                  ))}
                </div>
                {r.interventions.length > 0 && (
                  <p className="mt-2 text-xs text-[#d97706]">
                    {r.interventions.length} active intervention{r.interventions.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => setInterventionModal(r.studentName)}
                className="shrink-0 flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <Plus className="h-3.5 w-3.5" />
                Intervene
              </button>
            </div>
          ))}
          {atRisk.length === 0 && (
            <p className="py-12 text-center text-sm text-secondary-foreground">No at-risk students. Great work!</p>
          )}
        </div>
      )}

      {/* Trends */}
      {activeTab === "Trends" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SectionCard title="Average GPA by Semester">
            <div className="space-y-3">
              {[
                { sem: "Spring 2025", gpa: 3.12 },
                { sem: "Fall 2025", gpa: 3.05 },
                { sem: "Spring 2026", gpa: 2.98 },
              ].map((item) => (
                <div key={item.sem} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-sm text-secondary-foreground">{item.sem}</div>
                  <div className="flex-1">
                    <div className="h-5 rounded bg-secondary">
                      <div
                        className="h-5 rounded bg-[#2563eb] transition-all"
                        style={{ width: `${(item.gpa / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm font-medium">{item.gpa}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#dc2626]">
              <TrendingUp className="h-3.5 w-3.5 rotate-180" />
              GPA trend declining — recommend intervention review
            </div>
          </SectionCard>
          <SectionCard title="Average Attendance by Semester">
            <div className="space-y-3">
              {[
                { sem: "Spring 2025", rate: 82 },
                { sem: "Fall 2025", rate: 79 },
                { sem: "Spring 2026", rate: 76 },
              ].map((item) => (
                <div key={item.sem} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-sm text-secondary-foreground">{item.sem}</div>
                  <div className="flex-1">
                    <div className="h-5 rounded bg-secondary">
                      <div
                        className={`h-5 rounded transition-all ${item.rate >= 75 ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm font-medium">{item.rate}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Interventions */}
      {activeTab === "Interventions" && (
        <SectionCard title="Active Interventions">
          <div className="space-y-3">
            {mockPerformanceRecords.flatMap((r) => r.interventions).map((int) => (
              <div key={int.id} className="flex items-start justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">{int.studentName}</p>
                  <p className="mt-0.5 text-sm text-secondary-foreground">{int.type} · {int.description}</p>
                  <p className="mt-1 text-xs text-secondary-foreground">
                    Assigned to <strong>{int.assignedTo}</strong> · Due {new Date(int.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  int.status === "Open" ? "bg-[#fef3c7] text-[#d97706]" :
                  int.status === "InProgress" ? "bg-[#dbeafe] text-[#2563eb]" :
                  "bg-[#dcfce7] text-[#16a34a]"
                }`}>
                  {int.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Intervention Modal */}
      {interventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-1 font-semibold">Create Intervention</h2>
            <p className="mb-4 text-sm text-secondary-foreground">For <strong>{interventionModal}</strong></p>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Intervention Type</label>
                <select value={intForm.type} onChange={(e) => setIntForm({ ...intForm, type: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select type…</option>
                  <option>Academic Counseling</option>
                  <option>Tutoring</option>
                  <option>Financial Aid</option>
                  <option>Disciplinary Review</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea value={intForm.description} onChange={(e) => setIntForm({ ...intForm, description: e.target.value })} rows={2} placeholder="Describe the intervention action..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Assign To</label>
                  <input value={intForm.assignee} onChange={(e) => setIntForm({ ...intForm, assignee: e.target.value })} placeholder="Name or department" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Deadline</label>
                  <input type="date" value={intForm.deadline} onChange={(e) => setIntForm({ ...intForm, deadline: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setInterventionModal(null)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button onClick={() => setInterventionModal(null)} className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background hover:opacity-90">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
