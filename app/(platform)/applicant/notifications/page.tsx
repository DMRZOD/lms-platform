"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { NotificationItem } from "@/components/applicant/notification-item";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/constants/applicant-mock-data";
import type { AppNotification, NotificationType } from "@/types/applicant";

const filterOptions: { label: string; value: "all" | NotificationType }[] = [
  { label: "All", value: "all" },
  { label: "Status", value: "status_change" },
  { label: "Documents", value: "document" },
  { label: "Exams", value: "exam" },
  { label: "Appeal", value: "appeal" },
];

export default function ApplicantNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | NotificationType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="All notifications about your admission process"
      />

      {/* Stat */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Unread</p>
          <p className="mt-1 text-2xl font-bold">{unreadCount}</p>
        </div>
      </div>

      {/* Filters + mark all */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={filter === opt.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-secondary-foreground">
            No notifications
          </p>
        ) : (
          filtered.map((notif) => (
            <div key={notif.id} onClick={() => markRead(notif.id)}>
              <NotificationItem notification={notif} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
