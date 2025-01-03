import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { Sow } from "@/types/sow";

const SowCard = ({ sow }: { sow: Sow }) => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{sow.name}</div>
      <p className="text-gray-700 text-base">{sow.is_available}</p>
      {/* Add more fields as needed */}
    </div>
  </div>
);

const SowList = ({ sows }: { sows: Sow[] }) => (
  <div className="flex flex-wrap justify-center">
    {sows.map((sow, index) => (
      <SowCard key={index} sow={sow} />
    ))}
  </div>
);

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: sows } = await supabase.from("Sows").select();

  return <SowList sows={sows!} />;
}
