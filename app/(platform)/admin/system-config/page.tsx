"use client";

import {
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Link2,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockIntegrations,
  mockSystemConfig,
} from "@/constants/admin-mock-data";
import type { ConfigCategory, IntegrationStatus } from "@/types/admin";

const integrationStatusColors: Record<
  IntegrationStatus,
  { bg: string; text: string; dot: string }
> = {
  Connected: {
    bg: "bg-[#dcfce7]",
    text: "text-[#166534]",
    dot: "bg-[#22c55e]",
  },
  Disconnected: {
    bg: "bg-[#f1f5f9]",
    text: "text-[#475569]",
    dot: "bg-[#94a3b8]",
  },
  Error: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]", dot: "bg-[#ef4444]" },
  Syncing: {
    bg: "bg-[#eff6ff]",
    text: "text-[#1d4ed8]",
    dot: "bg-[#3b82f6]",
  },
};

const categoryOrder: ConfigCategory[] = [
  "General",
  "Email",
  "Security",
  "Limits",
  "Scheduling",
  "Storage",
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSyncTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function SecretValue({ value }: { value: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="flex items-center gap-1.5">
      <span className="font-mono text-sm">
        {visible ? value : "••••••••••••"}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-secondary-foreground hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </button>
    </span>
  );
}

export default function SystemConfigPage() {
  const connectedCount = mockIntegrations.filter(
    (i) => i.status === "Connected",
  ).length;
  const errorCount = mockIntegrations.filter(
    (i) => i.status === "Error",
  ).length;

  const lastModified = mockSystemConfig
    .map((c) => c.lastModified)
    .sort()
    .at(-1);

  const groupedConfig = categoryOrder.reduce<
    Record<ConfigCategory, typeof mockSystemConfig>
  >(
    (acc, cat) => {
      acc[cat] = mockSystemConfig.filter((c) => c.category === cat);
      return acc;
    },
    {} as Record<ConfigCategory, typeof mockSystemConfig>,
  );

  return (
    <div>
      <PageHeader
        title="System Configuration"
        description="Platform settings, integrations, and environment configuration"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Config Items"
          value={mockSystemConfig.length}
          icon={Settings}
        />
        <StatCard
          label="Active Integrations"
          value={connectedCount}
          icon={Link2}
          accent="success"
        />
        <StatCard
          label="Integration Errors"
          value={errorCount}
          icon={AlertCircle}
          accent={errorCount > 0 ? "danger" : "success"}
        />
        <StatCard
          label="Last Config Change"
          value={lastModified ? formatDateTime(lastModified) : "—"}
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="config">
        <TabsList className="mb-6">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* ── Configuration Tab ── */}
        <TabsContent value="config" className="space-y-6">
          {categoryOrder.map((category) => {
            const items = groupedConfig[category];
            if (!items || items.length === 0) return null;
            return (
              <SectionCard key={category} title={category}>
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-medium">
                            {item.key}
                          </p>
                          {item.isSecret && (
                            <span className="rounded bg-[#fef9c3] px-1.5 py-0.5 text-xs text-[#854d0e]">
                              secret
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-secondary-foreground">
                          {item.description}
                        </p>
                        <p className="mt-0.5 text-xs text-secondary-foreground">
                          Modified {formatDateTime(item.lastModified)} by{" "}
                          {item.modifiedBy}
                        </p>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        {item.isSecret ? (
                          <SecretValue value={item.value} />
                        ) : (
                          <span className="font-mono text-sm">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            );
          })}
        </TabsContent>

        {/* ── Integrations Tab ── */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockIntegrations.map((integration) => {
              const colors =
                integrationStatusColors[integration.status] ??
                integrationStatusColors.Disconnected;
              return (
                <div
                  key={integration.id}
                  className="rounded-lg border border-border bg-background p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="mt-0.5 text-xs text-secondary-foreground">
                        {integration.description}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${colors.dot}`}
                      />
                      {integration.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">
                        Endpoint
                      </span>
                      <span className="max-w-[160px] truncate font-mono text-xs">
                        {integration.endpoint}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">
                        Last sync
                      </span>
                      <span>{formatSyncTime(integration.lastSync)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">
                        Records synced
                      </span>
                      <span>{integration.recordsSynced.toLocaleString()}</span>
                    </div>
                    {integration.errorCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-secondary-foreground">
                          Errors
                        </span>
                        <span className="font-medium text-[#dc2626]">
                          {integration.errorCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background py-1.5 text-sm hover:bg-secondary transition-colors">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Sync Now
                  </button>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
