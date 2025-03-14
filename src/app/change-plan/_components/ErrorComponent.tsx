'use client';

import { BoxError } from "~/app/_components/BoxError";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";

export default function ErrorComponent({
  error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <SplitScreenContainer
      title="Could not update your subscription"
      subtitle="An error occurred while processing the update."
      mainComponent={<BoxError errorTypeId="CHANGE_PLAN_ERROR" context={{ message: error.message }} />}
    />
  );
}