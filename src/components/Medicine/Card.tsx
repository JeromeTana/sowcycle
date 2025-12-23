import { Card, CardContent } from "@/components/ui/card";
import DialogComponent from "../DrawerDialog";
import { Syringe, Activity, ChevronRight } from "lucide-react";
import MedicineForm from "./Form";
import { Medicine } from "@/types/medicine";
import InfoIcon from "../InfoIcon";
import { formatDate } from "@/lib/utils";

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  if (!medicine) return null;
  return (
    <DialogComponent
      title="แก้ไขประวัติใช้ยา"
      dialogTriggerButton={
        <Card>
          <CardContent className="p-4 space-y-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{medicine.title}</h3>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <InfoIcon label="คำอธิบาย" icon={<Syringe size={22} />}>
                  {medicine?.description ? medicine.description : "ไม่มีข้อมูล"}
                </InfoIcon>
                <InfoIcon label="จำนวนที่มี" icon={<Activity size={22} />}>
                  {medicine?.stock_count ? medicine.stock_count : "ไม่มีข้อมูล"}
                </InfoIcon>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <MedicineForm editingMedicine={medicine} />
    </DialogComponent>
  );
}
