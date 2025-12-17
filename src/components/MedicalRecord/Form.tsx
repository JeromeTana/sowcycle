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
import { Check, Loader, Syringe, Trash } from "lucide-react";
import { useEffect } from "react";
import {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "@/services/medicalRecord";
import { getAllSows } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { useToast } from "@/hooks/use-toast";
import DialogComponent from "../DrawerDialog";
import { MedicalRecord } from "@/types/medicalRecord";
import { Textarea } from "../ui/textarea";
import { useLoading } from "@/stores/useLoading";
import { useMedicalRecordStore } from "@/stores/useMedicalRecordStore";

const newFormSchema = z.object({
  sow_id: z.string(),
  use_at: z.date({ required_error: "กรุณาเลือกวันที่" }),
  symptoms: z.string(),
  medicine: z.string(),
});

export function MedicalRecordForm({
  id,
  medicalRecord,
  setDialog,
}: {
  id?: string;
  medicalRecord?: MedicalRecord;
  setDialog?: any;
}) {
  const { sows, setSows } = useSowStore();
  const { addMedicalRecord, updateMedicalRecord: updateMedicalRecordStore } =
    useMedicalRecordStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newFormSchema>>({
    resolver: zodResolver(newFormSchema),
    defaultValues: medicalRecord
      ? {
          ...medicalRecord,
          sow_id: medicalRecord?.sow_id.toString(),
          use_at: new Date(medicalRecord.use_at),
        }
      : {
          sow_id: id,
          use_at: new Date(),
          symptoms: "",
          medicine: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof newFormSchema>) => {
    try {
      if (medicalRecord) {
        await handleUpdate(values);
        return;
      }
      await handleCreate(values);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (values: z.infer<typeof newFormSchema>) => {
    try {
      let res = await updateMedicalRecord({
        ...medicalRecord,
        ...values,
        sow_id: Number(values.sow_id),
        use_at: values.use_at.toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (res) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "แก้ไขประวัติการผสมเรียบร้อย",
        });
        updateMedicalRecordStore(res);
        setDialog(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (values: z.infer<typeof newFormSchema>) => {
    try {
      let res = await createMedicalRecord({
        ...values,
        sow_id: Number(values.sow_id),
        use_at: values.use_at.toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (res) {
        toast({
          title: "เพิ่มสำเร็จ",
          description: "เพิ่มประวัติการผสมเรียบร้อย",
        });
        addMedicalRecord(res);
        setDialog(false);
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
                disabled={medicalRecord?.id ? true : false}
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

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อาการ</FormLabel>
              <FormControl>
                <Textarea placeholder="อาการของสุกร" className="bg-white resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ยาที่ใช้</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อยาที่ใช้" className="bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="use_at"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>วันที่ใช้ยา</FormLabel>
              <DatePicker field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            medicalRecord ? "justify-between" : "justify-end",
            "w-full flex"
          )}
        >
          {medicalRecord && (
            <DeleteDialog setDialog={setDialog} id={medicalRecord.id!} />
          )}
          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            className="w-full"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader className="animate-spin" />
                กำลังบันทึก
              </>
            ) : medicalRecord ? (
              <>
                <Check />
                บันทึก
              </>
            ) : (
              <>
                <Syringe />
                เพิ่มประวัติใช้ยา
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function DeleteDialog({
  id,
  setDialog,
}: {
  id: number;
  setDialog: any;
}) {
  const { toast } = useToast();
  const { removeMedicalRecord } = useMedicalRecordStore();
  const handleDelete = async () => {
    try {
      let res = await deleteMedicalRecord(id);

      if (res) {
        toast({
          title: "ลบสำเร็จ",
          description: "ลบประวัติการผสมเรียบร้อย",
        });
        removeMedicalRecord(res.id);
        setDialog(false);
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
          size="lg"
          variant={"ghost"}
          className="text-red-500 hover:text-red-500 hover:bg-red-50"
        >
          <Trash /> ลบ
        </Button>
      }
    >
      <p>ต้องการลบข้อมูลการผสมนี้หรือไม่</p>
      <div className="flex justify-end gap-2">
        <Button variant={"destructive"} size="lg" onClick={handleDelete}>
          ลบ
        </Button>
      </div>
    </DialogComponent>
  );
}
