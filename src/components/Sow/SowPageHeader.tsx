import DialogComponent from "@/components/DialogComponent";
import SowForm from "@/components/Sow/Form";
import { Plus } from "lucide-react";

export function SowPageHeader() {
  return (
    <div className="flex justify-between">
      <h2 className="text-2xl">แม่พันธุ์</h2>
      <DialogComponent
        title="เพิ่มแม่พันธุ์ใหม่"
        dialogTriggerButton={
          <div className="flex items-center gap-2 rounded-full bg-primary text-white p-4 cursor-pointer fixed z-10 bottom-24 right-4 shadow">
            <Plus size={22} />
          </div>
        }
      >
        <SowForm />
      </DialogComponent>
    </div>
  );
}
