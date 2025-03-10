// import { type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
// import { Button } from "~/components/ui/button";
// import Link from "next/link";
// import { getPriceTierChangeScenario } from "~/app/_utils/price-tier-utils";

// export function StripeSubscriptionManagement(props: {
//   fromTierId: PriceTierId;
//   toTierId: PriceTierId;
// }) {
//   let buttonText = "";
//   let buttonVariant: "default" | "destructive" = "default";
//   let changeUrl = "";

//   const toName = priceTiers[props.toTierId].name;

//   const changePlanScenario = getPriceTierChangeScenario(
//     props.fromTierId,
//     props.toTierId,
//   );
//   switch (changePlanScenario) {
//     case "free-to-paid":
//       buttonText = `Subscribe to ${toName}`;
//       changeUrl = `/change-plan/subscribe?toTierId=${props.toTierId}`;
//       break;
//     case "free-to-free":
//       buttonText = `Change to ${toName}`;
//       changeUrl = `/change-plan/subscribe?toTierId=${props.toTierId}`;
//       break;
//     case "paid-to-free":
//       buttonText = "Cancel Subscription";
//       buttonVariant = "destructive";
//       changeUrl = `/change-plan/cancel`;
//       break;
//     case "paid-to-paid-upgrade":
//       buttonText = `Upgrade to ${toName}`;
//       changeUrl = `/change-plan/modify?targetTierId=${props.toTierId}`;
//       break;
//     case "paid-to-paid-downgrade":
//       buttonText = `Downgrade to ${toName}`;
//       changeUrl = `/change-plan/modify?targetTierId=${props.toTierId}`;
//       break;
//     default:
//       return null;
//   }

//   return (
//     <Link href={changeUrl} className="w-full">
//       <Button variant={buttonVariant} className="w-full">
//         {buttonText}
//       </Button>
//     </Link>
//   );
// }
