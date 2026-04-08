import { apiClient } from "./api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiNotification {
    id: number;
    templateKey: string;
    channel: string;
    subject: string;
    renderedBody: string;
    status: string;
    readAt: string | null;
    createdAt: string;
    unread: boolean;
}

export interface ApiNotificationPage {
    totalElements: number;
    totalPages: number;
    size: number;
    content: ApiNotification[];
    number: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const notificationApi = {
    // GET /api/me/notifications?page=0&size=20
    getNotifications: (params?: { page?: number; size?: number }) => {
        const q = new URLSearchParams();
        q.set("page", String(params?.page ?? 0));
        q.set("size", String(params?.size ?? 20));
        return apiClient.get<ApiNotificationPage>(
            `/api/me/notifications?${q.toString()}`
        );
    },

    // GET /api/me/notifications/unread-count
    // Returns: { [key: string]: number } — e.g. { unread: 5 }
    getUnreadCount: () =>
        apiClient.get<Record<string, number>>(
            `/api/me/notifications/unread-count`
        ),

    // POST /api/me/notifications/{id}/read
    markAsRead: (id: number) =>
        apiClient.post<ApiNotification>(
            `/api/me/notifications/${id}/read`
        ),
};