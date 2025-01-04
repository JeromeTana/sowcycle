"use client";

import { createSow, updateSow } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { Sow } from "@/types/sow";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().nonempty("กรุณากรอกชื่อแม่พันธุ์"),
});

export default function SowForm() {
  const [sow, setSow] = useState<Sow>({} as Sow);
  const {
    editingSow,
    setEditingSow,
    addSow: createSowState,
    updateSow: updateSowState,
  } = useSowStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingSow?.name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (editingSow) {
      let res = await updateSow({ ...sow, ...values });
      updateSowState(res);
      setEditingSow(null);
      return;
    }

    let res = await createSow({ ...sow, ...values });
    createSowState(res);
  };

  useEffect(() => {
    if (editingSow) {
      setSow(editingSow);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input placeholder="เช่น ทองดี" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit">{editingSow ? "แก้ไข" : "เพิ่ม"}</Button>
        </div>
      </form>
    </Form>
  );
}
