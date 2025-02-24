import { ManagerTopNav } from "./_components/ManagerTopNav";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <div className="  mx-auto p-4">
        <ManagerTopNav />
        {children}
      </div>
    </main>
  );
}
