import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/DatePicker";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LitterFormData } from "../../schemas/litterSchema";

interface FatteningSectionProps {
  form: UseFormReturn<LitterFormData>;
  calculatedSaleableDate?: Date;
}

export function FatteningSection({ form, calculatedSaleableDate }: FatteningSectionProps) {
  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name="fattening_at"
        render={({ field }) => (
          <FormItem className="w-full flex flex-col">
            <FormLabel>เริ่มขุนเมื่อ (ถ้ามี)</FormLabel>
            <DatePicker field={field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem className="w-full flex flex-col">
        <FormLabel>จะพร้อมขายประมาณ</FormLabel>
        <FormControl>
          <Button
            variant={"outline"}
            disabled
            className={cn(
              "w-full pl-3 text-left font-normal",
              !calculatedSaleableDate && "text-muted-foreground"
            )}
          >
            {calculatedSaleableDate ? (
              formatDate(calculatedSaleableDate.toISOString())
            ) : (
              <span>เลือกวันที่เริ่มขุน</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}