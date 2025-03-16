import { getMenusByLocation } from "~/server/queries";
import { EmptyState } from "../../_components/EmptyState";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PlusCircle, ScanQrCode } from "lucide-react";
import MenuCard from "./_components/MenuCard";
import { locationIdSchema } from "../../_domain/locations";

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }

  const items = await getMenusByLocation(validationResult.data);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ScanQrCode size={36} />}
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
