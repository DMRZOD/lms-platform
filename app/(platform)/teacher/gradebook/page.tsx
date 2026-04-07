"use client";

import { PageHeader } from "@/components/platform/page-header";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiCourse, ApiGradeItem, ApiGradeTotal, ApiGradebook } from "@/lib/teacher-api";
import { AlertCircle, CheckSquare, ChevronDown, Download, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function GradebookPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [gradebook, setGradebook] = useState<ApiGradebook | null>(null);
  const [gradeItems, setGradeItems] = useState<ApiGradeItem[]>([]);
  const [gradeTotals, setGradeTotals] = useState<ApiGradeTotal[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingGradebook, setLoadingGradebook] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Create grade item state
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", type: "ASSIGNMENT", weight: 10, maxScore: 100, description: "",
  });
  const [creatingItem, setCreatingItem] = useState(false);

  // Grading state: { studentId-itemId -> score }
  const [editingGrade, setEditingGrade] = useState<{ studentId: number; itemId: number } | null>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);

  // Load courses
  useEffect(() => {
    (async () => {
      try {
        const data = await teacherApi.getCourses({ size: 50 });
        const arr: ApiCourse[] = Array.isArray(data) ? data : (data.content ?? []);
        setCourses(arr);
        if (arr.length > 0) setSelectedCourseId(arr[0].id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadGradebook = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoadingGradebook(true);
    setActionMsg(null);
    try {
      const [gbRes, itemsRes, totalsRes] = await Promise.allSettled([
        teacherApi.getGradebook(selectedCourseId),
        teacherApi.getGradeItems(selectedCourseId),
        teacherApi.getGradeTotals(selectedCourseId),
      ]);
      if (gbRes.status === "fulfilled") setGradebook(gbRes.value);
      if (itemsRes.status === "fulfilled") {
        const arr = Array.isArray(itemsRes.value) ? itemsRes.value : [];
        setGradeItems(arr);
      }
      if (totalsRes.status === "fulfilled") {
        const arr = Array.isArray(totalsRes.value) ? totalsRes.value : [];
        setGradeTotals(arr);
      }
    } finally {
      setLoadingGradebook(false);
    }
  }, [selectedCourseId]);

  useEffect(() => { loadGradebook(); }, [loadGradebook]);

  // Create grade item
  const handleCreateItem = async () => {
    if (!selectedCourseId || !newItem.name.trim()) return;
    setCreatingItem(true);
    try {
      await teacherApi.createGradeItem(selectedCourseId, {
        name: newItem.name.trim(),
        type: newItem.type,
        weight: newItem.weight,
        maxScore: newItem.maxScore,
        description: newItem.description.trim(),
      });
      setShowCreateItem(false);
      setNewItem({ name: "", type: "ASSIGNMENT", weight: 10, maxScore: 100, description: "" });
      await loadGradebook();
      setActionMsg("Grade item created!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to create grade item");
    } finally {
      setCreatingItem(false);
    }
  };

  // Delete grade item
  const handleDeleteItem = async (itemId: number) => {
    if (!selectedCourseId || !confirm("Delete this grade item?")) return;
    try {
      await teacherApi.deleteGradeItem(selectedCourseId, itemId);
      await loadGradebook();
      setActionMsg("Grade item deleted!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  // Save grade
  const handleSaveGrade = async () => {
    if (!selectedCourseId || !editingGrade || !gradeValue.trim()) return;
    setSavingGrade(true);
    try {
      await teacherApi.createOrUpdateStudentGrade(selectedCourseId, {
        studentId: editingGrade.studentId,
        gradeItemId: editingGrade.itemId,
        score: Number(gradeValue),
      });
      setEditingGrade(null);
      setGradeValue("");
      await loadGradebook();
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to save grade");
    } finally {
      setSavingGrade(false);
    }
  };

  // Recalculate
  const handleRecalculate = async () => {
    if (!selectedCourseId) return;
    try {
      await teacherApi.recalculateGrades(selectedCourseId);
      await loadGradebook();
      setActionMsg("Grades recalculated!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to recalculate");
    }
  };

  // Export CSV
  const handleExport = async () => {
    if (!selectedCourseId) return;
    try {
      const csv = await teacherApi.exportGradebookCsv(selectedCourseId);
      const blob = new Blob([csv as string], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gradebook-${selectedCourseId}.csv`;
      a.click();
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to export");
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  const students = gradebook?.students ?? [];

  return (
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <PageHeader title="Gradebook" description="View and manage student grades" />
          <div className="flex gap-2">
            <button
                onClick={handleRecalculate}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4" /> Recalculate
            </button>
            <button
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
                onClick={() => setShowCreateItem(true)}
                className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add Grade Item
            </button>
          </div>
        </div>

        {/* Course Selector */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm font-medium">Course:</label>
          <div className="relative">
            <select
                value={selectedCourseId ?? ""}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-8 text-sm outline-none focus:border-foreground"
            >
              {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-secondary-foreground" />
          </div>
        </div>

        {actionMsg && (
            <div className="mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm">
              {actionMsg}
            </div>
        )}

        {/* Create Grade Item Form */}
        {showCreateItem && (
            <div className="mb-6 rounded-lg border border-border bg-background p-5">
              <h3 className="mb-4 font-semibold">New Grade Item</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Name *</label>
                  <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g. Midterm Exam"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Type</label>
                  <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  >
                    {["ASSIGNMENT", "MIDTERM", "FINAL", "QUIZ", "ATTENDANCE"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Weight (%)</label>
                  <input
                      type="number"
                      min={0}
                      max={100}
                      value={newItem.weight}
                      onChange={(e) => setNewItem({ ...newItem, weight: Number(e.target.value) })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Max Score</label>
                  <input
                      type="number"
                      min={1}
                      value={newItem.maxScore}
                      onChange={(e) => setNewItem({ ...newItem, maxScore: Number(e.target.value) })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                    onClick={handleCreateItem}
                    disabled={!newItem.name.trim() || creatingItem}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                >
                  {creatingItem ? "Creating..." : "Create"}
                </button>
                <button
                    onClick={() => setShowCreateItem(false)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
        )}

        {/* Grade Items Summary */}
        {gradeItems.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {gradeItems.map((item) => (
                  <div
                      key={item.id}
                      className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-secondary-foreground">{item.weight}% · max {item.maxScore}</span>
                    <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-secondary-foreground hover:text-[#ef4444]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
              ))}
            </div>
        )}

        {loadingGradebook ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : (
            <>
              {/* Gradebook Table */}
              {gradeItems.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                    <div className="text-center">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-secondary-foreground" />
                      <p className="text-sm text-secondary-foreground">
                        No grade items yet. Click "Add Grade Item" to create one.
                      </p>
                    </div>
                  </div>
              ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                      <tr className="bg-secondary">
                        <th className="sticky left-0 z-10 bg-secondary p-3 text-left font-medium">
                          Student
                        </th>
                        {gradeItems.map((col) => (
                            <th key={col.id} className="min-w-[110px] p-3 text-center font-medium">
                              <div>{col.name}</div>
                              <div className="text-xs font-normal text-secondary-foreground">
                                /{col.maxScore} · {col.weight}%
                              </div>
                            </th>
                        ))}
                        <th className="p-3 text-center font-medium">Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      {students.map((student) => {
                        const total = gradeTotals.find((t) => t.studentId === student.studentId);
                        return (
                            <tr key={student.studentId} className="border-t border-border hover:bg-secondary/30">
                              <td className="sticky left-0 z-10 bg-background p-3 font-medium">
                                {student.studentName}
                              </td>
                              {gradeItems.map((item) => {
                                const grade = student.grades.find((g) => g.gradeItemId === item.id);
                                const isEditing =
                                    editingGrade?.studentId === student.studentId &&
                                    editingGrade?.itemId === item.id;
                                return (
                                    <td
                                        key={item.id}
                                        className="cursor-pointer p-2 text-center hover:bg-secondary/50"
                                        onClick={() => {
                                          if (!isEditing) {
                                            setEditingGrade({ studentId: student.studentId, itemId: item.id });
                                            setGradeValue(grade?.score !== undefined ? String(grade.score) : "");
                                          }
                                        }}
                                    >
                                      {isEditing ? (
                                          <div className="flex items-center gap-1 justify-center">
                                            <input
                                                autoFocus
                                                type="number"
                                                min={0}
                                                max={item.maxScore}
                                                value={gradeValue}
                                                onChange={(e) => setGradeValue(e.target.value)}
                                                onBlur={handleSaveGrade}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") handleSaveGrade();
                                                  if (e.key === "Escape") {
                                                    setEditingGrade(null);
                                                    setGradeValue("");
                                                  }
                                                }}
                                                className="w-16 rounded border border-border bg-background px-1 py-0.5 text-center text-sm outline-none focus:border-foreground"
                                            />
                                          </div>
                                      ) : (
                                          <span className={grade?.score !== undefined ? "font-medium" : "text-secondary-foreground text-xs"}>
                                  {grade?.score !== undefined ? grade.score : "—"}
                                </span>
                                      )}
                                    </td>
                                );
                              })}
                              <td className="p-3 text-center font-semibold">
                                {total ? total.totalGrade.toFixed(1) : "—"}
                              </td>
                            </tr>
                        );
                      })}
                      {students.length === 0 && (
                          <tr>
                            <td
                                colSpan={gradeItems.length + 2}
                                className="p-6 text-center text-sm text-secondary-foreground"
                            >
                              No students enrolled in this course yet.
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
              )}

              {/* Grade Totals */}
              {gradeTotals.length > 0 && (
                  <div className="mt-6">
                    <h2 className="mb-3 font-semibold">Final Totals</h2>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary">
                        <tr>
                          <th className="p-3 text-left font-medium">Student</th>
                          <th className="p-3 text-center font-medium">Total Grade</th>
                          <th className="p-3 text-center font-medium">Calculated At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gradeTotals.map((t) => (
                            <tr key={t.id} className="border-t border-border">
                              <td className="p-3">Student #{t.studentId}</td>
                              <td className="p-3 text-center font-bold">{t.totalGrade.toFixed(1)}</td>
                              <td className="p-3 text-center text-xs text-secondary-foreground">
                                {new Date(t.calculatedAt).toLocaleString()}
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              )}
            </>
        )}
      </div>
  );
}
