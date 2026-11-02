import { Check } from "lucide-react";

export default function StepIndicator({ steps, currentStep }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isComplete
                  ? "bg-primary text-white"
                  : isCurrent
                    ? "border-2 border-primary text-primary"
                    : "border border-slate-300 text-slate-400"
              }`}
            >
              {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
            </span>
            <span className={`text-xs font-medium ${isCurrent ? "text-slate-900" : "text-slate-500"}`}>
              {label}
            </span>
            {stepNumber !== steps.length && <span className="hidden h-px w-4 bg-slate-200 sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
