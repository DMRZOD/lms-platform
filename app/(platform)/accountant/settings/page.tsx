"use client";

import { useState } from "react";

import { SectionCard } from "@/components/accountant/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockFinanceSettings } from "@/constants/accountant-mock-data";
import type { PaymentMethod } from "@/types/accountant";

const ALL_METHODS: PaymentMethod[] = ["Card", "Bank Transfer", "Cash", "Online"];

export default function FinanceSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    mockFinanceSettings.paymentMethods,
  );
  const [paymentDeadlineDays, setPaymentDeadlineDays] = useState(
    mockFinanceSettings.paymentDeadlineDays.toString(),
  );
  const [latePenaltyPercent, setLatePenaltyPercent] = useState(
    mockFinanceSettings.latePenaltyPercent.toString(),
  );

  const [autoBlockEnabled, setAutoBlockEnabled] = useState(
    mockFinanceSettings.autoBlockEnabled,
  );
  const [autoBlockThresholdDays, setAutoBlockThresholdDays] = useState(
    mockFinanceSettings.autoBlockThresholdDays.toString(),
  );
  const [gracePeriodDays, setGracePeriodDays] = useState(
    mockFinanceSettings.gracePeriodDays.toString(),
  );

  const [defaultInstallmentCount, setDefaultInstallmentCount] = useState(
    mockFinanceSettings.defaultInstallmentCount.toString(),
  );
  const [minDownPaymentPercent, setMinDownPaymentPercent] = useState(
    mockFinanceSettings.minDownPaymentPercent.toString(),
  );
  const [lateInstallmentPenalty, setLateInstallmentPenalty] = useState(
    mockFinanceSettings.lateInstallmentPenaltyPercent.toString(),
  );

  const [syncFrequency, setSyncFrequency] = useState(
    mockFinanceSettings.syncFrequency,
  );
  const [autoResolveThreshold, setAutoResolveThreshold] = useState(
    mockFinanceSettings.autoResolveThreshold.toString(),
  );
  const [notificationEmail, setNotificationEmail] = useState(
    mockFinanceSettings.notificationEmail,
  );

  const [paymentReminderTemplate, setPaymentReminderTemplate] = useState(
    mockFinanceSettings.paymentReminderTemplate,
  );
  const [overdueNoticeTemplate, setOverdueNoticeTemplate] = useState(
    mockFinanceSettings.overdueNoticeTemplate,
  );
  const [blockNotificationTemplate, setBlockNotificationTemplate] = useState(
    mockFinanceSettings.blockNotificationTemplate,
  );

  const [savedSection, setSavedSection] = useState<string | null>(null);

  function handleSave(section: string) {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  }

  function toggleMethod(method: PaymentMethod) {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method],
    );
  }

  return (
    <div>
      <PageHeader
        title="Finance Settings"
        description="Configure financial rules, payment options, and integrations"
      />

      <div className="space-y-6">
        {/* Payment Configuration */}
        <SectionCard title="Payment Configuration">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Accepted Payment Methods
              </label>
              <div className="flex flex-wrap gap-3">
                {ALL_METHODS.map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={paymentMethods.includes(method)}
                      onChange={() => toggleMethod(method)}
                      className="accent-foreground"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Payment Deadline (days after issue)
                </label>
                <input
                  type="number"
                  value={paymentDeadlineDays}
                  onChange={(e) => setPaymentDeadlineDays(e.target.value)}
                  min="1"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Late Payment Penalty (%)
                </label>
                <input
                  type="number"
                  value={latePenaltyPercent}
                  onChange={(e) => setLatePenaltyPercent(e.target.value)}
                  min="0"
                  step="0.5"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {savedSection === "payment" && (
              <span className="text-sm text-[#16a34a]">Saved!</span>
            )}
            <div />
            <button
              onClick={() => handleSave("payment")}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </SectionCard>

        {/* Auto-Blocking Rules */}
        <SectionCard title="Auto-Blocking Rules">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Auto-Block</p>
                <p className="text-xs text-secondary-foreground">
                  Automatically block students when debt threshold is exceeded
                </p>
              </div>
              <button
                onClick={() => setAutoBlockEnabled(!autoBlockEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoBlockEnabled ? "bg-foreground" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-background transition-transform ${
                    autoBlockEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {autoBlockEnabled && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Block After (days overdue)
                  </label>
                  <input
                    type="number"
                    value={autoBlockThresholdDays}
                    onChange={(e) => setAutoBlockThresholdDays(e.target.value)}
                    min="1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Grace Period (days)
                  </label>
                  <input
                    type="number"
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(e.target.value)}
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  />
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    Days of grace before block is applied
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave("blocking")}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              {savedSection === "blocking" ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>

        {/* Installment Plans */}
        <SectionCard title="Installment Plan Defaults">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Default Installment Count
              </label>
              <input
                type="number"
                value={defaultInstallmentCount}
                onChange={(e) => setDefaultInstallmentCount(e.target.value)}
                min="1"
                max="12"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Min Down Payment (%)
              </label>
              <input
                type="number"
                value={minDownPaymentPercent}
                onChange={(e) => setMinDownPaymentPercent(e.target.value)}
                min="0"
                max="100"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Late Installment Penalty (%)
              </label>
              <input
                type="number"
                value={lateInstallmentPenalty}
                onChange={(e) => setLateInstallmentPenalty(e.target.value)}
                min="0"
                step="0.5"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave("installments")}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              {savedSection === "installments" ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>

        {/* 1C Integration */}
        <SectionCard title="1C Integration Settings">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Sync Frequency
              </label>
              <select
                value={syncFrequency}
                onChange={(e) =>
                  setSyncFrequency(
                    e.target.value as "hourly" | "daily" | "weekly",
                  )
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Auto-Resolve Threshold (USD)
              </label>
              <input
                type="number"
                value={autoResolveThreshold}
                onChange={(e) => setAutoResolveThreshold(e.target.value)}
                min="0"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <p className="mt-0.5 text-xs text-secondary-foreground">
                Differences below this amount are auto-resolved
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Notification Email
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave("sync")}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              {savedSection === "sync" ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>

        {/* Notification Templates */}
        <SectionCard title="Notification Templates">
          <p className="mb-4 text-xs text-secondary-foreground">
            Use placeholders: {"{student_name}"}, {"{amount}"}, {"{due_date}"},
            {" "}
            {"{days_overdue}"}
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment Reminder
              </label>
              <textarea
                value={paymentReminderTemplate}
                onChange={(e) => setPaymentReminderTemplate(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Overdue Notice
              </label>
              <textarea
                value={overdueNoticeTemplate}
                onChange={(e) => setOverdueNoticeTemplate(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Block Notification
              </label>
              <textarea
                value={blockNotificationTemplate}
                onChange={(e) => setBlockNotificationTemplate(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave("templates")}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              {savedSection === "templates" ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
