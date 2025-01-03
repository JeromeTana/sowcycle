"use client";

import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function SowForm() {
  const supabase = createClient();
  const [sow, setSow] = useState<Sow>({} as Sow);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSow({ ...sow, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await supabase.from("sows").upsert([sow]);
      window.location.reload();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="text-black">
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={onChange}
        className="border"
      />
      <button className="bg-white" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
}
