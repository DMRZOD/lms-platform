"use client";

import Link from "next/link";
import { useState } from "react";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/accountant/empty-state";
import { FilterBar } from "@/components/accountant/filter-bar";
import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockPayments,
  mockPaymentStats,
} from "@/constants/accountant-mock-data";
import type { PaymentStatus, PaymentType } from "@/types/accountant";

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

const statusColors: Record<PaymentStatus, string> = {
  Completed: "bg-[#dcfce7] text-[#166534]",
  Pending: "bg-[#fef9c3] text-[#854d0e]",
  Failed: "bg-[#fee2e2] text-[#991b1b]",
  Refunded: "bg-[#e0e7ff] text-[#3730a3]",
};

const typeColors: Record<PaymentType, string> = {
  Tuition: "bg-[#e0e7ff] text-[#3730a3]",
  Installment: "bg-[#f0fdf4] text-[#166534]",
  Fine: "bg-[#fef3c7] text-[#92400e]",
  Other: "bg-[#f3f4f6] text-[#374151]",
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

const typeFilters = [
  { label: "All Types", value: "all" },
  { label: "Tuition", value: "Tuition" },
  { label: "Installment", value: "Installment" },
  { label: "Fine", value: "Fine" },
  { label: "Other", value: "Other" },
];

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockPayments.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesSearch =
      search === "" ||
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.contractNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Track all student payments and transactions"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Collected"
          value={formatCurrency(mockPaymentStats.totalCollected)}
          icon={CreditCard}
          accent="success"
        />
        <StatCard
          label="Pending"
          value={formatCurrency(mockPaymentStats.pending)}
          icon={CreditCard}
          accent="warning"
        />
        <StatCard
          label="Failed"
          value={formatCurrency(mockPaymentStats.failed)}
          icon={CreditCard}
          accent="danger"
        />
        <StatCard
          label="Refunds"
          value={formatCurrency(mockPaymentStats.refunds)}
          icon={CreditCard}
          accent="default"
        />
      </div>

      <SectionCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">All Payments</h2>
          <div className="flex flex-wrap gap-1.5">
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  typeFilter === f.value
                    ? "bg-foreground text-background"
                    : "border border-border bg-background hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <FilterBar
          filters={statusFilters}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search by student, payment #, contract..."
          className="mb-4"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[1fr_1.2fr_1fr_90px_110px_100px_110px_90px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
              <span>Payment #</span>
              <span>Student</span>
              <span>Contract</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Method</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            <div className="min-w-[900px] divide-y divide-border">
              {filtered.map((payment) => (
                <div
                  key={payment.id}
                  className="grid grid-cols-[1fr_1.2fr_1fr_90px_110px_100px_110px_90px] items-center gap-x-4 px-3 py-3 hover:bg-secondary"
                >
                  <span className="text-sm font-medium">
                    {payment.paymentNumber}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{payment.studentName}</p>
                  </div>
                  <Link
                    href={`/accountant/contracts/${payment.contractId}`}
                    className="text-sm text-secondary-foreground hover:text-foreground hover:underline"
                  >
                    {payment.contractNumber}
                  </Link>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[payment.type]}`}
                    >
                      {payment.type}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(payment.amount)}
                  </span>
                  <span className="text-sm text-secondary-foreground">
                    {payment.method}
                  </span>
                  <span className="text-sm">{formatDate(payment.date)}</span>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
