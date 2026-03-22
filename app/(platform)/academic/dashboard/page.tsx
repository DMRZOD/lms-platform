import { PageHeader } from "@/components/platform/page-header";

export default function AcademicDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Academic Department"
        description="Manage schedules, groups, and academic processes"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Total Groups</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Active Courses</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">
            Student Enrollment
          </p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Schedule Overview</h2>
          <p className="text-sm text-secondary-foreground">
            No schedule data yet
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Performance Alerts</h2>
          <p className="text-sm text-secondary-foreground">No alerts</p>
        </div>
      </div>
    </div>
  );
}
