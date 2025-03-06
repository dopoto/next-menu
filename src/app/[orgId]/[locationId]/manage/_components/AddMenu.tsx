import { TierFeatureSummary } from "~/app/_components/TierFeatureSummary";
import { type OrgTier } from "~/app/_domain/price-tiers";

export function AddMenu(props: { orgTier: OrgTier }) {
  console.log("add menu compo");

  return (
    <div>
      <TierFeatureSummary orgTier={props.orgTier} />
      add menu compinoet
    </div>
  );
}
