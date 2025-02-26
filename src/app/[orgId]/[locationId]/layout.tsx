 
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { LocationSidebar } from "./_components/LocationSidebar";

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
      <LocationSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
