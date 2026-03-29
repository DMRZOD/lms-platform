"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { EmptyState } from "@/components/teacher/empty-state";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiModule, ApiCourse, ApiLecture } from "@/lib/teacher-api";
import {
  BookOpen, ChevronLeft, ChevronDown, ChevronUp,
  GripVertical, Pencil, Plus, Trash2, Video,
} from "lucide-react";
import Link from "next/link";

export default function ModulesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const numId = Number(courseId);

  const [course, setCourse]     = useState<ApiCourse | null>(null);
  const [modules, setModules]   = useState<ApiModule[]>([]);
  const [lectures, setLectures] = useState<ApiLecture[]>([]);
  const [loading, setLoading]   = useState(true);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle]     = useState("");
  const [newDesc, setNewDesc]       = useState("");
  const [creating, setCreating]     = useState(false);

  // Edit
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [editTitle, setEditTitle]   = useState("");
  const [editDesc, setEditDesc]     = useState("");
  const [saving, setSaving]         = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [courseRes, modulesRes, lecturesRes] = await Promise.allSettled([
        teacherApi.getCourse(numId),
        teacherApi.getCourseModules(numId),
        teacherApi.getCourseLectures(numId),
      ]);
      if (courseRes.status === "fulfilled")   setCourse(courseRes.value);
      if (modulesRes.status === "fulfilled")  {
        const d = modulesRes.value;
        setModules(Array.isArray(d) ? d : []);
      }
      if (lecturesRes.status === "fulfilled") {
        const d = lecturesRes.value;
        setLectures(Array.isArray(d) ? d : []);
      }
    } finally {
      setLoading(false);
    }
  }, [numId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Create ──
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const mod = await teacherApi.createModule(numId, {
        title: newTitle.trim(),
        description: newDesc.trim(),
      });
      setModules((prev) => [...prev, mod]);
      setNewTitle(""); setNewDesc(""); setShowCreate(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create module");
    } finally {
      setCreating(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (moduleId: number) => {
    if (!confirm("Delete this module?")) return;
    try {
      await teacherApi.deleteModule(numId, moduleId);
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete module");
    }
  };

  // ── Save Edit ──
  const handleSaveEdit = async (mod: ApiModule) => {
    setSaving(true);
    try {
      const updated = await teacherApi.updateModule(numId, mod.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        version: mod.version,
      });
      setModules((prev) => prev.map((m) => (m.id === mod.id ? updated : m)));
      setEditingId(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update module");
    } finally {
      setSaving(false);
    }
  };

  // ── Reorder ──
  const moveModule = async (idx: number, dir: "up" | "down") => {
    const next = [...modules];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setModules(next);
    try {
      await teacherApi.reorderModules(numId, next.map((m) => m.id));
    } catch {
      fetchData();
    }
  };

  const getModuleLectures = (moduleId: number) =>
      lectures.filter((l) => l.moduleId === moduleId);

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  return (
      <div>
        <Link
            href={`/teacher/courses/${courseId}`}
            className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to {course?.title ?? "Course"}
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <PageHeader
              title="Course Structure"
              description={`${course?.title ?? ""} — manage modules and lectures`}
          />
          <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Module
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
            <div className="mb-6 rounded-lg border border-border bg-background p-5">
              <h3 className="mb-4 font-semibold">New Module</h3>
              <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Module title *"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
                <textarea
                    placeholder="Description (optional)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
                <div className="flex gap-2">
                  <button
                      onClick={handleCreate}
                      disabled={!newTitle.trim() || creating}
                      className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                  <button
                      onClick={() => { setShowCreate(false); setNewTitle(""); setNewDesc(""); }}
                      className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}

        {modules.length === 0 ? (
            <EmptyState
                icon={BookOpen}
                title="No modules yet"
                description="Create modules to organize your lectures"
                action={
                  <button
                      onClick={() => setShowCreate(true)}
                      className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                  >
                    Add Module
                  </button>
                }
            />
        ) : (
            <div className="space-y-4">
              {modules.map((mod, idx) => {
                const modLectures = getModuleLectures(mod.id);
                const isEditing = editingId === mod.id;

                return (
                    <div key={mod.id} className="rounded-lg border border-border bg-background">
                      {/* Module Header */}
                      <div className="flex items-start gap-3 p-4">
                        <GripVertical className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-foreground" />

                        <div className="flex-1">
                          {isEditing ? (
                              <div className="space-y-2">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
                                />
                                <textarea
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
                                />
                                <div className="flex gap-2">
                                  <button
                                      onClick={() => handleSaveEdit(mod)}
                                      disabled={saving}
                                      className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background hover:opacity-90 disabled:opacity-40"
                                  >
                                    {saving ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                      onClick={() => setEditingId(null)}
                                      className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-secondary"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                          ) : (
                              <div>
                                <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-secondary-foreground">
                            Module {idx + 1}
                          </span>
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                      mod.status === "ACTIVE"
                                          ? "bg-[#dcfce7] text-[#166534]"
                                          : "bg-secondary text-secondary-foreground"
                                  }`}>
                            {mod.status}
                          </span>
                                </div>
                                <p className="font-semibold">{mod.title}</p>
                                {mod.description && (
                                    <p className="mt-0.5 text-sm text-secondary-foreground">{mod.description}</p>
                                )}
                              </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button onClick={() => moveModule(idx, "up")} disabled={idx === 0} className="rounded p-1 text-secondary-foreground hover:text-foreground disabled:opacity-30">
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button onClick={() => moveModule(idx, "down")} disabled={idx === modules.length - 1} className="rounded p-1 text-secondary-foreground hover:text-foreground disabled:opacity-30">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button onClick={() => { setEditingId(mod.id); setEditTitle(mod.title); setEditDesc(mod.description ?? ""); }} className="rounded p-1 text-secondary-foreground hover:text-foreground">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(mod.id)} className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Lectures List */}
                      <div className="border-t border-border px-4 pb-4 pt-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-medium text-secondary-foreground">
                            {modLectures.length} lecture{modLectures.length !== 1 ? "s" : ""}
                          </p>
                          <Link
                              href={`/teacher/courses/${courseId}/lectures/create?moduleId=${mod.id}`}
                              className="flex items-center gap-1 text-xs font-medium text-secondary-foreground hover:text-foreground"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Lecture
                          </Link>
                        </div>

                        {modLectures.length === 0 ? (
                            <p className="text-xs text-secondary-foreground">No lectures yet</p>
                        ) : (
                            <div className="space-y-1.5">
                              {modLectures.map((lec) => (
                                  <Link
                                      key={lec.id}
                                      href={`/teacher/courses/${courseId}/lectures/${lec.id}`}
                                      className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-secondary"
                                  >
                                    <Video className="h-4 w-4 flex-shrink-0 text-secondary-foreground" />
                                    <span className="flex-1 truncate">{lec.title}</span>
                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                        lec.status === "PUBLISHED"
                                            ? "bg-[#dcfce7] text-[#166534]"
                                            : "bg-secondary text-secondary-foreground"
                                    }`}>
                            {lec.status}
                          </span>
                                    {lec.scheduledStart && (
                                        <span className="shrink-0 text-xs text-secondary-foreground">
                              {new Date(lec.scheduledStart).toLocaleDateString()}
                            </span>
                                    )}
                                  </Link>
                              ))}
                            </div>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}