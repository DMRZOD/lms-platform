"use client";

import { PageHeader } from "@/components/platform/page-header";
import {
  mockCourses,
  mockGradebookColumns,
  mockGradebookRows,
} from "@/constants/teacher-mock-data";
import type { GradebookCell } from "@/types/teacher";
import { AlertCircle, CheckSquare, ChevronDown, Download } from "lucide-react";
import { useState } from "react";

export default function GradebookPage() {
  const publishedCourses = mockCourses.filter(
    (c) => c.status === "Published" || c.status === "Approved",
  );
  const [selectedCourseId, setSelectedCourseId] = useState(publishedCourses[0]?.id ?? "");
  const [rows, setRows] = useState(mockGradebookRows);
  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [feedbackCell, setFeedbackCell] = useState<{ rowId: string; colId: string } | null>(null);
  const [feedbackValue, setFeedbackValue] = useState("");

  const overdueCount = rows.flatMap((r) => Object.values(r.cells)).filter(
    (c) => c.isOverdue && c.score === null,
  ).length;

  const handleCellClick = (rowId: string, colId: string, current: number | null) => {
    setEditingCell({ rowId, colId });
    setEditValue(current !== null ? String(current) : "");
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    const score = editValue.trim() === "" ? null : Number(editValue);
    setRows(
      rows.map((r) =>
        r.studentId === editingCell.rowId
          ? {
              ...r,
              cells: {
                ...r.cells,
                [editingCell.colId]: {
                  ...r.cells[editingCell.colId],
                  score,
                  isOverdue: false,
                },
              },
            }
          : r,
      ),
    );
    setEditingCell(null);
  };

  const handlePublishAll = () => {
    setRows(
      rows.map((r) => ({
        ...r,
        cells: Object.fromEntries(
          Object.entries(r.cells).map(([k, v]) => [
            k,
            v.score !== null ? { ...v, published: true } : v,
          ]),
        ),
      })),
    );
  };

  const getCellClass = (cell: GradebookCell) => {
    if (cell.isOverdue && cell.score === null)
      return "bg-[#fef2f2] text-[#991b1b] cursor-pointer";
    if (!cell.published && cell.score !== null)
      return "bg-[#fef9c3] cursor-pointer";
    if (cell.score === null) return "bg-secondary text-secondary-foreground cursor-pointer";
    return "cursor-pointer hover:bg-secondary/50";
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Gradebook" description="View and manage student grades" />
        <div className="flex gap-2">
          <button
            onClick={handlePublishAll}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <CheckSquare className="h-4 w-4" /> Publish All
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Course Selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium">Course:</label>
        <div className="relative">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-8 text-sm outline-none focus:border-foreground"
          >
            {publishedCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-secondary-foreground" />
        </div>
      </div>

      {/* Alerts */}
      {overdueCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-sm text-[#991b1b]">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {overdueCount} submission{overdueCount > 1 ? "s" : ""} waiting for grading (highlighted in red)
        </div>
      )}

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-3 w-6 rounded bg-[#fef2f2]" /> Overdue
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-6 rounded bg-[#fef9c3]" /> Graded, not published
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-6 rounded bg-secondary" /> Not submitted
        </span>
      </div>

      {/* Gradebook Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="sticky left-0 z-10 bg-secondary p-3 text-left font-medium">
                Student
              </th>
              {mockGradebookColumns.map((col) => (
                <th key={col.id} className="min-w-[100px] p-3 text-center font-medium">
                  <div>{col.label}</div>
                  <div className="text-xs font-normal text-secondary-foreground">
                    /{col.maxScore} · {col.weight}%
                  </div>
                </th>
              ))}
              <th className="p-3 text-center font-medium">Total</th>
              <th className="p-3 text-center font-medium">Grade</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId} className="border-t border-border hover:bg-secondary/30">
                <td className="sticky left-0 z-10 bg-background p-3">
                  <p className="font-medium">{row.studentName}</p>
                  <p className="text-xs text-secondary-foreground">{row.group}</p>
                </td>
                {mockGradebookColumns.map((col) => {
                  const cell = row.cells[col.id];
                  const isEditing =
                    editingCell?.rowId === row.studentId && editingCell?.colId === col.id;
                  return (
                    <td
                      key={col.id}
                      className={`p-2 text-center ${getCellClass(cell)}`}
                      onClick={() =>
                        !isEditing && handleCellClick(row.studentId, col.id, cell.score)
                      }
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            max={col.maxScore}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleCellSave();
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                            className="w-16 rounded border border-border bg-background px-1 py-0.5 text-center text-sm outline-none focus:border-foreground"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className={cell.score === null ? "text-xs" : "font-medium"}>
                            {cell.score !== null ? cell.score : "—"}
                          </span>
                          {cell.isOverdue && cell.score === null && (
                            <span className="text-xs">overdue</span>
                          )}
                          {!cell.published && cell.score !== null && (
                            <span className="text-xs text-[#92400e]">draft</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="p-3 text-center font-semibold">{row.totalScore}</td>
                <td className="p-3 text-center font-bold">{row.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback Popover */}
      {feedbackCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-80 rounded-lg border border-border bg-background p-5 shadow-lg">
            <h3 className="mb-3 font-semibold">Add Feedback</h3>
            <textarea
              autoFocus
              value={feedbackValue}
              onChange={(e) => setFeedbackValue(e.target.value)}
              rows={3}
              placeholder="Write feedback for this student..."
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setFeedbackCell(null)}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRows(
                    rows.map((r) =>
                      r.studentId === feedbackCell.rowId
                        ? {
                            ...r,
                            cells: {
                              ...r.cells,
                              [feedbackCell.colId]: {
                                ...r.cells[feedbackCell.colId],
                                feedback: feedbackValue,
                              },
                            },
                          }
                        : r,
                    ),
                  );
                  setFeedbackCell(null);
                  setFeedbackValue("");
                }}
                className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
