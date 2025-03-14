 
import { CloudAlert } from "lucide-react";
import Link from "next/link";
import { TierFeatureSummary } from "~/app/_components/TierFeatureSummary";
import { type OrgTier } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";

export function NoQuotaLeft(props: {
  title: string;
  orgTier: OrgTier 
}) {
 

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center gap-2">
      <CloudAlert size="36" className="  text-amber-700"/>
        <h3 className=" text-lg font-semibold text-amber-700">{props.title}</h3>
        <p className="mb-4   text-sm text-muted-foreground">Not to worry, you can get more by upgrading your plan</p>
        <TierFeatureSummary orgTier={props.orgTier} />
        <Button className="w-full" variant="secondary" asChild>
          <Link href={"/change-plan"}>
             
            Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
}
