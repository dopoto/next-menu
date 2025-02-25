import { SignUp } from "@clerk/nextjs";
import { SplitScreenOnboard } from "~/app/_components/SplitScreenOnboard";

export default async function Page() {
  return (
    <SplitScreenOnboard
      step={1}
      mainComponent={<SignUp />}
    ></SplitScreenOnboard>
  );
}
