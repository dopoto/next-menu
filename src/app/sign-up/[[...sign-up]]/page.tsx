import {   SignUp } from "@clerk/nextjs";
import { PublicTopNav } from "~/app/_components/PublicTopNav";

export default function Page() {
    return (
    <div className="flex flex-col flex-nowrap p-4">
      <PublicTopNav />
      <SignUp
        appearance={{
          elements: {
            card: {
              border: "none",
              boxShadow: "none",
            },
          },
        }}
      />
    </div>
  );
}
