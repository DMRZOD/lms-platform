"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { StatCard } from "@/components/student/stat-card";
import { AssignmentCard } from "@/components/student/assignment-card";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { mockAssignments } from "@/constants/student-mock-data";
import { FileText } from "lucide-react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Submitted", value: "submitted" },
  { label: "Graded", value: "graded" },
  { label: "Overdue", value: "overdue" },
];

const pendingStatuses = new Set(["not_started", "in_progress", "late"]);

export default function AssignmentsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockAssignments.filter((a) => {
    let matchesFilter = false;
    if (activeFilter === "all") matchesFilter = true;
    else if (activeFilter === "pending") matchesFilter = pendingStatuses.has(a.status);
    else matchesFilter = a.status === activeFilter;

    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedAssignments = [...filtered].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  const pendingCount = mockAssignments.filter((a) => pendingStatuses.has(a.status)).length;
  const submittedCount = mockAssignments.filter((a) => a.status === "submitted").length;
  const overdueCount = mockAssignments.filter((a) => a.status === "overdue").length;

  return (
    <div>
      <PageHeader title="Assignments" description="Track all your assignments and deadlines" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={pendingCount} icon={FileText} />
        <StatCard label="Submitted" value={submittedCount} icon={FileText} />
        <StatCard label="Overdue" value={overdueCount} icon={FileText} />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search assignments..."
      />

      {sortedAssignments.length === 0 ? (
        <EmptyState icon={FileText} title="No assignments found" description="Try adjusting your filters." />
      ) : (
        <div className="space-y-3">
          {sortedAssignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      )}
    </div>
  );
}
