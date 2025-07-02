import { useMemo } from "react";

export function useLitterFilters(litters: any[], search: string) {
  return useMemo(() => {
    return filterAndSortLitters(litters, search);
  }, [litters, search]);
}

function filterAndSortLitters(litters: any[], search: string) {
  let filtered = litters;

  if (search) {
    filtered = filterLittersBySearch(litters, search);
  }

  return sortLittersByBirthDate(filtered);
}

function filterLittersBySearch(litters: any[], search: string) {
  const searchLower = search.toLowerCase();
  
  return litters.filter((litter) => {
    const sowName = litter.sow?.name?.toLowerCase() || "";
    const boarBreed = litter.boars?.breed?.toLowerCase() || "";

    return sowName.includes(searchLower) || boarBreed.includes(searchLower);
  });
}

function sortLittersByBirthDate(litters: any[]) {
  return litters.sort((a, b) => {
    const dateA = new Date(a.birth_date!).getTime();
    const dateB = new Date(b.birth_date!).getTime();
    return dateB - dateA; // Newest first
  });
}