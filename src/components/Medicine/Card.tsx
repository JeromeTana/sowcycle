import { Card, CardContent } from "@/components/ui/card";
import DialogComponent from "../DrawerDialog";
import {
  Syringe,
  Activity,
  ChevronRight,
  PiggyBank,
  Asterisk,
} from "lucide-react";
import MedicineForm from "./Form";
import { Medicine } from "@/types/medicine";
import InfoIcon from "../InfoIcon";
import { formatDate } from "@/lib/utils";
import { MedicalRecord } from "@/types/medicalRecord";

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  if (!medicine) return null;
  return (
    <DialogComponent
      title="แก้ไขยาวัคซีน"
      dialogTriggerButton={
        <Card>
          <CardContent className="p-4 space-y-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{medicine.title} </h3>
                <p className="text-base font-normal text-muted-foreground">
                  {medicine.stock_count > 0
                    ? `มีอยู่ ${medicine.stock_count}`
                    : "หมดแล้ว"}
                </p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <InfoIcon label="คำอธิบาย" icon={<Syringe size={22} />}>
                  {medicine.description || "ไม่มีข้อมูล"}
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

export function MedicineHistoryCard({
  medicalRecord,
}: {
  medicalRecord: MedicalRecord & {
    medicines: Medicine;
    sows: { name: string };
  };
}) {
  if (!medicalRecord) return null;
  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">
              {medicalRecord.medicines?.title ||
                medicalRecord.medicine ||
                "ไม่ระบุ"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(medicalRecord.used_at)}
            </p>
          </div>
          {/* <ChevronRight size={20} className="text-muted-foreground" /> */}
        </div>
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-muted rounded-xl">
            <InfoIcon
              label="ใช้กับแม่พันธุ์"
              icon={<PiggyBank size={22} />}
              className="!bg-white"
            >
              {medicalRecord.sows.name!}
            </InfoIcon>
          </div>
          <InfoIcon label="อาการ" icon={<Activity size={22} />}>
            {medicalRecord.symptoms || "ไม่มีข้อมูล"}
          </InfoIcon>
          {medicalRecord.notes && (
            <InfoIcon label="หมายเหตุ" icon={<Asterisk size={22} />}>
              {medicalRecord.notes}
            </InfoIcon>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
