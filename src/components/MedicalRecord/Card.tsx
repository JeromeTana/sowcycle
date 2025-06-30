import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DialogComponent from "../DialogComponent";
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
      <CardHeader>
        <p className={"font-bold inline-flex items-center gap-1"}>
          <Syringe size={22} />
          ใช้ยาครั้งที่ {index}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-6">
            <InfoIcon label="อาการ" icon={<Activity size={22} />}>
              {medicalRecord?.symptoms ? medicalRecord.symptoms : "ไม่มีข้อมูล"}
            </InfoIcon>
            <InfoIcon label="ยาที่ใช้" icon={<Syringe size={22} />}>
              {medicalRecord?.medicine ? medicalRecord.medicine : "ไม่มีข้อมูล"}
            </InfoIcon>
            <InfoIcon label="ใช้ยาเมื่อ" icon={<Calendar size={22} />}>
              {formatDate(medicalRecord.use_at)}
            </InfoIcon>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end gap-2">
          <DialogComponent
            title="แก้ไขประวัติผสม"
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
