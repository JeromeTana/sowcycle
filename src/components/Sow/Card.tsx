import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import React from "react";

export default async function SowCard({ sow }: { sow: Sow }) {
  const supabase = createClient();
  let { data: breedings } = (await supabase
    .from("breedings")
    .select()
    .eq("sow_id", sow.id)) as { data: Breeding[] };

  return (
    <Link
      href={`/sows/${sow.id}`}
      className="w-full max-w-sm rounded overflow-hidden shadow-lg border"
    >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{sow.name}</div>
        <div>
          {breedings && breedings.length > 0 ? (
            <div>
              <div className="font-bold text-xl mb-2">Breedings</div>
              <div>
                {breedings.map((breeding, index) => (
                  <div key={index}>Breed at: {breeding.breed_date}</div>
                ))}
              </div>
            </div>
          ) : (
            <div>No breedings</div>
          )}
        </div>
      </div>
    </Link>
  );
}
