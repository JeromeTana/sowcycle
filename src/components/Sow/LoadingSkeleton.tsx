import { Skeleton } from "@/components/ui/skeleton";

export function LoadingListSkeleton() {
  return (
    <>
      {/* TopBar Skeleton */}
      <div className="grid items-center w-full grid-cols-3 mb-4 p-4">
        <div className="flex"></div>
        <div className="flex justify-center">
          <Skeleton className="w-24 h-7" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="space-y-6 p-4 pt-0 md:pb-8 md:p-8">
        {/* SowStats Skeleton */}
        {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Skeleton className="h-[140px] rounded-xl" />
          <Skeleton className="h-[140px] rounded-xl" />
        </div> */}

        {/* SowFilters Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>

        {/* SowList Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-48 rounded-xl" />
          ))}
        </div>
      </div>

      {/* FAB Skeleton */}
      <Skeleton className="fixed rounded-full h-14 w-14 bottom-24 right-4" />
    </>
  );
}

export function LoadingPageSkeleton() {
  return (
    <>
      {/* TopBar Skeleton with Back Button */}
      <div className="grid items-center w-full grid-cols-3 mb-4 p-4">
        <div className="flex">
          <Skeleton className="rounded-full h-9 w-9" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-24 h-7" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
      <div className="min-h-screen p-4 pt-0 md:pb-8 md:p-8">
        <div className="space-y-8">
          {/* SowHeader Skeleton */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="w-48 h-8" />
              <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-32 h-10 rounded-full" />
          </div>

          {/* SowDetailsCard Skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
            <Skeleton className="w-full h-64 rounded-xl" />
          </div>

          {/* SowHistorySection Skeleton */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b">
              <Skeleton className="w-32 h-10" />
              <Skeleton className="w-32 h-10" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-24 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
