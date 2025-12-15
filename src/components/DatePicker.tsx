import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

import { Calendar } from "./ui/calendar";

export default function DatePicker({ field }: any) {
  const [calendarPop, setCalendarPop] = useState(false);

  return (
    <Popover modal open={calendarPop} onOpenChange={setCalendarPop}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            size="lg"
            className={cn(
              "w-full px-4 text-left text-base font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value ? (
              format(field.value, "PP", { locale: th })
            ) : (
              <span>เลือกวันที่</span>
            )}
            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={field.value || new Date()}
          selected={field.value}
          onSelect={(e) => {
            field.onChange(e);
            setCalendarPop(false);
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
          className="w-screen"
        />
      </PopoverContent>
    </Popover>
  );
}
