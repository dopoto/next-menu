import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { PublicTopNav } from "./_components/PublicTopNav";
import { ThemeSwitch } from "./_components/ThemeSwitch";
import { PageTitle } from "./_components/PageTitle";
import { PageSubtitle } from "./_components/PageSubtitle";
import { Pricing } from "./_components/Pricing";

export default async function HomePage() {
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center gap-4 p-5">
      <PublicTopNav>
        <div className="ml-auto">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </PublicTopNav>

      <SignedOut>
        <PageTitle>Welcome!</PageTitle>
        <PageSubtitle>
          Please sign in or choose a tier to continue
        </PageSubtitle>
      </SignedOut>

      <>
        <SignedOut>
          <div className="flex w-full flex-col justify-center gap-3 align-middle">
            <div className="text-center">
              <SignInButton />  
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex w-full flex-col justify-center gap-3 text-center align-middle">
            <Link href="/my">
              <Button>Go to Dashboard</Button>
            </Link>
            <SignOutButton />
          </div>
        </SignedIn>
      </>

      <Pricing />

      <ThemeSwitch />
    </div>
  );
}
