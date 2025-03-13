"use client"; // Error boundaries must be Client Components

import { BoxError } from "~/app/_components/BoxError";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { Button } from "~/components/ui/button";

export default function DowngradeError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const message = error instanceof Error ? error.message : String(error);
  const context: Record<string, string> = {
    message,
    tag: "downgrade",
  };
  return (
    <SplitScreenContainer
      title={`Error`}
      subtitle="Sorry, could not change your plan due to an error."
      mainComponent={
        <BoxError
          errorTypeId={"CHANGE_PLAN_ERROR"}
          context={context}
          dynamicCtas={[
            <Button key="retry" variant="outline" onClick={reset}>
              Reload
            </Button>,
          ]}
        />
      }
    />
  );
}
