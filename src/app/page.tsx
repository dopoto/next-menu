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
import SvgIcon from "./_components/SvgIcons";
import { PublicTopNav } from "./_components/PublicTopNav";

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

      <h1>Home page</h1>
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
          <Link href="/manager">
            <Button>Go to Manager</Button>
          </Link>
        </SignedIn>
      </>
    </div>
  );
}
