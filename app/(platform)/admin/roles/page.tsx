"use client";

import { Check, Key, Lock, ShieldCheck, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RbacPermission {
    id?: string | number;
    name: string;
    description?: string;
}

interface RbacRole {
    id?: string | number;
    name: string;
    description?: string;
    permissions: RbacPermission[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const roleColors: Record<string, { bg: string; text: string }> = {
    ADMIN:               { bg: "bg-[#fdf2f8]",  text: "text-[#9d174d]"  },
    IT_OPERATIONS:       { bg: "bg-[#eff6ff]",  text: "text-[#1d4ed8]"  },
    DEPUTY_DIRECTOR:     { bg: "bg-[#f5f3ff]",  text: "text-[#6d28d9]"  },
    ACADEMIC_DEPARTMENT: { bg: "bg-[#fff7ed]",  text: "text-[#c2410c]"  },
    FINANCE:             { bg: "bg-[#f0fdf4]",  text: "text-[#15803d]"  },
    AQAD:                { bg: "bg-[#ecfeff]",  text: "text-[#0e7490]"  },
    RESOURCE_DEPARTMENT: { bg: "bg-[#fefce8]",  text: "text-[#a16207]"  },
    TEACHER:             { bg: "bg-[#f0f9ff]",  text: "text-[#0369a1]"  },
    STUDENT:             { bg: "bg-[#f8fafc]",  text: "text-[#334155]"  },
    APPLICANT:           { bg: "bg-[#fafaf9]",  text: "text-[#44403c]"  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizePermission(p: unknown): RbacPermission {
    if (typeof p === "string") return { name: p };
    if (typeof p === "number") return { name: String(p) };
    const obj = p as Record<string, unknown>;
    return {
        id:          obj.id as string | number | undefined,
        name:        (obj.name ?? obj.id ?? "") as string,
        description: obj.description as string | undefined,
    };
}

function normalizeRole(r: unknown): RbacRole {
    if (typeof r === "string") return { name: r, permissions: [] };
    const obj = r as Record<string, unknown>;
    const perms = Array.isArray(obj.permissions)
        ? obj.permissions.map(normalizePermission)
        : [];
    return {
        id:          obj.id as string | number | undefined,
        name:        (obj.name ?? "") as string,
        description: obj.description as string | undefined,
        permissions: perms,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminRolesPage() {
    // ─── State ────────────────────────────────────────────────────────────────────
    const [roles, setRoles]               = useState<RbacRole[]>([]);
    const [totalPermissions, setTotalPermissions] = useState<number>(0);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

// ─── Fetch ────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const [rolesData, permsData] = await Promise.all([
                    apiClient.get<unknown>("/api/admin/rbac/roles"),
                    apiClient.get<unknown>("/api/admin/rbac/permissions"),
                ]);

                // Roles
                const arr = Array.isArray(rolesData) ? rolesData : [];
                setRoles(arr.map(normalizeRole));

                // Total permissions count from /api/admin/rbac/permissions
                if (Array.isArray(permsData)) {
                    setTotalPermissions(permsData.length);
                } else if (permsData && typeof permsData === "object") {
                    const obj = permsData as Record<string, unknown>;
                    // Paginated response
                    if (typeof obj.totalElements === "number") {
                        setTotalPermissions(obj.totalElements);
                    } else if (Array.isArray(obj.content)) {
                        setTotalPermissions(obj.content.length);
                    }
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load roles");
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

    // const totalPermissions = roles.reduce((acc, r) => acc + r.permissions.length, 0);

    return (
        <div>
            <PageHeader
                title="Roles & Permissions"
                description="Manage role definitions, access levels, and permission matrices"
            />

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3">
                <StatCard
                    label="Total Roles"
                    value={loading ? "—" : roles.length}
                    icon={ShieldCheck}
                />
                <StatCard
                    label="Total Permission Entries"
                    value={loading ? "—" : totalPermissions}
                    icon={Key}
                    accent="info"
                />
                <StatCard
                    label="Roles Loaded"
                    value={loading ? "—" : roles.length}
                    icon={Users}
                    accent="success"
                />
                {/*<StatCard*/}
                {/*    label="Avg Permissions"*/}
                {/*    value={loading ? "—" : roles.length > 0*/}
                {/*        ? Math.round(totalPermissions / roles.length)*/}
                {/*        : 0*/}
                {/*    }*/}
                {/*    icon={Lock}*/}
                {/*/>*/}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
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
                                const rc = roleColors[role.name] ?? {
                                    bg: "bg-secondary",
                                    text: "text-foreground",
                                };

                                return (
                                    <AccordionItem key={role.name} value={role.name}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex flex-1 items-center gap-3 pr-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rc.bg} ${rc.text}`}>
                          {role.name}
                        </span>
                                                {role.description && (
                                                    <span className="text-sm text-secondary-foreground">
                            {role.description}
                          </span>
                                                )}
                                                <div className="ml-auto">
                          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-secondary-foreground">
                            {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                          </span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <div className="pt-2 pb-1">
                                                {role.permissions.length === 0 ? (
                                                    <p className="py-4 text-center text-sm text-secondary-foreground">
                                                        No permissions assigned to this role.
                                                    </p>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                            <tr className="border-b border-border text-left text-secondary-foreground">
                                                                <th className="pb-2 font-medium">Permission</th>
                                                                <th className="pb-2 font-medium">Description</th>
                                                                <th className="pb-2 text-center font-medium">Granted</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-border">
                                                            {role.permissions.map((perm) => (
                                                                <tr
                                                                    key={perm.name}
                                                                    className="hover:bg-secondary/30 transition-colors"
                                                                >
                                                                    <td className="py-2">
                                                                        <p className="font-mono text-xs font-medium">
                                                                            {perm.name}
                                                                        </p>
                                                                    </td>
                                                                    <td className="py-2 text-xs text-secondary-foreground">
                                                                        {perm.description && perm.description !== perm.name
                                                                            ? perm.description
                                                                            : "—"
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 text-center">
                                                                        <Check className="mx-auto h-4 w-4 text-[#16a34a]" />
                                                                    </td>
                                                                </tr>
                                                            ))}
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