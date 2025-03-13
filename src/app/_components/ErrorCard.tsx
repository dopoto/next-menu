import { ChevronRight, ChevronsRight, CloudAlert, FrownIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import { errorTypes, type ErrorTypeId } from "../_domain/errors";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function ErrorCard(props: {
  title: string;
  errorTypeId: ErrorTypeId;
  errorDigest?: string;
  errorClientSideId: string;
}) {
  const ctas = errorTypes[props.errorTypeId]?.ctas ?? [];

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border-1 border-dashed border-red-300 bg-red-50/20 p-4 text-xs">
      <div className="flex flex-col justify-center gap-1">
        <div className="flex justify-center">
          <CloudAlert strokeWidth={2} className="size-8 stroke-red-500" />
        </div>
        <div className="text-center text-sm text-red-500 uppercase">
          {props.title}
        </div>
      </div>
      <div className="text-sm font-semibold">Error details</div>
      <div className="text-xs">Type: {props.errorTypeId}</div>
      <div className="text-xs">Digest: {props.errorDigest ?? "--"}</div>
      <div className="text-xs">Id: {props.errorClientSideId}</div>

      <div className="text-sm font-semibold">What can I try next?</div>
      {ctas.map((cta) => (
        <Link href={cta.href} key={cta.href} className="cursor-pointer   text-blue-500 underline">
           <div className="flex flex-row items-center gap-1">
            <ChevronsRight size={12}/>
            {cta.text}
            </div>
        </Link>
      ))}
      <div className="text-sm font-semibold">Additional info</div>
      <div className="text-gray-500">
        {`The details of this error have been logged automatically and we have been notified 
        about it, so you don't need to report it.`}
      </div>
      <div className="text-sm font-semibold">
        Request support with this error
      </div>
      <div className="text-gray-500">
        {`If you want to send an inquiry about this issue to our customer support, please use the link below.`}
      </div>

      <Link href={"TODO mailto"} prefetch={false}  className="cursor-pointer py-4 text-blue-500 underline">
           <div className="flex flex-row items-center gap-1">
            <ChevronsRight size={12}/>
            Request support
            </div>
        </Link>
    </div>
  );
}
