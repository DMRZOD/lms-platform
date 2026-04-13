"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { EmptyState } from "@/components/student/empty-state";
import { studentApi } from "@/lib/student-api";
import type { ApiNotification } from "@/lib/student-api";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_FILTERS = [
  { label: "All",         value: "all" },
  { label: "Unread",      value: "unread" },
  { label: "Lectures",    value: "lecture" },
  { label: "Assignments", value: "assignment" },
  { label: "Grades",      value: "grade" },
  { label: "Exams",       value: "exam" },
  { label: "Finance",     value: "finance" },
  { label: "System",      value: "system" },
];

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const min  = Math.floor(diff / 60000);
  const hr   = Math.floor(diff / 3600000);
  const day  = Math.floor(diff / 86400000);
  if (min < 1)  return "Just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24)  return `${hr}h ago`;
  return `${day}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [activeFilter, setActiveFilter]   = useState("all");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getNotifications();
      const arr = Array.isArray(data) ? data : [];
      // Sort newest first
      arr.sort((a, b) =>
          new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
      );
      setNotifications(arr);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkRead = async (id: number) => {
    try {
      await studentApi.markNotificationRead(id);
      setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.allSettled(unread.map((n) => studentApi.markNotificationRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "all")    return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchNotifications} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <PageHeader
              title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              description="All your alerts and updates"
          />
          {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map((f) => (
              <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      activeFilter === f.value
                          ? "bg-foreground text-background"
                          : "border border-border bg-background hover:bg-secondary"
                  }`}
              >
                {f.label}
              </button>
          ))}
        </div>

        <SectionCard>
          {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
                ))}
              </div>
          ) : filtered.length === 0 ? (
              <EmptyState
                  icon={Bell}
                  title="No notifications"
                  description={
                    activeFilter === "unread"
                        ? "You're all caught up!"
                        : "No notifications for this filter."
                  }
              />
          ) : (
              <div className="-mx-2 divide-y divide-border">
                {filtered.map((n) => (
                    <div
                        key={n.id}
                        className={`flex items-start gap-3 px-3 py-3 transition-colors hover:bg-secondary/30 ${
                            !n.read ? "bg-secondary/20" : ""
                        }`}
                    >
                      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-foreground" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>
                          {n.title ?? "Notification"}
                        </p>
                        {n.message && (
                            <p className="mt-0.5 text-xs text-secondary-foreground line-clamp-2">
                              {n.message}
                            </p>
                        )}
                        {n.createdAt && (
                            <p className="mt-1 text-xs text-secondary-foreground">
                              {timeAgo(n.createdAt)}
                            </p>
                        )}
                      </div>
                      {!n.read && (
                          <button
                              onClick={() => handleMarkRead(n.id)}
                              className="shrink-0 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary"
                          >
                            Mark read
                          </button>
                      )}
                    </div>
                ))}
              </div>
          )}
        </SectionCard>
      </div>
  );
}
