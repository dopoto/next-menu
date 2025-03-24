export default function LoadingSection() {
  return (
    <div className="animate-in fade-in-50 flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground mt-2 mb-4 text-sm italic">
          Loading...
        </p>
      </div>
    </div>
  );
}
