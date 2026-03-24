"use client";

import { PageHeader } from "@/components/platform/page-header";
import { CourseStatusBadge } from "@/components/teacher/course-status-badge";
import { EmptyState } from "@/components/teacher/empty-state";
import { mockCourses } from "@/constants/teacher-mock-data";
import type { CourseStatus } from "@/types/teacher";
import { BookOpen, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "Draft" },
  { label: "In Review", value: "InReview" },
  { label: "Approved", value: "Approved" },
  { label: "Published", value: "Published" },
  { label: "Rejected", value: "Rejected" },
];

export default function TeacherCoursesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const filtered = mockCourses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === "all" || c.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="My Courses" description="Manage your course catalog" />
        <Link
          href="/teacher/courses/create"
          className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeStatus === tab.value
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your filters or create a new course"
          action={
            <Link
              href="/teacher/courses/create"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Create Course
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <Link
              key={course.id}
              href={`/teacher/courses/${course.id}`}
              className="group rounded-lg border border-border bg-background p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-secondary-foreground">{course.code}</p>
                  <h3 className="mt-0.5 font-semibold leading-tight group-hover:underline">
                    {course.name}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <CourseStatusBadge status={course.status as CourseStatus} />
                  {course.status === "Rejected" && course.aqadRemarks && course.aqadRemarks > 0 && (
                    <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#991b1b]">
                      {course.aqadRemarks} remark{course.aqadRemarks > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              <p className="mb-4 text-xs text-secondary-foreground line-clamp-2">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-secondary p-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-secondary-foreground" />
                    <span className="text-xs text-secondary-foreground">Students</span>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold">{course.totalStudents}</p>
                </div>
                <div className="rounded-md bg-secondary p-2">
                  <p className="text-xs text-secondary-foreground">Lectures</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {course.completedLectures}/{course.totalLectures}
                  </p>
                </div>
                {course.status === "Published" && (
                  <>
                    <div className="rounded-md bg-secondary p-2">
                      <p className="text-xs text-secondary-foreground">Attendance</p>
                      <p
                        className={`mt-0.5 text-sm font-semibold ${
                          course.avgAttendance < 75 ? "text-[#ef4444]" : ""
                        }`}
                      >
                        {course.avgAttendance}%
                      </p>
                    </div>
                    <div className="rounded-md bg-secondary p-2">
                      <p className="text-xs text-secondary-foreground">Avg Grade</p>
                      <p className="mt-0.5 text-sm font-semibold">{course.avgGrade}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-secondary-foreground">
                <span>Semester {course.semester}</span>
                <span>{course.credits} credits · {course.language}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
