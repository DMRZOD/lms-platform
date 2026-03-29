import { apiClient } from "./api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiAdmissionDocument {
    id: number;
    userId: number;
    fullName: string;
    type: string;
    status: string;
    uploadedAt: string;
}

export interface ApiAdmissionDocumentQueue {
    totalElements: number;
    totalPages: number;
    size: number;
    content: ApiAdmissionDocument[];
    number: number;
}

export interface ApiApplicantHistory {
    id: number;
    oldState: string;
    newState: string;
    changedBy: number;
    timestamp: string;
}

export interface ApiExamSlot {
    id: number;
    dateTime: string;
    totalCapacity: number;
    remainingCapacity: number;
}

export interface CreateExamSlotPayload {
    dateTime: string;
    totalCapacity: number;
}

export interface UpdateExamSlotPayload {
    dateTime: string;
    totalCapacity: number;
}

export interface ApiExamSession {
    id: number;
    examSessionId: string;
    studentId: number;
    studentName: string;
    courseId: number;
    examType: string;
    status: string;
    scheduledStart: string;
    scheduledEnd: string;
    actualStart?: string;
    actualEnd?: string;
    attemptNumber: number;
    score?: number;
    remarks?: string;
    suspicious?: boolean;
}

export interface ApiExamAppeal {
    id: number;
    examSessionId: string;
    studentId: number;
    reasonText: string;
    status: string;
    decisionReason?: string;
    reviewerName?: string;
    reviewedAt?: string;
    attachmentUrl?: string;
    createdAt: string;
}

export interface ApiExamResult {
    id: number;
    createdAt: string;
    updatedAt: string;
    examSession: ApiExamSession;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const academicApi = {
    // ── Admission Documents Queue ──
    getAdmissionQueue: (params?: {
        status?: "PENDING_REVIEW" | "VERIFIED" | "REJECTED_DOCS";
        page?: number;
        size?: number;
    }) => {
        const q = new URLSearchParams();
        q.set("status", params?.status ?? "PENDING_REVIEW");
        q.set("page",   String(params?.page ?? 0));
        q.set("size",   String(params?.size ?? 100));
        return apiClient.get<ApiAdmissionDocumentQueue>(
            `/api/admission/documents/queue?${q.toString()}`
        );
    },

    // ── Applicant Status ──
    updateApplicantStatus: (id: number, newState: string) =>
        apiClient.patch(`/api/applicants/${id}/status?newState=${newState}`),

    getApplicantHistory: (id: number) =>
        apiClient.get<ApiApplicantHistory[]>(`/api/applicants/${id}/history`),

    // ── Student Program ──
    changeStudentProgram: (studentId: number, data: {
        newProgramId: number;
        reason: string;
    }) =>
        apiClient.put(
            `/api/v1/academic-dept/student/${studentId}/program`,
            data
        ),

    // ── Exam Slots ──
    getExamSlots: () =>
        apiClient.get<ApiExamSlot[]>("/api/v1/exams/slots/all"),

    createExamSlot: (data: CreateExamSlotPayload) =>
        apiClient.post<ApiExamSlot>("/api/v1/exams/slots", data),

    updateExamSlot: (id: number, data: UpdateExamSlotPayload) =>
        apiClient.put<ApiExamSlot>(`/api/v1/exams/slots/${id}`, data),

    deleteExamSlot: (id: number) =>
        apiClient.delete(`/api/v1/exams/slots/${id}`),

    // ── Exam Sessions ──
    createExamSession: (data: {
        studentId: number;
        courseId: number;
        examType: string;
        scheduledStart: string;
        scheduledEnd: string;
        slotId?: number;
        proctoringProvider?: string;
    }) =>
        apiClient.post<ApiExamSession>("/api/v1/exams/sessions", data),

    getExamSession: (id: string) =>
        apiClient.get<ApiExamSession>(`/api/v1/exams/sessions/${id}`),

    startExamSession: (id: string) =>
        apiClient.post<ApiExamSession>(`/api/v1/exams/sessions/${id}/start`),

    getStudentExamSessions: (studentId: number) =>
        apiClient.get<ApiExamSession[]>(
            `/api/v1/exams/sessions/student/${studentId}`
        ),

    // ── Exam Appeals ──
    getAppealsQueue: () =>
        apiClient.get<ApiExamAppeal[]>("/api/v1/exams/appeals/queue"),

    reviewAppeal: (
        id: number,
        data: { status: string; decisionReason: string }
    ) => apiClient.put(`/api/v1/exams/appeals/${id}/review`, data),

    // ── Exam Results ──
    getExamResult: (id: number) =>
        apiClient.get<ApiExamResult>(`/api/v1/exams/results/${id}`),

    getStudentExamResults: (studentId: number) =>
        apiClient.get<ApiExamResult[]>(
            `/api/v1/exams/results/student/${studentId}`
        ),
};