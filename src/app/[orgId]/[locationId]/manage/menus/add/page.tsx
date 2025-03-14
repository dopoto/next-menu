import { auth } from "@clerk/nextjs/server";
import AddMenuDialog from "../../_components/AddMenuDialog";
import {
  defaultTier,
 
  PriceTierIdSchema,
  priceTiers,
} from "~/app/_domain/price-tiers";
import { getMenusByLocation } from "~/server/queries";
import { locationIdSchema } from "~/app/_domain/location";
 

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO new error component
    //return <BoxError errorTypeId={"MENUS_INVALID_PARAM"} />;
  }
  const parsedLocationId = validationResult.data;

  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;
  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  // TODO revisit. or maybe just always trust JWT token
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

    //TODO
  const menus = await getMenusByLocation(parsedLocationId!);

  // const quota = priceTiers[parsedOrDefaultTier].menus;
  // const orgTier: OrgTier = {
  //   priceTierId: parsedOrDefaultTier,
  //   resourceSingularName: 'menu',
  //   resourcePluralName: 'menus',
  //   quota,
  //   used: menus.length,
  //   available: quota - menus.length,
  // };

  return <AddMenuDialog   />;
}
