"use client";

import { cn } from "@/lib/utils";
import type { AdmissionStatus, StatusHistoryEntry } from "@/types/applicant";
import { Check, Circle, Clock } from "lucide-react";
import * as motion from "motion/react-client";

const ADMISSION_STEPS: { status: AdmissionStatus; label: string }[] = [
  { status: "Applied", label: "Application Submitted" },
  { status: "DocsPending", label: "Document Upload" },
  { status: "DocsInReview", label: "Documents In Review" },
  { status: "Verified", label: "Documents Verified" },
  { status: "ExamScheduled", label: "Exam Scheduled" },
  { status: "ExamInProgress", label: "Exam In Progress" },
  { status: "ExamCompleted", label: "Exam Completed" },
  { status: "Passed", label: "Exam Passed" },
  { status: "Enrolled", label: "Enrolled" },
];

function getStepState(
  stepStatus: AdmissionStatus,
  currentStatus: AdmissionStatus,
): "done" | "current" | "upcoming" {
  const currentIdx = ADMISSION_STEPS.findIndex(
    (s) => s.status === currentStatus,
  );
  const stepIdx = ADMISSION_STEPS.findIndex((s) => s.status === stepStatus);

  // Handle Failed specially
  if (currentStatus === "Failed") {
    const completedIdx = ADMISSION_STEPS.findIndex(
      (s) => s.status === "ExamCompleted",
    );
    if (stepIdx < completedIdx) return "done";
    if (stepIdx === completedIdx) return "done";
    return "upcoming";
  }

  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "current";
  return "upcoming";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusTimeline({
  currentStatus,
  history,
}: {
  currentStatus: AdmissionStatus;
  history: StatusHistoryEntry[];
}) {
  return (
    <div className="relative space-y-0">
      {ADMISSION_STEPS.map((step, idx) => {
        const state = getStepState(step.status, currentStatus);
        const historyEntry = history.find((h) => h.status === step.status);

        return (
          <motion.div
            key={step.status}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.3 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {/* Vertical line */}
            {idx < ADMISSION_STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute left-[13px] top-7 h-full w-px",
                  state === "done"
                    ? "bg-emerald-300"
                    : "bg-border",
                )}
              />
            )}

            {/* Circle indicator */}
            <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
              {state === "done" ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
              ) : state === "current" ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground bg-background">
                  <Clock className="h-3.5 w-3.5 text-foreground" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background">
                  <Circle className="h-3 w-3 text-secondary-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  state === "upcoming" && "text-secondary-foreground",
                )}
              >
                {step.label}
              </p>
              {historyEntry && (
                <p className="mt-0.5 text-xs text-secondary-foreground">
                  {formatDate(historyEntry.timestamp)}
                  {historyEntry.note && ` — ${historyEntry.note}`}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Show Failed state if applicable */}
      {currentStatus === "Failed" && (
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ADMISSION_STEPS.length * 0.06, duration: 0.3 }}
          className="relative flex gap-4"
        >
          <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-500 bg-red-50">
              <span className="text-xs font-bold text-red-600">✕</span>
            </div>
          </div>
          <div className="pt-0.5">
            <p className="text-sm font-medium text-red-700">Failed</p>
            {history.find((h) => h.status === "Failed") && (
              <p className="mt-0.5 text-xs text-secondary-foreground">
                {formatDate(
                  history.find((h) => h.status === "Failed")!.timestamp,
                )}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
