import { PageHeader } from "@/components/platform/page-header";

export default function AqadDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Quality Assurance"
        description="Monitor course quality and compliance standards"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Pending Reviews</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Active Audits</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Open Complaints</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Pending Reviews</h2>
          <p className="text-sm text-secondary-foreground">
            No courses pending review
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Recent Audits</h2>
          <p className="text-sm text-secondary-foreground">No recent audits</p>
        </div>
      </div>
    </div>
  );
}
