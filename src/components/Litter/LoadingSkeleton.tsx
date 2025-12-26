import { Skeleton } from "@/components/ui/skeleton";

export function LitterLoadingSkeleton() {
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

      <div className="min-h-screen p-4 pt-0 md:pb-8 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* LitterStats Skeleton */}
          {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
          </div> */}

          {/* FilterControls Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="w-full h-12 rounded-full" />
            <Skeleton className="h-12 aspect-square rounded-full" />
          </div>

          {/* LittersList Skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
