"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { StatCard } from "@/components/teacher/stat-card";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiUserProfile } from "@/lib/teacher-api";
import { mockTeacherProfile } from "@/constants/teacher-mock-data";
import {
  BarChart3, BookOpen, CheckCircle,
  MessageSquare, Pencil, Save, Star, UserCheck,
} from "lucide-react";

export default function TeacherProfilePage() {
  const [profile, setProfile]       = useState<ApiUserProfile | null>(null);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const kpi = mockTeacherProfile.kpi;
  const notifSettings = mockTeacherProfile.notificationSettings;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teacherApi.getProfile();
      setProfile(data);
      setForm({
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone ?? "",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const updated = await teacherApi.updateProfile({
        firstName: form.firstName,
        lastName:  form.lastName,
        phone:     form.phone,
      });
      setProfile(updated);
      setEditing(false);
      setSaveMessage("Profile updated successfully!");
    } catch (err: unknown) {
      setSaveMessage(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "—";
  const initials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "??";

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  return (
      <div>
        <PageHeader title="My Profile" description="Personal information and settings" />

        {saveMessage && (
            <div className="mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm">
              {saveMessage}
            </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {/* Personal Info */}
            <SectionCard
                title="Personal Information"
                action={
                  !editing ? (
                      <button
                          onClick={() => setEditing(true)}
                          className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                  ) : undefined
                }
            >
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-2xl font-bold">
                  {initials}
                </div>
                <div className="flex-1">
                  {editing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-secondary-foreground">First Name</label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-secondary-foreground">Last Name</label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-secondary-foreground">Phone</label>
                          <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                              onClick={handleSave}
                              disabled={saving}
                              className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                              onClick={() => setEditing(false)}
                              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                  ) : (
                      <div className="space-y-2">
                        <div>
                          <p className="text-lg font-semibold">{fullName}</p>
                          <p className="text-sm text-secondary-foreground">{mockTeacherProfile.title}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                          {[
                            ["Email",      profile?.email ?? "—"],
                            ["Phone",      profile?.phone ?? "—"],
                            ["Status",     profile?.status ?? "—"],
                            ["Access",     profile?.accessState ?? "—"],
                            ["Roles",      profile?.roles?.join(", ") ?? "—"],
                          ].map(([label, value]) => (
                              <div key={label}>
                                <span className="text-secondary-foreground">{label}: </span>
                                <span className="font-medium">{value}</span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Change Password (mock) */}
            <SectionCard title="Change Password">
              <p className="text-sm text-secondary-foreground">
                Password management is handled through the authentication system.
                Contact your administrator to reset your password.
              </p>
            </SectionCard>
          </div>

          {/* Right: KPIs + Notifications */}
          <div className="space-y-5">
            <SectionCard title="My KPIs">
              <div className="space-y-3">
                <StatCard label="Avg Attendance" value={`${kpi.avgAttendance}%`} icon={UserCheck} accent={kpi.avgAttendance < 75 ? "warning" : "default"} />
                <StatCard label="Student Rating" value={`${kpi.avgStudentRating}/5`} icon={Star} subtitle="Average from surveys" />
                <StatCard label="Q&A SLA" value={`${kpi.qaSlaPercent}%`} icon={MessageSquare} subtitle="Answered within 24h" accent={kpi.qaSlaPercent < 80 ? "warning" : "default"} />
                <StatCard label="AQAD First Pass" value={`${kpi.aqadFirstPassRate}%`} icon={BarChart3} subtitle="Courses approved 1st try" />
              </div>
            </SectionCard>

            <SectionCard title="Notification Settings">
              <div className="space-y-3">
                {(
                    [
                      ["emailOnNewQuestion",   "Email on new Q&A question"],
                      ["emailOnSubmission",    "Email on assignment submission"],
                      ["emailOnAqadFeedback",  "Email on AQAD feedback"],
                      ["emailLectureReminder", "Lecture reminder (24h before)"],
                      ["pushNotifications",    "Push notifications"],
                    ] as [keyof typeof notifSettings, string][]
                ).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <div className={`relative h-5 w-9 rounded-full ${notifSettings[key] ? "bg-foreground" : "bg-[#d1d5db]"}`}>
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifSettings[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
  );
}