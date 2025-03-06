import { Badge } from "~/components/ui/badge";
import { type PriceTierId } from "../_domain/price-tiers";
import { ChevronsUpDown } from "lucide-react";

export function TierPill(props: { priceTierId: PriceTierId }) {
  return (
    // <div className=" bg-gray-300 rounded-sm p-0.5">
    <Badge
      className="rounded-sm text-xs uppercase shadow-md"
      variant={"secondary"}
    >
      {props.priceTierId} <ChevronsUpDown />{" "}
    </Badge>
  );
}
