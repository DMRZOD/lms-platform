"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, MessageSquare, Plus, Settings, Trash2, X } from "lucide-react";
import { FilterBar } from "@/components/academic/filter-bar";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { academicApi } from "@/lib/academic-api";
import type { ApiExamSlot, ApiExamAppeal } from "@/lib/academic-api";
import {
  mockEligibilityRecords,
  mockEligibilityRules,
} from "@/constants/academic-mock-data";
import type { EligibilityRecord } from "@/types/academic";

const TABS = ["Rules", "Monitoring", "Exceptions", "Exam Slots", "Appeals"];

export default function ExamEligibilityPage() {
  const [activeTab, setActiveTab] = useState("Monitoring");
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [grantModal, setGrantModal] = useState<EligibilityRecord | null>(null);
  const [exceptionForm, setExceptionForm] = useState({
    reason: "", scope: "FullAccess", days: "30",
  });

  // ── Exam Slots state ──
  const [slots, setSlots]               = useState<ApiExamSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError]     = useState<string | null>(null);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editingSlot, setEditingSlot]   = useState<ApiExamSlot | null>(null);
  const [slotForm, setSlotForm]         = useState({ dateTime: "", totalCapacity: "30" });
  const [slotSaving, setSlotSaving]     = useState(false);

  // ── Appeals state ──
  const [appeals, setAppeals]             = useState<ApiExamAppeal[]>([]);
  const [appealsLoading, setAppealsLoading] = useState(false);
  const [appealsError, setAppealsError]   = useState<string | null>(null);
  const [reviewModal, setReviewModal]     = useState<ApiExamAppeal | null>(null);
  const [reviewForm, setReviewForm]       = useState({ status: "APPROVED", decisionReason: "" });
  const [reviewSaving, setReviewSaving]   = useState(false);

  // ── Fetch slots ──
  const fetchSlots = useCallback(async () => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const data = await academicApi.getExamSlots();
      setSlots(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setSlotsError(err instanceof Error ? err.message : "Failed to load exam slots");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // ── Fetch appeals ──
  const fetchAppeals = useCallback(async () => {
    setAppealsLoading(true);
    setAppealsError(null);
    try {
      const data = await academicApi.getAppealsQueue();
      setAppeals(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setAppealsError(err instanceof Error ? err.message : "Failed to load appeals");
    } finally {
      setAppealsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "Exam Slots") fetchSlots();
    if (activeTab === "Appeals")    fetchAppeals();
  }, [activeTab, fetchSlots, fetchAppeals]);

  // ── Create slot ──
  const handleCreateSlot = async () => {
    if (!slotForm.dateTime) return;
    setSlotSaving(true);
    try {
      const slot = await academicApi.createExamSlot({
        dateTime:      new Date(slotForm.dateTime).toISOString(),
        totalCapacity: Number(slotForm.totalCapacity),
      });
      setSlots((prev) => [...prev, slot]);
      setShowSlotForm(false);
      setSlotForm({ dateTime: "", totalCapacity: "30" });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create slot");
    } finally {
      setSlotSaving(false);
    }
  };

  // ── Update slot ──
  const handleUpdateSlot = async () => {
    if (!editingSlot || !slotForm.dateTime) return;
    setSlotSaving(true);
    try {
      const updated = await academicApi.updateExamSlot(editingSlot.id, {
        dateTime:      new Date(slotForm.dateTime).toISOString(),
        totalCapacity: Number(slotForm.totalCapacity),
      });
      setSlots((prev) => prev.map((s) => s.id === editingSlot.id ? updated : s));
      setEditingSlot(null);
      setSlotForm({ dateTime: "", totalCapacity: "30" });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update slot");
    } finally {
      setSlotSaving(false);
    }
  };

  // ── Delete slot ──
  const handleDeleteSlot = async (id: number) => {
    if (!confirm("Delete this exam slot?")) return;
    try {
      await academicApi.deleteExamSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete slot");
    }
  };

  // ── Review appeal ──
  const handleReviewAppeal = async () => {
    if (!reviewModal || !reviewForm.decisionReason.trim()) return;
    setReviewSaving(true);
    try {
      await academicApi.reviewAppeal(reviewModal.id, {
        status:         reviewForm.status,
        decisionReason: reviewForm.decisionReason,
      });
      // Remove from queue after review
      setAppeals((prev) => prev.filter((a) => a.id !== reviewModal.id));
      setReviewModal(null);
      setReviewForm({ status: "APPROVED", decisionReason: "" });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to review appeal");
    } finally {
      setReviewSaving(false);
    }
  };

  // ── Mock monitoring ──
  const filters = [
    { label: "All",        value: "all" },
    { label: "Eligible",   value: "Eligible" },
    { label: "Ineligible", value: "Ineligible" },
    { label: "Override",   value: "Override" },
  ];

  const filtered = mockEligibilityRecords.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch =
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const eligible   = mockEligibilityRecords.filter((r) => r.status === "Eligible").length;
  const ineligible = mockEligibilityRecords.filter((r) => r.status === "Ineligible").length;
  const overrides  = mockEligibilityRecords.filter((r) => r.status === "Override").length;

  const STATUS_APPEAL_COLORS: Record<string, string> = {
    SUBMITTED:  "bg-[#fef9c3] text-[#854d0e]",
    IN_REVIEW:  "bg-[#dbeafe] text-[#1d4ed8]",
    APPROVED:   "bg-[#dcfce7] text-[#166534]",
    REJECTED:   "bg-[#fee2e2] text-[#991b1b]",
  };

  return (
      <div>
        <PageHeader
            title="Exam Eligibility"
            description="Monitor and manage student exam access conditions"
        />

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Records" value={String(mockEligibilityRecords.length)} />
          <StatCard label="Eligible"      value={String(eligible)}   accent="success" />
          <StatCard label="Ineligible"    value={String(ineligible)} accent={ineligible > 0 ? "danger" : "default"} />
          <StatCard label="With Override" value={String(overrides)}  accent={overrides > 0 ? "warning" : "default"} />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-0 border-b border-border">
          {TABS.map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                          ? "border-b-2 border-foreground text-foreground"
                          : "text-secondary-foreground hover:text-foreground"
                  }`}
              >
                {tab}
                {tab === "Appeals" && appeals.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {appeals.length}
              </span>
                )}
              </button>
          ))}
        </div>

        {/* ── Rules (mock) ── */}
        {activeTab === "Rules" && (
            <div className="space-y-3">
              {mockEligibilityRules.map((rule) => (
                  <div key={rule.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-5">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full ${rule.isActive ? "bg-[#22c55e]" : "bg-[#d1d5db]"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rule.name}</p>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                              rule.type === "attendance"    ? "bg-[#dbeafe] text-[#2563eb]"
                                  : rule.type === "finance"     ? "bg-[#fee2e2] text-[#dc2626]"
                                      : rule.type === "prerequisite"? "bg-[#ede9fe] text-[#7c3aed]"
                                          : "bg-[#fef3c7] text-[#d97706]"
                          }`}>
                      {rule.type}
                    </span>
                        </div>
                        <p className="mt-1 text-sm text-secondary-foreground">{rule.description}</p>
                        {rule.threshold !== undefined && (
                            <p className="mt-1 text-xs text-secondary-foreground">
                              Threshold: <strong>{rule.threshold}%</strong>
                            </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                <span className={`text-sm ${rule.isActive ? "text-[#16a34a]" : "text-secondary-foreground"}`}>
                  {rule.isActive ? "Active" : "Inactive"}
                </span>
                      <button className="rounded-md border border-border p-1.5 hover:bg-secondary">
                        <Settings className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* ── Monitoring (mock) ── */}
        {activeTab === "Monitoring" && (
            <>
              <FilterBar
                  filters={filters}
                  activeFilter={filter}
                  onFilterChange={setFilter}
                  searchValue={search}
                  onSearchChange={setSearch}
                  placeholder="Search student or course..."
              />
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Student</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Course</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Attendance</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Finance</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Prerequisites</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Sanctions</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-secondary-foreground">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                  {filtered.map((r) => (
                      <tr key={r.id} className={r.status === "Ineligible" ? "bg-[#fff8f8]" : ""}>
                        <td className="px-4 py-3">
                          <p className="font-medium">{r.studentName}</p>
                          <p className="text-xs text-secondary-foreground">{r.groupName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{r.courseName}</p>
                          <p className="text-xs text-secondary-foreground">{r.examType}</p>
                        </td>
                        {(["attendance", "finance", "prerequisite", "sanction"] as const).map((key) => {
                          const chk = r.checks[key];
                          return (
                              <td key={key} className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  {chk.passed
                                      ? <Check className="h-4 w-4 text-[#16a34a]" />
                                      : <X className="h-4 w-4 text-[#dc2626]" />
                                  }
                                  <span className={`text-xs ${!chk.passed ? "text-[#dc2626]" : "text-secondary-foreground"}`}>
                              {chk.value ?? (chk.passed ? "OK" : "Fail")}
                            </span>
                                </div>
                                {chk.note && <p className="text-xs text-[#dc2626]">{chk.note}</p>}
                              </td>
                          );
                        })}
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3">
                          {r.status === "Ineligible" && (
                              <button
                                  onClick={() => setGrantModal(r)}
                                  className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-secondary"
                              >
                                Grant Override
                              </button>
                          )}
                          {r.status === "Override" && (
                              <span className="text-xs text-[#d97706]">Override active</span>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </>
        )}

        {/* ── Exceptions (mock) ── */}
        {activeTab === "Exceptions" && (
            <SectionCard title="Active Eligibility Overrides">
              <div className="space-y-3">
                {mockEligibilityRecords.filter((r) => r.status === "Override").map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
                      <div>
                        <p className="font-medium">{r.studentName}</p>
                        <p className="text-sm text-secondary-foreground">{r.courseName} · {r.examType}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status="Override" />
                        <button className="text-xs text-[#dc2626] hover:underline">Revoke</button>
                      </div>
                    </div>
                ))}
                {mockEligibilityRecords.filter((r) => r.status === "Override").length === 0 && (
                    <p className="text-sm text-secondary-foreground">No active overrides.</p>
                )}
              </div>
            </SectionCard>
        )}

        {/* ── Exam Slots (REAL API) ── */}
        {activeTab === "Exam Slots" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-foreground">
                  {slotsLoading ? "Loading..." : `${slots.length} exam slot${slots.length !== 1 ? "s" : ""}`}
                </p>
                <button
                    onClick={() => {
                      setShowSlotForm(true);
                      setEditingSlot(null);
                      setSlotForm({ dateTime: "", totalCapacity: "30" });
                    }}
                    className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Add Slot
                </button>
              </div>

              {slotsError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {slotsError}
                  </p>
              )}

              {(showSlotForm || editingSlot) && (
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="mb-3 font-semibold">
                      {editingSlot ? "Edit Exam Slot" : "New Exam Slot"}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium">Date & Time *</label>
                        <input
                            type="datetime-local"
                            value={slotForm.dateTime}
                            onChange={(e) => setSlotForm({ ...slotForm, dateTime: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium">Total Capacity *</label>
                        <input
                            type="number"
                            min={1}
                            max={500}
                            value={slotForm.totalCapacity}
                            onChange={(e) => setSlotForm({ ...slotForm, totalCapacity: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                          disabled={!slotForm.dateTime || slotSaving}
                          onClick={editingSlot ? handleUpdateSlot : handleCreateSlot}
                          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                      >
                        {slotSaving ? "Saving..." : editingSlot ? "Update Slot" : "Create Slot"}
                      </button>
                      <button
                          onClick={() => { setShowSlotForm(false); setEditingSlot(null); }}
                          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
              )}

              {slotsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
                    ))}
                  </div>
              ) : slots.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-secondary-foreground">No exam slots created yet.</p>
                  </div>
              ) : (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                        <th className="px-4 py-3 text-center font-medium">Total Capacity</th>
                        <th className="px-4 py-3 text-center font-medium">Remaining</th>
                        <th className="px-4 py-3 text-center font-medium">Filled</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {slots
                          .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                          .map((slot) => {
                            const filled  = slot.totalCapacity - slot.remainingCapacity;
                            const fillPct = Math.round((filled / slot.totalCapacity) * 100);
                            const isFull  = slot.remainingCapacity === 0;
                            return (
                                <tr key={slot.id} className="border-t border-border hover:bg-secondary/30">
                                  <td className="px-4 py-3">
                                    <p className="font-medium">
                                      {new Date(slot.dateTime).toLocaleDateString("en-US", {
                                        weekday: "short", month: "short", day: "numeric", year: "numeric",
                                      })}
                                    </p>
                                    <p className="text-xs text-secondary-foreground">
                                      {new Date(slot.dateTime).toLocaleTimeString("en-US", {
                                        hour: "2-digit", minute: "2-digit",
                                      })}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3 text-center font-medium">{slot.totalCapacity}</td>
                                  <td className="px-4 py-3 text-center">
                            <span className={isFull ? "font-medium text-[#dc2626]" : ""}>
                              {slot.remainingCapacity}
                            </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 rounded-full bg-secondary h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${isFull ? "bg-[#ef4444]" : "bg-[#22c55e]"}`}
                                            style={{ width: `${fillPct}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-secondary-foreground w-8 text-right">
                                {fillPct}%
                              </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                          onClick={() => {
                                            setEditingSlot(slot);
                                            setShowSlotForm(false);
                                            setSlotForm({
                                              dateTime: slot.dateTime.slice(0, 16),
                                              totalCapacity: String(slot.totalCapacity),
                                            });
                                          }}
                                          className="rounded p-1 text-secondary-foreground hover:text-foreground"
                                      >
                                        <Settings className="h-4 w-4" />
                                      </button>
                                      <button
                                          onClick={() => handleDeleteSlot(slot.id)}
                                          className="rounded p-1 text-secondary-foreground hover:text-[#ef4444]"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
        )}

        {/* ── Appeals (REAL API) ── */}
        {activeTab === "Appeals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-foreground">
                  {appealsLoading
                      ? "Loading..."
                      : `${appeals.length} appeal${appeals.length !== 1 ? "s" : ""} awaiting review`
                  }
                </p>
                <button
                    onClick={fetchAppeals}
                    className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                >
                  Refresh
                </button>
              </div>

              {appealsError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {appealsError}
                    <button onClick={fetchAppeals} className="ml-2 underline">Retry</button>
                  </div>
              )}

              {appealsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />
                    ))}
                  </div>
              ) : appeals.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border gap-2">
                    <MessageSquare className="h-8 w-8 text-secondary-foreground" />
                    <p className="text-sm text-secondary-foreground">No appeals awaiting review.</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                    {appeals.map((appeal) => (
                        <div key={appeal.id} className="rounded-lg border border-border bg-background p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_APPEAL_COLORS[appeal.status] ?? "bg-secondary text-foreground"
                        }`}>
                          {appeal.status.replace(/_/g, " ")}
                        </span>
                                <span className="text-xs text-secondary-foreground">
                          Appeal #{appeal.id}
                        </span>
                              </div>
                              <p className="text-sm font-medium">
                                Student ID: {appeal.studentId}
                              </p>
                              <p className="mt-1 text-sm text-secondary-foreground">
                                {appeal.reasonText}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-secondary-foreground">
                        <span>
                          Submitted: {new Date(appeal.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                        </span>
                                {appeal.reviewerName && (
                                    <span>Reviewer: {appeal.reviewerName}</span>
                                )}
                                {appeal.attachmentUrl && (
                                  <a
                                    href={appeal.attachmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-foreground underline underline-offset-2"
                                  >
                                  View Attachment
                                  </a>
                                  )}
                              </div>
                              {appeal.decisionReason && (
                                  <div className="mt-2 rounded-md bg-secondary/50 px-3 py-2 text-xs">
                                    <span className="font-medium">Decision: </span>
                                    {appeal.decisionReason}
                                  </div>
                              )}
                            </div>
                            {(appeal.status === "SUBMITTED" || appeal.status === "IN_REVIEW") && (
                                <button
                                    onClick={() => {
                                      setReviewModal(appeal);
                                      setReviewForm({ status: "APPROVED", decisionReason: "" });
                                    }}
                                    className="shrink-0 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
                                >
                                  Review
                                </button>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}

        {/* ── Grant Override Modal (mock) ── */}
        {grantModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                <h2 className="mb-1 font-semibold">Grant Eligibility Override</h2>
                <p className="mb-4 text-sm text-secondary-foreground">
                  Overriding exam eligibility for <strong>{grantModal.studentName}</strong> — {grantModal.courseName}.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Reason <span className="text-[#dc2626]">*</span>
                    </label>
                    <textarea
                        value={exceptionForm.reason}
                        onChange={(e) => setExceptionForm({ ...exceptionForm, reason: e.target.value })}
                        rows={2}
                        placeholder="Reason for granting eligibility override..."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Scope</label>
                    <select
                        value={exceptionForm.scope}
                        onChange={(e) => setExceptionForm({ ...exceptionForm, scope: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="ExamOnly">Exam Only</option>
                      <option value="LecturesOnly">Lectures Only</option>
                      <option value="FullAccess">Full Access</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Duration (days)</label>
                    <input
                        type="number"
                        value={exceptionForm.days}
                        onChange={(e) => setExceptionForm({ ...exceptionForm, days: e.target.value })}
                        min={1}
                        max={180}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                      onClick={() => setGrantModal(null)}
                      className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                      disabled={!exceptionForm.reason.trim()}
                      onClick={() => setGrantModal(null)}
                      className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
                  >
                    Grant Override
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* ── Review Appeal Modal (REAL API) ── */}
        {reviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                <h2 className="mb-1 font-semibold">Review Appeal #{reviewModal.id}</h2>
                <p className="mb-4 text-sm text-secondary-foreground">
                  Student ID: {reviewModal.studentId}
                </p>

                <div className="mb-4 rounded-lg bg-secondary/30 p-3 text-sm">
                  <p className="font-medium mb-1">Appeal Reason:</p>
                  <p className="text-secondary-foreground">{reviewModal.reasonText}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Decision *</label>
                    <div className="flex gap-2">
                      {["APPROVED", "REJECTED"].map((s) => (
                          <button
                              key={s}
                              onClick={() => setReviewForm({ ...reviewForm, status: s })}
                              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                                  reviewForm.status === s
                                      ? s === "APPROVED"
                                          ? "bg-[#16a34a] text-white"
                                          : "bg-[#dc2626] text-white"
                                      : "border border-border hover:bg-secondary"
                              }`}
                          >
                            {s === "APPROVED"
                                ? <span className="flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5" /> Approve</span>
                                : <span className="flex items-center justify-center gap-1"><X className="h-3.5 w-3.5" /> Reject</span>
                            }
                          </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Decision Reason <span className="text-[#dc2626]">*</span>
                    </label>
                    <textarea
                        value={reviewForm.decisionReason}
                        onChange={(e) => setReviewForm({ ...reviewForm, decisionReason: e.target.value })}
                        rows={3}
                        placeholder="Explain the decision..."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                      onClick={() => { setReviewModal(null); setReviewForm({ status: "APPROVED", decisionReason: "" }); }}
                      className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                      disabled={!reviewForm.decisionReason.trim() || reviewSaving}
                      onClick={handleReviewAppeal}
                      className={`flex-1 rounded-md py-2 text-sm font-medium text-white disabled:opacity-40 ${
                          reviewForm.status === "APPROVED"
                              ? "bg-[#16a34a] hover:bg-[#15803d]"
                              : "bg-[#dc2626] hover:bg-[#b91c1c]"
                      }`}
                  >
                    {reviewSaving ? "Submitting..." : `Confirm ${reviewForm.status === "APPROVED" ? "Approval" : "Rejection"}`}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}