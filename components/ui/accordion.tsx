"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-[box-shadow,ring] duration-300 hover:shadow-md data-[state=open]:shadow-md data-[state=open]:ring-1 data-[state=open]:ring-foreground/6",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="m-0 flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex flex-1 cursor-pointer items-center gap-4 px-5 py-5 text-left outline-none transition-colors hover:bg-secondary/50",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 flex-1 text-base font-semibold leading-snug text-foreground">
          {children}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-transform duration-300 ease-out group-data-[state=open]/trigger:rotate-180">
          <ChevronDown className="size-4 opacity-70" strokeWidth={2} />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-primary-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      <div className="px-5 pb-5 pt-0 text-sm leading-relaxed">{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
