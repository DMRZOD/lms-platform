"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { LectureStatusBadge } from "@/components/teacher/lecture-status-badge";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiLecture, ApiCourse } from "@/lib/teacher-api";
import {
  mockChatMessages, mockQAQuestions, mockLectureAttendance, mockMaterialComments,
} from "@/constants/teacher-mock-data";
import {
  ChevronLeft, Eye, EyeOff, Link2, MessageSquare,
  Pencil, Radio, Save, Send, Square, Trash2, Video, X,
} from "lucide-react";
import Link from "next/link";
import { useState as useLocalState } from "react";

const TABS = ["Info", "Attendance", "Chat", "Q&A", "Comments"];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function LectureDetailPage() {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  const numCourseId  = Number(courseId);
  const numLectureId = Number(lectureId);

  const [lecture, setLecture]     = useState<ApiLecture | null>(null);
  const [course, setCourse]       = useState<ApiCourse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Info");

  // Edit state
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [editForm, setEditForm]   = useState({
    title: "", topic: "", outline: "", learningOutcomes: "",
    scheduledStart: "", scheduledEnd: "", deliveryMode: "", recordingLink: "",
  });

  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg]         = useState<string | null>(null);

  // Mock states
  const [chatMessages, setChatMessages]   = useLocalState(mockChatMessages.filter((m) => m.lectureId === lectureId));
  const [qaQuestions, setQaQuestions]     = useLocalState(mockQAQuestions.filter((q) => q.lectureId === lectureId));
  const [answerText, setAnswerText]       = useLocalState<Record<string, string>>({});

  const attendance = mockLectureAttendance.find((a) => a.lectureId === lectureId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [lectureRes, courseRes] = await Promise.allSettled([
        teacherApi.getLecture(numLectureId, numCourseId),
        teacherApi.getCourse(numCourseId),
      ]);
      if (lectureRes.status === "fulfilled") {
        const l = lectureRes.value;
        setLecture(l);
        setEditForm({
          title:            l.title,
          topic:            l.topic ?? "",
          outline:          l.outline ?? "",
          learningOutcomes: l.learningOutcomes ?? "",
          scheduledStart:   l.scheduledStart ? l.scheduledStart.slice(0, 16) : "",
          scheduledEnd:     l.scheduledEnd   ? l.scheduledEnd.slice(0, 16)   : "",
          deliveryMode:     l.deliveryMode   ?? "TEAMS",
          recordingLink:    l.recordingLink  ?? "",
        });
      } else {
        setError("Failed to load lecture");
      }
      if (courseRes.status === "fulfilled") setCourse(courseRes.value);
    } finally {
      setLoading(false);
    }
  }, [numLectureId, numCourseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Save Edit ──
  const handleSaveEdit = async () => {
    if (!lecture) return;
    setSaving(true);
    try {
      const updated = await teacherApi.updateLecture(numLectureId, numCourseId, {
        title:            editForm.title.trim(),
        topic:            editForm.topic.trim(),
        outline:          editForm.outline.trim(),
        learningOutcomes: editForm.learningOutcomes.trim(),
        scheduledStart:   editForm.scheduledStart ? new Date(editForm.scheduledStart).toISOString() : undefined,
        scheduledEnd:     editForm.scheduledEnd   ? new Date(editForm.scheduledEnd).toISOString()   : undefined,
        deliveryMode:     editForm.deliveryMode,
        recordingLink:    editForm.recordingLink.trim() || undefined,
        version:          lecture.version,
      });
      setLecture(updated);
      setEditing(false);
      setActionMsg("Lecture updated successfully!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to update lecture");
    } finally {
      setSaving(false);
    }
  };

  // ── Publish / Unpublish ──
  const handlePublish = async () => {
    if (!lecture) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const isPublished = lecture.status === "PUBLISHED";
      if (isPublished) {
        await teacherApi.unpublishLecture(numLectureId, numCourseId);
      } else {
        await teacherApi.publishLecture(numLectureId, numCourseId);
      }
      await fetchData();
      setActionMsg(isPublished ? "Lecture unpublished!" : "Lecture published!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />)}
        </div>
    );
  }

  if (error || !lecture) {
    return (
        <div className="py-12 text-center">
          <p className="text-secondary-foreground">{error ?? "Lecture not found."}</p>
          <Link href={`/teacher/courses/${courseId}/modules`} className="mt-2 text-sm underline">
            Back to Modules
          </Link>
        </div>
    );
  }

  const isLive      = lecture.status === "LIVE";
  const isPublished = lecture.status === "PUBLISHED";

  return (
      <div>
        <Link
            href={`/teacher/courses/${courseId}/modules`}
            className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Modules
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-secondary-foreground">{course?.title ?? ""}</p>
            <div className="mt-1 flex items-center gap-2">
              <PageHeader title={lecture.title} />
              <LectureStatusBadge status={lecture.status?.toLowerCase() as "live" | "scheduled" | "completed" | "cancelled"} />
            </div>
            {lecture.scheduledStart && (
                <p className="text-sm text-secondary-foreground">
                  {formatDateTime(lecture.scheduledStart)}
                  {lecture.scheduledEnd && ` – ${formatDateTime(lecture.scheduledEnd)}`}
                  {lecture.deliveryMode && ` · ${lecture.deliveryMode}`}
                </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Publish / Unpublish */}
            <button
                disabled={actionLoading}
                onClick={handlePublish}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                    isPublished
                        ? "bg-[#ef4444] hover:bg-[#dc2626]"
                        : "bg-[#16a34a] hover:bg-[#15803d]"
                }`}
            >
              {isPublished ? (
                  <><Square className="h-4 w-4" /> Unpublish</>
              ) : (
                  <><Radio className="h-4 w-4" /> Publish</>
              )}
            </button>
            {/* Edit */}
            <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              {editing ? <><X className="h-4 w-4" /> Cancel</> : <><Pencil className="h-4 w-4" /> Edit</>}
            </button>
          </div>
        </div>

        {actionMsg && (
            <div className="mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm">
              {actionMsg}
            </div>
        )}

        {/* Edit Form */}
        {editing && (
            <div className="mb-6 rounded-lg border border-border bg-background p-5 space-y-4">
              <h2 className="font-semibold">Edit Lecture</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Title</label>
                  <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Topic</label>
                  <input
                      type="text"
                      value={editForm.topic}
                      onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Outline</label>
                <textarea
                    value={editForm.outline}
                    onChange={(e) => setEditForm({ ...editForm, outline: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Learning Outcomes</label>
                <textarea
                    value={editForm.learningOutcomes}
                    onChange={(e) => setEditForm({ ...editForm, learningOutcomes: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Start</label>
                  <input
                      type="datetime-local"
                      value={editForm.scheduledStart}
                      onChange={(e) => setEditForm({ ...editForm, scheduledStart: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">End</label>
                  <input
                      type="datetime-local"
                      value={editForm.scheduledEnd}
                      onChange={(e) => setEditForm({ ...editForm, scheduledEnd: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Delivery Mode</label>
                  <select
                      value={editForm.deliveryMode}
                      onChange={(e) => setEditForm({ ...editForm, deliveryMode: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  >
                    {["TEAMS", "OFFLINE", "HYBRID"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Recording Link</label>
                  <input
                      type="url"
                      value={editForm.recordingLink}
                      onChange={(e) => setEditForm({ ...editForm, recordingLink: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditing(false)} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
                  Cancel
                </button>
                <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === tab
                            ? "border-foreground text-foreground"
                            : "border-transparent text-secondary-foreground hover:text-foreground"
                    }`}
                >
                  {tab}
                </button>
            ))}
          </div>
        </div>

        {/* ── Info Tab ── */}
        {activeTab === "Info" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                {lecture.outline && (
                    <SectionCard title="Outline">
                      <pre className="whitespace-pre-wrap text-sm">{lecture.outline}</pre>
                    </SectionCard>
                )}
                {lecture.learningOutcomes && (
                    <SectionCard title="Learning Outcomes">
                      <pre className="whitespace-pre-wrap text-sm">{lecture.learningOutcomes}</pre>
                    </SectionCard>
                )}
              </div>
              <div className="space-y-4">
                <SectionCard title="Details">
                  <div className="space-y-2 text-sm">
                    {([
                      ["Topic",         lecture.topic ?? "—"],
                      ["Delivery",      lecture.deliveryMode ?? "—"],
                      ["Status",        lecture.status ?? "—"],
                      ["Version",       String(lecture.version)],
                      ["Start",         lecture.scheduledStart ? formatDateTime(lecture.scheduledStart) : "—"],
                      ["End",           lecture.scheduledEnd   ? formatDateTime(lecture.scheduledEnd)   : "—"],
                    ] as [string, string][]).map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-secondary-foreground">{label}</span>
                          <span className="font-medium text-right">{value}</span>
                        </div>
                    ))}
                  </div>
                </SectionCard>
                {lecture.recordingLink && (
                    <a
                    href={lecture.recordingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm font-medium hover:bg-secondary"
                  >
                  <Video className="h-4 w-4 text-secondary-foreground" />
                  View Recording
                  </a>
                  )}
              </div>
            </div>
        )}

        {/* ── Attendance Tab (mock) ── */}
        {activeTab === "Attendance" && (
            <div>
              {!attendance ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-secondary-foreground">Attendance data not available</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {([
                        ["Attendance", `${attendance.attendanceRate}%`],
                        ["Present",   String(attendance.presentCount)],
                        ["Absent",    String(attendance.totalCount - attendance.presentCount)],
                        ["Total",     String(attendance.totalCount)],
                      ] as [string, string][]).map(([label, value]) => (
                          <div key={label} className="rounded-lg border border-border bg-background p-4">
                            <p className="text-xs text-secondary-foreground">{label}</p>
                            <p className="text-2xl font-bold">{value}</p>
                          </div>
                      ))}
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary">
                        <tr>
                          <th className="p-3 text-left font-medium">Student</th>
                          <th className="p-3 text-left font-medium">Status</th>
                          <th className="p-3 text-left font-medium">Entry</th>
                          <th className="p-3 text-left font-medium">Exit</th>
                          <th className="p-3 text-left font-medium">Duration</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attendance.records.map((rec) => (
                            <tr key={rec.studentId} className="border-t border-border">
                              <td className="p-3 font-medium">{rec.studentName}</td>
                              <td className="p-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              rec.status === "present" ? "bg-[#dcfce7] text-[#166534]"
                                  : rec.status === "late"  ? "bg-[#fef9c3] text-[#854d0e]"
                                      : "bg-[#fee2e2] text-[#991b1b]"
                          }`}>
                            {rec.status}
                          </span>
                              </td>
                              <td className="p-3 text-secondary-foreground">{rec.entryTime ?? "—"}</td>
                              <td className="p-3 text-secondary-foreground">{rec.exitTime ?? "—"}</td>
                              <td className="p-3 text-secondary-foreground">
                                {rec.duration ? `${rec.duration}m` : rec.absenceReason ?? "—"}
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              )}
            </div>
        )}

        {/* ── Chat Tab (mock) ── */}
        {activeTab === "Chat" && (
            <div className="space-y-2">
              <p className="text-xs text-secondary-foreground">{chatMessages.length} messages</p>
              {chatMessages.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No chat messages</p>
              ) : (
                  chatMessages.map((msg) => (
                      <div
                          key={msg.id}
                          className={`flex items-start justify-between gap-3 rounded-md border border-border p-3 ${msg.isHidden ? "opacity-50" : ""}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{msg.authorName}</span>
                            <span className="text-xs text-secondary-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                          </div>
                          <p className="mt-0.5 text-sm">{msg.content}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                              onClick={() => setChatMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isHidden: !m.isHidden } : m))}
                              className="rounded p-1 text-secondary-foreground hover:text-foreground"
                          >
                            {msg.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button
                              onClick={() => setChatMessages((prev) => prev.filter((m) => m.id !== msg.id))}
                              className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                  ))
              )}
            </div>
        )}

        {/* ── Q&A Tab (mock) ── */}
        {activeTab === "Q&A" && (
            <div className="space-y-4">
              {qaQuestions.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No questions for this lecture</p>
              ) : (
                  qaQuestions.map((q) => (
                      <div key={q.id} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{q.title}</p>
                            <p className="mt-0.5 text-sm text-secondary-foreground">{q.content}</p>
                            <p className="mt-1 text-xs text-secondary-foreground">
                              {q.authorName} · {new Date(q.createdAt).toLocaleString()} · {q.votes} votes
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                              q.status === "open"     ? "bg-[#fef9c3] text-[#854d0e]"
                                  : q.status === "answered" ? "bg-[#dcfce7] text-[#166534]"
                                      : "bg-[#f0f0f0] text-[#666]"
                          }`}>
                    {q.status}
                  </span>
                        </div>

                        {q.answers.length > 0 && (
                            <div className="mt-3 ml-4 border-l-2 border-border pl-4 space-y-2">
                              {q.answers.map((ans) => (
                                  <div key={ans.id}>
                                    <span className="text-xs font-medium">{ans.authorName}</span>
                                    <p className="text-sm">{ans.content}</p>
                                  </div>
                              ))}
                            </div>
                        )}

                        {q.status === "open" && (
                            <div className="mt-3 flex gap-2">
                    <textarea
                        value={answerText[q.id] ?? ""}
                        onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                        rows={2}
                        placeholder="Write your answer..."
                        className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                              <button
                                  onClick={() => {
                                    if (!answerText[q.id]?.trim()) return;
                                    setQaQuestions((prev) => prev.map((qq) =>
                                        qq.id === q.id
                                            ? {
                                              ...qq,
                                              status: "answered" as const,
                                              answers: [...qq.answers, {
                                                id: `ans-${Date.now()}`,
                                                questionId: qq.id,
                                                authorId: "tch-001",
                                                authorName: "Teacher",
                                                authorRole: "teacher" as const,
                                                content: answerText[q.id],
                                                createdAt: new Date().toISOString(),
                                                isAccepted: false,
                                                isHidden: false,
                                              }],
                                            }
                                            : qq
                                    ));
                                    setAnswerText({ ...answerText, [q.id]: "" });
                                  }}
                                  className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                        )}
                      </div>
                  ))
              )}
            </div>
        )}

        {/* ── Comments Tab (mock) ── */}
        {activeTab === "Comments" && (
            <div className="space-y-3">
              {mockMaterialComments
                  .filter((c) => c.lectureId === lectureId)
                  .map((comment) => (
                      <div key={comment.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-secondary-foreground" />
                            <span className="text-sm font-medium">{comment.authorName}</span>
                            <span className="text-xs text-secondary-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                        </div>
                        <button className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                  ))}
              {mockMaterialComments.filter((c) => c.lectureId === lectureId).length === 0 && (
                  <p className="text-sm text-secondary-foreground">No comments for this lecture</p>
              )}
            </div>
        )}
      </div>
  );
}