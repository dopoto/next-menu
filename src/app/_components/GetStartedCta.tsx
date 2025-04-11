"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { type PriceTierId } from "../_domain/price-tiers";
import { ROUTES } from "../_domain/routes";

export function GetStartedCta(props: {
  tier?: PriceTierId;
  secondaryText?: string;
  variant: "default" | "outline";
}) {
  return (
    <>
      <SignedIn>
        <SignedInCta variant={props.variant} tier={props.tier} />
      </SignedIn>
      <SignedOut>
        <SignedOutCta
          variant={props.variant}
          secondaryText={props.secondaryText}
          tier={props.tier}
        />
      </SignedOut>
    </>
  );
}

function SignedInCta(props: {
  tier?: PriceTierId;
  secondaryText?: string;
  variant: "default" | "outline";
}) {
  const { user } = useUser();

  if (props.tier == null) {
    return (
      <Link className="w-full" href={ROUTES.my}>
        <Button className="w-full" variant={props.variant}>
          Go to my account
        </Button>
      </Link>
    );
  }

  const userTier = user?.publicMetadata?.tier;
  const isOnThisTier = userTier != null && userTier === props.tier;

  if (isOnThisTier) {
    return (
      <div className="relative flex w-full flex-col gap-1">
        <Link href={ROUTES.my} className="w-full">
          <Button className="w-full" variant={props.variant}>
            Go to my account
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link className="w-full" href={ROUTES.changePlanTo(props?.tier)}>
      <Button className="w-full" variant={props.variant}>
        Switch to this plan
      </Button>
    </Link>
  );
}

function SignedOutCta(props: {
  tier?: PriceTierId;
  secondaryText?: string;
  variant: "default" | "outline";
}) {
  const signUpLink = props.tier
    ? ROUTES.signUpForPriceTier(props.tier)
    : ROUTES.signUp;
  return (
    <>
      <Link className="w-full" href={signUpLink}>
        <Button className="w-full" variant={props.variant}>
          Get started
        </Button>
      </Link>
      {props.secondaryText && (
        <p className="mt-3 text-sm text-gray-500 italic">
          {props.secondaryText}
        </p>
      )}
    </>
  );
}
