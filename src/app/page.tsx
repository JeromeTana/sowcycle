"use client";

import { createClient } from "@/utils/supabase/client";
import type { Sow } from "@/types/sow";
import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";
import { useEffect, useState } from "react";

export default function Page() {
  const supabase = createClient();
  const [sows, setSows] = useState<Sow[]>([]);

  const getAllSows = async () => {
    const { data, error } = (await supabase
      .from("sows")
      .select()
      .order("created_at", { ascending: false })) as {
      data: Sow[];
      error: any;
    };

    if (error) {
      console.log(error);
      return;
    }
    setSows(data);
  };

  useEffect(() => {
    getAllSows();
    return () => {};
  }, []);

  if (!sows) return <div>Loading...</div>;

  return (
    <div>
      <SowForm />
      <SowList sows={sows} />
    </div>
  );
}
