"use client";

import * as React from "react";
import { PublicTopNav } from "../_components/PublicTopNav";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function OnboardedPage() {
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center">
      <PublicTopNav>
        <div className="ml-auto">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </PublicTopNav>
      <h1>Welcome</h1>
      <p>You are now onboarded</p>
    </div>
  );
}
