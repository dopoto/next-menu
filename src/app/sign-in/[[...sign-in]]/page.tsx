import { SignIn } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";

export default function Page() {
  return (
    <SplitScreenContainer
      mainComponent={
        <SignIn
          forceRedirectUrl={"/my"}
          fallbackRedirectUrl={"/my"}
          appearance={{
            elements: {
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      }
      title={"Welcome back!"}
      subtitle={"Please sign in to continue"}
    ></SplitScreenContainer>
  );
}
