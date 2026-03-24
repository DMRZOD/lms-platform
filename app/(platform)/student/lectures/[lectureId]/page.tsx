"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { SectionCard } from "@/components/student/section-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { QAThread } from "@/components/student/qa-thread";
import { LiveChat } from "@/components/student/live-chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  mockLectures,
  mockQAMessages,
  mockChatMessages,
} from "@/constants/student-mock-data";
import type { QAMessage, ChatMessage } from "@/types/student";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Link as LinkIcon,
  Play,
  Radio,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const materialIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  slides: FileText,
  video: Play,
  link: LinkIcon,
};

export default function LectureDetailPage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const lecture = mockLectures.find((l) => l.id === lectureId);

  const qaIdRef = useRef(0);
  const chatIdRef = useRef(0);
  const [qaMessages, setQAMessages] = useState<QAMessage[]>(
    mockQAMessages.filter((m) => m.lectureId === lectureId),
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [notes, setNotes] = useState("");

  if (!lecture) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary-foreground">Lecture not found.</p>
        <Link href="/student/lectures" className="mt-2 text-sm underline">
          Back to lectures
        </Link>
      </div>
    );
  }

  const isLive = lecture.status === "live";

  const handleSendQA = (content: string, parentId?: string) => {
    qaIdRef.current += 1;
    const newMsg: QAMessage = {
      id: `qa-new-${qaIdRef.current}`,
      lectureId: lecture.id,
      authorName: "Amir Saidov",
      authorRole: "student",
      content,
      timestamp: new Date().toISOString(),
      parentId,
      upvotes: 0,
    };
    setQAMessages((prev) => [...prev, newMsg]);
  };

  const handleUpvote = (messageId: string) => {
    setQAMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, upvotes: m.upvotes + 1 } : m)),
    );
  };

  const handleSendChat = (content: string) => {
    chatIdRef.current += 1;
    const newMsg: ChatMessage = {
      id: `cm-new-${chatIdRef.current}`,
      authorName: "Amir Saidov",
      content,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div>
      <div className="mb-2">
        <Link href="/student/lectures" className="text-sm text-secondary-foreground hover:text-foreground">
          ← Back to lectures
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6 rounded-lg border border-border bg-background p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                isLive ? "bg-red-100" : "bg-secondary",
              )}
            >
              {isLive ? (
                <Radio className="h-6 w-6 text-red-600" />
              ) : (
                <Video className="h-6 w-6 text-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{lecture.title}</h1>
              <p className="mt-0.5 text-sm text-secondary-foreground">{lecture.courseName}</p>
            </div>
          </div>
          <StudentStatusBadge status={lecture.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {lecture.teacherName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(lecture.date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {lecture.startTime} – {lecture.endTime}
          </span>
        </div>

        <p className="mt-3 text-sm text-secondary-foreground">{lecture.description}</p>

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

        {lecture.attendanceStatus && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-secondary-foreground">Your attendance:</span>
            <StudentStatusBadge status={lecture.attendanceStatus} />
          </div>
        )}
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="materials">
        <TabsList className="mb-6">
          <TabsTrigger value="materials">Materials ({lecture.materials.length})</TabsTrigger>
          <TabsTrigger value="qa">Q&A ({qaMessages.filter((m) => !m.parentId).length})</TabsTrigger>
          {isLive && <TabsTrigger value="chat">Live Chat</TabsTrigger>}
          <TabsTrigger value="notes">My Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <SectionCard title="Lecture Materials">
            {lecture.materials.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No materials uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {lecture.materials.map((mat) => {
                  const Icon = materialIcons[mat.type] ?? FileText;
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
                      <a href={mat.url} download>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                      </a>
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
                    <Button variant="outline" size="sm">
                      Watch
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="qa">
          <SectionCard title="Q&A">
            <QAThread
              messages={qaMessages}
              onSend={handleSendQA}
              onUpvote={handleUpvote}
            />
          </SectionCard>
        </TabsContent>

        {isLive && (
          <TabsContent value="chat">
            <SectionCard title="Live Chat" className="flex h-[500px] flex-col">
              <div className="flex flex-1 flex-col overflow-hidden">
                <LiveChat messages={chatMessages} onSend={handleSendChat} />
              </div>
            </SectionCard>
          </TabsContent>
        )}

        <TabsContent value="notes">
          <SectionCard title="My Notes">
            <p className="mb-3 text-sm text-secondary-foreground">
              Your personal notes for this lecture. Not submitted or shared.
            </p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              className="min-h-48"
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
