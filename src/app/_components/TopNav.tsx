import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SomeTopNavBtn } from "./some-top-nav-btn";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <Link href="/">Home</Link>
      <Link href="/manager">Manage</Link>
      <SomeTopNavBtn />
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}