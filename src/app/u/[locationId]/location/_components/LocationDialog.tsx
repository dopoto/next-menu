"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";

export   function LocationDialog(props: { children: ReactNode }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      //TODO detect if there's no page to go back to - e.g. when route is opened directly from bookmark
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        {/* <DialogHeader>
          <DialogTitle>Location</DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader> */}
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
