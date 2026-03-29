"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { studentApi } from "@/lib/student-api";
import type { ApiCourse } from "@/lib/student-api";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const FILTERS = [
  { label: "All",         value: "all" },
  { label: "Published",   value: "PUBLISHED" },
  { label: "Archived",    value: "ARCHIVED" },
];

export default function CoursesPage() {
  const [courses, setCourses]           = useState<ApiCourse[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]             = useState("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getCourses();
      const arr = Array.isArray(data)
          ? data
          : (data as { content: ApiCourse[] }).content ?? [];
      setCourses(arr);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const filtered = courses.filter((c) => {
    const matchesFilter = activeFilter === "all" || c.status === activeFilter;
    const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <PageHeader title="My Courses" description="All enrolled courses and your progress" />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Courses" value={loading ? "—" : String(courses.length)} icon={BookOpen} />
          <StatCard label="Published"     value={loading ? "—" : String(courses.filter((c) => c.status === "PUBLISHED").length)} icon={BookOpen} />
          <StatCard label="Credits"       value={loading ? "—" : String(courses.reduce((s, c) => s + (c.credits ?? 0), 0))} icon={BookOpen} />
        </div>

        <FilterBar
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search by course name..."
        />

        {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : filtered.length === 0 ? (
            <SectionCard>
              <EmptyState
                  icon={BookOpen}
                  title="No courses found"
                  description="Try adjusting your filters or search query."
              />
            </SectionCard>
        ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((course) => (
                  <Link
                      key={course.id}
                      href={`/student/courses/${course.id}`}
                      className="rounded-lg border border-border bg-background p-5 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight">{course.title}</h3>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          course.status === "PUBLISHED"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#f1f5f9] text-[#475569]"
                      }`}>
                  {course.status}
                </span>
                    </div>
                    {course.description && (
                        <p className="mb-3 text-sm text-secondary-foreground line-clamp-2">
                          {course.description}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary-foreground">
                      {course.teacherName && <span> {course.teacherName}</span>}
                      {course.credits && <span> {course.credits} credits</span>}
                      {course.language && <span> {course.language}</span>}
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}