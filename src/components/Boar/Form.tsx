"use client";

import { createBoar, deleteBoar, updateBoar } from "@/services/boar";
import { useBoarStore } from "@/stores/useBoarStore";
import { Boar } from "@/types/boar";
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
import { useToast } from "@/hooks/use-toast";
import DialogComponent from "../DialogComponent";
import { Check, Loader, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/stores/useLoading";

const formSchema = z.object({
  breed: z.string().nonempty("กรุณากรอกสายพันธุ์"),
});

export default function BoarForm({ editingBoar, setDialog }: any) {
  const [boar, setBoar] = useState<Boar>({} as Boar);
  const { setIsLoading } = useLoading();
  const { addBoar, updateBoar: updateBoarState, removeBoar } = useBoarStore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breed: editingBoar?.breed || "",
    },
  });

  const handleCreateBoar = async (
    boar: Boar,
    values: z.infer<typeof formSchema>
  ) => {
    let res = await createBoar({ ...boar, ...values });
    if (res) {
      addBoar(res);
      form.reset();
      toast({
        title: "เพิ่มข้อมูลเรียบร้อย",
        description: "ข้อมูลของพ่อพันธุ์ถูกเพิ่มเรียบร้อยแล้ว",
      });
      setDialog(false);
    }
  };

  const handleUpdateBoar = async (
    boar: Boar,
    values: z.infer<typeof formSchema>
  ) => {
    let data: any = {
      ...boar,
      ...values,
      updated_at: new Date().toISOString(),
    };
    delete data.breedings;
    delete data.medical_records;
    let res = await updateBoar(data);
    if (res) {
      updateBoarState(res);
      toast({
        title: "แก้ไขข้อมูลเรียบร้อย",
        description: "ข้อมูลของพ่อพันธุ์ถูกแก้ไขเรียบร้อยแล้ว",
      });
      setDialog(false);
    }
  };

  const onDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteBoar(id);
    } catch (err) {
      console.error(`Error deleting boar: ${err}`);
    } finally {
      setIsLoading(false);
    }

    removeBoar(id);
    router.push("/boars");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (editingBoar) {
      await handleUpdateBoar(boar, values);
      return;
    }
    await handleCreateBoar(boar, values);
  };

  useEffect(() => {
    if (editingBoar) {
      setBoar(editingBoar);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สายพันธุ์</FormLabel>
              <FormControl>
                <Input placeholder="พิมพ์ชื่อสายพันธุ์" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end gap-2">
          {boar.id && (
            <DialogComponent
              title="ลบพ่อพันธุ์"
              dialogTriggerButton={
                <Button
                  disabled={form.formState.isSubmitting}
                  variant="ghost"
                  className="text-red-500 hover:text-red-500"
                >
                  <Trash /> ลบ
                </Button>
              }
            >
              <p>
                คุณแน่ใจหรือไม่ที่จะลบพ่อพันธุ์{" "}
                <span className="font-bold">{boar.name}</span>
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={() => onDelete(boar.id)}>
                  <Trash /> ลบ
                </Button>
              </div>
            </DialogComponent>
          )}
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
