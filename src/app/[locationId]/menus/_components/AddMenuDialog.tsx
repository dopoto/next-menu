"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AddMenu } from "./AddMenu";
import { NoQuotaLeft } from "../../_components/NoQuotaLeft";

export default function AddMenuDialog(props: { availableQuota: number }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };
  if (props.availableQuota <= 0) {
    return (
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a menu</DialogTitle>
            <DialogDescription> </DialogDescription>
          </DialogHeader>
          <NoQuotaLeft title={"Sorry, you ran out of menus..."} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a menu</DialogTitle>
          <DialogDescription>
            Fill the form below to create a menu.
          </DialogDescription>
        </DialogHeader>
        <AddMenu />
      </DialogContent>
    </Dialog>
  );
}
