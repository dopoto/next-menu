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
import { type OrgTier } from "~/app/_domain/price-tiers";

export default function AddMenuDialog(props: { orgTier: OrgTier }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a menu</DialogTitle>
          <DialogDescription>
            TODO Lorem ipsum
          </DialogDescription>
          <AddMenu orgTier={props.orgTier} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
