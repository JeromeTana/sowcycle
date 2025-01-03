import { createClient } from "@/utils/supabase/server";
import type { Sow } from "@/types/sow";
import { Breeding } from "@/types/breeding";
import Link from "next/link";

const SowCard = async ({ sow }: { sow: Sow }) => {
  const supabase = createClient();
  // get breedings for sow
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
};

const SowList = ({ sows }: { sows: Sow[] }) => (
  <div className="flex flex-col items-center justify-center gap-3">
    {sows.map((sow, index) => (
      <SowCard key={index} sow={sow} />
    ))}
  </div>
);

export default async function Page() {
  const supabase = createClient();

  const { data: sows } = (await supabase.from("sows").select()) as {
    data: Sow[];
  };
  const { data: breedings } = (await supabase.from("breedings").select()) as {
    data: Breeding[];
  };

  return (
    <div>
      {sows && <SowList sows={sows} />}
      <div>
        {breedings &&
          breedings.map((breeding, index) => (
            <div key={index}>{breeding.sow_id}</div>
          ))}
      </div>
    </div>
  );
}
