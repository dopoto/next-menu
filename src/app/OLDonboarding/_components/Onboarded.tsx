import Link from "next/link";
import * as React from "react";
import { Button } from "~/components/ui/button";

//TODO Add overview 

export async function Onboarded() {
  return (
    <div className="flex max-w-[400px] flex-col gap-6">
      <Link className="w-full" href={"/my"}>
        <Button className="w-full">Take me to my dashboard</Button>
      </Link>
    </div>
  );
}
