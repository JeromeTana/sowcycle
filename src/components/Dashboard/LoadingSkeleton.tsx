import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
  return (
    <>
      {/* TopBar Skeleton */}
      <div className="grid grid-cols-3 w-full items-center mb-4 p-4">
        <div className="flex"></div>
        <div className="flex justify-center">
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="space-y-8 p-4 pt-0 md:pb-8 md:p-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Large Cards with Graph */}
          <Skeleton className="h-[140px] rounded-2xl col-span-2" />
          <Skeleton className="h-[140px] rounded-2xl col-span-2" />

          {/* Small Cards */}
          <Skeleton className="h-[140px] rounded-2xl" />
          <Skeleton className="h-[140px] rounded-2xl" />
        </div>

        {/* Upcoming Events Section */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </>
  );
}
