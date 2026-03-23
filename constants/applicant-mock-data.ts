import type {
  ApplicantProfile,
  ApplicantDocument,
  ExamSlot,
  ScheduledExam,
  PrepChecklistItem,
  ExamSession,
  Appeal,
  AppNotification,
} from "@/types/applicant";

export const mockApplicant: ApplicantProfile = {
  id: "app-001",
  name: "Timur Aliev",
  email: "timur.aliev@email.com",
  currentStatus: "Verified",
  appliedDate: "2026-02-15",
  program: "Computer Science — Bachelor's",
  statusHistory: [
    {
      status: "Applied",
      timestamp: "2026-02-15T10:00:00Z",
      note: "Application submitted",
    },
    {
      status: "DocsPending",
      timestamp: "2026-02-15T10:01:00Z",
      note: "Awaiting document upload",
    },
    {
      status: "DocsInReview",
      timestamp: "2026-02-20T14:30:00Z",
      note: "Documents sent for review",
    },
    {
      status: "Verified",
      timestamp: "2026-02-25T09:15:00Z",
      note: "Documents verified",
    },
  ],
};

export const mockDocuments: ApplicantDocument[] = [
  {
    id: "doc-1",
    name: "Passport",
    type: "passport",
    status: "approved",
    fileName: "passport_scan.pdf",
    fileSize: 2_400_000,
    uploadedAt: "2026-02-18T12:00:00Z",
    required: true,
  },
  {
    id: "doc-2",
    name: "Diploma / Degree Certificate",
    type: "diploma",
    status: "approved",
    fileName: "diploma.pdf",
    fileSize: 1_800_000,
    uploadedAt: "2026-02-18T12:05:00Z",
    required: true,
  },
  {
    id: "doc-3",
    name: "Photo 3×4",
    type: "photo",
    status: "approved",
    fileName: "photo_3x4.jpg",
    fileSize: 500_000,
    uploadedAt: "2026-02-19T09:00:00Z",
    required: true,
  },
  {
    id: "doc-4",
    name: "Medical certificate",
    type: "medical",
    status: "rejected",
    fileName: "medical_cert.pdf",
    fileSize: 1_200_000,
    uploadedAt: "2026-02-19T09:10:00Z",
    rejectionReason:
      "Certificate has expired. Please upload a certificate issued no earlier than 6 months ago.",
    required: true,
  },
  {
    id: "doc-5",
    name: "IELTS / TOEFL Certificate",
    type: "certificate",
    status: "pending",
    required: false,
  },
];

export const mockExamSlots: ExamSlot[] = [
  {
    id: "slot-1",
    date: "2026-03-28",
    startTime: "09:00",
    endTime: "11:00",
    subject: "Mathematics",
    available: true,
    seatsLeft: 12,
  },
  {
    id: "slot-2",
    date: "2026-03-28",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Mathematics",
    available: true,
    seatsLeft: 5,
  },
  {
    id: "slot-3",
    date: "2026-03-30",
    startTime: "09:00",
    endTime: "11:00",
    subject: "Mathematics",
    available: true,
    seatsLeft: 20,
  },
  {
    id: "slot-4",
    date: "2026-03-30",
    startTime: "14:00",
    endTime: "16:00",
    subject: "Mathematics",
    available: false,
    seatsLeft: 0,
  },
  {
    id: "slot-5",
    date: "2026-04-02",
    startTime: "10:00",
    endTime: "12:00",
    subject: "Mathematics",
    available: true,
    seatsLeft: 18,
  },
];

export const mockScheduledExam: ScheduledExam = {
  id: "exam-001",
  slotId: "slot-1",
  subject: "Mathematics",
  date: "2026-03-28",
  startTime: "09:00",
  endTime: "11:00",
  status: "scheduled",
};

export const mockPrepChecklist: PrepChecklistItem[] = [
  { id: "prep-1", label: "Webcam is working", checked: false },
  { id: "prep-2", label: "Microphone is working", checked: false },
  {
    id: "prep-3",
    label: "Stable internet connection (≥5 Mbps)",
    checked: false,
  },
  { id: "prep-4", label: "Quiet room with no other people", checked: false },
  {
    id: "prep-5",
    label: "ID document (passport) within reach",
    checked: false,
  },
  {
    id: "prep-6",
    label: "Browser updated to the latest version",
    checked: false,
  },
];

