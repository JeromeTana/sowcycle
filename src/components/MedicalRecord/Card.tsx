import { Card, CardContent } from "@/components/ui/card";
import DialogComponent from "../DrawerDialog";
import { Syringe, Activity, ChevronRight } from "lucide-react";
import { MedicalRecordForm } from "./Form";
import { MedicalRecord } from "@/types/medicalRecord";
import InfoIcon from "../InfoIcon";
import { formatDate } from "@/lib/utils";

export default function MedicalRecordCard({
  medicalRecord,
  index,
}: {
  medicalRecord: MedicalRecord;
  index: number;
}) {
  if (!medicalRecord) return null;
  return (
    <DialogComponent
      title="แก้ไขประวัติใช้ยา"
      dialogTriggerButton={
        <Card>
          <CardContent className="p-4 space-y-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">ใช้ยาครั้งที่ {index}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(medicalRecord.use_at)}
                </p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <InfoIcon label="อาการ" icon={<Activity size={22} />}>
                  {medicalRecord?.symptoms
                    ? medicalRecord.symptoms
                    : "ไม่มีข้อมูล"}
                </InfoIcon>
                <InfoIcon label="ยาที่ใช้" icon={<Syringe size={22} />}>
                  {medicalRecord?.medicine
                    ? medicalRecord.medicine
                    : "ไม่มีข้อมูล"}
                </InfoIcon>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <MedicalRecordForm medicalRecord={medicalRecord} />
    </DialogComponent>
  );
}
