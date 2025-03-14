 
import { CloudAlert } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";

export function CardWarning(props: {
  title: string;
  description: string;
  cta: ReactNode
}) {
 

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center gap-2">
      <CloudAlert size="36" className="  text-amber-700"/>
        <h3 className=" text-lg font-semibold text-amber-700">{props.title}</h3>
        <p className="mb-4   text-sm text-muted-foreground">{props.description}</p>        
        <Button className="w-full" variant="secondary" asChild>
          {/* <Link href={"/change-plan"}>Upgrade</Link>*/}
          {props.cta}
        </Button>
      </div>
    </div>
  );
}
