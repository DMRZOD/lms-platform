// ─── Status / Enum Types ───────────────────────────────────────────────────

export type ProgramStatus = "Draft" | "Active" | "Archived" | "Suspended";

export type GroupStatus = "Active" | "Graduated" | "Dissolved" | "OnHold";

export type AdmissionDecision =
  | "Pending"
  | "DocsPending"
  | "DocsInReview"
  | "Verified"
  | "RejectedDocs"
  | "Waitlisted";

export type ExceptionType =
  | "Debt"
  | "Attendance"
  | "Prerequisite"
  | "Probation";

export type ExceptionStatus = "Active" | "Expired" | "Revoked" | "PendingReview";

export type AcademicStanding =
  | "GoodStanding"
  | "Warning"
  | "Probation"
  | "Dismissed";

export type EligibilityStatus = "Eligible" | "Ineligible" | "Override" | "Pending";

export type ScheduleEventType = "Lecture" | "Exam" | "Consultation" | "Event";

export type ScheduleSyncStatus =
  | "Synced"
  | "PendingSync"
  | "Conflict"
  | "ManualOverride";

export type RetakeStatus =
  | "Pending"
  | "Scheduled"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export type CoordinationDepartment = "Finance" | "AQAD" | "Resource" | "Admin" | "Academic";

export type CoordinationRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Expired";

export type SemesterType = "Fall" | "Spring" | "Summer";

export type ExceptionScope = "LecturesOnly" | "ExamOnly" | "FullAccess";

export type DegreeType = "Bachelor" | "Master" | "PhD";

export type InterventionStatus = "Open" | "InProgress" | "Resolved";

// ─── Academic Program ──────────────────────────────────────────────────────

export type AcademicProgram = {
  id: string;
  code: string;
  name: string;
  description: string;
  faculty: string;
  degree: DegreeType;
  totalCredits: number;
  durationSemesters: number;
  language: string;
  status: ProgramStatus;
  groupCount: number;
  studentCount: number;
  courseCount: number;
  accredited: boolean;
  minAttendance: number;
  minGrade: number;
  createdAt: string;
  updatedAt: string;
};

export type ProgramCourse = {
  id: string;
  programId: string;
  courseCode: string;
  courseName: string;
  semester: number;
  credits: number;
  isElective: boolean;
  prerequisiteIds: string[];
  teacherName?: string;
};

export type ProgramRule = {
  id: string;
  programId: string;
  type: "graduation" | "progression" | "prerequisite" | "attendance";
  title: string;
  description: string;
  threshold?: number;
};

// ─── Student Group ─────────────────────────────────────────────────────────

export type StudentGroup = {
  id: string;
  code: string;
  name: string;
  programId: string;
  programName: string;
  year: number;
  semester: number;
  status: GroupStatus;
  studentCount: number;
  advisorName: string;
  advisorId: string;
  intake: string;
  createdAt: string;
};

export type GroupStudent = {
  id: string;
  groupId: string;
  studentId: string;
  studentName: string;
  email: string;
  enrolledAt: string;
  transferredFrom?: string;
  transferReason?: string;
  gpa: number;
  semesterGpa: number;
  attendanceRate: number;
  standing: AcademicStanding;
  atRisk: boolean;
};

export type GroupTeacher = {
  id: string;
  groupId: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseName: string;
  role: "primary" | "assistant";
};

// ─── Schedule ─────────────────────────────────────────────────────────────

export type ScheduleEntry = {
  id: string;
  groupId: string;
  groupName: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  type: ScheduleEventType;
  syncStatus: ScheduleSyncStatus;
  overrideReason?: string;
  validFrom: string;
  validTo: string;
  semester: string;
};

export type ScheduleSyncLog = {
  id: string;
  syncedAt: string;
  status: "Success" | "PartialSuccess" | "Failed";
  entriesUpdated: number;
  conflicts: number;
  resolvedBy?: string;
  semester: string;
};

// ─── Admission ────────────────────────────────────────────────────────────

export type AdmissionApplicant = {
  id: string;
  applicantName: string;
  email: string;
  programId: string;
  programName: string;
  docStatus: AdmissionDecision;
  decision?: "Verified" | "RejectedDocs";
  rejectionReason?: string;
  score?: number;
  rank?: number;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  waitlistPosition?: number;
  documents: AdmissionDocument[];
};

