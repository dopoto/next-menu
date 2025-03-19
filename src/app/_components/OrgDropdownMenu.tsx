"use client";

import React from "react";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";

export function OrgDropdownMenu() {
  const { organization } = useOrganization();
  const { openOrganizationProfile } = useClerk();
  const { user } = useUser();

  if (!user) return null;
  if (!organization) return null;

  return (
    <div
      className="mt-6 flex cursor-pointer gap-3 items-center"
      onClick={() => openOrganizationProfile()}
    >
      <Image
        alt={organization.name}
        src={organization.imageUrl}
        width={32}
        height={32}
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold" title={organization.name}>
          {organization.name}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto size-4" />
    </div>
  );
}
