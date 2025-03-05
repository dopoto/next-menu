import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { LocationSidebar } from "./_components/LocationSidebar";
import { ThemeSwitch } from "~/app/_components/ThemeSwitch";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { HomeIcon } from "lucide-react";
import { PageBreadcrumb } from "./_components/PageBreadcrumb";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO Revisit
  //   if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
  //     redirect("/onboarded");
  //   }

  return (
    <SidebarProvider>
      <LocationSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4!" />
            <PageBreadcrumb/>
          </div>
          <div className="ml-auto px-4">
            <ThemeSwitch />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
