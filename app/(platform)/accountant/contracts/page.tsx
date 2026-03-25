"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Plus, Upload } from "lucide-react";

import { EmptyState } from "@/components/accountant/empty-state";
import { FilterBar } from "@/components/accountant/filter-bar";
import { SectionCard } from "@/components/accountant/section-card";
import { StatCard } from "@/components/accountant/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockContracts,
  mockContractStats,
} from "@/constants/accountant-mock-data";
import type { ContractStatus, ContractType } from "@/types/accountant";

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

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Expired", value: "Expired" },
  { label: "Terminated", value: "Terminated" },
];

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockContracts.filter((c) => {
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    const matchesSearch =
      search === "" ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.program.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Manage student financial contracts"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Contracts"
          value={mockContractStats.total}
          icon={FileText}
        />
        <StatCard
          label="Active"
          value={mockContractStats.active}
          icon={FileText}
          accent="success"
        />
        <StatCard
          label="Expiring Soon"
          value={mockContractStats.expiringSoon}
          icon={FileText}
          accent="warning"
          subtitle="Within 30 days"
        />
        <StatCard
          label="Total Value"
          value={formatCurrency(mockContractStats.totalValue)}
          icon={FileText}
          accent="default"
        />
      </div>

      <SectionCard>
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">All Contracts</h2>
          <div className="flex gap-2">
            <Link
              href="/accountant/contracts/import"
              className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              <Upload className="h-4 w-4" />
              Import
            </Link>
            <Link
              href="/accountant/contracts/create"
              className="flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Contract
            </Link>
          </div>
        </div>

        <FilterBar
          filters={statusFilters}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search by student, contract #, program..."
          className="mb-4"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No contracts found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid min-w-[800px] grid-cols-[1fr_1.5fr_1fr_80px_100px_100px_90px_80px] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
              <span>Contract #</span>
              <span>Student</span>
              <span>Program</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Period</span>
              <span>Status</span>
              <span></span>
            </div>

            {/* Table Rows */}
            <div className="min-w-[800px] divide-y divide-border">
              {filtered.map((contract) => (
                <div
                  key={contract.id}
                  className="grid grid-cols-[1fr_1.5fr_1fr_80px_100px_100px_90px_80px] items-center gap-x-4 px-3 py-3 hover:bg-secondary"
                >
                  <span className="text-sm font-medium">
                    {contract.contractNumber}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{contract.studentName}</p>
                    <p className="text-xs text-secondary-foreground">
                      {contract.studentEmail}
                    </p>
                  </div>
                  <span className="truncate text-sm">{contract.program}</span>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[contract.type]}`}
                    >
                      {contract.type}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(contract.totalAmount)}
                  </span>
                  <div>
                    <p className="text-xs">
                      {formatDate(contract.startDate)}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      → {formatDate(contract.endDate)}
                    </p>
                  </div>
                  <span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[contract.status]}`}
                    >
                      {contract.status}
                    </span>
                  </span>
                  <Link
                    href={`/accountant/contracts/${contract.id}`}
                    className="text-sm text-secondary-foreground hover:text-foreground"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
