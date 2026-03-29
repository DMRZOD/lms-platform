"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { QuickActionCard } from "@/components/student/quick-action-card";
import {
  mockLectures,
  mockAssignments,
  mockNotifications,
  mockFinancialSummary,
} from "@/constants/student-mock-data";
import { LectureCard } from "@/components/student/lecture-card";
import { AssignmentCard } from "@/components/student/assignment-card";
import { NotificationItem } from "@/components/student/notification-item";
import { BarChart3, BookOpen, Calendar, CreditCard, TrendingUp, UserCheck } from "lucide-react";
import Link from "next/link";
import { useState as useLocalState } from "react";
import { studentApi } from "@/lib/student-api";
import type { ApiUserProfile, ApiStudentProgram, ApiCourse } from "@/lib/student-api";

export default function StudentDashboardPage() {
  const [profile, setProfile]   = useState<ApiUserProfile | null>(null);
  const [program, setProgram]   = useState<ApiStudentProgram | null>(null);
  const [courses, setCourses]   = useState<ApiCourse[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notifications, setNotifications] = useLocalState(mockNotifications);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, programRes, coursesRes] = await Promise.allSettled([
        studentApi.getProfile(),
        studentApi.getProgram(),
        studentApi.getCourses(),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value);
      if (programRes.status === "fulfilled") setProgram(programRes.value);
      if (coursesRes.status === "fulfilled") {
        const data = coursesRes.value;
        setCourses(Array.isArray(data) ? data : (data as { content: ApiCourse[] }).content ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const firstName = profile ? profile.firstName : "Student";
  const accessStatus = (profile?.accessState ?? "ACTIVE") as "Active" | "BlockedByDebt" | "BlockedByFraud" | "SuspendedByAdmin" | "TemporaryOverride";

  const upcomingLectures = mockLectures
      .filter((l) => l.status === "upcoming" || l.status === "live")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);

  const upcomingAssignments = mockAssignments
      .filter((a) => a.status !== "graded" && a.status !== "submitted")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);

  const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 5);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <PageHeader
                title={loading ? "Welcome back" : `Welcome back, ${firstName}`}
                description={program
                    ? `${program.programName} · Semester ${program.semester ?? "—"}`
                    : "Loading your information..."
                }
            />
          </div>
          <StudentStatusBadge status={accessStatus} />
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
              label="Cumulative GPA"
              value={loading ? "—" : String(program?.gpa?.toFixed(2) ?? "—")}
              icon={TrendingUp}
              subtitle={program ? `${program.earnedCredits ?? "—"}/${program.totalCredits ?? "—"} credits` : undefined}
          />
          <StatCard
              label="Enrolled Courses"
              value={loading ? "—" : String(courses.length)}
              icon={BookOpen}
              subtitle="This semester"
          />
          <StatCard
              label="Overall Attendance"
              value="89%"
              icon={UserCheck}
              subtitle="Across all courses"
          />
          {mockFinancialSummary.currentDebt > 0 ? (
              <StatCard
                  label="Outstanding Balance"
                  value={`${mockFinancialSummary.currency} ${mockFinancialSummary.currentDebt.toLocaleString()}`}
                  icon={CreditCard}
                  subtitle={
                    mockFinancialSummary.nextPaymentDate
                        ? `Due ${new Date(mockFinancialSummary.nextPaymentDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}`
                        : undefined
                  }
                  className="border-amber-200"
              />
          ) : (
              <StatCard label="Balance" value="No debt" icon={CreditCard} subtitle="All payments up to date" />
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard
                title="Upcoming Lectures"
                action={
                  <Link href="/student/lectures" className="text-secondary-foreground hover:text-foreground">
                    View all →
                  </Link>
                }
            >
              {upcomingLectures.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No upcoming lectures</p>
              ) : (
                  <div className="space-y-3">
                    {upcomingLectures.map((lecture) => (
                        <LectureCard key={lecture.id} lecture={lecture} />
                    ))}
                  </div>
              )}
            </SectionCard>

            <SectionCard
                title="Upcoming Deadlines"
                action={
                  <Link href="/student/assignments" className="text-secondary-foreground hover:text-foreground">
                    View all →
                  </Link>
                }
            >
              {upcomingAssignments.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No upcoming deadlines</p>
              ) : (
                  <div className="space-y-3">
                    {upcomingAssignments.map((assignment) => (
                        <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                  </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
                title={`Notifications${unreadNotifications.length > 0 ? ` (${unreadNotifications.length})` : ""}`}
                action={
                  <Link href="/student/notifications" className="text-secondary-foreground hover:text-foreground">
                    View all →
                  </Link>
                }
            >
              {unreadNotifications.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">All caught up!</p>
              ) : (
                  <div className="-mx-2 space-y-0.5">
                    {unreadNotifications.map((n) => (
                        <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
                    ))}
                  </div>
              )}
            </SectionCard>

            <SectionCard title="Quick Actions">
              <div className="grid grid-cols-2 gap-2">
                <QuickActionCard icon={BookOpen} title="My Courses" href="/student/courses" />
                <QuickActionCard icon={Calendar} title="Schedule" href="/student/schedule" />
                <QuickActionCard icon={CreditCard} title="Finance" href="/student/finance" />
                <QuickActionCard icon={BarChart3} title="Grades" href="/student/grades" />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
  );
}