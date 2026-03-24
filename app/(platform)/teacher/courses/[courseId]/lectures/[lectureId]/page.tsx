"use client";

import { PageHeader } from "@/components/platform/page-header";
import { LectureStatusBadge } from "@/components/teacher/lecture-status-badge";
import { SectionCard } from "@/components/teacher/section-card";
import {
  mockChatMessages,
  mockCourses,
  mockLectureAttendance,
  mockLectures,
  mockMaterialComments,
  mockQAQuestions,
} from "@/constants/teacher-mock-data";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  Link2,
  MessageSquare,
  Pencil,
  Radio,
  Send,
  Square,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const TABS = ["Info", "Materials", "Attendance", "Chat", "Q&A", "Comments"];

export default function LectureDetailPage() {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  const course = mockCourses.find((c) => c.id === courseId) ?? mockCourses[0];
  const lecture = mockLectures.find((l) => l.id === lectureId) ?? mockLectures[2];

  const [activeTab, setActiveTab] = useState("Info");
  const [isLive, setIsLive] = useState(lecture.status === "live");
  const [chatMessages, setChatMessages] = useState(
    mockChatMessages.filter((m) => m.lectureId === lecture.id),
  );
  const [qaQuestions, setQaQuestions] = useState(
    mockQAQuestions.filter((q) => q.lectureId === lecture.id),
  );
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const attendance = mockLectureAttendance.find((a) => a.lectureId === lecture.id);

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
          <p className="text-xs text-secondary-foreground">{course.code} · {lecture.courseCode}</p>
          <div className="mt-1 flex items-center gap-2">
            <PageHeader title={lecture.topic} />
            <LectureStatusBadge status={isLive ? "live" : lecture.status} />
          </div>
          <p className="text-sm text-secondary-foreground">
            {lecture.date} · {lecture.startTime}–{lecture.endTime} · {lecture.room ?? "Online"}
          </p>
        </div>
        <div className="flex gap-2">
          {!isLive && lecture.status !== "completed" && lecture.teamsLink && (
            <button
              onClick={() => setIsLive(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
            >
              <Radio className="h-4 w-4" />
              Start Lecture in Teams
            </button>
          )}
          {isLive && (
            <button
              onClick={() => setIsLive(false)}
              className="flex items-center gap-1.5 rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]"
            >
              <Square className="h-4 w-4" />
              End Lecture
            </button>
          )}
        </div>
      </div>

      {/* Live Indicator */}
      {isLive && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] p-4">
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#166534]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#22c55e]" />
            Lecture is live — attendance tracking active
          </span>
          <a
            href={lecture.teamsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 rounded-md border border-[#bbf7d0] bg-white px-3 py-1.5 text-xs font-medium text-[#166534] hover:bg-[#f0fdf4]"
          >
            <Link2 className="h-3.5 w-3.5" /> Open Teams
          </a>
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

      {/* Info Tab */}
      {activeTab === "Info" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <SectionCard title="Lecture Plan">
              <pre className="whitespace-pre-wrap text-sm">{lecture.plan}</pre>
            </SectionCard>
            <SectionCard title="Learning Outcomes">
              <ul className="space-y-2">
                {lecture.learningOutcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
                    {o}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
          <div className="space-y-4">
            <SectionCard title="Details">
              <div className="space-y-2 text-sm">
                {[
                  ["Group", lecture.group],
                  ["Date", lecture.date],
                  ["Time", `${lecture.startTime}–${lecture.endTime}`],
                  ["Room", lecture.room ?? "Online"],
                  ["Q&A closes", `After ${lecture.qaCloseAfterHours}h`],
                  ["Chat", lecture.chatEnabled ? "Enabled" : "Disabled"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-secondary-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
            {lecture.teamsRecordingUrl && (
              <a
                href={lecture.teamsRecordingUrl}
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

      {/* Materials Tab */}
      {activeTab === "Materials" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">
              {lecture.materials.length} material{lecture.materials.length !== 1 ? "s" : ""}
            </p>
            <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary">
              <Upload className="h-4 w-4" /> Upload Material
            </button>
          </div>

          {lecture.materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border p-12 text-center">
              <Upload className="mb-2 h-8 w-8 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">No materials uploaded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lecture.materials.map((mat, idx) => (
                <div
                  key={mat.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-4"
                >
                  <FileText className="h-5 w-5 flex-shrink-0 text-secondary-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{mat.title}</p>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs uppercase text-secondary-foreground">
                        {mat.type}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          mat.versionType === "major"
                            ? "bg-[#ffedd5] text-[#9a3412]"
                            : "bg-[#f0f0f0] text-[#666]"
                        }`}
                      >
                        {mat.versionType}
                      </span>
                    </div>
                    {mat.description && (
                      <p className="mt-0.5 text-xs text-secondary-foreground">{mat.description}</p>
                    )}
                    {mat.fileSize && (
                      <p className="text-xs text-secondary-foreground">{mat.fileSize}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      className="rounded p-1 text-secondary-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      disabled={idx === lecture.materials.length - 1}
                      className="rounded p-1 text-secondary-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-secondary-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "Attendance" && (
        <div>
          {!attendance ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-secondary-foreground">
                Attendance data will be available after the lecture
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-secondary-foreground">Attendance</p>
                  <p className="text-2xl font-bold">{attendance.attendanceRate}%</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-secondary-foreground">Present</p>
                  <p className="text-2xl font-bold">{attendance.presentCount}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-secondary-foreground">Absent</p>
                  <p className="text-2xl font-bold text-[#ef4444]">
                    {attendance.totalCount - attendance.presentCount}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-secondary-foreground">Total</p>
                  <p className="text-2xl font-bold">{attendance.totalCount}</p>
                </div>
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
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              rec.status === "present"
                                ? "bg-[#dcfce7] text-[#166534]"
                                : rec.status === "late"
                                  ? "bg-[#fef9c3] text-[#854d0e]"
                                  : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                          >
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

      {/* Chat Tab */}
      {activeTab === "Chat" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">{chatMessages.length} messages</p>
          </div>
          {chatMessages.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No chat messages for this lecture</p>
          ) : (
            <div className="space-y-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start justify-between gap-3 rounded-md border border-border p-3 ${
                    msg.isHidden ? "opacity-50" : ""
                  }`}
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
                      onClick={() =>
                        setChatMessages(
                          chatMessages.map((m) =>
                            m.id === msg.id ? { ...m, isHidden: !m.isHidden } : m,
                          ),
                        )
                      }
                      className="rounded p-1 text-secondary-foreground hover:text-foreground"
                      title={msg.isHidden ? "Show" : "Hide"}
                    >
                      {msg.isHidden ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setChatMessages(chatMessages.filter((m) => m.id !== msg.id))
                      }
                      className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Q&A Tab */}
      {activeTab === "Q&A" && (
        <div className="space-y-4">
          {qaQuestions.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No questions for this lecture</p>
          ) : (
            qaQuestions.map((q) => (
              <div key={q.id} className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <p className="mt-0.5 text-sm text-secondary-foreground">{q.content}</p>
                    <p className="mt-1 text-xs text-secondary-foreground">
                      {q.authorName} · {new Date(q.createdAt).toLocaleString()} · {q.votes} votes
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setQaQuestions(
                          qaQuestions.map((qq) =>
                            qq.id === q.id ? { ...qq, isHidden: !qq.isHidden } : qq,
                          ),
                        )
                      }
                      className="rounded p-1 text-secondary-foreground hover:text-foreground"
                    >
                      {q.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {q.answers.length > 0 && (
                  <div className="mb-3 ml-4 border-l-2 border-border pl-4">
                    {q.answers.map((ans) => (
                      <div key={ans.id} className="py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{ans.authorName}</span>
                          {ans.isAccepted && (
                            <span className="rounded-full bg-[#dcfce7] px-1.5 py-0.5 text-xs text-[#166534]">
                              ✓ Best answer
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {q.status === "open" && (
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Write your answer..."
                      value={answerText[q.id] ?? ""}
                      onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                      rows={2}
                      className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                    <button
                      onClick={() => {
                        if (!answerText[q.id]?.trim()) return;
                        setQaQuestions(
                          qaQuestions.map((qq) =>
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
                                      content: answerText[q.id],
                                      createdAt: new Date().toISOString(),
                                      isAccepted: false,
                                      isHidden: false,
                                    },
                                  ],
                                }
                              : qq,
                          ),
                        );
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

      {/* Comments Tab */}
      {activeTab === "Comments" && (
        <div className="space-y-3">
          {mockMaterialComments
            .filter((c) => c.lectureId === lecture.id)
            .map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
              >
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
          {mockMaterialComments.filter((c) => c.lectureId === lecture.id).length === 0 && (
            <p className="text-sm text-secondary-foreground">No comments for this lecture</p>
          )}
        </div>
      )}
    </div>
  );
}
