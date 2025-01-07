"use client";

import { createSow, deleteSow, updateSow } from "@/services/sow";
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
import { useToast } from "@/hooks/use-toast";
import DialogComponent from "../DialogComponent";
import { Check, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "../ui/switch";
import { useLoading } from "@/stores/useLoading";

const formSchema = z.object({
  name: z.string().nonempty("กรุณากรอกชื่อแม่พันธุ์"),
  is_active: z.boolean(),
});

export default function SowForm({ editingSow, setDialog }: any) {
  const [sow, setSow] = useState<Sow>({} as Sow);
  const { setIsLoading } = useLoading();
  const { addSow, updateSow: updateSowState, removeSow } = useSowStore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingSow?.name || "",
      is_active: editingSow ? editingSow.is_active : true,
    },
  });

  const handleCreateSow = async (
    sow: Sow,
    values: z.infer<typeof formSchema>
  ) => {
    let res = await createSow({ ...sow, ...values });
    if (res) {
      addSow(res);
      form.reset();
      toast({
        title: "เพิ่มข้อมูลเรียบร้อย",
        description: "ข้อมูลของแม่พันธุ์ถูกเพิ่มเรียบร้อยแล้ว",
      });
      setDialog(false);
    }
  };

  const handleUpdateSow = async (
    sow: Sow,
    values: z.infer<typeof formSchema>
  ) => {
    let data: any = { ...sow, ...values, updated_at: new Date().toISOString() };
    delete data.breedings;
    delete data.medical_records;
    let res = await updateSow(data);
    if (res) {
      updateSowState(res);
      toast({
        title: "แก้ไขข้อมูลเรียบร้อย",
        description: "ข้อมูลของแม่พันธุ์ถูกแก้ไขเรียบร้อยแล้ว",
      });
      setDialog(false);
    }
  };

  const onDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteSow(id);
    } catch (err) {
      console.error(`Error deleting sow: ${err}`);
    } finally {
      setIsLoading(false);
    }

    removeSow(id);
    router.push("/sows");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (editingSow) {
        await handleUpdateSow(sow, values);
        return;
      }
      await handleCreateSow(sow, values);
    } catch (err) {
      console.error(`Error: ${err}`);
    } finally {
      setIsLoading(false);
    }
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
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">ยังอยู่</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end gap-2">
          <DialogComponent
            title="ลบแม่พันธุ์"
            dialogTriggerButton={
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-500"
              >
                <Trash /> ลบ
              </Button>
            }
          >
            <p>
              คุณแน่ใจหรือไม่ที่จะลบแม่พันธุ์{" "}
              <span className="font-bold">{sow.name}</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={() => onDelete(sow.id)}>
                <Trash /> ลบ
              </Button>
            </div>
          </DialogComponent>
          <Button type="submit">
            <Check /> บันทึก
          </Button>
        </div>
      </form>
    </Form>
  );
}
