import type {
  AcademicDashboardStats,
  AcademicException,
  AcademicProgram,
  AdmissionApplicant,
  AuditTrailEntry,
  CoordinationRequest,
  DashboardAlert,
  DepartmentSettings,
  EligibilityRecord,
  EligibilityRule,
  FinanceOverride,
  GroupStudent,
  GroupTeacher,
  Intervention,
  PerformanceRecord,
  ProgramCourse,
  ProgramRule,
  RetakeRequest,
  ScheduleEntry,
  ScheduleSyncLog,
  StandingChange,
  StudentGroup,
} from "@/types/academic";

// ─── Dashboard ────────────────────────────────────────────────────────────

export const mockAcademicStats: AcademicDashboardStats = {
  totalPrograms: 8,
  activeGroups: 24,
  totalStudents: 1148,
  totalTeachers: 64,
  pendingAdmissions: 37,
  docsInReview: 12,
  atRiskStudents: 43,
  activeExceptions: 18,
  scheduleConflicts: 3,
  lastSyncedAt: "2026-03-24T08:30:00Z",
  upcomingExams: 14,
  onProbation: 9,
};

export const mockDashboardAlerts: DashboardAlert[] = [
  {
    id: "alert-1",
    type: "danger",
    title: "3 schedule conflicts detected",
    message: "aSc sync produced 3 unresolved conflicts for Spring 2026. Review required.",
    actionHref: "/academic/schedules",
    actionLabel: "Resolve Conflicts",
    createdAt: "2026-03-24T09:00:00Z",
  },
  {
    id: "alert-2",
    type: "warning",
    title: "7 exceptions expiring soon",
    message: "Debt and attendance exceptions for 7 students expire within 3 days.",
    actionHref: "/academic/exceptions",
    actionLabel: "View Exceptions",
    createdAt: "2026-03-24T08:00:00Z",
  },
  {
    id: "alert-3",
    type: "warning",
    title: "43 at-risk students",
    message: "Students flagged for low attendance or grades this semester.",
    actionHref: "/academic/performance",
    actionLabel: "View Performance",
    createdAt: "2026-03-23T18:00:00Z",
  },
  {
    id: "alert-4",
    type: "info",
    title: "37 admission applications pending",
    message: "DocsPending and DocsInReview applications awaiting Academic Dept decision.",
    actionHref: "/academic/admissions",
    actionLabel: "Review Applications",
    createdAt: "2026-03-24T07:00:00Z",
  },
];

// ─── Programs ─────────────────────────────────────────────────────────────

