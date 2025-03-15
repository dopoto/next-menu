import { getMenusByLocation } from "~/server/queries";
import { locationIdSchema } from "~/app/_domain/location";
import { EmptyState } from "../../_components/EmptyState";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type * as schema from "~/server/db/schema";
import MenuCard from "../_components/MenuCard";

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO new error component
    // return <BoxError errorTypeId={"MENUS_INVALID_PARAM"} />;
  }

  //TODO
  const parsedLocationId = validationResult.data;
  const items: schema.Menu[] = await getMenusByLocation(parsedLocationId!);

  if (items.length === 0) {
    return (
      <EmptyState
        title={"No menus found"}
        secondary={"This location does not have any menus yet. Add one below."}
        cta={"Add menu"}
        ctaHref={"menus/add"}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-end">
        <Button asChild>
          <Link href={"menus/add"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add menu
          </Link>
        </Button>
      </div>
      <div>
        {items.map((menu) => (
          <MenuCard key={menu.id} item={menu} />
        ))}
      </div>
    </div>
  );
}
