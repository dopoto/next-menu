import { FrownIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { ErrorTypeId, errorTypes } from "../_domain/errors";

export function BoxError(props: {
  // title: string;
  // description: string;
  // ctas?: ReactNode[];
  // errorId?: string;
  errorTypeId: ErrorTypeId
}) {

  const error = errorTypes[props.errorTypeId]
const errorId = '123';

  return (
    <div className="shadow" role="alert">
      <div className="flex">
        <div className="w-16 bg-red-500 p-2 text-center">
          <div className="flex h-full items-center justify-center">
            <FrownIcon strokeWidth={2} className="size-8 stroke-white" />
          </div>
        </div>
        <div className="w-full border-r-4 border-red-400 bg-white p-4 dark:bg-gray-800">
          <div>
            <p className="font-bold text-gray-600 dark:text-white">
              {error.userFriendlyTitle}
            </p>
            <p className="text-sm text-gray-600 dark:text-white">
              {error.userFriendlyDescription}
            </p>
            {error.ctas && (
              <div className="mt-2 flex space-x-2 pt-4">
                {error.ctas?.map((cta, index) => <div key={index}>{cta}</div>)}
              </div>
            )}
            {(errorId.length ?? 0) > 0 && <Collapsible className="pt-4">
                <CollapsibleTrigger asChild>
                <button className="text-blue-500 underline cursor-pointer">
                  Get help with this error
                </button>
                </CollapsibleTrigger>
              <CollapsibleContent>
                TODO
              </CollapsibleContent>
            </Collapsible>}
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO 'Get help with this error'
