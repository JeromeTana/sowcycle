"use client";

import { useState, useEffect } from "react";
import { getAllBoars } from "@/services/boar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronDown, Dna, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBoarStore } from "@/stores/useBoarStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface BreedDropdownProps {
  value: number | null;
  onValueChange: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function BreedDropdown({
  value,
  onValueChange,
  disabled = false,
  placeholder = "เลือกสายพันธุ์",
}: BreedDropdownProps) {
  const { boars: breeds, setBoars: setBreeds } = useBoarStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const data = await getAllBoars();
        setBreeds(data);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลสายพันธุ์ได้");
        console.error("Error fetching breeds:", err);
      } finally {
        setLoading(false);
      }
    };

    breeds.length === 0 ? fetchBreeds() : setLoading(false);
  }, []);

  const handleValueChange = (stringValue: string) => {
    if (stringValue === "null" || stringValue === "") {
      onValueChange(null);
    } else {
      onValueChange(parseInt(stringValue, 10));
    }
  };

  if (loading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        กำลังโหลด...
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="outline"
        className="w-full justify-between text-red-500"
        disabled
      >
        {error}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Select
      value={value ? value.toString() : ""}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {breeds.length === 0 ? (
          <SelectItem value="empty" disabled>
            ไม่มีข้อมูลสายพันธุ์
          </SelectItem>
        ) : (
          breeds.map((breed) => (
            <SelectItem key={breed.id} value={breed.id.toString()}>
              {breed.breed}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

interface MultiBreedDropdownProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  disabled?: boolean;
}

export function MultiBreedDropdown({
  value,
  onValueChange,
  disabled = false,
}: MultiBreedDropdownProps) {
  const { boars: breeds, setBoars: setBreeds } = useBoarStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const data = await getAllBoars();
        setBreeds(data);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลสายพันธุ์ได้");
        console.error("Error fetching breeds:", err);
      } finally {
        setLoading(false);
      }
    };

    breeds.length === 0 ? fetchBreeds() : setLoading(false);
  }, []);

  const handleToggleBreed = (breedId: number) => {
    const newValue = value.includes(breedId)
      ? value.filter((id) => id !== breedId)
      : [...value, breedId];
    onValueChange(newValue);
  };

  const handleRemoveBreed = (breedId: number) => {
    onValueChange(value.filter((id) => id !== breedId));
  };

  const getSelectedBreedsText = () => {
    if (value.length === 0) return "เลือกสายพันธุ์";
    if (value.length === 1) {
      const breed = breeds.find((b) => b.id === value[0]);
      return breed ? `${breed.breed}` : "เลือกแล้ว 1 รายการ";
    }
    return `เลือกแล้ว ${value.length} รายการ`;
  };

  if (loading) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
        <div className="flex items-center gap-2">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              value.length === 0 && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {getSelectedBreedsText()}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-auto">
            {breeds.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                ไม่มีข้อมูลสายพันธุ์
              </div>
            ) : (
              <div className="p-1 min-w-40">
                {breeds.map((breed) => (
                  <div
                    key={breed.id}
                    className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                    onClick={() => handleToggleBreed(breed.id)}
                  >
                    <Checkbox
                      checked={value.includes(breed.id)}
                      onChange={() => handleToggleBreed(breed.id)}
                    />
                    <span className="text-sm">{breed.breed}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected breeds display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((breedId) => {
            const breed = breeds.find((b) => b.id === breedId);
            return (
              <Badge key={breedId} variant="secondary" className="pr-1">
                <Dna size={12} className="mr-1" />
                {breed ? `${breed.breed}` : `ID: ${breedId}`}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveBreed(breedId)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
