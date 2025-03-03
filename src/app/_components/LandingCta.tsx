import Link from "next/link";
import { PageSubtitle } from "./PageSubtitle";
import { PageTitle } from "./PageTitle";
import { Button } from "~/components/ui/button";

export const LandingCta: React.FC = () => {
  return (
    <div className="bg-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <h2 className="flex flex-col text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          <PageTitle textColor="text-accent">Ready to dive in?</PageTitle>
          <PageSubtitle textColor="text-secondary">
            Create a free account now!
          </PageSubtitle>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <Link href="/sign-up">
            <Button variant={"secondary"} size={"lg"}>
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
