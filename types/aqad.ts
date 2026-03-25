// ─── Status / Enum Types ────────────────────────────────────────────────────

export type CourseStatus =
  | "Draft"
  | "InReview"
  | "Approved"
  | "Rejected"
  | "ConditionalApproval"
  | "Published"
  | "ReApprovalRequired"
  | "Suspended"
  | "Archived";

export type ReviewType = "Initial" | "Resubmission" | "ReApproval";

export type ReviewDecision = "Approved" | "Rejected" | "ConditionalApproval";

export type Priority = "High" | "Medium" | "Low";

export type ChecklistItemStatus =
  | "passed"
  | "failed"
  | "needs_improvement"
  | "pending";

export type ChecklistCategory =
  | "Standards"
  | "Structure"
  | "Materials"
  | "Assessment"
  | "Language"
  | "Communication";

export type ComplaintStatus = "Submitted" | "InReview" | "Resolved";

export type ComplaintOutcome = "Upheld" | "Dismissed" | "PartiallyUpheld";

export type ComplaintCategory =
  | "ContentQuality"
  | "TeacherBehavior"
  | "Technical"
  | "Exam"
  | "Other";

export type CorrectiveActionStatus =
  | "Issued"
  | "InProgress"
  | "Completed"
  | "Verified"
  | "Overdue"
  | "Reopened";

export type CorrectiveActionPriority = "Critical" | "High" | "Medium" | "Low";

export type AuditType = "Scheduled" | "Unplanned";

export type AuditResult = "Passed" | "IssuesFound" | "Suspended";

export type AuditTrailActionType =
  | "Review"
  | "Complaint"
  | "CorrectiveAction"
  | "Audit"
  | "Exam";

export type FraudFlagStatus = "Pending" | "Confirmed" | "Dismissed";

export type ExamType = "Midterm" | "Final" | "Entry" | "Retake";

export type MaterialType = "PDF" | "PPT" | "Video" | "Link" | "Other";

// ─── Team ───────────────────────────────────────────────────────────────────

export type AQADMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  specializations: string[];
  activeReviews: number;
  activeComplaints: number;
  activeCorrectiveActions: number;
  avgReviewDays: number;
};

// ─── Dashboard ──────────────────────────────────────────────────────────────

export type AQADStats = {
  coursesInReview: number;
  pendingComplaints: number;
  activeCorrectiveActions: number;
  overdueActions: number;
  upcomingAudits: number;
  complianceRate: number;
  avgReviewDays: number;
  firstPassRate: number;
};

