import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Breeding } from "@/types/breeding";
import DialogComponent from "../DialogComponent";
import { Button } from "../ui/button";
import { Check, Trash } from "lucide-react";
import { FarrowForm } from "./Form";
import { deleteBreeding } from "@/services/breeding";

export default function BreedingCard({ breeding }: { breeding: Breeding }) {
  if (!breeding) return null;
  return (
    <Card>
      <CardHeader>
        ผสมเมื่อ: {new Date(breeding.breed_date).toLocaleDateString()}
      </CardHeader>
      <CardContent>
        กำหนดคลอด:{" "}
        {new Date(breeding.expected_farrow_date).toLocaleDateString()}
        {breeding.actual_farrow_date && (
          <div className="">
            <p>
              วันคลอดจริง:{" "}
              {new Date(breeding.actual_farrow_date).toLocaleDateString()}
            </p>
            <div>
              <p>จำนวนลูกหมูเกิดรอด: {breeding.piglets_born_alive}</p>
              <p>จำนวนลูกหมูเกิดตาย: {breeding.piglets_born_dead}</p>
              <p>รวมทั้งหมด: {breeding.piglets_born_count}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {breeding.actual_farrow_date === null && (
          <DialogComponent
            title="บันทึกการคลอด"
            dialogTriggerButton={
              <Button>
                <Check /> บันทึกการคลอด
              </Button>
            }
          >
            <FarrowForm breeding={breeding} />
          </DialogComponent>
        )}
        <DialogComponent
          title="บันทึกการคลอด"
          dialogTriggerButton={
            <Button
              variant={"ghost"}
              className="text-red-500 hover:text-red-500 hover:bg-red-50"
            >
              <Trash /> ลบ
            </Button>
          }
        >
          <p>ต้องการลบข้อมูลการผสมนี้หรือไม่</p>
          <div className="flex justify-end">
            <Button
              variant={"destructive"}
              onClick={async () => {
                try {
                  await deleteBreeding(breeding.id!);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              ลบ
            </Button>
          </div>
        </DialogComponent>
      </CardFooter>
    </Card>
  );
}
