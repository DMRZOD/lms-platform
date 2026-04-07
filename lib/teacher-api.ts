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

// ─── Gradebook Types ──────────────────────────────────────────────────────────

export interface ApiGradeItem {
    id: number;
    courseId: number;
    type: string;
    referenceId: number;
    weight: number;
    name: string;
    maxScore: number;
    description: string;
    isActive: boolean;
    maxScore2: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiStudentGrade {
    id: number;
    studentId: number;
    studentName: string;
    courseId: number;
    gradeItemId: number;
    gradeItemName: string;
    score: number;
    feedback: string;
    gradedBy: number;
    gradeBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiGradebook {
    courseId: number;
    courseName: string;
    gradeItems: ApiGradeItem[];
    students: {
        studentId: number;
        studentName: string;
        grades: ApiStudentGrade[];
    }[];
}

export interface ApiGradeTotal {
    id: number;
    studentId: number;
    courseId: number;
    courseName: string;
    totalGrade: number;
    heightGrade: number;
    calculatedAt: string;
    updatedAt: string;
}

// ─── Assignment Types ─────────────────────────────────────────────────────────

export interface ApiAssignment {
    id: number;
    courseId: number;
    lectureId: number;
    title: string;
    description: string;
    rubric: string;
    deadline: string;
    latePolicy: string;
    lateDeadline: string;
    gracePeriodMinutes: number;
    latePenaltyPercent: number;
    isLateAllowed: boolean;
    allowFileUpload: boolean;
    maxAttempts: number;
    maxFileSize: number;
    allowedFileTypes: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
}

export interface ApiSubmission {
    id: number;
    assignmentId: number;
    studentId: number;
    attemptNumber: number;
    submittedAt: string;
    textContent: string;
    fileUrl: string;
    fileName: string;
    fileSizeBytes: number;
    status: string;
    createdAt: string;
    late: boolean;
}

export interface ApiSubmissionGrade {
    id: number;
    submissionId: number;
    assignmentId: number;
    studentId: number;
    teacherId: number;
    score: number;
    maxScore: number;
    feedback: string;
    gradedAt: string;
    createdAt: string;
}

// ─── Exam Types ───────────────────────────────────────────────────────────────

export interface ApiExamSession {
    id: string;
    examSessionId: string;
    studentId: number;
    courseId: number;
    examType: string;
    status: string;
    scheduledStart: string;
    scheduledEnd: string;
    actualStart: string;
    actualEnd: string;
    attemptDuration: string;
    score: string;
    remarks: string;
    suspicious: boolean;
}

export interface ApiExamResult {
    id: number;
    createdAt: string;
    updatedAt: string;
    examSessionId: string;
    studentId: number;
    courseId: number;
    examType: string;
    score: number;
    status: string;
    student: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        mailVerified: boolean;
        status: string;
        tokenVersion: number;
    };
}

export interface ApiExamAppeal {
    id: number;
    examSessionId: string;
    studentId: number;
    reasonText: string;
    status: string;
    decisionReason: string;
    reviewerName: string;
    attachmentId: string;
    createdAt: string;
}

// ─── QA Types ─────────────────────────────────────────────────────────────────

export interface ApiQAQuestion {
    id: number;
    lectureId: number;
    title: string;
    body: string;
    createdBy: number;
    createdAt: string;
    status: string;
    isLocked: boolean;
    answerCount: number;
    acceptedAnswerId: number;
    version: number;
    updatedAt: string;
}

export interface ApiQAAnswer {
    id: number;
    questionId: number;
    body: string;
    createdBy: number;
    createdAt: string;
    isLocked: boolean;
    isAccepted: boolean;
    version: number;
    updatedAt: string;
}

// ─── Material Types ───────────────────────────────────────────────────────────

export interface ApiMaterial {
    id: number;
    lectureId: number;
    title: string;
    description: string;
    materialType: string;
    storageKey: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    isLargeChange: boolean;
    currentVersionId: number;
    uploadedBy: number;
    uploadedAt: string;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

// ─── Payload Types ────────────────────────────────────────────────────────────

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

export interface CreateGradeItemPayload {
    id?: number;
    courseId?: number;
    type: string;
    referenceId?: number;
    weight: number;
    name: string;
    maxScore: number;
    description?: string;
}

export interface CreateStudentGradePayload {
    studentId: number;
    gradeItemId: number;
    score: number;
    feedback?: string;
    changeReason?: string;
}

export interface UpdateStudentGradePayload {
    score: number;
    feedback?: string;
    changeReason?: string;
}

export interface CreateAssignmentPayload {
    courseId?: number;
    lectureId?: number;
    title: string;
    description?: string;
    rubric?: string;
    deadline: string;
    latePolicy?: string;
    lateDeadline?: string;
    gracePeriodMinutes?: number;
    latePenaltyPercent?: number;
    isLateAllowed?: boolean;
    allowFileUpload?: boolean;
    maxAttempts?: number;
    maxFileSize?: number;
    allowedFileTypes?: string;
}

export interface GradeSubmissionPayload {
    score: number;
    maxScore: number;
    feedback: string;
}

export interface UpdateExamSessionStatusPayload {
    status: "GRADED" | "INVALIDATED";
    reason?: string;
    score?: number;
    maxScore?: number;
}

export interface ReviewAppealPayload {
    status: "APPROVED" | "REJECTED";
    decisionReason: string;
}

export interface SubmitAppealPayload {
    examSessionId: string;
    reasonText: string;
    attachmentId?: string;
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
    // ── Profile ────────────────────────────────────────────────────────────────
    getProfile: () =>
        apiClient.get<ApiUserProfile>("/api/v1/users/me"),

