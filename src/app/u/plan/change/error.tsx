"use client"; // Error boundaries must be Client Components

import { ErrorCard } from "~/app/_components/ErrorCard";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { PublicErrorMessage } from "~/lib/error-utils.server";

export default function ChangePlanError({
  error,
  reset,
}: {
  error: Error & { message: PublicErrorMessage; digest?: string };
  reset: () => void;
}) {
  return (
    <SplitScreenContainer
      title={`Change plan`}
      subtitle="Sorry, could not complete this operation..."
      mainComponent={
        <ErrorCard
          publicErrorMessage={error.message}
          errorDigest={error.digest}
          onReset={reset}
        />
      }
    />
  );
}
