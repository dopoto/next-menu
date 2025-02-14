export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Manage Section</h1>
        {children}
      </div>
    </main>
  );
}
 