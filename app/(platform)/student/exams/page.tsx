"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { StatCard } from "@/components/student/stat-card";
import { ExamCard } from "@/components/student/exam-card";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { mockExams, mockStudentProfile } from "@/constants/student-mock-data";
import { ClipboardCheck } from "lucide-react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming_eligible" },
  { label: "Completed", value: "completed" },
];

export default function ExamsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { accessStatus } = mockStudentProfile;

  const filtered = mockExams.filter((e) => {
    let matchesFilter = false;
    if (activeFilter === "all") matchesFilter = true;
    else if (activeFilter === "upcoming_eligible")
      matchesFilter = e.status === "upcoming" || e.status === "eligible" || e.status === "ineligible";
    else matchesFilter = e.status === activeFilter;

    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingCount = mockExams.filter((e) => ["upcoming", "eligible", "ineligible"].includes(e.status)).length;
  const completedCount = mockExams.filter((e) => e.status === "completed").length;
  const completedWithScore = mockExams.filter((e) => e.status === "completed" && e.score !== undefined);
  const avgScore =
    completedWithScore.length > 0
      ? Math.round(completedWithScore.reduce((s, e) => s + (e.score ?? 0), 0) / completedWithScore.length)
      : 0;

  return (
    <div>
      <PageHeader title="Exams" description="Upcoming exams and results" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value={upcomingCount} icon={ClipboardCheck} />
        <StatCard label="Completed" value={completedCount} icon={ClipboardCheck} />
        <StatCard
          label="Average Score"
          value={completedWithScore.length > 0 ? `${avgScore}%` : "—"}
          icon={ClipboardCheck}
        />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search exams..."
      />

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No exams found" description="Try adjusting your filters." />
      ) : (
        <div className="space-y-4">
          {filtered.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              accessStatus={accessStatus}
              showEligibility={exam.status !== "completed"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
