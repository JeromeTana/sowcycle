import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogComponentProps = {
  children: React.ReactNode;
  title: string;
  dialogTriggerButton: React.ReactNode;
};

export default function DialogComponent({
  children,
  title,
  dialogTriggerButton,
}: DialogComponentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTriggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="font-bold">{title}</p>
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
