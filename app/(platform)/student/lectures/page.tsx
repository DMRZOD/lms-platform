"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { StatCard } from "@/components/student/stat-card";
import { studentApi } from "@/lib/student-api";
import type { ApiLecture, ApiCourse } from "@/lib/student-api";
import { Video, Radio, Play, Calendar } from "lucide-react";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS = [
  { label: "All",       value: "all" },
  { label: "Upcoming",  value: "upcoming" },
  { label: "Live",      value: "live" },
  { label: "Completed", value: "completed" },
];

const STATUS_STYLES: Record<string, { badge: string; icon: string }> = {
  live:      { badge: "bg-red-100 text-red-700",     icon: "text-red-600" },
  upcoming:  { badge: "bg-[#fef9c3] text-[#854d0e]", icon: "text-amber-600" },
  completed: { badge: "bg-[#dcfce7] text-[#166534]", icon: "text-green-600" },
  missed:    { badge: "bg-[#fee2e2] text-[#991b1b]", icon: "text-red-600" },
};

function formatDateLabel(dateStr: string): string {
  const today    = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (dateStr === today)    return "Today";
  if (dateStr === tomorrow) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LecturesPage() {
  const [lectures, setLectures]         = useState<ApiLecture[]>([]);
  const [courses, setCourses]           = useState<ApiCourse[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]             = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coursesRaw = await studentApi.getCourses();
      const arr: ApiCourse[] = Array.isArray(coursesRaw)
          ? coursesRaw
          : (coursesRaw as { content: ApiCourse[] }).content ?? [];
      setCourses(arr);

      // Fetch lectures for each course in parallel
      const results = await Promise.allSettled(
          arr.map((c) => studentApi.getCourseLectures(c.id))
      );

      const all: ApiLecture[] = [];
      results.forEach((res) => {
        if (res.status === "fulfilled") {
          const data = Array.isArray(res.value) ? res.value : [];
          all.push(...data);
        }
      });

      // Sort by date descending
      all.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
      setLectures(all);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lectures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Filtering ──
  const filtered = lectures.filter((l) => {
    if (activeFilter !== "all" && l.status !== activeFilter) return false;
    if (courseFilter !== "all" && String(l.courseId) !== courseFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
          l.title.toLowerCase().includes(q) ||
          (l.description ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Group by date ──
  const grouped: Record<string, ApiLecture[]> = {};
  filtered.forEach((l) => {
    const key = l.date ?? "Unknown date";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(l);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // ── Stats ──
  const today        = new Date().toISOString().slice(0, 10);
  const liveCount    = lectures.filter((l) => l.status === "live").length;
  const todayCount   = lectures.filter((l) => l.date === today).length;
  const upcomingCount = lectures.filter((l) => l.status === "upcoming").length;

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
        <PageHeader title="Lectures" description="All your lectures across courses" />

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Live Now"  value={loading ? "—" : String(liveCount)}     icon={Radio}    subtitle="Currently active" />
          <StatCard label="Today"     value={loading ? "—" : String(todayCount)}    icon={Video}    />
          <StatCard label="Upcoming"  value={loading ? "—" : String(upcomingCount)} icon={Calendar} />
        </div>

        {/* Course filter */}
        <div className="mb-4">
          <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="all">All courses</option>
            {courses.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Status filters + search */}
        <FilterBar
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search lectures..."
        />

        {/* Content */}
        {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                    {[...Array(2)].map((_, j) => (
                        <div key={j} className="h-16 animate-pulse rounded-lg bg-secondary" />
                    ))}
                  </div>
              ))}
            </div>
        ) : filtered.length === 0 ? (
            <EmptyState icon={Video} title="No lectures found" description="Try adjusting your filters." />
        ) : (
            <div className="space-y-6">
              {sortedDates.map((dateStr) => (
                  <div key={dateStr}>
                    <h3 className="mb-3 text-sm font-semibold text-secondary-foreground">
                      {formatDateLabel(dateStr)}
                    </h3>
                    <div className="space-y-2">
                      {grouped[dateStr].map((lecture) => {
                        const isLive  = lecture.status === "live";
                        const style   = STATUS_STYLES[lecture.status ?? ""] ?? STATUS_STYLES["upcoming"];

                        return (
                            <div
                                key={lecture.id}
                                className={`flex items-center justify-between rounded-lg border bg-background px-4 py-3 ${
                                    isLive ? "border-red-200 bg-red-50/20" : "border-border"
                                }`}
                            >
                              {/* Left */}
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    isLive ? "bg-red-100" : "bg-secondary"
                                }`}>
                                  {isLive
                                      ? <Radio className={`h-4 w-4 ${style.icon}`} />
                                      : <Video className={`h-4 w-4 ${style.icon}`} />
                                  }
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{lecture.title}</p>
                                  <p className="text-xs text-secondary-foreground">
                                    {lecture.startTime && lecture.endTime
                                        ? `${lecture.startTime} – ${lecture.endTime}`
                                        : lecture.startTime ?? ""}
                                  </p>
                                </div>
                              </div>

                              {/* Right */}
                              <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                          {isLive ? "LIVE" : (lecture.status ?? "—").replace("_", " ")}
                        </span>

                                {/* Join button */}
                                {isLive && lecture.meetingUrl && (
                                    <a href={lecture.meetingUrl} target="_blank" rel="noreferrer"
                                       className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700">
                                      Join Live
                                    </a>
                                )}
                                {!isLive && lecture.status === "upcoming" && lecture.meetingUrl && (
                                    <a href={lecture.meetingUrl} target="_blank" rel="noreferrer"
                                       className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary">
                                      Join
                                    </a>
                                )}

                                {/* Recording */}
                                {lecture.recordingUrl && (
                                    <a href={lecture.recordingUrl} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary">
                                      <Play className="h-3 w-3" /> Recording
                                    </a>
                                )}

                                {/* View detail */}
                                <Link
                                    href={`/student/lectures/${lecture.id}`}
                                    className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}
