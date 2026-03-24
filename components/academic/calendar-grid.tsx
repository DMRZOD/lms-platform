"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { ScheduleEntry } from "@/types/academic";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 – 17:00

const eventColors: Record<string, string> = {
  Synced: "bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]",
  ManualOverride: "bg-[#ede9fe] border-[#c4b5fd] text-[#6d28d9]",
  Conflict: "bg-[#fee2e2] border-[#fca5a5] text-[#991b1b]",
  PendingSync: "bg-[#fef3c7] border-[#fcd34d] text-[#92400e]",
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

type CalendarGridProps = {
  entries: ScheduleEntry[];
  className?: string;
};

export function CalendarGrid({ entries, className }: CalendarGridProps) {
  const SLOT_HEIGHT = 56; // px per hour
  const START_HOUR = 8;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div
        className="grid min-w-[700px]"
        style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}
      >
        {/* Header row */}
        <div className="border-b border-border" />
        {DAYS.map((day) => (
          <div
            key={day}
            className="border-b border-l border-border px-2 py-2 text-center text-xs font-medium text-secondary-foreground"
          >
            {day}
          </div>
        ))}

        {/* Time slots */}
        {HOURS.map((hour) => (
          <Fragment key={`hour-${hour}`}>
            <div
              className="border-b border-border pr-2 pt-1 text-right text-xs text-secondary-foreground"
              style={{ height: SLOT_HEIGHT }}
            >
              {hour}:00
            </div>
            {DAYS.map((_, dayIdx) => (
              <div
                key={`slot-${hour}-${dayIdx}`}
                className="relative border-b border-l border-border"
                style={{ height: SLOT_HEIGHT }}
              />
            ))}
          </Fragment>
        ))}
      </div>

      {/* Events overlay */}
      <div
        className="relative -mt-[${HOURS.length * SLOT_HEIGHT}px] pointer-events-none min-w-[700px]"
        style={{
          marginTop: -(HOURS.length * SLOT_HEIGHT + 34),
          height: HOURS.length * SLOT_HEIGHT + 34,
        }}
      >
        {/* day header offset */}
        {entries.map((entry) => {
          const dayIdx = entry.dayOfWeek - 1; // 1=Mon
          if (dayIdx < 0 || dayIdx > 4) return null;

          const startMin = timeToMinutes(entry.startTime);
          const endMin = timeToMinutes(entry.endTime);
          const top =
            34 + (startMin - START_HOUR * 60) * (SLOT_HEIGHT / 60);
          const height = (endMin - startMin) * (SLOT_HEIGHT / 60);
          const colWidth = `calc((100% - 60px) / 5)`;
          const left = `calc(60px + ${dayIdx} * ${colWidth})`;

          const colorClass =
            eventColors[entry.syncStatus] ?? eventColors["Synced"];

          return (
            <div
              key={entry.id}
              className={cn(
                "pointer-events-auto absolute rounded border p-1.5 text-xs",
                colorClass,
              )}
              style={{
                top,
                height: Math.max(height, 28),
                left,
                width: colWidth,
                padding: "4px 6px",
                zIndex: 10,
              }}
            >
              <p className="truncate font-medium leading-tight">
                {entry.courseName}
              </p>
              <p className="truncate leading-tight opacity-80">
                {entry.teacherName}
              </p>
              <p className="truncate leading-tight opacity-70">
                {entry.room} · {entry.startTime}–{entry.endTime}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
