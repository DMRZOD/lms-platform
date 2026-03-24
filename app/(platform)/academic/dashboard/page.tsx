"use client";

import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  Users,
  UserCheck,
} from "lucide-react";
import { AlertBanner } from "@/components/academic/alert-banner";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { CountdownBadge } from "@/components/academic/countdown-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAcademicStats,
  mockAdmissionApplicants,
  mockDashboardAlerts,
  mockExceptions,
  mockPerformanceRecords,
} from "@/constants/academic-mock-data";

export default function AcademicDashboardPage() {
  const pendingApplicants = mockAdmissionApplicants
    .filter((a) => a.docStatus === "DocsPending" || a.docStatus === "DocsInReview")
    .slice(0, 5);

  const atRiskStudents = mockPerformanceRecords
    .filter((p) => p.atRisk)
    .slice(0, 4);

  const activeExceptions = mockExceptions
    .filter((e) => e.status === "Active")
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Academic Department"
        description="Spring 2026 · Last sync: today at 08:30"
      />

      {/* Alerts */}
      <div className="mb-6 space-y-2">
        {mockDashboardAlerts.map((alert) => (
          <AlertBanner
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            actionHref={alert.actionHref}
            actionLabel={alert.actionLabel}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Programs"
          value={mockAcademicStats.totalPrograms}
          icon={BookOpen}
          subtitle="5 active, 1 draft"
        />
        <StatCard
          label="Active Groups"
          value={mockAcademicStats.activeGroups}
          icon={Users}
          subtitle="Spring 2026"
        />
        <StatCard
          label="Total Students"
          value={mockAcademicStats.totalStudents.toLocaleString()}
          icon={UserCheck}
          subtitle={`${mockAcademicStats.onProbation} on probation`}
          accent={mockAcademicStats.onProbation > 5 ? "warning" : "default"}
        />
        <StatCard
          label="At-Risk Students"
          value={mockAcademicStats.atRiskStudents}
          icon={AlertCircle}
          subtitle="Need intervention"
          accent="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column – main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Admission Queue */}
          <SectionCard
            title="Admission Queue"
            action={
              <Link href="/academic/admissions" className="text-sm text-secondary-foreground hover:text-foreground">
                View all ({mockAcademicStats.pendingAdmissions}) →
              </Link>
            }
          >
            <div className="space-y-2">
              {pendingApplicants.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{app.applicantName}</p>
                    <p className="text-xs text-secondary-foreground">
                      {app.programName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-secondary-foreground">
                      {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <StatusBadge status={app.docStatus} />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/academic/admissions"
              className="mt-3 block rounded-md border border-border py-2 text-center text-sm font-medium text-foreground hover:bg-secondary"
            >
              Review All Applications
            </Link>
          </SectionCard>

          {/* Active Exceptions */}
          <SectionCard
            title="Active Exceptions"
            action={
              <Link href="/academic/exceptions" className="text-sm text-secondary-foreground hover:text-foreground">
                View all ({mockAcademicStats.activeExceptions}) →
              </Link>
            }
          >
            <div className="space-y-2">
              {activeExceptions.map((exc) => (
                <div
                  key={exc.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{exc.studentName}</p>
                    <p className="text-xs text-secondary-foreground">
                      {exc.reasonCode.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={exc.type} />
                    <CountdownBadge expiresAt={exc.expiresAt} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right column – sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Review Admissions", href: "/academic/admissions", icon: UserCheck },
                { label: "Sync Schedule", href: "/academic/schedules", icon: RefreshCw },
                { label: "New Program", href: "/academic/programs/create", icon: BookOpen },
                { label: "New Group", href: "/academic/groups/create", icon: Users },
                { label: "Grant Exception", href: "/academic/exceptions", icon: CheckCircle2 },
                { label: "Exam Eligibility", href: "/academic/exam-eligibility", icon: ClipboardCheck },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center transition-colors hover:bg-secondary"
                >
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* At-Risk Students */}
          <SectionCard
            title="At-Risk Students"
            action={
              <Link href="/academic/performance" className="text-sm text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            <div className="space-y-2">
              {atRiskStudents.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.studentName}</p>
                    <p className="text-xs text-secondary-foreground">
                      {s.groupName} · GPA {s.gpa.toFixed(1)}
                    </p>
                  </div>
                  <StatusBadge status={s.standing} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Schedule Sync */}
          <SectionCard
            title="Schedule Sync"
            action={
              <Link href="/academic/schedules" className="text-sm text-secondary-foreground hover:text-foreground">
                Manage →
              </Link>
            }
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Last sync</span>
                <span className="font-medium">Today 08:30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Conflicts</span>
                <span className="font-medium text-[#dc2626]">
                  {mockAcademicStats.scheduleConflicts} unresolved
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Semester</span>
                <span className="font-medium">Spring 2026</span>
              </div>
              <Link
                href="/academic/schedules"
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
              >
                <Calendar className="h-3.5 w-3.5" />
                View Schedule
              </Link>
            </div>
          </SectionCard>

          {/* Performance Overview */}
          <SectionCard
            title="Performance"
            action={
              <Link href="/academic/performance" className="text-sm text-secondary-foreground hover:text-foreground">
                Details →
              </Link>
            }
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">At-risk</span>
                <span className="font-medium text-[#dc2626]">{mockAcademicStats.atRiskStudents} students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">On probation</span>
                <span className="font-medium text-[#d97706]">{mockAcademicStats.onProbation} students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Upcoming exams</span>
                <span className="font-medium">{mockAcademicStats.upcomingExams}</span>
              </div>
              <Link
                href="/academic/performance"
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                View Performance
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
