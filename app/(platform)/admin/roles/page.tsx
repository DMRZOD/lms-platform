"use client";

import {Check, Key, Lock, ShieldCheck, Users, X} from "lucide-react";
import {useEffect, useState} from "react";

import {SectionCard} from "@/components/admin/section-card";
import {StatCard} from "@/components/admin/stat-card";
import {PageHeader} from "@/components/platform/page-header";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {apiClient} from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RbacRole {
    id?: string | number;
    name: string;
    description?: string;
    permissions?: unknown[];
}

interface RbacPermission {
    id?: string | number;
    name: string;
    description?: string;
}

type RbacMatrix = Record<string, string[]>;

// ─── Constants ────────────────────────────────────────────────────────────────

const roleColors: Record<string, { bg: string; text: string }> = {
    ADMIN: {bg: "bg-[#fdf2f8]", text: "text-[#9d174d]"},
    IT_OPS: {bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]"},
    DEPUTY: {bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]"},
    ACADEMIC: {bg: "bg-[#fff7ed]", text: "text-[#c2410c]"},
    ACCOUNTANT: {bg: "bg-[#f0fdf4]", text: "text-[#15803d]"},
    AQAD: {bg: "bg-[#ecfeff]", text: "text-[#0e7490]"},
    RESOURCE: {bg: "bg-[#fefce8]", text: "text-[#a16207]"},
    TEACHER: {bg: "bg-[#f0f9ff]", text: "text-[#0369a1]"},
    STUDENT: {bg: "bg-[#f8fafc]", text: "text-[#334155]"},
    APPLICANT: {bg: "bg-[#fafaf9]", text: "text-[#44403c]"},
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminRolesPage() {
    const [roles, setRoles] = useState<RbacRole[]>([]);
    const [permissions, setPermissions] = useState<RbacPermission[]>([]);
    const [matrix, setMatrix] = useState<RbacMatrix>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const [rolesData, permsData, matrixData] = await Promise.all([
                    apiClient.get<unknown>("/api/admin/rbac/roles"),
                    apiClient.get<unknown>("/api/admin/rbac/permissions"),
                    apiClient.get<unknown>("/api/admin/rbac/matrix"),
                ]);

                const normalizeRoles = (data: unknown): RbacRole[] => {
                    const arr = Array.isArray(data) ? data : [];
                    return arr.map((r) => {
                        if (typeof r === "string") return {name: r};
                        const obj = r as Record<string, unknown>;
                        return {
                            id: obj.id as string | number | undefined,
                            name: (obj.name ?? obj.id ?? "") as string,
                            description: obj.description as string | undefined,
                            permissions: obj.permissions as unknown[] | undefined,
                        };
                    });
                };

                const normalizePerms = (data: unknown): RbacPermission[] => {
                    const arr = Array.isArray(data) ? data : [];
                    return arr.map((p) => {
                        if (typeof p === "string") return {name: p, description: undefined};
                        const obj = p as Record<string, unknown>;
                        return {
                            id: obj.id as string | number | undefined,
                            name: (obj.name ?? obj.id ?? "") as string,
                            description: obj.description as string | undefined,
                        };
                    });
                };

                const normalizeMatrix = (data: unknown): RbacMatrix => {
                    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
                    const result: RbacMatrix = {};
                    for (const [role, perms] of Object.entries(data as Record<string, unknown>)) {
                        if (Array.isArray(perms)) {
                            result[role] = perms.map((p) => {
                                if (typeof p === "string") return p;
                                const obj = p as Record<string, unknown>;
                                return (obj.name ?? obj.id ?? String(p)) as string;
                            });
                        } else {
                            result[role] = [];
                        }
                    }
                    return result;
                };

                const normalizedRoles = normalizeRoles(rolesData);
                const normalizedPerms = normalizePerms(permsData);
                const normalizedMatrix = normalizeMatrix(matrixData);

                const finalMatrix: RbacMatrix =
                    Object.keys(normalizedMatrix).length > 0
                        ? normalizedMatrix
                        : normalizedRoles.reduce<RbacMatrix>((acc, role) => {
                            if (Array.isArray(role.permissions)) {
                                acc[role.name] = role.permissions.map((p) => {
                                    if (typeof p === "string") return p;
                                    const obj = p as Record<string, unknown>;
                                    return (obj.name ?? obj.id ?? String(p)) as string;
                                });
                            } else {
                                acc[role.name] = [];
                            }
                            return acc;
                        }, {});

                setRoles(normalizedRoles);
                setPermissions(normalizedPerms);
                setMatrix(finalMatrix);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load RBAC data");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                    Retry
                </button>
            </div>
        );
    }

    const totalPermissionEntries = Object.values(matrix).reduce(
        (acc, perms) => acc + (Array.isArray(perms) ? perms.length : 0),
        0
    );

    const allPermissions: RbacPermission[] =
        permissions.length > 0
            ? permissions
            : Array.from(new Set(Object.values(matrix).flat())).map((name) => ({
                name,
                description: undefined,
            }));

    return (
        <div>
            <PageHeader
                title="Roles & Permissions"
                description="Manage role definitions, access levels, and permission matrices"
            />

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <StatCard
                    label="Total Roles"
                    value={loading ? "—" : roles.length}
                    icon={ShieldCheck}
                />
                <StatCard
                    label="Total Permissions"
                    value={loading ? "—" : allPermissions.length}
                    icon={Key}
                    accent="info"
                />
                <StatCard
                    label="Permission Entries"
                    value={loading ? "—" : totalPermissionEntries}
                    icon={Lock}
                />
                <StatCard
                    label="Roles in Matrix"
                    value={loading ? "—" : Object.keys(matrix).length}
                    icon={Users}
                    accent="success"
                />
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary"/>
                    ))}
                </div>
            ) : (
                <SectionCard title="Role Permission Matrix">
                    {roles.length === 0 ? (
                        <p className="py-8 text-center text-sm text-secondary-foreground">
                            No roles found.
                        </p>
                    ) : (
                        <Accordion type="multiple" className="w-full">
                            {roles.map((role) => {
                                const roleName = role.name;
                                const rolePerms = matrix[roleName] ?? [];
                                const rc = roleColors[roleName] ?? {
                                    bg: "bg-secondary",
                                    text: "text-foreground",
                                };

                                const displayPerms: RbacPermission[] =
                                    allPermissions.length > 0
                                        ? allPermissions
                                        : rolePerms.map((name) => ({name, description: undefined}));

                                return (
                                    <AccordionItem key={roleName} value={roleName}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex flex-1 items-center gap-3 pr-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rc.bg} ${rc.text}`}
                                                >
                                                  {roleName}
                                                </span>

                                                {role.description && (
                                                     <span className="text-sm text-secondary-foreground">
                                                        {role.description}
                                                     </span>
                                                )}
                                                <div className="ml-auto">
                                                      <span
                                                          className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-secondary-foreground">
                                                          {rolePerms.length} permission {rolePerms.length !== 1 ? "s" : ""}
                                                      </span>

                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <div className="pt-2 pb-1">
                                                {displayPerms.length === 0 ? (
                                                    <p className="text-sm text-secondary-foreground">
                                                        No permissions found.
                                                    </p>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                            <tr className="border-b border-border text-left text-secondary-foreground">
                                                                <th className="pb-2 font-medium">Permission</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-border">
                                                            {displayPerms.map((perm) => {
                                                                const hasPermission = rolePerms.includes(perm.name);
                                                                return (
                                                                    <tr
                                                                        key={perm.name}
                                                                        className="hover:bg-secondary/30 transition-colors"
                                                                    >
                                                                        <td className="py-2">
                                                                            <p className="font-mono text-xs font-medium">
                                                                                {perm.name}
                                                                            </p>
                                                                            {perm.description &&
                                                                                perm.description !== perm.name && (
                                                                                    <p className="text-xs text-secondary-foreground">
                                                                                        {perm.description}
                                                                                    </p>
                                                                                )}
                                                                        </td>
                                                                        <td className="py-2 text-center">
                                                                            {hasPermission ? (
                                                                                <Check
                                                                                    className="mx-auto h-4 w-4 text-[#16a34a]"/>
                                                                            ) : (
                                                                                <X className="mx-auto h-4 w-4 text-[#e2e8f0]"/>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </SectionCard>
            )}
        </div>
    );
}