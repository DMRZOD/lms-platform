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

export interface ApiGrade {
    id: number;
    courseId: number;
    courseTitle?: string;
    courseCode?: string;
    credits?: number;
    letterGrade?: string;
    gpaPoints?: number;
    totalScore?: number;
    items?: ApiGradeItem[];
}

export interface ApiGradeItem {
    id: number;
    name: string;
    score?: number;
    maxScore?: number;
    weight?: number;
    type?: string;
}

export interface ApiAttendanceRecord {
    id: number;
    lectureId: number;
    lectureTitle?: string;
    courseId: number;
    courseName?: string;
    date?: string;
    status: string;
    joinTime?: string;
    leaveTime?: string;
    duration?: number;
}

export interface ApiAssignment {
    id: number;
    courseId: number;
    courseTitle?: string;
    title: string;
    description?: string;
    dueDate?: string;
    maxScore?: number;
    weight?: number;
    status?: string;
    publishedAt?: string;
}

export interface ApiSubmission {
    id: number;
    assignmentId: number;
    studentId?: number;
    status: string;
    submittedAt?: string;
    content?: string;
    fileUrl?: string;
    score?: number;
    feedback?: string;
    late?: boolean;
}

export interface ApiGradeResult {
    id: number;
    submissionId: number;
    score: number;
    feedback?: string;
    gradedAt?: string;
    gradedBy?: string;
}

export interface ApiLectureMaterial {
    id: number;
    lectureId: number;
    name: string;
    type?: string;
    url?: string;
    size?: number;
    uploadedAt?: string;
    version?: number;
}

export interface ApiQAQuestion {
    id: number;
    lectureId: number;
    authorId?: number;
    authorName?: string;
    authorRole?: string;
    content: string;
    status?: string;
    upvotes?: number;
    createdAt?: string;
    answers?: ApiQAAnswer[];
}

export interface ApiQAAnswer {
    id: number;
    questionId: number;
    authorId?: number;
    authorName?: string;
    authorRole?: string;
    content: string;
    accepted?: boolean;
    createdAt?: string;
}

export interface ApiChatMessage {
    id: number;
    lectureId: number;
    authorId?: number;
    authorName?: string;
    content: string;
    sentAt?: string;
    muted?: boolean;
}

export interface ApiExamSlot {
    id: number;
    examId?: number;
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    capacity?: number;
    available?: boolean;
}

export interface ApiExamAppeal {
    id: number;
    examId?: number;
    studentId?: number;
    reason: string;
    status?: string;
    createdAt?: string;
    reviewedAt?: string;
    resolution?: string;
}

export interface ApiExamResult {
    id: number;
    examId?: number;
    studentId?: number;
    score?: number;
    maxScore?: number;
    passed?: boolean;
    gradedAt?: string;
}

