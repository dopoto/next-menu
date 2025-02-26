import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { LocationSidebar } from "./_components/LocationSidebar";
import { ThemeSwitch } from "~/app/_components/ThemeSwitch";

export default async function MyLayout({
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
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <LocationSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
