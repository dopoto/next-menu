 

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <div className="  mx-auto p-4">
        
        {children}
      </div>
    </main>
  );
}
