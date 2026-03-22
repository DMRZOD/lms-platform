"use client";

import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PlatformHeaderProps = {
  onMenuClick: () => void;
};

export function PlatformHeader({ onMenuClick }: PlatformHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background px-6 py-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground">
          <span className="text-sm font-medium text-background">U</span>
        </div>
      </div>
    </header>
  );
}
