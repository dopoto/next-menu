import { Badge } from "~/components/ui/badge";
import { priceTiers, type PriceTierId } from "../_domain/price-tiers";
import { ChevronsUpDown } from "lucide-react";
import { isPriceTierId } from "../_utils/price-tier-utils";

export function TierPill(props: {
  priceTierId: PriceTierId;
  showTierName: boolean;
  isExpandable: boolean;
}) {
  if (!isPriceTierId(props.priceTierId)) {
    return null;
  }
  const parsedToTier = priceTiers[props.priceTierId];

  return (
    <Badge
      className="rounded-sm text-xs uppercase shadow-md"
      variant={"secondary"}
    >
      {props.showTierName && parsedToTier.name}

      {/* TODO Handle behavior: */}
      {props.isExpandable && <ChevronsUpDown />}
    </Badge>
  );
}
