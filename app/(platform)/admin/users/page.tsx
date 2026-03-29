"use client";

import {
    Ban,
    Clock,
    ShieldCheck,
    UserCheck,
    UserPlus,
    Users,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { FilterBar } from "@/components/admin/filter-bar";
import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { apiClient } from "@/lib/api-client";
import type { UserManagementStats } from "@/types/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiUserRole {
    id?: number | string;
    name: string;
    description?: string;
    permissions?: unknown[];
}

interface ApiUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    accessState: string;
    roles: (string | ApiUserRole)[];
    createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoleName(role: string | ApiUserRole | undefined): string {
    if (!role) return "STUDENT";
    if (typeof role === "string") return role;
    return role.name ?? "STUDENT";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const statusColors: Record<string, { bg: string; text: string }> = {
    Active:    { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
    Inactive:  { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
    Suspended: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
    Pending:   { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
    ACTIVE:    { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
    BLOCKED:   { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
    SUSPENDED: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const statusFilters = [
    { label: "All",       value: "all" },
    { label: "Active",    value: "ACTIVE" },
    { label: "Blocked",   value: "BLOCKED" },
    { label: "Suspended", value: "SUSPENDED" },
];

const roleColors: Record<string, { bg: string; text: string }> = {
    ADMIN:               { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
    IT_OPERATIONS:       { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
    DEPUTY_DIRECTOR:     { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
    ACADEMIC_DEPARTMENT: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
    FINANCE:             { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
    AQAD:                { bg: "bg-[#ecfeff]", text: "text-[#0e7490]" },
    RESOURCE_DEPARTMENT: { bg: "bg-[#fefce8]", text: "text-[#a16207]" },
    TEACHER:             { bg: "bg-[#f0f9ff]", text: "text-[#0369a1]" },
    STUDENT:             { bg: "bg-[#f8fafc]", text: "text-[#334155]" },
    APPLICANT:           { bg: "bg-[#fafaf9]", text: "text-[#44403c]" },
};

const roleOptions = [
    { label: "All Roles",   value: "all" },
    { label: "Admin",       value: "ADMIN" },
    { label: "IT Ops",      value: "IT_OPERATIONS" },
    { label: "Deputy",      value: "DEPUTY_DIRECTOR" },
    { label: "Academic",    value: "ACADEMIC_DEPARTMENT" },
    { label: "Finance",     value: "FINANCE" },
    { label: "AQAD",        value: "AQAD" },
    { label: "Resource",    value: "RESOURCE_DEPARTMENT" },
    { label: "Teacher",     value: "TEACHER" },
    { label: "Student",     value: "STUDENT" },
    { label: "Applicant",   value: "APPLICANT" },
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
    const [users, setUsers]                   = useState<ApiUser[]>([]);
    const [loading, setLoading]               = useState(true);
    const [error, setError]                   = useState<string | null>(null);
    const [statusFilter, setStatusFilter]     = useState("all");
    const [roleFilter, setRoleFilter]         = useState("all");
    const [search, setSearch]                 = useState("");
    const [actionLoading, setActionLoading]   = useState<number | null>(null);

    // ── Fetch ──
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.get<unknown>("/api/admin/users");

            let usersArray: ApiUser[] = [];

            if (Array.isArray(data)) {
                usersArray = data as ApiUser[];
            } else if (data && typeof data === "object") {
                const obj = data as Record<string, unknown>;
                if (Array.isArray(obj.content)) {
                    usersArray = obj.content as ApiUser[];
                } else if (Array.isArray(obj.users)) {
                    usersArray = obj.users as ApiUser[];
                } else if (Array.isArray(obj.data)) {
                    usersArray = obj.data as ApiUser[];
                }
            }

            setUsers(usersArray);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Actions ──
    const handleRoleChange = async (userId: number, role: string) => {
        setActionLoading(userId);
        try {
            await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
            setUsers((prev) =>
                prev.map((u) => u.id === userId ? { ...u, roles: [role] } : u)
            );
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to update role");
        } finally {
            setActionLoading(null);
        }
    };

    const handleAccessStateChange = async (userId: number, state: string) => {
        setActionLoading(userId);
        try {
            await apiClient.patch(`/api/admin/users/${userId}/access-state`, { accessState: state });
            setUsers((prev) =>
                prev.map((u) => u.id === userId ? { ...u, accessState: state } : u)
            );
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to update access state");
        } finally {
            setActionLoading(null);
        }
    };

    const handleTerminateSessions = async (userId: number) => {
        setActionLoading(userId);
        try {
            await apiClient.post(`/api/admin/users/${userId}/terminate-sessions`);
            alert("Sessions terminated successfully");
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to terminate sessions");
        } finally {
            setActionLoading(null);
        }
    };

    // ── Filtering ──
    const filtered = users.filter((u) => {
        const matchStatus = statusFilter === "all" || u.accessState === statusFilter;
        const matchRole   = roleFilter === "all" ||
            u.roles.map(getRoleName).includes(roleFilter);
        const fullName    = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
        const matchSearch = search === "" ||
            fullName.includes(search.toLowerCase()) ||
            (u.email ?? "").toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchRole && matchSearch;
    });

    // ── Stats ──
    const stats: UserManagementStats = {
        totalUsers:        users.length,
        activeUsers:       users.filter((u) => u.accessState === "ACTIVE").length,
        suspendedUsers:    users.filter((u) =>
            u.accessState === "SUSPENDED" || u.accessState === "BLOCKED"
        ).length,
        pendingUsers:      users.filter((u) => u.status === "PENDING").length,
        newUsersThisMonth: users.filter((u) => {
            if (!u.createdAt) return false;
            const d = new Date(u.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear();
        }).length,
        twoFactorAdoption: 0,
    };

    // ── Sidebar ──
    const usersByRole = roleOptions
        .filter((r) => r.value !== "all")
        .map((r) => ({
            role: r.label,
            count: users.filter((u) =>
                u.roles.map(getRoleName).includes(r.value)
            ).length,
        }))
        .filter((r) => r.count > 0)
        .sort((a, b) => b.count - a.count);

    const maxRoleCount = Math.max(...usersByRole.map((r) => r.count), 1);

    const recentRegistrations = [...users]
        .sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    // ── Error state ──
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm text-red-500">{error}</p>
                <button
                    onClick={fetchUsers}
                    className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="User Management"
                description="Manage platform users, roles, and account status"
            />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <StatCard
                    label="Total Users"
                    value={loading ? "—" : String(stats.totalUsers)}
                    icon={Users}
                />
                <StatCard
                    label="Active"
                    value={loading ? "—" : String(stats.activeUsers)}
                    icon={UserCheck}
                    accent="success"
                />
                <StatCard
                    label="Suspended"
                    value={loading ? "—" : String(stats.suspendedUsers)}
                    icon={Ban}
                    accent={!loading && stats.suspendedUsers > 0 ? "danger" : "default"}
                />
                <StatCard
                    label="Pending"
                    value={loading ? "—" : String(stats.pendingUsers)}
                    icon={Clock}
                    accent="warning"
                />
                <StatCard
                    label="New This Month"
                    value={loading ? "—" : String(stats.newUsersThisMonth)}
                    icon={UserPlus}
                    accent="info"
                />
                <StatCard
                    label="2FA Adoption"
                    value="—"
                    icon={ShieldCheck}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Table — 2/3 */}
                <div className="lg:col-span-2">
                    <SectionCard>
                        <div className="mb-4">
                            <FilterBar
                                filters={statusFilters}
                                activeFilter={statusFilter}
                                onFilterChange={setStatusFilter}
                                searchValue={search}
                                onSearchChange={setSearch}
                                placeholder="Search by name or email..."
                                className="mb-0"
                            />
                        </div>

                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-secondary-foreground">
                                    Role:
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                >
                                    {roleOptions.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-sm text-secondary-foreground">
                {loading
                    ? "Loading..."
                    : `${filtered.length} user${filtered.length !== 1 ? "s" : ""}`
                }
              </span>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-10 animate-pulse rounded-md bg-secondary" />
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[750px] text-sm">
                                    <thead>
                                    <tr className="border-b border-border text-left text-secondary-foreground">
                                        <th className="pb-2 font-medium">Name</th>
                                        <th className="pb-2 font-medium">Role</th>
                                        <th className="pb-2 font-medium">Access State</th>
                                        <th className="pb-2 font-medium">Created</th>
                                        <th className="pb-2 text-center font-medium">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                    {filtered.map((user) => {
                                        const roleName    = getRoleName(user.roles[0]);
                                        const rc          = roleColors[roleName] ?? roleColors.STUDENT;
                                        const sc          = statusColors[user.accessState] ?? statusColors.ACTIVE;
                                        const isActioning = actionLoading === user.id;

                                        return (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-secondary/40 transition-colors"
                                            >
                                                <td className="py-2.5">
                                                    <p className="font-medium">
                                                        {user.firstName ?? ""} {user.lastName ?? ""}
                                                    </p>
                                                    <p className="text-xs text-secondary-foreground">
                                                        {user.email ?? ""}
                                                    </p>
                                                </td>

                                                <td className="py-2.5">
                                                    <select
                                                        value={roleName}
                                                        disabled={isActioning}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer ${rc.bg} ${rc.text}`}
                                                    >
                                                        {roleOptions
                                                            .filter((r) => r.value !== "all")
                                                            .map((r) => (
                                                                <option key={r.value} value={r.value}>
                                                                    {r.label}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </td>

                                                <td className="py-2.5">
                                                    <select
                                                        value={user.accessState ?? "ACTIVE"}
                                                        disabled={isActioning}
                                                        onChange={(e) =>
                                                            handleAccessStateChange(user.id, e.target.value)
                                                        }
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer ${sc.bg} ${sc.text}`}
                                                    >
                                                        <option value="ACTIVE">Active</option>
                                                        <option value="BLOCKED">Blocked</option>
                                                        <option value="SUSPENDED">Suspended</option>
                                                    </select>
                                                </td>

                                                <td className="py-2.5 text-secondary-foreground">
                                                    {user.createdAt ? formatDate(user.createdAt) : "—"}
                                                </td>

                                                <td className="py-2.5 text-center">
                                                    <button
                                                        onClick={() => handleTerminateSessions(user.id)}
                                                        disabled={isActioning}
                                                        title="Terminate all sessions"
                                                        className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-2 py-1 text-xs text-[#991b1b] hover:bg-[#fee2e2] disabled:opacity-50 transition-colors"
                                                    >
                                                        {isActioning ? "..." : "Kick"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>

                                {filtered.length === 0 && (
                                    <p className="py-8 text-center text-sm text-secondary-foreground">
                                        No users match the selected filters.
                                    </p>
                                )}
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* Sidebar — 1/3 */}
                <div className="space-y-6">
                    <SectionCard title="Users by Role">
                        {loading ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-6 animate-pulse rounded bg-secondary" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {usersByRole.map((r) => (
                                    <div key={r.role}>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span>{r.role}</span>
                                            <span className="font-medium">{r.count}</span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full rounded-full bg-foreground"
                                                style={{ width: `${(r.count / maxRoleCount) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {usersByRole.length === 0 && (
                                    <p className="text-sm text-secondary-foreground">No data</p>
                                )}
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Recent Registrations">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-10 animate-pulse rounded bg-secondary" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentRegistrations.map((u) => {
                                    const roleName = getRoleName(u.roles[0]);
                                    const rc = roleColors[roleName] ?? roleColors.STUDENT;
                                    const initials =
                                        `${(u.firstName ?? "?")[0]}${(u.lastName ?? "?")[0]}`.toUpperCase();

                                    return (
                                        <div key={u.id} className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {u.firstName ?? ""} {u.lastName ?? ""}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                          <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${rc.bg} ${rc.text}`}>
                            {roleName}
                          </span>
                                                    <span className="text-xs text-secondary-foreground">
                            {u.createdAt ? formatDate(u.createdAt) : "—"}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {recentRegistrations.length === 0 && (
                                    <p className="text-sm text-secondary-foreground">No data</p>
                                )}
                            </div>
                        )}
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}