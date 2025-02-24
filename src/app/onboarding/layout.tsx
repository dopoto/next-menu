import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PublicTopNav } from "../_components/PublicTopNav";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/onboarded");
  }

  return (
    <>
      <PublicTopNav>
        <div className="ml-auto">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </PublicTopNav>
      {children}
    </>
  );
}
