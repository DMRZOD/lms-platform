"use client";

import { useCallback, useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/applicant/section-card";
import { DeviceCheck } from "@/components/applicant/device-check";
import { CountdownTimer } from "@/components/applicant/countdown-timer";
import { ExamQuestion } from "@/components/applicant/exam-question";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockExamSession } from "@/constants/applicant-mock-data";
import type { ExamQuestion as ExamQuestionType } from "@/types/applicant";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";

type Phase = "precheck" | "exam" | "submitted";

export default function ApplicantExamsPage() {
  const [phase, setPhase] = useState<Phase>("precheck");
  const [devicesReady, setDevicesReady] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestionType[]>(
    mockExamSession.questions,
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleSelect = useCallback(
    (questionId: string, optionId: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, selectedOptionId: optionId } : q,
        ),
      );
    },
    [],
  );

  const answeredCount = questions.filter((q) => q.selectedOptionId).length;

  const handleSubmit = () => {
    setShowSubmitDialog(false);
    setPhase("submitted");
  };

  // Pre-check phase
  if (phase === "precheck") {
    return (
      <div>
        <PageHeader
          title="Entrance Exam"
          description="Equipment check before starting"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Device Check">
            <DeviceCheck onAllPassed={setDevicesReady} />
            <Button
              className="mt-6 w-full"
              disabled={!devicesReady}
              onClick={() => setPhase("exam")}
            >
              Start Exam
            </Button>
          </SectionCard>

          <SectionCard title="Before You Begin">
            <div className="space-y-3 text-sm text-secondary-foreground">
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                <p>The exam is proctored. Your camera and microphone must remain on.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Do not close the browser tab during the exam.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Have your passport ready for identity verification.</p>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-secondary p-3 text-sm">
              <p className="font-medium">Exam Details</p>
              <p className="mt-1 text-secondary-foreground">
                {mockExamSession.subject} — {mockExamSession.totalQuestions}{" "}
                questions, {mockExamSession.durationMinutes} minutes
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // Submitted phase
  if (phase === "submitted") {
    return (
      <div>
        <PageHeader
          title="Exam Completed"
          description="Your answers have been submitted"
        />
        <SectionCard className="mx-auto max-w-lg text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold">Exam Completed!</h2>
            <p className="text-sm text-secondary-foreground">
              You answered {answeredCount} out of {questions.length} questions.
              Results will be available within 5 business days.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/applicant/dashboard"}>
              Back to Dashboard
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  // Exam phase
  const currentQuestion = questions[currentIdx];

  return (
    <div>
      {/* Exam header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{mockExamSession.subject}</h1>
          <p className="text-sm text-secondary-foreground">
            Question {currentIdx + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CountdownTimer
            durationMinutes={mockExamSession.durationMinutes}
            onTimeUp={() => setPhase("submitted")}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowSubmitDialog(true)}
          >
            Finish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_240px]">
        {/* Question area */}
        <SectionCard>
          <ExamQuestion
            question={currentQuestion}
            index={currentIdx}
            selectedOptionId={currentQuestion.selectedOptionId}
            onSelect={handleSelect}
          />

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}
            >
              Next
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </SectionCard>

        {/* Question navigation */}
        <SectionCard title="Navigation">
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                  idx === currentIdx
                    ? "border-foreground bg-foreground text-background"
                    : q.selectedOptionId
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-border hover:bg-secondary",
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-secondary-foreground">
            Answered: {answeredCount} / {questions.length}
          </p>
        </SectionCard>
      </div>

      {/* Submit confirmation */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish Exam?</DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} out of {questions.length} questions.
              {answeredCount < questions.length && (
                <span className="mt-1 block text-amber-600">
                  You have unanswered questions!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Continue Exam
            </Button>
            <Button variant="destructive" onClick={handleSubmit}>
              Finish and Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
