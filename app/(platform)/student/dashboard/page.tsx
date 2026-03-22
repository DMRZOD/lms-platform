import { PageHeader } from "@/components/platform/page-header";

export default function StudentDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome back, Student"
        description="Here's an overview of your learning progress"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Enrolled Courses</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Completed</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Average Score</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Recent Courses</h2>
          <p className="text-sm text-secondary-foreground">No courses yet</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Upcoming Classes</h2>
          <p className="text-sm text-secondary-foreground">
            No upcoming classes
          </p>
        </div>
      </div>
    </div>
  );
}
