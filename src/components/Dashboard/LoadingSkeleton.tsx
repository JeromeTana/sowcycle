import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
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

      <div className="space-y-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Large Cards with Graph */}
          <Skeleton className="h-[140px] rounded-xl col-span-2" />
          <Skeleton className="h-[140px] rounded-xl col-span-2" />

          {/* Small Cards */}
          <Skeleton className="h-[140px] rounded-xl" />
          <Skeleton className="h-[140px] rounded-xl" />
        </div>

        {/* Upcoming Events Section */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
