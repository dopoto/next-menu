"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
 
export function Onboarded({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
 
  return (
    <div className={cn("flex flex-col gap-6 max-w-[400px]", className)} {...props}>
      onboarded!
    </div>
  );
}
