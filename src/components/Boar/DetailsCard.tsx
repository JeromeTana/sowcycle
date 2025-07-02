import { Boar } from "@/types/boar";
import { Pen } from "lucide-react";
import DialogComponent from "../DialogComponent";
import { Button } from "../ui/button";
import BoarForm from "./Form";

interface BoarDetailsCardProps {
  boar: Boar;
}

export default function BoarDetailsCard({ boar }: BoarDetailsCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>{boar.description}</div>
      <div className="flex justify-end">
        <DialogComponent
          title="แก้ไขสายพันธุ์"
          dialogTriggerButton={
            <Button variant={"ghost"}>
              <Pen /> แก้ไขสายพันธุ์
            </Button>
          }
        >
          <BoarForm editingBoar={boar} />
        </DialogComponent>
      </div>
    </div>
  );
}
