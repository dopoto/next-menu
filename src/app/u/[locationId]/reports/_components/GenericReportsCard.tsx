import { CloudAlertIcon, CrownIcon } from "lucide-react";
import * as React from "react";
import { ROUTES } from "~/lib/routes";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardContent,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function GenericReportsCard(props: {
  isLocked: boolean;
  isError?: boolean;
  title: string;
  value: string | React.ReactNode;
  footer: string | React.ReactNode;
}) {
  return (
    <Card className="@container/card relative max-w-[300px]">
      <CardHeader className="relative">
        <CardDescription className="text-xl font-light">
          {props.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[35px] space-y-4">
        {props.isLocked ? (
          <>
            <div className="pointer-events-none space-y-2 text-3xl opacity-60 blur-[4px] filter select-none">
              {props.value}
            </div>

            <div className="bg-background/50 absolute inset-1 flex items-center justify-center backdrop-blur-[1px]">
              <div className="p-3 text-center">
                <CrownIcon className="mx-auto mb-2 h-8 w-8 text-amber-700" />
                <h3 className="mb-1 text-lg font-medium text-amber-700">
                  Not available in your plan
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  <a className="blue-link" href={ROUTES.changePlan}>
                    Change your plan
                  </a>{" "}
                  to unlock this widget.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-4xl tracking-tight">
            {props.isError ? (
              <Popover>
                <PopoverTrigger>
                  <CloudAlertIcon
                    strokeWidth={2}
                    className="size-12 cursor-pointer stroke-red-500"
                  />
                </PopoverTrigger>
                <PopoverContent className="text-red-500">
                  Could not fetch data at this moment. Please try again later.
                </PopoverContent>
              </Popover>
            ) : (
              props.value
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        {props.footer}
      </CardFooter>
    </Card>
  );
}
