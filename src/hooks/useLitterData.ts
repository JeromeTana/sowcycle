import { useEffect, useState, useMemo } from "react";
import { useLitterStore } from "@/stores/useLitterStore";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllLitters } from "@/services/litter";
import { getAllSows } from "@/services/sow";
import { getAllBoars } from "@/services/boar";
import { Sow } from "@/types/sow";

export function useLitterData() {
  const { litters, setLitters } = useLitterStore();
  const { boars: breeds, setBoars: setBreeds } = useBoarStore();
  const [sows, setSows] = useState<Sow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const littersWithSow = useMemo(() => {
    return combineLittersWithSows(litters, sows);
  }, [litters, sows]);

  const littersWithBreeds = useMemo(() => {
    return addBreedNamesToLitters(littersWithSow, breeds);
  }, [littersWithSow, breeds]);

  useEffect(() => {
    fetchLitterData();
  }, [setLitters, setBreeds, breeds.length]);

  async function fetchLitterData() {
    try {
      setIsLoading(true);
      setError(null);
      
      const [littersData, sowsData] = await Promise.all([
        getAllLitters(),
        getAllSows(),
      ]);

      if (!breeds.length) {
        const breedsData = await getAllBoars();
        setBreeds(breedsData);
      }

      setLitters(littersData);
      setSows(sowsData);
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

function combineLittersWithSows(litters: any[], sows: Sow[]) {
  return litters.map((litter) => {
    const sow = sows.find((sow) => sow.id === litter.sow_id);
    return { ...litter, sow };
  });
}

function addBreedNamesToLitters(littersWithSow: any[], breeds: any[]) {
  return littersWithSow.map((litter) => {
    const sowBreedNames = getSowBreedNames(litter.sow, breeds);
    return { 
      ...litter, 
      sow: { 
        ...litter.sow, 
        breeds: sowBreedNames 
      } 
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