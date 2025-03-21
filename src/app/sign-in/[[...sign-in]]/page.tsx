import { SignIn } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";

// TODO Test - sign in, but with new account (user + pass)

export default function Page() {
  return (
    <SplitScreenContainer
      mainComponent={
        <SignIn
           
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
