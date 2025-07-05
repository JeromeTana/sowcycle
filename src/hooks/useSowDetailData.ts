import { useEffect, useState, useMemo } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { useBreedingStore } from "@/stores/useBreedingStore";
import { useMedicalRecordStore } from "@/stores/useMedicalRecordStore";
import { useBoarStore } from "@/stores/useBoarStore";
import { getSowByIdWithAllInfo } from "@/services/sow";
import { getAllBoars } from "@/services/boar";
import { Litter } from "@/types/litter";

export function useSowDetailData(id: number | null) {
  const { sow, setSow } = useSowStore();
  const { breedings, setBreedings } = useBreedingStore();
  const { medicalRecords, setMedicalRecords } = useMedicalRecordStore();
  const { boars, setBoars } = useBoarStore();

  const [litters, setLitters] = useState<Litter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sowBreeds = useMemo(() => {
    if (!sow?.breed_ids || !boars.length) return [];
    return sow.breed_ids
      .map((breedId) => boars.find((boar) => boar.id === breedId))
      .filter(Boolean);
  }, [sow?.breed_ids, boars]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sowData = await getSowByIdWithAllInfo(id);

        if (sowData) {
          setSow(sowData);
          setBreedings(sowData.breedings);
          setMedicalRecords(sowData.medical_records);
          setLitters(sowData.litters);

          if (sowData.breed_ids?.length && !boars.length) {
            const boarsData = await getAllBoars();
            setBoars(boarsData);
          }
        }
      } catch (err) {
        console.error("Error fetching sow data:", err);
        setError("Failed to fetch sow data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, setSow, setBreedings, setMedicalRecords, setBoars, boars.length]);

  return {
    sow,
    breedings,
    litters,
    medicalRecords,
    sowBreeds,
    isLoading,
    error,
  };
}
