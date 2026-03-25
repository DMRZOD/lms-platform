import type {
  AcademicStandard,
  AQADDashboardAlert,
  AQADMember,
  AQADStats,
  Audit,
  AuditTrailEntry,
  Complaint,
  CorrectiveAction,
  CorrectiveActionTemplate,
  CourseDetail,
  CourseForReview,
  ExamForAudit,
  FraudFlag,
  PublishedCourse,
  QualityChecklist,
  RejectionTemplate,
  ReportRecord,
} from "@/types/aqad";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockAQADStats: AQADStats = {
  coursesInReview: 12,
  pendingComplaints: 8,
  activeCorrectiveActions: 14,
  overdueActions: 3,
  upcomingAudits: 5,
  complianceRate: 87,
  avgReviewDays: 4.2,
  firstPassRate: 68,
};

// ─── Dashboard Alerts ─────────────────────────────────────────────────────────

export const mockAQADAlerts: AQADDashboardAlert[] = [
  {
    id: "alert-1",
    type: "danger",
    title: "3 Corrective Actions Overdue",
    message:
      "CS-401, MATH-202, and PHYS-301 have passed their corrective action deadlines without completion.",
    actionHref: "/aqad/corrective-actions",
    actionLabel: "View overdue",
  },
  {
    id: "alert-2",
    type: "warning",
    title: "SLA Warning — 2 Complaints Near Deadline",
    message:
      "Complaints #C-019 and #C-023 are due within 24 hours. Immediate investigation required.",
    actionHref: "/aqad/complaints",
    actionLabel: "Review complaints",
  },
  {
    id: "alert-3",
    type: "info",
    title: "5 Courses Scheduled for Audit This Week",
    message:
      "Upcoming periodic audits for CS-301, ENG-102, MATH-401, BIO-201, and CHEM-301.",
    actionHref: "/aqad/audits",
    actionLabel: "View schedule",
  },
];

// ─── AQAD Team Members ────────────────────────────────────────────────────────

export const mockAQADMembers: AQADMember[] = [
  {
    id: "aqad-1",
    name: "Dr. Sarah Chen",
    role: "Senior Quality Reviewer",
    specializations: ["Computer Science", "Engineering"],
    activeReviews: 3,
    activeComplaints: 2,
    activeCorrectiveActions: 4,
    avgReviewDays: 3.8,
  },
  {
    id: "aqad-2",
    name: "Prof. James Okonkwo",
    role: "Quality Reviewer",
    specializations: ["Business", "Economics", "Finance"],
    activeReviews: 4,
    activeComplaints: 1,
    activeCorrectiveActions: 3,
    avgReviewDays: 4.5,
  },
  {
    id: "aqad-3",
    name: "Dr. Maria Santos",
    role: "Quality Reviewer",
    specializations: ["Natural Sciences", "Mathematics"],
    activeReviews: 2,
    activeComplaints: 3,
    activeCorrectiveActions: 5,
    avgReviewDays: 3.2,
  },
  {
    id: "aqad-4",
    name: "Ms. Aisha Karimova",
    role: "Junior Quality Reviewer",
    specializations: ["Humanities", "Social Sciences"],
    activeReviews: 2,
    activeComplaints: 1,
    activeCorrectiveActions: 1,
    avgReviewDays: 5.1,
  },
  {
    id: "aqad-5",
    name: "Mr. David Park",
    role: "Complaints Investigator",
    specializations: ["All Programs"],
    activeReviews: 1,
    activeComplaints: 1,
    activeCorrectiveActions: 1,
    avgReviewDays: 4.0,
  },
];

// ─── Courses For Review ───────────────────────────────────────────────────────

