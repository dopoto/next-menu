import { CrownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ROUTES } from "~/lib/routes";
import { Button } from "~/components/ui/button";

export function NoQuotaLeft(props: { title: string }) {
  return (
    <div className="animate-in fade-in-50 flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mx-auto flex flex-col items-center justify-center gap-2 text-center">
        <CrownIcon size="36" className="text-amber-700" />
        <h3 className="text-lg font-semibold text-amber-700">{props.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Not to worry, you can get more by upgrading your plan.
        </p>
        <Button className="w-full" variant="default" asChild>
          <Link href={ROUTES.changePlan}>Change plan</Link>
        </Button>
        <Button className="w-full" variant="secondary" asChild>
          <Link href={ROUTES.viewPlan}>View plan usage</Link>
        </Button>
      </div>
    </div>
  );
}
