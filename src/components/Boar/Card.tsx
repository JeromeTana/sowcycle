"use client";

import { Boar } from "@/types/boar";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Dna } from "lucide-react";

export default function BoarCard({ boar }: { boar: Boar }) {
  const latestBreeding = boar.breedings?.[0];

  return (
    <Card className={cn("w-full")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna />
          {boar.breed}
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/boars/${boar.id}`}>
            <Button variant={"ghost"}>ดูรายละเอียด</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
