import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { LitterFormData } from "../../schemas/litterSchema";
import { FATTENING_DURATION } from "@/lib/constant";

export const useTotalBornPiglets = (form: UseFormReturn<LitterFormData>) => {
  return useMemo(() => {
    return (
      Number(form.getValues("piglets_male_born_alive")) +
      Number(form.getValues("piglets_female_born_alive"))
    );
  }, [
    form.watch("piglets_male_born_alive"),
    form.watch("piglets_female_born_alive"),
  ]);
};

export const useCalculatedSaleableDate = (form: UseFormReturn<LitterFormData>) => {
  return useMemo(() => {
    if (form.watch("fattening_at")) {
      const saleableDate = new Date(form.watch("fattening_at") || "");
      saleableDate.setDate(saleableDate.getDate() + FATTENING_DURATION);
      return saleableDate;
    }
  }, [form.watch("fattening_at")]);
};