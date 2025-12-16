"use client";

import { Dna, Milk } from "lucide-react";
import { useBoarStore } from "@/stores/useBoarStore";
import { cn } from "@/lib/utils";

interface BreedTagsProps {
  breedIds?: number[];
  breastsCount?: number;
  className?: string;
}

export function SowTags({ breedIds, breastsCount, className }: BreedTagsProps) {
  const { boars } = useBoarStore();

  const hasBreeds = breedIds && breedIds.length > 0;
  const hasBreasts = breastsCount !== undefined && breastsCount > 0;

  if (!hasBreeds && !hasBreasts) return null;

  return (
    <>
      {hasBreasts && (
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 text-xs font-medium bg-white rounded-full text-muted-foreground",
            className
          )}
        >
          <Milk size={14} />
          <span>{`${breastsCount} เต้า`}</span>
        </div>
      )}
      {hasBreeds &&
        breedIds!.map((breedId) => {
          const boar = boars.find((b) => b.id === breedId);
          const breedName = boar ? boar.breed : breedId;

          return (
            <div
              key={breedId}
              className={cn(
                "flex items-center gap-2 px-2 py-1 text-xs font-medium bg-white rounded-full text-muted-foreground",
                className
              )}
            >
              <Dna size={16} />
              <span>{breedName}</span>
            </div>
          );
        })}
    </>
  );
}