export const mockExamSession: ExamSession = {
  id: "session-001",
  subject: "Mathematics",
  totalQuestions: 10,
  durationMinutes: 120,
  status: "not_started",
  questions: [
    {
      id: "q-1",
      text: "Solve the equation: 2x² + 5x − 3 = 0. Find the sum of the roots.",
      options: [
        { id: "q1-a", label: "−2.5" },
        { id: "q1-b", label: "−1.5" },
        { id: "q1-c", label: "1.5" },
        { id: "q1-d", label: "2.5" },
      ],
    },
    {
      id: "q-2",
      text: "Evaluate the limit: lim(x→0) sin(3x)/x",
      options: [
        { id: "q2-a", label: "0" },
        { id: "q2-b", label: "1" },
        { id: "q2-c", label: "3" },
        { id: "q2-d", label: "∞" },
      ],
    },
    {
      id: "q-3",
      text: "Find the derivative of the function f(x) = x³ − 4x + 1",
      options: [
        { id: "q3-a", label: "3x² − 4" },
        { id: "q3-b", label: "3x² − 4x" },
        { id: "q3-c", label: "x² − 4" },
        { id: "q3-d", label: "3x − 4" },
      ],
    },
    {
      id: "q-4",
      text: "What is the area of the triangle with vertices A(0,0), B(4,0), C(0,3)?",
      options: [
        { id: "q4-a", label: "6" },
        { id: "q4-b", label: "7" },
        { id: "q4-c", label: "12" },
        { id: "q4-d", label: "5" },
      ],
    },
    {
      id: "q-5",
      text: "Simplify the expression: log₂(8) + log₂(4)",
      options: [
        { id: "q5-a", label: "5" },
        { id: "q5-b", label: "7" },
        { id: "q5-c", label: "12" },
        { id: "q5-d", label: "32" },
      ],
    },
    {
      id: "q-6",
      text: "Solve the inequality: |x − 3| < 5",
      options: [
        { id: "q6-a", label: "−2 < x < 8" },
        { id: "q6-b", label: "−5 < x < 5" },
        { id: "q6-c", label: "0 < x < 8" },
        { id: "q6-d", label: "−8 < x < 2" },
      ],
    },
    {
      id: "q-7",
      text: "Evaluate the definite integral: ∫₀¹ 2x dx",
      options: [
        { id: "q7-a", label: "0" },
        { id: "q7-b", label: "1" },
        { id: "q7-c", label: "2" },
        { id: "q7-d", label: "0.5" },
      ],
    },
    {
      id: "q-8",
      text: "Which vector is perpendicular to the vector (3, 4)?",
      options: [
        { id: "q8-a", label: "(4, −3)" },
        { id: "q8-b", label: "(3, 4)" },
        { id: "q8-c", label: "(−3, −4)" },
        { id: "q8-d", label: "(4, 3)" },
      ],
    },
    {
      id: "q-9",
      text: "Find the determinant of the matrix [[2, 3], [1, 4]]",
      options: [
        { id: "q9-a", label: "5" },
        { id: "q9-b", label: "8" },
        { id: "q9-c", label: "11" },
        { id: "q9-d", label: "−5" },
      ],
    },
    {
      id: "q-10",
      text: "How many different ways are there to choose 3 items from 7?",
      options: [
        { id: "q10-a", label: "21" },
        { id: "q10-b", label: "35" },
        { id: "q10-c", label: "42" },
        { id: "q10-d", label: "210" },
      ],
    },
  ],
};

export const mockAppeal: Appeal = {
  id: "appeal-001",
  status: "not_submitted",
  reason: "",
  details: "",
};

export const mockNotifications: AppNotification[] = [
  {
    id: "notif-1",
    type: "status_change",
    title: "Documents verified",
    message:
      "Your documents have been successfully verified. You can now sign up for the exam.",
    timestamp: "2026-02-25T09:15:00Z",
    read: false,
    actionHref: "/applicant/schedule",
  },
  {
    id: "notif-2",
    type: "document",
    title: "Medical certificate rejected",
    message:
      "Certificate has expired. Please upload a valid certificate issued no earlier than 6 months ago.",
    timestamp: "2026-02-24T16:30:00Z",
    read: false,
    actionHref: "/applicant/documents",
  },
  {
    id: "notif-3",
    type: "document",
    title: "Documents received",
    message:
      "Your documents have been received and sent for review. Average review time is 3–5 business days.",
    timestamp: "2026-02-20T14:30:00Z",
    read: true,
  },
  {
    id: "notif-4",
    type: "status_change",
    title: "Application accepted",
    message:
      "Your application for the \"Computer Science — Bachelor's\" program has been successfully registered.",
    timestamp: "2026-02-15T10:01:00Z",
    read: true,
  },
  {
    id: "notif-5",
    type: "general",
    title: "Welcome!",
    message:
      "You have been successfully registered in the Unified Online University system. Please upload the required documents to continue.",
    timestamp: "2026-02-15T10:00:00Z",
    read: true,
    actionHref: "/applicant/documents",
  },
];
