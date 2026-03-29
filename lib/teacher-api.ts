import { apiClient } from "./api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiCourse {
    id: number;
    title: string;
    description: string;
    language: string;
    level: string;
    learningOutcomes: string;
    prerequisites: string;
    gradingPolicy: string;
    ownerTeacherId: number;
    programId: number;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiModule {
    id: number;
    courseId: number;
    title: string;
    description: string;
    orderIndex: number;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiLecture {
    id: number;
    courseId: number;
    moduleId: number;
    title: string;
    topic: string;
    outline: string;
    learningOutcomes: string;
    scheduledStart: string;
    scheduledEnd: string;
    deliveryMode: string;
    status: string;
    recordingLink: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiUserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    accessState: string;
    roles: string[];
    createdAt: string;
}

export interface CreateCoursePayload {
    title: string;
    description: string;
    language: string;
    level: string;
    learningOutcomes: string;
    prerequisites: string;
    gradingPolicy: string;
    ownerTeacherId?: number;
    programId?: number;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
    version?: number;
}

export interface CreateModulePayload {
    title: string;
    description: string;
}

export interface UpdateModulePayload {
    title?: string;
    description?: string;
    status?: string;
    version?: number;
}

export interface CreateLecturePayload {
    title: string;
    topic: string;
    outline: string;
    learningOutcomes: string;
    scheduledStart: string;
    scheduledEnd: string;
    deliveryMode: string;
    recordingLink?: string;
}

export interface UpdateLecturePayload extends Partial<CreateLecturePayload> {
    version?: number;
}

export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const teacherApi = {
    // Profile
    getProfile: () =>
        apiClient.get<ApiUserProfile>("/api/v1/users/me"),

    updateProfile: (data: Partial<ApiUserProfile>) =>
        apiClient.patch<ApiUserProfile>("/api/v1/users/me", data),

    // Courses
    getCourses: (params?: { search?: string; status?: string; page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.search) query.set("search", params.search);
        if (params?.status) query.set("status", params.status);
        if (params?.page !== undefined) query.set("page", String(params.page));
        query.set("size", String(params?.size ?? 50));
        return apiClient.get<PagedResponse<ApiCourse>>(`/api/courses?${query.toString()}`);
    },

    getCourse: (id: number) =>
        apiClient.get<ApiCourse>(`/api/courses/${id}`),

    createCourse: (data: CreateCoursePayload) =>
        apiClient.post<ApiCourse>("/api/courses", data),

    updateCourse: (id: number, data: UpdateCoursePayload) =>
        apiClient.patch<ApiCourse>(`/api/courses/${id}`, data),

    submitForReview: (id: number) =>
        apiClient.post<ApiCourse>(`/api/courses/${id}/submit-review`),

    publishCourse: (id: number) =>
        apiClient.post<ApiCourse>(`/api/courses/${id}/publish`),

    archiveCourse: (id: number) =>
        apiClient.post<ApiCourse>(`/api/courses/${id}/archive`),

    // Modules
    getCourseModules: (courseId: number) =>
        apiClient.get<ApiModule[]>(`/api/courses/${courseId}/modules`),

    getModule: (courseId: number, moduleId: number) =>
        apiClient.get<ApiModule>(`/api/courses/${courseId}/modules/${moduleId}`),

    createModule: (courseId: number, data: CreateModulePayload) =>
        apiClient.post<ApiModule>(`/api/courses/${courseId}/modules`, data),

    updateModule: (courseId: number, moduleId: number, data: UpdateModulePayload) =>
        apiClient.patch<ApiModule>(`/api/courses/${courseId}/modules/${moduleId}`, data),

    deleteModule: (courseId: number, moduleId: number) =>
        apiClient.delete(`/api/courses/${courseId}/modules/${moduleId}`),

    reorderModules: (courseId: number, moduleIds: number[]) =>
        apiClient.post(`/api/courses/${courseId}/modules/reorder`, { moduleIds }),

    // Lectures
    getCourseLectures: (courseId: number) =>
        apiClient.get<ApiLecture[]>(`/api/lectures/courses/${courseId}`),

    getLecture: (id: number, courseId: number) =>
        apiClient.get<ApiLecture>(`/api/lectures/${id}?courseId=${courseId}`),

    createLecture: (moduleId: number, data: CreateLecturePayload) =>
        apiClient.post<ApiLecture>(`/api/lectures/modules/${moduleId}`, data),

    updateLecture: (id: number, courseId: number, data: UpdateLecturePayload) =>
        apiClient.patch<ApiLecture>(`/api/lectures/${id}?courseId=${courseId}`, data),

    deleteLecture: (id: number, courseId: number) =>
        apiClient.delete(`/api/lectures/${id}?courseId=${courseId}`),

    publishLecture: (id: number, courseId: number) =>
        apiClient.post(`/api/lectures/${id}/publish?courseId=${courseId}`),

    unpublishLecture: (id: number, courseId: number) =>
        apiClient.post(`/api/lectures/${id}/unpublish?courseId=${courseId}`),
};