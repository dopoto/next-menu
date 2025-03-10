"use client";

import { useClerk, UserButton, useUser } from "@clerk/nextjs";
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
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { TierPill } from "~/app/_components/TierPill";
import { type PriceTierId } from "~/app/_domain/price-tiers";

export function SidebarUserManager() {
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();

  // TODO const { organization } = useOrganization();

  if (!user) return null;
  const priceTierId: PriceTierId = user.publicMetadata.tier as PriceTierId;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <UserButton />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.fullName}</span>
                <span className="truncate text-xs">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem>
              <Link href="/change-plan">Change plan</Link>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem onClick={() => openUserProfile()}>
              Manage account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
