import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";

export function EmptyState(props: {
  icon?: ReactNode;
  title: string;
  secondary: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <div className="animate-in fade-in-50 flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {props.icon}
        <h3 className="mt-4 text-lg font-semibold">{props.title}</h3>
        <p className="text-muted-foreground mt-2 mb-4 text-sm">
          {props.secondary}
        </p>
        {props.cta && props.ctaHref && (
          <Button asChild>
            <Link href={props.ctaHref}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {props.cta}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
