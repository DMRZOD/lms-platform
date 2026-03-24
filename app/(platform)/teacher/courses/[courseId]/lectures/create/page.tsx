"use client";

import { PageHeader } from "@/components/platform/page-header";
import { mockCourses, mockModules } from "@/constants/teacher-mock-data";
import { AlertCircle, ChevronLeft, FileText, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type Material = { id: string; title: string; type: string; description: string };
type Activity = { id: string; type: string; title: string; description: string };

export default function CreateLecturePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = mockCourses.find((c) => c.id === courseId) ?? mockCourses[0];
  const modules = mockModules.filter((m) => m.courseId === course.id);

  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    moduleId: modules[0]?.id ?? "",
    plan: "",
    outcomes: [""],
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    qaCloseAfterHours: 72,
    chatEnabled: true,
    additionalNotes: "",
  });
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const requiredMet =
    form.topic.trim() &&
    form.plan.trim() &&
    form.outcomes.some((o) => o.trim()) &&
    form.date &&
    form.startTime &&
    materials.length >= 1 &&
    activities.length >= 1;

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { id: `mat-${Date.now()}`, title: "", type: "pdf", description: "" },
    ]);
  };

  const addActivity = () => {
    setActivities([
      ...activities,
      { id: `act-${Date.now()}`, type: "quiz", title: "", description: "" },
    ]);
  };

  const missingFields: string[] = [];
  if (!form.topic.trim()) missingFields.push("Topic");
  if (!form.plan.trim()) missingFields.push("Lecture plan");
  if (!form.outcomes.some((o) => o.trim())) missingFields.push("At least one learning outcome");
  if (!form.date) missingFields.push("Date");
  if (!form.startTime) missingFields.push("Start time");
  if (materials.length < 1) missingFields.push("At least one material");
  if (activities.length < 1) missingFields.push("At least one activity");

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
          <svg className="h-8 w-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Lecture Created!</h2>
        <p className="mt-2 text-sm text-secondary-foreground">
          <span className="font-medium">&ldquo;{form.topic}&rdquo;</span> has been added to the course.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href={`/teacher/courses/${course.id}/modules`}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Back to Structure
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/teacher/courses/${courseId}/modules`}
        className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Modules
      </Link>

      <div className="mb-6">
        <PageHeader title="Create Lecture" description={`${course.code} — ${course.name}`} />
      </div>

      {/* Required fields info */}
      {missingFields.length > 0 && (
        <div className="mb-6 rounded-lg border border-[#fde68a] bg-[#fef9c3] p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#92400e]" />
            <div>
              <p className="text-sm font-medium text-[#92400e]">
                Required before saving: {missingFields.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-lg border border-border bg-background p-5">
          <h2 className="mb-4 font-semibold">Lecture Information</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Topic <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. Binary Search Trees"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            {modules.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium">Module</label>
                <select
                  value={form.moduleId}
                  onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Lecture Plan <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                rows={4}
                placeholder="1. Topic introduction&#10;2. Key concepts&#10;3. Examples&#10;4. Practice"
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Learning Outcomes <span className="text-[#ef4444]">*</span>
              </label>
              <div className="space-y-2">
                {form.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => {
                        const next = [...form.outcomes];
                        next[idx] = e.target.value;
                        setForm({ ...form, outcomes: next });
                      }}
                      placeholder={`Outcome ${idx + 1}`}
                      className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                    {form.outcomes.length > 1 && (
                      <button
                        onClick={() =>
                          setForm({ ...form, outcomes: form.outcomes.filter((_, i) => i !== idx) })
                        }
                        className="rounded-md p-2 text-secondary-foreground hover:text-[#ef4444]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setForm({ ...form, outcomes: [...form.outcomes, ""] })}
                className="mt-2 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" /> Add outcome
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Date <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Start <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">End</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] p-3 text-xs text-[#1d4ed8]">
              Scheduling is coordinated with Academic Department via aSc. Enter your preferred
              time slot and the Academic Dept will confirm. A Teams meeting will be created
              automatically once confirmed.
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">
              Materials{" "}
              <span className="text-[#ef4444]">*</span>
              <span className="ml-1 text-xs font-normal text-secondary-foreground">
                (minimum 1)
              </span>
            </h2>
            <button
              onClick={addMaterial}
              className="flex items-center gap-1 text-sm font-medium text-secondary-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" /> Add Material
            </button>
          </div>

          {materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center">
              <Upload className="mb-2 h-8 w-8 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">No materials added yet</p>
              <button
                onClick={addMaterial}
                className="mt-3 text-sm font-medium underline underline-offset-2"
              >
                Add your first material
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {materials.map((mat, idx) => (
                <div key={mat.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                  <FileText className="mt-2 h-4 w-4 flex-shrink-0 text-secondary-foreground" />
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={mat.title}
                        onChange={(e) => {
                          const next = [...materials];
                          next[idx] = { ...mat, title: e.target.value };
                          setMaterials(next);
                        }}
                        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground"
                      />
                      <select
                        value={mat.type}
                        onChange={(e) => {
                          const next = [...materials];
                          next[idx] = { ...mat, type: e.target.value };
                          setMaterials(next);
                        }}
                        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground"
                      >
                        <option value="pdf">PDF</option>
                        <option value="ppt">PowerPoint</option>
                        <option value="video">Video</option>
                        <option value="link">Link</option>
                        <option value="interactive">Interactive</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={mat.description}
                      onChange={(e) => {
                        const next = [...materials];
                        next[idx] = { ...mat, description: e.target.value };
                        setMaterials(next);
                      }}
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground"
                    />
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-2 text-xs text-secondary-foreground">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Click to upload file</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMaterials(materials.filter((_, i) => i !== idx))}
                    className="mt-1 text-secondary-foreground hover:text-[#ef4444]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activities */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">
              Activities{" "}
              <span className="text-[#ef4444]">*</span>
              <span className="ml-1 text-xs font-normal text-secondary-foreground">
                (minimum 1)
              </span>
            </h2>
            <button
              onClick={addActivity}
              className="flex items-center gap-1 text-sm font-medium text-secondary-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" /> Add Activity
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center">
              <p className="text-sm text-secondary-foreground">No activities added yet</p>
              <button
                onClick={addActivity}
                className="mt-3 text-sm font-medium underline underline-offset-2"
              >
                Add quiz, question, or assignment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act, idx) => (
                <div key={act.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={act.title}
                        onChange={(e) => {
                          const next = [...activities];
                          next[idx] = { ...act, title: e.target.value };
                          setActivities(next);
                        }}
                        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground"
                      />
                      <select
                        value={act.type}
                        onChange={(e) => {
                          const next = [...activities];
                          next[idx] = { ...act, type: e.target.value };
                          setActivities(next);
                        }}
                        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="question">Discussion Question</option>
                        <option value="poll">Poll</option>
                        <option value="assignment">Assignment</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Description"
                      value={act.description}
                      onChange={(e) => {
                        const next = [...activities];
                        next[idx] = { ...act, description: e.target.value };
                        setActivities(next);
                      }}
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground"
                    />
                  </div>
                  <button
                    onClick={() => setActivities(activities.filter((_, i) => i !== idx))}
                    className="text-secondary-foreground hover:text-[#ef4444]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="rounded-lg border border-border bg-background p-5">
          <h2 className="mb-4 font-semibold">Communication Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Chat</p>
                <p className="text-xs text-secondary-foreground">Allow students to chat during lecture</p>
              </div>
              <button
                onClick={() => setForm({ ...form, chatEnabled: !form.chatEnabled })}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  form.chatEnabled ? "bg-foreground" : "bg-secondary-foreground"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    form.chatEnabled ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Close Q&A after</p>
                <p className="text-xs text-secondary-foreground">Hours after lecture ends</p>
              </div>
              <select
                value={form.qaCloseAfterHours}
                onChange={(e) =>
                  setForm({ ...form, qaCloseAfterHours: parseInt(e.target.value) })
                }
                className="rounded-md border border-border bg-background px-2 py-1 text-sm outline-none focus:border-foreground"
              >
                {[24, 48, 72, 96, 168].map((h) => (
                  <option key={h} value={h}>
                    {h}h
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Link
            href={`/teacher/courses/${courseId}/modules`}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            onClick={() => setCreated(true)}
            disabled={!requiredMet}
            title={!requiredMet ? `Missing: ${missingFields.join(", ")}` : ""}
            className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
          >
            Create Lecture
          </button>
        </div>
      </div>
    </div>
  );
}
