"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { StatCard } from "@/components/student/stat-card";
import { SectionCard } from "@/components/student/section-card";
import { studentApi } from "@/lib/student-api";
import type { ApiAssignment, ApiCourse } from "@/lib/student-api";
import { FileText, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS = [
  { label: "All",       value: "all" },
  { label: "Upcoming",  value: "upcoming" },
  { label: "Published", value: "PUBLISHED" },
];

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED:   "bg-[#dcfce7] text-[#166534]",
  DRAFT:       "bg-[#f0f0f0] text-[#666]",
  CLOSED:      "bg-[#fee2e2] text-[#991b1b]",
};

function formatDue(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / 86400000);
  if (days < 0)  return { label: "Overdue",      color: "text-red-600" };
  if (days === 0) return { label: "Due today",   color: "text-amber-600" };
  if (days === 1) return { label: "Due tomorrow", color: "text-amber-500" };
  return {
    label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    color: "text-secondary-foreground",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [courses, setCourses]         = useState<ApiCourse[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]           = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get enrolled courses first
      const coursesData = await studentApi.getCourses();
      const arr: ApiCourse[] = Array.isArray(coursesData)
          ? coursesData
          : (coursesData as { content: ApiCourse[] }).content ?? [];
      setCourses(arr);

      // Fetch published assignments for each course
      const results = await Promise.allSettled(
          arr.map((c) => studentApi.getPublishedAssignments(c.id))
      );

      const all: ApiAssignment[] = [];
      results.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          const data = Array.isArray(res.value) ? res.value : [];
          data.forEach((a) => {
            all.push({
              ...a,
              courseTitle: a.courseTitle ?? arr[idx].title,
            });
          });
        }
      });

      // Sort by due date
      all.sort((a, b) =>
          new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime()
      );
      setAssignments(all);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const now = new Date();

  const filtered = assignments.filter((a) => {
    const isUpcoming = a.dueDate ? new Date(a.dueDate) > now : false;
    if (activeFilter === "upcoming"  && !isUpcoming)         return false;
    if (activeFilter === "PUBLISHED" && a.status !== "PUBLISHED") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
          a.title.toLowerCase().includes(q) ||
          (a.courseTitle ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const upcomingCount = assignments.filter((a) => a.dueDate && new Date(a.dueDate) > now).length;
  const overdueCount  = assignments.filter((a) => a.dueDate && new Date(a.dueDate) < now).length;

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchData} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <PageHeader title="Assignments" description="Track all your assignments and deadlines" />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total"    value={loading ? "—" : String(assignments.length)} icon={FileText} />
          <StatCard label="Upcoming" value={loading ? "—" : String(upcomingCount)}       icon={FileText} subtitle="Not yet due" />
          <StatCard label="Overdue"  value={loading ? "—" : String(overdueCount)}        icon={FileText} subtitle="Past deadline" />
        </div>

        <FilterBar
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search assignments..."
        />

        {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : filtered.length === 0 ? (
            <EmptyState icon={FileText} title="No assignments found" description="Try adjusting your filters." />
        ) : (
            <div className="space-y-3">
              {filtered.map((a) => {
                const due = a.dueDate ? formatDue(a.dueDate) : null;
                return (
                    <Link
                        key={a.id}
                        href={`/student/assignments/${a.id}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{a.title}</p>
                          {a.status && (
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[a.status] ?? "bg-secondary text-foreground"}`}>
                        {a.status}
                      </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-secondary-foreground">{a.courseTitle}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 ml-4">
                        {due && (
                            <div className={`flex items-center gap-1 text-xs ${due.color}`}>
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{due.label}</span>
                            </div>
                        )}
                        {a.maxScore !== undefined && (
                            <span className="text-xs text-secondary-foreground">{a.maxScore} pts</span>
                        )}
                        <ChevronRight className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </Link>
                );
              })}
            </div>
        )}
      </div>
  );
}
