"use client";

import { use, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  Edit,
  KeyRound,
  MessageSquare,
  PenSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SectionCard } from "@/components/resource/section-card";
import { StatusBadge } from "@/components/resource/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockTeachers,
  mockAssignments,
  mockWorkload,
  mockKPIs,
  mockDocuments,
  mockAccessEntries,
} from "@/constants/resource-mock-data";

const TABS = [
  "Profile",
  "Documents",
  "Assignments",
  "Workload",
  "Performance",
  "Access",
] as const;
type Tab = (typeof TABS)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeacherDetailPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = use(params);
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [editMode, setEditMode] = useState(false);

  if (!teacher) {
    return (
      <div className="py-16 text-center">
        <p className="font-semibold">Teacher not found</p>
        <Link
          href="/resource/teachers"
          className="mt-2 block text-sm text-secondary-foreground underline"
        >
          Back to Teachers
        </Link>
      </div>
    );
  }

  const teacherAssignments = mockAssignments.filter((a) => a.teacherId === teacherId);
  const workloadEntry = mockWorkload.find((w) => w.teacherId === teacherId);
  const kpi = mockKPIs.find((k) => k.teacherId === teacherId);
  const documents = mockDocuments.filter((d) => d.teacherId === teacherId);
  const accessList = mockAccessEntries.filter((a) => a.teacherId === teacherId);

  const workloadPct = workloadEntry
    ? Math.min(
        Math.round((workloadEntry.lectureHoursWeek / workloadEntry.maxWorkloadHours) * 100),
        100,
      )
    : 0;

  return (
    <div>
      <PageHeader title="Teacher Profile" />

      {/* Teacher Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-background p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold">
            {initials(teacher.name)}
          </div>
          <div>
            <h1 className="text-xl font-bold">{teacher.name}</h1>
            <p className="text-sm text-secondary-foreground">{teacher.department}</p>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={teacher.status} />
              {teacher.kpiScore > 0 && (
                <span className="flex items-center gap-1 text-xs text-secondary-foreground">
                  <Star className="h-3.5 w-3.5 text-[#f59e0b]" />
                  KPI {teacher.kpiScore}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {teacher.status === "Pending" && (
            <Link
              href={`/resource/teachers/${teacherId}/verify`}
              className="rounded-md bg-[#1e40af] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              Verify
            </Link>
          )}
          {teacher.status === "Active" && (
            <button className="rounded-md border border-[#ef4444] px-3 py-1.5 text-sm font-medium text-[#dc2626] hover:bg-[#fee2e2]">
              Suspend
            </button>
          )}
          {teacher.status === "Suspended" && (
            <button className="rounded-md border border-[#22c55e] px-3 py-1.5 text-sm font-medium text-[#166534] hover:bg-[#dcfce7]">
              Reactivate
            </button>
          )}
          <button
            onClick={() => {
              setActiveTab("Profile");
              setEditMode(true);
            }}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ─────────────────────────────────────────────────── */}
      {activeTab === "Profile" && (
        <div className="space-y-6">
          <SectionCard
            title="Personal Information"
            action={
              !editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1 text-secondary-foreground hover:text-foreground"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  className="text-[#1e40af] hover:opacity-80"
                >
                  Save changes
                </button>
              )
            }
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", value: teacher.name },
                { label: "Email", value: teacher.email },
                { label: "Phone", value: teacher.phone },
                { label: "Department", value: teacher.department },
                { label: "Preferred Language", value: teacher.preferredLanguage },
                {
                  label: "Max Workload",
                  value: `${teacher.maxWorkloadHours} hrs/week`,
                },
                {
                  label: "Registered",
                  value: new Date(teacher.registeredAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
                {
                  label: "Contract Ends",
                  value: teacher.contractEndDate
                    ? new Date(teacher.contractEndDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not set",
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="mb-0.5 text-xs font-medium text-secondary-foreground">
                    {label}
                  </p>
                  {editMode ? (
                    <input
                      defaultValue={value}
                      className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                  ) : (
                    <p className="text-sm">{value}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-0.5 text-xs font-medium text-secondary-foreground">
                Specialization
              </p>
              <div className="flex flex-wrap gap-1.5">
                {teacher.specialization.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {teacher.bio && (
              <div className="mt-4">
                <p className="mb-0.5 text-xs font-medium text-secondary-foreground">Bio</p>
                {editMode ? (
                  <textarea
                    defaultValue={teacher.bio}
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                ) : (
                  <p className="text-sm text-secondary-foreground">{teacher.bio}</p>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ── Documents Tab ───────────────────────────────────────────────── */}
      {activeTab === "Documents" && (
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-secondary-foreground">
                    {doc.type} · Uploaded {doc.uploadedAt}
                  </p>
                  {doc.comment && (
                    <p className="mt-1 text-xs italic text-secondary-foreground">
                      Note: {doc.comment}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={doc.status} />
                  {doc.status === "Pending" && (
                    <>
                      <button className="rounded-md border border-[#22c55e] px-2.5 py-1 text-xs font-medium text-[#166534] hover:bg-[#dcfce7]">
                        Verify
                      </button>
                      <button className="rounded-md border border-[#ef4444] px-2.5 py-1 text-xs font-medium text-[#dc2626] hover:bg-[#fee2e2]">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          {teacher.status === "Pending" && (
            <div className="mt-4 text-center">
              <Link
                href={`/resource/teachers/${teacherId}/verify`}
                className="inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Start Full Verification
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Assignments Tab ─────────────────────────────────────────────── */}
      {activeTab === "Assignments" && (
        <div>
          <div className="mb-4 flex justify-end">
            <Link
              href="/resource/assignments"
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              <Briefcase className="h-4 w-4" />
              Create Assignment
            </Link>
          </div>
          {teacherAssignments.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No assignments yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary">
                    <th className="px-4 py-2.5 text-left font-medium">Course</th>
                    <th className="px-4 py-2.5 text-left font-medium">Program</th>
                    <th className="px-4 py-2.5 text-left font-medium">Group</th>
                    <th className="px-4 py-2.5 text-left font-medium">Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Period</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherAssignments.map((a) => (
                    <tr key={a.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{a.course}</p>
                        <p className="text-xs text-secondary-foreground">{a.courseCode}</p>
                      </td>
                      <td className="px-4 py-3 text-secondary-foreground">{a.program}</td>
                      <td className="px-4 py-3 text-secondary-foreground">{a.group}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.type} />
                      </td>
                      <td className="px-4 py-3 text-xs text-secondary-foreground">
                        {a.startDate} — {a.endDate}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Workload Tab ────────────────────────────────────────────────── */}
      {activeTab === "Workload" && (
        <div className="space-y-6">
          {!workloadEntry ? (
            <p className="text-sm text-secondary-foreground">No workload data available.</p>
          ) : (
            <>
              {/* Overload warning */}
              {workloadEntry.status === "Overloaded" && (
                <div className="flex items-start gap-3 rounded-md border border-[#fee2e2] bg-[#fff5f5] px-4 py-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#dc2626]" />
                  <div>
                    <p className="text-sm font-medium text-[#dc2626]">Overloaded</p>
                    <p className="text-xs text-[#dc2626]">
                      {workloadEntry.lectureHoursWeek}h/week exceeds maximum of{" "}
                      {workloadEntry.maxWorkloadHours}h. Consider assigning a TA or
                      redistributing courses.
                    </p>
                  </div>
                </div>
              )}

              {/* Workload gauge */}
              <SectionCard title="Workload Overview">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm">
                    {workloadEntry.lectureHoursWeek}h / {workloadEntry.maxWorkloadHours}h
                    per week
                  </span>
                  <StatusBadge status={workloadEntry.status} />
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${
                      workloadPct >= 100
                        ? "bg-[#ef4444]"
                        : workloadPct >= 85
                          ? "bg-[#f59e0b]"
                          : "bg-[#22c55e]"
                    }`}
                    style={{ width: `${workloadPct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-secondary-foreground">{workloadPct}% of max</p>
              </SectionCard>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {[
                  {
                    label: "Courses",
                    value: workloadEntry.courses,
                    icon: BookOpen,
                  },
                  {
                    label: "Hrs/Semester",
                    value: workloadEntry.lectureHoursSemester,
                    icon: TrendingUp,
                  },
                  {
                    label: "Students",
                    value: workloadEntry.students,
                    icon: Users,
                  },
                  {
                    label: "Q&A / Week",
                    value: workloadEntry.qaActivity,
                    icon: MessageSquare,
                  },
                  {
                    label: "Grading Queue",
                    value: workloadEntry.gradingQueue,
                    icon: PenSquare,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-background p-4 text-center"
                  >
                    <Icon className="mx-auto mb-1 h-5 w-5 text-secondary-foreground" />
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs text-secondary-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Performance Tab ─────────────────────────────────────────────── */}
      {activeTab === "Performance" && (
        <div className="space-y-6">
          {!kpi ? (
            <p className="text-sm text-secondary-foreground">
              No KPI data available yet. Performance data is collected once the teacher
              starts teaching.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Avg Attendance",
                    value: `${kpi.avgAttendance}%`,
                    good: kpi.avgAttendance >= 80,
                    warn: kpi.avgAttendance >= 70,
                  },
                  {
                    label: "Feedback Score",
                    value: `${kpi.feedbackScore} / 5`,
                    good: kpi.feedbackScore >= 4.0,
                    warn: kpi.feedbackScore >= 3.5,
                  },
                  {
                    label: "Q&A SLA",
                    value: `${kpi.qaSLAPercent}%`,
                    good: kpi.qaSLAPercent >= 80,
                    warn: kpi.qaSLAPercent >= 65,
                  },
                  {
                    label: "AQAD First-Pass",
                    value: `${kpi.aqadFirstPassRate}%`,
                    good: kpi.aqadFirstPassRate >= 80,
                    warn: kpi.aqadFirstPassRate >= 60,
                  },
                ].map(({ label, value, good, warn }) => (
                  <div
                    key={label}
                    className={`rounded-lg border p-5 ${
                      good
                        ? "border-[#dcfce7] bg-[#f0fdf4]"
                        : warn
                          ? "border-[#fef3c7] bg-[#fffbeb]"
                          : "border-[#fee2e2] bg-[#fff5f5]"
                    }`}
                  >
                    <p className="text-xs text-secondary-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                    {kpi.prevSemesterScore !== null && (
                      <p className="mt-0.5 text-xs text-secondary-foreground">
                        Overall: {kpi.overallScore} (prev: {kpi.prevSemesterScore})
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <SectionCard title="Q&A Details">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-secondary-foreground">Avg Response Time</p>
                    <p className="mt-1 text-xl font-bold">
                      {kpi.qaAvgResponseHours}h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-foreground">SLA % (≤24h)</p>
                    <p className="mt-1 text-xl font-bold">{kpi.qaSLAPercent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-foreground">Unanswered</p>
                    <p
                      className={`mt-1 text-xl font-bold ${
                        kpi.qaUnanswered > 5 ? "text-[#dc2626]" : ""
                      }`}
                    >
                      {kpi.qaUnanswered}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      )}

      {/* ── Access Tab ──────────────────────────────────────────────────── */}
      {activeTab === "Access" && (
        <div>
          <div className="mb-4 flex justify-end">
            <Link
              href="/resource/access"
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              <KeyRound className="h-4 w-4" />
              Grant Access
            </Link>
          </div>
          {accessList.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              No access entries. Access is granted automatically when an assignment is
              created.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary">
                    <th className="px-4 py-2.5 text-left font-medium">Course</th>
                    <th className="px-4 py-2.5 text-left font-medium">Level</th>
                    <th className="px-4 py-2.5 text-left font-medium">Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Expiry</th>
                    <th className="px-4 py-2.5 text-left font-medium">Granted</th>
                    <th className="px-4 py-2.5 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accessList.map((a) => (
                    <tr key={a.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{a.courseName}</p>
                        <p className="text-xs text-secondary-foreground">{a.courseCode}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.level} />
                      </td>
                      <td className="px-4 py-3 text-secondary-foreground">{a.type}</td>
                      <td className="px-4 py-3 text-xs text-secondary-foreground">
                        {a.expiryDate ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-secondary-foreground">
                        {a.grantedAt}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs font-medium text-[#dc2626] underline hover:opacity-80">
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
