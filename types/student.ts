export type AccessStatus =
  | "Active"
  | "BlockedByDebt"
  | "BlockedByFraud"
  | "SuspendedByAdmin"
  | "TemporaryOverride";

export type CourseStatus = "in_progress" | "completed" | "dropped" | "upcoming";

export type ModuleStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export type LectureStatus = "upcoming" | "live" | "completed" | "missed";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type AssignmentStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "graded"
  | "late"
  | "overdue";

export type ExamType = "midterm" | "final" | "quiz" | "retake";

export type ExamStatus =
  | "upcoming"
  | "eligible"
  | "ineligible"
  | "in_progress"
  | "completed"
  | "missed";

export type PaymentStatus = "paid" | "pending" | "overdue" | "partial";

export type PaymentMethod = "card" | "bank_transfer" | "scholarship";

export type StudentNotificationType =
  | "lecture"
  | "assignment"
  | "grade"
  | "exam"
  | "finance"
  | "attendance"
  | "system"
  | "access";

export type ScheduleEventType =
  | "lecture"
  | "exam"
  | "assignment_due"
  | "office_hours";

export type CalendarView = "day" | "week" | "month";

export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  program: string;
  faculty: string;
  year: number;
  semester: number;
  group: string;
  enrollmentDate: string;
  accessStatus: AccessStatus;
  temporaryOverrideUntil?: string;
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
  avatarUrl?: string;
};

export type LectureMaterial = {
  id: string;
  lectureId: string;
  name: string;
  type: "pdf" | "video" | "link" | "slides";
  url: string;
  size?: number;
};

export type Module = {
  id: string;
  courseId: string;
  name: string;
  orderIndex: number;
  status: ModuleStatus;
  lectureIds: string[];
  description?: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  description: string;
  teacherName: string;
  teacherId: string;
  credits: number;
  semester: number;
  status: CourseStatus;
  progress: number;
  currentGrade?: string;
  currentScore?: number;
  attendanceRate: number;
  totalLectures: number;
  completedLectures: number;
  schedule: string;
  modules: Module[];
  gradingPolicy: GradingPolicyItem[];
  prerequisites?: string[];
  language: string;
  category: string;
};

export type GradingPolicyItem = {
  type: string;
  weight: number;
  description?: string;
};

export type Lecture = {
  id: string;
  courseId: string;
  courseName: string;
  moduleId: string;
  title: string;
  description: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  status: LectureStatus;
  attendanceStatus?: AttendanceStatus;
  materials: LectureMaterial[];
  recordingUrl?: string;
  isLive: boolean;
};

export type QAMessage = {
  id: string;
  lectureId: string;
  authorName: string;
  authorRole: "student" | "teacher";
  content: string;
  timestamp: string;
  parentId?: string;
  upvotes: number;
  isAccepted?: boolean;
};

export type ChatMessage = {
  id: string;
  authorName: string;
  content: string;
  timestamp: string;
};

export type RubricItem = {
  id: string;
  criterion: string;
  maxPoints: number;
  earnedPoints?: number;
  feedback?: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  courseName: string;
  lectureId?: string;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  maxScore: number;
  score?: number;
  weight: number;
  submittedAt?: string;
  feedback?: string;
  rubric: RubricItem[];
  maxAttempts?: number;
  currentAttempt?: number;
  latePolicy?: string;
};

export type ExamEligibility = {
  attendanceMet: boolean;
  attendanceRequired: number;
  attendanceActual: number;
  debtFree: boolean;
  prerequisitesDone: boolean;
  prerequisites: string[];
  overrideGranted: boolean;
  isEligible: boolean;
};

export type ExamQuestionOption = {
  id: string;
  label: string;
};

export type ExamQuestion = {
  id: string;
  text: string;
  type: "multiple_choice" | "short_answer" | "essay";
  options?: ExamQuestionOption[];
  selectedOptionId?: string;
  answer?: string;
  points: number;
};

export type Exam = {
  id: string;
  courseId: string;
  courseName: string;
  type: ExamType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: ExamStatus;
  totalQuestions: number;
  score?: number;
  maxScore: number;
  eligibility: ExamEligibility;
  location?: string;
};

export type GradeBreakdownItem = {
  id: string;
  name: string;
  type: "assignment" | "midterm" | "final" | "quiz" | "participation";
  weight: number;
  score: number;
  maxScore: number;
  gradedAt?: string;
};

export type Grade = {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  items: GradeBreakdownItem[];
  midtermScore?: number;
  finalScore?: number;
  totalScore: number;
  letterGrade: string;
  gpaPoints: number;
};

export type AttendanceRecord = {
  id: string;
  lectureId: string;
  courseId: string;
  courseName: string;
  lectureTitle: string;
  date: string;
  status: AttendanceStatus;
  joinTime?: string;
  leaveTime?: string;
  duration?: number;
};

export type CourseAttendanceSummary = {
  courseId: string;
  courseName: string;
  totalLectures: number;
  attended: number;
  missed: number;
  late: number;
  excused: number;
  rate: number;
  threshold: number;
};

export type Payment = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  semester: string;
  receiptUrl?: string;
};

export type FinancialSummary = {
  totalOwed: number;
  totalPaid: number;
  currentDebt: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  currency: string;
};

export type StudentNotification = {
  id: string;
  type: StudentNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionHref?: string;
  priority: "normal" | "urgent";
};

export type ScheduleEvent = {
  id: string;
  type: ScheduleEventType;
  title: string;
  courseId?: string;
  courseName?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingUrl?: string;
  color?: string;
};
