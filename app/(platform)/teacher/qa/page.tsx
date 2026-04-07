"use client";

import { PageHeader } from "@/components/platform/page-header";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiCourse, ApiLecture, ApiQAQuestion, ApiQAAnswer } from "@/lib/teacher-api";
import {
  CheckCircle,
  ChevronDown,
  MessageSquare,
  RefreshCw,
  Send,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const TEMPLATE_ANSWERS = [
  "Thank you for your question! Could you provide more details or context?",
  "Great question! Please refer to the lecture slides for a detailed explanation.",
  "This will be covered in the next lecture. Please check back then.",
  "Please visit office hours for a detailed discussion on this topic.",
];

type QAFilter = "all" | "OPEN" | "CLOSED";

export default function QAPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [lectures, setLectures] = useState<ApiLecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);

  const [questions, setQuestions] = useState<ApiQAQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<ApiQAQuestion | null>(null);
  const [answers, setAnswers] = useState<ApiQAAnswer[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [answerText, setAnswerText] = useState("");
  const [filterStatus, setFilterStatus] = useState<QAFilter>("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Load courses
  useEffect(() => {
    (async () => {
      try {
        const data = await teacherApi.getCourses({ size: 50 });
        const arr: ApiCourse[] = Array.isArray(data) ? data : (data.content ?? []);
        setCourses(arr);
        if (arr.length > 0) setSelectedCourseId(arr[0].id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load lectures when course changes
  useEffect(() => {
    if (!selectedCourseId) return;
    (async () => {
      try {
        const data = await teacherApi.getCourseLectures(selectedCourseId);
        const arr: ApiLecture[] = Array.isArray(data) ? data : [];
        setLectures(arr);
        if (arr.length > 0) setSelectedLectureId(arr[0].id);
        else setSelectedLectureId(null);
      } catch {
        setLectures([]);
      }
    })();
  }, [selectedCourseId]);

  // Load questions
  const loadQuestions = useCallback(async () => {
    if (!selectedLectureId) return;
    setLoadingQuestions(true);
    setSelectedQuestion(null);
    setAnswers([]);
    try {
      const data = await teacherApi.getQAQuestions(selectedLectureId, { size: 50 });
      const arr: ApiQAQuestion[] = Array.isArray(data) ? data : (data.content ?? []);
      setQuestions(arr);
    } catch {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, [selectedLectureId]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // Load answers for selected question
  const loadAnswers = useCallback(async (question: ApiQAQuestion) => {
    setSelectedQuestion(question);
    setAnswerText("");
    setLoadingAnswers(true);
    try {
      const data = await teacherApi.getQAAnswers(question.lectureId, question.id, { size: 50 });
      const arr: ApiQAAnswer[] = Array.isArray(data) ? data : (data.content ?? []);
      setAnswers(arr);
    } catch {
      setAnswers([]);
    } finally {
      setLoadingAnswers(false);
    }
  }, []);

  // Submit answer
  const handleAnswer = async () => {
    if (!selectedQuestion || !answerText.trim()) return;
    setSubmittingAnswer(true);
    setActionMsg(null);
    try {
      const newAnswer = await teacherApi.createQAAnswer(
          selectedQuestion.lectureId,
          selectedQuestion.id,
          { body: answerText.trim() },
      );
      setAnswers((prev) => [...prev, newAnswer]);
      setAnswerText("");
      // Refresh questions to update answerCount & status
      await loadQuestions();
      setActionMsg("Answer submitted!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to submit answer");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Accept answer
  const handleAcceptAnswer = async (answerId: number) => {
    if (!selectedQuestion) return;
    try {
      await teacherApi.acceptQAAnswer(selectedQuestion.lectureId, selectedQuestion.id, answerId);
      setAnswers((prev) =>
          prev.map((a) => ({ ...a, isAccepted: a.id === answerId })),
      );
      setActionMsg("Answer accepted as best!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to accept answer");
    }
  };

  // Delete answer
  const handleDeleteAnswer = async (answerId: number) => {
    if (!selectedQuestion || !confirm("Delete this answer?")) return;
    try {
      await teacherApi.deleteQAAnswer(selectedQuestion.lectureId, selectedQuestion.id, answerId);
      setAnswers((prev) => prev.filter((a) => a.id !== answerId));
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to delete answer");
    }
  };

  // Close/Reopen question
  const handleToggleStatus = async (question: ApiQAQuestion) => {
    try {
      if (question.status === "OPEN") {
        await teacherApi.closeQAQuestion(question.lectureId, question.id);
        setActionMsg("Question closed!");
      } else {
        await teacherApi.reopenQAQuestion(question.lectureId, question.id);
        setActionMsg("Question reopened!");
      }
      await loadQuestions();
      if (selectedQuestion?.id === question.id) setSelectedQuestion(null);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Action failed");
    }
  };

  // Delete question
  const handleDeleteQuestion = async (question: ApiQAQuestion) => {
    if (!confirm("Delete this question?")) return;
    try {
      await teacherApi.deleteQAQuestion(question.lectureId, question.id);
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
      if (selectedQuestion?.id === question.id) setSelectedQuestion(null);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to delete question");
    }
  };

  const filtered = questions.filter((q) => {
    if (filterStatus === "all") return true;
    return q.status === filterStatus;
  });

  const openCount = questions.filter((q) => q.status === "OPEN").length;

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  return (
      <div>
        <div className="mb-6">
          <PageHeader title="Q&A" description="Answer student questions and moderate discussions" />
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-secondary-foreground">Open Questions</p>
            <p className="text-2xl font-bold">{openCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-secondary-foreground">Answered</p>
            <p className="text-2xl font-bold">
              {questions.filter((q) => q.status !== "OPEN").length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-secondary-foreground">Total</p>
            <p className="text-2xl font-bold">{questions.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Course */}
          <div className="relative">
            <select
                value={selectedCourseId ?? ""}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="appearance-none rounded-md border border-border bg-background py-1.5 pl-3 pr-8 text-sm outline-none focus:border-foreground"
            >
              {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-secondary-foreground" />
          </div>

          {/* Lecture */}
          <div className="relative">
            <select
                value={selectedLectureId ?? ""}
                onChange={(e) => setSelectedLectureId(Number(e.target.value))}
                className="appearance-none rounded-md border border-border bg-background py-1.5 pl-3 pr-8 text-sm outline-none focus:border-foreground"
            >
              {lectures.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-secondary-foreground" />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1">
            {(["all", "OPEN", "CLOSED"] as QAFilter[]).map((s) => (
                <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        filterStatus === s
                            ? "bg-foreground text-background"
                            : "border border-border bg-background hover:bg-secondary"
                    }`}
                >
                  {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
            ))}
          </div>

          <button
              onClick={loadQuestions}
              className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {actionMsg && (
            <div className="mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm">
              {actionMsg}
            </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Question List */}
          <div className="space-y-2 lg:col-span-2">
            {loadingQuestions ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />
                  ))}
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No questions found.</p>
            ) : (
                filtered.map((q) => (
                    <button
                        key={q.id}
                        onClick={() => loadAnswers(q)}
                        className={`w-full rounded-lg border p-4 text-left transition-colors ${
                            selectedQuestion?.id === q.id
                                ? "border-foreground bg-secondary"
                                : "border-border bg-background hover:bg-secondary/50"
                        }`}
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium line-clamp-2">{q.title}</p>
                        <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                q.status === "OPEN"
                                    ? "bg-[#fef9c3] text-[#854d0e]"
                                    : "bg-[#f0f0f0] text-[#666]"
                            }`}
                        >
                    {q.status}
                  </span>
                      </div>
                      <p className="text-xs text-secondary-foreground">
                        {new Date(q.createdAt).toLocaleString()}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-secondary-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {q.answerCount}
                  </span>
                        {q.isLocked && (
                            <span className="rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-[#991b1b]">
                      Locked
                    </span>
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
                  {/* Question Header */}
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{selectedQuestion.title}</h3>
                      <div className="flex gap-1">
                        <button
                            onClick={() => handleToggleStatus(selectedQuestion)}
                            className="rounded px-2 py-1 text-xs border border-border hover:bg-secondary"
                        >
                          {selectedQuestion.status === "OPEN" ? "Close" : "Reopen"}
                        </button>
                        <button
                            onClick={() => handleDeleteQuestion(selectedQuestion)}
                            className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm">{selectedQuestion.body}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-secondary-foreground">
                      <span>{new Date(selectedQuestion.createdAt).toLocaleString()}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${
                          selectedQuestion.status === "OPEN"
                              ? "bg-[#fef9c3] text-[#854d0e]"
                              : "bg-[#f0f0f0] text-[#666]"
                      }`}>
                    {selectedQuestion.status}
                  </span>
                    </div>
                  </div>

                  {/* Answers */}
                  {loadingAnswers ? (
                      <div className="h-16 animate-pulse rounded-lg bg-secondary" />
                  ) : answers.length > 0 ? (
                      <div className="space-y-3 border-t border-border pt-3">
                        <p className="text-sm font-medium">
                          {answers.length} answer{answers.length !== 1 ? "s" : ""}
                        </p>
                        {answers.map((ans) => (
                            <div
                                key={ans.id}
                                className={`rounded-md p-3 ${
                                    ans.isAccepted ? "border border-[#bbf7d0] bg-[#f0fdf4]" : "bg-secondary"
                                }`}
                            >
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            User #{ans.createdBy}
                          </span>
                                  {ans.isAccepted && (
                                      <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                              <CheckCircle className="h-3 w-3" /> Best Answer
                            </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {!ans.isAccepted && (
                                      <button
                                          onClick={() => handleAcceptAnswer(ans.id)}
                                          className="text-xs text-secondary-foreground underline underline-offset-2 hover:text-foreground"
                                      >
                                        Mark as best
                                      </button>
                                  )}
                                  <button
                                      onClick={() => handleDeleteAnswer(ans.id)}
                                      className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm">{ans.body}</p>
                              <p className="mt-1 text-xs text-secondary-foreground">
                                {new Date(ans.createdAt).toLocaleString()}
                              </p>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <p className="text-sm text-secondary-foreground border-t border-border pt-3">
                        No answers yet.
                      </p>
                  )}

                  {/* Answer Form */}
                  {selectedQuestion.status === "OPEN" && (
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
                                            onClick={() => { setAnswerText(t); setShowTemplates(false); }}
                                            className="block w-full px-3 py-2 text-left text-xs hover:bg-secondary"
                                        >
                                          {t.slice(0, 60)}...
                                        </button>
                                    ))}
                                  </div>
                              )}
                            </div>
                            <button
                                onClick={handleAnswer}
                                disabled={!answerText.trim() || submittingAnswer}
                                className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                            >
                              <Send className="h-3.5 w-3.5" />
                              {submittingAnswer ? "Sending..." : "Answer"}
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
