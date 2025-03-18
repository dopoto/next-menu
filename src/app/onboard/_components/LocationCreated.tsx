import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { OverviewCard } from "~/app/_components/OverviewCard";
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
            content: <div>{sessionClaims?.metadata?.currentLocationName}</div>,
          },
        ]}
        variant="neutral"
      />
      <div className="flex w-full flex-col gap-2">
        <Link href="/onboard/overview" className="w-full">
          <Button variant="outline" className="w-full">
            Go to next step
          </Button>
        </Link>
      </div>
    </>
  );
}
