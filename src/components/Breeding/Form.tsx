import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useMemo } from "react";
import { Breeding } from "@/types/breeding";
import { createBreeding, updateBreeding } from "@/services/breeding";
import { patchSow } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";

const newFormSchema = z.object({
  sow_id: z.string(),
  breed_date: z.date({ required_error: "กรุณาเลือกวันที่" }),
});

const farrowFormSchema = z.object({
  actual_farrow_date: z.date(),
  piglets_born_alive: z.coerce.number().nonnegative(),
  piglets_born_dead: z.coerce.number().nonnegative(),
});

export function NewBreedingForm({ id }: { id: string }) {
  const { sows } = useSowStore();

  const form = useForm<z.infer<typeof newFormSchema>>({
    resolver: zodResolver(newFormSchema),
    defaultValues: {
      sow_id: id,
      breed_date: new Date(),
    },
  });

  const expectedFarrowDate = useMemo(() => {
    if (form.watch("breed_date")) {
      const breedDate = new Date(form.watch("breed_date"));
      breedDate.setDate(breedDate.getDate() + 114);
      return breedDate;
    }
  }, [form.watch("breed_date")]);

  const onSubmit = async (values: z.infer<typeof newFormSchema>) => {
    let res = await createBreeding({
      sow_id: Number(values.sow_id),
      breed_date: values.breed_date.toISOString(),
      expected_farrow_date: expectedFarrowDate!.toISOString(),
    });

    if (res) {
      await patchSow({
        id: Number(values.sow_id),
        is_available: false,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sow_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>แม่พันธุ์</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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
        <FormField
          control={form.control}
          name="breed_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>วันที่ผสม</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex flex-col">
          <FormLabel>กำหนดคลอด</FormLabel>
          <FormControl>
            <Button
              variant={"outline"}
              disabled
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !expectedFarrowDate && "text-muted-foreground"
              )}
            >
              {expectedFarrowDate ? (
                format(expectedFarrowDate, "PPP")
              ) : (
                <span>เลือกวันที่ผสม</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="w-full flex justify-end">
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  );
}

export function FarrowForm({ breeding }: { breeding: Breeding }) {
  const form = useForm<z.infer<typeof farrowFormSchema>>({
    resolver: zodResolver(farrowFormSchema),
    defaultValues: {
      actual_farrow_date: new Date(),
      piglets_born_alive: 0,
      piglets_born_dead: 0,
    },
  });

  const totalPiglets = useMemo(() => {
    return (
      Number(form.getValues("piglets_born_alive")) +
      Number(form.getValues("piglets_born_dead"))
    );
  }, [form.watch("piglets_born_alive"), form.watch("piglets_born_dead")]);

  const onSubmit = async (values: z.infer<typeof farrowFormSchema>) => {
    const updatedBreeding = {
      ...breeding,
      ...values,
      actual_farrow_date: values.actual_farrow_date.toISOString(),
      piglets_born_count: totalPiglets,
    };

    try {
      let res = await updateBreeding(updatedBreeding);

      if (res) {
        await patchSow({
          id: breeding.sow_id,
          is_available: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="actual_farrow_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="piglets_born_alive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>จำนวนลูกเกิดรอด</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="piglets_born_dead"
          render={({ field }) => (
            <FormItem>
              <FormLabel>จำนวนลูกเกิดตาย</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>รวมทั้งหมด</FormLabel>
          <FormControl>
            <Input disabled type="number" value={totalPiglets} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="w-full flex justify-end">
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  );
}
