import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-[color,box-shadow] placeholder:text-secondary-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
