"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Mail, User } from "lucide-react";
import { studentApi } from "@/lib/student-api";
import type { ApiUserProfile, ApiStudentProgram } from "@/lib/student-api";

export default function ProfilePage() {
  const [profile, setProfile]   = useState<ApiUserProfile | null>(null);
  const [program, setProgram]   = useState<ApiStudentProgram | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const [notifPrefs, setNotifPrefs] = useState({
    email: true, push: true, grades: true,
    lectures: true, assignments: true, finance: true, system: false,
  });

  const toggle = (key: keyof typeof notifPrefs) =>
      setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, programData] = await Promise.allSettled([
        studentApi.getProfile(),
        studentApi.getProgram(),
      ]);
      if (profileData.status === "fulfilled") setProfile(profileData.value);
      if (programData.status === "fulfilled") setProgram(programData.value);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fullName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : "—";

  const initials = profile
      ? `${profile.firstName[0]}${profile.lastName[0]}`
      : "??";

  const accessStatus = (profile?.accessState ?? "ACTIVE") as "Active" | "BlockedByDebt" | "BlockedByFraud" | "SuspendedByAdmin" | "TemporaryOverride";

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchData} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <PageHeader title="Profile" description="Your personal information and settings" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Personal info */}
            <SectionCard title="Personal Information">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-bold">{fullName}</p>
                  <p className="text-sm text-secondary-foreground">{profile?.email ?? "—"}</p>
                  <p className="mt-0.5 text-sm text-secondary-foreground">
                    Phone: {profile?.phone ?? "—"}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {program && [
                  { label: "Program", value: program.programName },
                  { label: "Faculty", value: program.faculty },
                  { label: "Degree", value: program.degree },
                  { label: "Group", value: program.group ?? "—" },
                  { label: "Year", value: program.year ? `Year ${program.year}` : "—" },
                  { label: "Semester", value: program.semester ? `Semester ${program.semester}` : "—" },
                  {
                    label: "Enrollment Date",
                    value: program.enrollmentDate
                        ? new Date(program.enrollmentDate).toLocaleDateString("en-US", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                        : "—",
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
                          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${notifPrefs[key] ? "translate-x-5" : "translate-x-0"}`} />
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
                          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${notifPrefs[key] ? "translate-x-5" : "translate-x-0"}`} />
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
                  <StudentStatusBadge status={accessStatus} />
                </div>
                {program?.gpa !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">GPA</span>
                      <span className="font-bold">{program.gpa.toFixed(2)}</span>
                    </div>
                )}
                {program && (
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">Credits Earned</span>
                      <span>{program.earnedCredits ?? "—"}/{program.totalCredits ?? "—"}</span>
                    </div>
                )}
                {program && (
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">Year / Semester</span>
                      <span>Y{program.year ?? "—"} / S{program.semester ?? "—"}</span>
                    </div>
                )}
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