export const mockCoursesForReview: CourseForReview[] = [
  {
    id: "course-001",
    title: "Introduction to Machine Learning",
    code: "CS-401",
    teacherName: "Dr. Alexei Petrov",
    teacherId: "teacher-1",
    programName: "Computer Science",
    submittedAt: "2026-03-18T09:00:00Z",
    priority: "High",
    assignedReviewerId: "aqad-1",
    assignedReviewerName: "Dr. Sarah Chen",
    daysInQueue: 6,
    reviewType: "Initial",
    status: "InReview",
  },
  {
    id: "course-002",
    title: "Advanced Financial Accounting",
    code: "FIN-302",
    teacherName: "Prof. Marina Ivanova",
    teacherId: "teacher-2",
    programName: "Finance",
    submittedAt: "2026-03-19T11:30:00Z",
    priority: "High",
    daysInQueue: 5,
    reviewType: "Resubmission",
    status: "InReview",
  },
  {
    id: "course-003",
    title: "Organic Chemistry II",
    code: "CHEM-302",
    teacherName: "Dr. Kim Jae-Won",
    teacherId: "teacher-3",
    programName: "Natural Sciences",
    submittedAt: "2026-03-20T08:15:00Z",
    priority: "Medium",
    assignedReviewerId: "aqad-3",
    assignedReviewerName: "Dr. Maria Santos",
    daysInQueue: 4,
    reviewType: "Initial",
    status: "InReview",
  },
  {
    id: "course-004",
    title: "Business Ethics and Law",
    code: "BUS-201",
    teacherName: "Prof. Elena Morozova",
    teacherId: "teacher-4",
    programName: "Business Administration",
    submittedAt: "2026-03-21T14:00:00Z",
    priority: "Medium",
    daysInQueue: 3,
    reviewType: "Initial",
    status: "InReview",
  },
  {
    id: "course-005",
    title: "Differential Equations",
    code: "MATH-301",
    teacherName: "Dr. Ahmed Hassan",
    teacherId: "teacher-5",
    programName: "Mathematics",
    submittedAt: "2026-03-22T10:00:00Z",
    priority: "Low",
    assignedReviewerId: "aqad-3",
    assignedReviewerName: "Dr. Maria Santos",
    daysInQueue: 2,
    reviewType: "ReApproval",
    status: "InReview",
  },
  {
    id: "course-006",
    title: "Digital Marketing Strategy",
    code: "MKT-401",
    teacherName: "Ms. Olga Smirnova",
    teacherId: "teacher-6",
    programName: "Marketing",
    submittedAt: "2026-03-22T15:30:00Z",
    priority: "Low",
    daysInQueue: 2,
    reviewType: "Initial",
    status: "InReview",
  },
  {
    id: "course-007",
    title: "Data Structures and Algorithms",
    code: "CS-201",
    teacherName: "Dr. Nikolai Volkov",
    teacherId: "teacher-7",
    programName: "Computer Science",
    submittedAt: "2026-03-23T09:30:00Z",
    priority: "High",
    daysInQueue: 1,
    reviewType: "Resubmission",
    status: "InReview",
  },
  {
    id: "course-008",
    title: "Macroeconomics",
    code: "ECON-201",
    teacherName: "Prof. Anna Kuznetsova",
    teacherId: "teacher-8",
    programName: "Economics",
    submittedAt: "2026-03-23T13:00:00Z",
    priority: "Medium",
    daysInQueue: 1,
    reviewType: "Initial",
    status: "InReview",
  },
  {
    id: "course-009",
    title: "Clinical Psychology Foundations",
    code: "PSY-301",
    teacherName: "Dr. Lena Popova",
    teacherId: "teacher-9",
    programName: "Psychology",
    submittedAt: "2026-03-24T08:00:00Z",
    priority: "Medium",
    daysInQueue: 0,
    reviewType: "Initial",
    status: "InReview",
  },
  {
    id: "course-010",
    title: "Constitutional Law",
    code: "LAW-401",
    teacherName: "Prof. Igor Sidorov",
    teacherId: "teacher-10",
    programName: "Law",
    submittedAt: "2026-03-24T10:15:00Z",
    priority: "High",
    assignedReviewerId: "aqad-2",
    assignedReviewerName: "Prof. James Okonkwo",
    daysInQueue: 0,
    reviewType: "Initial",
    status: "InReview",
  },
];

// ─── Course Detail (for review page) ─────────────────────────────────────────

export const mockCourseDetails: Record<string, CourseDetail> = {
  "course-001": {
    id: "course-001",
    title: "Introduction to Machine Learning",
    code: "CS-401",
    teacherName: "Dr. Alexei Petrov",
    teacherId: "teacher-1",
    programName: "Computer Science",
    credits: 6,
    language: "English",
    level: "Advanced",
    learningOutcomes: [
      "Understand fundamental machine learning concepts and algorithms",
      "Implement supervised and unsupervised learning models",
      "Apply ML techniques to real-world datasets",
      "Evaluate model performance using appropriate metrics",
    ],
    prerequisites: ["CS-201 Data Structures", "MATH-201 Statistics"],
    assessmentPolicy:
      "Midterm exam (30%), Final project (40%), Assignments (20%), Participation (10%)",
    modules: [
      {
        id: "mod-1",
        title: "Introduction to ML",
        lectures: [
          {
            id: "lec-1",
            title: "What is Machine Learning?",
            plan: "History, types of ML, applications",
            outcomes: ["Define ML", "Distinguish ML types"],
            materials: [
              { id: "mat-1", name: "Lecture Slides", type: "PPT" },
              { id: "mat-2", name: "Introduction Reading", type: "PDF" },
            ],
            hasActivities: true,
            hasQA: true,
          },
          {
            id: "lec-2",
            title: "Python for ML",
            plan: "NumPy, Pandas, Scikit-learn overview",
            outcomes: ["Set up ML environment", "Use basic libraries"],
            materials: [
              { id: "mat-3", name: "Setup Guide", type: "PDF" },
              { id: "mat-4", name: "Practice Notebook", type: "Other" },
            ],
            hasActivities: true,
            hasQA: true,
          },
        ],
      },
      {
        id: "mod-2",
        title: "Supervised Learning",
        lectures: [
          {
            id: "lec-3",
            title: "Linear Regression",
            plan: "Simple and multiple regression, cost function, gradient descent",
            outcomes: ["Implement linear regression", "Interpret model output"],
            materials: [{ id: "mat-5", name: "Lecture Slides", type: "PPT" }],
            hasActivities: true,
            hasQA: false,
          },
          {
            id: "lec-4",
            title: "Classification Algorithms",
            plan: "Logistic regression, decision trees, SVM",
            outcomes: ["Apply classification algorithms", "Choose appropriate classifier"],
            materials: [
              { id: "mat-6", name: "Lecture Slides", type: "PPT" },
              { id: "mat-7", name: "Lab Instructions", type: "PDF" },
            ],
            hasActivities: true,
            hasQA: true,
          },
        ],
      },
    ],
    reviewHistory: [
      {
        id: "rev-1",
        courseId: "course-001",
        reviewerId: "aqad-1",
        reviewerName: "Dr. Sarah Chen",
        decision: undefined,
        submittedAt: "2026-03-18T09:00:00Z",
        notes: "Review in progress",
        checklist: [],
        rejectionReasons: [],
        conditionalItems: [],
      },
    ],
    status: "InReview",
  },
};

