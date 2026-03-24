"use client";

import { PageHeader } from "@/components/platform/page-header";
import { EmptyState } from "@/components/teacher/empty-state";
import { mockCourses, mockLectures, mockModules } from "@/constants/teacher-mock-data";
import type { CourseModule } from "@/types/teacher";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ModulesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = mockCourses.find((c) => c.id === courseId) ?? mockCourses[0];

  const [modules, setModules] = useState<CourseModule[]>(
    mockModules.filter((m) => m.courseId === course.id),
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const mod: CourseModule = {
      id: `mod-new-${Date.now()}`,
      courseId: course.id,
      name: newName.trim(),
      description: newDescription.trim(),
      orderIndex: modules.length + 1,
      lectureIds: [],
    };
    setModules([...modules, mod]);
    setNewName("");
    setNewDescription("");
    setShowCreateForm(false);
  };

  const handleDelete = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...modules];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setModules(next.map((m, i) => ({ ...m, orderIndex: i + 1 })));
  };

  const handleMoveDown = (idx: number) => {
    if (idx === modules.length - 1) return;
    const next = [...modules];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setModules(next.map((m, i) => ({ ...m, orderIndex: i + 1 })));
  };

  const startEdit = (mod: CourseModule) => {
    setEditingId(mod.id);
    setEditName(mod.name);
    setEditDescription(mod.description);
  };

  const saveEdit = (id: string) => {
    setModules(
      modules.map((m) =>
        m.id === id ? { ...m, name: editName.trim(), description: editDescription.trim() } : m,
      ),
    );
    setEditingId(null);
  };

  return (
    <div>
      <Link
        href={`/teacher/courses/${course.id}`}
        className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to {course.name}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Course Structure" description={`${course.code} — manage modules and lectures`} />
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Module
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 rounded-lg border border-border bg-background p-5">
          <h3 className="mb-4 font-semibold">New Module</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Module name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
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
              onClick={() => setShowCreateForm(true)}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Add Module
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {modules.map((mod, idx) => {
            const modLectures = mockLectures.filter((l) => mod.lectureIds.includes(l.id));
            const isEditing = editingId === mod.id;

            return (
              <div key={mod.id} className="rounded-lg border border-border bg-background">
                <div className="flex items-start gap-3 p-4">
                  <GripVertical className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-foreground" />

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full resize-none rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(mod.id)}
                            className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background hover:opacity-90"
                          >
                            Save
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
                        </div>
                        <p className="font-semibold">{mod.name}</p>
                        {mod.description && (
                          <p className="mt-0.5 text-sm text-secondary-foreground">{mod.description}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="rounded p-1 text-secondary-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === modules.length - 1}
                      className="rounded p-1 text-secondary-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => startEdit(mod)}
                      className="rounded p-1 text-secondary-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mod.id)}
                      className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                    >
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
                      href={`/teacher/courses/${course.id}/lectures/create`}
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
                          href={`/teacher/courses/${course.id}/lectures/${lec.id}`}
                          className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-secondary"
                        >
                          <Video className="h-4 w-4 flex-shrink-0 text-secondary-foreground" />
                          <span className="flex-1">{lec.topic}</span>
                          <span className="text-xs text-secondary-foreground">{lec.date}</span>
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
