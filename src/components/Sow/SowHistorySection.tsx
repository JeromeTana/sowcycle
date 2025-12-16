import { Button } from "@/components/ui/button";
import DialogComponent from "@/components/DialogComponent";
import TabsComponent from "@/components/TabsComponent";
import BreedingCard from "@/components/Breeding/Card";
import MedicalRecordCard from "@/components/MedicalRecord/Card";
import { NewBreedingForm } from "@/components/Breeding/Form";
import { MedicalRecordForm } from "@/components/MedicalRecord/Form";
import { Sow } from "@/types/sow";
import { Breeding } from "@/types/breeding";
import { MedicalRecord } from "@/types/medicalRecord";
import { Heart, Plus, Syringe } from "lucide-react";

interface SowHistorySectionProps {
  sow: Sow;
  breedings: Breeding[];
  medicalRecords: MedicalRecord[];
}

export default function SowHistorySection({
  sow,
  breedings,
  medicalRecords
}: SowHistorySectionProps) {
  const tabOptions = [
    {
      label: (
        <>
          <Heart size={12} />
          &nbsp;ประวัติผสม {breedings?.length > 0 && `(${breedings.length})`}
        </>
      ),
      value: "breeding",
      content: <BreedingRecordContent breedings={breedings} />,
      default: true,
    },
    {
      label: (
        <>
          <Syringe size={12} />
          &nbsp;ประวัติใช้ยา{" "}
          {medicalRecords?.length > 0 && `(${medicalRecords.length})`}
        </>
      ),
      value: "medical",
      content: <MedicalRecordContent medicalRecords={medicalRecords} />,
    },
  ];

  const tabFormOptions = [
    {
      label: (
        <>
          <Heart size={12} />
          &nbsp;ประวัติผสม
        </>
      ),
      value: "breeding",
      content:
        breedings.length === 0 || breedings[0]?.actual_farrow_date ? (
          <NewBreedingForm id={sow?.id?.toString()} />
        ) : (
          <div className="py-20 text-sm text-center text-gray-400">
            ไม่สามารถเพิ่มประวัติผสม
            <br />
            เนื่องจากยังไม่มีการบันทึกวันคลอดของการผสมล่าสุด
          </div>
        ),
      default: true,
    },
    {
      label: (
        <>
          <Syringe size={12} />
          &nbsp;ประวัติใช้ยา
        </>
      ),
      value: "medical",
      content: <MedicalRecordForm id={sow?.id?.toString()} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl">ประวัติแม่พันธุ์</h2>
        <DialogComponent
          title="เพิ่มประวัติใหม่"
          dialogTriggerButton={
            <Button disabled={!sow.is_active}>
              <Plus /> เพิ่มประวัติ
            </Button>
          }
        >
          <TabsComponent tabOptions={tabFormOptions} />
        </DialogComponent>
      </div>
      <TabsComponent tabOptions={tabOptions} />
    </div>
  );
}

const BreedingRecordContent = ({ breedings }: { breedings: Breeding[] }) => {
  return (
    <div>
      {breedings?.length > 0 ? (
        <div className="flex flex-col gap-2">
          {breedings.map((breeding, index) => (
            <BreedingCard
              index={breedings.length - index}
              key={breeding.id || index}
              breeding={breeding}
            />
          ))}
        </div>
      ) : (
        <div className="pt-20 text-center text-muted-foreground">
          ไม่มีประวัติผสม
        </div>
      )}
    </div>
  );
};

const MedicalRecordContent = ({ medicalRecords }: { medicalRecords: MedicalRecord[] }) => {
  return (
    <div>
      {medicalRecords?.length > 0 ? (
        <div className="flex flex-col gap-4">
          {medicalRecords.map((medicalRecord, index) => (
            <MedicalRecordCard
              index={medicalRecords.length - index}
              key={medicalRecord.id || index}
              medicalRecord={medicalRecord}
            />
          ))}
        </div>
      ) : (
        <div className="pt-20 text-center text-muted-foreground">
          ไม่มีประวัติใช้ยา
        </div>
      )}
    </div>
  );
};