"use client";

import { Breeding } from "@/types/breeding";
import { Boar } from "@/types/boar";
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
import {
  Calendar,
  CalendarCheck,
  CalendarHeart,
  Check,
  Heart,
  PiggyBank,
  Plus,
} from "lucide-react";

import { FarrowForm, NewBreedingForm } from "../Breeding/Form";
import DialogComponent from "../DialogComponent";
import { cn } from "@/lib/utils";

export default function BoarCard({ boar }: { boar: Boar }) {
  const latestBreeding = boar.breedings?.[0];

  return (
    <Card className={cn("w-full")}>
      <CardHeader>
        <CardTitle>{boar.breed}</CardTitle>
      </CardHeader>
      {/* <CardContent></CardContent> */}
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
