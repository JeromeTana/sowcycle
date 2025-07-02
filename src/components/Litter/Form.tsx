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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DatePicker from "../DatePicker";

import { cn, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader, Trash } from "lucide-react";
import { useMemo } from "react";
import { Litter } from "@/types/litter";
import { deleteLitter, updateLitter } from "@/services/litter";
import { patchSow } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { useToast } from "@/hooks/use-toast";
import DialogComponent from "../DialogComponent";
import { enGB } from "date-fns/locale";
import { useLitterStore } from "@/stores/useLitterStore";
import { FATTENING_DURATION } from "@/lib/constant";

const litterFormSchema = z.object({
  birth_date: z.date(),
  piglets_male_born_alive: z.coerce.number().nonnegative(),
  piglets_female_born_alive: z.coerce.number().nonnegative(),
  avg_weight: z.coerce.number().nonnegative().optional(),
  fattening_at: z.date().optional().nullable(),
  sold_at: z.date().optional().nullable(),
});

export function LitterForm({
  litter,
  setDialog,
}: {
  litter: Litter;
  setDialog?: any;
}) {
  const { toast } = useToast();
  const { updateLitter: updateLitterStore } = useLitterStore();
  const form = useForm<z.infer<typeof litterFormSchema>>({
    resolver: zodResolver(litterFormSchema),
    defaultValues: litter.birth_date
      ? {
          birth_date: new Date(litter.birth_date),
          piglets_male_born_alive: litter.piglets_male_born_alive,
          piglets_female_born_alive: litter.piglets_female_born_alive,
          avg_weight: litter.avg_weight || undefined,
          fattening_at: litter.fattening_at
            ? new Date(litter.fattening_at)
            : undefined,
          sold_at: litter.sold_at ? new Date(litter.sold_at) : undefined,
        }
      : {
          birth_date: new Date(),
          piglets_male_born_alive: 0,
          piglets_female_born_alive: 0,
          avg_weight: undefined,
          fattening_at: undefined,
          sold_at: undefined,
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

  const onSubmit = async (values: z.infer<typeof litterFormSchema>) => {
    let formattedLitter = {
      ...litter,
      ...values,
      birth_date: values.birth_date.toISOString(),
      piglets_born_count: totalBornPiglets,
      fattening_at: values.fattening_at?.toISOString() || null,
      saleable_at: calculatedSaleableDate?.toISOString() || null,
      sold_at: values.sold_at?.toISOString() || null,
    };

    try {
      let res = await handleUpdate(formattedLitter);
    } catch (err) {
      console.error(err);
    }
  };

  const calculatedSaleableDate = useMemo(() => {
    if (form.watch("fattening_at")) {
      const saleableDate = new Date(form.watch("fattening_at") || "");
      saleableDate.setDate(saleableDate.getDate() + FATTENING_DURATION);
      return saleableDate;
    }
  }, [form.watch("fattening_at")]);

  const handleUpdate = async (litter: Litter) => {
    let requestBody = {
      ...litter,
      boar_id: litter.boars?.boar_id,
      updated_at: new Date().toISOString(),
      sows: undefined,
      sow: undefined,
    };

    delete requestBody.boars;
    delete requestBody.sows;
    delete requestBody.sow;

    try {
      let res = await updateLitter(requestBody);
      if (res) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "แก้ไขประวัติการผสมเรียบร้อย",
        });
        updateLitterStore(res);
        setDialog(false);
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
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>วันที่คลอด</FormLabel>
              <DatePicker field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm">จำนวนลูกหมู</p>
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

        <FormField
          control={form.control}
          name="sold_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>ขายแล้วเมื่อ (ถ้ามี)</FormLabel>
              <DatePicker field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avg_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>น้ำหนักเฉลี่ย (ถ้ามี)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min={0}
                  placeholder="หน่วยเป็นกิโลกรัม เช่น 150.45"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between">
          <DeleteDialog
            isSubmitting={form.formState.isSubmitting}
            litter={litter}
            setDialog={setDialog}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Loader className="animate-spin" />
                กำลังบันทึก
              </>
            ) : (
              <>
                <Check />
                บันทึก
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function DeleteDialog({
  litter,
  isSubmitting,
  setDialog,
}: {
  litter: Litter;
  isSubmitting: boolean;
  setDialog?: any;
}) {
  const { toast } = useToast();
  const { removeLitter } = useLitterStore();
  const { updateSow } = useSowStore();
  const handleDelete = async () => {
    try {
      let res = await deleteLitter(litter.id!);

      if (res) {
        toast({
          title: "ลบสำเร็จ",
          description: "ลบประวัติการผสมเรียบร้อย",
        });

        removeLitter(res.id);

        if (!res.birth_date) {
          let sowPatchResponse = await patchSow({
            id: litter.sow_id,
            is_available: true,
            updated_at: new Date().toISOString(),
          });

          if (sowPatchResponse) {
            toast({
              title: "เพิ่มสำเร็จ",
              description: "เพิ่มประวัติการคลอดเรียบร้อย",
            });
            updateSow(sowPatchResponse);
            setDialog(false);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <DialogComponent
      title="บันทึกการคลอด"
      dialogTriggerButton={
        <Button
          disabled={isSubmitting}
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
