"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ShieldAlert, X } from "lucide-react";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { SectionCard } from "@/components/aqad/section-card";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockExamsForAudit, mockFraudFlags } from "@/constants/aqad-mock-data";
import type { ExamForAudit } from "@/types/aqad";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending Review", value: "PendingReview" },
  { label: "Reviewed", value: "Reviewed" },
  { label: "Has Flags", value: "flagged" },
];

const FRAUD_STATUS_COLORS: Record<string, string> = {
  Pending: "bg-[#fef3c7] text-[#d97706]",
  Confirmed: "bg-[#fee2e2] text-[#dc2626]",
  Dismissed: "bg-[#f4f4f4] text-[#6b7280]",
};

const VIOLATION_TYPES = [
  { name: "Tab switching", value: 8, color: "#f59e0b" },
  { name: "Copy-paste", value: 5, color: "#ef4444" },
  { name: "IP sharing", value: 3, color: "#8b5cf6" },
  { name: "Face not visible", value: 4, color: "#3b82f6" },
  { name: "Multiple faces", value: 2, color: "#6b7280" },
];

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ExamsAuditPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState<ExamForAudit | null>(null);
  const [flagDecisions, setFlagDecisions] = useState<Record<string, "Confirmed" | "Dismissed">>({});

  const filtered = mockExamsForAudit.filter((e) => {
    const matchesFilter =
      activeFilter === "all" ? true :
      activeFilter === "flagged" ? e.fraudFlagsCount > 0 :
      e.status === activeFilter;
    const matchesSearch =
      e.courseTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const examFlags = selectedExam
    ? mockFraudFlags.filter((f) => f.examId === selectedExam.id)
    : [];

  const totalFlags = mockExamsForAudit.reduce((s, e) => s + e.fraudFlagsCount, 0);
  const pendingFlags = mockFraudFlags.filter((f) => f.status === "Pending").length;
  const confirmedFlags = mockFraudFlags.filter((f) => f.status === "Confirmed").length;
  const fraudRate = Math.round((confirmedFlags / Math.max(mockExamsForAudit.reduce((s, e) => s + e.studentCount, 0), 1)) * 100 * 10) / 10;

  function setFlagDecision(flagId: string, decision: "Confirmed" | "Dismissed") {
    setFlagDecisions((prev) => ({ ...prev, [flagId]: decision }));
  }

  return (
    <div>
      <PageHeader title="Exams Audit" description="Forensic review of exam integrity and fraud flags" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Exams" value={mockExamsForAudit.length} icon={ShieldAlert} subtitle="This semester" />
        <StatCard label="Total Flags" value={totalFlags} icon={ShieldAlert} subtitle="Across all exams" accent={totalFlags > 0 ? "warning" : "default"} />
        <StatCard label="Pending Review" value={pendingFlags} icon={ShieldAlert} subtitle="Need decision" accent={pendingFlags > 0 ? "warning" : "default"} />
        <StatCard label="Confirmed Fraud" value={confirmedFlags} icon={ShieldAlert} subtitle={`${fraudRate}% fraud rate`} accent={confirmedFlags > 0 ? "danger" : "default"} />
      </div>

      <FilterBar filters={FILTERS} activeFilter={activeFilter} onFilterChange={setActiveFilter} searchValue={search} onSearchChange={setSearch} placeholder="Search by course…" />

      {filtered.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="No exams found" description="Try adjusting your filters." />
      ) : (
        <div className="mb-6 overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Course</th>
                  <th className="px-4 py-2.5 text-center font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-center font-medium">Students</th>
                  <th className="px-4 py-2.5 text-center font-medium">Fraud Flags</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                  <th className="px-4 py-2.5 text-center font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam) => (
                  <tr key={exam.id} className={`border-b last:border-b-0 hover:bg-secondary/30 ${selectedExam?.id === exam.id ? "bg-secondary/50" : ""}`}>
                    <td className="px-4 py-3 font-medium">{exam.courseTitle}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{exam.examType}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary-foreground">{formatDate(exam.date)}</td>
                    <td className="px-4 py-3 text-center">{exam.studentCount}</td>
                    <td className="px-4 py-3 text-center">
                      {exam.fraudFlagsCount > 0 ? (
                        <span className="font-semibold text-[#dc2626]">{exam.fraudFlagsCount}</span>
                      ) : (
                        <span className="text-secondary-foreground">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={exam.status} /></td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setSelectedExam(selectedExam?.id === exam.id ? null : exam)} className="rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                        {selectedExam?.id === exam.id ? "Close" : "Review"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fraud Flags Detail */}
      {selectedExam && (
        <SectionCard
          title={`Fraud Flags — ${selectedExam.courseTitle} (${selectedExam.examType})`}
          action={<button onClick={() => setSelectedExam(null)}><X className="h-4 w-4" /></button>}
          className="mb-6"
        >
          {examFlags.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No fraud flags for this exam.</p>
          ) : (
            <div className="space-y-3">
              {examFlags.map((flag) => {
                const currentStatus = flagDecisions[flag.id] ?? flag.status;
                return (
                  <div key={flag.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{flag.studentName}</p>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{flag.flagType}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${FRAUD_STATUS_COLORS[currentStatus] ?? "bg-[#f4f4f4] text-[#6b7280]"}`}>
                            {currentStatus}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-secondary-foreground">{flag.description}</p>
                        <p className="mt-1 text-xs text-secondary-foreground">Evidence: {flag.evidence}</p>
                        {flag.reviewerDecision && (
                          <p className="mt-1 text-xs italic text-secondary-foreground">{flag.reviewerDecision}</p>
                        )}
                      </div>
                      {flag.status === "Pending" && !flagDecisions[flag.id] && (
                        <div className="flex shrink-0 gap-2">
                          <button onClick={() => setFlagDecision(flag.id, "Confirmed")} className="rounded-md bg-[#fee2e2] px-3 py-1.5 text-xs text-[#dc2626] hover:opacity-90">
                            Confirm
                          </button>
                          <button onClick={() => setFlagDecision(flag.id, "Dismissed")} className="rounded-md bg-secondary px-3 py-1.5 text-xs hover:opacity-90">
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Violation Types">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={VIOLATION_TYPES} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={2}>
                {VIOLATION_TYPES.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v} cases`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {VIOLATION_TYPES.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs">{d.name}</span>
                <span className="text-xs font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Flags per Course">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={mockExamsForAudit.filter((e) => e.fraudFlagsCount > 0).map((e) => ({ name: e.courseTitle.split(" ").slice(0, 2).join(" "), flags: e.fraudFlagsCount }))}
              margin={{ top: 4, right: 8, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="flags" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
