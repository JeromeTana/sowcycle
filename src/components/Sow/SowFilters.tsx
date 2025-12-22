import DialogComponent from "@/components/DrawerDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ListFilter, Search } from "lucide-react";
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
        className="bg-white rounded-full"
      />
      <DialogComponent
        title="กรองแม่พันธุ์"
        dialogTriggerButton={
          <Button
            variant="outline"
            size="icon"
            className={cn(
              isFilterActive && "border border-primary !text-primary bg-primary/10",
              "p-6"
            )}
          >
            <ListFilter />
          </Button>
        }
      >
        <FilterOptionsList filter={filter} onSelect={setFilter} />
      </DialogComponent>
    </div>
  );
}

type FilterOptionsListProps = {
  filter: FilterOption;
  onSelect: (value: FilterOption) => void;
  setDialog?: (open: boolean) => void;
};

function FilterOptionsList({
  filter,
  onSelect,
  setDialog,
}: FilterOptionsListProps) {
  const handleSelect = (option: FilterOption) => {
    onSelect(option);
    setDialog?.(false);
  };

  return (
    <div className="space-y-2">
      {FILTER_OPTIONS.map((option) => {
        const isSelected =
          JSON.stringify(option.value) === JSON.stringify(filter.value);

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => handleSelect(option)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200",
              isSelected
                ? "border-primary bg-pink-50 text-pink-600"
                : "border-gray-200 bg-white text-gray-700"
            )}
          >
            <span>{option.label}</span>
            {isSelected && <Check size={18} />}
          </button>
        );
      })}
    </div>
  );
}
