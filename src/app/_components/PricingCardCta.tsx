import Link from "next/link";
import { Button } from "~/components/ui/button";
import { type PriceTierId } from "../_domain/price-tiers";
import { auth } from "@clerk/nextjs/server";

export async function PricingCardCta(props: { tierId: PriceTierId }) {
  const currentUserTier = (await auth()).sessionClaims?.metadata
    ?.tier as PriceTierId;

  if (currentUserTier) {
    if (currentUserTier === props.tierId) {
      return (
        <div className="flex flex-col w-full gap-1">
          <span className="text-xs text-pop text-center">You are already on this tier</span>
          <Link href={`/my`} className="w-full">
            <Button className="w-full" variant="default">
              Go to my account
            </Button>
          </Link>
        </div>
      );
    } else {
      return (
        //  TODO Upgrade
          <Button className="w-full" variant="default" disabled>
            Get started
          </Button>
         
      );
    }
  }

  return (
    <Link href={`/sign-up?tier=${props.tierId}`} className="w-full">
      <Button className="w-full" variant="default">
        Get started!
      </Button>
    </Link>
  );
}
