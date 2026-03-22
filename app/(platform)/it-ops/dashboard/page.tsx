import { PageHeader } from "@/components/platform/page-header";

export default function ItOpsDashboardPage() {
  return (
    <div>
      <PageHeader
        title="IT Operations"
        description="Monitoring, releases, and system operations"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">System Uptime</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Active Alerts</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Pending Releases</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">System Status</h2>
          <p className="text-sm text-secondary-foreground">
            All systems operational
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Recent Alerts</h2>
          <p className="text-sm text-secondary-foreground">No alerts</p>
        </div>
      </div>
    </div>
  );
}
