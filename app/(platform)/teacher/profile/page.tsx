"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { StatCard } from "@/components/teacher/stat-card";
import { mockCourses, mockTeacherProfile } from "@/constants/teacher-mock-data";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Pencil,
  Save,
  Star,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

export default function TeacherProfilePage() {
  const profile = mockTeacherProfile;

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
  });

  const [notifSettings, setNotifSettings] = useState(profile.notificationSettings);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordSaved, setPasswordSaved] = useState(false);

  const assignedCourses = mockCourses;

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="My Profile" description="Personal information and settings" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Avatar + Info */}
        <div className="space-y-5 lg:col-span-2">
          {/* Personal Info */}
          <SectionCard
            title="Personal Information"
            action={
              !editingPersonal ? (
                <button
                  onClick={() => setEditingPersonal(true)}
                  className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              ) : undefined
            }
          >
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-2xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1">
                {editingPersonal ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={personalForm.name}
                          onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                          Email
                        </label>
                        <input
                          type="email"
                          value={personalForm.email}
                          onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                        Bio
                      </label>
                      <textarea
                        value={personalForm.bio}
                        onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                        rows={3}
                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPersonal(false)}
                        className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                      <button
                        onClick={() => setEditingPersonal(false)}
                        className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <p className="text-lg font-semibold">{profile.name}</p>
                      <p className="text-sm text-secondary-foreground">{profile.title}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                      {[
                        ["Email", profile.email],
                        ["Phone", profile.phone ?? "—"],
                        ["Department", profile.department],
                        ["Faculty", profile.faculty],
                        ["Employee ID", profile.employeeId],
                        ["Join Date", profile.joinDate],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <span className="text-secondary-foreground">{label}: </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    {profile.bio && (
                      <p className="mt-2 text-sm text-secondary-foreground">{profile.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Assigned Courses */}
          <SectionCard title="Assigned Courses">
            <div className="space-y-2">
              {assignedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 flex-shrink-0 text-secondary-foreground" />
                    <div>
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        {course.code} · Semester {course.semester}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.status === "Published"
                        ? "bg-[#dcfce7] text-[#166534]"
                        : course.status === "Draft"
                          ? "bg-[#f0f0f0] text-[#666]"
                          : course.status === "Rejected"
                            ? "bg-[#fee2e2] text-[#991b1b]"
                            : "bg-[#fef9c3] text-[#854d0e]"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Change Password */}
          <SectionCard title="Change Password">
            {passwordSaved ? (
              <div className="flex items-center gap-2 text-sm text-[#166534]">
                <CheckCircle className="h-4 w-4" />
                Password changed successfully
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.next}
                    onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                    className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <button
                  onClick={() => {
                    if (passwordForm.next === passwordForm.confirm && passwordForm.current) {
                      setPasswordSaved(true);
                    }
                  }}
                  disabled={!passwordForm.current || !passwordForm.next || passwordForm.next !== passwordForm.confirm}
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                >
                  Change Password
                </button>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: KPI + Notifications */}
        <div className="space-y-5">
          {/* KPI */}
          <SectionCard title="My KPIs">
            <div className="space-y-3">
              <StatCard
                label="Avg Attendance"
                value={`${profile.kpi.avgAttendance}%`}
                icon={UserCheck}
                accent={profile.kpi.avgAttendance < 75 ? "warning" : "default"}
              />
              <StatCard
                label="Student Rating"
                value={`${profile.kpi.avgStudentRating}/5`}
                icon={Star}
                subtitle="Average from surveys"
              />
              <StatCard
                label="Q&A SLA"
                value={`${profile.kpi.qaSlaPercent}%`}
                icon={MessageSquare}
                subtitle="Answered within 24h"
                accent={profile.kpi.qaSlaPercent < 80 ? "warning" : "default"}
              />
              <StatCard
                label="AQAD First Pass"
                value={`${profile.kpi.aqadFirstPassRate}%`}
                icon={BarChart3}
                subtitle="Courses approved 1st try"
              />
            </div>
          </SectionCard>

          {/* Notification Settings */}
          <SectionCard title="Notification Settings">
            <div className="space-y-3">
              {(
                [
                  ["emailOnNewQuestion", "Email on new Q&A question"],
                  ["emailOnSubmission", "Email on assignment submission"],
                  ["emailOnAqadFeedback", "Email on AQAD feedback"],
                  ["emailLectureReminder", "Lecture reminder (24h before)"],
                  ["pushNotifications", "Push notifications"],
                ] as [keyof typeof notifSettings, string][]
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <button
                    onClick={() => setNotifSettings({ ...notifSettings, [key]: !notifSettings[key] })}
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      notifSettings[key] ? "bg-foreground" : "bg-[#d1d5db]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        notifSettings[key] ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
