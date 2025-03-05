import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function EmptyState(props: {
  title: string;
  secondary: string;
  cta: string;
  ctaHref: string;
}) {
 

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">{props.title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{props.secondary}</p>
        <Button asChild>
          <Link href={props.ctaHref}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {props.cta}
          </Link>
        </Button>
      </div>
    </div>
  );
}
