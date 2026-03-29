"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { StatCard } from "@/components/teacher/stat-card";
import {
  mockCorrectiveActions,
  mockLectures,
  mockNotifications,
  mockQAQuestions,
  mockSubmissions,
} from "@/constants/teacher-mock-data";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiUserProfile, ApiCourse } from "@/lib/teacher-api";
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
import { useState as useLocalState } from "react";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split("T")[0];

export default function TeacherDashboardPage() {
  const [profile, setProfile]   = useState<ApiUserProfile | null>(null);
  const [courses, setCourses]   = useState<ApiCourse[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notifications, setNotifications] = useLocalState(mockNotifications);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, coursesRes] = await Promise.allSettled([
        teacherApi.getProfile(),
        teacherApi.getCourses(),
      ]);
      if (profileRes.status === "fulfilled") setProfile(profileRes.value);
      if (coursesRes.status === "fulfilled") {
        const data = coursesRes.value;
        setCourses(Array.isArray(data) ? data : data.content ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const firstName = profile ? profile.firstName : "Teacher";

  const upcomingLectures = mockLectures
      .filter((l) => l.date === today || l.date === tomorrow || l.status === "live")
      .sort((a, b) => a.date.localeCompare(b.date));

  const unansweredQuestions = mockQAQuestions.filter((q) => q.status === "open");
  const pendingSubmissions  = mockSubmissions.filter((s) => s.status === "submitted" || s.status === "late");
  const unreadNotifications = notifications.filter((n) => !n.read);
  const urgentCorrectiveActions = mockCorrectiveActions.filter((ca) => ca.status !== "completed");

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;
  const totalStudents  = 0; // no endpoint for this

  const courseStatusCounts = courses.reduce(
      (acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc; },
      {} as Record<string, number>,
  );

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <PageHeader
              title={loading ? "Welcome back" : `Welcome back, ${firstName}`}
              description="Teacher Dashboard"
          />
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
              label="Active Courses"
              value={loading ? "—" : String(publishedCount)}
              icon={BookOpen}
              subtitle="Published this semester"
          />
          <StatCard
              label="Total Courses"
              value={loading ? "—" : String(courses.length)}
              icon={UserCheck}
              subtitle="All statuses"
          />
          <StatCard
              label="Pending Grading"
              value={String(pendingSubmissions.length)}
              icon={ClipboardCheck}
              subtitle="Submissions awaiting review"
              accent={pendingSubmissions.length > 10 ? "warning" : "default"}
          />
          <StatCard
              label="Open Questions"
              value={String(unansweredQuestions.length)}
              icon={TrendingUp}
              subtitle="Q&A awaiting response"
              accent={unansweredQuestions.length > 0 ? "warning" : "default"}
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

          {/* Course Status Summary */}
          <SectionCard
              title="Course Status"
              action={
                <Link href="/teacher/courses" className="text-secondary-foreground hover:text-foreground">
                  All courses →
                </Link>
              }
          >
            {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 animate-pulse rounded bg-secondary" />
                  ))}
                </div>
            ) : (
                <div className="space-y-2">
                  {(
                      [
                        ["DRAFT",       "bg-[#f0f0f0] text-[#666666]"],
                        ["IN_REVIEW",   "bg-[#fef9c3] text-[#854d0e]"],
                        ["APPROVED",    "bg-[#dbeafe] text-[#1d4ed8]"],
                        ["PUBLISHED",   "bg-[#dcfce7] text-[#166534]"],
                        ["REJECTED",    "bg-[#fee2e2] text-[#991b1b]"],
                        ["ARCHIVED",    "bg-[#f0f0f0] text-[#666666]"],
                      ] as [string, string][]
                  ).map(([status, cls]) => {
                    const count = courseStatusCounts[status] ?? 0;
                    if (count === 0) return null;
                    return (
                        <div key={status} className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
                      {status.replace("_", " ")}
                    </span>
                          <span className="text-sm font-semibold">{count}</span>
                        </div>
                    );
                  })}
                  {courses.length === 0 && (
                      <p className="text-sm text-secondary-foreground">No courses yet</p>
                  )}
                </div>
            )}
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
                          <span className={s.status === "late"
                              ? "rounded-full bg-[#fee2e2] px-2 py-0.5 text-[#991b1b]"
                              : "rounded-full bg-[#dbeafe] px-2 py-0.5 text-[#1d4ed8]"
                          }>
                      {s.status}
                    </span>
                        </div>
                    ))}
                  </div>
                </div>
            )}
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
                          className={`flex items-start justify-between gap-3 rounded-md p-3 ${!notif.read ? "bg-secondary" : ""}`}
                      >
                        <div>
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-secondary-foreground">{notif.message}</p>
                        </div>
                        {!notif.read && (
                            <button
                                onClick={() => handleMarkRead(notif.id)}
                                className="shrink-0 text-xs text-secondary-foreground underline underline-offset-2 hover:text-foreground"
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