"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockContracts,
  mockPayments,
  mockPaymentSchedules,
} from "@/constants/accountant-mock-data";
import type { ContractStatus, ContractType, PaymentStatus } from "@/types/accountant";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusColors: Record<ContractStatus, string> = {
  Active: "bg-[#dcfce7] text-[#166534]",
  Expired: "bg-[#f3f4f6] text-[#374151]",
  Pending: "bg-[#fef9c3] text-[#854d0e]",
  Terminated: "bg-[#fee2e2] text-[#991b1b]",
};

const typeColors: Record<ContractType, string> = {
  Full: "bg-[#e0e7ff] text-[#3730a3]",
  Partial: "bg-[#fef3c7] text-[#92400e]",
  Grant: "bg-[#dcfce7] text-[#166534]",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  Completed: "bg-[#dcfce7] text-[#166534]",
  Pending: "bg-[#fef9c3] text-[#854d0e]",
  Failed: "bg-[#fee2e2] text-[#991b1b]",
  Refunded: "bg-[#e0e7ff] text-[#3730a3]",
};

const TABS = ["Overview", "Payment Schedule", "Payment History", "Actions"] as const;
type Tab = (typeof TABS)[number];

export default function ContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);

  const contract = mockContracts.find((c) => c.id === contractId);
  if (!contract) {
    return (
      <div className="py-20 text-center">
        <p className="text-secondary-foreground">Contract not found.</p>
        <Link
          href="/accountant/contracts"
          className="mt-4 inline-block text-sm text-foreground underline"
        >
          Back to Contracts
        </Link>
      </div>
    );
  }

  const schedule = mockPaymentSchedules.filter(
    (s) => s.contractId === contractId,
  );
  const payments = mockPayments.filter((p) => p.contractId === contractId);
  const remaining = contract.totalAmount - contract.paidAmount;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/accountant/contracts"
          className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Contracts
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <PageHeader title={contract.contractNumber} />
            <span
              className={`mb-6 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[contract.status]}`}
            >
              {contract.status}
            </span>
            <span
              className={`mb-6 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[contract.type]}`}
            >
              {contract.type}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={formatCurrency(contract.paidAmount)}
          accent="success"
          subtitle={`of ${formatCurrency(contract.totalAmount)}`}
        />
        <StatCard
          label="Remaining Balance"
          value={formatCurrency(remaining)}
          accent={remaining > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Next Payment Due"
          value={
            contract.nextPaymentDate
              ? formatDate(contract.nextPaymentDate)
              : "—"
          }
          subtitle={
            contract.nextPaymentAmount
              ? formatCurrency(contract.nextPaymentAmount)
              : undefined
          }
          accent={contract.nextPaymentDate ? "warning" : "default"}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-border">
        {TABS.map((tab) => (
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
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Contract Details">
            <dl className="space-y-3 text-sm">
              {[
                ["Contract Number", contract.contractNumber],
                ["Student", contract.studentName],
                ["Email", contract.studentEmail],
                ["Program", contract.program],
                ["Faculty", contract.faculty],
                ["Contract Type", contract.type],
                ["Total Amount", formatCurrency(contract.totalAmount)],
                ["Paid Amount", formatCurrency(contract.paidAmount)],
                [
                  "Installments",
                  contract.installmentCount > 0
                    ? contract.installmentCount
                    : "N/A",
                ],
                ["Start Date", formatDate(contract.startDate)],
                ["End Date", formatDate(contract.endDate)],
                ["Created By", contract.createdBy],
                ["Created At", formatDate(contract.createdAt)],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-4">
                  <dt className="text-secondary-foreground">{label}</dt>
                  <dd className="font-medium text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard title="Notes">
            {contract.notes ? (
              <p className="text-sm">{contract.notes}</p>
            ) : (
              <p className="text-sm text-secondary-foreground">No notes</p>
            )}
          </SectionCard>
        </div>
      )}

      {/* Payment Schedule */}
      {activeTab === "Payment Schedule" && (
        <SectionCard title="Payment Schedule">
          {schedule.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              No payment schedule defined.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid min-w-[500px] grid-cols-[60px_1fr_120px_120px_120px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
                <span>#</span>
                <span>Due Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Paid At</span>
              </div>
              <div className="min-w-[500px] divide-y divide-border">
                {schedule.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-[60px_1fr_120px_120px_120px] items-center gap-x-4 px-3 py-3"
                  >
                    <span className="text-sm text-secondary-foreground">
                      {s.installmentNumber}
                    </span>
                    <span className="text-sm">{formatDate(s.dueDate)}</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(s.amount)}
                    </span>
                    <span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatusColors[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </span>
                    <span className="text-sm text-secondary-foreground">
                      {s.paidAt ? formatDate(s.paidAt) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Payment History */}
      {activeTab === "Payment History" && (
        <SectionCard title="Payment History">
          {payments.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              No payments recorded.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid min-w-[600px] grid-cols-[1fr_100px_120px_120px_100px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
                <span>Payment #</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Status</span>
              </div>
              <div className="min-w-[600px] divide-y divide-border">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[1fr_100px_120px_120px_100px] items-center gap-x-4 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{p.paymentNumber}</p>
                      <p className="text-xs text-secondary-foreground">
                        {p.description}
                      </p>
                    </div>
                    <span className="text-sm">{p.type}</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(p.amount)}
                    </span>
                    <span className="text-sm">{formatDate(p.date)}</span>
                    <span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatusColors[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Actions */}
      {activeTab === "Actions" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button className="rounded-lg border border-border bg-background p-5 text-left hover:bg-secondary">
            <p className="font-semibold">Renew Contract</p>
            <p className="mt-1 text-sm text-secondary-foreground">
              Extend contract period and update terms
            </p>
          </button>
          <button className="rounded-lg border border-border bg-background p-5 text-left hover:bg-secondary">
            <p className="font-semibold">Modify Terms</p>
            <p className="mt-1 text-sm text-secondary-foreground">
              Edit payment plan or contract amount
            </p>
          </button>
          <button
            onClick={() => setShowTerminateDialog(true)}
            className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-5 text-left hover:bg-[#fee2e2]"
          >
            <p className="font-semibold text-[#991b1b]">Terminate Contract</p>
            <p className="mt-1 text-sm text-[#b91c1c]">
              Permanently terminate this contract
            </p>
          </button>
        </div>
      )}

      {/* Terminate Dialog */}
      {showTerminateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <h3 className="font-semibold">Terminate Contract?</h3>
            <p className="mt-2 text-sm text-secondary-foreground">
              This will permanently terminate contract{" "}
              <strong>{contract.contractNumber}</strong> for{" "}
              <strong>{contract.studentName}</strong>. This action cannot be
              undone.
            </p>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">
                Reason for termination
              </label>
              <textarea
                rows={3}
                placeholder="Enter reason..."
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowTerminateDialog(false)}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTerminateDialog(false)}
                className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#b91c1c]"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
