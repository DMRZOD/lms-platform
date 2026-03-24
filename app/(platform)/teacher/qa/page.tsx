"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SLACountdown } from "@/components/teacher/sla-countdown";
import { mockCourses, mockQAQuestions } from "@/constants/teacher-mock-data";
import type { QAQuestion } from "@/types/teacher";
import {
  CheckCircle,
  ChevronDown,
  EyeOff,
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const TEMPLATE_ANSWERS = [
  "Thank you for your question! Could you provide more details or context?",
  "Great question! Please refer to the lecture slides for a detailed explanation.",
  "This will be covered in the next lecture. Please check back then.",
  "Please visit office hours for a detailed discussion on this topic.",
];

type QAStatus = "all" | "open" | "answered" | "closed";

export default function QAPage() {
  const [questions, setQuestions] = useState<QAQuestion[]>(mockQAQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<QAQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [filterStatus, setFilterStatus] = useState<QAStatus>("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);

  const filtered = questions.filter((q) => {
    const matchStatus = filterStatus === "all" || q.status === filterStatus;
    const matchCourse = filterCourse === "all" || q.courseId === filterCourse;
    return matchStatus && matchCourse && !q.isHidden;
  });

  const openCount = questions.filter((q) => q.status === "open").length;
  const slaBreachedCount = questions.filter((q) => q.slaBreached && q.status === "open").length;

  const handleAnswer = (q: QAQuestion) => {
    if (!answerText.trim()) return;
    const updated = questions.map((qq) =>
      qq.id === q.id
        ? {
            ...qq,
            status: "answered" as const,
            answers: [
              ...qq.answers,
              {
                id: `ans-${Date.now()}`,
                questionId: qq.id,
                authorId: "tch-001",
                authorName: "Dr. Elena Volkova",
                authorRole: "teacher" as const,
                content: answerText,
                createdAt: new Date().toISOString(),
                isAccepted: false,
                isHidden: false,
              },
            ],
          }
        : qq,
    );
    setQuestions(updated);
    setSelectedQuestion(updated.find((qq) => qq.id === q.id) ?? null);
    setAnswerText("");
  };

  const handleAcceptAnswer = (qId: string, ansId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                isAccepted: a.id === ansId,
              })),
            }
          : q,
      ),
    );
  };

  const handleHide = (qId: string) => {
    setQuestions(
      questions.map((q) => (q.id === qId ? { ...q, isHidden: true } : q)),
    );
    if (selectedQuestion?.id === qId) setSelectedQuestion(null);
  };

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Q&A" description="Answer student questions and moderate discussions" />
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Open Questions</p>
          <p className="text-2xl font-bold">{openCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">SLA Breached</p>
          <p className={`text-2xl font-bold ${slaBreachedCount > 0 ? "text-[#ef4444]" : ""}`}>
            {slaBreachedCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Answered</p>
          <p className="text-2xl font-bold">
            {questions.filter((q) => q.status === "answered").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Total</p>
          <p className="text-2xl font-bold">{questions.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex gap-1">
          {(["all", "open", "answered", "closed"] as QAStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filterStatus === s
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
        >
          <option value="all">All Courses</option>
          {mockCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Question List */}
        <div className="space-y-2 lg:col-span-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No questions match your filters</p>
          ) : (
            filtered
              .sort((a, b) => {
                if (a.status === "open" && b.status !== "open") return -1;
                if (b.status === "open" && a.status !== "open") return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    selectedQuestion?.id === q.id
                      ? "border-foreground bg-secondary"
                      : "border-border bg-background hover:bg-secondary/50"
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-2">{q.title}</p>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        q.status === "open"
                          ? "bg-[#fef9c3] text-[#854d0e]"
                          : q.status === "answered"
                            ? "bg-[#dcfce7] text-[#166534]"
                            : "bg-[#f0f0f0] text-[#666]"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-foreground">
                    {q.courseName} · {q.authorName}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-secondary-foreground">
                      <ThumbsUp className="h-3 w-3" /> {q.votes}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-secondary-foreground">
                      <MessageSquare className="h-3 w-3" /> {q.answers.length}
                    </span>
                    {q.status === "open" && (
                      <SLACountdown deadline={q.slaDeadline} breached={q.slaBreached} />
                    )}
                  </div>
                </button>
              ))
          )}
        </div>

        {/* Question Detail */}
        <div className="lg:col-span-3">
          {!selectedQuestion ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-secondary-foreground">Select a question to view and answer</p>
            </div>
          ) : (
            <div className="space-y-4 rounded-lg border border-border bg-background p-5">
              {/* Question */}
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{selectedQuestion.title}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleHide(selectedQuestion.id)}
                      className="rounded p-1 text-secondary-foreground hover:text-foreground"
                      title="Hide question"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setQuestions(questions.filter((q) => q.id !== selectedQuestion.id))
                      }
                      className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm">{selectedQuestion.content}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-secondary-foreground">
                  <span>{selectedQuestion.authorName}</span>
                  <span>{new Date(selectedQuestion.createdAt).toLocaleString()}</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {selectedQuestion.votes}
                  </span>
                  {selectedQuestion.status === "open" && (
                    <SLACountdown
                      deadline={selectedQuestion.slaDeadline}
                      breached={selectedQuestion.slaBreached}
                    />
                  )}
                </div>
              </div>

              {/* Answers */}
              {selectedQuestion.answers.length > 0 && (
                <div className="space-y-3 border-t border-border pt-3">
                  <p className="text-sm font-medium">
                    {selectedQuestion.answers.length} answer
                    {selectedQuestion.answers.length > 1 ? "s" : ""}
                  </p>
                  {selectedQuestion.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className={`rounded-md p-3 ${
                        ans.isAccepted ? "border border-[#bbf7d0] bg-[#f0fdf4]" : "bg-secondary"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{ans.authorName}</span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-xs ${
                              ans.authorRole === "teacher"
                                ? "bg-[#dbeafe] text-[#1d4ed8]"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {ans.authorRole}
                          </span>
                          {ans.isAccepted && (
                            <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                              <CheckCircle className="h-3 w-3" /> Best Answer
                            </span>
                          )}
                        </div>
                        {!ans.isAccepted && (
                          <button
                            onClick={() => handleAcceptAnswer(selectedQuestion.id, ans.id)}
                            className="text-xs text-secondary-foreground underline underline-offset-2 hover:text-foreground"
                          >
                            Mark as best
                          </button>
                        )}
                      </div>
                      <p className="text-sm">{ans.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Form */}
              {selectedQuestion.status === "open" && (
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-sm font-medium">Your Answer</p>
                  <div className="relative">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      rows={3}
                      placeholder="Write your answer..."
                      className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="relative">
                        <button
                          onClick={() => setShowTemplates(!showTemplates)}
                          className="flex items-center gap-1 text-xs text-secondary-foreground hover:text-foreground"
                        >
                          Templates <ChevronDown className="h-3 w-3" />
                        </button>
                        {showTemplates && (
                          <div className="absolute bottom-full left-0 z-10 mb-1 w-64 rounded-md border border-border bg-background shadow-md">
                            {TEMPLATE_ANSWERS.map((t, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setAnswerText(t);
                                  setShowTemplates(false);
                                }}
                                className="block w-full px-3 py-2 text-left text-xs hover:bg-secondary"
                              >
                                {t.slice(0, 60)}...
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAnswer(selectedQuestion)}
                        disabled={!answerText.trim()}
                        className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" /> Answer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