    updateProfile: (data: Partial<Pick<ApiUserProfile, "firstName" | "lastName" | "phone">>) =>
        apiClient.patch<ApiUserProfile>("/api/v1/users/me", data),

    // ── Courses ────────────────────────────────────────────────────────────────
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

    // ── Modules ────────────────────────────────────────────────────────────────
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

    // ── Lectures ───────────────────────────────────────────────────────────────
    getCourseLectures: (courseId: number) =>
        apiClient.get<ApiLecture[]>(`/api/lectures/courses/${courseId}`),

    getCourseLecturesPaged: (
        courseId: number,
        params?: { search?: string; status?: string; page?: number; size?: number; sortBy?: string; sortDir?: string },
    ) => {
        const query = new URLSearchParams();
        if (params?.search) query.set("search", params.search);
        if (params?.status) query.set("status", params.status);
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        if (params?.sortBy) query.set("sortBy", params.sortBy);
        if (params?.sortDir) query.set("sortDir", params.sortDir);
        return apiClient.get<PagedResponse<ApiLecture>>(`/api/lectures/courses/${courseId}/paged?${query.toString()}`);
    },

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

    moveLecture: (id: number, courseId: number, targetModuleId: number) =>
        apiClient.post(`/api/lectures/${id}/move?courseId=${courseId}`, { targetModuleId }),

    // ── Gradebook ──────────────────────────────────────────────────────────────
    getGradebook: (courseId: number) =>
        apiClient.get<ApiGradebook>(`/api/courses/${courseId}/gradebook`),

    getGradeItems: (courseId: number) =>
        apiClient.get<ApiGradeItem[]>(`/api/courses/${courseId}/gradebook/items`),

    getGradeItem: (courseId: number, itemId: number) =>
        apiClient.get<ApiGradeItem>(`/api/courses/${courseId}/gradebook/items/${itemId}`),

    createGradeItem: (courseId: number, data: CreateGradeItemPayload) =>
        apiClient.post<ApiGradeItem>(`/api/courses/${courseId}/gradebook/items`, data),

    updateGradeItem: (courseId: number, itemId: number, data: Partial<CreateGradeItemPayload>) =>
        apiClient.put<ApiGradeItem>(`/api/courses/${courseId}/gradebook/items/${itemId}`, data),

    deleteGradeItem: (courseId: number, itemId: number) =>
        apiClient.delete(`/api/courses/${courseId}/gradebook/items/${itemId}`),

    getGradeTotals: (courseId: number) =>
        apiClient.get<ApiGradeTotal[]>(`/api/courses/${courseId}/gradebook/totals`),

    createOrUpdateStudentGrade: (courseId: number, data: CreateStudentGradePayload) =>
        apiClient.post<ApiStudentGrade>(`/api/courses/${courseId}/gradebook/grades`, data),

    getStudentGrade: (courseId: number, gradeId: number) =>
        apiClient.get<ApiStudentGrade>(`/api/courses/${courseId}/gradebook/grades/${gradeId}`),

    updateStudentGrade: (courseId: number, gradeId: number, data: UpdateStudentGradePayload) =>
        apiClient.put<ApiStudentGrade>(`/api/courses/${courseId}/gradebook/grades/${gradeId}`, data),

