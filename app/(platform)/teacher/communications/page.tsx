"use client";

import { PageHeader } from "@/components/platform/page-header";
import {
  mockChatMessages,
  mockCourses,
  mockMaterialComments,
  mockQAQuestions,
} from "@/constants/teacher-mock-data";
import { CheckCircle, EyeOff, MessageSquare, Send, Trash2 } from "lucide-react";
import { useState } from "react";

type ChannelTab = "Chat" | "Q&A" | "Comments";

export default function CommunicationsPage() {
  const [activeChannel, setActiveChannel] = useState<ChannelTab>("Chat");
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  const [qaQuestions, setQaQuestions] = useState(mockQAQuestions);
  const [comments, setComments] = useState(mockMaterialComments);
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [filterCourse, setFilterCourse] = useState("all");

  const handleHideChat = (id: string) =>
    setChatMessages(chatMessages.map((m) => (m.id === id ? { ...m, isHidden: true } : m)));
  const handleDeleteChat = (id: string) =>
    setChatMessages(chatMessages.filter((m) => m.id !== id));
  const handleHideComment = (id: string) =>
    setComments(comments.map((c) => (c.id === id ? { ...c, isHidden: true } : c)));

  const handleAnswerQA = (qId: string) => {
    if (!answerText[qId]?.trim()) return;
    setQaQuestions(
      qaQuestions.map((q) =>
        q.id === qId
          ? {
              ...q,
              status: "answered" as const,
              answers: [
                ...q.answers,
                {
                  id: `ans-comm-${Date.now()}`,
                  questionId: qId,
                  authorId: "tch-001",
                  authorName: "Dr. Elena Volkova",
                  authorRole: "teacher" as const,
                  content: answerText[qId],
                  createdAt: new Date().toISOString(),
                  isAccepted: false,
                  isHidden: false,
                },
              ],
            }
          : q,
      ),
    );
    setAnswerText({ ...answerText, [qId]: "" });
  };

  return (
    <div>
      <div className="mb-6">
        <PageHeader
          title="Communications"
          description="Moderate chat, Q&A, and material comments"
        />
      </div>

      {/* Channel Tabs */}
      <div className="mb-6 border-b border-border">
        <div className="flex">
          {(["Chat", "Q&A", "Comments"] as ChannelTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveChannel(tab)}
              className={`border-b-2 px-5 py-2.5 text-sm font-medium transition-colors ${
                activeChannel === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-secondary-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {tab === "Q&A" && qaQuestions.filter((q) => q.status === "open").length > 0 && (
                <span className="ml-2 rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-xs text-[#991b1b]">
                  {qaQuestions.filter((q) => q.status === "open").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-3">
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

      {/* Chat Tab */}
      {activeChannel === "Chat" && (
        <div className="space-y-2">
          <p className="text-xs text-secondary-foreground">
            {chatMessages.filter((m) => !m.isHidden).length} visible messages
          </p>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start justify-between gap-3 rounded-lg border border-border p-4 ${
                msg.isHidden ? "opacity-40" : "bg-background"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  {msg.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{msg.authorName}</span>
                    <span className="text-xs text-secondary-foreground">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    {msg.isHidden && (
                      <span className="rounded-full bg-[#f0f0f0] px-1.5 py-0.5 text-xs text-[#666]">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm">{msg.content}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHideChat(msg.id)}
                  className="rounded p-1 text-secondary-foreground hover:text-foreground"
                  title="Hide"
                >
                  <EyeOff className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteChat(msg.id)}
                  className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <p className="text-sm text-secondary-foreground">No chat messages</p>
          )}
        </div>
      )}

      {/* Q&A Tab */}
      {activeChannel === "Q&A" && (
        <div className="space-y-4">
          {qaQuestions.map((q) => (
            <div key={q.id} className="rounded-lg border border-border bg-background p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{q.title}</h3>
                  <p className="mt-0.5 text-sm text-secondary-foreground">{q.content}</p>
                  <p className="mt-1 text-xs text-secondary-foreground">
                    {q.authorName} · {q.courseName}
                    {q.lectureTopic ? ` · ${q.lectureTopic}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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

              {q.answers.map((ans) => (
                <div key={ans.id} className="mb-2 ml-4 rounded-md bg-secondary p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{ans.authorName}</span>
                    {ans.isAccepted && (
                      <span className="flex items-center gap-1 text-xs text-[#16a34a]">
                        <CheckCircle className="h-3 w-3" /> Best
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{ans.content}</p>
                </div>
              ))}

              {q.status === "open" && (
                <div className="mt-2 flex gap-2">
                  <textarea
                    value={answerText[q.id] ?? ""}
                    onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                    rows={2}
                    placeholder="Answer..."
                    className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                  <button
                    onClick={() => handleAnswerQA(q.id)}
                    disabled={!answerText[q.id]?.trim()}
                    className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {qaQuestions.length === 0 && (
            <p className="text-sm text-secondary-foreground">No questions</p>
          )}
        </div>
      )}

      {/* Comments Tab */}
      {activeChannel === "Comments" && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`flex items-start justify-between gap-3 rounded-lg border border-border p-4 ${
                comment.isHidden ? "opacity-40" : "bg-background"
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.authorName}</span>
                    <span className="text-xs text-secondary-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm">{comment.content}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleHideComment(comment.id)}
                  className="rounded p-1 text-secondary-foreground hover:text-foreground"
                >
                  <EyeOff className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setComments(comments.filter((c) => c.id !== comment.id))}
                  className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-secondary-foreground">No comments</p>
          )}
        </div>
      )}
    </div>
  );
}