export interface ApiNotification {
    id: number;
    title?: string;
    message?: string;
    type?: string;
    read: boolean;
    createdAt?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const studentApi = {

    // ── Profile ──────────────────────────────────────────────────────────────
    getProfile: () =>
        apiClient.get<ApiUserProfile>("/api/v1/users/me"),

    updateProfile: (data: Partial<ApiUserProfile>) =>
        apiClient.patch<ApiUserProfile>("/api/v1/users/me", data),

    // ── Program ──────────────────────────────────────────────────────────────
    getProgram: () =>
        apiClient.get<ApiStudentProgram>("/api/v1/student/me/program"),

    // ── Courses ──────────────────────────────────────────────────────────────
    getCourses: () =>
        apiClient.get<ApiCourse[] | { content: ApiCourse[] }>("/api/courses"),

    getCourse: (id: number) =>
        apiClient.get<ApiCourse>(`/api/courses/${id}`),

    // ── Modules ──────────────────────────────────────────────────────────────
    getCourseModules: (courseId: number) =>
        apiClient.get<ApiModule[]>(`/api/courses/${courseId}/modules`),

    getCourseModulesPaged: (courseId: number) =>
        apiClient.get<{ content: ApiModule[] }>(`/api/courses/${courseId}/modules/paged`),

    // ── Lectures ─────────────────────────────────────────────────────────────
    getCourseLectures: (courseId: number) =>
        apiClient.get<ApiLecture[]>(`/api/lectures/courses/${courseId}`),

    getCourseLecturesPaged: (courseId: number) =>
        apiClient.get<{ content: ApiLecture[] }>(`/api/lectures/courses/${courseId}/paged`),

    getLecture: (id: number) =>
        apiClient.get<ApiLecture>(`/api/lectures/${id}`),

    getModuleLectures: (moduleId: number) =>
        apiClient.get<ApiLecture[]>(`/api/lectures/modules/${moduleId}`),

    // ── Lecture Materials ────────────────────────────────────────────────────
    getLectureMaterials: (lectureId: number) =>
        apiClient.get<ApiLectureMaterial[]>(`/api/lectures/${lectureId}/materials`),

    downloadMaterial: (lectureId: number, materialId: number) =>
        apiClient.post(`/api/lectures/${lectureId}/materials/${materialId}/download`),

    // ── Lecture Attendance ───────────────────────────────────────────────────
    getCourseAttendanceMe: (courseId: number) =>
        apiClient.get<ApiAttendanceRecord[]>(`/api/courses/${courseId}/attendance/me`),

    getLectureAttendance: (lectureId: number) =>
        apiClient.get<ApiAttendanceRecord[]>(`/api/lectures/${lectureId}/attendance`),

    // ── Lecture Q&A ──────────────────────────────────────────────────────────
    getLectureQuestions: (lectureId: number) =>
        apiClient.get<ApiQAQuestion[]>(`/api/lectures/${lectureId}/qa/questions`),

    askQuestion: (lectureId: number, data: { content: string }) =>
        apiClient.post<ApiQAQuestion>(`/api/lectures/${lectureId}/qa/questions`, data),

    answerQuestion: (lectureId: number, questionId: number, data: { content: string }) =>
        apiClient.post<ApiQAAnswer>(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/answers`,
            data
        ),

    acceptAnswer: (lectureId: number, questionId: number, answerId: number) =>
        apiClient.post(
            `/api/lectures/${lectureId}/qa/questions/${questionId}/answers/${answerId}/accept`
        ),

    // ── Lecture Chat ─────────────────────────────────────────────────────────
    getChatMessages: (lectureId: number) =>
        apiClient.get<ApiChatMessage[]>(`/api/lectures/${lectureId}/chat/messages`),

    sendChatMessage: (lectureId: number, data: { content: string }) =>
        apiClient.post<ApiChatMessage>(`/api/lectures/${lectureId}/chat/messages`, data),

    // ── Assignments ──────────────────────────────────────────────────────────
    getCourseAssignments: (courseId: number) =>
        apiClient.get<ApiAssignment[]>(`/api/courses/${courseId}/assignments`),

    getPublishedAssignments: (courseId: number) =>
        apiClient.get<ApiAssignment[]>(`/api/courses/${courseId}/assignments/published`),

    getAssignment: (courseId: number, assignmentId: number) =>
        apiClient.get<ApiAssignment>(`/api/courses/${courseId}/assignments/${assignmentId}`),

    // ── Assignment Submissions ───────────────────────────────────────────────
    // POST /api/assignments/{assignmentId}/submissions
    submitAssignment: (assignmentId: number, data: { content?: string; fileUrl?: string }) =>
        apiClient.post<ApiSubmission>(`/api/assignments/${assignmentId}/submissions`, data),

    getMySubmission: (assignmentId: number, studentId: number) =>
        apiClient.get<ApiSubmission[]>(
            `/api/assignments/${assignmentId}/submissions/student/${studentId}`
        ),

    getSubmissionsByStatus: (assignmentId: number, status: string) =>
        apiClient.get<ApiSubmission[]>(
            `/api/assignments/${assignmentId}/submissions/status/${status}`
        ),

    // ── Grades ───────────────────────────────────────────────────────────────
    getMyGrades: () =>
        apiClient.get<ApiGrade[]>("/api/students/me/grades"),

    getMyCourseGrade: (courseId: number) =>
        apiClient.get<ApiGrade>(`/api/students/me/grades/courses/${courseId}`),

    getMyCourseGradeDetails: (courseId: number) =>
        apiClient.get<ApiGrade>(`/api/students/me/grades/courses/${courseId}/details`),

    getSubmissionGrade: (submissionId: number) =>
        apiClient.get<ApiGradeResult>(`/api/submissions/${submissionId}/grade`),

    // ── Exams ────────────────────────────────────────────────────────────────
    getMyExamSessions: (studentId: number) =>
        apiClient.get<ApiExamSession[]>(`/api/v1/exams/sessions/student/${studentId}`),

    getExamSession: (sessionId: number) =>
        apiClient.get<ApiExamSession>(`/api/v1/exams/sessions/${sessionId}`),

    createExamSession: (data: { examId: number }) =>
        apiClient.post<ApiExamSession>("/api/v1/exams/sessions", data),

    startExamSession: (sessionId: number) =>
        apiClient.post<ApiExamSession>(`/api/v1/exams/sessions/${sessionId}/start`),

    updateExamSessionStatus: (sessionId: number, data: { status: string }) =>
        apiClient.put<ApiExamSession>(`/api/v1/exams/sessions/${sessionId}/status`, data),

    // ── Exam Slots ───────────────────────────────────────────────────────────
    getAvailableExamSlots: () =>
        apiClient.get<ApiExamSlot[]>("/api/v1/exams/slots"),

    bookExamSlot: (slotId: number) =>
        apiClient.post(`/api/admission/exams/slots/${slotId}/book`),

    // ── Exam Results ─────────────────────────────────────────────────────────
    getExamResult: (resultId: number) =>
        apiClient.get<ApiExamResult>(`/api/v1/exams/results/${resultId}`),

    getMyExamResults: (studentId: number) =>
        apiClient.get<ApiExamResult[]>(`/api/v1/exams/results/student/${studentId}`),

    // ── Exam Appeals ─────────────────────────────────────────────────────────
    getMyAppeals: () =>
        apiClient.get<ApiExamAppeal[]>("/api/v1/exams/appeals/me"),

    submitAppeal: (data: { examId: number; reason: string }) =>
        apiClient.post<ApiExamAppeal>("/api/v1/exams/appeals", data),

    // ── Complaints ───────────────────────────────────────────────────────────
    getMyComplaints: () =>
        apiClient.get("/api/v1/complaints/me"),

    submitComplaint: (data: {
        courseId: number;
        category: string;
        description: string;
        anonymous?: boolean;
    }) => apiClient.post("/api/v1/complaints", data),

    // ── Notifications ────────────────────────────────────────────────────────
    getNotifications: () =>
        apiClient.get<ApiNotification[]>("/api/me/notifications"),

    getUnreadCount: () =>
        apiClient.get<{ count: number }>("/api/me/notifications/unread-count"),

    markNotificationRead: (id: number) =>
        apiClient.post(`/api/me/notifications/${id}/read`),
};