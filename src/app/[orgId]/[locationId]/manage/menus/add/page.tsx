
import { auth } from "@clerk/nextjs/server";
import AddMenuDialog from "../../_components/AddMenuDialog";
import { defaultTier, type OrgTier, type PriceTierId, PriceTierIdSchema } from "~/app/_domain/price-tiers";

export default async function AddMenuPage() {
 
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;
  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  // TODO revisit. or maybe just always trust JWT token
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const orgTier: OrgTier = {
    priceTierId: parsedOrDefaultTier,
    quota: 1,
    used: 0,
    available: 1
  }

  console.log('Add menu page')

  
  return (
    <AddMenuDialog orgTier={orgTier} />
  );
}
