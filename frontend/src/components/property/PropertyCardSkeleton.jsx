import Skeleton from "../ui/Skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-4 border-t border-slate-100 pt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
