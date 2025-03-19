"use client";

import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import { priceTiers, type PriceTierId } from "~/app/_domain/price-tiers";

export function SidebarOrganizationManager() {
  const { organization } = useOrganization();
  const { openOrganizationProfile } = useClerk();
  const { user } = useUser();

  if (!user) return null;
  if (!organization) return null;

  const priceTierId: PriceTierId = user.publicMetadata.tier as PriceTierId;
  const tier = priceTiers[priceTierId];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Image
                alt={organization.name}
                src={organization.imageUrl}
                width={32}
                height={32}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold truncate" title={organization.name}>{organization.name}</span>
                <span className="text-xs">{tier.name} plan</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => openOrganizationProfile()}>
              Manage organization
            </DropdownMenuItem>
            <Link href="/change-plan">
              <DropdownMenuItem>Change plan</DropdownMenuItem>
            </Link>
            <Link href="/view-plan">
              <DropdownMenuItem>View plan usage</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
