import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Breeding } from "@/types/breeding";

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
    </Card>
  );
}
