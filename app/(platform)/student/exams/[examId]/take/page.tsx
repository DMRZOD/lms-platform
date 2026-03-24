"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { mockExams, mockExamSession } from "@/constants/student-mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Mic,
  Monitor,
  ShieldCheck,
  Timer,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Phase = "precheck" | "exam" | "submitted";

type CheckItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  checked: boolean;
};

const initialChecks: CheckItem[] = [
  { id: "camera", icon: Camera, label: "Camera is working", checked: false },
  { id: "mic", icon: Mic, label: "Microphone is working", checked: false },
  { id: "internet", icon: Wifi, label: "Stable internet connection", checked: false },
  { id: "screen", icon: Monitor, label: "Screen sharing enabled", checked: false },
  { id: "id", icon: ShieldCheck, label: "ID document within reach", checked: false },
];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TakeExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const exam = mockExams.find((e) => e.id === examId);
  const { questions, durationMinutes } = mockExamSession;

  const [phase, setPhase] = useState<Phase>("precheck");
  const [checks, setChecks] = useState<CheckItem[]>(initialChecks);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    if (phase !== "exam") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPhase("submitted");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  if (!exam) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary-foreground">Exam not found.</p>
        <Link href="/student/exams" className="mt-2 text-sm underline">
          Back to exams
        </Link>
      </div>
    );
  }

  const allChecked = checks.every((c) => c.checked);
  const answeredCount = Object.keys(answers).length;
  const question = questions[currentQ];

  const toggleCheck = (id: string) => {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  const handleAnswer = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    setPhase("submitted");
    setShowSubmitConfirm(false);
  };

  // ── Pre-check ──────────────────────────────────────────────────────────────
  if (phase === "precheck") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="mt-1 text-sm text-secondary-foreground">
            {exam.courseName} · {durationMinutes} minutes · {questions.length} questions
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">System Check</h2>
          <p className="mb-4 text-sm text-secondary-foreground">
            Please confirm all requirements before starting the exam.
          </p>
          <div className="space-y-3">
            {checks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    item.checked
                      ? "border-green-200 bg-green-50"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5 shrink-0", item.checked ? "text-green-600" : "text-secondary-foreground")}
                  />
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.checked && <CheckCircle className="h-4 w-4 text-green-600" />}
                </button>
              );
            })}
          </div>

          <Button
            className="mt-6 w-full"
            disabled={!allChecked}
            onClick={() => setPhase("exam")}
          >
            {allChecked ? "Start Exam" : `Check all items to continue (${checks.filter((c) => c.checked).length}/${checks.length})`}
          </Button>

          {!allChecked && (
            <p className="mt-2 text-center text-xs text-secondary-foreground">
              Confirm all items by clicking them
            </p>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              This exam is proctored. Video recording is active throughout the exam. Do not switch tabs or leave the window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Submitted ──────────────────────────────────────────────────────────────
  if (phase === "submitted") {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold">Exam Submitted!</h2>
        <p className="mt-2 text-secondary-foreground">
          Your answers have been recorded. You answered {answeredCount} out of {questions.length} questions.
        </p>
        <p className="mt-1 text-sm text-secondary-foreground">
          Results will be available within 5 business days.
        </p>
        <Link href="/student/exams">
          <Button className="mt-6">Back to Exams</Button>
        </Link>
      </div>
    );
  }

  // ── Exam interface ─────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-background px-5 py-3">
        <div>
          <p className="font-semibold">{exam.title}</p>
          <p className="text-xs text-secondary-foreground">{exam.courseName}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-secondary-foreground">
            {answeredCount}/{questions.length} answered
          </span>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
              timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-secondary",
            )}
          >
            <Timer className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <Button
            size="sm"
            onClick={() => setShowSubmitConfirm(true)}
          >
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Question navigation sidebar */}
        <div className="hidden w-48 shrink-0 overflow-y-auto rounded-lg border border-border bg-background p-3 lg:block">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
            Questions
          </p>
          <div className="grid grid-cols-4 gap-1">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQ(idx)}
                className={cn(
                  "flex h-8 w-full items-center justify-center rounded text-xs font-medium transition-colors",
                  currentQ === idx
                    ? "bg-foreground text-background"
                    : answers[q.id]
                      ? "bg-green-100 text-green-800"
                      : "border border-border hover:bg-secondary",
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-secondary-foreground">
              Question {currentQ + 1} of {questions.length}
            </p>
            <span className="text-sm text-secondary-foreground">{question.points} pts</span>
          </div>

          <p className="mb-6 text-base font-medium leading-relaxed">{question.text}</p>

          <div className="flex-1 overflow-y-auto">
            {question.type === "multiple_choice" && question.options && (
              <div className="space-y-2">
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(question.id, opt.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-colors",
                      answers[question.id] === opt.id
                        ? "border-foreground bg-secondary font-medium"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs",
                        answers[question.id] === opt.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border",
                      )}
                    >
                      {opt.id.split("-").pop()?.toUpperCase()}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {(question.type === "short_answer" || question.type === "essay") && (
              <Textarea
                value={answers[question.id] ?? ""}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                placeholder={
                  question.type === "short_answer"
                    ? "Write your short answer..."
                    : "Write your essay answer..."
                }
                className={question.type === "essay" ? "min-h-48" : "min-h-24"}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
              disabled={currentQ === 0}
            >
              ← Previous
            </Button>
            <span className="text-sm text-secondary-foreground">
              {currentQ + 1} / {questions.length}
            </span>
            {currentQ < questions.length - 1 ? (
              <Button onClick={() => setCurrentQ((q) => Math.min(questions.length - 1, q + 1))}>
                Next →
              </Button>
            ) : (
              <Button onClick={() => setShowSubmitConfirm(true)}>Submit Exam</Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit confirmation overlay */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6">
            <h3 className="text-lg font-bold">Submit Exam?</h3>
            <p className="mt-2 text-sm text-secondary-foreground">
              You have answered {answeredCount} out of {questions.length} questions.{" "}
              {answeredCount < questions.length && (
                <span className="text-amber-700">{questions.length - answeredCount} question(s) unanswered.</span>
              )}{" "}
              You cannot change your answers after submission.
            </p>
            <div className="mt-4 flex gap-3">
              <Button className="flex-1" onClick={handleSubmit}>
                Yes, Submit
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
