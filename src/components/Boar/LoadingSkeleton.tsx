import { Skeleton } from "@/components/ui/skeleton";

export function BoarLoadingSkeleton() {
  return (
    <>
      {/* TopBar Skeleton */}
      <div className="grid items-center w-full grid-cols-3 mb-4">
        <div className="flex"></div>
        <div className="flex justify-center">
          <Skeleton className="w-24 h-7" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="space-y-4 p-4 pt-0 md:pb-8 md:p-8">
        {/* Search and Filter Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>

        {/* BoarList Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-xl" />
          ))}
        </div>
      </div>

      {/* FAB Skeleton */}
      <Skeleton className="fixed rounded-full h-14 w-14 bottom-24 right-4" />
    </>
  );
}
