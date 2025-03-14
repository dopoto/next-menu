import { type PriceTier } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PriceTierCard } from "~/app/_components/PriceTierCard";
import SvgIcon from "~/app/_components/SvgIcons";

export function PlanChanged(props: { fromTier: PriceTier; toTier: PriceTier }) {
  return (
    <div className="flex flex-col flex-nowrap gap-4">
      <PriceTierCard tier={props.fromTier} isCurrent={false} />
      <SvgIcon
        kind={"arrowDoodle"}
        className={
          "fill-gray-500 stroke-gray-500 dark:fill-gray-400 dark:stroke-gray-400"
        }
      />
      <PriceTierCard tier={props.toTier} isCurrent={true} />
      <div className="flex w-full flex-col gap-2 pt-4">
        <Link href="/my" className="w-full">
          <Button variant="outline" className="w-full">
            Go back to my account
          </Button>
        </Link>
      </div>
    </div>
  );
}
