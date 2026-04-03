// ─── Course Status ──────────────────────────────────────────────────────────

export type CourseStatus =
  | "Draft"
  | "InReview"
  | "Approved"
  | "Rejected"
  | "Published"
  | "ReApprovalRequired";

export type LectureStatus = "scheduled" | "live" | "completed" | "cancelled";

export type MaterialType = "pdf" | "ppt" | "video" | "link" | "interactive";

export type MaterialVersion = "minor" | "major";

export type ActivityType = "quiz" | "question" | "poll" | "assignment";

export type AssignmentStatus = "draft" | "published" | "closed";

export type SubmissionStatus = "not_submitted" | "submitted" | "late" | "graded";

export type ExamType = "midterm" | "final" | "retake";

export type ExamStatus = "upcoming" | "in_progress" | "completed";

export type QAStatus = "open" | "answered" | "closed";

export type QAPriority = "low" | "medium" | "high";

export type AQADReviewStatus =
  | "InReview"
  | "Approved"
  | "Rejected"
  | "ConditionalApproval";

export type CorrectiveActionStatus = "pending" | "in_progress" | "completed" | "overdue";

export type CorrectiveActionPriority = "low" | "medium" | "high" | "critical";

export type TeacherNotificationType =
  | "aqad"
  | "submission"
  | "qa"
  | "lecture"
  | "corrective_action"
  | "course"
  | "system";

export type CalendarView = "day" | "week" | "month";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type CourseLanguage = "English" | "Russian" | "Uzbek";

// ─── Core Entities ───────────────────────────────────────────────────────────

export type TeacherProfile = {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  title: string;
  faculty: string;
  joinDate: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  kpi: TeacherKPI;
  notificationSettings: NotificationSettings;
};

export type TeacherKPI = {
  avgAttendance: number;
  avgStudentRating: number;
  qaSlaPercent: number;
  aqadFirstPassRate: number;
};

export type NotificationSettings = {
  emailOnNewQuestion: boolean;
  emailOnSubmission: boolean;
  emailOnAqadFeedback: boolean;
  emailLectureReminder: boolean;
  pushNotifications: boolean;
};

// ─── Courses ─────────────────────────────────────────────────────────────────

export type GradingPolicyItem = {
  type: string;
  weight: number;
  description: string;
};

export type GradeScale = {
  letter: string;
  minScore: number;
  maxScore: number;
};

export type TeacherCourse = {
  id: string;
  code: string;
  name: string;
  description: string;
  status: CourseStatus;
  semester: number;
  year: string;
  credits: number;
  language: CourseLanguage;
  difficultyLevel: DifficultyLevel;
  learningOutcomes: string[];
  prerequisites: string[];
  totalStudents: number;
  totalLectures: number;
  completedLectures: number;
  avgAttendance: number;
  avgGrade: number;
  gradingPolicy: GradingPolicyItem[];
  gradeScale: GradeScale[];
  lateSubmissionPolicy: string;
  aqadRemarks?: number;
  submittedForReviewAt?: string;
  publishedAt?: string;
  lastUpdatedAt: string;
};

// ─── Modules ─────────────────────────────────────────────────────────────────

export type CourseModule = {
  id: string;
  courseId: string;
  name: string;
  description: string;
  orderIndex: number;
  lectureIds: string[];
};

// ─── Lectures ────────────────────────────────────────────────────────────────

export type LectureMaterial = {
  id: string;
  lectureId: string;
  title: string;
  type: MaterialType;
  url: string;
  description?: string;
  orderIndex: number;
  versionType: MaterialVersion;
  uploadedAt: string;
  fileSize?: string;
};

export type LectureActivity = {
  id: string;
  lectureId: string;
  type: ActivityType;
  title: string;
  description?: string;
  maxScore?: number;
  isRequired: boolean;
};

export type TeacherLecture = {
  id: string;
  courseId: string;
  moduleId: string;
  courseName: string;
  courseCode: string;
  topic: string;
  plan: string;
  learningOutcomes: string[];
  date: string;
  startTime: string;
  endTime: string;
  room?: string;
  status: LectureStatus;
  teamsLink?: string;
  teamsRecordingUrl?: string;
  attendanceRate?: number;
  materials: LectureMaterial[];
  activities: LectureActivity[];
  qaOpen: boolean;
  qaCloseAfterHours: number;
  chatEnabled: boolean;
  group: string;
};

// ─── Students ────────────────────────────────────────────────────────────────

export type EnrolledStudent = {
  id: string;
  name: string;
  studentId: string;
  group: string;
  email: string;
  attendanceRate: number;
  currentGrade: string;
  currentScore: number;
  submittedAssignments: number;
  totalAssignments: number;
};

// ─── Attendance ──────────────────────────────────────────────────────────────

export type StudentAttendanceRecord = {
  studentId: string;
  studentName: string;
  entryTime?: string;
  exitTime?: string;
  duration?: number;
  status: "present" | "absent" | "late";
  absenceReason?: string;
};

