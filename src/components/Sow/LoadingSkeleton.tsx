import { Skeleton } from "@/components/ui/skeleton";

export function LoadingListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="w-48 h-8" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-2/3 h-10" />
        <Skeleton className="w-1/3 h-10" />
      </div>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}

export function LoadingPageSkeleton() {
  return (
    <div>
      <div className="flex justify-between">
        <Skeleton className=" w-40 h-8" />
        <Skeleton className=" w-32 h-8" />
      </div>
      <Skeleton className="w-full h-32 mt-4 rounded-xl" />
      <div className="flex justify-between mt-8">
        <Skeleton className=" w-40 h-8" />
        <Skeleton className=" w-32 h-8" />
      </div>
      <Skeleton className="w-full h-80 mt-4 rounded-xl" />
      <Skeleton className="w-full h-80 mt-2 rounded-xl" />
    </div>
  );
}
