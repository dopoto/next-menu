// import { CheckIcon } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "~/components/ui/card";
// import { type PriceTier } from "../_domain/price-tiers";
// import { PageSubtitle } from "./PageSubtitle";
// import { PricingCardCta } from "./PricingCardCta";

// const getFeatureRow = (
//   singularName: string,
//   pluralName: string,
//   max: number,
// ) => {
//   if (max === -1) return `Please contact us`;
//   if (max === 0) return null;

//   return (
//     <div className="flex flex-row items-center gap-1">
//       <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
//       <div>{`${max} ${max > 1 ? pluralName : singularName}`}</div>
//     </div>
//   );
  
// };

// const getPrice = (monthlyUsdPrice: number) => {
//   if (monthlyUsdPrice === -1) return `__.__`;
//   if (monthlyUsdPrice === 0) return (
//     <div className="mt-2">
//       <span className="text-4xl font-bold">FREE</span>      
//     </div>
//   );
//   return (
//     <div className="mt-2">
//       <span className="text-4xl font-bold">${monthlyUsdPrice.toFixed(2)}</span>
//       <span className="text-muted-foreground ml-1 text-2xl font-light">
//         /month
//       </span>
//     </div>
//   );
// };

// export function PricingCard(props: { tier: PriceTier }) {
//   const {
//     id,
//     name,
//     description,
//     monthlyUsdPrice,
//     locations,
//     menus,
//     staffMembers,
//     isPopular,
//   } = props.tier;

//   return (
//     <Card>
//       <CardHeader className={`relative flex flex-col h-full`}>
//         {isPopular && (
//           <div className="absolute top-5 -right-2 z-10 rotate-4 transform bg-red-700 px-2 py-1 text-sm font-medium text-white shadow-md">
//             Our most popular plan!
//           </div>
//         )}
//         <CardTitle className='font-light text-3xl'>
//           {name}
//         </CardTitle>
//         <div className="text-4xl font-medium">{getPrice(monthlyUsdPrice)}</div>
//         <CardDescription>
//           <PageSubtitle>{description}</PageSubtitle>
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col flex-nowrap gap-2 text-sm">
//           {getFeatureRow("location", "locations", locations)}
//           {getFeatureRow("menu", "menus", menus)}
//           {getFeatureRow("staff members", "staff members", staffMembers)}      
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between sticky bottom-0"> 
//         <PricingCardCta tierId={id} />
//       </CardFooter>
//     </Card>
//   );
// }
