"use client";

import { Boar } from "@/types/boar";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna } from "lucide-react";

export default function BoarCard({ boar }: { boar: Boar }) {
  return (
    <Link href={`/boars/${boar.id}`} className="w-full">
      <Card className="shadow">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Dna />
            <h3 className="text-lg font-semibold">{boar.breed}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
