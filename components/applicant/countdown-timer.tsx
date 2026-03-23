"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function CountdownTimer({
  durationMinutes,
  onTimeUp,
  className,
}: {
  durationMinutes: number;
  onTimeUp?: () => void;
  className?: string;
}) {
  const endTimeRef = useRef<number>(0);
  const [remaining, setRemaining] = useState(durationMinutes * 60);

  useEffect(() => {
    endTimeRef.current = Date.now() + durationMinutes * 60 * 1000;

    const id = setInterval(() => {
      const diff = Math.max(
        0,
        Math.round((endTimeRef.current - Date.now()) / 1000),
      );
      setRemaining(diff);
      if (diff <= 0) {
        clearInterval(id);
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMinutes]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isLow = remaining <= 300; // 5 minutes

  return (
    <div
      className={cn(
        "tabular-nums text-lg font-semibold",
        isLow ? "text-red-600" : "text-foreground",
        className,
      )}
    >
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
