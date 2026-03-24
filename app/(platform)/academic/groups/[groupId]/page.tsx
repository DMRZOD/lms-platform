"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Users,
  X,
} from "lucide-react";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { CalendarGrid } from "@/components/academic/calendar-grid";
import {
  mockGroupStudents,
  mockGroupTeachers,
  mockGroups,
  mockScheduleEntries,
} from "@/constants/academic-mock-data";

const TABS = ["Students", "Teachers", "Schedule", "Gradebook", "Attendance", "Analytics"];

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [activeTab, setActiveTab] = useState("Students");
  const [transferStudent, setTransferStudent] = useState<string | null>(null);
  const [transferReason, setTransferReason] = useState("");
  const [transferGroup, setTransferGroup] = useState("");

  const group = mockGroups.find((g) => g.id === groupId) ?? mockGroups[0];
  const students = mockGroupStudents.filter((s) => s.groupId === group.id);
  const teachers = mockGroupTeachers.filter((t) => t.groupId === group.id);
  const scheduleEntries = mockScheduleEntries.filter((s) => s.groupId === group.id);
  const otherGroups = mockGroups.filter((g) => g.id !== group.id && g.status === "Active");

  const avgGpa = students.length
    ? (students.reduce((s, st) => s + st.gpa, 0) / students.length).toFixed(2)
    : "—";
  const avgAttendance = students.length
    ? Math.round(students.reduce((s, st) => s + st.attendanceRate, 0) / students.length)
    : 0;
  const atRiskCount = students.filter((s) => s.atRisk).length;

  return (
    <div>
      <Link
        href="/academic/groups"
        className="mb-4 flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm text-secondary-foreground">{group.code}</p>
            <StatusBadge status={group.status} />
          </div>
          <PageHeader title={group.name} description={`${group.programName} · Year ${group.year} · Intake ${group.intake}`} />
        </div>
        <Link
          href="/academic/groups/create"
          className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          Edit Group
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Students" value={students.length} icon={Users} />
        <StatCard label="Average GPA" value={avgGpa} accent={Number(avgGpa) < 2.5 ? "warning" : "default"} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} accent={avgAttendance < 75 ? "danger" : "default"} />
        <StatCard label="At-Risk" value={atRiskCount} accent={atRiskCount > 0 ? "danger" : "default"} />
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-1 border-b border-border">
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
          </button>
        ))}
      </div>

      {/* Students Tab */}
      {activeTab === "Students" && (
        <SectionCard title={`Students (${students.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Student</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">GPA</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Sem GPA</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Attendance</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Standing</th>
                  <th className="pb-3 font-medium text-secondary-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{s.studentName}</p>
                      <p className="text-xs text-secondary-foreground">{s.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={s.gpa < 2.0 ? "text-[#dc2626] font-semibold" : ""}>{s.gpa.toFixed(2)}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={s.semesterGpa < 2.0 ? "text-[#dc2626] font-semibold" : ""}>{s.semesterGpa.toFixed(2)}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-secondary">
                          <div
                            className={`h-1.5 rounded-full ${s.attendanceRate >= 75 ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}
                            style={{ width: `${s.attendanceRate}%` }}
                          />
                        </div>
                        <span className={s.attendanceRate < 75 ? "text-[#dc2626]" : ""}>{s.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={s.standing} />
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setTransferStudent(s.studentName)}
                        className="rounded px-2 py-1 text-xs text-secondary-foreground hover:bg-secondary hover:text-foreground"
                      >
                        Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Teachers Tab */}
      {activeTab === "Teachers" && (
        <SectionCard title={`Teaching Staff (${teachers.length})`}>
          <div className="space-y-3">
            {teachers.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="font-medium">{t.teacherName}</p>
                  <p className="text-sm text-secondary-foreground">{t.courseName}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  t.role === "primary"
                    ? "bg-[#dbeafe] text-[#2563eb]"
                    : "bg-[#f4f4f4] text-[#6b7280]"
                }`}>
                  {t.role === "primary" ? "Primary" : "Assistant"}
                </span>
              </div>
            ))}
            {teachers.length === 0 && (
              <p className="text-sm text-secondary-foreground">No teachers assigned yet.</p>
            )}
          </div>
        </SectionCard>
      )}

      {/* Schedule Tab */}
      {activeTab === "Schedule" && (
        <SectionCard title="Weekly Schedule — Spring 2026">
          {scheduleEntries.length > 0 ? (
            <CalendarGrid entries={scheduleEntries} />
          ) : (
            <p className="text-sm text-secondary-foreground">No schedule entries for this group.</p>
          )}
        </SectionCard>
      )}

      {/* Gradebook Tab */}
      {activeTab === "Gradebook" && (
        <SectionCard title="Gradebook Overview">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Student</th>
                  {teachers.map((t) => (
                    <th key={t.id} className="pb-3 pr-4 font-medium text-secondary-foreground whitespace-nowrap">
                      {t.courseName.split(" ").slice(0, 2).join(" ")}
                    </th>
                  ))}
                  <th className="pb-3 font-medium text-secondary-foreground">GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 pr-4 font-medium">{s.studentName}</td>
                    {teachers.map((t) => {
                      const mockGrade = Math.round(s.gpa * 20 + Math.random() * 5);
                      return (
                        <td key={t.id} className={`py-2.5 pr-4 ${mockGrade < 50 ? "text-[#dc2626] font-semibold" : ""}`}>
                          {Math.min(mockGrade, 100)}
                        </td>
                      );
                    })}
                    <td className="py-2.5 font-semibold">{s.gpa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Attendance Tab */}
      {activeTab === "Attendance" && (
        <SectionCard title="Attendance Overview">
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-4">
                <div className="w-40 shrink-0">
                  <p className="text-sm font-medium truncate">{s.studentName}</p>
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-secondary">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        s.attendanceRate >= 75 ? "bg-[#22c55e]" : "bg-[#ef4444]"
                      }`}
                      style={{ width: `${s.attendanceRate}%` }}
                    />
                  </div>
                  <span className={`w-12 text-right text-sm font-medium ${s.attendanceRate < 75 ? "text-[#dc2626]" : ""}`}>
                    {s.attendanceRate}%
                  </span>
                  {s.attendanceRate < 75 && (
                    <span className="text-xs text-[#dc2626]">Below threshold</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-secondary-foreground">Minimum attendance threshold: 75%</p>
        </SectionCard>
      )}

      {/* Analytics Tab */}
      {activeTab === "Analytics" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SectionCard title="GPA Distribution">
            <div className="space-y-2">
              {[
                { label: "3.5 – 4.0 (Excellent)", count: students.filter((s) => s.gpa >= 3.5).length, color: "bg-[#22c55e]" },
                { label: "2.5 – 3.4 (Good)", count: students.filter((s) => s.gpa >= 2.5 && s.gpa < 3.5).length, color: "bg-[#2563eb]" },
                { label: "2.0 – 2.4 (Satisfactory)", count: students.filter((s) => s.gpa >= 2.0 && s.gpa < 2.5).length, color: "bg-[#f59e0b]" },
                { label: "Below 2.0 (At Risk)", count: students.filter((s) => s.gpa < 2.0).length, color: "bg-[#ef4444]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Risk Summary">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-secondary-foreground" />
                  <span className="text-sm">Average GPA</span>
                </div>
                <span className="font-semibold">{avgGpa}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary-foreground" />
                  <span className="text-sm">Avg Attendance</span>
                </div>
                <span className="font-semibold">{avgAttendance}%</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[#fca5a5] bg-[#fee2e2] p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#dc2626]" />
                  <span className="text-sm text-[#7f1d1d]">At-Risk Students</span>
                </div>
                <span className="font-semibold text-[#dc2626]">{atRiskCount}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Transfer Dialog */}
      {transferStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Transfer Student</h2>
              <button onClick={() => setTransferStudent(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-secondary-foreground">
              Transferring <strong>{transferStudent}</strong> to another group.
              A reason is required and will be logged.
            </p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Transfer to Group</label>
                <select
                  value={transferGroup}
                  onChange={(e) => setTransferGroup(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  <option value="">Select group…</option>
                  {otherGroups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Reason <span className="text-[#dc2626]">*</span>
                </label>
                <textarea
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Mandatory: state the reason for transfer..."
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setTransferStudent(null);
                  setTransferReason("");
                  setTransferGroup("");
                }}
                className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                disabled={!transferReason.trim() || !transferGroup}
                onClick={() => {
                  setTransferStudent(null);
                  setTransferReason("");
                  setTransferGroup("");
                }}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
