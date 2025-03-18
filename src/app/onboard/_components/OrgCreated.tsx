"use client";

import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { OverviewCard } from "~/app/_components/OverviewCard";
import { Button } from "~/components/ui/button";

export function OrgCreated(props: { nextStepRoute: string }) {
  const { organization } = useOrganization();
  const { openOrganizationProfile } = useClerk();
  const { user } = useUser();

  if (!user) return null;
  if (!organization) return null;

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
        <Link href={props.nextStepRoute} className="w-full">
          <Button variant="outline" className="w-full">
            Go to next step
          </Button>
        </Link>
      </div>
    </>
  );
}
