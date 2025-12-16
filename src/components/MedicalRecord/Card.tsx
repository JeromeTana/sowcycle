import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DialogComponent from "../DrawerDialog";
import { Button } from "../ui/button";
import { Pen, Syringe, Activity, Calendar } from "lucide-react";
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
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-2">
          <Syringe size={22} />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">ใช้ยาครั้งที่ {index}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(medicalRecord.use_at)}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-6">
            <InfoIcon label="อาการ" icon={<Activity size={22} />}>
              {medicalRecord?.symptoms ? medicalRecord.symptoms : "ไม่มีข้อมูล"}
            </InfoIcon>
            <InfoIcon label="ยาที่ใช้" icon={<Syringe size={22} />}>
              {medicalRecord?.medicine ? medicalRecord.medicine : "ไม่มีข้อมูล"}
            </InfoIcon>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end gap-2">
          <DialogComponent
            title="แก้ไขประวัติใช้ยา"
            dialogTriggerButton={
              <Button variant={"ghost"}>
                <Pen /> แก้ไขประวัติ
              </Button>
            }
          >
            <MedicalRecordForm medicalRecord={medicalRecord} />
          </DialogComponent>
        </div>
      </CardFooter>
    </Card>
  );
}
