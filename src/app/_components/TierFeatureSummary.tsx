import { Badge } from "~/components/ui/badge";
 
// TODO revisit

export function TierFeatureSummary( ) {
  

  return (
    <div className="flex flex-col gap-4 w-full rounded-sm bg-gray-200 p-4 align-middle text-xs">
      <div className="flex grow-1 flex-col items-start justify-start gap-1 text-gray-600">
        <div>{"Your current plan"}</div>
        {/* <TierPill priceTierId={props.orgTier.priceTierId} showTierName={false} isExpandable={false} /> */}
      </div>
      <div className="flex grow-1 flex-col items-start justify-end gap-1 text-gray-600">
        {/* <div>{`Your ${props.orgTier.resourceSingularName} stats`}</div> */}

        <div className="flex gap-2">
          <Badge className="px-1 shadow-md" variant="secondary">
            Total
            <Badge className="bg-gray-300" variant="outline">
              {/* {quota} */}
            </Badge>
          </Badge>
          <Badge className="px-1 shadow-md" variant="secondary">
            Used
            <Badge className="bg-gray-300" variant="outline">
              {/* {used} */}
            </Badge>
          </Badge>
          <Badge className="px-1 shadow-md" variant="secondary">
            Available
            <Badge
              // className={`${available === 0 ? "bg-red-400 text-white" : "bg-emerald-700 text-white"}`}
              variant="outline"
            >
              {/* {available} */}
            </Badge>
          </Badge>
        </div>
      </div>
    </div>
  );
}
