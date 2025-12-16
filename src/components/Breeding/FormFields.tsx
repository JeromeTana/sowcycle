import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DatePicker from "@/components/DatePicker";
import BreedDropdown from "@/components/Boar/Dropdown";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useSowOperations } from "@/hooks/useSowOperations";

interface FormFieldProps {
  form: any;
  disabled?: boolean;
}

export function SowSelectField({ form, disabled }: FormFieldProps) {
  const { sows } = useSowOperations();

  return (
    <FormField
      control={form.control}
      name="sow_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>แม่พันธุ์</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full h-12 rounded-full">
                <SelectValue placeholder="เลือกแม่พันธุ์" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>เลือกแม่พันธุ์</SelectLabel>
                {sows.map((sow) => (
                  <SelectItem key={sow.id} value={sow.id.toString()}>
                    {sow.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function BoarSelectField({ form, disabled }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="boar_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>พ่อพันธุ์</FormLabel>
          <BreedDropdown
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function BreedDateField({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="breed_date"
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel>วันที่ผสม</FormLabel>
          <DatePicker field={field} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function ExpectedFarrowDateField({
  expectedDate,
}: {
  expectedDate?: Date;
}) {
  return (
    <FormItem className="flex flex-col w-full">
      <FormLabel>กำหนดคลอด</FormLabel>
      <FormControl>
        <Button
          size="lg"
          variant="outline"
          disabled
          className={cn(
            "w-full px-4 text-left font-normal",
            !expectedDate && "text-muted-foreground"
          )}
        >
          {expectedDate ? (
            formatDate(expectedDate.toISOString())
          ) : (
            <span>เลือกวันที่ผสม</span>
          )}
          <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
        </Button>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function ActualFarrowDateField({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="actual_farrow_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>วันที่คลอดจริง</FormLabel>
          <DatePicker field={field} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PigletCountFields({
  form,
  totalBornPiglets,
  totalPiglets,
}: {
  form: any;
  totalBornPiglets: number;
  totalPiglets: number;
}) {
  return (
    <>
      <div className="space-y-2">
        <p className="text-sm">จำนวนลูกเกิด</p>
        <div className="p-4 space-y-4 border rounded-lg bg-gray-50">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="piglets_male_born_alive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ตัวผู้</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      type="number"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="piglets_female_born_alive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ตัวเมีย</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      type="number"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem>
            <FormLabel>รวม</FormLabel>
            <FormControl>
              <Input
                className="bg-white"
                type="number"
                disabled
                value={totalBornPiglets}
                min={0}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      </div>

      <FormField
        control={form.control}
        name="piglets_born_dead"
        render={({ field }) => (
          <FormItem>
            <FormLabel>จำนวนลูกเกิดตาย</FormLabel>
            <FormControl>
              <Input type="number" {...field} min={0} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>รวมทั้งหมด</FormLabel>
        <FormControl>
          <Input disabled type="number" value={totalPiglets} min={0} />
        </FormControl>
        <FormMessage />
      </FormItem>
    </>
  );
}

export function AbortionToggle({ form, show }: { form: any; show: boolean }) {
  if (!show) return null;

  return (
    <FormField
      control={form.control}
      name="is_aborted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <FormLabel className="text-base">แท้งลูก</FormLabel>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
