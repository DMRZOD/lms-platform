"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { roleConfigs } from "@/config/roles";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const roleSlug = pathname.split("/")[1];
  const roleConfig = roleConfigs[roleSlug];

  if (!roleConfig) return null;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 mb-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Unified Online University"
            width={476}
            height={130}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <button
          onClick={onClose}
          className="text-secondary-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role label */}
      <div className="px-6 pb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-secondary-foreground">
          {roleConfig.label}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3">
        {roleConfig.navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-secondary-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4">
        <div className="rounded-lg bg-secondary p-4 text-center">
          <p className="text-xs font-medium text-secondary-foreground">
            Unified Online University
          </p>
          <p className="mt-1 text-[10px] text-secondary-foreground/60">
            © 2026
          </p>
        </div>
      </div>
    </aside>
  );
}
