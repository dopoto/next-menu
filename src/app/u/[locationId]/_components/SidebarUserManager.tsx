// 'use client';

// import { useClerk, UserButton, useUser } from '@clerk/nextjs';
// import { ChevronsUpDown } from 'lucide-react';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '~/components/ui/dropdown-menu';
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';

// export function SidebarUserManager() {
//     const { openUserProfile, signOut } = useClerk();
//     const { user } = useUser();
//     if (!user) return null;

//     return (
//         <SidebarMenu>
//             <SidebarMenuItem>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <SidebarMenuButton
//                             size="lg"
//                             className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
//                         >
//                             <UserButton
//                                 appearance={{
//                                     elements: {
//                                         userButtonAvatarBox: {
//                                             width: '32px',
//                                             height: '32px',
//                                         },
//                                     },
//                                 }}
//                             />
//                             <div className="grid flex-1 text-left text-sm leading-tight">
//                                 <span className="truncate font-semibold">{user.fullName}</span>
//                                 <span className="truncate text-xs">{user.primaryEmailAddress?.emailAddress}</span>
//                             </div>
//                             <ChevronsUpDown className="ml-auto size-4" />
//                         </SidebarMenuButton>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="start" className="w-[200px]">
//                         <DropdownMenuItem onClick={() => openUserProfile()}>Manage account</DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </SidebarMenuItem>
//         </SidebarMenu>
//     );
// }
