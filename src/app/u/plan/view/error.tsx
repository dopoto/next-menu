"use client"; // Error boundaries must be Client Components

import { ErrorCard } from "~/app/_components/ErrorCard";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type PublicError } from "~/domain/error-handling";

export default function ViewPlanError({
  error,
  reset,
}: {
  error: PublicError;
  reset: () => void;
}) {
  return (
    <SplitScreenContainer
      title={`View plan`}
      subtitle="Sorry, could not complete this operation..."
      mainComponent={
        <ErrorCard
          publicErrorMessage={error.digest}
          errorDigest={error.digest}
          onReset={reset}
        />
      }
    />
  );
}
