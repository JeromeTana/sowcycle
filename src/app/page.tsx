import { createClient } from "@/utils/supabase/server";
import type { Sow } from "@/types/sow";
import { Breeding } from "@/types/breeding";
import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";

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
      <SowForm />
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
