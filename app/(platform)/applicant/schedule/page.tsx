"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/applicant/section-card";
import { StatusBadge } from "@/components/applicant/status-badge";
import { PrepChecklist } from "@/components/applicant/prep-checklist";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockExamSlots,
  mockScheduledExam,
  mockPrepChecklist,
} from "@/constants/applicant-mock-data";
import type { ExamSlot, ScheduledExam } from "@/types/applicant";
import { Calendar, Clock, Users } from "lucide-react";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ApplicantSchedulePage() {
  const [scheduled, setScheduled] = useState<ScheduledExam | null>(
    mockScheduledExam,
  );
  const [slots] = useState<ExamSlot[]>(mockExamSlots);
  const [confirmSlot, setConfirmSlot] = useState<ExamSlot | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleConfirm = () => {
    if (!confirmSlot) return;
    setScheduled({
      id: `exam-${Date.now()}`,
      slotId: confirmSlot.id,
      subject: confirmSlot.subject,
      date: confirmSlot.date,
      startTime: confirmSlot.startTime,
      endTime: confirmSlot.endTime,
      status: isRescheduling ? "rescheduled" : "scheduled",
    });
    setConfirmSlot(null);
    setIsRescheduling(false);
  };

  return (
    <div>
      <PageHeader
        title="Exam Schedule"
        description="Choose a convenient slot for your entrance exam"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current booking */}
        {scheduled && (
          <SectionCard title="Scheduled Exam" className="lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold">{scheduled.subject}</p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(scheduled.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {scheduled.startTime} — {scheduled.endTime}
                  </span>
                </div>
                <StatusBadge status="ExamScheduled" />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRescheduling(true);
                }}
              >
                Reschedule
              </Button>
            </div>
          </SectionCard>
        )}

        {/* Available slots */}
        {(!scheduled || isRescheduling) && (
          <SectionCard
            title={isRescheduling ? "Choose a New Slot" : "Available Slots"}
            className="lg:col-span-2"
          >
            {isRescheduling && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-secondary-foreground">
                  Select a new slot for your exam
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRescheduling(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{slot.subject}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-secondary-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(slot.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {slot.startTime} — {slot.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {slot.seatsLeft} seats left
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setConfirmSlot(slot)}
                  >
                    {slot.available ? "Select" : "Full"}
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Preparation checklist */}
        <SectionCard title="Preparation Checklist">
          <PrepChecklist items={mockPrepChecklist} />
        </SectionCard>

        {/* Exam info */}
        <SectionCard title="Exam Information">
          <div className="space-y-3 text-sm text-secondary-foreground">
            <p>
              <span className="font-medium text-foreground">Duration:</span>{" "}
              120 minutes
            </p>
            <p>
              <span className="font-medium text-foreground">Format:</span>{" "}
              Online, proctored
            </p>
            <p>
              <span className="font-medium text-foreground">Questions:</span>{" "}
              10
            </p>
            <p>
              <span className="font-medium text-foreground">Passing score:</span>{" "}
              60%
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmSlot} onOpenChange={() => setConfirmSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You are signing up for the{" "}
              <span className="font-medium text-foreground">
                {confirmSlot?.subject}
              </span>{" "}
              exam
            </DialogDescription>
          </DialogHeader>
          {confirmSlot && (
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-secondary-foreground" />
                {formatDate(confirmSlot.date)}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary-foreground" />
                {confirmSlot.startTime} — {confirmSlot.endTime}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSlot(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
