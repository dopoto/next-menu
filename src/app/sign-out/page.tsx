import { SignOutButton } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { Button } from "~/components/ui/button";

export default async function SignOutPage() {
  return (
    <SplitScreenContainer
      mainComponent={
        <SignOutButton redirectUrl="/">
          <Button>Sign out</Button>
        </SignOutButton>
      }
      title={"Hope to see you again soon!"}
      subtitle={"Click the button below to sign out"}
    ></SplitScreenContainer>
  );
}
