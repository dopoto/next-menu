import Link from "next/link";
import * as React from "react";
import { Button } from "~/components/ui/button";

export async function Onboarded() {
  return (
    <div className="flex max-w-[400px] flex-col gap-6">
      <Button>
        <Link href={"/my"}>Take me to my dashboard</Link>
      </Button>
    </div>
  );
}
