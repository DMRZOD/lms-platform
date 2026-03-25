"use client";

import { useState } from "react";
import { CheckCircle, FileText, Paperclip, X } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/platform/page-header";
import { DEPARTMENTS, SPECIALIZATIONS } from "@/constants/resource-mock-data";

const LANGUAGES = ["English", "Russian", "Uzbek", "Other"];

type DocFile = { name: string } | null;

export default function RegisterTeacherPage() {
  const [submitted, setSubmitted] = useState(false);

  // Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  // Documents
  const [certificate, setCertificate] = useState<DocFile>(null);
  const [contract, setContract] = useState<DocFile>(null);
  const [cv, setCv] = useState<DocFile>(null);
  const [additional, setAdditional] = useState<DocFile>(null);

  // Settings
  const [language, setLanguage] = useState("English");
  const [maxWorkload, setMaxWorkload] = useState(20);
  const [notes, setNotes] = useState("");

  function toggleSpecialization(s: string) {
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function simulateUpload(
    setter: (f: DocFile) => void,
    label: string,
  ) {
    setter({ name: `${label.replace(/\s+/g, "_")}_document.pdf` });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Register Teacher" />
        <div className="mx-auto mt-16 max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-[#22c55e]" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Teacher Registered</h2>
          <p className="mb-6 text-sm text-secondary-foreground">
            <strong>{name}</strong> has been registered with status{" "}
            <span className="font-medium text-[#92400e]">Pending</span>. They will
            receive an email with a temporary password and verification instructions.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/resource/teachers"
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Back to Teachers
            </Link>
            <Link
              href="/resource/teachers/register"
              onClick={() => setSubmitted(false)}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Register Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Register Teacher"
        description="Create a new teacher profile. The teacher will be created with Pending status and must pass verification before being assigned to courses."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Full Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Elena Volkova"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Email <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. e.volkova@uou.edu"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 000 0000"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Department <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium">Specialization</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSpecialization(s)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    specializations.includes(s)
                      ? "bg-foreground text-background"
                      : "border border-border hover:bg-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {specializations.length > 0 && (
              <p className="mt-2 text-xs text-secondary-foreground">
                Selected: {specializations.join(", ")}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium">Bio / Qualifications</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Brief professional background and qualifications…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Documents for Verification</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(
              [
                { label: "Certificates / Diplomas", value: certificate, setter: setCertificate },
                { label: "Employment Contract", value: contract, setter: setContract },
                { label: "CV / Résumé", value: cv, setter: setCv },
                { label: "Additional Documents", value: additional, setter: setAdditional },
              ] as const
            ).map(({ label, value, setter }) => (
              <div
                key={label}
                className="rounded-md border border-dashed border-border p-4"
              >
                <p className="mb-2 text-sm font-medium">{label}</p>
                {value ? (
                  <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary-foreground" />
                      <span className="truncate text-xs">{value.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setter(null)}
                      className="ml-2 text-secondary-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => simulateUpload(setter, label)}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm text-secondary-foreground hover:bg-secondary"
                  >
                    <Paperclip className="h-4 w-4" />
                    Upload file
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-secondary-foreground">
            Accepted formats: PDF, JPG, PNG. Max 10MB per file.
          </p>
        </div>

        {/* Settings */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Settings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Preferred Teaching Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Max Workload (hrs/week)
              </label>
              <input
                type="number"
                min={4}
                max={40}
                value={maxWorkload}
                onChange={(e) => setMaxWorkload(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes…"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link
            href="/resource/teachers"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Register Teacher
          </button>
        </div>
      </form>
    </div>
  );
}
