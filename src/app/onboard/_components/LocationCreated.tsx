import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Labeled } from "~/app/_components/Labeled";
import { OverviewCard } from "~/app/_components/OverviewCard";
import { ROUTES } from "~/app/_domain/routes";
import { Button } from "~/components/ui/button";

export async function LocationCreated() {
  const { sessionClaims } = await auth();
  return (
    <>
      <OverviewCard
        title={"Location created"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled
                  label={"Name"}
                  text={sessionClaims?.metadata?.currentLocationName}
                />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
      <div className="flex w-full flex-col gap-2">
        <Link href={ROUTES.onboardOverview} className="w-full">
          <Button variant="outline" className="w-full">
            Go to next step
          </Button>
        </Link>
      </div>
    </>
  );
}