export const mockPrograms: AcademicProgram[] = [
  {
    id: "prog-1",
    code: "CS-BSC",
    name: "Bachelor of Science in Computer Science",
    description: "A comprehensive program covering algorithms, software engineering, AI, and systems programming.",
    faculty: "Faculty of Engineering & Technology",
    degree: "Bachelor",
    totalCredits: 240,
    durationSemesters: 8,
    language: "English",
    status: "Active",
    groupCount: 6,
    studentCount: 312,
    courseCount: 42,
    accredited: true,
    minAttendance: 75,
    minGrade: 50,
    createdAt: "2020-09-01T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "prog-2",
    code: "DS-MSC",
    name: "Master of Science in Data Science",
    description: "Advanced program in machine learning, data engineering, and statistical analysis.",
    faculty: "Faculty of Engineering & Technology",
    degree: "Master",
    totalCredits: 120,
    durationSemesters: 4,
    language: "English",
    status: "Active",
    groupCount: 3,
    studentCount: 87,
    courseCount: 18,
    accredited: true,
    minAttendance: 80,
    minGrade: 60,
    createdAt: "2022-09-01T00:00:00Z",
    updatedAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "prog-3",
    code: "BA-BSC",
    name: "Bachelor of Business Administration",
    description: "Core business disciplines including management, finance, marketing, and strategy.",
    faculty: "Faculty of Business",
    degree: "Bachelor",
    totalCredits: 240,
    durationSemesters: 8,
    language: "English",
    status: "Active",
    groupCount: 8,
    studentCount: 421,
    courseCount: 38,
    accredited: true,
    minAttendance: 70,
    minGrade: 50,
    createdAt: "2018-09-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "prog-4",
    code: "LAW-BSC",
    name: "Bachelor of Laws",
    description: "Comprehensive legal education covering civil, criminal, international, and corporate law.",
    faculty: "Faculty of Law",
    degree: "Bachelor",
    totalCredits: 300,
    durationSemesters: 10,
    language: "English",
    status: "Active",
    groupCount: 5,
    studentCount: 234,
    courseCount: 50,
    accredited: true,
    minAttendance: 80,
    minGrade: 55,
    createdAt: "2019-09-01T00:00:00Z",
    updatedAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "prog-5",
    code: "MED-PHD",
    name: "PhD in Biomedical Sciences",
    description: "Research-intensive doctoral program in biomedical research and clinical sciences.",
    faculty: "Faculty of Medicine",
    degree: "PhD",
    totalCredits: 180,
    durationSemesters: 8,
    language: "English",
    status: "Draft",
    groupCount: 0,
    studentCount: 0,
    courseCount: 24,
    accredited: false,
    minAttendance: 85,
    minGrade: 70,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-03-10T00:00:00Z",
  },
  {
    id: "prog-6",
    code: "ECO-BSC",
    name: "Bachelor of Economics",
    description: "Macro/microeconomics, econometrics, and economic policy analysis.",
    faculty: "Faculty of Business",
    degree: "Bachelor",
    totalCredits: 240,
    durationSemesters: 8,
    language: "English",
    status: "Archived",
    groupCount: 0,
    studentCount: 94,
    courseCount: 36,
    accredited: true,
    minAttendance: 70,
    minGrade: 50,
    createdAt: "2015-09-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
];

export const mockProgramCourses: ProgramCourse[] = [
  { id: "pc-1", programId: "prog-1", courseCode: "CS101", courseName: "Introduction to Programming", semester: 1, credits: 6, isElective: false, prerequisiteIds: [], teacherName: "Dr. A. Smith" },
  { id: "pc-2", programId: "prog-1", courseCode: "CS102", courseName: "Discrete Mathematics", semester: 1, credits: 6, isElective: false, prerequisiteIds: [], teacherName: "Prof. B. Jones" },
  { id: "pc-3", programId: "prog-1", courseCode: "CS201", courseName: "Data Structures & Algorithms", semester: 2, credits: 6, isElective: false, prerequisiteIds: ["pc-1"], teacherName: "Dr. A. Smith" },
  { id: "pc-4", programId: "prog-1", courseCode: "CS202", courseName: "Object-Oriented Programming", semester: 2, credits: 6, isElective: false, prerequisiteIds: ["pc-1"], teacherName: "Dr. C. Lee" },
  { id: "pc-5", programId: "prog-1", courseCode: "CS301", courseName: "Database Systems", semester: 3, credits: 6, isElective: false, prerequisiteIds: ["pc-3"], teacherName: "Prof. D. Brown" },
  { id: "pc-6", programId: "prog-1", courseCode: "CS302", courseName: "Operating Systems", semester: 3, credits: 6, isElective: false, prerequisiteIds: ["pc-3", "pc-4"], teacherName: "Dr. E. White" },
  { id: "pc-7", programId: "prog-1", courseCode: "CS401", courseName: "Machine Learning", semester: 4, credits: 6, isElective: true, prerequisiteIds: ["pc-3"], teacherName: "Dr. F. Kim" },
  { id: "pc-8", programId: "prog-1", courseCode: "CS402", courseName: "Software Engineering", semester: 4, credits: 6, isElective: false, prerequisiteIds: ["pc-4", "pc-5"], teacherName: "Prof. G. Patel" },
  { id: "pc-9", programId: "prog-2", courseCode: "DS101", courseName: "Statistics for Data Science", semester: 1, credits: 6, isElective: false, prerequisiteIds: [], teacherName: "Dr. H. Zhang" },
  { id: "pc-10", programId: "prog-2", courseCode: "DS102", courseName: "Python for Data Science", semester: 1, credits: 6, isElective: false, prerequisiteIds: [], teacherName: "Dr. I. Morel" },
  { id: "pc-11", programId: "prog-2", courseCode: "DS201", courseName: "Machine Learning Fundamentals", semester: 2, credits: 6, isElective: false, prerequisiteIds: ["pc-9", "pc-10"], teacherName: "Dr. F. Kim" },
  { id: "pc-12", programId: "prog-2", courseCode: "DS202", courseName: "Deep Learning", semester: 3, credits: 6, isElective: true, prerequisiteIds: ["pc-11"], teacherName: "Dr. J. Nakamura" },
];

export const mockProgramRules: ProgramRule[] = [
  { id: "pr-1", programId: "prog-1", type: "graduation", title: "Minimum Credits", description: "Student must complete at least 240 credits to graduate.", threshold: 240 },
  { id: "pr-2", programId: "prog-1", type: "progression", title: "Semester Progression", description: "Student must pass at least 80% of semester credits to advance.", threshold: 80 },
  { id: "pr-3", programId: "prog-1", type: "attendance", title: "Attendance Requirement", description: "Minimum 75% attendance required per course.", threshold: 75 },
  { id: "pr-4", programId: "prog-1", type: "prerequisite", title: "CS201 Prerequisite", description: "CS201 requires completion of CS101 with a passing grade.", threshold: 50 },
  { id: "pr-5", programId: "prog-2", type: "graduation", title: "Research Thesis", description: "PhD candidates must submit and defend original research thesis.", threshold: undefined },
  { id: "pr-6", programId: "prog-2", type: "attendance", title: "Seminar Attendance", description: "Minimum 85% attendance for all seminars and colloquia.", threshold: 85 },
];

// ─── Groups ───────────────────────────────────────────────────────────────

export const mockGroups: StudentGroup[] = [
  { id: "grp-1", code: "CS-2023-A", name: "Computer Science 2023 Group A", programId: "prog-1", programName: "BSc Computer Science", year: 3, semester: 5, status: "Active", studentCount: 28, advisorName: "Dr. A. Smith", advisorId: "t-1", intake: "2023", createdAt: "2023-09-01T00:00:00Z" },
  { id: "grp-2", code: "CS-2023-B", name: "Computer Science 2023 Group B", programId: "prog-1", programName: "BSc Computer Science", year: 3, semester: 5, status: "Active", studentCount: 26, advisorName: "Dr. C. Lee", advisorId: "t-3", intake: "2023", createdAt: "2023-09-01T00:00:00Z" },
  { id: "grp-3", code: "CS-2024-A", name: "Computer Science 2024 Group A", programId: "prog-1", programName: "BSc Computer Science", year: 2, semester: 3, status: "Active", studentCount: 30, advisorName: "Prof. B. Jones", advisorId: "t-2", intake: "2024", createdAt: "2024-09-01T00:00:00Z" },
  { id: "grp-4", code: "DS-2024-A", name: "Data Science 2024 Group A", programId: "prog-2", programName: "MSc Data Science", year: 1, semester: 2, status: "Active", studentCount: 22, advisorName: "Dr. H. Zhang", advisorId: "t-8", intake: "2024", createdAt: "2024-09-01T00:00:00Z" },
  { id: "grp-5", code: "BA-2023-A", name: "Business Administration 2023 Group A", programId: "prog-3", programName: "BBA", year: 3, semester: 5, status: "Active", studentCount: 35, advisorName: "Prof. K. Wilson", advisorId: "t-11", intake: "2023", createdAt: "2023-09-01T00:00:00Z" },
  { id: "grp-6", code: "BA-2024-A", name: "Business Administration 2024 Group A", programId: "prog-3", programName: "BBA", year: 2, semester: 3, status: "Active", studentCount: 33, advisorName: "Prof. L. Davis", advisorId: "t-12", intake: "2024", createdAt: "2024-09-01T00:00:00Z" },
  { id: "grp-7", code: "LAW-2022-A", name: "Law 2022 Group A", programId: "prog-4", programName: "Bachelor of Laws", year: 4, semester: 7, status: "Active", studentCount: 24, advisorName: "Prof. M. Harris", advisorId: "t-15", intake: "2022", createdAt: "2022-09-01T00:00:00Z" },
  { id: "grp-8", code: "CS-2020-A", name: "Computer Science 2020 Group A", programId: "prog-1", programName: "BSc Computer Science", year: 4, semester: 8, status: "Graduated", studentCount: 25, advisorName: "Dr. A. Smith", advisorId: "t-1", intake: "2020", createdAt: "2020-09-01T00:00:00Z" },
];

export const mockGroupStudents: GroupStudent[] = [
  { id: "gs-1", groupId: "grp-1", studentId: "s-101", studentName: "Amir Karimov", email: "a.karimov@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 3.7, semesterGpa: 3.8, attendanceRate: 92, standing: "GoodStanding", atRisk: false },
  { id: "gs-2", groupId: "grp-1", studentId: "s-102", studentName: "Sofia Petrov", email: "s.petrov@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 3.2, semesterGpa: 3.0, attendanceRate: 78, standing: "GoodStanding", atRisk: false },
  { id: "gs-3", groupId: "grp-1", studentId: "s-103", studentName: "Lucas Mendes", email: "l.mendes@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 2.1, semesterGpa: 1.8, attendanceRate: 61, standing: "Warning", atRisk: true },
  { id: "gs-4", groupId: "grp-1", studentId: "s-104", studentName: "Yuna Park", email: "y.park@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 3.9, semesterGpa: 4.0, attendanceRate: 97, standing: "GoodStanding", atRisk: false },
  { id: "gs-5", groupId: "grp-1", studentId: "s-105", studentName: "Omar Hassan", email: "o.hassan@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 1.8, semesterGpa: 1.5, attendanceRate: 55, standing: "Probation", atRisk: true },
  { id: "gs-6", groupId: "grp-1", studentId: "s-106", studentName: "Elena Ivanova", email: "e.ivanova@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 3.5, semesterGpa: 3.6, attendanceRate: 88, standing: "GoodStanding", atRisk: false },
  { id: "gs-7", groupId: "grp-1", studentId: "s-107", studentName: "Carlos Rivera", email: "c.rivera@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 2.8, semesterGpa: 2.6, attendanceRate: 72, standing: "GoodStanding", atRisk: false },
  { id: "gs-8", groupId: "grp-2", studentId: "s-201", studentName: "Mia Thompson", email: "m.thompson@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 3.6, semesterGpa: 3.7, attendanceRate: 91, standing: "GoodStanding", atRisk: false },
  { id: "gs-9", groupId: "grp-2", studentId: "s-202", studentName: "Adam Nowak", email: "a.nowak@uni.edu", enrolledAt: "2023-09-01T00:00:00Z", gpa: 2.3, semesterGpa: 2.0, attendanceRate: 68, standing: "Warning", atRisk: true },
  { id: "gs-10", groupId: "grp-4", studentId: "s-401", studentName: "Priya Sharma", email: "p.sharma@uni.edu", enrolledAt: "2024-09-01T00:00:00Z", gpa: 3.8, semesterGpa: 3.9, attendanceRate: 95, standing: "GoodStanding", atRisk: false },
];

export const mockGroupTeachers: GroupTeacher[] = [
  { id: "gt-1", groupId: "grp-1", teacherId: "t-1", teacherName: "Dr. A. Smith", courseId: "pc-3", courseName: "Data Structures & Algorithms", role: "primary" },
  { id: "gt-2", groupId: "grp-1", teacherId: "t-3", teacherName: "Dr. C. Lee", courseId: "pc-4", courseName: "Object-Oriented Programming", role: "primary" },
  { id: "gt-3", groupId: "grp-1", teacherId: "t-4", teacherName: "Prof. D. Brown", courseId: "pc-5", courseName: "Database Systems", role: "primary" },
  { id: "gt-4", groupId: "grp-1", teacherId: "t-5", teacherName: "Dr. E. White", courseId: "pc-6", courseName: "Operating Systems", role: "primary" },
  { id: "gt-5", groupId: "grp-2", teacherId: "t-1", teacherName: "Dr. A. Smith", courseId: "pc-3", courseName: "Data Structures & Algorithms", role: "primary" },
  { id: "gt-6", groupId: "grp-2", teacherId: "t-6", teacherName: "Dr. F. Kim", courseId: "pc-7", courseName: "Machine Learning", role: "primary" },
  { id: "gt-7", groupId: "grp-4", teacherId: "t-8", teacherName: "Dr. H. Zhang", courseId: "pc-9", courseName: "Statistics for Data Science", role: "primary" },
  { id: "gt-8", groupId: "grp-4", teacherId: "t-9", teacherName: "Dr. I. Morel", courseId: "pc-10", courseName: "Python for Data Science", role: "primary" },
];

// ─── Schedules ────────────────────────────────────────────────────────────

export const mockScheduleEntries: ScheduleEntry[] = [
  { id: "sch-1", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-3", courseName: "Data Structures & Algorithms", teacherId: "t-1", teacherName: "Dr. A. Smith", room: "Room 301", dayOfWeek: 1, startTime: "09:00", endTime: "10:30", type: "Lecture", syncStatus: "Synced", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-2", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-4", courseName: "Object-Oriented Programming", teacherId: "t-3", teacherName: "Dr. C. Lee", room: "Lab 102", dayOfWeek: 2, startTime: "11:00", endTime: "12:30", type: "Lecture", syncStatus: "Synced", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-3", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-5", courseName: "Database Systems", teacherId: "t-4", teacherName: "Prof. D. Brown", room: "Room 205", dayOfWeek: 3, startTime: "14:00", endTime: "15:30", type: "Lecture", syncStatus: "Conflict", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-4", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-6", courseName: "Operating Systems", teacherId: "t-5", teacherName: "Dr. E. White", room: "Room 301", dayOfWeek: 4, startTime: "09:00", endTime: "10:30", type: "Lecture", syncStatus: "Synced", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-5", groupId: "grp-2", groupName: "CS-2023-B", courseId: "pc-3", courseName: "Data Structures & Algorithms", teacherId: "t-1", teacherName: "Dr. A. Smith", room: "Room 302", dayOfWeek: 1, startTime: "11:00", endTime: "12:30", type: "Lecture", syncStatus: "Synced", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-6", groupId: "grp-2", groupName: "CS-2023-B", courseId: "pc-7", courseName: "Machine Learning", teacherId: "t-6", teacherName: "Dr. F. Kim", room: "Lab 201", dayOfWeek: 3, startTime: "09:00", endTime: "10:30", type: "Lecture", syncStatus: "Conflict", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-7", groupId: "grp-4", groupName: "DS-2024-A", courseId: "pc-9", courseName: "Statistics for Data Science", teacherId: "t-8", teacherName: "Dr. H. Zhang", room: "Room 410", dayOfWeek: 2, startTime: "09:00", endTime: "10:30", type: "Lecture", syncStatus: "Synced", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-8", groupId: "grp-4", groupName: "DS-2024-A", courseId: "pc-10", courseName: "Python for Data Science", teacherId: "t-9", teacherName: "Dr. I. Morel", room: "Lab 301", dayOfWeek: 4, startTime: "14:00", endTime: "15:30", type: "Lecture", syncStatus: "ManualOverride", overrideReason: "Room conflict resolved manually — Lab 301 reassigned", validFrom: "2026-03-10", validTo: "2026-05-31", semester: "Spring 2026" },
  { id: "sch-9", groupId: "grp-5", groupName: "BA-2023-A", courseId: "pc-5", courseName: "Business Strategy", teacherId: "t-11", teacherName: "Prof. K. Wilson", room: "Auditorium A", dayOfWeek: 5, startTime: "10:00", endTime: "11:30", type: "Lecture", syncStatus: "Synced", validFrom: "2026-02-01", validTo: "2026-05-31", semester: "Spring 2026" },
];

export const mockSyncLogs: ScheduleSyncLog[] = [
  { id: "sync-1", syncedAt: "2026-03-24T08:30:00Z", status: "PartialSuccess", entriesUpdated: 87, conflicts: 3, semester: "Spring 2026" },
  { id: "sync-2", syncedAt: "2026-03-17T08:30:00Z", status: "Success", entriesUpdated: 84, conflicts: 0, resolvedBy: "admin@uni.edu", semester: "Spring 2026" },
  { id: "sync-3", syncedAt: "2026-03-10T09:00:00Z", status: "PartialSuccess", entriesUpdated: 82, conflicts: 1, resolvedBy: "academic@uni.edu", semester: "Spring 2026" },
  { id: "sync-4", syncedAt: "2026-02-03T08:30:00Z", status: "Success", entriesUpdated: 90, conflicts: 0, semester: "Spring 2026" },
];

// ─── Admissions ───────────────────────────────────────────────────────────

export const mockAdmissionApplicants: AdmissionApplicant[] = [
  {
    id: "app-1", applicantName: "James Wilson", email: "j.wilson@mail.com", programId: "prog-1", programName: "BSc Computer Science",
    docStatus: "DocsInReview", appliedAt: "2026-03-10T10:00:00Z", reviewedAt: "2026-03-20T14:00:00Z", reviewedBy: "academic@uni.edu",
    score: 87, rank: 5,
    documents: [
      { id: "doc-1", type: "Passport", name: "passport.pdf", status: "Verified", required: true },
      { id: "doc-2", type: "HighSchoolDiploma", name: "diploma.pdf", status: "Verified", required: true },
      { id: "doc-3", type: "EntranceExamResult", name: "exam_result.pdf", status: "Verified", required: true },
    ],
  },
  {
    id: "app-2", applicantName: "Aisha Patel", email: "a.patel@mail.com", programId: "prog-2", programName: "MSc Data Science",
    docStatus: "DocsPending", appliedAt: "2026-03-15T09:30:00Z",
    score: 91,
    documents: [
      { id: "doc-4", type: "Passport", name: "passport.pdf", status: "Uploaded", required: true },
      { id: "doc-5", type: "BachelorDiploma", name: "bachelor_diploma.pdf", status: "Uploaded", required: true },
      { id: "doc-6", type: "Transcript", name: "transcript.pdf", status: "Missing", required: true },
    ],
  },
  {
    id: "app-3", applicantName: "Dmitri Volkov", email: "d.volkov@mail.com", programId: "prog-3", programName: "BBA",
    docStatus: "Verified", decision: "Verified", appliedAt: "2026-03-01T11:00:00Z", reviewedAt: "2026-03-12T16:00:00Z", reviewedBy: "academic@uni.edu",
    score: 76, rank: 18,
    documents: [
      { id: "doc-7", type: "Passport", name: "passport.pdf", status: "Verified", required: true },
      { id: "doc-8", type: "HighSchoolDiploma", name: "diploma.pdf", status: "Verified", required: true },
    ],
  },
  {
    id: "app-4", applicantName: "Lin Wei", email: "l.wei@mail.com", programId: "prog-1", programName: "BSc Computer Science",
    docStatus: "RejectedDocs", decision: "RejectedDocs", rejectionReason: "High school diploma not authenticated by Ministry of Education. Please re-submit certified copy.",
    appliedAt: "2026-03-05T14:00:00Z", reviewedAt: "2026-03-14T11:00:00Z", reviewedBy: "academic@uni.edu",
    score: 82,
    documents: [
      { id: "doc-9", type: "Passport", name: "passport.pdf", status: "Verified", required: true },
      { id: "doc-10", type: "HighSchoolDiploma", name: "diploma.pdf", status: "Rejected", required: true, rejectionReason: "Not authenticated by Ministry of Education" },
    ],
  },
  {
    id: "app-5", applicantName: "Sarah O'Brien", email: "s.obrien@mail.com", programId: "prog-4", programName: "Bachelor of Laws",
    docStatus: "DocsInReview", appliedAt: "2026-03-18T08:00:00Z",
    score: 79,
    documents: [
      { id: "doc-11", type: "Passport", name: "passport.pdf", status: "Verified", required: true },
      { id: "doc-12", type: "HighSchoolDiploma", name: "diploma.pdf", status: "Uploaded", required: true },
      { id: "doc-13", type: "MotivationLetter", name: "motivation.pdf", status: "Uploaded", required: false },
    ],
  },
  {
    id: "app-6", applicantName: "Marco Ferrari", email: "m.ferrari@mail.com", programId: "prog-1", programName: "BSc Computer Science",
    docStatus: "Waitlisted", appliedAt: "2026-03-08T13:00:00Z", waitlistPosition: 3,
    score: 74,
    documents: [
      { id: "doc-14", type: "Passport", name: "passport.pdf", status: "Verified", required: true },
      { id: "doc-15", type: "HighSchoolDiploma", name: "diploma.pdf", status: "Verified", required: true },
    ],
  },
];

// ─── Exam Eligibility ─────────────────────────────────────────────────────

export const mockEligibilityRules: EligibilityRule[] = [
  { id: "er-1", name: "Minimum Attendance", type: "attendance", description: "Student must have at least 75% attendance in the course to be eligible for final exam.", threshold: 75, isActive: true, appliesToPrograms: ["prog-1", "prog-2", "prog-3"] },
  { id: "er-2", name: "No Outstanding Debt", type: "finance", description: "Student must have no outstanding financial debt (unless an Academic Dept exception is granted).", isActive: true, appliesToPrograms: ["prog-1", "prog-2", "prog-3", "prog-4"] },
  { id: "er-3", name: "Prerequisites Completed", type: "prerequisite", description: "All prerequisite courses must be passed before the student can take the dependent course exam.", isActive: true, appliesToPrograms: ["prog-1", "prog-2"] },
  { id: "er-4", name: "No Active Disciplinary Sanctions", type: "sanction", description: "Student must not have any active disciplinary sanctions that restrict exam participation.", isActive: true, appliesToPrograms: ["prog-1", "prog-2", "prog-3", "prog-4"] },
  { id: "er-5", name: "MSc Higher Attendance", type: "attendance", description: "MSc students must maintain 80% attendance for seminar courses.", threshold: 80, isActive: true, appliesToPrograms: ["prog-2"] },
];

export const mockEligibilityRecords: EligibilityRecord[] = [
  {
    id: "elg-1", studentId: "s-101", studentName: "Amir Karimov", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-5", courseName: "Database Systems", examType: "Final", status: "Eligible",
    checks: { attendance: { passed: true, value: "92%", required: "75%" }, finance: { passed: true, value: "No debt" }, prerequisite: { passed: true, value: "CS201 passed" }, sanction: { passed: true, value: "None" } },
  },
  {
    id: "elg-2", studentId: "s-103", studentName: "Lucas Mendes", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-5", courseName: "Database Systems", examType: "Final", status: "Ineligible",
    checks: { attendance: { passed: false, value: "61%", required: "75%", note: "Below threshold" }, finance: { passed: true, value: "No debt" }, prerequisite: { passed: true, value: "CS201 passed" }, sanction: { passed: true, value: "None" } },
  },
  {
    id: "elg-3", studentId: "s-105", studentName: "Omar Hassan", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-5", courseName: "Database Systems", examType: "Final", status: "Ineligible",
    checks: { attendance: { passed: false, value: "55%", required: "75%", note: "Below threshold" }, finance: { passed: false, value: "Debt: $450", note: "Outstanding tuition fee" }, prerequisite: { passed: false, value: "CS201 not passed", note: "Failed with 38%" }, sanction: { passed: true, value: "None" } },
  },
  {
    id: "elg-4", studentId: "s-102", studentName: "Sofia Petrov", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-5", courseName: "Database Systems", examType: "Final", status: "Eligible",
    checks: { attendance: { passed: true, value: "78%", required: "75%" }, finance: { passed: true, value: "No debt" }, prerequisite: { passed: true, value: "CS201 passed" }, sanction: { passed: true, value: "None" } },
  },
  {
    id: "elg-5", studentId: "s-104", studentName: "Yuna Park", groupId: "grp-1", groupName: "CS-2023-A", courseId: "pc-5", courseName: "Database Systems", examType: "Final", status: "Eligible",
    checks: { attendance: { passed: true, value: "97%", required: "75%" }, finance: { passed: true, value: "No debt" }, prerequisite: { passed: true, value: "CS201 passed" }, sanction: { passed: true, value: "None" } },
  },
  {
    id: "elg-6", studentId: "s-202", studentName: "Adam Nowak", groupId: "grp-2", groupName: "CS-2023-B", courseId: "pc-7", courseName: "Machine Learning", examType: "Final", status: "Override",
    checks: { attendance: { passed: false, value: "68%", required: "75%", note: "Below threshold — exception granted" }, finance: { passed: true, value: "No debt" }, prerequisite: { passed: true, value: "CS201 passed" }, sanction: { passed: true, value: "None" } },
    overrideId: "exc-3",
  },
];

// ─── Exceptions ───────────────────────────────────────────────────────────

const auditEntries1: AuditTrailEntry[] = [
  { id: "at-1", exceptionId: "exc-1", action: "Exception Granted", performedBy: "Dr. Academic Head", performedAt: "2026-03-10T14:00:00Z", details: "Debt exception granted for Spring 2026 semester. Student confirmed payment plan." },
];
const auditEntries2: AuditTrailEntry[] = [
  { id: "at-2", exceptionId: "exc-2", action: "Exception Granted", performedBy: "Dr. Academic Head", performedAt: "2026-03-01T10:00:00Z", details: "Medical leave confirmed — attendance waived for 3 weeks." },
  { id: "at-3", exceptionId: "exc-2", action: "Scope Updated", performedBy: "Prof. B. Jones", performedAt: "2026-03-15T11:00:00Z", details: "Extended scope to include both lecture and exam eligibility." },
];
const auditEntries3: AuditTrailEntry[] = [
  { id: "at-4", exceptionId: "exc-3", action: "Exception Granted", performedBy: "Dr. Academic Head", performedAt: "2026-03-05T09:00:00Z", details: "Attendance exception — student was on official university sports delegation." },
];

export const mockExceptions: AcademicException[] = [
  {
    id: "exc-1", studentId: "s-105", studentName: "Omar Hassan", type: "Debt", reasonCode: "PAYMENT_PLAN", description: "Student has agreed to a payment plan with Finance. Temporary access granted until debt cleared.",
    scope: "FullAccess", grantedBy: "Dr. Academic Head", grantedAt: "2026-03-10T14:00:00Z", expiresAt: "2026-04-10T23:59:00Z", status: "Active", auditTrail: auditEntries1,
  },
  {
    id: "exc-2", studentId: "s-103", studentName: "Lucas Mendes", type: "Attendance", reasonCode: "MEDICAL_LEAVE", description: "Student provided valid medical certificate for hospitalization period. Attendance requirement waived.",
    scope: "FullAccess", grantedBy: "Dr. Academic Head", grantedAt: "2026-03-01T10:00:00Z", expiresAt: "2026-03-31T23:59:00Z", status: "Active", auditTrail: auditEntries2,
  },
  {
    id: "exc-3", studentId: "s-202", studentName: "Adam Nowak", type: "Attendance", reasonCode: "OFFICIAL_DELEGATION", description: "Attendance exception for period of official university sports delegation (FISU World University Games).",
    scope: "ExamOnly", grantedBy: "Dr. Academic Head", grantedAt: "2026-03-05T09:00:00Z", expiresAt: "2026-04-05T23:59:00Z", status: "Active", auditTrail: auditEntries3,
  },
  {
    id: "exc-4", studentId: "s-107", studentName: "Carlos Rivera", type: "Prerequisite", reasonCode: "TRANSFER_CREDIT", description: "Student transferred with equivalent course from previous institution. Prerequisite waiver granted for CS301.",
    scope: "ExamOnly", grantedBy: "Prof. B. Jones", grantedAt: "2026-02-15T10:00:00Z", expiresAt: "2026-06-30T23:59:00Z", status: "Active", auditTrail: [],
  },
  {
    id: "exc-5", studentId: "s-201", studentName: "Mia Thompson", type: "Debt", reasonCode: "SCHOLARSHIP_PROCESSING", description: "Scholarship payment delayed due to administrative processing. Temporary access granted.",
    scope: "LecturesOnly", grantedBy: "Dr. Academic Head", grantedAt: "2026-01-20T10:00:00Z", expiresAt: "2026-02-28T23:59:00Z", status: "Expired", auditTrail: [],
  },
  {
    id: "exc-6", studentId: "s-106", studentName: "Elena Ivanova", type: "Probation", reasonCode: "PROBATION_REVIEW", description: "Student placed on academic probation for Spring 2026 semester. Must achieve GPA ≥ 2.5 to remain enrolled.",
    scope: "FullAccess", grantedBy: "Academic Committee", grantedAt: "2026-02-01T10:00:00Z", expiresAt: "2026-06-30T23:59:00Z", status: "Active", auditTrail: [],
  },
];

// ─── Performance ──────────────────────────────────────────────────────────

const mockInterventions: Intervention[] = [
  { id: "int-1", studentId: "s-103", studentName: "Lucas Mendes", type: "Academic Counseling", description: "Schedule bi-weekly meeting with academic advisor to monitor progress.", assignedTo: "Dr. A. Smith", createdAt: "2026-03-05T10:00:00Z", status: "InProgress", deadline: "2026-04-30" },
  { id: "int-2", studentId: "s-105", studentName: "Omar Hassan", type: "Financial Aid", description: "Connect student with financial aid office to resolve outstanding debt.", assignedTo: "Finance Office", createdAt: "2026-03-08T10:00:00Z", status: "Open", deadline: "2026-04-15" },
  { id: "int-3", studentId: "s-202", studentName: "Adam Nowak", type: "Tutoring", description: "Assign peer tutor for Data Structures — student struggling with graph algorithms.", assignedTo: "Tutoring Center", createdAt: "2026-03-10T10:00:00Z", status: "InProgress", deadline: "2026-05-15" },
];

export const mockPerformanceRecords: PerformanceRecord[] = [
  { id: "perf-1", studentId: "s-101", studentName: "Amir Karimov", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 3.7, semesterGpa: 3.8, attendanceRate: 92, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 120, creditsTotal: 150 },
  { id: "perf-2", studentId: "s-102", studentName: "Sofia Petrov", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 3.2, semesterGpa: 3.0, attendanceRate: 78, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 108, creditsTotal: 150 },
  { id: "perf-3", studentId: "s-103", studentName: "Lucas Mendes", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 2.1, semesterGpa: 1.8, attendanceRate: 61, standing: "Warning", atRisk: true, riskFactors: ["LowAttendance", "LowGrades"], interventions: [mockInterventions[0]], creditsPassed: 72, creditsTotal: 150 },
  { id: "perf-4", studentId: "s-104", studentName: "Yuna Park", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 3.9, semesterGpa: 4.0, attendanceRate: 97, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 144, creditsTotal: 150 },
  { id: "perf-5", studentId: "s-105", studentName: "Omar Hassan", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 1.8, semesterGpa: 1.5, attendanceRate: 55, standing: "Probation", atRisk: true, riskFactors: ["LowAttendance", "LowGrades", "FinancialIssue"], interventions: [mockInterventions[1]], creditsPassed: 54, creditsTotal: 150 },
  { id: "perf-6", studentId: "s-106", studentName: "Elena Ivanova", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 3.5, semesterGpa: 3.6, attendanceRate: 88, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 126, creditsTotal: 150 },
  { id: "perf-7", studentId: "s-107", studentName: "Carlos Rivera", groupId: "grp-1", groupName: "CS-2023-A", programName: "BSc Computer Science", gpa: 2.8, semesterGpa: 2.6, attendanceRate: 72, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 96, creditsTotal: 150 },
  { id: "perf-8", studentId: "s-201", studentName: "Mia Thompson", groupId: "grp-2", groupName: "CS-2023-B", programName: "BSc Computer Science", gpa: 3.6, semesterGpa: 3.7, attendanceRate: 91, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 132, creditsTotal: 150 },
  { id: "perf-9", studentId: "s-202", studentName: "Adam Nowak", groupId: "grp-2", groupName: "CS-2023-B", programName: "BSc Computer Science", gpa: 2.3, semesterGpa: 2.0, attendanceRate: 68, standing: "Warning", atRisk: true, riskFactors: ["LowAttendance", "LowGrades"], interventions: [mockInterventions[2]], creditsPassed: 78, creditsTotal: 150 },
  { id: "perf-10", studentId: "s-401", studentName: "Priya Sharma", groupId: "grp-4", groupName: "DS-2024-A", programName: "MSc Data Science", gpa: 3.8, semesterGpa: 3.9, attendanceRate: 95, standing: "GoodStanding", atRisk: false, riskFactors: [], interventions: [], creditsPassed: 30, creditsTotal: 120 },
];

export const mockStandingChanges: StandingChange[] = [
  { id: "sc-1", studentId: "s-105", studentName: "Omar Hassan", previousStanding: "Warning", newStanding: "Probation", reason: "Failed 3 courses in Fall 2025 semester. GPA dropped below 2.0.", changedBy: "Academic Committee", changedAt: "2026-02-01T10:00:00Z", semester: "Spring 2026" },
  { id: "sc-2", studentId: "s-103", studentName: "Lucas Mendes", previousStanding: "GoodStanding", newStanding: "Warning", reason: "GPA dropped to 2.1. Attendance below 70%. Academic advisor notified.", changedBy: "Dr. A. Smith", changedAt: "2026-02-15T14:00:00Z", semester: "Spring 2026" },
  { id: "sc-3", studentId: "s-202", studentName: "Adam Nowak", previousStanding: "GoodStanding", newStanding: "Warning", reason: "Consistent low performance across 2 consecutive semesters.", changedBy: "Dr. C. Lee", changedAt: "2026-02-20T10:00:00Z", semester: "Spring 2026" },
  { id: "sc-4", studentId: "s-106", studentName: "Elena Ivanova", previousStanding: "Warning", newStanding: "GoodStanding", reason: "Improved GPA to 3.5 and attendance to 88% in Fall 2025. Removed from warning.", changedBy: "Academic Committee", changedAt: "2026-01-15T10:00:00Z", semester: "Spring 2026" },
];

// ─── Retakes ──────────────────────────────────────────────────────────────

export const mockRetakeRequests: RetakeRequest[] = [
  { id: "ret-1", studentId: "s-103", studentName: "Lucas Mendes", courseId: "pc-3", courseName: "Data Structures & Algorithms", examType: "Final", originalScore: 42, status: "Scheduled", scheduledDate: "2026-04-15T09:00:00Z", reason: "Failed final exam. First retake attempt.", approvedBy: "Dr. A. Smith", attempt: 1, maxAttempts: 2 },
  { id: "ret-2", studentId: "s-105", studentName: "Omar Hassan", courseId: "pc-5", courseName: "Database Systems", examType: "Final", originalScore: 38, status: "Pending", reason: "Failed final exam. Eligible for retake per program rules.", attempt: 1, maxAttempts: 2 },
  { id: "ret-3", studentId: "s-202", studentName: "Adam Nowak", courseId: "pc-7", courseName: "Machine Learning", examType: "Midterm", originalScore: 44, status: "Completed", retakeScore: 58, scheduledDate: "2026-03-01T10:00:00Z", reason: "Failed midterm due to illness.", approvedBy: "Dr. F. Kim", attempt: 1, maxAttempts: 2 },
  { id: "ret-4", studentId: "s-107", studentName: "Carlos Rivera", courseId: "pc-4", courseName: "Object-Oriented Programming", examType: "Final", originalScore: 47, status: "Cancelled", reason: "Student did not attend scheduled retake without notification.", attempt: 1, maxAttempts: 2 },
  { id: "ret-5", studentId: "s-103", studentName: "Lucas Mendes", courseId: "pc-6", courseName: "Operating Systems", examType: "Final", originalScore: 40, status: "Pending", reason: "Failed final exam. Requesting second retake attempt.", attempt: 2, maxAttempts: 2 },
];

// ─── Coordination ─────────────────────────────────────────────────────────

export const mockCoordinationRequests: CoordinationRequest[] = [
  { id: "coord-1", fromDepartment: "Academic", toDepartment: "Finance", type: "Debt Exception Request", subject: "Temporary access for Omar Hassan", description: "Student has agreed to payment plan. Requesting Finance confirmation of debt override for Spring 2026.", status: "Approved", priority: "High", createdAt: "2026-03-09T10:00:00Z", resolvedAt: "2026-03-10T14:00:00Z", resolvedBy: "Finance Head" },
  { id: "coord-2", fromDepartment: "Academic", toDepartment: "AQAD", type: "Quality Escalation", subject: "Anomalous grade distribution — CS301", description: "Grade distribution for Database Systems (Spring 2026) shows 40% failure rate. Suspected exam difficulty calibration issue.", status: "Pending", priority: "High", createdAt: "2026-03-20T11:00:00Z" },
  { id: "coord-3", fromDepartment: "Academic", toDepartment: "Resource", type: "Teacher Replacement Request", subject: "Substitute needed for Dr. E. White", description: "Dr. E. White on medical leave. Need qualified substitute for Operating Systems CS-2023-A and CS-2023-B.", status: "Pending", priority: "High", createdAt: "2026-03-22T09:00:00Z", expiresAt: "2026-03-29T23:59:00Z" },
  { id: "coord-4", fromDepartment: "Academic", toDepartment: "Admin", type: "User Deactivation Request", subject: "Deactivate student account s-108", description: "Student Kaito Tanaka has officially withdrawn from the program. Please deactivate LMS access.", status: "Approved", priority: "Medium", createdAt: "2026-03-15T14:00:00Z", resolvedAt: "2026-03-16T10:00:00Z", resolvedBy: "IT Admin" },
  { id: "coord-5", fromDepartment: "Finance", toDepartment: "Academic", type: "Debt Alert", subject: "25 students with overdue payments", description: "25 students in Spring 2026 cohort have overdue tuition payments exceeding 30 days. Please review access restrictions.", status: "Pending", priority: "Medium", createdAt: "2026-03-18T08:00:00Z" },
];

export const mockFinanceOverrides: FinanceOverride[] = [
  { id: "fo-1", studentId: "s-105", studentName: "Omar Hassan", debtAmount: 450, reason: "Student has agreed to payment plan. Access granted pending full payment.", reasonCode: "PAYMENT_PLAN", scope: "FullAccess", grantedBy: "Dr. Academic Head", grantedAt: "2026-03-10T14:00:00Z", expiresAt: "2026-04-10T23:59:00Z", isActive: true, coordinationRequestId: "coord-1" },
  { id: "fo-2", studentId: "s-201", studentName: "Mia Thompson", debtAmount: 200, reason: "Scholarship payment delayed — administrative issue. Full access until resolved.", reasonCode: "SCHOLARSHIP_PROCESSING", scope: "LecturesOnly", grantedBy: "Prof. B. Jones", grantedAt: "2026-01-20T10:00:00Z", expiresAt: "2026-02-28T23:59:00Z", isActive: false },
];

// ─── Settings ─────────────────────────────────────────────────────────────

export const mockDepartmentSettings: DepartmentSettings = {
  currentSemester: "Spring 2026",
  semesterStart: "2026-02-01",
  semesterEnd: "2026-06-30",
  defaultMinAttendance: 75,
  debtBlockingEnabled: true,
  sanctionBlockingEnabled: true,
  syncFrequencyHours: 168,
  autoResolveConflicts: false,
  notifyOnAdmission: true,
  notifyOnEligibilityChange: true,
  notifyOnAtRisk: true,
  notifyOnExceptionExpiry: true,
  auditRetentionDays: 730,
  autoArchiveExpiredExceptions: true,
};
