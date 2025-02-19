import {   SignUp } from "@clerk/nextjs";
import { PublicTopNav } from "~/app/_components/PublicTopNav";

export default function Page() {
    return (
    <div className="flex flex-col flex-nowrap items-center justify-center">
      <PublicTopNav />
      <SignUp />
    </div>
  );
}
