"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { mockStudentProfile } from "@/constants/student-mock-data";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Mail, User } from "lucide-react";

export default function ProfilePage() {
  const profile = mockStudentProfile;

  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    push: true,
    grades: true,
    lectures: true,
    assignments: true,
    finance: true,
    system: false,
  });

  const toggle = (key: keyof typeof notifPrefs) =>
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <PageHeader title="Profile" description="Your personal information and settings" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <SectionCard title="Personal Information">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
                {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-lg font-bold">{profile.name}</p>
                <p className="text-sm text-secondary-foreground">{profile.email}</p>
                <p className="mt-0.5 text-sm text-secondary-foreground">ID: {profile.studentId}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Program", value: profile.program },
                { label: "Faculty", value: profile.faculty },
                { label: "Group", value: profile.group },
                { label: "Year", value: `Year ${profile.year}` },
                { label: "Semester", value: `Semester ${profile.semester}` },
                {
                  label: "Enrollment Date",
                  value: new Date(profile.enrollmentDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-secondary-foreground">{label}</p>
                  <p className="mt-0.5 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-secondary-foreground">
              To update personal information, contact the Academic Department at{" "}
              <span className="font-medium text-foreground">academic@uou.edu</span>
            </p>
          </SectionCard>

          {/* Notification preferences */}
          <SectionCard title="Notification Preferences">
            <p className="mb-4 text-sm text-secondary-foreground">
              Choose which notifications you want to receive.
            </p>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                  Channels
                </p>
                {[
                  { key: "email" as const, label: "Email notifications" },
                  { key: "push" as const, label: "Push notifications" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center justify-between py-2">
                    <span className="text-sm">{label}</span>
                    <button
                      onClick={() => toggle(key)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${notifPrefs[key] ? "bg-foreground" : "bg-secondary"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${notifPrefs[key] ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </label>
                ))}
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                  Categories
                </p>
                {[
                  { key: "grades" as const, label: "Grades & feedback" },
                  { key: "lectures" as const, label: "Lecture reminders" },
                  { key: "assignments" as const, label: "Assignment deadlines" },
                  { key: "finance" as const, label: "Payment reminders" },
                  { key: "system" as const, label: "System announcements" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center justify-between py-2">
                    <span className="text-sm">{label}</span>
                    <button
                      onClick={() => toggle(key)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${notifPrefs[key] ? "bg-foreground" : "bg-secondary"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${notifPrefs[key] ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <SectionCard title="Academic Summary">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Access Status</span>
                <StudentStatusBadge status={profile.accessStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">GPA</span>
                <span className="font-bold">{profile.gpa.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Credits Earned</span>
                <span>
                  {profile.earnedCredits}/{profile.totalCredits}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Year / Semester</span>
                <span>
                  Y{profile.year} / S{profile.semester}
                </span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quick Links">
            <div className="space-y-2 text-sm">
              <a href="mailto:academic@uou.edu" className="flex items-center gap-2 text-secondary-foreground hover:text-foreground">
                <Mail className="h-4 w-4" /> Academic Office
              </a>
              <a href="mailto:it@uou.edu" className="flex items-center gap-2 text-secondary-foreground hover:text-foreground">
                <User className="h-4 w-4" /> IT Support
              </a>
              <a href="mailto:finance@uou.edu" className="flex items-center gap-2 text-secondary-foreground hover:text-foreground">
                <GraduationCap className="h-4 w-4" /> Finance Office
              </a>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
