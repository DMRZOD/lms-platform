"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { EmptyState } from "@/components/teacher/empty-state";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiCourse } from "@/lib/teacher-api";
import { BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";

const STATUS_FILTERS = [
  { label: "All",        value: "" },
  { label: "Draft",      value: "DRAFT" },
  { label: "In Review",  value: "IN_REVIEW" },
  { label: "Approved",   value: "APPROVED" },
  { label: "Published",  value: "PUBLISHED" },
  { label: "Rejected",   value: "REJECTED" },
  { label: "Archived",   value: "ARCHIVED" },
];

function getStatusClass(status: string) {
  if (status === "PUBLISHED") return "bg-[#dcfce7] text-[#166534]";
  if (status === "APPROVED")  return "bg-[#dbeafe] text-[#1d4ed8]";
  if (status === "IN_REVIEW") return "bg-[#fef9c3] text-[#854d0e]";
  if (status === "REJECTED")  return "bg-[#fee2e2] text-[#991b1b]";
  return "bg-[#f0f0f0] text-[#666]";
}

export default function CoursesPage() {
  const [courses, setCourses]           = useState<ApiCourse[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherApi.getCourses({
        search: search || undefined,
        status: activeStatus || undefined,
      });
      const arr = Array.isArray(data) ? data : data.content ?? [];
      setCourses(arr);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [search, activeStatus]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchCourses} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <PageHeader
              title="My Courses"
              description={loading ? "Loading..." : `${courses.length} courses`}
          />
          <Link
              href="/teacher/courses/create"
              className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New Course
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
            <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-foreground"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
              <button
                  key={f.value}
                  onClick={() => setActiveStatus(f.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      activeStatus === f.value
                          ? "bg-foreground text-background"
                          : "border border-border bg-background hover:bg-secondary"
                  }`}
              >
                {f.label}
              </button>
          ))}
        </div>

        {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : courses.length === 0 ? (
            <EmptyState
                icon={BookOpen}
                title="No courses found"
                description={
                  activeStatus || search
                      ? "Try adjusting your filters."
                      : "Create your first course to get started."
                }
                action={
                  !activeStatus && !search ? (
                      <Link
                          href="/teacher/courses/create"
                          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                      >
                        Create Course
                      </Link>
                  ) : undefined
                }
            />
        ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                  <Link
                      key={course.id}
                      href={`/teacher/courses/${course.id}`}
                      className="rounded-lg border border-border bg-background p-5 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight line-clamp-2">{course.title}</h3>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(course.status)}`}>
                  {course.status.replace("_", " ")}
                </span>
                    </div>
                    {course.description && (
                        <p className="mb-3 text-sm text-secondary-foreground line-clamp-2">
                          {course.description}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary-foreground">
                      {course.language && <span>🌐 {course.language}</span>}
                      {course.level    && <span>📊 {course.level}</span>}
                      <span>v{course.version}</span>
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}