export type AQADDashboardAlert = {
  id: string;
  type: "danger" | "warning" | "info";
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

// ─── Review Queue ────────────────────────────────────────────────────────────

export type CourseForReview = {
  id: string;
  title: string;
  code: string;
  teacherName: string;
  teacherId: string;
  programName: string;
  submittedAt: string;
  priority: Priority;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  daysInQueue: number;
  reviewType: ReviewType;
  status: CourseStatus;
};

// ─── Quality Checklist ────────────────────────────────────────────────────────

export type QualityChecklistItem = {
  id: string;
  title: string;
  description: string;
  category: ChecklistCategory;
  required: boolean;
  status: ChecklistItemStatus;
  reviewerComment?: string;
  evidenceLinks: string[];
};

export type QualityChecklist = {
  id: string;
  name: string;
  version: string;
  programType?: string;
  items: QualityChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

// ─── Course Detail (for review page) ─────────────────────────────────────────

export type CourseMaterial = {
  id: string;
  name: string;
  type: MaterialType;
  url?: string;
};

export type Lecture = {
  id: string;
  title: string;
  plan: string;
  outcomes: string[];
  materials: CourseMaterial[];
  hasActivities: boolean;
  hasQA: boolean;
};

export type CourseModule = {
  id: string;
  title: string;
  lectures: Lecture[];
};

export type RejectionReason = {
  id: string;
  description: string;
  requiredAction: string;
  deadline: string;
};

export type ConditionalItem = {
  id: string;
  description: string;
  deadline: string;
};

export type ReviewRecord = {
  id: string;
  courseId: string;
  reviewerId: string;
  reviewerName: string;
  decision?: ReviewDecision;
  submittedAt: string;
  completedAt?: string;
  notes: string;
  checklist: QualityChecklistItem[];
  rejectionReasons: RejectionReason[];
  conditionalItems: ConditionalItem[];
};

export type CourseDetail = {
  id: string;
  title: string;
  code: string;
  teacherName: string;
  teacherId: string;
  programName: string;
  credits: number;
  language: string;
  level: string;
  learningOutcomes: string[];
  prerequisites: string[];
  assessmentPolicy: string;
  modules: CourseModule[];
  reviewHistory: ReviewRecord[];
  status: CourseStatus;
};

// ─── Monitoring ──────────────────────────────────────────────────────────────

export type LectureMetrics = {
  lectureId: string;
  lectureTitle: string;
  attendanceRate: number;
  qaQuestions: number;
  avgResponseTime: number;
  chatActivity: number;
  complaintsCount: number;
  feedback?: number;
};

export type PublishedCourse = {
  id: string;
  title: string;
  code: string;
  teacherName: string;
  programName: string;
  publishedAt: string;
  avgAttendance: number;
  avgGrade: number;
  complaintsCount: number;
  lastAuditAt?: string;
  nextAuditAt: string;
  status: CourseStatus;
  qualityScore: number;
  lectureMetrics: LectureMetrics[];
};

export type AnomalyAlert = {
  id: string;
  courseId: string;
  courseTitle: string;
  type: "attendance_drop" | "complaint_spike" | "grade_anomaly" | "qa_inactive";
  description: string;
  severity: "high" | "medium" | "low";
  detectedAt: string;
};

// ─── Complaints ──────────────────────────────────────────────────────────────

export type ComplaintEvidence = {
  id: string;
  type: "file" | "link" | "screenshot";
  name: string;
  url?: string;
};

export type Complaint = {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  lectureId?: string;
  lectureTitle?: string;
  category: ComplaintCategory;
  description: string;
  priority: Priority;
  status: ComplaintStatus;
  submittedAt: string;
  investigatorId?: string;
  investigatorName?: string;
  outcome?: ComplaintOutcome;
  resolutionDescription?: string;
  slaDeadline: string;
  evidence: ComplaintEvidence[];
  investigationNotes?: string;
};

// ─── Corrective Actions ───────────────────────────────────────────────────────

export type CorrectiveAction = {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  issueDescription: string;
  requiredAction: string;
  deadline: string;
  priority: CorrectiveActionPriority;
  status: CorrectiveActionStatus;
  issuedAt: string;
  issuedById: string;
  issuedByName: string;
  teacherResponse?: string;
  completedAt?: string;
  verifiedAt?: string;
  verifiedById?: string;
  evidence: string[];
};

// ─── Audits ───────────────────────────────────────────────────────────────────

export type Audit = {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
  programName: string;
  scheduledAt: string;
  type: AuditType;
  result?: AuditResult;
  auditorId?: string;
  auditorName?: string;
  notes?: string;
  checklist: QualityChecklistItem[];
  completedAt?: string;
  reason?: string;
};

// ─── Standards ───────────────────────────────────────────────────────────────

export type AcademicStandard = {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "International" | "Internal" | "Accreditation";
  mappedChecklistItems: string[];
};

export type RejectionTemplate = {
  id: string;
  title: string;
  description: string;
  requiredAction: string;
};

export type CorrectiveActionTemplate = {
  id: string;
  title: string;
  issueDescription: string;
  requiredAction: string;
  defaultDays: number;
  priority: CorrectiveActionPriority;
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export type ReportType =
  | "QualityOverview"
  | "CourseQuality"
  | "TeacherQuality"
  | "ComplaintAnalysis"
  | "CorrectiveActions"
  | "AuditResults"
  | "TopProblematic"
  | "AccreditationCompliance";

export type ReportRecord = {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: string;
  generatedByName: string;
  period: string;
  format: "PDF" | "Excel";
};

// ─── Analytics ───────────────────────────────────────────────────────────────

export type ComplianceDataPoint = {
  period: string;
  rate: number;
};

export type ReviewDecisionDataPoint = {
  name: string;
  value: number;
  color: string;
};

export type MonthlyDataPoint = {
  month: string;
  value: number;
};

// ─── Exams Audit ─────────────────────────────────────────────────────────────

export type ExamForAudit = {
  id: string;
  courseId: string;
  courseTitle: string;
  examType: ExamType;
  date: string;
  studentCount: number;
  fraudFlagsCount: number;
  status: "PendingReview" | "Reviewed";
};

export type FraudFlag = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  flagType: string;
  description: string;
  evidence: string;
  timestamp: string;
  status: FraudFlagStatus;
  reviewerDecision?: string;
};

// ─── Audit Trail ──────────────────────────────────────────────────────────────

export type AuditTrailEntry = {
  id: string;
  timestamp: string;
  actionType: AuditTrailActionType;
  actorId: string;
  actorName: string;
  courseId?: string;
  courseTitle?: string;
  details: string;
  evidenceLinks: string[];
};
