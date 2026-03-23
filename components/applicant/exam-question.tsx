"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ExamQuestion as ExamQuestionType } from "@/types/applicant";

export function ExamQuestion({
  question,
  index,
  selectedOptionId,
  onSelect,
  className,
}: {
  question: ExamQuestionType;
  index: number;
  selectedOptionId?: string;
  onSelect: (questionId: string, optionId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm font-medium">
        <span className="text-secondary-foreground">Question {index + 1}. </span>
        {question.text}
      </p>
      <RadioGroup
        value={selectedOptionId ?? ""}
        onValueChange={(val) => onSelect(question.id, val)}
        className="space-y-2"
      >
        {question.options.map((opt) => (
          <div
            key={opt.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors",
              selectedOptionId === opt.id && "border-foreground bg-secondary",
            )}
          >
            <RadioGroupItem value={opt.id} id={opt.id} />
            <Label htmlFor={opt.id} className="flex-1 cursor-pointer text-sm">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
