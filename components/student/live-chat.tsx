"use client";

import type { ChatMessage } from "@/types/student";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type LiveChatProps = {
  messages: ChatMessage[];
  onSend: (content: string) => void;
};

export function LiveChat({ messages, onSend }: LiveChatProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-1">
        {messages.map((msg) => {
          const isMe = msg.authorName === "Amir Saidov";
          return (
            <div key={msg.id} className={cn("flex gap-2", isMe && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isMe ? "bg-foreground text-background" : "bg-secondary text-foreground",
                )}
              >
                {msg.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className={cn("max-w-[75%]", isMe && "items-end")}>
                <p
                  className={cn(
                    "text-xs text-secondary-foreground",
                    isMe && "text-right",
                  )}
                >
                  {isMe ? "You" : msg.authorName}
                </p>
                <div
                  className={cn(
                    "mt-0.5 rounded-2xl px-3 py-2 text-sm",
                    isMe
                      ? "rounded-tr-sm bg-foreground text-background"
                      : "rounded-tl-sm bg-secondary",
                  )}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
