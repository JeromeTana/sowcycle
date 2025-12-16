import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";
import { PREGNANCY_DURATION } from "@/lib/constant";
import { Breeding } from "@/types/breeding";
import { useBreedingOperations } from "@/hooks/useBreedingOperations";
import { farrowFormSchema, FarrowFormData } from "@/schemas/breedingSchemas";
import { 
  BreedDateField, 
  ExpectedFarrowDateField, 
  ActualFarrowDateField,
  PigletCountFields,
  AbortionToggle
} from "./FormFields";
import DeleteDialog from "./DeleteDialog";

interface FarrowFormProps {
  breeding: Breeding;
  setDialog?: (open: boolean) => void;
}

export function FarrowForm({ breeding, setDialog }: FarrowFormProps) {
  const { updateBreeding, createFarrowRecord } = useBreedingOperations();

  const form = useForm<FarrowFormData>({
    resolver: zodResolver(farrowFormSchema),
    defaultValues: breeding.actual_farrow_date
      ? {
          breed_date: new Date(breeding.breed_date),
          actual_farrow_date: new Date(breeding.actual_farrow_date),
          piglets_male_born_alive: breeding.piglets_male_born_alive,
          piglets_female_born_alive: breeding.piglets_female_born_alive,
          piglets_born_dead: breeding.piglets_born_dead,
          avg_weight: breeding.avg_weight || undefined,
          is_aborted: breeding.is_aborted,
        }
      : {
          breed_date: new Date(breeding.breed_date),
          actual_farrow_date: new Date(),
          piglets_male_born_alive: 0,
          piglets_female_born_alive: 0,
          piglets_born_dead: 0,
          avg_weight: undefined,
          is_aborted: false,
        },
  });

  const expectedFarrowDate = useMemo(() => {
    const breedDate = form.watch("breed_date");
    if (!breedDate) return undefined;
    
    const expected = new Date(breedDate);
    expected.setDate(expected.getDate() + PREGNANCY_DURATION);
    return expected;
  }, [form.watch("breed_date")]);

  const totalBornPiglets = useMemo(() => {
    return (
      Number(form.getValues("piglets_male_born_alive") || 0) +
      Number(form.getValues("piglets_female_born_alive") || 0)
    );
  }, [
    form.watch("piglets_male_born_alive"),
    form.watch("piglets_female_born_alive"),
  ]);

  const totalPiglets = useMemo(() => {
    return totalBornPiglets + Number(form.getValues("piglets_born_dead") || 0);
  }, [totalBornPiglets, form.watch("piglets_born_dead")]);

  const onSubmit = async (values: FarrowFormData) => {
    try {
      const breedingData = {
        ...breeding,
        ...values,
        breed_date: values.breed_date.toISOString(),
        actual_farrow_date: values.actual_farrow_date.toISOString(),
        piglets_born_count: totalBornPiglets,
      };

      if (breeding.actual_farrow_date) {
        await updateBreeding(breedingData);
      } else {
        await createFarrowRecord(breedingData, totalBornPiglets);
      }
      
      setDialog?.(false);
    } catch (error) {
      console.error("Farrow form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-full gap-2 p-4 border rounded-lg bg-gray-50">
          <BreedDateField form={form} />
          <ExpectedFarrowDateField expectedDate={expectedFarrowDate} />
        </div>

        {breeding.breed_date && (
          <>
            <ActualFarrowDateField form={form} />
            <PigletCountFields 
              form={form} 
              totalBornPiglets={totalBornPiglets}
              totalPiglets={totalPiglets}
            />
            <AbortionToggle form={form} show={!breeding.actual_farrow_date} />
          </>
        )}

        <div className="flex justify-between w-full">
          {/* <DeleteDialog
            isSubmitting={form.formState.isSubmitting}
            breeding={breeding}
            setDialog={setDialog}
          /> */}
          <Button disabled={form.formState.isSubmitting} size="lg" type="submit" className="w-full">
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