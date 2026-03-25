"use client";

import {
  Activity,
  BarChart3,
  CalendarCheck,
  CheckSquare,
  ClipboardList,
  FileBarChart,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AlertBanner } from "@/components/aqad/alert-banner";
import { PriorityBadge } from "@/components/aqad/priority-badge";
import { SectionCard } from "@/components/aqad/section-card";
import { SLAIndicator } from "@/components/aqad/sla-indicator";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAQADAlerts,
  mockAQADMembers,
  mockAQADStats,
  mockAudits,
  mockComplaints,
  mockCorrectiveActions,
  mockCoursesForReview,
} from "@/constants/aqad-mock-data";

const QUICK_ACTIONS = [
  { label: "Review Queue", href: "/aqad/review-queue", icon: ClipboardList },
  { label: "New Complaint", href: "/aqad/complaints", icon: MessageSquareWarning },
  { label: "Schedule Audit", href: "/aqad/audits", icon: CalendarCheck },
  { label: "Corrective Actions", href: "/aqad/corrective-actions", icon: CheckSquare },
  { label: "Monitoring", href: "/aqad/monitoring", icon: Activity },
  { label: "Analytics", href: "/aqad/analytics", icon: BarChart3 },
  { label: "Exams Audit", href: "/aqad/exams-audit", icon: ShieldAlert },
  { label: "Reports", href: "/aqad/reports", icon: FileBarChart },
];

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AQADDashboardPage() {
  const topQueue = [...mockCoursesForReview]
    .sort((a, b) => {
      const p: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
      return p[a.priority] - p[b.priority];
    })
    .slice(0, 5);

  const openComplaints = mockComplaints.filter(
    (c) => c.status === "Submitted" || c.status === "InReview",
  );

  const overdueActions = mockCorrectiveActions.filter((a) => a.status === "Overdue");
  const activeActions = mockCorrectiveActions.filter(
    (a) => a.status === "Issued" || a.status === "InProgress",
  );

  const upcomingAudits = mockAudits.filter((a) => !a.completedAt).slice(0, 4);

  return (
    <div>
      <PageHeader
        title="AQAD Dashboard"
        description="Academic Quality Assurance — Spring 2026"
      />

      {/* Alerts */}
      <div className="mb-6 space-y-2">
        {mockAQADAlerts.map((alert) => (
          <AlertBanner key={alert.id} {...alert} />
        ))}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="In Review"
          value={mockAQADStats.coursesInReview}
          icon={ClipboardList}
          subtitle="Courses awaiting review"
        />
        <StatCard
          label="Compliance Rate"
          value={`${mockAQADStats.complianceRate}%`}
          icon={ShieldCheck}
          subtitle="Spring 2026"
          accent="success"
        />
        <StatCard
          label="Pending Complaints"
          value={mockAQADStats.pendingComplaints}
          icon={MessageSquareWarning}
          subtitle={`${openComplaints.length} open`}
          accent={mockAQADStats.pendingComplaints > 5 ? "warning" : "default"}
        />
        <StatCard
          label="Overdue Actions"
          value={mockAQADStats.overdueActions}
          icon={CheckSquare}
          subtitle={`${activeActions.length} active total`}
          accent={mockAQADStats.overdueActions > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Avg Review Time"
          value={`${mockAQADStats.avgReviewDays}d`}
          icon={Activity}
          subtitle="Days from submit to decision"
        />
        <StatCard
          label="First-Pass Rate"
          value={`${mockAQADStats.firstPassRate}%`}
          icon={ShieldCheck}
          subtitle="Approved on first review"
          accent="success"
        />
        <StatCard
          label="Upcoming Audits"
          value={mockAQADStats.upcomingAudits}
          icon={CalendarCheck}
          subtitle="Next 7 days"
        />
        <StatCard
          label="Active Actions"
          value={activeActions.length}
          icon={CheckSquare}
          subtitle={`${overdueActions.length} overdue`}
          accent={overdueActions.length > 0 ? "warning" : "default"}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Review Queue Widget */}
          <SectionCard
            title="Review Queue"
            action={
              <Link
                href="/aqad/review-queue"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all ({mockCoursesForReview.length}) →
              </Link>
            }
          >
            <div className="space-y-2">
              {topQueue.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    <p className="text-xs text-secondary-foreground">
                      {course.code} · {course.teacherName}
                    </p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <PriorityBadge priority={course.priority} />
                    <StatusBadge status={course.reviewType} />
                    <span className="text-xs text-secondary-foreground">
                      {course.daysInQueue}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/aqad/review-queue"
              className="mt-3 block rounded-md border py-2 text-center text-sm font-medium hover:bg-secondary"
            >
              Open Review Queue
            </Link>
          </SectionCard>

          {/* Open Complaints Widget */}
          <SectionCard
            title="Open Complaints"
            action={
              <Link
                href="/aqad/complaints"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            {openComplaints.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No open complaints.</p>
            ) : (
              <div className="space-y-2">
                {openComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {complaint.id} — {complaint.courseTitle}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {complaint.studentName} ·{" "}
                        {complaint.category.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                    </div>
                    <div className="ml-3 flex shrink-0 items-center gap-2">
                      <PriorityBadge priority={complaint.priority} />
                      <SLAIndicator deadline={complaint.slaDeadline} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right — 1 col */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center hover:bg-secondary"
                >
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Upcoming Audits */}
          <SectionCard
            title="Upcoming Audits"
            action={
              <Link href="/aqad/audits" className="text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            <div className="space-y-2">
              {upcomingAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between py-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{audit.courseTitle}</p>
                    <p className="text-xs text-secondary-foreground">{audit.teacherName}</p>
                  </div>
                  <div className="ml-2 shrink-0 text-right">
                    <p className="text-xs font-medium">{formatDate(audit.scheduledAt)}</p>
                    <StatusBadge status={audit.type} className="mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Corrective Actions Summary */}
          <SectionCard
            title="Corrective Actions"
            action={
              <Link
                href="/aqad/corrective-actions"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
                <span className="text-sm">Active</span>
                <span className="font-semibold">{activeActions.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-[#fee2e2] px-3 py-2">
                <span className="text-sm text-[#dc2626]">Overdue</span>
                <span className="font-semibold text-[#dc2626]">{overdueActions.length}</span>
              </div>
            </div>
          </SectionCard>

          {/* Reviewer Workload */}
          <SectionCard
            title="Team Workload"
            action={
              <Link href="/aqad/team" className="text-secondary-foreground hover:text-foreground">
                View team →
              </Link>
            }
          >
            <div className="space-y-2">
              {mockAQADMembers.slice(0, 4).map((member) => {
                const total =
                  member.activeReviews +
                  member.activeComplaints +
                  member.activeCorrectiveActions;
                return (
                  <div key={member.id} className="flex items-center justify-between">
                    <p className="truncate text-sm">
                      {member.name.split(" ").slice(-1)[0]}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-foreground"
                          style={{ width: `${Math.min((total / 12) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="w-4 text-right text-xs text-secondary-foreground">
                        {total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
