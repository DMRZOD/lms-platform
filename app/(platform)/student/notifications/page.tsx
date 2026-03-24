"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { NotificationItem } from "@/components/student/notification-item";
import { EmptyState } from "@/components/student/empty-state";
import { mockNotifications } from "@/constants/student-mock-data";
import type { StudentNotificationType } from "@/types/student";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "unread" | StudentNotificationType;

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Lectures", value: "lecture" },
  { label: "Assignments", value: "assignment" },
  { label: "Grades", value: "grade" },
  { label: "Exams", value: "exam" },
  { label: "Finance", value: "finance" },
  { label: "Attendance", value: "attendance" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader
          title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
          description="All your alerts and updates"
        />
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
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
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description={activeFilter === "unread" ? "You're all caught up!" : "No notifications for this filter."}
          />
        ) : (
          <div className="-mx-2 divide-y divide-border">
            {filtered
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((n) => (
                <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
              ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
