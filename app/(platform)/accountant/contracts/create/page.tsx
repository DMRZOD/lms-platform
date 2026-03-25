"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ChevronLeft } from "lucide-react";

import { PageHeader } from "@/components/platform/page-header";

type Step = 1 | 2 | 3;

type FormData = {
  studentName: string;
  studentId: string;
  studentEmail: string;
  program: string;
  faculty: string;
  contractType: string;
  totalAmount: string;
  paymentPlan: "full" | "installments";
  installmentCount: string;
  startDate: string;
  endDate: string;
  notes: string;
};

const PROGRAMS = [
  "Computer Science",
  "Business Administration",
  "Law",
  "Medicine",
  "Architecture",
  "Data Science",
  "Finance",
  "Marketing",
  "Physics",
  "Linguistics",
  "Psychology",
  "Civil Engineering",
  "Chemistry",
];

const FACULTIES: Record<string, string> = {
  "Computer Science": "Engineering",
  "Business Administration": "Economics",
  Law: "Humanities",
  Medicine: "Health Sciences",
  Architecture: "Design",
  "Data Science": "Engineering",
  Finance: "Economics",
  Marketing: "Economics",
  Physics: "Natural Sciences",
  Linguistics: "Humanities",
  Psychology: "Social Sciences",
  "Civil Engineering": "Engineering",
  Chemistry: "Natural Sciences",
};

const steps = [
  { number: 1, label: "Student & Program" },
  { number: 2, label: "Contract Terms" },
  { number: 3, label: "Review & Create" },
];

export default function CreateContractPage() {
  const [step, setStep] = useState<Step>(1);
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState<FormData>({
    studentName: "",
    studentId: "",
    studentEmail: "",
    program: "",
    faculty: "",
    contractType: "Full",
    totalAmount: "",
    paymentPlan: "installments",
    installmentCount: "2",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  function update(field: keyof FormData, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "program") {
        next.faculty = FACULTIES[value] ?? "";
      }
      return next;
    });
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateStep1() {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.studentName.trim()) errs.studentName = "Required";
    if (!form.studentId.trim()) errs.studentId = "Required";
    if (!form.studentEmail.trim()) errs.studentEmail = "Required";
    if (!form.program) errs.program = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2() {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.totalAmount || isNaN(Number(form.totalAmount)))
      errs.totalAmount = "Valid amount required";
    if (!form.startDate) errs.startDate = "Required";
    if (!form.endDate) errs.endDate = "Required";
    if (
      form.paymentPlan === "installments" &&
      (!form.installmentCount || Number(form.installmentCount) < 1)
    )
      errs.installmentCount = "Must be at least 1";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function handleCreate() {
    setCreated(true);
  }

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
          <CheckCircle2 className="h-8 w-8 text-[#16a34a]" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Contract Created</h2>
        <p className="mt-2 text-sm text-secondary-foreground">
          Contract for <strong>{form.studentName}</strong> has been successfully
          created.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/accountant/contracts"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Back to Contracts
          </Link>
          <button
            onClick={() => {
              setCreated(false);
              setStep(1);
              setForm({
                studentName: "",
                studentId: "",
                studentEmail: "",
                program: "",
                faculty: "",
                contractType: "Full",
                totalAmount: "",
                paymentPlan: "installments",
                installmentCount: "2",
                startDate: "",
                endDate: "",
                notes: "",
              });
            }}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/accountant/contracts"
          className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Contracts
        </Link>
      </div>

      <PageHeader
        title="Create Contract"
        description="Register a new student financial contract"
      />

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step > s.number
                    ? "bg-foreground text-background"
                    : step === s.number
                      ? "bg-foreground text-background"
                      : "border border-border bg-background text-secondary-foreground"
                }`}
              >
                {step > s.number ? "✓" : s.number}
              </div>
              <span
                className={`text-sm font-medium ${step === s.number ? "text-foreground" : "text-secondary-foreground"}`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-4 h-px w-12 bg-border" />
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-background p-6">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Student Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Student Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(e) => update("studentName", e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                {errors.studentName && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.studentName}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Student ID <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={form.studentId}
                  onChange={(e) => update("studentId", e.target.value)}
                  placeholder="e.g. STD-2026-001"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                {errors.studentId && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.studentId}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Email <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="email"
                  value={form.studentEmail}
                  onChange={(e) => update("studentEmail", e.target.value)}
                  placeholder="student@uou.edu"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                {errors.studentEmail && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.studentEmail}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Program <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={form.program}
                  onChange={(e) => update("program", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                >
                  <option value="">Select program</option>
                  {PROGRAMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.program && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.program}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Faculty
                </label>
                <input
                  type="text"
                  value={form.faculty}
                  readOnly
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Contract Terms</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Contract Type
                </label>
                <select
                  value={form.contractType}
                  onChange={(e) => update("contractType", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                >
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                  <option value="Grant">Grant</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Total Amount (USD) <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="number"
                  value={form.totalAmount}
                  onChange={(e) => update("totalAmount", e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                {errors.totalAmount && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.totalAmount}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Payment Plan
                </label>
                <div className="flex gap-3 pt-1">
                  {["full", "installments"].map((plan) => (
                    <label key={plan} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="paymentPlan"
                        value={plan}
                        checked={form.paymentPlan === plan}
                        onChange={(e) =>
                          update("paymentPlan", e.target.value as "full" | "installments")
                        }
                        className="accent-foreground"
                      />
                      {plan === "full" ? "Full payment" : "Installments"}
                    </label>
                  ))}
                </div>
              </div>
              {form.paymentPlan === "installments" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Installment Count <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.installmentCount}
                    onChange={(e) => update("installmentCount", e.target.value)}
                    min="1"
                    max="12"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  />
                  {errors.installmentCount && (
                    <p className="mt-1 text-xs text-[#dc2626]">
                      {errors.installmentCount}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Start Date <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  End Date <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs text-[#dc2626]">
                    {errors.endDate}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="font-semibold">Review & Confirm</h3>
            <div className="rounded-md bg-secondary p-4">
              <p className="mb-3 text-sm font-medium text-secondary-foreground">
                Student Information
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-secondary-foreground">Name</span>
                <span className="font-medium">{form.studentName}</span>
                <span className="text-secondary-foreground">Student ID</span>
                <span className="font-medium">{form.studentId}</span>
                <span className="text-secondary-foreground">Email</span>
                <span className="font-medium">{form.studentEmail}</span>
                <span className="text-secondary-foreground">Program</span>
                <span className="font-medium">{form.program}</span>
                <span className="text-secondary-foreground">Faculty</span>
                <span className="font-medium">{form.faculty}</span>
              </div>
            </div>
            <div className="rounded-md bg-secondary p-4">
              <p className="mb-3 text-sm font-medium text-secondary-foreground">
                Contract Terms
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-secondary-foreground">Type</span>
                <span className="font-medium">{form.contractType}</span>
                <span className="text-secondary-foreground">Total Amount</span>
                <span className="font-medium">
                  ${Number(form.totalAmount || 0).toLocaleString()}
                </span>
                <span className="text-secondary-foreground">Payment Plan</span>
                <span className="font-medium capitalize">
                  {form.paymentPlan === "installments"
                    ? `${form.installmentCount} installments`
                    : "Full payment"}
                </span>
                <span className="text-secondary-foreground">Period</span>
                <span className="font-medium">
                  {form.startDate} → {form.endDate}
                </span>
                {form.notes && (
                  <>
                    <span className="text-secondary-foreground">Notes</span>
                    <span className="font-medium">{form.notes}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Create Contract
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
