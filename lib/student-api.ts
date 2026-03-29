import { apiClient } from "./api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface ApiStudentProgram {
    programId: number;
    programName: string;
    faculty: string;
    degree: string;
    year?: number;
    semester?: number;
    group?: string;
    enrollmentDate?: string;
    totalCredits?: number;
    earnedCredits?: number;
    gpa?: number;
}

export interface ApiCourse {
    id: number;
    title: string;
    description: string;
    status: string;
    teacherId?: number;
    teacherName?: string;
    credits?: number;
    language?: string;
}

export interface ApiModule {
    id: number;
    courseId: number;
    title: string;
    orderIndex?: number;
    status?: string;
    description?: string;
}

export interface ApiLecture {
    id: number;
    courseId: number;
    moduleId?: number;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    date?: string;
    status?: string;
    meetingUrl?: string;
    recordingUrl?: string;
}

export interface ApiExamSession {
    id: number;
    examId?: number;
    studentId?: number;
    status: string;
    startedAt?: string;
    endedAt?: string;
    score?: number;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const studentApi = {
    // Profile
    getProfile: () =>
        apiClient.get<ApiUserProfile>("/api/v1/users/me"),

    updateProfile: (data: Partial<ApiUserProfile>) =>
        apiClient.patch<ApiUserProfile>("/api/v1/users/me", data),

    // Program
    getProgram: () =>
        apiClient.get<ApiStudentProgram>("/api/v1/student/me/program"),

    // Courses
    getCourses: () =>
        apiClient.get<ApiCourse[] | { content: ApiCourse[] }>("/api/courses"),

    getCourse: (id: number) =>
        apiClient.get<ApiCourse>(`/api/courses/${id}`),

    // Modules
    getCourseModules: (courseId: number) =>
        apiClient.get<ApiModule[]>(`/api/courses/${courseId}/modules`),

    // Lectures
    getCourseLectures: (courseId: number) =>
        apiClient.get<ApiLecture[]>(`/api/lectures/courses/${courseId}`),

    getLecture: (id: number) =>
        apiClient.get<ApiLecture>(`/api/lectures/${id}`),

    // Exams
    getMyExamSessions: (studentId: number) =>
        apiClient.get<ApiExamSession[]>(`/api/v1/exams/sessions/student/${studentId}`),

    createExamSession: (data: { examId: number }) =>
        apiClient.post<ApiExamSession>("/api/v1/exams/sessions", data),

    startExamSession: (sessionId: number) =>
        apiClient.post<ApiExamSession>(`/api/v1/exams/sessions/${sessionId}/start`),

    // Complaints
    getMyComplaints: () =>
        apiClient.get("/api/v1/complaints/me"),

    submitComplaint: (data: {
        courseId: number;
        category: string;
        description: string;
        anonymous?: boolean;
    }) => apiClient.post("/api/v1/complaints", data),

    // Notifications
    getNotifications: () =>
        apiClient.get("/api/me/notifications"),

    getUnreadCount: () =>
        apiClient.get<{ count: number }>("/api/me/notifications/unread-count"),

    markNotificationRead: (id: number) =>
        apiClient.post(`/api/me/notifications/${id}/read`),
};