// 'use client';

// import { useClerk, useOrganization, useUser } from '@clerk/nextjs';
// import { ChevronsUpDown } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { priceTiers, type PriceTierId } from '~/app/_domain/price-tiers';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '~/components/ui/dropdown-menu';
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';
// import { ROUTES } from '~/lib/routes';

// export function SidebarOrganizationManager() {
//     const { organization } = useOrganization();
//     const { openOrganizationProfile } = useClerk();
//     const { user } = useUser();

//     if (!user) return null;
//     if (!organization) return null;

//     const priceTierId: PriceTierId = user.publicMetadata.tier as PriceTierId;
//     const tier = priceTiers[priceTierId];

//     return (
//         <SidebarMenu>
//             <SidebarMenuItem>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <SidebarMenuButton
//                             size="lg"
//                             className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
//                         >
//                             <Image alt={organization.name} src={organization.imageUrl} width={32} height={32} />
//                             <div className="grid flex-1 text-left text-sm leading-tight">
//                                 <span className="truncate font-semibold" title={organization.name}>
//                                     {organization.name}
//                                 </span>
//                                 <span className="text-xs">{tier.name} plan</span>
//                             </div>
//                             <ChevronsUpDown className="ml-auto size-4" />
//                         </SidebarMenuButton>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="start" className="w-[200px]">
//                         <DropdownMenuGroup>
//                             <DropdownMenuLabel>Your organization</DropdownMenuLabel>
//                             <DropdownMenuItem onClick={() => openOrganizationProfile()}>
//                                 Manage organization
//                             </DropdownMenuItem>
//                         </DropdownMenuGroup>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuGroup>
//                             <DropdownMenuLabel>Your plan</DropdownMenuLabel>
//                             <Link href={ROUTES.viewPlan}>
//                                 <DropdownMenuItem>View plan details</DropdownMenuItem>
//                             </Link>
//                             <Link href={ROUTES.changePlan}>
//                                 <DropdownMenuItem>Change your plan</DropdownMenuItem>
//                             </Link>
//                         </DropdownMenuGroup>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </SidebarMenuItem>
//         </SidebarMenu>
//     );
// }
