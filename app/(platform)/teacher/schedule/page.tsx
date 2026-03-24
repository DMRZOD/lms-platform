"use client";

import { PageHeader } from "@/components/platform/page-header";
import { LectureStatusBadge } from "@/components/teacher/lecture-status-badge";
import { mockScheduleEvents } from "@/constants/teacher-mock-data";
import type { CalendarView } from "@/types/teacher";
import { Calendar, ChevronLeft, ChevronRight, Clock, Download, Radio } from "lucide-react";
import { useState } from "react";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getWeekDates(referenceDate: Date): Date[] {
  const day = referenceDate.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function SchedulePage() {
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date("2026-03-24"));

  const weekDates = getWeekDates(currentDate);
  const todayStr = formatDate(new Date("2026-03-24"));

  const navigatePrev = () => {
    const d = new Date(currentDate);
    if (view === "day") d.setDate(d.getDate() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const navigateNext = () => {
    const d = new Date(currentDate);
    if (view === "day") d.setDate(d.getDate() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const getEventsForDate = (dateStr: string) =>
    mockScheduleEvents.filter((e) => e.date === dateStr);

  const currentDateStr = formatDate(currentDate);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Schedule"
          description="Your lecture and exam schedule — managed by Academic Department"
        />
        <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary">
          <Download className="h-4 w-4" /> Export iCal
        </button>
      </div>

      <div className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] p-3 mb-6 text-xs text-[#1d4ed8]">
        Your schedule is managed by the Academic Department via aSc. To request changes, contact the Academic Department.
      </div>

      {/* Calendar Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrev}
            className="rounded-md border border-border p-1.5 hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={navigateNext}
            className="rounded-md border border-border p-1.5 hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 font-semibold">
            {view === "week"
              ? `${weekDates[0].getDate()} – ${weekDates[6].getDate()} ${MONTH_NAMES[weekDates[0].getMonth()]} ${weekDates[0].getFullYear()}`
              : view === "day"
                ? `${currentDate.getDate()} ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
        </div>
        <div className="flex gap-1">
          {(["day", "week", "month"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                view === v
                  ? "bg-foreground text-background"
                  : "border border-border bg-background hover:bg-secondary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Day View */}
      {view === "day" && (
        <div className="space-y-3">
          <h3 className="font-semibold">
            {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {getEventsForDate(currentDateStr).length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-secondary-foreground">No events today</p>
            </div>
          ) : (
            getEventsForDate(currentDateStr).map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div className="overflow-x-auto">
          <div className="grid min-w-[700px]" style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}>
            {/* Time column header */}
            <div className="border-b border-border pb-2" />
            {/* Day headers */}
            {weekDates.map((d) => {
              const dateStr = formatDate(d);
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={dateStr}
                  className={`border-b border-border pb-2 text-center ${
                    isToday ? "font-bold text-foreground" : "text-secondary-foreground"
                  }`}
                >
                  <p className="text-xs">{DAYS_OF_WEEK[d.getDay() === 0 ? 6 : d.getDay() - 1]}</p>
                  <p
                    className={`text-lg font-semibold ${
                      isToday
                        ? "mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm"
                        : ""
                    }`}
                  >
                    {d.getDate()}
                  </p>
                </div>
              );
            })}

            {/* Time slots */}
            {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
              <>
                <div
                  key={`time-${hour}`}
                  className="border-t border-border pr-2 pt-1 text-right text-xs text-secondary-foreground"
                >
                  {hour}:00
                </div>
                {weekDates.map((d) => {
                  const dateStr = formatDate(d);
                  const events = getEventsForDate(dateStr).filter((e) => {
                    const startHour = parseInt(e.startTime.split(":")[0]);
                    return startHour === hour;
                  });
                  return (
                    <div
                      key={`${dateStr}-${hour}`}
                      className="min-h-[50px] border-l border-t border-border p-1"
                    >
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`rounded p-1.5 text-xs ${
                            event.status === "live"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#dbeafe] text-[#1d4ed8]"
                          }`}
                        >
                          <p className="font-medium truncate">{event.courseCode}</p>
                          <p className="truncate">{event.startTime}–{event.endTime}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}

      {/* Month View */}
      {view === "month" && (
        <div>
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-secondary-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Get month start */}
            {(() => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              const firstDay = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const startOffset = firstDay === 0 ? 6 : firstDay - 1;
              const cells: React.ReactNode[] = [];

              // Empty cells before month start
              for (let i = 0; i < startOffset; i++) {
                cells.push(<div key={`empty-${i}`} className="h-20" />);
              }

              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const events = getEventsForDate(dateStr);
                const isToday = dateStr === todayStr;

                cells.push(
                  <div
                    key={dateStr}
                    className={`h-20 rounded-md border p-1.5 ${
                      isToday ? "border-foreground" : "border-border"
                    }`}
                  >
                    <p
                      className={`mb-1 text-xs font-medium ${
                        isToday
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background"
                          : ""
                      }`}
                    >
                      {day}
                    </p>
                    <div className="space-y-0.5">
                      {events.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className={`rounded px-1 py-0.5 text-xs truncate ${
                            e.status === "live"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#dbeafe] text-[#1d4ed8]"
                          }`}
                        >
                          {e.courseCode} {e.startTime}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <p className="text-xs text-secondary-foreground">+{events.length - 2} more</p>
                      )}
                    </div>
                  </div>,
                );
              }
              return cells;
            })()}
          </div>
        </div>
      )}

      {/* Upcoming Events List */}
      <div className="mt-8">
        <h2 className="mb-4 font-semibold">Upcoming Events</h2>
        <div className="space-y-3">
          {mockScheduleEvents
            .filter((e) => e.date >= todayStr)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: (typeof mockScheduleEvents)[0] }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded bg-secondary p-1.5">
          <Calendar className="h-4 w-4 text-secondary-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{event.topic}</p>
            <LectureStatusBadge status={event.status} />
          </div>
          <p className="text-sm text-secondary-foreground">
            {event.courseName} ({event.courseCode}) · Group {event.group}
          </p>
          <div className="mt-1 flex items-center gap-3 text-xs text-secondary-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {event.date} · {event.startTime}–{event.endTime}
            </span>
            <span>{event.room}</span>
          </div>
        </div>
      </div>
      {(event.status === "live" || event.status === "scheduled") && event.type === "lecture" && (
        <button className="flex items-center gap-1.5 rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8]">
          <Radio className="h-3.5 w-3.5" />
          {event.status === "live" ? "Join" : "Start"}
        </button>
      )}
    </div>
  );
}