export type LectureAttendance = {
  lectureId: string;
  lectureTopic: string;
  date: string;
  attendanceRate: number;
  presentCount: number;
  totalCount: number;
  records: StudentAttendanceRecord[];
};

export type TeacherOwnLectureStatus = "conducted" | "missed" | "cancelled" | "substituted";

export type TeacherOwnLectureRecord = {
  lectureId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  room?: string;
  status: TeacherOwnLectureStatus;
  missedReason?: string;
  substituteTeacher?: string;
  cancelReason?: string;
};

// ─── Gradebook ───────────────────────────────────────────────────────────────

export type GradebookColumn = {
  id: string;
  label: string;
  type: "assignment" | "midterm" | "final" | "attendance";
  maxScore: number;
  weight: number;
  publishedAt?: string;
};

export type GradebookCell = {
  columnId: string;
  score: number | null;
  feedback?: string;
  published: boolean;
  submittedAt?: string;
  gradedAt?: string;
  isOverdue: boolean;
};

export type GradebookRow = {
  studentId: string;
  studentName: string;
  group: string;
  cells: Record<string, GradebookCell>;
  totalScore: number;
  finalGrade: string;
};

// ─── Assignments ─────────────────────────────────────────────────────────────

export type RubricCriterion = {
  id: string;
  criterion: string;
  maxScore: number;
  levels: { label: string; score: number; description: string }[];
};

export type TeacherAssignment = {
  id: string;
  courseId: string;
  lectureId: string;
  courseName: string;
  lectureTopic: string;
  title: string;
  description: string;
  instructions: string;
  rubrics: RubricCriterion[];
  deadline: string;
  lateSubmissionAllowed: boolean;
  latePenaltyPercent: number;
  maxAttempts: number;
  allowedFileTypes: string[];
  plagiarismCheck: boolean;
  status: AssignmentStatus;
  submissionsCount: number;
  totalStudents: number;
  gradedCount: number;
};

export type StudentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: SubmissionStatus;
  files: { name: string; url: string; size: string }[];
  score?: number;
  feedback?: string;
  rubricScores?: Record<string, number>;
  isLate: boolean;
};

// ─── Exams ───────────────────────────────────────────────────────────────────

export type ExamQuestion = {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  options?: string[];
  correctAnswer?: string;
  maxScore: number;
};

export type StudentEligibility = {
  studentId: string;
  studentName: string;
  attendanceRate: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  isEligible: boolean;
  ineligibilityReasons: string[];
};

export type ExamResult = {
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  grade: string;
  submittedAt: string;
  hasAppeal: boolean;
  appealStatus?: "pending" | "reviewed" | "resolved";
  appealComment?: string;
};

export type TeacherExam = {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  type: ExamType;
  date: string;
  startTime: string;
  duration: number;
  room: string;
  status: ExamStatus;
  totalStudents: number;
  eligibleCount: number;
  questions: ExamQuestion[];
  eligibility: StudentEligibility[];
  results: ExamResult[];
};

// ─── Q&A ─────────────────────────────────────────────────────────────────────

export type QAAnswer = {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorRole: "teacher" | "student";
  content: string;
  createdAt: string;
  isAccepted: boolean;
  isHidden: boolean;
};

export type QAQuestion = {
  id: string;
  courseId: string;
  courseName: string;
  lectureId?: string;
  lectureTopic?: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  status: QAStatus;
  votes: number;
  answers: QAAnswer[];
  isHidden: boolean;
  authorMuted: boolean;
  slaDeadline: string;
  slaBreached: boolean;
};

// ─── Communications ───────────────────────────────────────────────────────────

export type ChatMessage = {
  id: string;
  lectureId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isHidden: boolean;
  authorMuted: boolean;
};

export type MaterialComment = {
  id: string;
  materialId: string;
  lectureId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isHidden: boolean;
};

// ─── AQAD ─────────────────────────────────────────────────────────────────────

export type AQADChecklistItem = {
  id: string;
  category: string;
  criterion: string;
  status: "passed" | "failed" | "needs_revision";
  reviewerComment?: string;
};

export type RequiredAction = {
  id: string;
  description: string;
  isCompleted: boolean;
};

export type AQADReview = {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  status: AQADReviewStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerName?: string;
  checklist: AQADChecklistItem[];
  requiredActions: RequiredAction[];
  deadline?: string;
  teacherResponse?: string;
  resubmittedAt?: string;
};

export type CorrectiveAction = {
  id: string;
  courseId: string;
  courseName: string;
  description: string;
  requiredAction: string;
  deadline: string;
  priority: CorrectiveActionPriority;
  status: CorrectiveActionStatus;
  issuedAt: string;
  completedAt?: string;
  aqadVerified: boolean;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export type TeacherNotification = {
  id: string;
  type: TeacherNotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
};

// ─── Schedule ─────────────────────────────────────────────────────────────────

export type ScheduleEvent = {
  id: string;
  lectureId: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  group: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "lecture" | "exam" | "consultation";
  status: LectureStatus;
};
