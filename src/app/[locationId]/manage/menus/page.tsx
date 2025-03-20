import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { locationIdSchema } from "../../_domain/locations";
import { Suspense } from "react";
import { MenusList } from "./_components/MenusList";
import LoadingSection from "../../_components/LoadingSection";
import { ROUTES } from "~/app/_domain/routes";

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex flex-row justify-end">
        <Button asChild>
          <Link href={ROUTES.manageRelativeMenusAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add menu
          </Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingSection />}>
        <MenusList locationId={validationResult.data} />
      </Suspense>
    </div>
  );
}
