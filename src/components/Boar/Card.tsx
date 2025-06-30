"use client";

import { Boar } from "@/types/boar";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna } from "lucide-react";

export default function BoarCard({ boar }: { boar: Boar }) {
  return (
    <Link href={`/boars/${boar.id}`} className="w-full">
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna />
            {boar.breed}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
