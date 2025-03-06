import { Badge } from "~/components/ui/badge";
import { type OrgTier } from "../_domain/price-tiers";
import { TierPill } from "./TierPill";

export function TierFeatureSummary(props: { orgTier: OrgTier }) {
  const { quota, used, available } = props.orgTier;

  return (
    <div className="flex flex-row gap-2 rounded-sm bg-gray-200 p-1 align-middle text-xs px-2">
      <div className="flex grow-1 items-center justify-start gap-1 text-gray-600">
        <div>{"Your plan:"}</div>
        <TierPill priceTierId={props.orgTier.priceTierId} />
      </div>
      <div className="flex grow-1 items-center justify-end gap-1 text-gray-600">
        <div>{"Your  menu stats:"}</div>

        <Badge className="px-1 shadow-md" variant="secondary">
          Total
          <Badge className="bg-gray-300" variant="outline">
            {quota}
          </Badge>
        </Badge>
        <Badge className="px-1 shadow-md" variant="secondary">
          Used
          <Badge className="bg-gray-300" variant="outline">
            {used}
          </Badge>
        </Badge>
        <Badge className="px-1 shadow-md" variant="secondary">
          Available
          <Badge
            className={`${available === 0 ? "bg-red-400 text-white" : "bg-emerald-700 text-white"}`}
            variant="outline"
          >
            {available}
          </Badge>
        </Badge>
      </div>
    </div>
  );
}
