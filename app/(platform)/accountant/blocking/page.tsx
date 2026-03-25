"use client";

import { useState } from "react";
import { Ban, Users } from "lucide-react";

import { EmptyState } from "@/components/accountant/empty-state";
import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockBlockHistory,
  mockBlocks,
  mockBlockingStats,
} from "@/constants/accountant-mock-data";
import type { BlockType, ExceptionStatus } from "@/types/accountant";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const blockTypeColors: Record<BlockType, string> = {
  Auto: "bg-[#fee2e2] text-[#991b1b]",
  Manual: "bg-[#fef9c3] text-[#854d0e]",
};

const exceptionColors: Record<ExceptionStatus, string> = {
  None: "bg-[#f3f4f6] text-[#374151]",
  Pending: "bg-[#fef9c3] text-[#854d0e]",
  Approved: "bg-[#dcfce7] text-[#166534]",
  Rejected: "bg-[#fee2e2] text-[#991b1b]",
};

type Tab = "Active Blocks" | "Block History";

export default function BlockingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Active Blocks");
  const [unblockId, setUnblockId] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState("");
  const [searchHistory, setSearchHistory] = useState("");

  const filteredBlocks = mockBlocks.filter(
    (b) =>
      searchActive === "" ||
      b.studentName.toLowerCase().includes(searchActive.toLowerCase()) ||
      b.reason.toLowerCase().includes(searchActive.toLowerCase()),
  );

  const filteredHistory = mockBlockHistory.filter(
    (h) =>
      searchHistory === "" ||
      h.studentName.toLowerCase().includes(searchHistory.toLowerCase()) ||
      h.reason.toLowerCase().includes(searchHistory.toLowerCase()),
  );

  const unblockBlock = mockBlocks.find((b) => b.id === unblockId);

  return (
    <div>
      <PageHeader
        title="Blocking & Unblocking"
        description="Manage student account blocks and exceptions"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Currently Blocked"
          value={mockBlockingStats.currentlyBlocked}
          icon={Ban}
          accent="danger"
        />
        <StatCard
          label="Auto-blocked"
          value={mockBlockingStats.autoBlocked}
          icon={Ban}
          accent="danger"
        />
        <StatCard
          label="Manual Blocks"
          value={mockBlockingStats.manualBlocks}
          icon={Users}
          accent="warning"
        />
        <StatCard
          label="Pending Exceptions"
          value={mockBlockingStats.pendingExceptions}
          icon={Users}
          accent="warning"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-border">
        {(["Active Blocks", "Block History"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "Active Blocks" && (
              <span className="ml-2 rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-xs font-semibold text-[#991b1b]">
                {mockBlocks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Blocks */}
      {activeTab === "Active Blocks" && (
        <SectionCard>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">Active Blocks</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchActive}
                onChange={(e) => setSearchActive(e.target.value)}
                placeholder="Search..."
                className="w-48 rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <button className="flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90">
                <Ban className="h-4 w-4" />
                Block Student
              </button>
            </div>
          </div>

          {filteredBlocks.length === 0 ? (
            <EmptyState
              icon={Ban}
              title="No active blocks"
              description="No students are currently blocked."
            />
          ) : (
            <div className="overflow-x-auto">
              <div className="grid min-w-[800px] grid-cols-[1.2fr_1.5fr_110px_80px_120px_140px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
                <span>Student</span>
                <span>Reason</span>
                <span>Block Date</span>
                <span>Type</span>
                <span>Exception</span>
                <span>Actions</span>
              </div>
              <div className="min-w-[800px] divide-y divide-border">
                {filteredBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="grid grid-cols-[1.2fr_1.5fr_110px_80px_120px_140px] items-center gap-x-4 px-3 py-3 hover:bg-secondary"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {block.studentName}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {block.program}
                      </p>
                      {block.debtAmount && (
                        <p className="text-xs text-[#dc2626]">
                          Debt: {formatCurrency(block.debtAmount)}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-secondary-foreground">
                      {block.reason}
                    </span>
                    <span className="text-sm">
                      {formatDate(block.blockDate)}
                    </span>
                    <span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${blockTypeColors[block.type]}`}
                      >
                        {block.type}
                      </span>
                    </span>
                    <span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${exceptionColors[block.exceptionStatus]}`}
                      >
                        {block.exceptionStatus}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUnblockId(block.id)}
                        className="text-xs font-medium text-[#16a34a] hover:underline"
                      >
                        Unblock
                      </button>
                      <button className="text-xs text-secondary-foreground hover:text-foreground">
                        Exception
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Block History */}
      {activeTab === "Block History" && (
        <SectionCard>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">Block History</h2>
            <input
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              placeholder="Search..."
              className="w-48 rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <EmptyState
              icon={Ban}
              title="No history"
              description="No block/unblock history found."
            />
          ) : (
            <div className="overflow-x-auto">
              <div className="grid min-w-[700px] grid-cols-[1.2fr_100px_80px_1.5fr_110px_1fr] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
                <span>Student</span>
                <span>Action</span>
                <span>Type</span>
                <span>Reason</span>
                <span>Date</span>
                <span>Actor</span>
              </div>
              <div className="min-w-[700px] divide-y divide-border">
                {filteredHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[1.2fr_100px_80px_1.5fr_110px_1fr] items-center gap-x-4 px-3 py-3 hover:bg-secondary"
                  >
                    <span className="text-sm font-medium">
                      {entry.studentName}
                    </span>
                    <span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          entry.action === "Blocked"
                            ? "bg-[#fee2e2] text-[#991b1b]"
                            : "bg-[#dcfce7] text-[#166534]"
                        }`}
                      >
                        {entry.action}
                      </span>
                    </span>
                    <span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${blockTypeColors[entry.type]}`}
                      >
                        {entry.type}
                      </span>
                    </span>
                    <span className="text-sm text-secondary-foreground">
                      {entry.reason}
                    </span>
                    <span className="text-sm">{formatDate(entry.date)}</span>
                    <span className="text-sm text-secondary-foreground">
                      {entry.actor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Unblock Confirmation Dialog */}
      {unblockId && unblockBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <h3 className="font-semibold">Unblock Student?</h3>
            <p className="mt-2 text-sm text-secondary-foreground">
              This will unblock{" "}
              <strong>{unblockBlock.studentName}</strong> and restore full
              access to their account.
            </p>
            {unblockBlock.debtAmount && unblockBlock.debtAmount > 0 && (
              <div className="mt-3 rounded-md bg-[#fef9c3] p-3 text-sm text-[#854d0e]">
                Note: Outstanding debt of{" "}
                <strong>{formatCurrency(unblockBlock.debtAmount)}</strong>{" "}
                remains unpaid.
              </div>
            )}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">
                Reason for unblocking
              </label>
              <textarea
                rows={2}
                placeholder="Enter reason..."
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setUnblockId(null)}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setUnblockId(null)}
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Confirm Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
