import { useMemo, useState } from "react";

export interface FilterOption {
  label: string;
  value: Record<string, any>;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { label: "ทั้งหมด", value: {} },
  { label: "ตั้งครรภ์", value: { is_available: false } },
  { label: "พร้อมผสม", value: { is_available: true } },
  { label: "ยังอยู่", value: { is_active: true } },
  { label: "ไม่อยู่", value: { is_active: false } },
];

export function useSowFilters(sows: any[]) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS[0]);

  const filteredSows = useMemo(() => {
    return sows
      .filter((sow) => 
        sow.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((sow) => {
        return Object.entries(filter.value).every(
          ([key, value]) => sow[key] === value
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [sows, search, filter]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    filteredSows,
  };
}