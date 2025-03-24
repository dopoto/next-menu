import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ROUTES } from "~/app/_domain/routes";
import { Suspense } from "react";
import LoadingSection from "../_components/LoadingSection";
import { locationIdSchema } from "../_domain/locations";
import { MenusList } from "./_components/MenusList";

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;

  const locationValidationResult = locationIdSchema.safeParse(params.locationId);
  if (!locationValidationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-row justify-end">
        <Button asChild>
          <Link href={ROUTES.menusAdd(locationValidationResult.data)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add menu
          </Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingSection />}>
        <MenusList locationId={locationValidationResult.data} />
      </Suspense>
    </div>
  );
}
