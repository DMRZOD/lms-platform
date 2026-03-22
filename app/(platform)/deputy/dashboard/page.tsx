import { PageHeader } from "@/components/platform/page-header";

export default function DeputyDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Deputy Director"
        description="KPI, strategy, and performance monitoring"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">
            Student Satisfaction
          </p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Completion Rate</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Active Students</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Revenue</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">KPI Overview</h2>
          <p className="text-sm text-secondary-foreground">No KPI data yet</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Quality Metrics</h2>
          <p className="text-sm text-secondary-foreground">No metrics yet</p>
        </div>
      </div>
    </div>
  );
}
