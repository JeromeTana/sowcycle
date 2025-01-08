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
          <Syringe size={20} />
          ใช้ยาครั้งที่ {index}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-start gap-2 text-gray-500">
              <div className={"border p-2 rounded-lg bg-gray-50"}>
                <Activity size={20} />
              </div>
              <p className="inline-flex flex-col gap-1">
                <span className="text-xs">อาการ</span>
                <span className="text-black">
                  {medicalRecord?.symptoms
                    ? medicalRecord.symptoms
                    : "ไม่มีข้อมูล"}
                </span>
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className={"border p-2 rounded-lg bg-gray-50"}>
                <Syringe size={20} />
              </div>
              <p className="inline-flex flex-col gap-1">
                <span className="text-xs">ยาที่ใช้</span>
                <span className="text-black">
                  {medicalRecord?.medicine
                    ? medicalRecord.medicine
                    : "ไม่มีข้อมูล"}
                </span>
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className={"border p-2 rounded-lg bg-gray-50"}>
                <Calendar size={20} />
              </div>
              <p className="inline-flex flex-col gap-1">
                <span className="text-xs">ใช้ยาเมื่อ</span>
                <span className="text-black">
                  {new Date(medicalRecord.use_at).toLocaleDateString("en-GB")}
                </span>
              </p>
            </div>
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
