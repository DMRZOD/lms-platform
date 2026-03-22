import { PageHeader } from "@/components/platform/page-header";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Admin Panel"
        description="System administration and configuration"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Total Users</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Active Sessions</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">System Health</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>
          <p className="text-sm text-secondary-foreground">
            No recent activity
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">System Status</h2>
          <p className="text-sm text-secondary-foreground">
            All systems operational
          </p>
        </div>
      </div>
    </div>
  );
}
