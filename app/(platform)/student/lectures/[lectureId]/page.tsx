"use client";

import { useParams } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { SectionCard } from "@/components/student/section-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { studentApi } from "@/lib/student-api";
import type {
  ApiLecture,
  ApiLectureMaterial,
  ApiQAQuestion,
  ApiChatMessage,
} from "@/lib/student-api";
import {
  Calendar, Clock, Download, FileText,
  Link as LinkIcon, Play, Radio, User, Video,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const materialIcons: Record<string, React.ElementType> = {
  pdf:    FileText,
  slides: FileText,
  video:  Play,
  link:   LinkIcon,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LectureDetailPage() {
  const { lectureId } = useParams<{ lectureId: string }>();

  const [lecture, setLecture]         = useState<ApiLecture | null>(null);
  const [materials, setMaterials]     = useState<ApiLectureMaterial[]>([]);
  const [questions, setQuestions]     = useState<ApiQAQuestion[]>([]);
  const [chatMessages, setChatMessages] = useState<ApiChatMessage[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [notes, setNotes]             = useState("");

  // Q&A state
  const [qaText, setQaText]           = useState("");
  const [sendingQA, setSendingQA]     = useState(false);
  const [replyTo, setReplyTo]         = useState<number | null>(null);
  const [replyText, setReplyText]     = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Chat state
  const [chatText, setChatText]       = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatBottomRef                 = useRef<HTMLDivElement>(null);

  // ── Fetch data ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = Number(lectureId);
      const [lectureRes, materialsRes, questionsRes] = await Promise.allSettled([
        studentApi.getLecture(id),
        studentApi.getLectureMaterials(id),
        studentApi.getLectureQuestions(id),
      ]);

      if (lectureRes.status   === "fulfilled") setLecture(lectureRes.value);
      if (materialsRes.status === "fulfilled") setMaterials(Array.isArray(materialsRes.value) ? materialsRes.value : []);
      if (questionsRes.status === "fulfilled") setQuestions(Array.isArray(questionsRes.value) ? questionsRes.value : []);

      // Chat only for live lectures
      if (lectureRes.status === "fulfilled" && lectureRes.value?.status === "live") {
        try {
          const chat = await studentApi.getChatMessages(id);
          setChatMessages(Array.isArray(chat) ? chat : []);
        } catch { /* optional */ }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lecture");
    } finally {
      setLoading(false);
    }
  }, [lectureId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── Ask question ──
  const handleAskQuestion = async () => {
    if (!qaText.trim()) return;
    setSendingQA(true);
    try {
      const newQ = await studentApi.askQuestion(Number(lectureId), { content: qaText });
      setQuestions((prev) => [...prev, newQ]);
      setQaText("");
    } catch { /* silent */ } finally {
      setSendingQA(false);
    }
  };

  // ── Reply to question ──
  const handleReply = async (questionId: number) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const answer = await studentApi.answerQuestion(
          Number(lectureId),
          questionId,
          { content: replyText }
      );
      setQuestions((prev) =>
          prev.map((q) =>
              q.id === questionId
                  ? { ...q, answers: [...(q.answers ?? []), answer] }
                  : q
          )
      );
      setReplyTo(null);
      setReplyText("");
    } catch { /* silent */ } finally {
      setSendingReply(false);
    }
  };

  // ── Send chat message ──
  const handleSendChat = async () => {
    if (!chatText.trim()) return;
    setSendingChat(true);
    try {
      const msg = await studentApi.sendChatMessage(Number(lectureId), { content: chatText });
      setChatMessages((prev) => [...prev, msg]);
      setChatText("");
    } catch { /* silent */ } finally {
      setSendingChat(false);
    }
  };

  // ── Download material ──
  const handleDownload = async (materialId: number, url?: string) => {
    if (url) { window.open(url, "_blank"); return; }
    try {
      await studentApi.downloadMaterial(Number(lectureId), materialId);
    } catch { /* silent */ }
  };

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  if (error || !lecture) {
    return (
        <div className="py-12 text-center">
          <p className="text-secondary-foreground">{error ?? "Lecture not found."}</p>
          <Link href="/student/lectures" className="mt-2 text-sm underline">
            Back to lectures
          </Link>
        </div>
    );
  }

  const isLive = lecture.status === "live";

  // Top-level questions (no parentId — API doesn't return parentId but answers are nested)
  const topQuestions = questions;

  return (
      <div>
        <div className="mb-2">
          <Link href="/student/lectures" className="text-sm text-secondary-foreground hover:text-foreground">
            ← Back to lectures
          </Link>
        </div>

        {/* Header card */}
        <div className="mb-6 rounded-lg border border-border bg-background p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  isLive ? "bg-red-100" : "bg-secondary"
              )}>
                {isLive
                    ? <Radio className="h-6 w-6 text-red-600" />
                    : <Video className="h-6 w-6 text-foreground" />
                }
              </div>
              <div>
                <h1 className="text-xl font-bold">{lecture.title}</h1>
                {lecture.description && (
                    <p className="mt-0.5 text-sm text-secondary-foreground">{lecture.description}</p>
                )}
              </div>
            </div>
            {lecture.status && <StudentStatusBadge status={lecture.status} />}
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-foreground">
            {lecture.date && (
                <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
                  {new Date(lecture.date).toLocaleDateString("en-US", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
            </span>
            )}
            {lecture.startTime && (
                <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
                  {lecture.startTime}{lecture.endTime ? ` – ${lecture.endTime}` : ""}
            </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {isLive && lecture.meetingUrl && (
                <a href={lecture.meetingUrl} target="_blank" rel="noreferrer">
                  <Button className="gap-2 bg-red-600 hover:bg-red-700">
                    <Radio className="h-4 w-4" /> Join Live Lecture
                  </Button>
                </a>
            )}
            {!isLive && lecture.meetingUrl && lecture.status === "upcoming" && (
                <a href={lecture.meetingUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Video className="h-4 w-4" /> Join Lecture
                  </Button>
                </a>
            )}
            {lecture.recordingUrl && (
                <a href={lecture.recordingUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Play className="h-4 w-4" /> Watch Recording
                  </Button>
                </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="materials">
          <TabsList className="mb-6">
            <TabsTrigger value="materials">
              Materials ({materials.length})
            </TabsTrigger>
            <TabsTrigger value="qa">
              Q&A ({topQuestions.length})
            </TabsTrigger>
            {isLive && <TabsTrigger value="chat">Live Chat</TabsTrigger>}
            <TabsTrigger value="notes">My Notes</TabsTrigger>
          </TabsList>

          {/* ── Materials ── */}
          <TabsContent value="materials">
            <SectionCard title="Lecture Materials">
              {materials.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No materials uploaded yet.</p>
              ) : (
                  <div className="space-y-2">
                    {materials.map((mat) => {
                      const Icon = materialIcons[mat.type ?? ""] ?? FileText;
                      return (
                          <div
                              key={mat.id}
                              className="flex items-center justify-between rounded-md border border-border px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                                <Icon className="h-4 w-4 text-secondary-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{mat.name}</p>
                                {mat.size && (
                                    <p className="text-xs text-secondary-foreground">
                                      {(mat.size / 1024 / 1024).toFixed(1)} MB
                                    </p>
                                )}
                              </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={() => handleDownload(mat.id, mat.url)}
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </Button>
                          </div>
                      );
                    })}
                  </div>
              )}

              {lecture.recordingUrl && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Recording</p>
                    <div className="flex items-center gap-3 rounded-md border border-border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Play className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Lecture Recording</p>
                        <p className="text-xs text-secondary-foreground">Available after lecture</p>
                      </div>
                      <a href={lecture.recordingUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm">Watch</Button>
                      </a>
                    </div>
                  </div>
              )}
            </SectionCard>
          </TabsContent>

          {/* ── Q&A ── */}
          <TabsContent value="qa">
            <SectionCard title="Q&A">
              {/* Ask question form */}
              <div className="mb-6 space-y-2">
                <Textarea
                    value={qaText}
                    onChange={(e) => setQaText(e.target.value)}
                    placeholder="Ask a question about this lecture…"
                    rows={3}
                    className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                      size="sm"
                      onClick={handleAskQuestion}
                      disabled={!qaText.trim() || sendingQA}
                  >
                    {sendingQA ? "Sending…" : "Ask Question"}
                  </Button>
                </div>
              </div>

              {/* Questions list */}
              {topQuestions.length === 0 ? (
                  <p className="py-4 text-center text-sm text-secondary-foreground">
                    No questions yet. Be the first to ask!
                  </p>
              ) : (
                  <div className="space-y-4">
                    {topQuestions.map((q) => (
                        <div key={q.id} className="rounded-lg border border-border p-4">
                          {/* Question */}
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                              {(q.authorName ?? "?")[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium">{q.authorName ?? "Student"}</span>
                            {q.authorRole === "teacher" && (
                                <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs text-[#1d4ed8]">
                          Teacher
                        </span>
                            )}
                            {q.createdAt && (
                                <span className="ml-auto text-xs text-secondary-foreground">
                          {new Date(q.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                            )}
                          </div>
                          <p className="mb-3 text-sm">{q.content}</p>

                          {/* Answers */}
                          {q.answers && q.answers.length > 0 && (
                              <div className="ml-4 space-y-3 border-l-2 border-border pl-4">
                                {q.answers.map((ans) => (
                                    <div key={ans.id}>
                                      <div className="mb-1 flex items-center gap-2">
                                        <span className="text-xs font-medium">{ans.authorName ?? "User"}</span>
                                        {ans.authorRole === "teacher" && (
                                            <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs text-[#1d4ed8]">
                                  Teacher
                                </span>
                                        )}
                                        {ans.accepted && (
                                            <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                                  ✓ Accepted
                                </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-secondary-foreground">{ans.content}</p>
                                    </div>
                                ))}
                              </div>
                          )}

                          {/* Reply toggle */}
                          {replyTo === q.id ? (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply…"
                                    rows={2}
                                    className="resize-none text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                      size="sm"
                                      onClick={() => handleReply(q.id)}
                                      disabled={!replyText.trim() || sendingReply}
                                  >
                                    {sendingReply ? "Sending…" : "Reply"}
                                  </Button>
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => { setReplyTo(null); setReplyText(""); }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                          ) : (
                              <button
                                  onClick={() => setReplyTo(q.id)}
                                  className="mt-2 text-xs text-secondary-foreground hover:text-foreground"
                              >
                                Reply
                              </button>
                          )}
                        </div>
                    ))}
                  </div>
              )}
            </SectionCard>
          </TabsContent>

          {/* ── Live Chat ── */}
          {isLive && (
              <TabsContent value="chat">
                <SectionCard title="Live Chat">
                  <div className="flex h-[400px] flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {chatMessages.length === 0 ? (
                          <p className="py-4 text-center text-sm text-secondary-foreground">
                            No messages yet. Say hello!
                          </p>
                      ) : (
                          chatMessages.map((msg) => (
                              <div key={msg.id} className="flex items-start gap-2">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                                  {(msg.authorName ?? "?")[0].toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-xs font-medium">{msg.authorName ?? "User"} </span>
                                  <span className="text-xs text-secondary-foreground">
                            {msg.sentAt
                                ? new Date(msg.sentAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                                : ""}
                          </span>
                                  <p className="text-sm">{msg.content}</p>
                                </div>
                              </div>
                          ))
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Input */}
                    <div className="mt-3 flex gap-2 border-t border-border pt-3">
                      <input
                          type="text"
                          value={chatText}
                          onChange={(e) => setChatText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                          placeholder="Send a message…"
                          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                      />
                      <Button
                          size="sm"
                          onClick={handleSendChat}
                          disabled={!chatText.trim() || sendingChat}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>
          )}

          {/* ── Notes ── */}
          <TabsContent value="notes">
            <SectionCard title="My Notes">
              <p className="mb-3 text-sm text-secondary-foreground">
                Your personal notes for this lecture. Not submitted or shared.
              </p>
              <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your notes here…"
                  className="min-h-48"
              />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
  );
}
