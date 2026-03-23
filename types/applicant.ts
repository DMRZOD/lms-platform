export type AdmissionStatus =
  | "Applied"
  | "DocsPending"
  | "DocsInReview"
  | "Verified"
  | "ExamScheduled"
  | "ExamInProgress"
  | "ExamCompleted"
  | "Passed"
  | "Failed"
  | "Enrolled";

export type StatusHistoryEntry = {
  status: AdmissionStatus;
  timestamp: string;
  note?: string;
};

export type ApplicantProfile = {
  id: string;
  name: string;
  email: string;
  currentStatus: AdmissionStatus;
  statusHistory: StatusHistoryEntry[];
  appliedDate: string;
  program: string;
};

export type DocumentStatus =
  | "pending"
  | "uploaded"
  | "in_review"
  | "approved"
  | "rejected";

export type DocumentType =
  | "passport"
  | "diploma"
  | "photo"
  | "medical"
  | "certificate";

export type ApplicantDocument = {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
  rejectionReason?: string;
  required: boolean;
};

export type ExamSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  available: boolean;
  seatsLeft: number;
};

export type ScheduledExam = {
  id: string;
  slotId: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "rescheduled" | "completed" | "cancelled";
};

export type PrepChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

export type ExamQuestionOption = {
  id: string;
  label: string;
};

export type ExamQuestion = {
  id: string;
  text: string;
  options: ExamQuestionOption[];
  selectedOptionId?: string;
};

export type ExamSession = {
  id: string;
  subject: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: ExamQuestion[];
  status: "not_started" | "in_progress" | "submitted";
};

export type AppealStatus =
  | "not_submitted"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected";

export type Appeal = {
  id: string;
  status: AppealStatus;
  reason: string;
  details: string;
  submittedAt?: string;
  decision?: string;
  decisionNote?: string;
  decidedAt?: string;
};

export type NotificationType =
  | "status_change"
  | "document"
  | "exam"
  | "appeal"
  | "general";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionHref?: string;
};
