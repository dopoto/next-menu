import { SignIn } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { APP_CONFIG } from "~/app/_config/app-config";

// TODO Test - sign in, but with new account (user + pass)

export const metadata = {
  title: `${APP_CONFIG.appName} - Sign in`,
}

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
