import { CloudAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function NoQuotaLeft(props: { title: string }) {
  // TODO revisit NoQuotaLeft
  return (
    <div className="animate-in fade-in-50 flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-2 text-center">
        <CloudAlert size="36" className="text-amber-700" />
        <h3 className="text-lg font-semibold text-amber-700">{props.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Not to worry, you can get more by upgrading your plan
        </p>
        {/* <TierFeatureSummary orgTier={props.orgTier} /> */}
        <Button className="w-full" variant="secondary" asChild>
          <Link href={"/change-plan"}>Upgrade</Link>
        </Button>
      </div>
    </div>
  );
}
