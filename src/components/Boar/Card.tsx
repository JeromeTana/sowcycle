"use client";

import { Boar } from "@/types/boar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dna } from "lucide-react";
import DialogComponent from "../DialogComponent";
import BoarDetailsCard from "./DetailsCard";
import { Button } from "../ui/button";
import Link from "next/link";

export default function BoarCard({ boar }: { boar: Boar }) {
  return (
    <DialogComponent
      title={`${boar.breed}`}
      dialogTriggerButton={
        <div className="w-full cursor-pointer">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-2">
                <Dna />
                <h3 className="text-lg font-semibold">{boar.breed}</h3>
              </div>
              <p className="text-muted-foreground">{boar.description || ""}</p>
              <div className="w-full flex gap-2 justify-end">
                <Button variant={"outline"}>ดูรายละเอียด</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <BoarDetailsCard boar={boar} />
    </DialogComponent>
  );
}
