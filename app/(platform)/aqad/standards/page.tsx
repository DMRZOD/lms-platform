"use client";

import { useState } from "react";
import { BookMarked, ChevronDown, ChevronRight, Edit2, Plus } from "lucide-react";
import { SectionCard } from "@/components/aqad/section-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAcademicStandards,
  mockCorrectiveActionTemplates,
  mockQualityChecklists,
  mockRejectionTemplates,
} from "@/constants/aqad-mock-data";

const TABS = [
  { id: "checklists" as const, label: "Checklists" },
  { id: "standards" as const, label: "Standards Library" },
  { id: "templates" as const, label: "Templates" },
];

const TYPE_STYLES: Record<string, string> = {
  International: "bg-[#dbeafe] text-[#2563eb]",
  Internal: "bg-[#dcfce7] text-[#16a34a]",
  Accreditation: "bg-[#ede9fe] text-[#7c3aed]",
};

const CATEGORY_STYLES: Record<string, string> = {
  Standards: "bg-[#dbeafe] text-[#2563eb]",
  Structure: "bg-[#dcfce7] text-[#16a34a]",
  Materials: "bg-[#fef3c7] text-[#d97706]",
  Assessment: "bg-[#ede9fe] text-[#7c3aed]",
  Language: "bg-[#fee2e2] text-[#dc2626]",
  Communication: "bg-[#f4f4f4] text-[#6b7280]",
};

export default function StandardsPage() {
  const [activeTab, setActiveTab] = useState<"checklists" | "standards" | "templates">("checklists");
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>(mockQualityChecklists[0]?.id ?? null);

  return (
    <div>
      <PageHeader title="Standards & Checklists" description="Quality standards, review checklists, and templates" />

      <div className="mb-6 flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-foreground text-foreground" : "text-secondary-foreground hover:text-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Checklists Tab */}
      {activeTab === "checklists" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary">
              <Plus className="h-4 w-4" /> New Checklist
            </button>
          </div>
          {mockQualityChecklists.map((cl) => (
            <div key={cl.id} className="overflow-hidden rounded-lg border">
              <button
                onClick={() => setExpandedChecklist(expandedChecklist === cl.id ? null : cl.id)}
                className="flex w-full items-center justify-between px-4 py-4 hover:bg-secondary"
              >
                <div className="flex items-center gap-3">
                  <BookMarked className="h-4 w-4 text-secondary-foreground" />
                  <div className="text-left">
                    <p className="font-medium">{cl.name}</p>
                    <p className="text-xs text-secondary-foreground">
                      {cl.version} · {cl.items.length} items · Updated {new Date(cl.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {cl.programType && ` · ${cl.programType}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs hover:bg-background"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </div>
                  {expandedChecklist === cl.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </button>

              {expandedChecklist === cl.id && (
                <div className="border-t">
                  {cl.items.map((item, idx) => (
                    <div key={item.id} className={`flex items-start gap-3 px-4 py-3 ${idx < cl.items.length - 1 ? "border-b" : ""}`}>
                      <span className="mt-0.5 text-xs font-medium text-secondary-foreground w-5">{idx + 1}.</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{item.title}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[item.category] ?? "bg-[#f4f4f4] text-[#6b7280]"}`}>
                            {item.category}
                          </span>
                          {item.required && (
                            <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#dc2626]">Required</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-secondary-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Standards Library Tab */}
      {activeTab === "standards" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockAcademicStandards.map((std) => (
            <SectionCard key={std.id}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs font-semibold text-secondary-foreground">{std.code}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[std.type] ?? "bg-[#f4f4f4] text-[#6b7280]"}`}>
                      {std.type}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{std.name}</p>
                </div>
              </div>
              <p className="text-sm text-secondary-foreground">{std.description}</p>
              {std.mappedChecklistItems.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs text-secondary-foreground">
                    Mapped to {std.mappedChecklistItems.length} checklist item{std.mappedChecklistItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <SectionCard title="Rejection Reason Templates">
            <div className="space-y-3">
              {mockRejectionTemplates.map((t) => (
                <div key={t.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{t.title}</p>
                    <button className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <p className="text-sm text-secondary-foreground">{t.description}</p>
                  <div className="mt-2 rounded-md bg-secondary px-3 py-2">
                    <p className="text-xs font-medium text-secondary-foreground">Required Action:</p>
                    <p className="text-xs">{t.requiredAction}</p>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 text-sm text-secondary-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add template
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Corrective Action Templates">
            <div className="space-y-3">
              {mockCorrectiveActionTemplates.map((t) => (
                <div key={t.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{t.title}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.priority === "High" ? "bg-[#fef3c7] text-[#d97706]" : "bg-[#dbeafe] text-[#2563eb]"
                      }`}>
                        {t.priority}
                      </span>
                      <span className="text-xs text-secondary-foreground">{t.defaultDays}d default</span>
                    </div>
                    <button className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <p className="text-sm text-secondary-foreground">{t.issueDescription}</p>
                  <div className="mt-2 rounded-md bg-secondary px-3 py-2">
                    <p className="text-xs font-medium text-secondary-foreground">Required Action:</p>
                    <p className="text-xs">{t.requiredAction}</p>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 text-sm text-secondary-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add template
              </button>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
