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
import { Card } from "~/components/ui/card";
import { ThemeSwitch } from "./_components/ThemeSwitch";

export default async function HomePage() {
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center">
      <PublicTopNav>
        <div className="ml-auto">
          <SignedOut>
            <SignInButton /> | <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </PublicTopNav>

      <h1 className="text-blue-300 dark:text-red-200">Home page</h1>

      <Card >sdsd</Card>

      
      <>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          You are signed in.
          <br />
          <br />
          <SignOutButton />
          <br />
          <br />
          <Link href="/my">
            <Button>Go to Dash</Button>
          </Link>           
        </SignedIn>
      </>

      <ThemeSwitch />
    </div>
  );
}
