import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/DatePicker";
import { Check, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLitterStore } from "@/stores/useLitterStore";
import { updateLitter } from "@/services/litter";
import { Litter } from "@/types/litter";

import { litterFormSchema, LitterFormData } from "@/schemas/litterSchema";
import { useTotalBornPiglets, useCalculatedSaleableDate } from "./hooks";
import { PigletsSection } from "./PigletsSection";
import { FatteningSection } from "./FatteningSection";
import { DeleteDialog } from "./DeleteDialog";

interface LitterFormProps {
  litter: Litter;
  setDialog?: (open: boolean) => void;
}

export function LitterForm({ litter, setDialog }: LitterFormProps) {
  const { toast } = useToast();
  const { updateLitter: updateLitterStore } = useLitterStore();

  const form = useForm<LitterFormData>({
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

  const totalBornPiglets = useTotalBornPiglets(form);
  const calculatedSaleableDate = useCalculatedSaleableDate(form);

  const handleUpdate = async (litterData: Litter) => {
    const requestBody = {
      ...litterData,
      boar_id: litterData.boars?.boar_id,
      updated_at: new Date().toISOString(),
      sows: undefined,
      sow: undefined,
    };

    delete requestBody.boars;
    delete requestBody.sows;
    delete requestBody.sow;

    try {
      const res = await updateLitter(requestBody);
      if (res) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "แก้ไขประวัติการผสมเรียบร้อย",
        });
        updateLitterStore(res);
        setDialog?.(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (values: LitterFormData) => {
    const formattedLitter = {
      ...litter,
      ...values,
      birth_date: values.birth_date.toISOString(),
      piglets_born_count: totalBornPiglets,
      fattening_at: values.fattening_at?.toISOString() || null,
      saleable_at: calculatedSaleableDate?.toISOString() || null,
      sold_at: values.sold_at?.toISOString() || null,
    };

    try {
      await handleUpdate(formattedLitter);
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

        <PigletsSection form={form} totalBornPiglets={totalBornPiglets} />

        <FatteningSection
          form={form}
          calculatedSaleableDate={calculatedSaleableDate}
        />

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
