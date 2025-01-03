"use client";

import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SowForm({ edittingSow }: { edittingSow?: Sow }) {
  const supabase = createClient();
  const [sow, setSow] = useState<Sow>({} as Sow);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSow({ ...sow, [e.target.name]: e.target.value });
  };

  const createSow = async () => {
    try {
      const { data, error } = await supabase
        .from("sows")
        .insert([sow])
        .select()
        .single();
      if (error) {
        console.log(error);
        return;
      }
      router.push(`/sows/${data.id}`);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const updateSow = async () => {
    try {
      const { data, error } = await supabase
        .from("sows")
        .update([sow])
        .eq("id", sow.id)
        .select()
        .single();
      if (error) {
        console.log(error);
        return;
      }
      router.push(`/sows/${data.id}`);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (edittingSow) {
      updateSow();
    } else {
      createSow();
    }
  };

  useEffect(() => {
    if (edittingSow) {
      setSow(edittingSow);
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={onChange}
        className="border"
        value={sow.name}
      />
      <button onClick={handleSubmit}>
        {edittingSow?.id ? "Update" : "Create"}
      </button>
    </div>
  );
}
