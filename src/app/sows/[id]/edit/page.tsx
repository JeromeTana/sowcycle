import SowForm from "@/components/Sow/Form";
import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function SowEdit({ params }: any) {
  const supabase = createClient();

  const { id } = await params;

  const { data: sow, error: sowErr } = (await supabase
    .from("sows")
    .select()
    .eq("id", id)
    .single()) as { data: Sow; error: any };

  return (
    <div>
      <SowForm edittingSow={sow} />
    </div>
  );
}
