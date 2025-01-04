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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Link href={`/sows/${sow.id}`}>
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>{sow.name}</CardTitle>
          <CardDescription>
            {sow.birthdate ? new Date(sow.birthdate).toLocaleDateString() : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {latestBreedings && latestBreedings.actual_farrow_date === null ? (
              <>
                <div>
                  Farrow in{" "}
                  {Math.ceil(
                    (new Date(latestBreedings.expected_farrow_date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
                <div>
                  Breed at:{" "}
                  {new Date(latestBreedings.breed_date).toLocaleDateString()}
                </div>
                <div>
                  Expected farrow at:{" "}
                  {new Date(
                    latestBreedings.expected_farrow_date
                  ).toLocaleDateString()}
                </div>
              </>
            ) : (
              <div>No breedings</div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
