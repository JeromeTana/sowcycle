import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DialogComponent from "@/components/DrawerDialog";
import { useLitterStore } from "@/stores/useLitterStore";
import { useSowStore } from "@/stores/useSowStore";
import { deleteLitter } from "@/services/litter";
import { patchSow } from "@/services/sow";
import { Litter } from "@/types/litter";

interface DeleteDialogProps {
  litter: Litter;
  isSubmitting: boolean;
  setDialog?: (open: boolean) => void;
}

export function DeleteDialog({ litter, isSubmitting, setDialog }: DeleteDialogProps) {
  const { toast } = useToast();
  const { removeLitter } = useLitterStore();
  const { updateSow } = useSowStore();

  const handleDelete = async () => {
    try {
      const res = await deleteLitter(litter.id!);

      if (res) {
        toast({
          title: "ลบสำเร็จ",
          description: "ลบประวัติการผสมเรียบร้อย",
        });

        removeLitter(res.id);

        if (!res.birth_date) {
          const sowPatchResponse = await patchSow({
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
            setDialog?.(false);
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