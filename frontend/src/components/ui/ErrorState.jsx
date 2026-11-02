import { AlertTriangle } from "lucide-react";

export default function ErrorState({ message = "Something went wrong while loading this.", onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-6 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-error" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
