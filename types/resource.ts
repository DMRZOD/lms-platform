// ─── Status / Enum Types ────────────────────────────────────────────────────

export type TeacherStatus = "Pending" | "Verified" | "Active" | "Suspended";

export type AssignmentType = "Primary" | "CoTeaching" | "TA";
export type AssignmentStatus = "Active" | "Completed" | "Pending";

export type WorkloadStatus = "Normal" | "High" | "Overloaded" | "Underloaded";

export type ReplacementReason =
  | "Resignation"
  | "Medical Leave"
  | "Vacation"
  | "Overload"
  | "Low Quality"
  | "Disciplinary";

export type ReplacementStatus =
  | "Initiated"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export type ReplacementScope = "All" | "Specific";

export type AccessLevel = "Full" | "ReadOnly";
export type AccessType = "Permanent" | "Temporary";

export type DocumentType = "Certificate" | "Contract" | "CV" | "Additional";
export type DocumentStatus = "Pending" | "Verified" | "Rejected";

export type AlertSeverity = "warning" | "danger" | "info";

// ─── Entity Interfaces ───────────────────────────────────────────────────────

export interface ResourceTeacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string[];
  status: TeacherStatus;
  coursesCount: number;
  studentsCount: number;
  lectureHoursWeek: number;
  lectureHoursSemester: number;
  /** 0–100 composite score */
  kpiScore: number;
  contractEndDate: string | null;
  registeredAt: string;
  maxWorkloadHours: number;
  preferredLanguage: string;
  bio: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  program: string;
  course: string;
  courseCode: string;
  group: string;
  type: AssignmentType;
  startDate: string;
  endDate: string;
  status: AssignmentStatus;
}

export interface WorkloadEntry {
  teacherId: string;
  teacherName: string;
  department: string;
  courses: number;
  lectureHoursWeek: number;
  lectureHoursSemester: number;
  students: number;
  /** Answers posted per week */
  qaActivity: number;
  /** Assignments pending grading */
  gradingQueue: number;
  maxWorkloadHours: number;
  status: WorkloadStatus;
}

export interface TeacherKPI {
  teacherId: string;
  teacherName: string;
  department: string;
  /** Lecture attendance % across all courses */
  avgAttendance: number;
  /** Average student feedback score (0–5) */
  feedbackScore: number;
  /** % of Q&A answers within 24-hour SLA */
  qaSLAPercent: number;
  qaAvgResponseHours: number;
  qaUnanswered: number;
  /** % of courses that passed AQAD review on first attempt */
  aqadFirstPassRate: number;
  /** Composite overall score (0–100) */
  overallScore: number;
  semester: string;
  prevSemesterScore: number | null;
}

export interface ReplacementStep {
  label: string;
  status: "Completed" | "InProgress" | "Pending";
  completedAt?: string;
}

export interface Replacement {
  id: string;
  currentTeacherId: string;
  currentTeacherName: string;
  newTeacherId: string;
  newTeacherName: string;
  reason: ReplacementReason;
  effectiveDate: string;
  status: ReplacementStatus;
  scope: ReplacementScope;
  courses: string[];
  isTemporary: boolean;
  endDate?: string;
  autoRevert: boolean;
  initiatedBy: string;
  initiatedAt: string;
  steps: ReplacementStep[];
}

export interface AccessEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  level: AccessLevel;
  type: AccessType;
  expiryDate?: string;
  grantedBy: string;
  grantedAt: string;
}

export interface AccessHistoryEntry {
  id: string;
  teacherName: string;
  courseName: string;
  courseCode: string;
  action: "Granted" | "Revoked";
  level: AccessLevel;
  reason: string;
  actor: string;
  timestamp: string;
}

export interface TeacherDocument {
  id: string;
  teacherId: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  uploadedAt: string;
  comment?: string;
}

export interface ResourceStats {
  totalTeachers: number;
  byStatus: {
    pending: number;
    verified: number;
    active: number;
    suspended: number;
  };
  activeAssignments: number;
  avgWorkloadHours: number;
  overloadedCount: number;
  pendingVerification: number;
  expiringContracts: number;
}

export interface ResourceAlert {
  id: string;
  type: "workload" | "performance" | "contract";
  teacherName: string;
  teacherId: string;
  message: string;
  severity: AlertSeverity;
}
