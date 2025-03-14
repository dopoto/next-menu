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
import { NoQuotaLeft } from "../../_components/NoQuotaLeft";

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
        {props.orgTier.available > 0 && (
          <>
            <DialogHeader>
              <DialogTitle>Add a menu</DialogTitle>
              <DialogDescription>
                Fill the form below to create a menu.
              </DialogDescription>
            </DialogHeader>
            <AddMenu  />
          </>
        )}
        {props.orgTier.available <= 0 && (
          <>
            <DialogHeader>
              <DialogTitle>Add a menu</DialogTitle>
              <DialogDescription>
                 {' '}
              </DialogDescription>
            </DialogHeader>
            
            <NoQuotaLeft title={"You ran out of menus..."} orgTier={props.orgTier} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
