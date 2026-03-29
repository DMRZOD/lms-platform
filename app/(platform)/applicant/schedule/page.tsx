"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/applicant/section-card";
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
import { mockPrepChecklist } from "@/constants/applicant-mock-data";
import { applicantApi } from "@/lib/applicant-api";
import type { ApiAdmissionExamSlot } from "@/lib/applicant-api";
import { Calendar, Clock, Loader2, Users } from "lucide-react";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ApplicantSchedulePage() {
  const [slots, setSlots]           = useState<ApiAdmissionExamSlot[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [confirmSlot, setConfirmSlot] = useState<ApiAdmissionExamSlot | null>(null);
  const [booking, setBooking]       = useState(false);
  const [booked, setBooked]         = useState<ApiAdmissionExamSlot | null>(null);
  const [bookError, setBookError]   = useState<string | null>(null);

  // ── Fetch slots ──
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicantApi.getExamSlots(0, 20);
      setSlots(data.content ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load exam slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  // ── Book slot ──
  const handleBook = async () => {
    if (!confirmSlot) return;
    setBooking(true);
    setBookError(null);
    try {
      await applicantApi.bookExamSlot(confirmSlot.id);
      setBooked(confirmSlot);
      setConfirmSlot(null);
    } catch (err: unknown) {
      setBookError(err instanceof Error ? err.message : "Failed to book slot");
    } finally {
      setBooking(false);
    }
  };

  return (
      <div>
        <PageHeader
            title="Exam Schedule"
            description="Choose a convenient slot for your entrance exam"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Booked slot */}
          {booked && (
              <SectionCard title="Scheduled Exam" className="lg:col-span-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">Entrance Exam</p>
                    <div className="flex flex-wrap gap-4 text-sm text-secondary-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(booked.dateTime)}
                  </span>
                      <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                        {formatTime(booked.dateTime)}
                  </span>
                      <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                        {booked.remainingCapacity} seats remaining
                  </span>
                    </div>
                    <span className="inline-block rounded-full bg-[#dcfce7] px-3 py-0.5 text-xs font-medium text-[#166534]">
                  Exam Scheduled ✓
                </span>
                  </div>
                  <Button
                      variant="outline"
                      onClick={() => setBooked(null)}
                  >
                    Change Slot
                  </Button>
                </div>
              </SectionCard>
          )}

          {/* Available slots */}
          {!booked && (
              <SectionCard title="Available Slots" className="lg:col-span-2">
                {loading ? (
                    <div className="flex h-32 items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-secondary-foreground" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <p className="text-sm text-red-500">{error}</p>
                      <button onClick={fetchSlots} className="text-sm underline">Retry</button>
                    </div>
                ) : slots.length === 0 ? (
                    <div className="flex h-32 items-center justify-center">
                      <p className="text-sm text-secondary-foreground">No available exam slots at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {slots.map((slot) => {
                        const isFull = slot.remainingCapacity === 0;
                        return (
                            <div
                                key={slot.id}
                                className={`flex items-center justify-between rounded-lg border p-4 ${
                                    isFull ? "border-border opacity-60" : "border-border"
                                }`}
                            >
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Entrance Exam</p>
                                <div className="flex flex-wrap gap-3 text-xs text-secondary-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(slot.dateTime)}
                          </span>
                                  <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                                    {formatTime(slot.dateTime)}
                          </span>
                                  <span className={`flex items-center gap-1 ${isFull ? "text-red-500" : ""}`}>
                            <Users className="h-3.5 w-3.5" />
                                    {isFull ? "Full" : `${slot.remainingCapacity} seats left`}
                          </span>
                                </div>
                              </div>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isFull}
                                  onClick={() => setConfirmSlot(slot)}
                              >
                                {isFull ? "Full" : "Select"}
                              </Button>
                            </div>
                        );
                      })}
                    </div>
                )}
              </SectionCard>
          )}

          {/* Prep checklist (mock — no API needed) */}
          <SectionCard title="Preparation Checklist">
            <PrepChecklist items={mockPrepChecklist} />
          </SectionCard>

          {/* Exam info */}
          <SectionCard title="Exam Information">
            <div className="space-y-3 text-sm text-secondary-foreground">
              <p><span className="font-medium text-foreground">Format:</span> Online, proctored</p>
              <p><span className="font-medium text-foreground">Questions:</span> 10</p>
              <p><span className="font-medium text-foreground">Duration:</span> 120 minutes</p>
              <p><span className="font-medium text-foreground">Passing score:</span> 60%</p>
            </div>
          </SectionCard>
        </div>

        {bookError && (
            <p className="mt-4 text-sm text-red-500">{bookError}</p>
        )}

        {/* Confirmation dialog */}
        <Dialog open={!!confirmSlot} onOpenChange={() => setConfirmSlot(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                You are signing up for the entrance exam
              </DialogDescription>
            </DialogHeader>
            {confirmSlot && (
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary-foreground" />
                    {formatDate(confirmSlot.dateTime)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary-foreground" />
                    {formatTime(confirmSlot.dateTime)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-secondary-foreground" />
                    {confirmSlot.remainingCapacity} seats remaining
                  </p>
                </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmSlot(null)}>
                Cancel
              </Button>
              <Button disabled={booking} onClick={handleBook}>
                {booking ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</>
                ) : (
                    "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}