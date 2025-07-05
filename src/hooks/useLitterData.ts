import { useEffect, useState, useMemo } from "react";
import { useLitterStore } from "@/stores/useLitterStore";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllLitters } from "@/services/litter";
import { getAllBoars } from "@/services/boar";
import { Sow } from "@/types/sow";

export function useLitterData() {
  const { litters, setLitters } = useLitterStore();
  const { boars: breeds, setBoars: setBreeds } = useBoarStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const littersWithBreeds = useMemo(() => {
    return addBreedNamesToLitters(litters, breeds);
  }, [litters, breeds]);

  useEffect(() => {
    fetchLitterData();
  }, [setLitters, setBreeds]);

  async function fetchLitterData() {
    try {
      setIsLoading(true);
      setError(null);

      const littersData = await getAllLitters();

      if (!breeds.length) {
        const breedsData = await getAllBoars();
        setBreeds(breedsData);
      }

      setLitters(littersData);
    } catch (error) {
      console.error("Error fetching litters data:", error);
      setError("Failed to fetch litters data");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    littersWithBreeds,
    isLoading,
    error,
  };
}

function addBreedNamesToLitters(litters: any[], breeds: any[]) {
  return litters.map((litter) => {
    const sowBreedNames = getSowBreedNames(litter.sows, breeds);
    return {
      ...litter,
      sows: {
        ...litter.sows,
        breeds: sowBreedNames,
      },
    };
  });
}

function getSowBreedNames(sow: Sow | undefined, breeds: any[]): string[] {
  if (!sow?.breed_ids) return [];

  return sow.breed_ids
    .map((breedId) => {
      const breed = breeds.find((b) => b.id === breedId);
      return breed ? breed.breed : "";
    })
    .filter(Boolean);
}
