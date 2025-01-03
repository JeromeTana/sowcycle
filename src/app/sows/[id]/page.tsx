import BreedingForm from "@/components/Breeding/Form";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/server";

export default async function SowsPage({ params }: any) {
  const supabase = createClient();

  const { id } = await params;

  const { data: sow, error: sowErr } = (await supabase
    .from("sows")
    .select()
    .eq("id", id)
    .single()) as { data: Sow; error: any };

  const { data: breedings, error: breedingErr } = (await supabase
    .from("breedings")
    .select()
    .eq("sow_id", id)) as { data: Breeding[]; error: any };

  if (sowErr) return <div>error</div>;

  return (
    <div>
      <div className="w-full max-w-sm rounded overflow-hidden shadow-lg border">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{sow.name}</div>
        </div>
      </div>
      <div>
        <BreedingForm sow_id={id} />
        {breedings.length > 0 ? (
          <div>
            <div className="font-bold text-xl mb-2">Breedings</div>
            <div>
              {breedings.map((breeding, index) => (
                <div key={index}>
                  Breed at: {breeding.breed_date}
                  <br />
                  Expected farowwing at:
                  {breeding.expected_farrow_date}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No breedings</div>
        )}
      </div>
    </div>
  );
}
