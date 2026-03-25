"use client";

import { useState } from "react";
import { ClipboardList, Plus, UserCheck } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { PriorityBadge } from "@/components/aqad/priority-badge";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockAQADMembers, mockCoursesForReview } from "@/constants/aqad-mock-data";
import type { Priority } from "@/types/aqad";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "High Priority", value: "High" },
  { label: "Medium Priority", value: "Medium" },
  { label: "Low Priority", value: "Low" },
  { label: "Initial", value: "Initial" },
  { label: "Resubmission", value: "Resubmission" },
  { label: "Re-Approval", value: "ReApproval" },
];

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SLA_THRESHOLD = 7;

export default function ReviewQueuePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const filtered = mockCoursesForReview.filter((c) => {
    const matchesFilter =
      activeFilter === "all" ||
      c.priority === activeFilter ||
      c.reviewType === activeFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const highCount = mockCoursesForReview.filter((c) => c.priority === "High").length;
  const unassignedCount = mockCoursesForReview.filter((c) => !c.assignedReviewerId).length;
  const overSLA = mockCoursesForReview.filter((c) => c.daysInQueue >= SLA_THRESHOLD).length;

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAll() {
    setSelected(filtered.map((c) => c.id));
  }

  function clearSelection() {
    setSelected([]);
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader
          title="Review Queue"
          description={`${mockCoursesForReview.length} courses awaiting AQAD review`}
        />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total in Queue"
          value={mockCoursesForReview.length}
          icon={ClipboardList}
          subtitle="Awaiting review"
        />
        <StatCard
          label="High Priority"
          value={highCount}
          icon={ClipboardList}
          subtitle="Need urgent attention"
          accent={highCount > 3 ? "danger" : "warning"}
        />
        <StatCard
          label="Unassigned"
          value={unassignedCount}
          icon={UserCheck}
          subtitle="No reviewer assigned"
          accent={unassignedCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Over SLA"
          value={overSLA}
          icon={ClipboardList}
          subtitle={`>${SLA_THRESHOLD} days in queue`}
          accent={overSLA > 0 ? "danger" : "default"}
        />
      </div>

      {/* Bulk toolbar */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border bg-secondary px-4 py-2">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <select className="rounded-md border border-border bg-background px-3 py-1 text-sm focus:outline-none">
            <option value="">Assign reviewer…</option>
            {mockAQADMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.activeReviews} active)
              </option>
            ))}
          </select>
          <button className="rounded-md bg-foreground px-3 py-1 text-sm text-background hover:opacity-90">
            Assign
          </button>
          <button
            onClick={clearSelection}
            className="ml-auto text-sm text-secondary-foreground hover:text-foreground"
          >
            Clear selection
          </button>
        </div>
      )}

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by course, code, teacher…"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No courses found"
          description="Try adjusting your filters or search term."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-3 border-b bg-secondary px-4 py-2.5 text-xs font-medium text-secondary-foreground">
            <input
              type="checkbox"
              checked={selected.length === filtered.length}
              onChange={() =>
                selected.length === filtered.length ? clearSelection() : selectAll()
              }
              className="rounded"
            />
            <span>Course</span>
            <span>Submitted</span>
            <span>Type</span>
            <span>Priority</span>
            <span>Reviewer</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          {filtered.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-secondary/50"
            >
              <input
                type="checkbox"
                checked={selected.includes(course.id)}
                onChange={() => toggleSelect(course.id)}
                className="rounded"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{course.title}</p>
                <p className="text-xs text-secondary-foreground">
                  {course.code} · {course.teacherName} · {course.programName}
                </p>
                {course.daysInQueue >= SLA_THRESHOLD && (
                  <span className="mt-0.5 inline-flex items-center rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#dc2626]">
                    SLA exceeded
                  </span>
                )}
              </div>
              <span className="text-xs text-secondary-foreground whitespace-nowrap">
                {formatDate(course.submittedAt)}
                <br />
                <span className="text-secondary-foreground">{course.daysInQueue}d ago</span>
              </span>
              <StatusBadge status={course.reviewType} />
              <PriorityBadge priority={course.priority as Priority} />
              <div className="min-w-[120px]">
                {assigningId === course.id ? (
                  <select
                    autoFocus
                    onBlur={() => setAssigningId(null)}
                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="">Select reviewer…</option>
                    {mockAQADMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                ) : course.assignedReviewerName ? (
                  <button
                    onClick={() => setAssigningId(course.id)}
                    className="text-xs hover:underline"
                  >
                    {course.assignedReviewerName}
                  </button>
                ) : (
                  <button
                    onClick={() => setAssigningId(course.id)}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-secondary"
                  >
                    <Plus className="h-3 w-3" />
                    Assign
                  </button>
                )}
              </div>
              <Link
                href={`/aqad/review/${course.id}`}
                className="rounded-md bg-foreground px-3 py-1 text-xs text-background hover:opacity-90 whitespace-nowrap"
              >
                Start Review
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
