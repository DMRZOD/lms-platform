"use client";

import type { QAMessage } from "@/types/student";
import { useState } from "react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type QAThreadProps = {
  messages: QAMessage[];
  onSend: (content: string, parentId?: string) => void;
  onUpvote: (messageId: string) => void;
};

function QAMessageCard({
  message,
  replies,
  onReply,
  onUpvote,
}: {
  message: QAMessage;
  replies: QAMessage[];
  onReply: (parentId: string, content: string) => void;
  onUpvote: (id: string) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(message.id, replyText.trim());
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
            {message.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{message.authorName}</p>
              {message.authorRole === "teacher" && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  Teacher
                </span>
              )}
              {message.isAccepted && (
                <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700">
                  Accepted Answer
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed">{message.content}</p>
            <p className="mt-1.5 text-xs text-secondary-foreground">
              {new Date(message.timestamp).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <button
          onClick={() => onUpvote(message.id)}
          className="flex shrink-0 flex-col items-center gap-0.5 rounded-md border border-border p-1.5 text-xs text-secondary-foreground hover:bg-secondary"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{message.upvotes}</span>
        </button>
      </div>

      {replies.length > 0 && (
        <div className="mt-3 ml-11 space-y-3 border-l-2 border-border pl-3">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {reply.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-semibold">{reply.authorName}</p>
                  {reply.authorRole === "teacher" && (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                      Teacher
                    </span>
                  )}
                  {reply.isAccepted && (
                    <span className="rounded-full border border-green-200 bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                      ✓ Accepted
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 ml-11 flex items-center gap-2">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1.5 text-xs text-secondary-foreground hover:text-foreground"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Reply
        </button>
      </div>

      {showReplyForm && (
        <div className="mt-3 ml-11 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-16 text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleReply}>
              Post Reply
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowReplyForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function QAThread({ messages, onSend, onUpvote }: QAThreadProps) {
  const [newQuestion, setNewQuestion] = useState("");

  const topLevel = messages.filter((m) => !m.parentId).sort((a, b) => b.upvotes - a.upvotes);

  const handleSend = () => {
    if (!newQuestion.trim()) return;
    onSend(newQuestion.trim());
    setNewQuestion("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this lecture..."
          className="min-h-20"
        />
        <Button onClick={handleSend} disabled={!newQuestion.trim()}>
          Post Question
        </Button>
      </div>

      {topLevel.length === 0 ? (
        <p className="py-6 text-center text-sm text-secondary-foreground">
          No questions yet. Be the first to ask!
        </p>
      ) : (
        <div className="space-y-3">
          {topLevel.map((msg) => (
            <QAMessageCard
              key={msg.id}
              message={msg}
              replies={messages.filter((m) => m.parentId === msg.id)}
              onReply={(parentId, content) => onSend(content, parentId)}
              onUpvote={onUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
