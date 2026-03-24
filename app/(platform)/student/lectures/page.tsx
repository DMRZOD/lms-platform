"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { StatCard } from "@/components/student/stat-card";
import { LectureCard } from "@/components/student/lecture-card";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { ScheduleCalendar } from "@/components/student/schedule-calendar";
import { mockLectures, mockScheduleEvents, mockCourses } from "@/constants/student-mock-data";
import type { CalendarView } from "@/types/student";
import { Calendar, List, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "Completed", value: "completed" },
  { label: "Missed", value: "missed" },
];

const today = new Date().toISOString().slice(0, 10);

export default function LecturesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarView, setCalendarView] = useState<CalendarView>("week");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const filtered = mockLectures.filter((l) => {
    const matchesFilter = activeFilter === "all" || l.status === activeFilter;
    const matchesCourse = courseFilter === "all" || l.courseId === courseFilter;
    const matchesSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesCourse && matchesSearch;
  });

  const lectureEvents = mockScheduleEvents.filter((e) => e.type === "lecture");
  const todayCount = mockLectures.filter((l) => l.date === today).length;
  const completedCount = mockLectures.filter((l) => l.status === "completed").length;
  const upcomingCount = mockLectures.filter((l) => l.status === "upcoming" || l.status === "live").length;

  // Group by date for list view
  const grouped: Record<string, typeof mockLectures> = {};
  filtered.forEach((l) => {
    if (!grouped[l.date]) grouped[l.date] = [];
    grouped[l.date].push(l);
  });
  const sortedDates = Object.keys(grouped).sort();

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const t = new Date();
    const todayStr = t.toISOString().slice(0, 10);
    const tomorrowStr = new Date(t.setDate(t.getDate() + 1)).toISOString().slice(0, 10);
    if (dateStr === todayStr) return "Today";
    if (dateStr === tomorrowStr) return "Tomorrow";
    return d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  };

  return (
    <div>
      <PageHeader title="Lectures" description="All your lectures across courses" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Today" value={todayCount} icon={Video} />
        <StatCard label="Attended" value={completedCount} icon={Video} />
        <StatCard label="Upcoming" value={upcomingCount} icon={Video} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="all">All courses</option>
          {mockCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              viewMode === "list"
                ? "bg-foreground text-background"
                : "border border-border hover:bg-secondary",
            )}
          >
            <List className="h-4 w-4" /> List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              viewMode === "calendar"
                ? "bg-foreground text-background"
                : "border border-border hover:bg-secondary",
            )}
          >
            <Calendar className="h-4 w-4" /> Calendar
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          <FilterBar
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search lectures..."
          />
          {filtered.length === 0 ? (
            <EmptyState icon={Video} title="No lectures found" description="Try adjusting your filters." />
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateStr) => (
                <div key={dateStr}>
                  <h3 className="mb-3 text-sm font-semibold text-secondary-foreground">
                    {formatDateLabel(dateStr)}
                  </h3>
                  <div className="space-y-3">
                    {grouped[dateStr].map((lecture) => (
                      <LectureCard key={lecture.id} lecture={lecture} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <ScheduleCalendar
          events={lectureEvents}
          view={calendarView}
          currentDate={calendarDate}
          onDateChange={setCalendarDate}
          onViewChange={setCalendarView}
        />
      )}
    </div>
  );
}
