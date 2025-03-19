import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Labeled } from "~/app/_components/Labeled";
import { OverviewCard } from "~/app/_components/OverviewCard";
import { PublicStripeSubscriptionDetails } from "~/app/_domain/stripe";
import { getValidPriceTier } from "~/app/_utils/price-tier-utils";
import { obj2str } from "~/app/_utils/string-utils";
import { Button } from "~/components/ui/button";

export const Overview = async (props: {
  claims: CustomJwtSessionClaims;
  publicStripeSubscriptionDetails: PublicStripeSubscriptionDetails;
}) => {
  const priceTierId = props.claims?.metadata?.tier;
  const parsedTier = getValidPriceTier(priceTierId);
  const user = await currentUser()
  return (
    <div className="flex w-full flex-col gap-1">
      <OverviewCard
        title={"Your plan"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled label={"Name"} text={parsedTier?.name} />
                <Labeled
                  label={"Price"}
                  text={`${parsedTier?.monthlyUsdPrice.toFixed(2)} USD/month`}
                />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
      <OverviewCard
        title={"Your account"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled
                  label={"Email"}
                  text={`${user?.emailAddresses[0]?.emailAddress}`}
                />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
      <OverviewCard
        title={"Your organization"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled
                  label={"Name"}
                  text={props.claims?.metadata?.orgName}
                />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
      {props.publicStripeSubscriptionDetails && (
        <OverviewCard
          title={"Your subscription details"}
          sections={[
            {
              title: "",
              content: (
                <div className="mt-2 flex flex-col flex-nowrap gap-2">
                  <Labeled
                    label={"Subscription Id"}
                    text={props.publicStripeSubscriptionDetails.id?.toString()}
                  />
                  <Labeled
                    label={"Renewal date"}
                    text={new Date(
                      props.publicStripeSubscriptionDetails.current_period_end *
                        1000,
                    ).toLocaleDateString()}
                  />
                </div>
              ),
            },
          ]}
          variant="neutral"
        />
      )}
      <div className="flex flex-col gap-6">
        <Link className="w-full" href={"/my"}>
          <Button className="w-full">Take me to my dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
