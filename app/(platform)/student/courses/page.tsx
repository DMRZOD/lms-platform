"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { CourseCard } from "@/components/student/course-card";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { mockCourses, mockStudentProfile } from "@/constants/student-mock-data";
import { isReadOnly } from "@/lib/student-access";
import { BookOpen } from "lucide-react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Upcoming", value: "upcoming" },
];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { accessStatus } = mockStudentProfile;
  const blocked = isReadOnly(accessStatus);

  const filtered = mockCourses.filter((c) => {
    const matchesFilter = activeFilter === "all" || c.status === activeFilter;
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const inProgressCount = mockCourses.filter((c) => c.status === "in_progress").length;
  const completedCount = mockCourses.filter((c) => c.status === "completed").length;
  const avgProgress = Math.round(
    mockCourses.reduce((sum, c) => sum + c.progress, 0) / mockCourses.length,
  );

  return (
    <div>
      <PageHeader title="My Courses" description="All enrolled courses and your progress" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="In Progress" value={inProgressCount} icon={BookOpen} />
        <StatCard label="Completed" value={completedCount} icon={BookOpen} />
        <StatCard label="Average Progress" value={`${avgProgress}%`} icon={BookOpen} />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by name or code..."
      />

      {filtered.length === 0 ? (
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
            <CourseCard key={course.id} course={course} blocked={blocked} />
          ))}
        </div>
      )}
    </div>
  );
}
