import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Database,
  DollarSign,
  FileBarChart,
  FileText,
  KeyRound,
  LayoutDashboard,
  Link2,
  MessageSquare,
  PenSquare,
  Rocket,
  Scale,
  ScrollText,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  Video,
} from "lucide-react";

export type Role =
  | "applicant"
  | "student"
  | "teacher"
  | "academic"
  | "aqad"
  | "resource"
  | "accountant"
  | "deputy"
  | "admin"
  | "it-ops";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type RoleConfig = {
  role: Role;
  label: string;
  description: string;
  navItems: NavItem[];
};

export const roleConfigs: Record<string, RoleConfig> = {
  applicant: {
    role: "applicant",
    label: "Applicant",
    description: "Apply, take exams, track admission status",
    navItems: [
      {
        label: "Dashboard",
        href: "/applicant/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Documents", href: "/applicant/documents", icon: Upload },
      { label: "Schedule", href: "/applicant/schedule", icon: Calendar },
      { label: "Exams", href: "/applicant/exams", icon: ClipboardCheck },
      { label: "Appeal", href: "/applicant/appeal", icon: Scale },
      { label: "Notifications", href: "/applicant/notifications", icon: Bell },
    ],
  },
  student: {
    role: "student",
    label: "Student",
    description: "Learn, take assessments, track progress",
    navItems: [
      { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { label: "Courses", href: "/student/courses", icon: BookOpen },
      { label: "Lectures", href: "/student/lectures", icon: Video },
      { label: "Assignments", href: "/student/assignments", icon: FileText },
      { label: "Exams", href: "/student/exams", icon: ClipboardCheck },
      { label: "Grades", href: "/student/grades", icon: BarChart3 },
      { label: "Attendance", href: "/student/attendance", icon: UserCheck },
      { label: "Finance", href: "/student/finance", icon: DollarSign },
      { label: "Schedule", href: "/student/schedule", icon: Calendar },
      { label: "Profile", href: "/student/profile", icon: Settings },
    ],
  },
  teacher: {
    role: "teacher",
    label: "Teacher",
    description: "Manage courses, lectures, and grading",
    navItems: [
      { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
      { label: "Courses", href: "/teacher/courses", icon: BookOpen },
      { label: "Gradebook", href: "/teacher/gradebook", icon: ClipboardCheck },
      { label: "Assignments", href: "/teacher/assignments", icon: FileText },
      { label: "Exams", href: "/teacher/exams", icon: PenSquare },
      { label: "Q&A", href: "/teacher/qa", icon: MessageSquare },
      { label: "Attendance", href: "/teacher/attendance", icon: UserCheck },
      { label: "Communications", href: "/teacher/communications", icon: Bell },
      { label: "AQAD Feedback", href: "/teacher/aqad-feedback", icon: ShieldCheck },
      { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
      { label: "Schedule", href: "/teacher/schedule", icon: Calendar },
      { label: "Profile", href: "/teacher/profile", icon: Settings },
    ],
  },
  academic: {
    role: "academic",
    label: "Academic Department",
    description: "Manage programs, groups, schedules, and academic processes",
    navItems: [
      {
        label: "Dashboard",
        href: "/academic/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Programs", href: "/academic/programs", icon: BookOpen },
      { label: "Groups", href: "/academic/groups", icon: Users },
      { label: "Schedules", href: "/academic/schedules", icon: Calendar },
      { label: "Admissions", href: "/academic/admissions", icon: UserCheck },
      {
        label: "Exam Eligibility",
        href: "/academic/exam-eligibility",
        icon: ClipboardCheck,
      },
      { label: "Exceptions", href: "/academic/exceptions", icon: AlertCircle },
      { label: "Performance", href: "/academic/performance", icon: BarChart3 },
      { label: "Coordination", href: "/academic/coordination", icon: Link2 },
      { label: "Settings", href: "/academic/settings", icon: Settings },
    ],
  },
  aqad: {
    role: "aqad",
    label: "AQAD",
    description: "Quality assurance, audits, and standards",
    navItems: [
      { label: "Dashboard", href: "/aqad/dashboard", icon: LayoutDashboard },
      {
        label: "Course Review",
        href: "/aqad/course-review",
        icon: ShieldCheck,
      },
      { label: "Audits", href: "/aqad/audits", icon: FileBarChart },
      { label: "Complaints", href: "/aqad/complaints", icon: AlertCircle },
      { label: "Reports", href: "/aqad/reports", icon: ScrollText },
    ],
  },
  resource: {
    role: "resource",
    label: "Resource Department",
    description: "Manage teachers and resource allocation",
    navItems: [
      {
        label: "Dashboard",
        href: "/resource/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Teachers", href: "/resource/teachers", icon: Users },
      { label: "Assignments", href: "/resource/assignments", icon: Briefcase },
      { label: "Workload", href: "/resource/workload", icon: BarChart3 },
    ],
  },
  accountant: {
    role: "accountant",
    label: "Finance",
    description: "Payments, debts, and financial reports",
    navItems: [
      {
        label: "Dashboard",
        href: "/accountant/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Payments", href: "/accountant/payments", icon: CreditCard },
      { label: "Debts", href: "/accountant/debts", icon: DollarSign },
      { label: "Reports", href: "/accountant/reports", icon: FileBarChart },
      { label: "Audit", href: "/accountant/audit", icon: ScrollText },
    ],
  },
  deputy: {
    role: "deputy",
    label: "Deputy Director",
    description: "KPI, strategy, and performance monitoring",
    navItems: [
      { label: "Dashboard", href: "/deputy/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/deputy/analytics", icon: TrendingUp },
      { label: "KPI", href: "/deputy/kpi", icon: Target },
      { label: "Reports", href: "/deputy/reports", icon: FileBarChart },
      { label: "Quality", href: "/deputy/quality", icon: ShieldCheck },
    ],
  },
  admin: {
    role: "admin",
    label: "Admin",
    description: "System administration and configuration",
    navItems: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Roles", href: "/admin/roles", icon: Scale },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Integrations", href: "/admin/integrations", icon: Link2 },
      { label: "Logs", href: "/admin/logs", icon: ScrollText },
    ],
  },
  "it-ops": {
    role: "it-ops",
    label: "IT Operations",
    description: "Monitoring, releases, and system operations",
    navItems: [
      { label: "Dashboard", href: "/it-ops/dashboard", icon: LayoutDashboard },
      { label: "Monitoring", href: "/it-ops/monitoring", icon: Activity },
      { label: "Releases", href: "/it-ops/releases", icon: Rocket },
      { label: "Access", href: "/it-ops/access", icon: KeyRound },
      { label: "Backups", href: "/it-ops/backups", icon: Database },
    ],
  },
};

export const roles = Object.keys(roleConfigs) as Role[];
