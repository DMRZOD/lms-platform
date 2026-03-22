import { PageHeader } from "@/components/platform/page-header";

export default function ResourceDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Resource Department"
        description="Manage teachers and resource allocation"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Total Teachers</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Assigned Courses</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Available Slots</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Teacher Overview</h2>
          <p className="text-sm text-secondary-foreground">No teachers registered</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Assignment Status</h2>
          <p className="text-sm text-secondary-foreground">No assignments yet</p>
        </div>
      </div>
    </div>
  );
}
