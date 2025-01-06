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

type ChildElementProps = {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DialogComponent({
  children,
  title,
  dialogTriggerButton,
}: DialogComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        setDialog: setIsOpen,
      } as ChildElementProps);
    }
    return child;
  });
  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{dialogTriggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="font-bold">{title}</p>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-auto">{enhancedChildren}</div>
      </DialogContent>
    </Dialog>
  );
}
