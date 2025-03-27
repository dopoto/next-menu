import { ChevronsRight, CloudAlert } from "lucide-react";
import { errorTypes, type ErrorTypeId } from "../_domain/errors";
import Link from "next/link";
import { APP_CONFIG } from "../_config/app-config";

export function ErrorCard(props: {
  title: string;
  errorTypeId: ErrorTypeId;
  errorDigest?: string;
  errorClientSideId: string;
}) {
  const ctas = errorTypes[props.errorTypeId]?.ctas ?? [];

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border-2 border-dashed border-red-300 p-4 text-xs">
      <div className="flex flex-col justify-center gap-1">
        <div className="flex justify-center">
          <CloudAlert strokeWidth={2} className="size-8 stroke-red-500" />
        </div>
        <div className="text-center text-sm font-semibold text-red-500 uppercase">
          {props.title}
        </div>
      </div>
      <div className="text-sm font-semibold">Error details</div>
      <div className="text-xs">Type: {props.errorTypeId}</div>
      <div className="text-xs">Digest: {props.errorDigest ?? "--"}</div>
      <div className="text-xs">Id: {props.errorClientSideId}</div>

      {ctas?.length > 0 && (
        <div className="text-sm font-semibold">What can I try next?</div>
      )}
      {ctas.map((cta) => (
        <Link href={cta.href} key={cta.href} className="blue-link">
          <div className="flex flex-row items-center gap-1">
            <ChevronsRight size={12} />
            {cta.text}
          </div>
        </Link>
      ))}
      <div className="text-sm font-semibold">Additional info</div>
      <div>
        {`The details of this error have been logged automatically and we have been notified 
        about it, so you don't need to report it.`}
      </div>
      <div className="text-sm font-semibold">
        Request support with this error
      </div>
      <div>
        {`If you want to send an inquiry about this issue to our customer support, please use the link below.`}
      </div>

      <Link
        href={`mailto: ${APP_CONFIG.supportEmail}?subject=Support Request - error ${props.errorClientSideId}&body=%0D%0A------------%0D%0APlease do not write below this line%0D%0AError ${props.errorClientSideId}`}
        prefetch={false}
        className="cursor-pointer py-1 text-blue-500 underline"
      >
        <div className="flex flex-row items-center gap-1 font-bold">
          <ChevronsRight size={12} />
          Request support
        </div>
      </Link>
    </div>
  );
}