export type AdmissionDocument = {
  id: string;
  type: string;
  name: string;
  status: "Uploaded" | "Verified" | "Rejected" | "Missing";
  required: boolean;
  rejectionReason?: string;
};

// ─── Exam Eligibility ─────────────────────────────────────────────────────

export type EligibilityRule = {
  id: string;
  name: string;
  type: "attendance" | "finance" | "prerequisite" | "sanction";
  description: string;
  threshold?: number;
  isActive: boolean;
  appliesToPrograms: string[];
};

export type EligibilityCheck = {
  passed: boolean;
  value?: string;
  required?: string;
  note?: string;
};

export type EligibilityRecord = {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  courseId: string;
  courseName: string;
  examType: "Midterm" | "Final" | "Retake";
  status: EligibilityStatus;
  checks: {
    attendance: EligibilityCheck;
    finance: EligibilityCheck;
    prerequisite: EligibilityCheck;
    sanction: EligibilityCheck;
  };
  overrideId?: string;
};

// ─── Exceptions ───────────────────────────────────────────────────────────

export type AuditTrailEntry = {
  id: string;
  exceptionId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details: string;
};

export type AcademicException = {
  id: string;
  studentId: string;
  studentName: string;
  type: ExceptionType;
  reasonCode: string;
  description: string;
  scope: ExceptionScope;
  grantedBy: string;
  grantedAt: string;
  expiresAt: string;
  status: ExceptionStatus;
  auditTrail: AuditTrailEntry[];
};

// ─── Performance ──────────────────────────────────────────────────────────

export type RiskFactor = "LowAttendance" | "LowGrades" | "FinancialIssue" | "MissedAssignments";

export type Intervention = {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  description: string;
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
  status: InterventionStatus;
  deadline: string;
};

export type PerformanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  programName: string;
  gpa: number;
  semesterGpa: number;
  attendanceRate: number;
  standing: AcademicStanding;
  atRisk: boolean;
  riskFactors: RiskFactor[];
  interventions: Intervention[];
  creditsPassed: number;
  creditsTotal: number;
};

export type StandingChange = {
  id: string;
  studentId: string;
  studentName: string;
  previousStanding: AcademicStanding;
  newStanding: AcademicStanding;
  reason: string;
  changedBy: string;
  changedAt: string;
  semester: string;
};

// ─── Retakes ──────────────────────────────────────────────────────────────

export type RetakeRequest = {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  examType: "Midterm" | "Final";
  originalScore: number;
  retakeScore?: number;
  status: RetakeStatus;
  scheduledDate?: string;
  reason: string;
  approvedBy?: string;
  attempt: number;
  maxAttempts: number;
};

// ─── Coordination ─────────────────────────────────────────────────────────

export type CoordinationRequest = {
  id: string;
  fromDepartment: CoordinationDepartment | "Academic";
  toDepartment: CoordinationDepartment;
  type: string;
  subject: string;
  description: string;
  status: CoordinationRequestStatus;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  expiresAt?: string;
};

export type FinanceOverride = {
  id: string;
  studentId: string;
  studentName: string;
  debtAmount: number;
  reason: string;
  reasonCode: string;
  scope: ExceptionScope;
  grantedBy: string;
  grantedAt: string;
  expiresAt: string;
  isActive: boolean;
  coordinationRequestId?: string;
};

// ─── Dashboard ────────────────────────────────────────────────────────────

export type AcademicDashboardStats = {
  totalPrograms: number;
  activeGroups: number;
  totalStudents: number;
  totalTeachers: number;
  pendingAdmissions: number;
  docsInReview: number;
  atRiskStudents: number;
  activeExceptions: number;
  scheduleConflicts: number;
  lastSyncedAt: string;
  upcomingExams: number;
  onProbation: number;
};

export type DashboardAlert = {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  actionHref: string;
  actionLabel: string;
  createdAt: string;
};

// ─── Settings ─────────────────────────────────────────────────────────────

export type DepartmentSettings = {
  currentSemester: string;
  semesterStart: string;
  semesterEnd: string;
  defaultMinAttendance: number;
  debtBlockingEnabled: boolean;
  sanctionBlockingEnabled: boolean;
  syncFrequencyHours: number;
  autoResolveConflicts: boolean;
  notifyOnAdmission: boolean;
  notifyOnEligibilityChange: boolean;
  notifyOnAtRisk: boolean;
  notifyOnExceptionExpiry: boolean;
  auditRetentionDays: number;
  autoArchiveExpiredExceptions: boolean;
};
