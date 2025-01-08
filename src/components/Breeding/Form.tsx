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
import DatePicker from "../DatePicker";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, Heart, Plus, Trash } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Breeding } from "@/types/breeding";
import {
  createBreeding,
  deleteBreeding,
  updateBreeding,
} from "@/services/breeding";
import { getAllSows, patchSow } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { useToast } from "@/hooks/use-toast";
import DialogComponent from "../DialogComponent";
import { enGB } from "date-fns/locale";
import { useLoading } from "@/stores/useLoading";

const newFormSchema = z.object({
  sow_id: z.string(),
  breed_date: z.date({ required_error: "กรุณาเลือกวันที่" }),
});

const farrowFormSchema = z.object({
  breed_date: z.date({ required_error: "กรุณาเลือกวันที่" }),
  actual_farrow_date: z.date(),
  piglets_male_born_alive: z.coerce.number().nonnegative(),
  piglets_female_born_alive: z.coerce.number().nonnegative(),
  piglets_born_dead: z.coerce.number().nonnegative(),
});

export function NewBreedingForm({
  id,
  breeding,
  setDialog,
}: {
  id?: string;
  breeding?: Breeding;
  setDialog?: any;
}) {
  const { sows, setSows } = useSowStore();
  const { setIsLoading } = useLoading();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newFormSchema>>({
    resolver: zodResolver(newFormSchema),
    defaultValues: breeding
      ? {
          sow_id: breeding?.sow_id.toString(),
          breed_date: new Date(breeding.breed_date),
        }
      : {
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
    setIsLoading(true);
    try {
      if (breeding) {
        await handleUpdate(values);
        return;
      }
      await handleCreate(values);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: z.infer<typeof newFormSchema>) => {
    try {
      let res = await updateBreeding({
        ...breeding,
        ...values,
        sow_id: Number(values.sow_id),
        breed_date: values.breed_date.toISOString(),
        expected_farrow_date: expectedFarrowDate!.toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (res) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "แก้ไขประวัติการผสมเรียบร้อย",
        });
        setDialog(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (values: z.infer<typeof newFormSchema>) => {
    try {
      let res = await createBreeding({
        sow_id: Number(values.sow_id),
        breed_date: values.breed_date.toISOString(),
        expected_farrow_date: expectedFarrowDate!.toISOString(),
      });

      if (res) {
        let res = await patchSow({
          id: Number(values.sow_id),
          is_available: false,
          updated_at: new Date().toISOString(),
        });

        if (res) {
          toast({
            title: "เพิ่มสำเร็จ",
            description: "เพิ่มประวัติการผสมเรียบร้อย",
          });
          setDialog(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const sows = await getAllSows();
      if (!sows) return;
      setSows(sows);
    };
    if (sows.length === 0) fetchData();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sow_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>แม่พันธุ์</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={breeding?.id ? true : false}
              >
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

        <div className="w-full flex gap-2">
          <FormField
            control={form.control}
            name="breed_date"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>วันที่ผสม</FormLabel>
                <DatePicker field={field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="w-full flex flex-col">
            <FormLabel>กำหนดคลอด</FormLabel>
            <FormControl>
              <Button
                variant={"outline"}
                disabled
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !expectedFarrowDate && "text-muted-foreground"
                )}
              >
                {expectedFarrowDate ? (
                  format(expectedFarrowDate, "P", { locale: enGB })
                ) : (
                  <span>เลือกวันที่ผสม</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div
          className={cn(
            breeding ? "justify-between" : "justify-end",
            "w-full flex"
          )}
        >
          {breeding && <DeleteDialog id={breeding.id!} />}
          <Button type="submit">
            {breeding ? (
              <>
                <Check />
                บันทึก
              </>
            ) : (
              <>
                <Heart />
                เพิ่มประวัติผสม
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function FarrowForm({
  breeding,
  setDialog,
}: {
  breeding: Breeding;
  setDialog?: any;
}) {
  const { setIsLoading } = useLoading();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof farrowFormSchema>>({
    resolver: zodResolver(farrowFormSchema),
    defaultValues: breeding.actual_farrow_date
      ? {
          breed_date: new Date(breeding.breed_date),
          actual_farrow_date: new Date(breeding.actual_farrow_date),
          piglets_male_born_alive: breeding.piglets_male_born_alive,
          piglets_female_born_alive: breeding.piglets_female_born_alive,
          piglets_born_dead: breeding.piglets_born_dead,
        }
      : {
          breed_date: new Date(breeding.breed_date),
          actual_farrow_date: new Date(),
          piglets_male_born_alive: 0,
          piglets_female_born_alive: 0,
          piglets_born_dead: 0,
        },
  });

  const totalBornPiglets = useMemo(() => {
    return (
      Number(form.getValues("piglets_male_born_alive")) +
      Number(form.getValues("piglets_female_born_alive"))
    );
  }, [
    form.watch("piglets_male_born_alive"),
    form.watch("piglets_female_born_alive"),
  ]);

  const totalPiglets = useMemo(() => {
    return totalBornPiglets + Number(form.getValues("piglets_born_dead"));
  }, [totalBornPiglets, form.watch("piglets_born_dead")]);

  const onSubmit = async (values: z.infer<typeof farrowFormSchema>) => {
    let formattedBreeding = {
      ...breeding,
      ...values,
      breed_date: values.breed_date.toISOString(),
      actual_farrow_date: values.actual_farrow_date.toISOString(),
      piglets_born_count: totalBornPiglets,
    };
    setIsLoading(true);

    try {
      if (breeding.actual_farrow_date) {
        await handleUpdate(formattedBreeding);
        return;
      }

      await handleCreate(formattedBreeding);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const expectedFarrowDate = useMemo(() => {
    if (form.watch("breed_date")) {
      const breedDate = new Date(form.watch("breed_date"));
      breedDate.setDate(breedDate.getDate() + 114);
      return breedDate;
    }
  }, [form.watch("breed_date")]);

  const handleCreate = async (breeding: Breeding) => {
    try {
      let res = await updateBreeding(breeding);
      if (res) {
        let res = await patchSow({
          id: breeding.sow_id,
          is_available: true,
          updated_at: new Date().toISOString(),
        });
        if (res) {
          toast({
            title: "เพิ่มสำเร็จ",
            description: "เพิ่มประวัติการคลอดเรียบร้อย",
          });
          setDialog(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (breeding: Breeding) => {
    try {
      let res = await updateBreeding({
        ...breeding,
        updated_at: new Date().toISOString(),
      });
      if (res) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "แก้ไขประวัติการผสมเรียบร้อย",
        });
        setDialog(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-full flex gap-2 bg-gray-50 border p-4 rounded-lg">
          <FormField
            control={form.control}
            name="breed_date"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>วันที่ผสม</FormLabel>
                <DatePicker field={field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="w-full flex flex-col">
            <FormLabel>กำหนดคลอด</FormLabel>
            <FormControl>
              <Button
                variant={"outline"}
                disabled
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !expectedFarrowDate && "text-muted-foreground"
                )}
              >
                {expectedFarrowDate ? (
                  format(expectedFarrowDate, "P", { locale: enGB })
                ) : (
                  <span>เลือกวันที่ผสม</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        {breeding.breed_date && (
          <>
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
            <div className="space-y-2">
              <p className="text-sm">จำนวนลูกเกิด</p>
              <div className="border p-4 rounded-lg space-y-4 bg-gray-50">
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
        )}

        <div className="w-full flex justify-between">
          <DeleteDialog id={breeding.id!} />
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  );
}

export default function DeleteDialog({ id }: { id: number }) {
  const { setIsLoading } = useLoading();
  const { toast } = useToast();
  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await deleteBreeding(id);

      toast({
        title: "ลบสำเร็จ",
        description: "ลบประวัติการผสมเรียบร้อย",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DialogComponent
      title="บันทึกการคลอด"
      dialogTriggerButton={
        <Button
          variant={"ghost"}
          className="text-red-500 hover:text-red-500 hover:bg-red-50"
        >
          <Trash /> ลบ
        </Button>
      }
    >
      <p>ต้องการลบข้อมูลการผสมนี้หรือไม่</p>
      <div className="flex justify-end gap-2">
        <Button variant={"destructive"} onClick={handleDelete}>
          ลบ
        </Button>
      </div>
    </DialogComponent>
  );
}
