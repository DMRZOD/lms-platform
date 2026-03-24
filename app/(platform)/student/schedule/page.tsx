"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { ScheduleCalendar } from "@/components/student/schedule-calendar";
import { mockScheduleEvents } from "@/constants/student-mock-data";
import type { CalendarView, ScheduleEvent } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, MapPin, X } from "lucide-react";
import Link from "next/link";

const eventTypeLabel: Record<string, string> = {
  lecture: "Lecture",
  exam: "Exam",
  assignment_due: "Assignment Due",
  office_hours: "Office Hours",
};

export default function SchedulePage() {
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  return (
    <div>
      <PageHeader title="Schedule" description="Your academic calendar" />

      <ScheduleCalendar
        events={mockScheduleEvents}
        view={view}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onViewChange={setView}
        onEventClick={setSelectedEvent}
      />

      {/* Event details panel */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: selectedEvent.color ?? "#4f46e5" }}
                  />
                  <span className="text-xs font-medium text-secondary-foreground uppercase tracking-wide">
                    {eventTypeLabel[selectedEvent.type] ?? selectedEvent.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
                {selectedEvent.courseName && (
                  <p className="text-sm text-secondary-foreground">{selectedEvent.courseName}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-secondary-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {selectedEvent.startTime}
                {selectedEvent.endTime !== selectedEvent.startTime &&
                  ` – ${selectedEvent.endTime}`}
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedEvent.location}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              {selectedEvent.meetingUrl && (
                <a href={selectedEvent.meetingUrl} target="_blank" rel="noreferrer" className="flex-1">
                  <Button className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" /> Join Meeting
                  </Button>
                </a>
              )}
              {selectedEvent.courseId && selectedEvent.type === "lecture" && (
                <Link href={`/student/lectures`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Lectures
                  </Button>
                </Link>
              )}
              {selectedEvent.type === "exam" && (
                <Link href="/student/exams" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Exams
                  </Button>
                </Link>
              )}
              {selectedEvent.type === "assignment_due" && (
                <Link href="/student/assignments" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Assignments
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
