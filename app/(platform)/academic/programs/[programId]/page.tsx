"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Users } from "lucide-react";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { AuditTrail } from "@/components/academic/audit-trail";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockGroups,
  mockGroupStudents,
  mockProgramCourses,
  mockPrograms,
  mockProgramRules,
} from "@/constants/academic-mock-data";

const TABS = ["Overview", "Structure", "Groups", "Students", "Rules", "Analytics", "History"];

export default function ProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const [activeTab, setActiveTab] = useState("Overview");

  const program = mockPrograms.find((p) => p.id === programId) ?? mockPrograms[0];
  const courses = mockProgramCourses.filter((c) => c.programId === program.id);
  const groups = mockGroups.filter((g) => g.programId === program.id);
  const rules = mockProgramRules.filter((r) => r.programId === program.id);
  const allStudents = mockGroupStudents.filter((s) =>
    groups.some((g) => g.id === s.groupId),
  );

  // Group courses by semester
  const bySemester = courses.reduce<Record<number, typeof courses>>((acc, c) => {
    acc[c.semester] = [...(acc[c.semester] ?? []), c];
    return acc;
  }, {});

  const semesters = Object.keys(bySemester)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div>
      <Link
        href="/academic/programs"
        className="mb-4 flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <p className="font-mono text-sm text-secondary-foreground">{program.code}</p>
            <StatusBadge status={program.status} />
            {program.accredited && (
              <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-medium text-[#16a34a]">
                Accredited
              </span>
            )}
          </div>
          <PageHeader title={program.name} description={`${program.faculty} · ${program.degree} · ${program.language}`} />
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">Edit</button>
          {program.status === "Active" && (
            <button className="rounded-lg border border-[#fca5a5] px-3 py-1.5 text-sm text-[#dc2626] hover:bg-[#fee2e2]">
              Archive
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Groups" value={program.groupCount} icon={Users} />
        <StatCard label="Students" value={program.studentCount} />
        <StatCard label="Credits" value={program.totalCredits} icon={BookOpen} />
        <StatCard label="Duration" value={`${program.durationSemesters / 2} years`} subtitle={`${program.durationSemesters} semesters`} />
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex flex-wrap gap-0 border-b border-border">
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

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SectionCard title="Program Details" className="lg:col-span-2">
            <p className="mb-4 text-sm text-secondary-foreground">{program.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Degree", program.degree],
                ["Language", program.language],
                ["Faculty", program.faculty],
                ["Total Credits", program.totalCredits],
                ["Duration", `${program.durationSemesters} semesters`],
                ["Min Attendance", `${program.minAttendance}%`],
                ["Min Grade", `${program.minGrade}%`],
                ["Accredited", program.accredited ? "Yes" : "No"],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-secondary-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Quick Stats">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-foreground">Active Groups</span>
                <span className="font-medium">{groups.filter((g) => g.status === "Active").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-foreground">Total Courses</span>
                <span className="font-medium">{program.courseCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-foreground">Elective Courses</span>
                <span className="font-medium">{courses.filter((c) => c.isElective).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(program.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Structure */}
      {activeTab === "Structure" && (
        <div className="space-y-6">
          {semesters.map((sem) => (
            <SectionCard key={sem} title={`Semester ${sem}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-secondary-foreground">Code</th>
                      <th className="pb-2 pr-4 font-medium text-secondary-foreground">Course</th>
                      <th className="pb-2 pr-4 font-medium text-secondary-foreground">Credits</th>
                      <th className="pb-2 pr-4 font-medium text-secondary-foreground">Type</th>
                      <th className="pb-2 font-medium text-secondary-foreground">Prerequisites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(bySemester[sem] ?? []).map((course) => {
                      const prereqs = course.prerequisiteIds
                        .map((pid) => courses.find((c) => c.id === pid)?.courseCode)
                        .filter(Boolean);
                      return (
                        <tr key={course.id}>
                          <td className="py-2.5 pr-4 font-mono text-xs">{course.courseCode}</td>
                          <td className="py-2.5 pr-4 font-medium">{course.courseName}</td>
                          <td className="py-2.5 pr-4">{course.credits}</td>
                          <td className="py-2.5 pr-4">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              course.isElective
                                ? "bg-[#ede9fe] text-[#7c3aed]"
                                : "bg-[#dbeafe] text-[#2563eb]"
                            }`}>
                              {course.isElective ? "Elective" : "Mandatory"}
                            </span>
                          </td>
                          <td className="py-2.5 text-secondary-foreground">
                            {prereqs.length > 0 ? prereqs.join(", ") : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-secondary-foreground">No courses defined yet.</p>
          )}
        </div>
      )}

      {/* Groups */}
      {activeTab === "Groups" && (
        <SectionCard title={`Groups (${groups.length})`}>
          {groups.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No groups for this program yet.</p>
          ) : (
            <div className="space-y-2">
              {groups.map((g) => (
                <Link
                  key={g.id}
                  href={`/academic/groups/${g.id}`}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{g.name}</p>
                    <p className="text-xs text-secondary-foreground">
                      {g.code} · Year {g.year} · {g.studentCount} students
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={g.status} />
                    <span className="text-secondary-foreground">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Students */}
      {activeTab === "Students" && (
        <SectionCard title={`All Students (${allStudents.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Student</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Group</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">GPA</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Attendance</th>
                  <th className="pb-3 font-medium text-secondary-foreground">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allStudents.map((s) => {
                  const group = groups.find((g) => g.id === s.groupId);
                  return (
                    <tr key={s.id}>
                      <td className="py-2.5 pr-4 font-medium">{s.studentName}</td>
                      <td className="py-2.5 pr-4 text-secondary-foreground">{group?.code}</td>
                      <td className="py-2.5 pr-4">{s.gpa.toFixed(2)}</td>
                      <td className="py-2.5 pr-4">{s.attendanceRate}%</td>
                      <td className="py-2.5"><StatusBadge status={s.standing} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Rules */}
      {activeTab === "Rules" && (
        <SectionCard title="Program Rules">
          {rules.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No rules configured.</p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{rule.title}</p>
                      <span className="rounded-full bg-[#f4f4f4] px-2 py-0.5 text-xs capitalize text-secondary-foreground">
                        {rule.type}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-secondary-foreground">{rule.description}</p>
                    {rule.threshold !== undefined && (
                      <p className="mt-1 text-xs text-secondary-foreground">
                        Threshold: <strong>{rule.threshold}{rule.type === "attendance" ? "%" : ""}</strong>
                      </p>
                    )}
                  </div>
                  <button className="shrink-0 text-xs text-secondary-foreground hover:text-foreground">Edit</button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Analytics */}
      {activeTab === "Analytics" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SectionCard title="Enrollment by Group">
            <div className="space-y-3">
              {groups.map((g) => (
                <div key={g.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{g.code}</span>
                      <span className="font-medium">{g.studentCount}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-secondary">
                      <div
                        className="h-1.5 rounded-full bg-[#2563eb]"
                        style={{ width: `${(g.studentCount / program.studentCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Program Health">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Mandatory courses</span>
                <span className="font-medium">{courses.filter((c) => !c.isElective).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Elective courses</span>
                <span className="font-medium">{courses.filter((c) => c.isElective).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Active groups</span>
                <span className="font-medium">{groups.filter((g) => g.status === "Active").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Total enrolled</span>
                <span className="font-medium">{program.studentCount}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* History */}
      {activeTab === "History" && (
        <SectionCard title="Version History">
          <AuditTrail
            entries={[
              { id: "h1", exceptionId: program.id, action: "Program Updated", performedBy: "Dr. Academic Head", performedAt: program.updatedAt, details: "Attendance threshold updated to " + program.minAttendance + "%. Elective courses added for Semester 4." },
              { id: "h2", exceptionId: program.id, action: "Program Created", performedBy: "Dr. Academic Head", performedAt: program.createdAt, details: "Initial program structure created with " + program.courseCount + " courses." },
            ]}
          />
        </SectionCard>
      )}
    </div>
  );
}
