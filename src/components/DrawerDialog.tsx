import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        setDialog: setIsOpen,
      } as ChildElementProps);
    }
    return child;
  });

  if (isDesktop) {
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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{dialogTriggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <p className="text-lg font-semibold">{title}</p>
          </DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[80vh] overflow-auto px-4 pb-4">{enhancedChildren}</div>
      </DrawerContent>
    </Drawer>
  );
}
