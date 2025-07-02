import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, Search } from "lucide-react";
import { FilterOption, FILTER_OPTIONS } from "@/hooks/useSowFilters";

interface SowFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filter: FilterOption;
  setFilter: (value: FilterOption) => void;
}

export function SowFilters({
  search,
  setSearch,
  filter,
  setFilter,
}: SowFiltersProps) {
  const isFilterActive =
    JSON.stringify(filter.value) !== JSON.stringify(FILTER_OPTIONS[0].value);

  return (
    <div className="flex gap-2">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        startIcon={Search}
        placeholder="ค้นหาด้วยชื่อแม่พันธุ์"
        className="bg-white"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              isFilterActive && "bg-pink-500 hover:bg-pink-600 !text-white"
            )}
          >
            <Filter /> {filter.label} <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {FILTER_OPTIONS.map((option, index) => {
            const isSelected =
              JSON.stringify(option.value) === JSON.stringify(filter.value);
            return (
              <DropdownMenuItem
                key={index}
                onSelect={() => setFilter(option)}
                className={cn(
                  isSelected
                    ? "bg-black text-white hover:!bg-black hover:!text-white"
                    : "bg-white text-black"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}