import Link from "next/link";
import { OrgDropdownMenu } from "~/app/_components/OrgDropdownMenu";
import { OverviewCard } from "~/app/_components/OverviewCard";
import { type AppRouteKey } from "~/app/_domain/routes";
import { Button } from "~/components/ui/button";

export function OrgCreated(props: { nextStepRoute: AppRouteKey }) {
  return (
    <>
      <OverviewCard
        title={"Organization created"}
        subtitle={
          "You'll be able to change this anytime later from your account."
        }
        sections={[
          {
            title: "",
            content: <OrgDropdownMenu />,
          },
        ]}
        variant="neutral"
      />
      <div className="flex w-full flex-col gap-2">
        <Link href={props.nextStepRoute.toString()} className="w-full">
          <Button variant="outline" className="w-full">
            Go to next step
          </Button>
        </Link>
      </div>
    </>
  );
}
