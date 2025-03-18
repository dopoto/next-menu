"use client";

import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { OverviewCard } from "~/app/_components/OverviewCard";
import { priceTiers, type PriceTierId } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";

export function OrgCreated() {
  const { organization } = useOrganization();
  const { openOrganizationProfile } = useClerk();
  const { user } = useUser();

  if (!user) return null;
  if (!organization) return null;

  const priceTierId: PriceTierId = user.publicMetadata.tier as PriceTierId;
  const tier = priceTiers[priceTierId];

  return (
    <>
      <OverviewCard
        title={"Organization created"}
        sections={[
          {
            title: "",
            content: (
              <div onClick={() => openOrganizationProfile()}>
                {organization.name}
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
      <div className="flex w-full flex-col gap-2">
            <Link href="/onboard/add-location" className="w-full">
              <Button variant="outline" className="w-full">
                Go to next step
              </Button>
            </Link>
            
          </div>
    </>
  );
}
//  <div onClick={() => openOrganizationProfile()}>{organization.name}
//     </div>
