"use client";

import type { ScheduleEvent, CalendarView } from "@/types/student";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ScheduleCalendarProps = {
  events: ScheduleEvent[];
  view: CalendarView;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onEventClick?: (event: ScheduleEvent) => void;
};

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
}

function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const days: Date[] = [];
  for (let i = startOffset; i > 0; i--) {
    days.push(addDays(firstDay, -i));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(addDays(lastDay, i));
  }
  return days;
}

function getEventsForDay(date: Date, events: ScheduleEvent[]) {
  const dateStr = date.toISOString().slice(0, 10);
  return events.filter((e) => e.date === dateStr);
}

export function ScheduleCalendar({
  events,
  view,
  currentDate,
  onDateChange,
  onViewChange,
  onEventClick,
}: ScheduleCalendarProps) {
  const today = new Date();

  const navigatePrev = () => {
    if (view === "day") onDateChange(addDays(currentDate, -1));
    else if (view === "week") onDateChange(addDays(currentDate, -7));
    else {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() - 1);
      onDateChange(d);
    }
  };

  const navigateNext = () => {
    if (view === "day") onDateChange(addDays(currentDate, 1));
    else if (view === "week") onDateChange(addDays(currentDate, 7));
    else {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + 1);
      onDateChange(d);
    }
  };

  const periodLabel = (() => {
    if (view === "day") {
      return currentDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }
    if (view === "week") {
      const start = getWeekStart(currentDate);
      const end = addDays(start, 6);
      return `${start.toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })();

  const EventChip = ({ event }: { event: ScheduleEvent }) => (
    <button
      onClick={() => onEventClick?.(event)}
      className="w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium text-white transition-opacity hover:opacity-80"
      style={{ backgroundColor: event.color ?? "#4f46e5" }}
      title={event.title}
    >
      {event.startTime} {event.title}
    </button>
  );

  if (view === "day") {
    const dayEvents = getEventsForDay(currentDate, events);
    return (
      <div>
        <CalendarHeader
          periodLabel={periodLabel}
          onPrev={navigatePrev}
          onNext={navigateNext}
          view={view}
          onViewChange={onViewChange}
          onToday={() => onDateChange(new Date())}
        />
        <div className="rounded-lg border border-border p-4">
          {dayEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-secondary-foreground">No events this day</p>
          ) : (
            <div className="space-y-2">
              {dayEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onEventClick?.(e)}
                  className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary"
                  style={{ borderLeftColor: e.color ?? "#4f46e5", borderLeftWidth: 4 }}
                >
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-secondary-foreground">
                    {e.startTime} – {e.endTime}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "week") {
    const weekStart = getWeekStart(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <div>
        <CalendarHeader
          periodLabel={periodLabel}
          onPrev={navigatePrev}
          onNext={navigateNext}
          view={view}
          onViewChange={onViewChange}
          onToday={() => onDateChange(new Date())}
        />
        <div className="overflow-x-auto">
          <div className="grid min-w-[600px] grid-cols-7 gap-px rounded-lg border border-border bg-border">
            {days.map((day, idx) => {
              const isToday = isSameDay(day, today);
              const dayEvents = getEventsForDay(day, events);
              return (
                <div key={idx} className="min-h-32 bg-background p-2">
                  <p
                    className={cn(
                      "mb-1.5 text-center text-xs font-medium",
                      isToday ? "text-foreground" : "text-secondary-foreground",
                    )}
                  >
                    {dayNames[idx]}
                    <br />
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                        isToday && "bg-foreground text-background",
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </p>
                  <div className="space-y-0.5">
                    {dayEvents.map((e) => (
                      <EventChip key={e.id} event={e} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Month view
  const monthDays = getMonthDays(currentDate);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <CalendarHeader
        periodLabel={periodLabel}
        onPrev={navigatePrev}
        onNext={navigateNext}
        view={view}
        onViewChange={onViewChange}
        onToday={() => onDateChange(new Date())}
      />
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-7 border-b border-border">
            {dayNames.map((d) => (
              <p key={d} className="py-2 text-center text-xs font-medium text-secondary-foreground">
                {d}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px rounded-b-lg border border-t-0 border-border bg-border">
            {monthDays.map((day, idx) => {
              const isToday = isSameDay(day, today);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const dayEvents = getEventsForDay(day, events);

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-20 bg-background p-1",
                    !isCurrentMonth && "opacity-40",
                  )}
                >
                  <p
                    className={cn(
                      "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday && "bg-foreground text-background font-bold",
                    )}
                  >
                    {day.getDate()}
                  </p>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <EventChip key={e.id} event={e} />
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="px-1.5 text-xs text-secondary-foreground">
                        +{dayEvents.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarHeader({
  periodLabel,
  onPrev,
  onNext,
  onToday,
  view,
  onViewChange,
}: {
  periodLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <p className="font-semibold">{periodLabel}</p>
        <button
          onClick={onToday}
          className="rounded-md border border-border px-3 py-1 text-sm hover:bg-secondary"
        >
          Today
        </button>
      </div>
      <div className="flex gap-1">
        {(["day", "week", "month"] as CalendarView[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              view === v
                ? "bg-foreground text-background"
                : "border border-border hover:bg-secondary",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
