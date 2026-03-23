"use client";

import { cn } from "@/lib/utils";
import { Camera, Check, Loader2, Mic, Wifi, X } from "lucide-react";
import { useEffect, useState } from "react";

type CheckState = "checking" | "pass" | "fail";

type DeviceChecks = {
  camera: CheckState;
  microphone: CheckState;
  internet: CheckState;
};

export function DeviceCheck({
  onAllPassed,
  className,
}: {
  onAllPassed?: (passed: boolean) => void;
  className?: string;
}) {
  const [checks, setChecks] = useState<DeviceChecks>({
    camera: "checking",
    microphone: "checking",
    internet: "checking",
  });

  useEffect(() => {
    // Simulate device checks with timeouts
    const timers: NodeJS.Timeout[] = [];

    // Internet check
    timers.push(
      setTimeout(() => {
        setChecks((prev) => ({
          ...prev,
          internet: navigator.onLine ? "pass" : "fail",
        }));
      }, 800),
    );

    // Camera check (simulated)
    timers.push(
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, camera: "pass" }));
      }, 1500),
    );

    // Microphone check (simulated)
    timers.push(
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, microphone: "pass" }));
      }, 2000),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const allDone = Object.values(checks).every((v) => v !== "checking");
    if (allDone) {
      const allPassed = Object.values(checks).every((v) => v === "pass");
      onAllPassed?.(allPassed);
    }
  }, [checks, onAllPassed]);

  const items: { key: keyof DeviceChecks; label: string; icon: React.ElementType }[] = [
    { key: "camera", label: "Webcam", icon: Camera },
    { key: "microphone", label: "Microphone", icon: Mic },
    { key: "internet", label: "Internet Connection", icon: Wifi },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {items.map(({ key, label, icon: Icon }) => {
        const state = checks[key];
        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-4"
          >
            <Icon className="h-5 w-5 text-secondary-foreground" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            {state === "checking" && (
              <Loader2 className="h-4 w-4 animate-spin text-secondary-foreground" />
            )}
            {state === "pass" && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            )}
            {state === "fail" && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                <X className="h-3.5 w-3.5 text-red-600" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
