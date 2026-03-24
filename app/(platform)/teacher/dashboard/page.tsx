"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { StatCard } from "@/components/teacher/stat-card";
import {
  mockCorrectiveActions,
  mockCourses,
  mockLectures,
  mockNotifications,
  mockQAQuestions,
  mockSubmissions,
  mockTeacherProfile,
} from "@/constants/teacher-mock-data";
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  ClipboardCheck,
  MessageSquare,
  Plus,
  TrendingUp,
  UserCheck,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split("T")[0];

export default function TeacherDashboardPage() {
  const profile = mockTeacherProfile;
  const [notifications, setNotifications] = useState(mockNotifications);

  const upcomingLectures = mockLectures
    .filter((l) => l.date === today || l.date === tomorrow || l.status === "live")
    .sort((a, b) => a.date.localeCompare(b.date));

  const unansweredQuestions = mockQAQuestions.filter((q) => q.status === "open");
  const pendingSubmissions = mockSubmissions.filter((s) => s.status === "submitted" || s.status === "late");

  const unreadNotifications = notifications.filter((n) => !n.read);

  const courseStatusCounts = mockCourses.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const urgentCorrectiveActions = mockCorrectiveActions.filter(
    (ca) => ca.status !== "completed",
  );

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageHeader
            title={`Welcome back, ${profile.name.split(" ").slice(-1)[0]}`}
            description={`${profile.title} · ${profile.department}`}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Active Courses"
          value={mockCourses.filter((c) => c.status === "Published").length}
          icon={BookOpen}
          subtitle="Published this semester"
        />
        <StatCard
          label="Total Students"
          value={mockCourses.reduce((s, c) => s + c.totalStudents, 0)}
          icon={UserCheck}
          subtitle="Across all courses"
        />
        <StatCard
          label="Avg Attendance"
          value={`${profile.kpi.avgAttendance}%`}
          icon={TrendingUp}
          subtitle="This semester"
          accent={profile.kpi.avgAttendance < 75 ? "warning" : "default"}
        />
        <StatCard
          label="Pending Grading"
          value={pendingSubmissions.length}
          icon={ClipboardCheck}
          subtitle="Submissions awaiting review"
          accent={pendingSubmissions.length > 10 ? "warning" : "default"}
        />
      </div>

      {/* Alerts */}
      {urgentCorrectiveActions.length > 0 && (
        <div className="mb-6 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ef4444]" />
            <div>
              <p className="text-sm font-semibold text-[#991b1b]">
                {urgentCorrectiveActions.length} corrective action
                {urgentCorrectiveActions.length > 1 ? "s" : ""} require attention
              </p>
              <ul className="mt-1 space-y-1">
                {urgentCorrectiveActions.map((ca) => (
                  <li key={ca.id} className="text-xs text-[#b91c1c]">
                    <span className="font-medium">{ca.courseName}:</span> {ca.description}
                    {" — "}
                    <span className="font-medium">deadline {ca.deadline}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/teacher/aqad-feedback"
                className="mt-2 inline-block text-xs font-medium text-[#991b1b] underline underline-offset-2"
              >
                View AQAD Feedback →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Lectures */}
        <SectionCard
          title="Today & Tomorrow"
          className="lg:col-span-2"
          action={
            <Link href="/teacher/schedule" className="text-secondary-foreground hover:text-foreground">
              Full schedule →
            </Link>
          }
        >
          {upcomingLectures.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No lectures today or tomorrow</p>
          ) : (
            <div className="space-y-3">
              {upcomingLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded bg-secondary p-1.5">
                      <Video className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{lecture.topic}</p>
                      <p className="text-xs text-secondary-foreground">
                        {lecture.courseCode} · {lecture.group} · {lecture.date} {lecture.startTime}–{lecture.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lecture.status === "live" && (
                      <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs font-medium text-[#166534]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
                        Live
                      </span>
                    )}
                    {(lecture.status === "live" || lecture.status === "scheduled") && lecture.teamsLink && (
                      <a
                        href={lecture.teamsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8]"
                      >
                        {lecture.status === "live" ? "Join" : "Start in Teams"}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/teacher/courses/create"
              className="flex flex-col items-center gap-1.5 rounded-md border border-border p-3 text-center hover:bg-secondary"
            >
              <Plus className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-medium">New Course</span>
            </Link>
            <Link
              href="/teacher/gradebook"
              className="flex flex-col items-center gap-1.5 rounded-md border border-border p-3 text-center hover:bg-secondary"
            >
              <ClipboardCheck className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-medium">Grade Work</span>
            </Link>
            <Link
              href="/teacher/qa"
              className="flex flex-col items-center gap-1.5 rounded-md border border-border p-3 text-center hover:bg-secondary"
            >
              <MessageSquare className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-medium">Answer Q&A</span>
            </Link>
            <Link
              href="/teacher/assignments"
              className="flex flex-col items-center gap-1.5 rounded-md border border-border p-3 text-center hover:bg-secondary"
            >
              <CheckSquare className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-medium">Assignments</span>
            </Link>
          </div>
        </SectionCard>

        {/* Pending Grading */}
        <SectionCard
          title="Pending Grading"
          action={
            <Link href="/teacher/gradebook" className="text-secondary-foreground hover:text-foreground">
              Go to Gradebook →
            </Link>
          }
        >
          {pendingSubmissions.length === 0 ? (
            <p className="text-sm text-secondary-foreground">All caught up!</p>
          ) : (
            <div className="space-y-2">
              <p className="text-3xl font-bold">{pendingSubmissions.length}</p>
              <p className="text-sm text-secondary-foreground">submissions awaiting review</p>
              <div className="mt-3 space-y-1.5">
                {pendingSubmissions.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-secondary-foreground">{s.studentName}</span>
                    <span
                      className={
                        s.status === "late"
                          ? "rounded-full bg-[#fee2e2] px-2 py-0.5 text-[#991b1b]"
                          : "rounded-full bg-[#dbeafe] px-2 py-0.5 text-[#1d4ed8]"
                      }
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Unanswered Q&A */}
        <SectionCard
          title="Unanswered Questions"
          action={
            <Link href="/teacher/qa" className="text-secondary-foreground hover:text-foreground">
              View all →
            </Link>
          }
        >
          {unansweredQuestions.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No open questions</p>
          ) : (
            <div className="space-y-2">
              <p className="text-3xl font-bold">{unansweredQuestions.length}</p>
              <p className="text-sm text-secondary-foreground">questions need your response</p>
              <div className="mt-3 space-y-2">
                {unansweredQuestions.slice(0, 2).map((q) => (
                  <div key={q.id} className="rounded-md border border-border p-2">
                    <p className="text-xs font-medium line-clamp-1">{q.title}</p>
                    <p className="mt-0.5 text-xs text-secondary-foreground">
                      {q.courseName} · {q.authorName}
                    </p>
                    {q.slaBreached && (
                      <span className="mt-1 inline-block rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#991b1b]">
                        SLA breached
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Course Status Summary */}
        <SectionCard
          title="Course Status"
          action={
            <Link href="/teacher/courses" className="text-secondary-foreground hover:text-foreground">
              All courses →
            </Link>
          }
        >
          <div className="space-y-2">
            {(
              [
                ["Draft", "bg-[#f0f0f0] text-[#666666]"],
                ["InReview", "bg-[#fef9c3] text-[#854d0e]"],
                ["Approved", "bg-[#dbeafe] text-[#1d4ed8]"],
                ["Published", "bg-[#dcfce7] text-[#166534]"],
                ["Rejected", "bg-[#fee2e2] text-[#991b1b]"],
              ] as [string, string][]
            ).map(([status, cls]) => {
              const count = courseStatusCounts[status] ?? 0;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
                    {status === "InReview" ? "In Review" : status}
                  </span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard
          title="Notifications"
          className="lg:col-span-2"
          action={
            unreadNotifications.length > 0 ? (
              <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs font-medium text-[#991b1b]">
                {unreadNotifications.length} unread
              </span>
            ) : undefined
          }
        >
          {notifications.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No notifications</p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start justify-between gap-3 rounded-md p-3 ${
                    !notif.read ? "bg-secondary" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-secondary-foreground">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="flex-shrink-0 text-xs text-secondary-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
