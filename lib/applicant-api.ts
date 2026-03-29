import { apiClient } from "./api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiApplicantStatus {
    id: number;
    userId: number;
    currentState: string;
    updatedAt: string;
}

export interface ApiAdmissionDocument {
    id: number;
    userId: number;
    fullName: string;
    type: "PASSPORT" | "DIPLOMA" | "CERTIFICATE";
    status: string;
    uploadedAt: string;
}

export interface ApiExamSlotPage {
    totalElements: number;
    totalPages: number;
    size: number;
    content: ApiAdmissionExamSlot[];
    number: number;
}

export interface ApiAdmissionExamSlot {
    id: number;
    dateTime: string;
    totalCapacity: number;
    remainingCapacity: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const applicantApi = {
    // GET /api/applicants/me/status
    getMyStatus: () =>
        apiClient.get<ApiApplicantStatus>("/api/applicants/me/status"),

    // GET /api/admission/documents
    getMyDocuments: () =>
        apiClient.get<ApiAdmissionDocument[]>("/api/admission/documents"),

    // POST /api/admission/documents/upload
    uploadDocument: (type: "PASSPORT" | "DIPLOMA" | "CERTIFICATE", file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.postForm<ApiAdmissionDocument>(
            `/api/admission/documents/upload?type=${type}`,
            formData
        );
    },

    // GET /api/admission/exams/slots
    getExamSlots: (page = 0, size = 20) =>
        apiClient.get<ApiExamSlotPage>(
            `/api/admission/exams/slots?page=${page}&size=${size}`
        ),

    // POST /api/admission/exams/slots/{slotId}/book
    bookExamSlot: (slotId: number) =>
        apiClient.post(`/api/admission/exams/slots/${slotId}/book`),
};