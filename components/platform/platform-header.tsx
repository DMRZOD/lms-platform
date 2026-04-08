"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notificationApi } from "@/lib/notification-api";
import type { ApiNotification } from "@/lib/notification-api";


const POLL_INTERVAL_MS = 30_000;

function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

const TEMPLATE_LABELS: Record<string, string> = {
    ADMISSION_STATUS_UPDATE: "Admission Update",
    EXAM_REMINDER:           "Exam Reminder",
    GRADE_POSTED:            "Grade Posted",
    GENERAL:                 "Notification",
};


type PlatformHeaderProps = {
    onMenuClickAction: () => void;
};


export function PlatformHeader({ onMenuClickAction }: PlatformHeaderProps) {
    const router = useRouter();

    const [open, setOpen]               = useState(false);
    const [unread, setUnread]           = useState(0);
    const [notifications, setNotifications] = useState<ApiNotification[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const dropdownRef                   = useRef<HTMLDivElement>(null);

    const [avatarOpen, setAvatarOpen]   = useState(false);
    const avatarRef                     = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
                setAvatarOpen(false);
            }
        }
        if (avatarOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [avatarOpen]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        router.push("/auth");
    };

    const fetchUnreadCount = useCallback(async () => {
        try {
            const data = await notificationApi.getUnreadCount();
            const total = Object.values(data).reduce((acc, v) => acc + (v ?? 0), 0);
            setUnread(total);
        } catch {}
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const id = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [fetchUnreadCount]);

    const fetchNotifications = useCallback(async () => {
        setListLoading(true);
        try {
            const data = await notificationApi.getNotifications({ page: 0, size: 20 });
            setNotifications(data.content ?? []);
        } catch {}
        finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) fetchNotifications();
    }, [open, fetchNotifications]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const handleMarkRead = async (id: number) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
            );
            setUnread((prev) => Math.max(0, prev - 1));
        } catch {}
    };

    const unreadNotifications = notifications.filter((n) => n.unread);
    const readNotifications   = notifications.filter((n) => !n.unread);

    return (
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background px-6 py-4">
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClickAction}
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
                <Input placeholder="Search..." className="pl-9" />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <div ref={dropdownRef} className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Bell className="h-5 w-5" />
                        {unread > 0 && (
                            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                                {unread > 99 ? "99+" : unread}
                            </span>
                        )}
                    </Button>

                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-[360px] rounded-xl border border-border bg-background shadow-xl">
                            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm">Notifications</p>
                                    {unread > 0 && (
                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                            {unread} unread
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-md p-1 text-secondary-foreground hover:bg-secondary"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="max-h-[420px] overflow-y-auto">
                                {listLoading ? (
                                    <div className="space-y-2 p-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
                                        ))}
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="flex h-32 items-center justify-center">
                                        <p className="text-sm text-secondary-foreground">
                                            No notifications yet
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {unreadNotifications.length > 0 && (
                                            <div>
                                                <p className="px-4 pt-3 pb-1 text-xs font-medium text-secondary-foreground uppercase tracking-wide">
                                                    New
                                                </p>
                                                {unreadNotifications.map((n) => (
                                                    <NotificationItem
                                                        key={n.id}
                                                        notification={n}
                                                        onMarkRead={handleMarkRead}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {readNotifications.length > 0 && (
                                            <div>
                                                <p className="px-4 pt-3 pb-1 text-xs font-medium text-secondary-foreground uppercase tracking-wide">
                                                    Earlier
                                                </p>
                                                {readNotifications.map((n) => (
                                                    <NotificationItem
                                                        key={n.id}
                                                        notification={n}
                                                        onMarkRead={handleMarkRead}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div ref={avatarRef} className="relative">
                    <button
                        onClick={() => setAvatarOpen((v) => !v)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground transition-opacity hover:opacity-80"
                    >
                        <span className="text-sm font-medium text-background">U</span>
                    </button>

                    {avatarOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-background shadow-xl">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-sm font-medium">My Account</p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function NotificationItem({
                              notification: n,
                              onMarkRead,
                          }: {
    notification: ApiNotification;
    onMarkRead: (id: number) => void;
}) {
    return (
        <div
            className={`flex gap-3 px-4 py-3 transition-colors hover:bg-secondary/50 ${
                n.unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
            }`}
        >
            <div className="mt-1.5 shrink-0">
                <span
                    className={`block h-2 w-2 rounded-full ${
                        n.unread ? "bg-blue-500" : "bg-transparent"
                    }`}
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-secondary-foreground">
                    {TEMPLATE_LABELS[n.templateKey] ?? n.templateKey.replace(/_/g, " ")}
                </p>
                <p className="text-sm font-medium truncate">{n.subject}</p>
                <p className="mt-0.5 text-xs text-secondary-foreground line-clamp-2">
                    {n.renderedBody}
                </p>
                <p className="mt-1 text-xs text-secondary-foreground">
                    {timeAgo(n.createdAt)}
                </p>
            </div>

            {n.unread && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkRead(n.id);
                    }}
                    className="mt-1 shrink-0 rounded-md p-1 text-xs text-secondary-foreground hover:bg-secondary"
                    title="Mark as read"
                >
                    <span className="block h-4 w-4 text-center leading-4">✓</span>
                </button>
            )}
        </div>
    );
}