    recalculateGrades: (courseId: number) =>
        apiClient.post(`/api/courses/${courseId}/gradebook/recalculate`),

    exportGradebookCsv: (courseId: number) =>
        apiClient.get<string>(`/api/courses/${courseId}/gradebook/export/csv`),

    // ── Assignments ────────────────────────────────────────────────────────────
    getAssignments: (
        courseId: number,
        params?: { page?: number; size?: number },
    ) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiAssignment>>(
            `/api/courses/${courseId}/assignments?${query.toString()}`,
        );
    },

    getPublishedAssignments: (courseId: number, params?: { page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiAssignment>>(
            `/api/courses/${courseId}/assignments/published?${query.toString()}`,
        );
    },

    getAssignment: (courseId: number, assignmentId: number) =>
        apiClient.get<ApiAssignment>(`/api/courses/${courseId}/assignments/${assignmentId}`),

    createAssignment: (courseId: number, data: CreateAssignmentPayload) =>
        apiClient.post<ApiAssignment>(`/api/courses/${courseId}/assignments`, data),

    updateAssignment: (courseId: number, assignmentId: number, data: Partial<CreateAssignmentPayload>) =>
        apiClient.put<ApiAssignment>(`/api/courses/${courseId}/assignments/${assignmentId}`, data),

    deleteAssignment: (courseId: number, assignmentId: number) =>
        apiClient.delete(`/api/courses/${courseId}/assignments/${assignmentId}`),

    publishAssignment: (courseId: number, assignmentId: number) =>
        apiClient.post<ApiAssignment>(`/api/courses/${courseId}/assignments/${assignmentId}/publish`),

    closeAssignment: (courseId: number, assignmentId: number) =>
        apiClient.post<ApiAssignment>(`/api/courses/${courseId}/assignments/${assignmentId}/close`),

    // ── Submissions ────────────────────────────────────────────────────────────
    getSubmissions: (assignmentId: number, params?: { page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiSubmission>>(
            `/api/assignments/${assignmentId}/submissions?${query.toString()}`,
        );
    },

    getSubmission: (assignmentId: number, submissionId: number) =>
        apiClient.get<ApiSubmission>(`/api/assignments/${assignmentId}/submissions/${submissionId}`),

    getStudentSubmissions: (assignmentId: number, studentId: number, params?: { page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiSubmission>>(
            `/api/assignments/${assignmentId}/submissions/student/${studentId}?${query.toString()}`,
        );
    },

    getSubmissionsByStatus: (assignmentId: number, status: string, params?: { page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiSubmission>>(
            `/api/assignments/${assignmentId}/submissions/status/${status}?${query.toString()}`,
        );
    },

    deleteSubmission: (assignmentId: number, submissionId: number) =>
        apiClient.delete(`/api/assignments/${assignmentId}/submissions/${submissionId}`),

    // ── Submission Grades ──────────────────────────────────────────────────────
    getSubmissionGrade: (submissionId: number) =>
        apiClient.get<ApiSubmissionGrade>(`/api/submissions/${submissionId}/grade`),

    gradeSubmission: (submissionId: number, data: GradeSubmissionPayload) =>
        apiClient.post<ApiSubmissionGrade>(`/api/submissions/${submissionId}/grade`, data),

    getGradeById: (gradeId: number) =>
        apiClient.get<ApiSubmissionGrade>(`/api/submissions/grades/${gradeId}`),

    deleteGrade: (gradeId: number) =>
        apiClient.delete(`/api/submissions/grades/${gradeId}`),

    // ── Exam Sessions ──────────────────────────────────────────────────────────
    createExamSession: (data: {
        studentId: number;
        courseId: number;
        examType: string;
        scheduledStart: string;
        scheduledEnd: string;
        abId?: number;
        proctoringProvider?: string;
    }) => apiClient.post<ApiExamSession>("/api/v1/exams/sessions", data),

    getExamSession: (id: string) =>
        apiClient.get<ApiExamSession>(`/api/v1/exams/sessions/${id}`),

    startExamSession: (id: string) =>
        apiClient.post<ApiExamSession>(`/api/v1/exams/sessions/${id}/start`),

    updateExamSessionStatus: (id: string, data: UpdateExamSessionStatusPayload) =>
        apiClient.put<ApiExamSession>(`/api/v1/exams/sessions/${id}/status`, data),

    // ── Exam Results ───────────────────────────────────────────────────────────
    getExamResult: (id: number) =>
        apiClient.get<ApiExamResult>(`/api/v1/exams/results/${id}`),

    getStudentExamResults: (studentId: number) =>
        apiClient.get<ApiExamResult[]>(`/api/v1/exams/results/student/${studentId}`),

    // ── Exam Appeals ───────────────────────────────────────────────────────────
    getAppealsQueue: () =>
        apiClient.get<ApiExamAppeal[]>("/api/v1/exams/appeals/queue"),

    getMyAppeals: () =>
        apiClient.get<ApiExamAppeal[]>("/api/v1/exams/appeals/me"),

    submitAppeal: (data: SubmitAppealPayload) =>
        apiClient.post<ApiExamAppeal>("/api/v1/exams/appeals", data),

    reviewAppeal: (id: number, data: ReviewAppealPayload) =>
        apiClient.put<ApiExamAppeal>(`/api/v1/exams/appeals/${id}/review`, data),

    // ── Lecture QA ─────────────────────────────────────────────────────────────
    getQAQuestions: (
        lectureId: number,
        params?: { page?: number; size?: number; sort?: string[] },
    ) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiQAQuestion>>(
            `/api/lectures/${lectureId}/qa/questions?${query.toString()}`,
        );
    },

    getQAQuestion: (lectureId: number, questionId: number) =>
        apiClient.get<ApiQAQuestion>(`/api/lectures/${lectureId}/qa/questions/${questionId}`),

    createQAQuestion: (lectureId: number, data: { title: string; body: string }) =>
        apiClient.post<ApiQAQuestion>(`/api/lectures/${lectureId}/qa/questions`, data),

    deleteQAQuestion: (lectureId: number, questionId: number) =>
        apiClient.delete(`/api/lectures/${lectureId}/qa/questions/${questionId}`),

    reopenQAQuestion: (lectureId: number, questionId: number) =>
        apiClient.post<ApiQAQuestion>(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/reopen`,
        ),

    closeQAQuestion: (lectureId: number, questionId: number) =>
        apiClient.post<ApiQAQuestion>(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/close`,
        ),

    getQAAnswers: (lectureId: number, questionId: number, params?: { page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiQAAnswer>>(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/answers?${query.toString()}`,
        );
    },

    createQAAnswer: (lectureId: number, questionId: number, data: { body: string }) =>
        apiClient.post<ApiQAAnswer>(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/answers`,
            data,
        ),

    acceptQAAnswer: (lectureId: number, questionId: number, answerId: number) =>
        apiClient.post<ApiQAAnswer>(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/answers/${answerId}/accept`,
        ),

    deleteQAAnswer: (lectureId: number, questionId: number, answerId: number) =>
        apiClient.delete(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/answers/${answerId}`,
        ),

    // ── Lecture QA (by status) ─────────────────────────────────────────────────
    getQAByStatus: (
        lectureId: number,
        status: "OPEN" | "CLOSED",
        params?: { page?: number; size?: number },
    ) => {
        const query = new URLSearchParams();
        query.set("status", status);
        if (params?.page !== undefined) query.set("page", String(params.page));
        if (params?.size !== undefined) query.set("size", String(params.size));
        return apiClient.get<PagedResponse<ApiQAQuestion>>(
            `/api/lectures/${lectureId}/qa?${query.toString()}`,
        );
    },

    // ── Materials ──────────────────────────────────────────────────────────────
    getMaterials: (lectureId: number) =>
        apiClient.get<ApiMaterial[]>(`/api/lectures/${lectureId}/materials`),

    getMaterial: (lectureId: number, materialId: number) =>
        apiClient.get<ApiMaterial>(`/api/lectures/${lectureId}/materials/${materialId}`),

    deleteMaterial: (lectureId: number, materialId: number) =>
        apiClient.delete(`/api/lectures/${lectureId}/materials/${materialId}`),

    updateMaterialMetadata: (
        lectureId: number,
        materialId: number,
        data: { title?: string; description?: string; version?: number },
    ) => apiClient.patch<ApiMaterial>(`/api/lectures/${lectureId}/materials/${materialId}`, data),

    getMaterialVersions: (lectureId: number, materialId: number) =>
        apiClient.get(`/api/lectures/${lectureId}/materials/${materialId}/versions`),

    getMaterialVersion: (lectureId: number, materialId: number, versionNumber: number) =>
        apiClient.get(`/api/lectures/${lectureId}/materials/${materialId}/versions/${versionNumber}`),
};