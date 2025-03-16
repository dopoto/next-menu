import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { LocationSidebar } from "./_components/LocationSidebar";
import { ThemeSwitch } from "~/app/_components/ThemeSwitch";
import { Separator } from "~/components/ui/separator";
import { PageBreadcrumb } from "./_components/PageBreadcrumb";
import { getAppVersion } from "../_utils/app-version-utils";
import Link from "next/link";
import { House, MessageCircleQuestion } from "lucide-react";

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
            <PageBreadcrumb />
          </div>
          <div className="ml-auto px-4">
            <ThemeSwitch />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        <footer className="flex gap-4 p-4 pt-0 text-xs">
          <div className="my-auto">
            <i>the</i>
            <span className="text-gray-600">Menu</span> v{getAppVersion()}
          </div>
          <div className="flex align-middle ml-auto gap-2">
            <Link className="flex gap-0.5 align-middle" href="/">
              <House size={14} /> Home
            </Link>
            <Separator orientation="vertical" />
            {/* TODO */}
            <Link className="flex gap-0.5 align-middle" href="/">
              <MessageCircleQuestion size={14} /> Support
            </Link>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
