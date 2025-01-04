"use client";

import { createSow, updateSow } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { Sow } from "@/types/sow";
import { useEffect, useState } from "react";

export default function SowForm() {
  const [sow, setSow] = useState<Sow>({} as Sow);
  const {
    editingSow,
    setEditingSow,
    addSow: createSowState,
    updateSow: updateSowState,
  } = useSowStore();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSow({ ...sow, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingSow) {
      let res = await updateSow(sow);
      updateSowState(res);
      setEditingSow(null);
    } else {
      let res = await createSow(sow);
      createSowState(res);
    }
  };

  useEffect(() => {
    if (editingSow) {
      setSow(editingSow);
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
        {editingSow?.id ? "Update" : "Create"}
      </button>
    </div>
  );
}
