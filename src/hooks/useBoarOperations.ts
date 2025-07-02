import { useEffect, useState } from "react";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllBoars } from "@/services/boar";

interface UseBoarOperationsOptions {
  autoFetch?: boolean;
}

export function useBoarOperations(options: UseBoarOperationsOptions = {}) {
  const { autoFetch = true } = options;
  const { boars, setBoars } = useBoarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoars = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const boarsData = await getAllBoars();
      if (boarsData) {
        setBoars(boarsData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch boars";
      setError(errorMessage);
      console.error("Failed to fetch boars:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && boars.length === 0) {
      fetchBoars();
    }
  }, [autoFetch, boars.length]);

  return { 
    boars, 
    isLoading, 
    error, 
    refetch: fetchBoars 
  };
}