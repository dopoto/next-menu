import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div>Logo</div>
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