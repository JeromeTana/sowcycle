"use client";

import { createSow, updateSow } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { Sow } from "@/types/sow";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          name="name"
          placeholder="Name"
          onChange={onChange}
          className="border"
          value={sow.name}
        />
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button onClick={handleSubmit}>
          {editingSow?.id ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </div>
  );
}
