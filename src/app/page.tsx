import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";


export default async function HomePage() {
  
  return (
    <main>      
      <h1>Home page</h1>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        You are signed in.
        <br/><br/>
        <Link href="/manager">
        <Button>Go to Manager</Button>
        </Link>
      </SignedIn>
    </main>
  );
}
