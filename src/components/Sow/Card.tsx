"use client";

import { getBreedingsBySowId } from "@/services/breeding";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { FarrowForm } from "../Breeding/Form";

export default function SowCard({ sow }: { sow: Sow }) {
  const [latestBreedings, setLatestBreedings] = useState<Breeding>(
    {} as Breeding
  );

  useEffect(() => {
    let fetchBreedings = async () => {
      const breedings = await getBreedingsBySowId(sow.id);
      if (breedings) {
        setLatestBreedings(breedings[0]);
      }
    };
    fetchBreedings();
    return () => {};
  }, []);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{sow.name}</CardTitle>
        <CardDescription>
          {sow.birthdate ? new Date(sow.birthdate).toLocaleDateString() : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {latestBreedings?.actual_farrow_date === null ? (
            <>
              <div>
                คลอดภายใน{" "}
                {Math.ceil(
                  (new Date(latestBreedings.expected_farrow_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                วัน
              </div>
              <div>
                ทับวันที่:{" "}
                {new Date(latestBreedings.breed_date).toLocaleDateString()}
              </div>
              <div>
                คาดว่าจะคลอดวันที่:{" "}
                {new Date(
                  latestBreedings.expected_farrow_date
                ).toLocaleDateString()}
              </div>
            </>
          ) : (
            <div>ไม่ได้ตั้งครรภ์</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/sows/${sow.id}`}>
            <Button variant={"secondary"}>ดูรายละเอียด</Button>
          </Link>
          {latestBreedings?.actual_farrow_date === null && (
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <Button>
                    <Check /> บันทึกการคลอด
                  </Button>
                </div>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <p className="font-bold">บันทึกการคลอด</p>
                  </DialogTitle>
                </DialogHeader>
                <FarrowForm breeding={latestBreedings} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