// ─── Quality Checklists ───────────────────────────────────────────────────────

export const mockQualityChecklists: QualityChecklist[] = [
  {
    id: "cl-1",
    name: "Standard Course Checklist",
    version: "v3.2",
    items: [
      {
        id: "ci-1",
        title: "Compliance with Academic Standards",
        description: "Course meets university and accreditation academic standards",
        category: "Standards",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-2",
        title: "Complete Course Structure",
        description: "All modules and lectures are fully populated with content",
        category: "Structure",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-3",
        title: "Quality of Materials",
        description: "Materials are current, relevant, and diverse in format",
        category: "Materials",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-4",
        title: "Assessment Aligns with Learning Outcomes",
        description: "Exams and assignments directly assess stated learning outcomes",
        category: "Assessment",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-5",
        title: "Exam and Quiz Quality",
        description: "Questions cover all topics, appropriate difficulty, rubrics provided",
        category: "Assessment",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-6",
        title: "Language and Localization Policy",
        description: "Course language matches policy, all text properly proofread",
        category: "Language",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-7",
        title: "Communication Mechanisms",
        description: "Q&A, comments, and chat are properly configured and active",
        category: "Communication",
        required: false,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-8",
        title: "Prerequisite Requirements",
        description: "Prerequisites are correctly listed and appropriate for course level",
        category: "Structure",
        required: false,
        status: "pending",
        evidenceLinks: [],
      },
    ],
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "cl-2",
    name: "Lab Course Checklist",
    version: "v2.0",
    programType: "Natural Sciences",
    items: [
      {
        id: "ci-9",
        title: "Safety Instructions Present",
        description: "Lab safety guidelines are included for all practical sessions",
        category: "Standards",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
      {
        id: "ci-10",
        title: "Equipment Requirements Listed",
        description: "All required lab equipment is documented",
        category: "Structure",
        required: true,
        status: "pending",
        evidenceLinks: [],
      },
    ],
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
];

// ─── Complaints ───────────────────────────────────────────────────────────────

export const mockComplaints: Complaint[] = [
  {
    id: "C-019",
    studentId: "std-101",
    studentName: "Amir Tashkentov",
    courseId: "pub-001",
    courseTitle: "Web Development Fundamentals",
    lectureId: "lec-12",
    lectureTitle: "React Hooks Deep Dive",
    category: "ContentQuality",
    description:
      "The lecture materials for React Hooks are outdated and reference deprecated APIs. The code examples don't work with the current version of React.",
    priority: "High",
    status: "Submitted",
    submittedAt: "2026-03-20T10:30:00Z",
    slaDeadline: "2026-03-25T10:30:00Z",
    evidence: [
      { id: "ev-1", type: "screenshot", name: "Error screenshot", url: "/mock-evidence.png" },
    ],
  },
  {
    id: "C-023",
    studentId: "std-102",
    studentName: "Dilnoza Yusupova",
    courseId: "pub-002",
    courseTitle: "Financial Accounting Basics",
    lectureId: "lec-5",
    lectureTitle: "Balance Sheet Analysis",
    category: "TeacherBehavior",
    description:
      "Teacher did not respond to any Q&A questions for over 3 weeks. Multiple students are affected.",
    priority: "High",
    status: "InReview",
    submittedAt: "2026-03-17T14:00:00Z",
    investigatorId: "aqad-5",
    investigatorName: "Mr. David Park",
    slaDeadline: "2026-03-25T14:00:00Z",
    evidence: [],
    investigationNotes: "Contacted teacher department. Awaiting response.",
  },
  {
    id: "C-015",
    studentId: "std-103",
    studentName: "Ruslan Nazarov",
    courseId: "pub-003",
    courseTitle: "Introduction to Psychology",
    category: "Exam",
    description:
      "The midterm exam contained questions from topics not covered in the course syllabus.",
    priority: "Medium",
    status: "Resolved",
    submittedAt: "2026-03-10T09:00:00Z",
    investigatorId: "aqad-3",
    investigatorName: "Dr. Maria Santos",
    outcome: "Upheld",
    resolutionDescription:
      "Exam reviewed and confirmed 3 out-of-scope questions. Teacher issued corrective action. Students given option to retake affected section.",
    slaDeadline: "2026-03-17T09:00:00Z",
    evidence: [
      { id: "ev-2", type: "file", name: "Exam Paper.pdf" },
    ],
    investigationNotes: "Exam paper reviewed. Issue confirmed.",
  },
  {
    id: "C-018",
    studentId: "std-104",
    studentName: "Kamola Rahimova",
    courseId: "pub-004",
    courseTitle: "Calculus II",
    lectureId: "lec-8",
    lectureTitle: "Integration Techniques",
    category: "ContentQuality",
    description: "Video lecture has audio sync issues. The slides and narration are out of sync for the entire 90-minute lecture.",
    priority: "Medium",
    status: "InReview",
    submittedAt: "2026-03-18T11:00:00Z",
    investigatorId: "aqad-1",
    investigatorName: "Dr. Sarah Chen",
    slaDeadline: "2026-03-26T11:00:00Z",
    evidence: [],
    investigationNotes: "Lecture video confirmed to have sync issues.",
  },
  {
    id: "C-021",
    studentId: "std-105",
    studentName: "Bobur Umarov",
    courseId: "pub-005",
    courseTitle: "Business Law",
    category: "Technical",
    description: "Assignment submission portal has been broken for 5 days. Cannot submit work.",
    priority: "High",
    status: "Resolved",
    submittedAt: "2026-03-16T08:00:00Z",
    investigatorId: "aqad-5",
    investigatorName: "Mr. David Park",
    outcome: "Upheld",
    resolutionDescription:
      "Technical issue confirmed and reported to IT Operations. Deadline extended for all students. Issue resolved on 2026-03-20.",
    slaDeadline: "2026-03-23T08:00:00Z",
    evidence: [],
  },
];

// ─── Corrective Actions ───────────────────────────────────────────────────────

export const mockCorrectiveActions: CorrectiveAction[] = [
  {
    id: "CA-001",
    courseId: "pub-001",
    courseTitle: "Web Development Fundamentals",
    teacherId: "teacher-1",
    teacherName: "Dr. Alexei Petrov",
    issueDescription:
      "Lecture materials in Module 3 contain outdated code examples referencing deprecated APIs that cause errors in current environments.",
    requiredAction:
      "Update all code examples in Module 3 lectures to use current React 18 APIs. Verify all code examples run without errors before resubmission.",
    deadline: "2026-03-28T23:59:00Z",
    priority: "High",
    status: "InProgress",
    issuedAt: "2026-03-18T12:00:00Z",
    issuedById: "aqad-1",
    issuedByName: "Dr. Sarah Chen",
    teacherResponse: "Acknowledged. Currently updating Module 3. Will complete by deadline.",
    evidence: ["Student complaint C-019", "Manual review of lecture materials"],
  },
  {
    id: "CA-002",
    courseId: "pub-002",
    courseTitle: "Financial Accounting Basics",
    teacherId: "teacher-2",
    teacherName: "Prof. Marina Ivanova",
    issueDescription:
      "Teacher has not responded to student Q&A questions for over 3 weeks. 47 unanswered questions accumulated.",
    requiredAction:
      "Respond to all outstanding Q&A questions within 72 hours. Commit to a maximum 48-hour response time policy going forward.",
    deadline: "2026-03-22T23:59:00Z",
    priority: "High",
    status: "Overdue",
    issuedAt: "2026-03-15T12:00:00Z",
    issuedById: "aqad-5",
    issuedByName: "Mr. David Park",
    evidence: ["Student complaint C-023", "Q&A activity report"],
  },
  {
    id: "CA-003",
    courseId: "pub-003",
    courseTitle: "Introduction to Psychology",
    teacherId: "teacher-9",
    teacherName: "Dr. Lena Popova",
    issueDescription:
      "Midterm exam contained 3 questions on topics not covered in the course syllabus.",
    requiredAction:
      "Replace the 3 off-syllabus questions with questions relevant to covered material. Provide option for affected students to retake exam.",
    deadline: "2026-03-30T23:59:00Z",
    priority: "Critical",
    status: "Completed",
    issuedAt: "2026-03-12T12:00:00Z",
    issuedById: "aqad-3",
    issuedByName: "Dr. Maria Santos",
    teacherResponse: "Exam updated. Retake opportunity announced to all students.",
    completedAt: "2026-03-25T10:00:00Z",
    evidence: ["Student complaint C-015", "Exam paper review"],
  },
  {
    id: "CA-004",
    courseId: "pub-004",
    courseTitle: "Calculus II",
    teacherId: "teacher-5",
    teacherName: "Dr. Ahmed Hassan",
    issueDescription:
      "Lecture 8 video has audio-visual sync issues throughout the entire 90-minute session.",
    requiredAction:
      "Re-record or re-sync Lecture 8 video. Upload corrected version within the specified deadline.",
    deadline: "2026-03-29T23:59:00Z",
    priority: "Medium",
    status: "Issued",
    issuedAt: "2026-03-20T15:00:00Z",
    issuedById: "aqad-1",
    issuedByName: "Dr. Sarah Chen",
    evidence: ["Student complaint C-018"],
  },
  {
    id: "CA-005",
    courseId: "pub-006",
    courseTitle: "Advanced Database Systems",
    teacherId: "teacher-7",
    teacherName: "Dr. Nikolai Volkov",
    issueDescription:
      "Course prerequisites are set to 'none' but the content requires knowledge of basic SQL which is not covered.",
    requiredAction:
      "Update course prerequisites to include CS-102 Database Fundamentals or add introductory SQL content to Module 1.",
    deadline: "2026-04-01T23:59:00Z",
    priority: "Medium",
    status: "Verified",
    issuedAt: "2026-03-05T12:00:00Z",
    issuedById: "aqad-1",
    issuedByName: "Dr. Sarah Chen",
    teacherResponse: "Added CS-102 as prerequisite and added SQL review materials to Module 1.",
    completedAt: "2026-03-18T14:00:00Z",
    verifiedAt: "2026-03-20T10:00:00Z",
    verifiedById: "aqad-1",
    evidence: ["Audit review findings"],
  },
];

// ─── Audits ───────────────────────────────────────────────────────────────────

export const mockAudits: Audit[] = [
  {
    id: "audit-1",
    courseId: "pub-001",
    courseTitle: "Web Development Fundamentals",
    teacherName: "Dr. Alexei Petrov",
    programName: "Computer Science",
    scheduledAt: "2026-03-27T10:00:00Z",
    type: "Scheduled",
    auditorId: "aqad-1",
    auditorName: "Dr. Sarah Chen",
    checklist: [],
  },
  {
    id: "audit-2",
    courseId: "pub-002",
    courseTitle: "Financial Accounting Basics",
    teacherName: "Prof. Marina Ivanova",
    programName: "Finance",
    scheduledAt: "2026-03-28T09:00:00Z",
    type: "Unplanned",
    reason: "Multiple student complaints and SLA violations",
    auditorId: "aqad-2",
    auditorName: "Prof. James Okonkwo",
    checklist: [],
  },
  {
    id: "audit-3",
    courseId: "pub-007",
    courseTitle: "Organic Chemistry I",
    teacherName: "Dr. Kim Jae-Won",
    programName: "Natural Sciences",
    scheduledAt: "2026-03-25T14:00:00Z",
    type: "Scheduled",
    result: "Passed",
    auditorId: "aqad-3",
    auditorName: "Dr. Maria Santos",
    notes: "All checklist items passed. Strong course structure and materials.",
    completedAt: "2026-03-25T16:30:00Z",
    checklist: [],
  },
  {
    id: "audit-4",
    courseId: "pub-008",
    courseTitle: "Macroeconomics",
    teacherName: "Prof. Anna Kuznetsova",
    programName: "Economics",
    scheduledAt: "2026-03-20T11:00:00Z",
    type: "Scheduled",
    result: "IssuesFound",
    auditorId: "aqad-2",
    auditorName: "Prof. James Okonkwo",
    notes: "Outdated reading materials. Communication mechanisms inactive.",
    completedAt: "2026-03-20T13:00:00Z",
    checklist: [],
  },
  {
    id: "audit-5",
    courseId: "pub-009",
    courseTitle: "Introduction to Psychology",
    teacherName: "Dr. Lena Popova",
    programName: "Psychology",
    scheduledAt: "2026-03-28T14:00:00Z",
    type: "Scheduled",
    checklist: [],
  },
];

// ─── Published Courses (Monitoring) ──────────────────────────────────────────

export const mockPublishedCourses: PublishedCourse[] = [
  {
    id: "pub-001",
    title: "Web Development Fundamentals",
    code: "CS-301",
    teacherName: "Dr. Alexei Petrov",
    programName: "Computer Science",
    publishedAt: "2025-09-10T00:00:00Z",
    avgAttendance: 78,
    avgGrade: 72,
    complaintsCount: 2,
    lastAuditAt: "2025-12-10T00:00:00Z",
    nextAuditAt: "2026-03-27T00:00:00Z",
    status: "Published",
    qualityScore: 74,
    lectureMetrics: [
      { lectureId: "lec-1", lectureTitle: "HTML Basics", attendanceRate: 85, qaQuestions: 12, avgResponseTime: 4, chatActivity: 34, complaintsCount: 0 },
      { lectureId: "lec-2", lectureTitle: "CSS Styling", attendanceRate: 82, qaQuestions: 8, avgResponseTime: 6, chatActivity: 28, complaintsCount: 0 },
      { lectureId: "lec-12", lectureTitle: "React Hooks Deep Dive", attendanceRate: 65, qaQuestions: 31, avgResponseTime: 48, chatActivity: 18, complaintsCount: 2 },
    ],
  },
  {
    id: "pub-002",
    title: "Financial Accounting Basics",
    code: "FIN-201",
    teacherName: "Prof. Marina Ivanova",
    programName: "Finance",
    publishedAt: "2025-09-12T00:00:00Z",
    avgAttendance: 65,
    avgGrade: 68,
    complaintsCount: 3,
    lastAuditAt: "2025-12-15T00:00:00Z",
    nextAuditAt: "2026-03-28T00:00:00Z",
    status: "ReApprovalRequired",
    qualityScore: 52,
    lectureMetrics: [],
  },
  {
    id: "pub-003",
    title: "Introduction to Psychology",
    code: "PSY-101",
    teacherName: "Dr. Lena Popova",
    programName: "Psychology",
    publishedAt: "2025-09-08T00:00:00Z",
    avgAttendance: 88,
    avgGrade: 79,
    complaintsCount: 1,
    lastAuditAt: "2025-12-08T00:00:00Z",
    nextAuditAt: "2026-03-25T00:00:00Z",
    status: "Published",
    qualityScore: 86,
    lectureMetrics: [],
  },
  {
    id: "pub-004",
    title: "Calculus II",
    code: "MATH-202",
    teacherName: "Dr. Ahmed Hassan",
    programName: "Mathematics",
    publishedAt: "2025-09-11T00:00:00Z",
    avgAttendance: 72,
    avgGrade: 64,
    complaintsCount: 1,
    lastAuditAt: "2025-12-11T00:00:00Z",
    nextAuditAt: "2026-04-02T00:00:00Z",
    status: "Published",
    qualityScore: 71,
    lectureMetrics: [],
  },
  {
    id: "pub-005",
    title: "Business Law",
    code: "BUS-302",
    teacherName: "Prof. Igor Sidorov",
    programName: "Business Administration",
    publishedAt: "2025-09-14T00:00:00Z",
    avgAttendance: 91,
    avgGrade: 81,
    complaintsCount: 0,
    lastAuditAt: "2025-12-14T00:00:00Z",
    nextAuditAt: "2026-04-05T00:00:00Z",
    status: "Published",
    qualityScore: 93,
    lectureMetrics: [],
  },
  {
    id: "pub-006",
    title: "Advanced Database Systems",
    code: "CS-402",
    teacherName: "Dr. Nikolai Volkov",
    programName: "Computer Science",
    publishedAt: "2025-09-09T00:00:00Z",
    avgAttendance: 69,
    avgGrade: 71,
    complaintsCount: 0,
    lastAuditAt: "2025-12-09T00:00:00Z",
    nextAuditAt: "2026-04-08T00:00:00Z",
    status: "Published",
    qualityScore: 80,
    lectureMetrics: [],
  },
];

// ─── Anomaly Alerts ───────────────────────────────────────────────────────────

export const mockAnomalyAlerts = [
  {
    id: "anomaly-1",
    courseId: "pub-002",
    courseTitle: "Financial Accounting Basics",
    type: "complaint_spike" as const,
    description: "3 complaints filed in the last 7 days — 5x the normal rate.",
    severity: "high" as const,
    detectedAt: "2026-03-22T00:00:00Z",
  },
  {
    id: "anomaly-2",
    courseId: "pub-001",
    courseTitle: "Web Development Fundamentals",
    type: "attendance_drop" as const,
    description: "Lecture 12 attendance dropped to 65% from an average of 82%.",
    severity: "medium" as const,
    detectedAt: "2026-03-21T00:00:00Z",
  },
  {
    id: "anomaly-3",
    courseId: "pub-002",
    courseTitle: "Financial Accounting Basics",
    type: "qa_inactive" as const,
    description: "No teacher response to Q&A for 22 days. 47 unanswered questions.",
    severity: "high" as const,
    detectedAt: "2026-03-20T00:00:00Z",
  },
];

// ─── Exams for Audit ──────────────────────────────────────────────────────────

export const mockExamsForAudit: ExamForAudit[] = [
  { id: "exam-1", courseId: "pub-001", courseTitle: "Web Development Fundamentals", examType: "Midterm", date: "2026-03-10T09:00:00Z", studentCount: 48, fraudFlagsCount: 3, status: "PendingReview" },
  { id: "exam-2", courseId: "pub-002", courseTitle: "Financial Accounting Basics", examType: "Final", date: "2026-03-15T10:00:00Z", studentCount: 62, fraudFlagsCount: 5, status: "PendingReview" },
  { id: "exam-3", courseId: "pub-003", courseTitle: "Introduction to Psychology", examType: "Midterm", date: "2026-03-08T11:00:00Z", studentCount: 55, fraudFlagsCount: 1, status: "Reviewed" },
  { id: "exam-4", courseId: "pub-004", courseTitle: "Calculus II", examType: "Final", date: "2026-03-14T09:00:00Z", studentCount: 41, fraudFlagsCount: 2, status: "PendingReview" },
  { id: "exam-5", courseId: "pub-005", courseTitle: "Business Law", examType: "Midterm", date: "2026-03-09T14:00:00Z", studentCount: 38, fraudFlagsCount: 0, status: "Reviewed" },
  { id: "exam-6", courseId: "pub-006", courseTitle: "Advanced Database Systems", examType: "Final", date: "2026-03-16T10:00:00Z", studentCount: 29, fraudFlagsCount: 4, status: "PendingReview" },
];

// ─── Fraud Flags ──────────────────────────────────────────────────────────────

export const mockFraudFlags: FraudFlag[] = [
  { id: "ff-1", examId: "exam-1", studentId: "std-201", studentName: "Jasur Mirzayev", flagType: "Tab switching", description: "Student switched browser tabs 7 times during exam", evidence: "Telemetry log shows 7 tab-switch events at 14:22, 14:35, 14:41, 14:55, 15:02, 15:18, 15:30", timestamp: "2026-03-10T14:22:00Z", status: "Pending" },
  { id: "ff-2", examId: "exam-1", studentId: "std-202", studentName: "Nilufar Hasanova", flagType: "Copy-paste detected", description: "Large text blocks pasted in quick succession", evidence: "Clipboard monitoring: 3 paste events with 200+ characters each", timestamp: "2026-03-10T15:10:00Z", status: "Pending" },
  { id: "ff-3", examId: "exam-2", studentId: "std-203", studentName: "Sardor Qodirov", flagType: "IP address sharing", description: "Same IP address used by two students", evidence: "IP 192.168.1.45 associated with both student 203 and student 208", timestamp: "2026-03-15T10:30:00Z", status: "Confirmed", reviewerDecision: "Confirmed violation. Both students flagged for academic review." },
  { id: "ff-4", examId: "exam-2", studentId: "std-204", studentName: "Mohira Tursunova", flagType: "Face not visible", description: "Proctoring camera lost face for 8 minutes", evidence: "Video shows student leaving frame at 11:14, returning at 11:22", timestamp: "2026-03-15T11:14:00Z", status: "Dismissed", reviewerDecision: "Dismissed — student had technical camera issue, confirmed by proctor notes." },
  { id: "ff-5", examId: "exam-4", studentId: "std-205", studentName: "Alisher Nazarov", flagType: "Tab switching", description: "Student switched tabs 4 times", evidence: "Telemetry log", timestamp: "2026-03-14T09:45:00Z", status: "Pending" },
  { id: "ff-6", examId: "exam-6", studentId: "std-206", studentName: "Zulfiya Rashidova", flagType: "Multiple faces detected", description: "Camera detected a second person behind the student", evidence: "Proctoring video timestamp 10:22-10:45", timestamp: "2026-03-16T10:22:00Z", status: "Pending" },
];

// ─── Audit Trail ──────────────────────────────────────────────────────────────

export const mockAuditTrailEntries: AuditTrailEntry[] = [
  { id: "at-1", timestamp: "2026-03-24T10:15:00Z", actionType: "Review", actorId: "aqad-1", actorName: "Dr. Sarah Chen", courseId: "course-001", courseTitle: "Introduction to Machine Learning", details: "Review started. Assigned to Dr. Sarah Chen.", evidenceLinks: [] },
  { id: "at-2", timestamp: "2026-03-23T14:00:00Z", actionType: "Complaint", actorId: "aqad-5", actorName: "Mr. David Park", courseId: "pub-002", courseTitle: "Financial Accounting Basics", details: "Complaint C-023 moved to InReview. Investigator assigned.", evidenceLinks: [] },
  { id: "at-3", timestamp: "2026-03-22T11:00:00Z", actionType: "CorrectiveAction", actorId: "aqad-1", actorName: "Dr. Sarah Chen", courseId: "pub-001", courseTitle: "Web Development Fundamentals", details: "Corrective action CA-001 issued to Dr. Alexei Petrov.", evidenceLinks: ["Student complaint C-019"] },
  { id: "at-4", timestamp: "2026-03-21T09:30:00Z", actionType: "Audit", actorId: "aqad-3", actorName: "Dr. Maria Santos", courseId: "pub-007", courseTitle: "Organic Chemistry I", details: "Scheduled audit completed. Result: Passed.", evidenceLinks: [] },
  { id: "at-5", timestamp: "2026-03-20T16:00:00Z", actionType: "Review", actorId: "aqad-2", actorName: "Prof. James Okonkwo", courseId: "course-010", courseTitle: "Constitutional Law", details: "Course approved. Review completed.", evidenceLinks: [] },
  { id: "at-6", timestamp: "2026-03-20T13:30:00Z", actionType: "Complaint", actorId: "aqad-3", actorName: "Dr. Maria Santos", courseId: "pub-003", courseTitle: "Introduction to Psychology", details: "Complaint C-015 resolved. Outcome: Upheld.", evidenceLinks: ["Exam paper review"] },
  { id: "at-7", timestamp: "2026-03-19T10:00:00Z", actionType: "Exam", actorId: "aqad-1", actorName: "Dr. Sarah Chen", courseId: "pub-002", courseTitle: "Financial Accounting Basics", details: "Fraud flag FF-3 confirmed for student Sardor Qodirov.", evidenceLinks: ["IP log evidence"] },
  { id: "at-8", timestamp: "2026-03-18T15:00:00Z", actionType: "CorrectiveAction", actorId: "aqad-3", actorName: "Dr. Maria Santos", courseId: "pub-003", courseTitle: "Introduction to Psychology", details: "Corrective action CA-003 marked as Completed by teacher.", evidenceLinks: [] },
  { id: "at-9", timestamp: "2026-03-18T12:00:00Z", actionType: "Review", actorId: "aqad-1", actorName: "Dr. Sarah Chen", courseId: "course-001", courseTitle: "Introduction to Machine Learning", details: "Review submitted for course CS-401.", evidenceLinks: [] },
  { id: "at-10", timestamp: "2026-03-15T11:00:00Z", actionType: "Complaint", actorId: "aqad-5", actorName: "Mr. David Park", courseId: "pub-005", courseTitle: "Business Law", details: "Complaint C-021 resolved. Outcome: Upheld. Technical issue confirmed.", evidenceLinks: [] },
];

// ─── Report History ───────────────────────────────────────────────────────────

export const mockReportHistory: ReportRecord[] = [
  { id: "rep-1", type: "QualityOverview", title: "Quality Overview Report — Q1 2026", generatedAt: "2026-03-01T09:00:00Z", generatedByName: "Dr. Sarah Chen", period: "Jan 2026 – Mar 2026", format: "PDF" },
  { id: "rep-2", type: "ComplaintAnalysis", title: "Complaint Analysis — Spring 2026", generatedAt: "2026-02-15T14:00:00Z", generatedByName: "Prof. James Okonkwo", period: "Feb 2026", format: "Excel" },
  { id: "rep-3", type: "TeacherQuality", title: "Teacher Quality Report — Spring 2026", generatedAt: "2026-02-01T10:00:00Z", generatedByName: "Dr. Maria Santos", period: "Spring 2026", format: "PDF" },
  { id: "rep-4", type: "AuditResults", title: "Audit Results Report — Q4 2025", generatedAt: "2026-01-05T09:00:00Z", generatedByName: "Dr. Sarah Chen", period: "Oct 2025 – Dec 2025", format: "PDF" },
];

// ─── Standards Library ────────────────────────────────────────────────────────

export const mockAcademicStandards: AcademicStandard[] = [
  { id: "std-1", code: "ISO-21001", name: "ISO 21001 — Educational Organizations", description: "International standard for management systems for educational organizations.", type: "International", mappedChecklistItems: ["ci-1", "ci-4"] },
  { id: "std-2", code: "EQF-2008", name: "European Qualifications Framework", description: "Common reference framework for qualifications across EU member states.", type: "International", mappedChecklistItems: ["ci-1", "ci-2"] },
  { id: "std-3", code: "UNI-STD-001", name: "University Academic Standards v2.1", description: "Internal standards defining minimum quality requirements for all courses.", type: "Internal", mappedChecklistItems: ["ci-1", "ci-2", "ci-3", "ci-4", "ci-5", "ci-6", "ci-7", "ci-8"] },
  { id: "std-4", code: "ACCR-2025", name: "National Accreditation Requirements 2025", description: "Mandatory requirements for maintaining national accreditation status.", type: "Accreditation", mappedChecklistItems: ["ci-1", "ci-4", "ci-5"] },
];

// ─── Templates ────────────────────────────────────────────────────────────────

export const mockRejectionTemplates: RejectionTemplate[] = [
  { id: "rt-1", title: "Incomplete Course Structure", description: "Course has modules or lectures with missing content, materials, or activities.", requiredAction: "Complete all module content, add required materials to each lecture, and configure Q&A for at least 80% of lectures." },
  { id: "rt-2", title: "Outdated Materials", description: "Course materials are more than 2 years old and do not reflect current standards or practices.", requiredAction: "Update or replace outdated materials with current sources. Provide publication dates for all references." },
  { id: "rt-3", title: "Assessment-Outcome Misalignment", description: "Exam questions do not adequately cover the stated learning outcomes.", requiredAction: "Revise exam questions to ensure each learning outcome is assessed by at least one question. Provide a learning outcome mapping table." },
];

export const mockCorrectiveActionTemplates: CorrectiveActionTemplate[] = [
  { id: "cat-1", title: "Update Outdated Materials", issueDescription: "Course contains materials older than 2 years.", requiredAction: "Replace or update all materials older than 2 years. Document sources and publication dates.", defaultDays: 14, priority: "Medium" },
  { id: "cat-2", title: "Respond to Student Q&A", issueDescription: "Teacher has not responded to student questions within the 48-hour SLA.", requiredAction: "Respond to all outstanding Q&A questions within 72 hours and maintain 48-hour response policy.", defaultDays: 3, priority: "High" },
  { id: "cat-3", title: "Fix Video Quality Issues", issueDescription: "Lecture video has quality issues (sync, audio, resolution).", requiredAction: "Re-record or repair affected lecture video and upload corrected version.", defaultDays: 7, priority: "Medium" },
];

// ─── Analytics Data ───────────────────────────────────────────────────────────

export const mockComplianceData = [
  { period: "Fall 2024", rate: 79 },
  { period: "Spring 2025", rate: 82 },
  { period: "Fall 2025", rate: 84 },
  { period: "Spring 2026", rate: 87 },
];

export const mockReviewDecisions = [
  { name: "Approved", value: 58, color: "#22c55e" },
  { name: "Conditional", value: 24, color: "#f59e0b" },
  { name: "Rejected", value: 18, color: "#ef4444" },
];

export const mockAvgReviewTime = [
  { month: "Oct", value: 6.2 },
  { month: "Nov", value: 5.8 },
  { month: "Dec", value: 5.1 },
  { month: "Jan", value: 4.7 },
  { month: "Feb", value: 4.5 },
  { month: "Mar", value: 4.2 },
];

export const mockComplaintTrend = [
  { month: "Oct", value: 12 },
  { month: "Nov", value: 9 },
  { month: "Dec", value: 7 },
  { month: "Jan", value: 10 },
  { month: "Feb", value: 8 },
  { month: "Mar", value: 11 },
];

export const mockComplaintCategories = [
  { name: "Content Quality", value: 38, color: "#3b82f6" },
  { name: "Teacher Behavior", value: 25, color: "#f59e0b" },
  { name: "Technical", value: 20, color: "#8b5cf6" },
  { name: "Exam", value: 12, color: "#ef4444" },
  { name: "Other", value: 5, color: "#6b7280" },
];

export const mockGradeDistribution = [
  { range: "90-100", count: 42 },
  { range: "80-89", count: 87 },
  { range: "70-79", count: 124 },
  { range: "60-69", count: 98 },
  { range: "50-59", count: 56 },
  { range: "Below 50", count: 23 },
];
