import { Skeleton } from "@/components/ui/skeleton";

export function LoadingListSkeleton() {
  return (
    <>
      {/* TopBar Skeleton */}
      <div className="grid grid-cols-3 w-full items-center mb-4">
        <div className="flex"></div>
        <div className="flex justify-center">
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="space-y-6 mb-20">
        {/* SowStats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Skeleton className="h-[140px] rounded-xl" />
          <Skeleton className="h-[140px] rounded-xl" />
        </div>

        {/* SowFilters Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* SowList Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* FAB Skeleton */}
      <Skeleton className="h-14 w-14 rounded-full fixed bottom-24 right-4" />
    </>
  );
}

export function LoadingPageSkeleton() {
  return (
    <>
      {/* TopBar Skeleton with Back Button */}
      <div className="grid grid-cols-3 w-full items-center mb-4">
        <div className="flex">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="space-y-8">
        {/* SowHeader Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* SowDetailsCard Skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        {/* SowHistorySection Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-4 border-b">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
