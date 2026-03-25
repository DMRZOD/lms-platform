"use client";

import { useState } from "react";
import { KeyRound, Plus, X } from "lucide-react";
import { SectionCard } from "@/components/resource/section-card";
import { StatusBadge } from "@/components/resource/status-badge";
import { EmptyState } from "@/components/resource/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAccessEntries,
  mockAccessHistory,
  mockTeachers,
  type AccessLevel,
} from "@/constants/resource-mock-data";

const COURSES = [
  { code: "CS101", name: "Introduction to Programming" },
  { code: "CS201", name: "Cybersecurity Basics" },
  { code: "CS301", name: "Algorithms & Data Structures" },
  { code: "CS402", name: "Machine Learning Fundamentals" },
  { code: "MATH101", name: "Calculus I" },
  { code: "MATH201", name: "Linear Algebra" },
  { code: "BUS201", name: "Business Statistics" },
  { code: "BUS301", name: "Marketing Principles" },
  { code: "BUS401", name: "Corporate Finance" },
];

export default function AccessPage() {
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Grant modal
  const [showGrant, setShowGrant] = useState(false);
  const [grantTeacher, setGrantTeacher] = useState("");
  const [grantCourse, setGrantCourse] = useState("");
  const [grantLevel, setGrantLevel] = useState<AccessLevel>("Full");
  const [grantType, setGrantType] = useState<"Permanent" | "Temporary">("Permanent");
  const [grantExpiry, setGrantExpiry] = useState("2026-06-30");

  // Revoke modal
  const [showRevoke, setShowRevoke] = useState(false);
  const [revokeEntry, setRevokeEntry] = useState<(typeof mockAccessEntries)[0] | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeImmediate, setRevokeImmediate] = useState(true);

  const filtered = mockAccessEntries.filter((a) => {
    if (teacherFilter !== "all" && a.teacherId !== teacherFilter) return false;
    if (levelFilter !== "all" && a.level !== levelFilter) return false;
    if (
      search &&
      !a.teacherName.toLowerCase().includes(search.toLowerCase()) &&
      !a.courseName.toLowerCase().includes(search.toLowerCase()) &&
      !a.courseCode.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setShowGrant(false);
  }

  function handleRevoke(e: React.FormEvent) {
    e.preventDefault();
    setShowRevoke(false);
    setRevokeEntry(null);
    setRevokeReason("");
  }

  const uniqueTeachers = Array.from(
    new Map(mockAccessEntries.map((a) => [a.teacherId, a.teacherName])),
  );

  return (
    <div>
      <PageHeader
        title="Access Management"
        description="Control which teachers have access to which courses and groups."
      />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="all">All Teachers</option>
            {uniqueTeachers.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="Full">Full</option>
            <option value="ReadOnly">Read Only</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teacher or course..."
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
        <button
          onClick={() => setShowGrant(true)}
          className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Grant Access
        </button>
      </div>

      {/* Access Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title="No access entries found"
          description="Try adjusting filters or grant access to a teacher."
        />
      ) : (
        <div className="mb-8 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                <th className="px-4 py-2.5 text-left font-medium">Course</th>
                <th className="px-4 py-2.5 text-left font-medium">Level</th>
                <th className="px-4 py-2.5 text-left font-medium">Type</th>
                <th className="px-4 py-2.5 text-left font-medium">Expiry</th>
                <th className="px-4 py-2.5 text-left font-medium">Granted By</th>
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{a.teacherName}</td>
                  <td className="px-4 py-3">
                    <p>{a.courseName}</p>
                    <p className="text-xs text-secondary-foreground">{a.courseCode}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.level} />
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{a.type}</td>
                  <td className="px-4 py-3 text-secondary-foreground">
                    {a.expiryDate ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{a.grantedBy}</td>
                  <td className="px-4 py-3 text-secondary-foreground">{a.grantedAt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setRevokeEntry(a);
                        setShowRevoke(true);
                      }}
                      className="text-xs font-medium text-[#dc2626] hover:underline"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Access History */}
      <SectionCard title="Access History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">Timestamp</th>
                <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                <th className="px-4 py-2.5 text-left font-medium">Course</th>
                <th className="px-4 py-2.5 text-left font-medium">Action</th>
                <th className="px-4 py-2.5 text-left font-medium">Level</th>
                <th className="px-4 py-2.5 text-left font-medium">Reason</th>
                <th className="px-4 py-2.5 text-left font-medium">Actor</th>
              </tr>
            </thead>
            <tbody>
              {mockAccessHistory.map((h) => (
                <tr key={h.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-xs text-secondary-foreground">
                    {new Date(h.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">{h.teacherName}</td>
                  <td className="px-4 py-3">
                    <p className="text-secondary-foreground">{h.courseName}</p>
                    <p className="text-xs text-secondary-foreground">{h.courseCode}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        h.action === "Granted"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                    >
                      {h.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={h.level} />
                  </td>
                  <td className="max-w-48 px-4 py-3 text-xs text-secondary-foreground">
                    {h.reason}
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{h.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Grant Access Modal */}
      {showGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Grant Access</h3>
              <button onClick={() => setShowGrant(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleGrant} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Teacher <span className="text-[#ef4444]">*</span>
                </label>
                <select
                  value={grantTeacher}
                  onChange={(e) => setGrantTeacher(e.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select teacher…</option>
                  {mockTeachers
                    .filter((t) => t.status === "Active" || t.status === "Verified")
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Course <span className="text-[#ef4444]">*</span>
                </label>
                <select
                  value={grantCourse}
                  onChange={(e) => setGrantCourse(e.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select course…</option>
                  {COURSES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium">Access Level</label>
                <div className="flex gap-3">
                  {(["Full", "ReadOnly"] as AccessLevel[]).map((lvl) => (
                    <label
                      key={lvl}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 ${
                        grantLevel === lvl
                          ? "border-foreground bg-secondary"
                          : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="level"
                        value={lvl}
                        checked={grantLevel === lvl}
                        onChange={() => setGrantLevel(lvl)}
                        className="sr-only"
                      />
                      <span className="text-sm">
                        {lvl === "Full" ? "Full (edit + grade)" : "Read Only (view)"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium">Period</label>
                <div className="flex gap-3">
                  {(["Permanent", "Temporary"] as const).map((t) => (
                    <label
                      key={t}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 ${
                        grantType === t
                          ? "border-foreground bg-secondary"
                          : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={grantType === t}
                        onChange={() => setGrantType(t)}
                        className="sr-only"
                      />
                      <span className="text-sm">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              {grantType === "Temporary" && (
                <div>
                  <label className="mb-1 block text-xs font-medium">Expiry Date</label>
                  <input
                    type="date"
                    value={grantExpiry}
                    onChange={(e) => setGrantExpiry(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGrant(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevoke && revokeEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Revoke Access</h3>
              <button
                onClick={() => {
                  setShowRevoke(false);
                  setRevokeEntry(null);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 rounded-md border border-[#fee2e2] bg-[#fff5f5] px-4 py-3">
              <p className="text-sm font-medium text-[#991b1b]">
                Revoking access is irreversible.
              </p>
              <p className="mt-0.5 text-xs text-[#991b1b]">
                {revokeEntry.teacherName} will immediately lose{" "}
                <strong>{revokeEntry.level}</strong> access to{" "}
                <strong>{revokeEntry.courseName}</strong>. All active sessions will be
                terminated.
              </p>
            </div>
            <form onSubmit={handleRevoke} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Reason <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  required
                  rows={2}
                  placeholder="Reason for revoking access…"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium">Revocation Timing</label>
                <div className="flex gap-3">
                  {[
                    { label: "Immediate", value: true },
                    { label: "Scheduled", value: false },
                  ].map(({ label, value }) => (
                    <label
                      key={label}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 ${
                        revokeImmediate === value
                          ? "border-foreground bg-secondary"
                          : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="timing"
                        checked={revokeImmediate === value}
                        onChange={() => setRevokeImmediate(value)}
                        className="sr-only"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRevoke(false);
                    setRevokeEntry(null);
                  }}
                  className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Revoke Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
