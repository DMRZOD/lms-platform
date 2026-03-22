import { PageHeader } from "@/components/platform/page-header";

export default function TeacherDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome, Teacher"
        description="Manage your courses and students"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Active Courses</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Total Students</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Pending Grades</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Current Courses</h2>
          <p className="text-sm text-secondary-foreground">No courses yet</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>
          <p className="text-sm text-secondary-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
